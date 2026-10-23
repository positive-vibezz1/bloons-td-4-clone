// --- 7. Main Game Controller ---
class BTD4Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.currentMapId = 'monkey_lane';
        this.gameMap = new GameMap(MAP_DEFINITIONS[this.currentMapId]);
        this.spawner = new WaveSpawner();

        this.lives = 150;
        this.cash = 650;
        this.round = 1;
        this.speed = 1;
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

        this.selectedTower = null;
        this.placingType = null;
        this.mouse = { x: 480, y: 270, inside: false };

        this.setupEventListeners();
        this.setupUI();

        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    setMap(mapId) {
        if (!MAP_DEFINITIONS[mapId]) return;
        this.currentMapId = mapId;
        this.gameMap = new GameMap(MAP_DEFINITIONS[mapId]);
        this.resetGame();
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
        this.spawner = new WaveSpawner();

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
        for (const t of this.towers) {
            if (t.typeId === 'banana_farm') {
                t.bananasSpawnedThisRound = 0;
                t.cooldown = 1.5;
            }
        }
        this.spawner.startRound(this.round);
        this.updateUI();
    }

    onRoundComplete() {
        this.roundInProgress = false;
        window.soundEngine.playCoin();

        let bankTotal = 0;
        for (const t of this.towers) {
            if (t.typeId === 'banana_farm' && t.bankBonus > 0) {
                bankTotal += t.bankBonus;
                this.spawnFloatingText(`+$${t.bankBonus} Bank`, t.x, t.y - 18, '#ffd700');
            }
        }

        const roundReward = 100 + this.round + bankTotal;
        this.addCash(roundReward);
        this.spawnFloatingText(`Round Complete! +$${100 + this.round}`, this.width / 2, 80, '#32cd32');

        if (this.round === 50 && !this.victory) {
            this.triggerVictory();
        }

        this.round++;
        this.updateUI();

        if (this.autoStart && !this.gameOver) {
            setTimeout(() => {
                if (this.autoStart && !this.roundInProgress && !this.gameOver) {
                    this.startRound();
                }
            }, 1000);
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

    setupEventListeners() {
        const getCanvasCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.width / rect.width;
            const scaleY = this.height / rect.height;
            return {
                x: Math.max(0, Math.min(this.width, (e.clientX - rect.left) * scaleX)),
                y: Math.max(0, Math.min(this.height, (e.clientY - rect.top) * scaleY))
            };
        };

        this.canvas.addEventListener('mousemove', (e) => {
            const pos = getCanvasCoords(e);
            this.mouse.x = pos.x;
            this.mouse.y = pos.y;
            this.mouse.inside = true;

            for (const b of this.droppedBananas) {
                if (!b.markedForRemoval && Math.hypot(this.mouse.x - b.x, this.mouse.y - b.y) < 30) {
                    b.collect(this);
                }
            }
        });

        this.canvas.addEventListener('mouseenter', () => {
            this.mouse.inside = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.inside = false;
        });

        this.canvas.addEventListener('click', (e) => {
            window.soundEngine.init();
            const pos = getCanvasCoords(e);
            this.handleCanvasClick(pos.x, pos.y);
        });

        // Right click to cancel placement
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.placingType = null;
            this.selectedTower = null;
            this.updateUI();
        });

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
        // 1. Placing tower / track item
        if (this.placingType) {
            const isTrackItem = (this.placingType === 'road_spikes' || this.placingType === 'pineapple');
            const def = isTrackItem ? null : TOWER_DEFINITIONS[this.placingType];
            const isWater = def ? !!def.isWater : false;
            const cost = isTrackItem ? (this.placingType === 'road_spikes' ? 30 : 25) : def.cost;

            let collidesWithTower = false;
            if (!isTrackItem) {
                for (const t of this.towers) {
                    if (Math.hypot(x - t.x, y - t.y) < 36) {
                        collidesWithTower = true;
                        break;
                    }
                }
            }

            const check = this.gameMap.canPlaceTower(x, y, 20, isWater, isTrackItem);
            if (collidesWithTower) {
                this.spawnFloatingText("Too close to other tower!", x, y - 20, '#ff3b30');
                return;
            }
            if (!check.valid) {
                this.spawnFloatingText(check.reason, x, y - 20, '#ff3b30');
                return;
            }

            if (this.spendCash(cost)) {
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

        // 3. Select tower under click (checked before Mortar reticle so players can click other towers)
        let clickedTower = null;
        for (const t of this.towers) {
            if (Math.hypot(x - t.x, y - t.y) <= t.radius + 8) {
                clickedTower = t;
                break;
            }
        }
        if (clickedTower) {
            this.selectedTower = clickedTower;
            this.updateUI();
            return;
        }

        // 4. Mortar target reticle repositioning when clicking non-tower space
        if (this.selectedTower && this.selectedTower.typeId === 'mortar_monkey') {
            this.selectedTower.reticleX = x;
            this.selectedTower.reticleY = y;
            window.soundEngine.playDart();
            return;
        }

        this.selectedTower = null;
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

    loop(timestamp) {
        const rawDt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        const dt = Math.min(rawDt, 0.1) * (this.isPaused ? 0 : this.speed);

        if (!this.isPaused && !this.gameOver) {
            this.update(dt);
        }
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.spawner.update(dt, this);

        for (const t of this.towers) t.update(dt, this);

        for (const p of this.projectiles) p.update(dt, this);
        this.projectiles = this.projectiles.filter(p => !p.markedForRemoval);

        for (let i = this.bloons.length - 1; i >= 0; i--) {
            const b = this.bloons[i];
            b.update(dt, this.gameMap, this);
            if (b.escaped) {
                let livesLost = b.def.tier;
                if (b.isBlimp) livesLost = (b.typeId === 'moab' ? 40 : 100);
                this.loseLives(livesLost);
            }
        }
        this.bloons = this.bloons.filter(b => !b.markedForRemoval);

        for (const item of this.trackItems) item.update(dt, this);
        this.trackItems = this.trackItems.filter(item => !item.markedForRemoval);

        for (const b of this.droppedBananas) b.update(dt, this);
        this.droppedBananas = this.droppedBananas.filter(b => !b.markedForRemoval);

        for (const p of this.particles) p.update(dt);
        this.particles = this.particles.filter(p => !p.markedForRemoval);
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.gameMap.render(this.ctx);

        for (const item of this.trackItems) item.render(this.ctx);

        for (const b of this.droppedBananas) b.render(this.ctx);

        for (const t of this.towers) t.render(this.ctx, t === this.selectedTower);

        for (const b of this.bloons) b.render(this.ctx);

        for (const p of this.projectiles) p.render(this.ctx);

        for (const p of this.particles) p.render(this.ctx);

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
                if (Math.hypot(x - t.x, y - t.y) < 36) {
                    collides = true;
                    break;
                }
            }
        }
        const check = this.gameMap.canPlaceTower(x, y, 20, isWater, isTrackItem);
        const valid = !collides && check.valid;

        this.ctx.fillStyle = valid ? 'rgba(76, 217, 100, 0.22)' : 'rgba(255, 59, 48, 0.28)';
        this.ctx.strokeStyle = valid ? 'rgba(76, 217, 100, 0.85)' : 'rgba(255, 59, 48, 0.85)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, range, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        const spriteKey = isTrackItem ? this.placingType : def.sprite;
        const img = isTrackItem ? projImageCache[spriteKey] : towerImageCache[spriteKey];
        if (img && img.complete) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(img, x - 24, y - 24, 48, 48);
            this.ctx.restore();
        }
    }

    setupUI() {
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
                } else {
                    this.spawnFloatingText("Not enough cash!", 480, 50, '#ff3b30');
                }
            });
            shopContainer.appendChild(card);
        }

        document.getElementById('shop-road-spikes').addEventListener('click', () => {
            if (this.cash >= 30) {
                this.placingType = (this.placingType === 'road_spikes') ? null : 'road_spikes';
                this.selectedTower = null;
                this.updateUI();
            } else {
                this.spawnFloatingText("Not enough cash!", 480, 50, '#ff3b30');
            }
        });

        document.getElementById('shop-pineapple').addEventListener('click', () => {
            if (this.cash >= 25) {
                this.placingType = (this.placingType === 'pineapple') ? null : 'pineapple';
                this.selectedTower = null;
                this.updateUI();
            } else {
                this.spawnFloatingText("Not enough cash!", 480, 50, '#ff3b30');
            }
        });

        document.getElementById('btnStartRound').addEventListener('click', () => this.startRound());
        document.getElementById('btnSpeed').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('btnAutoStart').addEventListener('click', () => this.toggleAutoStart());
        document.getElementById('btnPause').addEventListener('click', () => this.togglePause());

        document.getElementById('btnSound').addEventListener('click', () => {
            const on = window.soundEngine.toggleSound();
            document.getElementById('soundIcon').src = on ? 'assets/ui/sound_on.png' : 'assets/ui/sound_off.png';
        });

        const btnMusic = document.getElementById('btnMusic');
        if (btnMusic) {
            btnMusic.addEventListener('click', () => {
                const musicOn = window.soundEngine.toggleMusic();
                btnMusic.textContent = musicOn ? 'MUSIC: ON' : 'MUSIC: OFF';
                btnMusic.className = musicOn ? 'ctrl-btn active' : 'ctrl-btn';
            });
        }

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

        document.getElementById('btnSelectMap').addEventListener('click', () => {
            document.getElementById('mapSelectModal').classList.remove('hidden');
        });

        document.querySelectorAll('.map-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const mapId = btn.dataset.map;
                this.setMap(mapId);
                document.getElementById('mapSelectModal').classList.add('hidden');
            });
        });

        document.getElementById('btnCloseMapModal').addEventListener('click', () => {
            document.getElementById('mapSelectModal').classList.add('hidden');
        });

        document.getElementById('btnRestart').addEventListener('click', () => this.resetGame());
        document.getElementById('btnFreeplay').addEventListener('click', () => {
            document.getElementById('victoryModal').classList.add('hidden');
        });

        this.updateUI();
    }

    updateUI() {
        document.getElementById('livesVal').textContent = this.lives;
        document.getElementById('cashVal').textContent = `$${this.cash.toLocaleString()}`;
        document.getElementById('roundVal').textContent = `${this.round}`;

        const btnStart = document.getElementById('btnStartRound');
        btnStart.disabled = this.roundInProgress || this.gameOver;
        btnStart.textContent = this.roundInProgress ? 'IN PROGRESS' : (this.round === 1 ? 'GO!' : 'NEXT ROUND');

        const btnSpeed = document.getElementById('btnSpeed');
        btnSpeed.textContent = `${this.speed}x SPEED`;

        const btnAuto = document.getElementById('btnAutoStart');
        btnAuto.className = this.autoStart ? 'ctrl-btn active' : 'ctrl-btn';

        const btnPause = document.getElementById('btnPause');
        btnPause.textContent = this.isPaused ? 'RESUME' : 'PAUSE';

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

        const inspector = document.getElementById('towerInspector');
        if (this.selectedTower) {
            inspector.classList.remove('hidden');
            const t = this.selectedTower;
            document.getElementById('inspectorName').textContent = t.name;
            document.getElementById('inspectorPops').textContent = `Pops: ${t.pops}`;
            document.getElementById('inspectorImg').src = TOWER_SPRITES[t.sprite];
            document.getElementById('targetPrioritySelect').value = t.targetPriority;

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

            document.getElementById('btnSell').textContent = `SELL FOR $${t.getSellValue()}`;
        } else {
            inspector.classList.add('hidden');
        }
    }
}

// Start game
window.addEventListener('DOMContentLoaded', () => {
    window.game = new BTD4Game();
});
