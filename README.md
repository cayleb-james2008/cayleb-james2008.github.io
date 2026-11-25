# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps** (plus Ergon v0.11.0):
  - **Open-Ro Studio v1.2.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`, [Release v1.2.0](https://github.com/cayleb-james2008/open-ro/releases/tag/v1.2.0)) — **Studio Copilot 3-pane Roblox Studio AI IDE** (`data-world="studio"`, `15.73 MB` `-17.2%` binary, gzip/ETag `461.9 KB` wire) featuring a **7-gate Ship & Monetization Readiness Autopilot**, `Agent | Plan | Ask` modes with staged reviewable unified Luau diffs (`Code & Diff`), directly embedded live Roblox Studio + 12 FPS isolated capture (`LiveFrameSnapshot`), `OpenRoCompanion.lua` Studio plugin, all 13 official Studio MCP tools, Co-Building 3D Studio Viewport, Rojo Ship Pack (`.zip`) + bidirectional `.rbxlx` XML, Tool & Skill Library, and Market Taste Craft Radar (`303/303` Rust tests, `4,487.2 req/s`, `11.10 ms` p95, `23/23` cold security fuzz).
  - **OpenBell v0.9.0** (`/projects/openbell.html`, 100% client-side offline sandbox at `/demos/openbell/`, source at `github.com/cayleb-james2008/openbell`, [Release v0.9.0](https://github.com/cayleb-james2008/openbell/releases/tag/v0.9.0)) — **Institutional Quant Terminal** (`data-world="terminal"`) in Rust with 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel + causal lookahead-canary tests, fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Out-of-Sample Strategy Tournament, `12×12` Correlation & `5×4` Regime Heatmaps, PAV Isotonic Calibration, and `$500/Day` Capital Scaling Engine (`108/108` Rust tests, `1,178 req/s`, `112.9 ms` p95, `49/49` security fuzz). Portfolio demo runs 100% locally offline against synthetic 15m data with zero real API keys or private trading data.
  - **Fleet v0.10.0** (`/projects/fleet.html`, live web app at `/demos/fleet/`, source at `github.com/cayleb-james2008/fleet`, [Release v0.10.0](https://github.com/cayleb-james2008/fleet/releases/tag/v0.10.0)) — **Codex/Linear parallel agent workbench** (`data-world="codex"`, `8.27 MB` `-24.8%` binary, gzip/ETag `421.2 KB` wire) with Goal-to-DAG planner, **1-click Batch Merge with `git merge-tree` conflict preflight**, **enriched Auto-Heal**, instant keyboard triage (`y`/`x`/`m`/`s`/`[`/`]`), live duration & budget headroom, PR Preview & confirmation-gated GitHub PR creator, Worktrees Inspector, reusable Playbooks, Split Diff viewer, and Web Worker check runner (`121/121` Rust tests, `6,255.9 req/s`, `9.00 ms` p95, `15/15` cold security fuzz).
  - **Ergon v0.11.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`, [Release v0.11.0](https://github.com/cayleb-james2008/ergon/releases/tag/v0.11.0)) — **Claude-Desktop employee desk** (`data-world="claude"`, `12.75 MB` `-20.3%` binary, gzip/ETag `433.8 KB` wire) with **context-aware 1-click workflow auto-detection**, **Unified | Side-by-side `.history/` diff preview & restore**, inline approval cards, real IndexedDB file workspace, background cadence routine scheduler, tamper-evident Field-Book Audit Bundle export, 3-company switcher, 12 built-in workflows, SHA-256 receipts, and Cmd+K (`208/208` Rust tests, `6,426.7 req/s`, `7.60 ms` p95, `25/25` cold security fuzz).
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
