// Main Bloons TD 4 Game Engine

class BTD4Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Responsive internal canvas dimensions (16:9)
        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Game state
        this.currentMapId = 'monkey_lane';
        this.gameMap = new GameMap(MAP_DEFINITIONS[this.currentMapId]);
        this.spawner = new WaveSpawner();

        this.lives = 150;
        this.cash = 650;
        this.round = 1;
        this.speed = 1; // 1, 2, 4
        this.isPaused = false;
        this.autoStart = false;
        this.roundInProgress = false;
        this.gameOver = false;
        this.victory = false;

        this.towers = [];
        this.bloons = [];
        this.projectiles = [];
        this.trackItems = [];
        this.droppedBananas = [];
        this.particles = [];

        this.stats = {
            totalPops: 0,
            cashEarned: 650
        };

        // Selection & Placement
        this.selectedTower = null;
        this.placingType = null;
        this.isPlacingTrackItem = false;
        this.mouse = { x: 0, y: 0, inside: false };

        // Bind events
        this.setupEventListeners();
        this.setupUI();

        // Game loop timing
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    setMap(mapId) {
        if (!MAP_DEFINITIONS[mapId]) return;
        this.currentMapId = mapId;
        this.gameMap = new GameMap(MAP_DEFINITIONS[mapId]);
        this.resetGame();
        this.updateUI();
    }

    resetGame() {
        this.lives = 150;
        this.cash = 650;
        this.round = 1;
        this.speed = 1;
        this.isPaused = false;
        this.roundInProgress = false;
        this.gameOver = false;
        this.victory = false;

        this.towers = [];
        this.bloons = [];
        this.projectiles = [];
        this.trackItems = [];
        this.droppedBananas = [];
        this.particles = [];
        this.selectedTower = null;
        this.placingType = null;

        this.stats.totalPops = 0;
        this.stats.cashEarned = 650;

        document.getElementById('gameOverModal').classList.add('hidden');
        document.getElementById('victoryModal').classList.add('hidden');
        this.updateUI();
    }

    addCash(amount) {
        this.cash += amount;
        this.stats.cashEarned += amount;
        this.updateUI();
    }

    spendCash(amount) {
        if (this.cash >= amount) {
            this.cash -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }

    loseLives(amount) {
        this.lives = Math.max(0, this.lives - amount);
        window.soundEngine.playLifeLost();
        this.updateUI();

        if (this.lives <= 0 && !this.gameOver) {
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.gameOver = true;
        this.roundInProgress = false;
        document.getElementById('finalRound').textContent = this.round;
        document.getElementById('finalPops').textContent = this.stats.totalPops;
        document.getElementById('gameOverModal').classList.remove('hidden');
    }

    triggerVictory() {
        this.victory = true;
        document.getElementById('victoryModal').classList.remove('hidden');
    }

    startRound() {
        if (this.roundInProgress || this.gameOver) return;
        window.soundEngine.init();
        window.soundEngine.playRoundStart();
        this.roundInProgress = true;
        this.spawner.startRound(this.round);
        this.updateUI();
    }

    onRoundComplete() {
        this.roundInProgress = false;
        window.soundEngine.playCoin();

        // Round reward cash ($100 + round)
        const roundReward = 100 + this.round;
        this.addCash(roundReward);
        this.spawnFloatingText(`Round Complete! +$${roundReward}`, this.width / 2, 80, '#32cd32');

        // Check for round 50 standard victory
        if (this.round === 50 && !this.victory) {
            this.triggerVictory();
        }

        this.round++;
        this.updateUI();

        // Auto-start next wave if enabled
        if (this.autoStart && !this.gameOver) {
            setTimeout(() => {
                if (this.autoStart && !this.roundInProgress && !this.gameOver) {
                    this.startRound();
                }
            }, 1200);
        }
    }

    toggleSpeed() {
        if (this.speed === 1) this.speed = 2;
        else if (this.speed === 2) this.speed = 4;
        else this.speed = 1;
        this.updateUI();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.updateUI();
    }

    toggleAutoStart() {
        this.autoStart = !this.autoStart;
        if (this.autoStart && !this.roundInProgress && !this.gameOver) {
            this.startRound();
        }
        this.updateUI();
    }

    spawnPopFX(x, y) {
        this.particles.push(new PopParticleFX(x, y));
    }

    spawnExplosionFX(x, y, radius) {
        this.particles.push(new ExplosionFX(x, y, radius));
    }

    spawnFloatingText(text, x, y, color = '#ffd700') {
        this.particles.push(new FloatingText(text, x, y, color));
    }

    // Input Events
    setupEventListeners() {
        const getCanvasCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.width / rect.width;
            const scaleY = this.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };

        this.canvas.addEventListener('mousemove', (e) => {
            const pos = getCanvasCoords(e);
            this.mouse.x = pos.x;
            this.mouse.y = pos.y;
            this.mouse.inside = true;

            // Hover collection for dropped bananas!
            for (const b of this.droppedBananas) {
                if (!b.markedForRemoval && Math.hypot(this.mouse.x - b.x, this.mouse.y - b.y) < 30) {
                    b.collect(this);
                }
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.inside = false;
        });

        this.canvas.addEventListener('click', (e) => {
            window.soundEngine.init();
            const pos = getCanvasCoords(e);
            this.handleCanvasClick(pos.x, pos.y);
        });

        // Keyboard hotkeys
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.roundInProgress) this.startRound();
                else this.toggleSpeed();
            } else if (e.code === 'Escape') {
                this.placingType = null;
                this.selectedTower = null;
                this.updateUI();
            } else if (e.code === 'Tab' && this.selectedTower) {
                e.preventDefault();
                this.cycleTargetPriority();
            } else if ((e.code === 'Delete' || e.code === 'Backspace') && this.selectedTower) {
                this.sellSelectedTower();
            }
        });
    }

    handleCanvasClick(x, y) {
        // 1. Placing a new tower or track item
        if (this.placingType) {
            const isTrackItem = (this.placingType === 'road_spikes' || this.placingType === 'pineapple');
            const def = isTrackItem ? null : TOWER_DEFINITIONS[this.placingType];
            const isWater = def ? !!def.isWater : false;
            const cost = isTrackItem ? (this.placingType === 'road_spikes' ? 30 : 25) : def.cost;

            // Check collision with other towers
            let collidesWithTower = false;
            if (!isTrackItem) {
                for (const t of this.towers) {
                    if (Math.hypot(x - t.x, y - t.y) < 38) {
                        collidesWithTower = true;
                        break;
                    }
                }
            }

            const valid = !collidesWithTower && this.gameMap.canPlaceTower(x, y, 22, isWater, isTrackItem);
            if (valid && this.spendCash(cost)) {
                window.soundEngine.playPlace();
                if (isTrackItem) {
                    this.trackItems.push(new TrackItem(this.placingType, x, y));
                } else {
                    const newTower = new Tower(this.placingType, x, y);
                    this.towers.push(newTower);
                    this.selectedTower = newTower;
                }
                this.placingType = null;
                this.updateUI();
            }
            return;
        }

        // 2. Click on Dropped Banana
        for (const b of this.droppedBananas) {
            if (!b.markedForRemoval && Math.hypot(x - b.x, y - b.y) < 25) {
                b.collect(this);
                return;
            }
        }

        // 3. Mortar target reticle repositioning
        if (this.selectedTower && this.selectedTower.typeId === 'mortar_monkey') {
            this.selectedTower.reticleX = x;
            this.selectedTower.reticleY = y;
            window.soundEngine.playDart();
            return;
        }

        // 4. Select tower under mouse
        let clickedTower = null;
        for (const t of this.towers) {
            if (Math.hypot(x - t.x, y - t.y) <= t.radius + 6) {
                clickedTower = t;
                break;
            }
        }

        this.selectedTower = clickedTower;
        this.updateUI();
    }

    cycleTargetPriority() {
        if (!this.selectedTower) return;
        const priorities = ['first', 'last', 'close', 'strong'];
        const idx = priorities.indexOf(this.selectedTower.targetPriority);
        this.selectedTower.targetPriority = priorities[(idx + 1) % priorities.length];
        this.updateUI();
    }

    sellSelectedTower() {
        if (!this.selectedTower) return;
        const sellVal = this.selectedTower.getSellValue();
        this.addCash(sellVal);
        window.soundEngine.playCoin();
        this.spawnFloatingText(`+$${sellVal}`, this.selectedTower.x, this.selectedTower.y, '#32cd32');
        this.towers = this.towers.filter(t => t !== this.selectedTower);
        this.selectedTower = null;
        this.updateUI();
    }

    // Game Update & Render Loop
    loop(timestamp) {
        const rawDt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap dt to prevent huge leaps if tab was inactive
        const dt = Math.min(rawDt, 0.1) * (this.isPaused ? 0 : this.speed);

        if (!this.isPaused && !this.gameOver) {
            this.update(dt);
        }
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        // 1. Spawner
        this.spawner.update(dt, this);

        // 2. Towers
        for (const t of this.towers) {
            t.update(dt, this);
        }

        // 3. Projectiles
        for (const p of this.projectiles) {
            p.update(dt, this);
        }
        this.projectiles = this.projectiles.filter(p => !p.markedForRemoval);

        // 4. Bloons
        for (let i = this.bloons.length - 1; i >= 0; i--) {
            const b = this.bloons[i];
            b.update(dt, this.gameMap);
            if (b.escaped) {
                // Bloon reached end of track! Lose lives
                let livesLost = b.def.tier;
                if (b.isBlimp) livesLost = (b.typeId === 'moab' ? 40 : 100);
                this.loseLives(livesLost);
            }
        }
        this.bloons = this.bloons.filter(b => !b.markedForRemoval);

        // 5. Track Items (Road Spikes, Pineapple)
        for (const item of this.trackItems) {
            item.update(dt, this);
        }
        this.trackItems = this.trackItems.filter(item => !item.markedForRemoval);

        // 6. Dropped Bananas
        for (const b of this.droppedBananas) {
            b.update(dt, this);
        }
        this.droppedBananas = this.droppedBananas.filter(b => !b.markedForRemoval);

        // 7. Particles
        for (const p of this.particles) {
            p.update(dt);
        }
        this.particles = this.particles.filter(p => !p.markedForRemoval);
    }

    render() {
        // Clear screen
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Render Map Background
        this.gameMap.render(this.ctx);

        // 2. Track Items (under towers/bloons)
        for (const item of this.trackItems) {
            item.render(this.ctx);
        }

        // 3. Dropped Bananas
        for (const b of this.droppedBananas) {
            b.render(this.ctx);
        }

        // 4. Towers
        for (const t of this.towers) {
            t.render(this.ctx, t === this.selectedTower);
        }

        // 5. Bloons
        for (const b of this.bloons) {
            b.render(this.ctx);
        }

        // 6. Projectiles
        for (const p of this.projectiles) {
            p.render(this.ctx);
        }

        // 7. Particles and Floating Text
        for (const p of this.particles) {
            p.render(this.ctx);
        }

        // 8. Tower Placement Preview under mouse
        if (this.placingType && this.mouse.inside) {
            this.renderPlacementPreview();
        }
    }

    renderPlacementPreview() {
        const x = this.mouse.x;
        const y = this.mouse.y;
        const isTrackItem = (this.placingType === 'road_spikes' || this.placingType === 'pineapple');
        const def = isTrackItem ? null : TOWER_DEFINITIONS[this.placingType];
        const range = isTrackItem ? 25 : def.range;
        const isWater = def ? !!def.isWater : false;

        let collides = false;
        if (!isTrackItem) {
            for (const t of this.towers) {
                if (Math.hypot(x - t.x, y - t.y) < 38) {
                    collides = true;
                    break;
                }
            }
        }
        const valid = !collides && this.gameMap.canPlaceTower(x, y, 22, isWater, isTrackItem);

        // Draw range circle
        this.ctx.fillStyle = valid ? 'rgba(76, 217, 100, 0.22)' : 'rgba(255, 59, 48, 0.25)';
        this.ctx.strokeStyle = valid ? 'rgba(76, 217, 100, 0.8)' : 'rgba(255, 59, 48, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, range, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw tower sprite silhouette
        const spriteKey = isTrackItem ? this.placingType : def.sprite;
        const img = isTrackItem ? projImageCache[spriteKey] : towerImageCache[spriteKey];
        if (img && img.complete) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.75;
            this.ctx.drawImage(img, x - 24, y - 24, 48, 48);
            this.ctx.restore();
        }
    }

    // UI setup and bindings
    setupUI() {
        // Tower Shop buttons
        const shopContainer = document.getElementById('towerShopList');
        shopContainer.innerHTML = '';

        for (const [id, def] of Object.entries(TOWER_DEFINITIONS)) {
            const card = document.createElement('div');
            card.className = 'tower-card';
            card.id = `shop-${id}`;
            card.innerHTML = `
                <img src="${TOWER_SPRITES[def.sprite]}" class="tower-thumb" alt="${def.name}">
                <div class="tower-info">
                    <span class="tower-name">${def.name}</span>
                    <span class="tower-cost">$${def.cost}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                if (this.cash >= def.cost) {
                    this.placingType = (this.placingType === id) ? null : id;
                    this.selectedTower = null;
                    this.updateUI();
                }
            });
            shopContainer.appendChild(card);
        }

        // Road Items
        document.getElementById('shop-road-spikes').addEventListener('click', () => {
            if (this.cash >= 30) {
                this.placingType = (this.placingType === 'road_spikes') ? null : 'road_spikes';
                this.selectedTower = null;
                this.updateUI();
            }
        });
        document.getElementById('shop-pineapple').addEventListener('click', () => {
            if (this.cash >= 25) {
                this.placingType = (this.placingType === 'pineapple') ? null : 'pineapple';
                this.selectedTower = null;
                this.updateUI();
            }
        });

        // Top Control Buttons
        document.getElementById('btnStartRound').addEventListener('click', () => this.startRound());
        document.getElementById('btnSpeed').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('btnAutoStart').addEventListener('click', () => this.toggleAutoStart());
        document.getElementById('btnPause').addEventListener('click', () => this.togglePause());

        // Audio controls
        document.getElementById('btnSound').addEventListener('click', () => {
            const on = window.soundEngine.toggleSound();
            document.getElementById('soundIcon').src = on ? 'assets/ui/sound_on.png' : 'assets/ui/sound_off.png';
        });

        // Upgrade and Sell buttons in inspector
        document.getElementById('btnUpgrade1').addEventListener('click', () => {
            if (this.selectedTower) {
                const up = this.selectedTower.getNextUpgrade(1);
                if (up && this.spendCash(up.cost)) {
                    this.selectedTower.upgrade(1);
                    window.soundEngine.playUpgrade();
                    this.updateUI();
                }
            }
        });

        document.getElementById('btnUpgrade2').addEventListener('click', () => {
            if (this.selectedTower) {
                const up = this.selectedTower.getNextUpgrade(2);
                if (up && this.spendCash(up.cost)) {
                    this.selectedTower.upgrade(2);
                    window.soundEngine.playUpgrade();
                    this.updateUI();
                }
            }
        });

        document.getElementById('btnSell').addEventListener('click', () => this.sellSelectedTower());
        document.getElementById('targetPrioritySelect').addEventListener('change', (e) => {
            if (this.selectedTower) {
                this.selectedTower.targetPriority = e.target.value;
            }
        });

        // Map Selection Modal
        document.getElementById('btnSelectMap').addEventListener('click', () => {
            document.getElementById('mapSelectModal').classList.remove('hidden');
        });
        document.querySelectorAll('.map-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mapId = btn.dataset.map;
                this.setMap(mapId);
                document.getElementById('mapSelectModal').classList.add('hidden');
            });
        });
        document.getElementById('btnCloseMapModal').addEventListener('click', () => {
            document.getElementById('mapSelectModal').classList.add('hidden');
        });

        // Game Over & Victory restart
        document.getElementById('btnRestart').addEventListener('click', () => this.resetGame());
        document.getElementById('btnFreeplay').addEventListener('click', () => {
            document.getElementById('victoryModal').classList.add('hidden');
        });

        this.updateUI();
    }

    updateUI() {
        // Header Counters
        document.getElementById('livesVal').textContent = this.lives;
        document.getElementById('cashVal').textContent = `$${this.cash.toLocaleString()}`;
        document.getElementById('roundVal').textContent = `${this.round}`;

        // Top button states
        const btnStart = document.getElementById('btnStartRound');
        btnStart.disabled = this.roundInProgress || this.gameOver;
        btnStart.textContent = this.roundInProgress ? 'IN PROGRESS' : (this.round === 1 ? 'GO!' : 'NEXT ROUND');

        const btnSpeed = document.getElementById('btnSpeed');
        btnSpeed.textContent = `${this.speed}x SPEED`;

        const btnAuto = document.getElementById('btnAutoStart');
        btnAuto.className = this.autoStart ? 'ctrl-btn active' : 'ctrl-btn';

        const btnPause = document.getElementById('btnPause');
        btnPause.textContent = this.isPaused ? 'RESUME' : 'PAUSE';

        // Update Shop Affordability
        for (const [id, def] of Object.entries(TOWER_DEFINITIONS)) {
            const card = document.getElementById(`shop-${id}`);
            if (card) {
                if (this.cash < def.cost) card.classList.add('disabled');
                else card.classList.remove('disabled');

                if (this.placingType === id) card.classList.add('selected');
                else card.classList.remove('selected');
            }
        }

        const spikeCard = document.getElementById('shop-road-spikes');
        if (spikeCard) {
            if (this.cash < 30) spikeCard.classList.add('disabled');
            else spikeCard.classList.remove('disabled');
            if (this.placingType === 'road_spikes') spikeCard.classList.add('selected');
            else spikeCard.classList.remove('selected');
        }

        const pineCard = document.getElementById('shop-pineapple');
        if (pineCard) {
            if (this.cash < 25) pineCard.classList.add('disabled');
            else pineCard.classList.remove('disabled');
            if (this.placingType === 'pineapple') pineCard.classList.add('selected');
            else pineCard.classList.remove('selected');
        }

        // Update Selected Tower Panel
        const inspector = document.getElementById('towerInspector');
        if (this.selectedTower) {
            inspector.classList.remove('hidden');
            const t = this.selectedTower;
            document.getElementById('inspectorName').textContent = t.name;
            document.getElementById('inspectorPops').textContent = `Pops: ${t.pops}`;
            document.getElementById('inspectorImg').src = TOWER_SPRITES[t.sprite];
            document.getElementById('targetPrioritySelect').value = t.targetPriority;

            // Upgrade Path 1
            const up1 = t.getNextUpgrade(1);
            const btnUp1 = document.getElementById('btnUpgrade1');
            if (up1) {
                btnUp1.disabled = (this.cash < up1.cost);
                document.getElementById('up1Name').textContent = up1.name;
                document.getElementById('up1Cost').textContent = `$${up1.cost}`;
                document.getElementById('up1Desc').textContent = up1.desc;
            } else {
                btnUp1.disabled = true;
                document.getElementById('up1Name').textContent = 'Path 1 Maxed';
                document.getElementById('up1Cost').textContent = '--';
                document.getElementById('up1Desc').textContent = 'No further upgrades available.';
            }

            // Upgrade Path 2
            const up2 = t.getNextUpgrade(2);
            const btnUp2 = document.getElementById('btnUpgrade2');
            if (up2) {
                btnUp2.disabled = (this.cash < up2.cost);
                document.getElementById('up2Name').textContent = up2.name;
                document.getElementById('up2Cost').textContent = `$${up2.cost}`;
                document.getElementById('up2Desc').textContent = up2.desc;
            } else {
                btnUp2.disabled = true;
                document.getElementById('up2Name').textContent = 'Path 2 Maxed';
                document.getElementById('up2Cost').textContent = '--';
                document.getElementById('up2Desc').textContent = 'No further upgrades available.';
            }

            // Sell Button
            document.getElementById('btnSell').textContent = `SELL FOR $${t.getSellValue()}`;
        } else {
            inspector.classList.add('hidden');
        }
    }
}

// Boot game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new BTD4Game();
});
