"use strict";

/* Industry AI Suite — Live 10-tool client-side document review workbench.
   Zero canned replays, zero external requests by default (optional BYOK LLM uses sessionStorage only).
   Every finding cites exact [L##] line numbers and verbatim text from the user's uploaded/pasted document,
   and draft generation genuinely halts whenever required source evidence is missing. */

const BYOK_KEY = "ias.byok.session.v1";

const TOOLS = [
  {
    slug: "ledgerbridge",
    name: "LedgerBridge",
    category: "FINANCE OPERATIONS",
    description: "Reconcile ledger and bank rows line by line, surface exact cent/dollar variances, duplicates, and missing sides, and halt close memos when counterparty evidence is missing.",
    help: "Upload or paste a CSV/TSV ledger + bank export (columns: row_id, reference, side, amount_cents or amount, owner) or financial line items.",
    outcome: "Reconciles every parsed row by reference, calculates exact numeric variances, detects duplicates and missing sides, and cites [L##] verbatim for every exception.",
    haltRule: "Close-memo draft halts automatically if any reference is missing its ledger/bank counterparty, has unresolved variances, or lacks verifiable source row IDs.",
    boundary: "A finance owner must verify source export completeness and authorize any journal posting outside this workbench.",
    sampleName: "q3-close-sample.csv",
    sample: [
      "row_id,reference,side,amount_cents,owner",
      "L-101,INV-2026-401,ledger,125000,maya.chen",
      "B-101,INV-2026-401,bank,125000,maya.chen",
      "L-102,INV-2026-402,ledger,84250,tomas.ruiz",
      "B-102,INV-2026-402,bank,84000,tomas.ruiz",
      "L-103,INV-2026-403,ledger,41900,tomas.ruiz",
      "L-104,INV-2026-404,ledger,19500,priya.raman",
      "L-105,INV-2026-404,ledger,19500,priya.raman",
      "B-104,INV-2026-404,bank,19500,priya.raman"
    ].join("\n"),
    extraFields: []
  },
  {
    slug: "marketbrief",
    name: "MarketBrief",
    category: "RESEARCH",
    description: "Audit dated metrics and research claims for freshness, compute period deltas, flag uncited numbers, and halt analyst briefs when citations are missing.",
    help: "Upload or paste a Markdown memo, CSV time series, JSON report, or analyst notes containing dated observations and source links.",
    outcome: "Extracts dated observations and numeric figures line by line, checks staleness against your review cutoff, plots numeric series, and flags every uncited metric.",
    haltRule: "Analyst brief draft halts if zero verifiable source citations (URL, DOI, Source:, or Ref:) appear or if uncited numeric claims lack attribution.",
    boundary: "An analyst must verify release timing, primary source licensing, and conclusions. No trade or investment advice is produced.",
    sampleName: "macro-notes-sample.md",
    sample: [
      "# Q4 Sector Brief — Review Notes",
      "2023-12-31: Baseline regional index closed at 27,360.9B (Source: https://data.worldbank.org/indicator/NY.GDP.MKTP.CD).",
      "2024-12-31: Annual nominal output reached 29,184.9B (+6.67% YoY, Source: https://fred.stlouisfed.org/series/GDP).",
      "2025-12-31: Preliminary estimate printed 30,410.2B (+4.20% YoY, Source: BEA Table 1.1.5).",
      "2026-09-30: Internal margin forecast jumped to 18.4% without a linked workbook.",
      "2027-03-15: Projected capacity target 142.0 units (future-dated target)."
    ].join("\n"),
    extraFields: [
      { id: "opt-cutoff-date", label: "Review as-of date", type: "date", value: "2026-11-21", help: "Observations older than 2 years are flagged stale; dates after this cutoff are flagged future-dated." }
    ]
  },
  {
    slug: "chainwatch",
    name: "ChainWatch",
    category: "WATCH-ONLY REVIEW",
    description: "Evaluate watch-only address activity rates against supplied baselines, flag short sample windows and secret hygiene leaks, with zero wallet or RPC paths.",
    help: "Upload or paste CSV/log address observations (event_id, chain, address, rate_units_per_hour, baseline_units_per_hour, sample_hours, owner). Never paste private keys.",
    outcome: "Computes exact rate/baseline multiples against your alert threshold, marks sub-24h windows uncertain, and flags accidental key material.",
    haltRule: "Escalation summary halts unless operator authorization is checked and every flagged observation includes both baseline and sample-window evidence.",
    boundary: "Treasury must verify address ownership and source provenance before escalating. No signing, RPC, or transfer path exists here.",
    sampleName: "watch-observations-sample.csv",
    sample: [
      "event_id,chain,address,rate_units_per_hour,baseline_units_per_hour,sample_hours,owner",
      "EV-901,base,0x71C7656EC7ab88b098defB751B7401B5f6d8976F,14.5,12.0,48,sec.ops",
      "EV-902,base,0x2546BcD3c84621e976D8185a91A922aE77ECEc30,96.0,18.0,6,sec.ops",
      "EV-903,ethereum,0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,44.0,11.0,36,treasury"
    ].join("\n"),
    extraFields: [
      { id: "opt-threshold", label: "Alert multiple threshold", type: "number", value: "3.0", step: "0.1", help: "Trigger an alert when observed rate >= threshold x baseline." },
      { id: "opt-authorized", label: "I am authorized to review these watch-only observations locally.", type: "checkbox", checked: true }
    ]
  },
  {
    slug: "backtestguard",
    name: "BacktestGuard",
    category: "RESEARCH INTEGRITY",
    description: "Inspect strategy code, experiment configs, or time-series CSVs for look-ahead leakage, post-cutoff training contamination, reused holdouts, and missing fees.",
    help: "Upload or paste Python/Rust/TS backtest code, a JSON/YAML experiment record, or a dated CSV split.",
    outcome: "Scans every line for post-cutoff dates in train splits, look-ahead operators (.shift(-N), bfill, center=True, full-data fit_transform), and missing transaction costs.",
    haltRule: "Promotion-readiness draft halts whenever any chronology leak, look-ahead primitive, or missing timestamp/cutoff evidence is found.",
    boundary: "A researcher must still audit publication lag vs observation timestamp and out-of-sample selection bias.",
    sampleName: "strategy-check-sample.py",
    sample: [
      "# Experiment: momentum_v4 — decision_cutoff_year = 2024",
      "train_window = ('2020-01-01', '2025-06-30')  # extends past 2024 cutoff",
      "df['future_ret'] = df['close'].shift(-1) / df['close'] - 1",
      "df['vol_norm'] = scaler.fit_transform(df[['volume']])  # fit on full frame",
      "df['price_clean'] = df['price'].bfill()",
      "holdout_status = 'reused_2025_q1'",
      "fee_bps = 0  # transaction fees omitted"
    ].join("\n"),
    extraFields: [
      { id: "opt-cutoff-year", label: "Decision cutoff year", type: "number", value: "2024", step: "1", help: "Training dates after this year are flagged as chronology leakage." }
    ]
  },
  {
    slug: "replycraft",
    name: "ReplyCraft",
    category: "SUPPORT DRAFTING",
    description: "Match an incoming question strictly against your pasted/uploaded policy text and draft a verbatim [L##]-cited reply — halting cleanly if the policy doesn't cover it.",
    help: "Upload or paste approved policy/FAQ text below, enter the question to answer, and run. Replies never invent clauses outside the supplied text.",
    outcome: "Scores every source line against the question, surfaces verbatim matching policy clauses with [L##] tags, and drafts an editable reply without any send action.",
    haltRule: "Reply draft halts whenever zero policy lines substantiate the question or when the source document contains no verifiable policy/rule clauses.",
    boundary: "A support reviewer must verify customer eligibility, consent, and final wording before sending through an approved channel.",
    sampleName: "refund-policy-sample.md",
    sample: [
      "# Refund & Shipping Policy (Policy ID: POL-2026-08)",
      "Source: Approved Operations Handbook v2.4, effective 2026-09-01.",
      "1. Standard returns are accepted within 30 calendar days of delivery in original condition.",
      "2. Damaged-in-transit items qualify for a full refund or free replacement when photo proof is submitted within 7 days.",
      "3. Custom-fabricated or monogrammed orders are non-refundable once production starts.",
      "4. Approved refunds are issued to the original payment method within 5 business days of warehouse inspection."
    ].join("\n"),
    extraFields: [
      { id: "opt-question", label: "Customer / reviewer question to answer", type: "text", value: "How many days do I have to return a damaged item and how fast is the refund?", help: "Drafts are built strictly from matching lines in your source document; unmatched questions halt." }
    ]
  },
  {
    slug: "handoffhub",
    name: "HandoffHub",
    category: "KNOWLEDGE HANDOFF",
    description: "Extract structured sections, explicit owners, open action items, and query-matched excerpts from any runbook or knowledge doc with exact [L##] routing.",
    help: "Upload or paste an incident runbook, Markdown SOP, or project handoff notes, optionally filtered by topic.",
    outcome: "Identifies explicit owners (Owner:/Team:/@handle), open TODO/action lines, scope boundaries, and relevant [L##] excerpts.",
    haltRule: "Handoff summary halts if the document specifies no verifiable owner/team attribution or if your handoff topic matches zero source lines.",
    boundary: "A team lead must confirm access permissions and live on-call ownership before acting on a handoff.",
    sampleName: "deploy-runbook-sample.md",
    sample: [
      "# Billing Worker Failover Runbook",
      "Owner: @maya.chen (Team: Payments Platform)",
      "Scope: Read-only diagnostics first; failover requires two-person sign-off.",
      "## Symptoms",
      "- Queue lag exceeds 300s or dead-letter queue grows above 25 messages.",
      "## Recovery Actions",
      "- [ ] Action: Verify primary Postgres replication lag is under 500ms before promoting replica.",
      "- [ ] Action: Rotate stuck worker lease via billing-ctl lease-reset --dry-run first.",
      "Escalation: Page @tomas.ruiz if checksum mismatch appears in reconciliation ledger."
    ].join("\n"),
    extraFields: [
      { id: "opt-topic", label: "Handoff topic / filter (optional)", type: "text", value: "failover", help: "Leave blank to summarize the whole document, or enter a topic to require matching excerpts." }
    ]
  },
  {
    slug: "sentineldesk",
    name: "SentinelDesk",
    category: "SECURITY TRIAGE",
    description: "Run deterministic static security, secret-leak, CVE, and error-log triage on any code, config, .env, or incident log with line-pinned severity receipts.",
    help: "Upload or paste any .py, .ts, .js, .rs, .json, .env, .yaml, .toml, or .log file.",
    outcome: "Scans every line for leaked secrets/keys, dangerous sinks (eval/exec/shell=True/innerHTML/unsafe), SQL interpolation, disabled TLS, CVEs, and 5xx/auth failure spikes.",
    haltRule: "Security-clearance summary halts automatically whenever any HIGH-severity finding is open or when incident logs omit timestamps/identifiers.",
    boundary: "A security engineer must validate exploitability against real host/network boundaries before taking containment action.",
    sampleName: "service-audit-sample.py",
    sample: [
      "# api_gateway.py — pre-release security scan sample",
      "import os, subprocess, requests",
      "API_TOKEN = 'sk-live-94810a8c77f200192837465511223344'",
      "def run_diag(host):",
      "    return subprocess.check_output(f'ping -c 1 {host}', shell=True)",
      "def fetch_partner(url):",
      "    return requests.get(url, verify=False, timeout=5)",
      "CORS_ALLOW_ORIGIN = '*'",
      "# Incident note: upstream flagged CVE-2026-21409 (HTTP 502 spike at 2026-11-20T14:22Z)"
    ].join("\n"),
    extraFields: []
  },
  {
    slug: "searchlift",
    name: "SearchLift",
    category: "CONTENT AUDIT",
    description: "Audit real HTML or Markdown pages offline for missing titles, meta descriptions, heading-order skips, missing image alt text, and generic/empty links.",
    help: "Upload or paste any .html or .md document to inspect its exact structural accessibility and content hygiene.",
    outcome: "Inspects document metadata, H1 uniqueness, heading hierarchy, image alt coverage, link hygiene, and word density — pinning every issue to its exact [L##] line.",
    haltRule: "Publication sign-off draft halts if high-priority structural issues (missing title/H1, missing image alt, or empty links) remain unresolved.",
    boundary: "An editor decides copy changes and approves publication separately. Rankings and traffic are never guessed.",
    sampleName: "landing-audit-sample.html",
    sample: [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head><title>Home</title></head>",
      "<body>",
      "  <h1>Platform Overview</h1>",
      "  <h3>Architecture Details</h3>",
      "  <p>Read the <a href=\"#\">click here</a> specification.</p>",
      "  <img src=\"diagram.png\">",
      "</body>",
      "</html>"
    ].join("\n"),
    extraFields: []
  },
  {
    slug: "pipelinerelay",
    name: "PipelineRelay",
    category: "COMPLIANCE & REPO HANDOFF",
    description: "Inspect package.json, Cargo.toml, LICENSE, or account handoff files for identity, license/SPDX terms, unpinned dependencies, PII leaks, and consent proof.",
    help: "Upload or paste a manifest (package.json, Cargo.toml, pyproject.toml), README.md, or de-identified account handoff note.",
    outcome: "Extracts package/account identity, SPDX license signals, wildcard/unpinned dependencies, accidental PII (emails/phones), and explicit consent records with [L##] citations.",
    haltRule: "Handoff approval draft halts if license/identity or explicit consent/authorization evidence is absent, or if raw PII appears in a de-identified handoff.",
    boundary: "An owner must confirm legal/license terms and customer consent before external sharing or outreach.",
    sampleName: "package-handoff-sample.json",
    sample: [
      "{",
      "  \"name\": \"acme-analytics-worker\",",
      "  \"version\": \"1.4.2\",",
      "  \"license\": \"MIT\",",
      "  \"consent_record\": \"CONSENT-2026-114 (verified: true)\",",
      "  \"dependencies\": {",
      "    \"zod\": \"^3.23.8\",",
      "    \"legacy-csv\": \"*\"",
      "  },",
      "  \"contact_note\": \"escalate to ops-lead@example.com for schema changes\"",
      "}"
    ].join("\n"),
    extraFields: []
  },
  {
    slug: "onboardpath",
    name: "OnboardPath",
    category: "POLICY & CONTRACT REVIEW",
    description: "Parse policies, contracts, handbooks, or SOPs to extract obligations (must/shall/within N days), risky clauses, authority metadata, and a cited reviewer checklist.",
    help: "Upload or paste any contract, handbook section, compliance policy, or onboarding SOP.",
    outcome: "Extracts mandatory obligations, deadlines, role scopes, high-risk contract clauses (auto-renewal, unilateral changes, indemnity), and compiles a [L##]-cited checklist.",
    haltRule: "Employee/vendor guidance draft halts if the document lacks policy authority/effective-date metadata or contains zero verifiable obligation clauses.",
    boundary: "HR or legal counsel must confirm policy authority and jurisdiction before issuing binding guidance.",
    sampleName: "vendor-policy-sample.md",
    sample: [
      "# Security & Equipment Onboarding Policy",
      "Policy Authority: Approved by Operations & Security · Effective: 2026-10-01",
      "Applies to: All engineering and operations staff.",
      "1. Staff must complete hardware key enrollment within 3 business days of start date.",
      "2. Production credentials shall never be stored in plaintext files or personal cloud drives.",
      "3. Vendor agreements automatically renew for 12 months unless terminated in writing 30 days prior.",
      "4. Any suspected credential exposure must be reported to Security within 2 hours."
    ].join("\n"),
    extraFields: []
  }
];

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = String(text);
  return n;
};

