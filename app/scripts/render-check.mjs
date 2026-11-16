// Headless render check for the bench (the starter's one page of specimens). Serves dist/ on a free local port.
//
// 0. Structure (needs no build and no browser, runs first): the starter ships NO product screen. See checkNoProductScreen.
// 1. At 1440 and 390 wide, in light and dark, the bench fails on: any console error or page error, any failed
//    same-origin request, sideways page overflow (also after every specimen has been used), body text under 14px or
//    any visible text under 12px, Geist or Geist Mono not loaded, an interactive element inside another one, any
//    fixed-position element at rest (the bench must not become an app shell), a bench that does not say at its top
//    that it is a bench of parts and not a layout to copy, fewer than the expected specimens or a specimen card
//    without its name, library, file, install line or one sentence on when to reach for it.
// 2. Text contrast: every visible element that directly holds text, and every input placeholder, against the
//    composited background behind it (alpha blended first), on the bench at rest and with the morphing dialog and
//    the island's search open. Under 4.5 to 1 fails (3 to 1 for text of 24px, or bold 18.66px, and up). See checkTextContrast.
// 3. Keyboard: Tab from the top of the page must reach every specimen that has something to press; then each
//    specimen is driven with real key presses (Enter, Space, D and the arrows, Ctrl+K, Escape, Shift+F10) and must
//    show its effect. A specimen with nothing to press says why in data-specimen-still. Rolling numbers must put
//    exactly one number into the accessibility tree.
// 4. Reduced motion (prefers-reduced-motion: reduce) at 1440 and 390: every specimen is pressed once, and it fails
//    if any element's position or size is still changing 50 ms later, or document.getAnimations() holds a running
//    animation or transition over 1 ms on a transform, position, size or stroke-dash property (a named loading
//    spinner is exempt).
// Writes pictures to .shots/ (git-ignored, old ones are removed first): the bench at each size and theme, and the
// dialog and the island's search open.
// Two modes, chosen by src/App.tsx: when it imports the bench, the page is the bench and rules 0 to 4 above run. When it
// does not, the project is a product and these run instead of rules 0, and the bench-only parts of 1 to 4:
// P1. JOB.md in the project root (one numbered line per question the job asks) is read; the question count comes from it.
//     At 1440 x 900 and 390 x 844 every question must have an element marked data-answers="N" inside the first screenful,
//     or a control marked data-answers-via="N" inside it whose ONE press brings a data-answers="N" element into view
//     (checkFirstFold). The bench is exempt from JOB.md.
// P2. Nothing inert: every visible enabled control is pressed once (the page reloaded before each press) and the page
//     must change (text, markup, a dialog or drawer, the address, a field, the scroll) or fire a notice of three words
//     or more; a button that changes nothing fails (checkInert).
// P3. scripts/role-coverage.mjs runs (see it): every library of the eight used for its strength or answered "no need here".
// P4. The generic rules of 1 and 2 (errors, overflow, text size, fonts, nested controls, contrast) and the reduced-motion
//     rule of 4 (every control pressed once, nothing still moving 50 ms later) on the product page.
// P5. Spacing (scripts/product-rules.mjs, light, at 1440 x 900 and 390 x 844, at rest): S1 clipped beside empty (a band of empty
//     canvas of 64px or more in the first screenful while text there is hidden by a clamp of two lines or more), S2 hollow box
//     (in a box with chrome of 120 x 120 and up, whatever its radius: a gap between stacked blocks over 40px and over three times
//     the median, two blocks more than 64px apart, or room under the last block over 40px and over three times the room above;
//     a box may carry data-spacing="pinned", at most two), S3 one rhythm for one kind (three or more neighbours of one tag, one
//     display and one size: equal gaps and paddings within 1px), S4 edges line up (the top-level regions of the main content share
//     a left and a right edge within 1px), S5 text has room (8px from a box's left and right edges, 6px in a pill, 4px in a chip
//     24px tall or less; 4px top and bottom, 3px in a box 24px tall or less), S6 nothing fixed or sticky covers an answer (at 1366 x 768,
//     1280 x 720 and 1536 x 864, more than 8px in both directions over an element marked data-answers), S7 a label sits in the
//     middle of its control (one line of text in a control up to 64px tall: its centre within 2px of the control's).
// P6. Every control answers (A1, product-rules.mjs, light, 1440 x 900, normal motion): each visible enabled control in the first
//     screenful (buttons, links, tabs, switches, menu items, options, checkboxes, summary, other clickable things) changes its look
//     within 300 ms of a hover and, once the hover has settled, within 200 ms of the mouse going down (the pointer leaves before
//     release), ignoring what moves by itself, and shows a focus ring when reached with Tab; text inputs need the ring only. The
//     controls below the first screenful are counted.
// P7. One source for motion values (M1, scripts/motion-source.mjs, product and bench): no literal stiffness, damping, bounce,
//     mass, duration or delay in a transition and every such value a member of src/motion.ts, no Tailwind duration, delay or
//     easing literal (also as an arbitrary property), no literal time or easing in a style value or in src/*.css, no transition-all
//     in screen source; src/motion.ts and the --dur-* and --ease-house tokens agree. Presets and their sources: src/motion.ts.
// What P5 to P7 do not decide: optical alignment, whether a layout is pleasant or well proportioned, whether a motion suits its
// cause. Those stay with a reviewer and the owner.
// Browser: $CHROME_PATH, /usr/bin/chromium, /usr/bin/chromium-browser, /usr/bin/google-chrome, then a Chromium
// in ~/.cache/ms-playwright; with none it exits 2 and says what to install.
// Usage: npm run build && node scripts/render-check.mjs
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright-core"; // a devDependency; it downloads no browser
import { checkSpacing, checkAnswers, checkLaptops } from "./product-rules.mjs";

// Structure rule (runs first, needs no build and no browser): the starter ships NO product screen (BAR.md 16).
// Under src/, outside components/ (the libraries' own files), it fails on: a folder named studies, screens, pages,
// views, routes, data, mocks, fixtures or samples; a top-level entry that is not one of the known ones below; a data
// file (a .json, or a file named data, sample, fixture, mock or seed); and text in the house's own files that names the
// made-up business of a product screen (ticket, job, invoice, ledger, deck, order, customer, payroll, shop, shift
// words, or a person's name in a list). It does not catch a product screen written with other words; the owner's
// eye and the fresh-agent trial (BAR.md 14 and 16) do.
function checkNoProductScreen(srcDir) {
  const out = [];
  const known = new Set(["App.tsx", "main.tsx", "motion.ts", "parts.tsx", "index.css", "tokens.css", "vite-env.d.ts", "bench", "chrome", "components", "hooks", "lib", "utils"]);
  const bannedDir = /^(studies|screens|pages|views|routes|data|mocks?|fixtures?|samples?)$/i;
  const dataFile = /(^|[-_.])(data|samples?|fixtures?|mocks?|seeds?)\.(tsx?|jsx?|json|csv)$|\.json$/i;
  const business = /\b(ticket|tickets|invoice|invoices|ledger|payroll|customer|customers|storefront|sku|orders? (?:#|total)|operations board|kanban of|job queue|new job|add entry|new post|example data)\b/i;
  for (const top of fs.readdirSync(srcDir)) if (!known.has(top)) out.push(`src/${top}: not one of the known places (${[...known].join(", ")})`);
  const walk = (dir, inLibraries) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name), rel = path.relative(srcDir, full);
      if (e.isDirectory()) {
        const libs = inLibraries || rel === "components";
        if (!libs && bannedDir.test(e.name)) out.push(`src/${rel}/: a ${e.name} folder (a product screen or a made-up business's data)`);
        walk(full, libs);
      } else if (!inLibraries) {
        if (dataFile.test(e.name)) out.push(`src/${rel}: a data file`);
        else if (/\.(tsx?|css)$/.test(e.name)) {
          const m = fs.readFileSync(full, "utf8").match(business);
          if (m) out.push(`src/${rel}: names a made-up business ("${m[0]}")`);
        }
      }
    }
  };
  walk(srcDir, false);
  return out;
}
// The page is the bench when src/App.tsx imports it; anything else is a product (see the header).
const benchMode = /from ["']@\/bench\//.test(fs.readFileSync(path.resolve(import.meta.dirname, "..", "src", "App.tsx"), "utf8"));
if (benchMode) {
  const bad = checkNoProductScreen(path.resolve(import.meta.dirname, "..", "src"));
  if (bad.length) {
    for (const b of bad) console.error(`FAIL [structure] ${b}`);
    console.error(`\nrender-check FAILED: the starter holds a product screen or a made-up business (${bad.length} place(s))`);
    process.exit(1);
  }
  console.log("ok   structure: no product screen, no made-up business data under src/");
}

// Browser, in this order: $CHROME_PATH, /usr/bin/chromium, /usr/bin/chromium-browser, /usr/bin/google-chrome,
// then a Chromium in ~/.cache/ms-playwright. Always headless with a throw-away profile (a non-persistent
// context), never the user's own browser.
function findBrowser() {
  const cache = path.join(os.homedir(), ".cache", "ms-playwright");
  const cached = fs.existsSync(cache)
    ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort((x, y) => y.slice(9) - x.slice(9))
        .flatMap((d) => ["chrome-linux64", "chrome-linux"].map((o) => path.join(cache, d, o, "chrome")))
    : [];
  return [process.env.CHROME_PATH, "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", ...cached]
    .find((p) => p && fs.existsSync(p));
}
const chromePath = findBrowser();
if (!chromePath) {
  console.error("No Chromium or Chrome found: install chromium (for example `sudo pacman -S chromium` or `sudo apt install chromium`) or set CHROME_PATH to its executable.");
  process.exit(2);
}

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const shots = path.join(root, ".shots");
if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("dist/ is missing: run `npm run build` first");
  process.exit(2);
}
fs.mkdirSync(shots, { recursive: true });
for (const f of fs.readdirSync(shots)) if (f.endsWith(".png")) fs.rmSync(path.join(shots, f)); // pictures of an older run would mislead

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html");
  res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r)); // port 0 = a free port
