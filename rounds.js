// --- 6. Waves & Spawning ---
const ROUND_DEFINITIONS = [
    [{ type: 'red', count: 20, interval: 0.7, delay: 0 }],
    [{ type: 'red', count: 35, interval: 0.5, delay: 0 }],
    [{ type: 'red', count: 25, interval: 0.5, delay: 0 }, { type: 'blue', count: 5, interval: 0.8, delay: 5 }],
    [{ type: 'red', count: 30, interval: 0.4, delay: 0 }, { type: 'blue', count: 15, interval: 0.6, delay: 5 }],
    [{ type: 'blue', count: 25, interval: 0.5, delay: 0 }, { type: 'green', count: 5, interval: 0.9, delay: 5 }],
    [{ type: 'red', count: 20, interval: 0.3, delay: 0 }, { type: 'blue', count: 20, interval: 0.5, delay: 3 }, { type: 'green', count: 12, interval: 0.7, delay: 6 }],
    [{ type: 'blue', count: 25, interval: 0.4, delay: 0 }, { type: 'green', count: 20, interval: 0.5, delay: 4 }],
    [{ type: 'green', count: 25, interval: 0.4, delay: 0 }, { type: 'yellow', count: 6, interval: 0.8, delay: 5 }],
    [{ type: 'green', count: 35, interval: 0.35, delay: 0 }],
    [{ type: 'blue', count: 80, interval: 0.2, delay: 0 }],
    [{ type: 'green', count: 20, interval: 0.3, delay: 0 }, { type: 'yellow', count: 12, interval: 0.6, delay: 4 }],
    [{ type: 'yellow', count: 20, interval: 0.5, delay: 0 }],
    [{ type: 'blue', count: 50, interval: 0.2, delay: 0 }, { type: 'green', count: 30, interval: 0.3, delay: 4 }],
    [{ type: 'yellow', count: 15, interval: 0.4, delay: 0 }, { type: 'pink', count: 8, interval: 0.6, delay: 4 }],
    [{ type: 'pink', count: 25, interval: 0.25, delay: 0 }],
    [{ type: 'yellow', count: 40, interval: 0.25, delay: 0 }],
    [{ type: 'yellow', count: 20, interval: 0.3, delay: 0 }, { type: 'black', count: 12, interval: 0.6, delay: 3 }],
    [{ type: 'green', count: 80, interval: 0.15, delay: 0 }],
    [{ type: 'pink', count: 15, interval: 0.3, delay: 0 }, { type: 'white', count: 15, interval: 0.5, delay: 3 }],
    [{ type: 'black', count: 10, interval: 0.4, delay: 0 }, { type: 'white', count: 10, interval: 0.4, delay: 2 }],
    [{ type: 'yellow', count: 40, interval: 0.2, delay: 0 }, { type: 'pink', count: 20, interval: 0.25, delay: 4 }],
    [{ type: 'white', count: 20, interval: 0.35, delay: 0 }],
    [{ type: 'black', count: 14, interval: 0.3, delay: 0 }, { type: 'white', count: 14, interval: 0.3, delay: 2 }],
    [{ type: 'blue', count: 20, interval: 0.3, delay: 0 }, { type: 'green', count: 1, interval: 1.0, delay: 2, camo: true }],
    [{ type: 'pink', count: 20, interval: 0.25, delay: 0 }, { type: 'pink', count: 8, interval: 0.5, delay: 4, camo: true }],
    [{ type: 'pink', count: 50, interval: 0.18, delay: 0 }],
    [{ type: 'blue', count: 100, interval: 0.1, delay: 0 }, { type: 'green', count: 60, interval: 0.15, delay: 4 }],
    [{ type: 'lead', count: 6, interval: 1.0, delay: 0 }, { type: 'yellow', count: 20, interval: 0.25, delay: 3 }],
    [{ type: 'yellow', count: 30, interval: 0.2, delay: 0 }, { type: 'yellow', count: 15, interval: 0.4, delay: 3, regrow: true }],
    [{ type: 'lead', count: 12, interval: 0.8, delay: 0 }],
    [{ type: 'zebra', count: 10, interval: 0.7, delay: 0 }],
    [{ type: 'black', count: 20, interval: 0.25, delay: 0 }, { type: 'white', count: 20, interval: 0.25, delay: 3 }],
    [{ type: 'pink', count: 25, interval: 0.2, delay: 0, camo: true }],
    [{ type: 'yellow', count: 140, interval: 0.1, delay: 0 }],
    [{ type: 'pink', count: 35, interval: 0.18, delay: 0 }, { type: 'black', count: 25, interval: 0.25, delay: 3 }, { type: 'white', count: 25, interval: 0.25, delay: 5 }],
    [{ type: 'pink', count: 100, interval: 0.12, delay: 0 }, { type: 'green', count: 25, interval: 0.2, delay: 4, regrow: true }],
    [{ type: 'lead', count: 25, interval: 0.5, delay: 0 }, { type: 'zebra', count: 15, interval: 0.6, delay: 4 }],
    [{ type: 'white', count: 42, interval: 0.2, delay: 0 }, { type: 'zebra', count: 18, interval: 0.4, delay: 3 }],
    [{ type: 'rainbow', count: 10, interval: 0.8, delay: 0 }],
    [{ type: 'rainbow', count: 8, interval: 0.7, delay: 0 }, { type: 'ceramic', count: 4, interval: 1.5, delay: 4 }],
    [{ type: 'black', count: 60, interval: 0.15, delay: 0 }, { type: 'white', count: 60, interval: 0.15, delay: 3 }],
    [{ type: 'rainbow', count: 8, interval: 0.6, delay: 0, camo: true }],
    [{ type: 'rainbow', count: 12, interval: 0.5, delay: 0 }, { type: 'lead', count: 15, interval: 0.4, delay: 3 }],
    [{ type: 'zebra', count: 45, interval: 0.25, delay: 0 }],
    [{ type: 'ceramic', count: 8, interval: 1.2, delay: 0 }, { type: 'pink', count: 120, interval: 0.08, delay: 3 }],
    [{ type: 'moab', count: 1, interval: 1.0, delay: 0 }],
    [{ type: 'ceramic', count: 12, interval: 0.8, delay: 0 }, { type: 'pink', count: 40, interval: 0.15, delay: 3, camo: true }],
    [{ type: 'rainbow', count: 35, interval: 0.35, delay: 0 }, { type: 'lead', count: 30, interval: 0.3, delay: 4 }],
    [{ type: 'ceramic', count: 18, interval: 0.6, delay: 0 }, { type: 'rainbow', count: 50, interval: 0.25, delay: 4 }],
    [{ type: 'moab', count: 2, interval: 3.0, delay: 0 }, { type: 'ceramic', count: 10, interval: 0.8, delay: 3 }]
];

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
            const scaling = roundNum - ROUND_DEFINITIONS.length;
            waveDef = [
                { type: 'bfb', count: Math.min(6, Math.floor(1 + scaling / 4)), interval: 3.0, delay: 0 },
                { type: 'moab', count: 4 + scaling, interval: 2.0, delay: 3 },
                { type: 'ceramic', count: 20 + scaling * 4, interval: 0.4, delay: 5, camo: scaling % 2 === 0 }
            ];
        }

        for (const item of waveDef) {
            this.queues.push({
                type: item.type,
                remaining: item.count,
                interval: item.interval,
                timer: item.delay || 0,
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
                    const bloon = new window.Bloon(q.type, 0, {
                        camo: q.camo,
                        regrow: q.regrow,
                        originalType: q.type
                    });
                    game.bloons.push(bloon);
                }
            }
        }

        if (allDone && game.bloons.length === 0) {
            this.active = false;
            game.onRoundComplete();
        }
    }
}
