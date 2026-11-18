# NEW-TEXT — the page's own words

Everything on the page is the résumé's own text, copied from the live page. The lines below are the only words that are not:
labels, control names and notices of the page itself. None of them says anything about Cayleb that the résumé does not already say.
The preservation checker reads this file (`--new-text app/NEW-TEXT.md`): a line here is allowed to appear as new text.

Dark
Light
Contact
steps
· as stated in the résumé
· github.com/cayleb-james2008
Ergon — the current front set
DSH Fleet — the approved panel
OpenBell — the Ticket 070 watchtower

Seen only after an action (not in the default page; the two notices are Sonner toasts after the copy button):

Filter skills
shown
No skill in this group matches “…”.
Copied caylebalvarezjames@gmail.com to the clipboard.
Could not reach the clipboard. The address is caylebalvarezjames@gmail.com.

Names for assistive technology (attributes, not text on the page): "Copy email address …", "Switch to the dark theme" / "Switch to the
light theme", "Close", "Fold …" / "Open …" (an experience entry), "Contents", "Live demos", "<project>, how it works".

Added after the UX quality review (m-0256):

Close
reset the demo
The Ergon demo is reset: its approval waits for you again.

Added for the product pages (16 November 2026) — the card block at the top of Selected projects. Each pitch is the
page's own one-line summary of the product page it links to, grounded in that project's repository:

the four products, in full
the full product page ↗
Open-Ro Studio
A personal AI agent for every employee, on one shared company system — the agent learns the role, and a person approves anything that sends, spends or changes a record.
An autonomous trading system for Kalshi's 15-minute markets — one slot per market, gateway-enforced risk rails, and every fill proven from the venue's own record.
An open-source, local-first Roblox development studio — an AI agent that builds, tests and repairs in your own workspace, with review before anything lands.
An orchestration plugin that turns one instruction into a swarm of AI agents — tickets in, work built in parallel, and a fresh-context checker deciding when it is done.

Changed for the editorial product-page rollout (16 November 2026): the OpenBell product card's poster is now the
order tape capture (assets/projects/captures/openbell-tape.png) instead of the watchtower poster, so the home card
shows no balance or P&L figures. New card alt text:

Still of the real OpenBell capture: the desk's order tape — orders as the venue recorded them

Changed for the employer-name strip (17 November 2026, owner's order — the day-job employer's name comes out of all public copy; the experience entry now states the job generically):

Furniture Installer · a Connecticut furniture company
Furniture installation work, full-time.

Changed for the claims-to-functionality programme, wave 2 (17 November 2026): the Ergon product card's poster is now
the Work Graph capture (assets/projects/faces/ergon/graph-review.png) — the same capture the Ergon product page leads
with — instead of the conversation-face poster, so the home card shows Ergon's default face (Work Graph). New card alt text:

Still of the real Ergon capture: the Work Graph face — an agent's finished work waiting at its review node, with the Approve & send card

## 18 November 2026 — public replacement landing (new Rust + Rune builds)

The four flagship product pages were replaced with the new builds' staged pages, and the home
product-card pitches now describe the new builds (app/src/content.ts `productPages`):
- Ergon: "An AI agent for every employee — personal to each person, it learns how they work and finishes their digital work autonomously, end to end. No approval ceremony in the middle."
- OpenBell: "A compounding desk for Kalshi's 15-minute markets — it collects the venue's public data around the clock and scores a library of strategies against that tape on paper, in slots that compound. It places no orders."
- Open-Ro Studio: "You describe the game, it builds it — a proactive creative agent in a plain chat window, full access by default: it writes the scripts, playtests its own work, fixes what breaks, and every change can be reverted."
- DSH Fleet: "Your agents working in parallel under one screen — hand out the work, and it comes back verified done: Fleet runs your check command itself, and everything else lands in a Needs-you inbox with the reason. Nothing is babysat."
Projects.tsx DSH_REPO now names the new public repo github.com/cayleb-james2008/dsh-fleet.
