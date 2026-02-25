---
trigger: always_on
---

# MVC Methodology

Adhere strictly to the Model-View-Controller pattern to ensure separation of concerns and maintainable composition.

### Model (The State)
- The **Model** is the source of truth. 
- In this project, it is primarily the game state managed by boardgame.io (`G` and `ctx`).
- Never duplicate or mirror game state in local component state. Rely directly on the game state hook.

### View (The Composition)
- The **View** is responsible for rendering the UI.
- Use **Atomic Design** to build the UI: Atoms -> Molecules -> Organisms -> Templates -> Views.
- **Views** (found in `src/client/*/game/`) are the **Composition Root**.
- A View should be a clean map of the route. It composes a **Layout Template** with specific **Organisms** and **Molecules**.
- Logic should be kept out of the View files as much as possible; they should describe *what* is seen, not *how* it works.

### Controller (The Logic)
- The **Controller** bridges the Model and the View.
- Encapsulate all complex UI logic, derived state, and event handlers into **Custom Hooks** (e.g., `useConsoleLogic`, `useGameState`).
- Views use these hooks to get the data and functions they need to pass down to organisms.
- This ensures logic is testable and reusable across different view compositions.
