# Master Protocol Interface: Console Commands

The Trenchess Terminal (Master Protocol Interface) provides a powerful command-line interface for direct engine control, board manipulation, and navigation.

## Usage
Press the backtick key (`` ` ``) to toggle the terminal overlay. Commands are case-insensitive and follow the pattern:
`[command] [arguments...]`

---

## Game Management

### `play <style>`
Starts a new game session with a specific playstyle.
- **Styles**: `alpha`, `battle`, `pi`, `chi`, `omega`, `zen`, `none`.
- **Note**: Using `none` clears the current engine mode.

### `start`
Transitions the game from the setup phase (MENU or GAMEMASTER) to the active gameplay phase (MAIN).

### `init <mode> [preset]`
Initializes the game engine with a specific player configuration and optional board layout.
- **Modes**: `2p-ns` (2 Player North-South), `2p-ew` (2 Player East-West), `4p` (4 Player).
- **Presets**: Optional layout string (e.g., `zen-garden`).

### `seed <seed>`
Generates a deterministic board and setup from a provided seed string. Useful for competitive play or debugging.

### `status`
Displays the current engine state, including:
- **Phase**: Current game phase (MENU, MAIN, etc.)
- **Turn**: Current active player ID.
- **Mode**: Active game mode.

### `forfeit [pid]`
Signals a player's resignation. If `pid` is omitted, the local player forfeits.

### `ready [pid]`
Marks a player as ready to proceed to the next phase. If `pid` is omitted, the local player is marked ready.

---

## Engine Control

### `mode <type>`
Manually overrides the engine's game mode (e.g., `2p-ns`, `4p`).

### `player <pid> <type>`
Changes the controller type for a specific player slot.
- **PIDs**: `red`, `blue`, `green`, `yellow`.
- **Types**: `human`, `ai` (or `computer`).

### `board <layout>`
Applies a global layout or transformation to the board.
- **Layouts**:
  - `omega`: Resets to the advanced Omega layout.
  - `pi`: Sets the classical Pi formation.
  - `chi`: Applies the Zen-style Chi layout.
  - `random`: Randomizes both units and terrain.
  - `elemental`: Generates terrain based on elemental clusters.
  - `mirror`: Mirrors the current board state.
  - `clear`: Wipes all units and terrain from the board.

### `turn <pid>`
Forces the active turn to the specified player ID.

### `phase <name>`
Forces the engine into a specific phase (e.g., `MAIN`, `MENU`, `GAMEMASTER`).

---

## In-Game Actions

### `move <from> <to>`
Executes a piece movement using algebraic coordinates.
- **Example**: `move E2 E4`

### `select <coord>`
Triggers a click/selection event on the specified coordinate.
- **Example**: `select A1`

### `unit <type>`
Selects a unit type for the placement buffer.
- **Types**: `pawn`, `knight`, `bishop`, `rook`, `queen`, `king`.

### `terrain <type>`
Selects a terrain type for the placement buffer.
- **Types**: `flat`, `forests`, `swamps`, `mountains`, `desert`.

---

## Navigation

### `mmo`
Quick-jump to the Massively Multiplayer Online environment.

### `zen`
Quick-jump to the Zen Garden design mode.

### `master`
Opens the Master Protocol rule set and documentation overlay.

### `goto <path>`
Navigates the application to a specific internal route (e.g., `goto /console/mmo`).

---

## Utility

### `clear`
Wipes the current terminal session history.

### `exit`
Closes the terminal interface.
