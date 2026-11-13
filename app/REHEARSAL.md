# REHEARSAL — Ticket 121 (m-0256): the handover, and what was not checked

Written by the ticket lead on 2026-11-12 (re-derived attempt 3) from the files in this work folder;
every fact below names the record it comes from, and no frame is counted that a record does not say
was opened. The frontend build judged is **`f6b6107a91ba5e4d66c00a0caa2ce49606286f4f`** (root
`index.html` sha256 `4e0d3cbcba75f7533608f9428697e2563339f67977531681acdd02bd5d392f24`) on branch
`house-frontend`. Commits after it edit only the project documents in `app/` (`JOB.md`,
`ROLE-COVERAGE.md`, `ALIVE.md` and this file), so every served file, the phone take and the UX review
judge the same bytes. This file is committed at `app/REHEARSAL.md` on the branch (documents-only
commit). It is the Gate rev 2 step-7 handover: the closest reference, the captured cases, the gate's
last pass line, each fault → its frame → its fix, the reviewers' findings → the response, and — the
part that matters — the cases that were **not** captured or checked.

## Closest real reference and what changed

- The closest real reference is the live site as the ticket pinned it: <https://cayleb-james2008.github.io/> = `main` `e390e9db79d4af1939f20e276d2ea5f9fd69d55a`. It was captured before any code:
  - rendered DOM `worker-2/ref/live-apex.html` (56 KB) and visible text `worker-2/ref/live-text.txt`
    (186 lines) — named in the committed `app/REFERENCE.md`;
  - stills at both shipping widths `worker-1/reference/live/live-1440.png` (sha256 `e9b6f5b8…`) and
    `worker-1/reference/live/live-390.png` (sha256 `06624e71…`), with the tab and demo states beside
    them; hashes in `worker-1/reference/SHA256SUMS.txt`;
  - the served tree copy under `runs/baseline-site/` and `worker-1/live/` (`index.html`, the built
    js/css, `resume.html`, the demo index pages), used by the preservation check.
