import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_BLOONS = os.path.join(os.path.dirname(__file__), "assets", "bloons")
os.makedirs(ASSETS_BLOONS, exist_ok=True)

SCALE = 4  # 4x supersampling for ultra smooth antialiased curves

def draw_balloon(base_color, highlight_color, outline_color, w=48, h=60, is_metallic=False, stripes=None):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # String at bottom
    string_color = (120, 120, 120, 180)
    sx = W // 2
    sy = int(H * 0.78)
    draw.line([(sx, sy), (sx - 6 * SCALE, sy + 6 * SCALE), (sx + 4 * SCALE, sy + 13 * SCALE)], fill=string_color, width=max(2, 1 * SCALE))

    # Balloon main oval
    bx1 = int(W * 0.12)
    by1 = int(H * 0.05)
    bx2 = int(W * 0.88)
    by2 = int(H * 0.76)

    # Shadow/glow
    shadow_box = [bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE]
    draw.ellipse(shadow_box, fill=outline_color)

    # Base balloon fill
    draw.ellipse([bx1, by1, bx2, by2], fill=base_color)

    # If stripes provided (e.g. Zebra or Rainbow)
    if stripes:
        # Create a mask for the balloon body
        mask = Image.new("L", (W, H), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse([bx1, by1, bx2, by2], fill=255)

        stripe_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(stripe_layer)

        if stripes == "zebra":
            # Diagonal black and white stripes
            stripe_w = int(9 * SCALE)
            for i in range(-W, W * 2, stripe_w * 2):
                pts = [(i, 0), (i + stripe_w, 0), (i + stripe_w - H, H), (i - H, H)]
                s_draw.polygon(pts, fill=(35, 35, 40, 255))
        elif stripes == "rainbow":
            # Rainbow bands: Red, Orange, Yellow, Green, Blue, Violet
            rainbow_colors = [
                (230, 40, 40, 255),
                (255, 140, 0, 255),
                (255, 220, 0, 255),
                (40, 190, 50, 255),
                (30, 120, 240, 255),
                (140, 40, 210, 255),
            ]
            band_h = (by2 - by1) / len(rainbow_colors)
            for idx, c in enumerate(rainbow_colors):
                top_y = by1 + idx * band_h
                bot_y = by1 + (idx + 1) * band_h
                s_draw.rectangle([bx1, top_y, bx2, bot_y], fill=c)

        im.paste(stripe_layer, (0, 0), mask)

    # Shading (darker on right/bottom)
    shade_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shade_layer)
    s_draw.ellipse([bx1 + int(W*0.1), by1 + int(H*0.1), bx2, by2], fill=(0, 0, 0, 40 if not is_metallic else 80))
    mask = Image.new("L", (W, H), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.ellipse([bx1, by1, bx2, by2], fill=255)
    im.paste(shade_layer, (0, 0), mask)

    # Knot at bottom
    kx1 = int(W * 0.44)
    ky1 = int(H * 0.74)
    kx2 = int(W * 0.56)
    ky2 = int(H * 0.81)
    knot_pts = [(kx1, ky1), (kx2, ky1), (W // 2 + 3*SCALE, ky2), (W // 2 - 3*SCALE, ky2)]
    draw.polygon(knot_pts, fill=outline_color)
    draw.polygon([(kx1 + SCALE, ky1), (kx2 - SCALE, ky1), (W // 2 + 2*SCALE, ky2 - SCALE), (W // 2 - 2*SCALE, ky2 - SCALE)], fill=base_color)

    # Specular glossy highlight (classic Flash BTD shine)
    hx1 = int(bx1 + (bx2 - bx1) * 0.18)
    hy1 = int(by1 + (by2 - by1) * 0.12)
    hw = int((bx2 - bx1) * 0.28)
    hh = int((by2 - by1) * 0.38)
    
    # Curved crescent highlight
    high_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(high_layer)
    h_draw.ellipse([hx1, hy1, hx1 + hw, hy1 + hh], fill=highlight_color)
    # Cut out inner to make crescent
    h_draw.ellipse([hx1 + int(hw * 0.25), hy1 + int(hh * 0.15), hx1 + hw + 2*SCALE, hy1 + hh + 2*SCALE], fill=(0, 0, 0, 0))
    
    # Secondary dot highlight
    h_draw.ellipse([hx1 + hw - 2*SCALE, hy1 + int(hh*0.65), hx1 + hw + 3*SCALE, hy1 + int(hh*0.65) + 5*SCALE], fill=highlight_color)
    im.alpha_composite(high_layer)

    # Downsample Lanczos
    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_ceramic(damaged_level=0, w=54, h=68):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # String
    sx = W // 2
    sy = int(H * 0.80)
    draw.line([(sx, sy), (sx - 6 * SCALE, sy + 7 * SCALE), (sx + 4 * SCALE, sy + 14 * SCALE)], fill=(90, 80, 70, 200), width=max(2, 1 * SCALE))

    # Clay shell
    bx1 = int(W * 0.12)
    by1 = int(H * 0.05)
    bx2 = int(W * 0.88)
    by2 = int(H * 0.78)

    # Outline
    draw.ellipse([bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE], fill=(60, 35, 20, 255))
    # Clay body
    draw.ellipse([bx1, by1, bx2, by2], fill=(160, 95, 55, 255))

    # Shading gradient
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shade)
    s_draw.ellipse([bx1 + int(W*0.12), by1 + int(H*0.1), bx2 - SCALE, by2 - SCALE], fill=(110, 60, 30, 160))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
    im.paste(shade, (0, 0), mask)

    # Knot
    draw.polygon([(W//2 - 6*SCALE, by2 - 2*SCALE), (W//2 + 6*SCALE, by2 - 2*SCALE), (W//2 + 3*SCALE, by2 + 6*SCALE), (W//2 - 3*SCALE, by2 + 6*SCALE)], fill=(60, 35, 20, 255))
    draw.polygon([(W//2 - 4*SCALE, by2 - SCALE), (W//2 + 4*SCALE, by2 - SCALE), (W//2 + 2*SCALE, by2 + 4*SCALE), (W//2 - 2*SCALE, by2 + 4*SCALE)], fill=(160, 95, 55, 255))

    # Ceramic highlight (matte pottery sheen)
    hx1 = int(bx1 + (bx2 - bx1) * 0.2)
    hy1 = int(by1 + (by2 - by1) * 0.15)
    draw.ellipse([hx1, hy1, hx1 + 10*SCALE, hy1 + 16*SCALE], fill=(220, 160, 120, 140))

    # Cracks if damaged
    if damaged_level >= 1:
        crack_color = (40, 20, 10, 240)
        draw.line([(bx1 + 12*SCALE, by1 + 18*SCALE), (bx1 + 18*SCALE, by1 + 25*SCALE), (bx1 + 16*SCALE, by1 + 35*SCALE), (bx1 + 22*SCALE, by1 + 45*SCALE)], fill=crack_color, width=2*SCALE)
        draw.line([(bx1 + 18*SCALE, by1 + 25*SCALE), (bx1 + 26*SCALE, by1 + 28*SCALE)], fill=crack_color, width=2*SCALE)

    if damaged_level >= 2:
        # Deep breaking fissures with rainbow glow showing through
        glow_color = (255, 220, 100, 255)
        draw.line([(bx2 - 14*SCALE, by1 + 20*SCALE), (bx2 - 22*SCALE, by1 + 32*SCALE), (bx2 - 18*SCALE, by1 + 46*SCALE)], fill=glow_color, width=3*SCALE)
        draw.line([(bx2 - 14*SCALE, by1 + 20*SCALE), (bx2 - 22*SCALE, by1 + 32*SCALE), (bx2 - 18*SCALE, by1 + 46*SCALE)], fill=(30, 10, 5, 255), width=1*SCALE)
        draw.line([(W//2 - 8*SCALE, by1 + 35*SCALE), (W//2 + 8*SCALE, by1 + 40*SCALE), (W//2 + 4*SCALE, by1 + 52*SCALE)], fill=glow_color, width=3*SCALE)

    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_blimp(blimp_type="moab", damaged=False, w=140, h=80):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    is_moab = (blimp_type == "moab")
    body_color = (30, 120, 220, 255) if is_moab else (210, 35, 35, 255)
    shadow_color = (15, 60, 130, 255) if is_moab else (120, 15, 15, 255)
    trim_color = (245, 245, 250, 255) if is_moab else (240, 200, 20, 255)
    outline = (15, 25, 45, 255)

    # Blimp body dimensions (facing rightwards)
    bx1 = int(W * 0.12)
    by1 = int(H * 0.20)
    bx2 = int(W * 0.88)
    by2 = int(H * 0.80)

    # Tail fins (top and bottom and rear)
    fin_top = [(bx1 + 10*SCALE, by1 + 4*SCALE), (bx1 - 10*SCALE, by1 - 14*SCALE), (bx1 + 8*SCALE, by1 - 10*SCALE), (bx1 + 25*SCALE, by1 + 2*SCALE)]
    fin_bot = [(bx1 + 10*SCALE, by2 - 4*SCALE), (bx1 - 10*SCALE, by2 + 14*SCALE), (bx1 + 8*SCALE, by2 + 10*SCALE), (bx1 + 25*SCALE, by2 - 2*SCALE)]
    draw.polygon(fin_top, fill=shadow_color, outline=outline, width=2*SCALE)
    draw.polygon(fin_bot, fill=shadow_color, outline=outline, width=2*SCALE)

    # Rear Propeller mount & spinner
    prop_x = bx1 - 8*SCALE
    prop_y = H // 2
    draw.ellipse([prop_x - 4*SCALE, prop_y - 6*SCALE, prop_x + 4*SCALE, prop_y + 6*SCALE], fill=(50, 50, 60, 255), outline=outline, width=SCALE)
    draw.ellipse([prop_x - 3*SCALE, prop_y - 18*SCALE, prop_x + 3*SCALE, prop_y + 18*SCALE], fill=(200, 210, 220, 200))

    # Main Zeppelin Hull
    draw.ellipse([bx1 - 2*SCALE, by1 - 2*SCALE, bx2 + 2*SCALE, by2 + 2*SCALE], fill=outline)
    draw.ellipse([bx1, by1, bx2, by2], fill=body_color)

    # Lower hull shadow
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shade)
    s_draw.ellipse([bx1, by1 + int((by2-by1)*0.45), bx2, by2], fill=shadow_color)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([bx1, by1, bx2, by2], fill=255)
    im.paste(shade, (0, 0), mask)

    # Horizontal racing stripe / shark mouth
    stripe_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    st_draw = ImageDraw.Draw(stripe_layer)
    sy1 = H // 2 - int(5 * SCALE)
    sy2 = H // 2 + int(5 * SCALE)
    st_draw.rectangle([bx1, sy1, bx2, sy2], fill=trim_color)

    if is_moab:
        # Shark eyes & teeth on the nose
        eye_x = bx2 - 20*SCALE
        eye_y = H // 2 - 10*SCALE
        st_draw.ellipse([eye_x - 4*SCALE, eye_y - 4*SCALE, eye_x + 4*SCALE, eye_y + 4*SCALE], fill=(255, 255, 255, 255), outline=outline, width=SCALE)
        st_draw.ellipse([eye_x, eye_y - 2*SCALE, eye_x + 3*SCALE, eye_y + 2*SCALE], fill=(0, 0, 0, 255))
        # Shark teeth triangles
        teeth_y = H // 2
        for tx in range(bx2 - 38*SCALE, bx2 - 6*SCALE, 8*SCALE):
            st_draw.polygon([(tx, teeth_y - 6*SCALE), (tx + 4*SCALE, teeth_y), (tx + 8*SCALE, teeth_y - 6*SCALE)], fill=(255, 255, 255, 255), outline=outline)
    else:
        # BFB: Hazard stripes across the stripe
        for hx in range(bx1, bx2, 16*SCALE):
            st_draw.polygon([(hx, sy1), (hx + 8*SCALE, sy1), (hx + 4*SCALE, sy2), (hx - 4*SCALE, sy2)], fill=(30, 30, 35, 255))

    im.paste(stripe_layer, (0, 0), mask)

    # Specular gloss on top of blimp
    hx1 = bx1 + int((bx2 - bx1) * 0.15)
    hy1 = by1 + int((by2 - by1) * 0.12)
    hw = int((bx2 - bx1) * 0.70)
    hh = int((by2 - by1) * 0.22)
    draw.ellipse([hx1, hy1, hx1 + hw, hy1 + hh], fill=(255, 255, 255, 90))

    # Cabin / Gondola under blimp
    gx1 = W // 2 - 16*SCALE
    gy1 = by2 - 4*SCALE
    gx2 = W // 2 + 16*SCALE
    gy2 = by2 + 10*SCALE
    draw.rounded_rectangle([gx1, gy1, gx2, gy2], radius=4*SCALE, fill=(50, 60, 75, 255), outline=outline, width=2*SCALE)
    # Gondola windows
    draw.rectangle([gx1 + 4*SCALE, gy1 + 3*SCALE, gx2 - 4*SCALE, gy1 + 7*SCALE], fill=(120, 220, 255, 220))

    if damaged:
        # Damage cracks, blast holes, smoke plumes
        draw.ellipse([bx2 - 45*SCALE, by1 + 10*SCALE, bx2 - 30*SCALE, by1 + 22*SCALE], fill=(30, 30, 30, 220))
        draw.ellipse([bx1 + 30*SCALE, by2 - 25*SCALE, bx1 + 45*SCALE, by2 - 12*SCALE], fill=(40, 20, 20, 220))
        # Orange fire core
        draw.ellipse([bx2 - 40*SCALE, by1 + 13*SCALE, bx2 - 34*SCALE, by1 + 19*SCALE], fill=(255, 120, 20, 255))
        draw.ellipse([bx1 + 35*SCALE, by2 - 22*SCALE, bx1 + 41*SCALE, by2 - 15*SCALE], fill=(255, 120, 20, 255))

    return im.resize((w, h), Image.Resampling.LANCZOS)

def draw_camo_overlay(w=48, h=60):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    # Camouflage patches
    camo_colors = [(45, 75, 35, 180), (85, 110, 45, 180), (110, 95, 55, 180)]
    import random
    rng = random.Random(42)
    for _ in range(16):
        cx = rng.randint(int(W*0.15), int(W*0.85))
        cy = rng.randint(int(H*0.08), int(H*0.75))
        crx = rng.randint(4*SCALE, 12*SCALE)
        cry = rng.randint(3*SCALE, 9*SCALE)
        color = rng.choice(camo_colors)
        draw.ellipse([cx - crx, cy - cry, cx + crx, cy + cry], fill=color)
    
    # Mask to balloon shape
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([int(W*0.12), int(H*0.05), int(W*0.88), int(H*0.76)], fill=255)
    final_im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    final_im.paste(im, (0, 0), mask)
    return final_im.resize((w, h), Image.Resampling.LANCZOS)

def draw_regrow_heart(w=32, h=32):
    W, H = w * SCALE, h * SCALE
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Golden border glow
    pad = 4 * SCALE
    # Heart shape using two circles and a triangle
    def draw_h(color, inset=0):
        cx1 = W // 2 - int(6 * SCALE)
        cx2 = W // 2 + int(6 * SCALE)
        cy = int(H * 0.35)
        r = int(8 * SCALE) - inset
        draw.ellipse([cx1 - r, cy - r, cx1 + r, cy + r], fill=color)
        draw.ellipse([cx2 - r, cy - r, cx2 + r, cy + r], fill=color)
        pts = [(cx1 - r + int(2*SCALE), cy + int(4*SCALE)), (cx2 + r - int(2*SCALE), cy + int(4*SCALE)), (W // 2, int(H * 0.85) - inset)]
        draw.polygon(pts, fill=color)

    draw_h((255, 215, 0, 255), 0)
    draw_h((220, 20, 60, 255), 2 * SCALE)
    # Specular
    draw.ellipse([W//2 - 9*SCALE, H//3 - 3*SCALE, W//2 - 5*SCALE, H//3 + 2*SCALE], fill=(255, 255, 255, 200))
    return im.resize((w, h), Image.Resampling.LANCZOS)

# Build all bloons
bloon_configs = {
    "red": ((235, 45, 45, 255), (255, 180, 180, 210), (160, 20, 20, 255)),
    "blue": ((35, 130, 245, 255), (170, 215, 255, 210), (15, 75, 180, 255)),
    "green": ((45, 195, 55, 255), (180, 255, 185, 210), (20, 130, 30, 255)),
    "yellow": ((255, 220, 20, 255), (255, 250, 175, 220), (195, 155, 10, 255)),
    "pink": ((255, 65, 160, 255), (255, 190, 225, 220), (190, 25, 105, 255)),
    "black": ((40, 42, 48, 255), (145, 155, 170, 210), (15, 16, 20, 255)),
    "white": ((245, 248, 252, 255), (255, 255, 255, 255), (175, 190, 210, 255)),
    "lead": ((135, 145, 155, 255), (225, 235, 245, 240), (70, 75, 85, 255)),
    "zebra": ((240, 240, 245, 255), (255, 255, 255, 220), (20, 20, 25, 255)),
    "rainbow": ((255, 255, 255, 255), (255, 255, 255, 230), (50, 50, 60, 255)),
}

for name, (base, hi, out) in bloon_configs.items():
    stripes = "zebra" if name == "zebra" else ("rainbow" if name == "rainbow" else None)
    is_met = (name in ["black", "lead"])
    img = draw_balloon(base, hi, out, is_metallic=is_met, stripes=stripes)
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

print(f"Generated {len(os.listdir(ASSETS_BLOONS))} bloon assets successfully.")
