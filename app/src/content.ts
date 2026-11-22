// content.ts: the résumé's text, copied from the RENDERED live apex (main e390e9db), not from the older source.
// Every string here is in the live page's rendered text (worker-2/ref/live-text.txt). Nothing is added about Cayleb.
// Words that are not the résumé's (labels, the page's own short notes) are marked NEW-TEXT.md.

export const identity = {
  name: "Cayleb Alvarez-James",
  role: "AI Agent Systems Engineer. Autonomous Agents, Agent Harnesses & Self-Improving Infrastructure.",
  location: "Middletown, Connecticut, USA",
  email: "caylebalvarezjames@gmail.com",
  links: [
    { label: "github.com/cayleb-james2008", href: "https://github.com/cayleb-james2008" },
    { label: "cayleb-james2008.github.io", href: "https://cayleb-james2008.github.io/" },
  ],
};

export const PDF = {
  href: "/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf",
  name: "Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf",
  size: "49 KB",
  note: "the plain PDF, the submission copy",
};

export const summary = [
  "AI agent systems engineer and technical founder. I have spent the past year on agentic systems and harness engineering, starting while I was finishing high school, where I was also wrestling team captain for two years. For most of that stretch I worked 13 to 14 hours a day on it, around school, my job and wrestling. I work across several harnesses instead of just one: OpenCode and DeepSeek Harness, Claude Desktop and Duet, Gemini Antigravity, Freebuff, ChatGPT Codex and Claude Code. I pick whichever has usage left and fits the job. Right now most of the work runs through Muse, Claude Duet and the DSH Fleet I am finishing. Two systems make up most of it. Ergon\u2019s employee agents are built to set themselves up \u2014 to watch how someone works, ask targeted questions, learn the role and keep a memory of the person, adding skills and tools as it goes. That loop is built and verified against simulated companies; the live model connection is the remaining piece before a first install. The DSH Fleet runs dynamic swarms across desktop, virtual machine and browser surfaces, takes its tickets through Slack, and improves its own workflows, skills and plugin behaviour through a governed, checker-gated improvement programme run in rounds.",
  "1,200+ GitHub contributions in the last year. 4,000+ automated tests across five shipped systems.",
];

// The stated test counts, as the résumé states them (the ledger). Never derived, never rounded.
export const ledger = {
  total: { label: "Five systems total", display: "4,000+" },
  contributions: { label: "GitHub contributions, last year", display: "1,200+" },
  bars: [
    { name: "Sophos interface", value: 1224, display: "1,224" },
    { name: "Ergon proof checks", value: 1196, display: "1,196" },
    { name: "Asmodeus Rust", value: 1111, display: "1,111" },
    { name: "dotz core tests", value: 828, display: "828+" },
    { name: "Industry AI Suite", value: 382, display: "382" },
  ],
  caption: "stated test counts · one bar per count · the 4,000+ is the five-system total",
  beside: "GitHub contributions, last year — shown beside the test chart, not on its scale",
};

export const experience = [
  {
    date: "Oct 2025 \u2013 Present",
    org: "Founder \u00b7 Independent AI Agent Systems",
    bullets: [
      "Built Ergon as a self-configuring employee-agent platform. After installation, the agent is built to learn the employee\u2019s role by watching their recurring work and asking targeted questions, then propose capabilities it can take over. A learned skill or tool has to pass evaluation and review before the agent can use it, so nobody has to map the role in advance or keep adjusting the agent by hand. The self-setup loop is built and verified against simulated companies; the live model connection is the remaining piece before a first install.",
      "Built the DSH Fleet. A dynamic swarm forms around each objective, execution runs across desktop, Windows VM, phone VM and browser surfaces, and tickets are coordinated through Slack under the same coordination and outcome rules. The coordination protocol is designed to let outside agents join through it as well \u2014 a design goal, not yet an observed practice. Slack was not the original integration layer. I was going to build my own, but I kept getting flagged by the existing guardrails on Muse and the other platforms I build on, so I used Slack for that layer instead.",
      "The Omni Loop is the fleet\u2019s self-improvement method, run as a governed programme in rounds, and every change it makes is gated: results from finished jobs drive proposed revisions to the workflows, plugin, skills and the loop itself, and a revision ships only when a fresh checker measures it better than the current version on a fixed scorecard, checked against a frozen set of past tickets. Every change is versioned and can be rolled back.",
    ],
  },
  {
    date: "Sep 2026 \u2013 Present",
    org: "Furniture Installer \u00b7 a Connecticut furniture company",
    bullets: [
      "Furniture installation work, full-time.",
    ],
  },
];