- **Carried in, byte for byte:** every section id and every link in the rendered text, the résumé PDF,
  the demo builds, and the page's hash-jump script. **Replaced:** the arrangement (the region map is
  composed fresh; the skill's rule 11 forbids copying the reference's layout) and the look. The old
  dark sand/sage `--rj-*` tokens were mapped into the house tokens in the committed
  `app/TOKEN-MAP.md`; the written plan is the committed `app/DESIGN-PLAN.md`, committed before any
  source (`888c5e2`, the branch's first commit; `gate-repo.mjs` R7 proves the order).
- The owner's rulings of 10 Nov (relayed by Nox) then re-skinned the 17 project pages, the projects
  index, the lab and the three demo apps: their page bodies stay byte-identical to the old pages, and
  the recorded screens and the PDFs were left as recorded on purpose.
- The two stills-beside-the-reference at both widths, before any motion, are the four
  `first-renders/page-{1440,390}-{light,dark}.png` pictures of the first build (`fed8fe0`), whose
  manifest records the capture; the résumé page's pictures were taken before its first polish.

## Captured cases

Every capture below was taken from the running build and is bound in its manifest to the commit
named; the "opened" facts are the manifest's own `opened_by` records, quoted — they are not
reconstructions.

**Round 1 — the résumé page, pre-polish build `fed8fe0551007e3cd6979fa8766d4a7f75cd3a8b`**
(`first-renders/MANIFEST.json`, written 2026-11-10T22:33:20Z):

| frame | width | look | sha256 | opened |
|---|---|---|---|---|
| `first-renders/page-1440-light.png` | 1440 | light | `c90217a2aea7…` | lead, read_image on every region 2026-11-10 17:30-17:36 ET, six 1440 x 1300 segments |
| `first-renders/page-1440-dark.png` | 1440 | dark | `74459127088a…` | same read, six segments |
| `first-renders/page-390-light.png` | 390 | light | `98898576f327…` | lead, read_image, two sheets of eight 390 x 1600 chunks |
| `first-renders/page-390-dark.png` | 390 | dark | `3e042390aec5…` | same read |
| `first-renders/clip.mp4` | 1440 then 390 | both | `3eda79683063…`, 40.04 s, h264 | lead: ffprobe and a 16-frame contact sheet at 2.5 s steps, 26 tour steps logged ok in `clip-steps.log` |

**Round 2 — the re-skinned surfaces, pre-polish build `a66af2e674641c5690e42e6a653b0fd4df322e73`**
(`first-renders-2/MANIFEST.json`, written 2026-11-11T02:04:51Z): 16 full-page pictures —
`project-sophos-`, `projects-index-`, `lab-` and `demos-` at 1440 and 390, light and dark (every sha256
in the manifest; the files were re-hashed while writing this file and all match) — and the 54.36 s
`clip.mp4` (`2662c3bebb67…`). The manifest's `opened_by` says: lead, read_image on composites of
every picture at 2026-11-10 21:00-21:08 ET (project page 1440 side by side at 50 percent; 390 as three
390 x 1600 chunks per theme; the index 1440 side by side and 390 in chunks; the lab 1440 side by side
and 390 in two 390 x 1100 chunks per theme; the demos sheets at both sizes), plus an 18-frame contact
sheet of the clip at 3 s steps and one frame at 7.8 s at full size (the chart with its hover band).
Both rounds were posted in the ticket thread before the polish of their surfaces (`first-renders` ts
1794350029.227219; `first-renders-2` ts 1794362708.900789 and 1794362717.680519; an outcome-free
content post each).

**The final take — branch build `f6b6107`, phone VM** (`video/manifest.json`, written
2026-11-11T21:49:02Z): `video/phone-walkthrough.mp4`, 141.98 s, 780 x 1688 h264, 8,519 frames, sha256
`cc4d92636cf21b188b8d62925f4be3d7513ab5bd4621b1ed6894a07888af05f4`. One continuous take of a person
using the site on the Android 15 emulator `emulator-5611`, Chrome 124.0.6367.219, real touch input
through the Android input stack; 25 flows, none broken; the phone's own page fetched 14 served files
and all 14 match the build's dist (`every_served_asset_matches_dist: true`). It was posted in the
ticket thread as one content message at ts 1794435390.234829. It was watched end to end by a fresh
reviewer (`polish/ux-review.md`, "Final-head confirmation and video watch": every 2 s across 0-142 s
plus exact-seek frames, scene-change detection, an independent clock check, the 14 served files
re-hashed, all 25 flows matched against the manifest).

**Widths and states captured:** 1440 x 900 and 390 x 844, both themes, for the résumé page and for the
re-skinned surfaces; 320 wide was measured for overflow, masthead and contents line but not looked at
state by state. Interactions captured by evidence: the section index, the skills filter, the theme
switch, the PDF download, the Contact sheet, the three live demo frames, the Ergon hold-to-approve
(a tap sends nothing; a 1.5 s hold records; Decisions shows it; reset brings the card back), the
projects index, a project page's contents line and theme carry, and the lab's journeys.

## Gate

- **The build's own capture pass**, quoted from `runs/render-check-final.txt` (final head, 21:47-21:51Z
  on 11 Nov, `RC_EXIT=0`): `render-check PASSED (product): role coverage, one source for motion
  values, the job's questions in the first fold at 1440 x 900 and 390 x 844, spacing S1 to S5 and S7
  at both sizes, S6 at three laptop sizes, every control in the first screenful answers hover, press
  and focus, no inert control, 4 renders, 2 reduced-motion runs …`.
- **The cold `bash verify.sh`** on branch head `ace48f3220f0e4fd2d40f5d761cc8454549c522b` (final build
  `f6b6107`): `RESULT: 72 PASS, 0 FAIL` / `VERIFY: all checks pass`, exit 0, run started
  2026-11-11T22:18:37Z and took 8 m 20.9 s (`runs/verify-cold-1.log`, `runs/verify-results-cold-1.txt`);
  a second identical cold run started 22:27:13Z (`runs/verify-results-cold-2.txt`). The run clones the
  branch anonymously, installs and builds cold, runs the render check, preservation, the page and demo
  gates, opens the built page in a fresh Chromium profile, and reads the ticket thread back.

## Faults → frame → fix

Every fault below was seen on a captured frame or in the running build; the reference names the
record. Where nothing was changed, the reason is given instead.

- **The press states of a hand-wired disclosure** — the build's own render check rejected a head
  where the folds' `aria-expanded` was written in a screen rather than by the component; fix `8bd7335`
  (set in the Expandable part). The rejected head was never shipped.
