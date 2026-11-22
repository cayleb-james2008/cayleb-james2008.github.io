"use strict";

/* Industry AI Suite v0.5.0 — Deterministic Multi-Document Client Review Engine.
   Zero external requests, zero fixture replays, zero canned receipts.
   Supports multi-file batch ingestion, cross-document reconciliation, real LCS line-level diff,
   customizable per-tool Rule Packs (localStorage), strict missing-source DRAFT HALTED gates,
   verifiable SHA-256 Evidence & Provenance Chains, and .md / .json / .csv audit exports. */

window.IAS_ENGINE = (function () {
  const RULE_STORAGE_KEY = "ias.rulepacks.v050";

  /* ==========================================================================
     10 CANONICAL INDUSTRY AI SUITE REVIEW TOOLS (MULTI-DOCUMENT CAPABLE)
     ========================================================================== */

  const TOOLS = [
    {
      slug: "ledgerbridge",
      name: "LedgerBridge",
      category: "FINANCE OPERATIONS",
      tagline: "Cross-file invoice, PO & bank reconciliation",
      description: "Reconcile multi-file ledger, purchase-order, and bank exports line by line. Surface exact cent/dollar variances, duplicates, high-value anomalies, and missing counterparties across documents.",
      help: "Drop or upload multiple CSV/TSV/JSON files (e.g. invoices-ledger.csv + bank-statement.csv + pos.csv) or paste rows below.",
      outcome: "Cross-matches references across all loaded files, computes exact cent variances, flags duplicates and high-value anomalies, and cites [filename:L##] verbatim.",
      haltRule: "Close-memo draft halts automatically if any reference is missing a counterparty, exceeds variance tolerance, has duplicate side rows, or lacks verifiable row IDs.",
      boundary: "A finance owner must verify export completeness and authorize any journal posting outside this workbench.",
      extraFields: [],
      ruleSchema: [
        { key: "amountAnomalyUsd", label: "Amount anomaly threshold ($)", type: "number", default: 5000, min: 1, step: 100, help: "Flag any single row whose absolute value reaches or exceeds this USD amount." },
        { key: "varianceToleranceCents", label: "Allowed variance tolerance (cents)", type: "number", default: 0, min: 0, step: 1, help: "Variances strictly above this cent tolerance halt close-memo drafting." },
        { key: "duplicateWindowRows", label: "Duplicate window (rows)", type: "number", default: 50, min: 1, step: 1, help: "Flag repeated identical side entries for the same reference within N rows." },
        { key: "requireCounterparty", label: "Require matched ledger & bank counterparty", type: "boolean", default: true, help: "Halt when a reference appears on only one side across loaded files." },
        { key: "customRegex", label: "Custom flag regex (optional)", type: "text", default: "", placeholder: "e.g. suspense|manual_adj", help: "Flag any line across loaded files matching this regular expression." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags (e.g. i, m)." }
      ],
      sampleFiles: [
        {
          name: "q4-invoices-ledger.csv",
          text: [
            "row_id,reference,side,amount_cents,owner",
            "L-101,INV-2026-401,ledger,125000,maya.chen",
            "L-102,INV-2026-402,ledger,84250,tomas.ruiz",
            "L-103,INV-2026-403,ledger,41900,tomas.ruiz",
            "L-104,INV-2026-404,ledger,19500,priya.raman",
            "L-105,INV-2026-404,ledger,19500,priya.raman",
            "L-106,INV-2026-405,ledger,645000,maya.chen"
          ].join("\n")
        },
        {
          name: "q4-bank-statement.csv",
          text: [
            "row_id,reference,side,amount_cents,owner",
            "B-101,INV-2026-401,bank,125000,maya.chen",
            "B-102,INV-2026-402,bank,84000,tomas.ruiz",
            "B-104,INV-2026-404,bank,19500,priya.raman",
            "B-106,INV-2026-405,bank,645000,maya.chen"
          ].join("\n")
        }
      ]
    },
    {
      slug: "marketbrief",
      name: "MarketBrief",
      category: "RESEARCH",
      tagline: "Multi-source metric freshness & citation audit",
      description: "Audit dated metrics and research claims across multiple memos or CSV series, detect cross-document figure conflicts, verify freshness, and halt briefs with uncited numbers.",
      help: "Upload or paste one or more Markdown memos, CSV time series, or analyst notes containing dated observations and source citations.",
      outcome: "Extracts dated figures across all files, cross-checks conflicting values for the same period, enforces citation coverage %, and plots numeric series.",
      haltRule: "Analyst brief draft halts if citation coverage falls below the rule threshold, uncited numeric claims appear, dates are missing, or cross-file values conflict.",
      boundary: "An analyst must verify release timing, primary source licensing, and conclusions. No trade or investment advice is produced.",
      extraFields: [
        { id: "opt-cutoff-date", label: "Review as-of date", type: "date", value: "2026-11-21", help: "Observations older than the configured stale window or after this cutoff are flagged." }
      ],
      ruleSchema: [
        { key: "staleMonths", label: "Stale observation threshold (months)", type: "number", default: 24, min: 1, step: 1, help: "Observations older than this many months prior to cutoff are flagged." },
        { key: "minCitationCoveragePct", label: "Required citation coverage (%)", type: "number", default: 100, min: 0, max: 100, step: 5, help: "Halt if the percentage of numeric lines with explicit attribution falls below this floor." },
        { key: "conflictDeltaPct", label: "Cross-file figure conflict threshold (%)", type: "number", default: 5, min: 0.1, step: 0.5, help: "Flag when two files report numbers for the same date differing by at least this %." },
        { key: "customRegex", label: "Custom flag regex (optional)", type: "text", default: "", placeholder: "e.g. unverified|preliminary", help: "Flag lines matching this regex across loaded files." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "macro-baseline-2025.md",
          text: [
            "# Sector Baseline — Verified Series",
            "2023-12-31: Baseline regional index closed at 27,360.9B (Source: https://data.worldbank.org/indicator/NY.GDP.MKTP.CD).",
            "2024-12-31: Annual nominal output reached 29,184.9B (+6.67% YoY, Source: https://fred.stlouisfed.org/series/GDP).",
            "2025-12-31: Preliminary estimate printed 30,410.2B (+4.20% YoY, Source: BEA Table 1.1.5)."
          ].join("\n")
        },
        {
          name: "macro-update-2026.md",
          text: [
            "# Q4 Draft Desk Notes",
            "2025-12-31: Revised series listed at 32,850.0B (Source: Internal Memo Ref: M-99).",
            "2026-09-30: Internal margin forecast jumped to 18.4% without a linked workbook.",
            "2027-03-15: Projected capacity target 142.0 units (future-dated target)."
          ].join("\n")
        }
      ]
    },
    {
      slug: "chainwatch",
      name: "ChainWatch",
      category: "WATCH-ONLY REVIEW",
      tagline: "Watch-only baseline join & secret-hygiene audit",
      description: "Cross-join watch-only address observations against baseline tables across files, flag rate anomalies, short sample windows, owner mismatches, and accidental key material.",
      help: "Upload or paste watch-only baseline CSV + event log CSV/TXT files. Zero wallet, signing, or RPC paths exist here.",
      outcome: "Joins address observations to baselines across files, calculates exact rate multiples, marks short windows uncertain, and scrubs exposed key material.",
      haltRule: "Escalation summary halts unless operator authorization is ticked, baselines exist for every address, and zero secret-hygiene violations occur.",
      boundary: "Treasury must verify address ownership and source provenance before escalating. No signing, RPC, or transfer path exists here.",
      extraFields: [
        { id: "opt-authorized", label: "I am authorized to review these watch-only observations locally.", type: "checkbox", checked: true }
      ],
      ruleSchema: [
        { key: "alertMultiple", label: "Alert rate/baseline multiple (x)", type: "number", default: 3.0, min: 1.0, step: 0.1, help: "Trigger HIGH alert when observed rate >= multiple x baseline." },
        { key: "minSampleHours", label: "Min reliable sample window (hours)", type: "number", default: 24, min: 1, step: 1, help: "Mark windows shorter than this many hours uncertain." },
        { key: "requireOwnerMatch", label: "Cross-check address owner across files", type: "boolean", default: true, help: "Flag when baseline and observation files assign different owners to the same address." },
        { key: "customRegex", label: "Custom flag regex (optional)", type: "text", default: "", placeholder: "e.g. bridge|mixer", help: "Optional regex match across all loaded files." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "address-baselines.csv",
          text: [
            "chain,address,baseline_units_per_hour,owner",
            "base,0x71C7656EC7ab88b098defB751B7401B5f6d8976F,12.0,sec.ops",
            "base,0x2546BcD3c84621e976D8185a91A922aE77ECEc30,18.0,sec.ops",
            "ethereum,0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,11.0,treasury"
          ].join("\n")
        },
        {
          name: "watch-events.csv",
          text: [
            "event_id,chain,address,rate_units_per_hour,sample_hours,owner",
            "EV-901,base,0x71C7656EC7ab88b098defB751B7401B5f6d8976F,14.5,48,sec.ops",
            "EV-902,base,0x2546BcD3c84621e976D8185a91A922aE77ECEc30,96.0,6,sec.ops",
            "EV-903,ethereum,0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,44.0,36,ops.alt"
          ].join("\n")
        }
      ]
    },
    {
      slug: "backtestguard",
      name: "BacktestGuard",
      category: "RESEARCH INTEGRITY",
      tagline: "Cross-file chronology, leakage & fee audit",
      description: "Inspect strategy source files alongside experiment configs and split CSVs to catch look-ahead primitives, cutoff mismatches between files, reused holdouts, and zeroed fees.",
      help: "Upload or paste Python/Rust/TS strategy files together with JSON/YAML experiment configs or dated split CSVs.",
      outcome: "Cross-checks declared decision cutoffs across files, scans look-ahead operators (.shift(-N), bfill, center=True, full fit_transform), and verifies realistic fees.",
      haltRule: "Promotion-readiness draft halts whenever any chronology leak, cross-file cutoff conflict, look-ahead primitive, or missing/zero fee modeling appears.",
      boundary: "A researcher must still audit point-in-time publication lag vs observation timestamp and out-of-sample selection bias.",
      extraFields: [],
      ruleSchema: [
        { key: "cutoffYear", label: "Decision cutoff year", type: "number", default: 2024, min: 1990, max: 2100, step: 1, help: "Training dates strictly after this year are flagged as chronology leakage." },
        { key: "minFeeBps", label: "Minimum modeled fee (bps)", type: "number", default: 1, min: 0, step: 0.5, help: "Flag fee configs below this basis-point floor." },
        { key: "requireConfigMatch", label: "Cross-check cutoff across code & configs", type: "boolean", default: true, help: "Flag if two loaded files declare different decision cutoff years." },
        { key: "customRegex", label: "Custom leak regex (optional)", type: "text", default: "", placeholder: "e.g. future_|target_enc", help: "Flag custom suspicious patterns across loaded files." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "momentum_strategy.py",
          text: [
            "# Experiment: momentum_v4 — decision_cutoff_year = 2024",
            "train_window = ('2020-01-01', '2025-06-30')  # extends past 2024 cutoff",
            "df['future_ret'] = df['close'].shift(-1) / df['close'] - 1",
            "df['vol_norm'] = scaler.fit_transform(df[['volume']])  # fit on full frame",
            "df['price_clean'] = df['price'].bfill()",
            "holdout_status = 'reused_2025_q1'",
            "fee_bps = 0  # transaction fees omitted"
          ].join("\n")
        },
        {
          name: "experiment_config.json",
          text: [
            "{",
            "  \"experiment_id\": \"momentum_v4\",",
            "  \"decision_cutoff_year\": 2023,",
            "  \"holdout_split\": \"2025-01-01..2025-09-30\",",
            "  \"fee_bps\": 0",
            "}"
          ].join("\n")
        }
      ]
    },
    {
      slug: "replycraft",
      name: "ReplyCraft",
      category: "SUPPORT DRAFTING",
      tagline: "Multi-policy verbatim grounding & conflict halt",
      description: "Ground an incoming customer or reviewer question strictly against multiple uploaded policy documents, detect cross-policy day/window contradictions, and emit [filename:L##] citations.",
      help: "Upload or paste one or more approved policy/FAQ documents, enter the question below, and run. Replies never invent clauses outside loaded files.",
      outcome: "Scores every line across all loaded policies, flags contradictory numbers between documents, and assembles an editable verbatim-cited reply with Send disabled.",
      haltRule: "Reply draft halts whenever fewer than the required clauses substantiate the question, provenance headers are absent, or loaded policies contradict each other.",
      boundary: "A support reviewer must verify customer eligibility, consent, and final wording before sending through an approved channel.",
      extraFields: [
        { id: "opt-question", label: "Customer / reviewer question to answer", type: "text", value: "How many days do I have to return a damaged item and how fast is the refund?", help: "Drafts are assembled strictly from matching lines across your loaded policy documents; unmatched questions halt." }
      ],
      ruleSchema: [
        { key: "minMatchTokens", label: "Min keyword overlap per clause", type: "number", default: 1, min: 1, step: 1, help: "Minimum domain words a line must share with the question to qualify as evidence." },
        { key: "minMatchedClauses", label: "Min supporting clauses required", type: "number", default: 1, min: 1, step: 1, help: "Halt drafting if fewer than this many policy lines match." },
        { key: "flagPolicyConflicts", label: "Detect conflicting day/dollar windows across files", type: "boolean", default: true, help: "Flag when two policy files quote different day limits on overlapping refund/return clauses." },
        { key: "requireProvenanceHeader", label: "Require Policy ID / Source / Effective header", type: "boolean", default: true, help: "Halt when policy documents lack verifiable provenance metadata." },
        { key: "customRegex", label: "Forbidden promise regex (optional)", type: "text", default: "", placeholder: "e.g. guaranteed|100% free", help: "Flag risky language in policy documents." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "refund-policy.md",
          text: [
            "# Refund & Shipping Policy (Policy ID: POL-2026-08)",
            "Source: Approved Operations Handbook v2.4, effective 2026-09-01.",
            "1. Standard returns are accepted within 30 calendar days of delivery in original condition.",
            "2. Damaged-in-transit items qualify for a full refund or free replacement when photo proof is submitted within 7 days.",
            "3. Custom-fabricated or monogrammed orders are non-refundable once production starts.",
            "4. Approved refunds are issued to the original payment method within 5 business days of warehouse inspection."
          ].join("\n")
        },
        {
          name: "shipping-addendum.md",
          text: [
            "# Carrier Claims Addendum (Policy ID: POL-2026-08-A)",
            "Source: Fulfillment Desk SOP v1.2, effective 2026-10-15.",
            "1. Damaged package claims with carrier photos must be logged within 7 days to trigger instant replacement.",
            "2. Expedited shipping fees are refunded automatically when carrier damage is verified."
          ].join("\n")
        }
      ]
    },
    {
      slug: "handoffhub",
      name: "HandoffHub",
      category: "KNOWLEDGE HANDOFF",
      tagline: "Multi-runbook owner, roster & action verification",
      description: "Reconcile incident runbooks against on-call rosters and SOPs: verify every @handle exists on the roster, collect open actions, check required sections, and pin every excerpt to [filename:L##].",
      help: "Upload or paste runbooks, SOPs, and an optional on-call roster file (e.g. billing-failover-runbook.md + oncall-roster.md).",
      outcome: "Extracts owners, validates handles against loaded rosters, collects open checklist actions, verifies mandatory runbook sections, and cites exact lines.",
      haltRule: "Handoff summary halts if owner attribution is missing, an @handle is orphaned from a loaded roster, mandatory sections are absent, or topic filter matches zero lines.",
      boundary: "A team lead must confirm access permissions and live on-call rotation before transferring operational ownership.",
      extraFields: [
        { id: "opt-topic", label: "Handoff topic / filter (optional)", type: "text", value: "failover", help: "Leave blank to summarize all loaded files, or enter a topic requiring verbatim excerpts." }
      ],
      ruleSchema: [
        { key: "mandatorySections", label: "Required runbook sections (comma-separated)", type: "text", default: "scope, symptoms, recovery, escalation", help: "Warn or halt when core handoff sections are absent across loaded files." },
        { key: "requireRosterMatch", label: "Verify @handles against loaded roster file", type: "boolean", default: true, help: "When a roster/team file is loaded, flag any runbook @handle absent from it." },
        { key: "requireOpenActionsCited", label: "Require explicit owner/team attribution", type: "boolean", default: true, help: "Halt if zero explicit owners or @handles appear." },
        { key: "customRegex", label: "Custom flag regex (optional)", type: "text", default: "", placeholder: "e.g. deprecated|legacy", help: "Flag custom keywords across runbooks." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "billing-failover-runbook.md",
          text: [
            "# Billing Worker Failover Runbook",
            "Owner: @maya.chen (Team: Payments Platform)",
            "Scope: Read-only diagnostics first; failover requires two-person sign-off.",
            "## Symptoms",
            "- Queue lag exceeds 300s or dead-letter queue grows above 25 messages.",
            "## Recovery Actions",
            "- [ ] Action: Verify primary Postgres replication lag is under 500ms before promoting replica.",
            "- [ ] Action: Rotate stuck worker lease via billing-ctl lease-reset --dry-run first.",
            "Escalation: Page @tomas.ruiz or @former.contractor if checksum mismatch persists."
          ].join("\n")
        },
        {
          name: "oncall-roster.md",
          text: [
            "# Payments Platform On-Call Roster (Q4 2026)",
            "- Primary: @maya.chen (Payments Platform)",
            "- Secondary: @tomas.ruiz (Database Reliability)",
            "- Manager: @priya.raman (Core Infrastructure)"
          ].join("\n")
        }
      ]
    },
    {
      slug: "sentineldesk",
      name: "SentinelDesk",
      category: "SECURITY TRIAGE",
      tagline: "Multi-file static security, CVE & log correlation",
      description: "Run deterministic static security, secret-leak, CVE, and incident-log cross-correlation across multiple code, config, .env, and .log files with redacted quotes and exact [filename:L##] pins.",
      help: "Drop or upload source files (.py, .ts, .js, .rs, .env, .yaml) alongside incident logs (.log) for cross-file security correlation.",
      outcome: "Detects credentials, command/XSS/SQL sinks, disabled TLS, CVEs, and correlates error spikes in logs directly to handlers/sinks in source files.",
      haltRule: "Security-clearance summary halts automatically whenever any HIGH-severity finding or open CVE exceeds policy, or when incident logs omit timestamps.",
      boundary: "A security engineer must validate exploitability against real host and network boundaries before taking containment action.",
      extraFields: [],
      ruleSchema: [
        { key: "blockOnMedium", label: "Halt clearance on MEDIUM findings too", type: "boolean", default: false, help: "Strict mode: block security sign-off if any medium-severity finding exists." },
        { key: "requireLogTimestamps", label: "Require ISO timestamps on .log error lines", type: "boolean", default: true, help: "Flag incident log fault lines lacking verifiable ISO-8601 timestamps." },
        { key: "maxAllowedCves", label: "Max allowed open CVE refs", type: "number", default: 0, min: 0, step: 1, help: "Halt clearance when unique CVE references exceed this count." },
        { key: "customRegex", label: "Custom secret/sink regex (optional)", type: "text", default: "", placeholder: "e.g. pickle\\.loads|md5\\(", help: "Add a custom static security rule regex." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "api_gateway.py",
          text: [
            "# api_gateway.py — pre-release security scan sample",
            "import os, subprocess, requests",
            "API_TOKEN = 'sk-live-94810a8c77f200192837465511223344'",
            "def run_diag(host):",
            "    return subprocess.check_output(f'ping -c 1 {host}', shell=True)",
            "def fetch_partner(url):",
            "    return requests.get(url, verify=False, timeout=5)",
            "CORS_ALLOW_ORIGIN = '*'"
          ].join("\n")
        },
        {
          name: "incident-2026-11-20.log",
          text: [
            "2026-11-20T14:20:02Z INFO gateway started worker=2",
            "2026-11-20T14:22:11Z ERROR fetch_partner HTTP 502 Bad Gateway upstream TLS mismatch",
            "2026-11-20T14:22:45Z CRITICAL advisory CVE-2026-21409 matched requests transport in fetch_partner",
            "2026-11-20T14:23:09Z ERROR run_diag 403 Forbidden unexpected shell argument"
          ].join("\n")
        }
      ]
    },
    {
      slug: "searchlift",
      name: "SearchLift",
      category: "CONTENT AUDIT",
      tagline: "Multi-page accessibility, outline & sibling-link audit",
      description: "Audit multiple HTML and Markdown pages offline for titles, meta descriptions, heading hierarchy, missing image alt text, duplicate cross-page titles, and broken sibling links.",
      help: "Upload or paste one or more .html or .md files to audit structure, accessibility hygiene, and cross-page link consistency.",
      outcome: "Checks metadata length bounds, H1 uniqueness, heading skips, image alt text, duplicate titles across pages, and broken relative links between files.",
      haltRule: "Publication sign-off halts if high-priority blockers (missing title/H1, missing image alt, empty/generic links, duplicate page titles, or broken sibling links) remain.",
      boundary: "An editor decides copy changes and approves publication separately. Search rankings and traffic are never guessed.",
      extraFields: [],
      ruleSchema: [
        { key: "minTitleLen", label: "Minimum title length (chars)", type: "number", default: 10, min: 1, step: 1, help: "Flag titles shorter than this character count." },
        { key: "maxTitleLen", label: "Maximum title length (chars)", type: "number", default: 65, min: 10, step: 1, help: "Flag titles longer than this character count." },
        { key: "requireMetaDescription", label: "Require meta description on HTML pages", type: "boolean", default: true, help: "Flag HTML documents missing a non-empty meta description." },
        { key: "checkCrossDocLinks", label: "Check duplicate titles & sibling links across files", type: "boolean", default: true, help: "Detect duplicate titles and broken relative links across loaded pages." },
        { key: "customRegex", label: "Forbidden copy regex (optional)", type: "text", default: "", placeholder: "e.g. TODO|lorem ipsum", help: "Flag placeholder text across all loaded pages." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "landing-page.html",
          text: [
            "<!doctype html>",
            "<html lang=\"en\">",
            "<head><title>Home</title></head>",
            "<body>",
            "  <h1>Platform Overview</h1>",
            "  <h3>Architecture Details</h3>",
            "  <p>Read the <a href=\"#\">click here</a> or <a href=\"missing-spec.html\">spec sheet</a>.</p>",
            "  <p>Also see <a href=\"docs-guide.md\">developer guide</a>.</p>",
            "  <img src=\"diagram.png\">",
            "</body>",
            "</html>"
          ].join("\n")
        },
        {
          name: "docs-guide.md",
          text: [
            "# Platform Overview",
            "## Quickstart",
            "Install dependencies and verify ![architecture diagram](arch.png).",
            "For pricing see [details](pricing.html)."
          ].join("\n")
        }
      ]
    },
    {
      slug: "pipelinerelay",
      name: "PipelineRelay",
      category: "COMPLIANCE & REPO HANDOFF",
      tagline: "Multi-manifest license, consent & PII cross-check",
      description: "Cross-verify package manifests, LICENSE notices, and handoff notes for SPDX license conflicts, allowlist compliance, unpinned dependencies, raw PII leaks, and explicit consent proof.",
      help: "Upload or paste manifests (package.json, Cargo.toml, pyproject.toml) alongside LICENSE or de-identified handoff notes.",
      outcome: "Extracts identity and SPDX markers across files, flags license conflicts or unapproved licenses, catches wildcard deps and raw PII, and verifies consent.",
      haltRule: "Handoff approval draft halts if identity, allowed license, or consent evidence is absent, licenses conflict across files, or raw PII / wildcard deps appear.",
      boundary: "An owner must confirm legal/license terms and customer consent before external sharing or outreach.",
      extraFields: [],
      ruleSchema: [
        { key: "allowedLicenses", label: "Allowed SPDX licenses (comma-separated)", type: "text", default: "MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC", help: "Flag any license outside this allowlist." },
        { key: "requireConsentProof", label: "Require explicit consent/authorization record", type: "boolean", default: true, help: "Halt if no consent or authorization line appears across loaded files." },
        { key: "blockPii", label: "Halt on raw email/phone PII", type: "boolean", default: true, help: "Block handoff if raw personal contact data appears." },
        { key: "customRegex", label: "Custom compliance regex (optional)", type: "text", default: "", placeholder: "e.g. confidential|internal only", help: "Flag custom terms across manifests and handoff files." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "package.json",
          text: [
            "{",
            "  \"name\": \"acme-analytics-worker\",",
            "  \"version\": \"1.4.2\",",
            "  \"license\": \"MIT\",",
            "  \"dependencies\": {",
            "    \"zod\": \"^3.23.8\",",
            "    \"legacy-csv\": \"*\"",
            "  }",
            "}"
          ].join("\n")
        },
        {
          name: "handoff-notes.md",
          text: [
            "# Partner Handoff Record — acme-analytics-worker",
            "Consent Record: CONSENT-2026-114 (verified: true)",
            "License Note: Shipped under GPL-3.0 terms per legacy notice.",
            "Escalation Contact: ops-lead@example.com for schema changes."
          ].join("\n")
        }
      ]
    },
    {
      slug: "onboardpath",
      name: "OnboardPath",
      category: "POLICY & CONTRACT REVIEW",
      tagline: "Policy v1/v2 LCS diff & mandatory clause checklist",
      description: "Compare policy or contract revisions with real LCS line-level diffing, cross-check against a mandatory clause checklist, extract binding obligations (must/shall/deadlines), and flag high-risk clauses.",
      help: "Upload or paste one or more policy/contract files (e.g. vendor-policy-v1.md + vendor-policy-v2.md + required-clauses-checklist.md).",
      outcome: "Runs real LCS line-level diff between v1 & v2 revisions, verifies every mandatory clause keyword/checklist item, flags risky legal clauses, and compiles a cited checklist.",
      haltRule: "Guidance draft halts if authority/effective-date metadata is absent, mandatory clauses are missing, or zero verifiable obligation clauses appear.",
      boundary: "HR or legal counsel must confirm policy authority, revision sign-off, and jurisdiction before issuing binding guidance.",
      extraFields: [],
      ruleSchema: [
        { key: "mandatoryClauses", label: "Mandatory clause keywords (comma-separated)", type: "text", default: "authority, retention, incident, termination, confidentiality", help: "Every keyword listed here must appear in the active policy/contract or drafting halts." },
        { key: "riskKeywords", label: "High-risk clause patterns (comma-separated)", type: "text", default: "auto-renew, automatically renew, indemnif, sole discretion, without notice, binding arbitration, non-compete, waive all", help: "Flag lines containing any of these high-risk legal terms." },
        { key: "haltOnMissingClauses", label: "Halt guidance when mandatory clauses are missing", type: "boolean", default: true, help: "Enforce hard DRAFT HALTED gate if any mandatory clause is absent." },
        { key: "haltOnRiskClauses", label: "Halt guidance on any high-risk clause", type: "boolean", default: false, help: "Strict legal gate: block draft whenever a high-risk clause is detected." },
        { key: "customRegex", label: "Custom clause regex (optional)", type: "text", default: "", placeholder: "e.g. governing law|subprocessor", help: "Flag or capture lines matching a custom contract regex." },
        { key: "customRegexFlags", label: "Regex flags", type: "text", default: "i", placeholder: "i", help: "Valid JS RegExp flags." }
      ],
      sampleFiles: [
        {
          name: "vendor-policy-v1.md",
          text: [
            "# Vendor Security & Equipment Policy (v1.0)",
            "Policy Authority: Approved by Operations & Security · Effective: 2026-01-01",
            "Applies to: All engineering staff and contracted vendors.",
            "1. Staff must complete hardware key enrollment within 5 business days of start date.",
            "2. Data retention logs shall be purged after 90 days unless legally held.",
            "3. Confidentiality obligations survive termination for 24 months.",
            "4. Any suspected security incident must be reported within 2 hours."
          ].join("\n")
        },
        {
          name: "vendor-policy-v2.md",
          text: [
            "# Vendor Security & Equipment Policy (v2.0)",
            "Policy Authority: Approved by Operations & Security · Effective: 2026-10-01",
            "Applies to: All engineering staff and contracted vendors.",
            "1. Staff must complete hardware key enrollment within 3 business days of start date.",
            "2. Production credentials shall never be stored in plaintext files or personal cloud drives.",
            "3. Vendor agreements automatically renew for 12 months unless terminated in writing 30 days prior.",
            "4. Any suspected security incident must be reported within 2 hours.",
            "5. Provider may amend service terms at its sole discretion without notice."
          ].join("\n")
        },
        {
          name: "required-clauses-checklist.md",
          text: [
            "# Mandatory Contract & Policy Clause Checklist",
            "- [ ] authority: Policy Authority and Effective date",
            "- [ ] retention: Data retention and purge window",
            "- [ ] incident: Security incident reporting deadline",
            "- [ ] termination: Termination notice terms",
            "- [ ] confidentiality: Confidentiality survival clause"
          ].join("\n")
        }
      ]
    }
  ];

  /* ==========================================================================
     CORE UTILITIES, HASHING, CITATIONS & RULE PACK PERSISTENCE
     ========================================================================== */

  function tagLine(n) {
    return `L${String(n).padStart(2, "0")}`;
  }

  function formatCite(fileName, lineNum) {
    return `[${fileName}:${tagLine(lineNum)}]`;
  }

  function splitLines(text) {
    const rawLines = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    return rawLines.map((raw, idx) => ({
      num: idx + 1,
      tag: `[${tagLine(idx + 1)}]`,
      raw,
      trimmed: raw.trim()
    }));
  }

  async function sha256Hex(text) {
    try {
      if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
        const data = new TextEncoder().encode(String(text || ""));
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
    } catch {}
    let h1 = 0x811c9dc5;
    let h2 = 0x9e3779b9;
    const str = String(text || "");
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 ^= c;
      h1 = Math.imul(h1, 0x01000193);
      h2 ^= c + i;
      h2 = Math.imul(h2, 0x85ebca6b);
    }
    return (
      "fallback-" +
      (h1 >>> 0).toString(16).padStart(8, "0") +
      (h2 >>> 0).toString(16).padStart(8, "0")
    );
  }

  function getDefaultRulePack(toolSlug) {
    const tool = TOOLS.find((t) => t.slug === toolSlug);
    const out = {};
    if (!tool) return out;
    (tool.ruleSchema || []).forEach((r) => {
      out[r.key] = r.default;
    });
    return out;
  }

  function loadAllRulePacks() {
    const defaults = {};
    TOOLS.forEach((t) => { defaults[t.slug] = getDefaultRulePack(t.slug); });
    try {
      const raw = localStorage.getItem(RULE_STORAGE_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return defaults;
      TOOLS.forEach((t) => {
        if (parsed[t.slug] && typeof parsed[t.slug] === "object") {
          (t.ruleSchema || []).forEach((s) => {
            if (Object.prototype.hasOwnProperty.call(parsed[t.slug], s.key)) {
              const v = parsed[t.slug][s.key];
              if (s.type === "number") {
                const n = Number(v);
                if (Number.isFinite(n)) defaults[t.slug][s.key] = n;
              } else if (s.type === "boolean") {
                defaults[t.slug][s.key] = Boolean(v);
              } else {
                defaults[t.slug][s.key] = String(v ?? "");
              }
            }
          });
        }
      });
    } catch {}
    return defaults;
  }

  function saveAllRulePacks(packs) {
    try {
      localStorage.setItem(RULE_STORAGE_KEY, JSON.stringify(packs));
      return true;
    } catch {
      return false;
    }
  }

  function countCustomizedRules(toolSlug, pack) {
    const def = getDefaultRulePack(toolSlug);
    let count = 0;
    Object.keys(def).forEach((k) => {
      if (String(pack[k]) !== String(def[k])) count++;
    });
    return count;
  }

  function compileCustomRegex(rules) {
    const pat = String(rules?.customRegex || "").trim();
    if (!pat) return { re: null, error: null };
    const rawFlags = String(rules?.customRegexFlags || "i").replace(/[^gimsuvy]/g, "");
    const safeFlags = rawFlags.replace(/g/g, "").replace(/y/g, "");
    try {
      return { re: new RegExp(pat, safeFlags), error: null, pattern: pat, flags: safeFlags };
    } catch (err) {
      return { re: null, error: err.message || "Invalid regular expression" };
    }
  }

  function applyCustomRegex(files, rules, findings, rulesEvaluated) {
    const compiled = compileCustomRegex(rules);
    if (compiled.error) {
      rulesEvaluated.push({ id: "CUSTOM-REGEX", status: "error", detail: compiled.error });
      findings.push({
        severity: "medium",
        rule: "CUSTOM-REGEX-ERR",
        title: "Custom rule regex could not compile",
        detail: `Pattern /${rules.customRegex}/ failed: ${compiled.error}.`,
        citations: files.length ? [{ file: files[0].name, line: 1 }] : [],
        quote: `Pattern: ${rules.customRegex}`
      });
      return 0;
    }
    if (!compiled.re) return 0;
    let hits = 0;
    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        if (compiled.re.test(l.raw)) {
          hits++;
          findings.push({
            severity: "medium",
            rule: "CUSTOM-REGEX",
            title: `Custom rule /${compiled.pattern}/${compiled.flags} matched on ${formatCite(f.name, l.num)}`,
            detail: `Matched user-configured Custom Rule Pack expression.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
      }
    }
    rulesEvaluated.push({ id: "CUSTOM-REGEX", status: hits ? "flagged" : "pass", detail: `/${compiled.pattern}/${compiled.flags} (${hits} hit(s))` });
    return hits;
  }

  /* ==========================================================================
     REAL LCS LINE-LEVEL DIFF ENGINE (EXACT DP + ANCHOR FALLBACK FOR LARGE DOCS)
     ========================================================================== */

  function computeLineDiff(docA, docB) {
    const a = docA.lines.map((l) => l.raw);
    const b = docB.lines.map((l) => l.raw);
    const n = a.length;
    const m = b.length;
    const ops = [];

    // Trim common prefix and suffix for speed
    let start = 0;
    while (start < n && start < m && a[start] === b[start]) start++;
    let endA = n - 1;
    let endB = m - 1;
    while (endA >= start && endB >= start && a[endA] === b[endB]) {
      endA--;
      endB--;
    }

    for (let i = 0; i < start; i++) {
      ops.push({ type: "equal", lineA: i + 1, lineB: i + 1, text: a[i] });
    }

    const midN = Math.max(0, endA - start + 1);
    const midM = Math.max(0, endB - start + 1);

    if (midN === 0 && midM === 0) {
      // Exact match in middle
    } else if (midN * midM <= 360000) {
      // Exact Longest Common Subsequence DP table
      const cols = midM + 1;
      const dp = new Uint32Array((midN + 1) * cols);
      for (let i = midN - 1; i >= 0; i--) {
        const ai = a[start + i];
        const rowOff = i * cols;
        const nextRowOff = (i + 1) * cols;
        for (let j = midM - 1; j >= 0; j--) {
          if (ai === b[start + j]) {
            dp[rowOff + j] = dp[nextRowOff + j + 1] + 1;
          } else {
            const down = dp[nextRowOff + j];
            const right = dp[rowOff + j + 1];
            dp[rowOff + j] = down >= right ? down : right;
          }
        }
      }
      let i = 0;
      let j = 0;
      while (i < midN && j < midM) {
        if (a[start + i] === b[start + j]) {
          ops.push({ type: "equal", lineA: start + i + 1, lineB: start + j + 1, text: a[start + i] });
          i++;
          j++;
        } else if (dp[(i + 1) * cols + j] >= dp[i * cols + (j + 1)]) {
          ops.push({ type: "remove", lineA: start + i + 1, lineB: null, text: a[start + i] });
          i++;
        } else {
          ops.push({ type: "add", lineA: null, lineB: start + j + 1, text: b[start + j] });
          j++;
        }
      }
      while (i < midN) {
        ops.push({ type: "remove", lineA: start + i + 1, lineB: null, text: a[start + i] });
        i++;
      }
      while (j < midM) {
        ops.push({ type: "add", lineA: null, lineB: start + j + 1, text: b[start + j] });
        j++;
      }
    } else {
      // Fast line-index greedy anchor fallback for very large files (>600x600 changed middle)
      const mapB = new Map();
      for (let j = 0; j < midM; j++) {
        const line = b[start + j];
        if (!mapB.has(line)) mapB.set(line, []);
        mapB.get(line).push(j);
      }
      let i = 0;
      let j = 0;
      while (i < midN && j < midM) {
        if (a[start + i] === b[start + j]) {
          ops.push({ type: "equal", lineA: start + i + 1, lineB: start + j + 1, text: a[start + i] });
          i++;
          j++;
        } else {
          const positions = mapB.get(a[start + i]);
          const nextJ = positions ? positions.find((p) => p >= j && p - j <= 40) : undefined;
          if (nextJ !== undefined) {
            while (j < nextJ) {
              ops.push({ type: "add", lineA: null, lineB: start + j + 1, text: b[start + j] });
              j++;
            }
          } else {
            ops.push({ type: "remove", lineA: start + i + 1, lineB: null, text: a[start + i] });
            i++;
          }
        }
      }
      while (i < midN) {
        ops.push({ type: "remove", lineA: start + i + 1, lineB: null, text: a[start + i] });
        i++;
      }
      while (j < midM) {
        ops.push({ type: "add", lineA: null, lineB: start + j + 1, text: b[start + j] });
        j++;
      }
    }

    for (let k = endA + 1, kb = endB + 1; k < n && kb < m; k++, kb++) {
      ops.push({ type: "equal", lineA: k + 1, lineB: kb + 1, text: a[k] });
    }

    let added = 0;
    let removed = 0;
    let unchanged = 0;
    ops.forEach((op) => {
      if (op.type === "add") added++;
      else if (op.type === "remove") removed++;
      else unchanged++;
    });

    return {
      fileA: docA.name,
      fileB: docB.name,
      algorithm: midN * midM <= 360000 ? "LCS-DP" : "Anchor-Linear",
      added,
      removed,
      unchanged,
      ops
    };
  }

  /* ==========================================================================
     PARSERS & TEXT HELPERS
     ========================================================================== */

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
    const headerRaw = parseCsvLine(first, sep).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_|_$/g, "")
    );
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

  function parseMoneyCents(val, isCentsCol = false) {
    if (val === undefined || val === null) return null;
    const s = String(val).trim();
    if (!s) return null;
    if (isCentsCol && /^-?\d+$/.test(s)) return Number(s);
    if (/^-?\d+$/.test(s) && !s.includes(".")) return isCentsCol ? Number(s) : Number(s) * 100;
    const cleaned = s.replace(/[$,\s]/g, "");
    if (/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return Math.round(Number(cleaned) * 100);
    return null;
  }

  function fmtCents(c) {
    const sign = c < 0 ? "-" : "";
    const abs = Math.abs(c);
    return `${sign}$${(abs / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const STOP_WORDS = new Set([
    "the","and","for","with","that","this","from","have","will","what","when","where","which","how",
    "many","much","does","are","was","were","your","their","into","about","than","then","also","only",
    "been","being","must","shall","should","could","would","there","here","they","them","some","such",
    "each","more","most","very","just","over","under","after","before","between","within"
  ]);

  function tokenize(str) {
    return (String(str || "").toLowerCase().match(/[a-z0-9][a-z0-9_-]{2,}/g) || []).filter((w) => !STOP_WORDS.has(w));
  }

  function parseCommaList(str) {
    return String(str || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function addGenericCoverageFindings(files, findings, label) {
    if (findings.length > 0) return;
    let added = 0;
    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        findings.push({
          severity: "info",
          rule: `${label}-LINE`,
          title: `Inspected source line ${formatCite(f.name, l.num)}`,
          detail: `No structured ${label.toLowerCase()} exception matched this line; retained verbatim for human verification.`,
          citations: [{ file: f.name, line: l.num }],
          quote: `${formatCite(f.name, l.num)} ${l.raw}`
        });
        added++;
        if (added >= 6) return;
      }
    }
  }

  /* ==========================================================================
     10 MULTI-DOCUMENT DETERMINISTIC ANALYZERS
     ========================================================================== */

  function analyzeLedgerBridge(files, rules) {
    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    const anomalyCents = Math.max(100, Math.round(Number(rules.amountAnomalyUsd || 5000) * 100));
    const tolCents = Math.max(0, Math.round(Number(rules.varianceToleranceCents || 0)));
    const dupWindow = Math.max(1, Math.round(Number(rules.duplicateWindowRows || 50)));
    const reqCounterparty = rules.requireCounterparty !== false;

    const groups = new Map();
    let totalRows = 0;
    let structuredFiles = 0;
    let hasSideEvidence = false;
    let exceptionCount = 0;
    let anomalyCount = 0;
    let matchedRefs = 0;
    let totalVarianceCents = 0;
    const matchedSummary = [];

    function inferSideFromFileName(name) {
      const lower = name.toLowerCase();
      if (/bank|stmt|statement|settlement|wire/.test(lower)) return "bank";
      if (/po[-_.\s]|purchase[-_]?order|\bpos\b/.test(lower)) return "po";
      if (/ledger|invoice|inv|gl|book|ap|ar/.test(lower)) return "ledger";
      return "";
    }

    let globalRowIndex = 0;
    for (const f of files) {
      const table = parseTable(f.lines);
      if (table && table.rows.length > 0 && table.header.some((h) => /ref|inv|id|account|item|po/.test(h)) && table.header.some((h) => /amount|total|cents|usd|debit|credit/.test(h))) {
        structuredFiles++;
        const refKey = table.header.find((h) => /ref|inv|po|tx|doc/.test(h)) || table.header[0];
        const sideKey = table.header.find((h) => /side|source|book|type/.test(h));
        const amtKey = table.header.find((h) => /amount_cents|cents|amount|total|usd|value/.test(h));
        const isCentsCol = /cents/.test(amtKey || "");
        const ownerKey = table.header.find((h) => /owner|reviewer|team|dept/.test(h));
        const fileSide = inferSideFromFileName(f.name);
        if (sideKey || fileSide) hasSideEvidence = true;

        for (const r of table.rows) {
          totalRows++;
          globalRowIndex++;
          const ref = (r.values[refKey] || "").trim() || `(missing-ref@${formatCite(f.name, r.line.num)})`;
          const sideRaw = sideKey ? (r.values[sideKey] || "").toLowerCase().trim() : fileSide;
          const side = /bank|stmt|statement|credit|settlement/.test(sideRaw)
            ? "bank"
            : /po|purchase/.test(sideRaw)
            ? "po"
            : /ledger|book|gl|debit|invoice/.test(sideRaw)
            ? "ledger"
            : sideRaw || "unlabeled";
          const rawAmt = r.values[amtKey];
          const cents = parseMoneyCents(rawAmt, isCentsCol);
          if (cents === null) {
            exceptionCount++;
            findings.push({
              severity: "high",
              rule: "LB-PARSE-AMT",
              title: `Unparseable amount for ${ref} on ${formatCite(f.name, r.line.num)}`,
              detail: `Column "${amtKey}" value "${rawAmt || "(empty)"}" could not be parsed as valid currency.`,
              citations: [{ file: f.name, line: r.line.num }],
              quote: `${formatCite(f.name, r.line.num)} ${r.line.raw}`
            });
            continue;
          }
          if (Math.abs(cents) >= anomalyCents) {
            anomalyCount++;
            findings.push({
              severity: "medium",
              rule: "LB-ANOMALY-AMT",
              title: `High-value anomaly ${fmtCents(cents)} on ${ref} (>= ${fmtCents(anomalyCents)})`,
              detail: `Amount exceeds Rule Pack anomaly threshold ($${Number(rules.amountAnomalyUsd).toLocaleString("en-US")}); secondary sign-off recommended.`,
              citations: [{ file: f.name, line: r.line.num }],
              quote: `${formatCite(f.name, r.line.num)} ${r.line.raw}`
            });
          }
          if (!groups.has(ref)) groups.set(ref, []);
          groups.get(ref).push({
            file: f.name,
            line: r.line,
            ref,
            side,
            cents,
            owner: ownerKey ? r.values[ownerKey] : "",
            rowIdx: globalRowIndex
          });
        }
      }
    }

    if (structuredFiles > 0) {
      if (!hasSideEvidence && reqCounterparty) {
        haltReasons.push("Missing counterparty classification (supply a side/source column or separate ledger & bank files).");
      }

      for (const [ref, items] of groups.entries()) {
        const ledgerItems = items.filter((x) => x.side === "ledger");
        const bankItems = items.filter((x) => x.side === "bank");
        const poItems = items.filter((x) => x.side === "po");
        const citations = items.map((x) => ({ file: x.file, line: x.line.num }));
        const quote = items.map((x) => `${formatCite(x.file, x.line.num)} ${x.line.raw}`).join("\n");

        // Duplicate side check within configured duplicate window
        for (const [sideName, arr] of [["ledger", ledgerItems], ["bank", bankItems], ["po", poItems]]) {
          if (arr.length > 1) {
            let withinWin = false;
            for (let i = 1; i < arr.length; i++) {
              if (arr[i].rowIdx - arr[i - 1].rowIdx <= dupWindow) withinWin = true;
            }
            if (withinWin) {
              exceptionCount++;
              findings.push({
                severity: "high",
                rule: "LB-DUP-SIDE",
                title: `Duplicate ${sideName} rows for ${ref} (window <= ${dupWindow} rows)`,
                detail: `Found ${arr.length} ${sideName} row(s) for ${ref} across ${[...new Set(arr.map((x) => x.file))].join(", ")}. Reviewer must deduplicate before posting.`,
                citations: arr.map((x) => ({ file: x.file, line: x.line.num })),
                quote: arr.map((x) => `${formatCite(x.file, x.line.num)} ${x.line.raw}`).join("\n")
              });
            }
          }
        }

        // Cross-file PO vs Ledger check if PO rows exist
        if (poItems.length > 0 && ledgerItems.length > 0) {
          const poSum = poItems.reduce((a, b) => a + b.cents, 0);
          const lSum = ledgerItems.reduce((a, b) => a + b.cents, 0);
          const poDiff = lSum - poSum;
          if (Math.abs(poDiff) > tolCents) {
            exceptionCount++;
            totalVarianceCents += Math.abs(poDiff);
            findings.push({
              severity: "high",
              rule: "LB-PO-MISMATCH",
              title: `Invoice vs PO variance of ${fmtCents(poDiff)} on ${ref}`,
              detail: `Ledger/Invoice total ${fmtCents(lSum)} differs from PO total ${fmtCents(poSum)} (tolerance ${fmtCents(tolCents)}).`,
              citations: [...ledgerItems, ...poItems].map((x) => ({ file: x.file, line: x.line.num })),
              quote: [...ledgerItems, ...poItems].map((x) => `${formatCite(x.file, x.line.num)} ${x.line.raw}`).join("\n")
            });
          }
        }

        if (ledgerItems.length === 0 || bankItems.length === 0) {
          if (reqCounterparty) {
            exceptionCount++;
            const missing = ledgerItems.length === 0 ? "ledger" : "bank";
            findings.push({
              severity: "high",
              rule: "LB-MISSING-SIDE",
              title: `Missing ${missing} counterparty for ${ref}`,
              detail: `Only ${[...new Set(items.map((x) => x.side))].join(", ")} side present (${fmtCents(items[0].cents)}) in ${items[0].file}. Cannot reconcile single-sided entry.`,
              citations,
              quote
            });
          }
          continue;
        }

        const lSum = ledgerItems.reduce((a, b) => a + b.cents, 0);
        const bSum = bankItems.reduce((a, b) => a + b.cents, 0);
        const diff = lSum - bSum;
        if (Math.abs(diff) > tolCents) {
          exceptionCount++;
          totalVarianceCents += Math.abs(diff);
          findings.push({
            severity: "high",
            rule: "LB-VARIANCE",
            title: `Cross-document variance of ${fmtCents(diff)} on ${ref}`,
            detail: `Ledger total ${fmtCents(lSum)} vs bank total ${fmtCents(bSum)} (delta ${fmtCents(diff)}, tolerance ${fmtCents(tolCents)}). Owner: ${items[0].owner || "unassigned"}.`,
            citations,
            quote
          });
        } else if (ledgerItems.length === 1 && bankItems.length === 1) {
          matchedRefs++;
          const citeStr = items.map((x) => formatCite(x.file, x.line.num)).join(", ");
          matchedSummary.push(`- ${ref}: matched at ${fmtCents(lSum)} (${citeStr})`);
          findings.push({
            severity: "pass",
            rule: "LB-MATCH",
            title: `Reconciled ${ref} at ${fmtCents(lSum)} across ${[...new Set(items.map((x) => x.file))].length} file(s)`,
            detail: `Ledger and bank amounts agree within ${fmtCents(tolCents)} tolerance; owner ${items[0].owner || "unassigned"}.`,
            citations,
            quote
          });
        }
      }

      if (exceptionCount > 0) {
        haltReasons.push(`${exceptionCount} reconciliation exception(s) (missing counterparty, duplicate, or variance totaling ${fmtCents(totalVarianceCents)}) require human resolution before generating a close memo.`);
      }
      if (matchedRefs === 0) {
        haltReasons.push("Zero cleanly matched ledger/bank pairs were verified across loaded files.");
      }
    } else {
      // Unstructured financial prose fallback across all files
      let sourcedLines = 0;
      for (const f of files) {
        for (const l of f.lines) {
          if (!l.trimmed) continue;
          totalRows++;
          const hasAmount = /\$[\d,]+(?:\.\d{1,2})?|\b\d{1,3}(?:,\d{3})+(?:\.\d{2})?\b|\b\d+\.\d{2}\b/.test(l.raw);
          const hasRef = /\b(?:INV|TX|REF|PO|ACCT|CHK|LEDGER|BANK)[-_#]?[A-Z0-9-]+\b/i.test(l.raw);
          if (hasAmount && hasRef) {
            sourcedLines++;
            findings.push({
              severity: "medium",
              rule: "LB-UNPAIRED-TEXT",
              title: `Referenced amount without paired counterparty table on ${formatCite(f.name, l.num)}`,
              detail: `Detected monetary amount with identifier, but no structured two-sided CSV/TSV export was supplied.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          } else if (hasAmount) {
            exceptionCount++;
            findings.push({
              severity: "high",
              rule: "LB-UNCITED-AMT",
              title: `Uncited financial figure on ${formatCite(f.name, l.num)}`,
              detail: `Line contains a monetary amount without an invoice/reference ID or bank counterparty record.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }
      }
      addGenericCoverageFindings(files, findings, "LB");
      haltReasons.push("Missing structured two-sided ledger & bank export (upload paired ledger + bank CSV/TSV files or a two-sided table).");
      if (sourcedLines === 0) haltReasons.push("No verifiable invoice/transaction reference IDs paired with amounts were found.");
    }

    rulesEvaluated.push(
      { id: "LB-COUNTERPARTY", status: reqCounterparty ? (exceptionCount ? "flagged" : "pass") : "skipped", detail: `requireCounterparty=${reqCounterparty}` },
      { id: "LB-VARIANCE", status: totalVarianceCents > tolCents ? "flagged" : "pass", detail: `tolerance=${fmtCents(tolCents)}, total=${fmtCents(totalVarianceCents)}` },
      { id: "LB-DUP-WINDOW", status: "evaluated", detail: `window=${dupWindow} rows` },
      { id: "LB-ANOMALY-AMT", status: anomalyCount ? "flagged" : "pass", detail: `threshold=${fmtCents(anomalyCents)} (${anomalyCount} flagged)` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Reconciled ${totalRows} row(s) across ${files.length} file(s): ${exceptionCount} exception(s) and ${anomalyCount} anomaly flag(s) halted close-memo drafting.`
        : `Reconciled ${matchedRefs} reference(s) across ${files.length} file(s) (${totalRows} rows) within ${fmtCents(tolCents)} tolerance; close-memo draft ready for review.`,
      metrics: [
        ["Files / Rows", `${files.length} / ${totalRows}`],
        ["Matched refs", matchedRefs],
        ["Exceptions", exceptionCount],
        ["Total variance", fmtCents(totalVarianceCents)]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Close Reconciliation Draft (${files.length} source file(s)):`,
            `Verified ${matchedRefs} matched reference(s) across ${totalRows} rows with ${fmtCents(totalVarianceCents)} variance.`,
            ...matchedSummary,
            `Send action: Disabled — Human finance approval required before ledger posting.`
          ].join("\n"),
      humanDecision: "Confirm source export completeness across all loaded files and resolve every exception before posting any journal entry."
    };
  }

  function analyzeMarketBrief(files, rules, extra) {
    const cutoffStr = (extra && extra.cutoffDate) || "2026-11-21";
    const cutoffDate = new Date(cutoffStr + "T00:00:00Z");
    const staleMonths = Math.max(1, Number(rules.staleMonths || 24));
    const staleThresholdMs = staleMonths * 30.4375 * 86400 * 1000;
    const minCoverage = Math.min(100, Math.max(0, Number(rules.minCitationCoveragePct ?? 100)));
    const conflictPct = Math.max(0.1, Number(rules.conflictDeltaPct || 5));

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    const series = [];
    const citedLines = [];
    const dateObsMap = new Map();
    let datedCount = 0;
    let citedCount = 0;
    let numericClaimCount = 0;
    let uncitedMetricCount = 0;
    let conflictCount = 0;
    let totalLines = 0;

    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        totalLines++;
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
                title: `Future-dated observation (${label}) on ${formatCite(f.name, l.num)}`,
                detail: `Date ${label} falls after review cutoff ${cutoffStr}; cannot be cited as realized fact.`,
                citations: [{ file: f.name, line: l.num }],
                quote: `${formatCite(f.name, l.num)} ${l.raw}`
              });
            } else if (cutoffDate.getTime() - d.getTime() > staleThresholdMs) {
              findings.push({
                severity: "medium",
                rule: "MB-STALE-DATE",
                title: `Stale observation (${label}) on ${formatCite(f.name, l.num)}`,
                detail: `Older than configured ${staleMonths}-month freshness window relative to ${cutoffStr}.`,
                citations: [{ file: f.name, line: l.num }],
                quote: `${formatCite(f.name, l.num)} ${l.raw}`
              });
            }
          }
          if (meaningfulNums.length) {
            const cleaned = Number(meaningfulNums[0].replace(/[^0-9.-]/g, ""));
            if (Number.isFinite(cleaned)) {
              series.push({ label: label.slice(0, 10), value: Math.abs(cleaned) });
              if (!dateObsMap.has(label)) dateObsMap.set(label, []);
              dateObsMap.get(label).push({ file: f.name, line: l, value: cleaned, rawNum: meaningfulNums[0].trim() });
            }
          }
        }

        if (meaningfulNums.length) {
          numericClaimCount++;
          if (!hasCitation) {
            uncitedMetricCount++;
            findings.push({
              severity: "high",
              rule: "MB-UNCITED-METRIC",
              title: `Uncited numeric claim (${meaningfulNums[0].trim()}) on ${formatCite(f.name, l.num)}`,
              detail: `Line asserts a numeric value without a URL, DOI, Table ID, or Source:/Ref: citation.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          } else {
            citedLines.push(`- ${formatCite(f.name, l.num)} ${l.trimmed}`);
            findings.push({
              severity: "pass",
              rule: "MB-CITED-OBS",
              title: `Source-cited metric on ${formatCite(f.name, l.num)}`,
              detail: `Quantitative observation includes explicit source attribution.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }
      }
    }

    // Cross-document figure conflict check on matching observation dates
    for (const [dateKey, obs] of dateObsMap.entries()) {
      const distinctFiles = [...new Set(obs.map((o) => o.file))];
      if (distinctFiles.length >= 2) {
        const first = obs[0];
        for (let i = 1; i < obs.length; i++) {
          const other = obs[i];
          if (other.file === first.file) continue;
          const denom = Math.max(Math.abs(first.value), 1e-9);
          const diffPct = (Math.abs(other.value - first.value) / denom) * 100;
          if (diffPct >= conflictPct) {
            conflictCount++;
            findings.push({
              severity: "high",
              rule: "MB-CROSS-CONFLICT",
              title: `Cross-file metric conflict on ${dateKey} (${diffPct.toFixed(1)}% delta)`,
              detail: `${first.file} reports ${first.rawNum} vs ${other.file} reporting ${other.rawNum} (exceeds ${conflictPct}% conflict threshold).`,
              citations: [
                { file: first.file, line: first.line.num },
                { file: other.file, line: other.line.num }
              ],
              quote: `${formatCite(first.file, first.line.num)} ${first.line.raw}\n${formatCite(other.file, other.line.num)} ${other.line.raw}`
            });
          }
        }
      }
    }

    const coveragePct = numericClaimCount > 0 ? Math.round(((numericClaimCount - uncitedMetricCount) / numericClaimCount) * 100) : 0;
    addGenericCoverageFindings(files, findings, "MB");
    if (citedCount === 0) haltReasons.push("Zero verifiable source citations (URL, DOI, Source:, Table, or Ref:) found across loaded documents.");
    if (coveragePct < minCoverage && numericClaimCount > 0) {
      haltReasons.push(`Citation coverage ${coveragePct}% is below required ${minCoverage}% threshold (${uncitedMetricCount} uncited numeric claim(s)).`);
    }
    if (conflictCount > 0) haltReasons.push(`${conflictCount} cross-document numeric conflict(s) on identical observation dates require analyst reconciliation.`);
    if (datedCount === 0) haltReasons.push("No observation dates found; freshness cannot be verified.");

    rulesEvaluated.push(
      { id: "MB-STALE-WINDOW", status: "evaluated", detail: `staleMonths=${staleMonths}, cutoff=${cutoffStr}` },
      { id: "MB-CITATION-COV", status: coveragePct < minCoverage ? "flagged" : "pass", detail: `coverage=${coveragePct}% (min ${minCoverage}%)` },
      { id: "MB-CROSS-CONFLICT", status: conflictCount ? "flagged" : "pass", detail: `threshold=${conflictPct}% (${conflictCount} conflict(s))` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    let deltaDisplay = "N/A";
    if (series.length >= 2 && series[series.length - 2].value > 0) {
      const pct = ((series[series.length - 1].value - series[series.length - 2].value) / series[series.length - 2].value) * 100;
      deltaDisplay = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
    }

    return {
      summary: draftHalted
        ? `Audited ${totalLines} line(s) across ${files.length} file(s): ${uncitedMetricCount} uncited metric(s) and ${conflictCount} cross-file conflict(s) halted brief generation.`
        : `Verified ${citedCount} source-cited line(s) across ${files.length} file(s) (${coveragePct}% citation coverage, latest delta ${deltaDisplay}).`,
      metrics: [
        ["Dated obs", datedCount],
        ["Citation cov", `${coveragePct}%`],
        ["Cross conflicts", conflictCount],
        ["Latest delta", deltaDisplay]
      ],
      findings,
      rulesEvaluated,
      series: series.length >= 2 ? series.slice(0, 12) : null,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Source-Cited Analyst Observation Draft (as of ${cutoffStr}, ${files.length} file(s)):`,
            ...citedLines,
            `Send action: Disabled — Confirm primary release timestamps before external distribution.`
          ].join("\n"),
      humanDecision: "Confirm source publication timing, resolve cross-file revisions, and verify data rights before sharing."
    };
  }

  function analyzeChainWatch(files, rules, extra) {
    const threshold = Math.max(1.0, Number(rules.alertMultiple || 3.0));
    const minSampleHours = Math.max(1, Number(rules.minSampleHours || 24));
    const reqOwnerMatch = rules.requireOwnerMatch !== false;
    const authorized = extra ? Boolean(extra.authorized) : true;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    let obsCount = 0;
    let alertCount = 0;
    let uncertainCount = 0;
    let secretLeak = false;
    const alertLines = [];

    // Step 1: Secret hygiene across ALL files
    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        if (/\b0x[a-fA-F0-9]{64}\b|BEGIN\s+PRIVATE\s+KEY|mnemonic|seed\s*phrase/i.test(l.raw)) {
          secretLeak = true;
          findings.push({
            severity: "high",
            rule: "CW-SECRET-HYGIENE",
            title: `Possible private key or seed material on ${formatCite(f.name, l.num)}`,
            detail: `Watch-only review forbids private keys or mnemonics. Scrub and rotate immediately.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw.replace(/0x[a-fA-F0-9]{64}/g, "0x[REDACTED_64_HEX]")}`
          });
        }
      }
    }

    // Step 2: Build cross-file baseline lookup & observation list
    const baselineMap = new Map();
    const observations = [];

    for (const f of files) {
      const table = parseTable(f.lines);
      if (!table || !table.rows.length) continue;
      const addrKey = table.header.find((h) => /address|addr|wallet/.test(h));
      const rateKey = table.header.find((h) => /rate|observed/.test(h));
      const baseKey = table.header.find((h) => /baseline/.test(h));
      const hrsKey = table.header.find((h) => /hour|window|sample/.test(h));
      const idKey = table.header.find((h) => /event|id/.test(h));
      const ownerKey = table.header.find((h) => /owner|team|desk/.test(h));

      if (baseKey && addrKey && !rateKey) {
        for (const r of table.rows) {
          const addr = (r.values[addrKey] || "").trim().toLowerCase();
          const base = Number(r.values[baseKey]);
          if (addr && Number.isFinite(base)) {
            baselineMap.set(addr, { file: f.name, line: r.line, base, owner: ownerKey ? (r.values[ownerKey] || "").trim() : "" });
          }
        }
      } else if (rateKey) {
        for (const r of table.rows) {
          observations.push({
            file: f.name,
            line: r.line,
            evId: idKey ? (r.values[idKey] || formatCite(f.name, r.line.num)) : formatCite(f.name, r.line.num),
            addr: addrKey ? (r.values[addrKey] || "").trim() : "(no address)",
            rate: Number(r.values[rateKey]),
            inlineBase: baseKey ? Number(r.values[baseKey]) : NaN,
            hrs: hrsKey ? Number(r.values[hrsKey]) : NaN,
            owner: ownerKey ? (r.values[ownerKey] || "").trim() : ""
          });
        }
      }
    }

    if (observations.length > 0) {
      for (const obs of observations) {
        obsCount++;
        const refBase = baselineMap.get(obs.addr.toLowerCase());
        const base = Number.isFinite(obs.inlineBase) && obs.inlineBase > 0 ? obs.inlineBase : refBase ? refBase.base : NaN;
        const cites = [{ file: obs.file, line: obs.line.num }];
        const quoteParts = [`${formatCite(obs.file, obs.line.num)} ${obs.line.raw}`];
        if (refBase) {
          cites.push({ file: refBase.file, line: refBase.line.num });
          quoteParts.push(`${formatCite(refBase.file, refBase.line.num)} ${refBase.line.raw}`);
        }

        if (reqOwnerMatch && refBase && refBase.owner && obs.owner && refBase.owner.toLowerCase() !== obs.owner.toLowerCase()) {
          findings.push({
            severity: "medium",
            rule: "CW-OWNER-MISMATCH",
            title: `Cross-file owner mismatch for ${obs.evId}: "${obs.owner}" vs "${refBase.owner}"`,
            detail: `Observation file ${obs.file} lists owner "${obs.owner}" while baseline file ${refBase.file} lists "${refBase.owner}".`,
            citations: cites,
            quote: quoteParts.join("\n")
          });
        }

        if (!Number.isFinite(obs.rate) || !Number.isFinite(base) || base <= 0) {
          findings.push({
            severity: "high",
            rule: "CW-BAD-BASELINE",
            title: `Missing or zero baseline for ${obs.evId} (${obs.addr})`,
            detail: `Cannot evaluate rate multiple without a positive baseline in-row or in a joined baseline CSV.`,
            citations: cites,
            quote: quoteParts.join("\n")
          });
          haltReasons.push(`Missing/invalid baseline for ${obs.evId} on ${formatCite(obs.file, obs.line.num)}.`);
          continue;
        }

        const mult = obs.rate / base;
        const shortWin = !Number.isFinite(obs.hrs) || obs.hrs < minSampleHours;
        if (shortWin) uncertainCount++;

        if (mult >= threshold) {
          alertCount++;
          alertLines.push(`- ${obs.evId} (${obs.addr}): ${mult.toFixed(2)}x baseline (${obs.rate}/${base}), window ${Number.isFinite(obs.hrs) ? obs.hrs + "h" : "n/a"} ${cites.map((c) => formatCite(c.file, c.line)).join(" + ")}`);
          findings.push({
            severity: "high",
            rule: "CW-BREACH",
            title: `${obs.evId}: ${mult.toFixed(2)}x baseline (threshold ${threshold.toFixed(1)}x)`,
            detail: `Address ${obs.addr} observed at ${obs.rate} vs ${base} baseline${refBase ? ` (joined from ${refBase.file})` : ""}. ${shortWin ? `Sample window < ${minSampleHours}h — marked uncertain.` : `Window ${obs.hrs}h.`}`,
            citations: cites,
            quote: quoteParts.join("\n")
          });
        } else {
          findings.push({
            severity: "pass",
            rule: "CW-NORMAL",
            title: `${obs.evId}: ${mult.toFixed(2)}x baseline (below ${threshold.toFixed(1)}x)`,
            detail: `Within configured threshold${shortWin ? ` (short window < ${minSampleHours}h)` : ""}.`,
            citations: cites,
            quote: quoteParts.join("\n")
          });
        }
      }
    } else {
      for (const f of files) {
        f.lines.filter((l) => /0x[a-fA-F0-9]{40}\b/.test(l.raw)).forEach((l) => {
          obsCount++;
          findings.push({
            severity: "medium",
            rule: "CW-NO-BASELINE",
            title: `Address found without rate/baseline columns on ${formatCite(f.name, l.num)}`,
            detail: `Supply rate_units_per_hour and baseline_units_per_hour (single file or separate baseline + events CSVs).`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        });
      }
      addGenericCoverageFindings(files, findings, "CW");
      haltReasons.push("Missing structured rate + baseline + sample-window observations.");
    }

    if (!authorized) haltReasons.push("Operator authorization checkbox is unchecked — escalation drafting is blocked.");
    if (secretLeak) haltReasons.push("Potential private key or seed phrase detected — scrub input before generating any handoff.");

    rulesEvaluated.push(
      { id: "CW-THRESHOLD", status: alertCount ? "flagged" : "pass", detail: `multiple>=${threshold.toFixed(1)}x (${alertCount} breach(es))` },
      { id: "CW-SAMPLE-WIN", status: uncertainCount ? "flagged" : "pass", detail: `minHours=${minSampleHours}h (${uncertainCount} uncertain)` },
      { id: "CW-SECRET-HYGIENE", status: secretLeak ? "flagged" : "pass", detail: secretLeak ? "leak detected" : "clean" }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Audited ${obsCount} observation(s) across ${files.length} file(s): ${alertCount} breach(es); draft halted due to missing authorization, baseline, or secret hygiene.`
        : `Cross-joined ${obsCount} watch-only observation(s) across ${files.length} file(s) against ${threshold.toFixed(1)}x threshold: ${alertCount} alert(s), ${uncertainCount} uncertain.`,
      metrics: [
        ["Observations", obsCount],
        ["Breach alerts", alertCount],
        [`Short (<${minSampleHours}h)`, uncertainCount],
        ["Threshold", `${threshold.toFixed(1)}x`]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Watch-Only Escalation Draft (threshold ${threshold.toFixed(1)}x, zero signing/RPC):`,
            ...(alertLines.length ? alertLines : ["- No observations breached the configured multiple threshold."]),
            `Send action: Disabled — Verify address ownership and provenance prior to operational escalation.`
          ].join("\n"),
      humanDecision: "Verify address ownership and cross-file baseline provenance before escalating. No chain write or transfer is possible."
    };
  }

  function analyzeBacktestGuard(files, rules) {
    const ruleCutoff = Number(rules.cutoffYear || 2024);
    const minFeeBps = Math.max(0, Number(rules.minFeeBps ?? 1));
    const reqConfigMatch = rules.requireConfigMatch !== false;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    let leakCount = 0;
    let warningCount = 0;
    let timestampCount = 0;
    let feeMentioned = false;
    let feeTooLow = false;
    const declaredCutoffs = [];

    const leakRules = [
      { re: /\.shift\(\s*-\d+/i, rule: "BG-SHIFT-NEG", title: "Negative shift look-ahead (.shift(-N))", detail: "Reading future rows into the current feature bar introduces direct look-ahead leakage." },
      { re: /\bbfill\b|method\s*=\s*['"]bfill['"]|backfill/i, rule: "BG-BFILL", title: "Backward-fill look-ahead (bfill)", detail: "Filling missing historical values from future observations leaks future state." },
      { re: /center\s*=\s*True/i, rule: "BG-CENTERED-WINDOW", title: "Centered rolling window (center=True)", detail: "Centered rolling windows consume future bars beyond the decision timestamp." },
      { re: /\.fit_transform\(/i, rule: "BG-FULL-FIT", title: "Scaler/encoder fit_transform check", detail: "Verify scaler/encoder is fit strictly inside the training fold, never across the full dataset." },
      { re: /holdout[^\n]*(?:reused|shared|tuned|iterat)/i, rule: "BG-REUSED-HOLDOUT", title: "Reused holdout set detected", detail: "Evaluating multiple iterations on a reused holdout invalidates out-of-sample statistics." }
    ];

    // First pass: gather declared cutoffs across files
    for (const f of files) {
      for (const l of f.lines) {
        const cm = l.raw.match(/(?:decision_cutoff_year|cutoff_year|cutoff)["']?\s*[:=]\s*["']?(20\d{2})["']?/i);
        if (cm) {
          declaredCutoffs.push({ file: f.name, line: l, year: Number(cm[1]) });
        }
      }
    }

    if (reqConfigMatch && declaredCutoffs.length >= 2) {
      const years = [...new Set(declaredCutoffs.map((c) => c.year))];
      if (years.length > 1) {
        leakCount++;
        findings.push({
          severity: "high",
          rule: "BG-CUTOFF-MISMATCH",
          title: `Cross-file decision cutoff mismatch (${years.join(" vs ")})`,
          detail: `Loaded code/config files declare conflicting decision cutoff years; align all artifacts to one immutable cutoff.`,
          citations: declaredCutoffs.map((c) => ({ file: c.file, line: c.line.num })),
          quote: declaredCutoffs.map((c) => `${formatCite(c.file, c.line.num)} ${c.line.raw}`).join("\n")
        });
      }
    }

    const effectiveCutoff = declaredCutoffs.length ? Math.min(ruleCutoff, ...declaredCutoffs.map((c) => c.year)) : ruleCutoff;

    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        if (/\b(?:fee|commission|slippage|cost|bps)\b/i.test(l.raw)) {
          feeMentioned = true;
          const fm = l.raw.match(/(?:fee|commission|slippage)[a-z_]*["']?\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)\b/i);
          if (fm && Number(fm[1]) < minFeeBps) {
            feeTooLow = true;
            warningCount++;
            findings.push({
              severity: "medium",
              rule: "BG-LOW-FEES",
              title: `Fee/slippage (${fm[1]} bps) below ${minFeeBps} bps floor on ${formatCite(f.name, l.num)}`,
              detail: `Understating transaction costs inflates backtest expectancy. Model realistic venue fees and spread.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }

        const dates = l.raw.match(/\b(20\d{2})(?:-\d{2}-\d{2})?\b/g) || [];
        if (dates.length) {
          timestampCount++;
          const isTrainCtx = /train|fit|in_sample|feature|calib/i.test(l.raw) && !/holdout|test|oos/i.test(l.raw);
          for (const ds of dates) {
            const yr = Number(ds.slice(0, 4));
            if (yr > effectiveCutoff && (isTrainCtx || !/holdout|oos|target|cutoff/i.test(l.raw))) {
              leakCount++;
              findings.push({
                severity: "high",
                rule: "BG-POST-CUTOFF",
                title: `Post-cutoff date (${ds} > ${effectiveCutoff}) on ${formatCite(f.name, l.num)}`,
                detail: `Observation or window extends past effective decision cutoff ${effectiveCutoff}.`,
                citations: [{ file: f.name, line: l.num }],
                quote: `${formatCite(f.name, l.num)} ${l.raw}`
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
              title: `${r.title} on ${formatCite(f.name, l.num)}`,
              detail: r.detail,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }
      }
    }

    addGenericCoverageFindings(files, findings, "BG");
    if (leakCount > 0) haltReasons.push(`${leakCount} chronology / look-ahead / cutoff-conflict violation(s) block promotion sign-off.`);
    if (timestampCount === 0) haltReasons.push("No date or chronology metadata found across loaded experiment files.");
    if (!feeMentioned || feeTooLow) haltReasons.push(`Realistic transaction fees (>= ${minFeeBps} bps) are missing or below floor.`);

    rulesEvaluated.push(
      { id: "BG-CUTOFF", status: leakCount ? "flagged" : "pass", detail: `effectiveCutoff=${effectiveCutoff}, ruleCutoff=${ruleCutoff}` },
      { id: "BG-FEES", status: (!feeMentioned || feeTooLow) ? "flagged" : "pass", detail: `minFeeBps=${minFeeBps}` },
      { id: "BG-CROSS-CONFIG", status: "evaluated", detail: `requireConfigMatch=${reqConfigMatch}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Chronology audit across ${files.length} file(s) halted sign-off: ${leakCount} leakage/conflict flag(s) and ${warningCount} fee warning(s) against cutoff ${effectiveCutoff}.`
        : `Zero look-ahead primitives or post-${effectiveCutoff} training leaks across ${files.length} file(s) (${timestampCount} dated line(s)).`,
      metrics: [
        ["Effective cutoff", effectiveCutoff],
        ["Leakage flags", leakCount],
        ["Dated lines", timestampCount],
        ["Fees >= floor", feeMentioned && !feeTooLow ? "Yes" : "No"]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Backtest Integrity Gate Summary (cutoff ${effectiveCutoff}, ${files.length} file(s)):`,
            `- Inspected ${timestampCount} dated reference(s) with 0 look-ahead primitives or cross-file cutoff conflicts.`,
            `- Fee/slippage modeling meets >= ${minFeeBps} bps rule.`,
            `Send action: Disabled — Confirm point-in-time release lag before out-of-sample sign-off.`
          ].join("\n"),
      humanDecision: "Verify point-in-time data release dates (not only observation timestamps) and full experiment selection history."
    };
  }

  function analyzeReplyCraft(files, rules, extra) {
    const question = String((extra && extra.question) || "").trim();
    const qTokens = tokenize(question);
    const minTokens = Math.max(1, Number(rules.minMatchTokens || 1));
    const minClauses = Math.max(1, Number(rules.minMatchedClauses || 1));
    const flagConflicts = rules.flagPolicyConflicts !== false;
    const reqProvenance = rules.requireProvenanceHeader !== false;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    const matched = [];
    let hasSourceHeader = false;
    let totalLines = 0;

    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        totalLines++;
        if (/source\s*:|policy\s*id|effective\s*:|handbook|section\s+\d|rule\s+\d|addendum/i.test(l.raw)) {
          hasSourceHeader = true;
        }
        const lTokens = new Set(tokenize(l.raw));
        const overlap = qTokens.filter((t) => lTokens.has(t));
        if (overlap.length >= minTokens) {
          matched.push({ file: f.name, line: l, score: overlap.length, overlap });
        }
      }
    }

    matched.sort((a, b) => b.score - a.score || a.line.num - b.line.num);
    const top = matched.slice(0, 6);

    // Cross-policy day-window contradiction check
    let conflictCount = 0;
    if (flagConflicts && top.length >= 2) {
      const windows = top
        .map((m) => {
          const dm = m.line.raw.match(/\b(\d+)\s+(?:calendar\s+|business\s+)?days?\b/i);
          return dm ? { ...m, days: Number(dm[1]) } : null;
        })
        .filter(Boolean);
      for (let i = 0; i < windows.length; i++) {
        for (let j = i + 1; j < windows.length; j++) {
          const a = windows[i];
          const b = windows[j];
          if (a.file === b.file) continue;
          const shared = a.overlap.filter((w) => b.overlap.includes(w));
          if (shared.length >= 2 && a.days !== b.days) {
            conflictCount++;
            findings.push({
              severity: "high",
              rule: "RC-POLICY-CONFLICT",
              title: `Cross-policy day-window conflict (${a.days}d vs ${b.days}d) on "${shared.join(", ")}"`,
              detail: `${a.file} specifies ${a.days} day(s) while ${b.file} specifies ${b.days} day(s) on overlapping clauses.`,
              citations: [
                { file: a.file, line: a.line.num },
                { file: b.file, line: b.line.num }
              ],
              quote: `${formatCite(a.file, a.line.num)} ${a.line.raw}\n${formatCite(b.file, b.line.num)} ${b.line.raw}`
            });
          }
        }
      }
    }

    if (!question) haltReasons.push("No question supplied — enter the question to answer from loaded policy documents.");
    if (top.length < minClauses) {
      haltReasons.push(`Only ${top.length} clause(s) met the overlap floor (need >= ${minClauses} clause(s) with >= ${minTokens} matching term(s) for "${question || "empty"}"). Draft halted rather than inventing an unsupported reply.`);
      let shown = 0;
      for (const f of files) {
        for (const l of f.lines) {
          if (!l.trimmed) continue;
          findings.push({
            severity: "medium",
            rule: "RC-NO-MATCH",
            title: `Unmatched source line ${formatCite(f.name, l.num)}`,
            detail: `Line did not meet the >= ${minTokens} keyword overlap threshold for the question.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
          shown++;
          if (shown >= 5) break;
        }
        if (shown >= 5) break;
      }
    } else {
      top.forEach((m) => {
        findings.push({
          severity: "pass",
          rule: "RC-CITED-CLAUSE",
          title: `Matched ${m.score} term(s) on ${formatCite(m.file, m.line.num)}: ${m.overlap.join(", ")}`,
          detail: `Substantiates the question verbatim from ${m.file}.`,
          citations: [{ file: m.file, line: m.line.num }],
          quote: `${formatCite(m.file, m.line.num)} ${m.line.raw}`
        });
      });
    }

    if (reqProvenance && !hasSourceHeader) {
      haltReasons.push("Loaded documents lack explicit policy provenance metadata (expected Policy ID, Source:, Effective:, or Section/Rule marker).");
    }
    if (conflictCount > 0) {
      haltReasons.push(`${conflictCount} cross-policy contradiction(s) detected across loaded files — resolve controlling policy before replying.`);
    }

    rulesEvaluated.push(
      { id: "RC-MIN-OVERLAP", status: top.length < minClauses ? "flagged" : "pass", detail: `minTokens=${minTokens}, minClauses=${minClauses}, matched=${top.length}` },
      { id: "RC-PROVENANCE", status: (reqProvenance && !hasSourceHeader) ? "flagged" : "pass", detail: `required=${reqProvenance}, present=${hasSourceHeader}` },
      { id: "RC-CONFLICT", status: conflictCount ? "flagged" : "pass", detail: `conflicts=${conflictCount}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Draft halted across ${files.length} policy file(s): insufficient grounded evidence or unresolved contradiction (${top.length} matched clause(s)).`
        : `Grounded reply draft assembled strictly from ${top.length} verbatim clause(s) across ${files.length} file(s); Send action disabled.`,
      metrics: [
        ["Files / Lines", `${files.length} / ${totalLines}`],
        ["Matched clauses", top.length],
        ["Provenance", hasSourceHeader ? "Present" : "Missing"],
        ["Send action", "Disabled"]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Re: ${question}`,
            ``,
            `Based strictly on the supplied policy document(s):`,
            ...top.map((m) => `- ${m.line.trimmed} ${formatCite(m.file, m.line.num)}`),
            ``,
            `[Send action: Disabled — Human review required before sending through an approved channel.]`
          ].join("\n"),
      humanDecision: "Confirm the cited policy revision applies to this customer case and send manually outside this workbench."
    };
  }

  function analyzeHandoffHub(files, rules, extra) {
    const topic = String((extra && extra.topic) || "").trim();
    const tTokens = tokenize(topic);
    const reqSections = parseCommaList(rules.mandatorySections);
    const reqRosterMatch = rules.requireRosterMatch !== false;
    const reqOwner = rules.requireOpenActionsCited !== false;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    const owners = [];
    const actions = [];
    const matches = [];

    const rosterFiles = files.filter((f) => /roster|oncall|directory|team/i.test(f.name) || /#\s*.*roster/i.test(f.text));
    const rosterHandles = new Set();
    rosterFiles.forEach((rf) => {
      (rf.text.match(/@[a-z0-9._-]+/gi) || []).forEach((h) => rosterHandles.add(h.toLowerCase()));
    });

    const fullTextLower = files.map((f) => f.text.toLowerCase()).join("\n");
    let orphanCount = 0;

    for (const f of files) {
      const isRoster = rosterFiles.includes(f);
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        const handles = l.raw.match(/@[a-z0-9._-]+/gi) || [];
        if (/\b(?:owner|team|escalation|maintainer|primary|secondary)\s*:/i.test(l.raw) || handles.length > 0) {
          owners.push({ file: f.name, line: l });
          findings.push({
            severity: "pass",
            rule: "HH-OWNER",
            title: `Owner / routing attribution on ${formatCite(f.name, l.num)}`,
            detail: `Explicit human routing target found in ${f.name}.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
        if (reqRosterMatch && rosterHandles.size > 0 && !isRoster && handles.length > 0) {
          handles.forEach((h) => {
            if (!rosterHandles.has(h.toLowerCase())) {
              orphanCount++;
              findings.push({
                severity: "high",
                rule: "HH-ORPHAN-OWNER",
                title: `Unverified handle ${h} on ${formatCite(f.name, l.num)} absent from roster`,
                detail: `Handle ${h} is referenced in ${f.name} but does not appear in loaded roster file(s): ${rosterFiles.map((r) => r.name).join(", ")}.`,
                citations: [{ file: f.name, line: l.num }, { file: rosterFiles[0].name, line: 1 }],
                quote: `${formatCite(f.name, l.num)} ${l.raw}`
              });
            }
          });
        }
        if (/^\s*-\s*\[\s*\]|\b(?:todo|fixme|action|next\s+step)\s*:/i.test(l.raw)) {
          actions.push({ file: f.name, line: l });
          findings.push({
            severity: "medium",
            rule: "HH-ACTION",
            title: `Open action item on ${formatCite(f.name, l.num)}`,
            detail: `Requires explicit completion and verification during handoff.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
        if (tTokens.length > 0) {
          const lTokens = new Set(tokenize(l.raw));
          const hit = tTokens.filter((w) => lTokens.has(w));
          if (hit.length > 0) {
            matches.push({ file: f.name, line: l });
            findings.push({
              severity: "pass",
              rule: "HH-TOPIC-EXCERPT",
              title: `Topic match (${hit.join(", ")}) on ${formatCite(f.name, l.num)}`,
              detail: `Verbatim excerpt matching handoff topic "${topic}".`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }
      }
    }

    const missingSections = reqSections.filter((sec) => !fullTextLower.includes(sec.toLowerCase()));
    if (missingSections.length > 0) {
      findings.push({
        severity: "medium",
        rule: "HH-MISSING-SECTION",
        title: `Missing expected runbook section(s): ${missingSections.join(", ")}`,
        detail: `Configured Rule Pack expects these sections across the handoff bundle.`,
        citations: files.length ? [{ file: files[0].name, line: 1 }] : [],
        quote: `Expected: ${reqSections.join(", ")}`
      });
    }

    addGenericCoverageFindings(files, findings, "HH");
    if (reqOwner && owners.length === 0) haltReasons.push("No explicit owner, team, or @handle attribution found across loaded documents.");
    if (orphanCount > 0) haltReasons.push(`${orphanCount} @handle(s) referenced in runbooks are missing from the loaded on-call roster.`);
    if (tTokens.length > 0 && matches.length === 0) haltReasons.push(`Topic filter "${topic}" matched zero lines across loaded documents.`);

    rulesEvaluated.push(
      { id: "HH-OWNER", status: (reqOwner && !owners.length) ? "flagged" : "pass", detail: `owners=${owners.length}` },
      { id: "HH-ROSTER-MATCH", status: orphanCount ? "flagged" : "pass", detail: `rosterHandles=${rosterHandles.size}, orphans=${orphanCount}` },
      { id: "HH-SECTIONS", status: missingSections.length ? "flagged" : "pass", detail: `missing=${missingSections.length}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Handoff halted across ${files.length} file(s): ${owners.length} owner ref(s), ${orphanCount} orphaned handle(s), ${actions.length} open action(s).`
        : `Compiled cited handoff across ${files.length} file(s) with ${owners.length} verified owner ref(s) and ${actions.length} open action(s).`,
      metrics: [
        ["Owner refs", owners.length],
        ["Orphan handles", orphanCount],
        ["Open actions", actions.length],
        ["Gate status", draftHalted ? "Halted" : "Ready"]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Handoff Summary${topic ? ` (${topic})` : ""} (${files.length} file(s)):`,
            `Owners: ${owners.slice(0, 6).map((o) => `${o.line.trimmed} ${formatCite(o.file, o.line.num)}`).join(" | ")}`,
            ...(actions.length ? ["Open Actions:", ...actions.map((a) => `- ${a.line.trimmed} ${formatCite(a.file, a.line.num)}`)] : []),
            ...(matches.length ? ["Cited Excerpts:", ...matches.slice(0, 6).map((m) => `- ${m.line.trimmed} ${formatCite(m.file, m.line.num)}`)] : []),
            `Send action: Disabled — Team lead confirmation required before transfer.`
          ].join("\n"),
      humanDecision: "Confirm recipient access permissions, update orphaned handles, and verify live on-call rotation."
    };
  }

  function analyzeSentinelDesk(files, rules) {
    const blockOnMedium = Boolean(rules.blockOnMedium);
    const reqLogTs = rules.requireLogTimestamps !== false;
    const maxCves = Math.max(0, Number(rules.maxAllowedCves || 0));

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    let highCount = 0;
    let medCount = 0;
    const cveSet = new Set();
    let totalLines = 0;
    let missingTsCount = 0;

    const staticRules = [
      { sev: "high", rule: "SD-SECRET-KEY", re: /\b(?:sk-[a-zA-Z0-9_-]{12,}|ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)\b/, title: "Hardcoded credential / key token", detail: "Secret token detected. Revoke and rotate immediately.", redact: true },
      { sev: "high", rule: "SD-PASSWORD-LIT", re: /\b(?:password|passwd|api_?key|secret|token)\s*[:=]\s*['"][^'"]{6,}['"]/i, title: "Hardcoded secret assignment", detail: "Inject credentials from a secret manager rather than source literals.", redact: true },
      { sev: "high", rule: "SD-SHELL-EXEC", re: /\b(?:shell\s*=\s*True|os\.system\(|eval\(|new Function\(|exec\(|child_process\.exec\()/, title: "Dangerous command/code execution sink", detail: "Dynamic shell or eval sink risks command/code injection on untrusted input." },
      { sev: "high", rule: "SD-XSS-SINK", re: /\b(?:innerHTML\s*=|dangerouslySetInnerHTML|document\.write\()/, title: "Raw HTML injection sink", detail: "Assigning unescaped markup to DOM sinks risks XSS." },
      { sev: "high", rule: "SD-SQL-INTERP", re: /\b(?:SELECT|INSERT|UPDATE|DELETE)\b[^\n]*(?:f['"]|\+\s*[a-z_]+|\$\{)/i, title: "Possible SQL string interpolation", detail: "Use parameterized prepared statements rather than interpolated SQL strings." },
      { sev: "high", rule: "SD-TLS-OFF", re: /\b(?:verify\s*=\s*False|rejectUnauthorized\s*:\s*false|InsecureSkipVerify\s*:\s*true)\b/, title: "TLS certificate verification disabled", detail: "Disabling certificate verification exposes traffic to MITM interception." },
      { sev: "medium", rule: "SD-CORS-STAR", re: /(?:Access-Control-Allow-Origin|CORS_ALLOW_ORIGIN)[^\n]*['"]\*['"]/i, title: "Wildcard CORS origin (*)", detail: "Verify whether unauthenticated wildcard access is intended; never pair with credentials." },
      { sev: "medium", rule: "SD-UNSAFE-BLOCK", re: /\bunsafe\s*\{/, title: "Rust unsafe block requires soundness review", detail: "Confirm safety invariants and memory bounds." },
      { sev: "medium", rule: "SD-LOG-ERROR", re: /\b(?:FATAL|CRITICAL|ERROR|HTTP\s+50[0-9]|401\s+Unauthorized|403\s+Forbidden|panic|segfault)\b/i, title: "Error / auth-failure log signal", detail: "Operational or security fault event requiring responder triage." }
    ];

    const codeSymbols = new Map();
    const logFaults = [];

    for (const f of files) {
      const isLog = /\.log$/i.test(f.name) || /incident|audit/i.test(f.name);
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        totalLines++;

        // Index code function/handler definitions for cross-file log correlation
        if (!isLog) {
          const defM = l.raw.match(/\b(?:def|function|fn|async\s+function)\s+([a-zA-Z_][a-zA-Z0-9_]{3,})/);
          if (defM) codeSymbols.set(defM[1], { file: f.name, line: l });
        }

        const cves = l.raw.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || [];
        if (cves.length) {
          cves.forEach((c) => cveSet.add(c.toUpperCase()));
          highCount++;
          findings.push({
            severity: "high",
            rule: "SD-CVE",
            title: `Referenced vulnerability ${cves.join(", ")} on ${formatCite(f.name, l.num)}`,
            detail: `Map CVE to affected asset version and confirm remediation due date against CISA KEV / vendor advisory.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }

        if (isLog && /\b(?:ERROR|CRITICAL|FATAL|50\d|403|401)\b/i.test(l.raw)) {
          logFaults.push({ file: f.name, line: l });
          if (reqLogTs && !/\b20\d{2}-\d{2}-\d{2}[T\s]\d{2}:\d{2}/.test(l.raw)) {
            missingTsCount++;
            medCount++;
            findings.push({
              severity: "medium",
              rule: "SD-LOG-NO-TS",
              title: `Incident log fault missing ISO timestamp on ${formatCite(f.name, l.num)}`,
              detail: `Chronological triage requires verifiable ISO-8601 timestamps on log lines.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }

        for (const r of staticRules) {
          if (r.re.test(l.raw)) {
            if (r.sev === "high") highCount++;
            else medCount++;
            const safeLine = r.redact
              ? l.raw.replace(/(sk-[a-zA-Z0-9_-]{4})[a-zA-Z0-9_-]+/g, "$1[REDACTED]").replace(/(['"])[^'"]{8,}(['"])/g, "$1[REDACTED]$2")
              : l.raw;
            findings.push({
              severity: r.sev,
              rule: r.rule,
              title: `${r.title} on ${formatCite(f.name, l.num)}`,
              detail: r.detail,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${safeLine}`
            });
          }
        }
      }
    }

    // Cross-file log -> code handler correlation
    let corrCount = 0;
    for (const lf of logFaults) {
      for (const [sym, loc] of codeSymbols.entries()) {
        if (lf.line.raw.includes(sym)) {
          corrCount++;
          findings.push({
            severity: "high",
            rule: "SD-LOG-CODE-CORR",
            title: `Log fault correlated to handler "${sym}" across ${lf.file} -> ${loc.file}`,
            detail: `Runtime fault in ${lf.file} directly references handler "${sym}" defined in ${loc.file}.`,
            citations: [
              { file: lf.file, line: lf.line.num },
              { file: loc.file, line: loc.line.num }
            ],
            quote: `${formatCite(lf.file, lf.line.num)} ${lf.line.raw}\n${formatCite(loc.file, loc.line.num)} ${loc.line.raw}`
          });
        }
      }
    }

    addGenericCoverageFindings(files, findings, "SD");
    if (highCount > 0) haltReasons.push(`${highCount} HIGH-severity security/CVE finding(s) remain open — clearance sign-off is halted.`);
    if (blockOnMedium && medCount > 0) haltReasons.push(`Strict policy enabled (blockOnMedium=true): ${medCount} MEDIUM finding(s) halt clearance.`);
    if (cveSet.size > maxCves) haltReasons.push(`${cveSet.size} open CVE reference(s) exceed configured cap (${maxCves}).`);
    if (reqLogTs && missingTsCount > 0) haltReasons.push(`${missingTsCount} incident log fault line(s) lack verifiable ISO timestamps.`);

    rulesEvaluated.push(
      { id: "SD-STATIC-SINKS", status: highCount ? "flagged" : "pass", detail: `high=${highCount}, medium=${medCount}` },
      { id: "SD-CVE-CAP", status: cveSet.size > maxCves ? "flagged" : "pass", detail: `cves=${cveSet.size}, max=${maxCves}` },
      { id: "SD-CROSS-CORR", status: corrCount ? "flagged" : "pass", detail: `log->code correlations=${corrCount}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Triage halted clearance across ${files.length} file(s): ${highCount} HIGH, ${medCount} MEDIUM, and ${corrCount} log-to-code correlation(s).`
        : `Scanned ${totalLines} line(s) across ${files.length} file(s): zero blocking findings (${medCount} medium note(s)).`,
      metrics: [
        ["Files / Lines", `${files.length} / ${totalLines}`],
        ["High severity", highCount],
        ["CVE refs", cveSet.size],
        ["Log->Code links", corrCount]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Security Triage Clearance Draft (${files.length} file(s)):`,
            `- Deterministic static scan inspected ${totalLines} lines with 0 blocking secret, sink, TLS, or CVE violations.`,
            `Send action: Disabled — Static checks do not replace runtime testing or live asset mapping.`
          ].join("\n"),
      humanDecision: "Validate each finding against real asset inventory and rotate any exposed secrets before closing the ticket."
    };
  }

  function analyzeSearchLift(files, rules) {
    const minTitle = Math.max(1, Number(rules.minTitleLen || 10));
    const maxTitle = Math.max(minTitle, Number(rules.maxTitleLen || 65));
    const reqMeta = rules.requireMetaDescription !== false;
    const checkCross = rules.checkCrossDocLinks !== false;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    let highCount = 0;
    let headingCount = 0;
    let wordCount = 0;
    const titleRegistry = new Map();
    const loadedNames = new Set(files.map((f) => f.name.toLowerCase()));
    const outboundLocalLinks = [];

    for (const f of files) {
      const rawText = f.text;
      const isHtml = /\.html?$/i.test(f.name) || /<(?:!doctype|html|head|body|h1|h2|p|a|img|title)\b/i.test(rawText);
      wordCount += (rawText.replace(/<[^>]+>/g, " ").match(/\b\w+\b/g) || []).length;

      const findLine = (re) => f.lines.find((l) => re.test(l.raw)) || f.lines.find((l) => l.trimmed) || { num: 1, raw: "" };

      if (isHtml) {
        const doc = new DOMParser().parseFromString(rawText, "text/html");
        const titleEl = doc.querySelector("title");
        const titleText = titleEl ? titleEl.textContent.trim() : "";
        if (!titleText) {
          highCount++;
          const l = findLine(/<head|<html/i);
          findings.push({ severity: "high", rule: "SL-MISSING-TITLE", title: `Missing <title> in ${f.name}`, detail: `HTML document lacks a non-empty <title>.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw || "(head missing title)"}` });
        } else {
          const l = findLine(/<title/i);
          const key = titleText.toLowerCase();
          if (!titleRegistry.has(key)) titleRegistry.set(key, []);
          titleRegistry.get(key).push({ file: f.name, line: l, title: titleText });
          if (titleText.length < minTitle || titleText.length > maxTitle) {
            findings.push({ severity: "medium", rule: "SL-TITLE-LEN", title: `<title> length (${titleText.length}) outside ${minTitle}-${maxTitle} on ${formatCite(f.name, l.num)}`, detail: `Title "${titleText}" falls outside configured bounds.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
        }

        const metaDesc = doc.querySelector('meta[name="description"]');
        if (reqMeta && (!metaDesc || !(metaDesc.getAttribute("content") || "").trim())) {
          const l = findLine(/<head|<title/i);
          findings.push({ severity: "medium", rule: "SL-META-DESC", title: `Missing <meta name="description"> in ${f.name}`, detail: `Add a concise summary meta description in <head>.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        }

        const headings = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")];
        headingCount += headings.length;
        const h1s = headings.filter((h) => h.tagName === "H1");
        if (h1s.length !== 1) {
          highCount++;
          const l = findLine(/<h1|<body/i);
          findings.push({ severity: "high", rule: "SL-H1-COUNT", title: `Expected 1 <h1> in ${f.name}, found ${h1s.length}`, detail: `Each HTML document should declare one primary <h1> landmark.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        } else {
          const h1Text = h1s[0].textContent.trim();
          const l = findLine(/<h1/i);
          const key = h1Text.toLowerCase();
          if (!titleRegistry.has(key)) titleRegistry.set(key, []);
          if (!titleRegistry.get(key).some((x) => x.file === f.name)) {
            titleRegistry.get(key).push({ file: f.name, line: l, title: h1Text });
          }
        }

        let prevLvl = 0;
        headings.forEach((h) => {
          const lvl = Number(h.tagName.slice(1));
          if (prevLvl && lvl > prevLvl + 1) {
            const l = findLine(new RegExp(`<h${lvl}\\b`, "i"));
            findings.push({ severity: "medium", rule: "SL-HEADING-SKIP", title: `Heading skip (<h${prevLvl}> -> <h${lvl}>) on ${formatCite(f.name, l.num)}`, detail: `Heading "${h.textContent.trim()}" skips outline hierarchy.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
          prevLvl = lvl;
        });

        f.lines.forEach((l) => {
          if (/<img\b(?![^>]*\balt\s*=)/i.test(l.raw)) {
            highCount++;
            findings.push({ severity: "high", rule: "SL-IMG-ALT", title: `Image missing alt attribute on ${formatCite(f.name, l.num)}`, detail: `Provide descriptive alt text or alt="" for decorative images.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
          if (/<a\b[^>]*href\s*=\s*["'](?:#|\s*)["'][^>]*>|<a\b[^>]*>\s*(?:click here|here|more|link)\s*<\/a>/i.test(l.raw)) {
            highCount++;
            findings.push({ severity: "high", rule: "SL-WEAK-LINK", title: `Placeholder or non-descriptive link on ${formatCite(f.name, l.num)}`, detail: `Replace href="#" placeholders and generic "click here" labels.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
          const hrefMatches = [...l.raw.matchAll(/href\s*=\s*["']([^"'#?]+)["']/gi)];
          hrefMatches.forEach((hm) => {
            const target = hm[1].trim();
            if (target && !/^(?:https?:|mailto:|tel:|\/)/i.test(target) && /\.(?:html?|md)$/i.test(target)) {
              outboundLocalLinks.push({ file: f.name, line: l, target });
            }
          });
        });
      } else {
        let prevLvl = 0;
        let h1Count = 0;
        for (const l of f.lines) {
          if (!l.trimmed) continue;
          const hm = l.raw.match(/^(#{1,6})\s+(.+)/);
          if (hm) {
            headingCount++;
            const lvl = hm[1].length;
            if (lvl === 1) {
              h1Count++;
              const key = hm[2].trim().toLowerCase();
              if (!titleRegistry.has(key)) titleRegistry.set(key, []);
              titleRegistry.get(key).push({ file: f.name, line: l, title: hm[2].trim() });
            }
            if (prevLvl && lvl > prevLvl + 1) {
              findings.push({ severity: "medium", rule: "SL-MD-SKIP", title: `Markdown heading skip (H${prevLvl} -> H${lvl}) on ${formatCite(f.name, l.num)}`, detail: `Avoid skipping heading levels.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
            }
            prevLvl = lvl;
          }
          if (/!\[\s*\]\([^)]+\)/.test(l.raw)) {
            highCount++;
            findings.push({ severity: "high", rule: "SL-MD-IMG-ALT", title: `Markdown image with empty alt text on ${formatCite(f.name, l.num)}`, detail: `Add concise alt text inside ![alt](url).`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
          if (/\[(?:click here|here|link)\]\(/i.test(l.raw) || /\]\(\s*(?:#|)\s*\)/.test(l.raw)) {
            highCount++;
            findings.push({ severity: "high", rule: "SL-MD-LINK", title: `Generic or empty Markdown link on ${formatCite(f.name, l.num)}`, detail: `Replace empty hrefs or "click here" labels.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
          }
          const mdLinks = [...l.raw.matchAll(/\[[^\]]+\]\(([^)#?\s]+)\)/g)];
          mdLinks.forEach((ml) => {
            const target = ml[1].trim();
            if (target && !/^(?:https?:|mailto:|\/)/i.test(target) && /\.(?:html?|md)$/i.test(target)) {
              outboundLocalLinks.push({ file: f.name, line: l, target });
            }
          });
        }
        if (h1Count === 0) {
          highCount++;
          const first = f.lines.find((l) => l.trimmed) || { num: 1, raw: "" };
          findings.push({ severity: "high", rule: "SL-NO-H1", title: `No top-level heading (# Title) in ${f.name}`, detail: `Add one primary title heading before publishing.`, citations: [{ file: f.name, line: first.num }], quote: `${formatCite(f.name, first.num)} ${first.raw}` });
        }
      }
    }

    // Cross-document duplicate titles & broken sibling links
    let crossIssues = 0;
    if (checkCross && files.length >= 2) {
      for (const [, entries] of titleRegistry.entries()) {
        const uniqueFiles = [...new Set(entries.map((e) => e.file))];
        if (uniqueFiles.length >= 2) {
          crossIssues++;
          highCount++;
          findings.push({
            severity: "high",
            rule: "SL-DUP-TITLE",
            title: `Duplicate page title/H1 "${entries[0].title}" across ${uniqueFiles.join(", ")}`,
            detail: `Multiple pages share the exact same primary heading/title; differentiate titles for accessibility and navigation.`,
            citations: entries.map((e) => ({ file: e.file, line: e.line.num })),
            quote: entries.map((e) => `${formatCite(e.file, e.line.num)} ${e.line.raw}`).join("\n")
          });
        }
      }
      for (const lnk of outboundLocalLinks) {
        const baseTarget = lnk.target.replace(/^\.\//, "").toLowerCase();
        if (!loadedNames.has(baseTarget)) {
          crossIssues++;
          highCount++;
          findings.push({
            severity: "high",
            rule: "SL-BROKEN-SIBLING",
            title: `Unresolved sibling link "${lnk.target}" on ${formatCite(lnk.file, lnk.line.num)}`,
            detail: `Relative target "${lnk.target}" is not present among loaded sibling files (${files.map((x) => x.name).join(", ")}).`,
            citations: [{ file: lnk.file, line: lnk.line.num }],
            quote: `${formatCite(lnk.file, lnk.line.num)} ${lnk.line.raw}`
          });
        }
      }
    }

    addGenericCoverageFindings(files, findings, "SL");
    if (highCount > 0) haltReasons.push(`${highCount} structural accessibility or cross-page link blocker(s) halt publication sign-off.`);
    if (headingCount === 0) haltReasons.push("No document headings found across loaded files.");

    rulesEvaluated.push(
      { id: "SL-TITLE-BOUNDS", status: "evaluated", detail: `${minTitle}-${maxTitle} chars` },
      { id: "SL-META-DESC", status: reqMeta ? "evaluated" : "skipped", detail: `required=${reqMeta}` },
      { id: "SL-CROSS-DOC", status: crossIssues ? "flagged" : "pass", detail: `enabled=${checkCross}, crossIssues=${crossIssues}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Audited ${files.length} page(s) (${wordCount} words): ${highCount} structural/cross-link blocker(s) halted sign-off.`
        : `Audited ${files.length} page(s) (${wordCount} words, ${headingCount} headings): zero accessibility or cross-page blockers.`,
      metrics: [
        ["Pages / Words", `${files.length} / ${wordCount}`],
        ["Headings", headingCount],
        ["Cross issues", crossIssues],
        ["Blockers", highCount]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Content Audit Sign-Off Draft (${files.length} file(s)):`,
            `- Inspected ${wordCount} words and ${headingCount} headings with zero alt, link, H1, or cross-page blockers.`,
            `Send action: Disabled — Editorial accuracy remains a human decision.`
          ].join("\n"),
      humanDecision: "Approve editorial edits separately; offline structural checks never infer search rankings."
    };
  }

  function analyzePipelineRelay(files, rules) {
    const allowed = new Set(parseCommaList(rules.allowedLicenses).map((s) => s.toUpperCase()));
    const reqConsent = rules.requireConsentProof !== false;
    const blockPii = rules.blockPii !== false;

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    let identityLoc = null;
    const licenseLocs = [];
    let consentLoc = null;
    let piiCount = 0;
    let unpinnedCount = 0;
    let disallowedLicCount = 0;
    let licConflict = false;

    const spdxRe = /\b(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause|ISC|GPL-2\.0|GPL-3\.0|AGPL-3\.0|LGPL-3\.0|Proprietary|UNLICENSED)\b/i;

    for (const f of files) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        if (!identityLoc && /"(?:name|repository|full_name)"\s*:|^name\s*=|github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+/i.test(l.raw)) {
          identityLoc = { file: f.name, line: l };
          findings.push({ severity: "pass", rule: "PR-IDENTITY", title: `Package / account identity on ${formatCite(f.name, l.num)}`, detail: `Verified source identifier in ${f.name}.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        }
        const lm = l.raw.match(spdxRe);
        if (lm) {
          const spdx = lm[1];
          licenseLocs.push({ file: f.name, line: l, spdx });
          const isAllowed = allowed.size === 0 || allowed.has(spdx.toUpperCase());
          if (!isAllowed) {
            disallowedLicCount++;
            findings.push({
              severity: "high",
              rule: "PR-DISALLOWED-LICENSE",
              title: `Disallowed SPDX license "${spdx}" on ${formatCite(f.name, l.num)}`,
              detail: `License "${spdx}" is outside the Rule Pack allowlist (${[...allowed].join(", ")}).`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          } else {
            findings.push({
              severity: "pass",
              rule: "PR-LICENSE",
              title: `Allowed SPDX license "${spdx}" on ${formatCite(f.name, l.num)}`,
              detail: `Matches configured SPDX allowlist.`,
              citations: [{ file: f.name, line: l.num }],
              quote: `${formatCite(f.name, l.num)} ${l.raw}`
            });
          }
        }
        if (!consentLoc && /\b(?:consent|authorized|approved|permission)\b/i.test(l.raw)) {
          consentLoc = { file: f.name, line: l };
          findings.push({ severity: "pass", rule: "PR-CONSENT", title: `Consent / authorization record on ${formatCite(f.name, l.num)}`, detail: `Explicit consent/permission reference cited.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        }
        if (/:\s*"(?:\*|latest)"|version\s*=\s*"\*"/i.test(l.raw)) {
          unpinnedCount++;
          findings.push({ severity: "high", rule: "PR-UNPINNED-DEP", title: `Unpinned wildcard dependency on ${formatCite(f.name, l.num)}`, detail: `Wildcard or "latest" versions break reproducible builds and supply-chain verification.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        }
        if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/i.test(l.raw)) {
          piiCount++;
          findings.push({ severity: blockPii ? "high" : "medium", rule: "PR-PII-CONTACT", title: `Direct contact PII detected on ${formatCite(f.name, l.num)}`, detail: `De-identified handoffs should replace raw emails/phones with opaque owner codes.`, citations: [{ file: f.name, line: l.num }], quote: `${formatCite(f.name, l.num)} ${l.raw}` });
        }
      }
    }

    // Cross-file SPDX conflict check
    const distinctSpdx = [...new Set(licenseLocs.map((x) => x.spdx.toUpperCase()))];
    if (distinctSpdx.length >= 2) {
      licConflict = true;
      findings.push({
        severity: "high",
        rule: "PR-LICENSE-CONFLICT",
        title: `Cross-file license conflict (${distinctSpdx.join(" vs ")})`,
        detail: `Loaded files declare contradictory SPDX licenses; reconcile manifest and handoff notices before sharing.`,
        citations: licenseLocs.map((x) => ({ file: x.file, line: x.line.num })),
        quote: licenseLocs.map((x) => `${formatCite(x.file, x.line.num)} ${x.line.raw}`).join("\n")
      });
    }

    addGenericCoverageFindings(files, findings, "PR");
    if (!identityLoc) haltReasons.push("Missing repository/package/account identity line across loaded files.");
    if (licenseLocs.length === 0) haltReasons.push("Missing SPDX license declaration across loaded files.");
    if (licConflict) haltReasons.push(`Conflicting SPDX licenses detected across files (${distinctSpdx.join(" vs ")}).`);
    if (disallowedLicCount > 0) haltReasons.push(`${disallowedLicCount} license marker(s) violate the configured SPDX allowlist.`);
    if (reqConsent && !consentLoc) haltReasons.push("Missing explicit consent/authorization record (required by Rule Pack).");
    if (blockPii && piiCount > 0) haltReasons.push(`${piiCount} direct contact PII item(s) must be redacted before external handoff.`);
    if (unpinnedCount > 0) haltReasons.push(`${unpinnedCount} unpinned wildcard dependency specification(s) block release handoff.`);

    rulesEvaluated.push(
      { id: "PR-LICENSE-ALLOWLIST", status: (disallowedLicCount || licConflict || !licenseLocs.length) ? "flagged" : "pass", detail: `allowed=[${[...allowed].join(",")}]` },
      { id: "PR-CONSENT", status: (reqConsent && !consentLoc) ? "flagged" : "pass", detail: `required=${reqConsent}` },
      { id: "PR-PII", status: (blockPii && piiCount) ? "flagged" : "pass", detail: `blockPii=${blockPii}, hits=${piiCount}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Handoff halted across ${files.length} file(s): ${haltReasons.length} compliance gate(s) failed (${piiCount} PII, ${unpinnedCount} unpinned dep, ${disallowedLicCount} license issue).`
        : `Identity, SPDX allowlist, and consent metadata verified across ${files.length} file(s) with 0 PII leaks or wildcard deps.`,
      metrics: [
        ["Identity", identityLoc ? formatCite(identityLoc.file, identityLoc.line.num) : "Missing"],
        ["Licenses", distinctSpdx.length ? distinctSpdx.join(" / ") : "Missing"],
        ["PII flags", piiCount],
        ["Unpinned deps", unpinnedCount]
      ],
      findings,
      rulesEvaluated,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Compliance Handoff Receipt (${files.length} file(s)):`,
            `- Identity: ${identityLoc.line.trimmed} ${formatCite(identityLoc.file, identityLoc.line.num)}`,
            ...(licenseLocs.length ? [`- License: ${licenseLocs[0].spdx} ${formatCite(licenseLocs[0].file, licenseLocs[0].line.num)}`] : []),
            ...(consentLoc ? [`- Consent: ${consentLoc.line.trimmed} ${formatCite(consentLoc.file, consentLoc.line.num)}`] : []),
            `- Direct PII: 0 · Wildcard deps: 0 · Send action: Disabled.`
          ].join("\n"),
      humanDecision: "Confirm repository/account ownership and legal consent policy before initiating any external handoff."
    };
  }

  function analyzeOnboardPath(files, rules) {
    const mandatoryClauses = parseCommaList(rules.mandatoryClauses);
    const riskKeywords = parseCommaList(rules.riskKeywords);
    const haltOnMissing = rules.haltOnMissingClauses !== false;
    const haltOnRisk = Boolean(rules.haltOnRiskClauses);

    const findings = [];
    const haltReasons = [];
    const rulesEvaluated = [];
    const obligations = [];
    let authorityLoc = null;
    let riskCount = 0;

    const checklistFiles = files.filter((f) => /checklist|required|rubric/i.test(f.name) || /mandatory.*checklist/i.test(f.text));
    const policyFiles = files.filter((f) => !checklistFiles.includes(f));
    const activePolicy = policyFiles.length ? policyFiles[policyFiles.length - 1] : files[0];
    const baselinePolicy = policyFiles.length >= 2 ? policyFiles[0] : null;

    // 1. Real LCS Line-Level Diff if v1 + v2 policies are loaded
    let policyDiff = null;
    if (baselinePolicy && activePolicy && baselinePolicy !== activePolicy) {
      policyDiff = computeLineDiff(baselinePolicy, activePolicy);
      policyDiff.ops.forEach((op) => {
        if (op.type === "equal" || !op.text.trim()) return;
        const lower = op.text.toLowerCase();
        const hitsRisk = riskKeywords.some((kw) => lower.includes(kw.toLowerCase()));
        const isObligation = /\b(?:must|shall|required|prohibited|never|obligations?|duties|survive|remain\s+active|within\s+\d+\s+(?:hours?|business\s+days?|days?|months?)|for\s+\d+\s+(?:days?|months?|years?))\b/i.test(op.text);
        if (op.type === "add") {
          findings.push({
            severity: hitsRisk ? "high" : "medium",
            rule: hitsRisk ? "OP-DIFF-RISK-ADDED" : "OP-DIFF-ADDED",
            title: `${hitsRisk ? "High-risk clause added" : "Revision added"} in ${formatCite(activePolicy.name, op.lineB)}`,
            detail: `LCS line diff (${baselinePolicy.name} -> ${activePolicy.name}): added line${hitsRisk ? " introduces high-risk legal language" : ""}.`,
            citations: [{ file: activePolicy.name, line: op.lineB }],
            quote: `+ ${formatCite(activePolicy.name, op.lineB)} ${op.text}`
          });
        } else if (op.type === "remove") {
          findings.push({
            severity: isObligation ? "high" : "medium",
            rule: isObligation ? "OP-DIFF-OBLIGATION-DROPPED" : "OP-DIFF-REMOVED",
            title: `${isObligation ? "Obligation removed" : "Revision removed"} from ${formatCite(baselinePolicy.name, op.lineA)}`,
            detail: `LCS line diff (${baselinePolicy.name} -> ${activePolicy.name}): line was removed in ${activePolicy.name}.`,
            citations: [{ file: baselinePolicy.name, line: op.lineA }],
            quote: `- ${formatCite(baselinePolicy.name, op.lineA)} ${op.text}`
          });
        }
      });
    }

    // 2. Parse active policy (or all policy files) for authority, obligations, and risky clauses
    const scanTarget = activePolicy ? [activePolicy] : files;
    for (const f of scanTarget) {
      for (const l of f.lines) {
        if (!l.trimmed) continue;
        if (!authorityLoc && /\b(?:authority|approved\s+by|effective|policy\s+id|federal\s+register|applies\s+to)\b/i.test(l.raw)) {
          authorityLoc = { file: f.name, line: l };
          findings.push({
            severity: "pass",
            rule: "OP-AUTHORITY",
            title: `Policy authority / scope on ${formatCite(f.name, l.num)}`,
            detail: `Explicit authority or effective-date provenance recorded.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
        const matchedRisk = riskKeywords.find((kw) => l.raw.toLowerCase().includes(kw.toLowerCase()));
        if (matchedRisk) {
          riskCount++;
          findings.push({
            severity: "high",
            rule: "OP-RISK-CLAUSE",
            title: `High-risk clause ("${matchedRisk}") on ${formatCite(f.name, l.num)}`,
            detail: `Requires explicit legal or HR counsel sign-off before acceptance.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
        if (/\b(?:must|shall|required|prohibited|never|within\s+\d+\s+(?:hours?|business\s+days?|days?|months?))\b/i.test(l.raw)) {
          obligations.push({ file: f.name, line: l });
          findings.push({
            severity: "medium",
            rule: "OP-OBLIGATION",
            title: `Mandatory obligation / deadline on ${formatCite(f.name, l.num)}`,
            detail: `Extracted into reviewer checklist verbatim.`,
            citations: [{ file: f.name, line: l.num }],
            quote: `${formatCite(f.name, l.num)} ${l.raw}`
          });
        }
      }
    }

    // 3. Cross-check mandatory clauses (from Rule Pack + any loaded checklist file)
    const checklistItems = new Map();
    mandatoryClauses.forEach((kw) => checklistItems.set(kw.toLowerCase(), { keyword: kw, source: null }));
    checklistFiles.forEach((cf) => {
      cf.lines.forEach((l) => {
        const m = l.raw.match(/^\s*[-*]\s*(?:\[\s*[xX ]?\s*\]\s*)?([a-zA-Z0-9_-]{3,})\s*:/);
        if (m) {
          checklistItems.set(m[1].toLowerCase(), { keyword: m[1], source: { file: cf.name, line: l } });
        }
      });
    });

    const missingClauses = [];
    const coveredClauses = [];
    for (const [, item] of checklistItems.entries()) {
      const kwLower = item.keyword.toLowerCase();
      const matchLine = activePolicy ? activePolicy.lines.find((l) => l.raw.toLowerCase().includes(kwLower)) : null;
      if (matchLine) {
        coveredClauses.push(item.keyword);
        const cites = [{ file: activePolicy.name, line: matchLine.num }];
        if (item.source) cites.push({ file: item.source.file, line: item.source.line.num });
        findings.push({
          severity: "pass",
          rule: "OP-CLAUSE-COVERED",
          title: `Required clause "${item.keyword}" verified on ${formatCite(activePolicy.name, matchLine.num)}`,
          detail: item.source ? `Satisfies checklist requirement from ${formatCite(item.source.file, item.source.line.num)}.` : `Satisfies configured mandatory clause keyword.`,
          citations: cites,
          quote: `${formatCite(activePolicy.name, matchLine.num)} ${matchLine.raw}` + (item.source ? `\n${formatCite(item.source.file, item.source.line.num)} ${item.source.line.raw}` : "")
        });
      } else {
        missingClauses.push(item.keyword);
        const cites = item.source
          ? [{ file: item.source.file, line: item.source.line.num }]
          : activePolicy
          ? [{ file: activePolicy.name, line: 1 }]
          : [];
        findings.push({
          severity: "high",
          rule: "OP-CLAUSE-MISSING",
          title: `Missing mandatory clause "${item.keyword}" in ${activePolicy ? activePolicy.name : "policy"}`,
          detail: `Required clause keyword "${item.keyword}" was not found anywhere in ${activePolicy ? activePolicy.name : "the active document"}.`,
          citations: cites,
          quote: item.source ? `${formatCite(item.source.file, item.source.line.num)} ${item.source.line.raw}` : `Missing keyword: ${item.keyword}`
        });
      }
    }

    addGenericCoverageFindings(files, findings, "OP");
    if (!authorityLoc) haltReasons.push("Missing policy authority, effective date, or scope header — cannot issue guidance from an unattributed excerpt.");
    if (obligations.length === 0) haltReasons.push("Zero explicit obligation/requirement clauses (must/shall/required/within N days) found in active policy.");
    if (haltOnMissing && missingClauses.length > 0) haltReasons.push(`${missingClauses.length} mandatory clause(s) missing from ${activePolicy ? activePolicy.name : "active policy"}: ${missingClauses.join(", ")}.`);
    if (haltOnRisk && riskCount > 0) haltReasons.push(`Strict legal gate enabled (haltOnRiskClauses=true): ${riskCount} high-risk clause(s) require counsel clearance.`);

    rulesEvaluated.push(
      { id: "OP-LCS-DIFF", status: policyDiff ? "evaluated" : "skipped", detail: policyDiff ? `${policyDiff.fileA} -> ${policyDiff.fileB} (+${policyDiff.added}/-${policyDiff.removed})` : "single policy doc" },
      { id: "OP-MANDATORY-CLAUSES", status: missingClauses.length ? "flagged" : "pass", detail: `covered=${coveredClauses.length}/${checklistItems.size}, missing=[${missingClauses.join(",")}]` },
      { id: "OP-RISK-CLAUSES", status: riskCount ? "flagged" : "pass", detail: `hits=${riskCount}, haltOnRisk=${haltOnRisk}` }
    );
    applyCustomRegex(files, rules, findings, rulesEvaluated);

    const draftHalted = haltReasons.length > 0;
    return {
      summary: draftHalted
        ? `Policy review halted (${files.length} file(s)): ${missingClauses.length} missing clause(s), ${riskCount} risk flag(s)${policyDiff ? `, LCS diff +${policyDiff.added}/-${policyDiff.removed}` : ""}.`
        : `Verified ${coveredClauses.length}/${checklistItems.size} mandatory clauses and ${obligations.length} obligation(s) under ${formatCite(authorityLoc.file, authorityLoc.line.num)}${policyDiff ? ` (LCS diff +${policyDiff.added}/-${policyDiff.removed})` : ""}.`,
      metrics: [
        ["Clauses covered", `${coveredClauses.length}/${checklistItems.size}`],
        ["Obligations", obligations.length],
        ["Risk clauses", riskCount],
        ["LCS diff", policyDiff ? `+${policyDiff.added} / -${policyDiff.removed}` : "Single doc"]
      ],
      findings,
      rulesEvaluated,
      primaryDiff: policyDiff,
      draftHalted,
      haltReasons,
      draftText: draftHalted
        ? null
        : [
            `Cited Policy & Onboarding Checklist (${activePolicy.name}):`,
            `Authority: ${authorityLoc.line.trimmed} ${formatCite(authorityLoc.file, authorityLoc.line.num)}`,
            ...obligations.map((o) => `- [ ] ${o.line.trimmed} ${formatCite(o.file, o.line.num)}`),
            ...(riskCount > 0 ? [`Warning: ${riskCount} high-risk clause(s) flagged above require legal/HR sign-off.`] : []),
            `Send action: Disabled — HR or legal counsel must approve binding guidance.`
          ].join("\n"),
      humanDecision: "HR or legal counsel must verify revision diffs, missing clauses, and jurisdiction before issuing binding guidance."
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

  /* ==========================================================================
     PROVENANCE RECEIPT BUILDER & AUDIT EXPORTERS (.MD / .JSON / .CSV)
     ========================================================================== */

  async function computeReceiptHash(corePayload) {
    return sha256Hex(JSON.stringify(corePayload));
  }

  async function runAnalysis(toolSlug, files, rules, extra) {
    const tool = TOOLS.find((t) => t.slug === toolSlug) || TOOLS[0];
    const timestamp = new Date().toISOString();

    const inputFiles = [];
    for (const f of files) {
      const digest = f.sha256 || (await sha256Hex(f.text));
      inputFiles.push({
        name: f.name,
        lines: f.lines.length,
        bytes: new TextEncoder().encode(f.text).length,
        sha256: digest
      });
    }

    const totalNonEmpty = files.reduce((acc, f) => acc + f.lines.filter((l) => l.trimmed.length > 0).length, 0);
    if (files.length === 0 || totalNonEmpty === 0) {
      const core = {
        schemaVersion: "ias-receipt-v0.5.0",
        toolSlug: tool.slug,
        toolName: tool.name,
        category: tool.category,
        timestamp,
        inputFiles,
        activeRules: { ...rules },
        rulesEvaluated: [{ id: "INPUT-NONEMPTY", status: "flagged", detail: "zero non-empty lines" }],
        summary: "No source documents supplied — analysis and draft generation halted.",
        metrics: [["Files / Lines", "0 / 0"], ["Findings", 0], ["Evidence", "Missing"], ["Send action", "Disabled"]],
        findings: [],
        draftHalted: true,
        haltReasons: ["No source text provided. Drop/upload one or more files, paste text, or load the editable multi-file sample first."],
        draftText: null,
        humanDecision: tool.boundary
      };
      const outputReceiptSha256 = await computeReceiptHash(core);
      return {
        ...core,
        provenanceChain: {
          inputFiles,
          rulesEvaluated: core.rulesEvaluated,
          totalFindings: 0,
          uniqueCitations: 0,
          outputReceiptSha256,
          sendAction: "Disabled"
        },
        reviewedAt: null
      };
    }

    const res = ANALYZERS[tool.slug](files, rules, extra);
    const findingsWithIds = (res.findings || []).map((f, idx) => ({
      id: `F-${String(idx + 1).padStart(3, "0")}`,
      severity: f.severity || "info",
      rule: f.rule || "RULE",
      title: f.title || "",
      detail: f.detail || "",
      citations: Array.isArray(f.citations) ? f.citations : [],
      quote: f.quote || ""
    }));

    const uniqueCiteSet = new Set();
    findingsWithIds.forEach((f) => f.citations.forEach((c) => uniqueCiteSet.add(formatCite(c.file, c.line))));

    const autoDiff = res.primaryDiff || (files.length >= 2 ? computeLineDiff(files[0], files[1]) : null);

    const core = {
      schemaVersion: "ias-receipt-v0.5.0",
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      timestamp,
      inputFiles,
      activeRules: { ...rules },
      rulesEvaluated: res.rulesEvaluated || [],
      summary: res.summary,
      metrics: res.metrics,
      findings: findingsWithIds,
      series: res.series || null,
      diffSummary: autoDiff
        ? {
            fileA: autoDiff.fileA,
            fileB: autoDiff.fileB,
            algorithm: autoDiff.algorithm,
            added: autoDiff.added,
            removed: autoDiff.removed,
            unchanged: autoDiff.unchanged
          }
        : null,
      draftHalted: Boolean(res.draftHalted),
      haltReasons: res.haltReasons || [],
      draftText: res.draftText || null,
      humanDecision: res.humanDecision || tool.boundary
    };

    const outputReceiptSha256 = await computeReceiptHash(core);
    return {
      ...core,
      primaryDiff: autoDiff,
      provenanceChain: {
        inputFiles,
        rulesEvaluated: core.rulesEvaluated,
        totalFindings: findingsWithIds.length,
        uniqueCitations: uniqueCiteSet.size,
        outputReceiptSha256,
        sendAction: "Disabled"
      },
      reviewedAt: null
    };
  }

  function stripRuntimeOnly(report) {
    const { primaryDiff, reviewedAt, provenanceChain, ...core } = report;
    return core;
  }

  function reportToMarkdown(r) {
    const out = [
      `# ${r.toolName} Multi-Document Audit Report (${r.category})`,
      ``,
      `- **Schema:** \`${r.schemaVersion}\``,
      `- **Analyzed:** ${r.timestamp}`,
      `- **Draft gate:** ${r.draftHalted ? "DRAFT HALTED · REVIEW REQUIRED" : "VERIFIED · CITED DRAFT READY"}`,
      `- **Send action:** Disabled`,
      `- **Output Receipt SHA-256:** \`${r.provenanceChain.outputReceiptSha256}\``,
      `- **Human review:** ${r.reviewedAt ? `Marked reviewed at ${r.reviewedAt}` : "Pending"}`,
      ``,
      `## Input Files & SHA-256 Provenance`,
      ``,
      `| File | Lines | Bytes | SHA-256 |`,
      `| --- | ---: | ---: | --- |`,
      ...r.inputFiles.map((f) => `| \`${f.name}\` | ${f.lines} | ${f.bytes} | \`${f.sha256}\` |`),
      ``,
      `## Summary`,
      ``,
      r.summary,
      ``,
      `## Metrics`,
      ``,
      ...r.metrics.map(([k, v]) => `- **${k}:** ${v}`),
      ``,
      `## Rules Evaluated`,
      ``,
      ...r.rulesEvaluated.map((rule) => `- **${rule.id}** (${rule.status}): ${rule.detail}`),
      ``
    ];
    if (r.diffSummary) {
      out.push(
        `## Cross-Document LCS Diff`,
        ``,
        `- **Comparison:** \`${r.diffSummary.fileA}\` -> \`${r.diffSummary.fileB}\` (${r.diffSummary.algorithm})`,
        `- **Changes:** +${r.diffSummary.added} added, -${r.diffSummary.removed} removed, ${r.diffSummary.unchanged} unchanged`,
        ``
      );
    }
    out.push(`## Findings (${r.findings.length})`, ``);
    r.findings.forEach((f) => {
      const cites = f.citations.map((c) => formatCite(c.file, c.line)).join(", ");
      out.push(`### ${f.id} [${f.severity.toUpperCase()}] ${f.rule} — ${f.title}${cites ? ` (${cites})` : ""}`);
      out.push(f.detail);
      if (f.quote) {
        out.push("```text", f.quote, "```");
      }
      out.push("");
    });
    out.push("## Source-Grounded Draft Gate", "");
    if (r.draftHalted) {
      out.push("**DRAFT HALTED — MISSING OR UNRESOLVED SOURCE EVIDENCE**", "");
      r.haltReasons.forEach((x) => out.push(`- ${x}`));
    } else {
      out.push("```text", r.draftText || "", "```");
    }
    out.push("", "## Required Human Decision", "", r.humanDecision, "");
    return out.join("\n");
  }

  function csvCell(val) {
    const s = String(val ?? "");
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function reportToCsv(r) {
    const header = [
      "finding_id",
      "severity",
      "rule_id",
      "tool",
      "files",
      "citations",
      "title",
      "detail",
      "verbatim_quote",
      "draft_halted",
      "receipt_sha256"
    ];
    const rows = [header.map(csvCell).join(",")];
    const findings = r.findings.length
      ? r.findings
      : [{ id: "F-000", severity: "info", rule: "NO-FINDINGS", title: r.summary, detail: (r.haltReasons || []).join(" | "), citations: [], quote: "" }];
    findings.forEach((f) => {
      const fileList = [...new Set((f.citations || []).map((c) => c.file))].join("; ");
      const citeList = (f.citations || []).map((c) => formatCite(c.file, c.line)).join(" ");
      rows.push(
        [
          f.id,
          f.severity,
          f.rule,
          r.toolName,
          fileList,
          citeList,
          f.title,
          f.detail,
          f.quote,
          r.draftHalted ? "true" : "false",
          r.provenanceChain.outputReceiptSha256
        ]
          .map(csvCell)
          .join(",")
      );
    });
    return rows.join("\r\n") + "\r\n";
  }

  function reportToJson(r) {
    const exportObj = {
      ...stripRuntimeOnly(r),
      provenanceChain: r.provenanceChain,
      reviewedAt: r.reviewedAt
    };
    return JSON.stringify(exportObj, null, 2);
  }

  return {
    TOOLS,
    RULE_STORAGE_KEY,
    tagLine,
    formatCite,
    splitLines,
    sha256Hex,
    getDefaultRulePack,
    loadAllRulePacks,
    saveAllRulePacks,
    countCustomizedRules,
    compileCustomRegex,
    computeLineDiff,
    runAnalysis,
    computeReceiptHash,
    stripRuntimeOnly,
    reportToMarkdown,
    reportToCsv,
    reportToJson
  };
})();
