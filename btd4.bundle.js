// ==========================================
// Bloons Tower Defense 4 - Consolidated Game Engine
// ==========================================

// --- 1. Sound Engine ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.musicTimer = null;
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {
            console.warn('AudioContext init error:', e);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    playPop(pitchMultiplier = 1.0) {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const baseFreq = (450 + Math.random() * 250) * pitchMultiplier;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(baseFreq, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            clickOsc.type = 'sine';
            clickOsc.frequency.setValueAtTime(1200, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.015);
            clickGain.gain.setValueAtTime(0.35, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
            clickOsc.start(now);
            clickOsc.stop(now + 0.015);
        } catch (e) {}
    }

    playExplosion() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.linearRampToValueAtTime(150, now + 0.25);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
            whiteNoise.start(now);
            whiteNoise.stop(now + 0.25);
        } catch (e) {}
    }

    playDart() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 + Math.random() * 100, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    playFreeze() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.linearRampToValueAtTime(1800, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    playLaser() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(250, now + 0.07);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.07);
        } catch (e) {}
    }

    playPlasma() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
            gain.gain.setValueAtTime(0.16, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playCoin() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.06);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {}
    }

    playUpgrade() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const now = this.ctx.currentTime + i * 0.06;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            });
        } catch (e) {}
    }

    playPlace() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    playRoundStart() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(329.63, now);
            osc.frequency.setValueAtTime(440, now + 0.09);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    playLifeLost() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(140, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }
}

window.soundEngine = new SoundEngine();

// --- 2. Maps & Path Math ---
const MAP_DEFINITIONS = {
    monkey_lane: {
        id: 'monkey_lane',
        name: 'Monkey Lane',
        difficulty: 'Beginner',
        image: 'assets/maps/monkey_lane.png',
        waterZones: [
            { type: 'circle', x: 815, y: 120, r: 75 }
        ],
        pathWidth: 38,
        waypoints: [
            { x: -20, y: 267 },
            { x: 140, y: 267 },
            { x: 170, y: 255 },
            { x: 195, y: 205 },
            { x: 215, y: 155 },
            { x: 240, y: 117 },
            { x: 270, y: 107 },
            { x: 310, y: 109 },
            { x: 345, y: 130 },
            { x: 375, y: 175 },
            { x: 375, y: 210 },
            { x: 345, y: 255 },
            { x: 315, y: 300 },
            { x: 285, y: 355 },
            { x: 265, y: 410 },
            { x: 275, y: 445 },
            { x: 310, y: 455 },
            { x: 365, y: 420 },
            { x: 420, y: 410 },
            { x: 465, y: 390 },
            { x: 500, y: 310 },
            { x: 530, y: 210 },
            { x: 555, y: 155 },
            { x: 595, y: 128 },
            { x: 635, y: 128 },
            { x: 670, y: 150 },
            { x: 695, y: 195 },
            { x: 690, y: 245 },
            { x: 665, y: 290 },
            { x: 645, y: 350 },
            { x: 655, y: 410 },
            { x: 690, y: 442 },
            { x: 740, y: 445 },
            { x: 780, y: 435 },
            { x: 815, y: 380 },
            { x: 835, y: 325 },
            { x: 855, y: 280 },
            { x: 900, y: 270 },
            { x: 980, y: 270 }
        ]
    },
    desert_oasis: {
        id: 'desert_oasis',
        name: 'Desert Oasis',
        difficulty: 'Intermediate',
        image: 'assets/maps/desert_oasis.png',
        waterZones: [
            { type: 'circle', x: 815, y: 120, r: 65 }
        ],
        pathWidth: 38,
        waypoints: [
            { x: -20, y: 267 },
            { x: 140, y: 267 },
            { x: 170, y: 255 },
            { x: 195, y: 205 },
            { x: 215, y: 155 },
            { x: 240, y: 117 },
            { x: 270, y: 107 },
            { x: 310, y: 109 },
            { x: 345, y: 130 },
            { x: 375, y: 175 },
            { x: 375, y: 210 },
            { x: 345, y: 255 },
            { x: 315, y: 300 },
            { x: 305, y: 360 },
            { x: 325, y: 415 },
            { x: 360, y: 435 },
            { x: 400, y: 425 },
            { x: 435, y: 405 },
            { x: 470, y: 385 },
            { x: 500, y: 310 },
            { x: 530, y: 210 },
            { x: 555, y: 155 },
            { x: 595, y: 128 },
            { x: 635, y: 128 },
            { x: 670, y: 150 },
            { x: 695, y: 195 },
            { x: 690, y: 245 },
            { x: 665, y: 290 },
            { x: 645, y: 350 },
            { x: 655, y: 410 },
            { x: 690, y: 442 },
            { x: 740, y: 445 },
            { x: 780, y: 435 },
            { x: 815, y: 380 },
            { x: 835, y: 325 },
            { x: 855, y: 280 },
            { x: 900, y: 270 },
            { x: 980, y: 270 }
        ]
    },
    castle_moat: {
        id: 'castle_moat',
        name: 'Castle Moat',
        difficulty: 'Advanced',
        image: 'assets/maps/castle_moat.png',
        waterZones: [
            { type: 'circle', x: 285, y: 130, r: 45 },
            { type: 'circle', x: 285, y: 410, r: 45 },
            { type: 'circle', x: 790, y: 130, r: 45 },
            { type: 'circle', x: 790, y: 410, r: 45 },
            { type: 'circle', x: 540, y: 25, r: 35 },
            { type: 'circle', x: 540, y: 515, r: 35 }
        ],
        pathWidth: 36,
        waypoints: [
            { x: -20, y: 270 },
            { x: 140, y: 270 },
            { x: 240, y: 270 },
            { x: 340, y: 270 },
            { x: 370, y: 230 },
            { x: 380, y: 160 },
            { x: 410, y: 115 },
            { x: 480, y: 100 },
            { x: 560, y: 100 },
            { x: 630, y: 115 },
            { x: 670, y: 160 },
            { x: 680, y: 230 },
            { x: 670, y: 310 },
            { x: 630, y: 380 },
            { x: 560, y: 430 },
            { x: 480, y: 440 },
            { x: 410, y: 430 },
            { x: 370, y: 380 },
            { x: 360, y: 310 },
            { x: 370, y: 270 },
            { x: 480, y: 270 },
            { x: 650, y: 270 },
            { x: 750, y: 270 },
            { x: 860, y: 270 },
            { x: 980, y: 270 }
        ]
    }
};

