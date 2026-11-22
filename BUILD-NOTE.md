# BUILD NOTE — Unified House Frontend + v0.3.0 Product Pages & Fixture Demos (21 November 2026)

Branch: `main` (single unified branch carrying `app/`, `demos/`, `projects/`, `lab/`, `resume.html`, and the built GitHub Pages root).

## Canonical repository & branch reconciliation

- **Canonical:** `cayleb-james2008/cayleb-james2008.github.io` (`https://cayleb-james2008.github.io/`).
- Reconciled the earlier `main` / `house-frontend` / `polish/product-pages` split onto `main`:
  - Preserved `main`'s 18 November 2026 résumé text and submission PDF (`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf`) verbatim.
  - Restored the House Frontend token system (`Geist` + `Geist Mono` `.woff2`/`.ttf`, light-default + `prefers-color-scheme: dark` + `localStorage.theme` parity, layered solid surfaces, `>= 4.5:1` contrast, `>= 12px` floor) across `app/`, all 18 `/projects/*.html` pages, `/demos/{ergon,open-ro,dsh-fleet}/`, `/lab/`, and `/resume.html`.
  - Wired `app/vite.config.ts` (`stageAndPublishSite`) so `cd app && npm run build` updates root `index.html` and `assets/index-*` directly while staging static directories into `app/dist/` for `render-check.mjs`.

## Three flagship v0.3.0 product pages & live fixture demos

- **Ergon v0.3.0** (`/projects/ergon.html`, `/demos/ergon/`, `github.com/cayleb-james2008/ergon`): single-binary Rust + Rune personal employee-agent workspace with memory ledger, Rune skill suite, Chat · Today · Work Graph views, and visible `fixture demo` badge.
- **Open-Ro Studio v0.3.0** (`/projects/openro.html`, `/demos/open-ro/`, `github.com/cayleb-james2008/open-ro`): single-binary Rust + Rune Game Builder Studio Workbench for Roblox with Starter Blueprints, Studio Build Trace + Playtest Verdict, In Your Game Explorer shelf, one-click Undo, and visible `fixture demo` badge.
- **DSH Fleet v0.3.0** (`/projects/dsh-fleet.html`, `/demos/dsh-fleet/`, `github.com/cayleb-james2008/dsh-fleet`): single-binary Rust + Rune Mission Control for parallel coding agents with mechanical check receipts, Tremor outcome tracker, Needs-you inbox, and visible `fixture demo` badge.

## Deterministic `render-check.mjs`

- Fixed directory `index.html` resolution in `app/scripts/render-check.mjs` (so `/demos/<slug>/` serves `dist/demos/<slug>/index.html` rather than falling back to the SPA root), added HTTP `206` Range support and in-memory static caching, cleared `localStorage`/`sessionStorage` across `checkInert` reloads, and guarded teardown `net::ERR_ABORTED` events during page reloads.
- `node app/scripts/render-check.mjs` passes deterministically across consecutive runs on `1440-light`, `1440-dark`, `390-light`, `390-dark`, `1440-reduced`, and `390-reduced`.
