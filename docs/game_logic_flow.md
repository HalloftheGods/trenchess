# Game Flow and State Management

## The Dual-State Architecture
Our game state is currently managed by two overlapping systems working in parallel:
1. **boardgame.io**: Defines the rigorous rules of the game in `src/app/routes/game/Game.ts` (the `TrenchGame` object). It validates unit placements, legal moves, manages turns, captures units, and resolves win conditions (`endIf`).
2. **Local React State & Custom Sockets**: Custom hooks like `useGameState.tsx` and `useGameCore.tsx` maintain mirrored React state variables (like `board`, `inventory`, `terrain`). `useMultiplayer.tsx` manages a custom socket connection to sync these variables across clients manually.

## Phase Flow
1. **Menu Phase (`menu`)**: Players select the game mode and presets. The host uses the custom socket to broadcast the room selection via `"menu_sync"`.
2. **Setup Phase (`setup`)**: Players deploy units onto their allowed territory. During this phase, `boardgame.io` core state syncing is dynamically ignored. Instead, clients send their respective partial setups using a custom `"setup_update"` event over the socket network, and local state merges the incoming territory updates.
3. **Play Phase (`play`)**: The game fully transitions to relying on `boardgame.io`. In `useGameState.tsx`, the client instance is destroyed and re-created to "lock in" the initial layout. Once started, local moves are executed on the `boardgame.io` client (`client.moves.movePiece`) AND simultaneously broadcast via the socket (`sendMove`) so the opponent can manually execute it locally.

## What We're Doing Wrong (Identified Anti-Patterns)
1. **Reinventing the Wheel (Custom Sockets)**: `boardgame.io` has highly robust networking via `boardgame.io/server`. By ignoring it and using our own `Socket.io` hooks, we bypass built-in conflict resolution, lock out native undo/redo state sync, and miss out on secure server-side validation.
2. **State Duplication**: We deeply mirror the entire game state (`board`, `terrain`, `inventory`) into generic React state variables (`useState` in `useGameCore`). Ideally, the UI should subscribe directly to `boardgame.io`'s `G` state and render directly from the source of truth, avoiding race conditions in `useEffect`s.
3. **Client-Side Trust**: By relying on the client to broadcast moves to one another (`receive_move` -> `executeMove(..., true)`), our architecture is effectively peer-to-peer over a dumb relay. A malicious client could send invalid moves. The server should be running the `boardgame.io` game logic to act as the authoritative source.
4. **Thrashing the Client Instance**: In `useGameState.tsx`, there are patterns that call `clientRef.current.stop()` and re-instantiate `Client({...})` when the phase changes or attributes change. `boardgame.io` clients are designed to be long-lived singletons tied to an ongoing match.

## Path Forward & Improvements
- **Migrate to native `boardgame.io` multiplayer**: Deploy an official `boardgame.io` Node server to authoritatively handle game logic.
- **Use standard state subscriptions**: Adopt the built-in subscription model rather than manually sinking `G` variables into duplicated React state.
- **Adopt the Lobby API**: Use the official HTTP Lobby API to replace our custom socket matchmaker. This will give the app free features like spectator mode, metadata matching, and connection recovery.
