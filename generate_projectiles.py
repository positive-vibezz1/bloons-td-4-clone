import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_PROJ = os.path.join(os.path.dirname(__file__), "assets", "projectiles")
os.makedirs(ASSETS_PROJ, exist_ok=True)

SCALE = 4

def make_canvas(w=32, h=32):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0)), w * SCALE, h * SCALE

def finish(im, w=32, h=32):
    return im.resize((w, h), Image.Resampling.LANCZOS)

# 1. Dart (Horizontal facing right)
def gen_dart():
    im, W, H = make_canvas(32, 16)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    # Steel point
    draw.polygon([(W - 4*S, cy), (W - 14*S, cy - 4*S), (W - 14*S, cy + 4*S)], fill=(210, 220, 230, 255), outline=(50, 60, 70, 255), width=SCALE)
    # Wooden shaft
    draw.rectangle([4*S, cy - 2*S, W - 14*S, cy + 2*S], fill=(185, 125, 65, 255), outline=(60, 35, 15, 255), width=SCALE)
    # Red feathers fletching
    draw.polygon([(4*S, cy - 2*S), (12*S, cy - 2*S), (4*S, cy - 7*S)], fill=(230, 40, 40, 255), outline=(120, 10, 10, 255), width=SCALE)
    draw.polygon([(4*S, cy + 2*S), (12*S, cy + 2*S), (4*S, cy + 7*S)], fill=(230, 40, 40, 255), outline=(120, 10, 10, 255), width=SCALE)

    return finish(im, 32, 16)

# 2. Tack
def gen_tack():
    im, W, H = make_canvas(20, 20)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Sharp silver tack pointing up
    draw.polygon([(cx, 3*S), (cx + 5*S, H - 5*S), (cx - 5*S, H - 5*S)], fill=(225, 235, 245, 255), outline=(60, 70, 80, 255), width=SCALE)
    draw.ellipse([cx - 7*S, H - 8*S, cx + 7*S, H - 3*S], fill=(180, 195, 210, 255), outline=(40, 50, 60, 255), width=SCALE)
    # Gleam
    draw.line([(cx - 1*S, 6*S), (cx - 1*S, H - 9*S)], fill=(255, 255, 255, 220), width=SCALE)

    return finish(im, 20, 20)

# 3. Blade
def gen_blade():
    im, W, H = make_canvas(28, 28)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Curved razor blade
    draw.arc([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], start=45, end=270, fill=(240, 245, 255, 255), width=4*S)
    draw.ellipse([cx - 3*S, cy - 3*S, cx + 3*S, cy + 3*S], fill=(80, 90, 105, 255))
    # Gleam
    draw.line([(cx - 8*S, cy - 4*S), (cx - 2*S, cy - 8*S)], fill=(255, 255, 255, 255), width=2*S)

    return finish(im, 28, 28)

# 4. Bomb
def gen_bomb():
    im, W, H = make_canvas(28, 28)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2 + 2*SCALE
    S = SCALE

    # Black iron bomb sphere
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], fill=(45, 48, 55, 255), outline=(15, 18, 22, 255), width=SCALE)
    # Highlight
    draw.ellipse([cx - 7*S, cy - 7*S, cx - 2*S, cy - 2*S], fill=(130, 140, 155, 220))
    # Fuse collar
    draw.rectangle([cx - 3*S, cy - 13*S, cx + 3*S, cy - 9*S], fill=(90, 95, 100, 255), outline=(20, 20, 20, 255), width=SCALE)
    # Fuse rope
    draw.arc([cx, cy - 18*S, cx + 8*S, cy - 10*S], start=180, end=300, fill=(180, 150, 100, 255), width=2*S)
    # Burning spark
    draw.ellipse([cx + 6*S, cy - 19*S, cx + 10*S, cy - 15*S], fill=(255, 220, 30, 255))
    draw.ellipse([cx + 7*S, cy - 18*S, cx + 9*S, cy - 16*S], fill=(255, 255, 255, 255))

    return finish(im, 28, 28)

