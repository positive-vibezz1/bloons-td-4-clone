// Towers definition, upgrade trees, targeting, and combat logic

const TOWER_SPRITES = {
    dart_monkey: 'assets/towers/dart_monkey.png',
    dart_monkey_throw: 'assets/towers/dart_monkey_throw.png',
    tack_shooter: 'assets/towers/tack_shooter.png',
    blade_shooter: 'assets/towers/blade_shooter.png',
    ring_of_fire: 'assets/towers/ring_of_fire.png',
    bomb_tower: 'assets/towers/bomb_tower.png',
    missile_launcher: 'assets/towers/missile_launcher.png',
    moab_mauler: 'assets/towers/moab_mauler.png',
    ice_tower: 'assets/towers/ice_tower.png',
    arctic_wind: 'assets/towers/arctic_wind.png',
    boomerang_monkey: 'assets/towers/boomerang_monkey.png',
    glaive_thrower: 'assets/towers/glaive_thrower.png',
    glue_gunner: 'assets/towers/glue_gunner.png',
    sniper_monkey: 'assets/towers/sniper_monkey.png',
    super_monkey: 'assets/towers/super_monkey.png',
    laser_super_monkey: 'assets/towers/laser_super_monkey.png',
    plasma_super_monkey: 'assets/towers/plasma_super_monkey.png',
    sun_god: 'assets/towers/sun_god.png',
    mortar_monkey: 'assets/towers/mortar_monkey.png',
    banana_farm: 'assets/towers/banana_farm.png',
    spike_factory: 'assets/towers/spike_factory.png',
    monkey_buccaneer: 'assets/towers/monkey_buccaneer.png'
};

const towerImageCache = {};
for (const [k, v] of Object.entries(TOWER_SPRITES)) {
    const img = new Image();
    img.src = v;
    towerImageCache[k] = img;
}

