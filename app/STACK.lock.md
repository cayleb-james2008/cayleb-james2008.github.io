# STACK.lock

Facts from commands run and files read on 2026-11-10 in this starter. Versions come from `package-lock.json` (checked against `node_modules/*/package.json`). Registry-copied files carry no version header, so for those the version is the registry state fetched that day; Tremor files carry their own header. Licences come from the package's `package.json` or from the library research notes in `skill/references/studies/lib-*.json` (copied from the fleet's stack study on 2026-11-10) (marked "notes"), where the repo licence file was read by that study, not re-read here.

Every install ran with `--ignore-scripts` (for the shadcn and Kibo CLIs, `npm_config_ignore_scripts=true` was exported so the npm they spawn also skipped scripts). `npm ci --ignore-scripts` from the lockfile, then `npm run build`, passes.

Base project (not one of the named libraries):
- `npm install --ignore-scripts react react-dom clsx tailwind-merge class-variance-authority lucide-react`
- `npm install --ignore-scripts -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom @types/node`
- Installed: react 19.3.1, react-dom 19.3.1, vite 8.3.7, tailwindcss 4.3.5, @tailwindcss/vite 4.3.5, typescript 7.0.2, clsx 2.1.1, tailwind-merge 3.7.0, class-variance-authority 0.7.1, lucide-react 1.71.0 (ISC). `src/lib/utils.ts` (`cn`) was written by hand.
- `components.json` was written by hand (alias `@/`, `registries` for `@coss`, `@cult-ui`, `@motion-primitives`).

## COSS UI (coss.com/ui)
- Commands (shadcn CLI as resolved by `npx --yes shadcn@latest`; the npm registry listed shadcn 4.23.0 that day):
  - `npx --yes shadcn@latest add @coss/button --yes`
  - `npx --yes shadcn@latest add @coss/input-group @coss/kbd @coss/tabs @coss/badge @coss/avatar @coss/table @coss/tooltip @coss/segmented-control --yes`
- Version: no package; source copied from the registry. Its runtime dependency `@base-ui/react` 1.9.0 (MIT) was installed by the CLI.
- Components taken, in `src/components/ui/`: `button.tsx` (+ `spinner.tsx`), `input-group.tsx` (+ `input.tsx`, `textarea.tsx`), `kbd.tsx`, `tabs.tsx` (+ `segmented-control.tsx`), `badge.tsx`, `avatar.tsx`, `table.tsx`, `tooltip.tsx`.
- Used on the bench (`src/bench/coss.tsx`): Button and Spinner, Input Group with Kbd and Textarea, Tabs in both variants with Badge count chips, Segmented Control (a dependency of Tabs, shown for itself), Badge, Avatar and Avatar Group, Table, Tooltip; the house skins over them are in `src/parts.tsx`.
- Licence: MIT (notes: repo README and LICENSE, "Copyright (c) 2025 coss.com and Origin UI").
- Local edits: `badge.tsx` `sm` size `sm:text-[.625rem]` changed to `sm:text-xs` (owner floor of 12px). `input.tsx` no longer applies `placeholder:text-muted-foreground/72` (a 72% alpha that overrode the `::placeholder { color: var(--ink-3) }` token rule and measured 3.07 to 1 in light, 3.95 in dark); the token now sets the placeholder colour and `scripts/render-check.mjs` reads the computed colour to hold it at 4.5 to 1. `textarea.tsx` no longer applies the same `placeholder:text-muted-foreground/72` (the `::placeholder` token rule sets the colour, as in `input.tsx`; not on the screen). `tabs.tsx` default-variant list no longer applies `text-muted-foreground/72`, and `segmented-control.tsx` items use `text-muted-foreground` instead of `text-muted-foreground/72`: the 72% fade on the `bg-muted` fill measured 2.82 to 1 in light and 3.82 in dark when a probe rendered them (neither the default tabs variant nor the segmented control is on the screen), and the token itself is 4.69 and 6.01. `scripts/render-check.mjs` now sweeps the computed contrast of every visible text element, so any such fade on a rendered component fails.