# 5. Missile
def gen_missile():
    im, W, H = make_canvas(36, 16)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    # Exhaust flame on left
    draw.polygon([(2*S, cy), (10*S, cy - 4*S), (8*S, cy), (10*S, cy + 4*S)], fill=(255, 140, 20, 255))
    draw.polygon([(5*S, cy), (9*S, cy - 2*S), (8*S, cy), (9*S, cy + 2*S)], fill=(255, 255, 80, 255))

    # Missile body
    draw.rectangle([8*S, cy - 4*S, W - 10*S, cy + 4*S], fill=(190, 200, 210, 255), outline=(40, 45, 50, 255), width=SCALE)
    # Red warhead cone
    draw.polygon([(W - 10*S, cy - 4*S), (W - 2*S, cy), (W - 10*S, cy + 4*S)], fill=(230, 40, 40, 255), outline=(120, 10, 10, 255), width=SCALE)
    # Fins
    draw.polygon([(8*S, cy - 4*S), (14*S, cy - 4*S), (6*S, cy - 7*S)], fill=(60, 65, 75, 255))
    draw.polygon([(8*S, cy + 4*S), (14*S, cy + 4*S), (6*S, cy + 7*S)], fill=(60, 65, 75, 255))

    return finish(im, 36, 16)

# 6. Ice Shard
def gen_ice_shard():
    im, W, H = make_canvas(24, 24)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # 4-pointed crystal
    draw.polygon([(cx, 2*S), (cx + 6*S, cy), (cx, H - 2*S), (cx - 6*S, cy)], fill=(210, 245, 255, 255), outline=(30, 100, 180, 255), width=SCALE)
    draw.polygon([(cx, 2*S), (cx + 6*S, cy), (cx, cy)], fill=(160, 220, 255, 255))
    draw.polygon([(cx - 6*S, cy), (cx, cy), (cx, H - 2*S)], fill=(130, 195, 245, 255))
    draw.ellipse([cx - 2*S, cy - 2*S, cx + 2*S, cy + 2*S], fill=(255, 255, 255, 255))

    return finish(im, 24, 24)

# 7. Boomerang
def gen_boomerang():
    im, W, H = make_canvas(28, 28)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Curved V shape
    pts = [
        (4*S, H - 6*S),
        (cx - 2*S, 6*S),
        (cx + 2*S, 6*S),
        (W - 4*S, H - 6*S),
        (W - 8*S, H - 4*S),
        (cx, 10*S),
        (8*S, H - 4*S)
    ]
    draw.polygon(pts, fill=(215, 140, 65, 255), outline=(65, 35, 15, 255), width=SCALE)
    # Tribal markings
    draw.line([(cx - 2*S, 7*S), (cx + 2*S, 7*S)], fill=(220, 30, 30, 255), width=2*S)
    draw.line([(cx - 4*S, 12*S), (cx - 1*S, 14*S)], fill=(220, 30, 30, 255), width=2*S)

    return finish(im, 28, 28)

# 8. Glaive
def gen_glaive():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Central golden core
    draw.ellipse([cx - 4*S, cy - 4*S, cx + 4*S, cy + 4*S], fill=(255, 215, 0, 255), outline=(100, 80, 0, 255), width=SCALE)

    # 3 curved razor scythe blades
    gr = 12 * S
    for a in [0, 120, 240]:
        rad = math.radians(a)
        tip_x = cx + int(math.cos(rad) * gr)
        tip_y = cy + int(math.sin(rad) * gr)
        curve_x = cx + int(math.cos(rad + 0.6) * gr * 0.75)
        curve_y = cy + int(math.sin(rad + 0.6) * gr * 0.75)
        draw.polygon([(cx, cy), (tip_x, tip_y), (curve_x, curve_y)], fill=(230, 240, 255, 255), outline=(50, 70, 95, 255), width=SCALE)

    return finish(im, 32, 32)

# 9. Glue Splat
def gen_glue_splat():
    im, W, H = make_canvas(24, 24)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Viscous puddle
    draw.ellipse([cx - 8*S, cy - 6*S, cx + 8*S, cy + 6*S], fill=(245, 215, 25, 255), outline=(150, 125, 10, 255), width=SCALE)
    # Droplets
    draw.ellipse([cx - 10*S, cy - 2*S, cx - 7*S, cy + 2*S], fill=(245, 215, 25, 255))
    draw.ellipse([cx + 6*S, cy + 3*S, cx + 10*S, cy + 7*S], fill=(245, 215, 25, 255))
    # Shiny bubble
    draw.ellipse([cx - 4*S, cy - 4*S, cx - 1*S, cy - 1*S], fill=(255, 255, 200, 240))

    return finish(im, 24, 24)

# 10. Laser Beam
def gen_laser_beam():
    im, W, H = make_canvas(36, 12)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    # Red laser glow
    draw.line([(2*S, cy), (W - 2*S, cy)], fill=(255, 0, 50, 140), width=6*S)
    # Sharp laser beam
    draw.line([(3*S, cy), (W - 3*S, cy)], fill=(255, 30, 30, 255), width=3*S)
    # White-hot core
    draw.line([(5*S, cy), (W - 5*S, cy)], fill=(255, 255, 255, 255), width=SCALE)

    return finish(im, 36, 12)

