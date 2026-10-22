// Maps registry and path mathematics for Bloons TD 4 Clone

const MAP_DEFINITIONS = {
    monkey_lane: {
        id: 'monkey_lane',
        name: 'Monkey Lane',
        difficulty: 'Beginner',
        image: 'assets/maps/monkey_lane.png',
        waterZones: [
            { type: 'circle', x: 800, y: 130, r: 80 }
        ],
        pathWidth: 42,
        waypoints: [
            { x: -20, y: 245 },
            { x: 140, y: 245 },
            { x: 230, y: 200 },
            { x: 290, y: 130 },
            { x: 380, y: 110 },
            { x: 470, y: 170 },
            { x: 490, y: 270 },
            { x: 450, y: 370 },
            { x: 350, y: 440 },
            { x: 230, y: 440 },
            { x: 160, y: 380 },
            { x: 180, y: 310 },
            { x: 300, y: 280 },
            { x: 580, y: 280 },
            { x: 670, y: 220 },
            { x: 680, y: 120 },
            { x: 740, y: 70 },
            { x: 830, y: 210 },
            { x: 850, y: 330 },
            { x: 780, y: 430 },
            { x: 650, y: 450 },
            { x: 590, y: 390 },
            { x: 600, y: 330 },
            { x: 720, y: 330 },
            { x: 870, y: 410 },
            { x: 990, y: 410 }
        ]
    },
    desert_oasis: {
        id: 'desert_oasis',
        name: 'Desert Oasis',
        difficulty: 'Intermediate',
        image: 'assets/maps/desert_oasis.png',
        waterZones: [
            { type: 'circle', x: 780, y: 140, r: 85 }
        ],
        pathWidth: 42,
        waypoints: [
            { x: -20, y: 245 },
            { x: 140, y: 245 },
            { x: 230, y: 200 },
            { x: 290, y: 130 },
            { x: 380, y: 110 },
            { x: 470, y: 170 },
            { x: 490, y: 270 },
            { x: 450, y: 370 },
            { x: 350, y: 440 },
            { x: 230, y: 440 },
            { x: 160, y: 380 },
            { x: 180, y: 310 },
            { x: 300, y: 280 },
            { x: 580, y: 280 },
            { x: 670, y: 220 },
            { x: 680, y: 120 },
            { x: 740, y: 70 },
            { x: 830, y: 210 },
            { x: 850, y: 330 },
            { x: 780, y: 430 },
            { x: 650, y: 450 },
            { x: 590, y: 390 },
            { x: 600, y: 330 },
            { x: 720, y: 330 },
            { x: 870, y: 410 },
            { x: 990, y: 410 }
        ]
    },
    castle_moat: {
        id: 'castle_moat',
        name: 'Castle Moat',
        difficulty: 'Advanced',
        image: 'assets/maps/castle_moat.png',
        waterZones: [
            { type: 'circle', x: 480, y: 270, r: 110 },
            { type: 'circle', x: 180, y: 270, r: 60 },
            { type: 'circle', x: 780, y: 270, r: 60 }
        ],
        pathWidth: 44,
        waypoints: [
            { x: -20, y: 270 },
            { x: 140, y: 270 },
            { x: 200, y: 170 },
            { x: 300, y: 110 },
            { x: 480, y: 100 },
            { x: 660, y: 110 },
            { x: 760, y: 170 },
            { x: 820, y: 270 },
            { x: 760, y: 370 },
            { x: 640, y: 430 },
            { x: 480, y: 440 },
            { x: 320, y: 430 },
            { x: 220, y: 370 },
            { x: 260, y: 270 },
            { x: 380, y: 220 },
            { x: 580, y: 220 },
            { x: 700, y: 270 },
            { x: 990, y: 270 }
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
        this.pathWidth = def.pathWidth || 40;
        this.waypoints = def.waypoints;

        // Precompute path segments and total distance
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

    // Get position and angle along path at specified distance
    getPointAtDistance(dist) {
        if (dist <= 0) {
            const seg = this.segments[0];
            return { x: seg.p1.x, y: seg.p1.y, angle: seg.angle, finished: false };
        }
        if (dist >= this.totalLength) {
            const last = this.segments[this.segments.length - 1];
            return { x: last.p2.x, y: last.p2.y, angle: last.angle, finished: true };
        }

        // Find corresponding segment
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

    // Distance from point to a line segment
    distToSegment(px, py, x1, y1, x2, y2) {
        const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = x1 + t * (x2 - x1);
        const projY = y1 + t * (y2 - y1);
        return Math.hypot(px - projX, py - projY);
    }

    // Check if point is on or too close to track
    isOnTrack(x, y, margin = 0) {
        const threshold = (this.pathWidth / 2) + margin;
        for (const seg of this.segments) {
            const d = this.distToSegment(x, y, seg.p1.x, seg.p1.y, seg.p2.x, seg.p2.y);
            if (d < threshold) return true;
        }
        return false;
    }

    // Check if point is inside water body
    isInWater(x, y) {
        for (const zone of this.waterZones) {
            if (zone.type === 'circle') {
                if (Math.hypot(x - zone.x, y - zone.y) <= zone.r) return true;
            }
        }
        return false;
    }

    // Check if tower placement is valid
    canPlaceTower(x, y, radius, isWaterTower = false, isTrackItem = false) {
        // Outside map boundaries
        if (x < radius || x > 960 - radius || y < radius || y > 540 - radius) {
            return false;
        }

        // Road items (Road Spikes, Pineapple) MUST be placed on the track!
        if (isTrackItem) {
            return this.isOnTrack(x, y, -5);
        }

        // Water tower (e.g. Buccaneer) MUST be placed in water
        if (isWaterTower) {
            return this.isInWater(x, y) && !this.isOnTrack(x, y, radius * 0.5);
        }

        // Standard land towers cannot be placed on track or in water
        if (this.isOnTrack(x, y, radius * 0.75)) {
            return false;
        }
        if (this.isInWater(x, y)) {
            return false;
        }

        return true;
    }

    render(ctx) {
        if (this.isLoaded && this.bgImage.complete) {
            ctx.drawImage(this.bgImage, 0, 0, 960, 540);
        } else {
            // High fidelity fallback renderer
            ctx.fillStyle = '#62a832';
            ctx.fillRect(0, 0, 960, 540);

            // Draw track path
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

            // Draw water
            for (const zone of this.waterZones) {
                ctx.fillStyle = 'rgba(64, 165, 230, 0.8)';
                ctx.beginPath();
                ctx.arc(zone.x, zone.y, zone.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
