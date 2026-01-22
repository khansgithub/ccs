# CCS — WIP

Building a **turn-based card game** (similar to **Hearthstone** / **Legends of Runeterra**). The project started as a Typescript project, but currently considering moving to Godot.

Project is WIP and primarily for learning and experimentation.

## Technologies / Learning
- **Svelte**
- **TypeScript**
  - Game logic is designed in TS, with emphasis on strong typing
  - Designing systems which allow flexability for different card types and mechanics
- **UI/UX design** through using only vanilla CSS to focus more on UX elements of the interface

## Progress

- **Basic deck + dealing flow**
  - Randomized deck generation and card dealing to two players
- **Card system + stats/effects**
  - Cards have typed stats (`damage`, `def`, `dodge`, `stun`) applied to self/opponent
- **Round execution + win conditions**
  - Pick cards, resolve effects, update HP, detect win/draw/continue states
- **Playable UI prototype**
  - “Play round” button, hand UI, basic board readout, and a **dark mode** toggle
- **Core/UI separation**
  - Core logic lives in `src/core/*` and the Svelte app uses it from `src/App.svelte`
 UI/game state wiring

## Running locally

```bash
npm install
npm run dev
```

Vite will print the local URL in your terminal (typically `http://localhost:5173`).

## Type-checking

```bash
npm run check
```

## Build / Preview

```bash
npm run build
npm run preview
```
