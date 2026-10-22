// Maps registry and path mathematics for Bloons TD 4 Clone

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