## Motion Primitives (motion-primitives.com)
- Commands: `npx --yes shadcn@latest add "https://motion-primitives.com/c/morphing-dialog.json" "https://motion-primitives.com/c/animated-background.json" "https://motion-primitives.com/c/sliding-number.json" "https://motion-primitives.com/c/text-morph.json" --yes` (the shadcn-URL route from the lib notes).
- Version: no package, no header. Dependency `react-use-measure` 2.1.7 (MIT) was installed by the CLI.
- Components taken, in `src/components/ui/`: `morphing-dialog.tsx` (+ `src/hooks/useClickOutside.tsx`), `animated-background.tsx`, `sliding-number.tsx`, `text-morph.tsx`.
- Used on the bench (`src/bench/mp.tsx`, `together.tsx`, `house.tsx`): Morphing Dialog (the `mp-morphing-dialog` specimen, the Tremor pairing and the house FocusSheet), Animated Background, Sliding Number (also in the instrument tile, the Count chip and the progress chip), Text Morph (also in `PhasePill`, `src/parts.tsx`).
- Licence: MIT, "Copyright (c) 2024 ibelick" (notes; the site itself returned HTTP 403 to that study, so any pricing page was not checked).
- Local edits: `sliding-number.tsx` `TRANSITION` marked `as const` so it type-checks against Motion 14. `sliding-number.tsx` hides the rolling columns with `aria-hidden` and exposes the value once in an `sr-only` span (the library's copy put digits 0 to 9 in every place into the accessibility tree), and it calls `useReducedMotion()` and jumps the spring instead of rolling it (a spring on a MotionValue ignores `MotionConfig`). `morphing-dialog.tsx` trigger takes `describedBy` (sets `aria-describedby`) and `blocked` (ignores Enter and Space while a keyboard drag owns them).

### Motion Primitives: the parts that make an interface feel alive (added 2026-11-10, after his words of 10:34 EST)
His words: "I love micro interactions as well and subtle animations while keeping the site feeling like keep the site feeling alive but it should feel functional" and "when you're clicking around and scrolling through everything should feel intentional purposeful". Eight parts, one cause each, run one command per part from `skill/starter/` with `npm_config_ignore_scripts=true` exported. All eight names exist in the registry today (each JSON answered HTTP 200 when fetched on 2026-11-10); none needed another name. The registry's files list `motion` as their only dependency, already installed (motion 14.11.1), so no package was added and `package.json` and `package-lock.json` did not change.
- Commands, as run:
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/in-view.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/animated-group.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/spotlight.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/border-trail.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/text-shimmer.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/transition-panel.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/scroll-progress.json" --yes`
  - `npx --yes shadcn@latest add "https://motion-primitives.com/c/magnetic.json" --yes`
- Each created one file in `src/components/ui/` and, as with the earlier Cult UI parts, wrote `@custom-variant dark (&:is(.dark *));` into `src/index.css`; the line was removed (it collides with the token file's `[data-theme="dark"]` variant). The files carry no version header; the version is the registry state of 2026-11-10. Licence: MIT, as the other Motion Primitives parts ("Copyright (c) 2024 ibelick", from the library notes; not re-read here).
- Files, cause and local edits (every part: no hex, the tokens only; every part honours `prefers-reduced-motion`):
  - `in-view.tsx`, cause: he scrolled to it. Edits: default `once` is true and the hook's own `once` does the latching (the registry latched "seen" in `onAnimationComplete`, which also fires for the hidden state); the reveal is opacity plus an 8 px rise, 250 ms, `cubic-bezier(0.23, 1, 0.32, 1)` (the house enter timing; the registry's was opacity only, no timing); under reduced motion the region is shown at once with no hidden state.
  - `animated-group.tsx`, cause: he opened it. Edits: the registry's ten presets cut to `fade` and `slide` (the others were springs with bounce, a rotation or a filter, with no cause); `slide` rises 8 px (was 20); items arrive on the house enter timing instead of the default transform spring; the 0.1 s stagger is the registry's; under reduced motion `initial={false}`, so the pieces are there at once. `JSX.IntrinsicElements` became `React.JSX.IntrinsicElements` (React 19 types).
  - `spotlight.tsx`, cause: hover, to show what will respond. Edits: the zinc colour classes, the dark-mode variant and the `blur-xl` glow are replaced by a radial fade from `--blue-soft` to transparent, no blur; `aria-hidden`; it runs only under `(hover: hover) and (pointer: fine)` and not at all under reduced motion (`display: none`; a light that follows the pointer is travel). It still sets `position: relative; overflow: hidden` on its parent, as the registry's did.
  - `border-trail.tsx`, cause: live work. Edits: the default tint is `bg-blue` (was a zinc class); the mask's literal black is the system colour `CanvasText` (a mask reads only alpha); `aria-hidden`; under reduced motion the trail does not travel and the whole edge is drawn in the same colour, still. Mount it only while the thing runs.
  - `text-shimmer.tsx`, cause: live work. Edits: the base and highlight colours were five literal hex values with a dark-mode pair; they are now `--ink-2` and `--ink` (so both themes come from the tokens); under reduced motion the label is plain `text-ink-2` text with no gradient. The render check's contrast sweep exempts the moving label (its text colour is transparent and the letters are painted by the clipped gradient), so its contrast is argued, not measured: the base layer is `--ink-2`, which the sweep measures on the same fill elsewhere on the bench, and the passing highlight is `--ink`, darker in light and lighter in dark.
  - `transition-panel.tsx`, cause: he chose another view. Edits: default variants and timing added (a 250 ms fade with an 8 px rise on enter, a plain fade out; the registry gave none, so a caller that passed none got no motion); under reduced motion the view changes at once (`duration: 0`).
  - `scroll-progress.tsx`, cause: scrolling. Edits: `layoutEffect` removed from `useScroll` (Motion 14 has no such option; a type error); `containerRef` typed `RefObject<HTMLElement | null>`; `aria-hidden` (it repeats the scroll bar); under reduced motion the bar is tied to the scroll position with no spring (a spring on a motion value is not reached by `MotionConfig`). The caller sets position and colour: a `fixed inset-x-0 top-0` bar in `bg-blue` on a page, `sticky top-0` inside a scroll region.
  - `magnetic.tsx`, cause: the pointer is near. Edits: it leans only under `(hover: hover) and (pointer: fine)` and never under reduced motion (it then renders its children in a plain div). Use it once per screen at most, on the one primary action. The registry's spring (stiffness 26.7, damping 4.1, mass 0.2) and its intensity 0.6 and range 100 are kept. Trap found by the render check: the lean is computed on each mouse move from a state read; a pointer that crosses into the zone and stops on the very move that entered leans only on its next move.
  - `src/hooks/useFinePointer.ts` (new, not a registry file): the `(hover: hover) and (pointer: fine)` media query as a hook, used by `spotlight.tsx` and `magnetic.tsx`.
- Used on the bench (`src/bench/mp-alive.tsx`, group "Motion Primitives"): one specimen each, `mp-in-view`, `mp-animated-group`, `mp-spotlight`, `mp-border-trail`, `mp-text-shimmer`, `mp-transition-panel` (with the COSS Segmented Control as its chooser), `mp-scroll-progress`, `mp-magnetic`.
- Exception to log: Spotlight (a radial fade), Text Shimmer (a clipped linear gradient) and Border Trail (a mask) contain gradient functions. He asked for these parts for a screen that feels alive; they carry no colour of their own and no glow. Recorded in `references/reconcile.md` item 17.

## Cult UI (cult-ui.com)
- Command: `npx --yes shadcn@latest add @cult-ui/texture-button --yes`
- Version: no package, no header. Its dependency `@radix-ui/react-slot` 1.5.0 (MIT) was installed by the CLI.
- Component taken: `src/components/ui/texture-button.tsx`.
- Used: Texture Button, `primary` variant, as the action of the house Dock (`src/chrome/Dock.tsx`) and in the `cult-texture-button` specimen (`src/bench/cult.tsx`), with `active:translate-y-px active:scale-[0.97]` for the press. Its dark variant is a light button.
- Not used: the Halo items (Halo and gradient parts clash with the no-gradient rule in the look spec). Dynamic Island and Expandable were installed on 2026-11-10, see the section below.
- Licence: MIT (notes: LICENSE.md "Copyright (c) 2023 Jordan-Gilliam"; README "MIT (c) Nolly Studio").

## Kibo UI (kibo-ui.com)
- Command: `npx --yes kibo-ui@latest add kanban relative-time avatar-stack` (CLI package `kibo-ui`, npm registry listed 1.1.5 that day). Also `npx kibo-ui add status`, answered "no" to the overwrite of `badge.tsx` and then deleted (see below).
- Version: no header. Dependencies installed by the CLI: `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0, `@dnd-kit/utilities` 3.2.2, `tunnel-rat` 0.1.2, `@radix-ui/react-scroll-area` 1.4.0 (all MIT). Its shadcn registry dependencies `card` and `scroll-area` came from the shadcn default registry (`src/components/ui/card.tsx`, `scroll-area.tsx`; their licence was not read in this session).
- Components taken: `src/components/kibo-ui/kanban/index.tsx`, `src/components/kibo-ui/avatar-stack/index.tsx`.
- Local edits to Kanban (2026-11-10): the card wrapper no longer carries dnd-kit's `role`, `tabindex` and `aria-roledescription` (it was a second tab stop around the button that opens the detail); it keeps the pointer and keyboard listeners and passes the id of the card's description to the element inside through `useKanbanCardDescription`. `KanbanProvider` merges a caller's `accessibility` prop with its announcements (the board passes the key instructions: Enter opens, D lifts, arrows move, D drops, Escape cancels). Hooks for the render check: `data-kanban-card` and `data-kanban-column`.
- Used on the bench (`src/bench/kibo.tsx`, `together.tsx`): Kanban (drag between columns, `KanbanProvider/Board/Header/Cards/Card`) and Avatar Stack.
- Removed: `relative-time` (it shows clock times per time zone, not "7 min. ago"; use `Intl.RelativeTimeFormat` for relative times) and `status` (its Tailwind-palette dots with a ping animation do not map to a product's states, and its `badge` dependency collided with COSS `badge.tsx`).
- Licence: MIT, "Copyright (c) 2023 - Present shadcnblocks" (notes). The notes could not tell which of two repo locations is canonical.
- Keyboard: Kibo's default keyboard drag starts on Space/Enter, which clashes with opening a card. The sensors in `src/bench/kibo.tsx` (`useBenchSensors`) start a keyboard drag with the D key instead; the render check now presses D, twelve arrow keys and D in headless Chromium and sees the card change column (not tried by a person with a screen reader).

## Tremor (tremor.so, Tremor Raw copy-in)
- Command (no CLI exists; the documented route is copying files): files fetched with `curl` from `https://raw.githubusercontent.com/tremorlabs/tremor/ca4d588f47820ff3d514d37fa4ee08a4222dec11/` (main at 2025-10-10) into `src/components/Tracker/Tracker.tsx`, `src/components/ProgressCircle/ProgressCircle.tsx`, `src/components/SparkChart/SparkChart.tsx`, `src/utils/cx.ts`, `src/utils/chartColors.ts`, `src/utils/getYAxisDomain.ts`.
  - `npm install --ignore-scripts tailwind-variants recharts@^2.15.2 @radix-ui/react-hover-card`
- Versions: file headers Tracker v1.0.0, ProgressCircle v0.0.3, Spark Chart v1.0.0, chartColors v0.1.0, cx v0.0.0, getYAxisDomain v0.0.0. Installed: recharts 2.15.4 (MIT), tailwind-variants 4.0.2 (MIT), @radix-ui/react-hover-card 1.2.1 (MIT).
- `package.json` has `"overrides": { "react-is": "^19.3.1" }`: without it recharts 2.15.4 drew empty charts on React 19 (confirmed: the sparkline's svg was empty; with the override it draws).
- Used on the bench (`src/bench/tremor.tsx`, `house.tsx`, `together.tsx`): SparkAreaChart (`fill="none"`), SparkLineChart, SparkBarChart, ProgressCircle, Tracker (BarList, CategoryBar and Tooltip are recorded below).
- Not used: BarList, CategoryBar, ProgressBar, the bigger charts.
- Licence: Apache License 2.0 for the Raw repo (notes; the repo copyright line is an unfilled template). The licence text is kept at `THIRD-PARTY-LICENSES/tremor-raw-LICENSE-Apache-2.0.txt`.
- Local edits (copy-in source): `chartColors.ts` `blue` entry uses the token classes `bg-blue`, `stroke-blue`, `fill-blue`, `text-blue`; `ProgressCircle.tsx` ring transition gets `motion-reduce:transition-none`, and its default and success palettes use `stroke-track`, `stroke-blue`, `stroke-dot-green`; `Tracker.tsx` tooltip and empty block use token colours. The Tremor `@theme` animation entries for hover cards are in `src/index.css`.

## Sonner
- Command: `npm install --ignore-scripts motion sonner vaul`
- Version: sonner 2.0.8. Licence: MIT (package.json).
- Used: `Toaster` once in `App.tsx`; `toast` in the `sonner-toast` specimen (`src/bench/interaction.tsx`) and in the island specimen's commands. Themed through `--normal-bg`, `--normal-text`, `--normal-border`, `--border-radius`.

## Vaul
- Command: same line as Sonner.
- Version: vaul 1.1.2. Licence: MIT (package.json). The Vaul repo carries an "unmaintained" notice (notes).
- Local edit (CSS): `src/index.css` cuts `animation-duration` and `transition-duration` of `[data-vaul-drawer]` and `[data-vaul-overlay]` under `prefers-reduced-motion: reduce`; Vaul's sheet slides with CSS animations, not only a transition.
- Used: `Drawer` (Root, Trigger, Portal, Overlay, Content, Handle, Title, Description, Close) as the bottom drawer below 640px in `src/chrome/FocusSheet.tsx`, and bare (no media query, snap points 0.5 and 1) in the `vaul-drawer` specimen.

## Motion (motion.dev)
- Command: same line as Sonner (package `motion`).
- Version: motion 14.11.1 (depends on framer-motion 14.11.1). Licence: MIT (package.json). Motion+ (paid) is not used.
- Used: `MotionConfig reducedMotion="user"` in `src/main.tsx`; every Motion Primitives part above runs on it.

## Not in the list but in the project
- `@base-ui/react`, `@radix-ui/*`, `@dnd-kit/*`, `tunnel-rat`, `react-use-measure`, `recharts`, `tailwind-variants`, `class-variance-authority`, `lucide-react` are declared dependencies of the libraries above.
- `src/index.css` imports `../../references/tokens.css` (the skill folder's `references/tokens.css`) (the one token source). The registry commands also wrote their own colour tokens and a `.dark` variant into `src/index.css`; those were removed because they overrode `tokens.css`.

## Render check (dev tool)

- Command: `npm install --save-dev --ignore-scripts playwright-core` (npm registry listed 1.65.0 on 2026-11-10; Apache-2.0). It downloads no browser. `scripts/render-check.mjs` uses a browser already on the machine: `$CHROME_PATH`, then `/usr/bin/chromium`, `/usr/bin/chromium-browser`, `/usr/bin/google-chrome`, then a Chromium in `~/.cache/ms-playwright`; with none it exits 2 and says what to install. On this machine it ran against `/usr/bin/chromium`.

## Added 2026-11-10 for the house format, kept for the bench (the first build had three studies, Deck, Ledger and Flow; the studies and their data were deleted at 06:04 EST on the owner's word, and the parts stay)

Every command below ran with `npm_config_ignore_scripts=true` exported, from `skill/starter/`. The Operations board and the three studies are gone; each part below is shown at work as a specimen under `src/bench/`.

### Cult UI: Dynamic Island and Expandable
- Command: `npx --yes shadcn@latest add @cult-ui/dynamic-island @cult-ui/expandable --yes` (shadcn CLI 4.23.0). Created `src/components/ui/dynamic-island.tsx` and `src/components/ui/expandable.tsx`. No file of another library was touched. The CLI also wrote `@custom-variant dark (&:is(.dark *));` into `src/index.css`; it was removed because it collides with the token file's `[data-theme="dark"]` variant. Dependencies `motion` and `react-use-measure` were already installed.
- Version: no package, no header; licence MIT (notes: LICENSE.md, Jordan-Gilliam, Nolly Studio).
- Local edits, `dynamic-island.tsx`: three size presets added (`sentence` 380 by 44, `event` 440 by 64, `palette` 560 by 400); a preset with a `height` uses it; width never exceeds the viewport minus 24 px; the black fill, `text-black` and the hover and focus colour classes are replaced by `bg-ink-button text-ink-button-fg` with a hairline and `shadow-lift`; no entrance from 0 by 0 (`initial={false}`); the squircle `clipPath` (its SVG is not in the file) removed; `useReducedMotion()` makes the size jump instead of springing; extra props (role, aria-label) are accepted; `pointer-events-auto` so the study can keep a click-through wrapper. Used: `src/chrome/Island.tsx`. The library's own `setSize` refuses to go back to the previous size, so the island dispatches `SET_SIZE` itself.
- Local edits, `expandable.tsx`: the content height spring jumps under reduced motion (`useReducedMotion()`). Used: `Expandable`, `ExpandableTrigger`, `ExpandableContent` in the `cult-expandable` specimen (`src/bench/cult.tsx`) and the `together-motion-under` specimen (`src/bench/together.tsx`). `ExpandableCard` is in the file and not used: it springs width and height and carries its own white card and `hsl(var(--border))` shadows that the tokens do not define. The content's height spring in normal motion is the library's way of expanding; it is a recorded exception to the motion floor "no height animation" for the one tile that uses it.

### Motion Primitives: Dock
- Command: `npx --yes shadcn@latest add "https://motion-primitives.com/c/dock.json" --yes`. Created `src/components/ui/dock.tsx`. Licence MIT, as the other Motion Primitives parts.
- Local edits (large; the part is kept for its structure and its label bubble): magnification is off by default (it grew keys with a spring on width and the panel with a spring on height, which ignored reduced motion); `DockItem` is a real `<button>` taking `aria-current`, `aria-label` and `data-dock-key` (the copy was a div with `role="button"`, `aria-haspopup` and no key handler); the `toolbar` role is gone (the house dock is a `<nav>` in `src/chrome/Dock.tsx`); colours are tokens; `Children.map` skips non-elements. The gliding highlight is Motion `layoutId` in `src/chrome/Dock.tsx`, not a library part.

### Kibo UI: Gantt, Calendar, Pill
- Command: `npx --yes kibo-ui@latest add gantt calendar pill list`, answering "no" to every overwrite prompt (it asked about `button.tsx`, `avatar.tsx` and `badge.tsx` of COSS UI; all three refused, nothing was overwritten). Created `src/components/kibo-ui/gantt/index.tsx`, `calendar/index.tsx`, `pill/index.tsx`, and from the shadcn registry `src/components/ui/command.tsx`, `popover.tsx`, `dialog.tsx`, `context-menu.tsx`. `list` was installed and then deleted unused (its items carry dnd-kit's role and tab index like the old kanban card; no study needs it).
- Dependencies the CLI installed: `@dnd-kit/modifiers` 9.0.0, `@uidotdev/usehooks` 2.4.1, `date-fns` 4.4.0, `jotai` 3.0.2, `lodash.throttle` 4.1.1 (+ `@types/lodash.throttle`), `cmdk` 1.1.1, `@radix-ui/react-context-menu` 2.4.1, `@radix-ui/react-dialog` 1.3.1, `@radix-ui/react-popover` 1.3.1, and `@radix-ui/react-avatar` (for the `avatar.tsx` it then did not take). All MIT (package.json). The shadcn default `command`, `popover`, `dialog` and `context-menu` files carry no licence read in this session.
- Licence: MIT, shadcnblocks (notes, as before). Gantt's finest unit is a day (range `daily`, 50 px a day); a job lane in hours does not fit it.
- Local edits, gantt: the grid uses one column when there is no sidebar (with none, the timeline fell into a 0 px column); the sidebar is not used; `GanttFeatureItemCard` no longer spreads dnd-kit's role and tab index (the strip's own button is the one tab stop; mouse drag is kept); two `transition-all` replaced. Calendar: cells use a minimum height instead of `aspect-square` (about 1200 px tall at 1440); the month buttons got `aria-label`s; cell borders use the hairline token. Pill: the palette colours (`emerald`, `rose`, `amber`, `sky`) became token classes.
- Used on the bench (`src/bench/kibo.tsx`, `together.tsx`): `GanttProvider`, `GanttTimeline`, `GanttHeader`, `GanttFeatureList`, `GanttFeatureListGroup`, `GanttFeatureRow`, `GanttToday` (the gantt; it is scrolled to today on mount by a small helper in the specimen); `CalendarProvider`, `CalendarHeader`, `CalendarBody`, `CalendarDatePagination` (the calendar); `Pill`, `PillAvatar`, `PillButton`, `PillDelta`, `PillIndicator`, `PillStatus` (pill groups). Not used: Gantt sidebar and markers, Calendar pickers; `command`, `popover`, `dialog`, `context-menu`, `card` and `scroll-area` (shadcn default registry, pulled in by the CLI) are shown as the "Taken in as dependencies" group in `src/bench/deps.tsx`.

### Tremor Raw: Bar List, Category Bar, Tooltip
- Command: files fetched with `curl` from `https://raw.githubusercontent.com/tremorlabs/tremor/ca4d588f47820ff3d514d37fa4ee08a4222dec11/` (`src/components/BarList/BarList.tsx`, `CategoryBar/CategoryBar.tsx`, `Tooltip/Tooltip.tsx`, `src/utils/focusRing.ts`), then `npm install --ignore-scripts @radix-ui/react-tooltip`. Versions in headers: BarList v1.0.0, CategoryBar v0.0.3, focusRing v0.0.1; `@radix-ui/react-tooltip` 1.4.1 (MIT). Licence Apache-2.0, as above.
- Local edits: every Tailwind palette class (`gray-*`, `blue-200`...) became a token class (`bg-blue-soft`, `text-ink`, `hover:bg-board`, `bg-ink-button`, `ring-surface`); `transition-all` removed from BarList and the CategoryBar marker; `focusRing` outline is `outline-blue`. `chartColors.ts`: the other colour keys now map to token classes (`emerald` is `dot-green`, `amber` is `dot-amber`, `gray` is `disabled`, `violet` is `tag-research-fg`, `cyan` is `tag-mint-fg`, `pink` is `tag-design-fg`, `lime` is `dot-clay`, `fuchsia` is `tag-dev-fg`).
- Used on the bench (`src/bench/tremor.tsx`): `BarList` (with `onValueChange` each bar is a button), `CategoryBar` (with a marker), Tremor `Tooltip` (its own Radix provider); `ProgressCircle` and `Tracker` as before.

### Other local edits, from the studies and the bench
- `sliding-number.tsx`: a `group` prop puts a thousands separator between digit groups (the value is still exposed once to a screen reader, with the separator).
- `morphing-dialog.tsx`: the trigger takes `thing` (sets `data-thing`), so the island's search can open a sheet by clicking its trigger.
- Vaul: `snapPoints` `[0.62, 1]` on the phone drawer in `src/chrome/FocusSheet.tsx`; no change to its source.

### Added 2026-11-10 with the bench (render-check findings)

- `src/components/ui/dock.tsx`: magnification (a `useSpring` on width, which `MotionConfig` does not reach) is off under `useReducedMotion()`; the bare Dock specimen turns magnification on.
- `src/components/ui/avatar.tsx`: `AvatarGroupCount` text is `text-ink` instead of `text-muted-foreground` (4.35 to 1 on its fill when rendered).
- `src/chrome/Dock.tsx` and `src/chrome/Island.tsx` take an `inline` prop, so the bench shows them in the flow of a specimen instead of fixed to the window. The island's palette input has its own text and placeholder colour (`ink-button-fg`, the island is a light pill in dark mode), a transparent group fill, and `preventDefault` on Enter (the same Enter reopened the palette after it closed).
- `references/tokens.css`: `--success-foreground` from `#087d58` to `#067a54` (4.49 to 4.68 on the success badge fill).
- `src/parts.tsx`: the `Person`, `TagKey` and `Tone` types moved in from the deleted `src/data/common.ts`; `PhasePill` takes a `tone` instead of reading a table of the deleted study's status words.
- `src/bench/install.ts` repeats install lines from this file; `scripts/check-commands.py` fails if one is not recorded here.

- 2026-11-10 (m-0256): `src/components/ui/morphing-dialog.tsx`, local edit: `MorphingDialogTrigger` takes the context's `triggerRef` when none is passed, so the dialog's own close effect gives focus back to the trigger (a keyboard user was dropped on the page body after Escape).
