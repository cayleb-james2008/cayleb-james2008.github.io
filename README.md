# cayleb-james2008.github.io

Public interactive resume and project demonstrations for Cayleb Alvarez-James: https://cayleb-james2008.github.io/

The plain PDF at `/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy, and the site adds keyboard jump navigation (`Cmd+K`) alongside local browser sandboxes.

## What is here

The home page (`/`) holds the summary, stated test-count ledger, experience, selected projects, skills, and education sections locked to the submission PDF.

Interactive browser applications and product pages:

- Open-Ro Studio `v1.16.0` ([project page](/projects/openro.html), [live web app](/demos/open-ro/), [repo](https://github.com/cayleb-james2008/open-ro)): three-pane Rust AI IDE for Roblox Studio with Luau diffs, pre-publish asset and hook readiness checks with safe autofix, Rojo live-sync conflict resolution, snapshot rollback, live Studio sync via `OpenRoCompanion.lua` and 13 MCP tools, and `.rbxlx` / Rojo `.zip` export. Release binary is `9.06 MB`, passes 314 Rust tests, 56 UI checks, 10 Dual-SSE streams, and 39 security fuzz checks at `13.86 MB` peak RSS (`6,144.5 req/s`).
- OpenBell `v0.9.0` ([project page](/projects/openbell.html), [offline sandbox](/demos/openbell/), [repo](https://github.com/cayleb-james2008/openbell)): Rust research and Kalshi v2 terminal with five-stage edge checks, causal lookahead tests, out-of-sample strategy tournaments, isotonic calibration, and fail-closed risk limits disarmed on every boot. Runs offline in the browser on synthetic 15-minute market data with zero real credentials.
- Fleet `v1.16.0` ([project page](/projects/fleet.html), [live preview](/demos/fleet/), [repo](https://github.com/cayleb-james2008/fleet)): Antigravity sidebar plugin (`~/.gemini/config/plugins/fleet/`) with worktree safe-land status and copyable merge commands, cross-swarm `Cmd/Ctrl+K` action index, stalled-worker recovery, member-filtered board jumps, wave velocity pills, and token burn monitoring. Passes 11 sidecar tests, 48 UI checks, 5 SSE streams, and 30 security fuzz checks (`68.15 ms` boot, `1,967.1 req/s`).
- Ergon `v0.26.0` ([project page](/projects/ergon.html), [live app](/demos/ergon/), [repo](https://github.com/cayleb-james2008/ergon)): single-binary Rust desktop and web desk for local employee workflows inside a sandboxed folder with offline evidence bundle verification (`ergon verify`), workspace audit policy profiles (`Fast Internal`, `Strict Client`, and `Air-Gapped`), `.history/` restore, SHA-256 receipts, citation checks, and stale-memory cleanup. Ships in a `7.46 MB` binary passing 225 Rust tests, 74 UI checks, and 39 fuzz checks (`5,117.4 req/s`, `15.38 MB` RSS). Ergon is in development and not yet installed at a company.

The Industry AI Suite workbench (`/lab/`) runs ten client-side multi-document review tools with line diffing, clickable `[filename:L##]` citations, SHA-256 provenance, and missing-source draft halts. Fourteen additional project notes sit under `/projects/*.html` using the same House Frontend styling (`site/house/tokens.css`, `base.css`, `project.css`) with Light/Dark selection inside Settings.

Vendored notices and licenses live in `app/STACK.lock.md`, `app/THIRD-PARTY-LICENSES/`, and `vendor/`, using Geist and Geist Mono (SIL OFL).

## Build and verify

```bash
cd app && npm ci && npm run build
node scripts/render-check.mjs
```

Everything serves as static files with zero external network calls unless you add a BYOK API key or connect a local runtime in an app's Settings panel.
