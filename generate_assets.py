import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

for sub in ["bloons", "towers", "projectiles", "maps", "ui"]:
    os.makedirs(os.path.join(ASSETS_DIR, sub), exist_ok=True)

print(f"Created asset directories under {ASSETS_DIR}")
