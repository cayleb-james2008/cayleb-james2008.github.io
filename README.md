# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps** (plus Ergon v0.7.0):
  - **Open-Ro Studio v0.10.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`) — **RoPilot-grade 3-pane Roblox Studio AI IDE** featuring `Agent | Plan | Ask` modes with staged reviewable unified Luau diffs (`Code & Diff`), directly embedded live Roblox Studio + auto-synced Explorer (`268` live items, `0` Luau errors), `OpenRoCompanion.lua` Studio plugin, all 13 official Studio MCP tools, Co-Building 3D Studio Viewport, Rojo Ship Pack (`.zip`) + bidirectional `.rbxlx` XML, 8-pack Tool & Skill Library, Market Taste Craft Radar, Playable Stage, and Blender/WAV tools.
  - **OpenBell v0.8.0** (`/projects/openbell.html`, 100% client-side offline sandbox at `/demos/openbell/`, source at `github.com/cayleb-james2008/openbell`) — live-connected Kalshi Trade API v2 trading & quant desktop app in Rust behind fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Out-of-Sample Strategy Tournament, `12×12` Correlation & `5×4` Regime Heatmaps, PAV Isotonic Calibration, and `$500/Day` Capital Scaling Engine. Portfolio demo runs 100% locally offline against synthetic 15m data with zero real API keys or private trading data.
  - **Fleet v0.8.0** (`/projects/fleet.html`, live web app at `/demos/fleet/`, source at `github.com/cayleb-james2008/fleet`) — real in-browser virtual git worktree store, interactive multi-wave `Board` / `DAG Graph` toggle, PR Preview & confirmation-gated GitHub PR creator, Worktrees Inspector, Daily Dispatch Budget guardrails, autonomous Auto-Heal feedback loop & timeline, reusable Playbooks, Board Telemetry, Split Diff viewer, Web Worker check runner, and verified branch merge.
  - **Ergon v0.7.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`) — real IndexedDB file workspace, background cadence routine scheduler (`Pause/Resume` + Run History), automatic `.history/` file version diff & restore, tamper-evident Field-Book Audit Bundle export, 3-company switcher, 12 built-in workflows, SHA-256 receipts, Today approvals, and Cmd+K.
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
