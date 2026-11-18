# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its interactive edition. There is no pitch, services page or pricing.

## What is here

- The record: summary, experience, flagship projects, supporting projects, skills, additional
  experience, education — all content locked to the résumé.
- Three captures of the current builds, embedded in the page (`/assets/projects/captures/*-rs-*.png`),
  taken from the apps themselves running locally on 18 November 2026, each with its provenance
  stated beside it: what is shown, what is fixture, and why it is here. The current builds are
  native apps and are not served from this site. The interactive demos of the retired builds
  that used to be served from `/demos/` were removed in the capture pass.
- Vendored parts, their sources and licences: `app/STACK.lock.md` and `app/THIRD-PARTY-LICENSES/`; fonts: Geist and
  Geist Mono (SIL OFL), in `app/public/fonts/`. Square UI is a grammar reference only; no Square UI artwork ships.

## Build

The apex page (`index.html` and `assets/index-*`) is built from `app/`: Vite 8, React 19, TypeScript and Tailwind 4,
made with the house-frontend method. `app/JOB.md` says what the page is for, `app/ROLE-COVERAGE.md` which library part
serves each need, and `app/ALIVE.md` what answers each control. To rebuild: `cd app && npm ci && npm run build`, then copy
`dist/index.html` to the repo root and `dist/assets/index-*` to `assets/` (Pages serves this root). `node
scripts/render-check.mjs` in `app/` is the closing check. Every asset is static; there are no network calls at runtime and
no analytics.
