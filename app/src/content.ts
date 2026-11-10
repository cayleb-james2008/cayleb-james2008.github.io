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
    { label: "linkedin.com/in/cayleb-alvarez-james-99850531b", href: "https://linkedin.com/in/cayleb-alvarez-james-99850531b" },
    { label: "cayleb-james2008.github.io", href: "https://cayleb-james2008.github.io/" },
  ],
};

export const PDF = {
  href: "/Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf",
  name: "Cayleb-Alvarez-James-Resume-Anthropic-2026-11-06.pdf",
  size: "88 KB",
  note: "the plain PDF, the submission copy",
};

export const summary = [
  "AI agent systems engineer and technical founder. I have spent the past year on agentic systems and harness engineering, starting while I was finishing high school, where I was also wrestling team captain for two years. For most of that stretch I worked 13 to 14 hours a day on it, around school, my job and wrestling. I work across several harnesses instead of just one: OpenCode and DeepSeek Harness, Claude Desktop and Duet, Gemini Antigravity, Freebuff, ChatGPT Codex and Claude Code. I pick whichever has usage left and fits the job. Right now most of the work runs through Muse, Claude Duet and the DSH Fleet I am finishing. Three systems make up most of it. Ergon\u2019s employee agents set themselves up: the agent watches how someone works, asks them targeted questions, learns the role and keeps a memory of the person, adding skills and tools as it goes. The DSH Fleet runs dynamic swarms across desktop, virtual machine and browser surfaces, lets outside agents join through Slack, and improves its own workflows, skills and plugin behaviour from the results of finished jobs. OpenBell is my trading research system: I set the weights of tiny models directly, freeze their predictions before scoring, and score them in time order with costs counted.",
  "1,200+ GitHub contributions in the last year. 4,000+ automated tests across five shipped systems.",
];

