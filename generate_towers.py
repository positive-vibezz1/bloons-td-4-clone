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

def draw_drop_shadow(im, cx, cy, rx, ry):
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(0, 0, 0, 65))
    im.alpha_composite(layer)

def draw_smooth_tail(draw, points, radius, fill_col, outline_col, outline_w):
    # First draw outline circles & thick line
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=outline_col, width=(radius + outline_w) * 2)
    for px, py in points:
        r = radius + outline_w
        draw.ellipse([px - r, py - r, px + r, py + r], fill=outline_col)
    # Then draw inner fill circles & line
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=fill_col, width=radius * 2)
    for px, py in points:
        r = radius
        draw.ellipse([px - r, py - r, px + r, py + r], fill=fill_col)

def draw_topdown_monkey(im, cx, cy, S, fur=(148, 86, 42, 255), fur_light=(182, 114, 62, 255),
                        skin=(248, 202, 152, 255), headband=None, cape=None, brow_angry=True):
    draw = ImageDraw.Draw(im)
    outline = (36, 18, 8, 255)

    # Drop shadow
    draw_drop_shadow(im, cx - 2*S, cy + 3*S, 21*S, 21*S)

    # Cape behind (extending left/back since facing RIGHT +X)
    if cape:
        cape_pts = [
            (cx - 2*S, cy - 15*S),
            (cx - 26*S, cy - 21*S),
            (cx - 22*S, cy),
            (cx - 26*S, cy + 21*S),
            (cx - 2*S, cy + 15*S)
        ]
        draw.polygon(cape_pts, fill=cape, outline=(110, 10, 15, 255), width=2*S)
        # Cape highlight fold
        draw.polygon([(cx - 4*S, cy - 10*S), (cx - 22*S, cy - 15*S), (cx - 18*S, cy - 4*S)], fill=(255, 80, 80, 130))

    # Curled monkey tail extending out the back (-X)
    tail_pts = []
    for t in range(15):
        f = t / 14.0
        tx = cx - 10*S - int(f * 15 * S) + int(math.sin(f * math.pi * 1.4) * 4 * S)
        ty = cy + 4*S + int(math.cos(f * math.pi * 1.5) * 9 * S)
        tail_pts.append((tx, ty))
    draw_smooth_tail(draw, tail_pts, int(2.2*S), fur, outline, int(1.3*S))

    # Shoulders / Torso (slightly behind head)
    draw.ellipse([cx - 15*S, cy - 16*S, cx + 9*S, cy + 16*S], fill=fur, outline=outline, width=2*S)

    # Ears on top (-Y) and bottom (+Y) of head
    for ey_sign in [-1, 1]:
        ey = cy + ey_sign * 15 * S
        draw.ellipse([cx - 6*S, ey - 6*S, cx + 6*S, ey + 6*S], fill=fur, outline=outline, width=2*S)
        draw.ellipse([cx - 3*S, ey - 3.5*S, cx + 3*S, ey + 3.5*S], fill=skin)

    # Round Monkey Head
    draw.ellipse([cx - 14*S, cy - 15*S, cx + 14*S, cy + 15*S], fill=fur, outline=outline, width=2*S)
    # 3D highlight on top-left of head
    draw.ellipse([cx - 10*S, cy - 11*S, cx + 6*S, cy + 5*S], fill=fur_light)

    # Hair tuft on crown
    draw.polygon([(cx - 3*S, cy - 2*S), (cx - 9*S, cy - 5*S), (cx - 6*S, cy), (cx - 10*S, cy + 4*S)], fill=fur_light)

    # Face / Muzzle on the front (+X) side of head
    draw.ellipse([cx + 1*S, cy - 11*S, cx + 15*S, cy + 11*S], fill=skin, outline=outline, width=int(1.5*S))

    # Headband if present (wraps around head vertically since facing +X)
    if headband:
        # Bandana knot & tails at back-left
        draw.polygon([(cx - 12*S, cy - 5*S), (cx - 23*S, cy - 11*S), (cx - 19*S, cy - 2*S)], fill=headband, outline=outline, width=SCALE)
        draw.polygon([(cx - 12*S, cy - 2*S), (cx - 22*S, cy + 5*S), (cx - 16*S, cy + 7*S)], fill=headband, outline=outline, width=SCALE)
        # Main headband strap across forehead
        draw.rounded_rectangle([cx - 3*S, cy - 14.5*S, cx + 4*S, cy + 14.5*S], radius=2*S, fill=headband, outline=outline, width=int(1.5*S))

    # Expressive Eyes looking forward (+X)
    for ey_sign in [-1, 1]:
        ey = cy + ey_sign * 5.2 * S
        ex = cx + 5.5 * S
        # White sclera
        draw.ellipse([ex - 4.2*S, ey - 3.8*S, ex + 4.2*S, ey + 3.8*S], fill=(255, 255, 255, 255), outline=outline, width=int(1.2*S))
        # Dark pupil looking right
        draw.ellipse([ex - 0.5*S, ey - 2.4*S, ex + 3.5*S, ey + 2.4*S], fill=(20, 20, 25, 255))
        # Specular eye catchlight
        draw.ellipse([ex + 0.5*S, ey - 1.8*S, ex + 2.2*S, ey - 0.1*S], fill=(255, 255, 255, 255))

        if brow_angry:
            # Determined BTD brow line sloping inward toward center
            bx1 = ex - 2*S
            by1 = ey + ey_sign * 4.2 * S
            bx2 = ex + 3.5*S
            by2 = ey + ey_sign * 1.2 * S
            draw.line([(bx1, by1), (bx2, by2)], fill=outline, width=int(1.8*S))

    # Nose nostrils & confident smirk on snout (+X edge)
    draw.ellipse([cx + 11.5*S, cy - 2*S, cx + 13*S, cy - 0.5*S], fill=outline)
    draw.ellipse([cx + 11.5*S, cy + 0.5*S, cx + 13*S, cy + 2*S], fill=outline)

