# ALIVE — the inventory of every interactive or changing thing (SKILL.md step 7). Values come only from src/motion.ts and the --dur/--ease tokens.

Columns: Thing | Hover | Press | Focus | Change | Arrival | Live work | Part | Preset

| Thing | Hover | Press | Focus | Change | Arrival | Live work | Part | Preset |
|---|---|---|---|---|---|---|---|---|
| Copy email button (masthead, an icon beside the address) | fill shifts (COSS Button outline) | shadow and fill settle (COSS Button press) | focus ring | a toast says the address was copied or could not be | - | - | COSS Button, Sonner toast | duration-(--dur-press) on the button; toast enter from Sonner |
| Download PDF (texture button; the link fills the whole slab) | a light veil over the slab | the veil darkens and the slab settles to 0.98 scale (motion-safe:active) | focus ring | the browser downloads the file | - | - | Cult Texture Button | duration-(--dur-press) |
| Settings popover & Appearance switch | fill shifts (COSS Button outline) | fill darkens | focus ring | opens the Settings popover containing the Light/Dark Segmented Control; switching cross-fades via View Transition (`--dur-swap`, `--ease-house`, instant under reduced motion) and persists in `localStorage.theme` | - | - | COSS Button, Popover, COSS Segmented Control | view transition, `--dur-swap`, `--ease-house` |
| Contact drawer trigger (phone only) | fill shift | fill darkens | focus ring | a Vaul sheet rises from the bottom | - | - | Vaul Drawer | Vaul default spring (library) |
| Index tabs (seven anchors) | text colour shifts to ink | fill darkens (bg-track) | focus ring | the page scrolls to the section, the address stays as it was, the highlight glides to the chosen tab and the tab says it is current (aria-current) | - | - | Motion Primitives Animated Background | glide |
| Quick jump command palette (`Cmd+K` / `Ctrl+K`) | fill shifts (COSS Button outline) | fill darkens | focus ring | opens the searchable Command dialog to jump to live apps, `/lab/`, project pages, résumé sections, or actions; `Escape` closes | - | - | COSS Button, COSS Kbd, Command Dialog (`cmdk`) | duration-(--dur-press); instant under reduced motion |
| Experience entry fold | chevron colour | fill darkens | focus ring | entry folds to its line; chevron turns; the trigger says whether it is open (aria-expanded) | - | - | Cult Expandable | transitionDuration dur.enter, fade preset |
| Project "how it works" trigger | text colour | fill darkens | focus ring | the card grows into its steps | - | - | Motion Primitives Morphing Dialog | open |
| Dialog close | icon colour and fill | fill darkens | focus ring | the dialog shrinks back into its card | - | - | Motion Primitives Morphing Dialog | open |
| Live app tabs (three) | text colour | fill darkens | focus ring | active tab highlight, its state word changes (running / interactive) and the panel fades in | - | - | COSS Tabs, Motion | reveal (fade) |
| Live interactive app frame | - (the embedded app itself answers inside the frame) | - | - | runs the v0.5.0 interactive web engine locally in the browser at 1280×800 scaled to the frame, syncing with Settings Appearance | - | - | iframe to /demos/{ergon,open-ro,dsh-fleet}/ | - |
| Reset workspace button | text colour shifts to ink | colour turns to accent | focus ring | clears app localStorage & IndexedDB stores, remounts the iframe fresh, and fires a Sonner toast | - | - | COSS Button, Sonner toast | duration-(--dur-press) |
| Skills search field | border colour on focus | - | focus ring | list filters at once; count changes; the browser's own clear mark shows when the field has text and empties it | - | - | COSS Input, COSS Badge | instant (keyboard, typed every time) |
| Ledger bars | - | - | - | - | the bars grow once as the band scrolls into view | - | Tremor BarList, In View | in-view once (InView reveal, dur.enter) |
| Section arrival (summary, experience, projects, demos, skills, additional, education) | - | - | - | - | each section rises 8 px and fades once when scrolled to | - | Motion Primitives In View | reveal (dur.enter, house ease) |
| Email (mailto) / GitHub / LinkedIn / site / repo links | underline on hover | colour turns to the accent (active:text-blue) | focus ring | opens the link (the email link opens the mail program) | - | - | anchor | - |
| Capture still (flagship project cards) | - (an image link) | - | focus ring inside the image | opens the full-resolution capture in a new tab | - | - | anchor around an image | - |
| "open the live demo" (flagship project cards) | colour and underline | colour turns to the accent | focus ring | selects that project's demo tab and scrolls to the demos; the address stays as it was | - | - | anchor | - |
| Stated numbers panel (supporting project cards) | - | - | - | - | the bars arrive with their section | - | Tremor Bar List, In View | in-view once (InView reveal, dur.enter) |
| Footer Download PDF | fill shift | fill darkens | focus ring | downloads the PDF | - | - | COSS Button rendered as a link | duration-(--dur-press) |

No loops: nothing on this page is live work, so no shimmer, no border trail and no pulse. Reduced motion: the in-view reveal shows at once, the tab glide and the morph are replaced by a fade, and the frames do not move.
