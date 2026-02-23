# Battle Chess Architecture

## Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Routing**: React Router DOM v7
- **Game Engine**: `boardgame.io` (running purely Client-side)
- **Networking**: Custom Socket.io server and client hooks
- **AI/Chess Engine**: Fairy-Stockfish WASM (`fairy-stockfish-nnue.wasm`)

## Codebase Structure
The application is structured into the following main directories:
- `src/app/`: Core React application code.
  - `context/`: Application-wide React Contexts (`RouteContext`).
  - `routes/`: Page-level components and lazy-loaded route views (e.g., `game`, `home`, `learn`, `scoreboard`, `library`).
- `src/engine/`: Game logic and rules domain.
  - `logic/`: Core game state definitions, movement validation, terrain rules, and the boardgame.io `TrenchGame` definition (`Game.ts`).
  - `setup/`: Initial board layout and deployment logic.
  - `ai/`: AI opponents and stockfish logic handling.
  - `configs/`: Constants and static data for units (`PIECES`) and terrain (`TERRAIN_TYPES`).
- `src/shared/`: Shared utilities, hooks, and presentation components.
  - `components/`: Atomic UI components (Atoms, Molecules, Organisms).
  - `hooks/`: Domain hooks like `useGameState`, `useMultiplayer`, `useGameCore`. These hooks bridge the React UI and the underlying game logic/networking.

## Roadmap & Areas for Improvement
- **Refactoring Game State Sync**: Currently, the application uses a custom Socket.io implementation (`useMultiplayer.tsx`) alongside `boardgame.io`. A major roadmap item is migrating to `boardgame.io`'s native Multiplayer Server (`@boardgame.io/server`) and its built-in Lobby API to reduce race conditions and simplify the networking architecture.
- **Atomic Design Principles**: Ongoing refactoring of legacy monolithic components into strict Atoms, Molecules, and Organisms.
- **Enhanced AI**: Leveraging the integrated `fairy-stockfish-nnue.wasm` for more robust, scalable single-player experiences instead of simple heuristic bots.