def draw_hand(draw, x, y, S, skin=(248, 202, 152, 255)):
    outline = (36, 18, 8, 255)
    draw.ellipse([x - 4.5*S, y - 4.5*S, x + 4.5*S, y + 4.5*S], fill=skin, outline=outline, width=int(1.5*S))

# 1. Dart Monkey (Facing Right +X)
def gen_dart_monkey(throwing=False):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 2*SCALE, H // 2
    S = SCALE

    draw_topdown_monkey(im, cx, cy, S, headband=(225, 35, 35, 255))
    draw = ImageDraw.Draw(im)
    outline = (36, 18, 8, 255)

    # Left hand (top, -Y) steadying aim
    draw_hand(draw, cx + 11*S, cy - 13*S, S)

    if not throwing:
        # Right hand (+Y) holding dart cocked and ready
        hx, hy = cx + 10*S, cy + 14*S
        draw_hand(draw, hx, hy, S)
        # Dart pointing right (+X)
        # Red flights
        draw.polygon([(hx - 10*S, hy), (hx - 16*S, hy - 5*S), (hx - 6*S, hy - 2*S)], fill=(235, 35, 35, 255), outline=outline, width=SCALE)
        draw.polygon([(hx - 10*S, hy), (hx - 16*S, hy + 5*S), (hx - 6*S, hy + 2*S)], fill=(235, 35, 35, 255), outline=outline, width=SCALE)
        # Wooden shaft
        draw.rectangle([hx - 8*S, hy - 2*S, hx + 10*S, hy + 2*S], fill=(195, 135, 70, 255), outline=outline, width=SCALE)
        # Sharp steel tip pointing right
        draw.polygon([(hx + 22*S, hy), (hx + 10*S, hy - 4.5*S), (hx + 10*S, hy + 4.5*S)], fill=(220, 230, 240, 255), outline=outline, width=int(1.2*S))
    else:
        # Arm extended forward after throw
        draw.line([(cx + 6*S, cy + 12*S), (cx + 20*S, cy + 10*S)], fill=(148, 86, 42, 255), width=6*S)
        draw_hand(draw, cx + 22*S, cy + 10*S, S)

    return finish(im, 64, 64)