export type Project = {
  name: string;
  kind: string;
  stack: string;
  repo?: string;
  figure?: string;
  status: string; // a stated phrase from the résumé, or "" for none
  steps: { title: string; sub: string }[];
  stepsLead: string;
  lead: string; // the paragraph under the steps, as the live page prints it
  capture?: Capture; // the three flagship projects show a still of the real capture
  chart?: Chart; // the supporting projects show their stated numbers
  bullets: string[];
  demo?: string;
};
export type Capture = { src: string; alt: string; label: string; spec: string };
export type Chart = { rows: { name: string; value: number; display: string }[]; caption: string; label: string; sqrt?: boolean };
export const captureTitle = "Open the full-resolution capture";
export const openDemoLabel = "open the live demo \u2193";
export const chartHead = { left: "stated numbers", right: "from the r\u00e9sum\u00e9" };
export const stepsHead = { left: "how it works", right: "from the r\u00e9sum\u00e9\u2019s description" };

export const projects: Project[] = [
  {
    name: "Sophos",
    kind: "Coding-Agent Desktop App",
    stack: "React, TypeScript, Tauri",
    repo: "github.com/cayleb-james2008/sophos",
    figure: "1,224 interface tests \u00b7 82 Node tests",
    status: "merged after hosted CI",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "Desktop app that runs coding agents from saved profiles. 1,224 interface tests and 82 Node tests pass.",
    chart: { rows: [{ name: "interface tests", value: 1224, display: "1,224" }, { name: "Node tests", value: 82, display: "82" }], label: "Sophos stated test counts: 1,224 interface tests and 82 Node tests.", caption: "stated test counts \u00b7 square-root scale \u00b7 from the r\u00e9sum\u00e9", sqrt: true },
    steps: [
      { title: "saved profiles", sub: "coding agents" },
      { title: "run the agent", sub: "" },
      { title: "sessions + transcripts", sub: "survive restarts" },
      { title: "clear error on provider failure", sub: "" },
      { title: "merged after hosted CI", sub: "gate" },
    ],
    bullets: [
      "Desktop app that runs coding agents from saved profiles, with sessions and transcripts that survive restarts and clear errors when a provider fails.",
      "1,224 interface tests and 82 Node tests pass; merged after full hosted CI.",
    ],
  },
  {
    name: "dotz",
    kind: "AI Coding Agent Dashboard",
    stack: "Rust, Tauri, JavaScript, SQLite",
    repo: "github.com/cayleb-james2008/dotz",
    figure: "828+ core tests",
    status: "merged",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "828+ core tests pass on each of Windows, macOS and Linux; all 6 hosted check jobs pass.",
    chart: { rows: [{ name: "Windows", value: 828, display: "828+" }, { name: "macOS", value: 828, display: "828+" }, { name: "Linux", value: 828, display: "828+" }], label: "dotz stated core tests: 828 or more on each of Windows, macOS and Linux.", caption: "stated core tests, each OS \u00b7 from the r\u00e9sum\u00e9" },
    steps: [
      { title: "pick the model", sub: "" },
      { title: "run the agent", sub: "supervised" },
      { title: "watch the process tree", sub: "" },
      { title: "safe cleanup", sub: "" },
      { title: "merged", sub: "6/6 hosted checks" },
    ],
    bullets: [
      "Desktop app that runs and supervises AI coding agents, with model choice and safe process-tree cleanup.",
      "828+ core tests pass on each of Windows, macOS and Linux; all 6 hosted check jobs pass; merged.",
    ],
  },
  {
    name: "Asmodeus",
    kind: "Trading Research on Past Data",
    stack: "Rust",
    figure: "1,111 Rust tests",
    status: "research only",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "Rejected ideas are logged, not quietly dropped. 1,111 Rust tests pass. Research only.",
    chart: { rows: [{ name: "Rust tests", value: 1111, display: "1,111" }], label: "Asmodeus stated test count: 1,111 Rust tests.", caption: "stated test count \u00b7 from the r\u00e9sum\u00e9" },
    steps: [
      { title: "real historical data", sub: "" },
      { title: "strict time order", sub: "gate" },
      { title: "fees counted", sub: "" },
      { title: "no peeking at future data", sub: "safeguards" },
      { title: "rejected ideas logged", sub: "research only" },
    ],
    bullets: [
      "Tests trading ideas on real historical data in strict time order, with fees and safeguards against peeking at future data; rejected ideas are logged, not quietly dropped. 1,111 Rust tests pass. Research only.",
    ],
  },
  {
    name: "Industry AI Suite",
    kind: "Source-Checked Review Tools",
    stack: "Python",
    repo: "github.com/cayleb-james2008/industry-ai-suite",
    figure: "382 Python tests",
    status: "",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "Ten local tools that review finance, research, security and operations files. 382 Python tests pass.",
    chart: { rows: [{ name: "Python tests", value: 382, display: "382" }], label: "Industry AI Suite stated test count: 382 Python tests.", caption: "stated test count \u00b7 from the r\u00e9sum\u00e9" },
    steps: [
      { title: "ten local tools", sub: "finance \u00b7 research \u00b7 security \u00b7 operations" },
      { title: "review the files", sub: "" },
      { title: "every finding shows its source", sub: "" },
      { title: "missing source \u2192 drafts halt", sub: "gate" },
      { title: "a person decides", sub: "" },
    ],
    bullets: [
      "Ten local tools that review finance, research, security and operations files; every finding shows its source and a person decides. Drafts halt when sources are missing. 382 Python tests pass.",
    ],
  },
];

