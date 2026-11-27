// content.ts: the site copy. The about section is Cayleb's own spoken answers, grammar-fixed only.
// COPY-RULES.md: this copy is owner-approved and frozen. Sync jobs may update links and version numbers only.

// FROZEN-COPY-START (owner-approved; app/scripts/copy-guard.mjs fails the build if this block changes)
export const identity = {
  name: "Cayleb Alvarez-James",
  role: "I turn repetitive work into something that runs itself.",
  location: "Middletown, Connecticut, USA",
  email: "caylebalvarezjames@gmail.com",
  links: [
    { label: "github.com/cayleb-james2008", href: "https://github.com/cayleb-james2008" },
    { label: "cayleb-james2008.github.io", href: "https://cayleb-james2008.github.io/" },
  ],
};

export const PDF = {
  href: "/Cayleb-Alvarez-James-Resume.pdf",
  name: "Cayleb-Alvarez-James-Resume.pdf",
  size: "PDF",
  note: "this page as a PDF",
};

// Question, then answer. Owner-approved; do not reword.
export type QA = { q: string; a: string[]; link?: { label: string; href: string } };
export const qa: QA[] = [
  { q: "What's one thing about you worth remembering?", a: ["I turn repetitive work into something that runs itself."] },
  { q: "What number are you proudest of?", a: ["4,000 tests check every change for me and hold every gate in place."] },
  {
    q: "What does Ergon do for someone at work?",
    a: ["Ergon adapts. It learns each employee's workflow and the tools they already use, then turns them into Ergon-native tools that every agent on Ergon can use."],
  },
  {
    q: "Who did you picture using Ergon?",
    a: ["An older employee, picture a grandpa with a monocle, sees a microphone button, talks to his agent, and watches it take over his computer and use all his apps. No technical effort, nothing to set up."],
  },
  {
    q: "How do you build?",
    a: ["I'm not an expert in every field, and one agent loses track as its context fills up. So I split the work across agents that each take a role with its own skills, spun up and run by an orchestrator. I hand it a plain goal, sometimes just a voice transcript, and building ambitious products in any field stops being limited by what I know."],
  },
  { q: "What should someone look at first?", a: ["Ergon."], link: { label: "Ergon", href: "/projects/ergon.html" } },
  {
    q: "Which skills could you explain to an interviewer for five minutes?",
    a: [
      "Self-improving agent loops: systems that review and improve how they work and how they build.",
      "Agents that learn a person's role: early, in Ergon. Personal memory, a skill library, and cards the employee clicks.",
      "Weight-space model editing: research. Using a large model to edit a small model's weights for a task.",
    ],
  },
];

export const experience = [
  {
    date: "Oct 2025 to Present",
    org: "Independent",
    bullets: [
      "Building Ergon. It is still in development and has not been installed at a customer company.",
      "Also building OpenRO, Fleet, and OpenBell.",
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
// FROZEN-COPY-END

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

export const projects: Project[] = [];

export type ProductPage = { name: string; href: string; pitch?: string; img?: string; darkImg?: string; alt?: string };
export const productPageLink = "open ↗";
export const productPages: ProductPage[] = [
  {
    name: "Ergon",
    href: "/projects/ergon.html",
    pitch: "Learns each employee's workflow and tools, then turns them into tools every agent on Ergon can use.",
    img: "/assets/projects/captures/ergon-v0400-light.png",
    darkImg: "/assets/projects/captures/ergon-v0400-dark.png",
    alt: "Ergon in the browser.",
  },
  { name: "OpenRO", href: "/projects/openro.html" },
  { name: "Fleet", href: "/projects/fleet.html" },
  { name: "OpenBell", href: "/projects/openbell.html" },
];

export const skills = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Rust", "Luau", "HTML/CSS"] },
  { group: "Tools", items: ["React", "Tauri", "SQLite", "Git/GitHub", "Linux"] },
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
  line: "Press Cmd+K to jump around.",
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
  count: "in your browser",
  running: "running",
  idle: "open",
  eyebrow: "runs in your browser",
  tryIt: "",
  provenance: "",
  noCalls: "",
};

export const liveDemos: LiveDemo[] = [
  {
    key: "Ergon",
    tag: "01",
    title: "Ergon",
    blurb: "A typed preview that runs in your browser. No voice, no backend.",
    url: "/demos/ergon/",
    img: "/assets/projects/captures/ergon-v0400-light.png",
    darkImg: "/assets/projects/captures/ergon-v0400-dark.png",
    page: "/projects/ergon.html",
    repo: "https://github.com/cayleb-james2008/ergon",
    storagePrefix: "ergon",
    action: "",
    provenance: [],
  },
  {
    key: "OpenRO",
    tag: "02",
    title: "OpenRO",
    blurb: "",
    url: "/demos/open-ro/",
    img: "",
    page: "/projects/openro.html",
    repo: "https://github.com/cayleb-james2008/open-ro",
    storagePrefix: "openro",
    action: "",
    provenance: [],
  },
  {
    key: "Fleet",
    tag: "03",
    title: "Fleet",
    blurb: "",
    url: "/demos/fleet/",
    img: "",
    page: "/projects/fleet.html",
    repo: "https://github.com/cayleb-james2008/fleet",
    storagePrefix: "fleet",
    action: "",
    provenance: [],
  },
];

export const NAV = [
  { id: "summary", label: "about", via: "1" },
  { id: "experience", label: "experience", via: "5" },
  { id: "projects", label: "projects", via: "3" },
  { id: "live-demos", label: "demos", via: "4" },
  { id: "skills", label: "skills", via: "6" },
  { id: "additional", label: "additional", via: "6" },
  { id: "education", label: "education", via: "6" },
] as const;
