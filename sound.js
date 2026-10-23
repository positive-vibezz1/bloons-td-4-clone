// --- 1. Sound Engine ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.noiseBuffer = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.musicTimer = null;
        this.musicStep = 0;
        this.lastPopTime = 0;
        this.lastDartTime = 0;
        this.lastExplodeTime = 0;
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                    this.compressor = this.ctx.createDynamicsCompressor();
                    this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
                    this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
                    this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
                    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
                    this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
                    this.masterGain.connect(this.compressor);
                    this.compressor.connect(this.ctx.destination);

                    // Pre-generate 1 second of white noise for realistic pops, explosions, whooshes
                    const sr = this.ctx.sampleRate;
                    this.noiseBuffer = this.ctx.createBuffer(1, sr, sr);
                    const data = this.noiseBuffer.getChannelData(0);
                    for (let i = 0; i < sr; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {
            console.warn('AudioContext init error:', e);
        }
    }

    out() {
        return this.masterGain || (this.ctx && this.ctx.destination);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.init();
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startMusicLoop();
        } else {
            this.stopMusicLoop();
        }
        return this.musicEnabled;
    }

    startMusicLoop() {
        this.stopMusicLoop();
        if (!this.ctx) return;
        // Upbeat classic BTD tropical marimba + bass groove (125 BPM -> 240ms per 8th note)
        const melody = [
            523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
            523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 880.00, 783.99,
            698.46, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25,
            587.33, 659.25, 698.46, 783.99, 880.00, 783.99, 587.33, 523.25
        ];
        const bass = [
            130.81, 0, 196.00, 0, 220.00, 0, 164.81, 0,
            130.81, 0, 196.00, 0, 196.00, 0, 146.83, 0,
            174.61, 0, 220.00, 0, 130.81, 0, 196.00, 0,
            146.83, 0, 174.61, 0, 196.00, 146.83, 130.81, 0
        ];

        this.musicTimer = setInterval(() => {
            if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
            try {
                const now = this.ctx.currentTime;
                const step = this.musicStep % melody.length;
                this.musicStep++;

                // Marimba lead note
                const mFreq = melody[step];
                if (mFreq > 0) {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(mFreq, now);
                    g.gain.setValueAtTime(0.001, now);
                    g.gain.linearRampToValueAtTime(0.08, now + 0.012);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
                    osc.connect(g);
                    g.connect(this.out());
                    osc.start(now);
                    osc.stop(now + 0.21);
                }

                // Warm synth bass
                const bFreq = bass[step];
                if (bFreq > 0) {
                    const bOsc = this.ctx.createOscillator();
                    const bGain = this.ctx.createGain();
                    bOsc.type = 'sine';
                    bOsc.frequency.setValueAtTime(bFreq, now);
                    bGain.gain.setValueAtTime(0.11, now);
                    bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    bOsc.connect(bGain);
                    bGain.connect(this.out());
                    bOsc.start(now);
                    bOsc.stop(now + 0.36);
                }
            } catch (e) {}
        }, 230);
    }

    stopMusicLoop() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }

    playPop(pitchMultiplier = 1.0) {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastPopTime < 0.022) return; // Prevent ear-piercing overlap during swarms
            this.lastPopTime = now;

            // 1. Snappy rubber membrane pitch-snap
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startFreq = (580 + Math.random() * 240) * pitchMultiplier;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);

            gain.gain.setValueAtTime(0.32, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.05);

            // 2. Crisp air-burst transient using bandpass-filtered white noise
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;
                const bp = this.ctx.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(1900 + Math.random() * 600, now);
                bp.Q.setValueAtTime(2.5, now);

                const nGain = this.ctx.createGain();
                nGain.gain.setValueAtTime(0.42, now);
                nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

                noise.connect(bp);
                bp.connect(nGain);
                nGain.connect(this.out());
                noise.start(now, Math.random() * 0.5, 0.035);
            }
        } catch (e) {}
    }

    playLeadClink() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastPopTime < 0.05) return;
            this.lastPopTime = now;
            // Metallic anvil ricochet ping when sharp hits lead
            for (const freq of [1750, 2680]) {
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                g.gain.setValueAtTime(0.14, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc.connect(g);
                g.connect(this.out());
                osc.start(now);
                osc.stop(now + 0.095);
            }
        } catch (e) {}
    }

    playCeramicHit() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastPopTime < 0.03) return;
            this.lastPopTime = now;
            // Hollow terracotta clay thud
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(340 + Math.random() * 60, now);
            osc.frequency.exponentialRampToValueAtTime(135, now + 0.055);
            g.gain.setValueAtTime(0.28, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(g);
            g.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.065);
        } catch (e) {}
    }

    playExplosion() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastExplodeTime < 0.045) return;
            this.lastExplodeTime = now;

            // Deep sub-bass punch
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(28, now + 0.32);
            gain.gain.setValueAtTime(0.45, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.35);

            // Filtered blast roar
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1100, now);
                filter.frequency.exponentialRampToValueAtTime(120, now + 0.28);

                const nGain = this.ctx.createGain();
                nGain.gain.setValueAtTime(0.48, now);
                nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

                noise.connect(filter);
                filter.connect(nGain);
                nGain.connect(this.out());
                noise.start(now, 0, 0.3);
            }
        } catch (e) {}
    }

    playDart() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastDartTime < 0.03) return;
            this.lastDartTime = now;

            // Soft air whoosh instead of harsh beep
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;
                const bp = this.ctx.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(1200, now);
                bp.frequency.exponentialRampToValueAtTime(450, now + 0.045);
                bp.Q.setValueAtTime(1.8, now);

                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.14, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

                noise.connect(bp);
                bp.connect(g);
                g.connect(this.out());
                noise.start(now, Math.random() * 0.4, 0.05);
            }
        } catch (e) {}
    }

    playSniper() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Crisp high-velocity rifle crack
            if (this.noiseBuffer) {
                const noise = this.ctx.createBufferSource();
                noise.buffer = this.noiseBuffer;
                const hp = this.ctx.createBiquadFilter();
                hp.type = 'bandpass';
                hp.frequency.setValueAtTime(2200, now);
                hp.frequency.exponentialRampToValueAtTime(400, now + 0.09);
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.38, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                noise.connect(hp);
                hp.connect(g);
                g.connect(this.out());
                noise.start(now, 0, 0.1);
            }
        } catch (e) {}
    }

    playFreeze() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Crystalline ice chime chord
            [1567.98, 2093.0, 2637.02].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.018);
                gain.gain.setValueAtTime(0.11, now + idx * 0.018);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
                osc.connect(gain);
                gain.connect(this.out());
                osc.start(now + idx * 0.018);
                osc.stop(now + 0.17);
            });
        } catch (e) {}
    }

    playLaser() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastDartTime < 0.035) return;
            this.lastDartTime = now;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1450, now);
            osc.frequency.exponentialRampToValueAtTime(280, now + 0.065);
            gain.gain.setValueAtTime(0.16, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.07);
        } catch (e) {}
    }

    playPlasma() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            if (now - this.lastDartTime < 0.04) return;
            this.lastDartTime = now;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.075);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.08);
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
            osc.frequency.setValueAtTime(1318.51, now + 0.055);
            gain.gain.setValueAtTime(0.20, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.23);
        } catch (e) {}
    }

    playUpgrade() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const now = this.ctx.currentTime + i * 0.055;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.connect(gain);
                gain.connect(this.out());
                osc.start(now);
                osc.stop(now + 0.15);
            });
        } catch (e) {}
    }

    playPlace() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(65, now + 0.075);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.085);
        } catch (e) {}
    }

    playRoundStart() {
        if (!this.soundEnabled || !this.ctx) return;
        try {
            const notes = [392.00, 523.25, 659.25];
            notes.forEach((freq, i) => {
                const now = this.ctx.currentTime + i * 0.07;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.20, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.connect(gain);
                gain.connect(this.out());
                osc.start(now);
                osc.stop(now + 0.23);
            });
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
            osc.frequency.linearRampToValueAtTime(115, now + 0.16);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.connect(gain);
            gain.connect(this.out());
            osc.start(now);
            osc.stop(now + 0.19);
        } catch (e) {}
    }
}

window.soundEngine = new SoundEngine();
