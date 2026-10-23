import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_PROJ = os.path.join(os.path.dirname(__file__), "assets", "projectiles")
os.makedirs(ASSETS_PROJ, exist_ok=True)

SCALE = 4

def make_canvas(w=48, h=48):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0)), w * SCALE, h * SCALE

def finish(im, w=48, h=48):
    return im.resize((w, h), Image.Resampling.LANCZOS)

# 1. Dart (Horizontal facing right +X)
def gen_dart():
    im, W, H = make_canvas(48, 24)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE
    outline = (35, 20, 10, 255)

    # Red flights / feathers at left (-X)
    draw.polygon([(3*S, cy - 2*S), (16*S, cy - 2*S), (6*S, cy - 10*S)], fill=(235, 35, 35, 255), outline=outline, width=int(1.2*S))
    draw.polygon([(3*S, cy + 2*S), (16*S, cy + 2*S), (6*S, cy + 10*S)], fill=(235, 35, 35, 255), outline=outline, width=int(1.2*S))
    # Wooden shaft
    draw.rounded_rectangle([8*S, cy - 3*S, W - 18*S, cy + 3*S], radius=SCALE, fill=(195, 135, 68, 255), outline=outline, width=int(1.2*S))
    # Brass ferrule
    draw.rectangle([W - 20*S, cy - 3*S, W - 16*S, cy + 3*S], fill=(245, 205, 45, 255), outline=outline, width=SCALE)
    # Sharp steel needle tip pointing right (+X)
    draw.polygon([(W - 2*S, cy), (W - 17*S, cy - 5.5*S), (W - 17*S, cy + 5.5*S)], fill=(225, 235, 245, 255), outline=outline, width=int(1.2*S))
    draw.polygon([(W - 4*S, cy), (W - 16*S, cy - 3.5*S), (W - 16*S, cy)], fill=(255, 255, 255, 220))

    return finish(im, 48, 24)

# 2. Tack (Facing Right +X so rotation works naturally!)
def gen_tack():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (40, 48, 58, 255)

    # Flat tack head at left (-X)
    draw.ellipse([5*S, cy - 8*S, 13*S, cy + 8*S], fill=(175, 190, 208, 255), outline=outline, width=int(1.5*S))
    # Sharp silver spike pointing right (+X)
    draw.polygon([(W - 3*S, cy), (10*S, cy - 5.5*S), (10*S, cy + 5.5*S)], fill=(230, 240, 250, 255), outline=outline, width=int(1.5*S))
    draw.line([(12*S, cy - 1.5*S), (W - 7*S, cy)], fill=(255, 255, 255, 240), width=int(1.5*S))

    return finish(im, 32, 32)

# 3. Blade (4-curved razor sawblade)
def gen_blade():
    im, W, H = make_canvas(40, 40)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (35, 45, 60, 255)

    for a in range(0, 360, 45):
        rad = math.radians(a)
        r_out = 18 * S
        tx = cx + int(math.cos(rad) * r_out)
        ty = cy + int(math.sin(rad) * r_out)
        r_mid = 11 * S
        mx1 = cx + int(math.cos(rad - 0.35) * r_mid)
        my1 = cy + int(math.sin(rad - 0.35) * r_mid)
        mx2 = cx + int(math.cos(rad + 0.25) * r_mid)
        my2 = cy + int(math.sin(rad + 0.25) * r_mid)
        draw.polygon([(mx1, my1), (tx, ty), (mx2, my2)], fill=(235, 245, 255, 255), outline=outline, width=int(1.2*S))

    draw.ellipse([cx - 11*S, cy - 11*S, cx + 11*S, cy + 11*S], fill=(205, 220, 238, 255), outline=outline, width=int(1.5*S))
    draw.ellipse([cx - 4*S, cy - 4*S, cx + 4*S, cy + 4*S], fill=(70, 80, 95, 255), outline=outline, width=SCALE)

    return finish(im, 40, 40)

