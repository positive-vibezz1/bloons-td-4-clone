import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_TOWERS = os.path.join(os.path.dirname(__file__), "assets", "towers")
os.makedirs(ASSETS_TOWERS, exist_ok=True)

SCALE = 4

def make_canvas(w=64, h=64):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0)), w * SCALE, h * SCALE

def finish(im, w=64, h=64):
    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_monkey_base(draw, cx, cy, S, headband_color=None, cape=False, suit_color=None):
    # Fur colors
    fur = suit_color if suit_color else (145, 85, 45, 255)
    fur_dark = (95, 50, 25, 255)
    skin = (245, 195, 145, 255)
    outline = (40, 20, 10, 255)

    if cape:
        # Flowing red cape behind
        cape_pts = [(cx - 16*S, cy - 2*S), (cx + 16*S, cy - 2*S), (cx + 22*S, cy + 24*S), (cx - 22*S, cy + 24*S)]
        draw.polygon(cape_pts, fill=(220, 30, 40, 255), outline=(140, 15, 20, 255), width=2*S)

    # Tail
    tail_pts = [(cx - 10*S, cy + 12*S), (cx - 20*S, cy + 16*S), (cx - 24*S, cy + 6*S), (cx - 18*S, cy + 2*S)]
    draw.line(tail_pts, fill=fur, width=5*S)
    draw.line(tail_pts, fill=outline, width=1*S)

    # Ears
    draw.ellipse([cx - 20*S, cy - 14*S, cx - 10*S, cy - 4*S], fill=fur, outline=outline, width=2*S)
    draw.ellipse([cx - 18*S, cy - 12*S, cx - 12*S, cy - 6*S], fill=skin)
    draw.ellipse([cx + 10*S, cy - 14*S, cx + 20*S, cy - 4*S], fill=fur, outline=outline, width=2*S)
    draw.ellipse([cx + 12*S, cy - 12*S, cx + 18*S, cy - 6*S], fill=skin)

    # Body
    draw.ellipse([cx - 13*S, cy - 2*S, cx + 13*S, cy + 20*S], fill=fur, outline=outline, width=2*S)
    if not suit_color:
        # Tan belly
        draw.ellipse([cx - 7*S, cy + 2*S, cx + 7*S, cy + 16*S], fill=skin)

    # Head
    draw.ellipse([cx - 14*S, cy - 18*S, cx + 14*S, cy + 6*S], fill=fur, outline=outline, width=2*S)

    # Face snout
    draw.ellipse([cx - 10*S, cy - 7*S, cx + 10*S, cy + 4*S], fill=skin, outline=outline, width=SCALE)

    # Snout nostrils & mouth
    draw.arc([cx - 5*S, cy - 4*S, cx + 5*S, cy + 2*S], start=0, end=180, fill=outline, width=2*S)
    draw.ellipse([cx - 2*S, cy - 3*S, cx - 1*S, cy - 1*S], fill=outline)
    draw.ellipse([cx + 1*S, cy - 3*S, cx + 2*S, cy - 1*S], fill=outline)

    # Eyes
    draw.ellipse([cx - 8*S, cy - 12*S, cx - 2*S, cy - 5*S], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
    draw.ellipse([cx + 2*S, cy - 12*S, cx + 8*S, cy - 5*S], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
    # Pupils
    draw.ellipse([cx - 5*S, cy - 10*S, cx - 2*S, cy - 7*S], fill=(20, 20, 20, 255))
    draw.ellipse([cx + 5*S, cy - 10*S, cx + 8*S, cy - 7*S], fill=(20, 20, 20, 255))

    if headband_color:
        # Ninja / bandana headband
        draw.rectangle([cx - 14*S, cy - 16*S, cx + 14*S, cy - 11*S], fill=headband_color)
        draw.polygon([(cx - 14*S, cy - 14*S), (cx - 20*S, cy - 12*S), (cx - 18*S, cy - 7*S)], fill=headband_color)

# 1. Dart Monkey (Base & Throw)
def gen_dart_monkey(throwing=False):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw_monkey_base(draw, cx, cy, S, headband_color=(220, 30, 30, 255))

    # Hand & Dart
    if not throwing:
        # Cocked back holding dart
        draw.ellipse([cx + 10*S, cy - 6*S, cx + 18*S, cy + 2*S], fill=(245, 195, 145, 255), outline=(40, 20, 10, 255), width=SCALE)
        # Dart
        draw.line([(cx + 12*S, cy - 4*S), (cx + 26*S, cy - 12*S)], fill=(150, 150, 160, 255), width=3*S)
        draw.polygon([(cx + 24*S, cy - 14*S), (cx + 29*S, cy - 14*S), (cx + 26*S, cy - 9*S)], fill=(220, 30, 30, 255))
    else:
        # Throwing arm thrust forward
        draw.line([(cx + 8*S, cy), (cx + 22*S, cy + 2*S)], fill=(145, 85, 45, 255), width=5*S)
        draw.ellipse([cx + 20*S, cy - 2*S, cx + 27*S, cy + 5*S], fill=(245, 195, 145, 255), outline=(40, 20, 10, 255), width=SCALE)

    return finish(im, 64, 64)

# 2. Tack Shooter (Tack, Blade, Ring of Fire)
def gen_tack_shooter(variant="base"):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    if variant == "base":
        base_col = (195, 125, 45, 255)
        top_col = (235, 165, 75, 255)
        outline = (60, 35, 10, 255)
        nozzle_col = (70, 70, 75, 255)
    elif variant == "blade":
        base_col = (130, 145, 160, 255)
        top_col = (210, 225, 240, 255)
        outline = (30, 40, 50, 255)
        nozzle_col = (40, 50, 60, 255)
    else: # ring of fire
        base_col = (180, 40, 20, 255)
        top_col = (255, 120, 20, 255)
        outline = (60, 10, 5, 255)
        nozzle_col = (255, 215, 0, 255)

    # 8 Nozzles around circle
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        nx = cx + int(math.cos(rad) * 22 * S)
        ny = cy + int(math.sin(rad) * 22 * S)
        draw.ellipse([nx - 4*S, ny - 4*S, nx + 4*S, ny + 4*S], fill=nozzle_col, outline=outline, width=SCALE)
        if variant == "blade":
            # Blade protruding
            bx = cx + int(math.cos(rad) * 26 * S)
            by = cy + int(math.sin(rad) * 26 * S)
            draw.polygon([(nx, ny), (bx + 2*S, by - 2*S), (bx - 2*S, by + 2*S)], fill=(240, 245, 255, 255))

    # Base octagon / circular turret body
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], fill=base_col, outline=outline, width=2*S)
    draw.ellipse([cx - 14*S, cy - 14*S, cx + 14*S, cy + 14*S], fill=top_col, outline=outline, width=SCALE)

    if variant == "ring_of_fire":
        # Glowing magma core
        draw.ellipse([cx - 8*S, cy - 8*S, cx + 8*S, cy + 8*S], fill=(255, 235, 50, 255))
        draw.ellipse([cx - 4*S, cy - 4*S, cx + 4*S, cy + 4*S], fill=(255, 255, 255, 255))
    else:
        # Metallic dome cap & rivet
        draw.ellipse([cx - 7*S, cy - 7*S, cx + 7*S, cy + 7*S], fill=(80, 85, 95, 255), outline=outline, width=SCALE)
        draw.ellipse([cx - 3*S, cy - 4*S, cx + 1*S, cy], fill=(255, 255, 255, 180))

    return finish(im, 64, 64)