const TOWER_DEFINITIONS = {
    dart_monkey: {
        id: 'dart_monkey',
        name: 'Dart Monkey',
        cost: 200,
        range: 120,
        fireRate: 1.05,
        pierce: 1,
        damage: 1,
        attackType: 'sharp',
        sprite: 'dart_monkey',
        desc: 'Throws a single sharp dart at bloons. Reliable and cheap.',
        upgrades1: [
            { name: 'Long Range', cost: 90, desc: '+25% range.', apply: t => { t.range *= 1.25; } },
            { name: 'Enhanced Eyesight', cost: 120, desc: 'Enables Camo Bloon detection.', apply: t => { t.camoDetect = true; t.range += 15; } },
            { name: 'Spike-o-Pult', cost: 500, desc: 'Flings heavy spiked balls that plow through 18 bloons!', apply: t => { t.isSpikePult = true; t.pierce = 18; t.damage = 2; t.range += 20; } }
        ],
        upgrades2: [
            { name: 'Sharp Darts', cost: 140, desc: 'Darts pop 2 bloons each.', apply: t => { t.pierce += 1; } },
            { name: 'Razor Darts', cost: 170, desc: 'Darts pop 3 bloons each.', apply: t => { t.pierce += 1; } },
            { name: 'Super Fan Club', cost: 2500, desc: 'Triple dart barrage at hyper speed!', apply: t => { t.tripleDart = true; t.fireRate *= 2.5; } }
        ]
    },
    tack_shooter: {
        id: 'tack_shooter',
        name: 'Tack Shooter',
        cost: 250,
        range: 75,
        fireRate: 0.95,
        pierce: 1,
        damage: 1,
        attackType: 'sharp',
        sprite: 'tack_shooter',
        desc: 'Shoots a burst of 8 tacks in all directions. Best placed in curves.',
        upgrades1: [
            { name: 'Faster Shooting', cost: 100, desc: '+30% attack speed.', apply: t => { t.fireRate *= 1.3; } },
            { name: 'Super Fast', cost: 150, desc: '+50% attack speed.', apply: t => { t.fireRate *= 1.5; } },
            { name: 'Ring of Fire', cost: 2500, desc: 'Erupts with a continuous ring of flame! Melts Lead bloons.', apply: t => { t.isRingOfFire = true; t.sprite = 'ring_of_fire'; t.attackType = 'fire'; t.damage = 2; t.pierce = 25; } }
        ],
        upgrades2: [
            { name: 'Extra Range', cost: 100, desc: '+20% range.', apply: t => { t.range *= 1.2; } },
            { name: 'Super Range', cost: 150, desc: '+35% range.', apply: t => { t.range *= 1.35; } },
            { name: 'Blade Shooter', cost: 650, desc: 'Shoots 8 razor blades that slice 3 bloons each!', apply: t => { t.isBlade = true; t.sprite = 'blade_shooter'; t.pierce = 3; } }
        ]
    },
    sniper_monkey: {
        id: 'sniper_monkey',
        name: 'Sniper Monkey',
        cost: 350,
        range: 1200, // Infinite range
        fireRate: 0.5,
        pierce: 1,
        damage: 2,
        attackType: 'sharp',
        sprite: 'sniper_monkey',
        desc: 'Infinite range rifle. Snipes bloons anywhere on the map.',
        upgrades1: [
            { name: 'Full Metal Jacket', cost: 300, desc: 'Pops Lead bloons and pops 4 layers in 1 shot!', apply: t => { t.damage = 4; t.canPopLead = true; } },
            { name: 'Point Five Oh', cost: 750, desc: 'Heavy high-caliber round pops 7 layers.', apply: t => { t.damage = 7; } },
            { name: 'Deadly Precision', cost: 1800, desc: 'Deals 20 damage per shot! Obliterates Ceramics and shreds blimps.', apply: t => { t.damage = 20; } }
        ],
        upgrades2: [
            { name: 'Night Vision', cost: 180, desc: 'Detects and targets Camo bloons.', apply: t => { t.camoDetect = true; } },
            { name: 'Fast Firing', cost: 250, desc: '+40% firing rate.', apply: t => { t.fireRate *= 1.4; } },
            { name: 'Semi-Automatic', cost: 2200, desc: 'Fires 3x faster in rapid semi-auto bursts!', apply: t => { t.fireRate *= 3.0; } }
        ]
    },
    boomerang_monkey: {
        id: 'boomerang_monkey',
        name: 'Boomerang Monkey',
        cost: 380,
        range: 130,
        fireRate: 1.1,
        pierce: 3,
        damage: 1,
        attackType: 'sharp',
        sprite: 'boomerang_monkey',
        desc: 'Throws curved boomerangs that loop around and hit multiple bloons.',
        upgrades1: [
            { name: 'Multi-Target', cost: 180, desc: 'Boomerang hits up to 7 bloons.', apply: t => { t.pierce = 7; } },
            { name: 'Glaive Thrower', cost: 300, desc: 'Throws spinning razor glaives with pierce 12.', apply: t => { t.sprite = 'glaive_thrower'; t.isGlaive = true; t.pierce = 12; } },
            { name: 'Glaive Ricochet', cost: 1400, desc: 'Glaives automatically bounce between up to 40 bloons!', apply: t => { t.isRicochet = true; } }
        ],
        upgrades2: [
            { name: 'Sonic Boom', cost: 150, desc: 'Pops Lead and Frozen bloons.', apply: t => { t.canPopLead = true; t.canPopFrozen = true; } },
            { name: 'Red Hot Rangs', cost: 250, desc: 'Pops 2 layers per hit.', apply: t => { t.damage = 2; } },
            { name: 'Bionic Boomer', cost: 1600, desc: 'Cybernetic arm doubles throwing speed!', apply: t => { t.fireRate *= 2.2; } }
        ]
    },
    bomb_tower: {
        id: 'bomb_tower',
        name: 'Bomb Tower',
        cost: 400,
        range: 125,
        fireRate: 0.7,
        pierce: 15,
        damage: 1,
        attackType: 'explosion',
        sprite: 'bomb_tower',
        desc: 'Launches explosive shells with area-of-effect damage. Pops Lead.',
        upgrades1: [
            { name: 'Bigger Bombs', cost: 200, desc: '+40% blast radius.', apply: t => { t.blastRadius = 60; } },
            { name: 'Cluster Bombs', cost: 600, desc: 'Bombs spawn 6 secondary explosive bomblets on impact!', apply: t => { t.cluster = true; } },
            { name: 'Bloon Buster', cost: 1200, desc: 'Bombs deal 2 damage per hit across the blast.', apply: t => { t.damage = 2; } }
        ],
        upgrades2: [
            { name: 'Faster Firing', cost: 180, desc: '+35% firing rate.', apply: t => { t.fireRate *= 1.35; } },
            { name: 'Missile Launcher', cost: 250, desc: 'Fires high-speed missiles with extended range.', apply: t => { t.sprite = 'missile_launcher'; t.isMissile = true; t.range += 25; } },
            { name: 'MOAB Mauler', cost: 900, desc: 'Shark-jaw cannon deals x10 damage to MOAB and BFB blimps!', apply: t => { t.sprite = 'moab_mauler'; t.moabDamageMultiplier = 10; } }
        ]
    },
    ice_tower: {
        id: 'ice_tower',
        name: 'Ice Tower',
        cost: 300,
        range: 75,
        fireRate: 0.85,
        pierce: 20,
        damage: 0,
        attackType: 'freeze',
        sprite: 'ice_tower',
        desc: 'Freezes all bloons in radius, completely stopping them in their tracks.',
        upgrades1: [
            { name: 'Enhanced Freeze', cost: 190, desc: 'Bloons stay frozen longer (+50% duration).', apply: t => { t.freezeDuration = 2.2; } },
            { name: 'Deep Freeze', cost: 240, desc: 'Freezes 2 layers deep.', apply: t => { t.deepFreeze = true; } },
            { name: 'Viral Frost', cost: 3500, desc: 'When frozen bloons pop, frost spreads to nearby bloons!', apply: t => { t.viralFrost = true; } }
        ],
        upgrades2: [
            { name: 'Ice Shards', cost: 350, desc: 'Freezing pops 1 layer of bloons.', apply: t => { t.damage = 1; } },
            { name: 'Frostbite', cost: 500, desc: 'Allows sharp darts to pop frozen bloons!', apply: t => { t.frostbite = true; } },
            { name: 'Arctic Wind', cost: 4000, desc: 'Chilling blizzard permanently slows all bloons in huge radius by 60%!', apply: t => { t.sprite = 'arctic_wind'; t.range = 140; t.isArctic = true; } }
        ]
    },
    glue_gunner: {
        id: 'glue_gunner',
        name: 'Glue Gunner',
        cost: 270,
        range: 115,
        fireRate: 0.9,
        pierce: 1,
        damage: 0,
        attackType: 'glue',
        sprite: 'glue_gunner',
        desc: 'Sprays sticky glue that dramatically slows bloons down.',
        upgrades1: [
            { name: 'Stickier Glue', cost: 110, desc: 'Slows bloons by 75% instead of 50%.', apply: t => { t.glueSlow = 0.75; } },
            { name: 'Glue Splatter', cost: 350, desc: 'Splashes glue onto up to 6 bloons at once.', apply: t => { t.pierce = 6; } },
            { name: 'Glue Hose', cost: 1200, desc: 'Extreme rapid-fire continuous glue stream!', apply: t => { t.fireRate *= 2.8; } }
        ],
        upgrades2: [
            { name: 'Corrosive Glue', cost: 290, desc: 'Glue dissolves 1 layer every 2s (melts Lead)!', apply: t => { t.corrosive = true; } },
            { name: 'Glue Soak', cost: 350, desc: 'Glue persists on bloons through layer pops.', apply: t => { t.glueSoak = true; } },
            { name: 'Bloon Dissolver', cost: 2800, desc: 'Super potent acid dissolves 3 layers every second!', apply: t => { t.bloonDissolver = true; } }
        ]
    },
    super_monkey: {
        id: 'super_monkey',
        name: 'Super Monkey',
        cost: 3200,
        range: 140,
        fireRate: 8.0, // Hyper fast
        pierce: 1,
        damage: 1,
        attackType: 'sharp',
        sprite: 'super_monkey',
        desc: 'Heroic monkey with extreme attack speed. The ultimate defender.',
        upgrades1: [
            { name: 'Laser Blasts', cost: 3000, desc: 'Fires piercing laser rays, pops 2 layers, pops Frozen.', apply: t => { t.sprite = 'laser_super_monkey'; t.isLaser = true; t.pierce = 2; t.damage = 2; t.canPopFrozen = true; } },
            { name: 'Plasma Blasts', cost: 4500, desc: 'Fires plasma orbs, pops 3 layers, pops Lead and Frozen.', apply: t => { t.sprite = 'plasma_super_monkey'; t.isPlasma = true; t.pierce = 3; t.damage = 3; t.canPopLead = true; } },
            { name: 'Sun God', cost: 18000, desc: 'Transcendent Aztec solar deity firing solar beams of absolute annihilation!', apply: t => { t.sprite = 'sun_god'; t.isSunGod = true; t.pierce = 15; t.damage = 5; t.range = 220; } }
        ],
        upgrades2: [
            { name: 'Super Range', cost: 1000, desc: '+30% range.', apply: t => { t.range *= 1.3; } },
            { name: 'Epic Range', cost: 1400, desc: '+40% range and detects Camo.', apply: t => { t.range *= 1.4; t.camoDetect = true; } },
            { name: 'Robo-Monkey', cost: 8000, desc: 'Dual cybernetic arm cannons target 2 directions at once!', apply: t => { t.isRobo = true; t.fireRate *= 1.8; } }
        ]
    },
    mortar_monkey: {
        id: 'mortar_monkey',
        name: 'Mortar Monkey',
        cost: 750,
        range: 1200, // Infinite range
        fireRate: 0.45,
        pierce: 40,
        damage: 2,
        attackType: 'explosion',
        sprite: 'mortar_monkey',
        desc: 'Artillery mortar tube. Click anywhere to reposition its target reticle!',
        upgrades1: [
            { name: 'Bigger Blast', cost: 300, desc: '+50% explosion blast radius.', apply: t => { t.blastRadius = 65; } },
            { name: 'The Big One', cost: 6000, desc: 'Massive nuclear-scale high explosive shell pops 5 layers!', apply: t => { t.blastRadius = 110; t.damage = 5; } },
            { name: 'Shell Shock', cost: 1200, desc: 'Blasts stun bloons briefly.', apply: t => { t.stuns = true; } }
        ],
        upgrades2: [
            { name: 'Rapid Reload', cost: 250, desc: '+35% firing rate.', apply: t => { t.fireRate *= 1.35; } },
            { name: 'Burny Stuff', cost: 500, desc: 'Ignites bloons on fire dealing damage over time.', apply: t => { t.burns = true; } },
            { name: 'Signal Flare', cost: 800, desc: 'Removes Camo status from bloons in blast!', apply: t => { t.decamo = true; } }
        ]
    },
    banana_farm: {
        id: 'banana_farm',
        name: 'Banana Farm',
        cost: 850,
        range: 60,
        fireRate: 0,
        pierce: 0,
        damage: 0,
        sprite: 'banana_farm',
        desc: 'Generates valuable bunches of bananas. Hover or click to collect cash!',
        upgrades1: [
            { name: 'More Bananas', cost: 300, desc: 'Generates 6 bunches of bananas per round ($120).', apply: t => { t.bananasPerRound = 6; } },
            { name: 'Banana Plantation', cost: 1400, desc: 'Generates 12 bunches per round ($240).', apply: t => { t.bananasPerRound = 12; } },
            { name: 'Banana Republic', cost: 3800, desc: 'Generates 20 bunches per round ($500).', apply: t => { t.bananasPerRound = 20; } }
        ],
        upgrades2: [
            { name: 'Long Life', cost: 100, desc: 'Bananas stay on ground 50% longer before spoiling.', apply: t => { t.bananaLife = 18; } },
            { name: 'Banana Salvage', cost: 200, desc: 'Automatically collects missed bananas at 50% value.', apply: t => { t.autoSalvage = true; } },
            { name: 'Banana Bank', cost: 4200, desc: 'Banks generate $600 interest cash at end of round!', apply: t => { t.bankBonus = 600; } }
        ]
    },
    spike_factory: {
        id: 'spike_factory',
        name: 'Spike Factory',
        cost: 700,
        range: 90,
        fireRate: 0.35,
        pierce: 10,
        damage: 1,
        sprite: 'spike_factory',
        desc: 'Lays piles of sharp road spikes onto the nearest track segments.',
        upgrades1: [
            { name: 'Bigger Stacks', cost: 300, desc: 'Lays 10 spikes per pile.', apply: t => { t.spikesPerPile = 10; } },
            { name: 'White Hot Spikes', cost: 650, desc: 'Spikes glow white-hot and pop Lead bloons!', apply: t => { t.canPopLead = true; } },
            { name: 'Spiked Mines', cost: 4000, desc: 'Spike piles explode when depleted, destroying bloons!', apply: t => { t.explodesOnEnd = true; } }
        ],
        upgrades2: [
            { name: 'Faster Production', cost: 250, desc: '+35% spike drop rate.', apply: t => { t.fireRate *= 1.35; } },
            { name: 'Even Faster', cost: 450, desc: '+50% drop rate.', apply: t => { t.fireRate *= 1.5; } },
            { name: 'Spike Storm', cost: 4500, desc: 'Spits spikes at extreme machine-gun velocity!', apply: t => { t.fireRate *= 2.5; } }
        ]
    },
    monkey_buccaneer: {
        id: 'monkey_buccaneer',
        name: 'Monkey Buccaneer',
        cost: 500,
        range: 130,
        fireRate: 1.0,
        pierce: 2,
        damage: 1,
        attackType: 'sharp',
        isWater: true,
        sprite: 'monkey_buccaneer',
        desc: 'Pirate ship with broadside cannons. Must be placed in water!',
        upgrades1: [
            { name: 'Faster Firing', cost: 180, desc: '+35% firing rate.', apply: t => { t.fireRate *= 1.35; } },
            { name: 'Cannon Ship', cost: 850, desc: 'Adds a center explosive cannon that fires bombs! Pops Lead.', apply: t => { t.hasCannon = true; } },
            { name: 'Pirate Lord', cost: 4500, desc: 'Equips heavy battle cannons that shred blimps!', apply: t => { t.damage = 3; t.pierce = 8; } }
        ],
        upgrades2: [
            { name: 'Longer Range', cost: 150, desc: '+30% range.', apply: t => { t.range *= 1.3; } },
            { name: 'Grape Shot', cost: 450, desc: 'Fires a spread of 5 sharp grape projectiles!', apply: t => { t.grapeShot = true; } },
            { name: 'Crow\'s Nest', cost: 350, desc: 'Enables Camo bloon detection.', apply: t => { t.camoDetect = true; } }
        ]
    }
};

