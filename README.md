# cayleb-james2008.github.io

Public interactive resume and project demonstrations for Cayleb Alvarez-James: https://cayleb-james2008.github.io/

The plain PDF at `/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy, and the site adds keyboard jump navigation (`Cmd+K`) alongside local browser sandboxes.

## What is here

The home page (`/`) holds the summary, stated test-count ledger, experience, selected projects, skills, and education sections locked to the submission PDF.

Interactive browser applications and product pages:

- Open-Ro Studio `v1.15.0` ([project page](/projects/openro.html), [live web app](/demos/open-ro/), [repo](https://github.com/cayleb-james2008/open-ro)): three-pane Rust AI IDE for Roblox Studio with Luau diffs, Rojo live-sync conflict resolution, hook-integrity checks, snapshot rollback, live Studio sync via `OpenRoCompanion.lua` and 13 MCP tools, and `.rbxlx` / Rojo `.zip` export. Release binary is `9.96 MB`, passes 313 Rust tests, 56 UI checks, 10 Dual-SSE streams, and 36 security fuzz checks at `14.84 MB` peak RSS.
- OpenBell `v0.9.0` ([project page](/projects/openbell.html), [offline sandbox](/demos/openbell/), [repo](https://github.com/cayleb-james2008/openbell)): Rust research and Kalshi v2 terminal with five-stage edge checks, causal lookahead tests, out-of-sample strategy tournaments, isotonic calibration, and fail-closed risk limits disarmed on every boot. Runs offline in the browser on synthetic 15-minute market data with zero real credentials.
- Fleet `v1.15.0` ([project page](/projects/fleet.html), [live preview](/demos/fleet/), [repo](https://github.com/cayleb-james2008/fleet)): Antigravity sidebar plugin (`~/.gemini/config/plugins/fleet/`) with one-click stalled and idle worker recovery, member-filtered board jumps, wave velocity pills, next-gate action chips, token burn monitoring, filtered board exports, and path-confined git worktree diffs. Passes 11 sidecar tests, 46 UI checks, 5 SSE streams, and 30 security fuzz checks at `69.41 MB` `--jitless` RSS (`1,168.8 req/s`).
- Ergon `v0.25.0` ([project page](/projects/ergon.html), [live app](/demos/ergon/), [repo](https://github.com/cayleb-james2008/ergon)): single-binary Rust desktop and web desk for local employee workflows inside a sandboxed folder with one-click workspace audit policy profiles (`Fast Internal`, `Strict Client`, and `Air-Gapped`), `.history/` restore, SHA-256 receipts, citation checks, and stale-memory cleanup. Ships in an `8.38 MB` binary passing 223 Rust tests, 74 UI checks, and 36 fuzz checks (`4,219.5 req/s`, `16.15 MB` RSS). Ergon is in development and not yet installed at a company.

The Industry AI Suite workbench (`/lab/`) runs ten client-side multi-document review tools with line diffing, clickable `[filename:L##]` citations, SHA-256 provenance, and missing-source draft halts. Fourteen additional project notes sit under `/projects/*.html` using the same House Frontend styling (`site/house/tokens.css`, `base.css`, `project.css`) with Light/Dark selection inside Settings.

Vendored notices and licenses live in `app/STACK.lock.md`, `app/THIRD-PARTY-LICENSES/`, and `vendor/`, using Geist and Geist Mono (SIL OFL).

## Build and verify

```bash
cd app && npm ci && npm run build
node scripts/render-check.mjs
```

Everything serves as static files with zero external network calls unless you add a BYOK API key or connect a local runtime in an app's Settings panel.
