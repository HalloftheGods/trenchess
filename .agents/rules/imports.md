---
trigger: always_on
---
Import Aliases: Always use path aliases for imports to maintain a clean and maintainable codebase.
Prefer consolidated barrel imports from `@shared` for component and logic orchestration in Views/Screens.

Examples:
- `import { Box, Flex, Button } from "@shared";`
- `import { useBoardInteraction } from "@shared";`

Common Aliases:
- `@shared`: Consolidated entry point for components, hooks, context, and utils.
- `@atoms/*`, `@molecules/*`, `@organisms/*`, `@templates/*`: Deep path component imports when needed.
- `@controllers/*`: Specific logical controllers (hooks).
- `@engine/*`, `@logic/*`, `@ai/*`, `@setup/*`: Core game engine and mechanics.
- `@constants/*`: Shared game and UI constants.
- `@client/*`, `@game/*`: Client-side UI and game logic.

NEVER use relative path imports like `../../`.

