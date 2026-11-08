# How changes land on main

`main` is protected. The one required status check is `checks` (`.github/workflows/ci.yml`), which runs lint, typecheck plus build, then the vitest suite with the game server on port 3001.

## Agents (chemx workers)

1. Claim the chemx task: `chemx team claim <task> --as=@<name>`.
2. Work in your own worktree, never in the main checkout:
   `git worktree add -b <type>/<slug> ../battle-chess-wt-<slug> origin/main`
3. Lock each file in chemx before you edit it, and commit small.
4. Push and open the PR with auto-merge turned on:
   ```
   git push -u origin <type>/<slug>
   gh pr create --fill --base main
   gh pr merge --auto --squash --delete-branch
   ```
5. The PR squash-merges by itself once `checks` is green. If a check fails, fix it on the same branch and push again.
6. Release the chemx task, then remove the worktree: `git worktree remove ../battle-chess-wt-<slug>`.

Turn on auto-merge with the maintainer's own `gh` login, not a workflow `GITHUB_TOKEN`. A merge made by `GITHUB_TOKEN` does not trigger other workflows, so `deploy.yml` (GitHub Pages) would not run.

## Commander

- The local checkout at `../battle-chess-main` stays on `main` and runs the dev server. Run `git pull` there to pick up merged PRs; Vite hot-reloads.
- Admins can still push straight to `main`, because `enforce_admins` is off.
- Every merge to `main` deploys to GitHub Pages through `deploy.yml`.