// The stated test counts, as the résumé states them (the ledger). Never derived, never rounded.
export const ledger = {
  total: { label: "Five systems total", display: "4,000+" },
  contributions: { label: "GitHub contributions, last year", display: "1,200+" },
  bars: [
    { name: "Sophos interface", value: 1224, display: "1,224" },
    { name: "Asmodeus Rust", value: 1111, display: "1,111" },
    { name: "dotz core tests", value: 828, display: "828+" },
    { name: "Ergon tests", value: 622, display: "622" },
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
      "Built Ergon as a self-configuring employee-agent platform. After installation, the agent learns the employee\u2019s role by watching their recurring work and asking targeted questions, then proposes capabilities it can take over. A learned skill or tool has to pass evaluation and review before the agent can use it, so nobody has to map the role in advance or keep adjusting the agent by hand.",
      "Built the DSH Fleet. A dynamic swarm forms around each objective, execution runs across desktop, Windows VM, phone VM and browser surfaces, and outside agents can join through Slack under the same coordination and outcome rules. Slack was not the original integration layer. I was going to build my own, but I kept getting flagged by the existing guardrails on Muse and the other platforms I build on, so I used Slack for that layer instead.",
      "Built OpenBell around weight-space model development. I set the weights of tiny specialist models directly, freeze their predictions before scoring, and score them in time order with costs and kill rules counted. Live trading is where candidates get tested, in slots with capital kept separate.",
      "The Omni Loop is the fleet\u2019s recursive self-improvement system, and every change it makes is gated: results from finished jobs drive revisions to the workflows, plugin, skills and the loop itself, and a revision ships only when it measures better than the current version on a fixed scorecard, checked against a frozen set of past tickets. Every change is versioned and can be rolled back.",
    ],
  },
  {
    date: "Sep 2026 \u2013 Present",
    org: "Robert H. Lord Company (RHL) \u00b7 AI Concept Discussion & Warehouse-Board Demo",
    bullets: [
      "Discussed a proposed Ergon deployment at RHL; the concept drew interest, but RHL has not authorised or implemented an AI integration, and no Ergon infrastructure is in production there.",
      "At Roy\u2019s request, built a standalone warehouse-board demo as a non-AI operational showcase. It is a demonstration artifact, not an official RHL system, AI deployment or production rollout.",
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
    name: "Ergon",
    kind: "Self-Configuring Employee Agents & Autonomous Role Learning",
    stack: "Node.js, C#, Python, SQLite",
    figure: "622 automated tests",
    status: "in development",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "A proven skill can enter a shared library \u2014 other agents earn it through the same gate, with permissions scoped and reversible.",
    capture: { src: "/demos/ergon-poster.png", alt: "Still of the real Ergon capture: the current front set, the morning brief and the approval card", label: "real capture \u00b7 current front set", spec: "1280 \u00d7 800 \u00b7 22.4 s \u00b7 real input, no injected UI" },
    steps: [
      { title: "installed", sub: "signed installer \u00b7 taskbar app" },
      { title: "watches work, asks questions", sub: "" },
      { title: "builds the role model", sub: "" },
      { title: "proposes a capability", sub: "" },
      { title: "evaluation + review", sub: "gate" },
      { title: "earns the right to use it", sub: "personalisation in the harness" },
    ],
    bullets: [
      "How it onboards: once installed, the agent starts watching the employee\u2019s recurring work and tools and asking targeted questions. It builds a persistent model of the role, proposes and builds a capability, then puts it through evaluation and review before it earns the right to use it. Personalisation is built into the harness itself.",
      "Proven skills can enter a shared library for other agents to earn through the same gate, so capability compounds across a company while permissions stay scoped and reversible.",
      "Standalone product in development, with a signed Windows installer and taskbar app, demo connectors and ticket-scoped remote repair. RHL is a proposed first deployment only. Its Ergon infrastructure is still planned, not implemented. 622 automated tests pass.",
    ],
    demo: "Ergon",
  },
  {
    name: "DSH Fleet",
    kind: "Distributed, Self-Improving Agent Infrastructure",
    stack: "Python, TypeScript",
    repo: "github.com/cayleb-james2008/dsh-fleet-genesis",
    status: "private repository",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "A revision is promoted only after a fresh check measures a win; failures are archived and changes stay reversible. Slack is the coordination layer \u2014 outside agents work through the same tickets and rules.",
    capture: { src: "/demos/fleet-poster.png", alt: "Still of the real DSH Fleet capture: the fleet panel the owner approved", label: "real capture \u00b7 owner-approved panel", spec: "1600 \u00d7 1000 \u00b7 owner-approved take, no compositing" },
    steps: [
      { title: "objective", sub: "" },
      { title: "dynamic swarm forms", sub: "a lead, preferences, skills, routing" },
      { title: "runs on four surfaces", sub: "desktop \u00b7 Windows VM \u00b7 phone VM \u00b7 browser" },
      { title: "actions that matter need approval", sub: "gate" },
      { title: "one recorded outcome", sub: "" },
      { title: "Omni Loop revision", sub: "fixed scorecard + frozen set" },
    ],
    bullets: [
      "The fleet is an agent control plane that spans desktop, Windows VM, phone VM and browser surfaces. Slack is the open coordination layer: agents people bring themselves can work through the same tickets and rules instead of being locked to one harness.",
      "Each objective gets a dynamic swarm shaped to the task, formed around a lead. The swarm works from persistent preferences, current skills, research and model routing. Every session is defined before it runs, actions that matter need approval, and the swarm dissolves after one recorded outcome.",
      "The fleet improves its own operating system as it works. The evidence from each job feeds Omni Loop revisions to its workflows, plugin behaviour and skill library. A revision is promoted only after a fresh check measures a win on a fixed scorecard and a frozen regression set. Failures are archived and changes stay reversible.",
    ],
    demo: "DSH Fleet",
  },
  {
    name: "OpenBell",
    kind: "Weight-Space Training & Evaluation for Trading Models",
    stack: "Python, Rust",
    status: "live testing grounds",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "No money test until training performance clears the breakeven for the exit shape. Directly authored weights produced the strongest results, including one Nasdaq configuration net-positive on historical data.",
    capture: { src: "/demos/openbell-poster.png", alt: "Still of the real OpenBell capture: the Ticket 070 watchtower with three live lanes", label: "real capture \u00b7 Ticket 070 watchtower", spec: "1280 \u00d7 800 \u00b7 22.2 s \u00b7 real mouse input, no injected UI" },
    steps: [
      { title: "author weights directly", sub: "tiny specialist models" },
      { title: "freeze weights + prediction", sub: "gate" },
      { title: "score in time order", sub: "costs and kill rules counted" },
      { title: "live trading tests the candidate", sub: "Kalshi \u00b7 futures \u00b7 meme coins \u00b7 capital separate" },
      { title: "inspectable, provable", sub: "negative results kept on record" },
    ],
    bullets: [
      "The AI work is direct weight-space construction. I build low-dimensional weights for tiny specialist models instead of relying on prompted strategies or opaque end-to-end training. Each candidate\u2019s weights and prediction are frozen before scoring, so the hypothesis can be inspected and proven wrong.",
      "Evaluation is adversarial on purpose: time-ordered splits, transaction costs, negative results kept on record, kill rules set in advance, and no money test until training performance clears the breakeven for the exit shape. Conventional distillation failed on both benchmark instruments. Directly authored weights produced the strongest results, including one Nasdaq configuration that was net-positive on historical data.",
      "Kalshi, futures and meme coin trading are live testing grounds, with capital kept separate per experiment. Parallel slots and 2x ladder runs test candidates against reconciled real-market accounting.",
    ],
    demo: "OpenBell",
  },
  {
    name: "Sophos",
    kind: "Coding-Agent Desktop App",
    stack: "React, TypeScript, Tauri",
    repo: "github.com/cayleb-james2008/sophos",
    figure: "1,224 interface tests \u00b7 82 Node tests \u00b7 56/56 Windows checks",
    status: "merged after hosted CI",
    stepsLead: "how it works \u00b7 from the r\u00e9sum\u00e9\u2019s description",
    lead: "Desktop app that runs coding agents from saved profiles. 1,224 interface tests and 82 Node tests pass; 56/56 Windows checks pass.",
    chart: { rows: [{ name: "interface tests", value: 1224, display: "1,224" }, { name: "Node tests", value: 82, display: "82" }, { name: "Windows checks", value: 56, display: "56/56" }], label: "Sophos stated test counts: 1,224 interface tests, 82 Node tests, and 56 of 56 Windows checks.", caption: "stated test counts \u00b7 square-root scale \u00b7 from the r\u00e9sum\u00e9", sqrt: true },
    steps: [
      { title: "saved profiles", sub: "coding agents" },
      { title: "run the agent", sub: "" },
      { title: "sessions + transcripts", sub: "survive restarts" },
      { title: "clear error on provider failure", sub: "" },
      { title: "merged after hosted CI", sub: "gate" },
    ],
    bullets: [
      "Desktop app that runs coding agents from saved profiles, with sessions and transcripts that survive restarts and clear errors when a provider fails.",
      "1,224 interface tests, 82 Node tests and 56/56 Windows checks pass; merged after full hosted CI.",
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
  line: "The plain PDF is the submission copy. This page is its interactive edition, and every demo on it is the real app build running in the frame \u2014 no recording stands in for a demo.",
};

export type LiveDemo = {
  key: string;
  tag: string; // DEMO-01 ...
  title: string;
  blurb: string;
  url: string;
  hint?: string; // only the fleet frame has one
  action: string;
  build: string;
  provenance: { label: string; text: string }[];
};

// The words around the demos, as the live page prints them.
export const demoWords = { count: "live demos \u00b7 3", running: "running", idle: "runs in the frame", eyebrow: "runs in your browser", tryIt: "try it", provenance: "provenance", noCalls: "\u00b7 no third-party calls" };

export const liveDemos: LiveDemo[] = [
  {
    key: "Ergon",
    tag: "DEMO-01",
    title: "Ergon \u2014 the current front set",
    blurb: "The real Ergon app, running in the frame: the morning brief speaks first, the approval card holds to commit, the Decisions inbox keeps the result, and apps open beside the thread.",
    url: "/demos/ergon/",
    action: "Hold \u201cHold to approve\u201d for ~0.9 s, then open Decisions \u2014 the decision is recorded in the app\u2019s own state.",
    build: "index 65f5929d\u2026 \u00b7 js ad89de27\u2026 \u00b7 css f9c7d06f\u2026",
    provenance: [
      { label: "What runs:", text: "the real build served at /demos/ergon/, the same bytes in this frame and in the standalone tab." },
      { label: "What is fixture:", text: "The app names its own fixture reply engine in the footer: \u201cfixture reply engine \u2014 no live agent runtime\u201d." },
      { label: "Why it is here:", text: "the r\u00e9sum\u00e9 claims the app works; the demo lets a visitor check that claim by using it, not by watching a recording." },
    ],
  },
  {
    key: "DSH Fleet",
    tag: "DEMO-02",
    title: "DSH Fleet \u2014 the approved panel",
    blurb: "The fleet dashboard the owner approved as-is, with its captured snapshot embedded: the graph, the swarm panel, the tabs and every node\u2019s drill-down are live in the frame.",
    url: "/demos/fleet/",
    hint: "desktop-width dashboard \u2014 swipe or scroll the frame sideways to pan",
    action: "Click any node in the graph (or Tab to it and press Enter) to drill into its state; on a phone, swipe the frame sideways to pan the desktop-width dashboard.",
    build: "dashboard.html e6081699\u2026 \u00b7 self-contained, no network calls",
    provenance: [
      { label: "What runs:", text: "the real build served at /demos/fleet/, the same bytes in this frame and in the standalone tab." },
      { label: "What is fixture:", text: "The dashboard is a captured snapshot (02:35 UTC, embedded in the page); the header says \u201ccaptured 02:35:16Z\u201d. It is not a live fleet feed." },
      { label: "Why it is here:", text: "the r\u00e9sum\u00e9 claims the app works; the demo lets a visitor check that claim by using it, not by watching a recording." },
    ],
  },
  {
    key: "OpenBell",
    tag: "DEMO-03",
    title: "OpenBell \u2014 the Ticket 070 watchtower",
    blurb: "The real watchtower build: three lanes, each desk one level down, tooltips with the exact figures, a stale reading labelled STALE, and a lane detail with the desk\u2019s account figures.",
    url: "/demos/openbell/",
    action: "Open \u201cDetails\u201d on a lane for its account figures, hover a point for its exact value, then use \u201cAll three lanes\u201d to go back.",
    build: "index 41d413c5\u2026 \u00b7 js d6fa2f20\u2026 \u00b7 css 9e78fdd4\u2026",
    provenance: [
      { label: "What runs:", text: "the real build served at /demos/openbell/, the same bytes in this frame and in the standalone tab." },
      { label: "What is fixture:", text: "The app labels its sample series \u201cDEMO\u201d and \u201cSTALE \u2014 DEMO snapshot\u201d itself; no source answered, so it shows sample data honestly. Its own subtitle says \u201cevery chart read from the desk\u2019s own live source\u201d while the banner and the STALE tag say DEMO \u2014 the banner and tag are the operative honesty labels, and Refresh re-asks a launcher this static host does not run, so the labelled sample data stays." },
      { label: "Why it is here:", text: "the r\u00e9sum\u00e9 claims the app works; the demo lets a visitor check that claim by using it, not by watching a recording." },
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
