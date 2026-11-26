# cayleb-james2008.github.io

Public interactive resume and project demonstrations for Cayleb Alvarez-James: https://cayleb-james2008.github.io/

The plain PDF at `/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf` is the submission copy, and the site adds keyboard jump navigation (`Cmd+K`) alongside local browser sandboxes.

## What is here

The home page (`/`) holds the summary, stated test-count ledger, experience, selected projects, skills, and education sections locked to the submission PDF.

Interactive browser applications and product pages:

- OpenRO ([project page](/projects/openro.html), [live web app](/demos/open-ro/), [repo](https://github.com/cayleb-james2008/open-ro)): Rust IDE for building, checking, and publishing Roblox Studio games.
- OpenBell ([project page](/projects/openbell.html), [offline sandbox](/demos/openbell/), [repo](https://github.com/cayleb-james2008/openbell)): Rust research and trading workbench for Kalshi 15-minute markets, with risk limits disarmed on every boot.
- Fleet ([project page](/projects/fleet.html), [live preview](/demos/fleet/), [repo](https://github.com/cayleb-james2008/fleet)): Antigravity sidebar plugin for watching and steering multi-agent swarms.
- Ergon ([project page](/projects/ergon.html), [live app](/demos/ergon/), [repo](https://github.com/cayleb-james2008/ergon)): single-binary Rust desk that runs employee workflows inside a sandboxed folder and records SHA-256 receipts.

The Industry AI Suite workbench (`/lab/`) runs ten client-side multi-document review tools with line diffing, clickable `[filename:L##]` citations, SHA-256 provenance, and missing-source draft halts. Fourteen additional project notes sit under `/projects/*.html` using the same House Frontend styling (`site/house/tokens.css`, `base.css`, `project.css`) with Light/Dark selection inside Settings.

Vendored notices and licenses live in `app/STACK.lock.md`, `app/THIRD-PARTY-LICENSES/`, and `vendor/`, using Geist and Geist Mono (SIL OFL).

## Build and verify

```bash
cd app && npm ci && npm run build
node scripts/render-check.mjs
```

Everything serves as static files with zero external network calls unless you add a BYOK API key or connect a local runtime in an app's Settings panel.
