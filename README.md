# cayleb-james2008.github.io — the résumé record

The one public résumé link: **https://cayleb-james2008.github.io/**

This is the interactive edition of Cayleb Alvarez-James's résumé. The plain PDF at
`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy; this site is its
interactive edition. No pitch, no services, no pricing.

## What is here

- The record: summary, experience, flagship projects, supporting projects, skills, additional
  experience, education — all content locked to the résumé (Ticket 045/086 content law).
- Three live demos, served from `/demos/<name>/` and embedded in the page. They are real app
  builds running in the browser; the recordings under `/demos/*.mp4` are supporting evidence only.
  - `demos/ergon/` — Ergon front set (Ticket 068), with its own fixture reply engine labelled in
    the app.
  - `demos/fleet/` — the DSH Fleet dashboard, a captured snapshot (`captured 02:35:16Z`) whose
    interactions run in the browser.
  - `demos/openbell/` — OpenBell watchtower (Ticket 070), sample data labelled DEMO/STALE by the
    app itself.
- Vendored parts with provenance: Motion Primitives (MIT), Recharts (MIT), Geist fonts (OFL).
  Kitchen patterns are original re-implementations (upstream has no licence file — named gap).
  Square UI is a grammar reference only; no Square UI bytes ship. Full manifest:
  `plan/GATE1-SOURCING.md` in the mission record for Ticket 101 (fleet mission m-0223).

## Build

Vite + React 19 + TypeScript; built 2026-11-09. Every asset is static; there are no network calls
at runtime and no analytics.
