// Projectiles, Trajectories, Area Effects, and Drop Items

const PROJ_SPRITES = {
    dart: 'assets/projectiles/dart.png',
    tack: 'assets/projectiles/tack.png',
    blade: 'assets/projectiles/blade.png',
    bomb: 'assets/projectiles/bomb.png',
    missile: 'assets/projectiles/missile.png',
    ice_shard: 'assets/projectiles/ice_shard.png',
    boomerang: 'assets/projectiles/boomerang.png',
    glaive: 'assets/projectiles/glaive.png',
    glue_splat: 'assets/projectiles/glue_splat.png',
    laser_beam: 'assets/projectiles/laser_beam.png',
    plasma_orb: 'assets/projectiles/plasma_orb.png',
    sun_beam: 'assets/projectiles/sun_beam.png',
    mortar_shell: 'assets/projectiles/mortar_shell.png',
    mortar_reticle: 'assets/projectiles/mortar_reticle.png',
    banana: 'assets/projectiles/banana.png',
    road_spikes: 'assets/projectiles/road_spikes.png',
    pineapple: 'assets/projectiles/pineapple.png',
    pop_fx: 'assets/projectiles/pop_fx.png',
    explosion_fx: 'assets/projectiles/explosion_fx.png'
};

const projImageCache = {};
for (const [k, v] of Object.entries(PROJ_SPRITES)) {
    const img = new Image();
    img.src = v;
    projImageCache[k] = img;
}

class Projectile {
    constructor(options) {
        this.tower = options.tower;
        this.x = options.x;
        this.y = options.y;
        this.type = options.type || 'dart';
        this.damage = options.damage || 1;
        this.pierce = options.pierce || 1;
        this.speed = options.speed || 400; // pixels per sec
        this.range = options.range || 200;
        this.distTraveled = 0;
        this.radius = options.radius || 8;
        this.attackType = options.attackType || 'sharp';
        this.camo = options.camo || false;
        this.canPopLead = options.canPopLead || false;
        this.canPopFrozen = options.canPopFrozen || false;
        this.hitBloons = new Set();
        this.markedForRemoval = false;

        // Angle / Direction
        this.angle = options.angle !== undefined ? options.angle : 0;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Curve / Boomerang properties
        this.isBoomerang = options.isBoomerang || false;
        this.boomerangTime = 0;
        this.startX = this.x;
        this.startY = this.y;

        // Glaive Ricochet
        this.isGlaive = options.isGlaive || false;
        this.ricochetCount = 0;
        this.maxRicochets = options.maxRicochets || 40;

        // Explosives
        this.isExplosive = options.isExplosive || false;
        this.blastRadius = options.blastRadius || 45;
        this.cluster = options.cluster || false;
        this.targetX = options.targetX;
        this.targetY = options.targetY;

        // Status effects to apply
        this.freezes = options.freezes || false;
        this.freezeDuration = options.freezeDuration || 1.5;
        this.glues = options.glues || false;
        this.glueDuration = options.glueDuration || 4.0;
        this.glueSlow = options.glueSlow || 0.5;
        this.corrosive = options.corrosive || false;

        this.rotation = this.angle;
    }

    update(dt, game) {
        // 1. Boomerang Curved Arc
        if (this.isBoomerang) {
            this.boomerangTime += dt * 3.2;
            this.rotation += dt * 15;
            // Elliptical boomerang path out and back
            const t = this.boomerangTime;
            const reach = this.range * 0.9;
            const forward = Math.sin(t) * reach;
            const lateral = (1 - Math.cos(t)) * (reach * 0.45);

            const cosA = Math.cos(this.angle);
            const sinA = Math.sin(this.angle);
            this.x = this.startX + cosA * forward - sinA * lateral;
            this.y = this.startY + sinA * forward + cosA * lateral;

            if (t >= Math.PI * 2) {
                this.markedForRemoval = true;
                return;
            }
        }
        // 2. Linear motion
        else {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.distTraveled += this.speed * dt;
            if (this.type === 'blade' || this.type === 'glaive') {
                this.rotation += dt * 18;
            }

            // Target arrival check for bombs / missiles with target point
            if (this.targetX !== undefined && this.targetY !== undefined) {
                if (Math.hypot(this.x - this.targetX, this.y - this.targetY) < 14) {
                    this.explode(game);
                    return;
                }
            }

            if (this.distTraveled >= this.range) {
                if (this.isExplosive) {
                    this.explode(game);
                } else {
                    this.markedForRemoval = true;
                }
                return;
            }
        }

        // Screen boundary cull
        if (this.x < -40 || this.x > 1000 || this.y < -40 || this.y > 600) {
            this.markedForRemoval = true;
            return;
        }

        // Collision check against bloons
        this.checkCollisions(game);
    }

