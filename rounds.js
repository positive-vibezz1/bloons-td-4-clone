// Round waves, spawn sequences, and difficulty progression

const ROUND_DEFINITIONS = [
    // Round 1
    [{ type: 'red', count: 20, interval: 0.7, delay: 0 }],
    // Round 2
    [{ type: 'red', count: 35, interval: 0.5, delay: 0 }],
    // Round 3
    [
        { type: 'red', count: 25, interval: 0.5, delay: 0 },
        { type: 'blue', count: 5, interval: 0.8, delay: 8 }
    ],
    // Round 4
    [
        { type: 'red', count: 30, interval: 0.4, delay: 0 },
        { type: 'blue', count: 15, interval: 0.6, delay: 6 }
    ],
    // Round 5
    [
        { type: 'blue', count: 25, interval: 0.5, delay: 0 },
        { type: 'green', count: 5, interval: 0.9, delay: 8 }
    ],
    // Round 6
    [
        { type: 'red', count: 20, interval: 0.3, delay: 0 },
        { type: 'blue', count: 20, interval: 0.5, delay: 4 },
        { type: 'green', count: 12, interval: 0.7, delay: 10 }
    ],
    // Round 7
    [
        { type: 'blue', count: 25, interval: 0.4, delay: 0 },
        { type: 'green', count: 20, interval: 0.5, delay: 6 }
    ],
    // Round 8
    [
        { type: 'green', count: 25, interval: 0.4, delay: 0 },
        { type: 'yellow', count: 6, interval: 0.8, delay: 8 }
    ],
    // Round 9
    [{ type: 'green', count: 35, interval: 0.35, delay: 0 }],
    // Round 10: Blue rush
    [{ type: 'blue', count: 80, interval: 0.2, delay: 0 }],
    // Round 11
    [
        { type: 'green', count: 20, interval: 0.3, delay: 0 },
        { type: 'yellow', count: 12, interval: 0.6, delay: 5 }
    ],
    // Round 12
    [{ type: 'yellow', count: 20, interval: 0.5, delay: 0 }],
    // Round 13
    [
        { type: 'blue', count: 50, interval: 0.2, delay: 0 },
        { type: 'green', count: 30, interval: 0.3, delay: 6 }
    ],
    // Round 14
    [
        { type: 'yellow', count: 15, interval: 0.4, delay: 0 },
        { type: 'pink', count: 8, interval: 0.6, delay: 6 }
    ],
    // Round 15: Pink rush!
    [{ type: 'pink', count: 25, interval: 0.25, delay: 0 }],
    // Round 16
    [{ type: 'yellow', count: 40, interval: 0.25, delay: 0 }],
    // Round 17: Black bloons (Bomb immunity)
    [
        { type: 'yellow', count: 20, interval: 0.3, delay: 0 },
        { type: 'black', count: 12, interval: 0.6, delay: 4 }
    ],
    // Round 18
    [{ type: 'green', count: 80, interval: 0.15, delay: 0 }],
    // Round 19: White bloons (Freeze immunity)
    [
        { type: 'pink', count: 15, interval: 0.3, delay: 0 },
        { type: 'white', count: 15, interval: 0.5, delay: 4 }
    ],
    // Round 20
    [
        { type: 'black', count: 10, interval: 0.4, delay: 0 },
        { type: 'white', count: 10, interval: 0.4, delay: 3 }
    ],
    // Round 21
    [
        { type: 'yellow', count: 40, interval: 0.2, delay: 0 },
        { type: 'pink', count: 20, interval: 0.25, delay: 5 }
    ],
    // Round 22
    [{ type: 'white', count: 20, interval: 0.35, delay: 0 }],
    // Round 23: Black and White mixture
    [
        { type: 'black', count: 14, interval: 0.3, delay: 0 },
        { type: 'white', count: 14, interval: 0.3, delay: 3 }
    ],
    // Round 24: Classic Camo Green Bloon stealth test!
    [
        { type: 'blue', count: 20, interval: 0.3, delay: 0 },
        { type: 'green', count: 1, interval: 1.0, delay: 3, camo: true }
    ],
    // Round 25: Camo pinks
    [
        { type: 'pink', count: 20, interval: 0.25, delay: 0 },
        { type: 'pink', count: 8, interval: 0.5, delay: 5, camo: true }
    ],
    // Round 26
    [{ type: 'pink', count: 50, interval: 0.18, delay: 0 }],
    // Round 27
    [
        { type: 'blue', count: 100, interval: 0.1, delay: 0 },
        { type: 'green', count: 60, interval: 0.15, delay: 6 }
    ],
    // Round 28: LEAD BLOONS (Sharp immunity!)
    [
        { type: 'lead', count: 6, interval: 1.0, delay: 0 },
        { type: 'yellow', count: 20, interval: 0.25, delay: 4 }
    ],
    // Round 29: Regrow introduction
    [
        { type: 'yellow', count: 30, interval: 0.2, delay: 0 },
        { type: 'yellow', count: 15, interval: 0.4, delay: 4, regrow: true }
    ],
    // Round 30: Heavy Lead wave
    [
        { type: 'lead', count: 12, interval: 0.8, delay: 0 }
    ],
    // Round 31: ZEBRA BLOONS (Immune to bombs AND ice!)
    [
        { type: 'zebra', count: 10, interval: 0.7, delay: 0 }
    ],
    // Round 32
    [
        { type: 'black', count: 20, interval: 0.25, delay: 0 },
        { type: 'white', count: 20, interval: 0.25, delay: 4 }
    ],
    // Round 33: Fast Camo rush
    [
        { type: 'pink', count: 25, interval: 0.2, delay: 0, camo: true }
    ],
    // Round 34: Yellow swarm
    [{ type: 'yellow', count: 140, interval: 0.1, delay: 0 }],
    // Round 35
    [
        { type: 'pink', count: 35, interval: 0.18, delay: 0 },
        { type: 'black', count: 25, interval: 0.25, delay: 4 },
        { type: 'white', count: 25, interval: 0.25, delay: 7 }
    ],
    // Round 36: Regrow swarm
    [
        { type: 'pink', count: 100, interval: 0.12, delay: 0 },
        { type: 'green', count: 25, interval: 0.2, delay: 6, regrow: true }
    ],
    // Round 37: Leads and Zebras
    [
        { type: 'lead', count: 25, interval: 0.5, delay: 0 },
        { type: 'zebra', count: 15, interval: 0.6, delay: 6 }
    ],
    // Round 38
    [
        { type: 'white', count: 42, interval: 0.2, delay: 0 },
        { type: 'zebra', count: 18, interval: 0.4, delay: 5 }
    ],
    // Round 39: RAINBOW BLOONS!
    [
        { type: 'rainbow', count: 10, interval: 0.8, delay: 0 }
    ],
    // Round 40: Rainbows & First Ceramics!
    [
        { type: 'rainbow', count: 8, interval: 0.7, delay: 0 },
        { type: 'ceramic', count: 4, interval: 1.5, delay: 6 }
    ],
    // Round 41
    [
        { type: 'black', count: 60, interval: 0.15, delay: 0 },
        { type: 'white', count: 60, interval: 0.15, delay: 5 }
    ],
    // Round 42: Camo Rainbows
    [
        { type: 'rainbow', count: 8, interval: 0.6, delay: 0, camo: true }
    ],
    // Round 43: Rainbows and Leads
    [
        { type: 'rainbow', count: 12, interval: 0.5, delay: 0 },
        { type: 'lead', count: 15, interval: 0.4, delay: 4 }
    ],
    // Round 44: Zebra army
    [{ type: 'zebra', count: 45, interval: 0.25, delay: 0 }],
    // Round 45: Ceramic assault
    [
        { type: 'ceramic', count: 8, interval: 1.2, delay: 0 },
        { type: 'pink', count: 120, interval: 0.08, delay: 4 }
    ],
    // Round 46: THE MOAB BOSS TEST! (Massive Ornary Air Blimp)
    [
        { type: 'moab', count: 1, interval: 1.0, delay: 0 }
    ],
    // Round 47: Ceramics & Camo Pinks
    [
        { type: 'ceramic', count: 12, interval: 0.8, delay: 0 },
        { type: 'pink', count: 40, interval: 0.15, delay: 5, camo: true }
    ],
    // Round 48: Rainbow & Lead stampede
    [
        { type: 'rainbow', count: 35, interval: 0.35, delay: 0 },
        { type: 'lead', count: 30, interval: 0.3, delay: 6 }
    ],
    // Round 49: Heavy Ceramic rush
    [
        { type: 'ceramic', count: 18, interval: 0.6, delay: 0 },
        { type: 'rainbow', count: 50, interval: 0.25, delay: 6 }
    ],
    // Round 50: Dual MOABs!
    [
        { type: 'moab', count: 2, interval: 3.0, delay: 0 },
        { type: 'ceramic', count: 10, interval: 0.8, delay: 5 }
    ],
    // Round 55: Quad MOABs
    [
        { type: 'moab', count: 4, interval: 2.5, delay: 0 },
        { type: 'ceramic', count: 25, interval: 0.5, delay: 4 }
    ],
    // Round 60: BRUTAL FLYING BEHEMOTH (BFB BOSS)!
    [
        { type: 'bfb', count: 1, interval: 1.0, delay: 0 },
        { type: 'moab', count: 2, interval: 3.0, delay: 6 }
    ]
];

