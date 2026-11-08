# Pregame Setup Phase

The pregame setup phase handles terrain and chessmen placement before combat begins.

## Route

`/play/:playMode/:players/pregame?preset=omega|chi`

## Architecture

### MVC Flow

```
View (pregame.tsx)
  → derives preset, mode, playerConfig from URL
  → wraps in MatchStateProvider + MatchHUDProvider

Controller (usePregameSetup)
  → auto-initializes match via initGameWithPreset
  → exposes isTerrainStageAvailable, isPiecesStageAvailable
  → delegates to existing useMatchState

Screen (PregameScreen.tsx)
  → composes PregameLayout with Header, DeploymentPanel, ConnectedBoard
  → passes isTerrainStageAvailable to DeploymentPanel

Layout (PregameLayout.tsx)
  → LayoutShell + ResponsiveGrid (sidebar + board)
```

### Presets

| Preset | Terrain Stage | Pieces Stage | Engine Preset | Initial Setup Mode |
|--------|--------------|--------------|---------------|--------------------|
| omega  | Manual       | Manual       | "custom"      | "terrain"          |
| chi    | Auto-applied | Manual       | "terrainiffic"| "pieces"           |

### Key Files

| File | Role |
|------|------|
| `src/app/client/play/pregame.tsx` | Route View — URL param parsing, provider wrapping |
| `src/app/core/screens/PregameScreen.tsx` | Screen — composes layout with components |
| `src/app/core/blueprints/layouts/PregameLayout.tsx` | Layout template — sidebar + board grid |
| `src/shared/hooks/controllers/usePregameSetup.ts` | Controller — init, stage availability |

### DeploymentPanel Integration

The `DeploymentPanel` organism accepts an `isTerrainStageAvailable` prop (defaults `true`):
- When `true`: shows full SegmentedControl (Trench/Chess tabs)
- When `false`: shows a static "Chess" header with piece count, hides terrain palette

### Navigation

From `PlaySetupView` (step 2 preset selection):
- "Custom" (Omega) → navigates to `/play/:playMode/:players/pregame?preset=omega`
- "Terrainiffic" (Chi) → navigates to `/play/:playMode/:players/pregame?preset=chi`
- "Classic" (Pi) / "Quick" (Alpha) → existing auto-start behavior unchanged