# 3. Bomb Tower (Cannon, Missile, MOAB Mauler)
def gen_bomb_tower(variant="base"):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (30, 30, 35, 255)

    # Heavy round stone/turntable base
    draw.ellipse([cx - 22*S, cy - 18*S, cx + 22*S, cy + 22*S], fill=(90, 95, 105, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 16*S, cy - 13*S, cx + 16*S, cy + 17*S], fill=(130, 135, 145, 255), outline=outline, width=SCALE)

    if variant == "base":
        # Cast iron cannon barrel pointing upwards/right
        bx1, by1 = cx - 6*S, cy + 8*S
        bx2, by2 = cx + 18*S, cy - 16*S
        # Barrel cylinder
        barrel_pts = [(cx - 10*S, cy - 2*S), (cx + 10*S, cy - 22*S), (cx + 20*S, cy - 12*S), (cx, cy + 8*S)]
        draw.polygon(barrel_pts, fill=(50, 52, 60, 255), outline=outline, width=2*S)
        # Muzzle ring
        draw.ellipse([cx + 10*S, cy - 23*S, cx + 22*S, cy - 11*S], fill=(30, 32, 38, 255), outline=outline, width=SCALE)
        draw.ellipse([cx + 12*S, cy - 21*S, cx + 20*S, cy - 13*S], fill=(10, 10, 15, 255))
        # Fuse with spark
        draw.line([(cx - 7*S, cy + 4*S), (cx - 14*S, cy + 8*S)], fill=(180, 150, 100, 255), width=2*S)
        draw.ellipse([cx - 16*S, cy + 6*S, cx - 12*S, cy + 10*S], fill=(255, 200, 40, 255))

    elif variant == "missile":
        # Modern quad missile launcher pod
        pod_pts = [(cx - 12*S, cy - 8*S), (cx + 14*S, cy - 22*S), (cx + 22*S, cy - 6*S), (cx - 4*S, cy + 8*S)]
        draw.polygon(pod_pts, fill=(75, 95, 65, 255), outline=outline, width=2*S)
        # Missile tubes
        for ox, oy in [(-2, -6), (6, -10), (0, 0), (8, -4)]:
            draw.ellipse([cx + ox*S, cy + oy*S, cx + (ox+5)*S, cy + (oy+5)*S], fill=(20, 25, 20, 255), outline=(220, 50, 40, 255), width=SCALE)

    else: # moab mauler
        # Massive reinforced cannon with shark jaws
        barrel_pts = [(cx - 10*S, cy), (cx + 12*S, cy - 22*S), (cx + 25*S, cy - 9*S), (cx + 3*S, cy + 13*S)]
        draw.polygon(barrel_pts, fill=(45, 50, 60, 255), outline=outline, width=2*S)
        # Muzzle ring
        draw.ellipse([cx + 12*S, cy - 23*S, cx + 26*S, cy - 9*S], fill=(20, 20, 25, 255), outline=(220, 30, 30, 255), width=2*S)
        # Shark teeth painted on barrel
        draw.polygon([(cx + 4*S, cy - 10*S), (cx + 10*S, cy - 14*S), (cx + 10*S, cy - 6*S)], fill=(255, 255, 255, 255))
        draw.polygon([(cx + 10*S, cy - 5*S), (cx + 16*S, cy - 9*S), (cx + 16*S, cy - 1*S)], fill=(255, 255, 255, 255))

    return finish(im, 64, 64)