let currentTool = TOOLS[0];
let currentFileName = "";
let lastReport = null;

function tagLine(n) {
  return `[L${String(n).padStart(2, "0")}]`;
}

function splitLines(text) {
  const rawLines = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  return rawLines.map((raw, idx) => ({
    num: idx + 1,
    tag: tagLine(idx + 1),
    raw,
    trimmed: raw.trim()
  }));
}

async function sha256Hex(text) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const data = new TextEncoder().encode(text);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {}
  let h1 = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h1 ^= text.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
  }
  return ("fnv1a-" + (h1 >>> 0).toString(16).padStart(8, "0"));
}

function parseCsvLine(line, sep) {
  const cells = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === sep && !quoted) {
      cells.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
}

function parseTable(lines) {
  const nonEmpty = lines.filter((l) => l.trimmed.length > 0 && !l.trimmed.startsWith("#"));
  if (nonEmpty.length < 2) return null;
  const first = nonEmpty[0].trimmed;
  const sep = first.includes("\t") ? "\t" : first.includes("|") ? "|" : first.includes(",") ? "," : null;
  if (!sep) return null;
  const headerRaw = parseCsvLine(first, sep).map((h) => h.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_|_$/g, ""));
  if (headerRaw.length < 2) return null;
  const rows = [];
  for (let i = 1; i < nonEmpty.length; i++) {
    const l = nonEmpty[i];
    if (/^[\s|:-]+$/.test(l.trimmed)) continue;
    const vals = parseCsvLine(l.trimmed, sep);
    if (vals.length < 2) continue;
    const obj = {};
    headerRaw.forEach((k, idx) => { obj[k] = vals[idx] ?? ""; });
    rows.push({ line: l, values: obj });
  }
  return { sep, header: headerRaw, headerLine: nonEmpty[0], rows };
}