class GameMap {
    constructor(def) {
        this.id = def.id;
        this.name = def.name;
        this.difficulty = def.difficulty;
        this.imageSrc = def.image;
        this.waterZones = def.waterZones || [];
        this.pathWidth = def.pathWidth || 38;
        this.waypoints = def.waypoints;

        this.segments = [];
        this.totalLength = 0;
        for (let i = 0; i < this.waypoints.length - 1; i++) {
            const p1 = this.waypoints[i];
            const p2 = this.waypoints[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            this.segments.push({
                p1, p2, dx, dy, len,
                angle: Math.atan2(dy, dx),
                startDist: this.totalLength,
                endDist: this.totalLength + len
            });
            this.totalLength += len;
        }

        this.bgImage = new Image();
        this.bgImage.src = this.imageSrc;
        this.isLoaded = false;
        this.bgImage.onload = () => { this.isLoaded = true; };
    }

    getPointAtDistance(dist) {
        if (dist <= 0) {
            const seg = this.segments[0];
            return { x: seg.p1.x, y: seg.p1.y, angle: seg.angle, finished: false };
        }
        if (dist >= this.totalLength) {
            const last = this.segments[this.segments.length - 1];
            return { x: last.p2.x, y: last.p2.y, angle: last.angle, finished: true };
        }

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            if (dist >= seg.startDist && dist <= seg.endDist) {
                const segDist = dist - seg.startDist;
                const ratio = seg.len > 0 ? segDist / seg.len : 0;
                return {
                    x: seg.p1.x + seg.dx * ratio,
                    y: seg.p1.y + seg.dy * ratio,
                    angle: seg.angle,
                    finished: false
                };
            }
        }
        return { x: 0, y: 0, angle: 0, finished: true };
    }

    distToSegment(px, py, x1, y1, x2, y2) {
        const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = x1 + t * (x2 - x1);
        const projY = y1 + t * (y2 - y1);
        return Math.hypot(px - projX, py - projY);
    }

    isOnTrack(x, y, margin = 0) {
        const threshold = (this.pathWidth / 2) + margin;
        for (const seg of this.segments) {
            const d = this.distToSegment(x, y, seg.p1.x, seg.p1.y, seg.p2.x, seg.p2.y);
            if (d < threshold) return true;
        }
        return false;
    }