class Tower {
    constructor(typeId, x, y) {
        this.typeId = typeId;
        this.def = TOWER_DEFINITIONS[typeId];
        this.name = this.def.name;
        this.x = x;
        this.y = y;
        this.radius = 22;
        this.range = this.def.range;
        this.fireRate = this.def.fireRate;
        this.pierce = this.def.pierce;
        this.damage = this.def.damage;
        this.attackType = this.def.attackType || 'sharp';
        this.sprite = this.def.sprite;
        this.cost = this.def.cost;
        this.investedCash = this.cost;

        this.angle = 0;
        this.cooldown = 0;
        this.pops = 0;
        this.targetPriority = 'first'; // 'first', 'last', 'close', 'strong'
        this.camoDetect = false;
        this.canPopLead = false;
        this.canPopFrozen = false;
        this.blastRadius = 45;

        // Upgrade levels
        this.tierPath1 = 0;
        this.tierPath2 = 0;

        // Specialized fields
        this.isSpikePult = false;
        this.tripleDart = false;
        this.isBlade = false;
        this.isRingOfFire = false;
        this.isMissile = false;
        this.moabDamageMultiplier = 1;
        this.cluster = false;
        this.isGlaive = false;
        this.isRicochet = false;
        this.freezeDuration = 1.5;
        this.glueSlow = 0.5;
        this.corrosive = false;
        this.isLaser = false;
        this.isPlasma = false;
        this.isSunGod = false;

        // Mortar reticle
        if (this.typeId === 'mortar_monkey') {
            this.reticleX = 480;
            this.reticleY = 270;
        }

        // Banana farm
        if (this.typeId === 'banana_farm') {
            this.bananasPerRound = 4;
            this.bananaTimer = 0;
        }

        // Spike factory
        if (this.typeId === 'spike_factory') {
            this.spikesPerPile = 5;
        }
    }

