---
trigger: always_on
---
Commentless Narrative: Code must tell a story without comments. Use descriptive Adjective-Noun or Verb-Noun identifiers.
Leave comments out of code and use commentless coding standards.
Use named boolean variables for conditionals.
Use adjective and verb-nouns.
Keep names precise and quick to read and understand.
Named Booleans: Use named boolean variables for all conditionals to ensure readability.
Name Anonymous functions: define the function as a const before passing it. Do not abbreviate params to single letters.
Readable Conditionals & Anonymous Functions: Always name conditionals and anonymous functions into readable variables to minimize confusion.
Higher-Order Atomization: Use "definer" utilities (e.g. `defineMovePattern`) and helper factories (e.g. `move`) to minimize boilerplate, ensure sterile typing, and humanize the implementation story.
Alias Imports: Always use path aliases for imports (e.g., `@atoms`, `@molecules`, `@hooks`) as defined in `tsconfig.app.json`. Avoid relative path imports like `../../`.
Tactical Nomenclature: Use themed names for upgrades and transitions (e.g. `leapOfFaith`) to maintain the project's narrative.
Zero-Lag Synchronization: Favor Inline Derivation over `useMemo` for simple lookups or transformations of the authoritative game state (`G` and `ctx`). Computations like mapping a player index to a PID should happen during the render phase to ensure the UI is perfectly synchronized with the engine state without "one-frame-behind" lag.
Refer to coding_standards.examples.ms for implementation patterns.
Surgical Integrity: NEVER use placeholders like `// ...` or `/* rest of file */` in tool calls. Every modification must maintain the functional completeness of the file. Always verify that all symbols used in exports or return statements are preserved and correctly defined.
