# Copy rules (owner-approved, frozen)

Cayleb approved this copy on 27 Nov 2026. The about section is his own spoken answers, with only the grammar fixed, laid out as question and answer.

**For any agent or sync job (portfolio sync, release sync, swarm):**

1. **Don't rewrite prose.** The frozen block in `app/src/content.ts` (between `FROZEN-COPY-START` and `FROZEN-COPY-END`) covers the masthead line, the Q&A and the experience entries. Only Cayleb changes it.
2. **What you may update:** links, and the Ergon capture images.
3. **What you may not add:**
   - feature lists, taglines, pitches or meta descriptions for OpenRO, Fleet or OpenBell (they are a name and links only)
   - version pins in prose
   - test counts or benchmark numbers
4. **Ergon** is the only project with descriptive copy, and that copy is Cayleb's own words.
5. **These never come back anywhere on the site:**
   - projects Cayleb removed (the list is in `app/scripts/copy-guard.mjs`), and `/lab/`
   - the OpenBell browser demo
   - any finance-engine wording
6. **Releases don't need a site commit.** Project pages link to `/releases/latest`.

`app/scripts/copy-guard.mjs` runs first in `npm run build` and fails the build if any of this is broken. Don't edit the guard or its hash to get past it. Ask Cayleb.