const base = `http://127.0.0.1:${server.address().port}/`;
console.log("serving dist/ at", base);

const failures = [];
const status = (cfg) => `${failures.some((f) => f.startsWith(`[${cfg}]`)) ? "FAIL" : "ok  "} ${cfg}`;
const fail = (cfg, msg) => { failures.push(`[${cfg}] ${msg}`); console.error(`FAIL [${cfg}] ${msg}`); };


// M1: one source for motion values (a source check, no browser): runs in both modes.
function runMotionSource() {
  const r = spawnSync(process.execPath, [path.join(root, "scripts", "motion-source.mjs")], { cwd: root, encoding: "utf8" });
  process.stdout.write(r.stdout ?? ""); process.stderr.write(r.stderr ?? "");
  if (r.status !== 0) failures.push("[motion-source] scripts/motion-source.mjs failed (its lines are printed above)");
}

async function smallText(page) {
  return page.evaluate(() => {
    const out = [];
    const bodySize = parseFloat(getComputedStyle(document.body).fontSize);
    if (bodySize < 14) out.push(`body font-size ${bodySize}px`);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement;
      if (!el || el.closest("script,style,noscript")) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const fs = parseFloat(cs.fontSize);
      if (fs < 12) out.push(`${fs}px "${n.nodeValue.trim().slice(0, 30)}" in <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 60)}">`);
    }
    return out;
  });
}

// Interactive elements may not sit inside other interactive elements.
const NESTED = ['button button', 'a button', 'button a', '[role="button"] button', 'button [role="button"]', '[role="button"] [role="button"]', 'a a'];
const FOCUSABLE = 'button,a[href],input,select,textarea,summary,[tabindex],[role="button"]';
async function checkNested(page, cfg, where) {
  const found = await page.evaluate((sels) => sels.flatMap((sel) => [...document.querySelectorAll(sel)]
    .map((el) => `${sel} -> <${el.tagName.toLowerCase()}> "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28)}"`)), NESTED);
  if (found.length) fail(cfg, `nested interactive controls (${where}): ${found.length}, e.g. ${found.slice(0, 3).join(" | ")}`);
}

