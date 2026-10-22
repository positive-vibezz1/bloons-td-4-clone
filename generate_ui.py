import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_UI = os.path.join(os.path.dirname(__file__), "assets", "ui")
os.makedirs(ASSETS_UI, exist_ok=True)

SCALE = 4

def make_canvas(w=32, h=32):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0)), w * SCALE, h * SCALE

def finish(im, w=32, h=32):
    return im.resize((w, h), Image.Resampling.LANCZOS)

# 1. Heart (Lives)
def gen_heart():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, int(H * 0.45)
    S = SCALE

    r = 7 * S
    c1 = cx - 5 * S
    c2 = cx + 5 * S
    # Dark outline
    draw.ellipse([c1 - r - 2*S, cy - r - 2*S, c1 + r + 2*S, cy + r + 2*S], fill=(120, 10, 20, 255))
    draw.ellipse([c2 - r - 2*S, cy - r - 2*S, c2 + r + 2*S, cy + r + 2*S], fill=(120, 10, 20, 255))
    draw.polygon([(c1 - r - 2*S, cy + 2*S), (c2 + r + 2*S, cy + 2*S), (cx, H - 2*S)], fill=(120, 10, 20, 255))

    # Red body
    draw.ellipse([c1 - r, cy - r, c1 + r, cy + r], fill=(235, 30, 45, 255))
    draw.ellipse([c2 - r, cy - r, c2 + r, cy + r], fill=(235, 30, 45, 255))
    draw.polygon([(c1 - r, cy + 2*S), (c2 + r, cy + 2*S), (cx, H - 4*S)], fill=(235, 30, 45, 255))

    # Specular gloss
    draw.ellipse([c1 - 4*S, cy - 4*S, c1 + 1*S, cy + 1*S], fill=(255, 255, 255, 200))
    return finish(im, 32, 32)

# 2. Coin (Cash)
def gen_coin():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Beveled gold coin
    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(185, 140, 20, 255))
    draw.ellipse([cx - 11*S, cy - 11*S, cx + 11*S, cy + 11*S], fill=(255, 215, 30, 255))
    draw.ellipse([cx - 9*S, cy - 9*S, cx + 9*S, cy + 9*S], fill=(240, 185, 20, 255))

    # Dollar symbol
    draw.line([(cx, cy - 6*S), (cx, cy + 6*S)], fill=(160, 110, 10, 255), width=2*S)
    draw.arc([cx - 4*S, cy - 5*S, cx + 4*S, cy], start=90, end=270, fill=(160, 110, 10, 255), width=2*S)
    draw.arc([cx - 4*S, cy, cx + 4*S, cy + 5*S], start=270, end=90, fill=(160, 110, 10, 255), width=2*S)

    # Specular rim
    draw.arc([cx - 10*S, cy - 10*S, cx + 10*S, cy + 10*S], start=135, end=225, fill=(255, 255, 200, 220), width=2*S)

    return finish(im, 32, 32)

# 3. Play Button
def gen_play():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Green circle badge
    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(35, 175, 55, 255), outline=(15, 95, 25, 255), width=2*S)
    # White play triangle
    draw.polygon([(cx - 4*S, cy - 7*S), (cx + 7*S, cy), (cx - 4*S, cy + 7*S)], fill=(255, 255, 255, 255))
    return finish(im, 32, 32)

# 4. Pause Button
def gen_pause():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Amber circle badge
    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(245, 160, 20, 255), outline=(140, 85, 10, 255), width=2*S)
    # White pause bars
    draw.rectangle([cx - 5*S, cy - 6*S, cx - 2*S, cy + 6*S], fill=(255, 255, 255, 255))
    draw.rectangle([cx + 2*S, cy - 6*S, cx + 5*S, cy + 6*S], fill=(255, 255, 255, 255))
    return finish(im, 32, 32)

