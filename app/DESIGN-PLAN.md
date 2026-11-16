# DESIGN-PLAN — Cayleb résumé apex (Ticket 121, m-0256, seat worker-2)
Written before any code under app/src. Committed as the first commit on house-frontend.

Surface: the apex `/` only (index.html at repo root, built from app/). Shipping widths 1440x900 and 390x844 (the fold sizes).
Ground: light default (#f0f2f5 canvas, #ffffff surface), full dark second theme from the same tokens.
Focal object (defining object): the stated test ledger, a Tremor BarList of the résumé's own test counts, drawn full width
in the hero. Its bars are the numbers the résumé states; no number is derived or rounded.
Action: the person reads the ledger, presses the PDF download, or moves between sections with the index tabs; a demo opens
in its frame and runs; email copy confirms with a Sonner notice.
Payoff: they can answer the six questions of JOB.md from the first screenful.
Left out on purpose: no sidebar, no icon rail, no board, no alert banner, no rows of identical cards in the hero,
no gradient except the single Texture Button (skill exception), no sand/sage palette (old brand palette dropped, flagged to Cayleb),
no dock or island (nothing in this résumé is a live sentence worth keeping in view; a dock would have four places it does not need).
Product token source: the old site's `--rj-*` tokens in
  m-0223/work/build/site-src/src/styles/tokens.css (dark only, sand/sage) — mapped to the house tokens in TOKEN-MAP.md.
Closest real reference: the live site (main e390e9db) captured in worker-2/ref/live-apex.html and worker-1/reference/*.png.
Its CONTENT and its ids and its hash-jump script are carried in; its arrangement is NOT (rule 11).
Frames: first renders 1440 and 390, light and dark (page-<w>-<theme>.png); clip under 60 s (clip.mp4).

REGION MAP (reading order, desktop 1440; phone stacks the same order):
  B1 name row: wordmark + role + PDF Texture button + contact pills (Q1, Q2)   full width, ~200 px
  B2 test ledger: Tremor BarList of the stated counts, the 4,000+ total beside it (Q3)  full width, ~400 px, the defining object
  C  index: Motion Primitives animated tabs to the six sections, each a real anchor (Q4 to Q6 via)   full width, 56 px
  D  summary: the lede, prose, single column 680 px                       (no question; the record's first claim)
  E  experience: dated entries, date in mono above each entry, COSS Badge for the role  (Q5)
  F  selected projects: a 2-column grid of Motion Primitives Morphing Dialog cards with a Kibo Pill for stated status (Q3 detail)
  G  demos: COSS Tabs over three real app frames, each labelled running / fixture (Q4)
  H  skills: COSS Input search that filters the list, then the three groups (Q6)
  I  additional experience + education: two small columns (Q5, Q6)
  J  footer: the PDF line and the email copy (Sonner notice)
Mobile: B1 stacks; the contact list lives in a Vaul drawer behind a button; the ledger keeps its full width; the tab index scrolls
inside its own box; the demo tabs become a stack.

Motion: every value from src/motion.ts and the --dur-*/--ease-house tokens. Cause only: a hover, press and focus on each control;
a bar grows once when the ledger scrolls into view; a tab highlight glides (layoutId); a notice speaks after a copy; no loops
except nothing (no live work on this page). Reduced motion: fades only.

Gates I will run: render-check (product mode), role-coverage, product-rules S1-S7 + A1, motion-source M1, the preservation
checker from worker-1 (once it lands), then unslop + impeccable + design-taste reviews after the pre-polish commit.