    // Buy upgrade
    upgrade(path) {
        if (path === 1 && this.tierPath1 < 3) {
            // Restriction: max 3 on one path, max 2 on other
            if (this.tierPath1 === 2 && this.tierPath2 > 2) return false;
            const up = this.def.upgrades1[this.tierPath1];
            up.apply(this);
            this.investedCash += up.cost;
            this.tierPath1++;
            return true;
        } else if (path === 2 && this.tierPath2 < 3) {
            if (this.tierPath2 === 2 && this.tierPath1 > 2) return false;
            const up = this.def.upgrades2[this.tierPath2];
            up.apply(this);
            this.investedCash += up.cost;
            this.tierPath2++;
            return true;
        }
        return false;
    }

    getNextUpgrade(path) {
        if (path === 1 && this.tierPath1 < 3) {
            if (this.tierPath1 === 2 && this.tierPath2 > 2) return null;
            return this.def.upgrades1[this.tierPath1];
        }
        if (path === 2 && this.tierPath2 < 3) {
            if (this.tierPath2 === 2 && this.tierPath1 > 2) return null;
            return this.def.upgrades2[this.tierPath2];
        }
        return null;
    }

    // Sell value (80% of total invested)
    getSellValue() {
        return Math.floor(this.investedCash * 0.8);
    }