# 4. Bomb
def gen_bomb():
    im, W, H = make_canvas(40, 40)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2 - 2*SCALE, H // 2 + 2*SCALE
    S = SCALE
    outline = (15, 18, 24, 255)

    # Fuse cap & burning spark
    draw.rectangle([cx + 4*S, cy - 15*S, cx + 11*S, cy - 9*S], fill=(85, 92, 105, 255), outline=outline, width=int(1.2*S))
    draw.arc([cx + 7*S, cy - 21*S, cx + 17*S, cy - 11*S], start=180, end=320, fill=(200, 165, 110, 255), width=2*S)
    draw.ellipse([cx + 13*S, cy - 22*S, cx + 21*S, cy - 14*S], fill=(255, 165, 20, 255))
    draw.ellipse([cx + 15*S, cy - 20*S, cx + 19*S, cy - 16*S], fill=(255, 255, 190, 255))

    # Iron bomb sphere
    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(42, 46, 56, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 9*S, cy - 9*S, cx - 1*S, cy - 1*S], fill=(120, 132, 150, 230))
    draw.ellipse([cx - 7*S, cy - 7*S, cx - 4*S, cy - 4*S], fill=(220, 230, 245, 255))

    return finish(im, 40, 40)

# 5. Missile (Facing Right +X)
def gen_missile():
    im, W, H = make_canvas(48, 24)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE
    outline = (30, 35, 42, 255)

    # Rocket exhaust plume at left (-X)
    draw.polygon([(2*S, cy), (14*S, cy - 6*S), (11*S, cy), (14*S, cy + 6*S)], fill=(255, 120, 15, 255))
    draw.polygon([(6*S, cy), (13*S, cy - 3*S), (11*S, cy), (13*S, cy + 3*S)], fill=(255, 240, 60, 255))

    # Tail fins
    draw.polygon([(12*S, cy - 5*S), (20*S, cy - 5*S), (9*S, cy - 10*S)], fill=(215, 35, 35, 255), outline=outline, width=SCALE)
    draw.polygon([(12*S, cy + 5*S), (20*S, cy + 5*S), (9*S, cy + 10*S)], fill=(215, 35, 35, 255), outline=outline, width=SCALE)

    # White/steel missile body
    draw.rounded_rectangle([12*S, cy - 5.5*S, W - 14*S, cy + 5.5*S], radius=2*S, fill=(225, 232, 240, 255), outline=outline, width=int(1.5*S))
    # Shark/checkered band
    draw.rectangle([W - 22*S, cy - 5*S, W - 17*S, cy + 5*S], fill=(45, 50, 60, 255))

    # Red warhead cone pointing right (+X)
    draw.polygon([(W - 14*S, cy - 5.5*S), (W - 2*S, cy), (W - 14*S, cy + 5.5*S)], fill=(235, 35, 35, 255), outline=outline, width=int(1.5*S))

    return finish(im, 48, 24)

# 6. Ice Shard
def gen_ice_shard():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (25, 95, 175, 255)

    draw.polygon([(cx, 2*S), (cx + 8*S, cy), (cx, H - 2*S), (cx - 8*S, cy)], fill=(205, 245, 255, 255), outline=outline, width=int(1.5*S))
    draw.polygon([(2*S, cy), (cx, cy - 5*S), (W - 2*S, cy), (cx, cy + 5*S)], fill=(165, 228, 255, 230), outline=outline, width=SCALE)
    draw.ellipse([cx - 3*S, cy - 3*S, cx + 3*S, cy + 3*S], fill=(255, 255, 255, 255))

    return finish(im, 32, 32)

# 7. Boomerang
def gen_boomerang():
    im, W, H = make_canvas(40, 40)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (55, 30, 10, 255)

    pts = [
        (5*S, H - 7*S),
        (cx - 3*S, 5*S),
        (cx + 3*S, 5*S),
        (W - 5*S, H - 7*S),
        (W - 11*S, H - 4*S),
        (cx, 13*S),
        (11*S, H - 4*S)
    ]
    draw.polygon(pts, fill=(250, 200, 35, 255), outline=outline, width=int(1.5*S))
    # Red stripes on tips
    draw.line([(7*S, H - 11*S), (13*S, H - 9*S)], fill=(230, 30, 30, 255), width=3*S)
    draw.line([(W - 7*S, H - 11*S), (W - 13*S, H - 9*S)], fill=(230, 30, 30, 255), width=3*S)

    return finish(im, 40, 40)

