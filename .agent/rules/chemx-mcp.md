---
trigger: always_on
---

# Chemical X MCP Server Mandatory Protocol

## 1. Always Chemical X; Pick the Right Front Door
- **Always chemx**: Every test, typecheck, lint, build, search, read, diff and log goes through Chemical X: the CLI `chemx <cmd>` or the MCP tool `chemx` on server `chemical-x`. Raw tools are only for what chemx does not wrap: Docker, dev servers, WP-CLI, deploys and submodules.
- **CLI (`chemx <cmd>` in a shell)** is the default when a shell exists. Prefer it when editing chemx itself: it always runs the code on disk, while a stale MCP server only does so in a slower fresh process. Use it for long runs (`verify`, `typecheck`, `build`, full `test`) and for anything piped, scripted or gated by exit codes.
- **MCP (`chemx({ action, params })`, `{ command }`, or batch `{ commands: [...] }`)** is for bursts of small read-only lookups (`q`, `read`, `p`, `f`, `j`). The warm process skips the per-call process start (a cold CLI call measured 0.1s for `--version` and 0.7s to 0.9s for `q` on 2026-10-09; MCP latency is not benchmarked). MCP is the only option in hosts without a shell. Do not call fragmented sub-tools; dispatch through the master `chemx` tool.
- **Root**: The server inherits `CHEMX_PROJECT_ROOT` from `.mcp.json`. Pass `projectRoot` for any other package. The `d`/`log`/`p`/`f`/`j` wrappers honor `projectRoot` (checked 2026-10-09 over MCP with the kit as `projectRoot`, all five wrappers).
- **Staleness**: After chemx source changes the server prints `stale chemx MCP server (loaded X, disk Y)` and runs each call in a fresh process on the code on disk (slower). If the fresh process dies without a result, the outcome is unknown: check the files before retrying. Reconnect via `/mcp` to get the fast process back. Verify changes to chemx itself through the CLI and specs.
- **Allowed Actions**: `audit`, `test`, `build`, `verify`, `typecheck`, `read`, `patch`, `write`, `check`, `q`, `team`, `generate`, `patterns`, `autofix`, `d`, `log`, `p`, `f`, `j`.

## 2. No Primitive Inspection
- **No Raw Text Scans**: Strictly avoid `sed`, `grep`, `head`, `tail`, `cat`, or raw `view_file` for reading code.
- **AST Reader First**:
  - Outlines: `chemx({ action: "read", params: { path, outline: true } })`
  - Enriched Logic: `chemx({ action: "read", params: { path, outline: true, enrich: true } })`
  - Symbol Extraction: `chemx({ action: "read", params: { path, symbol: "<name>" } })`
  - Call Connections: `chemx({ action: "read", params: { path, symbol: "<name>", connections: true } })` (size grows with the symbol and its callers)
  - Literal text: `chemx q -g "<text>" [path...]` scopes to the paths you name; a missing path is an error.
  - Appending: `chemx({ action: "write", params: { path, content, append: true } })` adds to the end of a file and inserts no newline for you.

## 3. Verification and Discovery
- **Verification First**: Validate code changes using `chemx({ action: "verify" })` or `chemx({ action: "test" })`.
- **No Raw Subshell Tests**: Never execute unthrottled `npm test` or `vitest` in bash subshells; use `chemx test` (CLI) or `chemx({ action: "test" })`.
- **Search First**: Find code symbols and references via `chemx q "<query>"` or `chemx({ action: "q", params: { query } })`; literal text via `chemx q -g "<text>" -l`.
