# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- **The record** (`/`): summary, stated test-count ledger, experience, selected projects, skills, additional experience, and education — locked to the submission PDF.
- **Three flagship product pages & interactive fixture demos**:
  - **Ergon v0.3.0** (`/projects/ergon.html`, live demo at `/demos/ergon/`, source at `github.com/cayleb-james2008/ergon`)
  - **Open-Ro Studio v0.3.0** (`/projects/openro.html`, live demo at `/demos/open-ro/`, source at `github.com/cayleb-james2008/open-ro`)
  - **DSH Fleet v0.3.0** (`/projects/dsh-fleet.html`, live demo at `/demos/dsh-fleet/`, source at `github.com/cayleb-james2008/dsh-fleet`)
  Each live demo runs the v0.3.0 House Frontend UI against self-contained in-browser fixture data (`fixture demo` pill visible in frame, zero third-party network calls), paired with full-resolution v0.3.0 light and dark captures in `/assets/projects/captures/`.
- **Fourteen supporting project case studies & the Industry AI Suite Workbench** (`/projects/*.html`, `/lab/`, `/resume.html`): styled in the same House Frontend token system (`site/house/tokens.css`, `base.css`, `project.css`).
- **Vendored parts, their sources and licences**: `app/STACK.lock.md`, `app/THIRD-PARTY-LICENSES/`, and `vendor/`; fonts: Geist and Geist Mono (SIL OFL) in `/fonts/` and `app/public/fonts/`. Square UI is a grammar reference only; no Square UI artwork ships.

## Build & Verification

Everything lives on `main` as a single unified source-and-Pages repository:

```bash
cd app && npm ci && npm run build          # tsc -b && vite build → updates root index.html + assets/index-* AND stages app/dist/
node scripts/render-check.mjs              # House Frontend gate (1440/390 light/dark + reduced-motion, contrast, spacing, inert sweep)
```

Every asset is static; there are zero runtime third-party network calls and no analytics.