# 11. Plasma Orb
def gen_plasma_orb():
    im, W, H = make_canvas(26, 26)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Outer violet energy corona
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], fill=(180, 30, 255, 140))
    # Electric core
    draw.ellipse([cx - 7*S, cy - 7*S, cx + 7*S, cy + 7*S], fill=(225, 75, 255, 255))
    # White center
    draw.ellipse([cx - 3*S, cy - 3*S, cx + 3*S, cy + 3*S], fill=(255, 255, 255, 255))

    return finish(im, 26, 26)

# 12. Sun Beam
def gen_sun_beam():
    im, W, H = make_canvas(40, 18)
    draw = ImageDraw.Draw(im)
    cy = H // 2
    S = SCALE

    # Radiant golden rays
    draw.line([(2*S, cy), (W - 2*S, cy)], fill=(255, 200, 0, 160), width=8*S)
    draw.line([(3*S, cy), (W - 3*S, cy)], fill=(255, 240, 50, 255), width=4*S)
    draw.line([(5*S, cy), (W - 5*S, cy)], fill=(255, 255, 255, 255), width=2*S)

    return finish(im, 40, 18)

# 13. Mortar Shell & Reticle
def gen_mortar_shell():
    im, W, H = make_canvas(20, 28)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Artillery shell pointing down
    draw.polygon([(cx, H - 3*S), (cx + 5*S, cy), (cx + 5*S, 4*S), (cx - 5*S, 4*S), (cx - 5*S, cy)], fill=(65, 75, 70, 255), outline=(20, 25, 20, 255), width=SCALE)
    # Warhead band
    draw.rectangle([cx - 5*S, 8*S, cx + 5*S, 12*S], fill=(220, 40, 30, 255))
    # Tail fins
    draw.polygon([(cx - 5*S, 4*S), (cx - 8*S, 2*S), (cx - 5*S, 8*S)], fill=(40, 45, 45, 255))
    draw.polygon([(cx + 5*S, 4*S), (cx + 8*S, 2*S), (cx + 5*S, 8*S)], fill=(40, 45, 45, 255))

    return finish(im, 20, 28)

def gen_mortar_reticle():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Red targeting crosshairs
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], outline=(235, 40, 40, 240), width=2*S)
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], outline=(235, 40, 40, 200), width=SCALE)
    # Crosshair lines
    draw.line([(cx - 22*S, cy), (cx - 4*S, cy)], fill=(235, 40, 40, 240), width=2*S)
    draw.line([(cx + 4*S, cy), (cx + 22*S, cy)], fill=(235, 40, 40, 240), width=2*S)
    draw.line([(cx, cy - 22*S), (cx, cy - 4*S)], fill=(235, 40, 40, 240), width=2*S)
    draw.line([(cx, cy + 4*S), (cx, cy + 22*S)], fill=(235, 40, 40, 240), width=2*S)
    # Center dot
    draw.ellipse([cx - 2*S, cy - 2*S, cx + 2*S, cy + 2*S], fill=(255, 255, 255, 255))

    return finish(im, 48, 48)

# 14. Banana Item
def gen_banana():
    im, W, H = make_canvas(28, 28)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Bunch of 3 golden bananas
    def draw_b(offset_x, offset_y, angle):
        draw.arc([cx - 8*S + offset_x, cy - 10*S + offset_y, cx + 8*S + offset_x, cy + 10*S + offset_y], start=20, end=160, fill=(255, 220, 20, 255), width=4*S)

    draw_b(-2*S, 0, 0)
    draw_b(2*S, 2*S, 10)
    draw_b(0, -2*S, -10)
    # Stem
    draw.rectangle([cx - 2*S, cy - 11*S, cx + 2*S, cy - 7*S], fill=(100, 70, 20, 255))
    # Sparkle gleam
    draw.line([(cx - 3*S, cy - 2*S), (cx + 3*S, cy - 2*S)], fill=(255, 255, 255, 220), width=SCALE)

    return finish(im, 28, 28)

