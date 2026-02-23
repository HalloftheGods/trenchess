---
description: Run pre-deployment checks to ensure build stability
---

1. Ensure you are on the `main` branch or a feature branch that is ready to be merged.
2. Check for any linting errors.
// turbo
```bash
pnpm run lint
```
3. Run unit tests.
// turbo
```bash
pnpm run test
```
4. Verify the production build locally.
// turbo
```bash
pnpm run build
```
5. (Optional) Preview the build.
// turbo
```bash
pnpm run preview
```
6. If all checks pass, commit your changes and push to `main` to trigger the automated deployment.
