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
  size: "51 KB",
  note: "the plain PDF, the submission copy",
};

export const summary = [
  "AI agent systems engineer and technical founder. I have spent the past year on agentic systems and harness engineering, starting while I was finishing high school, where I was also wrestling team captain for two years. For most of that stretch I worked 13 to 14 hours a day on it, around school, my job and wrestling. I work across several harnesses instead of just one: OpenCode and DeepSeek Harness, Claude Desktop and Duet, Gemini Antigravity, Freebuff, ChatGPT Codex and Claude Code. I pick whichever has usage left and fits the job. Right now most of the work runs through Muse, Claude Duet and Fleet. Two systems make up most of it. Ergon\u2019s employee agents are built to set themselves up \u2014 to watch how someone works, ask targeted questions, learn the role and keep a memory of the person, adding skills and tools as it goes. That loop is built and verified against simulated companies; the live model connection is the remaining piece before a first install. Fleet runs dynamic swarms across desktop, virtual machine and browser surfaces, takes its tickets through Slack, and improves its own workflows, skills and plugin behaviour through a governed, checker-gated improvement programme run in rounds.",
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
      "Built Fleet. A dynamic swarm forms around each objective, execution runs across desktop, Windows VM, phone VM and browser surfaces, and tickets are coordinated through Slack under the same coordination and outcome rules. The coordination protocol is designed to let outside agents join through it as well \u2014 a design goal, not yet an observed practice. Slack was not the original integration layer. I was going to build my own, but I kept getting flagged by the existing guardrails on Muse and the other platforms I build on, so I used Slack for that layer instead.",
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

// The three flagship product pages (static pages under /projects/):
// 1. Open-Ro Studio (v1.1.0), 2. OpenBell (v0.9.0), 3. Fleet (v0.9.0). Ergon (v0.10.0) stays accessible at /projects/ergon.html & /demos/ergon/.
export type ProductPage = { name: string; href: string; pitch: string; img: string; darkImg?: string; alt: string };
export const productPagesHead = "the three products, in full";
export const productPageLink = "the full product page ↗";
export const productPages: ProductPage[] = [
  {
    name: "Open-Ro Studio",
    href: "/projects/openro.html",
    pitch: "Studio Copilot 3-pane Roblox Studio AI IDE — Agent/Plan/Ask unified Luau diffs, Monetization & Retention Luau pack (ProcessReceipt idempotency, GamePass, Daily Streak), embedded live Roblox Studio + auto-synced Explorer, Companion Plugin, all 13 MCP tools, and Rojo .zip export.",
    img: "/assets/projects/captures/openro-v110-light.png",
    darkImg: "/assets/projects/captures/openro-v110-dark.png",
    alt: "Live capture of OpenRO v1.1.0 Studio Copilot 3-pane Roblox Studio AI IDE: Explorer DataModel dock, Studio 3D and Code & Diff workspace, Studio MCP Tools (13) bottom drawer, and Agent/Plan/Ask Copilot pane",
  },
  {
    name: "OpenBell",
    href: "/projects/openbell.html",
    pitch: "Institutional Kalshi Trade API v2 quant terminal in Rust — 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel + causal lookahead-canary tests, fail-closed Hard Risk Rails (disarmed on every boot), Emergency Kill Switch, Strategy Tournament, PAV Calibration, and $500/Day Capital Scaling Engine.",
    img: "/assets/projects/captures/openbell-v090-light.png",
    darkImg: "/assets/projects/captures/openbell-v090-dark.png",
    alt: "Live capture of OpenBell v0.9.0 Institutional Quant Terminal: Paper Compounding Curve, Kalshi DEMO risk-rails bar with Arm Live and Emergency Kill Switch, 5-Series 15m Tape, and Full Quant Edge Audit funnel",
  },
  {
    name: "Fleet",
    href: "/projects/fleet.html",
    pitch: "Parallel coding-agent workbench — Goal-to-DAG planner, interactive multi-wave Board / DAG Graph toggle, PR Preview & confirmation-gated GitHub PR creator, Worktrees Inspector, Daily Dispatch Budget guardrails, Auto-Heal, Playbooks, and native Windows support (-24.1% bundle).",
    img: "/assets/projects/captures/fleet-v090-light.png",
    darkImg: "/assets/projects/captures/fleet-v090-dark.png",
    alt: "Live capture of Fleet v0.9.0 Mission Control workbench: Board Telemetry strip with Daily budget, Board / DAG Graph toggle, Goal-to-DAG multi-wave execution, and verified receipt inspection",
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
  line: "The plain PDF is the submission copy. This page is its interactive edition: press Cmd+K to jump anywhere, or run the three flagship live browser engines below (Studio Copilot 3-pane IDE Open-Ro v1.1.0, Institutional Quant Terminal OpenBell v0.9.0, Goal-to-DAG workbench Fleet v0.9.0) with zero external requests by default.",
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

// The words around the three flagship interactive web apps (Open-Ro v1.1.0, OpenBell v0.9.0, Fleet v0.9.0).
export const demoWords = {
  count: "live apps \u00b7 3",
  running: "running",
  idle: "interactive",
  eyebrow: "interactive web engine \u00b7 runs locally in your browser",
  tryIt: "Try in the frame:",
  provenance: "how it runs",
  noCalls: "\u00b7 100% client-side sandbox \u00b7 optional local Rust binary",
};

export const liveDemos: LiveDemo[] = [
  {
    key: "Open-Ro",
    tag: "APP-01",
    title: "Open-Ro Studio v1.1.0 — Studio Copilot 3-pane Roblox Studio AI IDE",
    blurb: "Real client-side 3-pane Studio Copilot IDE paired with the v1.1.0 single-binary Rust app (298/298 tests, Monetization & Retention Luau pack with ProcessReceipt idempotency, GamePass, Daily Streak, directly embedded live Roblox Studio + auto-synced Explorer, Companion Plugin, and all 13 MCP tools): switch between Agent, Plan (staged unified Luau diffs), and Ask modes, inspect green/red hunks in Code & Diff, co-build in Studio 3D, browse the Tool Library & Market Taste Craft Radar, and export .rbxlx XML or Rojo Ship Pack (.zip).",
    url: "/demos/open-ro/",
    img: "/assets/projects/captures/openro-v110-light.png",
    darkImg: "/assets/projects/captures/openro-v110-dark.png",
    page: "/projects/openro.html",
    repo: "https://github.com/cayleb-james2008/open-ro",
    storagePrefix: "openro",
    action: "open Starters to build a Roblox game in Studio 3D, switch to Plan mode to stage reviewable unified Luau diffs in Code & Diff (Accept & Apply or Reject), open the Studio MCP Tools (13) bottom drawer, explore the Monetization & Retention pack & Market Taste, or export Rojo .zip / .rbxlx.",
    provenance: [
      { label: "What runs:", text: "the v1.1.0 Studio Copilot 3-pane IDE compiled from cayleb-james2008/open-ro (frontend/) with Explorer/Chats left dock, Embedded Studio / Studio 3D / Code & Diff / Playable Stage center workspace, Output / Agent Trace / Studio MCP Tools (13) / Properties drawer, Agent|Plan|Ask Copilot composer, Monetization & Retention pack, Market Taste Craft Radar, and .rbxlx / Rojo .zip exporter at /demos/open-ro/." },
      { label: "Local & BYOK options:", text: "runs 100% locally in your browser with zero external requests by default; Settings lets you add a BYOK LLM key or connect to a local openro-rs 1.1.0 binary (with directly embedded live Roblox Studio, auto-synced Explorer, OpenRoCompanion.lua plugin, all 13 MCP tools, Blender 3D .obj, and procedural .wav synthesis) on 127.0.0.1." },
      { label: "Why it is here:", text: "visitors can experience the full 3-pane Studio Copilot workflow — staging unified Luau diffs, co-building in 3D, proving scripts, inspecting the Monetization & Retention pack & Market Taste Radar, and exporting genuine Studio .rbxlx and Rojo .zip packages right here." },
    ],
  },
  {
    key: "OpenBell",
    tag: "APP-02",
    title: "OpenBell v0.9.0 — Institutional Quant Terminal (offline sandbox)",
    blurb: "100% client-side offline simulation of the v0.9.0 single-binary Rust institutional quant terminal (synthetic 15m crypto markets, zero real API keys, zero private trading data, zero external network calls): run the 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel, test fail-closed Hard Risk Rails (disarmed on boot, Arm Live confirmation, cap rejections, risk-reducing SELL pass-through, Emergency Kill Switch), Strategy Sandbox backtesting, and Quant Lab ($500/Day Scale Planner, 5-Gate Scorecard, Strategy Tournament, 12×12 Corr & 5×4 Regime Heatmaps, PAV Calibration).",
    url: "/demos/openbell/",
    img: "/assets/projects/captures/openbell-v090-light.png",
    darkImg: "/assets/projects/captures/openbell-v090-dark.png",
    page: "/projects/openbell.html",
    repo: "https://github.com/cayleb-james2008/openbell",
    storagePrefix: "openbell",
    action: "run the 1-click Full Quant Edge Audit 5-stage Go/No-Go funnel, click Arm Live to test fail-closed Hard Risk Rails in the Order Ticket (try an oversized order to see rail rejections, then trigger Emergency Kill Switch), run Collect now on synthetic 15m markets, or open Quant Lab for the $500/Day Scale Planner & Strategy Tournament.",
    provenance: [
      { label: "What runs:", text: "the v0.9.0 Institutional Terminal UI compiled from cayleb-james2008/openbell (frontend/) paired with an in-browser offline simulation engine (synthetic 15m crypto markets across BTC/ETH/SOL/XRP/DOGE, 1-click Full Quant Edge Audit funnel, in-memory fail-closed risk rails, Strategy Sandbox, Tournament, PAV Calibration, and Monte Carlo Scale Engine) at /demos/openbell/." },
      { label: "Zero keys / local binary:", text: "contains zero real API credentials, zero real private trading data, and makes zero external network requests; real Kalshi Demo/Prod connectivity only exists when you run the compiled openbell-rs v0.9.0 desktop binary locally with your own 0600 RSA-PSS key." },
      { label: "Why it is here:", text: "visitors can test OpenBell's 5-stage Quant Edge Audit, fail-closed risk-rail enforcement, Kill Switch, Strategy Tournament, and capital-scaling analytics interactively in complete safety." },
    ],
  },
  {
    key: "Fleet",
    tag: "APP-03",
    title: "Fleet v0.9.0 — Goal-to-DAG Parallel Agent Workbench",
    blurb: "Real in-browser git worktree, Goal-to-DAG planner, interactive multi-wave Board / DAG Graph toggle, PR Preview & GitHub PR payload builder, Worktrees Inspector, Daily Dispatch Budget guardrails, Autonomous Auto-Heal feedback loop, reusable Playbooks, Board Telemetry, and multi-step Web Worker check runner paired with the v0.9.0 single-binary Rust orchestrator (-24.1% bundle, 117/117 Rust tests).",
    url: "/demos/fleet/",
    img: "/assets/projects/captures/fleet-v090-light.png",
    darkImg: "/assets/projects/captures/fleet-v090-dark.png",
    page: "/projects/fleet.html",
    repo: "https://github.com/cayleb-james2008/fleet",
    storagePrefix: "fleet",
    action: "decompose a goal with the Goal-to-DAG planner, switch between Board and DAG Graph views to inspect multi-wave dependencies, open PR Preview on a verified session, inspect active Worktrees & Daily Budget guardrails, pick a Playbook via Cmd+K, or steer & merge verified commits.",
    provenance: [
      { label: "What runs:", text: "the v0.9.0 Codex/Linear workbench UI compiled from cayleb-james2008/fleet (frontend/) backed by a real IndexedDB virtual git worktree store, Goal-to-DAG planner, interactive DAG Graph visualizer, PR Preview modal, Worktrees Inspector, Daily Budget guardrails, Auto-Heal & Playbooks engine, Split Diff viewer, and Web Worker check runner at /demos/fleet/." },
      { label: "Local & BYOK options:", text: "executes real isolated branch checks locally in your browser by default; Settings lets you run the Policy Tester, inspect Worktrees and Daily Budget limits, add a BYOK coding model (sessionStorage only), or connect to a local fleet v0.9.0 binary on 127.0.0.1." },
      { label: "Why it is here:", text: "Fleet's core promise is autonomous check-driven multi-wave delivery without weakening guardrails — you can inspect Goal-to-DAG waves, preview PRs, prune worktrees, trigger real check failures, and land verified commits right here." },
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
