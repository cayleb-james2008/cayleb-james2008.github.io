// content.ts: resume copy and browser demo metadata.

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
  "I am 18 and live in Connecticut, where I graduated from high school after two years as wrestling captain and now work full time. Over the past year I put 13 to 14 hours a day into building local agent software around school, work, and practice, moving between OpenCode, Claude Desktop, Claude Code, Gemini Antigravity, and ChatGPT Codex depending on the job. My active focus is OpenRO for Roblox Studio games, Fleet inside Antigravity for multi-agent swarms, and Ergon for local employee workflows, alongside my OpenBell v0.9.0 trading terminal.",
  "1,200+ GitHub contributions in the last year. 4,000+ automated tests across five shipped systems.",
];

// The stated test counts, as the resume states them (the ledger). Never derived, never rounded.
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
  beside: "GitHub contributions, last year, shown beside the test chart rather than on its scale",
};

export const experience = [
  {
    date: "Oct 2025 to Present",
    org: "Founder · Independent AI Agent Systems",
    bullets: [
      "Built Ergon (v0.37.0) as a single-binary Rust desk for local employee agents. Adds engagement-scoped client vaults (`ScopeResolver` and `WorkspacePolicy.isolate_active_engagement` isolating reads, writes, vault search, rollups, and handoff ZIP exports with `HTTP 409` cross-client leak blocking), Client CRM and SOW drawers (contacts, tax rates, payment terms, workspace prefixes, and `rollover_mode` rules), manual billable time and expense logging (`time_entries.jsonl`), and PDF 1.4, XLSX, and JSON invoice generation and settlement (`invoices.json`) alongside parallel DAG pipelines, full-vault chunked hybrid search, Deliverable Studio editing, and signed webhooks (286/286 Rust tests, 104/104 gate checks, 44/44 fuzz checks). Ergon is still in development and has not been installed at a customer company.",
      "Built Fleet (v1.29.0) as a sidebar plugin inside Antigravity for coordinating multi-agent swarms. Adds a multi-swarm LRU=64 portfolio index and PortfolioDrawer (GET /api/portfolio with cross-swarm USD spend, urgent triage queue, Jump to swarm, and archive toggles), persistent brain/-confined fleet_state.json triage Ack/Snooze/Unack and server-synced pins (POST /api/triage/ack, POST /api/pins), and SwarmCheckpointsSection (GET/POST /api/checkpoints with worktree HEAD snapshots, Compare vs live, CAS plan restore, and Resume prompt) alongside the closed-loop operator command ledger, Switch Model working guard, and hardened Cycle 3 delta sync (47/47 backend tests, 72/72 gate checks, 30/30 live-web, 30/30 fuzz).",
      "Built OpenRO (v1.28.0), a unified three-pane Rust IDE for Roblox Studio adding production LiveOps telemetry codegen (`src/shared/LiveTelemetry.luau` and `src/server/LiveTelemetryFlush.server.luau` supporting `opencloud_datastore` and HTTPS SSRF-guarded `webhook_relay`), idempotent Open Cloud v2 DataStore shard sync with `.openro/liveops/telemetry-sync-state.json` cursor deduplication, `Live Production` versus `Headless Sandbox` source filtering, and `Live Server Errors` aggregation with one-click script jump alongside bidirectional 3-way Studio sync, prefab model import, headless Lune `0.11.1` sandbox verification, ScreenGui Designer, 13 MCP tools, and 60-minute economy curves (`369/369` Rust tests, `7,620 req/s`, `43/43` fuzz).",
    ],
  },
  {
    date: "Sep 2026 to Present",
    org: "Furniture Installer · a Connecticut furniture company",
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
  /** The repo exists but is private: show the label, no link. */
  repoPrivate?: boolean;
  figure?: string;
  status: string;
  steps: { title: string; sub: string }[];
  stepsLead: string;
  lead: string;
  capture?: Capture;
  chart?: Chart;
  bullets: string[];
  demo?: string;
};
export type Capture = { src: string; alt: string; label: string; spec: string };
export type Chart = { rows: { name: string; value: number; display: string }[]; caption: string; label: string; sqrt?: boolean };
export const captureTitle = "Open the full-resolution capture";
export const openDemoLabel = "open the live demo ↓";
export const chartHead = { left: "stated numbers", right: "from the resume" };
export const stepsHead = { left: "how it works", right: "from the resume description" };

export const projects: Project[] = [
  {
    name: "Sophos",
    kind: "Coding-Agent Desktop App",
    stack: "React, TypeScript, Tauri",
    repoPrivate: true,
    figure: "1,224 interface tests · 82 Node tests",
    status: "merged after hosted CI",
    stepsLead: "how it works · from the resume description",
    lead: "Desktop app that runs coding agents from saved profiles. 1,224 interface tests and 82 Node tests pass.",
    chart: { rows: [{ name: "interface tests", value: 1224, display: "1,224" }, { name: "Node tests", value: 82, display: "82" }], label: "Sophos stated test counts: 1,224 interface tests and 82 Node tests.", caption: "stated test counts · square-root scale · from the resume", sqrt: true },
    steps: [
      { title: "saved profiles", sub: "coding agents" },
      { title: "run the agent", sub: "" },
      { title: "sessions + transcripts", sub: "survive restarts" },
      { title: "clear error on provider failure", sub: "" },
      { title: "merged after hosted CI", sub: "gate" },
    ],
    bullets: [
      "Desktop app that runs coding agents from saved profiles, keeping sessions and transcripts across restarts and showing clear errors when a provider fails.",
      "1,224 interface tests and 82 Node tests pass, merged after full hosted CI.",
    ],
  },
  {
    name: "dotz",
    kind: "AI Coding Agent Dashboard",
    stack: "Rust, Tauri, JavaScript, SQLite",
    repoPrivate: true,
    figure: "828+ core tests",
    status: "merged",
    stepsLead: "how it works · from the resume description",
    lead: "828+ core tests pass on each of Windows, macOS, and Linux, and all 6 hosted check jobs pass.",
    chart: { rows: [{ name: "Windows", value: 828, display: "828+" }, { name: "macOS", value: 828, display: "828+" }, { name: "Linux", value: 828, display: "828+" }], label: "dotz stated core tests: 828 or more on each of Windows, macOS and Linux.", caption: "stated core tests, each OS · from the resume" },
    steps: [
      { title: "pick the model", sub: "" },
      { title: "run the agent", sub: "supervised" },
      { title: "watch the process tree", sub: "" },
      { title: "safe cleanup", sub: "" },
      { title: "merged", sub: "6/6 hosted checks" },
    ],
    bullets: [
      "Desktop app that supervises AI coding agents with model selection and clean process-tree shutdown.",
      "828+ core tests pass on Windows, macOS, and Linux alongside 6 passing hosted checks.",
    ],
  },
  {
    name: "Asmodeus",
    kind: "Trading Research on Past Data",
    stack: "Rust",
    figure: "1,111 Rust tests",
    status: "research only",
    stepsLead: "how it works · from the resume description",
    lead: "Rejected ideas stay logged rather than being dropped. 1,111 Rust tests pass. Research only.",
    chart: { rows: [{ name: "Rust tests", value: 1111, display: "1,111" }], label: "Asmodeus stated test count: 1,111 Rust tests.", caption: "stated test count · from the resume" },
    steps: [
      { title: "real historical data", sub: "" },
      { title: "strict time order", sub: "gate" },
      { title: "fees counted", sub: "" },
      { title: "no peeking at future data", sub: "safeguards" },
      { title: "rejected ideas logged", sub: "research only" },
    ],
    bullets: [
      "Tests trading ideas against historical data in strict time order, counting trading fees and blocking future data leaks while logging rejected runs. 1,111 Rust tests pass.",
    ],
  },
  {
    name: "Industry AI Suite",
    kind: "Source-Checked Review Tools",
    stack: "Python",
    repoPrivate: true,
    figure: "382 Python tests",
    status: "",
    stepsLead: "how it works · from the resume description",
    lead: "Ten local tools that review finance, research, security, and operations files. 382 Python tests pass.",
    chart: { rows: [{ name: "Python tests", value: 382, display: "382" }], label: "Industry AI Suite stated test count: 382 Python tests.", caption: "stated test count · from the resume" },
    steps: [
      { title: "ten local tools", sub: "finance · research · security · operations" },
      { title: "review the files", sub: "" },
      { title: "every finding shows its source", sub: "" },
      { title: "missing source -> drafts halt", sub: "gate" },
      { title: "a person decides", sub: "" },
    ],
    bullets: [
      "Ten local tools for reviewing finance, research, security, and operations documents, halting drafts when citations are missing. 382 Python tests pass.",
    ],
  },
];

export type ProductPage = { name: string; href: string; pitch: string; img: string; darkImg?: string; alt: string };
export const productPagesHead = "the three main projects, in full";
export const productPageLink = "the full product page ↗";
export const productPages: ProductPage[] = [
  {
    name: "Open-Ro Studio",
    href: "/projects/openro.html",
    pitch: "Three-pane Rust IDE for Roblox Studio with production LiveOps telemetry codegen, idempotent Open Cloud shard sync, live server error aggregation, 3-way Studio sync, prefab model import, headless Lune Luau sandbox verification, WebGL2 3D viewport, Visual ScreenGui Designer, 60-min economy sims, and native .rbxlx or Rojo exports (v1.28.0).",
    img: "/assets/projects/captures/openro-v1280-light.png",
    darkImg: "/assets/projects/captures/openro-v1280-dark.png",
    alt: "OpenRO v1.28.0 three-pane workspace showing LiveOps Telemetry Source filtering, Open Cloud DataStore shard sync, and Live Telemetry Collector codegen.",
  },
  {
    name: "OpenBell",
    href: "/projects/openbell.html",
    pitch: "Rust research and Kalshi v2 desk with causal edge backtests, isotonic probability calibration, and hard order limits that start disarmed on boot (v0.9.0).",
    img: "/assets/projects/captures/openbell-v090-light.png",
    darkImg: "/assets/projects/captures/openbell-v090-dark.png",
    alt: "OpenBell v0.9.0 terminal showing paper compounding results, disarmed Kalshi order limits, 15-minute data tape, and edge checks.",
  },
  {
    name: "Fleet",
    href: "/projects/fleet.html",
    pitch: "Antigravity sidebar plugin for multi-agent swarms with a Portfolio Command Drawer, persistent triage ack and snooze, server-synced pins, swarm checkpoints, and closed-loop operator command tracking (v1.29.0).",
    img: "/assets/projects/captures/fleet-v1290-light.png",
    darkImg: "/assets/projects/captures/fleet-v1290-dark.png",
    alt: "Fleet v1.29.0 Antigravity sidebar showing the Portfolio Command Drawer, Triage Ack and Snooze controls, and Swarm Checkpoints.",
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
      "recursive self-improvement systems",
      "distributed agent infrastructure",
      "bring-your-own-agent coordination",
      "evaluation design",
      "earned permissions and approval gates",
    ],
  },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Rust", "Luau", "HTML/CSS"] },
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
  { org: "Dunkin’", role: "Crew", date: "2024 to 2026" },
  { org: "Tommy’s Pizza", role: "Crew", date: "Summer 2024" },
];