# 15. Road Spikes (Track item)
def gen_road_spikes():
    im, W, H = make_canvas(32, 24)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2 + 2*SCALE
    S = SCALE

    # Caltrop spikes pointing up and outward
    spike_color = (195, 205, 215, 255)
    outline = (40, 50, 60, 255)

    spikes = [
        [(cx - 8*S, cy + 4*S), (cx - 12*S, cy - 6*S), (cx - 6*S, cy + 2*S)],
        [(cx - 2*S, cy + 4*S), (cx - 4*S, cy - 8*S), (cx + 2*S, cy + 4*S)],
        [(cx + 4*S, cy + 3*S), (cx + 8*S, cy - 7*S), (cx + 9*S, cy + 4*S)],
        [(cx, cy + 4*S), (cx + 1*S, cy - 9*S), (cx + 4*S, cy + 4*S)],
        [(cx - 10*S, cy + 4*S), (cx - 6*S, cy - 7*S), (cx - 3*S, cy + 4*S)],
    ]
    for pts in spikes:
        draw.polygon(pts, fill=spike_color, outline=outline, width=SCALE)

    return finish(im, 32, 24)

# 16. Pineapple (Track item)
def gen_pineapple():
    im, W, H = make_canvas(30, 36)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2 + 3*SCALE
    S = SCALE
    outline = (50, 35, 10, 255)

    # Pineapple body
    draw.ellipse([cx - 8*S, cy - 10*S, cx + 8*S, cy + 10*S], fill=(225, 160, 25, 255), outline=outline, width=SCALE)
    # Pineapple diamond texture
    for a in range(-6, 7, 4):
        draw.line([(cx + a*S - 4*S, cy - 8*S), (cx + a*S + 4*S, cy + 8*S)], fill=(160, 100, 15, 255), width=SCALE)
        draw.line([(cx + a*S + 4*S, cy - 8*S), (cx + a*S - 4*S, cy + 8*S)], fill=(160, 100, 15, 255), width=SCALE)

    # Digital countdown clock face
    draw.rounded_rectangle([cx - 5*S, cy - 3*S, cx + 5*S, cy + 5*S], radius=SCALE, fill=(20, 20, 20, 255), outline=(180, 140, 20, 255), width=SCALE)
    draw.rectangle([cx - 2*S, cy - 1*S, cx + 2*S, cy + 3*S], fill=(255, 40, 40, 255))

    # Green leafy crown
    leaves = [
        [(cx, cy - 10*S), (cx - 7*S, cy - 18*S), (cx - 2*S, cy - 11*S)],
        [(cx, cy - 10*S), (cx, cy - 20*S), (cx + 2*S, cy - 10*S)],
        [(cx, cy - 10*S), (cx + 7*S, cy - 18*S), (cx + 2*S, cy - 11*S)]
    ]
    for l in leaves:
        draw.polygon(l, fill=(45, 165, 45, 255), outline=(20, 80, 20, 255), width=SCALE)

    # Lit fuse spark
    draw.line([(cx, cy - 20*S), (cx + 3*S, cy - 24*S)], fill=(160, 130, 70, 255), width=SCALE)
    draw.ellipse([cx + 2*S, cy - 26*S, cx + 6*S, cy - 22*S], fill=(255, 220, 30, 255))

    return finish(im, 30, 36)

# 17. Pop Particles / Splash FX
def gen_pop_fx():
    im, W, H = make_canvas(36, 36)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Multi-color pop sparkles
    colors = [(255, 50, 50, 255), (255, 220, 30, 255), (50, 150, 255, 255), (255, 100, 220, 255)]
    for idx, a in enumerate(range(0, 360, 45)):
        rad = math.radians(a)
        c = colors[idx % len(colors)]
        r1 = 6 * S
        r2 = 14 * S
        x1 = cx + int(math.cos(rad) * r1)
        y1 = cy + int(math.sin(rad) * r1)
        x2 = cx + int(math.cos(rad) * r2)
        y2 = cy + int(math.sin(rad) * r2)
        draw.line([(x1, y1), (x2, y2)], fill=c, width=2*S)
        draw.ellipse([x2 - SCALE, y2 - SCALE, x2 + SCALE, y2 + SCALE], fill=(255, 255, 255, 255))

    return finish(im, 36, 36)

# 18. Explosion Blast FX
def gen_explosion_fx():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Fiery blast circles
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], fill=(230, 60, 20, 180))
    draw.ellipse([cx - 15*S, cy - 15*S, cx + 15*S, cy + 15*S], fill=(255, 150, 20, 220))
    draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], fill=(255, 230, 40, 255))
    draw.ellipse([cx - 5*S, cy - 5*S, cx + 5*S, cy + 5*S], fill=(255, 255, 255, 255))

    return finish(im, 48, 48)

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

print(f"Generated {len(os.listdir(ASSETS_PROJ))} projectile assets successfully.")
