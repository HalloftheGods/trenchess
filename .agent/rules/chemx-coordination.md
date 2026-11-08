---
trigger: always_on
---

# Chemical X Coordination: index.db Is the Shared Workspace

Every session and agent coordinates through chemx's SQLite layer (`.chemx/index.db`): tasks, claims, file locks, the feed and DMs. Nobody works in a private checkout or a side channel. If work isn't in index.db or on `main`, the other agents can't see it, and it doesn't count as coordinated. Dogfooding this is the point: when the protocol is awkward, fix chemx; don't route around it.

## Where and who
- **Which db**: Trenchess (battle-chess) has its own coordination db at `/home/xopher/www/x/battle-chess/.chemx/index.db` (gitignored, local). Do not point it at Xophz-COMPASS; that repo is read-only reference for this project.
- **Identity**: pass `--as=@<your session name>` on every `chemx team` command. Workflow subagents use `@<session name>-<role>`. Never act as the default `@agent`.

## Session start
Run `chemx team status`, `chemx team inbox @<you>` and `chemx team task list --status=in_progress` before choosing work, so you know what's claimed and locked.

Before editing, run `chemx status --as=@<you>` instead of `git status`. It lists the changed files with each file's live lease (holder, purpose, task, minutes left) and flags a changed file with no live lease or leased by another handle. A flag is a hint: "unleased" can also mean a finished edit. To wait on a peer, use `chemx wait --task=<id>`, `--lock-free=<file>` or `--verify-idle` (polls every 3 seconds, exit 0 when met, 2 on timeout) instead of `sleep` or `node -e` loops.

## Before editing
1. The work exists as a task. Find it, or create it with `chemx team task add "<title>" --parent=<epic> --needs=light|standard|deep`.
2. Claim it: `chemx team task claim <id> --as=@<you>`.
3. Lock each file before your first edit: `chemx team lock acquire <file> --as=@<you> --purpose="#<id>"`. If another handle holds the lock, don't edit that file. DM the holder or pick other work.
4. Parallel agents split work by file and record that split as claims and locks.
5. If the task is yours only for part of the way, pass it on with `chemx team task handoff <id> @<to> --as=@<you>` (only the assignee or the task's creator may). The task stays `in_progress`, and the feed records from, to and by. A handoff does not move file locks: release yours, and the new owner acquires their own.

A lock is a lease of 5 minutes. Any chemx command run as the holder (`--as`, `params.agentId` or `CHEMX_AGENT_ID`) extends it, and long runs such as `test` and `verify` extend it while they run. It lapses after 5 minutes with no chemx activity from the holder; the next `acquire` or `release` records the lapse in the feed. `git commit` is refused for a staged file that another handle leases live. Exact behavior and its limits: `apps/chemical-x/starter-kit/docs/team-locks.md`.

## While working
- **Progress** goes in `chemx team task comment <id> "<msg>" --as=@<you>`.
- **Decisions** go in `chemx team post "<msg>" --type=decision --task=<id> --as=@<you>`.
- **Questions and handoffs** to one session go in `chemx team dm @<handle> "<msg>" --as=@<you>`. A host-level ping (Claude cross-session message, chat) is only a doorbell that cites the task, DM or post id. The content lives in index.db.
- **No git worktrees, no `git stash`.** Branch override for Trenchess (Commander's instruction, differs from Xophz-COMPASS): all glowup work happens on `glowup/hotg-makeover`. Only the engineer who owns git branch operations creates or switches branches; every other agent stays on the current branch. Never push and never deploy without the Commander's go-ahead. Commit small and green.
- **No markdown tracking files** (plans, checklists, review notes). Specs and design docs may reference task ids, but status lives in index.db.

## Launching agents
- **Route every subagent by the task's `needs` tier.** Prefer launching through `chemx team dispatch`, which routes for you. When writing a launch by hand, read each task's tier first (`chemx team task show <id>` / `task list`) and set model and effort explicitly:
  - `light` (mechanical: renames, lock/commit steps, cleanup): haiku or sonnet, low effort
  - `standard` (well-specified implementation): sonnet, medium
  - `deep` (design, cross-cutting refactors): opus, high
- **Never leave `model` unset.** Unset means the session's most expensive model.
- **Reviews:** match the build tier, one tier up only for deep work.
- **Commit and repair passes are `light`.**
- **Every agent prompt says the work is authorized and that relayed user messages are for the orchestrator.** Agents must not answer them or let them change the task, and should stop only if a message tells all agents to stop. Run #2451 lost 172 of 192 agents to a relayed question.
- **Give long runs a progress signal:** a Monitor or watch script on the run's results, so the user can follow along without typing.

## Finishing
1. Run `chemx verify` (or the package's gate). Run full-suite gates only after parallel editors finish.
2. Commit, then `chemx team lock release <file> --as=@<you>` for every file you locked.
3. Run `chemx team task done <id> --target=<file> --as=@<you>`. The gate refuses on a CRITICAL or HIGH hazard in the target, or when any rule's violation count is higher than at HEAD (`apps/chemical-x/starter-kit/docs/audit-gates.md`). If it refuses, fix the hazard or run `chemx team task update <id> blocked` with a reason. Never use `--force`.
4. If you cannot finish, do not leave the task claimed and silent: `chemx team task handoff <id> @<to>` with a comment saying what is left, or `task update <id> blocked` with the reason.

## Friction is work
Every `# chemx-bypass`, wrong or noisy output, missing flag or ignored argument becomes a task: `chemx team task add "Friction: <what happened>" --needs=light`, with the exact command and output in `--desc`. Fix it in the same session when it's cheap; filing is not the finish line.
