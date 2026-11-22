# BUILD NOTE — Unified House Frontend + v0.6.0 Live Web Apps & Multi-Document `/lab/` Workbench (22 November 2026)

Branch: `main` (single unified branch carrying `app/`, `demos/`, `projects/`, `lab/`, `resume.html`, and the built GitHub Pages root).

## Canonical repository & architecture

- **Canonical:** `cayleb-james2008/cayleb-james2008.github.io` (`https://cayleb-james2008.github.io/`).
- Preserves `main`'s 18 November 2026 résumé text and submission PDF (`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf`) verbatim.
- Unified House Frontend token system (`Geist` + `Geist Mono` `.woff2`/`.ttf`, light-default + `prefers-color-scheme: dark` + `localStorage.theme` parity with Light/Dark Appearance tucked cleanly inside the Settings popover across every page, `>= 4.5:1` contrast, `>= 12px` floor) plus Global `Cmd+K` Quick Jump across home, product pages, live web apps, and `/lab/`.
- `app/vite.config.ts` (`stageAndPublishSite`) updates root `index.html` and `assets/index-*` directly while staging static directories into `app/dist/` for `render-check.mjs`.

## Interactive v0.6.0 web apps & `/lab/` workbench

- **Ergon v0.6.0** (`/projects/ergon.html`, `/demos/ergon/`, `github.com/cayleb-james2008/ergon`): single-binary Rust agent shell (`12` built-in workflows, live SSE stream, indexed 5k-receipt search, standing routines, SHA-256 Field-Book receipts, accounting-negative CSV parsing, zero host-path leakage, hardened across a `96/96` 3-company live LLM campaign). Scale-verified at 5,000 receipts + 500 files (`GET /api/search` `10.28 ms–12.48 ms` p95, `47.76 MB` RSS, `28/28` fuzz pass).
- **Open-Ro Studio v0.7.0** (`/projects/openro.html`, `/demos/open-ro/`, `github.com/cayleb-james2008/open-ro`): embedded realtime Roblox Studio 3D Viewport (pure Canvas 3D perspective engine, Select/Move/Scale/Rotate gizmos, Agent Builder Drone & Laser Beam, step-by-step Replay Build, Live Studio MCP PNG Frame Feed, docked Live Agent Stream console), `28` Roblox game systems, playable **Anime Card Battles: Rebirth — Apex Edition** with embedded cel-shaded card art, Card Art Studio, Static Luau Prover, bidirectional `.rbxlx` XML. Scale-verified at 500 Instances + 50 Luau scripts + 500-event SSE ring + 10 simultaneous SSE streams (`GET /api/studio/frame` `8.57 ms` p95, `GET /api/luau/check` `31.08 ms` p95, `43/43` XML/asset/studio security fuzz pass).
- **DSH Fleet v0.6.0** (`/projects/dsh-fleet.html`, `/demos/dsh-fleet/`, `github.com/cayleb-james2008/dsh-fleet`): real parallel agent worktree orchestration (autonomous Auto-Heal feedback loop with SHA-256 loop guard, reusable Playbook templates, live Board Telemetry strip, DAG dependency & cycle detection, multi-step Web Worker checks, Split Diff, `.patch` export, Policy Tester, proven in a `35/35` 3-repo live CLI campaign). Scale-verified at 2,000 sessions + 50k transcript lines + 1,000-node DAG (`GET /api/metrics` `4.54 ms` p95, `GET /api/templates` `5.09 ms` p95, `54.15 MB` RSS, `22/22` policy/template fuzz pass).
- **Industry AI Suite Workbench (`/lab/`)**: 10 real client-side document review workflows supporting multi-file batch upload, cross-document reconciliation & LCS-DP diffing, clickable `[filename:L##]` source jumps, Custom Rule Pack Builder (`localStorage`), 4-stage SHA-256 Evidence Provenance Chain, `.md`/`.json`/`.csv` exports, `Cmd+K`, `j`/`k` keyboard navigation, and optional BYOK LLM (`sessionStorage`).

## Deterministic verification

- `node app/scripts/render-check.mjs` passes consecutively across `1440-light`, `1440-dark`, `390-light`, `390-dark`, `1440-reduced`, and `390-reduced`.
- Full-site sweep covers `24` routes × `2` schemes × `4` widths (`320`/`390`/`768`/`1440px`), `/lab/` (`47/47`), and all 3 embedded v0.6.0 live web apps (incl. playable Anime Card Battles Apex, Auto-Heal + Playbooks + Telemetry, and Ergon v0.6.0).