function parseMoneyCents(val) {
  if (val === undefined || val === null) return null;
  const s = String(val).trim();
  if (!s) return null;
  if (/^-?\d+$/.test(s)) return Number(s);
  const cleaned = s.replace(/[$,\s]/g, "");
  if (/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return Math.round(Number(cleaned) * 100);
  return null;
}

function fmtCents(c) {
  const sign = c < 0 ? "-" : "";
  const abs = Math.abs(c);
  return `${sign}$${(abs / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function stopWords() {
  return new Set([
    "the","and","for","with","that","this","from","have","will","what","when","where","which","how",
    "many","much","does","are","was","were","your","their","into","about","than","then","also","only",
    "been","being","must","shall","should","could","would","there","here","they","them","some","such",
    "each","more","most","very","just","over","under","after","before","between","within"
  ]);
}

function tokenize(str) {
  const sw = stopWords();
  return (String(str || "").toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g) || []).filter((w) => !sw.has(w));
}

function addGenericCoverageFindings(lines, findings, label) {
  const nonEmpty = lines.filter((l) => l.trimmed.length > 0);
  if (!findings.length && nonEmpty.length) {
    nonEmpty.slice(0, 6).forEach((l) => {
      findings.push({
        severity: "info",
        rule: `${label}-LINE`,
        title: `Inspected source line ${l.tag}`,
        detail: `No structured ${label.toLowerCase()} exception pattern matched this line; retained verbatim for human verification.`,
        lines: [l.num],
        quote: l.raw
      });
    });
  }
}

/* ============================================================================
   10 REAL DETERMINISTIC CLIENT-SIDE ANALYZERS
   ============================================================================ */

function analyzeLedgerBridge(lines) {
  const table = parseTable(lines);
  const findings = [];
  const haltReasons = [];
  let totalRows = 0;
  let matchedRefs = 0;
  let exceptionCount = 0;
  let totalVarianceCents = 0;
  const matchedSummary = [];

  if (table && table.rows.length > 0 && table.header.some((h) => /ref|inv|id|account|item/.test(h)) && table.header.some((h) => /amount|total|cents|usd|debit|credit/.test(h))) {
    totalRows = table.rows.length;
    const refKey = table.header.find((h) => /ref|inv|tx|doc/.test(h)) || table.header[0];
    const sideKey = table.header.find((h) => /side|source|book|type/.test(h));
    const amtKey = table.header.find((h) => /amount_cents|cents|amount|total|usd|value/.test(h));
    const isCentsCol = /cents/.test(amtKey || "");
    const ownerKey = table.header.find((h) => /owner|reviewer|team|dept/.test(h));
    const idKey = table.header.find((h) => /row_id|^id$/.test(h));

    const groups = new Map();
    for (const r of table.rows) {
      const ref = (r.values[refKey] || "").trim() || `(missing-ref@${r.line.tag})`;
      const sideRaw = sideKey ? (r.values[sideKey] || "").toLowerCase().trim() : "";
      const side = /bank|stmt|statement|credit/.test(sideRaw) ? "bank" : /ledger|book|gl|debit/.test(sideRaw) ? "ledger" : sideRaw || "unlabeled";
      const rawAmt = r.values[amtKey];
      let cents = null;
      if (isCentsCol && /^-?\d+$/.test(String(rawAmt || "").trim())) cents = Number(rawAmt);
      else cents = parseMoneyCents(rawAmt);
      if (cents === null) {
        exceptionCount++;
        findings.push({
          severity: "high",
          rule: "LB-PARSE-AMT",
          title: `Unparseable amount for ${ref}`,
          detail: `Column "${amtKey}" value "${rawAmt || "(empty)"}" could not be parsed as a valid currency amount.`,
          lines: [r.line.num],
          quote: r.line.raw
        });
        continue;
      }
      if (!groups.has(ref)) groups.set(ref, []);
      groups.get(ref).push({ ...r, ref, side, cents, owner: ownerKey ? r.values[ownerKey] : "", rowId: idKey ? r.values[idKey] : "" });
    }

    if (!sideKey) {
      haltReasons.push(`Missing counterparty column (expected side/source/book with ledger & bank rows) in header ${table.headerLine.tag}.`);
    }

    for (const [ref, items] of groups.entries()) {
      const ledgerItems = items.filter((x) => x.side === "ledger");
      const bankItems = items.filter((x) => x.side === "bank");
      const lineNums = items.map((x) => x.line.num);
      const quote = items.map((x) => `${x.line.tag} ${x.line.raw}`).join("\n");

      if (ledgerItems.length > 1 || bankItems.length > 1) {
        exceptionCount++;
        findings.push({
          severity: "high",
          rule: "LB-DUP-SIDE",
          title: `Duplicate side rows for ${ref}`,
          detail: `Found ${ledgerItems.length} ledger row(s) and ${bankItems.length} bank row(s) under ${ref}. Reviewer must deduplicate before posting.`,
          lines: lineNums,
          quote
        });
      }
      if (ledgerItems.length === 0 || bankItems.length === 0) {
        exceptionCount++;
        const missing = ledgerItems.length === 0 ? "ledger" : "bank";
        findings.push({
          severity: "high",
          rule: "LB-MISSING-SIDE",
          title: `Missing ${missing} counterparty for ${ref}`,
          detail: `Only ${items.map((x) => x.side).join(", ")} side present (${fmtCents(items[0].cents)}). Cannot reconcile single-sided entry.`,
          lines: lineNums,
          quote
        });
        continue;
      }
      const lSum = ledgerItems.reduce((a, b) => a + b.cents, 0);
      const bSum = bankItems.reduce((a, b) => a + b.cents, 0);
      const diff = lSum - bSum;
      if (diff !== 0) {
        exceptionCount++;
        totalVarianceCents += Math.abs(diff);
        findings.push({
          severity: "high",
          rule: "LB-VARIANCE",
          title: `Variance of ${fmtCents(diff)} on ${ref}`,
          detail: `Ledger total ${fmtCents(lSum)} vs bank total ${fmtCents(bSum)} (delta ${fmtCents(diff)}). Owner: ${items[0].owner || "unassigned"}.`,
          lines: lineNums,
          quote
        });
      } else if (ledgerItems.length === 1 && bankItems.length === 1) {
        matchedRefs++;
        matchedSummary.push(`- ${ref}: matched at ${fmtCents(lSum)} (${items.map((x) => x.line.tag).join(", ")})`);
        findings.push({
          severity: "pass",
          rule: "LB-MATCH",
          title: `Matched ${ref} at ${fmtCents(lSum)}`,
          detail: `Ledger and bank amounts agree exactly; owner ${items[0].owner || "unassigned"}.`,
          lines: lineNums,
          quote
        });
      }
    }

    if (exceptionCount > 0) {
      haltReasons.push(`${exceptionCount} reconciliation exception(s) (missing counterparty, duplicate side, or variance totaling ${fmtCents(totalVarianceCents)}) require human resolution before generating a close-signoff memo.`);
    }
    if (matchedRefs === 0) {
      haltReasons.push("Zero cleanly matched ledger/bank pairs were verified.");
    }
  } else {
    // Non-CSV / custom text line-by-line financial audit
    const nonEmpty = lines.filter((l) => l.trimmed.length > 0);
    totalRows = nonEmpty.length;
    let sourcedLines = 0;
    for (const l of nonEmpty) {
      const hasAmount = /\$[\d,]+(?:\.\d{1,2})?|\b\d{1,3}(?:,\d{3})+(?:\.\d{2})?\b|\b\d+\.\d{2}\b/.test(l.raw);
      const hasRef = /\b(?:INV|TX|REF|PO|ACCT|CHK|LEDGER|BANK)[-_#]?[A-Z0-9-]+\b/i.test(l.raw);
      if (hasAmount && hasRef) {
        sourcedLines++;
        findings.push({
          severity: "medium",
          rule: "LB-UNPAIRED-TEXT",
          title: `Referenced amount found without paired counterparty table`,
          detail: `Detected financial figure with identifier on ${l.tag}, but no structured ledger+bank counterparty column was supplied to verify settlement.`,
          lines: [l.num],
          quote: l.raw
        });
      } else if (hasAmount) {
        exceptionCount++;
        findings.push({
          severity: "high",
          rule: "LB-UNCITED-AMT",
          title: `Uncited financial figure on ${l.tag}`,
          detail: `Line contains a monetary amount without an invoice/reference ID or bank counterparty record.`,
          lines: [l.num],
          quote: l.raw
        });
      } else {
        findings.push({
          severity: "info",
          rule: "LB-NOTE",
          title: `Unstructured note on ${l.tag}`,
          detail: `Line carries no paired ledger/bank columns; retained verbatim for reviewer context.`,
          lines: [l.num],
          quote: l.raw
        });
      }
    }
    haltReasons.push("Missing structured two-sided ledger & bank export (need paired ledger/bank rows with matching references).");
    if (sourcedLines === 0) {
      haltReasons.push("No verifiable invoice/transaction reference IDs paired with amounts were found.");
    }
  }

  const draftHalted = haltReasons.length > 0;
  const draftText = draftHalted
    ? null
    : [
        `Close Reconciliation Draft (grounded strictly in supplied lines):`,
        `Verified ${matchedRefs} matched reference(s) across ${totalRows} source rows with $0.00 unresolved variance.`,
        ...matchedSummary,
        `Human action required: Confirm export completeness and sign off before ledger posting.`
      ].join("\n");

  return {
    summary: draftHalted
      ? `Audited ${totalRows} row(s): found ${exceptionCount} exception(s) and halted close-memo drafting until missing/mismatched evidence is resolved.`
      : `Reconciled ${matchedRefs} reference(s) across ${totalRows} rows with zero variances; close-memo draft ready for human approval.`,
    metrics: [
      ["Source rows", totalRows],
      ["Matched refs", matchedRefs],
      ["Exceptions", exceptionCount],
      ["Total variance", fmtCents(totalVarianceCents)]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText,
    humanDecision: "Confirm source export authority and resolve all exception rows before posting any journal entry."
  };
}

function analyzeMarketBrief(lines) {
  const cutoffStr = $("opt-cutoff-date")?.value || "2026-11-21";
  const cutoffDate = new Date(cutoffStr + "T00:00:00Z");
  const staleThresholdMs = 730 * 86400 * 1000;
  const findings = [];
  const haltReasons = [];
  const series = [];
  const citedLines = [];
  let datedCount = 0;
  let citedCount = 0;
  let uncitedMetricCount = 0;

  for (const l of lines) {
    if (!l.trimmed) continue;
    const isoMatch = l.raw.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    const yearMatch = !isoMatch ? l.raw.match(/\b(19\d{2}|20\d{2})\b/) : null;
    const hasCitation = /https?:\/\/\S+|\bsource\s*:|\bref\s*:|\bdoi\s*:|\btable\s+\d|\bbea\b|\bsec\s+10-[kq]\b|\bfred\b|\bworld\s+bank\b/i.test(l.raw);
    const numMatch = l.raw.match(/[$€£]?\s*-?\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:%|B|M|K|T|bps)?\b/g);
    const meaningfulNums = (numMatch || []).filter((m) => !/^(?:19|20)\d{2}$/.test(m.trim()));

    if (hasCitation) citedCount++;
    if (isoMatch || yearMatch) {
      datedCount++;
      const d = isoMatch ? new Date(isoMatch[1] + "T00:00:00Z") : new Date(`${yearMatch[1]}-12-31T00:00:00Z`);
      const label = isoMatch ? isoMatch[1] : yearMatch[1];
      if (!Number.isNaN(d.getTime()) && !Number.isNaN(cutoffDate.getTime())) {
        if (d.getTime() > cutoffDate.getTime()) {
          findings.push({
            severity: "high",
            rule: "MB-FUTURE-DATE",
            title: `Future-dated observation (${label}) on ${l.tag}`,
            detail: `Date ${label} falls after review cutoff ${cutoffStr}; cannot be cited as realized historical fact.`,
            lines: [l.num],
            quote: l.raw
          });
        } else if (cutoffDate.getTime() - d.getTime() > staleThresholdMs) {
          findings.push({
            severity: "medium",
            rule: "MB-STALE-DATE",
            title: `Stale observation (${label}) on ${l.tag}`,
            detail: `Date ${label} is more than 24 months older than cutoff ${cutoffStr}. Verify whether a newer release exists.`,
            lines: [l.num],
            quote: l.raw
          });
        }
      }
      if (meaningfulNums.length) {
        const cleaned = Number(meaningfulNums[0].replace(/[^0-9.-]/g, ""));
        if (Number.isFinite(cleaned)) series.push({ label: label.slice(0, 10), value: Math.abs(cleaned) });
      }
    }

    if (meaningfulNums.length && !hasCitation) {
      uncitedMetricCount++;
      findings.push({
        severity: "high",
        rule: "MB-UNCITED-METRIC",
        title: `Uncited numeric claim (${meaningfulNums[0].trim()}) on ${l.tag}`,
        detail: `Line asserts a quantitative value without an explicit source URL, table ID, or Source:/Ref: citation.`,
        lines: [l.num],
        quote: l.raw
      });
    } else if (meaningfulNums.length && hasCitation) {
      citedLines.push(`- ${l.tag} ${l.trimmed}`);
      findings.push({
        severity: "pass",
        rule: "MB-CITED-OBS",
        title: `Source-cited metric on ${l.tag}`,
        detail: `Quantitative observation includes explicit source attribution.`,
        lines: [l.num],
        quote: l.raw
      });
    }
  }

  addGenericCoverageFindings(lines, findings, "MB");
  if (citedCount === 0) haltReasons.push("Zero verifiable source citations (URL, DOI, Source:, Table, or filing ID) found in document.");
  if (uncitedMetricCount > 0) haltReasons.push(`${uncitedMetricCount} numeric claim(s) lack explicit source citations — uncited numbers cannot enter a published analyst brief.`);
  if (datedCount === 0) haltReasons.push("No observation dates found; freshness cannot be verified.");

  const draftHalted = haltReasons.length > 0;
  let deltaDisplay = "N/A";
  if (series.length >= 2 && series[series.length - 2].value > 0) {
    const pct = ((series[series.length - 1].value - series[series.length - 2].value) / series[series.length - 2].value) * 100;
    deltaDisplay = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  }

  return {
    summary: draftHalted
      ? `Scanned ${lines.filter((l) => l.trimmed).length} line(s): ${uncitedMetricCount} uncited metric(s) / missing evidence halted brief generation.`
      : `Verified ${citedCount} source-cited line(s) across ${datedCount} dated observations (latest delta ${deltaDisplay}).`,
    metrics: [
      ["Dated lines", datedCount],
      ["Cited lines", citedCount],
      ["Uncited metrics", uncitedMetricCount],
      ["Latest delta", deltaDisplay]
    ],
    findings,
    series: series.length >= 2 ? series.slice(0, 12) : null,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Source-Cited Analyst Observation Draft (as of ${cutoffStr}):`,
      ...citedLines,
      `Human review required: Confirm primary release timestamps before external distribution.`
    ].join("\n"),
    humanDecision: "Confirm source publication timing and primary data rights before sharing any research summary."
  };
}