# 4. Ice Tower (Base & Arctic Wind)
def gen_ice_tower(variant="base"):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (20, 60, 110, 255)

    # Icy frost pedestal
    pedestal_pts = [(cx - 20*S, cy + 18*S), (cx + 20*S, cy + 18*S), (cx + 14*S, cy + 8*S), (cx - 14*S, cy + 8*S)]
    draw.polygon(pedestal_pts, fill=(160, 215, 245, 255), outline=outline, width=2*S)

    # Central ice spire crystal
    spire_pts = [(cx, cy - 24*S), (cx + 14*S, cy + 8*S), (cx - 14*S, cy + 8*S)]
    draw.polygon(spire_pts, fill=(195, 240, 255, 255), outline=outline, width=2*S)

    # Crystalline facets
    draw.polygon([(cx, cy - 24*S), (cx, cy + 8*S), (cx - 14*S, cy + 8*S)], fill=(145, 205, 245, 255))
    draw.line([(cx, cy - 24*S), (cx, cy + 8*S)], fill=outline, width=SCALE)

    # Side ice crystal shards
    draw.polygon([(cx - 14*S, cy + 8*S), (cx - 24*S, cy - 6*S), (cx - 10*S, cy - 2*S)], fill=(180, 230, 255, 255), outline=outline, width=SCALE)
    draw.polygon([(cx + 14*S, cy + 8*S), (cx + 24*S, cy - 6*S), (cx + 10*S, cy - 2*S)], fill=(180, 230, 255, 255), outline=outline, width=SCALE)

    if variant == "arctic":
        # Swirling frost aura rings and snowflakes
        for r in [20*S, 26*S]:
            draw.arc([cx - r, cy - r, cx + r, cy + r], start=30, end=150, fill=(230, 250, 255, 220), width=2*S)
            draw.arc([cx - r, cy - r, cx + r, cy + r], start=210, end=330, fill=(230, 250, 255, 220), width=2*S)
        # Sparkles
        draw.ellipse([cx - 16*S, cy - 14*S, cx - 12*S, cy - 10*S], fill=(255, 255, 255, 255))
        draw.ellipse([cx + 14*S, cy - 16*S, cx + 18*S, cy - 12*S], fill=(255, 255, 255, 255))

    return finish(im, 64, 64)

