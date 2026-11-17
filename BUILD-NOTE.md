# BUILD NOTE — résumé site polish + four product pages (16 November 2026)

Branch: `polish/product-pages` (pushed; NOT main — the site is live, merge is Nox's call after the checker).

## Which repo is canonical, and why

- **Canonical: `cayleb-james2008/cayleb-james2008.github.io`** — its README states it is "The one public
  résumé link: https://cayleb-james2008.github.io/". It is the GitHub Pages site: a Vite/React app in `app/`
  whose build is copied to the repo root (`index.html` + `assets/index-*`), alongside static house-styled
  pages (`projects/*.html`, `resume.html`, `demos/`, `site/house/*.css`).
- `cayleb-james2008/agentic-resume` is a separate companion portfolio/lab site generated from a
  `content.json` ("Sign-off" look). It is not the live résumé and was not touched.

## Base branch — read this before merging

The apex app source (`app/`) exists **only** on `origin/house-frontend` (@ 98ada78); `main` carries only
built output. The two branches have diverged (merge base e390e9d): 23 main-only commits (13 Nov OpenBell
dashboard snapshots, m-0270 project-page rewrites) vs 35 house-frontend-only commits (polish2 / Gate rev 2).
This branch was therefore cut from `origin/house-frontend`. Merging back needs a deliberate decision about
the divergence — it is not a fast-forward, and the 13 Nov main-only snapshot commits are not in this branch.

## Quality pass

The site on `house-frontend` already implements the house frontend system (design-pack skill: Lumen
direction — layered solid panels, quiet borders, type-led, no gradients/glows, no invented vanity numbers),
so the pass was verification, not redesign:

- Baseline `app/scripts/render-check.mjs` (the house gate: JOB.md first-screenful answers, nothing inert,
  spacing rules, control states, motion tokens, contrast ≥ 4.5:1, no overflow at 1440×900 and 390×844,
  light + dark): **one failing viewport (1440-light) with 3 `net::ERR_ABORTED` request failures** for the
  app bundle and `/demos/ergon/`; every other viewport/theme passed. Post-change run: see "Render-check"
  below.
- No résumé fact was changed anywhere. `app/src/content.ts` résumé strings are untouched; the only home
  change is additive (below), and every new string is logged in `app/NEW-TEXT.md` for the preservation
  checker, per the repo's own convention.

## Résumé home — clickable product cards

At the top of the Selected projects content column: a labelled block ("the four products, in full") with
four whole-card links (`app/src/content.ts` `productPages`, rendered in `app/src/sections/Projects.tsx`):
poster image (the project's real capture), name, one-line pitch, "the full product page ↗". All four hrefs
verified live in the rendered page: `/projects/ergon.html`, `/projects/openbell.html`,
`/projects/openro.html`, `/projects/dsh-fleet.html`. Every existing project record below is intact.
Open-Ro Studio gets a card + page only — it is not a résumé record and none was invented for it.

## The four product pages

All four are static pages in `projects/`, composed entirely from the existing house subpage system
(`site/house/tokens.css`, `base.css`, `project.css` — sub-masthead, hero, checked-status line, index nav,
flow + capture figures, label-column prose, limits section, evidence aside, sub-footer). No new CSS.
Each page: hero + who it's for → the problem → what it does (real capabilities only) → how it works →
where it stands (honest status) → what is not verified → path back (résumé / live demo / repo).

- **Ergon** (`projects/ergon.html`, replaces the 9 Nov case study at the same URL). Grounded in
  `cayleb-james2008/ergon` README @ **f0a5478** (branch `completion/ergon-live`, 15 Nov 2026) + the résumé's
  own Ergon record. Covers: per-employee agents, role learning, the send/spend/change approval gate,
  morning brief, shared company database on one on-site machine, escalation-only tickets, agent-maintained
  definitions, shared skill library, formula/blueprints + per-company private suite repo, staging-to-
  promotion, zero-trust access design, simulation programme (Meridian Van Line, Bayside Dental, Northgate
  Law; since 4 Nov 2026), 622 automated tests. Status framing: built and verified product build, in
  development, **no customers, no deployment**; the day-job employer stated as proposed-only / not authorised, exactly as
  the repo and résumé state it. (17 Nov 2026: the employer's name was later removed from all public copy on the owner's order — see RHL-STRIP record in the job-hunt workspace.)
- **OpenBell** (`projects/openbell.html`, replaces the 9 Nov two-desk case study — that framing is retired
  in the current repo). Grounded in `cayleb-james2008/openbell` README @ **ff65104** (15 Nov 2026), system
  state 14 Nov 2026. Covers: one slot per 15-minute Kalshi market, even equity split, 100%-of-share slots,
  strike rule, decision server + driver, the single signing gateway (final-60s entry block, bounded
  marketable-entry exception with ceiling, caps, halt gate, Ed25519/RSA-PSS, key from environment),
  venue-proven accounting (venue wins disagreements; exit done only on venue-proven fill), −10% day guard,
  take-profit only ≥ 80¢ entries, shadow programmes, weight-space research. Test figures used **exactly as
  documented**: 137/137 + 14/14 driver suites; gateway 21/21, 50/50, 15/15, 6/6, 6/6. The repo's own status
  is stated on the page: desk halted by its own venue guard after a losing day; launch parked pending
  independent debugging.
- **Open-Ro Studio** (`projects/openro.html`, NEW). Grounded in `cayleb-james2008/open-ro` README @
  **10f2d60** (10 Nov 2026) — the repo's own spelling "Open-Ro Studio" is used (slug stays `openro`).
  Covers: local-first, no account/telemetry, Ollama/llama.cpp first + optional own-key routes, Studio
  control plane, build→test→inspect→repair loop, Blender pipeline (≤10k-tri MeshPart decimation, collision
  proxies), MCP pool with LRU hibernation, permissions before action, proposals reviewed before landing,
  Windows + native Linux. Status as the repo states it: 0.1.0 verified foundation, milestones 1–5 complete,
  649 tests in 61 files, "early development". Screenshots are the repo's own (`docs/assets/`), copied to
  `assets/projects/captures/openro-{chat,workspace,models}.png`; the workspace shot is the page figure and
  the home-card poster.
- **DSH Fleet** (`projects/dsh-fleet.html`, replaces the 9 Nov case study at the same URL). Grounded in
  `~/workspace/goals/deepseek-harness-fleet-plugin/DSH-FLEET.md` (living definition, updated 12 Nov 2026)
  + public `cayleb-james2008/dsh-fleet-core` README @ **2aec462** (11 Nov 2026). Covers: tickets as the only
  intake (goal/context/done-when; one outcome — done+evidence / blocked+need / error+broke), dynamic swarms
  capped at 6 concurrent, maker-never-checker with fresh-context checkers running the real output, model
  ladder behind one config point, PRs only, gated self-improvement (Harness²/Omni Loop), the core's three
  mechanisms (admission control, checker gate, provider rotation), 32 dependency-free core tests, "more
  than a hundred ticket missions" (attributed on-page to the fleet's own ticket record). Status honesty:
  the page states the fleet is currently paused for model usage.

`projects/index.html`: the Ergon / OpenBell / DSH Fleet cards refreshed to the new pages and SHAs, an
Open-Ro Studio card added (18 pages), lead text updated.

## Left out as unverifiable or deliberately omitted

- **OpenBell money figures**: the repo's goal sentence and all balance/P&L numbers were kept off the page —
  no profit, return or growth claim appears anywhere. (The résumé's separate "Nasdaq net-positive" line was
  likewise not carried onto the page.)
- **Ergon**: no customers, revenue, pricing or deployment claims — none exist. Prices are stated as unset.
- **DSH Fleet**: mission count is the fleet's own record, flagged as such on the page; the full plugin repo
  is private, so only the public core is linked as inspectable evidence.
- **Open-Ro**: no download/user numbers — the project publishes none.
- Ergon and OpenBell repos are private; their pages say "private repository (checked locally)" in the
  evidence aside instead of linking a repo that would 404.

## Build / preview commands

```bash
cd app && npm ci && npm run build          # tsc --noEmit && vite build → app/dist
cp app/dist/index.html index.html          # publish per repo README flow
rm -f assets/index-*.js assets/index-*.css
cp app/dist/assets/index-* assets/
python3 -m http.server 8137                # preview the repo root (the built site)
node app/scripts/render-check.mjs          # house gate (serves app/dist itself)
```

## Render-check

- Baseline (before changes): FAILED with 3 problems — all `net::ERR_ABORTED` same-origin request failures
  in the 1440-light pass only (app bundle + `/demos/ergon/`); 1440-dark, 390-light, 390-dark and both
  reduced-motion passes OK; contrast lowest 4.82:1 (light) / 6.66:1 (dark); spacing rules all 0.
- After changes: FAILED with 1 problem — the same `net::ERR_ABORTED` bundle-fetch abort, this time in the
  390-light pass. Same failure class as baseline (3 → 1, different viewport each run), i.e. a flaky abort in
  the check's own local serving/reload loop, not a regression: in that same viewport all 24 controls pressed
  with effect, first-fold questions all answered, spacing rules all 0, and every other viewport/theme passed.

## Screenshots

`SHOTS/` in this working tree (deliberately not committed — committing them would publish ~7 MB of
full-page PNGs to the live site on merge) — full-page renders from the local preview of the built site
(Playwright, Chromium):
`home-desktop.png` (1440×8409), `home-phone.png` (390×14628), `ergon-desktop.png` (1440×3891),
`ergon-phone.png` (390×5400), `openbell-desktop.png` (1440×3813), `openbell-phone.png` (390×5208),
`openro-desktop.png` (1440×3511), `openro-phone.png` (390×4770), `dsh-fleet-desktop.png` (1440×3533),
`dsh-fleet-phone.png` (390×5020). Home, Ergon (desktop) and Open-Ro (phone) were visually inspected:
card block renders with all four real captures and pitches; pages render in the house system with no
overflow at either width.
