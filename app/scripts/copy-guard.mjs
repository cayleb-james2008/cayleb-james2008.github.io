// copy-guard.mjs: the build fails if the owner-approved copy is rewritten. See COPY-RULES.md at the repo root.
// Sync jobs may update version numbers and links. They may not rewrite prose, add feature lists, or bring back removed projects.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const fail = [];

// 1. The frozen block in content.ts (masthead line, Q&A, experience) must match the approved hash.
const FROZEN_SHA256 = "81e497b46025861bcba6f7e3274348ed1b01e6cf2955149ab02f0e962f20f082";
const content = read("app/src/content.ts");
const m = content.match(/\/\/ FROZEN-COPY-START[^\n]*\n([\s\S]*?)\n\/\/ FROZEN-COPY-END/);
if (!m) fail.push("app/src/content.ts: the FROZEN-COPY-START/END markers are missing.");
else {
  const h = crypto.createHash("sha256").update(m[1]).digest("hex");
  if (h !== FROZEN_SHA256) fail.push(`app/src/content.ts: the frozen copy block changed (sha256 ${h}). Only Cayleb changes this text.`);
}

// 2. Removed projects and finance wording never come back on public pages.
// Written with character classes so the removed names never appear as plain text in this public repo.
const banned = /\b(Open-?K[a]l|K[a]lshi|S[o]phos|d[o]tz|Asm[o]deus|Industry A[I] Suite)\b/;
const publicFiles = [
  "app/src/content.ts", "app/index.html", "app/src/chrome/CommandPalette.tsx", "site/house/pages.js", "resume.html",
  ...fs.readdirSync(path.join(root, "projects")).filter((f) => f.endsWith(".html")).map((f) => `projects/${f}`),
];
for (const f of publicFiles) {
  const hit = read(f).match(banned);
  if (hit) fail.push(`${f}: "${hit[0]}" must not appear (removed by the owner).`);
}
for (const gone of ["lab", "demos/openbell"]) {
  if (fs.existsSync(path.join(root, gone))) fail.push(`${gone}/ was removed by the owner and must not come back.`);
}

// 3. Only Ergon gets descriptive copy. Other project pages are a name and links.
for (const f of ["openro.html", "fleet.html", "openbell.html"]) {
  const s = read(`projects/${f}`);
  if (/case-hero__out|name="description"/.test(s)) fail.push(`projects/${f}: only the name and links are allowed (no hero text or meta description).`);
}

if (fail.length) {
  console.error("copy-guard FAILED. Read COPY-RULES.md before changing site copy.\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log("copy-guard ok");