    checkCollisions(game) {
        if (this.markedForRemoval) return;

        for (let i = 0; i < game.bloons.length; i++) {
            const b = game.bloons[i];
            if (b.markedForRemoval || this.hitBloons.has(b)) continue;

            // Camo check
            if (b.camo && !this.camo) continue;

            // Hitbox distance
            const dist = Math.hypot(this.x - b.x, this.y - b.y);
            if (dist < this.radius + b.r) {
                this.hitBloon(b, game);
                if (this.pierce <= 0 || this.markedForRemoval) break;
            }
        }
    }

    hitBloon(b, game) {
        this.hitBloons.add(b);

        if (this.isExplosive) {
            this.explode(game);
            return;
        }

        // Apply Freeze
        if (this.freezes) {
            b.applyFreeze(this.freezeDuration);
            window.soundEngine.playFreeze();
        }

        // Apply Glue
        if (this.glues) {
            b.applyGlue(this.glueDuration, this.glueSlow, this.corrosive);
        }

        // Attack type override for lead/frozen
        let effectiveAttack = this.attackType;
        if (this.canPopLead && b.typeId === 'lead') {
            effectiveAttack = 'plasma';
        }

        // Extra damage against MOAB / BFB for MOAB Mauler / specialized towers
        let finalDamage = this.damage;
        if (b.isBlimp && this.tower && this.tower.moabDamageMultiplier) {
            finalDamage *= this.tower.moabDamageMultiplier;
        }

        const res = b.takeDamage(finalDamage, effectiveAttack, this.tower);
        if (res.popped) {
            game.addCash(res.cash);
            game.stats.totalPops += res.popCount;
            if (this.tower) {
                this.tower.pops += res.popCount;
            }
            window.soundEngine.playPop();
            game.spawnPopFX(b.x, b.y);

            // Add newly spawned children to game
            for (const child of res.children) {
                game.bloons.push(child);
            }
        }

        this.pierce--;
        if (this.pierce <= 0 && !this.isGlaive) {
            this.markedForRemoval = true;
        }

        // Glaive Ricochet: find next nearest target
        if (this.isGlaive && this.ricochetCount < this.maxRicochets) {
            this.ricochetCount++;
            let bestTarget = null;
            let bestDist = 200;
            for (const other of game.bloons) {
                if (other.markedForRemoval || this.hitBloons.has(other)) continue;
                const d = Math.hypot(this.x - other.x, this.y - other.y);
                if (d < bestDist) {
                    bestDist = d;
                    bestTarget = other;
                }
            }
            if (bestTarget) {
                this.angle = Math.atan2(bestTarget.y - this.y, bestTarget.x - this.x);
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
            } else {
                this.markedForRemoval = true;
            }
        }
    }

