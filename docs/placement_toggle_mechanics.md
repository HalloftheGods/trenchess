# Placement Toggle Mechanics

In the Genesis and Main phases, players can place terrain and units on the board. To improve the user experience and provide a more intuitive interaction, a "toggle" mechanic has been implemented.

## Behavior
When a player attempts to place an item (terrain or unit) on a square that already contains an identical item belonging to them, the item is removed instead of being replaced or swapped.

### Terrain Toggle
- **Action**: Clicking a square with a terrain type (e.g., Forests) while having that same terrain type selected.
- **Result**: The terrain is removed from the square, the square returns to `FLAT`, and the terrain is returned to the player's inventory.
- **Consistency**: This applies to all special terrain types (Forests, Swamps, Mountains, etc.).

### Unit Toggle
- **Action**: Clicking a square with a unit type (e.g., Pawn) while having that same unit type selected.
- **Result**: The unit is removed from the square and returned to the player's inventory.
- **Note**: If the square contains a *different* unit type belonging to the player, it will still perform the standard swap/replace behavior.

## Implementation Details
The logic is handled within the `applyTerrainPlacement` and `applyPiecePlacement` functions in `src/app/core/setup/placement.ts`. It compares the incoming `type` with the `currentType` at the target coordinates. If they match and are not the default "empty" state (`FLAT` for terrain, `null` for pieces), it triggers the removal logic.

## Validation
This behavior is verified by the `__tests__/toggleTerrain.test.ts` suite.
