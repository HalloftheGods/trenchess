# Coding Standards & Best Practices

## Language & Frameworks
- **TypeScript**: Strict typing is required. Avoid `any`.
- **React**: Use functional components and hooks.
- **pnpm**: Package manager of choice.
- **nvm**: Use Node 20 or latest.

## Naming Conventions
- **Files**: Short and sweet (300-500 lines max). Use atoms for single elements.
- **Variables**: Named booleans for conditionals.
- **Functions**: Use Adjective-Noun or Verb-Noun patterns.
- **Documentation**: Use `category_folder_file.md` format.

## Commentless Coding
Code should read like a story. Comments should be avoided in favor of self-documenting code.

### Example: Named Booleans & Extraction
```typescript
// Don't do this
if (player.id === current && state.status === 'active' && !waiting) { ... }

// Do this
const isActivePlayer = player.id === current;
const isGameInProgress = state.status === 'active';
const isNotWaiting = !waiting;
const canPerformAction = isActivePlayer && isGameInProgress && isNotWaiting;

if (canPerformAction) {
  performAction();
}
```

## Atomic Design Hierarchy
1. **Atoms**: Single elements (e.g., `Button`, `Input`, `Icon`). No raw HTML in molecules+.
2. **Molecules**: Groups of atoms (e.g., `SearchField`).
3. **Organisms**: Groups of atoms and molecules (e.g., `Header`, `Board`).
4. **Templates**: Made up of organisms and molecules (e.g., `PageLayout`).
5. **Views**: Top-level entry points that use templates.

## Styling
- **Tailwind CSS**: Use utility classes for global styling.
- **Avoid Raw CSS**: Only use when Tailwind is insufficient.
- **No Inline Styles**: Use Tailwind or CSS modules/files.

## boardgame.io Synergy
- **Rely on `G` and `ctx`**: Never duplicate game state in local React hooks.
- **Logic in `core/`**: Keep UI thin; put validation and transitions in the game definition.
