---
trigger: always_on
---
Boardgame.io SSoT: NEVER duplicate game state or logic that boardgame.io can handle. Use G and ctx directly for rendering. Migrate all legacy logic into this framework.
Do not invent or duplicate things boardgame.io can handle. Rely directly on G and ctx for rendering. No custom hooks should store mirrored game data.
