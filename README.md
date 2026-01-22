# CCS (Card Combat Svelte) — WIP

Learning project: a **turn-based card game prototype** (in the spirit of **Hearthstone** / **Legends of Runeterra**), with a heavy emphasis on **TypeScript**, **game logic design**, and **UX/UI polish**.

This is intentionally experimental and evolving as I learn more about how to structure:
- cards and card effects
- damage / HP rules
- turn / round flow
- clean, type-safe APIs between “game engine” and UI

## Technologies / Learning

- **Svelte 5** + **Vite**
- **TypeScript-heavy** codebase (types-first approach for game state + effects)
- **UI/UX iteration**: responsive layout, interaction design, theming (dark mode)
- **Game engine design**: separating core rules (`src/core/`) from UI (`src/components/`)
- **Logging / debugging** with **tslog**
- First project where I’m leaning on **Cursor / AI** to move faster and explore options

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

## Project structure (high level)

- `src/core/`: game rules + types (deck, cards, players, round flow)
- `src/components/`: Svelte UI components (hand, card display, controls)
- `src/store/`: Svelte stores for UI/game state wiring

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