export const education = {
  school: "Portland High School, Portland, Connecticut",
  date: "Graduated 2026",
  detail:
    "Coursework: Cybersecurity; AP Computer Science. Leadership: Wrestling Team Captain, Portland Highlanders, two years.",
};

export const colophon = {
  line: "The plain PDF is the submission copy. Press Cmd+K to jump between sections, or try Open-Ro v1.28.0, OpenBell v0.9.0, Fleet v1.29.0, and Ergon v0.37.0 directly in your browser below with zero external network calls.",
};

export type LiveDemo = {
  key: string;
  tag: string;
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

export const demoWords = {
  count: "live apps · 3",
  running: "running",
  idle: "interactive",
  eyebrow: "interactive web app · runs locally in your browser",
  tryIt: "Try in the frame:",
  provenance: "how it runs",
  noCalls: "· client-side sandbox · optional local runtime",
};

export const liveDemos: LiveDemo[] = [
  {
    key: "Open-Ro",
    tag: "APP-01",
    title: "Open-Ro Studio (v1.28.0)",
    blurb: "Browser edition of the three-pane Roblox Studio IDE with Cycle 4 Wave E2 parity: production LiveOps telemetry codegen, Open Cloud sync cursor controls, Telemetry Source filtering, Live Server Errors script jump, Two-Way Studio Sync 3-way conflict preview, prefab model import with 3D viewport model chips, WebGL2 3D viewport, Visual ScreenGui Designer, 60-minute economy curves, and .rbxlx XML or Rojo .zip export.",
    url: "/demos/open-ro/",
    img: "/assets/projects/captures/openro-v1280-light.png",
    darkImg: "/assets/projects/captures/openro-v1280-dark.png",
    page: "/projects/openro.html",
    repo: "https://github.com/cayleb-james2008/open-ro",
    storagePrefix: "openro",
    action: "open Ship -> LiveOps to generate Live Telemetry Collector Luau scripts, sync Open Cloud shards, filter Live Production vs Headless Sandbox telemetry, and jump from Live Server Errors to scripts, or inspect Two-Way Sync and 3D prefabs.",
    provenance: [
      { label: "What runs:", text: "the Open-Ro v1.28.0 React frontend compiled from cayleb-james2008/open-ro, including Production LiveOps Telemetry codegen and Open Cloud shard sync, Live Server Errors script jump, Two-Way Studio Sync 3-way conflict resolution, Prefab Model Import with 3D model chips, Headless Luau Sandbox verifier and persisted run history, zero-dependency WebGL2 3D viewport, Visual ScreenGui Designer and deterministic Luau compiler, Explorer, Economy Balance Simulator, Monetization Safety Audit, Pre-Publish Guard, Rojo Sync Conflict Resolver, Hook-Integrity Guard, and the .rbxlx / Rojo .zip exporter at /demos/open-ro/." },
      { label: "Local and BYOK options:", text: "stays offline in your browser by default; Settings lets you add an API key or point to a local openro-rs 1.28.0 binary on 127.0.0.1 for live Open Cloud v2 DataStore shard sync (.openro/liveops/telemetry-sync-state.json deduplication and HTTPS SSRF-guarded webhook relay codegen), cursor-paginated Studio sync, binary .rbxm/XXE-guarded prefab imports, live Lune 0.11.1 execution, CWE-22/59 confined mesh-asset reads, luau_check + stylua verified GUI compilation, and Roblox Studio sync via OpenRoCompanion.lua." },
      { label: "Why it is here:", text: "you can import prefabs, review 3-way sync diffs, design responsive ScreenGuis, test headless sandbox journeys, and export Studio packages directly without installing the binary." },
    ],
  },
  {
    key: "OpenBell",
    tag: "APP-02",
    title: "OpenBell (v0.9.0 offline sandbox)",
    blurb: "Client-side simulation of the v0.9.0 Rust Kalshi v2 terminal running on synthetic 15-minute data with no API keys or private account records. Try the five-stage edge audit, disarmed order risk limits, kill switch, strategy tournament, and capital scaling calculator.",
    url: "/demos/openbell/",
    img: "/assets/projects/captures/openbell-v090-light.png",
    darkImg: "/assets/projects/captures/openbell-v090-dark.png",
    page: "/projects/openbell.html",
    repo: "https://github.com/cayleb-james2008/openbell",
    storagePrefix: "openbell",
    action: "run the Full Quant Edge Audit, click Arm Live in the Order Ticket to see oversized orders get blocked, trigger the Emergency Kill Switch, or open Quant Lab for the strategy tournament.",
    provenance: [
      { label: "What runs:", text: "the OpenBell v0.9.0 frontend wired to an offline browser simulation over synthetic BTC, ETH, SOL, XRP, and DOGE 15-minute series at /demos/openbell/." },
      { label: "Zero keys and local binary:", text: "no credentials or external requests leave the page; real Kalshi Demo or Production signing uses your own 0600 RSA-PSS key inside the local openbell-rs v0.9.0 binary." },
      { label: "Why it is here:", text: "you can trigger risk limit rejections, backtest checks, and calibration curves safely in the browser." },
    ],
  },
  {
    key: "Fleet",
    tag: "APP-03",
    title: "Fleet (v1.29.0 Antigravity Swarm Sidebar)",
    blurb: "Offline preview of the Antigravity swarm sidebar plugin. Open the header Portfolio Command Drawer for cross-swarm USD spend and urgent triage jumps, Ack or Snooze triage alerts, create Swarm Checkpoints with live diff comparison and CAS plan restore, inspect OperatorOpsStrip command queues, and test Switch Model 409 guards.",
    url: "/demos/fleet/",
    img: "/assets/projects/captures/fleet-v1290-light.png",
    darkImg: "/assets/projects/captures/fleet-v1290-dark.png",
    page: "/projects/fleet.html",
    repo: "https://github.com/cayleb-james2008/fleet",
    storagePrefix: "fleet",
    action: "open the Portfolio pill to jump across swarms, Ack or Snooze triage rows in Triage, create and compare a Swarm Checkpoint against live state, or inspect OperatorOpsStrip command queue tracking in Roster and Board.",
    provenance: [
      { label: "What runs:", text: "the single-file Fleet v1.29.0 browser simulator built from cayleb-james2008/fleet (dist-live-web/index.html), replaying the LRU=64 portfolio index (GET /api/portfolio), PortfolioDrawer cross-swarm spend and urgent triage jumps, persistent fleet_state.json triage Ack/Snooze/Unack and server-synced pins (POST /api/triage/ack, POST /api/pins), SwarmCheckpointsSection create/compare/restore/resume flows (GET/POST /api/checkpoints, POST /api/checkpoints/restore), the closed-loop fleet_ops.json operator command ledger, working-worker 409 worker_not_waiting Switch Model guards, hardened Cycle 3 delta sync, bounded forensic transcript inspection, and Full Swarm Archive Export at /demos/fleet/." },
      { label: "Local Antigravity install:", text: "the browser copy stays offline; running ./install.sh in a local clone installs the sidecar plugin into ~/.gemini/config/plugins/fleet/ with bounded <= 512 KiB transcript scanning and secret scrubbing on GET /api/transcript, GET /api/swarm/delta long-poll wakeups, content-hash plan ETags, CWE-59 git probes, zero-client idle sleep, and live SSE ping frames." },
      { label: "Why it is here:", text: "you can step through live swarm triage, forensic transcript inspection, native plan editing, and the multi-agent release gate checklist inside a narrow auxiliary pane layout." },
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
