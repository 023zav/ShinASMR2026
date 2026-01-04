# ShinASMR 🚄

A relaxing isometric Shinkansen traffic simulator featuring Japan's famous bullet trains.

![ShinASMR Preview](./docs/preview.png)

## Features

- 🗾 **Stylized Japan Map** - Simplified isometric view of Japan's coastline
- 🚅 **Timetable Simulation** - Watch Shinkansen trains follow realistic schedules
- 🎯 **Interactive** - Click/tap trains and stations for details
- 📷 **Follow Mode** - Camera smoothly tracks your selected train
- 🔊 **ASMR Audio** - Subtle ambient sounds and train pass-by effects
- ⏱️ **Time Control** - Pause, play, and scrub through the simulation
- 📱 **Responsive** - Works on desktop and mobile
- 📦 **PWA** - Install as an app on your device

## Tech Stack

- **Framework**: React 18 + TypeScript
- **3D Rendering**: Three.js via React Three Fiber
- **State Management**: Zustand
- **Internationalization**: i18next
- **Audio**: Howler.js
- **Build Tool**: Vite
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Validate data and precompute derived data
npm run validate
npm run precompute

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
shinasmr/
├── public/
│   ├── audio/          # Audio assets
│   └── favicon.svg
├── scripts/
│   ├── validate-data.ts    # Data validation
│   └── precompute.ts       # Derived data generation
├── src/
│   ├── components/     # React + R3F components
│   ├── data/           # JSON data + schemas
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Translations
│   ├── store/          # Zustand state
│   └── utils/          # Helper functions
└── vercel.json         # Deployment config
```

## Data Sources

- **Map Silhouette**: Inspired by OpenStreetMap © OpenStreetMap contributors
- **Timetable**: Simulated/approximate (not real-time)

## MVP Scope

- Tokaido Shinkansen line only (Tokyo → Shin-Osaka)
- 6 stations: Tokyo, Shinagawa, Shin-Yokohama, Nagoya, Kyoto, Shin-Osaka
- 8 train services across the simulated day
- 3 train types with distinct liveries

## Roadmap

- [ ] Add more Shinkansen lines (Sanyo, Tohoku, etc.)
- [ ] Real timetable data integration
- [ ] Day/night cycle
- [ ] Weather effects
- [ ] Station announcements (optional)
- [ ] More detailed 3D models

## Contributing

Contributions are welcome! Please open an issue first to discuss changes.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Disclaimer

This is a relaxing simulation for entertainment purposes. Train positions are NOT real-time and do NOT reflect actual JR operations. Not affiliated with JR or any railway company.

---

Made with ❤️ for train enthusiasts everywhere