# 5. Boomerang Monkey (Base & Glaive)
def gen_boomerang_monkey(glaive=False):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Base monkey with Aussie bush hat
    draw_monkey_base(draw, cx, cy, S)

    # Safari hat brim & crown
    hat_col = (185, 140, 85, 255)
    hat_out = (60, 40, 20, 255)
    draw.ellipse([cx - 18*S, cy - 22*S, cx + 18*S, cy - 12*S], fill=hat_col, outline=hat_out, width=2*S)
    draw.rectangle([cx - 11*S, cy - 27*S, cx + 11*S, cy - 18*S], fill=hat_col, outline=hat_out, width=SCALE)
    # Hat ribbon
    draw.rectangle([cx - 11*S, cy - 20*S, cx + 11*S, cy - 17*S], fill=(40, 80, 40, 255))

    # Hand weapon
    if not glaive:
        # Wooden curved boomerang
        b_pts = [(cx + 12*S, cy + 6*S), (cx + 22*S, cy - 4*S), (cx + 25*S, cy - 18*S), (cx + 21*S, cy - 18*S), (cx + 18*S, cy - 6*S), (cx + 10*S, cy + 2*S)]
        draw.polygon(b_pts, fill=(210, 140, 60, 255), outline=(50, 30, 10, 255), width=SCALE)
    else:
        # Spinning silver glaive
        gx, gy = cx + 18*S, cy - 8*S
        gr = 10 * S
        draw.ellipse([gx - 3*S, gy - 3*S, gx + 3*S, gy + 3*S], fill=(255, 215, 0, 255))
        for a in [0, 120, 240]:
            rad = math.radians(a)
            ex = gx + int(math.cos(rad) * gr)
            ey = gy + int(math.sin(rad) * gr)
            draw.polygon([(gx, gy), (ex, ey), (gx + int(math.cos(rad + 0.5) * gr * 0.7), gy + int(math.sin(rad + 0.5) * gr * 0.7))], fill=(225, 235, 245, 255), outline=(60, 80, 100, 255))

    return finish(im, 64, 64)

# 6. Glue Gunner
def gen_glue_gunner():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Green hazmat suit monkey
    draw_monkey_base(draw, cx, cy, S, suit_color=(50, 150, 70, 255))

    # Yellow chemical tank on back
    draw.rounded_rectangle([cx - 20*S, cy - 6*S, cx - 11*S, cy + 18*S], radius=3*S, fill=(245, 210, 30, 255), outline=(40, 40, 20, 255), width=2*S)
    # Hose connecting to gun
    draw.arc([cx - 14*S, cy + 10*S, cx + 12*S, cy + 26*S], start=0, end=180, fill=(30, 30, 30, 255), width=3*S)

    # Glue spray nozzle gun
    draw.rectangle([cx + 10*S, cy - 4*S, cx + 24*S, cy + 4*S], fill=(80, 85, 90, 255), outline=(20, 20, 20, 255), width=SCALE)
    draw.polygon([(cx + 24*S, cy - 6*S), (cx + 28*S, cy - 8*S), (cx + 28*S, cy + 8*S), (cx + 24*S, cy + 6*S)], fill=(240, 200, 20, 255), outline=(30, 30, 30, 255), width=SCALE)
    # Sticky drip
    draw.ellipse([cx + 27*S, cy + 4*S, cx + 30*S, cy + 9*S], fill=(255, 225, 50, 255))

    return finish(im, 64, 64)