    isInWater(x, y) {
        for (const zone of this.waterZones) {
            if (zone.type === 'circle') {
                if (Math.hypot(x - zone.x, y - zone.y) <= zone.r) return true;
            }
        }
        return false;
    }

    // Player-friendly forgiving collision check
    canPlaceTower(x, y, radius = 20, isWaterTower = false, isTrackItem = false) {
        if (x < 15 || x > 945 || y < 15 || y > 525) {
            return { valid: false, reason: "Outside play area" };
        }

        if (isTrackItem) {
            if (this.isOnTrack(x, y, 6)) {
                return { valid: true };
            }
            return { valid: false, reason: "Must be placed on track!" };
        }

        if (isWaterTower) {
            if (!this.isInWater(x, y)) {
                return { valid: false, reason: "Must be placed in water!" };
            }
            if (this.isOnTrack(x, y, 0)) {
                return { valid: false, reason: "Cannot block track!" };
            }
            return { valid: true };
        }

        // Standard land towers: allow placement right along path edge
        if (this.isOnTrack(x, y, -2)) {
            return { valid: false, reason: "Cannot place on track!" };
        }
        if (this.isInWater(x, y)) {
            return { valid: false, reason: "Cannot place in water!" };
        }

        return { valid: true };
    }

    render(ctx) {
        if (this.isLoaded && this.bgImage.complete) {
            ctx.drawImage(this.bgImage, 0, 0, 960, 540);
        } else {
            ctx.fillStyle = '#62a832';
            ctx.fillRect(0, 0, 960, 540);

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#cda365';
            ctx.lineWidth = this.pathWidth;
            ctx.beginPath();
            ctx.moveTo(this.waypoints[0].x, this.waypoints[0].y);
            for (let i = 1; i < this.waypoints.length; i++) {
                ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
            }
            ctx.stroke();

            for (const zone of this.waterZones) {
                ctx.fillStyle = 'rgba(64, 165, 230, 0.8)';
                ctx.beginPath();
                ctx.arc(zone.x, zone.y, zone.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

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
        this.corrosiveTimer = 0;

        this.x = -50;
        this.y = -50;
        this.angle = 0;
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

    update(dt, gameMap) {
        if (this.freezeTimer > 0) {
            this.freezeTimer -= dt;
            return;
        }

        if (this.corrosiveRate > 0) {
            this.corrosiveTimer += dt;
            if (this.corrosiveTimer >= 1.0) {
                this.corrosiveTimer = 0;
                this.takeDamage(1, 'corrosive', null);
                if (this.markedForRemoval) return;
            }
        }

        let curSpeed = this.speed * 60;
        if (this.glueTimer > 0) {
            this.glueTimer -= dt;
            curSpeed *= (1 - this.glueSlow);
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

    takeDamage(damage, attackType = 'sharp', tower = null) {
        if (this.def.immune.includes(attackType)) {
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }
        if (attackType === 'sharp' && this.freezeTimer > 0) {
            return { popped: false, children: [], cash: 0, popCount: 0 };
        }

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
                    spawnedChildren.push(child);
                }
                return { popped: true, children: spawnedChildren, cash: totalCash, popCount: pops };
            }
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
        if (corrosive) this.corrosiveRate = 1;
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

// --- 4. Projectiles & Items ---
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
        this.speed = options.speed || 400;
        this.range = options.range || 200;
        this.distTraveled = 0;
        this.radius = options.radius || 8;
        this.attackType = options.attackType || 'sharp';
        this.camo = options.camo || false;
        this.canPopLead = options.canPopLead || false;
        this.canPopFrozen = options.canPopFrozen || false;
        this.hitBloons = new Set();
        this.markedForRemoval = false;

        this.angle = options.angle !== undefined ? options.angle : 0;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.isBoomerang = options.isBoomerang || false;
        this.boomerangTime = 0;
        this.startX = this.x;
        this.startY = this.y;

        this.isGlaive = options.isGlaive || false;
        this.ricochetCount = 0;
        this.maxRicochets = options.maxRicochets || 40;

        this.isExplosive = options.isExplosive || false;
        this.blastRadius = options.blastRadius || 45;
        this.cluster = options.cluster || false;
        this.targetX = options.targetX;
        this.targetY = options.targetY;

        this.freezes = options.freezes || false;
        this.freezeDuration = options.freezeDuration || 1.5;
        this.glues = options.glues || false;
        this.glueDuration = options.glueDuration || 4.0;
        this.glueSlow = options.glueSlow || 0.5;
        this.corrosive = options.corrosive || false;

        this.rotation = this.angle;
    }

    update(dt, game) {
        if (this.isBoomerang) {
            this.boomerangTime += dt * 3.2;
            this.rotation += dt * 15;
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
        } else {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.distTraveled += this.speed * dt;
            if (this.type === 'blade' || this.type === 'glaive') {
                this.rotation += dt * 18;
            }

            if (this.targetX !== undefined && this.targetY !== undefined) {
                if (Math.hypot(this.x - this.targetX, this.y - this.targetY) < 14) {
                    this.explode(game);
                    return;
                }
            }

            if (this.distTraveled >= this.range) {
                if (this.isExplosive) this.explode(game);
                else this.markedForRemoval = true;
                return;
            }
        }

        if (this.x < -40 || this.x > 1000 || this.y < -40 || this.y > 600) {
            this.markedForRemoval = true;
            return;
        }

        this.checkCollisions(game);
    }

    checkCollisions(game) {
        if (this.markedForRemoval) return;

        for (let i = 0; i < game.bloons.length; i++) {
            const b = game.bloons[i];
            if (b.markedForRemoval || this.hitBloons.has(b)) continue;
            if (b.camo && !this.camo) continue;

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

        if (this.freezes) {
            b.applyFreeze(this.freezeDuration);
            window.soundEngine.playFreeze();
        }

        if (this.glues) {
            b.applyGlue(this.glueDuration, this.glueSlow, this.corrosive);
        }

        let effectiveAttack = this.attackType;
        if (this.canPopLead && b.typeId === 'lead') effectiveAttack = 'plasma';

        let finalDamage = this.damage;
        if (b.isBlimp && this.tower && this.tower.moabDamageMultiplier) {
            finalDamage *= this.tower.moabDamageMultiplier;
        }

        const res = b.takeDamage(finalDamage, effectiveAttack, this.tower);
        if (res.popped) {
            game.addCash(res.cash);
            game.stats.totalPops += res.popCount;
            if (this.tower) this.tower.pops += res.popCount;
            window.soundEngine.playPop();
            game.spawnPopFX(b.x, b.y);

            for (const child of res.children) game.bloons.push(child);
        }

        this.pierce--;
        if (this.pierce <= 0 && !this.isGlaive) {
            this.markedForRemoval = true;
        }

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
                    if (this.tower) this.tower.pops += res.popCount;
                    for (const child of res.children) game.bloons.push(child);
                }
            }
        }

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
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class TrackItem {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.markedForRemoval = false;
        if (this.type === 'road_spikes') this.spikesRemaining = 10;
        else if (this.type === 'pineapple') this.timer = 3.0;
    }

    update(dt, game) {
        if (this.type === 'road_spikes') {
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
                        for (const child of res.children) game.bloons.push(child);
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
                            for (const child of res.children) game.bloons.push(child);
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

class DroppedBanana {
    constructor(x, y, value = 20) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.life = 12.0;
        this.markedForRemoval = false;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) this.markedForRemoval = true;
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
        if (img && img.complete) ctx.drawImage(img, this.x - 18, this.y - 18, 36, 36);
    }
}

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

class FloatingText {
    constructor(text, x, y, color = '#ffd700') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.timer = 0.9;
        this.markedForRemoval = false;
    }
    update(dt) {
        this.y -= 25 * dt;
        this.timer -= dt;
        if (this.timer <= 0) this.markedForRemoval = true;
    }
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.timer / 0.9);
        ctx.font = 'bold 14px Fredoka, sans-serif';
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// --- 5. Towers System ---
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
        desc: 'Throws sharp darts at bloons. Cheap & reliable.',
        upgrades1: [
            { name: 'Long Range', cost: 90, desc: '+25% range.', apply: t => { t.range *= 1.25; } },
            { name: 'Enhanced Eyesight', cost: 120, desc: 'Enables Camo Bloon detection.', apply: t => { t.camoDetect = true; t.range += 15; } },
            { name: 'Spike-o-Pult', cost: 500, desc: 'Flings heavy spiked iron balls that plow through 18 bloons!', apply: t => { t.isSpikePult = true; t.pierce = 18; t.damage = 2; t.range += 20; } }
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
        desc: 'Shoots 8 tacks in all directions. Devastating in loops.',
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
        range: 1200,
        fireRate: 0.5,
        pierce: 1,
        damage: 2,
        attackType: 'sharp',
        sprite: 'sniper_monkey',
        desc: 'Infinite range rifle. Instantly snipes bloons anywhere on the map.',
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
        fireRate: 8.0,
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
        range: 1200,
        fireRate: 0.45,
        pierce: 40,
        damage: 2,
        attackType: 'explosion',
        sprite: 'mortar_monkey',
        desc: 'Artillery mortar tube. Click anywhere on the map to set its target reticle!',
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
        this.radius = 20;
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
        this.targetPriority = 'first';
        this.camoDetect = false;
        this.canPopLead = false;
        this.canPopFrozen = false;
        this.blastRadius = 45;

        this.tierPath1 = 0;
        this.tierPath2 = 0;

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

        if (this.typeId === 'mortar_monkey') {
            this.reticleX = 480;
            this.reticleY = 270;
        }

        if (this.typeId === 'banana_farm') {
            this.bananasPerRound = 4;
            this.bananaTimer = 0;
        }

        if (this.typeId === 'spike_factory') {
            this.spikesPerPile = 5;
        }
    }

    upgrade(path) {
        if (path === 1 && this.tierPath1 < 3) {
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

    getSellValue() {
        return Math.floor(this.investedCash * 0.8);
    }

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

        if (this.typeId === 'spike_factory') {
            this.cooldown -= dt;
            if (this.cooldown <= 0 && game.roundInProgress) {
                this.cooldown = 1.0 / this.fireRate;
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

        if (this.typeId === 'tack_shooter') {
            this.cooldown -= dt;
            const target = this.findTarget(game);
            if (target && this.cooldown <= 0) {
                this.cooldown = 1.0 / this.fireRate;
                window.soundEngine.playDart();
                if (this.isRingOfFire) {
                    for (let a = 0; a < 360; a += 30) {
                        const rad = a * Math.PI / 180;
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

        if (this.typeId === 'ice_tower') {
            this.cooldown -= dt;
            const target = this.findTarget(game);
            if (target && this.cooldown <= 0) {
                this.cooldown = 1.0 / this.fireRate;
                window.soundEngine.playFreeze();
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

        this.cooldown -= dt;
        const target = this.findTarget(game);
        if (!target) return;

        this.angle = Math.atan2(target.y - this.y, target.x - this.x);

        if (this.cooldown <= 0) {
            this.cooldown = 1.0 / this.fireRate;
            this.fireAt(target, game);
        }
    }

    fireAt(target, game) {
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

        if (this.typeId === 'monkey_buccaneer') {
            window.soundEngine.playDart();
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
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (this.typeId === 'mortar_monkey' && projImageCache.mortar_reticle.complete) {
                ctx.drawImage(projImageCache.mortar_reticle, this.reticleX - 24, this.reticleY - 24, 48, 48);
            }
        }

        ctx.save();
        ctx.translate(this.x, this.y);

        const rotatableTowers = ['dart_monkey', 'bomb_tower', 'sniper_monkey', 'super_monkey', 'glue_gunner', 'boomerang_monkey'];
        if (rotatableTowers.includes(this.typeId)) {
            ctx.rotate(this.angle);
        }

        const img = towerImageCache[this.sprite];
        if (img && img.complete) {
            ctx.drawImage(img, -24, -24, 48, 48);
        } else {
            ctx.fillStyle = '#8b5a2b';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Global exposure
window.Tower = Tower;
window.TOWER_DEFINITIONS = TOWER_DEFINITIONS;

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
        this.spawner.startRound(this.round);
        this.updateUI();
    }

    onRoundComplete() {
        this.roundInProgress = false;
        window.soundEngine.playCoin();

        const roundReward = 100 + this.round;
        this.addCash(roundReward);
        this.spawnFloatingText(`Round Complete! +$${roundReward}`, this.width / 2, 80, '#32cd32');

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

        // 3. Mortar target reticle repositioning
        if (this.selectedTower && this.selectedTower.typeId === 'mortar_monkey') {
            this.selectedTower.reticleX = x;
            this.selectedTower.reticleY = y;
            window.soundEngine.playDart();
            return;
        }

        // 4. Select tower under click
        let clickedTower = null;
        for (const t of this.towers) {
            if (Math.hypot(x - t.x, y - t.y) <= t.radius + 8) {
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
            b.update(dt, this.gameMap);
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
