# 🏛️ Pixels of the Past
### *Immersive 3D Cultural Heritage Engine & Historical Exploration Platform*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Rapier Physics](https://img.shields.io/badge/Rapier-WASM_Physics-orange)](https://rapier.rs/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Pixels of the Past** is a browser-native 3D historical simulation engine designed to preserve, reconstruct, and celebrate ancient Indian civilizational heritage. Operating entirely in modern web browsers via WebGL, Three.js, and WebAssembly physics with **zero downloads or plugins required**, the platform empowers users to physically traverse and interact with three foundational epochs of Indian history:

1. **🏺 Indus Valley / Harappan Civilization (c. 2600 BCE)**: Bronze Age urban planning, the bitumen-sealed Great Bath of Mohenjo-daro, citadel granaries, kiln-baked brick residential grids, and ancient steatite/bronze relics.
2. **🛕 Classical Gupta Dynasty (c. 375 CE)**: The Golden Age of Indian science, the rust-resistant Iron Pillar of Delhi, Dashavatara Vishnu sanctum at Deogarh, Nalanda Mahavihara University, and Dhamek Stupa of Sarnath.
3. **🕌 Mughal Empire (c. 1526 CE)**: Imperial Indo-Islamic architecture, pure Makrana white marble mausoleums (Taj Mahal), red sandstone fortresses (Agra Fort), Buland Darwaza of Fatehpur Sikri, and quadripartite Charbagh paradise gardens.
4. **⚡ Temporal Cyber Hub**: A futuristic portal plaza allowing seamless time-travel jumps across millennia, complete with physics jump ramps and test obstacles.

---

## 🌟 Key Features

- **🎮 Physics-Driven Third-Person Exploration**: Kinematic 3D player controller with responsive WASD movement, orbit camera controls, sprint multipliers, jump physics, ground raycasting, and fall-safe respawn mechanisms.
- **📡 Autonomous Proximity Sensor System**: Non-blocking Rapier ghost colliders embedded across all 12 historical monuments and 18 artifacts, triggering seamless audio-visual events upon player approach.
- **🎙️ Procedural Voice Chronicler Engine**: Asynchronous, multi-channel Web Audio manager equipped with voice deduplication, audio collision avoidance, and synchronized spoken chronicles generated from authentic archaeological archives.
- **📜 3D Billboarded Antique Plaque Displays**: Custom camera-facing 3D expedition signs styled with dark stone backings, gold filigree trim, and historical classification headers (c. BCE/CE dates, architectural typology).
- **🏆 Interactive Relic Discovery & Collection**: 18 collectible artifacts with dynamic proximity highlights (transitioning from antique bronze to radiant royal gold upon discovery), tracking discovery logs in real time.
- **☀️ Dynamic Environmental Atmospheres**: Real-time toggle between Golden Sunlight and Mystical Midnight, shifting directional sun cascades, star fields, and atmospheric fog shaders.

---

## 🏛️ Monuments & Inscription Directory

| Historical Epoch | Monument / Site | Architectural Identity | Dating & Chronology |
| :--- | :--- | :--- | :--- |
| **Harappan Era** | **The Great Bath** | Bitumen-Sealed Sacred Cleansing Pool | c. 2600 BCE |
| **Harappan Era** | **Citadel Granaries** | Ventilated State Grain Vaults | c. 2500 BCE |
| **Harappan Era** | **Lower Town Housing** | Grid-Planned Kiln-Baked Residential Grid | c. 2500 BCE |
| **Harappan Era** | **Excavation Treasury** | Sanctuary of Indus Bronzes & Seals | c. 2600–1900 BCE |
| **Gupta Golden Age** | **Iron Pillar of Delhi** | Garuda Standard of King Chandra | c. 400 CE |
| **Gupta Golden Age** | **Dashavatara Temple** | Panchayatana Vishnu Sanctum (Deogarh) | c. 500 CE |
| **Gupta Golden Age** | **Nalanda Mahavihara** | Monastic Buddhist University | c. 427 CE |
| **Gupta Golden Age** | **Dhamek Stupa** | Sacred Deer Park Cylindrical Stupa | c. 500 CE |
| **Mughal Realm** | **Taj Mahal** | Rauza-i-Munawwara White Marble Mausoleum | c. 1632 CE |
| **Mughal Realm** | **Humayun's Tomb** | Red Sandstone Imperial Necropolis | c. 1570 CE |
| **Mughal Realm** | **Agra Fort Ramparts** | Crimson Sandstone Bastions of Akbar | c. 1565 CE |
| **Mughal Realm** | **Fatehpur Sikri** | Buland Darwaza Monumental Victory Gate | c. 1573 CE |
| **Mughal Realm** | **Charbagh Gardens** | Quadripartite Paradise Fountains | c. 1526 CE |

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helpers & Text**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Physics**: [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) (Rapier.js WASM)
- **Audio & Speech**: HTML5 Web Audio API + Speech Synthesis (SAPI)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tooling**: [Vite](https://vitejs.dev/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Nikita000kumari/pixels-of-the-past.git

# Navigate to project folder
cd pixels-of-the-past

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
pixels-of-the-past/
├── public/
│   ├── audio/voice/           # 16 historical voice narrations (.wav)
│   ├── assets/images/         # Curated artifact relief & historical cards
│   └── models/                # 3D models and textures
├── src/
│   ├── components/
│   │   ├── Experience.jsx            # Master 3D canvas and lighting coordinator
│   │   ├── HarappaScene.jsx          # Indus Valley 3D citadel & monuments
│   │   ├── GuptaScene.jsx            # Gupta Empire temples & university
│   │   ├── MughalScene.jsx           # Mughal mausoleums, forts & gardens
│   │   ├── Ground.jsx                # Cyber temporal testing plaza
│   │   ├── PlayerController.jsx      # Rapier 3D kinematic avatar controller
│   │   ├── ThematicMonumentSign.jsx  # Billboarded antique stone & gold plaques
│   │   ├── UIOverlay.jsx             # Inscribed stone ticker, HUD & telemetry
│   │   └── ExplorationHub.jsx        # Era selection & expedition cards
│   ├── data/
│   │   ├── harappanArtifacts.js      # Relic data (positions, dates, lore)
│   │   ├── guptaArtifacts.js         # Gupta relic registry
│   │   ├── mughalArtifacts.js        # Mughal relic registry
│   │   └── voiceNarrations.js        # Archival narration chronicle scripts
│   ├── utils/
│   │   └── VoiceNarrator.js          # Asynchronous decoupled audio engine
│   ├── App.jsx                       # Root application component
│   └── main.jsx                      # DOM mount point
├── PIXELS_OF_THE_PAST_HACKATHON_DOCUMENTATION.docx # Hackathon whitepaper
├── package.json
└── vite.config.js
```

---

## 📄 Hackathon Documentation
Full architectural documentation, judging rubric alignments, and the judge pitch script are available in:
- 📄 `PIXELS_OF_THE_PAST_HACKATHON_DOCUMENTATION.docx`

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
