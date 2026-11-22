# BUILD NOTE — Unified House Frontend + v0.5.0 Multi-Document `/lab/` Workbench & Live Web Apps (22 November 2026)

Branch: `main` (single unified branch carrying `app/`, `demos/`, `projects/`, `lab/`, `resume.html`, and the built GitHub Pages root).

## Canonical repository & architecture

- **Canonical:** `cayleb-james2008/cayleb-james2008.github.io` (`https://cayleb-james2008.github.io/`).
- Preserves `main`'s 18 November 2026 résumé text and submission PDF (`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf`) verbatim.
- Unified House Frontend token system (`Geist` + `Geist Mono` `.woff2`/`.ttf`, light-default + `prefers-color-scheme: dark` + `localStorage.theme` parity with Light/Dark Appearance tucked cleanly inside the Settings popover across every page, `>= 4.5:1` contrast, `>= 12px` floor) plus Global `Cmd+K` Quick Jump across home, product pages, live web apps, and `/lab/`.
- `app/vite.config.ts` (`stageAndPublishSite`) updates root `index.html` and `assets/index-*` directly while staging static directories into `app/dist/` for `render-check.mjs`.

## Interactive v0.5.x web apps & `/lab/` workbench

- **Ergon v0.5.0** (`/projects/ergon.html`, `/demos/ergon/`, `github.com/cayleb-james2008/ergon`): single-binary Rust agent shell (`12` built-in workflows, FTS5 search, live SSE event stream, custom Workflow Builder, multi-workspace isolation, client-side IndexedDB + CSV/Markdown/JSON analyzer, approval gating, optional BYOK LLM & local server). Scale-verified at 5,000 receipts + 500 files (`GET /api/search` `8.87 ms` p95, `51.64 MB` RSS, `28/28` fuzz pass).
- **Open-Ro Studio v0.5.1** (`/projects/openro.html`, `/demos/open-ro/`, `github.com/cayleb-james2008/open-ro`): real Roblox Place & parametric Luau studio (`22` Roblox game systems, live Luau static analyzer & Quick-Fix, playable stage preview, `.rbxlx` import/export, 32-step Undo/Redo checkpoints, optional BYOK LLM & local server). Scale-verified at 500 Instances + 50 Luau scripts (`GET /api/export/rbxlx` `3.42 ms`, `53.01 MB` RSS, `16/16` XML/XXE fuzz pass).
- **DSH Fleet v0.5.0** (`/projects/dsh-fleet.html`, `/demos/dsh-fleet/`, `github.com/cayleb-james2008/dsh-fleet`): real parallel agent worktree orchestration (DAG dependency & cycle detection, automated routing rules & Policy Tester, side-by-side multi-session compare, Web Worker sandboxed check runner catching failing checks in `Needs you` -> patch -> exit-0 merge onto `main`, optional BYOK LLM & local server). Scale-verified at 2,000 sessions + 50k transcript lines + 1,000-node DAG (`4.05 ms` / `3.91 ms` cycle, `58.18 MB` RSS, `21/21` policy fuzz pass).
- **Industry AI Suite Workbench (`/lab/`)**: 10 real client-side document review workflows supporting multi-file batch upload, cross-document reconciliation & LCS-DP diffing, clickable `[filename:L##]` source jumps, Custom Rule Pack Builder (`localStorage`), 4-stage SHA-256 Evidence Provenance Chain, `.md`/`.json`/`.csv` exports, `Cmd+K`, `j`/`k` keyboard navigation, and optional BYOK LLM (`sessionStorage`).

## Deterministic verification

- `node app/scripts/render-check.mjs` (directory `index.html` resolution, HTTP `206` Range support, `localStorage` reset across `checkInert`, teardown `net::ERR_ABORTED` guards) passes consecutively across `1440-light`, `1440-dark`, `390-light`, `390-dark`, `1440-reduced`, and `390-reduced`.
- Full-site sweep covers `24` routes × `2` schemes × `4` widths (`320`/`390`/`768`/`1440px`), `/lab/` (`47/47`), and all 3 embedded live web apps (`105/105`).
