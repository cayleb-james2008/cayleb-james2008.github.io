# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps** (plus Ergon v0.21.0):
  - **Open-Ro Studio v1.11.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`, [Release v1.11.0](https://github.com/cayleb-james2008/open-ro/releases/tag/v1.11.0)) — **Studio Copilot 3-pane Roblox Studio AI IDE** (`data-world="studio"`, `10.98 MB` binary `-42.2%` vs v1.1.0, `241.6 KB` raw / `57.7 KB` gzip initial `/`, **`31.75 ms` cold boot `-6.7%`**, **`16.45 MB` Peak RSS `-4.5%`**) featuring **Studio Economy & Funnel Dry-Run Simulator** (ARPDAU, D1/D7 retention lift, GamePass conversion %, 4-stage funnel & JSON export), 1-Click Launch Autopilot, Monetization Tier Presets & 48h Comeback Retention Curve, Unified Pre-Publish Gate, embedded live Roblox Studio + 12 FPS capture, `OpenRoCompanion.lua`, and all 13 MCP tools (`309/309` Rust tests, `4,527.8 req/s` `16w` pinned, `4.21 ms` p95 `-7.1%`, `10/10` Dual-SSE, **`26/26` cold fuzz**, `0/0/0` sloplint).
  - **OpenBell v0.9.0** (`/projects/openbell.html`, 100% client-side offline sandbox at `/demos/openbell/`, source at `github.com/cayleb-james2008/openbell`, [Release v0.9.0](https://github.com/cayleb-james2008/openbell/releases/tag/v0.9.0)) — **Institutional Quant Terminal** (`data-world="terminal"`) in Rust with 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel + causal lookahead-canary tests, fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Out-of-Sample Strategy Tournament, `12×12` Correlation & `5×4` Regime Heatmaps, PAV Isotonic Calibration, and `$500/Day` Capital Scaling Engine (`108/108` Rust tests, `1,178 req/s`, `112.9 ms` p95, `49/49` security fuzz). Portfolio demo runs 100% locally offline against synthetic 15m data with zero real API keys or private trading data.
  - **Fleet v1.9.0** (`/projects/fleet.html`, live web app preview at `/demos/fleet/`, source at `github.com/cayleb-james2008/fleet`, [Release v1.9.0](https://github.com/cayleb-james2008/fleet/releases/tag/v1.9.0)) — **Antigravity-native Swarm Sidebar Plugin** (`SIDECAR_UI_ENTRYPOINT_AUX_PANE`, `data-world="codex"`, `304.1 KiB` raw / **`91.9 KiB` (`94,127 B`) pre-gzipped sidecar `-1.3%`**; standalone Rust `v0.12.0` preserved at tag `v0.12.0`) adding **Swarm Bottleneck Heat Bar + 1-Click Copy Blocker** (`Top #seq` jump & `~/`-masked Markdown), Inline Worktree Diff Peek & CWE-22/CWE-59 Confinement, Board Quick-Filter Chips & Wave Digest, `zlib.crc32` ETags, and `SHARED_CHUNK_BUF` / `createMentionsMatcher` optimization (**`77.66 ms` boot `-5.7%`**, **`71.06 MB` `--jitless` Peak RSS `-2.3%`**, `1,461.2 req/s` `+5.4%`, **`21.48 ms` max tail `-12.9%`**, `8/8` sidecar tests, `5/5` SSE, `28/28` cold fuzz, `0/0/0` sloplint).
  - **Ergon v0.21.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`, [Release v0.21.0](https://github.com/cayleb-james2008/ergon/releases/tag/v0.21.0)) — **Claude-Desktop employee desk** (`data-world="claude"`, `9.39 MB` binary `-41.3%` vs v0.10.0, `151.0 KB` / `34.0 KB` gzip initial shell `-97.2%` vs v0.10.0 via `15` pre-gzipped `.rodata` `/chunks/*`) featuring **Playbook Dry-Run Preview (`Reversible via .history/` rollback badge)**, **1-Click Verified Playbook Pack Export & Import (`.ergon-playbook.json` + SHA-256)**, Multi-Run Summary Pack (`.md` & `.html`), Citation Freshness Gate & Verified Client Handoff (`.html`), HTTP/1.1 Keep-Alive + `-O3` Hot-Path Split (**`4,818.3 req/s` `+23.0%`**, **`4.34 ms` p95 `-21.7%`**, **`19.32 MB` VmHWM `-2.0%`**, **`9.27 ms` cold boot `-3.5%`**), `219/219` Rust tests, `5/5` SSE, **`29/29` cold fuzz**, and `0/0/0` sloplint.
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
