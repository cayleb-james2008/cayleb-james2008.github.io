// Role coverage: does the product use each of the owner's libraries for what it is best at, or say why not?
// Run in a product's project root: node scripts/role-coverage.mjs      (render-check.mjs runs it for a product)
//   node scripts/role-coverage.mjs --registry    checks the starter itself: every part below exists and every file
//                                                under src/components is classified (check-docs.py runs this).
//
// It reads the screen source: everything under src/ except the copied library files (src/components, src/lib,
// src/utils, src/hooks) and the bench (src/bench). It follows imports from src/main.tsx, so a file nothing imports
// counts for nothing and is itself a failure (dead code). The house pieces (src/chrome, src/parts.tsx) are credited
// only for the parts a screen really renders through them.
//
// Fails on, each with the file and line where there is one:
//   1. ROLE-COVERAGE.md missing, or a library of the eight with no row;
//   2. a library with no used part and no "no need here" row with a reason of at least 8 words;
//   3. a library whose row names a part the screens do not render, or says "no need here" while the screens use it;
//   4. more than 3 libraries answered "no need here" (it is rare, SKILL.md step 2);
//   5. a part imported but never used (dead code), and a screen file that nothing imports;
//   6. a library whose only used parts are not its strength (Cult UI used only as a plain button);
//   7. a hand-written disclosure, tab, dialog, drawer, toast, chart or button where a listed library has the part.
// The bench is exempt: when src/App.tsx imports the bench, the page is the bench and there is no product to cover.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");

export const LIBS = ["Motion Primitives", "COSS UI", "Cult UI", "Kibo UI", "Tremor", "Vaul", "Sonner", "Motion"];
const ALIAS = { "motion primitives": "Motion Primitives", "coss ui": "COSS UI", "coss": "COSS UI", "cult ui": "Cult UI", "cult": "Cult UI",
  "kibo ui": "Kibo UI", "kibo": "Kibo UI", "tremor": "Tremor", "vaul": "Vaul", "sonner": "Sonner", "motion": "Motion", "motion.dev": "Motion" };
const MAX_NO_NEED = 3;

