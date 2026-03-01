# HUD Component Refactoring

The HUD components have been restructured to follow a strict atomic design hierarchy and simplified naming conventions.

## Architecture

### Template: TopActionBar
- **Location**: `src/app/core/hud/templates/TopActionBar.tsx`
- **Purpose**: The main layout container for the HUD.
- **Components**: Orchestrates `BoardSetup`, `TacticalSetup`, `ThemeSetup` organisms.

### Organisms
Logical groups of related molecules:
- `BoardSetup`: `ModeSelection` and `StyleSelection`.
- `TacticalSetup`: `TerrainSelection` and `UnitSelection`.
- `ThemeSetup`: `ThemeSelection`.

### Molecules
Granular interactive components:
- `ModeSelection`: Game mode selection (NS, EW, 4P, 2v2).
- `StyleSelection`: Tactical style presets.
- `TerrainSelection`: Lock/Unlock terrain selection.
- `UnitSelection`: Lock/Unlock unit selection.
- `ThemeSelection`: Dark mode and piece style toggles.
- `PlayTurn`: Turn indicator.
- `Pov`: Perspective and player controls.

## Key Changes
- Removed "Molecule" and "Organism" suffixes from all files and component names.
- Moved `ConsoleActionBar` to `TopActionBar` template.
- Split `MatchSetupMolecule` into single-responsibility molecules.
- Consolidated interactive elements into organisms for cleaner layouts.
- Updated all high-level screens (`CombatScreen`, `gamemaster`, `mmo`) to use the new template.
