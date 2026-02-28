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
- The **View/Screen** is the composition root for a specific route (found in `src/client/*`).
- Use **Atomic Design** to build the UI: Atoms -> Molecules -> Organisms -> Templates -> Views.
- A **View/Screen** should be a clean orchestration layer. It uses **Controllers** (custom hooks) to fetch and prepare the necessary data and event handlers.
- The **View/Screen** then passes this state and logic down to a **Template**, which handles the layout and rendering of organisms.
- Logic should be kept out of the View files; they describe *what* is being composed, not *how* the logic is implemented.

### Controller (The Logic)
- The **Controller** bridges the Model and the View, found in `@controllers` (e.g., `src/shared/hooks/controllers/*`).
- Encapsulate all complex UI logic, derived state, and event handlers into **Custom Hooks**.
- **Views/Screens** use these hooks to get the data and functions they need to pass down to **Templates**.
- This ensures logic is testable and reusable across different view compositions.
