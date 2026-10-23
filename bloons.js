// --- 3. Bloons System ---
const BLOON_TYPES = {
    red: { id: 'red', tier: 1, speed: 1.0, reward: 1, r: 16, children: [], immune: [], sprite: 'assets/bloons/red.png' },
    blue: { id: 'blue', tier: 2, speed: 1.4, reward: 1, r: 17, children: ['red'], immune: [], sprite: 'assets/bloons/blue.png' },
    green: { id: 'green', tier: 3, speed: 1.8, reward: 1, r: 18, children: ['blue'], immune: [], sprite: 'assets/bloons/green.png' },
    yellow: { id: 'yellow', tier: 4, speed: 3.2, reward: 1, r: 19, children: ['green'], immune: [], sprite: 'assets/bloons/yellow.png' },
    pink: { id: 'pink', tier: 5, speed: 3.5, reward: 1, r: 19, children: ['yellow'], immune: [], sprite: 'assets/bloons/pink.png' },
    black: { id: 'black', tier: 6, speed: 1.8, reward: 1, r: 17, children: ['pink', 'pink'], immune: ['explosion'], sprite: 'assets/bloons/black.png' },
    white: { id: 'white', tier: 6, speed: 2.0, reward: 1, r: 17, children: ['pink', 'pink'], immune: ['freeze'], sprite: 'assets/bloons/white.png' },
    lead: { id: 'lead', tier: 7, speed: 1.0, reward: 1, r: 20, children: ['black', 'black'], immune: ['sharp'], sprite: 'assets/bloons/lead.png' },
    zebra: { id: 'zebra', tier: 8, speed: 1.8, reward: 1, r: 20, children: ['black', 'white'], immune: ['explosion', 'freeze'], sprite: 'assets/bloons/zebra.png' },
    rainbow: { id: 'rainbow', tier: 9, speed: 2.2, reward: 1, r: 22, children: ['zebra', 'zebra'], immune: [], sprite: 'assets/bloons/rainbow.png' },
    ceramic: { id: 'ceramic', tier: 10, speed: 2.5, reward: 10, r: 24, isCeramic: true, shellHp: 10, children: ['rainbow', 'rainbow'], immune: [], sprite: 'assets/bloons/ceramic.png' },
    moab: { id: 'moab', tier: 11, speed: 0.75, reward: 100, r: 36, isBlimp: true, maxHp: 200, hp: 200, children: ['ceramic', 'ceramic', 'ceramic', 'ceramic'], immune: ['freeze'], sprite: 'assets/bloons/moab.png' },
    bfb: { id: 'bfb', tier: 12, speed: 0.45, reward: 350, r: 45, isBlimp: true, maxHp: 700, hp: 700, children: ['moab', 'moab', 'moab', 'moab'], immune: ['freeze'], sprite: 'assets/bloons/bfb.png' }
};

const bloonSpriteCache = {};
for (const [key, val] of Object.entries(BLOON_TYPES)) {
    const img = new Image();
    img.src = val.sprite;
    bloonSpriteCache[key] = img;
}

const extraBloonSprites = {
    ceramic_cracked: new Image(),
    ceramic_broken: new Image(),
    moab_damaged: new Image(),
    bfb_damaged: new Image(),
    camo_overlay: new Image(),
    regrow_heart: new Image()
};
extraBloonSprites.ceramic_cracked.src = 'assets/bloons/ceramic_cracked.png';
extraBloonSprites.ceramic_broken.src = 'assets/bloons/ceramic_broken.png';
extraBloonSprites.moab_damaged.src = 'assets/bloons/moab_damaged.png';
extraBloonSprites.bfb_damaged.src = 'assets/bloons/bfb_damaged.png';
extraBloonSprites.camo_overlay.src = 'assets/bloons/camo_overlay.png';
extraBloonSprites.regrow_heart.src = 'assets/bloons/regrow_heart.png';

