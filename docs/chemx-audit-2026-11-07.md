# Chemical X audit: Trenchess, 2026-11-07

Branch: `glowup/hotg-makeover`. Tool: `chemx v26.10.29-360`, `chemx audit --all-packages --json --full` (scope `src`, stage strict). Ruleset: 11 pillars.

Health score: **93 (A, Highly Modular)**. Files scanned: 435. Gate: **fail** (basis: severity).

## Counts by severity

| Severity | Audit violations | Added by build/test run | Total |
|---|---|---|---|
| CRITICAL | 90 | 1 | 91 |
| HIGH | 100 | 3 | 103 |
| MEDIUM | 355 | 0 | 355 |
| LOW | 335 | 1 | 336 |
| **All** | **880** | **5** | **885** |

The audit scans source structure only. It does not run the compiler or the tests, so the build failure, three failing tests and one empty duplicate file were found by running `npm run build` and `npx vitest run` and are listed as extra findings.

## Extra findings from build and test (not in the audit)

| ID | Task | Severity | Finding | Evidence |
|---|---|---|---|---|
| X1 | #1 | CRITICAL | `npm run build` fails: TS1261 file name casing conflict | `src/app/core/screens/PreGameScreen.tsx` (0 bytes, tracked, no importers) vs `PregameScreen.tsx` (111 lines, real component) |
| X2 | #2 | HIGH | Test fails: `PlaySetupView > should call onStartGame when a preset is selected in step 2` | `__tests__/PlaySetupView.test.tsx:122`, `onStartGame` called 0 times |
| X3 | #3 | HIGH | Test fails: `Bulk Setup Reroll Logic > should regenerate units on repeated randomizeUnits calls` | `__tests__/Reroll.test.ts:90` |
| X4 | #4 | HIGH | Test fails: `Game Flow Integration > should complete a full setup to combat flow in 2p-ns mode` | `__tests__/integration/GameFlow.test.tsx:144`, timed out at 5000 ms |
| X5 | #5 | LOW | Three tests skipped; livestream test logs `ECONNREFUSED 127.0.0.1:3001` | `pieceStats`, `simulation`, `livestream` tests |

## Audit findings, ranked by severity

Each row is one rule. Locations are the first five of N; the full list is in the audit JSON.

### CRITICAL (90)

| Rule | Count | Files | Pillar | First locations | Triage |
|---|---|---|---|---|---|
| `CONTROL_FLOW_NESTED_TERNARY` | 88 | 47 | Control Flow & Boolean Logic | `app/client/dev/cli.tsx:50`, `app/client/learn/manual.tsx:53`, `app/client/play/lobby.tsx:51`, `app/client/play/lobby.tsx:176`, `app/client/play/lobby.tsx:183` | #12 refactor debt |
| `SECURITY_RAW_HTML_INJECTION` | 2 | 2 | Security & Content Safety | `shared/components/atoms/LoadingScreen.tsx:119`, `shared/components/molecules/LoadingFallback.tsx:99` | #6 (false positive) |

### HIGH (100)

| Rule | Count | Files | Pillar | First locations | Triage |
|---|---|---|---|---|---|
| `COMPLEXITY_CYCLOMATIC_HIGH` | 47 | 38 | Control Flow & Boolean Logic | `app/client/console/game/index.tsx:26`, `app/client/play/setup.tsx:34`, `app/client/tutorial/index.tsx:37`, `app/core/components/board/atoms/CellPlacementPreview.tsx:27`, `app/core/components/board/atoms/CellUnitRenderer.tsx:30` | #14 refactor debt |
| `HOOK_STATE_SATURATION` | 22 | 22 | Reactivity & Composable Contracts | `app/client/console/game/index.tsx:26`, `app/client/console/index.tsx:8`, `app/client/console/mmo.tsx:20`, `app/client/play/lobby.tsx:19`, `app/client/scoreboard/index.tsx:43` | #15 refactor debt |
| `HOOK_SATURATION` | 18 | 18 | Reactivity & Composable Contracts | `app/client/console/game/index.tsx:26`, `app/client/console/index.tsx:8`, `app/client/play/lobby.tsx:19`, `app/client/scoreboard/index.tsx:43`, `app/client/tutorial/index.tsx:37` | #15 refactor debt |
| `HOOK_SHAPE_CONTRACT` | 13 | 4 | Reactivity & Composable Contracts | `app/core/components/board/organisms/useBoardInteractions.ts:27`, `app/core/components/board/organisms/useBoardInteractions.ts:28`, `app/core/components/board/organisms/useBoardInteractions.ts:29`, `shared/hooks/controllers/useSetupActions.ts:164`, `shared/hooks/controllers/useSetupActions.ts:166` | #16 refactor debt |