// Spawner class to handle incremental wave dispatching
class WaveSpawner {
    constructor() {
        this.currentRound = 0;
        this.queues = [];
        this.active = false;
    }

    startRound(roundNum) {
        this.currentRound = roundNum;
        this.active = true;
        this.queues = [];

        let waveDef;
        if (roundNum <= ROUND_DEFINITIONS.length) {
            waveDef = ROUND_DEFINITIONS[roundNum - 1];
        } else {
            // Procedural Freeplay endless scaling
            const scaling = roundNum - ROUND_DEFINITIONS.length;
            waveDef = [
                { type: 'bfb', count: Math.min(6, Math.floor(1 + scaling / 4)), interval: 3.0, delay: 0 },
                { type: 'moab', count: 4 + scaling, interval: 2.0, delay: 3 },
                { type: 'ceramic', count: 20 + scaling * 4, interval: 0.4, delay: 6, camo: scaling % 2 === 0 }
            ];
        }

        for (const item of waveDef) {
            this.queues.push({
                type: item.type,
                remaining: item.count,
                interval: item.interval,
                timer: item.delay,
                camo: item.camo || false,
                regrow: item.regrow || false
            });
        }
    }

    update(dt, game) {
        if (!this.active) return;

        let allDone = true;
        for (const q of this.queues) {
            if (q.remaining > 0) {
                allDone = false;
                q.timer -= dt;
                if (q.timer <= 0) {
                    q.timer = q.interval;
                    q.remaining--;
                    // Spawn bloon at distance 0
                    const bloon = new Bloon(q.type, 0, {
                        camo: q.camo,
                        regrow: q.regrow,
                        originalType: q.type
                    });
                    game.bloons.push(bloon);
                }
            }
        }

        // Check if spawner finished and all bloons cleared
        if (allDone && game.bloons.length === 0) {
            this.active = false;
            game.onRoundComplete();
        }
    }
}
