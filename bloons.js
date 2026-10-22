// Bloons definitions, hierarchy, status effects, and lifecycle

const BLOON_TYPES = {
    red: {
        id: 'red',
        tier: 1,
        speed: 1.0,
        reward: 1,
        r: 16,
        children: [],
        immune: [],
        sprite: 'assets/bloons/red.png'
    },
    blue: {
        id: 'blue',
        tier: 2,
        speed: 1.4,
        reward: 1,
        r: 17,
        children: ['red'],
        immune: [],
        sprite: 'assets/bloons/blue.png'
    },
    green: {
        id: 'green',
        tier: 3,
        speed: 1.8,
        reward: 1,
        r: 18,
        children: ['blue'],
        immune: [],
        sprite: 'assets/bloons/green.png'
    },
    yellow: {
        id: 'yellow',
        tier: 4,
        speed: 3.2,
        reward: 1,
        r: 19,
        children: ['green'],
        immune: [],
        sprite: 'assets/bloons/yellow.png'
    },
    pink: {
        id: 'pink',
        tier: 5,
        speed: 3.5,
        reward: 1,
        r: 19,
        children: ['yellow'],
        immune: [],
        sprite: 'assets/bloons/pink.png'
    },
    black: {
        id: 'black',
        tier: 6,
        speed: 1.8,
        reward: 1,
        r: 17,
        children: ['pink', 'pink'],
        immune: ['explosion'],
        sprite: 'assets/bloons/black.png'
    },
    white: {
        id: 'white',
        tier: 6,
        speed: 2.0,
        reward: 1,
        r: 17,
        children: ['pink', 'pink'],
        immune: ['freeze'],
        sprite: 'assets/bloons/white.png'
    },
    lead: {
        id: 'lead',
        tier: 7,
        speed: 1.0,
        reward: 1,
        r: 20,
        children: ['black', 'black'],
        immune: ['sharp'],
        sprite: 'assets/bloons/lead.png'
    },
    zebra: {
        id: 'zebra',
        tier: 8,
        speed: 1.8,
        reward: 1,
        r: 20,
        children: ['black', 'white'],
        immune: ['explosion', 'freeze'],
        sprite: 'assets/bloons/zebra.png'
    },
    rainbow: {
        id: 'rainbow',
        tier: 9,
        speed: 2.2,
        reward: 1,
        r: 22,
        children: ['zebra', 'zebra'],
        immune: [],
        sprite: 'assets/bloons/rainbow.png'
    },
    ceramic: {
        id: 'ceramic',
        tier: 10,
        speed: 2.5,
        reward: 10,
        r: 24,
        isCeramic: true,
        shellHp: 10,
        children: ['rainbow', 'rainbow'],
        immune: [],
        sprite: 'assets/bloons/ceramic.png'
    },
    moab: {
        id: 'moab',
        tier: 11,
        speed: 0.75,
        reward: 100,
        r: 36,
        isBlimp: true,
        maxHp: 200,
        hp: 200,
        children: ['ceramic', 'ceramic', 'ceramic', 'ceramic'],
        immune: ['freeze'],
        sprite: 'assets/bloons/moab.png'
    },
    bfb: {
        id: 'bfb',
        tier: 12,
        speed: 0.45,
        reward: 350,
        r: 45,
        isBlimp: true,
        maxHp: 700,
        hp: 700,
        children: ['moab', 'moab', 'moab', 'moab'],
        immune: ['freeze'],
        sprite: 'assets/bloons/bfb.png'
    }
};

// Asset cache for Bloon images
const bloonSpriteCache = {};
for (const [key, val] of Object.entries(BLOON_TYPES)) {
    const img = new Image();
    img.src = val.sprite;
    bloonSpriteCache[key] = img;
}