class Bloon {
    constructor(typeId, distance = 0, options = {}) {
        this.typeId = typeId;
        this.distance = distance;
        this.camo = options.camo || false;
        this.regrow = options.regrow || false;
        this.originalType = options.originalType || typeId;
        this.regrowTimer = 0;

        const def = BLOON_TYPES[typeId] || BLOON_TYPES.red;
        this.def = def;
        this.speed = def.speed;
        this.r = def.r;
        this.isBlimp = !!def.isBlimp;
        this.isCeramic = !!def.isCeramic;

        if (this.isBlimp) {
            this.maxHp = def.maxHp;
            this.hp = options.hp !== undefined ? options.hp : def.maxHp;
        } else if (this.isCeramic) {
            this.maxShellHp = def.shellHp;
            this.shellHp = options.shellHp !== undefined ? options.shellHp : def.shellHp;
        }

        this.freezeTimer = 0;
        this.glueTimer = 0;
        this.glueSlow = 0.5;
        this.corrosiveRate = 0;
        this.corrosiveDamage = 1;
        this.glueSoak = false;
        this.corrosiveTimer = 0;
        this.burnTimer = 0;
        this.burnTickTimer = 0;

        const activeMap = window.game && window.game.gameMap;
        if (activeMap) {
            const pos = activeMap.getPointAtDistance(this.distance);
            this.x = pos.x;
            this.y = pos.y;
            this.angle = pos.angle;
        } else {
            this.x = -50;
            this.y = -50;
            this.angle = 0;
        }

        this.markedForRemoval = false;
        this.escaped = false;
    }

    updateRegrow(dt) {
        if (!this.regrow || this.isBlimp) return;
        this.regrowTimer += dt;
        if (this.regrowTimer >= 3.0) {
            this.regrowTimer = 0;
            const origTier = BLOON_TYPES[this.originalType].tier;
            if (this.def.tier < origTier) {
                const allTypes = ['red', 'blue', 'green', 'yellow', 'pink', 'black', 'lead', 'zebra', 'rainbow', 'ceramic'];
                const curIdx = allTypes.indexOf(this.typeId);
                if (curIdx >= 0 && curIdx < allTypes.length - 1) {
                    const nextType = allTypes[curIdx + 1];
                    this.typeId = nextType;
                    this.def = BLOON_TYPES[nextType];
                    this.speed = this.def.speed;
                    this.r = this.def.r;
                    if (this.def.isCeramic) this.shellHp = this.def.shellHp;
                }
            }
        }
    }

    update(dt, gameMap, game) {
        if (this.corrosiveRate > 0) {
            this.corrosiveTimer += dt;
            const interval = this.corrosiveDamage > 1 ? 0.8 : 1.4;
            if (this.corrosiveTimer >= interval) {
                this.corrosiveTimer = 0;
                const res = this.takeDamage(this.corrosiveDamage, 'corrosive', null, gameMap);
                if (res.popped && game) {
                    game.addCash(res.cash);
                    game.stats.totalPops += res.popCount;
                    window.soundEngine.playPop(1.1);
                    game.spawnPopFX(this.x, this.y);
                    for (const child of res.children) game.bloons.push(child);
                }
                if (this.markedForRemoval) return;
            }
        }

        if (this.burnTimer > 0) {
            this.burnTimer -= dt;
            this.burnTickTimer += dt;
            if (this.burnTickTimer >= 1.0) {
                this.burnTickTimer = 0;
                const res = this.takeDamage(1, 'fire', null, gameMap);
                if (res.popped && game) {
                    game.addCash(res.cash);
                    game.stats.totalPops += res.popCount;
                    window.soundEngine.playPop(0.95);
                    game.spawnPopFX(this.x, this.y);
                    for (const child of res.children) game.bloons.push(child);
                }
                if (this.markedForRemoval) return;
            }
        }

        if (this.freezeTimer > 0) {
            this.freezeTimer -= dt;
            return;
        }

        let curSpeed = this.speed * 60;
        if (this.glueTimer > 0) {
            this.glueTimer -= dt;
            curSpeed *= (1 - this.glueSlow);
        }

        // Check Arctic Wind aura slow from nearby ice towers
        if (game && !this.isBlimp && !this.def.immune.includes('freeze')) {
            for (const t of game.towers) {
                if (t.isArctic && Math.hypot(this.x - t.x, this.y - t.y) <= t.range) {
                    curSpeed *= 0.4;
                    break;
                }
            }
        }

        this.distance += curSpeed * dt;
        this.updateRegrow(dt);

        const pos = gameMap.getPointAtDistance(this.distance);
        this.x = pos.x;
        this.y = pos.y;
        this.angle = pos.angle;

        if (pos.finished) {
            this.escaped = true;
            this.markedForRemoval = true;
        }
    }

