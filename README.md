# Trenchess (Battle Chess)

Trenchess is an advanced, strategic variant of chess played on an interactive board with variable terrain and customizable setups. Built with React, TypeScript, and powered by [boardgame.io](https://boardgame.io/), Trenchess supports real-time multiplayer skirmishes with an immersive ruleset.

## Key Features

- **Custom Game Modes**: Play standard games or variable setups like Omega and Pi.
- **Setup Phase**: Strategically place your pieces and terrain before the battle begins.
- **Dynamic Terrain**: Fight across Mountains, Forests, Swamps, and Deserts. Each terrain type provides a unique "Trench Advantage," altering unit capture rates.
- **Combat Stats**: Track your performance across different terrains and understand the mathematical advantages of your positioning.
- **Interactive Guide**: A built-in, detailed chess guide and move preview system complete with mathematical operators and selected terrain breakdowns.
- **Online Multiplayer**: Real-time synchronized gameplay using a custom boardgame.io server with shareable, short 4-character room codes.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Game Engine / Multiplayer Sync**: [boardgame.io](https://boardgame.io/)
- **Package Manager**: pnpm

## Development Setup

We use Node.js and `pnpm`. If you don't have the correct Node version, please use NVM.

```bash
# Ensure you are on Node 20 (or the latest version)
nvm use 20

# Install dependencies
pnpm install

# Start the frontend app and the boardgame.io server
pnpm run dev
```

## Documentation

- **`/.docs` Library**: You can find detailed development documentation, FAQs, and API usage inside our `.docs/` folder. Please refer to it before making major architectural decisions.
- **Commentless Code**: We strive for clean code with commentless coding standards. Documentation lives in the `.docs/*` library rather than in inline comments. Be sure to check there!

---

*Keep the code lean, clean, and a well-oiled machine.*
