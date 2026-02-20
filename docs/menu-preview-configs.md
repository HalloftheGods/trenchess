# Menu Hover Previews

The Menu UI features an interactive and dynamic background Board Preview that reacts to the user's hovering over different Menu Cards. This is managed via the `PreviewConfig` state in `MenuContext` and visually rendered by the `BoardPreview` component. This allows us to dynamically engage, entertain, and educate the player as they navigate options.

## How It Works

1. **Hover State (`onMouseEnter`)**: When a user hovers over a `MenuCard`, it dispatches its specific `preview` prop to the global `MenuContext` via `setPreviewConfig(preview)`.
2. **Board Rendering**: The `BoardPreview` component listens to this live config and dynamically updates its layout, terrain, borders, and unit visibility.
3. **Reset State (`onMouseLeave`)**: When the user's cursor leaves the card, the configuration is gracefully cleared to a default standby state (which intelligently respects any actively `selectedBoard`).

## Preview Config Options

* **`mode`** (`GameMode | null`): Determines the board borders, quadrant styles, and base piece locations (e.g., `2p-ns`, `2p-ew`, `4p`, `2v2`).
* **`protocol`** (`string | null`): Sets the game setup ruleset/generation style:
  * `classic`: Standard piece placement.
  * `quick`: Randomized piece presence.
  * `terrainiffic`: Custom seed-based board with terrain.
  * `custom`: Displays the God Mode edit overlay.
* **`hideUnits`** (`boolean`): If true, units are hidden from the preview, spotlighting the ambient board layout and terrain.
* **`showIcons`** (`boolean`): If true, renders translucent terrain symbols (e.g., Tree, Mountain) over the terrain squares.
* **`forcedTerrain`** (`TerrainType | null`): Forces the generator to only populate one specific terrain type across the board (used for showcasing specific biomes or elemental affinities).

---

## Current Card Previews

### Menu Home
* **How to Play**: `mode: null`, `protocol: "terrainiffic"`, `showIcons: true`, `hideUnits: true`. (Showcases randomized terrain flow).
* **Enter The Trenchess**: `mode: "2p-ns"`, `hideUnits: true`. also hide terrain, show only the board..

### Menu Local (Player Count)
* **One Player**: `mode: "2p-ns"`, `hideUnits: true`.
* **Two Players**: `mode: "2p-ns"`, `hideUnits: true`.
* **Three Players**: `mode: "4p"`, `hideUnits: true`.
* **Four Players**: `mode: "2v2"`, `hideUnits: true`.

### Menu Setup (Board Selection)
* **North vs South**: `mode: "2p-ns"`, `hideUnits: true`.
* **West vs East**: `mode: "2p-ew"`, `hideUnits: true`.
* **Capture the Army** (4P): `mode: "4p"`, `hideUnits: true`.
* **Capture the World** (2v2): `mode: "2v2"`, `hideUnits: true`.

### Menu Setup (Preset Selection)
* **π Pi (Classic)**: `mode: selectedBoard`, `protocol: "classic"`, `hideUnits: true`.
* **χ Chi (Terrainiffic)**: `mode: selectedBoard`, `protocol: "terrainiffic"`, `showIcons: true`, `hideUnits: true`.
* **α Alpha (Quick)**: `mode: selectedBoard`, `protocol: "quick"`, `hideUnits: true`.
* **Ω Omega (Custom)**: `mode: selectedBoard`, `protocol: "custom"`, `hideUnits: true`.

### Menu Chess (Learn Pages)
* **The Divided**: `mode: "2p-ns"`, `hideUnits: true`.
* **The Evolved**: `mode: "2p-ew"`, `hideUnits: true`.
* **The Endgame**: `mode: "4p"`, `hideUnits: true`.
* **Individual Pieces**: Shows specific board modes with hidden units to provide ambient background color changes upon hover.
