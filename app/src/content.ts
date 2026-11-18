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
  size: "88 KB",
  note: "the plain PDF, the submission copy",
};

export const summary = [
  "AI agent systems engineer and technical founder. I have spent the past year on agentic systems and harness engineering, starting while I was finishing high school, where I was also wrestling team captain for two years. For most of that stretch I worked 13 to 14 hours a day on it, around school, my job and wrestling. I work across several harnesses instead of just one: OpenCode and DeepSeek Harness, Claude Desktop and Duet, Gemini Antigravity, Freebuff, ChatGPT Codex and Claude Code. I pick whichever has usage left and fits the job. Right now most of the work runs through Muse, Claude Duet and the DSH Fleet I am finishing. Three systems make up most of it. Ergon\u2019s employee agents are built to set themselves up \u2014 to watch how someone works, ask targeted questions, learn the role and keep a memory of the person, adding skills and tools as it goes. That loop is built and verified against simulated companies; the live model connection is the remaining piece before a first install. The DSH Fleet runs dynamic swarms across desktop, virtual machine and browser surfaces, takes its tickets through Slack, and improves its own workflows, skills and plugin behaviour through a governed, checker-gated improvement programme run in rounds. OpenBell is my trading system: the desk runs a slot system \u2014 one slot per 15-minute market, every order placed by hand \u2014 and the research programme behind it is weight-space: I set the weights of tiny models directly, freeze their predictions before scoring, and score them in time order with costs counted.",
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
      "Built OpenBell as a slot-system trading desk \u2014 one slot per 15-minute market, every order placed by hand \u2014 with weight-space model development as the research programme behind it. I set the weights of tiny specialist models directly, freeze their predictions before scoring, and score them in time order with costs and kill rules counted. Candidates get tested in slots with capital kept separate. The desk is currently paused while the system is rebuilt.",
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

// The four product pages (static pages under /projects/, built 16 November 2026). The pitches are the page's own
// words — each is grounded in its project's repository and logged in NEW-TEXT.md. Open-Ro Studio is not a résumé
// record; it joins the other three here because its product page does.
export type ProductPage = { name: string; href: string; pitch: string; img?: string; alt: string };
export const productPagesHead = "the four products, in full";
export const productPageLink = "the full product page ↗";
export const productPages: ProductPage[] = [
  {
    name: "Ergon",
    href: "/projects/ergon.html",
    pitch: "An AI agent for every employee — personal to each person, it learns how they work and finishes their digital work autonomously, end to end. No approval ceremony in the middle.",
    img: "/assets/projects/captures/ergon-rs-main.png",
    alt: "Capture of the current Ergon build: a finished task in the thread — the agent read two messy note files, wrote Summary.md, updated its memory of how its person works, and reported done, its tool steps shown as a ledger",
  },
  {
    name: "OpenBell",
    href: "/projects/openbell.html",
    pitch: "A compounding desk for Kalshi's 15-minute markets — it collects the venue's public data around the clock and scores a library of strategies against that tape on paper, in slots that compound. It places no orders.",
    img: "/assets/projects/captures/openbell-rs-main.png",
    alt: "Capture of the current OpenBell build: the home screen in shadow mode — venue balance, day P&L, open positions and capital at risk all read 'unavailable' (no credential in the environment), above the forward collector's counts and real public market rows",
  },
  {
    name: "Open-Ro Studio",
    href: "/projects/openro.html",
    pitch: "You describe the game, it builds it — a proactive creative agent in a plain chat window, full access by default: it writes the scripts, playtests its own work, fixes what breaks, and every change can be reverted.",
    img: "/assets/projects/captures/openro-rs-main.png",
    alt: "Capture of the current OpenRO build: a chat where the agent wrote a round manager for the game Neon Harbor, the playtest failed, it read the console and repaired the script, and the playtest passed — Studio connected, and a Revert button under the thread",
  },
  {
    name: "DSH Fleet",
    href: "/projects/dsh-fleet.html",
    pitch: "Your agents working in parallel under one screen — hand out the work, and it comes back verified done: Fleet runs your check command itself, and everything else lands in a Needs-you inbox with the reason. Nothing is babysat.",
    img: "/assets/projects/captures/fleet-rs-main.png",
    alt: "Capture of the current DSH Fleet build: a session marked 'Check passed — verified done', its transcript and diff on screen and its work ready to merge, with a second session waiting in the Needs-you inbox",
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
  line: "The plain PDF is the submission copy. This page is its interactive edition, and every capture on it is a still of the current build \u2014 taken from the app itself, not a mockup.",
};

export type LiveDemo = {
  key: string;
  tag: string; // DEMO-01 ...
  title: string;
  blurb: string;
  img: string;
  action: string;
  provenance: { label: string; text: string }[];
};

// The words around the captures, as the live page prints them.
export const demoWords = { count: "captures \u00b7 3", running: "shown", idle: "capture", eyebrow: "a still of the current build", tryIt: "In the frame:", provenance: "provenance", noCalls: "\u00b7 no third-party calls" };

export const liveDemos: LiveDemo[] = [
  {
    key: "Ergon",
    tag: "CAPTURE-01",
    title: "Ergon — the current build",
    blurb: "The current Ergon build at work: a second finished task in the same running copy — a plain-words ask, the agent's steps as a ledger in the thread, a finished spreadsheet, and the summary it reported. No approval step sits in the middle.",
    img: "/assets/projects/captures/ergon-rs-demo.png",
    action: "the expenses task, finished end to end; the first task in the sidebar turned two messy note files into Summary.md and updated what the agent has learned about its person.",
    provenance: [
      { label: "What is shown:", text: "a capture of ergon-rs, the Rust rebuild, running on the owner's machine — taken 18 November 2026 at the app's own 1280×800, in the dark theme it ships with." },
      { label: "What is fixture:", text: "the tasks and files are fixture work seeded for the capture, and the model answering the agent was a scripted stand-in on the same machine: this environment holds no live model key for the app, and the app refuses honestly when it has none. The interface, the tools and the files produced are the app's own." },
      { label: "Why it is here:", text: "the résumé claims the app works; the capture shows its current interface doing a task end to end. The interactive demo that used to run in this frame was the retired build, and it has been removed." },
    ],
  },
  {
    key: "DSH Fleet",
    tag: "CAPTURE-02",
    title: "DSH Fleet — the current build",
    blurb: "The current Fleet build catching a claim: the agent said its work was finished, Fleet ran the task's check itself on the committed tree, the check failed — so the session sits in Needs-you with the reason and a Retry button, not in Done.",
    img: "/assets/projects/captures/fleet-rs-demo.png",
    action: "the failed session, with the two verified-done sessions behind it in the sidebar; the check — test -s output.txt — is the project's own, from its policies file.",
    provenance: [
      { label: "What is shown:", text: "a capture of fleet-rs, the Rust rebuild, running on the owner's machine — taken 18 November 2026 at 1280×800, in the dark theme it ships with." },
      { label: "What is fixture:", text: "the three sessions are fixture tasks handed out through the app's own API, run by a fixture agent against a fixture repository. The statuses, the transcript and the failed check are the app's real verdicts on that work." },
      { label: "Why it is here:", text: "the résumé claims Fleet verifies work before calling it done; the capture shows a claim being refused. The dashboard snapshot that used to sit in this frame was the retired build, and it has been removed." },
    ],
  },
  {
    key: "OpenBell",
    tag: "CAPTURE-03",
    title: "OpenBell — the current build",
    blurb: "The current OpenBell build scoring its strategy library on paper against the forward tape: the paper equity curves, and every strategy's verdict — each one reads 'insufficient evidence', because the promotion standard is code and it asks for 100 forward windows.",
    img: "/assets/projects/captures/openbell-rs-demo.png",
    action: "the shadow strategies table over a slice of the collected tape; on the home screen above it, the venue balance and day P&L read 'unavailable', as they do without a credential.",
    provenance: [
      { label: "What is shown:", text: "a capture of openbell-rs, the Rust rebuild, running on the owner's machine against a copy of a slice of the real collected tape — taken 18 November 2026 at 1280×800." },
      { label: "What is fixture:", text: "nothing in the frame is a venue account figure. This build places no orders; the paper pot and curves are its own simulation over real public market data it collected, labelled paper-only in the app itself." },
      { label: "Why it is here:", text: "the résumé claims the desk scores strategies against forward evidence under a fixed standard; the capture shows the standard refusing to promote any of them yet. The watchtower demo that used to run in this frame was the retired build, and it has been removed." },
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