# 2. Tack Shooter (Tack, Blade, Ring of Fire)
def gen_tack_shooter(variant="base"):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    draw_drop_shadow(im, cx, cy + 2*S, 24*S, 24*S)
    draw = ImageDraw.Draw(im)

    if variant == "base":
        base_col = (215, 55, 75, 255)
        mid_col = (245, 95, 115, 255)
        outline = (55, 15, 20, 255)
        nozzle_col = (75, 80, 90, 255)
    elif variant == "blade":
        base_col = (110, 125, 145, 255)
        mid_col = (175, 195, 215, 255)
        outline = (25, 35, 45, 255)
        nozzle_col = (50, 60, 75, 255)
    else: # ring_of_fire
        base_col = (195, 35, 15, 255)
        mid_col = (255, 125, 15, 255)
        outline = (65, 10, 5, 255)
        nozzle_col = (255, 200, 20, 255)

    # 8 Nozzles / Blades protruding at 45-degree intervals
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        cos_a, sin_a = math.cos(rad), math.sin(rad)
        px, py = -sin_a, cos_a

        if variant == "blade":
            # Curved saw blade tooth protruding
            bx1 = cx + int(cos_a * 16 * S)
            by1 = cy + int(sin_a * 16 * S)
            bx2 = cx + int(cos_a * 28 * S)
            by2 = cy + int(sin_a * 28 * S)
            draw.polygon([
                (bx1 + int(px*5*S), by1 + int(py*5*S)),
                (bx2, by2),
                (bx1 - int(px*5*S), by1 - int(py*5*S))
            ], fill=(235, 245, 255, 255), outline=outline, width=int(1.5*S))
        else:
            # Cylindrical barrel nozzle
            r1, r2, w = 16*S, 26*S, 4.5*S
            pts = [
                (cx + cos_a*r1 - px*w, cy + sin_a*r1 - py*w),
                (cx + cos_a*r2 - px*w, cy + sin_a*r2 - py*w),
                (cx + cos_a*r2 + px*w, cy + sin_a*r2 + py*w),
                (cx + cos_a*r1 + px*w, cy + sin_a*r1 + py*w),
            ]
            draw.polygon(pts, fill=nozzle_col, outline=outline, width=int(1.5*S))

    # Main circular drum body
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], fill=base_col, outline=outline, width=2*S)
    draw.ellipse([cx - 15*S, cy - 15*S, cx + 15*S, cy + 15*S], fill=mid_col, outline=outline, width=int(1.5*S))

    # Rivets around rim
    for angle in range(22, 382, 45):
        rad = math.radians(angle)
        rx = cx + int(math.cos(rad) * 17.5 * S)
        ry = cy + int(math.sin(rad) * 17.5 * S)
        draw.ellipse([rx - 1.5*S, ry - 1.5*S, rx + 1.5*S, ry + 1.5*S], fill=(240, 240, 245, 255), outline=outline, width=max(1, S//2))

    if variant == "ring_of_fire":
        # Blazing flame core emblem
        draw.ellipse([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], fill=(255, 220, 20, 255), outline=outline, width=SCALE)
        draw.ellipse([cx - 5*S, cy - 5*S, cx + 5*S, cy + 5*S], fill=(255, 255, 255, 255))
    else:
        # Metallic top cap with tack icon in center
        draw.ellipse([cx - 9*S, cy - 9*S, cx + 9*S, cy + 9*S], fill=(80, 88, 100, 255), outline=outline, width=int(1.5*S))
        draw.ellipse([cx - 6*S, cy - 7*S, cx + 2*S, cy - 1*S], fill=(255, 255, 255, 140))

    return finish(im, 64, 64)

# 3. Bomb Tower (Facing Right +X so rotation matches!)
def gen_bomb_tower(variant="base"):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 2*SCALE, H // 2
    S = SCALE
    draw_drop_shadow(im, cx, cy + 2*S, 23*S, 22*S)
    draw = ImageDraw.Draw(im)
    outline = (25, 28, 32, 255)

    # Heavy wheeled carriage & turntable base
    # Top and bottom carriage wheels (perpendicular to +X barrel)
    for wy in [cy - 18*S, cy + 14*S]:
        draw.rounded_rectangle([cx - 12*S, wy, cx + 8*S, wy + 5*S], radius=2*S, fill=(115, 70, 35, 255), outline=outline, width=int(1.5*S))
        draw.rectangle([cx - 4*S, wy, cx + 1*S, wy + 5*S], fill=(70, 75, 85, 255))

    # Stone/Steel turntable base
    draw.ellipse([cx - 18*S, cy - 16*S, cx + 14*S, cy + 16*S], fill=(95, 102, 115, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 13*S, cy - 12*S, cx + 9*S, cy + 12*S], fill=(135, 142, 155, 255), outline=outline, width=SCALE)

    if variant == "base":
        # Heavy cast-iron cannon barrel pointing RIGHT (+X)
        barrel_pts = [
            (cx - 14*S, cy - 9*S),
            (cx + 22*S, cy - 11*S),
            (cx + 22*S, cy + 11*S),
            (cx - 14*S, cy + 9*S)
        ]
        draw.polygon(barrel_pts, fill=(52, 56, 66, 255), outline=outline, width=2*S)
        # Specular metallic highlight along top of barrel
        draw.polygon([
            (cx - 11*S, cy - 6*S),
            (cx + 19*S, cy - 7*S),
            (cx + 19*S, cy - 2*S),
            (cx - 11*S, cy - 2*S)
        ], fill=(105, 115, 130, 255))
        # Reinforced muzzle ring at right (+X)
        draw.rounded_rectangle([cx + 19*S, cy - 12.5*S, cx + 26*S, cy + 12.5*S], radius=2*S, fill=(38, 42, 50, 255), outline=outline, width=2*S)
        #Rear knob & burning fuse at left (-X)
        draw.ellipse([cx - 19*S, cy - 4*S, cx - 13*S, cy + 4*S], fill=(40, 44, 52, 255), outline=outline, width=int(1.5*S))
        draw.arc([cx - 26*S, cy - 8*S, cx - 17*S, cy + 2*S], start=30, end=220, fill=(200, 170, 110, 255), width=2*S)
        # Bright spark
        draw.ellipse([cx - 28*S, cy - 9*S, cx - 21*S, cy - 2*S], fill=(255, 160, 20, 255))
        draw.ellipse([cx - 26*S, cy - 7*S, cx - 23*S, cy - 4*S], fill=(255, 255, 180, 255))

    elif variant == "missile":
        # High-tech red & white missile launcher pointing RIGHT (+X)
        draw.rounded_rectangle([cx - 14*S, cy - 11*S, cx + 18*S, cy + 11*S], radius=3*S, fill=(210, 220, 230, 255), outline=outline, width=2*S)
        # Red hazard stripes
        draw.rectangle([cx + 6*S, cy - 10*S, cx + 12*S, cy + 10*S], fill=(225, 40, 40, 255))
        # Red warhead cone tip protruding right (+X)
        draw.polygon([(cx + 18*S, cy - 9*S), (cx + 29*S, cy), (cx + 18*S, cy + 9*S)], fill=(235, 35, 35, 255), outline=outline, width=2*S)
        # Top sight rail
        draw.rectangle([cx - 8*S, cy - 3*S, cx + 10*S, cy + 3*S], fill=(60, 70, 80, 255), outline=outline, width=SCALE)

    else: # moab_mauler
        # Black & Yellow heavy anti-blimp cannon with shark teeth pointing RIGHT (+X)
        barrel_pts = [
            (cx - 15*S, cy - 11*S),
            (cx + 23*S, cy - 13*S),
            (cx + 23*S, cy + 13*S),
            (cx - 15*S, cy + 11*S)
        ]
        draw.polygon(barrel_pts, fill=(38, 42, 48, 255), outline=outline, width=2*S)
        # Yellow hazard bands at back
        for bx in [cx - 12*S, cx - 4*S]:
            draw.rectangle([bx, cy - 10*S, bx + 4*S, cy + 10*S], fill=(255, 205, 15, 255))
        # Fierce Shark Teeth & Angry Eye near muzzle (+X)
        for tx in range(cx + 6*S, cx + 20*S, 5*S):
            draw.polygon([(tx, cy - 10*S), (tx + 2.5*S, cy - 4*S), (tx + 5*S, cy - 10*S)], fill=(255, 255, 255, 255), outline=outline)
            draw.polygon([(tx, cy + 10*S), (tx + 2.5*S, cy + 4*S), (tx + 5*S, cy + 10*S)], fill=(255, 255, 255, 255), outline=outline)
        # Muzzle ring
        draw.rounded_rectangle([cx + 21*S, cy - 14*S, cx + 27*S, cy + 14*S], radius=2*S, fill=(220, 30, 30, 255), outline=outline, width=2*S)

    return finish(im, 64, 64)

# 4. Ice Tower (Base & Arctic Wind - Ice Monkey / Crystal Spire)
def gen_ice_tower(variant="base"):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    draw_drop_shadow(im, cx, cy + 2*S, 24*S, 24*S)
    draw = ImageDraw.Draw(im)
    outline = (18, 55, 105, 255)

    if variant == "arctic":
        # Swirling blizzard aura
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        adraw = ImageDraw.Draw(aura)
        adraw.ellipse([cx - 28*S, cy - 28*S, cx + 28*S, cy + 28*S], fill=(150, 230, 255, 95))
        adraw.ellipse([cx - 23*S, cy - 23*S, cx + 23*S, cy + 23*S], fill=(200, 245, 255, 130))
        im.alpha_composite(aura)
        draw = ImageDraw.Draw(im)

    # 8-pointed icy crystal star base
    for a in range(0, 360, 45):
        rad = math.radians(a)
        r_out = 25*S if a % 90 == 0 else 20*S
        x_tip = cx + int(math.cos(rad) * r_out)
        y_tip = cy + int(math.sin(rad) * r_out)
        rad_l = math.radians(a - 22)
        rad_r = math.radians(a + 22)
        pts = [
            (cx + int(math.cos(rad_l)*11*S), cy + int(math.sin(rad_l)*11*S)),
            (x_tip, y_tip),
            (cx + int(math.cos(rad_r)*11*S), cy + int(math.sin(rad_r)*11*S)),
        ]
        col = (185, 238, 255, 255) if a % 90 == 0 else (135, 205, 248, 255)
        draw.polygon(pts, fill=col, outline=outline, width=int(1.5*S))

    # Central Ice Monkey with fuzzy white parka hood
    draw.ellipse([cx - 15*S, cy - 15*S, cx + 15*S, cy + 15*S], fill=(235, 250, 255, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 11*S, cy - 11*S, cx + 11*S, cy + 11*S], fill=(95, 185, 245, 255), outline=outline, width=int(1.5*S))
    # Cute frost monkey face
    draw.ellipse([cx - 6*S, cy - 7*S, cx - 1*S, cy - 1*S], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
    draw.ellipse([cx + 1*S, cy - 7*S, cx + 6*S, cy - 1*S], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
    draw.ellipse([cx - 4*S, cy - 5*S, cx - 1.5*S, cy - 2*S], fill=(15, 35, 70, 255))
    draw.ellipse([cx + 1.5*S, cy - 5*S, cx + 4*S, cy - 2*S], fill=(15, 35, 70, 255))
    # Frost gem on forehead
    draw.polygon([(cx, cy - 13*S), (cx + 3*S, cy - 9*S), (cx, cy - 6*S), (cx - 3*S, cy - 9*S)], fill=(255, 255, 255, 255), outline=outline, width=SCALE)

    return finish(im, 64, 64)

# 5. Boomerang Monkey (Facing Right +X)
def gen_boomerang_monkey(glaive=False):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 2*SCALE, H // 2
    S = SCALE

    # Classic yellow/blue BTD4 boomerang suit or Aussie bush hat
    draw_topdown_monkey(im, cx, cy, S, fur=(155, 90, 40, 255), headband=(245, 200, 20, 255))
    draw = ImageDraw.Draw(im)
    outline = (36, 18, 8, 255)

    # Left hand (-Y)
    draw_hand(draw, cx + 10*S, cy - 13*S, S)

    # Right hand (+Y) holding Boomerang or Glaive
    hx, hy = cx + 11*S, cy + 14*S
    draw_hand(draw, hx, hy, S)

    if not glaive:
        # Classic yellow & red V-boomerang held ready
        b_pts = [
            (hx - 6*S, hy + 8*S),
            (hx + 12*S, hy + 2*S),
            (hx + 18*S, hy - 14*S),
            (hx + 13*S, hy - 15*S),
            (hx + 7*S, hy - 2*S),
            (hx - 8*S, hy + 3*S)
        ]
        draw.polygon(b_pts, fill=(250, 205, 30, 255), outline=outline, width=int(1.5*S))
        # Red wingtip stripes
        draw.line([(hx + 13*S, hy - 9*S), (hx + 16*S, hy - 8*S)], fill=(225, 30, 30, 255), width=2*S)
        draw.line([(hx - 3*S, hy + 4*S), (hx - 2*S, hy + 7*S)], fill=(225, 30, 30, 255), width=2*S)
    else:
        # Razor Glaive held in right hand
        gx, gy = hx + 7*S, hy - 2*S
        gr = 12 * S
        for a in [0, 120, 240]:
            rad = math.radians(a)
            tip_x = gx + int(math.cos(rad) * gr)
            tip_y = gy + int(math.sin(rad) * gr)
            mid_x = gx + int(math.cos(rad + 0.55) * gr * 0.72)
            mid_y = gy + int(math.sin(rad + 0.55) * gr * 0.72)
            draw.polygon([(gx, gy), (tip_x, tip_y), (mid_x, mid_y)], fill=(230, 242, 255, 255), outline=(40, 60, 85, 255), width=int(1.5*S))
        draw.ellipse([gx - 4*S, gy - 4*S, gx + 4*S, gy + 4*S], fill=(255, 215, 0, 255), outline=outline, width=SCALE)

    return finish(im, 64, 64)

# 6. Glue Gunner (Facing Right +X)
def gen_glue_gunner():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 2*SCALE, H // 2
    S = SCALE
    outline = (30, 25, 15, 255)

    # Big yellow glue vat tank on back (-X)
    draw_drop_shadow(im, cx - 2*S, cy + 3*S, 23*S, 21*S)
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([cx - 25*S, cy - 11*S, cx - 9*S, cy + 11*S], radius=4*S, fill=(250, 215, 25, 255), outline=outline, width=2*S)
    # Green hazard stripe on tank
    draw.rectangle([cx - 20*S, cy - 10*S, cx - 15*S, cy + 10*S], fill=(50, 185, 60, 255))

    draw_topdown_monkey(im, cx, cy, S, fur=(148, 86, 42, 255), headband=(250, 215, 25, 255))
    draw = ImageDraw.Draw(im)

    # Protective green goggles over eyes
    for ey_sign in [-1, 1]:
        ey = cy + ey_sign * 5.2 * S
        ex = cx + 5.5 * S
        draw.ellipse([ex - 5*S, ey - 4.5*S, ex + 5*S, ey + 4.5*S], fill=(60, 220, 80, 220), outline=outline, width=int(1.5*S))
        draw.ellipse([ex - 1*S, ey - 2*S, ex + 2*S, ey + 1*S], fill=(220, 255, 220, 255))

    # Black hose curving from back tank to right-hand glue gun
    draw.arc([cx - 18*S, cy + 4*S, cx + 10*S, cy + 24*S], start=10, end=170, fill=(40, 45, 50, 255), width=3*S)

    # Heavy glue sprayer gun pointing RIGHT (+X)
    gy = cy + 12*S
    draw.rounded_rectangle([cx + 4*S, gy - 4*S, cx + 22*S, gy + 4*S], radius=2*S, fill=(85, 95, 105, 255), outline=outline, width=int(1.5*S))
    draw.polygon([(cx + 21*S, gy - 5*S), (cx + 28*S, gy - 7*S), (cx + 28*S, gy + 7*S), (cx + 21*S, gy + 5*S)], fill=(250, 215, 25, 255), outline=outline, width=int(1.5*S))
    # Bright glue glob at nozzle tip
    draw.ellipse([cx + 26*S, gy - 4*S, cx + 31*S, gy + 4*S], fill=(255, 235, 40, 255), outline=(170, 140, 10, 255), width=SCALE)
    draw_hand(draw, cx + 8*S, gy, S)

    return finish(im, 64, 64)

# 7. Sniper Monkey (Facing Right +X)
def gen_sniper_monkey():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 4*SCALE, H // 2
    S = SCALE
    outline = (25, 30, 20, 255)

    draw_topdown_monkey(im, cx, cy, S)
    draw = ImageDraw.Draw(im)

    # Military green beret with gold badge on top of head
    draw.ellipse([cx - 14*S, cy - 13*S, cx + 7*S, cy + 11*S], fill=(55, 95, 45, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 9*S, cy - 9*S, cx + 2*S, cy + 5*S], fill=(75, 120, 60, 255))
    # Gold flashes badge on front of beret
    draw.polygon([(cx + 5*S, cy - 3*S), (cx + 8*S, cy), (cx + 5*S, cy + 3*S), (cx + 3*S, cy)], fill=(255, 215, 0, 255), outline=outline, width=SCALE)

    # Long Precision Sniper Rifle pointing RIGHT (+X)
    ry = cy + 10*S
    # Wooden stock
    draw.rounded_rectangle([cx - 6*S, ry - 3*S, cx + 6*S, ry + 3*S], radius=SCALE, fill=(130, 75, 35, 255), outline=outline, width=int(1.5*S))
    # Receiver & long steel barrel pointing right (+X)
    draw.rectangle([cx + 4*S, ry - 2.5*S, cx + 32*S, ry + 2.5*S], fill=(50, 56, 64, 255), outline=outline, width=int(1.5*S))
    # Heavy muzzle brake at right edge
    draw.rectangle([cx + 30*S, ry - 4*S, cx + 35*S, ry + 4*S], fill=(30, 34, 40, 255), outline=outline, width=SCALE)
    # Scope mounted alongside barrel with cyan lens reflection
    draw.rounded_rectangle([cx + 7*S, ry - 7*S, cx + 21*S, ry - 2*S], radius=SCALE, fill=(35, 40, 45, 255), outline=outline, width=int(1.5*S))
    draw.ellipse([cx + 19*S, ry - 6.5*S, cx + 22*S, ry - 2.5*S], fill=(90, 215, 255, 255))
    # Hands holding stock and foregrip
    draw_hand(draw, cx + 4*S, ry + 2*S, S)
    draw_hand(draw, cx + 16*S, ry - 1*S, S)

    return finish(im, 64, 64)

# 8. Super Monkey (Base, Laser, Plasma, Sun God - Facing Right +X)
def gen_super_monkey(variant="base"):
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2 - 1*SCALE, H // 2
    S = SCALE
    outline = (30, 15, 10, 255)

    if variant == "sun_god":
        # Golden Sun God radiant aura & solar rays
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        adraw = ImageDraw.Draw(aura)
        adraw.ellipse([cx - 28*S, cy - 28*S, cx + 28*S, cy + 28*S], fill=(255, 200, 0, 90))
        for a in range(0, 360, 30):
            rad = math.radians(a)
            x1 = cx + int(math.cos(rad) * 14 * S)
            y1 = cy + int(math.sin(rad) * 14 * S)
            x2 = cx + int(math.cos(rad) * 29 * S)
            y2 = cy + int(math.sin(rad) * 29 * S)
            adraw.line([(x1, y1), (x2, y2)], fill=(255, 235, 40, 230), width=4*S)
        im.alpha_composite(aura)

        draw_topdown_monkey(im, cx, cy, S, fur=(255, 205, 20, 255), fur_light=(255, 235, 90, 255),
                            cape=(255, 245, 180, 255))
        draw = ImageDraw.Draw(im)
        # Glowing pure white solar eyes
        for ey_sign in [-1, 1]:
            ey = cy + ey_sign * 5.2 * S
            ex = cx + 5.5 * S
            draw.ellipse([ex - 4.5*S, ey - 4*S, ex + 4.5*S, ey + 4*S], fill=(255, 255, 255, 255), outline=(255, 160, 0, 255), width=SCALE)
        # Golden sun collar
        draw_hand(draw, cx + 13*S, cy - 13*S, S, skin=(255, 225, 110, 255))
        draw_hand(draw, cx + 13*S, cy + 13*S, S, skin=(255, 225, 110, 255))
        return finish(im, 64, 64)

    if variant == "plasma":
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(aura).ellipse([cx - 26*S, cy - 26*S, cx + 26*S, cy + 26*S], fill=(190, 40, 255, 100))
        im.alpha_composite(aura)

    # Classic Blue Super Suit with flowing Red Cape behind (-X)
    draw_topdown_monkey(im, cx, cy, S, fur=(30, 95, 225, 255), fur_light=(65, 135, 255, 255),
                        cape=(225, 30, 35, 255))
    draw = ImageDraw.Draw(im)

    # Iconic golden 'S' crest on crown/back
    draw.polygon([(cx - 4*S, cy), (cx - 9*S, cy - 5*S), (cx - 13*S, cy), (cx - 9*S, cy + 5*S)], fill=(255, 215, 0, 255), outline=(180, 30, 20, 255), width=SCALE)

    if variant == "laser":
        # Crimson ruby laser visor across eyes (+X)
        draw.rounded_rectangle([cx + 2*S, cy - 11*S, cx + 10*S, cy + 11*S], radius=2*S, fill=(255, 25, 35, 255), outline=(110, 0, 0, 255), width=int(1.5*S))
        draw.line([(cx + 6*S, cy - 8*S), (cx + 6*S, cy + 8*S)], fill=(255, 210, 210, 255), width=int(1.5*S))
    elif variant == "plasma":
        # Glowing purple plasma eyes & hands
        for ey_sign in [-1, 1]:
            ey = cy + ey_sign * 5.2 * S
            ex = cx + 5.5 * S
            draw.ellipse([ex - 4.5*S, ey - 4*S, ex + 4.5*S, ey + 4*S], fill=(235, 90, 255, 255), outline=(110, 10, 160, 255), width=SCALE)
            draw.ellipse([ex - 2*S, ey - 2*S, ex + 2*S, ey + 2*S], fill=(255, 255, 255, 255))

    # Heroic flying fists extended forward (+X)
    draw_hand(draw, cx + 13*S, cy - 12*S, S)
    draw_hand(draw, cx + 13*S, cy + 12*S, S)

    return finish(im, 64, 64)

# 9. Mortar Monkey (Stationary artillery pit + operator)
def gen_mortar_monkey():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (28, 32, 36, 255)
    draw_drop_shadow(im, cx, cy + 2*S, 26*S, 24*S)
    draw = ImageDraw.Draw(im)

    # Sandbag emplacement ring around base
    for a in range(0, 360, 45):
        rad = math.radians(a)
        sx = cx + int(math.cos(rad) * 18 * S)
        sy = cy + int(math.sin(rad) * 16 * S)
        draw.ellipse([sx - 7*S, sy - 5*S, sx + 7*S, sy + 5*S], fill=(195, 165, 110, 255), outline=(70, 55, 30, 255), width=int(1.5*S))

    # Dark base plate inside pit
    draw.ellipse([cx - 14*S, cy - 12*S, cx + 14*S, cy + 12*S], fill=(75, 82, 90, 255), outline=outline, width=int(1.5*S))

    # Mortar operator monkey in army helmet on left
    mx, my = cx - 9*S, cy + 2*S
    draw.ellipse([mx - 10*S, my - 10*S, mx + 10*S, my + 10*S], fill=(65, 95, 55, 255), outline=outline, width=2*S)
    draw.ellipse([mx - 7*S, my - 7*S, mx + 5*S, my + 5*S], fill=(85, 120, 70, 255))

    # Massive angled Mortar Tube on right pointing up-right
    tx, ty = cx + 6*S, cy + 4*S
    pts = [(tx - 8*S, ty + 6*S), (tx + 6*S, ty - 18*S), (tx + 18*S, ty - 11*S), (tx + 4*S, ty + 13*S)]
    draw.polygon(pts, fill=(55, 62, 72, 255), outline=outline, width=2*S)
    # Yellow hazard ring near muzzle
    draw.line([(tx + 3*S, ty - 13*S), (tx + 15*S, ty - 6*S)], fill=(255, 205, 20, 255), width=3*S)
    # Open mortar bore
    draw.ellipse([tx + 5*S, ty - 20*S, tx + 19*S, ty - 9*S], fill=(22, 25, 30, 255), outline=(140, 150, 165, 255), width=2*S)

    return finish(im, 64, 64)

# 10. Banana Farm (Lush Top-Down Banana Plantation Grove)
def gen_banana_farm():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (32, 22, 10, 255)
    draw_drop_shadow(im, cx, cy + 2*S, 26*S, 24*S)
    draw = ImageDraw.Draw(im)

    # Rich fertilized soil plot with wooden border fence
    draw.rounded_rectangle([cx - 24*S, cy - 22*S, cx + 24*S, cy + 22*S], radius=5*S, fill=(140, 92, 48, 255), outline=outline, width=2*S)
    draw.rounded_rectangle([cx - 20*S, cy - 18*S, cx + 20*S, cy + 18*S], radius=3*S, fill=(105, 65, 32, 255))

    # 8 Lush tropical banana palm leaves radiating from center
    for a in range(0, 360, 45):
        rad = math.radians(a)
        cos_a, sin_a = math.cos(rad), math.sin(rad)
        px, py = -sin_a, cos_a
        r_len = 25*S if a % 90 == 0 else 22*S
        tip_x = cx + int(cos_a * r_len)
        tip_y = cy + int(sin_a * r_len)
        mid_x = cx + int(cos_a * r_len * 0.55)
        mid_y = cy + int(sin_a * r_len * 0.55)
        w = 6.5 * S
        leaf_pts = [
            (cx, cy),
            (mid_x + int(px*w), mid_y + int(py*w)),
            (tip_x, tip_y),
            (mid_x - int(px*w), mid_y - int(py*w)),
        ]
        col = (55, 185, 45, 255) if a % 90 == 0 else (40, 150, 35, 255)
        draw.polygon(leaf_pts, fill=col, outline=(20, 75, 18, 255), width=int(1.5*S))
        # Leaf center vein
        draw.line([(cx, cy), (tip_x, tip_y)], fill=(120, 225, 75, 255), width=SCALE)

    # Golden banana bunches clustered around the crown
    for bx, by in [(cx - 6*S, cy - 4*S), (cx + 6*S, cy - 4*S), (cx, cy + 6*S)]:
        draw.ellipse([bx - 5*S, by - 4*S, bx + 5*S, by + 4*S], fill=(255, 225, 20, 255), outline=(140, 100, 10, 255), width=SCALE)
    # Center trunk crown
    draw.ellipse([cx - 5*S, cy - 5*S, cx + 5*S, cy + 5*S], fill=(135, 85, 35, 255), outline=outline, width=SCALE)

    return finish(im, 64, 64)

# 11. Spike Factory (High-tech Red & Steel Top-Down Spike Dispenser)
def gen_spike_factory():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (30, 32, 38, 255)
    draw_drop_shadow(im, cx, cy + 2*S, 24*S, 24*S)
    draw = ImageDraw.Draw(im)

    # Heavy steel base plate with corner bolts
    draw.rounded_rectangle([cx - 22*S, cy - 22*S, cx + 22*S, cy + 22*S], radius=4*S, fill=(90, 98, 110, 255), outline=outline, width=2*S)
    for bx in [-18*S, 18*S]:
        for by in [-18*S, 18*S]:
            draw.ellipse([cx + bx - 2*S, cy + by - 2*S, cx + bx + 2*S, cy + by + 2*S], fill=(170, 180, 195, 255), outline=outline, width=SCALE)

    # Red cylindrical factory drum
    draw.ellipse([cx - 18*S, cy - 18*S, cx + 18*S, cy + 18*S], fill=(195, 45, 35, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 14*S, cy - 14*S, cx + 14*S, cy + 14*S], fill=(230, 70, 55, 255), outline=outline, width=SCALE)

    # Top central spike chute / hopper with gleaming metal spikes inside
    draw.ellipse([cx - 9*S, cy - 9*S, cx + 9*S, cy + 9*S], fill=(40, 45, 52, 255), outline=(255, 205, 20, 255), width=2*S)
    for a in [0, 72, 144, 216, 288]:
        rad = math.radians(a)
        sx = cx + int(math.cos(rad) * 6 * S)
        sy = cy + int(math.sin(rad) * 6 * S)
        draw.polygon([(cx, cy), (sx, sy), (cx + int(math.cos(rad+0.4)*4*S), cy + int(math.sin(rad+0.4)*4*S))], fill=(220, 230, 245, 255))

    return finish(im, 64, 64)

# 12. Monkey Buccaneer (Top-Down Pirate Ship with Captain & Broadside Cannons)
def gen_monkey_buccaneer():
    im, W, H = make_canvas(64, 64)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (35, 20, 10, 255)

    # Water wake ripples around hull
    wake = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wdraw = ImageDraw.Draw(wake)
    wdraw.ellipse([cx - 28*S, cy - 22*S, cx + 28*S, cy + 22*S], fill=(210, 245, 255, 110))
    im.alpha_composite(wake)
    draw = ImageDraw.Draw(im)

    # Wooden ship hull (pointed bow facing RIGHT +X)
    hull_pts = [
        (cx - 24*S, cy - 14*S),
        (cx + 10*S, cy - 16*S),
        (cx + 28*S, cy),
        (cx + 10*S, cy + 16*S),
        (cx - 24*S, cy + 14*S)
    ]
    draw.polygon(hull_pts, fill=(125, 72, 32, 255), outline=outline, width=2*S)
    # Inner wooden deck planks
    deck_pts = [
        (cx - 20*S, cy - 10*S),
        (cx + 8*S, cy - 12*S),
        (cx + 21*S, cy),
        (cx + 8*S, cy + 12*S),
        (cx - 20*S, cy + 10*S)
    ]
    draw.polygon(deck_pts, fill=(175, 115, 60, 255), outline=outline, width=SCALE)

    # Broadside cannons protruding top (-Y) and bottom (+Y)
    for cy_off in [-18*S, 13*S]:
        draw.rectangle([cx - 4*S, cy + cy_off, cx + 3*S, cy + cy_off + 5*S], fill=(45, 50, 58, 255), outline=outline, width=SCALE)

    # Pirate Monkey Captain in center with black Tricorne Hat & Skull Emblem
    draw.ellipse([cx - 11*S, cy - 11*S, cx + 9*S, cy + 11*S], fill=(148, 86, 42, 255), outline=outline, width=int(1.5*S))
    # Black pirate hat
    hat_pts = [(cx - 12*S, cy), (cx + 2*S, cy - 15*S), (cx + 10*S, cy), (cx + 2*S, cy + 15*S)]
    draw.polygon(hat_pts, fill=(28, 30, 38, 255), outline=(255, 215, 0, 255), width=int(1.5*S))
    # White skull dot on hat
    draw.ellipse([cx - 2*S, cy - 3*S, cx + 4*S, cy + 3*S], fill=(245, 245, 250, 255))

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

print(f"Generated {len(os.listdir(ASSETS_TOWERS))} upgraded top-down tower assets successfully.")