# 8. Glaive
def gen_glaive():
    im, W, H = make_canvas(44, 44)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (35, 50, 70, 255)

    gr = 19 * S
    for a in [0, 120, 240]:
        rad = math.radians(a)
        tip_x = cx + int(math.cos(rad) * gr)
        tip_y = cy + int(math.sin(rad) * gr)
        curve_x = cx + int(math.cos(rad + 0.65) * gr * 0.72)
        curve_y = cy + int(math.sin(rad + 0.65) * gr * 0.72)
        draw.polygon([(cx, cy), (tip_x, tip_y), (curve_x, curve_y)], fill=(230, 242, 255, 255), outline=outline, width=int(1.5*S))

    draw.ellipse([cx - 6*S, cy - 6*S, cx + 6*S, cy + 6*S], fill=(255, 210, 20, 255), outline=outline, width=int(1.5*S))
    draw.ellipse([cx - 2.5*S, cy - 2.5*S, cx + 2.5*S, cy + 2.5*S], fill=(255, 255, 255, 255))

    return finish(im, 44, 44)

# 9. Glue Splat
def gen_glue_splat():
    im, W, H = make_canvas(36, 36)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (145, 115, 10, 255)

    draw.ellipse([cx - 12*S, cy - 9*S, cx + 12*S, cy + 9*S], fill=(255, 225, 25, 255), outline=outline, width=int(1.5*S))
    for ox, oy, r in [(-12, -5, 4), (11, 5, 5), (-7, 8, 4), (9, -7, 3.5)]:
        draw.ellipse([cx + (ox-r)*S, cy + (oy-r)*S, cx + (ox+r)*S, cy + (oy+r)*S], fill=(255, 225, 25, 255), outline=outline, width=SCALE)
    draw.ellipse([cx - 6*S, cy - 5*S, cx + 1*S, cy - 1*S], fill=(255, 255, 195, 240))

    return finish(im, 36, 36)

# 10. Laser Beam
def gen_laser_beam():
    im, W, H = make_canvas(48, 18)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    draw.rounded_rectangle([2*S, cy - 6*S, W - 2*S, cy + 6*S], radius=6*S, fill=(255, 10, 40, 130))
    draw.rounded_rectangle([4*S, cy - 3.5*S, W - 4*S, cy + 3.5*S], radius=3*S, fill=(255, 45, 45, 255))
    draw.rounded_rectangle([6*S, cy - 1.5*S, W - 6*S, cy + 1.5*S], radius=SCALE, fill=(255, 255, 255, 255))

    return finish(im, 48, 18)

# 11. Plasma Orb
def gen_plasma_orb():
    im, W, H = make_canvas(36, 36)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw.ellipse([cx - 15*S, cy - 15*S, cx + 15*S, cy + 15*S], fill=(175, 25, 255, 120))
    draw.ellipse([cx - 11*S, cy - 11*S, cx + 11*S, cy + 11*S], fill=(225, 70, 255, 245), outline=(120, 10, 190, 255), width=SCALE)
    draw.ellipse([cx - 6*S, cy - 6*S, cx + 6*S, cy + 6*S], fill=(255, 255, 255, 255))

    return finish(im, 36, 36)

# 12. Sun Beam
def gen_sun_beam():
    im, W, H = make_canvas(52, 24)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    draw.rounded_rectangle([2*S, cy - 9*S, W - 2*S, cy + 9*S], radius=8*S, fill=(255, 185, 0, 140))
    draw.rounded_rectangle([4*S, cy - 5.5*S, W - 4*S, cy + 5.5*S], radius=5*S, fill=(255, 235, 40, 255))
    draw.rounded_rectangle([7*S, cy - 2.5*S, W - 7*S, cy + 2.5*S], radius=2*S, fill=(255, 255, 255, 255))

    return finish(im, 52, 24)

# 13. Mortar Shell & Reticle
def gen_mortar_shell():
    im, W, H = make_canvas(28, 36)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (20, 25, 20, 255)

    draw.polygon([(cx, H - 3*S), (cx + 7*S, cy), (cx + 7*S, 5*S), (cx - 7*S, 5*S), (cx - 7*S, cy)], fill=(65, 78, 70, 255), outline=outline, width=int(1.5*S))
    draw.rectangle([cx - 6.5*S, 10*S, cx + 6.5*S, 15*S], fill=(230, 40, 30, 255))

    return finish(im, 28, 36)

