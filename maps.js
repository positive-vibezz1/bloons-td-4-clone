// --- 2. Maps & Path Math ---
const MAP_DEFINITIONS = {
    monkey_lane: {
        id: 'monkey_lane',
        name: 'Monkey Lane',
        difficulty: 'Beginner',
        image: 'assets/maps/monkey_lane.png',
        waterZones: [
            { type: 'circle', x: 830, y: 155, r: 88 }
        ],
        pathWidth: 40,
        waypoints: [
            { x: -20, y: 268 },
            { x: 135, y: 268 },
            { x: 162, y: 262 },
            { x: 182, y: 240 },
            { x: 195, y: 200 },
            { x: 206, y: 155 },
            { x: 225, y: 122 },
            { x: 258, y: 106 },
            { x: 292, y: 105 },
            { x: 325, y: 118 },
            { x: 355, y: 148 },
            { x: 370, y: 185 },
            { x: 368, y: 222 },
            { x: 348, y: 262 },
            { x: 320, y: 305 },
            { x: 308, y: 345 },
            { x: 315, y: 385 },
            { x: 342, y: 415 },
            { x: 382, y: 428 },
            { x: 430, y: 422 },
            { x: 472, y: 400 },
            { x: 502, y: 360 },
            { x: 518, y: 305 },
            { x: 526, y: 240 },
            { x: 538, y: 180 },
            { x: 562, y: 145 },
            { x: 595, y: 126 },
            { x: 635, y: 126 },
            { x: 672, y: 142 },
            { x: 698, y: 178 },
            { x: 705, y: 220 },
            { x: 688, y: 265 },
            { x: 662, y: 315 },
            { x: 648, y: 360 },
            { x: 658, y: 405 },
            { x: 688, y: 435 },
            { x: 732, y: 445 },
            { x: 778, y: 432 },
            { x: 812, y: 395 },
            { x: 830, y: 345 },
            { x: 845, y: 300 },
            { x: 868, y: 275 },
            { x: 905, y: 268 },
            { x: 980, y: 268 }
        ]
    },
    desert_oasis: {
        id: 'desert_oasis',
        name: 'Desert Oasis',
        difficulty: 'Intermediate',
        image: 'assets/maps/desert_oasis.png',
        waterZones: [
            { type: 'circle', x: 485, y: 285, r: 95 },
            { type: 'circle', x: 435, y: 295, r: 72 },
            { type: 'circle', x: 535, y: 285, r: 72 }
        ],
        pathWidth: 38,
        waypoints: [
            { x: 62, y: 62 },
            { x: 100, y: 74 },
            { x: 150, y: 78 },
            { x: 195, y: 82 },
            { x: 232, y: 98 },
            { x: 255, y: 128 },
            { x: 260, y: 162 },
            { x: 242, y: 198 },
            { x: 215, y: 238 },
            { x: 218, y: 258 },
            { x: 258, y: 255 },
            { x: 305, y: 235 },
            { x: 345, y: 195 },
            { x: 378, y: 145 },
            { x: 415, y: 108 },
            { x: 458, y: 90 },
            { x: 508, y: 92 },
            { x: 555, y: 112 },
            { x: 600, y: 142 },
            { x: 645, y: 148 },
            { x: 702, y: 132 },
            { x: 755, y: 132 },
            { x: 802, y: 152 },
            { x: 832, y: 190 },
            { x: 838, y: 240 },
            { x: 818, y: 282 },
            { x: 778, y: 308 },
            { x: 735, y: 315 },
            { x: 695, y: 315 },
            { x: 665, y: 340 },
            { x: 632, y: 382 },
            { x: 592, y: 422 },
            { x: 548, y: 448 },
            { x: 502, y: 452 },
            { x: 455, y: 438 },
            { x: 412, y: 408 },
            { x: 378, y: 392 },
            { x: 345, y: 402 },
            { x: 308, y: 432 },
            { x: 262, y: 452 },
            { x: 215, y: 452 },
            { x: 168, y: 428 },
            { x: 135, y: 388 },
            { x: 122, y: 345 },
            { x: 128, y: 305 },
            { x: 155, y: 268 },
            { x: 185, y: 255 },
            { x: 218, y: 258 },
            { x: 258, y: 255 },
            { x: 305, y: 235 },
            { x: 345, y: 195 },
            { x: 378, y: 145 },
            { x: 415, y: 108 },
            { x: 458, y: 90 },
            { x: 508, y: 92 },
            { x: 555, y: 112 },
            { x: 600, y: 142 },
            { x: 645, y: 148 },
            { x: 702, y: 132 },
            { x: 755, y: 132 },
            { x: 802, y: 152 },
            { x: 832, y: 190 },
            { x: 838, y: 240 },
            { x: 818, y: 282 },
            { x: 778, y: 308 },
            { x: 735, y: 315 },
            { x: 702, y: 325 },
            { x: 698, y: 360 },
            { x: 708, y: 408 },
            { x: 732, y: 448 },
            { x: 772, y: 472 },
            { x: 830, y: 480 },
            { x: 910, y: 476 },
            { x: 980, y: 474 }
        ]
    },
    castle_moat: {
        id: 'castle_moat',
        name: 'Castle Moat',
        difficulty: 'Advanced',
        image: 'assets/maps/castle_moat.png',
        waterZones: [
            { type: 'rect', x1: 255, y1: 0, x2: 345, y2: 225 },
            { type: 'rect', x1: 255, y1: 310, x2: 345, y2: 540 },
            { type: 'rect', x1: 785, y1: 0, x2: 865, y2: 225 },
            { type: 'rect', x1: 785, y1: 310, x2: 865, y2: 540 },
            { type: 'rect', x1: 320, y1: 485, x2: 820, y2: 540 }
        ],
        pathWidth: 36,
        waypoints: [
            { x: 115, y: 65 },
            { x: 138, y: 95 },
            { x: 162, y: 138 },
            { x: 175, y: 188 },
            { x: 188, y: 235 },
            { x: 218, y: 262 },
            { x: 255, y: 268 },
            { x: 345, y: 268 },
            { x: 395, y: 264 },
            { x: 432, y: 242 },
            { x: 452, y: 200 },
            { x: 472, y: 165 },
            { x: 505, y: 150 },
            { x: 540, y: 155 },
            { x: 568, y: 180 },
            { x: 576, y: 220 },
            { x: 568, y: 268 },
            { x: 555, y: 318 },
            { x: 560, y: 355 },
            { x: 588, y: 378 },
            { x: 628, y: 376 },
            { x: 658, y: 350 },
            { x: 676, y: 308 },
            { x: 702, y: 276 },
            { x: 745, y: 268 },
            { x: 880, y: 268 },
            { x: 922, y: 245 },
            { x: 935, y: 215 }
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
            } else if (zone.type === 'rect') {
                if (x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2) return true;
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