# 5. Speeds (1x, 2x, 4x)
def gen_speed(label="1x"):
    im, W, H = make_canvas(36, 24)
    draw = ImageDraw.Draw(im)
    S = SCALE

    # Blue pill button
    draw.rounded_rectangle([2*S, 2*S, W - 2*S, H - 2*S], radius=4*S, fill=(40, 115, 220, 255), outline=(15, 55, 125, 255), width=SCALE)
    # Chevrons
    cx = W // 2
    cy = H // 2
    arrows = 1 if label == "1x" else (2 if label == "2x" else 3)
    start_x = cx - (arrows - 1) * 4 * S
    for i in range(arrows):
        ax = start_x + i * 8 * S
        draw.polygon([(ax - 3*S, cy - 5*S), (ax + 2*S, cy), (ax - 3*S, cy + 5*S)], fill=(255, 255, 255, 255))
    return finish(im, 36, 24)

# 6. Auto-start
def gen_autostart():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    # Purple circle badge
    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(130, 60, 210, 255), outline=(65, 20, 115, 255), width=2*S)
    # Circular arrows
    draw.arc([cx - 7*S, cy - 7*S, cx + 7*S, cy + 7*S], start=30, end=300, fill=(255, 255, 255, 255), width=2*S)
    # Arrow head
    draw.polygon([(cx + 5*S, cy - 8*S), (cx + 9*S, cy - 4*S), (cx + 3*S, cy - 3*S)], fill=(255, 255, 255, 255))
    return finish(im, 32, 32)

# 7. Sound On/Off
def gen_sound(enabled=True):
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(60, 70, 85, 255), outline=(30, 35, 45, 255), width=2*S)
    # Speaker body
    draw.rectangle([cx - 7*S, cy - 3*S, cx - 3*S, cy + 3*S], fill=(255, 255, 255, 255))
    draw.polygon([(cx - 3*S, cy - 3*S), (cx + 2*S, cy - 7*S), (cx + 2*S, cy + 7*S), (cx - 3*S, cy + 3*S)], fill=(255, 255, 255, 255))

    if enabled:
        # Waves
        draw.arc([cx + 1*S, cy - 5*S, cx + 6*S, cy + 5*S], start=-60, end=60, fill=(255, 255, 255, 255), width=SCALE)
        draw.arc([cx + 3*S, cy - 8*S, cx + 9*S, cy + 8*S], start=-60, end=60, fill=(255, 255, 255, 255), width=SCALE)
    else:
        # Red slash
        draw.line([(cx - 6*S, cy - 6*S), (cx + 7*S, cy + 7*S)], fill=(235, 40, 40, 255), width=2*S)

    return finish(im, 32, 32)

# 8. Sell Button Icon
def gen_sell():
    im, W, H = make_canvas(32, 32)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE

    draw.ellipse([cx - 13*S, cy - 13*S, cx + 13*S, cy + 13*S], fill=(215, 50, 40, 255), outline=(120, 20, 15, 255), width=2*S)
    # White trash / recycle dollar
    draw.rectangle([cx - 6*S, cy - 4*S, cx + 6*S, cy + 6*S], fill=(255, 255, 255, 255))
    draw.line([(cx - 8*S, cy - 4*S), (cx + 8*S, cy - 4*S)], fill=(255, 255, 255, 255), width=2*S)
    draw.rectangle([cx - 3*S, cy - 7*S, cx + 3*S, cy - 4*S], fill=(255, 255, 255, 255))

    return finish(im, 32, 32)

# Save UI icons
gen_heart().save(os.path.join(ASSETS_UI, "heart.png"))
gen_coin().save(os.path.join(ASSETS_UI, "coin.png"))
gen_play().save(os.path.join(ASSETS_UI, "play.png"))
gen_pause().save(os.path.join(ASSETS_UI, "pause.png"))
gen_speed("1x").save(os.path.join(ASSETS_UI, "speed_1x.png"))
gen_speed("2x").save(os.path.join(ASSETS_UI, "speed_2x.png"))
gen_speed("4x").save(os.path.join(ASSETS_UI, "speed_4x.png"))
gen_autostart().save(os.path.join(ASSETS_UI, "auto_start.png"))
gen_sound(True).save(os.path.join(ASSETS_UI, "sound_on.png"))
gen_sound(False).save(os.path.join(ASSETS_UI, "sound_off.png"))
gen_sell().save(os.path.join(ASSETS_UI, "sell.png"))

print(f"Generated {len(os.listdir(ASSETS_UI))} UI assets successfully.")
