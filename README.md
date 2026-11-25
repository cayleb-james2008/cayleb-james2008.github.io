# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps** (plus Ergon v0.12.0):
  - **Open-Ro Studio v1.3.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`, [Release v1.3.0](https://github.com/cayleb-james2008/open-ro/releases/tag/v1.3.0)) — **Studio Copilot 3-pane Roblox Studio AI IDE** (`data-world="studio"`, `15.76 MB` binary, `95.55 ms` cold boot `-93.5%`, `89.29 MB` RSS `-22.5%`, gzip/ETag `462.1 KB` wire) featuring **1-click Monetization & Economy Codegen** (`MarketplaceService`, `ProductIds.luau`, `EconomyShopHandler.server.luau`, `ShopPromptBridge.client.luau`), **7-gate Ship & Monetization Readiness Autopilot**, `Agent | Plan | Ask` modes with staged reviewable unified Luau diffs, embedded live Roblox Studio + 12 FPS capture, `OpenRoCompanion.lua`, all 13 MCP tools, and Rojo `.zip` (`303/303` Rust tests, `3,792.2 req/s`, `12.93 ms` p95, `23/23` cold fuzz, `0/0/0` sloplint).
  - **OpenBell v0.9.0** (`/projects/openbell.html`, 100% client-side offline sandbox at `/demos/openbell/`, source at `github.com/cayleb-james2008/openbell`, [Release v0.9.0](https://github.com/cayleb-james2008/openbell/releases/tag/v0.9.0)) — **Institutional Quant Terminal** (`data-world="terminal"`) in Rust with 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel + causal lookahead-canary tests, fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Out-of-Sample Strategy Tournament, `12×12` Correlation & `5×4` Regime Heatmaps, PAV Isotonic Calibration, and `$500/Day` Capital Scaling Engine (`108/108` Rust tests, `1,178 req/s`, `112.9 ms` p95, `49/49` security fuzz). Portfolio demo runs 100% locally offline against synthetic 15m data with zero real API keys or private trading data.
  - **Fleet v0.11.0** (`/projects/fleet.html`, live web app at `/demos/fleet/`, source at `github.com/cayleb-james2008/fleet`, [Release v0.11.0](https://github.com/cayleb-james2008/fleet/releases/tag/v0.11.0)) — **Codex/Linear parallel agent workbench** (`data-world="codex"`, `8.44 MB` binary, `15.42 ms` cold boot `10x` faster, gzip/ETag `424.1 KB` wire) with Goal-to-DAG planner, **Wave Preflight & confirmation-gated Batch PR** (`WaveShipModal`), **Auto-Heal Failure Classifier**, instant keyboard triage (`y`/`x`/`m`/`s`/`[`/`]`), Worktrees Inspector, Playbooks, Split Diff viewer, and Web Worker check runner (`123/123` Rust tests, `7,048.0 req/s`, `5.73 ms` p95, `15/15` cold security fuzz, `0/0/0` sloplint).
  - **Ergon v0.12.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`, [Release v0.12.0](https://github.com/cayleb-james2008/ergon/releases/tag/v0.12.0)) — **Claude-Desktop employee desk** (`data-world="claude"`, `12.72 MB` binary, gzip/ETag `424.6 KB` wire) with **1-click Save as routine**, **1-click SHA-256 Client Pack (`.md`)** export, **multi-file batch workflow queue**, modular `src/server.rs` with `0o600` atomic persistence, `LazyMotion` + paginated receipts, **Unified | Side-by-side `.history/` diff preview & restore**, cadence scheduler, Field-Book Audit Bundle export, 12 workflows, and Cmd+K (`210/210` Rust tests, `6,046.8 req/s`, `6.47 ms` p95, `51.75 MB` VmHWM, `25/25` cold fuzz, `0/0/0` sloplint).
- **Live Multi-Document Industry AI Suite Workbench (`/lab/`)**: 10 real client-side source-grounded document review analyzers (multi-file upload/drop, cross-document LCS line diffing, numbered source inspector, clickable `[filename:L##]` citations, Custom Rule Pack Builder, 4-stage SHA-256 Evidence Provenance Chain, hard missing-source draft halts, `Cmd+K`, optional BYOK LLM in `sessionStorage`, and `.md`/`.json`/`.csv` exports).
- **Fourteen supporting project case studies** (`/projects/*.html`, `/resume.html`): styled in the same House Frontend token system (`site/house/tokens.css`, `base.css`, `project.css`) with Appearance tucked inside Settings.
- **Vendored parts, their sources and licences**: `app/STACK.lock.md`, `app/THIRD-PARTY-LICENSES/`, and `vendor/`; fonts: Geist and Geist Mono (SIL OFL) in `/fonts/` and `app/public/fonts/`. Square UI is a grammar reference only; no Square UI artwork ships.

## Build & Verification

Everything lives on `main` as a single unified source-and-Pages repository:

```bash
cd app && npm ci && npm run build          # tsc --noEmit && vite build → updates root index.html + assets/index-* AND stages app/dist/
node scripts/render-check.mjs              # House Frontend gate (1440/390 light/dark + reduced-motion, contrast, spacing, inert sweep)
```

Every asset is static; zero third-party network calls occur unless a visitor explicitly configures BYOK LLM or local binary connection inside an app's Settings.
