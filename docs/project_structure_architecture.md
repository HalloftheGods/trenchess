# Trenchess Project Architecture

## Technology Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (Vanilla CSS fallback where needed)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **Game Engine**: `boardgame.io` (running strictly client-side for state management)
- **Multiplayer**: Socket.io (Custom implementation, migrating towards boardgame.io server)
- **AI**: Fairy-Stockfish NNUE via WASM

## Directory Structure

### `src/core`
The "Brain" of the game. Contains all game logic isolated from the UI.
- **`logic/`**: Game rules, movement validation, and state transitions.
- **`phases/`**: boardgame.io phase configurations (e.g., setup, play).
- **`setup/`**: Board initialization and unit placement logic.
- **`ai/`**: Stockfish integration and AI move generation.
- **`configs/`**: Static data for `PIECES`, `TERRAIN_TYPES`, and default configurations.

### `src/client`
The "Face" of the game. Contains all route-specific views and their local UI components.
- **`home/`**: Main entry point and menu system.
- **`game/`**: The core board rendering and game interface.
- **`play/`**: Lobby, local play setup, and matchmaking.
- **`learn/`**: Interactive guides, tutorials, and manual.
- **`stats/`, `rules/`, `scoreboard/`**: Auxiliary informational views.

### `src/shared`
Global resources and Atomic Design components.
- **`components/`**: UI building blocks:
  - **Atoms**: Single elements (buttons, icons, text).
  - **Molecules**: Groups of atoms (cards, badges, small widgets).
  - **Organisms**: Complex groups (header, sidebar, modals).
  - **Templates**: Page layouts and structural grids.
- **`hooks/`**: Bridge hooks (e.g., `useGameState`, `useGameCore`) that connect UI to `core` logic.
- **`utils/`**: Deterministic helpers and math functions.
- **`assets/`**: Images, svgs, and static media.

### `server/`
Standalone Node.js/TypeScript server for multiplayer room management and relaying state.

### `docs/`
Documentation library using the `category_folder_file.md` naming convention.

## Design Patterns
1. **Atomic Design**: Clear separation of UI complexity from Atoms to Templates.
2. **Commentless Code**: Using named booleans and descriptive function names (Adjective-Noun, Verb-Noun) to tell a story without comments.
3. **SSoT (Single Source of Truth)**: Relying directly on boardgame.io `G` and `ctx` for game state.
4. **Tailwind First**: Global styles managed via utilities to ensure consistency.