def gen_mortar_reticle():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], outline=(20, 20, 20, 220), width=4*S)
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], outline=(255, 45, 45, 255), width=2*S)
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], outline=(255, 215, 0, 230), width=int(1.5*S))
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        draw.line([(cx + dx*5*S, cy + dy*5*S), (cx + dx*23*S, cy + dy*23*S)], fill=(255, 45, 45, 255), width=2*S)
    draw.ellipse([cx - 2.5*S, cy - 2.5*S, cx + 2.5*S, cy + 2.5*S], fill=(255, 255, 255, 255))

    return finish(im, 48, 48)

# 14. Banana Bunch Collectible
def gen_banana():
    im, W, H = make_canvas(44, 44)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (65, 42, 10, 255)

    # Golden glow behind bunch so it stands out on any map
    draw.ellipse([cx - 19*S, cy - 19*S, cx + 19*S, cy + 19*S], fill=(255, 240, 80, 95))

    # 3 Curved plump yellow bananas fanned out from top stem
    bananas = [
        [(cx - 2*S, cy - 11*S), (cx - 14*S, cy - 2*S), (cx - 12*S, cy + 12*S), (cx - 4*S, cy + 14*S), (cx - 4*S, cy + 2*S)],
        [(cx, cy - 11*S), (cx - 5*S, cy + 3*S), (cx, cy + 16*S), (cx + 7*S, cy + 14*S), (cx + 4*S, cy)],
        [(cx + 2*S, cy - 11*S), (cx + 6*S, cy), (cx + 14*S, cy + 11*S), (cx + 17*S, cy + 3*S), (cx + 10*S, cy - 7*S)]
    ]
    for pts in bananas:
        draw.polygon(pts, fill=(255, 225, 25, 255), outline=outline, width=int(1.8*S))

    # Green/brown top stem knot
    draw.rounded_rectangle([cx - 4*S, cy - 15*S, cx + 4*S, cy - 9*S], radius=SCALE, fill=(95, 145, 35, 255), outline=outline, width=int(1.5*S))

    return finish(im, 44, 44)

# 15. Road Spikes (Sharp metallic caltrop cluster)
def gen_road_spikes():
    im, W, H = make_canvas(44, 44)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (30, 38, 48, 255)

    # Draw 5 overlapping 4-pronged steel caltrops
    centers = [(cx - 8*S, cy + 5*S), (cx + 8*S, cy + 5*S), (cx - 6*S, cy - 5*S), (cx + 6*S, cy - 5*S), (cx, cy + 1*S)]
    for x0, y0 in centers:
        for angle in [25, 115, 205, 295]:
            rad = math.radians(angle)
            tx = x0 + int(math.cos(rad) * 10 * S)
            ty = y0 + int(math.sin(rad) * 10 * S)
            px, py = -math.sin(rad)*2.5*S, math.cos(rad)*2.5*S
            col = (230, 240, 252, 255) if angle < 180 else (165, 180, 198, 255)
            draw.polygon([(x0 + px, y0 + py), (tx, ty), (x0 - px, y0 - py)], fill=col, outline=outline, width=int(1.2*S))
        draw.ellipse([x0 - 2.5*S, y0 - 2.5*S, x0 + 2.5*S, y0 + 2.5*S], fill=(255, 205, 30, 255), outline=outline, width=SCALE)

    return finish(im, 44, 44)

