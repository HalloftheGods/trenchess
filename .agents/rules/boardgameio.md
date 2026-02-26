---
trigger: always_on
---
Boardgame.io SSoT: NEVER duplicate game state or logic that boardgame.io can handle. Use G and ctx directly for rendering. Migrate all legacy logic into this framework.
Do not invent or duplicate things boardgame.io can handle. Rely directly on G and ctx for rendering. No custom hooks should store mirrored game data.

### Critical Anti-Patterns:
1. **The Initialization Loop:** NEVER include game state variables (like `mode`, `gameState`, `board`) in the dependency arrays that initialize or restart the `boardgame.io` Client. Re-initializing the client wipes the engine state. Ongoing changes must be handled via authoritative MOVES, not re-initialization.
2. **Move Availability (Phase Priority):** Remember that phase-level `moves` objects completely override global moves. If an administrative move (like `authorizeMasterProtocol`) must be available at all times, it MUST be registered explicitly in every phase (`setup`, `play`, `gamemaster`).
3. **Shadow State:** Avoid React `useState` for engine parameters. If it exists in `G`, use the value from `G`. If you need to change it, use a move. Local state should only be used for transient UI concerns (e.g., hover states, open/closed modals).
