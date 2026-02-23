# GitHub Pages Deployment

This document outlines the steps to deploy the Trenchess project to GitHub Pages using Vite and GitHub Actions.

## Configuration

### Vite Base Path
The project is configured to be served from the `/trenchess/` subpath. This is set in `vite.config.ts`.

```typescript
export default defineConfig({
  base: '/trenchess/',
  // ... rest of config
})
```

### GitHub Actions Workflow
We use a GitHub Actions workflow to automatically build and deploy the site whenever changes are pushed to the `main` branch. The workflow is located at `.github/workflows/deploy.yml`.

Key features of the workflow:
- Uses `pnpm` for dependency management.
- Uses Node.js 22 (or latest stable).
- Builds the production assets using `pnpm run build`.
- Deploys the `dist` folder to GitHub Pages.

## Deployment Steps

1. **Commit and Push**: Ensure the `base` path in `vite.config.ts` and the `.github/workflows/deploy.yml` file are committed and pushed to the `main` branch.
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Monitor Deployment**:
   - Go to the **Actions** tab in your repository to see the progress of the "Deploy static content to Pages" workflow.
   - Once the workflow completes, your site will be available at `https://HalloftheGods.github.io/trenchess/`.

## Manual Deployment (Local)

If you need to test the production build locally:

```bash
pnpm run build
pnpm run preview
```

The preview will be available at `http://localhost:4173/trenchess/`.