    takeDamage(damage, attackType = 'sharp', tower = null, gameMap = null) {
        if (this.def.immune.includes(attackType)) {
            if (this.typeId === 'lead' && attackType === 'sharp') {
                window.soundEngine.playLeadClink();
            }
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }
        if (attackType === 'sharp' && this.freezeTimer > 0) {
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }

        const activeMap = gameMap || (window.game && window.game.gameMap);
        let totalCash = 0;
        let pops = 0;
        let spawnedChildren = [];

        if (this.isBlimp) {
            this.hp -= damage;
            pops += Math.min(damage, this.hp + damage);
            if (this.hp <= 0) {
                this.markedForRemoval = true;
                totalCash += this.def.reward;
                for (let i = 0; i < this.def.children.length; i++) {
                    const cType = this.def.children[i];
                    const offset = (i - 1.5) * 16;
                    const child = new Bloon(cType, Math.max(0, this.distance + offset), {
                        camo: this.camo,
                        regrow: this.regrow,
                        originalType: cType
                    });
                    if (activeMap) {
                        const p = activeMap.getPointAtDistance(child.distance);
                        child.x = p.x; child.y = p.y; child.angle = p.angle;
                    }
                    spawnedChildren.push(child);
                }
                return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
            }
            return { popped: false, children: [], cash: 0, popCount: pops };
        }

        if (this.isCeramic && this.shellHp > 0) {
            const dmgToShell = Math.min(this.shellHp, damage);
            this.shellHp -= dmgToShell;
            pops += dmgToShell;
            if (this.shellHp <= 0) {
                this.markedForRemoval = true;
                totalCash += this.def.reward;
                for (let i = 0; i < 2; i++) {
                    const offset = (i - 0.5) * 12;
                    const child = new Bloon('rainbow', Math.max(0, this.distance + offset), {
                        camo: this.camo,
                        regrow: this.regrow,
                        originalType: this.originalType
                    });
                    if (this.glueSoak && this.glueTimer > 0) {
                        child.applyGlue(this.glueTimer, this.glueSlow, this.corrosiveRate > 0, true, this.corrosiveDamage);
                    }
                    if (activeMap) {
                        const p = activeMap.getPointAtDistance(child.distance);
                        child.x = p.x; child.y = p.y; child.angle = p.angle;
                    }
                    spawnedChildren.push(child);
                }
                return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
            }
            window.soundEngine.playCeramicHit();
            return { popped: false, children: [], cash: 0, popCount: pops };
        }

        let remainingDamage = damage;
        let currentBloons = [{
            typeId: this.typeId,
            dist: this.distance,
            camo: this.camo,
            regrow: this.regrow,
            originalType: this.originalType
        }];

        while (remainingDamage > 0 && currentBloons.length > 0) {
            remainingDamage--;
            const nextGeneration = [];
            for (const b of currentBloons) {
                pops++;
                totalCash += BLOON_TYPES[b.typeId].reward;
                const childIds = BLOON_TYPES[b.typeId].children;
                for (let i = 0; i < childIds.length; i++) {
                    const cid = childIds[i];
                    const distOffset = (i - 0.5) * 10;
                    nextGeneration.push({
                        typeId: cid,
                        dist: Math.max(0, b.dist + distOffset),
                        camo: b.camo,
                        regrow: b.regrow,
                        originalType: b.originalType
                    });
                }
            }
            currentBloons = nextGeneration;
        }

        this.markedForRemoval = true;
        for (const item of currentBloons) {
            const child = new Bloon(item.typeId, item.dist, {
                camo: item.camo,
                regrow: item.regrow,
                originalType: item.originalType
            });
            if (this.glueSoak && this.glueTimer > 0) {
                child.applyGlue(this.glueTimer, this.glueSlow, this.corrosiveRate > 0, true, this.corrosiveDamage);
            }
            if (this.burnTimer > 0) {
                child.burnTimer = this.burnTimer;
            }
            if (activeMap) {
                const p = activeMap.getPointAtDistance(child.distance);
                child.x = p.x; child.y = p.y; child.angle = p.angle;
            }
            spawnedChildren.push(child);
        }

        return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
    }

