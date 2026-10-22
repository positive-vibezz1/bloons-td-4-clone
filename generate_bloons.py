import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_BLOONS = os.path.join(os.path.dirname(__file__), "assets", "bloons")
os.makedirs(ASSETS_BLOONS, exist_ok=True)

SCALE = 4  # 4x supersampling for ultra smooth antialiased curves

def draw_balloon(base_color, outline_color, w=48, h=60, is_metallic=False, stripes=None):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # String dangling at bottom
    string_color = (90, 90, 90, 220)
    sx = W // 2
    sy = int(H * 0.76)
    draw.line([(sx, sy), (sx - 5 * SCALE, sy + 7 * SCALE), (sx + 4 * SCALE, sy + 15 * SCALE)], fill=string_color, width=max(2, 1 * SCALE))

    # Balloon main oval coordinates
    bx1 = int(W * 0.10)
    by1 = int(H * 0.04)
    bx2 = int(W * 0.90)
    by2 = int(H * 0.76)

    # Knot at bottom
    kx1 = W // 2 - int(5 * SCALE)
    kx2 = W // 2 + int(5 * SCALE)
    ky1 = int(H * 0.73)
    ky2 = int(H * 0.81)
    draw.polygon([(kx1, ky1), (kx2, ky1), (W // 2 + 3*SCALE, ky2), (W // 2 - 3*SCALE, ky2)], fill=outline_color)
    draw.polygon([(kx1 + SCALE, ky1), (kx2 - SCALE, ky1), (W // 2 + 2*SCALE, ky2 - SCALE), (W // 2 - 2*SCALE, ky2 - SCALE)], fill=base_color)

    # Outer outline (crisp cartoon border)
    draw.ellipse([bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE], fill=outline_color)

    # Solid 100% opaque base color fill
    draw.ellipse([bx1, by1, bx2, by2], fill=base_color)

    # If stripes provided (Zebra or Rainbow)
    if stripes == "zebra":
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
        stripe_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(stripe_layer)
        # Bold diagonal black stripes
        stripe_w = int(10 * SCALE)
        for i in range(-W, W * 2, stripe_w * 2):
            pts = [(i, 0), (i + stripe_w, 0), (i + stripe_w - H, H), (i - H, H)]
            s_draw.polygon(pts, fill=(28, 28, 32, 255))
        im.paste(stripe_layer, (0, 0), mask)
    elif stripes == "rainbow":
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
        stripe_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(stripe_layer)
        rainbow_colors = [
            (235, 40, 40, 255),    # Red
            (255, 140, 10, 255),   # Orange
            (255, 225, 10, 255),   # Yellow
            (40, 200, 50, 255),    # Green
            (30, 130, 245, 255),   # Blue
            (145, 45, 215, 255),   # Violet
        ]
        band_h = (by2 - by1) / len(rainbow_colors)
        for idx, c in enumerate(rainbow_colors):
            top_y = int(by1 + idx * band_h)
            bot_y = int(by1 + (idx + 1) * band_h) + 1
            s_draw.rectangle([bx1, top_y, bx2, bot_y], fill=c)
        im.paste(stripe_layer, (0, 0), mask)

    # 3D shading on bottom-right (alpha composite so base color stays 100% solid)
    shade_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shade_layer)
    s_draw.ellipse([bx1 + int(W*0.08), by1 + int(H*0.08), bx2, by2], fill=(0, 0, 0, 50 if not is_metallic else 90))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
    im = Image.composite(Image.alpha_composite(im, shade_layer), im, mask)

    # Metallic reflection bands if lead
    if is_metallic:
        metal_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        m_draw = ImageDraw.Draw(metal_layer)
        # Shiny horizontal glare bar
        gy1 = by1 + int((by2 - by1) * 0.35)
        gy2 = by1 + int((by2 - by1) * 0.45)
        m_draw.ellipse([bx1, gy1, bx2, gy2], fill=(255, 255, 255, 120))
        im = Image.composite(Image.alpha_composite(im, metal_layer), im, mask)

    # Specular glossy highlight (classic Flash BTD shine on top-left)
    high_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(high_layer)
    hx1 = bx1 + int((bx2 - bx1) * 0.16)
    hy1 = by1 + int((by2 - by1) * 0.10)
    hw = int((bx2 - bx1) * 0.28)
    hh = int((by2 - by1) * 0.38)
    
    # Curved crescent highlight
    h_draw.ellipse([hx1, hy1, hx1 + hw, hy1 + hh], fill=(255, 255, 255, 195))
    h_draw.ellipse([hx1 + int(hw * 0.35), hy1 + int(hh * 0.20), hx1 + hw + 2*SCALE, hy1 + hh + 2*SCALE], fill=(0, 0, 0, 0))
    # Secondary dot highlight
    h_draw.ellipse([hx1 + hw - 3*SCALE, hy1 + int(hh*0.7), hx1 + hw + 3*SCALE, hy1 + int(hh*0.7) + 6*SCALE], fill=(255, 255, 255, 180))
    
    im = Image.alpha_composite(im, high_layer)

    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_ceramic(damaged_level=0, w=54, h=68):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # String
    sx, sy = W // 2, int(H * 0.80)
    draw.line([(sx, sy), (sx - 6 * SCALE, sy + 7 * SCALE), (sx + 4 * SCALE, sy + 14 * SCALE)], fill=(80, 60, 45, 220), width=max(2, 1 * SCALE))

    # Clay shell
    bx1 = int(W * 0.10)
    by1 = int(H * 0.04)
    bx2 = int(W * 0.90)
    by2 = int(H * 0.78)

    # Knot
    draw.polygon([(W//2 - 6*SCALE, by2 - 2*SCALE), (W//2 + 6*SCALE, by2 - 2*SCALE), (W//2 + 3*SCALE, by2 + 6*SCALE), (W//2 - 3*SCALE, by2 + 6*SCALE)], fill=(55, 30, 15, 255))
    draw.polygon([(W//2 - 4*SCALE, by2 - SCALE), (W//2 + 4*SCALE, by2 - SCALE), (W//2 + 2*SCALE, by2 + 4*SCALE), (W//2 - 2*SCALE, by2 + 4*SCALE)], fill=(155, 90, 50, 255))

    # Dark clay outline
    draw.ellipse([bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE], fill=(55, 30, 15, 255))
    # Solid terracotta clay body
    draw.ellipse([bx1, by1, bx2, by2], fill=(160, 95, 55, 255))

    # Shading on bottom-right
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shade)
    s_draw.ellipse([bx1 + int(W*0.10), by1 + int(H*0.10), bx2, by2], fill=(0, 0, 0, 70))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
    im = Image.composite(Image.alpha_composite(im, shade), im, mask)

    # Matte pottery highlight
    hx1 = int(bx1 + (bx2 - bx1) * 0.20)
    hy1 = int(by1 + (by2 - by1) * 0.14)
    high = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(high).ellipse([hx1, hy1, hx1 + 10*SCALE, hy1 + 16*SCALE], fill=(235, 185, 150, 160))
    im = Image.alpha_composite(im, high)

    # Cracks if damaged
    if damaged_level >= 1:
        crack_draw = ImageDraw.Draw(im)
        # Deep dark cracks
        c_pts = [
            (bx1 + 16*SCALE, by1 + 18*SCALE),
            (bx1 + 28*SCALE, by1 + 28*SCALE),
            (bx1 + 22*SCALE, by1 + 42*SCALE),
            (bx1 + 38*SCALE, by1 + 54*SCALE),
            (bx1 + 32*SCALE, by1 + 68*SCALE)
        ]
        crack_draw.line(c_pts, fill=(35, 18, 10, 255), width=max(2, 2*SCALE))
        crack_draw.line([(bx1 + 28*SCALE, by1 + 28*SCALE), (bx1 + 42*SCALE, by1 + 24*SCALE)], fill=(35, 18, 10, 255), width=max(2, 1*SCALE))

    if damaged_level >= 2:
        # Massive fracture with rainbow colors peeking through core!
        core_box = [int(W * 0.38), int(H * 0.26), int(W * 0.65), int(H * 0.56)]
        draw.ellipse([core_box[0] - 2*SCALE, core_box[1] - 2*SCALE, core_box[2] + 2*SCALE, core_box[3] + 2*SCALE], fill=(35, 18, 10, 255))
        # Rainbow core inside
        rainbow_colors = [(235, 40, 40), (255, 140, 10), (255, 225, 10), (40, 200, 50), (30, 130, 245), (145, 45, 215)]
        bh = (core_box[3] - core_box[1]) / len(rainbow_colors)
        for idx, col in enumerate(rainbow_colors):
            y_a = int(core_box[1] + idx * bh)
            y_b = int(core_box[1] + (idx + 1) * bh) + 1
            draw.rectangle([core_box[0], y_a, core_box[2], y_b], fill=col + (255,))
        # Additional crack lines radiating outward
        draw.line([(core_box[0], core_box[1]), (bx1 + 10*SCALE, by1 + 10*SCALE)], fill=(35, 18, 10, 255), width=max(2, 2*SCALE))
        draw.line([(core_box[2], core_box[3]), (bx2 - 8*SCALE, by2 - 10*SCALE)], fill=(35, 18, 10, 255), width=max(2, 2*SCALE))

    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_blimp(blimp_type="moab", damaged=False, w=140, h=80):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    is_moab = (blimp_type == "moab")
    body_color = (25, 95, 215, 255) if is_moab else (215, 30, 30, 255)
    shadow_color = (15, 55, 140, 255) if is_moab else (130, 15, 15, 255)
    outline = (10, 30, 75, 255) if is_moab else (75, 10, 10, 255)
    trim_color = (245, 248, 255, 255) if is_moab else (255, 215, 0, 255)

    bx1 = int(W * 0.12)
    by1 = int(H * 0.20)
    bx2 = int(W * 0.88)
    by2 = int(H * 0.80)

    # Tail fins (top, bottom, rear)
    fin_top = [(bx1 + 10*SCALE, by1 + 4*SCALE), (bx1 - 10*SCALE, by1 - 14*SCALE), (bx1 + 8*SCALE, by1 - 10*SCALE), (bx1 + 25*SCALE, by1 + 2*SCALE)]
    fin_bot = [(bx1 + 10*SCALE, by2 - 4*SCALE), (bx1 - 10*SCALE, by2 + 14*SCALE), (bx1 + 8*SCALE, by2 + 10*SCALE), (bx1 + 25*SCALE, by2 - 2*SCALE)]
    draw.polygon(fin_top, fill=shadow_color, outline=outline, width=2*SCALE)
    draw.polygon(fin_bot, fill=shadow_color, outline=outline, width=2*SCALE)

    # Rear Propeller mount & spinner
    prop_x = bx1 - 8*SCALE
    prop_y = H // 2
    draw.ellipse([prop_x - 4*SCALE, prop_y - 6*SCALE, prop_x + 4*SCALE, prop_y + 6*SCALE], fill=(50, 50, 60, 255), outline=outline, width=SCALE)
    draw.ellipse([prop_x - 3*SCALE, prop_y - 18*SCALE, prop_x + 3*SCALE, prop_y + 18*SCALE], fill=(210, 220, 230, 210))

    # Main Zeppelin Hull Outline & Solid Body
    draw.ellipse([bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE], fill=outline)
    draw.ellipse([bx1, by1, bx2, by2], fill=body_color)

    # Lower hull shadow
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shade).ellipse([bx1, by1 + int((by2-by1)*0.45), bx2, by2], fill=(0, 0, 0, 60))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
    im = Image.composite(Image.alpha_composite(im, shade), im, mask)

    # Horizontal racing stripe
    sy1 = H // 2 - int(5 * SCALE)
    sy2 = H // 2 + int(5 * SCALE)
    stripe = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(stripe)
    s_draw.rectangle([bx1, sy1, bx2, sy2], fill=trim_color)

    if is_moab:
        # Shark eyes & teeth on nose
        eye_x = bx2 - 20*SCALE
        eye_y = H // 2 - 10*SCALE
        s_draw.ellipse([eye_x - 4*SCALE, eye_y - 4*SCALE, eye_x + 4*SCALE, eye_y + 4*SCALE], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
        s_draw.ellipse([eye_x, eye_y - 2*SCALE, eye_x + 3*SCALE, eye_y + 2*SCALE], fill=(0, 0, 0, 255))
        # Shark teeth triangles
        teeth_y = H // 2
        for tx in range(bx2 - 38*SCALE, bx2 - 6*SCALE, 8*SCALE):
            s_draw.polygon([(tx, teeth_y - 6*SCALE), (tx + 4*SCALE, teeth_y), (tx + 8*SCALE, teeth_y - 6*SCALE)], fill=(255, 255, 255, 255), outline=outline)
    else:
        # BFB hazard stripes
        for hx in range(bx1, bx2, 16*SCALE):
            s_draw.polygon([(hx, sy1), (hx + 8*SCALE, sy1), (hx + 4*SCALE, sy2), (hx - 4*SCALE, sy2)], fill=(25, 25, 30, 255))

    im = Image.composite(Image.alpha_composite(im, stripe), im, mask)

    # Specular gloss on top of blimp
    hx1 = bx1 + int((bx2 - bx1) * 0.15)
    hy1 = by1 + int((by2 - by1) * 0.12)
    hw = int((bx2 - bx1) * 0.70)
    hh = int((by2 - by1) * 0.22)
    high = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(high).ellipse([hx1, hy1, hx1 + hw, hy1 + hh], fill=(255, 255, 255, 110))
    im = Image.alpha_composite(im, high)

    # Gondola cabin underneath
    gx1 = W // 2 - 16*SCALE
    gy1 = by2 - 4*SCALE
    gx2 = W // 2 + 16*SCALE
    gy2 = by2 + 10*SCALE
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([gx1, gy1, gx2, gy2], radius=4*SCALE, fill=(45, 55, 70, 255), outline=outline, width=2*SCALE)
    draw.rectangle([gx1 + 4*SCALE, gy1 + 3*SCALE, gx2 - 4*SCALE, gy1 + 7*SCALE], fill=(130, 225, 255, 240))

    if damaged:
        # Smoke and blast holes
        draw.ellipse([bx2 - 45*SCALE, by1 + 10*SCALE, bx2 - 30*SCALE, by1 + 22*SCALE], fill=(25, 25, 25, 230))
        draw.ellipse([bx1 + 30*SCALE, by2 - 25*SCALE, bx1 + 45*SCALE, by2 - 12*SCALE], fill=(30, 20, 20, 230))
        draw.ellipse([bx2 - 40*SCALE, by1 + 13*SCALE, bx2 - 34*SCALE, by1 + 19*SCALE], fill=(255, 130, 20, 255))
        draw.ellipse([bx1 + 35*SCALE, by2 - 22*SCALE, bx1 + 41*SCALE, by2 - 15*SCALE], fill=(255, 130, 20, 255))

    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_camo_overlay(w=48, h=60):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    camo_colors = [(40, 70, 30, 210), (75, 105, 40, 210), (105, 90, 50, 210)]
    import random
    rng = random.Random(42)
    for _ in range(18):
        cx = rng.randint(int(W*0.15), int(W*0.85))
        cy = rng.randint(int(H*0.08), int(H*0.75))
        crx = rng.randint(4*SCALE, 11*SCALE)
        cry = rng.randint(3*SCALE, 8*SCALE)
        color = rng.choice(camo_colors)
        draw.ellipse([cx - crx, cy - cry, cx + crx, cy + cry], fill=color)
    
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([int(W*0.10), int(H*0.04), int(W*0.90), int(H*0.76)], fill=255)
    final_im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    final_im.paste(im, (0, 0), mask)
    return final_im.resize((w, h), Image.Resampling.LANCZOS)

def draw_regrow_heart(w=32, h=32):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    def draw_h(color, inset=0):
        cx1 = W // 2 - int(6 * SCALE)
        cx2 = W // 2 + int(6 * SCALE)
        cy = int(H * 0.35)
        r = int(8 * SCALE) - inset
        draw.ellipse([cx1 - r, cy - r, cx1 + r, cy + r], fill=color)
        draw.ellipse([cx2 - r, cy - r, cx2 + r, cy + r], fill=color)
        pts = [(cx1 - r + int(2*SCALE), cy + int(4*SCALE)), (cx2 + r - int(2*SCALE), cy + int(4*SCALE)), (W // 2, int(H * 0.85) - inset)]
        draw.polygon(pts, fill=color)

    # Gold glow border
    draw_h((255, 215, 0, 255), 0)
    # Bright crimson heart core
    draw_h((225, 20, 50, 255), 2 * SCALE)
    # Specular shine
    draw.ellipse([W//2 - 9*SCALE, H//3 - 3*SCALE, W//2 - 5*SCALE, H//3 + 2*SCALE], fill=(255, 255, 255, 210))
    return im.resize((w, h), Image.Resampling.LANCZOS)

# Build all bloon sprites with 100% solid, fully opaque, vibrant colors
bloon_configs = {
    "red": ((235, 35, 35, 255), (150, 15, 15, 255)),
    "blue": ((30, 130, 245, 255), (15, 75, 180, 255)),
    "green": ((40, 195, 45, 255), (20, 120, 25, 255)),
    "yellow": ((255, 215, 0, 255), (190, 145, 10, 255)),
    "pink": ((255, 60, 160, 255), (185, 20, 100, 255)),
    "black": ((42, 45, 52, 255), (15, 16, 20, 255)),
    "white": ((245, 250, 255, 255), (165, 185, 205, 255)),
    "lead": ((135, 145, 160, 255), (65, 70, 80, 255)),
    "zebra": ((245, 245, 250, 255), (20, 20, 25, 255)),
    "rainbow": ((255, 255, 255, 255), (45, 45, 55, 255)),
}

for name, (base, out) in bloon_configs.items():
    stripes = "zebra" if name == "zebra" else ("rainbow" if name == "rainbow" else None)
    is_met = (name in ["black", "lead"])
    img = draw_balloon(base, out, is_metallic=is_met, stripes=stripes)
    img.save(os.path.join(ASSETS_BLOONS, f"{name}.png"))

draw_ceramic(0).save(os.path.join(ASSETS_BLOONS, "ceramic.png"))
draw_ceramic(1).save(os.path.join(ASSETS_BLOONS, "ceramic_cracked.png"))
draw_ceramic(2).save(os.path.join(ASSETS_BLOONS, "ceramic_broken.png"))

draw_blimp("moab", False, 140, 80).save(os.path.join(ASSETS_BLOONS, "moab.png"))
draw_blimp("moab", True, 140, 80).save(os.path.join(ASSETS_BLOONS, "moab_damaged.png"))
draw_blimp("bfb", False, 180, 100).save(os.path.join(ASSETS_BLOONS, "bfb.png"))
draw_blimp("bfb", True, 180, 100).save(os.path.join(ASSETS_BLOONS, "bfb_damaged.png"))

draw_camo_overlay().save(os.path.join(ASSETS_BLOONS, "camo_overlay.png"))
draw_regrow_heart().save(os.path.join(ASSETS_BLOONS, "regrow_heart.png"))

print(f"Generated {len(os.listdir(ASSETS_BLOONS))} bloon assets with 100% solid opacity!")