// The three flagship product pages (static pages under /projects/, updated for v0.6.0). Open-Ro Studio is not a résumé
// record; it joins Ergon and DSH Fleet here because its product page and interactive web app do.
export type ProductPage = { name: string; href: string; pitch: string; img: string; darkImg?: string; alt: string };
export const productPagesHead = "the three products, in full";
export const productPageLink = "the full product page ↗";
export const productPages: ProductPage[] = [
  {
    name: "Ergon",
    href: "/projects/ergon.html",
    pitch: "An AI agent for every employee — 12 built-in workflows, live SSE run streaming, indexed 5,000-receipt search, standing routines, SHA-256 receipts, and 3-company live E2E hardening in one Rust binary.",
    img: "/assets/projects/captures/ergon-v060-light.png",
    darkImg: "/assets/projects/captures/ergon-v060-dark.png",
    alt: "Live capture of Ergon v0.6.0 in the House Frontend workspace: Ironwood Commercial Mechanical live Today desk with 12 built-in workflows, Routines, SHA-256 receipts, Commands Cmd+K, and searchable Workspace files rail",
  },
  {
    name: "Open-Ro Studio",
    href: "/projects/openro.html",
    pitch: "You describe the game, it builds it — 28 Roblox game systems, playable Anime Card Battles: Rebirth — Apex Edition with Card Art Studio, Anime Homage Style Guide, Static Luau Prover, and bidirectional .rbxlx XML.",
    img: "/assets/projects/captures/openro-v060-light.png",
    darkImg: "/assets/projects/captures/openro-v060-dark.png",
    alt: "Live capture of OpenRO v0.6.0 in the House Frontend workspace: playable Anime Card Battles Apex Roll Pack and Boss Tower Arena with cel-shaded card art, Static Luau Audit Clean badge, and 49 Roblox Place instances",
  },
  {
    name: "DSH Fleet",
    href: "/projects/dsh-fleet.html",
    pitch: "Parallel coding-agent Mission Control — autonomous Auto-Heal feedback loop, reusable Playbook templates, live Board Telemetry strip, DAG dependencies, multi-step checks, file-scope guardrails, and split diffs.",
    img: "/assets/projects/captures/fleet-v060-light.png",
    darkImg: "/assets/projects/captures/fleet-v060-dark.png",
    alt: "Live capture of DSH Fleet v0.6.0 Mission Control in the House Frontend workspace: Board Telemetry strip with First-pass and Auto-healed metrics, Healed 1/2 badge, file-scope guardrail block, and 3-repo parallel wave board",
  },
];