    applyFreeze(duration) {
        if (this.def.immune.includes('freeze') || this.isBlimp) return;
        this.freezeTimer = Math.max(this.freezeTimer, duration);
    }

    applyGlue(duration, slowRate = 0.5, corrosive = false, soak = false, corrosiveDmg = 1) {
        if (this.isBlimp) return;
        this.glueTimer = Math.max(this.glueTimer, duration);
        this.glueSlow = slowRate;
        if (corrosive) {
            this.corrosiveRate = 1;
            this.corrosiveDamage = Math.max(this.corrosiveDamage, corrosiveDmg);
        }
        if (soak) this.glueSoak = true;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.isBlimp) {
            ctx.rotate(this.angle);
            let sprite = bloonSpriteCache[this.typeId];
            if (this.typeId === 'moab' && this.hp < 100) sprite = extraBloonSprites.moab_damaged;
            else if (this.typeId === 'bfb' && this.hp < 350) sprite = extraBloonSprites.bfb_damaged;

            if (sprite && sprite.complete) {
                const w = this.typeId === 'moab' ? 140 : 180;
                const h = this.typeId === 'moab' ? 80 : 100;
                ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
            }

            const barW = this.typeId === 'moab' ? 80 : 110;
            const barH = 7;
            const hpRatio = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(-barW / 2 - 1, -this.r - 18, barW + 2, barH + 2);
            ctx.fillStyle = hpRatio > 0.5 ? '#32cd32' : (hpRatio > 0.25 ? '#ffd700' : '#ff3333');
            ctx.fillRect(-barW / 2, -this.r - 17, barW * hpRatio, barH);
            ctx.restore();
            return;
        }

        let sprite = bloonSpriteCache[this.typeId];
        if (this.isCeramic) {
            if (this.shellHp <= 3) sprite = extraBloonSprites.ceramic_broken;
            else if (this.shellHp <= 7) sprite = extraBloonSprites.ceramic_cracked;
        }

        if (sprite && sprite.complete) {
            const w = this.r * 2.2;
            const h = this.r * 2.8;
            ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
        } else {
            ctx.fillStyle = '#ff2222';
            ctx.beginPath();
            ctx.arc(0, 0, this.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.camo && extraBloonSprites.camo_overlay.complete) {
            const w = this.r * 2.2;
            const h = this.r * 2.8;
            ctx.drawImage(extraBloonSprites.camo_overlay, -w / 2, -h / 2, w, h);
        }

        if (this.regrow && extraBloonSprites.regrow_heart.complete) {
            ctx.drawImage(extraBloonSprites.regrow_heart, -12, -12, 24, 24);
        }

        if (this.freezeTimer > 0) {
            ctx.fillStyle = 'rgba(160, 230, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, this.r + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#c5f2ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (this.glueTimer > 0) {
            ctx.fillStyle = 'rgba(255, 230, 20, 0.4)';
            ctx.beginPath();
            ctx.arc(0, this.r * 0.4, this.r * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Global exposure
window.Bloon = Bloon;
window.BLOON_TYPES = BLOON_TYPES;
