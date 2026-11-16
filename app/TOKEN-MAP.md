# TOKEN-MAP — old site `--rj-*` (dark, sand/sage) to house tokens (light default, dark a full second theme)
Source of the old values: m-0223/work/build/site-src/src/styles/tokens.css (read 2026-11-10 15:3x ET).
Target: starter/src/index.css <- references/tokens.css (copied to src/tokens.css per SKILL.md Set up).

| old token | old value | house token | light | dark | note |
|---|---|---|---|---|---|
| --rj-ground | #100c0d | --canvas | #f0f2f5 | #0e1013 | page ground |
| --rj-well | #0c0909 | --board | #f5f7fa | #12151a | wells (the ledger track) |
| --rj-panel | #1c1615 | --surface | #ffffff | #181b21 | cards, shell |
| --rj-raise | #201a18 | --raised | #ffffff | #2d323c | raised pill |
| --rj-wash | #221a16 | --track | #eceff5 | #20242c | count chips, track |
| --rj-ink | #ede4d9 | --ink | #13151a | #eceef2 | primary text |
| --rj-ink-muted | #a79a8c | --ink-2 | #616a81 | #9aa1b2 | secondary text |
| --rj-ink-faint | #8c8073 | --ink-3 | #6c717f | #80889a | labels, placeholder |
| --rj-line | #342b26 | --hairline | #e3e7eb | #272b34 | 1 px lines |
| --rj-line-strong | #4d3f36 | --hairline (no 2nd line weight) | — | — | dropped: one hairline |
| --rj-action | #dab696 (sand) | --blue (accent) | #1562fc | #4a86ff | DROPPED sand; one accent (house rule). FLAGGED to owner |
| --rj-accent | #dab696 | --blue | — | — | links, figures, selected tab |
| --rj-state | #606456 (sage) | --pill-active-* | — | — | sage dropped; state uses the house pill tints |
| --rj-scrim | rgba(10,8,8,.78) | (base-ui overlay) | — | — | the one dialog scrim (house dialog) |
| --rj-text-caption | 0.78rem | --text-xs (12 px floor) | — | — | raised to the floor |
| --rj-text-body | 0.94rem | --text-sm (14 px min body) | — | — | |
| --rj-text-head | 1.32rem | --text-ui 15 / page 20 | — | — | |
| --rj-text-display | clamp(2.35rem,4.3vw,3.35rem) | page title 20 + wordmark (display, own size) | — | — | wordmark keeps display size |
| --rj-radius-control | 6px | --radius control 9-10 | — | — | nests inside card 9 |
| --rj-radius-panel | 8px | --radius card 9 | — | — | |
| --rj-radius-plate | 10px | --radius dialog 20 | — | — | |
| --rj-space-1..6 | 8..48 | house spacing scale (tokens.css) | — | — | |
| --rj-motion-tap/swap/enter | 120/200/250 ms | --dur-press / --dur-open / --dur-reveal | — | — | presets, motion.ts |
| --rj-ease | cubic-bezier(.22,1,.36,1) | --ease-house | — | — | |
| --font-sans / --font-mono | Geist / Geist Mono | Geist / Geist Mono (same files) | — | — | fonts carried |

Raw literals left in the surface: none planned. Any literal found later is named here with its reason before it is kept.
Old palette dropped on purpose; Cayleb is asked in the first-renders post whether he wants sand back as a second accent.