# 7. Sniper Monkey
def gen_sniper_monkey():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw_monkey_base(draw, cx, cy, S)

    # Camo beret
    draw.ellipse([cx - 16*S, cy - 24*S, cx + 8*S, cy - 14*S], fill=(55, 85, 45, 255), outline=(20, 35, 15, 255), width=2*S)
    draw.ellipse([cx - 10*S, cy - 22*S, cx - 4*S, cy - 16*S], fill=(120, 110, 60, 255))

    # Long high-caliber sniper rifle with scope
    # Rifle barrel
    draw.line([(cx - 2*S, cy + 2*S), (cx + 28*S, cy - 8*S)], fill=(40, 45, 50, 255), width=4*S)
    # Muzzle brake
    draw.rectangle([cx + 27*S, cy - 10*S, cx + 30*S, cy - 6*S], fill=(20, 20, 20, 255))
    # Rifle wooden stock
    draw.line([(cx - 2*S, cy + 2*S), (cx - 14*S, cy + 8*S)], fill=(120, 70, 35, 255), width=5*S)
    # High-magnification optical scope
    draw.rectangle([cx + 8*S, cy - 13*S, cx + 20*S, cy - 8*S], fill=(30, 35, 40, 255), outline=(10, 10, 10, 255), width=SCALE)
    draw.ellipse([cx + 18*S, cy - 13*S, cx + 21*S, cy - 8*S], fill=(100, 200, 255, 255))

    return finish(im, 64, 64)

# 8. Super Monkey (Base, Laser, Plasma, Sun God)
def gen_super_monkey(variant="base"):
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    if variant == "sun_god":
        # Aztec Golden Sun God
        # Majestic solar flare crown
        for a in range(0, 360, 30):
            rad = math.radians(a)
            fx = cx + int(math.cos(rad) * 26 * S)
            fy = cy + int(math.sin(rad) * 26 * S)
            draw.line([(cx, cy), (fx, fy)], fill=(255, 215, 0, 220), width=3*S)

        # Golden monkey deity
        draw_monkey_base(draw, cx, cy, S, suit_color=(255, 215, 0, 255))
        # Brilliant glowing white eyes
        draw.ellipse([cx - 7*S, cy - 11*S, cx - 1*S, cy - 6*S], fill=(255, 255, 255, 255))
        draw.ellipse([cx + 1*S, cy - 11*S, cx + 7*S, cy - 6*S], fill=(255, 255, 255, 255))
        # Sun emblem on chest
        draw.ellipse([cx - 5*S, cy + 4*S, cx + 5*S, cy + 14*S], fill=(255, 120, 20, 255))
        return finish(im, 64, 64)

    # Classic Blue suit with red cape
    draw_monkey_base(draw, cx, cy, S, cape=True, suit_color=(25, 75, 200, 255))

    # Golden belt & buckle
    draw.rectangle([cx - 10*S, cy + 10*S, cx + 10*S, cy + 13*S], fill=(255, 215, 0, 255), outline=(150, 120, 0, 255), width=SCALE)

    if variant == "laser":
        # Glowing crimson laser visor
        draw.rounded_rectangle([cx - 11*S, cy - 13*S, cx + 11*S, cy - 5*S], radius=2*S, fill=(255, 20, 20, 255), outline=(120, 0, 0, 255), width=SCALE)
        draw.line([(cx - 8*S, cy - 9*S), (cx + 8*S, cy - 9*S)], fill=(255, 200, 200, 255), width=SCALE)
    elif variant == "plasma":
        # Crackling purple aura
        draw.arc([cx - 18*S, cy - 20*S, cx + 18*S, cy + 16*S], start=45, end=315, fill=(220, 50, 255, 240), width=2*S)
        # Glowing plasma eyes
        draw.ellipse([cx - 7*S, cy - 11*S, cx - 1*S, cy - 6*S], fill=(230, 80, 255, 255))
        draw.ellipse([cx + 1*S, cy - 11*S, cx + 7*S, cy - 6*S], fill=(230, 80, 255, 255))

    return finish(im, 64, 64)

# 9. Mortar Monkey
def gen_mortar_monkey():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (30, 35, 40, 255)

    # Monkey on left
    draw_monkey_base(draw, cx - 10*S, cy, S, headband_color=(50, 90, 50, 255))

    # Heavy mortar tube on right pointing up at 60 degree angle
    tx, ty = cx + 12*S, cy + 8*S
    # Tripod base
    draw.line([(tx, ty), (tx - 10*S, ty + 12*S)], fill=(60, 65, 70, 255), width=3*S)
    draw.line([(tx, ty), (tx + 10*S, ty + 12*S)], fill=(60, 65, 70, 255), width=3*S)
    # Heavy angled barrel
    pts = [(tx - 7*S, ty + 4*S), (tx + 5*S, ty - 22*S), (tx + 14*S, ty - 17*S), (tx + 2*S, ty + 9*S)]
    draw.polygon(pts, fill=(70, 75, 85, 255), outline=outline, width=2*S)
    # Muzzle
    draw.ellipse([tx + 4*S, ty - 24*S, tx + 15*S, ty - 15*S], fill=(25, 25, 30, 255), outline=outline, width=SCALE)

    return finish(im, 64, 64)