export const skills = [
  {
    group: "AI & agents",
    items: [
      "multi-harness agent operations",
      "autonomous role learning",
      "continual personalisation",
      "dynamic-swarm orchestration",
      "recursive self-improvement systems (the Omni Loop)",
      "distributed agent infrastructure",
      "bring-your-own-agent coordination",
      "evaluation design",
      "earned permissions and approval gates",
    ],
  },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Rust", "HTML/CSS"] },
  {
    group: "Models & data",
    items: [
      "weight-space model construction",
      "linear/LDA specialists",
      "chronological backtesting",
      "experiment design",
      "React",
      "Tauri",
      "SQLite",
      "web APIs",
      "Git/GitHub",
      "Linux",
    ],
  },
];

export const additional = [
  { org: "David Cooke Plaster Co.", role: "Plaster Work", date: "Summer 2026" },
  { org: "Dunkin\u2019", role: "Crew", date: "2024 \u2013 2026" },
  { org: "Tommy\u2019s Pizza", role: "Crew", date: "Summer 2024" },
];

export const education = {
  school: "Portland High School, Portland, Connecticut",
  date: "Graduated 2026",
  detail:
    "Coursework: Cybersecurity; AP Computer Science. Leadership: Wrestling Team Captain, Portland Highlanders, two years.",
};

export const colophon = {
  line: "The plain PDF is the submission copy. This page is its interactive edition: press Cmd+K to jump anywhere, or run the three v0.6.0 browser engines below (3-company-hardened Ergon, playable Anime Card Battles Open-Ro Studio, Auto-Heal & Playbooks DSH Fleet) with optional BYOK LLM or local binary connection.",
};

export type LiveDemo = {
  key: string;
  tag: string; // APP-01 ...
  title: string;
  blurb: string;
  url: string;
  img: string;
  darkImg?: string;
  page: string;
  repo: string;
  storagePrefix?: string;
  action: string;
  provenance: { label: string; text: string }[];
};

// The words around the three real interactive v0.6.0 web apps.
export const demoWords = {
  count: "live apps \u00b7 3",
  running: "running",
  idle: "interactive",
  eyebrow: "interactive v0.6.0 web engine \u00b7 runs locally in your browser",
  tryIt: "Try in the frame:",
  provenance: "how it runs",
  noCalls: "\u00b7 client-side engine \u00b7 optional BYOK or local Rust binary",
};

