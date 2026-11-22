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

// The three flagship product pages (static pages under /projects/, updated for v0.3.0). Open-Ro Studio is not a résumé
// record; it joins Ergon and DSH Fleet here because its product page and interactive fixture demo do.
export type ProductPage = { name: string; href: string; pitch: string; img: string; darkImg?: string; alt: string };
export const productPagesHead = "the three products, in full";
export const productPageLink = "the full product page ↗";
export const productPages: ProductPage[] = [
  {
    name: "Ergon",
    href: "/projects/ergon.html",
    pitch: "An AI agent for every employee — personal to each person, it learns how they work and finishes their digital work autonomously, end to end. Single Rust binary + Rune runtime.",
    img: "/assets/projects/captures/ergon-v030-light.png",
    darkImg: "/assets/projects/captures/ergon-v030-dark.png",
    alt: "Capture of Ergon v0.3.0 in the House Frontend workspace: conversation rail with memory ledger and Rune skill triggers, Chat · Today · Work Graph views, and completed task entries badged fixture demo",
  },
  {
    name: "Open-Ro Studio",
    href: "/projects/openro.html",
    pitch: "You describe the game, it builds it — a local-first Rust + Rune creative agent for Roblox Studio that writes Luau scripts, playtests its own work, repairs console faults, and checkpoints every ask.",
    img: "/assets/projects/captures/openro-v030-light.png",
    darkImg: "/assets/projects/captures/openro-v030-dark.png",
    alt: "Capture of OpenRO v0.3.0 in the House Frontend workspace: game-chat rail with Starter Blueprints, Studio Build Trace with Playtest Verdict, and In Your Game Explorer shelf badged fixture demo",
  },
  {
    name: "DSH Fleet",
    href: "/projects/dsh-fleet.html",
    pitch: "Your agents working in parallel under one Mission Control screen — hand out the work, Fleet runs the mechanical check command itself, and unverified work lands in a Needs-you inbox with the receipt.",
    img: "/assets/projects/captures/fleet-v030-light.png",
    darkImg: "/assets/projects/captures/fleet-v030-dark.png",
    alt: "Capture of DSH Fleet v0.3.0 Mission Control in the House Frontend workspace: Needs-you inbox, 32-session Tremor outcome tracker, verified receipt card, three-lane board, and diff inspector badged fixture demo",
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
  line: "The plain PDF is the submission copy. This page is its interactive edition: the three v0.3.0 fixture demos below run the real House Frontend app UIs against in-browser fixture data (badged fixture demo), paired with full-resolution captures from the apps.",
};

export type LiveDemo = {
  key: string;
  tag: string; // DEMO-01 ...
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

// The words around the three interactive v0.3.0 fixture demos.
export const demoWords = {
  count: "live demos \u00b7 3",
  running: "running",
  idle: "fixture demo",
  eyebrow: "interactive v0.3.0 fixture build \u00b7 badged fixture demo",
  tryIt: "Try in the frame:",
  provenance: "provenance",
  noCalls: "\u00b7 fixture demo \u00b7 zero third-party network calls",
};

export const liveDemos: LiveDemo[] = [
  {
    key: "Ergon",
    tag: "DEMO-01",
    title: "Ergon v0.3.0 — personal employee-agent workspace",
    blurb: "The v0.3.0 House Frontend workspace for Ergon's single-binary Rust + Rune daemon: conversation rail with learned preferences and Rune skill triggers, Chat \u00b7 Today \u00b7 Work Graph views, and multi-step tool ledgers.",
    url: "/demos/ergon/",
    img: "/assets/projects/captures/ergon-v030-light.png",
    darkImg: "/assets/projects/captures/ergon-v030-dark.png",
    page: "/projects/ergon.html",
    repo: "https://github.com/cayleb-james2008/ergon",
    storagePrefix: "ergon",
    action: "switch between Chat, Today, and Work Graph, inspect the agent's memory and Rune skill suite in the rail, or post a task prompt against the in-browser fixture store.",
    provenance: [
      { label: "What runs:", text: "the v0.3.0 House Frontend UI compiled from cayleb-james2008/ergon (frontend/), served directly from /demos/ergon/ with zero external network calls." },
      { label: "What is fixture:", text: "the conversations, learned preferences, Work Graph nodes, and Rune skill outputs come from an in-browser fixture adapter (badged fixture demo inside the UI) rather than a live LLM key or local SQLite daemon." },
      { label: "Why it is here:", text: "the r\u00e9sum\u00e9 claims Ergon's employee-agent loop is built and verified against simulated companies; both the interactive UI and the v0.3.0 desktop captures are inspectable here." },
    ],
  },
  {
    key: "Open-Ro",
    tag: "DEMO-02",
    title: "Open-Ro Studio v0.3.0 — local-first Roblox agent studio",
    blurb: "The v0.3.0 House Frontend Game Builder Studio Workbench for OpenRO's single-binary Rust + Rune companion: Starter Blueprints, Studio Build Trace with Playtest Verdict and Luau console, In Your Game Explorer shelf, and one-click Undo.",
    url: "/demos/open-ro/",
    img: "/assets/projects/captures/openro-v030-light.png",
    darkImg: "/assets/projects/captures/openro-v030-dark.png",
    page: "/projects/openro.html",
    repo: "https://github.com/cayleb-james2008/open-ro",
    storagePrefix: "openro",
    action: "switch between Skyline Obby + Speed Shop and Starter Blueprints in the rail, inspect the Playtest Verdict and In Your Game Explorer shelf, or send a prompt and test Undo.",
    provenance: [
      { label: "What runs:", text: "the v0.3.0 House Frontend UI compiled from cayleb-james2008/open-ro (frontend/), served directly from /demos/open-ro/ with zero external network calls." },
      { label: "What is fixture:", text: "Roblox Studio MCP responses, Workspace parts, Luau scripts, playtest console logs, and Undo checkpoints are served by an in-browser fixture adapter (badged fixture demo inside the UI)." },
      { label: "Why it is here:", text: "Open-Ro Studio pairs with Ergon and DSH Fleet as the third public v0.3.0 Rust + Rune build; its interactive workspace and v0.3.0 captures are shown together here." },
    ],
  },
  {
    key: "DSH Fleet",
    tag: "DEMO-03",
    title: "DSH Fleet v0.3.0 — Mission Control for parallel coding agents",
    blurb: "The v0.3.0 House Frontend Mission Control for DSH Fleet's single-binary Rust + Rune orchestrator: Needs-you inbox, 32-session Tremor outcome tracker, mechanical check receipts, three-lane board, and diff inspector.",
    url: "/demos/dsh-fleet/",
    img: "/assets/projects/captures/fleet-v030-light.png",
    darkImg: "/assets/projects/captures/fleet-v030-dark.png",
    page: "/projects/dsh-fleet.html",
    repo: "https://github.com/cayleb-james2008/dsh-fleet",
    storagePrefix: "fleet",
    action: "inspect verified vs refused sessions across the Needs-you, Running, and Verified lanes, switch between Transcript, Diff, and Receipt tabs, or dispatch/retry a fixture session.",
    provenance: [
      { label: "What runs:", text: "the v0.3.0 House Frontend UI compiled from cayleb-james2008/dsh-fleet (frontend/), served directly from /demos/dsh-fleet/ with zero external network calls." },
      { label: "What is fixture:", text: "the sessions, git worktree diffs, and mechanical check verdicts are driven by an in-browser fixture adapter (badged fixture demo inside the UI) rather than live worker processes." },
      { label: "Why it is here:", text: "the r\u00e9sum\u00e9 claims Fleet gates agent claims behind mechanical verification; the demo lets a reader inspect both verified receipts and refused Needs-you sessions directly." },
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
