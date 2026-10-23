import os
import math
from PIL import Image, ImageDraw, ImageFilter

ASSETS_UI = os.path.join(os.path.dirname(__file__), "assets", "ui")
os.makedirs(ASSETS_UI, exist_ok=True)

SCALE = 4

def make_canvas(w=48, h=48):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0)), w * SCALE, h * SCALE

def finish(im, w=48, h=48):
    return im.resize((w, h), Image.Resampling.LANCZOS)

# 1. Heart (Lives)
def gen_heart():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, int(H * 0.40)
    S = SCALE
    outline = (90, 8, 18, 255)

    r = 10.5 * S
    c1 = cx - 8.5 * S
    c2 = cx + 8.5 * S

    # Outline
    draw.ellipse([c1 - r - 2.5*S, cy - r - 2.5*S, c1 + r + 2.5*S, cy + r + 2.5*S], fill=outline)
    draw.ellipse([c2 - r - 2.5*S, cy - r - 2.5*S, c2 + r + 2.5*S, cy + r + 2.5*S], fill=outline)
    draw.polygon([(c1 - r - 1.5*S, cy + 4*S), (c2 + r + 1.5*S, cy + 4*S), (cx, H - 3*S)], fill=outline)

    # Rich ruby fill
    draw.ellipse([c1 - r, cy - r, c1 + r, cy + r], fill=(245, 30, 50, 255))
    draw.ellipse([c2 - r, cy - r, c2 + r, cy + r], fill=(245, 30, 50, 255))
    draw.polygon([(c1 - r + 0.5*S, cy + 4*S), (c2 + r - 0.5*S, cy + 4*S), (cx, H - 6*S)], fill=(245, 30, 50, 255))

    # Glossy highlight
    draw.ellipse([c1 - 6*S, cy - 6*S, c1 + 1*S, cy + 1*S], fill=(255, 255, 255, 220))
    return finish(im, 48, 48)

# 2. Coin (Cash)
def gen_coin():
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (95, 60, 5, 255)

    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], fill=(255, 215, 25, 255), outline=outline, width=2*S)
    draw.ellipse([cx - 15*S, cy - 15*S, cx + 15*S, cy + 15*S], fill=(235, 175, 15, 255), outline=(170, 120, 10, 255), width=int(1.5*S))

    # Crisp '$' Banana-Bucks emblem
    col = (115, 72, 8, 255)
    draw.line([(cx, cy - 11*S), (cx, cy + 11*S)], fill=col, width=3*S)
    draw.arc([cx - 6*S, cy - 8*S, cx + 6*S, cy + 1*S], start=70, end=280, fill=col, width=3*S)
    draw.arc([cx - 6*S, cy - 1*S, cx + 6*S, cy + 8*S], start=250, end=100, fill=col, width=3*S)

    # Top-left shine
    draw.arc([cx - 17*S, cy - 17*S, cx + 17*S, cy + 17*S], start=195, end=255, fill=(255, 255, 210, 240), width=2*S)
    return finish(im, 48, 48)

# 3. Sound On / Off
def gen_sound(enabled=True):
    im, W, H = make_canvas(48, 48)
    draw = ImageDraw.Draw(im)
    cx, cy = W // 2, H // 2
    S = SCALE
    outline = (20, 28, 38, 255)

    bg_col = (55, 155, 65, 255) if enabled else (185, 50, 45, 255)
    draw.ellipse([cx - 20*S, cy - 20*S, cx + 20*S, cy + 20*S], fill=bg_col, outline=outline, width=2*S)

    # Speaker cone
    draw.rounded_rectangle([cx - 12*S, cy - 5*S, cx - 4*S, cy + 5*S], radius=SCALE, fill=(255, 255, 255, 255))
    draw.polygon([(cx - 6*S, cy - 5*S), (cx + 3*S, cy - 12*S), (cx + 3*S, cy + 12*S), (cx - 6*S, cy + 5*S)], fill=(255, 255, 255, 255))

    if enabled:
        draw.arc([cx + 1*S, cy - 8*S, cx + 10*S, cy + 8*S], start=-55, end=55, fill=(255, 255, 255, 255), width=2*S)
        draw.arc([cx + 4*S, cy - 13*S, cx + 15*S, cy + 13*S], start=-55, end=55, fill=(255, 255, 255, 255), width=2*S)
    else:
        draw.line([(cx + 6*S, cy - 6*S), (cx + 15*S, cy + 6*S)], fill=(255, 230, 230, 255), width=3*S)
        draw.line([(cx + 15*S, cy - 6*S), (cx + 6*S, cy + 6*S)], fill=(255, 230, 230, 255), width=3*S)

    return finish(im, 48, 48)

gen_heart().save(os.path.join(ASSETS_UI, "heart.png"))
gen_coin().save(os.path.join(ASSETS_UI, "coin.png"))
gen_sound(True).save(os.path.join(ASSETS_UI, "sound_on.png"))
gen_sound(False).save(os.path.join(ASSETS_UI, "sound_off.png"))
print("Updated high-res UI assets.")