// Contrast sweep: reads what the browser really paints, not the tokens. Measures EVERY visible element that
// directly holds text, plus input placeholders (the computed ::placeholder colour). The text colour is the computed
// `color` (SVG text: `fill`), alpha included; the background is every layer behind the element composited from the
// root inward, each layer faded by its own `opacity` as a group, as the browser does. Text under 24px (under 18.66px
// when bold, weight 700 and up) must reach 4.5 to 1, larger text 3 to 1. The only exemptions: text inside a control
// that is disabled or aria-disabled, text that is (or sits in) aria-hidden, and text with an effective opacity of 0
// (or a colour with alpha 0). With the ticket detail open, elements the dialog's overlay covers are skipped, since
// they are not visible (the resting run already measured them). Counts of what was exempt are printed, never hidden.
// A linear or radial gradient behind the text is measured against each of its colour stops (the worst counts); a
// url() image behind text fails as unmeasurable. Blind spots: ::before and ::after paint, box-shadow, and hover,
// focus and pressed states are not measured.
const MIN_SMALL = 4.5, MIN_LARGE = 3;
const seenOffenders = new Set();
async function checkTextContrast(page, cfg, where, wide = false) {
  const r = await page.evaluate(({ covered, ignoreHidden }) => {
    const g = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    g.canvas.width = g.canvas.height = 1;
    // straight rgba of any CSS colour (oklch, color-mix and so on): paint it on black and on white, solve for alpha
    const rgba = (c) => {
      g.fillStyle = "#010203"; g.fillStyle = c;
      if (g.fillStyle === "#010203" && !/^(#010203|rgb\(1, 2, 3\))$/.test(c)) throw new Error(`cannot read colour ${c}`);
      const paint = (base) => { g.fillStyle = base; g.fillRect(0, 0, 1, 1); g.fillStyle = c; g.fillRect(0, 0, 1, 1); return g.getImageData(0, 0, 1, 1).data; };
      const k = paint("#000"), w = paint("#fff");
      const a = Math.min(1, Math.max(0, 1 - (w[0] - k[0] + w[1] - k[1] + w[2] - k[2]) / 765));
      return a < 0.004 ? [0, 0, 0, 0] : [k[0] / a, k[1] / a, k[2] / a, a];
    };
    const pre = ([r, gr, b, a]) => [r * a, gr * a, b * a, a];
    const over = (t, b) => t.map((v, i) => v + b[i] * (1 - t[3]));
    const lum = ([r, gr, b]) => [r, gr, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
      .reduce((a, v, k) => a + v * [0.2126, 0.7152, 0.0722][k], 0);
    const part = (e) => e.tagName.toLowerCase()
      + [...e.attributes].filter((a) => /^(data-slot|data-id|data-stat|role|aria-label)$/.test(a.name)).slice(0, 1).map((a) => `[${a.name}="${a.value.slice(0, 18)}"]`).join("")
      + (typeof e.className === "string" ? e.className.split(/\s+/).filter(Boolean).slice(0, 2).map((c) => "." + c.slice(0, 22)).join("") : "");
    const sel = (el) => { const a = el.parentElement?.closest("[data-slot],[data-id],[data-stat],[role],aside,header,main,table"); return (a ? part(a) + " > " : "") + part(el); };

    const measured = [], offenders = [], seen = new Set();
    const exempt = { disabled: 0, hidden: 0, invisible: 0 }, hiddenText = new Set();
    let overImage = 0;
    for (const el of document.body.querySelectorAll("*")) {
      if (el.closest("script,style,noscript,title")) continue;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.nodeValue.trim()).map((n) => n.nodeValue.trim()).join(" ");
      const holder = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      const placeholder = holder && el.placeholder && !el.value;
      if (!own && !placeholder) continue;
      if (!el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue; // sr-only and clipped to nothing
      if (covered) {
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        if (hit && !el.contains(hit) && !hit.contains(el)) continue;
      }
      const cs = getComputedStyle(el);
      const chain = [];
      for (let e = el; e; e = e.parentElement) chain.push(e);
      const textColour = placeholder ? getComputedStyle(el, "::placeholder").color : (el instanceof SVGElement ? cs.fill : cs.color);
      const t = rgba(textColour);
      if (placeholder) t[3] *= parseFloat(getComputedStyle(el, "::placeholder").opacity);
      const opacity = chain.reduce((p, e) => p * parseFloat(getComputedStyle(e).opacity), 1);
      if (opacity === 0 || t[3] === 0) { exempt.invisible++; continue; }
      if (el.closest(':disabled,[aria-disabled="true"]')) { exempt.disabled++; continue; }
      if (!ignoreHidden && el.closest('[aria-hidden="true"]')) { exempt.hidden++; hiddenText.add((placeholder ? el.placeholder : own).slice(0, 12)); continue; }
      // every layer behind the text, innermost first; a gradient gives one option per colour stop and the worst one counts
      let combos = [{ back: [0, 0, 0, 0], fore: pre(t) }], unreadable = false;
      for (const e of chain) {
        const ecs = getComputedStyle(e), o = parseFloat(ecs.opacity), bg = pre(rgba(ecs.backgroundColor));
        let opts = [bg];
        if (ecs.backgroundImage !== "none") {
          overImage++;
          const stops = ecs.backgroundImage.match(/(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)/g);
          if (!stops || /url\(/.test(ecs.backgroundImage)) unreadable = true;
          else opts = stops.map((c) => over(pre(rgba(c)), bg));
        }
        combos = combos.flatMap((c) => opts.map((b) => ({ back: over(c.back, b).map((v) => v * o), fore: over(c.fore, b).map((v) => v * o) })));
      }
      const white = [255, 255, 255, 1]; // the browser's canvas under everything
      const ratioOf = (c) => { const f = over(c.fore, white), b = over(c.back, white);
        return { ratio: (Math.max(lum(f), lum(b)) + 0.05) / (Math.min(lum(f), lum(b)) + 0.05), fore: f, back: b }; };
      const { ratio, fore, back } = combos.map(ratioOf).reduce((a, b) => (b.ratio < a.ratio ? b : a));
      const fs = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
      const need = fs >= 24 || (bold && fs >= 18.66) ? 3 : 4.5;
      const rgb = (c) => `rgb(${c.slice(0, 3).map(Math.round)})`;
      const m = { text: (placeholder ? el.placeholder : own).slice(0, 28), ratio, need, fs, colour: textColour, fore: rgb(fore), back: rgb(back), sel: sel(el),
        label: el.matches("aside .uppercase"), placeholder: !!placeholder };
      measured.push(m);
      if (unreadable) { offenders.push({ ...m, ratio: 0, unreadable: true }); continue; }
      if (ratio < need) {
        const key = `${m.sel}|${m.text}|${m.fore}|${m.back}`;
        if (!seen.has(key)) { seen.add(key); offenders.push(m); }
      }
    }
    const lowest = measured.reduce((a, m) => (!a || m.ratio < a.ratio ? m : a), null);
    return { n: measured.length, offenders, exempt, overImage, lowest, placeholders: measured.filter((m) => m.placeholder).length,
      labels: measured.filter((m) => m.label).length, all: measured, hiddenText: [...hiddenText] };
  }, { covered: where !== "bench", ignoreHidden: !!process.env.SWEEP_ARIA_HIDDEN_TOO });
  console.log(`contrast ${cfg} ${where}: ${r.n} text elements measured, lowest ${r.lowest?.ratio.toFixed(2)} to 1 ("${r.lowest?.text}"); exempt: ${r.exempt.disabled} disabled, ${r.exempt.hidden} aria-hidden, ${r.exempt.invisible} invisible; ${r.overImage} layers with a background-image`);
  if (process.env.SWEEP_DUMP) console.log(`  aria-hidden exempt texts: ${JSON.stringify(r.hiddenText)}`);
  if (process.env.SWEEP_DUMP) for (const m of r.all) console.log(`  ${m.ratio.toFixed(2)} (need ${m.need}) ${m.fs}px "${m.text}" ${m.fore} on ${m.back} ${m.sel}`);
  if (r.n < 10) fail(cfg, `contrast (${where}): only ${r.n} text elements measured, the sweep is not seeing the page`);
  if (where === "bench" && !r.placeholders) fail(cfg, "contrast: no input placeholder was measured");
  for (const m of r.offenders) {
    const key = `${cfg}|${m.sel}|${m.text}|${m.fore}|${m.back}`;
    if (seenOffenders.has(key)) continue;
    seenOffenders.add(key);
    if (m.unreadable) fail(cfg, `contrast (${where}): "${m.text}" sits over a url() background image or an unreadable gradient; cannot be measured, at ${m.sel}`);
    else fail(cfg, `contrast (${where}): "${m.text}" is ${m.ratio.toFixed(2)} to 1, needs ${m.need} (${m.fs}px, computed ${m.colour} = ${m.fore} on ${m.back}) at ${m.sel}`);
  }
}

// Reduced motion: nothing may still be moving 50 ms after an action. Two snapshots of every element's box,
// 60 ms apart, starting 50 ms after the action; and no running animation or transition longer than 1 ms on
// a transform, position or size property (document.getAnimations() sees CSS and Web Animations ones).
const MOVES = /^(transform|translate|scale|rotate|top|left|right|bottom|inset|width|height|min-|max-|margin|padding|stroke-dash|x$|y$|cx$|cy$|r$)/;
async function stillMoving(page, cfg, step) {
  await page.waitForTimeout(50);
  const found = await page.evaluate(async ({ moves }) => {
    const re = new RegExp(moves);
    const name = (el) => `<${el.tagName.toLowerCase()}${[...el.attributes].filter((a) => /^(data-|vaul|role|aria-label)/.test(a.name)).slice(0, 2).map((a) => ` ${a.name}${a.value ? `="${a.value.slice(0, 20)}"` : ""}`).join("")}>`;
    const live = (el) => el.closest('[data-slot="button-loading-indicator"],[role="status"][aria-label="Loading"]'); // a named loading indicator may spin
    const snap = () => new Map([...document.body.querySelectorAll("*")].filter((el) => !live(el)).map((el) => [el, el.getBoundingClientRect()]));
    const anims = () => document.getAnimations().flatMap((a) => {
      if (a.playState !== "running") return [];
      const t = a.effect?.getComputedTiming?.();
      if (!t || !(t.activeDuration > 1) || (a.effect.target && live(a.effect.target))) return [];
      const props = a.transitionProperty ? [a.transitionProperty] : Object.keys(a.effect.getKeyframes()[0] ?? {}).concat(Object.keys(a.effect.getKeyframes().at(-1) ?? {}));
      const hit = [...new Set(props.map((p) => p.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())).filter((p) => !["offset", "easing", "composite", "computed-offset"].includes(p) && re.test(p)))];
      return hit.length ? [`${a.animationName ?? "transition"} ${hit.join("/")} ${Math.round(t.activeDuration)}ms on ${a.effect.target ? name(a.effect.target) : "?"}`] : [];
    });
    const a1 = snap(); const an1 = anims();
    await new Promise((r) => setTimeout(r, 60));
    const a2 = snap(); const an2 = anims();
    const moved = [];
    for (const [el, r1] of a1) {
      const r2 = a2.get(el);
      if (!r2 || !el.isConnected) continue;
      const d = [r2.x - r1.x, r2.y - r1.y, r2.width - r1.width, r2.height - r1.height].map((v) => Math.round(v * 10) / 10);
      if (d.some((v) => Math.abs(v) > 0.5)) moved.push(`${name(el)} moved ${d.join(",")}`);
    }
    return { moved: moved.slice(0, 4), count: moved.length, anims: [...new Set([...an1, ...an2])].slice(0, 4) };
  }, { moves: MOVES.source });
  if (found.count) fail(cfg, `after "${step}" ${found.count} elements still moving 50 ms later (x,y,w,h change): ${found.moved.join(" | ")}`);
  if (found.anims.length) fail(cfg, `after "${step}" running animation under reduced motion: ${found.anims.join(" | ")}`);
}

// ---------------------------------------------------------------------------------------------------------------------
// The bench: inventory, keyboard reach, keyboard use, accessible numbers.
const MIN_SPECIMENS = 53; // the bench holds this many today; one removed or renamed by accident fails
const GROUPS_EXPECTED = ["motion-primitives", "coss", "cult", "kibo", "tremor", "vaul-sonner", "motion", "house", "together", "deps"];
const ACTION = "[data-specimen-action],[data-thing],[data-actions] button";

async function checkInventory(page, cfg) {
  const r = await page.evaluate((sel) => {
    const top = document.querySelector("h1")?.textContent ?? "";
    const lead = document.querySelector("header p:not(:first-child)")?.textContent ?? "";
    const cards = [...document.querySelectorAll("[data-specimen]")].map((s) => ({
      id: s.getAttribute("data-specimen"),
      name: s.querySelector("h3")?.textContent?.trim() ?? "",
      when: s.querySelector("h3 + p")?.textContent?.trim() ?? "",
      labels: [...s.querySelectorAll("dt")].map((d) => d.textContent.trim()),
      codes: [...s.querySelectorAll("dd code")].map((c) => c.textContent.trim()),
      still: s.getAttribute("data-specimen-still"),
      actions: s.querySelectorAll(sel).length,
    }));
    const groups = [...document.querySelectorAll("section[id^='group-']")].map((g) => g.id.replace("group-", ""));
    const fixed = [...document.body.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "fixed" && !e.closest("[data-sonner-toaster]") && e.getBoundingClientRect().width > 2) // a 1px live region for screen readers is not a shell
      .map((e) => `<${e.tagName.toLowerCase()}>`);
    return { top, lead, cards, groups, fixed, asides: document.querySelectorAll("aside").length };
  }, ACTION);
  if (!/bench of parts/i.test(r.top)) fail(cfg, `the page heading is not "Bench of parts" (got "${r.top}")`);
  if (!/bench of parts, not a layout to copy/i.test(r.lead)) fail(cfg, "the top of the page does not say it is a bench of parts and not a layout to copy");
  if (r.cards.length < MIN_SPECIMENS) fail(cfg, `only ${r.cards.length} specimens, expected at least ${MIN_SPECIMENS}`);
  for (const g of GROUPS_EXPECTED) if (!r.groups.includes(g)) fail(cfg, `group "${g}" is missing from the bench`);
  const ids = r.cards.map((c) => c.id);
  if (new Set(ids).size !== ids.length) fail(cfg, "two specimens share an id");
  for (const c of r.cards) {
    const miss = [];
    if (!c.name) miss.push("name");
    for (const l of ["Library", "File", "Install"]) if (!c.labels.includes(l)) miss.push(l);
    if (c.codes.length < 2) miss.push("file and install lines");
    if (!/^Reach for\b.*[.]$/.test(c.when)) miss.push('one sentence starting "Reach for"');
    if (!c.actions && !c.still) miss.push("something to press, or a data-specimen-still reason");
    if (c.actions && c.still) miss.push("both an action and a still reason");
    if (miss.length) fail(cfg, `specimen ${c.id} lacks: ${miss.join(", ")}`);
  }
  if (r.fixed.length) fail(cfg, `fixed-position elements at rest (the bench would read as an app shell): ${r.fixed.slice(0, 4).join(", ")}`);
  if (r.asides) fail(cfg, "the bench has an aside (a sidebar): it must stay a workbench, not an app shell");
  return r.cards;
}

// Tab from the top: every specimen with something to press must receive focus.
async function checkReach(page, cfg, cards) {
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement instanceof HTMLElement && document.activeElement.blur(); });
  const want = new Set(cards.filter((c) => !c.still).map((c) => c.id));
  const seen = new Set();
  for (let i = 0; i < 700 && [...want].some((id) => !seen.has(id)); i++) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => document.activeElement?.closest("[data-specimen]")?.getAttribute("data-specimen") ?? null);
    if (id) seen.add(id);
  }
  await page.evaluate(() => { document.activeElement instanceof HTMLElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  const missed = [...want].filter((id) => !seen.has(id));
  if (missed.length) fail(cfg, `Tab never reached: ${missed.join(", ")}`);
}

// Rolling numbers: the accessibility tree must hold exactly one number in the figure, the one shown.
async function oneNumber(t, loc, want) {
  const snap = await loc.first().ariaSnapshot();
  const nums = snap.split("\n").filter((l) => /^\s*- text:/.test(l)).flatMap((l) => l.match(/\d+/g) ?? []);
  if (nums.length !== 1 || nums[0] !== String(want)) t.bad(`accessible text holds ${JSON.stringify(nums.slice(0, 6))}, expected exactly one number, ${want} (tree: ${snap.replace(/\s+/g, " ").slice(0, 100)})`);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Poll until fn() is true (up to ms); false if it never was.
async function until(fn, ms = 2500) { for (let t0 = Date.now(); Date.now() - t0 < ms; await wait(80)) if (await fn()) return true; return false; }
const FINE_POINTER = "(hover: hover) and (pointer: fine)"; // the parts that answer the pointer run only under this

// A tooltip must open when its key takes keyboard focus (Tab, not the pointer). Up to three tries: a tooltip waits a
// moment before it shows, and a pointer left over from the last specimen can hold it back.
async function tipOnFocus(t, shown) {
  const key = t.root.locator(ACTION).first();
  for (let i = 0; i < 3; i++) {
    await t.page.mouse.move(0, 0);
    await key.focus(); await t.page.keyboard.press("Shift+Tab"); await t.page.keyboard.press("Tab");
    try { await t.page.locator(shown).first().waitFor({ timeout: 4000 }); return; } catch { await t.page.evaluate(() => document.activeElement?.blur()); await wait(300); }
  }
  t.bad("the tooltip did not open on keyboard focus");
}

// One entry per specimen that has something to press: the keys to press, and what must follow.
const TESTS = {
  "mp-animated-background": async (t) => { await t.key(t.root.locator('[data-id="two"]')); await t.say("selected: two"); },
  "mp-sliding-number": async (t) => {
    await t.key(t.root.getByRole("button", { name: "Increase" })); await t.root.locator(".sr-only").filter({ hasText: "43" }).first().waitFor({ state: "attached", timeout: 1500 });
    await oneNumber(t, t.root.locator(".font-mono"), 43);
  },
  "mp-text-morph": async (t) => { await t.key(t.root.getByRole("button", { name: "Next word" })); await t.root.locator('[aria-label="Working"]').waitFor({ timeout: 1500 }); },
  "mp-morphing-dialog": async (t) => {
    await t.key(t.root.locator("[data-thing]"));
    await t.page.locator('[role="dialog"]').first().waitFor({ timeout: 1500 }); await wait(700);
    await t.page.screenshot({ path: path.join(shots, `dialog-${t.cfg}.png`) });
    await checkTextContrast(t.page, t.cfg, "dialog");
    await t.page.keyboard.press("Escape"); await wait(600);
    if (await t.page.locator('[role="dialog"]').count()) t.bad("Escape did not close the dialog");
  },
  "mp-dock": async (t) => { await t.key(t.root.locator('[data-dock-key="c"]')); await t.say("current: C"); if ((await t.root.locator('[data-dock-key="c"]').getAttribute("aria-current")) !== "true") t.bad("the pressed key is not aria-current"); },
  // The "alive" parts (mp-alive.tsx): each is tested on its cause, with a measurement, not only that a key was pressed.
  "mp-in-view": async (t) => {
    const op = () => t.root.locator("[data-arrives]").evaluate((e) => Number(getComputedStyle(e.parentElement).opacity));
    if ((await op()) > 0.1) t.bad("the region is already shown before it was scrolled to");
    const box = t.root.getByRole("region", { name: "Scrolling box" });
    await t.key(box, "End"); await t.say("box: end");
    if (!(await until(async () => (await op()) > 0.95))) t.bad("scrolling to the region did not bring it in");
    await t.key(box, "Home"); await t.say("box: top"); await wait(600);
    if ((await op()) < 0.95) t.bad("the region hid again when it scrolled out: it must arrive once");
  },
  "mp-animated-group": async (t) => {
    await t.root.getByRole("button", { name: "Open" }).press("Enter");
    const r = await t.root.evaluate(async (root) => {
      const items = () => [...root.querySelectorAll("[data-piece]")].map((e) => Number(getComputedStyle(e.parentElement).opacity));
      let best = 0, last = [];
      for (const end = performance.now() + 1500; performance.now() < end;) { last = items(); if (last.length === 4) best = Math.max(best, last[0] - last[3]); await new Promise((x) => requestAnimationFrame(x)); }
      return { best, last };
    });
    if (r.best < 0.3) t.bad(`the pieces did not arrive in order (largest gap between the first and the last: ${r.best.toFixed(2)})`);
    if (r.last.length !== 4 || r.last.some((o) => o < 0.95)) t.bad(`the pieces did not all arrive: ${JSON.stringify(r.last)}`);
    await t.say("opened 1 time");
  },
  "mp-spotlight": async (t) => {
    const card = t.root.locator("button[data-specimen-action]"), spot = t.root.locator("[data-spotlight]");
    await t.key(card); await t.say("opened 1 time");
    const fine = await t.page.evaluate((q) => matchMedia(q).matches, FINE_POINTER);
    const b = await card.boundingBox(); const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    await t.page.mouse.move(0, 0); await wait(300);
    const op = () => spot.evaluate((e) => Number(getComputedStyle(e).opacity));
    if ((await op()) > 0.05) t.bad("the light is on with no pointer over the card");
    await t.page.mouse.move(cx - 60, cy, { steps: 6 }); await wait(800);
    const lit = await spot.evaluate((e) => { const r = e.getBoundingClientRect(); return { op: Number(getComputedStyle(e).opacity), x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (fine) {
      if (lit.op < 0.95) t.bad(`the light did not come on under the pointer (opacity ${lit.op})`);
      if (Math.hypot(lit.x - (cx - 60), lit.y - cy) > 30) t.bad(`the light is not under the pointer (off by ${Math.round(Math.hypot(lit.x - (cx - 60), lit.y - cy))} px)`);
    } else if (lit.op > 0.05) t.bad("on a device with no hover the light came on");
    await t.page.mouse.move(0, 0); await wait(500);
    if ((await op()) > 0.05) t.bad("the light stayed on after the pointer left");
    await card.click(); await t.say("opened 2 times"); // the light never takes the press
  },
  "mp-border-trail": async (t) => {
    const trail = t.root.locator("[data-border-trail]"), dot = t.root.locator("[data-border-trail] > div");
    if ((await trail.count()) !== 1) t.bad("a running card has no border trail");
    const p1 = await dot.boundingBox(); await wait(700); const p2 = await dot.boundingBox();
    if (Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y) < 8) t.bad("the border trail did not travel the edge");
    await t.key(t.root.getByRole("button", { name: "Stop" })); await t.say("state: stopped");
    if ((await trail.count()) !== 0) t.bad("the trail stayed after the work stopped: it is only for a thing that is running");
    await t.key(t.root.getByRole("button", { name: "Start" })); await t.say("state: running");
    if ((await trail.count()) !== 1) t.bad("the trail did not come back when the work started");
  },
  "mp-text-shimmer": async (t) => {
    const label = t.root.locator("[data-shimmer-label] span");
    const pos = () => label.evaluate((e) => getComputedStyle(e).backgroundPosition);
    const p1 = await pos(); await wait(500);
    if (p1 === (await pos())) t.bad("the label does not shimmer");
    await t.key(t.root.getByRole("button", { name: "Finish" })); await t.say("state: done");
    if ((await label.evaluate((e) => getComputedStyle(e).backgroundImage)) !== "none") t.bad("the finished label still carries the shimmer gradient");
  },
  "mp-transition-panel": async (t) => {
    await t.key(t.root.locator('[data-id="two"]'), "Space"); await t.say("view: two");
    const only = async (word) => (await t.root.locator("[data-panel]").count()) === 1 && (await t.root.locator("[data-panel]").textContent()) === `Panel ${word}`;
    if (!(await until(() => only("two")))) t.bad("choosing Two did not leave Panel two alone in the panel");
    await t.key(t.root.locator('[data-id="three"]')); await t.say("view: three");
    if (!(await until(() => only("three")))) t.bad("choosing Three did not leave Panel three alone in the panel");
  },
  "mp-scroll-progress": async (t) => {
    const region = t.root.getByRole("region", { name: "Long text" });
    const frac = () => t.root.evaluate((r) => r.querySelector("[data-scroll-bar]").getBoundingClientRect().width / r.querySelector("[data-scroller]").clientWidth);
    if ((await frac()) > 0.05) t.bad("the bar is not empty at the top of the text");
    await t.key(region, "End"); await t.say("read: 100%");
    if (!(await until(async () => (await frac()) > 0.97, 3500))) t.bad(`the bar did not fill at the end of the text (${(await frac()).toFixed(2)})`);
    await t.key(region, "Home"); await t.say("read: 0%");
    if (!(await until(async () => (await frac()) < 0.03, 3500))) t.bad(`the bar did not empty at the top of the text (${(await frac()).toFixed(2)})`);
  },
  "mp-magnetic": async (t) => {
    const key = t.root.getByRole("button", { name: "Primary action" });
    await t.key(key); await t.say("pressed 1 time");
    const fine = await t.page.evaluate((q) => matchMedia(q).matches, FINE_POINTER);
    await t.page.mouse.move(0, 0); await wait(400);
    const b0 = await key.boundingBox();
    // beside the key, inside the zone around it; the part reads the pointer on each move, so a person's hand keeps moving after it enters: move twice
    await t.page.mouse.move(b0.x + b0.width + 20, b0.y + b0.height / 2, { steps: 8 }); await wait(150); await t.page.mouse.move(b0.x + b0.width + 22, b0.y + b0.height / 2); await wait(1300);
    const dx = (await key.boundingBox()).x - b0.x;
    if (fine && dx < 6) t.bad(`the key did not lean toward the pointer (moved ${dx.toFixed(1)} px)`);
    if (!fine && Math.abs(dx) > 1) t.bad(`on a device with no hover the key leaned ${dx.toFixed(1)} px`);
    await t.page.mouse.move(0, 0); await wait(1300);
    if (Math.abs((await key.boundingBox()).x - b0.x) > 2) t.bad("the key did not return when the pointer left");
  },
  "coss-button": async (t) => { await t.key(t.root.getByRole("button", { name: "Press", exact: true })); await t.say("pressed 1 time"); await wait(800); await t.key(t.root.getByRole("button", { name: "Press", exact: true }), "Space"); await t.say("pressed 2 times"); },
  "coss-input-group": async (t) => {
    const input = t.root.getByRole("searchbox", { name: "Search the words" });
    await input.focus(); await t.page.keyboard.type("be");
    await t.root.locator("[data-words] li").first().waitFor({ timeout: 1500 });
    if ((await t.root.locator("[data-words] li").count()) !== 1) t.bad('typing "be" did not leave exactly one word');
    await t.page.keyboard.type("zz");
    if (!((await t.root.locator("[data-search-empty]").textContent({ timeout: 1500 }).catch(() => "")) ?? "").includes("bezz")) t.bad("no empty state naming what was searched");
    await input.fill("");
  },
  "coss-tabs": async (t) => {
    const tab = t.root.getByRole("tab", { name: /^Two/ }).first(); await t.key(tab);
    if ((await tab.getAttribute("aria-selected")) !== "true") t.bad('Enter on the tab "Two" did not select it');
    await t.root.getByText("Panel two").waitFor({ timeout: 1500 });
  },
  "coss-segmented-control": async (t) => { await t.key(t.root.locator('[data-id="grid"]'), "Space"); await t.say("view: grid"); },
  "coss-table": async (t) => { const b = t.root.getByRole("button", { name: "Row 2" }); await t.key(b); if ((await b.getAttribute("aria-pressed")) !== "true") t.bad("Enter on a row key did not select the row"); },
  "coss-tooltip": async (t) => tipOnFocus(t, '[data-slot="tooltip-positioner"][data-open]'),
  "cult-texture-button": async (t) => { await t.key(t.root.getByRole("button", { name: "Press", exact: true })); await t.say("pressed 1 time"); },
  "cult-dynamic-island": async (t) => {
    const b0 = await t.root.locator("#bench-island").boundingBox(); const w0 = b0.width, h0 = b0.height;
    await t.key(t.root.getByRole("button", { name: "Morph it" })); await t.say("size: event"); await wait(900);
    const b1 = await t.root.locator("#bench-island").boundingBox(); const w1 = b1.width, h1 = b1.height;
    if (!(w1 > w0 + 20 || h1 > h0 + 10)) t.bad(`the island did not grow (${Math.round(w0)} by ${Math.round(h0)} to ${Math.round(w1)} by ${Math.round(h1)} px)`);
  },
  "cult-expandable": async (t) => { const b = t.root.locator("[aria-expanded]").first(); await t.key(b); if ((await b.getAttribute("aria-expanded")) !== "true") t.bad("Enter on the trigger did not expand it"); },
  "kibo-kanban": async (t) => {
    const stops = await t.root.evaluate((r, sel) => [...r.querySelectorAll("[data-kanban-card]")].map((c) => [c, ...c.querySelectorAll("*")].filter((e) => e.matches(sel) && e.tabIndex >= 0).length), "button,a[href],input,select,textarea,[tabindex],[role=\"button\"]");
    if (!stops.length || stops.some((n) => n !== 1)) t.bad(`cards must have exactly one tab stop each (found ${JSON.stringify(stops)})`);
    const face = t.root.locator('[data-kanban-card="k-1"] button');
    const desc = await face.evaluate((e) => (e.getAttribute("aria-describedby") || "").split(" ").filter(Boolean).map((i) => document.getElementById(i)?.textContent ?? "").join(" "));
    if (!/\bD\b/.test(desc) || !/Enter/i.test(desc)) t.bad(`a card's accessible description does not name the keys (Enter, D): "${desc.slice(0, 80)}"`);
    await t.key(face); await t.say("picked: Card 1");
    const col = () => t.root.locator('[data-kanban-card="k-1"]').evaluate((c) => c.closest("[data-kanban-column]")?.getAttribute("data-kanban-column"));
    const before = await col();
    await face.focus(); await t.page.keyboard.press("KeyD"); await wait(150);
    for (let i = 0; i < 12; i++) { await t.page.keyboard.press("ArrowRight"); await wait(60); }
    await t.page.keyboard.press("KeyD"); await wait(500);
    if (!before || (await col()) === before) t.bad(`the drag key (D, arrows, D) did not move Card 1 out of "${before}"`);
  },
  "kibo-gantt": async (t) => { await t.key(t.root.getByRole("button", { name: "Strip 2" })); await t.say("picked: Strip 2"); },
  "kibo-calendar": async (t) => {
    const m = () => t.root.locator("[data-month]").textContent(); const before = await m();
    await t.key(t.root.getByRole("button", { name: "Next month" })); await wait(200);
    if ((await m()) === before) t.bad("Next month did not change the month");
    await t.key(t.root.getByRole("button", { name: "Previous month" }));
  },
  "kibo-pill": async (t) => { await t.key(t.root.getByRole("button", { name: "Remove Pill 1" })); await t.say("2 pills"); },
  "tremor-spark": async (t) => { await t.key(t.root.getByRole("button", { name: /Redraw/ })); await t.say("series 2 of 3"); },
  "tremor-progress-circle": async (t) => { await t.key(t.root.getByRole("button", { name: "Raise" })); await t.root.getByText("70%").waitFor({ timeout: 1500 }); },
  "tremor-bar-list": async (t) => { await t.key(t.root.getByRole("button", { name: /Bar 2/ })); await t.say("picked: Bar 2"); },
  "tremor-category-bar": async (t) => { await t.key(t.root.getByRole("button", { name: "Move the marker" })); await t.say("marker at 50"); },
  "tremor-tooltip": async (t) => tipOnFocus(t, '[role="tooltip"]'),
  "vaul-drawer": async (t) => {
    await t.key(t.root.getByRole("button", { name: "Pull up a drawer" })); await t.page.locator("[data-vaul-drawer]").waitFor({ timeout: 2000 }); await wait(700);
    await t.page.keyboard.press("Escape"); await wait(900);
    if (await t.page.locator("[data-vaul-drawer]").count()) t.bad("Escape did not close the drawer");
  },
  "sonner-toast": async (t) => {
    const b = t.root.getByRole("button", { name: "Fire a toast" });
    for (let i = 0; i < 3; i++) await t.key(b);
    if ((await t.page.locator("[data-sonner-toast]").count()) < 3) t.bad("three presses did not leave three stacked toasts");
    await t.key(t.root.getByRole("button", { name: "Clear" })); await wait(500);
  },
  "motion-spring": async (t) => {
    const puck = t.root.locator("[data-puck]"); const x0 = (await puck.boundingBox()).x;
    await t.key(t.root.getByRole("button", { name: /Send it/ })); await t.say("target: right"); await wait(900);
    if (!((await puck.boundingBox()).x > x0 + 100)) t.bad("the puck did not travel to the right");
  },
  "motion-layoutid": async (t) => { await t.root.getByRole("button", { name: "C", exact: true }).focus(); await t.say("highlight on: C"); },
  "motion-flip": async (t) => { await t.key(t.root.getByRole("button", { name: "Rotate the list" })); await t.say("first: Item 2"); },
  "house-dock": async (t) => {
    await t.key(t.root.locator('[data-dock-key="three"]')); await t.say("key: three");
    if ((await t.root.locator('[data-dock-key="three"]').getAttribute("aria-current")) !== "true") t.bad("the pressed key is not aria-current");
    await t.key(t.root.locator("[data-dock-action]")); await t.say("action pressed 1");
  },
  "house-island": async (t) => {
    await t.key(t.root.getByRole("button", { name: "Announce an event" }));
    await t.root.locator("[data-island-text]").filter({ hasText: "A system event, announced" }).waitFor({ timeout: 1500 });
    await t.page.keyboard.press("Control+k");
    await t.page.locator('[role="dialog"][aria-label="Search and commands"]').waitFor({ timeout: 1500 }); await wait(700);
    await t.page.screenshot({ path: path.join(shots, `island-${t.cfg}.png`) });
    await checkTextContrast(t.page, t.cfg, "island");
    await t.page.keyboard.type("be"); await wait(200); await t.page.keyboard.press("Enter");
    await t.say("opened: Beta"); await wait(700);
    if (await t.page.locator('[role="dialog"][aria-label="Search and commands"]').count()) t.bad("choosing a result did not close the search");
  },
  "house-instrument": async (t) => { await t.key(t.root.getByRole("button", { name: "Add 7" })); await oneNumber(t, t.root.locator("[data-figure]"), "135"); },
  "house-parts": async (t) => { await t.key(t.root.getByRole("button", { name: "Advance" })); await t.root.locator('[aria-label="Working"]').waitFor({ timeout: 1500 }); },
  "together-motion-under": async (t) => {
    const b = t.root.locator("[aria-expanded]").first(); await t.key(b);
    if ((await b.getAttribute("aria-expanded")) !== "true") t.bad("Enter on the trigger did not expand it");
    await wait(500); await t.key(t.root.locator("[data-more]")); await wait(300);
    await oneNumber(t, t.root.locator(".font-mono").first(), 4);
  },
  "together-coss-in-kibo": async (t) => {
    await t.key(t.root.getByRole("button", { name: "Add a card to Column A" }));
    await t.root.locator("[data-count]").first().getByText("2").waitFor({ timeout: 1500 });
  },
  "together-tremor-morph": async (t) => {
    await t.key(t.root.locator("[data-thing]")); await t.page.locator('[role="dialog"]').first().waitFor({ timeout: 1500 }); await wait(500);
    await t.page.keyboard.press("Escape"); await wait(600);
    if (await t.page.locator('[role="dialog"]').count()) t.bad("Escape did not close the dialog");
  },
  "together-focus-sheet": async (t) => {
    await t.key(t.root.locator("[data-thing]")); await t.page.locator('[role="dialog"]').first().waitFor({ timeout: 2000 }); await wait(700);
    const drawer = await t.page.locator("[data-vaul-drawer]").count();
    if (t.width < 640 && !drawer) t.bad("on a phone the sheet is not a Vaul drawer");
    if (t.width >= 640 && drawer) t.bad("on a desktop the sheet is a Vaul drawer, not the morphing dialog");
    await t.page.keyboard.press("Escape"); await wait(900);
    if (await t.page.locator('[role="dialog"]').count()) t.bad("Escape did not close the sheet");
  },
  "dep-popover": async (t) => { await t.key(t.root.getByRole("button", { name: "Open a popover" })); await t.page.locator("[data-popover]").waitFor({ timeout: 1500 }); await t.page.keyboard.press("Escape"); await wait(300); if (await t.page.locator("[data-popover]").count()) t.bad("Escape did not close the popover"); },
  "dep-dialog": async (t) => { await t.key(t.root.getByRole("button", { name: "Open a dialog" })); await t.page.locator('[role="dialog"]').first().waitFor({ timeout: 1500 }); await t.page.keyboard.press("Escape"); await wait(400); if (await t.page.locator('[role="dialog"]').count()) t.bad("Escape did not close the dialog"); },
  "dep-context-menu": async (t) => {
    const area = t.root.locator(ACTION).first();
    for (let i = 0; i < 3; i++) { // the menu can miss the first Shift+F10 while the page is still settling
      await area.focus(); await t.page.keyboard.press("Shift+F10");
      if (await t.page.getByRole("menu").waitFor({ timeout: 4000 }).then(() => true, () => false)) break;
      await t.page.keyboard.press("Escape"); await wait(300);
    }
    await t.page.getByRole("menu").waitFor({ timeout: 4000 });
    await t.page.keyboard.press("ArrowDown"); await t.page.keyboard.press("Enter"); await t.say("chose: Item one");
  },
  "dep-command": async (t) => {
    await t.root.getByRole("combobox").first().focus(); await t.page.keyboard.type("be"); await wait(300);
    const n = await t.root.getByRole("option").count();
    if (n !== 1) t.bad(`typing "be" left ${n} options, expected 1`);
  },
};

async function checkSpecimens(page, cfg, width, cards) {
  const want = cards.filter((c) => !c.still).map((c) => c.id);
  for (const id of want) if (!TESTS[id]) fail(cfg, `specimen ${id} has no keyboard test in render-check.mjs`);
  for (const id of Object.keys(TESTS)) if (!cards.some((c) => c.id === id)) fail(cfg, `a keyboard test names ${id}, which is not on the bench`);
  for (const id of want) {
    const root = page.locator(`[data-specimen="${id}"]`);
    await root.scrollIntoViewIfNeeded();
    const t = {
      page, root, cfg, width, id,
      bad: (m) => fail(cfg, `specimen ${id}: ${m}`),
      key: async (loc, key = "Enter") => { await loc.focus(); await page.keyboard.press(key); await wait(250); },
      say: (text) => root.locator("[data-readout]").filter({ hasText: text }).first().waitFor({ state: "visible", timeout: 1500 }),
    };
    try { if (TESTS[id]) await TESTS[id](t); } catch (e) { fail(cfg, `specimen ${id}: ${String(e.message).split("\n")[0].slice(0, 200)}`); }
    await page.keyboard.press("Escape"); await wait(200);
  }
}

// The parts that travel or reveal must be at rest under reduced motion, measured (not just their own say-so): a trail
// that is still, a shimmer with no gradient, no spotlight, a region that is already there, a key that does not lean.
async function checkStaticUnderReduced(page, cfg) {
  const out = await page.evaluate(async () => {
    const bad = [];
    const rect = (el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10).join(","); };
    const dot = document.querySelector("[data-border-trail] > div"), shim = document.querySelector("[data-shimmer-label] span");
    const t1 = dot && rect(dot), s1 = shim && getComputedStyle(shim).backgroundPosition;
    await new Promise((r) => setTimeout(r, 500));
    if (!dot) bad.push("the border trail specimen is not running at load");
    else if (rect(dot) !== t1) bad.push("the border trail moves");
    else if (dot.getBoundingClientRect().width < dot.parentElement.getBoundingClientRect().width - 4) bad.push("the still trail does not draw the whole edge");
    if (!shim) bad.push("the shimmer specimen is not running at load");
    else { const cs = getComputedStyle(shim); if (cs.backgroundImage !== "none" || cs.backgroundPosition !== s1 || cs.color === "rgba(0, 0, 0, 0)") bad.push("the shimmer label still has its gradient, moves, or is transparent"); }
    const spot = document.querySelector("[data-spotlight]");
    if (spot && getComputedStyle(spot).display !== "none") bad.push("the spotlight is not hidden");
    const arrives = document.querySelector("[data-arrives]");
    if (arrives && Number(getComputedStyle(arrives.parentElement).opacity) !== 1) bad.push("the in-view region is hidden until it is scrolled to: a reveal must be instant");
    return bad;
  });
  for (const m of out) fail(cfg, `reduced motion: ${m}`);
  const key = page.getByRole("button", { name: "Primary action" });
  await key.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await page.waitForTimeout(300);
  const b0 = await key.boundingBox();
  await page.mouse.move(b0.x + b0.width + 20, b0.y + b0.height / 2, { steps: 8 }); await page.waitForTimeout(150);
  await page.mouse.move(b0.x + b0.width + 22, b0.y + b0.height / 2); await page.waitForTimeout(1000);
  const dx = (await key.boundingBox()).x - b0.x;
  if (Math.abs(dx) > 0.5) fail(cfg, `reduced motion: the primary action leaned ${dx.toFixed(1)} px toward the pointer`);
  await page.mouse.move(0, 0);
}

// Reduced motion: press every specimen once with the mouse; nothing may still be moving 50 ms later.
async function checkReducedMotion(browser, width) {
  const cfg = `${width}-reduced`;
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: "light", reducedMotion: "reduce", hasTouch: width < 500 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail(cfg, `page error: ${e.message}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) fail(cfg, "reduced motion was not emulated");
  await checkStaticUnderReduced(page, cfg);
  const ids = await page.evaluate(() => [...document.querySelectorAll("[data-specimen]:not([data-specimen-still])")].map((s) => s.getAttribute("data-specimen")));
  for (const id of ids) {
    if (id === "kibo-kanban" || id === "dep-context-menu") continue; // a click only picks a card or focuses the area; the drag is keyboard-only here
    const el = page.locator(`[data-specimen="${id}"] ${ACTION}`).first();
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(150);
    await page.mouse.move(0, 0); await page.waitForTimeout(100);
    await el.click({ timeout: 4000 }).catch((e) => fail(cfg, `could not press ${id}: ${String(e.message).split("\n")[0].slice(0, 120)}`));
    await stillMoving(page, cfg, `press ${id}`);
    await page.keyboard.press("Escape"); await page.waitForTimeout(400);
    if (await page.locator('[role="dialog"],[data-vaul-drawer]').count()) { await page.keyboard.press("Escape"); await page.waitForTimeout(500); }
  }
  await page.getByRole("button", { name: /Switch to/ }).click();
  await stillMoving(page, cfg, "toggle the theme");
  await ctx.close();
  console.log(status(cfg));
}

// ---------------------------------------------------------------------------------------------------------------------
// Product mode (src/App.tsx does not import the bench): the job's questions in the first fold, nothing inert, role
// coverage, and the generic rules. See the header, P1 to P4.
const VH = { 1440: 900, 390: 844 }; // the two first-screenful sizes
const CONTROLS = 'button,[role="button"],[role="tab"],[role="switch"],[role="checkbox"],[role="menuitem"],summary,a[href^="#"]';

// JOB.md: one numbered line per question the job sentence lists ("1. ...", "2) ..."), numbered 1 to N without a gap.
function readJob() {
  const f = path.join(root, "JOB.md");
  if (!fs.existsSync(f)) { fail("first-fold", "JOB.md is missing from the project root: the job sentence, then one numbered line per question it asks"); return null; }
  const qs = fs.readFileSync(f, "utf8").split("\n").map((l) => l.match(/^\s*(\d+)[.)]\s+(\S.*)$/)).filter(Boolean).map((m) => ({ n: Number(m[1]), text: m[2].slice(0, 60) }));
  if (!qs.length) { fail("first-fold", "JOB.md holds no numbered question line (\"1. ...\")"); return null; }
  if (qs.some((q, i) => q.n !== i + 1)) { fail("first-fold", `JOB.md questions must be numbered 1 to ${qs.length} in order (got ${qs.map((q) => q.n).join(", ")})`); return null; }
  return qs;
}

// Tag every visible, enabled control with data-rc-i, in document order; returns their names.
const markControls = (page) => page.evaluate((sel) => {
  document.querySelectorAll("[data-rc-i]").forEach((e) => e.removeAttribute("data-rc-i"));
  const names = [];
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest('[data-sonner-toaster],[inert],[aria-hidden="true"]') || el.matches(':disabled,[aria-disabled="true"]')) continue;
    if (el.matches('[aria-selected="true"],[aria-pressed="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"])')) continue; // an option that already shows itself chosen: pressing it again may rightly change nothing
    if (!el.checkVisibility({ visibilityProperty: true })) continue;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    el.setAttribute("data-rc-i", String(names.length));
    names.push((el.getAttribute("aria-label") || el.textContent || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40));
  }
  return names;
}, CONTROLS);

const reload = async (page) => { await page.reload({ waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(700); };

// P1. Every question answered inside the first screenful, or one press away from it.
async function checkFirstFold(page, cfg, questions, width) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const vh = VH[width];
  const read = () => page.evaluate((vh) => {
    const box = (el) => {
      if (!el.checkVisibility({ visibilityProperty: true })) return null;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return null;
      const seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return { top: Math.round(r.top), inside: seen >= Math.min(r.height, 32) && r.left < innerWidth && r.right > 0 };
    };
    const named = (el) => (el.innerText || "").trim().length >= 3 || (el.getAttribute("aria-label") || "").trim().length >= 3;
    return {
      marks: [...document.querySelectorAll("[data-answers]")].map((el) => ({ n: el.getAttribute("data-answers"), b: box(el), named: named(el) })),
      vias: [...document.querySelectorAll("[data-answers-via]")].map((el) => ({ n: el.getAttribute("data-answers-via"), b: box(el), ctl: el.matches(`${"button,[role=button],[role=tab],a[href],summary"}`) && !el.matches(":disabled,[aria-disabled=true]") })),
    };
  }, vh);
  const r = await read(), N = questions.length;
  for (const m of [...r.marks, ...r.vias]) if (!/^\d+$/.test(m.n) || +m.n < 1 || +m.n > N) fail(cfg, `first-fold: data-answers${m === r.marks[r.marks.indexOf(m)] ? "" : "-via"}="${m.n}" is not a question of JOB.md (1 to ${N})`);
  const verdict = [];
  for (const q of questions) {
    const own = r.marks.filter((m) => m.n === String(q.n) && m.b);
    if (own.some((m) => m.b.inside && m.named)) { verdict.push(`Q${q.n} in view`); continue; }
    if (own.some((m) => m.b.inside && !m.named)) { fail(cfg, `first-fold: question ${q.n} ("${q.text}"): the element marked data-answers="${q.n}" holds no text and no aria-label`); continue; }
    const via = r.vias.filter((v) => v.n === String(q.n) && v.b?.inside);
    if (!via.length) {
      const any = r.marks.filter((m) => m.n === String(q.n));
      fail(cfg, `first-fold: question ${q.n} ("${q.text}") ${!any.length ? `has no element marked data-answers="${q.n}"` : own.length ? `is answered at y=${own[0].b.top}, below the first screenful (${width} x ${vh}) and with no data-answers-via="${q.n}" control inside it` : `is marked but the marked element is hidden at ${width} wide`}`);
      continue;
    }
    // one press on the control must bring the answer into view
    await page.locator(`[data-answers-via="${q.n}"]`).first().click({ timeout: 3000 }).catch((e) => fail(cfg, `first-fold: question ${q.n}: the data-answers-via control could not be pressed (${String(e.message).split("\n")[0].slice(0, 80)})`));
    await page.waitForTimeout(900);
    const after = await read();
    if (!after.marks.some((m) => m.n === String(q.n) && m.b?.inside && m.named)) fail(cfg, `first-fold: question ${q.n} ("${q.text}"): one press on its data-answers-via control did not bring a data-answers="${q.n}" element into view`);
    else verdict.push(`Q${q.n} one press`);
    await reload(page); await page.evaluate(() => window.scrollTo(0, 0));
  }
  console.log(`first-fold ${cfg} (${width} x ${vh}): ${verdict.join(", ") || "no question answered"}`);
}

// P2. Pressing every enabled control must change something. The page is reloaded before each press so one press cannot hide another.
const snap = (page) => page.evaluate(() => {
  const c = document.body.cloneNode(true);
  c.querySelectorAll('[role="tooltip"],[data-slot^="tooltip"],[data-radix-popper-content-wrapper],[data-sonner-toaster]').forEach((e) => e.remove());
  const html = c.innerHTML.replace(/ data-rc-i="\d+"/g, "").replace(/ (?:aria-describedby|data-popup-open|data-trigger-pressed|data-pressed|data-focus-visible|data-focused|data-hovered|data-highlighted)(?:="[^"]*")?/g, "")
    .replace(/ data-state="(?:delayed-open|instant-open)"/g, ' data-state="closed"');
  return {
    html, text: c.textContent, url: location.href, theme: document.documentElement.getAttribute("data-theme"), scroll: Math.round(scrollY),
    layers: document.querySelectorAll('[role="dialog"],[data-vaul-drawer],[role="menu"],[role="listbox"]').length,
    vals: [...document.querySelectorAll("input,textarea,select")].map((e) => (e.type === "checkbox" || e.type === "radio" ? e.checked : e.value)).join("\u0001"),
    toasts: [...document.querySelectorAll("[data-sonner-toast]")].map((e) => e.innerText.trim()),
  };
});
async function checkInert(page, cfg) {
  const first = await markControls(page);
  let pressed = 0;
  for (let i = 0; i < Math.min(first.length, 80); i++) {
    await reload(page);
    const names = await markControls(page);
    if (names.length !== first.length || names[i] !== first[i]) { fail(cfg, `inert: the list of controls changed between two loads of the same page (control ${i}: "${first[i]}" then "${names[i] ?? "missing"}"); a page that is not the same twice cannot be swept`); break; }
    const el = page.locator(`[data-rc-i="${i}"]`);
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(150);
    const a0 = await snap(page); await page.waitForTimeout(250); const a1 = await snap(page);
    const noisy = a0.html !== a1.html; // the page changes by itself (a clock, a live number): compare what a person reads, not the markup
    try { await el.click({ timeout: 3000 }); } catch (e) { fail(cfg, `inert: control "${names[i]}" could not be pressed (covered, or off the page): ${String(e.message).split("\n")[0].slice(0, 90)}`); continue; }
    await page.waitForTimeout(700);
    const b = await snap(page); pressed++;
    const newToasts = b.toasts.filter((t) => !a1.toasts.includes(t));
    const changed = ["text", "url", "theme", "scroll", "layers", "vals"].some((k) => a1[k] !== b[k]) || (!noisy && a1.html !== b.html) || newToasts.length > 0;
    if (!changed) fail(cfg, `inert: pressing "${names[i]}" changed nothing (no text, markup, dialog, address, field or notice differed 700 ms after the press)`);
    else if (newToasts.length && !["text", "url", "theme", "scroll", "layers", "vals"].some((k) => a1[k] !== b[k]) && newToasts.every((t) => t.split(/\s+/).filter(Boolean).length < 3)) fail(cfg, `inert: pressing "${names[i]}" fired only the notice "${newToasts[0]}", which does not say what happened (three words or more)`);
    await page.keyboard.press("Escape");
  }
  console.log(`inert ${cfg}: ${pressed} of ${first.length} controls pressed`);
}

async function runProduct(browser) {
  const questions = readJob();
  const rc = spawnSync(process.execPath, [path.join(root, "scripts", "role-coverage.mjs")], { cwd: root, encoding: "utf8" });
  process.stdout.write(rc.stdout ?? ""); process.stderr.write(rc.stderr ?? "");
  if (rc.status !== 0) failures.push("[role-coverage] scripts/role-coverage.mjs failed (its lines are printed above)");
  runMotionSource();
  for (const width of [1440, 390]) {
    for (const scheme of ["light", "dark"]) {
      const cfg = `${width}-${scheme}`;
      const ctx = await browser.newContext({ viewport: { width, height: VH[width] }, colorScheme: scheme, deviceScaleFactor: 1, hasTouch: width < 500 });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") fail(cfg, `console error: ${m.text()}`); });
      page.on("pageerror", (e) => fail(cfg, `page error: ${e.message}`));
      page.on("requestfailed", (r) => fail(cfg, `request failed: ${r.url()} ${r.failure()?.errorText}`));
      page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400) fail(cfg, `HTTP ${r.status()} ${r.url()}`); });
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() => ({ sans: document.fonts.check('14px "Geist"'), mono: [...document.fonts].some((f) => f.family.includes("Geist Mono") && f.status === "loaded") }));
      if (!fonts.sans) fail(cfg, "Geist did not load");
      await page.waitForTimeout(1500);
      const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      if (theme !== scheme) fail(cfg, `expected data-theme=${scheme}, got ${theme}`);
      await page.screenshot({ path: path.join(shots, `page-${cfg}.png`), fullPage: true });
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) fail(cfg, `horizontal overflow: ${ov}px`);
      for (const s of (await smallText(page)).slice(0, 8)) fail(cfg, `text too small: ${s}`);
      await checkNested(page, cfg, "the page");
      await checkTextContrast(page, cfg, "page");
      if (questions) await checkFirstFold(page, cfg, questions, width);
      if (scheme === "light") await checkSpacing(page, cfg, width, fail);
      if (scheme === "light" && width === 1440) await checkLaptops(page, cfg, fail);
      if (scheme === "light") await checkInert(page, cfg);
      if (scheme === "light" && width === 1440) await checkAnswers(page, cfg, width, fail, reload);
      await ctx.close();
      console.log(status(cfg));
    }
  }
  for (const width of [1440, 390]) { // reduced motion: every control pressed once, nothing may still be moving
    const cfg = `${width}-reduced`;
    const ctx = await browser.newContext({ viewport: { width, height: VH[width] }, colorScheme: "light", reducedMotion: "reduce", hasTouch: width < 500 });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => fail(cfg, `page error: ${e.message}`));
    await page.goto(base, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1200);
    const names = await markControls(page);
    for (let i = 0; i < Math.min(names.length, 80); i++) {
      const el = page.locator(`[data-rc-i="${i}"]`);
      if (!(await el.count())) continue;
      await el.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(150);
      await page.mouse.move(0, 0); await page.waitForTimeout(100);
      await el.click({ timeout: 2500 }).catch(() => {});
      await stillMoving(page, cfg, `press ${names[i]}`);
      await page.keyboard.press("Escape"); await page.waitForTimeout(400);
      if (await page.locator('[role="dialog"],[data-vaul-drawer]').count()) { await page.keyboard.press("Escape"); await page.waitForTimeout(500); }
    }
    await ctx.close();
    console.log(status(cfg));
  }
}

if (benchMode) runMotionSource();
const browser = await chromium.launch({ headless: true, executablePath: chromePath });
try {
  if (!benchMode) await runProduct(browser);
  else for (const width of [1440, 390]) {
    for (const scheme of ["light", "dark"]) {
      const cfg = `${width}-${scheme}`;
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1, hasTouch: width < 500 });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") fail(cfg, `console error: ${m.text()}`); });
      page.on("pageerror", (e) => fail(cfg, `page error: ${e.message}`));
      page.on("requestfailed", (r) => fail(cfg, `request failed: ${r.url()} ${r.failure()?.errorText}`));
      page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400) fail(cfg, `HTTP ${r.status()} ${r.url()}`); });

      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() => ({
        sans: document.fonts.check('14px "Geist"') && [...document.fonts].some((f) => f.family.includes("Geist") && !f.family.includes("Mono") && f.status === "loaded"),
        mono: [...document.fonts].some((f) => f.family.includes("Geist Mono") && f.status === "loaded"),
        body: getComputedStyle(document.body).fontFamily,
      }));
      if (!fonts.sans) fail(cfg, `Geist did not load (body font-family: ${fonts.body})`);
      if (!fonts.mono) fail(cfg, "Geist Mono did not load (no mono text on the page, or the file is missing)");
      await page.waitForTimeout(1500); // let the layout, the gantt scroll and the chart sizes settle

      const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      if (theme !== scheme) fail(cfg, `expected data-theme=${scheme}, got ${theme}`);

      await page.screenshot({ path: path.join(shots, `bench-${cfg}.png`), fullPage: true });

      const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (overflow.sw > overflow.cw) fail(cfg, `horizontal overflow: scrollWidth ${overflow.sw} > ${overflow.cw}`);

      const small = await smallText(page);
      for (const s of small.slice(0, 8)) fail(cfg, `text too small: ${s}`);

      await checkNested(page, cfg, "the bench");
      const cards = await checkInventory(page, cfg);
      await checkTextContrast(page, cfg, "bench", width >= 1024);
      await checkReach(page, cfg, cards);
      await checkSpecimens(page, cfg, width, cards);

      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
      const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow2 > 0) fail(cfg, `horizontal overflow after every specimen was used: ${overflow2}px`);
      await checkNested(page, cfg, "after use");
      await page.getByRole("button", { name: /Switch to/ }).click();
      await page.waitForTimeout(300);
      if ((await page.evaluate(() => document.documentElement.getAttribute("data-theme"))) === scheme) fail(cfg, "theme toggle did not change data-theme");
      await ctx.close();
      console.log(status(cfg));
    }
  }
  if (benchMode) for (const width of [1440, 390]) await checkReducedMotion(browser, width);
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\nrender-check FAILED with ${failures.length} problem(s)`);
  process.exit(1);
}
console.log(!benchMode ? `\nrender-check PASSED (product): role coverage, one source for motion values, the job's questions in the first fold at 1440 x 900 and 390 x 844, spacing S1 to S5 and S7 at both sizes, S6 at three laptop sizes, every control in the first screenful answers hover, press and focus, no inert control, 4 renders, 2 reduced-motion runs, pictures in ${shots}` : `\nrender-check PASSED: structure, motion source, 4 renders (1440/390 x light/dark) with keyboard reach and use of every specimen, and 2 reduced-motion runs (1440, 390), pictures in ${shots}`);