// A file under src/components -> [library, part, is it the library's strength]. `null` library = a shadcn part Kibo pulled in.
const FILES = {
  "ui/animated-background": ["Motion Primitives", "Animated Background", true], "ui/sliding-number": ["Motion Primitives", "Sliding Number", true],
  "ui/text-morph": ["Motion Primitives", "Text Morph", true], "ui/morphing-dialog": ["Motion Primitives", "Morphing Dialog", true], "ui/dock": ["Motion Primitives", "Dock", true],
  "ui/in-view": ["Motion Primitives", "In View", true], "ui/animated-group": ["Motion Primitives", "Animated Group", true], "ui/spotlight": ["Motion Primitives", "Spotlight", true],
  "ui/border-trail": ["Motion Primitives", "Border Trail", true], "ui/text-shimmer": ["Motion Primitives", "Text Shimmer", true], "ui/transition-panel": ["Motion Primitives", "Transition Panel", true],
  "ui/scroll-progress": ["Motion Primitives", "Scroll Progress", true], "ui/magnetic": ["Motion Primitives", "Magnetic", true],
  "ui/button": ["COSS UI", "Button", true], "ui/spinner": ["COSS UI", "Spinner", true], "ui/input-group": ["COSS UI", "Input Group", true], "ui/input": ["COSS UI", "Input", true],
  "ui/textarea": ["COSS UI", "Textarea", true], "ui/kbd": ["COSS UI", "Kbd", true], "ui/tabs": ["COSS UI", "Tabs", true], "ui/segmented-control": ["COSS UI", "Segmented Control", true],
  "ui/badge": ["COSS UI", "Badge", true], "ui/avatar": ["COSS UI", "Avatar", true], "ui/table": ["COSS UI", "Table", true], "ui/tooltip": ["COSS UI", "Tooltip", true],
  "ui/texture-button": ["Cult UI", "Texture Button", false], "ui/dynamic-island": ["Cult UI", "Dynamic Island", true], "ui/expandable": ["Cult UI", "Expandable", true],
  "kibo-ui/kanban": ["Kibo UI", "Kanban", true], "kibo-ui/gantt": ["Kibo UI", "Gantt", true], "kibo-ui/calendar": ["Kibo UI", "Calendar", true],
  "kibo-ui/pill": ["Kibo UI", "Pill", true], "kibo-ui/avatar-stack": ["Kibo UI", "Avatar Stack", true],
  "SparkChart/SparkChart": ["Tremor", "Spark chart", true], "ProgressCircle/ProgressCircle": ["Tremor", "Progress Circle", true], "Tracker/Tracker": ["Tremor", "Tracker", true],
  "BarList/BarList": ["Tremor", "Bar List", true], "CategoryBar/CategoryBar": ["Tremor", "Category Bar", true], "Tooltip/Tooltip": ["Tremor", "Tremor Tooltip", true],
  "ui/card": null, "ui/command": null, "ui/context-menu": null, "ui/dialog": null, "ui/popover": null, "ui/scroll-area": null,
};
// A package -> library, and which of its exports are parts (the rest, such as MotionConfig, are plumbing).
const PKGS = {
  sonner: { lib: "Sonner", parts: { toast: "toast (a stacked notice)", Toaster: "Toaster" } },
  vaul: { lib: "Vaul", all: "Drawer" },
  "motion/react": { lib: "Motion", parts: { motion: "motion element", m: "motion element", useSpring: "spring", useMotionValue: "motion value", useTransform: "motion value", animate: "animate()",
    useAnimate: "animate()", AnimatePresence: "AnimatePresence", LayoutGroup: "layout", Reorder: "layout", useScroll: "scroll-linked value", useInView: "in-view", useDragControls: "drag" } },
};
PKGS.motion = PKGS["motion/react"]; PKGS["framer-motion"] = PKGS["motion/react"];
// Never meant to be written by hand in a screen where a library has the part (source patterns, with the library that owns it).
const HAND = [
  [/<button\b/, "a raw <button>: use the COSS UI Button (or the part that owns the control)"],
  [/role=["']?button\b/, "role=\"button\" on a hand-made element: use the COSS UI Button"],
  [/<(details|summary)\b/, "a hand-written disclosure: Cult UI Expandable or a Motion Primitives Morphing Dialog"],
  [/aria-expanded=/, "a hand-wired disclosure (aria-expanded): Cult UI Expandable, or the Morphing Dialog / Vaul Drawer if it opens a detail"],
  [/role=["']?(tablist|tab|tabpanel)\b/, "hand-written tabs: COSS UI Tabs or Segmented Control, Motion Primitives Animated Background"],
  [/role=["']?(dialog|alertdialog)\b|<dialog\b/, "a hand-written dialog: Motion Primitives Morphing Dialog, or a Vaul Drawer on a phone"],
  [/role=["']?tooltip\b/, "a hand-written tooltip: COSS UI Tooltip"],
  [/role=["']?progressbar\b/, "a hand-written progress bar: Tremor Progress Circle or Category Bar"],
  [/from ["'](?:recharts|d3[^"']*)["']/, "a hand-written chart: Tremor"],
  [/from ["']@dnd-kit\//, "hand-wired drag and drop: Kibo UI Kanban"],
  [/from ["']@radix-ui\/react-(?:dialog|popover|tabs|accordion|collapsible|toast|tooltip|hover-card|dropdown-menu|select|switch|progress)["']/, "a library's own primitive used directly: take the listed library's part"],
  [/from ["']@base-ui\/react/, "COSS UI's own primitive used directly: take the COSS UI part"],
  [/\bfixed\b[^"'`\n]*\binset-x-0\b[^"'`\n]*\bbottom-0\b|\bfixed\b[^"'`\n]*\bbottom-0\b[^"'`\n]*\binset-x-0\b|\bfixed\b[^"'`\n]*\binset-0\b/, "a hand-written sheet or overlay: Vaul Drawer or the Morphing Dialog"],
];

const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1");
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;
const rel = (p) => path.relative(root, p);

function resolve(from, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(src, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const c of [base, base + ".tsx", base + ".ts", path.join(base, "index.tsx"), path.join(base, "index.ts")]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function imports(file, text) {
  const out = [];
  const re = /import\s+(type\s+)?([^"';]*?)\s*from\s*["']([^"']+)["']/g;
  for (let m; (m = re.exec(text)); ) {
    if (m[1]) continue;
    const names = [];
    const clause = m[2].trim();
    const brace = clause.match(/\{([\s\S]*)\}/);
    const lead = clause.replace(/\{[\s\S]*\}/, "").replace(/,\s*$/, "").trim();
    if (lead.startsWith("* as ")) names.push({ local: lead.slice(5).trim(), imported: "*" });
    else if (lead) names.push({ local: lead, imported: "default" });
    if (brace) for (const part of brace[1].split(",")) {
      const p = part.trim(); if (!p || /^type\s/.test(p)) continue;
      const [imp, loc] = p.split(/\s+as\s+/).map((s) => s.trim());
      names.push({ local: loc ?? imp, imported: imp });
    }
    out.push({ spec: m[3], names, line: lineOf(text, m.index), file: resolve(file, m[3]) });
  }
  const dyn = /import\(\s*["']([^"']+)["']\s*\)/g;
  for (let m; (m = dyn.exec(text)); ) out.push({ spec: m[1], names: [], dynamic: true, line: lineOf(text, m.index), file: resolve(file, m[1]) });
  return out;
}

const componentKey = (file) => { const r = path.relative(path.join(src, "components"), file).replace(/\\/g, "/").replace(/\.tsx?$/, "").replace(/\/index$/, ""); return r.startsWith("..") ? null : r; };
const inLib = (file) => /^(components|lib|utils|hooks|bench)(\/|$)/.test(path.relative(src, file).replace(/\\/g, "/"));
const isHouse = (file) => /^(chrome\/|parts\.tsx$)/.test(path.relative(src, file).replace(/\\/g, "/"));
const refs = (text, name) => (text.match(new RegExp(`(?<![\\w$.])${name.replace(/\$/g, "\\$")}(?![\\w$])`, "g")) ?? []).length;
const rendered = (text, name) => new RegExp(`<${name}[\\s/>.]|(?<![\\w$.])${name}\\s*[.(]|[=:{(,]\\s*${name}\\s*[,})\\]]`).test(text);

// The block of a house file that defines one export, up to the next export.
function block(text, name) {
  const m = new RegExp(`export (?:default )?(?:function|const|class) ${name}\\b`).exec(text);
  if (!m) return text;
  const next = text.indexOf("\nexport ", m.index + 10);
  return text.slice(m.index, next === -1 ? undefined : next);
}

// What a piece of source (a screen file, or one block of a house file) renders: Map "lib|part" -> {lib, part, strength, files:Set, via:Set}
function partsIn(file, text, scope, found, via, depth = 0) {
  for (const imp of imports(file, text)) {
    const pkg = PKGS[imp.spec];
    const comp = imp.file ? componentKey(imp.file) : null;
    for (const n of imp.names) {
      if (!rendered(scope, n.local) && !(n.imported === "*" && new RegExp(`\\b${n.local}\\.`).test(scope))) continue;
      const add = (lib, part, strength) => {
        const k = `${lib}|${part}`;
        if (!found.has(k)) found.set(k, { lib, part, strength, where: new Set(), via: new Set() });
        found.get(k).where.add(rel(file)); if (via) found.get(k).via.add(via);
      };
      if (pkg) {
        if (pkg.all) add(pkg.lib, pkg.all, true);
        else if (pkg.parts[n.imported]) add(pkg.lib, pkg.parts[n.imported], true);
      } else if (comp !== null && imp.file) {
        const f = FILES[comp];
        if (f) add(f[0], f[1], f[2]);
        else if (f === undefined) console.warn(`warn: src/components/${comp} is not in the registry of scripts/role-coverage.mjs, so it counts for nothing`);
      } else if (imp.file && isHouse(imp.file) && depth < 3) {
        const ht = strip(fs.readFileSync(imp.file, "utf8"));
        const b = n.imported === "default" ? ht : block(ht, n.imported);
        partsIn(imp.file, ht, b, found, `${n.imported} (${rel(imp.file)})`, depth + 1);
      }
    }
  }
}

function checkRegistry() {
  const bad = [];
  const comps = path.join(src, "components");
  for (const k of Object.keys(FILES)) if (![".tsx", "/index.tsx"].some((e) => fs.existsSync(path.join(comps, k + e)))) bad.push(`registry names src/components/${k}, which does not exist`);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : /\.tsx$/.test(e.name) ? [path.join(d, e.name)] : []));
  for (const f of walk(comps)) { const k = componentKey(f); if (!(k in FILES)) bad.push(`src/components/${k} is not in the registry: add it to FILES in scripts/role-coverage.mjs`); }
  const libs = new Set([...Object.values(FILES).filter(Boolean).map((v) => v[0]), ...Object.values(PKGS).map((p) => p.lib)]);
  for (const l of LIBS) if (!libs.has(l)) bad.push(`library ${l} has no part in the registry`);
  return bad;
}

if (process.argv.includes("--registry")) {
  const bad = checkRegistry();
  for (const b of bad) console.error(`FAIL [registry] ${b}`);
  console.log(`role-coverage --registry: ${bad.length ? "FAILED" : `ok, ${Object.keys(FILES).length} parts and ${LIBS.length} libraries`}`);
  process.exit(bad.length ? 1 : 0);
}

const appText = fs.existsSync(path.join(src, "App.tsx")) ? fs.readFileSync(path.join(src, "App.tsx"), "utf8") : "";
if (/from ["']@\/bench\//.test(appText)) { console.log("role-coverage: exempt, src/App.tsx renders the bench (a workbench, not a product)"); process.exit(0); }

const fails = [];
const fail = (tag, msg) => { fails.push(`[${tag}] ${msg}`); console.error(`FAIL [${tag}] ${msg}`); };

// 1. Reach every file from main.tsx; scan the screen and house files.
const entry = path.join(src, "main.tsx");
if (!fs.existsSync(entry)) { console.error("FAIL [source] src/main.tsx is missing"); process.exit(1); }
const reached = new Set(); const queue = [entry]; const texts = new Map();
while (queue.length) {
  const f = queue.pop(); if (reached.has(f)) continue; reached.add(f);
  if (inLib(f)) continue;
  const t = strip(fs.readFileSync(f, "utf8")); texts.set(f, t);
  for (const i of imports(f, t)) if (i.file) queue.push(i.file);
}
const every = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? every(path.join(d, e.name)) : /\.tsx?$/.test(e.name) && !e.name.endsWith(".d.ts") ? [path.join(d, e.name)] : []));
// src/motion.ts is the table of presets (scripts/motion-source.mjs reads it); a screen takes the presets it needs, so an unimported one is not dead code.
for (const f of every(src)) if (!inLib(f) && !reached.has(f) && path.relative(src, f) !== "motion.ts") fail("dead", `${rel(f)}: nothing imports it from src/main.tsx; delete it (a part it imports counts for nothing)`);

const found = new Map();
for (const [f, t] of texts) {
  if (isHouse(f) && !/^main\.tsx$/.test(path.relative(src, f))) continue; // credited only through what a screen renders
  partsIn(f, t, t, found, null);
}
// Motion: what the screens draw with it (a plugin of main.tsx's MotionConfig does not count).
for (const [f, t] of texts) {
  if (isHouse(f) || !/from ["'](?:motion\/react|motion|framer-motion)["']/.test(t)) continue;
  const kinds = [[/<(?:motion|m)\.\w+/, "motion element"], [/\blayoutId\s*=/, "layoutId glide"], [/<(?:motion|m)\.\w+[^>]*\blayout(?:\s|=|>|\/)/, "layout (FLIP)"], [/\buseSpring\b|type:\s*["']spring["']|\bspring\(/, "spring"],
    [/\b(?:whileHover|whileTap|whileDrag|drag)\s*=/, "gesture"], [/\bpathLength\b/, "path drawing"]];
  for (const [re, part] of kinds) if (re.test(t)) {
    const k = `Motion|${part}`; if (!found.has(k)) found.set(k, { lib: "Motion", part, strength: true, where: new Set(), via: new Set() });
    found.get(k).where.add(rel(f));
  }
}

// 2. Dead imports: a library part imported and never used in the file.
for (const [f, t] of texts) for (const imp of imports(f, t)) {
  const lib = PKGS[imp.spec] || (imp.file && componentKey(imp.file) !== null) || (imp.file && isHouse(imp.file));
  if (!lib) continue;
  for (const n of imp.names) if (n.imported !== "*" && refs(t, n.local) <= 1) fail("dead", `${rel(f)}:${imp.line}: ${n.local} is imported from ${imp.spec} but never rendered`);
}

// 3. Hand-written parts, in screen files only.
for (const [f, t] of texts) {
  if (isHouse(f)) continue;
  for (const [re, msg] of HAND) { const g = new RegExp(re.source, "g"); for (let m; (m = g.exec(t)); ) fail("hand-written", `${rel(f)}:${lineOf(t, m.index)}: ${msg}`); }
}

// 4. ROLE-COVERAGE.md against the source.
const used = Object.fromEntries(LIBS.map((l) => [l, [...found.values()].filter((p) => p.lib === l)]));
console.log("Parts the screens import and render:");
for (const l of LIBS) {
  const u = used[l];
  const list = u.map((p) => `${p.part} (${[...p.where, ...[...p.via].map((v) => `via ${v}`)].slice(0, 2).join("; ")})`).join(", ");
  console.log(`  ${l.padEnd(18)} ${u.length ? list : "none"}`);
}
const tableFile = path.join(root, "ROLE-COVERAGE.md");
const rows = [];
if (!fs.existsSync(tableFile)) fail("table", "ROLE-COVERAGE.md is missing from the project root: one row per library, its part or \"no need here\" with a reason");
else {
  for (const line of fs.readFileSync(tableFile, "utf8").split("\n")) {
    if (!/^\s*\|/.test(line) || /^\s*\|[\s:|-]+\|?\s*$/.test(line)) continue;
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    const lib = ALIAS[cells[0].toLowerCase().replace(/[*`_]/g, "").replace(/\s*\(.*\)/, "").trim()];
    if (lib) rows.push({ lib, cells: cells.slice(1) });
  }
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
let noNeed = 0;
for (const l of LIBS) {
  const mine = rows.filter((r) => r.lib === l), u = used[l];
  const nn = mine.filter((r) => /no need here/i.test(r.cells.join(" ")));
  const yes = mine.filter((r) => !/no need here/i.test(r.cells.join(" ")));
  if (!mine.length) { if (fs.existsSync(tableFile)) fail("table", `${l}: no row in ROLE-COVERAGE.md`); continue; }
  if (nn.length) noNeed++;
  for (const r of nn) {
    const reason = r.cells.join(" ").replace(/no need here/ig, "").replace(/[-:;,.]/g, " ").trim();
    if (reason.split(/\s+/).filter(Boolean).length < 8) fail("table", `${l}: "no need here" without a reason a reviewer could dispute (at least 8 words)`);
    if (u.length) fail("table", `${l}: says "no need here" but the screens use ${u.map((p) => p.part).join(", ")}`);
  }
  if (!u.length && !nn.length) fail("coverage", `${l}: no part is imported and rendered and there is no "no need here" row`);
  for (const r of yes) {
    const text = norm(r.cells.join(" "));
    if (r.cells.length < 2 || r.cells[0].split(/\s+/).filter(Boolean).length < 3) fail("table", `${l}: a row without the need of this product in words (second column)`);
    if (u.length && !u.some((p) => text.includes(norm(p.part.replace(/^Tremor /, "").split(/[\s(]/)[0])))) fail("table", `${l}: the row names no part the screens render (rendered: ${u.map((p) => p.part).join(", ")})`);
    if (!u.length) fail("coverage", `${l}: the row names a part (${r.cells[1] ?? "?"}) but the screens import and render none of this library`);
  }
  if (u.length && !u.some((p) => p.strength)) fail("coverage", `${l}: only ${u.map((p) => p.part).join(", ")} is used, and that is not what ${l} is for (SKILL.md role table); use its strength or write "no need here" with the reason`);
}
if (noNeed > MAX_NO_NEED) fail("table", `${noNeed} libraries answered "no need here" (the limit is ${MAX_NO_NEED}): it is rare, SKILL.md step 2 says which needs call for which library`);
if (noNeed && fs.existsSync(tableFile)) console.log(`"no need here" rows (a reviewer may dispute each): ${LIBS.filter((l) => rows.some((r) => r.lib === l && /no need here/i.test(r.cells.join(" ")))).join(", ")}`);

console.log(`role-coverage: ${fails.length ? `FAILED (${fails.length})` : "ok"}`);
process.exit(fails.length ? 1 : 0);
