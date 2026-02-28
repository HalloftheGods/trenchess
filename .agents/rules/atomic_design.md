---
trigger: always_on
---
Strict Atomic Hierarchy:
1. Atoms: The smallest, most granular single items. Purely presentational. Import via `@atoms`.
2. Molecules: Groups of Atoms. Never use raw HTML here; use Atoms. Import via `@molecules`.
3. Organisms: Groups of Molecules. Never use raw HTML here; use Molecules (and Atoms if necessary, but prioritize Molecules). Import via `@organisms`.
4. Templates: Groups of Organisms. Focus on layout and structure. Import via `@templates`.
5. Views/Screens: The composition root (found in `src/client/*`). They use **Controllers** (custom hooks via `@controllers`) to fetch and prepare data and handlers, which they then pass to **Templates** for rendering.

No Raw HTML: I don't want to see raw HTML elements (div, span, button, etc.) in Molecules, Organisms, or Templates. Use Atoms and Tailwind utilities exclusively for styling.

Import Aliases:
- Always use `@atoms`, `@molecules`, `@organisms`, `@templates`, and `@bionics` for component imports.
- NEVER use relative path imports (e.g., `../../components/Atom`).

