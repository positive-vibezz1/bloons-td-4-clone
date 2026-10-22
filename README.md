# Bloons Tower Defense 4 - Standalone Game & Web Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-blue.svg)](https://github.com/positive-vibezz1/bloons-td-4-clone)
[![Framework](https://img.shields.io/badge/.NET-10.0-purple.svg)](https://dotnet.microsoft.com/)

A faithful, feature-rich clone of the classic **Bloons Tower Defense 4** Flash game. Built from scratch with dedicated custom assets, procedural sound synthesis, authentic balloon popping mechanics, upgrade trees, and responsive controls.

---

## 🚀 Download & Play Standalone (.exe)

You can download and launch the game directly as a high-performance Windows desktop application:

- **Download Executable**: Download [`BloonsTD4.exe`](https://github.com/positive-vibezz1/bloons-td-4-clone/releases/latest) from the [Releases](https://github.com/positive-vibezz1/bloons-td-4-clone/releases) page.
- **Run from Terminal**:
  ```powershell
  .\BloonsTD4.exe
  ```

### Desktop Engine Features:
- **Zero Local HTTP Server Required**: Built using native Windows WebView2 with Virtual Host Folder Mapping (`https://bloons.game`).
- **No Firewall / Port Prompts**: Operates 100% locally and offline without binding to `127.0.0.1` or any TCP port.
- **Completely Self-Contained**: Can be launched from any directory or copied anywhere (such as your Desktop) with embedded fallback assets.
- **Hardware-Accelerated HTML5 Canvas & Web Audio**: Smooth 60 FPS graphics and crisp procedural audio synthesis.
- **Window Controls**: Resizable window with minimum sizing constraints, custom window icon, and F11 / HTML5 fullscreen support.

---

## 🎮 Play in Web Browser

You can also run or play it directly in any modern browser:
- **Direct HTML**: Open [`index.html`](index.html) in Chrome, Edge, Firefox, or Safari.
- **Local Web Server**:
  ```powershell
  python -m http.server 8080
  ```
  Then navigate to `http://localhost:8080`.

### Controls:
- **Click Tower in Shop** -> **Click Map** to place the tower.
- **Click Placed Tower** to view upgrade paths, stats, targeting priority, and sell option.
- **Spacebar**: Start Round / Toggle Speed (1x / 2x / 4x).
- **Tab**: Cycle targeting priority (First -> Last -> Close -> Strong).
- **Escape**: Cancel tower placement or deselect tower.
- **Delete / Backspace**: Sell selected tower (refunds 80% of invested cost).
- **Hover / Click Bananas**: Collect lucrative cash from Banana Farms.
- **Click Map with Mortar Selected**: Reposition artillery target crosshair.

---

## 🛠️ Building the Standalone Executable (.NET 10)

Prerequisites: [.NET 10 SDK](https://dotnet.microsoft.com/)

```powershell
# Clone the repository
git clone https://github.com/positive-vibezz1/bloons-td-4-clone.git
cd bloons-td-4-clone

# Build and publish single-file executable
cd desktop_app
dotnet publish -r win-x64 -c Release --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o ..\dist_app
```

The resulting `BloonsTD4.exe` in `dist_app` is ready to run immediately.

---

## 🐒 Towers & Defenses

| Tower | Cost | Specialty | Key Upgrades |
|---|---|---|---|
| **Dart Monkey** | $200 | Starting defense | Enhanced Eyesight (Camo), Spike-o-Pult, Super Fan Club |
| **Tack Shooter** | $250 | 8-directional burst | Blade Shooter, Ring of Fire (melts Lead) |
| **Sniper Monkey** | $350 | Infinite range hitscan | Full Metal Jacket (pops Lead), Deadly Precision, Semi-Auto |
| **Boomerang Monkey** | $380 | Curved arc trajectory | Sonic Boom, Glaive Ricochet (bounces across 40 bloons) |
| **Bomb Tower** | $400 | Explosive AOE | Cluster Bombs, Missile Launcher, MOAB Mauler (x10 blimp damage) |
| **Ice Tower** | $300 | Freeze wave | Viral Frost, Frostbite, Arctic Wind (massive slow aura) |
| **Glue Gunner** | $270 | Slows & dissolves | Stickier Glue (75% slow), Corrosive Glue, Bloon Dissolver |
| **Super Monkey** | $3200 | Extreme rapid fire | Laser Blasts, Plasma Blasts, Aztec Sun God |
| **Mortar Monkey** | $750 | Global artillery shell | The Big One, Burny Stuff, Signal Flare (Decamo) |
| **Banana Farm** | $850 | Cash generation | Banana Plantation, Banana Republic, Banana Bank |
| **Spike Factory** | $700 | Automatic track spikes | Bigger Stacks, White Hot Spikes (pops Lead), Spike Storm |
| **Monkey Buccaneer** | $500 | Water battleship | Cannon Ship, Grape Shot, Pirate Lord |

### Track Items (Placeable directly on track):
- **Road Spikes** ($30): Pops 10 bloons before depleting.
- **Exploding Pineapple** ($25): 3-second fuse detonates with massive AOE damage.

---

## 🎈 Bloon Tiers & Immunities

- **Red**: 1 layer, speed 1.0.
- **Blue**: 2 layers, speed 1.4.
- **Green**: 3 layers, speed 1.8.
- **Yellow**: 4 layers, speed 3.2 (fast!).
- **Pink**: 5 layers, speed 3.5 (extreme speed!).
- **Black**: 2 Pinks, immune to explosions.
- **White**: 2 Pinks, immune to freezing.
- **Lead**: 2 Blacks, immune to sharp darts (requires bombs, fire, plasma, or acid).
- **Zebra**: 1 Black + 1 White, immune to BOTH explosions and ice!
- **Rainbow**: 2 Zebras.
- **Ceramic**: 10 shell HP, fractures on hit, bursts into 2 Rainbows.
- **MOAB (Massive Ornary Air Blimp)**: 200 HP airship, bursts into 4 Ceramics.
- **BFB (Brutal Flying Behemoth)**: 700 HP boss airship, bursts into 4 MOABs.
- **Modifiers**:
  - **Camo**: Invisible to non-camo towers.
  - **Regrow**: Regenerates popped layers over time if not popped completely.

---

## 🗺️ Maps Included

1. **Monkey Lane (Beginner)**: Scenic winding S-curve dirt path through lush green grass with an upper-right duck pond.
2. **Desert Oasis (Intermediate)**: Golden desert sand dunes with ancient sandstone ruins and an oasis pool.
3. **Castle Moat (Advanced)**: Stone fortress courtyard surrounded by defensive water moats and drawbridges.

---

## 🔊 Audio Engine

Built using native procedural Web Audio API synthesis:
- Dynamic popping sounds with randomized pitch variance
- Deep low-frequency resonant explosion blasts
- Sci-fi laser beams & plasma discharges
- Crisp coin / cash collection chimes
- Melodic upgrade fanfare arpeggios
- Background ragtime marching theme loop (toggleable)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Bloons Tower Defense is originally a creation of Ninja Kiwi. This project is an open-source homage and recreation for educational and preservation purposes.