function analyzeChainWatch(lines) {
  const threshold = Math.max(1.0, Number($("opt-threshold")?.value || 3.0));
  const authorized = Boolean($("opt-authorized")?.checked);
  const findings = [];
  const haltReasons = [];
  const table = parseTable(lines);
  let obsCount = 0;
  let alertCount = 0;
  let uncertainCount = 0;
  let secretLeak = false;
  const alertLines = [];

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (/\b0x[a-fA-F0-9]{64}\b|BEGIN\s+PRIVATE\s+KEY|mnemonic|seed\s*phrase/i.test(l.raw)) {
      secretLeak = true;
      findings.push({
        severity: "high",
        rule: "CW-SECRET-HYGIENE",
        title: `Possible private key or seed material on ${l.tag}`,
        detail: `Watch-only review forbids private keys or mnemonics. Remove secret material immediately and rotate if exposed.`,
        lines: [l.num],
        quote: l.raw.replace(/0x[a-fA-F0-9]{64}/g, "0x[REDACTED_64_HEX]")
      });
    }
  }

  if (table && table.rows.length > 0 && table.header.some((h) => /rate|observed/.test(h)) && table.header.some((h) => /baseline/.test(h))) {
    const idKey = table.header.find((h) => /event|id/.test(h)) || table.header[0];
    const addrKey = table.header.find((h) => /address|addr|wallet/.test(h));
    const rateKey = table.header.find((h) => /rate|observed/.test(h));
    const baseKey = table.header.find((h) => /baseline/.test(h));
    const hrsKey = table.header.find((h) => /hour|window|sample/.test(h));

    for (const r of table.rows) {
      obsCount++;
      const rate = Number(r.values[rateKey]);
      const base = Number(r.values[baseKey]);
      const hrs = hrsKey ? Number(r.values[hrsKey]) : NaN;
      const evId = r.values[idKey] || r.line.tag;
      const addr = addrKey ? r.values[addrKey] : "(no address)";

      if (!Number.isFinite(rate) || !Number.isFinite(base) || base <= 0) {
        findings.push({
          severity: "high",
          rule: "CW-BAD-BASELINE",
          title: `Missing or zero baseline for ${evId}`,
          detail: `Cannot compute threshold multiple without positive numeric observed rate and baseline.`,
          lines: [r.line.num],
          quote: r.line.raw
        });
        haltReasons.push(`Invalid or missing baseline on ${r.line.tag}.`);
        continue;
      }

      const mult = rate / base;
      const shortWin = !Number.isFinite(hrs) || hrs < 24;
      if (shortWin) uncertainCount++;

      if (mult >= threshold) {
        alertCount++;
        alertLines.push(`- ${evId} (${addr}): ${mult.toFixed(2)}x baseline (${rate}/${base}), window ${Number.isFinite(hrs) ? hrs + "h" : "unspecified"} ${r.line.tag}`);
        findings.push({
          severity: "high",
          rule: "CW-BREACH",
          title: `${evId}: ${mult.toFixed(2)}x baseline (threshold ${threshold.toFixed(1)}x)`,
          detail: `Address ${addr} observed at ${rate} vs ${base} baseline. ${shortWin ? "Sample window < 24h — marked uncertain." : `Sample window ${hrs}h.`}`,
          lines: [r.line.num],
          quote: r.line.raw
        });
      } else {
        findings.push({
          severity: "pass",
          rule: "CW-NORMAL",
          title: `${evId}: ${mult.toFixed(2)}x baseline (below ${threshold.toFixed(1)}x)`,
          detail: `Within configured threshold${shortWin ? " (short window < 24h; monitor for stability)" : ""}.`,
          lines: [r.line.num],
          quote: r.line.raw
        });
      }
    }
  } else {
    const addrLines = lines.filter((l) => /0x[a-fA-F0-9]{40}\b/.test(l.raw));
    obsCount = addrLines.length;
    addrLines.forEach((l) => {
      findings.push({
        severity: "medium",
        rule: "CW-NO-BASELINE",
        title: `Address found without rate/baseline columns on ${l.tag}`,
        detail: `Supply observed rate, baseline, and sample_hours columns to evaluate threshold breaches.`,
        lines: [l.num],
        quote: l.raw
      });
    });
    addGenericCoverageFindings(lines, findings, "CW");
    haltReasons.push("Missing structured rate + baseline + sample-window observations.");
  }

  if (!authorized) haltReasons.push("Operator authorization checkbox is unchecked — escalation drafting is blocked.");
  if (secretLeak) haltReasons.push("Potential private key / seed phrase detected in input — scrub before generating any handoff.");

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Checked ${obsCount} observation(s): ${alertCount} breach(es); escalation draft halted due to missing authorization, baseline, or secret hygiene block.`
      : `Checked ${obsCount} watch-only observation(s) against ${threshold.toFixed(1)}x threshold: ${alertCount} alert(s), ${uncertainCount} short-window uncertain.`,
    metrics: [
      ["Observations", obsCount],
      ["Breach alerts", alertCount],
      ["Short-window (<24h)", uncertainCount],
      ["Threshold", `${threshold.toFixed(1)}x`]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Watch-Only Escalation Review Draft (threshold ${threshold.toFixed(1)}x, zero signing/RPC):`,
      ...(alertLines.length ? alertLines : ["- No observations breached the configured multiple threshold."]),
      `Human review required: Verify address ownership and window provenance prior to any operational action.`
    ].join("\n"),
    humanDecision: "Verify address ownership and observation source window before escalating. No chain write or transfer is possible."
  };
}

function analyzeBacktestGuard(lines) {
  const cutoffYear = Number($("opt-cutoff-year")?.value || 2024);
  const findings = [];
  const haltReasons = [];
  let leakCount = 0;
  let warningCount = 0;
  let timestampCount = 0;
  let feeMentioned = false;
  let feeZero = false;

  const leakRules = [
    { re: /\.shift\(\s*-\d+/i, rule: "BG-SHIFT-NEG", title: "Negative shift look-ahead (.shift(-N))", detail: "Reading future rows into the current feature bar introduces direct look-ahead leakage." },
    { re: /\bbfill\b|method\s*=\s*['"]bfill['"]|backfill/i, rule: "BG-BFILL", title: "Backward-fill look-ahead (bfill)", detail: "Filling missing historical values from future observations leaks future state." },
    { re: /center\s*=\s*True/i, rule: "BG-CENTERED-WINDOW", title: "Centered rolling window (center=True)", detail: "Centered rolling windows consume future bars beyond the decision timestamp." },
    { re: /\.fit_transform\(/i, rule: "BG-FULL-FIT", title: "Scaler/encoder fit_transform check", detail: "Verify scaler/encoder is fit strictly inside the training fold, never across the full dataset." },
    { re: /holdout[^\n]*(?:reused|shared|tuned|iterat)/i, rule: "BG-REUSED-HOLDOUT", title: "Reused holdout set detected", detail: "Evaluating multiple iterations on a reused holdout invalidates out-of-sample statistics." }
  ];

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (/\b(?:fee|commission|slippage|cost|bps)\b/i.test(l.raw)) {
      feeMentioned = true;
      if (/(?:fee|commission|slippage)[a-z_]*\s*[:=]\s*0(?:\.0+)?\b/i.test(l.raw)) {
        feeZero = true;
        warningCount++;
        findings.push({
          severity: "medium",
          rule: "BG-ZERO-FEES",
          title: `Zero transaction cost / fee on ${l.tag}`,
          detail: `Explicitly zeroing fees overstates strategy return. Model realistic venue fees and spread.`,
          lines: [l.num],
          quote: l.raw
        });
      }
    }

    const dates = l.raw.match(/\b(20\d{2})(?:-\d{2}-\d{2})?\b/g) || [];
    if (dates.length) {
      timestampCount++;
      const isTrainCtx = /train|fit|in_sample|feature|calib/i.test(l.raw) && !/holdout|test|oos/i.test(l.raw);
      for (const ds of dates) {
        const yr = Number(ds.slice(0, 4));
        if (yr > cutoffYear && (isTrainCtx || !/holdout|oos|target|cutoff/i.test(l.raw))) {
          leakCount++;
          findings.push({
            severity: "high",
            rule: "BG-POST-CUTOFF",
            title: `Post-cutoff date (${ds} > ${cutoffYear}) on ${l.tag}`,
            detail: `Observation or window extends past decision cutoff year ${cutoffYear}; verify this is strictly excluded from training and parameter selection.`,
            lines: [l.num],
            quote: l.raw
          });
          break;
        }
      }
    }

    for (const r of leakRules) {
      if (r.re.test(l.raw)) {
        leakCount++;
        findings.push({
          severity: "high",
          rule: r.rule,
          title: `${r.title} on ${l.tag}`,
          detail: r.detail,
          lines: [l.num],
          quote: l.raw
        });
      }
    }
  }

  addGenericCoverageFindings(lines, findings, "BG");
  if (leakCount > 0) haltReasons.push(`${leakCount} chronology / look-ahead leakage violation(s) block promotion sign-off.`);
  if (timestampCount === 0) haltReasons.push("No date or chronology metadata found in the submitted experiment artifact.");
  if (!feeMentioned || feeZero) haltReasons.push("Realistic transaction fees/slippage are missing or explicitly set to 0.");

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Chronology audit blocked sign-off: ${leakCount} leakage violation(s) and ${warningCount} cost/integrity warning(s) relative to cutoff ${cutoffYear}.`
      : `No look-ahead patterns or post-${cutoffYear} training contamination detected across ${timestampCount} dated line(s).`,
    metrics: [
      ["Cutoff year", cutoffYear],
      ["Leakage flags", leakCount],
      ["Dated lines", timestampCount],
      ["Fees modeled", feeMentioned && !feeZero ? "Yes" : "No"]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Backtest Integrity Gate Summary (cutoff ${cutoffYear}):`,
      `- Inspected ${lines.filter((l) => l.trimmed).length} source lines across ${timestampCount} dated reference(s).`,
      `- Zero look-ahead primitives (.shift(-N), bfill, centered rolling windows) or post-cutoff training dates detected.`,
      `- Fee/slippage accounting present.`,
      `Human review required: Confirm point-in-time release lag vs observation date before out-of-sample sign-off.`
    ].join("\n"),
    humanDecision: "Verify point-in-time data release dates (not just observation periods) and selection history before approving any test."
  };
}

function analyzeReplyCraft(lines) {
  const question = ($("opt-question")?.value || "").trim();
  const qTokens = tokenize(question);
  const findings = [];
  const haltReasons = [];
  const matched = [];
  let hasSourceHeader = false;

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (/source\s*:|policy\s*id|effective\s*:|handbook|section\s+\d|rule\s+\d/i.test(l.raw)) {
      hasSourceHeader = true;
    }
    const lTokens = new Set(tokenize(l.raw));
    const overlap = qTokens.filter((t) => lTokens.has(t));
    if (overlap.length > 0) {
      matched.push({ line: l, score: overlap.length, overlap });
    }
  }

  matched.sort((a, b) => b.score - a.score || a.line.num - b.line.num);
  const top = matched.slice(0, 5);

  if (!question) {
    haltReasons.push("No question supplied — enter the question you need answered from the source document.");
  }
  if (top.length === 0) {
    haltReasons.push(`Zero lines in the uploaded/pasted source document match the question ("${question || "empty"}"). Draft halted rather than inventing an unsupported answer.`);
    lines.filter((l) => l.trimmed).slice(0, 5).forEach((l) => {
      findings.push({
        severity: "medium",
        rule: "RC-NO-MATCH",
        title: `Unmatched source line ${l.tag}`,
        detail: `Line shares 0 domain keywords with the question; cannot be cited as supporting evidence.`,
        lines: [l.num],
        quote: l.raw
      });
    });
  } else {
    top.forEach((m) => {
      findings.push({
        severity: "pass",
        rule: "RC-CITED-CLAUSE",
        title: `Matched ${m.score} term(s) on ${m.line.tag}: ${m.overlap.join(", ")}`,
        detail: `Substantiates the question verbatim from the supplied source document.`,
        lines: [m.line.num],
        quote: m.line.raw
      });
    });
  }

  if (!hasSourceHeader) {
    haltReasons.push("Document lacks explicit policy/source provenance metadata (expected Policy ID, Source:, Effective:, or Section/Rule marker).");
  }

  const draftHalted = haltReasons.length > 0;
  const draftText = draftHalted
    ? null
    : [
        `Re: ${question}`,
        ``,
        `Based strictly on the supplied policy text:`,
        ...top.map((m) => `- ${m.line.trimmed} ${m.line.tag}`),
        ``,
        `[Human review required before sending — verify customer eligibility and consent.]`
      ].join("\n");

  return {
    summary: draftHalted
      ? `Draft halted: supplied document did not provide sufficient grounded policy evidence (${top.length} matched clause(s)).`
      : `Grounded reply draft assembled strictly from ${top.length} verbatim source clause(s); never auto-sent.`,
    metrics: [
      ["Source lines", lines.filter((l) => l.trimmed).length],
      ["Matched clauses", top.length],
      ["Source provenance", hasSourceHeader ? "Present" : "Missing"],
      ["Send action", "Disabled"]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText,
    humanDecision: "Confirm the cited policy version applies to this case and edit the draft before replying outside this workbench."
  };
}

function analyzeHandoffHub(lines) {
  const topic = ($("opt-topic")?.value || "").trim();
  const tTokens = tokenize(topic);
  const findings = [];
  const haltReasons = [];
  const owners = [];
  const actions = [];
  const matches = [];

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (/\b(?:owner|team|escalation|maintainer)\s*:|@[a-z0-9._-]+/i.test(l.raw)) {
      owners.push(l);
      findings.push({
        severity: "pass",
        rule: "HH-OWNER",
        title: `Owner / escalation attribution on ${l.tag}`,
        detail: `Explicit human routing target found in source document.`,
        lines: [l.num],
        quote: l.raw
      });
    }
    if (/^\s*-\s*\[\s*\]|\b(?:todo|fixme|action|next\s+step)\s*:/i.test(l.raw)) {
      actions.push(l);
      findings.push({
        severity: "medium",
        rule: "HH-ACTION",
        title: `Open action item on ${l.tag}`,
        detail: `Requires explicit completion and verification during handoff.`,
        lines: [l.num],
        quote: l.raw
      });
    }
    if (tTokens.length > 0) {
      const lTokens = new Set(tokenize(l.raw));
      const hit = tTokens.filter((w) => lTokens.has(w));
      if (hit.length > 0) {
        matches.push(l);
        findings.push({
          severity: "pass",
          rule: "HH-TOPIC-EXCERPT",
          title: `Topic match (${hit.join(", ")}) on ${l.tag}`,
          detail: `Verbatim excerpt matching handoff topic "${topic}".`,
          lines: [l.num],
          quote: l.raw
        });
      }
    }
  }

  addGenericCoverageFindings(lines, findings, "HH");
  if (owners.length === 0) haltReasons.push("No explicit owner, team, or @handle attribution found — cannot route an unowned handoff.");
  if (tTokens.length > 0 && matches.length === 0) haltReasons.push(`Topic filter "${topic}" matched zero lines in the supplied document.`);

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Handoff halted: found ${owners.length} owner line(s) and ${actions.length} action(s), but required routing evidence is missing.`
      : `Compiled cited handoff with ${owners.length} owner reference(s), ${actions.length} open action(s), and ${matches.length} topic excerpt(s).`,
    metrics: [
      ["Owner refs", owners.length],
      ["Open actions", actions.length],
      ["Topic excerpts", tTokens.length ? matches.length : lines.filter((l) => l.trimmed).length],
      ["Gate status", draftHalted ? "Halted" : "Ready"]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Handoff Summary${topic ? ` (${topic})` : ""}:`,
      `Owners: ${owners.map((l) => `${l.trimmed} ${l.tag}`).join(" | ")}`,
      ...(actions.length ? ["Open Actions:", ...actions.map((l) => `- ${l.trimmed} ${l.tag}`)] : []),
      ...(matches.length ? ["Cited Excerpts:", ...matches.slice(0, 5).map((l) => `- ${l.trimmed} ${l.tag}`)] : [])
    ].join("\n"),
    humanDecision: "Confirm recipient access permissions and live on-call rotation before transferring responsibility."
  };
}

