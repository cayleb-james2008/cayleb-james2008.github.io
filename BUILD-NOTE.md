# BUILD NOTE — Unified House Frontend + Real Interactive v0.4.0 Web Apps & Live `/lab/` Workbench (21 November 2026)

Branch: `main` (single unified branch carrying `app/`, `demos/`, `projects/`, `lab/`, `resume.html`, and the built GitHub Pages root).

## Canonical repository & architecture

- **Canonical:** `cayleb-james2008/cayleb-james2008.github.io` (`https://cayleb-james2008.github.io/`).
- Preserves `main`'s 18 November 2026 résumé text and submission PDF (`/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf`) verbatim.
- Unified House Frontend token system (`Geist` + `Geist Mono` `.woff2`/`.ttf`, light-default + `prefers-color-scheme: dark` + `localStorage.theme` parity with Light/Dark Appearance tucked cleanly inside the Settings popover across every page, `>= 4.5:1` contrast, `>= 12px` floor).
- `app/vite.config.ts` (`stageAndPublishSite`) updates root `index.html` and `assets/index-*` directly while staging static directories into `app/dist/` for `render-check.mjs`.

## Real interactive v0.4.0 web apps & `/lab/` workbench (zero fixture demos)

- **Ergon v0.4.0** (`/projects/ergon.html`, `/demos/ergon/`, `github.com/cayleb-james2008/ergon`): real client-side IndexedDB workspace, CSV/Markdown/JSON analyzer & download, real Today deletion approval, plus optional BYOK LLM (`sessionStorage`) and local `ergon` binary connection.
- **Open-Ro Studio v0.4.0** (`/projects/openro.html`, `/demos/open-ro/`, `github.com/cayleb-james2008/open-ro`): real client-side Roblox Place & parametric Luau compiler, interactive playable stage preview, Luau validator, Undo checkpoints, real `.rbxlx` XML export, plus optional BYOK LLM and local `openro-rs` connection.
- **DSH Fleet v0.4.0** (`/projects/dsh-fleet.html`, `/demos/dsh-fleet/`, `github.com/cayleb-james2008/dsh-fleet`): real in-browser virtual git worktree store, unified diff viewer, Web Worker sandboxed check runner (exit-1 failure catching in `Needs you` -> patch -> exit-0 merge onto `main`), plus optional BYOK LLM and local `fleet-rs` connection.
- **Industry AI Suite Workbench (`/lab/`)**: 10 real client-side deterministic document review tools accepting arbitrary uploaded or pasted files, emitting `[L##]` verbatim citations, halting drafts whenever required source evidence is missing, plus optional BYOK LLM (`sessionStorage`) and `.md`/`.json` report export.

## Deterministic `render-check.mjs`

- Directory `index.html` resolution, HTTP `206` Range support, in-memory static caching, `localStorage` reset across `checkInert` sweeps, and teardown `net::ERR_ABORTED` guards ensure `node app/scripts/render-check.mjs` passes deterministically on consecutive runs across `1440-light`, `1440-dark`, `390-light`, `390-dark`, `1440-reduced`, and `390-reduced`.