- **The index tabs painted over the open Contact sheet** — found by watching a phone take; fixed in
  `970d58a` / `498ec8b` (the sheet and its scrim above the page, z-50 / z-40). The UX review re-ran the
  Contact sheet at 390 on the final build (F3, WORKS).
- **A date wrapped in a span split a text node** — `runs/gate-pages-p2-1.txt` FAIL PG2: 17 lines of
  the index's page text not found, first "cayleb-james2008/ergon@39d6ef3 …"; the lead changed the fix
  (kept the date as one text node), not the gate; `runs/gate-pages-p2-2.txt` PASS PG2 / PG3.
- **A chosen lab row's number was 4.36:1** — `runs/gate-pages-p2-1.txt` FAIL PG3, `span "01" 4.36 <
  4.5` at 1440 and 390 light; fixed and re-measured: `runs/gate-pages-p2-2.txt` PASS with 5,570 text
  elements measured over 19 pages x 2 widths x 2 themes.
- **The OpenBell chart ticks** — an earlier rule meant to move the chart ticks matched nothing in
  Recharts' structure; the replacement is measured: overlapping label pairs 2 / 1 / 1 before, 0 / 0 / 0
  after (report.md, "Polish passes — how they ran").
- **A take's clock** — one take's clock search mistook the PDF viewer's 1.5 s black opening for the
  dark-theme switch (offset 29.1 s instead of 4.9 s); `tools/fix-video-clock.mjs` re-derives a take's
  clock and the final take's was found with the fixed search. The take was replaced, not edited.
- **Pass 1 examples, each reproduced on the pre-fix build before it was changed**
  (`tools/repro-A|B|C.mjs`, `polish/findings.json`): dead space beside the long project cards
  (U1: widest text-picture gap 320 / 384 / 336 px before, 144 / 88 / 88 px after); uneven index-tab
  gaps, clipped at 390 / 320 (U2); the Ergon frame cropping Hold to approve (U3, fixed by drawing each
  demo at its own 1280 x 800). 43 findings in pass 1: 40 fixed, 3 dropped with a reason.
- **Pass 2 examples** (`tools/repro-2.mjs`, `polish/findings-2.json`): the demo frames drawn at
  1280 px scaled to 1038 px so 12 px text showed as 9.7 px (U2-1, fixed at the apps' own size);
  the lab's "Explore recorded result" button touching the paragraph above it (U2-2); the project
  cards' meta line leaving "2026" alone on a second line in 12 of 17 cards (U2-3). 69 findings in
  pass 2: 52 fixed, 17 dropped with a reason or left to the owner (each names which, and why, in the
  record).

## Reviewer findings → response

All reviewer records begin `REVIEWER:` / `INPUTS READ:` / `NOT GIVEN:` and state their restricted
inputs; none of them built, edited or planned the site (the full records are under `polish/`).

- **Pass 1, résumé page:**
  - `polish/unslop-review.md` — "REVIEWER: unslop-fresh-reviewer (Claude, did not build, edit or plan
    the page)"; "NOT GIVEN: builder notes, plan, report, REHEARSAL". Findings U1-U10.
  - `polish/gate-fresh-eye.md` — "REVIEWER: gate-fresh-eye-reviewer (model claude-sonnet-5-5; did not
    build, edit or plan the page)"; "NOT GIVEN: builder notes, plan, report, REHEARSAL". Findings
    G1-G11.
  - `polish/impeccable-taste-review.md` — "REVIEWER: impeccable-fresh-reviewer +
    design-taste-fresh-reviewer (two separate fresh Claude Sonnet 5.5 subagents, one skill each;
    neither built, edited or planned the page)"; same NOT GIVEN. Findings I1-I10, T1-T12.
  - Response: all 43 in `polish/findings.json`; 40 fixed in commits named by `fix_commit` after the
    pre-polish build, 3 dropped with a reason (G10 the one primary action per screen; I9 the close
    target already meets the reviewer's own bar; T11 the card is the settled house look).
- **Pass 2, the re-skinned pages, lab and apps:** `polish/unslop-review-2.md`,
  `polish/gate-fresh-eye-2.md`, `polish/impeccable-taste-review-2.md` — same three-line shape, each
  states "did not build, edit or plan the pages" and its restricted inputs. Response: all 69 in
  `polish/findings-2.json`; 52 fixed, 17 dropped with a reason or left to the owner (8 carry a
  `remaining` explanation and are listed for the owner in report.md).
- **UX quality review:** `polish/ux-review.md` — "REVIEWER: ux-fresh-reviewer-2, Claude Sonnet 5.5;
  fresh: did not build, edit or plan the site; commissioned by the ticket lead under Ticket 121, not
  by Nox"; "NOT GIVEN: builder notes, plan, report, REHEARSAL". 25 flows: 22 WORK, 3 BROKEN (the
  résumé page links to none of the 17 project pages, their index or the lab; no project page links
  back to the index; the footers have no link back to the résumé — all owner content decisions,
  left unchanged and named to the owner); 14 findings Y1-Y14 plus Z1-Z2 from the final-head re-check;
  three changes landed on the final build (the "how it works" dialog's accessible name and
  description; the experience folds say whether they are open; the skills filter shows the browser's
  clear mark) and the rest are named for the owner. The first round's record is kept as
  `polish/ux-review-first-round.md`.

## Assumptions

- The ticket's contract is the site as pinned (`main` `e390e9db`). `main` has since moved by other
  tickets' work; this branch does not contain it, and the merged result is deliberately not built here
  — the reconcile is the first step of go-live, on the owner's own yes (report.md, "Main has moved").
- The reviewers were fresh (not builders) and their inputs were restricted packs, as each record says.
- The phone take is one continuous take; two address changes in it (the projects index and the lab)
  are the tab being sent to an address through DevTools, because no résumé page links to those pages —
  it says so in the manifest's `claim`. Every other step is a real touch.
- The 17 project pages' bodies, the recorded screens and the PDFs are carried on purpose (owner
  rulings); they are not defects.
- The build judged is `f6b6107`; commits after it touch only `app/` project documents.

## Unresolved

- The three broken flows the UX review named sit in the owner's page content; they were left for him
  to decide (report.md "For Cayleb", item 2).
- The findings left to the owner (the `remaining` field of 8 pass-2 findings) are listed in report.md;
  none was silently redesigned.
- Nox's grade, the owner/Nox approval of the numbered polish lists, and the Nox-commissioned UX
  quality review were still outstanding when this file was written; the finish pack records exactly
  what is on record and what is owed.
- The reconcile with the moved `main` (three public-image pull requests merged after the pin) is not
  done; it changes the baseline of every gate and of the evidence, so it is go-live step 1.
- One take of the previous build was set aside (`runs/video-take-*`) and posted nowhere; only the
  final-build take is delivered.

## Not checked / Not captured

- **No Windows VM take.** The sandbox has no `/dev/kvm` and `fleet_vm` shows no Windows host; a
  software-emulated rig exists (`worker-4/RIG.md`) but was not run on the final build. The phone VM
  take stands; the 1440 face was exercised in headless Chromium (the clips, both reviewer rounds, the
  render check and the gates), never on a recorded desktop take.
- **Real devices and other browsers.** The phone is an Android emulator running Chrome
  124.0.6367.219: no iOS, no real phone, no Firefox, no Safari; and playback of the video on
  Cayleb's own phone from Slack was not tried.
- **The 15 other project pages** were gated page by page (text, rules, contrast, both widths and
  themes) and seen by the reviewers mainly through the shared skin plus Sophos and Industry AI Suite;
  they were not each looked at state by state.
- **320 wide** was measured (overflow, masthead, contents line) but not looked at state by state.
- **Performance** (largest paint, layout shift, blocking time) was not measured.
- **Interaction and state gaps:** pressed (`:active`) states mid-hold in the apps; the mailto
  hand-off to a real mail client; offline and slow-network states; the Ergon app's Settings page; the
  second UX reviewer did not re-run the Ergon try-it at 390 touch or by keyboard on the final build,
  nor Y6 and the carried-app findings; a real thumb on the 11 px clear mark (Z1) was not tried.
- **The merged result with the moved `main`** was not built, not gated and not looked at.
- **Nox's answers** on the approval envelope, the grade-first handoff and the moved main: none
  received at the time of writing.
- **The cold `verify.sh` pass depends on GitHub being reachable** and on the branch head staying
  `ace48f3` or moving only by commits to `app/` project documents (the record gates allow exactly
  that; a served-file change would make the take and the UX review stale and the gate says so).