function analyzeSentinelDesk(lines) {
  const findings = [];
  const haltReasons = [];
  let highCount = 0;
  let medCount = 0;
  let cveCount = 0;

  const rules = [
    { sev: "high", rule: "SD-SECRET-KEY", re: /\b(?:sk-[a-zA-Z0-9_-]{12,}|ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)\b/, title: "Hardcoded credential / key token", detail: "Secret token pattern detected in source or log text. Revoke and rotate immediately." },
    { sev: "high", rule: "SD-PASSWORD-LIT", re: /\b(?:password|passwd|api_?key|secret|token)\s*[:=]\s*['"][^'"]{6,}['"]/i, title: "Hardcoded secret assignment", detail: "Credential literal should be injected from environment/secret manager, never committed." },
    { sev: "high", rule: "SD-SHELL-EXEC", re: /\b(?:shell\s*=\s*True|os\.system\(|eval\(|new Function\(|exec\(|child_process\.exec\()/, title: "Dangerous command/code execution sink", detail: "Dynamic shell or eval sink risks command/code injection on untrusted input." },
    { sev: "high", rule: "SD-XSS-SINK", re: /\b(?:innerHTML\s*=|dangerouslySetInnerHTML|document\.write\()/, title: "Raw HTML injection sink", detail: "Assigning unescaped markup to DOM sinks risks cross-site scripting (XSS)." },
    { sev: "high", rule: "SD-TLS-OFF", re: /\b(?:verify\s*=\s*False|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true)\b/, title: "TLS certificate verification disabled", detail: "Disabling certificate verification exposes traffic to MITM interception." },
    { sev: "medium", rule: "SD-CORS-STAR", re: /(?:Access-Control-Allow-Origin|CORS_ALLOW_ORIGIN)[^\n]*['"]\*['"]/i, title: "Wildcard CORS origin (*)", detail: "Verify whether public unauthenticated access is intentional; never pair with credentials." },
    { sev: "medium", rule: "SD-UNSAFE-BLOCK", re: /\bunsafe\s*\{/, title: "Rust unsafe block requires soundness review", detail: "Confirm safety invariants are documented and memory bounds are enforced." },
    { sev: "medium", rule: "SD-LOG-ERROR", re: /\b(?:FATAL|CRITICAL|ERROR|HTTP\s+50[0-9]|401\s+Unauthorized|403\s+Forbidden|panic|segfault)\b/i, title: "Error / auth-failure log signal", detail: "Operational or security fault event requiring responder triage." }
  ];

  for (const l of lines) {
    if (!l.trimmed) continue;
    const cves = l.raw.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || [];
    if (cves.length) {
      cveCount += cves.length;
      highCount++;
      findings.push({
        severity: "high",
        rule: "SD-CVE",
        title: `Referenced vulnerability ${cves.join(", ")} on ${l.tag}`,
        detail: `Map CVE to affected asset version and confirm remediation due date against CISA KEV / vendor advisory.`,
        lines: [l.num],
        quote: l.raw
      });
    }
    for (const r of rules) {
      if (r.re.test(l.raw)) {
        if (r.sev === "high") highCount++; else medCount++;
        findings.push({
          severity: r.sev,
          rule: r.rule,
          title: `${r.title} on ${l.tag}`,
          detail: r.detail,
          lines: [l.num],
          quote: l.raw
        });
      }
    }
  }

  addGenericCoverageFindings(lines, findings, "SD");
  if (highCount > 0) haltReasons.push(`${highCount} HIGH-severity security/CVE finding(s) remain open — clearance sign-off is halted.`);
  if (lines.filter((l) => l.trimmed).length === 0) haltReasons.push("No source code, config, or log lines provided.");

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Triage halted clearance: ${highCount} HIGH and ${medCount} MEDIUM finding(s) pinned to exact source lines.`
      : `Scanned ${lines.filter((l) => l.trimmed).length} line(s): zero HIGH-severity patterns or CVEs detected (${medCount} medium note(s)).`,
    metrics: [
      ["Lines scanned", lines.filter((l) => l.trimmed).length],
      ["High severity", highCount],
      ["Medium severity", medCount],
      ["CVE refs", cveCount]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Security Triage Clearance Draft:`,
      `- Deterministic static scan inspected ${lines.filter((l) => l.trimmed).length} lines with 0 HIGH-severity secret, sink, TLS, or CVE matches.`,
      `Human review required: Static checks do not replace dependency audits, runtime testing, or asset mapping.`
    ].join("\n"),
    humanDecision: "Validate each finding against real asset inventory and rotate any exposed secrets before closing the ticket."
  };
}

function analyzeSearchLift(lines, rawText) {
  const findings = [];
  const haltReasons = [];
  const isHtml = /<(?:!doctype|html|head|body|h1|h2|p|a|img|title)\b/i.test(rawText);
  let highCount = 0;
  let headingCount = 0;
  let wordCount = (rawText.replace(/<[^>]+>/g, " ").match(/\b\w+\b/g) || []).length;

  const findLineNum = (needleRegex) => {
    const found = lines.find((l) => needleRegex.test(l.raw));
    return found ? found : lines.find((l) => l.trimmed) || { num: 1, tag: "[L01]", raw: "" };
  };

  if (isHtml) {
    const doc = new DOMParser().parseFromString(rawText, "text/html");
    const titleEl = doc.querySelector("title");
    const titleText = titleEl ? titleEl.textContent.trim() : "";
    if (!titleText) {
      highCount++;
      const l = findLineNum(/<head|<html/i);
      findings.push({ severity: "high", rule: "SL-MISSING-TITLE", title: `Missing <title> element`, detail: `Document has no non-empty <title>.`, lines: [l.num], quote: l.raw || "(head missing title)" });
    } else if (titleText.length < 10 || titleText.length > 65) {
      const l = findLineNum(/<title/i);
      findings.push({ severity: "medium", rule: "SL-TITLE-LEN", title: `<title> length (${titleText.length} chars) outside 10-65 target on ${l.tag}`, detail: `Title "${titleText}" is very short or overly long.`, lines: [l.num], quote: l.raw });
    }

    const metaDesc = doc.querySelector('meta[name="description"]');
    if (!metaDesc || !(metaDesc.getAttribute("content") || "").trim()) {
      const l = findLineNum(/<head|<title/i);
      findings.push({ severity: "medium", rule: "SL-META-DESC", title: `Missing <meta name="description">`, detail: `Add a concise summary meta description in <head>.`, lines: [l.num], quote: l.raw });
    }

    const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    headingCount = headings.length;
    const h1s = headings.filter((h) => h.tagName === "H1");
    if (h1s.length !== 1) {
      highCount++;
      const l = findLineNum(/<h1|<body/i);
      findings.push({ severity: "high", rule: "SL-H1-COUNT", title: `Expected exactly one <h1>, found ${h1s.length}`, detail: `Each document should declare one primary <h1> landmark.`, lines: [l.num], quote: l.raw });
    }
    let prevLvl = 0;
    headings.forEach((h) => {
      const lvl = Number(h.tagName.slice(1));
      if (prevLvl && lvl > prevLvl + 1) {
        const l = findLineNum(new RegExp(`<h${lvl}\\b`, "i"));
        findings.push({ severity: "medium", rule: "SL-HEADING-SKIP", title: `Heading level skipped (<h${prevLvl}> → <h${lvl}>) on ${l.tag}`, detail: `Heading "${h.textContent.trim()}" jumps levels, hurting outline accessibility.`, lines: [l.num], quote: l.raw });
      }
      prevLvl = lvl;
    });

    lines.forEach((l) => {
      if (/<img\b(?![^>]*\balt\s*=)/i.test(l.raw)) {
        highCount++;
        findings.push({ severity: "high", rule: "SL-IMG-ALT", title: `Image missing alt attribute on ${l.tag}`, detail: `Provide descriptive alt text or alt="" for decorative images.`, lines: [l.num], quote: l.raw });
      }
      if (/<a\b[^>]*href\s*=\s*["'](?:#|\s*)["'][^>]*>|<a\b[^>]*>\s*(?:click here|here|more|link)\s*<\/a>/i.test(l.raw)) {
        highCount++;
        findings.push({ severity: "high", rule: "SL-WEAK-LINK", title: `Placeholder or non-descriptive link on ${l.tag}`, detail: `Avoid href="#" placeholders and generic "click here" anchor labels.`, lines: [l.num], quote: l.raw });
      }
    });
  } else {
    let prevLvl = 0;
    let h1Count = 0;
    for (const l of lines) {
      if (!l.trimmed) continue;
      const hm = l.raw.match(/^(#{1,6})\s+(.+)/);
      if (hm) {
        headingCount++;
        const lvl = hm[1].length;
        if (lvl === 1) h1Count++;
        if (prevLvl && lvl > prevLvl + 1) {
          findings.push({ severity: "medium", rule: "SL-MD-SKIP", title: `Markdown heading skip (H${prevLvl} → H${lvl}) on ${l.tag}`, detail: `Avoid skipping heading levels.`, lines: [l.num], quote: l.raw });
        }
        prevLvl = lvl;
      }
      if (/!\[\s*\]\([^)]+\)/.test(l.raw)) {
        highCount++;
        findings.push({ severity: "high", rule: "SL-MD-IMG-ALT", title: `Markdown image with empty alt text on ${l.tag}`, detail: `Add concise alt text inside ![alt](url).`, lines: [l.num], quote: l.raw });
      }
      if (/\[(?:click here|here|link)\]\(/i.test(l.raw) || /\]\(\s*(?:#|)\s*\)/.test(l.raw)) {
        highCount++;
        findings.push({ severity: "high", rule: "SL-MD-LINK", title: `Generic or empty Markdown link on ${l.tag}`, detail: `Replace empty hrefs or "click here" labels with descriptive link text.`, lines: [l.num], quote: l.raw });
      }
    }
    if (h1Count === 0) {
      highCount++;
      const first = lines.find((l) => l.trimmed) || { num: 1, tag: "[L01]", raw: "" };
      findings.push({ severity: "high", rule: "SL-NO-H1", title: `No top-level heading (# Title) found`, detail: `Add one primary title heading before publishing.`, lines: [first.num], quote: first.raw });
    }
  }

  addGenericCoverageFindings(lines, findings, "SL");
  if (highCount > 0) haltReasons.push(`${highCount} structural accessibility/content error(s) halt publication sign-off.`);
  if (headingCount === 0) haltReasons.push("No document headings found to verify page outline.");

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Audited ${isHtml ? "HTML" : "Markdown"} (${wordCount} words): ${highCount} structural blocker(s) halted sign-off.`
      : `Audited ${isHtml ? "HTML" : "Markdown"} (${wordCount} words, ${headingCount} headings): zero structural blockers.`,
    metrics: [
      ["Format", isHtml ? "HTML" : "Markdown/Text"],
      ["Words", wordCount],
      ["Headings", headingCount],
      ["Blockers", highCount]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Content Audit Sign-Off Draft:`,
      `- Inspected ${wordCount} words and ${headingCount} headings (${isHtml ? "HTML" : "Markdown"}) with zero missing-alt, empty-link, or H1 blockers.`,
      `Human review required: Editorial accuracy and brand voice remain human decisions.`
    ].join("\n"),
    humanDecision: "Approve editorial edits separately; offline structural checks never infer live search rankings."
  };
}

function analyzePipelineRelay(lines) {
  const findings = [];
  const haltReasons = [];
  let identityLine = null;
  let licenseLine = null;
  let consentLine = null;
  let piiCount = 0;
  let unpinnedCount = 0;

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (!identityLine && /"(?:name|repository|full_name)"\s*:|^name\s*=|github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+/i.test(l.raw)) {
      identityLine = l;
      findings.push({ severity: "pass", rule: "PR-IDENTITY", title: `Project / account identity on ${l.tag}`, detail: `Verified source identifier in manifest or note.`, lines: [l.num], quote: l.raw });
    }
    if (!licenseLine && /"license"\s*:|^license\s*=|\b(?:MIT|Apache-2\.0|BSD-[23]-Clause|ISC|GPL-[23]\.0|AGPL-3\.0|Proprietary)\b/i.test(l.raw)) {
      licenseLine = l;
      const copyleft = /\b(?:GPL|AGPL|LGPL)\b/i.test(l.raw);
      findings.push({ severity: copyleft ? "medium" : "pass", rule: "PR-LICENSE", title: `License / SPDX marker on ${l.tag}`, detail: copyleft ? `Copyleft license detected — confirm legal compatibility before integration.` : `Explicit license metadata declared.`, lines: [l.num], quote: l.raw });
    }
    if (!consentLine && /\b(?:consent|authorized|approved|permission)\b/i.test(l.raw)) {
      consentLine = l;
      findings.push({ severity: "pass", rule: "PR-CONSENT", title: `Consent / authorization record on ${l.tag}`, detail: `Explicit consent/permission reference cited.`, lines: [l.num], quote: l.raw });
    }
    if (/:\s*"(?:\*|latest)"|version\s*=\s*"\*"/i.test(l.raw)) {
      unpinnedCount++;
      findings.push({ severity: "high", rule: "PR-UNPINNED-DEP", title: `Unpinned wildcard dependency on ${l.tag}`, detail: `Wildcard or "latest" versions break reproducible builds and supply-chain verification.`, lines: [l.num], quote: l.raw });
    }
    if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/i.test(l.raw)) {
      piiCount++;
      findings.push({ severity: "high", rule: "PR-PII-CONTACT", title: `Direct contact PII detected on ${l.tag}`, detail: `De-identified handoffs should use opaque owner codes instead of raw emails or phone numbers.`, lines: [l.num], quote: l.raw });
    }
  }

  addGenericCoverageFindings(lines, findings, "PR");
  if (!identityLine) haltReasons.push("Missing repository/package/account identity line.");
  if (!licenseLine && !consentLine) haltReasons.push("Missing both SPDX license declaration and explicit consent/authorization record.");
  if (piiCount > 0) haltReasons.push(`${piiCount} direct contact PII item(s) must be redacted before an external handoff.`);
  if (unpinnedCount > 0) haltReasons.push(`${unpinnedCount} unpinned wildcard dependency specification(s) block release handoff.`);

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Handoff halted: ${haltReasons.length} compliance/hygiene gate(s) failed (${piiCount} PII, ${unpinnedCount} unpinned dep).`
      : `Identity, license/consent metadata verified with zero PII leaks or wildcard dependencies.`,
    metrics: [
      ["Identity", identityLine ? identityLine.tag : "Missing"],
      ["License/Consent", (licenseLine || consentLine) ? (licenseLine || consentLine).tag : "Missing"],
      ["PII flags", piiCount],
      ["Unpinned deps", unpinnedCount]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Compliance Handoff Receipt:`,
      `- Identity: ${identityLine.trimmed} ${identityLine.tag}`,
      ...(licenseLine ? [`- License: ${licenseLine.trimmed} ${licenseLine.tag}`] : []),
      ...(consentLine ? [`- Consent: ${consentLine.trimmed} ${consentLine.tag}`] : []),
      `- Direct PII: 0 · Wildcard dependencies: 0 · No outreach performed.`
    ].join("\n"),
    humanDecision: "Confirm repository/account ownership and legal consent policy before initiating any external contact."
  };
}

function analyzeOnboardPath(lines) {
  const findings = [];
  const haltReasons = [];
  const obligations = [];
  let authorityLine = null;
  let riskCount = 0;

  for (const l of lines) {
    if (!l.trimmed) continue;
    if (!authorityLine && /\b(?:authority|approved\s+by|effective|policy\s+id|federal\s+register|applies\s+to)\b/i.test(l.raw)) {
      authorityLine = l;
      findings.push({ severity: "pass", rule: "OP-AUTHORITY", title: `Policy authority / scope on ${l.tag}`, detail: `Explicit authority or effective-date provenance recorded.`, lines: [l.num], quote: l.raw });
    }
    if (/\b(?:automatically\s+renew|auto-renew|indemnif|sole\s+discretion|without\s+notice|binding\s+arbitration|non-compete|waive\s+all)\b/i.test(l.raw)) {
      riskCount++;
      findings.push({ severity: "high", rule: "OP-RISK-CLAUSE", title: `High-risk contract/policy clause on ${l.tag}`, detail: `Requires explicit legal or HR counsel sign-off before acceptance.`, lines: [l.num], quote: l.raw });
    }
    if (/\b(?:must|shall|required|prohibited|never|within\s+\d+\s+(?:hours?|business\s+days?|days?|months?))\b/i.test(l.raw)) {
      obligations.push(l);
      findings.push({ severity: "medium", rule: "OP-OBLIGATION", title: `Mandatory obligation / deadline on ${l.tag}`, detail: `Extracted into reviewer onboarding checklist verbatim.`, lines: [l.num], quote: l.raw });
    }
  }

  addGenericCoverageFindings(lines, findings, "OP");
  if (!authorityLine) haltReasons.push("Missing policy authority, effective date, or scope header — cannot issue employee/vendor guidance from an unattributed excerpt.");
  if (obligations.length === 0) haltReasons.push("Zero explicit obligation/requirement clauses (must/shall/required/within N days) were found in the document.");

  const draftHalted = haltReasons.length > 0;
  return {
    summary: draftHalted
      ? `Guidance draft halted: ${obligations.length} obligation(s), ${riskCount} risk clause(s), authority ${authorityLine ? "present" : "missing"}.`
      : `Extracted ${obligations.length} cited obligation(s) and ${riskCount} risk flag(s) under ${authorityLine.tag}.`,
    metrics: [
      ["Authority", authorityLine ? authorityLine.tag : "Missing"],
      ["Obligations", obligations.length],
      ["Risk clauses", riskCount],
      ["Checklist", draftHalted ? "Halted" : "Generated"]
    ],
    findings,
    draftHalted,
    haltReasons,
    draftText: draftHalted ? null : [
      `Cited Policy & Onboarding Checklist:`,
      `Authority: ${authorityLine.trimmed} ${authorityLine.tag}`,
      ...obligations.map((l) => `- [ ] ${l.trimmed} ${l.tag}`),
      ...(riskCount > 0 ? [`Warning: ${riskCount} high-risk clause(s) flagged above require legal/HR sign-off.`] : [])
    ].join("\n"),
    humanDecision: "HR or legal counsel must confirm document authority and applicability before sharing guidance."
  };
}

const ANALYZERS = {
  ledgerbridge: analyzeLedgerBridge,
  marketbrief: analyzeMarketBrief,
  chainwatch: analyzeChainWatch,
  backtestguard: analyzeBacktestGuard,
  replycraft: analyzeReplyCraft,
  handoffhub: analyzeHandoffHub,
  sentineldesk: analyzeSentinelDesk,
  searchlift: analyzeSearchLift,
  pipelinerelay: analyzePipelineRelay,
  onboardpath: analyzeOnboardPath
};

/* ============================================================================
   UI RENDERING, SOURCE INSPECTOR, EXPORTS & OPTIONAL BYOK (sessionStorage)
   ============================================================================ */

function renderNav() {
  const nav = $("workflow-nav");
  nav.replaceChildren();
  TOOLS.forEach((tool, idx) => {
    const btn = el("button", "nav-item");
    btn.type = "button";
    btn.dataset.slug = tool.slug;
    btn.setAttribute("aria-label", `${idx + 1}. ${tool.name}`);
    btn.append(
      el("span", "nav-number", String(idx + 1).padStart(2, "0")),
      el("span", "nav-item__name", tool.name),
      el("span", "nav-item__arrow", "↗")
    );
    btn.addEventListener("click", () => selectTool(tool.slug, true));
    nav.append(btn);
  });
}

function renderExtraFields(tool) {
  const host = $("extra-fields");
  host.replaceChildren();
  (tool.extraFields || []).forEach((f) => {
    if (f.type === "checkbox") {
      const wrap = el("div", "check-field");
      const inp = el("input");
      inp.type = "checkbox";
      inp.id = f.id;
      inp.checked = Boolean(f.checked);
      const lab = el("label", null, f.label);
      lab.htmlFor = f.id;
      wrap.append(inp, lab);
      host.append(wrap);
      return;
    }
    const wrap = el("div", "field");
    const lab = el("label", null, f.label);
    lab.htmlFor = f.id;
    const inp = el("input");
    inp.id = f.id;
    inp.type = f.type || "text";
    if (f.value !== undefined) inp.value = f.value;
    if (f.step !== undefined) inp.step = f.step;
    wrap.append(lab, inp);
    if (f.help) wrap.append(el("small", null, f.help));
    host.append(wrap);
  });
}

function renderSourceInspector(text, highlightLines = []) {
  const host = $("source-lines");
  const stats = $("doc-stats");
  const lines = splitLines(text);
  const nonEmptyChars = text.length;
  const lineCount = text.length ? lines.length : 0;
  stats.textContent = `${lineCount} line${lineCount === 1 ? "" : "s"} · ${nonEmptyChars.toLocaleString("en-US")} chars`;

  host.replaceChildren();
  if (!text.length) {
    host.append(el("p", "source-lines__empty", "Lines appear numbered here as soon as you paste or upload a document."));
    return;
  }
  const hiSet = new Set(highlightLines);
  const frag = document.createDocumentFragment();
  const capped = lines.slice(0, 400);
  capped.forEach((l) => {
    const row = el("div", "src-line" + (hiSet.has(l.num) ? " is-highlighted" : ""));
    row.id = `src-line-${l.num}`;
    row.append(
      el("span", "src-line__num", l.tag),
      el("span", "src-line__txt", l.raw || " ")
    );
    frag.append(row);
  });
  if (lines.length > capped.length) {
    frag.append(el("p", "source-lines__empty", `Showing first ${capped.length} of ${lines.length} lines in inspector (all ${lines.length} lines are analyzed).`));
  }
  host.append(frag);
}

function jumpToLine(lineNum) {
  const text = $("doc-input").value;
  renderSourceInspector(text, [lineNum]);
  const target = $(`src-line-${lineNum}`);
  if (target) {
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function setResultState(label, tone) {
  const pill = $("result-state");
  pill.textContent = label;
  if (tone) pill.dataset.tone = tone;
  else delete pill.dataset.tone;
}

function selectTool(slug, updateHash = false) {
  const tool = TOOLS.find((t) => t.slug === slug) || TOOLS[0];
  currentTool = tool;
  lastReport = null;
  currentFileName = "";

  const idx = TOOLS.indexOf(tool);
  $("category").textContent = tool.category;
  $("index").textContent = `${String(idx + 1).padStart(2, "0")} / ${TOOLS.length}`;
  $("signal").textContent = `${String(idx + 1).padStart(2, "0")} · ${tool.category}`;
  $("title").textContent = tool.name;
  $("description").textContent = tool.description;
  $("input-help").textContent = tool.help;
  $("outcome").textContent = tool.outcome;
  $("halt-rule").textContent = tool.haltRule;
  $("boundary").textContent = tool.boundary;
  $("file-meta").textContent = "No file loaded · paste text below, upload a file, or load the editable starter sample";

  document.querySelectorAll(".nav-item").forEach((b) => {
    if (b.dataset.slug === tool.slug) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });

  renderExtraFields(tool);
  $("doc-input").value = "";
  renderSourceInspector("");

  const out = $("result-content");
  out.replaceChildren();
  const empty = el("div", "empty-state");
  empty.append(el("span", null, "↳"), el("p", null, `Upload or paste your document for ${tool.name} (or click "Load starter sample") and click "Run line-by-line review".`));
  out.append(empty);
  setResultState("READY TO ANALYZE", null);
  $("result-actions").hidden = true;
  $("byok-output").hidden = true;

  const ws = $("workflow");
  ws.classList.remove("is-swapped");
  void ws.offsetWidth;
  ws.classList.add("is-swapped");

  if (updateHash) history.replaceState(null, "", `#${tool.slug}`);
}

function renderReport(report) {
  const host = $("result-content");
  host.replaceChildren();

  // Metrics strip
  const metricsBox = el("div", "result-intro");
  report.metrics.forEach(([k, v]) => {
    const card = el("div", "metric");
    card.append(el("span", "metric__label", k), el("strong", "metric__value", v));
    metricsBox.append(card);
  });
  host.append(metricsBox);

  // Provenance summary line
  const summaryP = el("p", "result-copy");
  summaryP.append(el("strong", null, `${report.toolName} deterministic review: `), document.createTextNode(report.summary));
  host.append(summaryP);

  const hashP = el("p", "micro");
  hashP.style.marginTop = "0";
  hashP.textContent = `Input: ${report.fileName || "pasted document"} · ${report.lineCount} lines · SHA-256 ${report.sha256.slice(0, 16)}… · Analyzed ${report.timestamp}`;
  host.append(hashP);

  // Optional numeric series chart
  if (report.series && report.series.length >= 2) {
    const sec = el("section", "result-section");
    sec.append(el("h4", null, "Extracted numeric series"));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "series");
    svg.setAttribute("viewBox", "0 0 420 112");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Bar chart of extracted numeric observations");
    const maxV = Math.max(...report.series.map((s) => s.value), 1);
    const step = Math.floor(400 / report.series.length);
    const barW = Math.max(12, Math.min(36, step - 8));
    report.series.forEach((pt, i) => {
      const h = Math.max(10, Math.round((pt.value / maxV) * 76));
      const x = 10 + i * step;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(88 - h));
      rect.setAttribute("width", String(barW));
      rect.setAttribute("height", String(h));
      rect.setAttribute("rx", "2");
      svg.append(rect);
      const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      lbl.setAttribute("x", String(x));
      lbl.setAttribute("y", "106");
      lbl.textContent = pt.label.slice(0, 7);
      svg.append(lbl);
    });
    sec.append(svg);
    host.append(sec);
  }

  // Findings section with filter & clickable [L##] verbatim quotes
  const fSec = el("section", "result-section");
  const toolbar = el("div", "findings-toolbar");
  toolbar.append(el("h4", null, `Line-cited findings (${report.findings.length})`));
  const filterInp = el("input", "findings-filter");
  filterInp.type = "search";
  filterInp.placeholder = "Filter findings or [L##]…";
  filterInp.setAttribute("aria-label", "Filter findings");
  toolbar.append(filterInp);
  fSec.append(toolbar);

  const listEl = el("ul", "result-list");
  const drawFindings = () => {
    listEl.replaceChildren();
    const q = filterInp.value.trim().toLowerCase();
    const items = report.findings.filter((f) => {
      if (!q) return true;
      return `${f.rule} ${f.severity} ${f.title} ${f.detail} ${f.quote} ${f.lines.map(tagLine).join(" ")}`.toLowerCase().includes(q);
    });
    if (!items.length) {
      const li = el("li", "finding-card");
      li.append(el("p", "finding-card__detail", "No findings match that filter."));
      listEl.append(li);
      return;
    }
    items.forEach((f) => {
      const li = el("li", "finding-card");
      const head = el("div", "finding-card__head");
      head.append(el("span", `sev-pill sev-pill--${f.severity}`, f.severity));
      head.append(el("span", "sev-pill", f.rule));
      f.lines.forEach((ln) => {
        const cite = el("button", "cite-btn", tagLine(ln));
        cite.type = "button";
        cite.title = `Jump to source line ${ln}`;
        cite.addEventListener("click", () => jumpToLine(ln));
        head.append(cite);
      });
      head.append(el("span", "finding-card__title", f.title));
      li.append(head);
      li.append(el("p", "finding-card__detail", f.detail));
      if (f.quote) {
        li.append(el("blockquote", "finding-card__quote", f.quote));
      }
      listEl.append(li);
    });
  };
  filterInp.addEventListener("input", drawFindings);
  drawFindings();
  fSec.append(listEl);
  host.append(fSec);

  // Source-grounded Draft OR Hard Halt Box
  const dSec = el("section", "result-section");
  dSec.append(el("h4", null, "Source-grounded draft gate"));
  if (report.draftHalted) {
    const halt = el("div", "halt-box");
    halt.setAttribute("role", "alert");
    halt.append(el("span", "halt-box__title", "DRAFT HALTED — MISSING OR UNRESOLVED SOURCE EVIDENCE"));
    halt.append(el("p", null, "No draft was generated because required evidence or verification gates failed:"));
    const ul = el("ul");
    report.haltReasons.forEach((reason) => ul.append(el("li", null, reason)));
    halt.append(ul);
    dSec.append(halt);
  } else {
    const box = el("textarea", "draft-box");
    box.id = "generated-draft";
    box.setAttribute("aria-label", "Source-cited draft for human editing");
    box.value = report.draftText || "";
    box.addEventListener("input", () => {
      if (lastReport) lastReport.draftText = box.value;
    });
    dSec.append(box);
    dSec.append(el("p", "micro", "Every bullet cites exact [L##] lines from your input. Editable for human review; nothing is ever sent or posted automatically."));
  }
  host.append(dSec);

  // Human decision boundary
  const hSec = el("section", "result-section");
  hSec.append(el("h4", null, "Required human decision"));
  hSec.append(el("p", "result-copy", report.humanDecision));
  host.append(hSec);

  // Raw JSON preview disclosure
  const det = el("details", "raw-details");
  det.append(el("summary", null, "Inspect structured JSON receipt"));
  det.append(el("pre", null, JSON.stringify(report, null, 2)));
  host.append(det);

  setResultState(report.draftHalted ? "DRAFT HALTED · REVIEW REQUIRED" : "VERIFIED · CITED DRAFT READY", report.draftHalted ? "warn" : "good");
  $("result-actions").hidden = false;
  const revBtn = $("review-button");
  revBtn.disabled = false;
  revBtn.textContent = report.reviewedAt ? `Locally reviewed (${report.reviewedAt})` : "Mark locally reviewed";
}

async function runReview(evt) {
  if (evt) evt.preventDefault();
  const rawText = $("doc-input").value;
  const lines = splitLines(rawText);
  const nonEmpty = lines.filter((l) => l.trimmed.length > 0);
  renderSourceInspector(rawText);
  $("byok-output").hidden = true;

  if (nonEmpty.length === 0) {
    const emptyReport = {
      toolSlug: currentTool.slug,
      toolName: currentTool.name,
      category: currentTool.category,
      fileName: currentFileName || "empty input",
      lineCount: 0,
      sha256: await sha256Hex(""),
      timestamp: new Date().toISOString(),
      summary: "No source text supplied — analysis and draft generation halted.",
      metrics: [["Source lines", 0], ["Findings", 0], ["Evidence", "Missing"], ["Draft", "Halted"]],
      findings: [],
      draftHalted: true,
      haltReasons: ["Source document is empty. Upload a file, paste your document, or click \"Load starter sample\" first."],
      draftText: null,
      humanDecision: currentTool.boundary,
      reviewedAt: null
    };
    lastReport = emptyReport;
    renderReport(emptyReport);
    return;
  }

  const analyzer = ANALYZERS[currentTool.slug];
  const res = analyzer(lines, rawText);
  const digest = await sha256Hex(rawText);
  const report = {
    toolSlug: currentTool.slug,
    toolName: currentTool.name,
    category: currentTool.category,
    fileName: currentFileName || "pasted-document.txt",
    lineCount: lines.length,
    sha256: digest,
    timestamp: new Date().toISOString(),
    ...res,
    reviewedAt: null
  };
  lastReport = report;
  renderReport(report);
}

function reportToMarkdown(r) {
  const out = [
    `# ${r.toolName} Review Report (${r.category})`,
    ``,
    `- **Input:** \`${r.fileName}\` (${r.lineCount} lines)`,
    `- **SHA-256:** \`${r.sha256}\``,
    `- **Analyzed:** ${r.timestamp}`,
    `- **Draft gate:** ${r.draftHalted ? "HALTED (missing/unresolved source evidence)" : "PASSED (cited draft generated)"}`,
    `- **Human review:** ${r.reviewedAt ? `Marked reviewed at ${r.reviewedAt}` : "Pending"}`,
    ``,
    `## Summary`,
    ``,
    r.summary,
    ``,
    `## Metrics`,
    ``,
    ...r.metrics.map(([k, v]) => `- **${k}:** ${v}`),
    ``,
    `## Findings (${r.findings.length})`,
    ``
  ];
  r.findings.forEach((f) => {
    out.push(`### [${f.severity.toUpperCase()}] ${f.rule} — ${f.title} (${f.lines.map(tagLine).join(", ")})`);
    out.push(f.detail);
    if (f.quote) {
      out.push("```text");
      out.push(f.quote);
      out.push("```");
    }
    out.push("");
  });
  out.push("## Source-Grounded Draft Gate", "");
  if (r.draftHalted) {
    out.push("**DRAFT HALTED — MISSING SOURCE EVIDENCE**", "");
    r.haltReasons.forEach((x) => out.push(`- ${x}`));
  } else {
    out.push("```text", r.draftText || "", "```");
  }
  out.push("", "## Required Human Decision", "", r.humanDecision, "");
  return out.join("\n");
}

function triggerDownload(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Optional BYOK LLM (sessionStorage only) ---------- */
function loadByokSession() {
  try {
    const raw = sessionStorage.getItem(BYOK_KEY);
    if (!raw) return;
    const cfg = JSON.parse(raw);
    if (cfg.url) $("byok-url").value = cfg.url;
    if (cfg.model) $("byok-model").value = cfg.model;
    if (cfg.key) $("byok-key").value = cfg.key;
  } catch {}
}

function saveByokSession() {
  const cfg = {
    url: $("byok-url").value.trim(),
    model: $("byok-model").value.trim(),
    key: $("byok-key").value.trim()
  };
  try {
    sessionStorage.setItem(BYOK_KEY, JSON.stringify(cfg));
    $("byok-status").textContent = "Saved in sessionStorage for this browser tab only.";
  } catch {
    $("byok-status").textContent = "sessionStorage unavailable in this browser context.";
  }
}

function clearByokSession() {
  try { sessionStorage.removeItem(BYOK_KEY); } catch {}
  $("byok-url").value = "";
  $("byok-model").value = "";
  $("byok-key").value = "";
  $("byok-status").textContent = "Cleared BYOK credentials from sessionStorage.";
}

async function runByokSynthesis() {
  if (!lastReport) {
    await runReview();
  }
  const baseUrl = $("byok-url").value.trim().replace(/\/+$/, "");
  const model = $("byok-model").value.trim();
  const apiKey = $("byok-key").value.trim();
  if (!baseUrl || !model) {
    $("byok-status").textContent = "Enter both API Base URL and Model before running BYOK synthesis.";
    return;
  }
  const runBtn = $("byok-run");
  runBtn.disabled = true;
  $("byok-status").textContent = `Contacting ${baseUrl}/chat/completions…`;
  try {
    const numbered = splitLines($("doc-input").value).slice(0, 120).map((l) => `${l.tag} ${l.raw}`).join("\n");
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `You are assisting the ${currentTool.name} document review tool. Cite exact [L##] line numbers from the source document for every claim. If evidence is missing, explicitly state DRAFT HALTED and name what is missing.`
          },
          {
            role: "user",
            content: `Deterministic findings summary: ${lastReport.summary}\nDraft halted: ${lastReport.draftHalted}\n\nNumbered source:\n${numbered}`
          }
        ]
      })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} from endpoint`);
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "Empty response from model.";
    const body = $("byok-output-body");
    body.replaceChildren();
    const pre = el("pre", null, content);
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontFamily = "var(--font-mono)";
    pre.style.fontSize = "var(--text-xs)";
    pre.style.padding = "14px";
    pre.style.borderRadius = "var(--radius-control)";
    pre.style.background = "var(--board)";
    pre.style.border = "1px solid var(--hairline)";
    body.append(pre);
    $("byok-output").hidden = false;
    $("byok-status").textContent = `Received BYOK response from ${model}.`;
  } catch (err) {
    $("byok-status").textContent = `BYOK request failed: ${err.message}. Deterministic findings above remain valid.`;
  } finally {
    runBtn.disabled = false;
  }
}

async function handleFileLoad(file) {
  if (!file) return;
  if (file.size > 512 * 1024) {
    $("file-meta").textContent = `File "${file.name}" exceeds 512 KB in-browser limit.`;
    return;
  }
  try {
    const text = await file.text();
    currentFileName = file.name;
    $("doc-input").value = text;
    $("file-meta").textContent = `Loaded local file: ${file.name} (${file.size.toLocaleString("en-US")} bytes)`;
    renderSourceInspector(text);
  } catch {
    $("file-meta").textContent = `Could not read file "${file.name}".`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  loadByokSession();

  const initialHash = location.hash.replace(/^#/, "").trim().toLowerCase();
  selectTool(TOOLS.some((t) => t.slug === initialHash) ? initialHash : TOOLS[0].slug, false);

  $("doc-input").addEventListener("input", () => {
    renderSourceInspector($("doc-input").value);
  });

  $("upload-trigger").addEventListener("click", () => $("file-input").click());
  $("file-input").addEventListener("change", (e) => {
    handleFileLoad(e.target.files?.[0]);
    e.target.value = "";
  });

  const dz = $("drop-zone");
  dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("is-dragover"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("is-dragover"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("is-dragover");
    handleFileLoad(e.dataTransfer?.files?.[0]);
  });

  $("sample-button").addEventListener("click", () => {
    currentFileName = currentTool.sampleName;
    $("doc-input").value = currentTool.sample;
    $("file-meta").textContent = `Loaded editable starter sample: ${currentTool.sampleName} (edit any line or replace with your own file)`;
    renderSourceInspector(currentTool.sample);
  });

  $("clear-button").addEventListener("click", () => {
    currentFileName = "";
    $("doc-input").value = "";
    $("file-meta").textContent = "Cleared · paste text below or upload a file";
    renderSourceInspector("");
  });

  $("run-form").addEventListener("submit", runReview);

  $("byok-toggle").addEventListener("click", () => {
    const panel = $("byok-panel");
    const open = panel.hidden;
    panel.hidden = !open;
    $("byok-toggle").setAttribute("aria-expanded", String(open));
  });
  $("byok-save").addEventListener("click", saveByokSession);
  $("byok-clear").addEventListener("click", clearByokSession);
  $("byok-run").addEventListener("click", runByokSynthesis);

  $("download-md-button").addEventListener("click", () => {
    if (!lastReport) return;
    triggerDownload(`${lastReport.toolSlug}-review-${Date.now()}.md`, reportToMarkdown(lastReport), "text/markdown;charset=utf-8");
  });

  $("download-json-button").addEventListener("click", () => {
    if (!lastReport) return;
    triggerDownload(`${lastReport.toolSlug}-receipt-${Date.now()}.json`, JSON.stringify(lastReport, null, 2), "application/json;charset=utf-8");
  });

  $("review-button").addEventListener("click", () => {
    if (!lastReport) return;
    lastReport.reviewedAt = new Date().toISOString();
    $("review-button").textContent = `Locally reviewed (${lastReport.reviewedAt.slice(11, 19)}Z)`;
    setResultState(lastReport.draftHalted ? "REVIEWED · DRAFT HALTED" : "REVIEWED · LOCAL SIGN-OFF", "good");
  });

  window.addEventListener("hashchange", () => {
    const slug = location.hash.replace(/^#/, "").trim().toLowerCase();
    if (slug && slug !== currentTool.slug && TOOLS.some((t) => t.slug === slug)) {
      selectTool(slug, false);
    }
  });
});