// Additional variants
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

        const def = BLOON_TYPES[typeId];
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
        this.corrosiveTimer = 0;

        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.markedForRemoval = false;
        this.escaped = false;
    }

    // Regrow logic
    updateRegrow(dt) {
        if (!this.regrow || this.isBlimp) return;
        this.regrowTimer += dt;
        if (this.regrowTimer >= 3.0) {
            this.regrowTimer = 0;
            // Upgrade one tier up towards originalType
            const origTier = BLOON_TYPES[this.originalType].tier;
            if (this.def.tier < origTier) {
                // Find next tier
                const allTypes = ['red', 'blue', 'green', 'yellow', 'pink', 'black', 'lead', 'zebra', 'rainbow', 'ceramic'];
                const curIdx = allTypes.indexOf(this.typeId);
                if (curIdx >= 0 && curIdx < allTypes.length - 1) {
                    const nextType = allTypes[curIdx + 1];
                    this.typeId = nextType;
                    this.def = BLOON_TYPES[nextType];
                    this.speed = this.def.speed;
                    this.r = this.def.r;
                    if (this.def.isCeramic) {
                        this.shellHp = this.def.shellHp;
                    }
                }
            }
        }
    }

    update(dt, gameMap) {
        // Freeze status
        if (this.freezeTimer > 0) {
            this.freezeTimer -= dt;
            return;
        }

        // Corrosive glue tick
        if (this.corrosiveRate > 0) {
            this.corrosiveTimer += dt;
            if (this.corrosiveTimer >= 1.0) {
                this.corrosiveTimer = 0;
                this.takeDamage(1, 'corrosive', null);
                if (this.markedForRemoval) return;
            }
        }

        // Movement speed calculations
        let curSpeed = this.speed * 60; // Pixels per second
        if (this.glueTimer > 0) {
            this.glueTimer -= dt;
            curSpeed *= (1 - this.glueSlow);
        }

        this.distance += curSpeed * dt;
        this.updateRegrow(dt);

        // Map positioning
        const pos = gameMap.getPointAtDistance(this.distance);
        this.x = pos.x;
        this.y = pos.y;
        this.angle = pos.angle;

        if (pos.finished) {
            this.escaped = true;
            this.markedForRemoval = true;
        }
    }

    // Hit bloon with damage and attack type
    takeDamage(damage, attackType = 'sharp', tower = null) {
        // Check immunities
        if (this.def.immune.includes(attackType)) {
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }
        if (attackType === 'sharp' && this.freezeTimer > 0) {
            // Cannot pop frozen bloon with sharp dart without upgrade
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }

        let totalCash = 0;
        let pops = 0;
        let spawnedChildren = [];

        // 1. Blimps (MOAB, BFB)
        if (this.isBlimp) {
            this.hp -= damage;
            pops += Math.min(damage, this.hp + damage);
            if (this.hp <= 0) {
                this.markedForRemoval = true;
                totalCash += this.def.reward;
                // Spawn children (4 ceramics or 4 MOABs)
                for (let i = 0; i < this.def.children.length; i++) {
                    const cType = this.def.children[i];
                    const offset = (i - 1.5) * 16;
                    const child = new Bloon(cType, Math.max(0, this.distance + offset), {
                        camo: this.camo,
                        regrow: this.regrow,
                        originalType: cType
                    });
                    spawnedChildren.push(child);
                }
                return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
            }
            return { popped: false, children: [], cash: 0, popCount: pops };
        }

        // 2. Ceramic Shell
        if (this.isCeramic && this.shellHp > 0) {
            const dmgToShell = Math.min(this.shellHp, damage);
            this.shellHp -= dmgToShell;
            pops += dmgToShell;
            if (this.shellHp <= 0) {
                // Shell broken! Spawn 2 Rainbows
                this.markedForRemoval = true;
                totalCash += this.def.reward;
                for (let i = 0; i < 2; i++) {
                    const offset = (i - 0.5) * 12;
                    const child = new Bloon('rainbow', Math.max(0, this.distance + offset), {
                        camo: this.camo,
                        regrow: this.regrow,
                        originalType: this.originalType
                    });
                    spawnedChildren.push(child);
                }
                return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
            }
            return { popped: false, children: [], cash: 0, popCount: pops };
        }

        // 3. Regular layered Bloons
        // If damage > 1, penetrate multiple layers
        let currentType = this.typeId;
        let remainingDamage = damage;
        let currentBloons = [{
            typeId: currentType,
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
            spawnedChildren.push(new Bloon(item.typeId, item.dist, {
                camo: item.camo,
                regrow: item.regrow,
                originalType: item.originalType
            }));
        }

        return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
    }

    applyFreeze(duration) {
        if (this.def.immune.includes('freeze') || this.isBlimp) return;
        this.freezeTimer = Math.max(this.freezeTimer, duration);
    }

    applyGlue(duration, slowRate = 0.5, corrosive = false) {
        if (this.isBlimp) return;
        this.glueTimer = Math.max(this.glueTimer, duration);
        this.glueSlow = slowRate;
        if (corrosive) {
            this.corrosiveRate = 1;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.isBlimp) {
            // Blimps rotate along flight path
            ctx.rotate(this.angle);
            let sprite = bloonSpriteCache[this.typeId];
            if (this.typeId === 'moab' && this.hp < 100) {
                sprite = extraBloonSprites.moab_damaged;
            } else if (this.typeId === 'bfb' && this.hp < 350) {
                sprite = extraBloonSprites.bfb_damaged;
            }

            if (sprite && sprite.complete) {
                const w = this.typeId === 'moab' ? 140 : 180;
                const h = this.typeId === 'moab' ? 80 : 100;
                ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
            }

            // Blimp health bar
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

        // Standard Bloons
        let sprite = bloonSpriteCache[this.typeId];
        if (this.isCeramic) {
            if (this.shellHp <= 3) {
                sprite = extraBloonSprites.ceramic_broken;
            } else if (this.shellHp <= 7) {
                sprite = extraBloonSprites.ceramic_cracked;
            }
        }

        // Draw bloon image
        if (sprite && sprite.complete) {
            const w = this.r * 2.2;
            const h = this.r * 2.8;
            ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
        } else {
            // Fallback circle
            ctx.fillStyle = '#ff2222';
            ctx.beginPath();
            ctx.arc(0, 0, this.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Camo overlay
        if (this.camo && extraBloonSprites.camo_overlay.complete) {
            const w = this.r * 2.2;
            const h = this.r * 2.8;
            ctx.drawImage(extraBloonSprites.camo_overlay, -w / 2, -h / 2, w, h);
        }

        // Regrow heart badge
        if (this.regrow && extraBloonSprites.regrow_heart.complete) {
            ctx.drawImage(extraBloonSprites.regrow_heart, -12, -12, 24, 24);
        }

        // Freeze visual effect
        if (this.freezeTimer > 0) {
            ctx.fillStyle = 'rgba(160, 230, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, this.r + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#c5f2ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Glue visual effect
        if (this.glueTimer > 0) {
            ctx.fillStyle = 'rgba(255, 230, 20, 0.4)';
            ctx.beginPath();
            ctx.arc(0, this.r * 0.4, this.r * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
