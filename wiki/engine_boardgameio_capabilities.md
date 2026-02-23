# boardgame.io Capabilities & Possibilities

Our app uses `boardgame.io` as the core engine for game state management and turn-based logic. This document outlines what it currently handles and what features we can leverage in the future.

## Current Implementation

Currently, `boardgame.io` is responsible for:
- **Game State (`G`)**: Managing the board, terrain, inventories, and captured pieces.
- **Moves**: Atomic actions like `movePiece`, `placePiece`, and `placeTerrain` that modify the state.
- **Phases**: Transitioning between the `setup` phase (deployment) and the `play` phase.
- **Turn Management**: Handling whose turn it is and enforcing move order.
- **Victory Conditions**: Defining when the game ends (e.g., only one commander left).
- **Setup Data**: "Priming" the game with initial configurations (mode, board layout).

## Untapped Capabilities

`boardgame.io` offers several advanced features that we are not yet fully utilizing:

### 1. Secret State & Fog of War
- **Feature**: `G.secret` and `playerView`.
- **Possibility**: We could hide opponent pieces or terrain in certain modes until they are within range, or hide the opponent's "hand" of pieces during setup.

### 2. Time Travel (Undo/Redo)
- **Feature**: Built-in `undo` and `redo` moves.
- **Possibility**: Allow players to experiment with moves during their turn and undo them before "committing" (ending their turn).

### 3. Lobby & Matchmaking API
- **Feature**: `Lobby` component and API.
- **Possibility**: Instead of our custom Socket.io sync for menus, we could use the built-in Lobby API for room creation, joining, and player assignment.
- **Technical Detail**: The Lobby API uses **HTTP (REST)** for operations like creating matches or viewing lists. This is more efficient as it doesn't require a persistent connection until the game actually starts. Once in a game, `boardgame.io` switches to **WebSockets** (via Socket.io) for high-frequency state updates.

### 4. AI & Bots
- **Feature**: `AI` support (Step, MCTS).
- **Possibility**: We are currently using a custom computer opponent, but we could integrate `boardgame.io` AI to simulate games for balance testing or provide built-in bots.

### 5. Persistence
- **Feature**: Database connectors (MongoDB, Postgres, etc.).
- **Possibility**: Automatically save games so players can resume them later if they disconnect or refresh the page.

### 6. Spectators
- **Feature**: `spectator` role.
- **Possibility**: Allow users to join a room as a spectator to watch high-stakes matches without being assigned a player ID.

### 7. Game Logs & Replay
- **Feature**: `log` in the state.
- **Possibility**: Export a full replay of the game for players to review or share.

## Discussion Points

1. **Strategic Fog of War**: Should we move towards a "Secret State" approach for more hardcore modes?
2. **Simplified Multiplayer**: Does migrating more of the "Menu Sync" to the BGIO Lobby API make sense to reduce maintenance on our custom Socket logic?
3. **Commit Phase**: Should we implement an "End Turn" button to allow Undos during the turn?