# 10. Banana Farm
def gen_banana_farm():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (35, 25, 15, 255)

    # Wooden harvest box at base
    draw.rectangle([cx - 16*S, cy + 10*S, cx + 16*S, cy + 22*S], fill=(185, 130, 70, 255), outline=outline, width=2*S)
    draw.line([(cx - 16*S, cy + 16*S), (cx + 16*S, cy + 16*S)], fill=outline, width=SCALE)
    # Ripe bananas in box
    draw.arc([cx - 10*S, cy + 8*S, cx - 2*S, cy + 18*S], start=0, end=180, fill=(255, 220, 20, 255), width=3*S)
    draw.arc([cx, cy + 8*S, cx + 8*S, cy + 18*S], start=0, end=180, fill=(255, 220, 20, 255), width=3*S)

    # Curved tree trunk
    draw.polygon([(cx - 5*S, cy + 10*S), (cx - 8*S, cy - 8*S), (cx - 2*S, cy - 8*S), (cx + 1*S, cy + 10*S)], fill=(125, 75, 40, 255), outline=outline, width=SCALE)

    # Tropical palm fronds radiating out
    frond_col = (45, 160, 45, 255)
    frond_dark = (25, 110, 25, 255)
    for a in [-150, -110, -70, -30]:
        rad = math.radians(a)
        fx = cx - 5*S + int(math.cos(rad) * 22 * S)
        fy = cy - 8*S + int(math.sin(rad) * 16 * S)
        draw.line([(cx - 5*S, cy - 8*S), (fx, fy)], fill=frond_dark, width=3*S)
        draw.ellipse([fx - 6*S, fy - 4*S, fx + 6*S, fy + 4*S], fill=frond_col, outline=outline, width=SCALE)

    # Hanging bunch of ripe yellow bananas on tree
    bx, by = cx + 2*S, cy - 2*S
    for offset in [-4, 0, 4]:
        draw.arc([bx + offset*S - 3*S, by, bx + offset*S + 5*S, by + 10*S], start=30, end=150, fill=(255, 225, 30, 255), width=3*S)

    return finish(im, 64, 64)

# 11. Spike Factory
def gen_spike_factory():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (40, 30, 25, 255)

    # Industrial brick factory building
    draw.rectangle([cx - 18*S, cy - 6*S, cx + 14*S, cy + 20*S], fill=(165, 60, 45, 255), outline=outline, width=2*S)
    # Brick mortar lines
    for by in range(cy - 2*S, cy + 18*S, 6*S):
        draw.line([(cx - 18*S, by), (cx + 14*S, by)], fill=(120, 40, 30, 255), width=SCALE)

    # Smokestack / chimney
    draw.rectangle([cx - 16*S, cy - 22*S, cx - 8*S, cy - 6*S], fill=(90, 85, 80, 255), outline=outline, width=SCALE)
    # Puff of white steam smoke
    draw.ellipse([cx - 18*S, cy - 28*S, cx - 6*S, cy - 18*S], fill=(230, 235, 240, 210))

    # Conveyor ramp output on right
    draw.polygon([(cx + 14*S, cy + 6*S), (cx + 26*S, cy + 18*S), (cx + 22*S, cy + 22*S), (cx + 14*S, cy + 12*S)], fill=(75, 80, 85, 255), outline=outline, width=SCALE)
    # Caltrop spikes on conveyor
    draw.polygon([(cx + 20*S, cy + 12*S), (cx + 24*S, cy + 6*S), (cx + 25*S, cy + 14*S)], fill=(200, 210, 220, 255), outline=outline, width=SCALE)

    return finish(im, 64, 64)

