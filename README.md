# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF, with global `Cmd+K` Quick Jump navigation.
- **Three flagship product pages & live interactive web apps**:
  - **Ergon v0.6.0** (`/projects/ergon.html`, live web app at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`) — real IndexedDB file workspace, 12 built-in workflows, accounting-negative CSV/Markdown/JSON engine hardened across a 96/96 3-company live LLM campaign, SHA-256 receipt export, routines, Today approval deletions, Cmd+K, plus optional BYOK LLM or local `ergon` binary connection.
  - **Open-Ro Studio v0.7.0** (`/projects/openro.html`, live web app at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`) — embedded realtime **Roblox Studio 3D Viewport** (orbit/pan/zoom, Select/Move/Scale/Rotate gizmos, animated Agent Builder Drone & Laser Beam, Replay Build, docked Live Agent Stream console, Live Studio MCP Feed), 28 Roblox game systems, playable **Anime Card Battles: Rebirth — Apex Edition** with embedded cel-shaded card art, Card Art Studio, Static Luau Prover, bidirectional `.rbxlx` XML, plus optional BYOK LLM or local `openro-rs` connection.
  - **DSH Fleet v0.6.0** (`/projects/dsh-fleet.html`, live web app at `/demos/dsh-fleet/`, source at `github.com/cayleb-james2008/dsh-fleet`) — real in-browser virtual git worktree store, autonomous Auto-Heal feedback loop & timeline, reusable Playbook templates, live Board Telemetry strip, DAG batch scheduler, unified/split diff viewer, multi-step Web Worker check runner, Policy Tester, `.patch` export, and verified branch merge, plus optional BYOK LLM or local `fleet-rs` connection.
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