export const liveDemos: LiveDemo[] = [
  {
    key: "Ergon",
    tag: "APP-01",
    title: "Ergon v0.6.0 — personal employee-agent workspace",
    blurb: "Real client-side Ergon workspace paired with the v0.6.0 single-binary Rust server (hardened across a 96/96 3-company live LLM torture campaign): 12 built-in workflows, accounting-negative CSV cleaning, zero host-path leakage, drag-and-drop IndexedDB files, SHA-256 receipt exports, standing routines, Today approvals, and Cmd+K.",
    url: "/demos/ergon/",
    img: "/assets/projects/captures/ergon-v060-light.png",
    darkImg: "/assets/projects/captures/ergon-v060-dark.png",
    page: "/projects/ergon.html",
    repo: "https://github.com/cayleb-james2008/ergon",
    storagePrefix: "ergon",
    action: "upload or drop a CSV or Markdown file, run a reconciliation or any of the 12 built-in workflows, export the SHA-256 receipt, press Cmd+K to jump across workspace files, or approve a parked deletion in Today.",
    provenance: [
      { label: "What runs:", text: "the v0.6.0 House Frontend UI compiled from cayleb-james2008/ergon (frontend/) backed by a real IndexedDB workspace, 12-workflow execution engine, routines runner, and SHA-256 receipt exporter at /demos/ergon/." },
      { label: "Local & BYOK options:", text: "runs 100% locally in your browser with zero external requests by default; Settings lets you connect a BYOK OpenAI-compatible key (sessionStorage only) or a local ergon binary on 127.0.0.1." },
      { label: "Why it is here:", text: "every file write, reconciliation calculation, SHA-256 receipt export, routine run, and Today deletion approval executes genuinely on your own inputs right in the frame." },
    ],
  },
  {
    key: "Open-Ro",
    tag: "APP-02",
    title: "Open-Ro Studio v0.6.0 — Roblox game builder & Anime Card Battles Apex",
    blurb: "Real client-side Roblox Place engine paired with the v0.6.0 single-binary Rust Studio companion: 28 Roblox game systems, playable Anime Card Battles: Rebirth — Apex Edition (Roll Pack, Deck & Fusion, 50-Floor Boss & Tower Arena with real cel-shaded card art), Card Art Studio, Anime Homage Style Guide, Static Luau Prover, and bidirectional .rbxlx XML.",
    url: "/demos/open-ro/",
    img: "/assets/projects/captures/openro-v060-light.png",
    darkImg: "/assets/projects/captures/openro-v060-dark.png",
    page: "/projects/openro.html",
    repo: "https://github.com/cayleb-james2008/open-ro",
    storagePrefix: "openro",
    action: "launch Anime Card Battles: Rebirth — Apex Edition to roll packs, fuse cards, and fight the Boss & Tower Arena right in the stage, inspect Card Art Studio & Static Luau Audit Clean in Explorer, or export a real .rbxlx file.",
    provenance: [
      { label: "What runs:", text: "the v0.6.0 House Frontend UI compiled from cayleb-james2008/open-ro (frontend/) with 28 Roblox game systems, embedded cel-shaded card art portraits, playable Card Battles + 60fps Obby stage, Static Luau Prover, and bidirectional .rbxlx XML codec at /demos/open-ro/." },
      { label: "Local & BYOK options:", text: "runs 100% locally in your browser with zero external requests by default; Settings lets you configure a BYOK LLM key, Gemini/OpenAI Image API, or connect to a local openro-rs daemon on 127.0.0.1." },
      { label: "Why it is here:", text: "visitors can build and play a complete Anime Card Battles Roblox game end to end, verify Static Luau checks, inspect real card art bindings, and export genuine Studio .rbxlx place files right here." },
    ],
  },
  {
    key: "DSH Fleet",
    tag: "APP-03",
    title: "DSH Fleet v0.6.0 — Mission Control with Auto-Heal, Playbooks & Telemetry",
    blurb: "Real in-browser git worktree, DAG batch scheduler, autonomous Auto-Heal feedback loop, reusable Playbook templates, Board Telemetry strip, and multi-step Web Worker check-runner engine paired with the v0.6.0 single-binary Rust orchestrator: inspect Auto-heal timelines, Split Diffs, merge dry-runs, .patch exports, and verified merges.",
    url: "/demos/dsh-fleet/",
    img: "/assets/projects/captures/fleet-v060-light.png",
    darkImg: "/assets/projects/captures/fleet-v060-dark.png",
    page: "/projects/dsh-fleet.html",
    repo: "https://github.com/cayleb-james2008/dsh-fleet",
    storagePrefix: "fleet",
    action: "inspect Board Telemetry and Auto-heal attempt timelines, pick or save a Playbook in Composer or Cmd+K, dispatch a failing session or DAG batch, steer until multi-step checks exit 0, and merge verified commits into main.",
    provenance: [
      { label: "What runs:", text: "the v0.6.0 House Frontend UI compiled from cayleb-james2008/dsh-fleet (frontend/) backed by a real IndexedDB virtual git worktree store, Auto-Heal & Playbooks engine, Board Telemetry strip, DAG scheduler, unified/split diff viewer, and multi-step Web Worker check runner at /demos/dsh-fleet/." },
      { label: "Local & BYOK options:", text: "executes real isolated branch checks locally in your browser by default; Settings lets you run the Policy Tester, add a BYOK coding model (sessionStorage only), or connect to a local fleet-rs daemon on 127.0.0.1." },
      { label: "Why it is here:", text: "Fleet's core promise is autonomous check-driven delivery without weakening guardrails — you can watch Auto-Heal timelines, save Playbooks, trigger real check failures, inspect diffs, and land verified commits right here." },
    ],
  },
];

export const NAV = [
  { id: "summary", label: "summary", via: "1" },
  { id: "experience", label: "experience", via: "5" },
  { id: "projects", label: "projects", via: "3" },
  { id: "live-demos", label: "demos", via: "4" },
  { id: "skills", label: "skills", via: "6" },
  { id: "additional", label: "additional", via: "6" },
  { id: "education", label: "education", via: "6" },
] as const;