### MEDIUM (355)

| Rule | Count | Files | Pillar | First locations | Triage |
|---|---|---|---|---|---|
| `CONTROL_FLOW_INLINE_BOOLEAN` | 223 | 78 | Control Flow & Boolean Logic | `app/client/console/game/index.tsx:43`, `app/client/console/game/index.tsx:58`, `app/client/dev/components/ProtocolEditor.tsx:152`, `app/client/learn/chess/detail.tsx:62`, `app/client/play/lobby.tsx:28` | #13 refactor debt |
| `RAW_INLINE_STYLE` | 27 | 22 | Design System & Styling Hygiene | `app/client/stats/molecules/StatBar.tsx:14`, `app/client/stats/organisms/CombatStatBox.tsx:258`, `app/client/tutorial/components/molecules/MiniMovePreview.tsx:18`, `app/core/components/board/atoms/CellUnitRenderer.tsx:95`, `app/core/components/board/atoms/CellUnitRenderer.tsx:102` | #9 glowup |
| `PROP_SURFACE_BLOAT` | 24 | 24 | Type Architecture & Data Integrity | `app/client/tutorial/components/atoms/TerrainBadge.tsx:18`, `app/client/tutorial/components/organisms/SimulationPreview.tsx:20`, `app/client/tutorial/components/organisms/UnitPortfolio.tsx:37`, `app/core/components/board/atoms/CellUnitRenderer.tsx:30`, `app/core/components/board/molecules/BoardCell.tsx:39` | #17 refactor debt |
| `A11Y_CLICKABLE_NON_SEMANTIC` | 20 | 18 | Accessibility & Semantic Integrity | `app/client/scoreboard/index.tsx:183`, `app/client/tutorial/components/atoms/TerrainBadge.tsx:32`, `app/core/components/debug/molecules/DebugPlayerSection.tsx:86`, `app/core/components/hud/molecules/ReadyUpPanel.tsx:150`, `app/core/components/intel/organisms/ChessCardDetail.tsx:57` | #10 glowup |
| `TYPE_COLOCATION` | 19 | 9 | Type Architecture & Data Integrity | `app/client/dev/components/ProtocolEditor.tsx:37`, `app/client/dev/components/ProtocolEditor.tsx:96`, `app/core/components/board/atoms/TerrainOverlay.tsx:17`, `app/core/mechanics/moves/bulkSetup.ts:30`, `app/core/mechanics/moves/bulkSetup.ts:138` | #17 refactor debt |
| `CONTROL_FLOW_DISPATCH_SWITCH` | 15 | 10 | Control Flow & Boolean Logic | `app/client/console/game/index.tsx:78`, `app/client/learn/chess/detail.tsx:83`, `app/client/learn/chess/detail.tsx:102`, `app/client/scoreboard/index.tsx:73`, `app/core/bot/stockfish.ts:208` | #18 refactor debt |
| `HOOK_RETURN_OVERLOAD` | 11 | 11 | Reactivity & Composable Contracts | `shared/hooks/controllers/usePlacementManager.ts:67`, `shared/hooks/controllers/useSetupActions.ts:161`, `shared/hooks/engine/useBuilder.ts:256`, `shared/hooks/engine/useEngineDerivations.ts:34`, `shared/hooks/engine/useEngineMoves.ts:6` | #16 refactor debt |
| `AI_SLOP_SHALLOW_CATCH` | 8 | 7 | AI Slop & Code Authenticity | `app/client/tutorial/index.tsx:50`, `app/core/bot/stockfish.ts:78`, `app/core/components/hud/organisms/SeedLibrary.tsx:147`, `shared/components/templates/AppLayout.tsx:25`, `shared/hooks/bot/useAiDecision.ts:60` | #7 fix |
| `LINE_BUDGET_MOLECULE` | 3 | 3 | Line Budgets & Monolith Decomposition | `app/core/components/hud/molecules/ReadyUpPanel.tsx:1`, `shared/components/molecules/RouteCard.tsx:1`, `shared/components/molecules/UnitMovePreview.tsx:1` | #19 refactor debt |
| `LINE_BUDGET_FILE` | 3 | 3 | Line Budgets & Monolith Decomposition | `app/core/components/intel/organisms/IntelPanel.tsx:1`, `app/core/setup/formations.ts:1`, `app/core/setup/seeds/strategic.ts:1` | #19 refactor debt |
| `AI_SLOP_ECHO_COMMENT` | 2 | 2 | AI Slop & Code Authenticity | `app/core/mechanics/movement/index.ts:132`, `shared/components/organisms/Header.tsx:111` | #21 refactor debt |