# 12. Monkey Buccaneer
def gen_monkey_buccaneer():
    im, W, H = make_canvas(64, 64)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (35, 20, 10, 255)

    # Water wake ripples
    draw.ellipse([cx - 24*S, cy + 12*S, cx + 24*S, cy + 24*S], fill=(140, 210, 245, 150))

    # Wooden pirate ship hull
    hull_pts = [(cx - 24*S, cy + 2*S), (cx + 24*S, cy + 2*S), (cx + 18*S, cy + 18*S), (cx - 18*S, cy + 18*S)]
    draw.polygon(hull_pts, fill=(130, 75, 35, 255), outline=outline, width=2*S)
    # Hull planks
    draw.line([(cx - 20*S, cy + 10*S), (cx + 20*S, cy + 10*S)], fill=outline, width=SCALE)

    # Side cannons
    draw.rectangle([cx - 12*S, cy + 5*S, cx - 6*S, cy + 9*S], fill=(40, 45, 50, 255))
    draw.rectangle([cx + 6*S, cy + 5*S, cx + 12*S, cy + 9*S], fill=(40, 45, 50, 255))

    # Pirate monkey captain
    draw_monkey_base(draw, cx, cy - 2*S, S)

    # Captain's black bicorne / tricorne hat
    hat_pts = [(cx - 16*S, cy - 14*S), (cx, cy - 26*S), (cx + 16*S, cy - 14*S), (cx, cy - 16*S)]
    draw.polygon(hat_pts, fill=(25, 25, 30, 255), outline=(215, 175, 40, 255), width=SCALE)
    # Red plume feather
    draw.line([(cx, cy - 24*S), (cx + 6*S, cy - 28*S)], fill=(220, 30, 30, 255), width=2*S)

    return finish(im, 64, 64)

# Generate all tower sprites
gen_dart_monkey(False).save(os.path.join(ASSETS_TOWERS, "dart_monkey.png"))
gen_dart_monkey(True).save(os.path.join(ASSETS_TOWERS, "dart_monkey_throw.png"))

gen_tack_shooter("base").save(os.path.join(ASSETS_TOWERS, "tack_shooter.png"))
gen_tack_shooter("blade").save(os.path.join(ASSETS_TOWERS, "blade_shooter.png"))
gen_tack_shooter("ring_of_fire").save(os.path.join(ASSETS_TOWERS, "ring_of_fire.png"))

gen_bomb_tower("base").save(os.path.join(ASSETS_TOWERS, "bomb_tower.png"))
gen_bomb_tower("missile").save(os.path.join(ASSETS_TOWERS, "missile_launcher.png"))
gen_bomb_tower("moab_mauler").save(os.path.join(ASSETS_TOWERS, "moab_mauler.png"))

gen_ice_tower("base").save(os.path.join(ASSETS_TOWERS, "ice_tower.png"))
gen_ice_tower("arctic").save(os.path.join(ASSETS_TOWERS, "arctic_wind.png"))

gen_boomerang_monkey(False).save(os.path.join(ASSETS_TOWERS, "boomerang_monkey.png"))
gen_boomerang_monkey(True).save(os.path.join(ASSETS_TOWERS, "glaive_thrower.png"))

gen_glue_gunner().save(os.path.join(ASSETS_TOWERS, "glue_gunner.png"))
gen_sniper_monkey().save(os.path.join(ASSETS_TOWERS, "sniper_monkey.png"))

gen_super_monkey("base").save(os.path.join(ASSETS_TOWERS, "super_monkey.png"))
gen_super_monkey("laser").save(os.path.join(ASSETS_TOWERS, "laser_super_monkey.png"))
gen_super_monkey("plasma").save(os.path.join(ASSETS_TOWERS, "plasma_super_monkey.png"))
gen_super_monkey("sun_god").save(os.path.join(ASSETS_TOWERS, "sun_god.png"))

gen_mortar_monkey().save(os.path.join(ASSETS_TOWERS, "mortar_monkey.png"))
gen_banana_farm().save(os.path.join(ASSETS_TOWERS, "banana_farm.png"))
gen_spike_factory().save(os.path.join(ASSETS_TOWERS, "spike_factory.png"))
gen_monkey_buccaneer().save(os.path.join(ASSETS_TOWERS, "monkey_buccaneer.png"))

print(f"Generated {len(os.listdir(ASSETS_TOWERS))} tower assets successfully.")
