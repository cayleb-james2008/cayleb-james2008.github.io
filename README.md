# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps** (plus Ergon v0.17.0):
  - **Open-Ro Studio v1.7.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`, [Release v1.7.0](https://github.com/cayleb-james2008/open-ro/releases/tag/v1.7.0)) — **Studio Copilot 3-pane Roblox Studio AI IDE** (`data-world="studio"`, `14.66 MB` fat-LTO binary, `19.57 MB` Peak RSS `-83.0%` vs v1.2.0, `26.95 ms` cold boot `-76.3%`, `17` pre-gzipped `/chunks/*.js`) featuring **Monetization Tier Presets & 48h Comeback Retention Curve Designer**, **Unified Pre-Publish Revenue & Playtest Gate** with 1-click Auto-Fix cards, `+Δ pts` Autopilot score deltas, Shop & Economy Codegen, `Agent | Plan | Ask` unified Luau diffs, embedded live Roblox Studio + 12 FPS capture, `OpenRoCompanion.lua`, all 13 MCP tools, and CRC-32 Rojo `.zip` (`304/304` Rust tests, `7,566.0 req/s` `+34.9%`, `5.20 ms` p95, `10/10` Dual-SSE, `23/23` cold fuzz, `0/0/0` sloplint).
  - **OpenBell v0.9.0** (`/projects/openbell.html`, 100% client-side offline sandbox at `/demos/openbell/`, source at `github.com/cayleb-james2008/openbell`, [Release v0.9.0](https://github.com/cayleb-james2008/openbell/releases/tag/v0.9.0)) — **Institutional Quant Terminal** (`data-world="terminal"`) in Rust with 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel + causal lookahead-canary tests, fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Out-of-Sample Strategy Tournament, `12×12` Correlation & `5×4` Regime Heatmaps, PAV Isotonic Calibration, and `$500/Day` Capital Scaling Engine (`108/108` Rust tests, `1,178 req/s`, `112.9 ms` p95, `49/49` security fuzz). Portfolio demo runs 100% locally offline against synthetic 15m data with zero real API keys or private trading data.
  - **Fleet v1.4.0** (`/projects/fleet.html`, live web app preview at `/demos/fleet/`, source at `github.com/cayleb-james2008/fleet`, [Release v1.4.0](https://github.com/cayleb-james2008/fleet/releases/tag/v1.4.0)) — **Antigravity-native Swarm Sidebar Plugin** (`SIDECAR_UI_ENTRYPOINT_AUX_PANE`, `data-world="codex"`, `406.4 KB` raw / `120.0 KB` gzip sidecar bundle `-17.5%` gz; standalone Rust `v0.12.0` preserved at tag `v0.12.0`) adding **Keyboard-First Sidebar Triage (`j`/`k`/`o`/`p`/`1`–`5`)**, **Worktree Changed-File Links (`git status -z` + Open file in Aux Pane)**, live `/api/swarm/stream` SSE push + `Pin #seq`, 1-click Unstick presets, Context & Token Pressure saturation bars, and zero-dep `Element.animate` + bounded LRU RSS diet (`84.73 ms` pinned boot, `109.54 MB` RSS `-10.8%`, `1,324.0 req/s` `16w` pinned, `17.17 ms` p95 `-33.4%`, `8/8` sidecar tests, `5/5` SSE, `22/22` cold fuzz, `0/0/0` sloplint).
  - **Ergon v0.17.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`, [Release v0.17.0](https://github.com/cayleb-james2008/ergon/releases/tag/v0.17.0)) — **Claude-Desktop employee desk** (`data-world="claude"`, `11.76 MB` fat-LTO binary `-26.5%` vs v0.10.0, `149.1 KB` / `33.4 KB` gzip initial shell `-97.2%` wire via `15` pre-gzipped `.rodata` `/chunks/*`) featuring **1-Click Run / Receipt Comparison (`GET /api/receipts/compare`) & Delta Client Packs (`.md`)**, **Unified Fuzzy `Cmd+K` Jump** across files, citations, playbooks & receipts, clickable `[file:L##]` Source Inspector, zero-DOM streaming Audit Bundle (`26.19 MB` VmHWM `-49.9%` vs v0.11.0), Promote to Playbook, Pre-Flight Check, and `.history/` diff restore (`216/216` Rust tests, `8.56 ms` cold boot, `5,420.0 req/s` `16w` pinned, `3.94 ms` p95 `-46.9%`, `5/5` SSE, `25/25` cold fuzz, `0/0/0` sloplint).
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