### LOW (335)

| Rule | Count | Files | Pillar | First locations | Triage |
|---|---|---|---|---|---|
| `CONTROL_FLOW_INLINE_BOOLEAN` | 234 | 84 | Control Flow & Boolean Logic | `app/client/console/design/zen.tsx:36`, `app/client/console/game/play.tsx:33`, `app/client/console/game/play.tsx:35`, `app/client/console/index.tsx:17`, `app/client/console/index.tsx:32` | #13 refactor debt |
| `TYPOGRAPHY_EM_DASH` | 50 | 39 | Global Hygiene & Typography | `app/client/console/game/chi.tsx:4`, `app/client/console/game/index.tsx:21`, `app/client/console/game/omega.tsx:4`, `app/client/console/game/pi.tsx:4`, `app/client/console/game/play.tsx:17` | #11 glowup |
| `UNGUARDED_LOGGING` | 35 | 23 | Global Hygiene & Typography | `app/client/console/game/index.tsx:72`, `app/client/console/game/index.tsx:76`, `app/core/bot/stockfish.ts:52`, `app/core/bot/stockfish.ts:82`, `app/core/bot/stockfish.ts:112` | #20 refactor debt |
| `TIMER_DISCIPLINE` | 10 | 6 | Timers & Macro-Task Discipline | `app/core/components/debug/molecules/DebugMultiplayerSection.tsx:37`, `app/core/components/hud/atoms/GameStartOverlay.tsx:28`, `app/core/components/hud/organisms/SeedLibrary.tsx:170`, `app/core/components/hud/organisms/SeedLibrary.tsx:175`, `app/core/components/terminal/organisms/TerminalOverlay.tsx:43` | #8 fix |
| `AI_SLOP_REDUNDANT_PASSTHROUGH` | 5 | 3 | AI Slop & Code Authenticity | `app/core/bot/evaluation.ts:57`, `app/core/bot/evaluation.ts:72`, `app/core/bot/evaluation.ts:142`, `app/core/mechanics/movement/index.ts:139`, `shared/context/GameContext.tsx:214` | #21 refactor debt |
| `DATA_FLOW_OPTIONAL_CHAINING_CHURN` | 1 | 1 | Type Architecture & Data Integrity | `app/core/components/debug/molecules/DebugMultiplayerSection.tsx:86` | #21 refactor debt |

## Verdicts the severity column does not show

- **SECURITY_RAW_HTML_INJECTION (2 CRITICAL) is a false positive.** `LoadingScreen.tsx:119` and `LoadingFallback.tsx:99` pass a fixed keyframes CSS template string to `dangerouslySetInnerHTML`. No prop, state or external value reaches it. Task #6 records this; no code change needed for safety.
- **CONTROL_FLOW_NESTED_TERNARY (88 CRITICAL) is a readability rule, not a defect.** The audit grades it CRITICAL; nothing is broken. It is tracked as refactor debt (#12).
- **The audit has no rule for the build break or the failing tests.** X1 to X4 are the real blockers and outrank every audit CRITICAL.

## Baseline before any fix (2026-11-07, branch glowup/hotg-makeover at 7485c1d)

- `npm run build`: **FAIL**, exit 2, one error: TS1261 casing conflict (X1).
- `npx vitest run`: **3 failed, 75 passed, 3 skipped (81 tests)**; **3 failed, 11 passed, 3 skipped (17 files)**.

## Scope and limits

- The audit reported scope `src` (435 files). The `server/` package (`battle-chess-server`) was listed by the monorepo guard; this run did not confirm that its files were scanned separately, so treat `server/` as unaudited.
- Counts are per violation, not per task. Tasks are per rule (21 tasks), not per violation (880), to keep the board usable.
- Task labels: chemx task rows have no label field. Labels are carried in the title (`[glowup]`) and in the description.
- Raw audit JSON for this run: `/tmp/bc-base/audit.json` (not committed).