# 16. Explosive Pineapple
def gen_pineapple():
    im, W, H = make_canvas(44, 44)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2 + 4*SCALE
    S = SCALE
    outline = (48, 30, 8, 255)

    # Green spiky crown leaves at top
    leaves = [
        [(cx, cy - 10*S), (cx - 11*S, cy - 21*S), (cx - 3*S, cy - 12*S)],
        [(cx, cy - 10*S), (cx - 5*S, cy - 24*S), (cx + 1*S, cy - 12*S)],
        [(cx, cy - 10*S), (cx + 5*S, cy - 24*S), (cx - 1*S, cy - 12*S)],
        [(cx, cy - 10*S), (cx + 11*S, cy - 21*S), (cx + 3*S, cy - 12*S)],
    ]
    for l in leaves:
        draw.polygon(l, fill=(45, 180, 45, 255), outline=(18, 75, 18, 255), width=int(1.5*S))

    # Golden pineapple oval body
    bx1, by1, bx2, by2 = cx - 12*S, cy - 13*S, cx + 12*S, cy + 13*S
    draw.ellipse([bx1, by1, bx2, by2], fill=(245, 180, 25, 255), outline=outline, width=2*S)

    # Crisscross diamond segments clipped inside oval
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1 + 2*S, by1 + 2*S, bx2 - 2*S, by2 - 2*S], fill=255)
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid)
    for offset in range(-24*S, 28*S, 7*S):
        gdraw.line([(cx + offset - 12*S, by1), (cx + offset + 12*S, by2)], fill=(165, 100, 12, 255), width=int(1.5*S))
        gdraw.line([(cx + offset + 12*S, by1), (cx + offset - 12*S, by2)], fill=(165, 100, 12, 255), width=int(1.5*S))
    im.paste(grid, (0, 0), mask)
    draw = ImageDraw.Draw(im)

    # Red TNT countdown band around middle
    draw.rounded_rectangle([cx - 8*S, cy - 4*S, cx + 8*S, cy + 5*S], radius=2*S, fill=(30, 30, 35, 255), outline=(255, 215, 0, 255), width=int(1.2*S))
    draw.rectangle([cx - 5*S, cy - 2*S, cx + 5*S, cy + 3*S], fill=(255, 45, 45, 255))

    return finish(im, 44, 44)

# 17. Pop Starburst FX
def gen_pop_fx():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    pts = []
    for i in range(16):
        a = math.radians(i * 22.5)
        r = 21*S if i % 2 == 0 else 9*S
        pts.append((cx + int(math.cos(a)*r), cy + int(math.sin(a)*r)))
    draw.polygon(pts, fill=(255, 245, 160, 245), outline=(255, 140, 20, 255), width=int(1.5*S))
    draw.ellipse([cx - 6*S, cy - 6*S, cx + 6*S, cy + 6*S], fill=(255, 255, 255, 255))

    return finish(im, 48, 48)

# 18. Explosion Blast FX
def gen_explosion_fx():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    pts = []
    for i in range(20):
        a = math.radians(i * 18)
        r = 29*S if i % 2 == 0 else 18*S
        pts.append((cx + int(math.cos(a)*r), cy + int(math.sin(a)*r)))
    draw.polygon(pts, fill=(255, 95, 20, 230), outline=(180, 30, 10, 255), width=2*S)
    draw.ellipse([cx - 17*S, cy - 17*S, cx + 17*S, cy + 17*S], fill=(255, 185, 25, 245))
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], fill=(255, 250, 160, 255))

    return finish(im, 64, 64)

# Save all projectiles
gen_dart().save(os.path.join(ASSETS_PROJ, "dart.png"))
gen_tack().save(os.path.join(ASSETS_PROJ, "tack.png"))
gen_blade().save(os.path.join(ASSETS_PROJ, "blade.png"))
gen_bomb().save(os.path.join(ASSETS_PROJ, "bomb.png"))
gen_missile().save(os.path.join(ASSETS_PROJ, "missile.png"))
gen_ice_shard().save(os.path.join(ASSETS_PROJ, "ice_shard.png"))
gen_boomerang().save(os.path.join(ASSETS_PROJ, "boomerang.png"))
gen_glaive().save(os.path.join(ASSETS_PROJ, "glaive.png"))
gen_glue_splat().save(os.path.join(ASSETS_PROJ, "glue_splat.png"))
gen_laser_beam().save(os.path.join(ASSETS_PROJ, "laser_beam.png"))
gen_plasma_orb().save(os.path.join(ASSETS_PROJ, "plasma_orb.png"))
gen_sun_beam().save(os.path.join(ASSETS_PROJ, "sun_beam.png"))
gen_mortar_shell().save(os.path.join(ASSETS_PROJ, "mortar_shell.png"))
gen_mortar_reticle().save(os.path.join(ASSETS_PROJ, "mortar_reticle.png"))
gen_banana().save(os.path.join(ASSETS_PROJ, "banana.png"))
gen_road_spikes().save(os.path.join(ASSETS_PROJ, "road_spikes.png"))
gen_pineapple().save(os.path.join(ASSETS_PROJ, "pineapple.png"))
gen_pop_fx().save(os.path.join(ASSETS_PROJ, "pop_fx.png"))
gen_explosion_fx().save(os.path.join(ASSETS_PROJ, "explosion_fx.png"))

print(f"Generated {len(os.listdir(ASSETS_PROJ))} high-res projectile assets successfully.")