    // Find target bloon according to priority
    findTarget(game) {
        let candidates = [];
        for (const b of game.bloons) {
            if (b.markedForRemoval) continue;
            if (b.camo && !this.camoDetect) continue;

            const d = Math.hypot(b.x - this.x, b.y - this.y);
            if (d <= this.range) {
                candidates.push({ bloon: b, distToTower: d, trackDist: b.distance, tier: b.def.tier, hp: b.hp || b.def.tier });
            }
        }

        if (candidates.length === 0) return null;

        if (this.targetPriority === 'first') {
            candidates.sort((a, b) => b.trackDist - a.trackDist);
        } else if (this.targetPriority === 'last') {
            candidates.sort((a, b) => a.trackDist - b.trackDist);
        } else if (this.targetPriority === 'close') {
            candidates.sort((a, b) => a.distToTower - b.distToTower);
        } else if (this.targetPriority === 'strong') {
            candidates.sort((a, b) => (b.hp !== a.hp) ? (b.hp - a.hp) : (b.trackDist - a.trackDist));
        }

        return candidates[0].bloon;
    }

    update(dt, game) {
        // Banana Farm: drops bananas periodically
        if (this.typeId === 'banana_farm') {
            if (game.roundInProgress) {
                this.bananaTimer += dt;
                const interval = 2.5;
                if (this.bananaTimer >= interval) {
                    this.bananaTimer = 0;
                    const ox = (Math.random() - 0.5) * 60;
                    const oy = (Math.random() - 0.5) * 60;
                    game.droppedBananas.push(new DroppedBanana(this.x + ox, this.y + oy, 25));
                }
            }
            return;
        }

        // Spike Factory: drops spikes on nearest track
        if (this.typeId === 'spike_factory') {
            this.cooldown -= dt;
            if (this.cooldown <= 0 && game.roundInProgress) {
                this.cooldown = 1.0 / this.fireRate;
                // Find closest point on path within range
                let bestPt = null;
                let bestD = this.range;
                for (let dist = 0; dist < game.gameMap.totalLength; dist += 20) {
                    const pt = game.gameMap.getPointAtDistance(dist);
                    const d = Math.hypot(this.x - pt.x, this.y - pt.y);
                    if (d < bestD) {
                        bestD = d;
                        bestPt = pt;
                    }
                }
                if (bestPt) {
                    const item = new TrackItem('road_spikes', bestPt.x, bestPt.y);
                    item.spikesRemaining = this.spikesPerPile;
                    game.trackItems.push(item);
                }
            }
            return;
        }

        // Tack Shooter / Ring of Fire: triggers when any bloon in range
        if (this.typeId === 'tack_shooter') {
            this.cooldown -= dt;
            const target = this.findTarget(game);
            if (target && this.cooldown <= 0) {
                this.cooldown = 1.0 / this.fireRate;
                window.soundEngine.playDart();
                if (this.isRingOfFire) {
                    // Fire ring blast
                    for (let a = 0; a < 360; a += 30) {
                        const rad = Math.radians ? Math.radians(a) : (a * Math.PI / 180);
                        game.projectiles.push(new Projectile({
                            tower: this,
                            x: this.x,
                            y: this.y,
                            type: 'plasma_orb',
                            damage: this.damage,
                            pierce: this.pierce,
                            speed: 320,
                            range: this.range,
                            angle: rad,
                            attackType: 'fire',
                            canPopLead: true
                        }));
                    }
                } else {
                    // 8 Tacks or Blades
                    const projType = this.isBlade ? 'blade' : 'tack';
                    for (let a = 0; a < 360; a += 45) {
                        const rad = a * Math.PI / 180;
                        game.projectiles.push(new Projectile({
                            tower: this,
                            x: this.x,
                            y: this.y,
                            type: projType,
                            damage: this.damage,
                            pierce: this.pierce,
                            speed: 350,
                            range: this.range,
                            angle: rad,
                            attackType: this.attackType
                        }));
                    }
                }
            }
            return;
        }

        // Ice Tower: freezes nearby bloons in radial pulse
        if (this.typeId === 'ice_tower') {
            this.cooldown -= dt;
            const target = this.findTarget(game);
            if (target && this.cooldown <= 0) {
                this.cooldown = 1.0 / this.fireRate;
                window.soundEngine.playFreeze();
                // Freeze all bloons in range
                for (const b of game.bloons) {
                    if (b.markedForRemoval) continue;
                    if (b.camo && !this.camoDetect) continue;
                    if (Math.hypot(b.x - this.x, b.y - this.y) <= this.range) {
                        b.applyFreeze(this.freezeDuration);
                        if (this.damage > 0) {
                            const res = b.takeDamage(this.damage, 'ice', this);
                            if (res.popped) {
                                game.addCash(res.cash);
                                this.pops += res.popCount;
                                for (const c of res.children) game.bloons.push(c);
                            }
                        }
                    }
                }
            }
            return;
        }

        // Mortar Monkey: shells target reticle
        if (this.typeId === 'mortar_monkey') {
            this.cooldown -= dt;
            if (this.cooldown <= 0 && game.roundInProgress) {
                this.cooldown = 1.0 / this.fireRate;
                window.soundEngine.playDart();
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.reticleX,
                    y: this.reticleY,
                    type: 'mortar_shell',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 0,
                    range: 10,
                    attackType: 'explosion',
                    isExplosive: true,
                    blastRadius: this.blastRadius,
                    camo: true
                }));
            }
            return;
        }

        // Standard Directed Targeting Towers (Dart, Sniper, Boomerang, Bomb, Glue, Super, Buccaneer)
        this.cooldown -= dt;
        const target = this.findTarget(game);
        if (!target) return;

        // Aim at target
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);

        if (this.cooldown <= 0) {
            this.cooldown = 1.0 / this.fireRate;
            this.fireAt(target, game);
        }
    }

    fireAt(target, game) {
        // 1. Sniper Monkey (Instant hitscan)
        if (this.typeId === 'sniper_monkey') {
            window.soundEngine.playDart();
            let effectiveDmg = this.damage;
            if (target.isBlimp) effectiveDmg *= 2;
            const res = target.takeDamage(effectiveDmg, this.canPopLead ? 'plasma' : 'sharp', this);
            if (res.popped) {
                game.addCash(res.cash);
                this.pops += res.popCount;
                window.soundEngine.playPop();
                game.spawnPopFX(target.x, target.y);
                for (const c of res.children) game.bloons.push(c);
            }
            return;
        }

        // 2. Dart Monkey
        if (this.typeId === 'dart_monkey') {
            window.soundEngine.playDart();
            if (this.tripleDart) {
                for (const offsetAngle of [-0.2, 0, 0.2]) {
                    game.projectiles.push(new Projectile({
                        tower: this,
                        x: this.x,
                        y: this.y,
                        type: 'dart',
                        damage: this.damage,
                        pierce: this.pierce,
                        speed: 460,
                        range: this.range,
                        angle: this.angle + offsetAngle,
                        camo: this.camoDetect
                    }));
                }
            } else {
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.x,
                    y: this.y,
                    type: 'dart',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 440,
                    range: this.range,
                    angle: this.angle,
                    camo: this.camoDetect
                }));
            }
            return;
        }

        // 3. Boomerang Monkey
        if (this.typeId === 'boomerang_monkey') {
            window.soundEngine.playDart();
            game.projectiles.push(new Projectile({
                tower: this,
                x: this.x,
                y: this.y,
                type: this.isGlaive ? 'glaive' : 'boomerang',
                damage: this.damage,
                pierce: this.pierce,
                speed: 360,
                range: this.range,
                angle: this.angle,
                isBoomerang: !this.isRicochet,
                isGlaive: this.isRicochet,
                canPopLead: this.canPopLead,
                canPopFrozen: this.canPopFrozen
            }));
            return;
        }

        // 4. Bomb Tower
        if (this.typeId === 'bomb_tower') {
            window.soundEngine.playDart();
            game.projectiles.push(new Projectile({
                tower: this,
                x: this.x,
                y: this.y,
                targetX: target.x,
                targetY: target.y,
                type: this.isMissile ? 'missile' : 'bomb',
                damage: this.damage,
                pierce: this.pierce,
                speed: this.isMissile ? 500 : 380,
                range: this.range * 1.2,
                angle: this.angle,
                attackType: 'explosion',
                isExplosive: true,
                blastRadius: this.blastRadius,
                cluster: this.cluster
            }));
            return;
        }

        // 5. Glue Gunner
        if (this.typeId === 'glue_gunner') {
            window.soundEngine.playDart();
            game.projectiles.push(new Projectile({
                tower: this,
                x: this.x,
                y: this.y,
                type: 'glue_splat',
                damage: 0,
                pierce: this.pierce,
                speed: 400,
                range: this.range,
                angle: this.angle,
                glues: true,
                glueSlow: this.glueSlow,
                corrosive: this.corrosive
            }));
            return;
        }

        // 6. Super Monkey
        if (this.typeId === 'super_monkey') {
            if (this.isSunGod) {
                window.soundEngine.playLaser();
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.x,
                    y: this.y,
                    type: 'sun_beam',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 700,
                    range: this.range,
                    angle: this.angle,
                    canPopLead: true,
                    canPopFrozen: true,
                    camo: this.camoDetect
                }));
            } else if (this.isPlasma) {
                window.soundEngine.playPlasma();
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.x,
                    y: this.y,
                    type: 'plasma_orb',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 600,
                    range: this.range,
                    angle: this.angle,
                    canPopLead: true,
                    canPopFrozen: true,
                    camo: this.camoDetect
                }));
            } else if (this.isLaser) {
                window.soundEngine.playLaser();
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.x,
                    y: this.y,
                    type: 'laser_beam',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 650,
                    range: this.range,
                    angle: this.angle,
                    canPopFrozen: true,
                    camo: this.camoDetect
                }));
            } else {
                window.soundEngine.playDart();
                game.projectiles.push(new Projectile({
                    tower: this,
                    x: this.x,
                    y: this.y,
                    type: 'dart',
                    damage: this.damage,
                    pierce: this.pierce,
                    speed: 550,
                    range: this.range,
                    angle: this.angle,
                    camo: this.camoDetect
                }));
            }
            return;
        }

        // 7. Monkey Buccaneer (Water)
        if (this.typeId === 'monkey_buccaneer') {
            window.soundEngine.playDart();
            // Dual broadside cannons firing port & starboard + center dart
            game.projectiles.push(new Projectile({
                tower: this,
                x: this.x,
                y: this.y,
                type: 'dart',
                damage: this.damage,
                pierce: this.pierce,
                speed: 450,
                range: this.range,
                angle: this.angle,
                camo: this.camoDetect
            }));
            if (this.grapeShot) {
                for (const g of [-0.3, -0.15, 0.15, 0.3]) {
                    game.projectiles.push(new Projectile({
                        tower: this,
                        x: this.x,
                        y: this.y,
                        type: 'tack',
                        damage: 1,
                        pierce: 1,
                        speed: 420,
                        range: this.range * 0.8,
                        angle: this.angle + g
                    }));
                }
            }
            return;
        }
    }

    render(ctx, isSelected = false) {
        // Draw selection / range circle
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Mortar reticle indicator
            if (this.typeId === 'mortar_monkey' && projImageCache.mortar_reticle.complete) {
                ctx.drawImage(projImageCache.mortar_reticle, this.reticleX - 24, this.reticleY - 24, 48, 48);
            }
        }

        ctx.save();
        ctx.translate(this.x, this.y);

        // Directional rotation for aiming towers
        const rotatableTowers = ['dart_monkey', 'bomb_tower', 'sniper_monkey', 'super_monkey', 'glue_gunner', 'boomerang_monkey'];
        if (rotatableTowers.includes(this.typeId)) {
            ctx.rotate(this.angle);
        }

        const img = towerImageCache[this.sprite];
        if (img && img.complete) {
            ctx.drawImage(img, -24, -24, 48, 48);
        } else {
            // Fallback
            ctx.fillStyle = '#8b5a2b';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