    explode(game) {
        this.markedForRemoval = true;
        window.soundEngine.playExplosion();
        game.spawnExplosionFX(this.x, this.y, this.blastRadius);

        // AOE damage
        for (let i = game.bloons.length - 1; i >= 0; i--) {
            const b = game.bloons[i];
            if (b.markedForRemoval) continue;
            if (b.camo && !this.camo) continue;

            const dist = Math.hypot(this.x - b.x, this.y - b.y);
            if (dist <= this.blastRadius + b.r) {
                let finalDamage = this.damage;
                if (b.isBlimp && this.tower && this.tower.moabDamageMultiplier) {
                    finalDamage *= this.tower.moabDamageMultiplier;
                }
                const res = b.takeDamage(finalDamage, 'explosion', this.tower);
                if (res.popped) {
                    game.addCash(res.cash);
                    game.stats.totalPops += res.popCount;
                    if (this.tower) {
                        this.tower.pops += res.popCount;
                    }
                    for (const child of res.children) {
                        game.bloons.push(child);
                    }
                }
            }
        }

        // Cluster bombs: spawn 6 secondary bomblets
        if (this.cluster) {
            for (let i = 0; i < 6; i++) {
                const subAngle = (Math.PI * 2 / 6) * i;
                game.projectiles.push(new Projectile({
                    tower: this.tower,
                    x: this.x,
                    y: this.y,
                    type: 'bomb',
                    damage: 1,
                    pierce: 1,
                    speed: 250,
                    range: 60,
                    angle: subAngle,
                    attackType: 'explosion',
                    isExplosive: true,
                    blastRadius: 30,
                    camo: this.camo
                }));
            }
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const img = projImageCache[this.type];
        if (img && img.complete) {
            let w = this.radius * 2.4;
            let h = this.radius * 2.4;
            if (this.type === 'dart') { w = 24; h = 12; }
            else if (this.type === 'missile') { w = 28; h = 12; }
            else if (this.type === 'laser_beam' || this.type === 'sun_beam') { w = 36; h = 12; }
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
            // Fallback rendering
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Track Obstacles: Road Spikes & Exploding Pineapple
class TrackItem {
    constructor(type, x, y) {
        this.type = type; // 'road_spikes' or 'pineapple'
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.markedForRemoval = false;

        if (this.type === 'road_spikes') {
            this.spikesRemaining = 10;
        } else if (this.type === 'pineapple') {
            this.timer = 3.0; // 3 second fuse
        }
    }

    update(dt, game) {
        if (this.type === 'road_spikes') {
            // Check collisions with bloons crossing this point
            for (let i = 0; i < game.bloons.length; i++) {
                const b = game.bloons[i];
                if (b.markedForRemoval) continue;
                if (Math.hypot(this.x - b.x, this.y - b.y) <= this.radius + b.r) {
                    const res = b.takeDamage(1, 'sharp', null);
                    if (res.popped) {
                        game.addCash(res.cash);
                        game.stats.totalPops += res.popCount;
                        window.soundEngine.playPop();
                        game.spawnPopFX(b.x, b.y);
                        for (const child of res.children) {
                            game.bloons.push(child);
                        }
                    }
                    this.spikesRemaining--;
                    if (this.spikesRemaining <= 0) {
                        this.markedForRemoval = true;
                        break;
                    }
                }
            }
        } else if (this.type === 'pineapple') {
            this.timer -= dt;
            if (this.timer <= 0) {
                // Detonate!
                this.markedForRemoval = true;
                window.soundEngine.playExplosion();
                game.spawnExplosionFX(this.x, this.y, 85);
                for (let i = game.bloons.length - 1; i >= 0; i--) {
                    const b = game.bloons[i];
                    if (b.markedForRemoval) continue;
                    if (Math.hypot(this.x - b.x, this.y - b.y) <= 85 + b.r) {
                        const res = b.takeDamage(3, 'explosion', null);
                        if (res.popped) {
                            game.addCash(res.cash);
                            game.stats.totalPops += res.popCount;
                            for (const child of res.children) {
                                game.bloons.push(child);
                            }
                        }
                    }
                }
            }
        }
    }

    render(ctx) {
        const img = projImageCache[this.type];
        if (img && img.complete) {
            ctx.drawImage(img, this.x - 16, this.y - 16, 32, 32);
        }

        // Ticking timer for pineapple
        if (this.type === 'pineapple') {
            ctx.fillStyle = '#ff2222';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Math.ceil(this.timer), this.x, this.y - 18);
        } else if (this.type === 'road_spikes') {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.spikesRemaining, this.x, this.y - 14);
        }
    }
}

// Dropped Bananas from Banana Farm
class DroppedBanana {
    constructor(x, y, value = 20) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.life = 12.0; // Despawns after 12s if not collected
        this.markedForRemoval = false;
        this.hovered = false;
    }

    update(dt, game) {
        this.life -= dt;
        if (this.life <= 0) {
            this.markedForRemoval = true;
        }
    }

    collect(game) {
        if (this.markedForRemoval) return;
        this.markedForRemoval = true;
        game.addCash(this.value);
        window.soundEngine.playCoin();
        game.spawnFloatingText(`+$${this.value}`, this.x, this.y, '#ffd700');
    }

    render(ctx) {
        const img = projImageCache.banana;
        if (img && img.complete) {
            ctx.drawImage(img, this.x - 14, this.y - 14, 28, 28);
        }
    }
}

// Particle Pop FX
class PopParticleFX {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.timer = 0.25;
        this.markedForRemoval = false;
    }

    update(dt) {
        this.timer -= dt;
        if (this.timer <= 0) this.markedForRemoval = true;
    }

    render(ctx) {
        const img = projImageCache.pop_fx;
        if (img && img.complete) {
            ctx.drawImage(img, this.x - 18, this.y - 18, 36, 36);
        }
    }
}

// Fireball Explosion FX
class ExplosionFX {
    constructor(x, y, radius = 45) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.timer = 0.35;
        this.maxTimer = 0.35;
        this.markedForRemoval = false;
    }

    update(dt) {
        this.timer -= dt;
        if (this.timer <= 0) this.markedForRemoval = true;
    }

    render(ctx) {
        const progress = 1 - (this.timer / this.maxTimer);
        const currentR = this.radius * (0.6 + progress * 0.4);
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        const img = projImageCache.explosion_fx;
        if (img && img.complete) {
            ctx.drawImage(img, this.x - currentR, this.y - currentR, currentR * 2, currentR * 2);
        } else {
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentR, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// Floating Text Feedback (e.g. "+$1", "+$50")
class FloatingText {
    constructor(text, x, y, color = '#ffd700') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.timer = 0.8;
        this.markedForRemoval = false;
    }

    update(dt) {
        this.y -= 30 * dt;
        this.timer -= dt;
        if (this.timer <= 0) this.markedForRemoval = true;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.timer / 0.8);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
