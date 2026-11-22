"use strict";

/* Industry AI Suite v0.5.0 — Multi-Document Client Workbench Controller.
   Zero external requests, zero fixture replays, Settings-only theme (via ../site/house/theme.js).
   Requires lab/engine.js (window.IAS_ENGINE). */

(function () {
  const ENG = window.IAS_ENGINE;
  if (!ENG) {
    console.error("IAS_ENGINE missing — check lab/engine.js script tag.");
    return;
  }

  const BYOK_KEY = "ias.byok.session.v1";
  const MAX_FILE_BYTES = 1024 * 1024; // 1 MB per file in-browser safety limit
  const MAX_FILES_PER_TOOL = 24;

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  };

  let fileSeq = 1;
  let currentTool = ENG.TOOLS[0];
  let rulePacks = ENG.loadAllRulePacks();
  const workspaces = new Map();

  let cmdkOpen = false;
  let cmdkItems = [];
  let cmdkIdx = 0;
  let cmdkPrevFocus = null;
  let rulesOpen = false;
  let rulesPrevFocus = null;

  function getWorkspace(slug) {
    if (!workspaces.has(slug)) {
      workspaces.set(slug, {
        files: [],
        activeFileId: null,
        report: null,
        activeTab: "findings",
        severityFilter: "all",
        filterQuery: "",
        activeFindingIdx: -1,
        diffFileA: null,
        diffFileB: null,
        diffOnlyChanges: false,
        extraValues: {}
      });
    }
    return workspaces.get(slug);
  }

  function ws() {
    return getWorkspace(currentTool.slug);
  }

  function formatBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }

  function showToast(message, tone = "") {
    const stack = $("toast-stack");
    if (!stack) return;
    const maxToasts = window.innerWidth < 640 ? 1 : 2;
    while (stack.children.length >= maxToasts) stack.firstElementChild.remove();
    const t = el("div", `toast${tone ? ` toast--${tone}` : ""}`);
    const txt = el("span", null, message);
    const close = el("button", "toast__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss notification");
    close.addEventListener("click", () => t.remove());
    t.append(txt, close);
    stack.append(t);
    setTimeout(() => {
      if (t.parentNode) t.remove();
    }, 2200);
  }

  function uniqueFileName(existingFiles, rawName) {
    const clean = String(rawName || "pasted-document.txt").trim() || "pasted-document.txt";
    const names = new Set(existingFiles.map((f) => f.name.toLowerCase()));
    if (!names.has(clean.toLowerCase())) return clean;
    const dot = clean.lastIndexOf(".");
    const base = dot > 0 ? clean.slice(0, dot) : clean;
    const ext = dot > 0 ? clean.slice(dot) : "";
    let i = 2;
    while (names.has(`${base}-${i}${ext}`.toLowerCase())) i++;
    return `${base}-${i}${ext}`;
  }

  async function makeFileDoc(name, text) {
    const str = String(text ?? "");
    const lines = ENG.splitLines(str);
    const bytes = new TextEncoder().encode(str).length;
    const sha256 = await ENG.sha256Hex(str);
    return {
      id: `doc-${fileSeq++}`,
      name,
      text: str,
      bytes,
      lines,
      sha256
    };
  }

  function getActiveFile(state = ws()) {
    if (!state.files.length) return null;
    return state.files.find((f) => f.id === state.activeFileId) || state.files[0];
  }

  /* ==========================================================================
     TOOL NAVIGATION & RULE PACK BADGE
     ========================================================================== */

  function renderNav() {
    const nav = $("workflow-nav");
    const q = ($("tool-filter")?.value || "").trim().toLowerCase();
    nav.replaceChildren();
    ENG.TOOLS.forEach((tool, idx) => {
      if (q && !`${tool.name} ${tool.category} ${tool.tagline}`.toLowerCase().includes(q)) return;
      const tWs = getWorkspace(tool.slug);
      const btn = el("button", "nav-item");
      btn.type = "button";
      btn.dataset.slug = tool.slug;
      btn.setAttribute("aria-label", `${idx + 1}. ${tool.name} — ${tool.category}`);
      if (tool.slug === currentTool.slug) btn.setAttribute("aria-current", "page");

      const right = el("span", "nav-item__right");
      if (tWs.files.length > 0) {
        right.append(el("span", "count-chip", `${tWs.files.length}f`));
      }
      right.append(el("span", "nav-item__arrow", "↗"));

      btn.append(
        el("span", "nav-number", String(idx + 1).padStart(2, "0")),
        el("span", "nav-item__name", tool.name),
        right
      );
      btn.addEventListener("click", () => selectTool(tool.slug, true));
      nav.append(btn);
    });
    if (!nav.children.length) {
      nav.append(el("p", "source-lines__empty", "No review tool matches that filter."));
    }
  }

  function updateRulesBadge() {
    const badge = $("rules-badge");
    if (!badge) return;
    const n = ENG.countCustomizedRules(currentTool.slug, rulePacks[currentTool.slug] || {});
    if (n > 0) {
      badge.textContent = `${n} custom`;
      badge.className = "count-chip count-chip--accent";
    } else {
      badge.textContent = "Default";
      badge.className = "count-chip";
    }
  }

  function renderExtraFields(tool) {
    const host = $("extra-fields");
    const state = getWorkspace(tool.slug);
    host.replaceChildren();
    (tool.extraFields || []).forEach((f) => {
      if (f.type === "checkbox") {
        const wrap = el("div", "check-field");
        const inp = el("input");
        inp.type = "checkbox";
        inp.id = f.id;
        inp.checked = Object.prototype.hasOwnProperty.call(state.extraValues, f.id)
          ? Boolean(state.extraValues[f.id])
          : Boolean(f.checked);
        inp.addEventListener("change", () => {
          state.extraValues[f.id] = inp.checked;
        });
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
      inp.value = Object.prototype.hasOwnProperty.call(state.extraValues, f.id)
        ? state.extraValues[f.id]
        : (f.value ?? "");
      if (f.step !== undefined) inp.step = f.step;
      inp.addEventListener("input", () => {
        state.extraValues[f.id] = inp.value;
      });
      wrap.append(lab, inp);
      if (f.help) wrap.append(el("small", null, f.help));
      host.append(wrap);
    });
  }

  /* ==========================================================================
     MULTI-FILE TRAY, ACTIVE EDITOR & NUMBERED SOURCE INSPECTOR
     ========================================================================== */

  function renderFileTray() {
    const state = ws();
    const tray = $("file-tray");
    const meta = $("file-meta");
    const active = getActiveFile(state);
    tray.replaceChildren();

    if (!state.files.length) {
      meta.textContent = "Drop multiple CSV, TSV, JSON, Markdown, TXT, or LOG files here — or paste directly below";
      $("active-filename").value = "";
      $("doc-input").value = "";
      $("doc-stats").textContent = "0 lines · 0 B";
      renderInspectorTabs();
      renderSourceInspector(null, []);
      renderNav();
      return;
    }

    const totalLines = state.files.reduce((acc, f) => acc + f.lines.length, 0);
    const totalBytes = state.files.reduce((acc, f) => acc + f.bytes, 0);
    meta.textContent = `${state.files.length} file${state.files.length === 1 ? "" : "s"} loaded · ${totalLines.toLocaleString("en-US")} total lines · ${formatBytes(totalBytes)} · SHA-256 verified locally`;

    state.files.forEach((f) => {
      const chip = el("div", `file-chip${active && active.id === f.id ? " is-active" : ""}`);
      chip.dataset.fileId = f.id;

      const selectBtn = el("button", "file-chip__btn");
      selectBtn.type = "button";
      selectBtn.title = `${f.name} — SHA-256: ${f.sha256}`;
      selectBtn.append(
        el("span", "file-chip__name", f.name),
        el("span", "file-chip__meta", `${f.lines.length}L · ${formatBytes(f.bytes)} · ${f.sha256.slice(0, 8)}`)
      );
      selectBtn.addEventListener("click", () => selectFileById(f.id));

      const rmBtn = el("button", "file-chip__remove", "×");
      rmBtn.type = "button";
      rmBtn.setAttribute("aria-label", `Remove ${f.name}`);
      rmBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFileById(f.id);
      });

      chip.append(selectBtn, rmBtn);
      tray.append(chip);
    });

    if (active) {
      $("active-filename").value = active.name;
      if ($("doc-input").value !== active.text) {
        $("doc-input").value = active.text;
      }
      $("doc-stats").textContent = `${active.lines.length} line${active.lines.length === 1 ? "" : "s"} · ${formatBytes(active.bytes)} · ${active.sha256.slice(0, 8)}`;
    }

    renderInspectorTabs();
    renderSourceInspector(active, []);
    renderNav();
  }

  function renderInspectorTabs() {
    const state = ws();
    const host = $("inspector-file-tabs");
    const active = getActiveFile(state);
    host.replaceChildren();
    if (!state.files.length) return;
    state.files.forEach((f) => {
      const tab = el("button", "inspector-tab", `${f.name} (${f.lines.length})`);
      tab.type = "button";
      tab.role = "tab";
      tab.setAttribute("aria-selected", String(Boolean(active && active.id === f.id)));
      tab.addEventListener("click", () => selectFileById(f.id));
      host.append(tab);
    });
  }

  function renderSourceInspector(fileDoc, highlightLines = [], jumpLabel = "") {
    const host = $("source-lines");
    const banner = $("inspector-jump-banner");
    host.replaceChildren();

    if (jumpLabel) {
      banner.textContent = jumpLabel;
      banner.hidden = false;
    } else {
      banner.hidden = true;
    }

    if (!fileDoc || !fileDoc.text.length) {
      host.append(el("p", "source-lines__empty", "Lines appear numbered here as soon as you upload or paste one or more documents."));
      return;
    }

    const lines = fileDoc.lines;
    const hiSet = new Set(highlightLines);
    const maxRender = 400;
    let startIdx = 0;
    let endIdx = Math.min(lines.length, maxRender);
    if (highlightLines.length && highlightLines[0] > maxRender) {
      startIdx = Math.max(0, highlightLines[0] - 120);
      endIdx = Math.min(lines.length, startIdx + maxRender);
    }

    const frag = document.createDocumentFragment();
    if (startIdx > 0) {
      frag.append(el("p", "source-lines__empty", `Showing window L${startIdx + 1}–L${endIdx} of ${lines.length} lines (all lines analyzed).`));
    }
    for (let i = startIdx; i < endIdx; i++) {
      const l = lines[i];
      const row = el("div", `src-line${hiSet.has(l.num) ? " is-highlighted" : ""}`);
      row.id = `src-line-${l.num}`;
      row.dataset.lineNum = String(l.num);
      row.append(
        el("span", "src-line__num", ENG.tagLine(l.num)),
        el("span", "src-line__txt", l.raw || " ")
      );
      frag.append(row);
    }
    if (endIdx < lines.length) {
      frag.append(el("p", "source-lines__empty", `Showing lines L${startIdx + 1}–L${endIdx} of ${lines.length} in inspector (all ${lines.length} lines analyzed).`));
    }
    host.append(frag);
  }

  function selectFileById(fileId, focusEditor = false) {
    const state = ws();
    const target = state.files.find((f) => f.id === fileId);
    if (!target) return;
    state.activeFileId = target.id;
    renderFileTray();
    if (focusEditor) $("doc-input").focus();
  }

  function removeFileById(fileId) {
    const state = ws();
    const idx = state.files.findIndex((f) => f.id === fileId);
    if (idx === -1) return;
    const removed = state.files[idx];
    state.files.splice(idx, 1);
    if (state.activeFileId === fileId) {
      state.activeFileId = state.files[Math.max(0, idx - 1)]?.id || null;
    }
    renderFileTray();
    showToast(`Removed ${removed.name}`);
  }

  function jumpToCitation(fileName, lineNum) {
    const state = ws();
    const targetFile =
      state.files.find((f) => f.name === fileName) ||
      state.files.find((f) => f.name.toLowerCase() === String(fileName || "").toLowerCase()) ||
      getActiveFile(state);
    if (!targetFile) return;

    state.activeFileId = targetFile.id;
    renderFileTray();
    const label = `Jumped to ${ENG.formatCite(targetFile.name, lineNum)}`;
    renderSourceInspector(targetFile, [lineNum], label);

    const row = $(`src-line-${lineNum}`);
    if (row) {
      row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    const inspectorHead = document.querySelector(".source-inspector-head");
    if (inspectorHead && window.innerWidth < 900) {
      inspectorHead.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  /* ==========================================================================
     TOOL SWITCHING & SAMPLE LOADING
     ========================================================================== */

  function setResultState(label, tone) {
    const pill = $("result-state");
    pill.textContent = label;
    if (tone) pill.dataset.tone = tone;
    else delete pill.dataset.tone;
  }

  function selectTool(slug, updateHash = false) {
    const tool = ENG.TOOLS.find((t) => t.slug === slug) || ENG.TOOLS[0];
    currentTool = tool;
    const state = ws();
    const idx = ENG.TOOLS.indexOf(tool);

    $("category").textContent = tool.category;
    $("index").textContent = `${String(idx + 1).padStart(2, "0")} / ${ENG.TOOLS.length}`;
    $("signal").textContent = `${String(idx + 1).padStart(2, "0")} · ${tool.category}`;
    $("title").textContent = tool.name;
    $("description").textContent = tool.description;
    $("input-help").textContent = tool.help;
    $("outcome").textContent = tool.outcome;
    $("halt-rule").textContent = tool.haltRule;
    $("boundary").textContent = tool.boundary;

    updateRulesBadge();
    renderExtraFields(tool);
    renderFileTray();

    if (state.report) {
      renderReport(state.report);
    } else {
      const out = $("result-content");
      out.replaceChildren();
      const empty = el("div", "empty-state");
      empty.append(
        el("span", null, "↳"),
        el("p", null, `Upload, drop, or paste one or more files for ${tool.name} (or click "Load starter files") and click "Run multi-file review".`)
      );
      out.append(empty);
      $("result-tabs").hidden = true;
      $("result-actions").hidden = true;
      $("byok-output").hidden = true;
      setResultState("READY TO ANALYZE", null);
    }

    const workEl = $("workflow");
    workEl.classList.remove("is-swapped");
    void workEl.offsetWidth;
    workEl.classList.add("is-swapped");

    if (updateHash) history.replaceState(null, "", `#${tool.slug}`);
  }

  async function loadStarterFiles() {
    const state = ws();
    const created = [];
    for (const sf of currentTool.sampleFiles || []) {
      created.push(await makeFileDoc(sf.name, sf.text));
    }
    state.files = created;
    state.activeFileId = created[0]?.id || null;
    state.diffFileA = created[0]?.name || null;
    state.diffFileB = created[1]?.name || null;
    renderFileTray();
    showToast(`Loaded ${created.length} editable starter file${created.length === 1 ? "" : "s"} for ${currentTool.name}`, "good");
  }

  async function handleMultiFileLoad(fileList) {
    if (!fileList || !fileList.length) return;
    const state = ws();
    const added = [];
    const skipped = [];

    for (const file of Array.from(fileList)) {
      if (state.files.length >= MAX_FILES_PER_TOOL) {
        skipped.push(`${file.name} (max ${MAX_FILES_PER_TOOL} files)`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        skipped.push(`${file.name} (> 1 MB limit)`);
        continue;
      }
      try {
        const text = await file.text();
        const name = uniqueFileName(state.files, file.name);
        const doc = await makeFileDoc(name, text);
        state.files.push(doc);
        added.push(doc);
      } catch {
        skipped.push(`${file.name} (unreadable)`);
      }
    }

    if (added.length) {
      state.activeFileId = added[0].id;
      if (state.files.length >= 2 && (!state.diffFileA || !state.diffFileB)) {
        state.diffFileA = state.files[0].name;
        state.diffFileB = state.files[1].name;
      }
      renderFileTray();
      showToast(`Loaded ${added.length} file${added.length === 1 ? "" : "s"} into ${currentTool.name}`, "good");
    }
    if (skipped.length) {
      showToast(`Skipped: ${skipped.join(", ")}`, "warn");
    }
  }

  async function addNewPastedFile() {
    const state = ws();
    if (state.files.length >= MAX_FILES_PER_TOOL) {
      showToast(`Maximum ${MAX_FILES_PER_TOOL} files per workspace reached`, "warn");
      return;
    }
    const nextNum = state.files.length + 1;
    const name = uniqueFileName(state.files, `document-${nextNum}.txt`);
    const doc = await makeFileDoc(name, "");
    state.files.push(doc);
    state.activeFileId = doc.id;
    renderFileTray();
    $("active-filename").focus();
    $("active-filename").select();
    showToast(`Added ${name} — paste content or rename file`);
  }

  /* ==========================================================================
     REVIEW EXECUTION & OUTPUT RENDERING (FINDINGS / PROVENANCE / LCS DIFF)
     ========================================================================== */

  function readExtraInputs() {
    return {
      cutoffDate: $("opt-cutoff-date")?.value || "2026-11-21",
      authorized: $("opt-authorized") ? Boolean($("opt-authorized").checked) : true,
      question: $("opt-question")?.value || "",
      topic: $("opt-topic")?.value || ""
    };
  }

  async function runReview(evt) {
    if (evt) {
      evt.preventDefault();
      ws().activeTab = "findings";
    }
    const state = ws();
    $("byok-output").hidden = true;

    // Ensure hashes are up to date for all loaded files
    for (const f of state.files) {
      if (!f.sha256) f.sha256 = await ENG.sha256Hex(f.text);
    }

    const activeRules = rulePacks[currentTool.slug] || ENG.getDefaultRulePack(currentTool.slug);
    const report = await ENG.runAnalysis(currentTool.slug, state.files, activeRules, readExtraInputs());
    state.report = report;
    state.activeFindingIdx = -1;
    if (report.primaryDiff) {
      state.diffFileA = report.primaryDiff.fileA;
      state.diffFileB = report.primaryDiff.fileB;
    } else if (state.files.length >= 2) {
      if (!state.files.some((f) => f.name === state.diffFileA)) state.diffFileA = state.files[0].name;
      if (!state.files.some((f) => f.name === state.diffFileB)) state.diffFileB = state.files[1].name;
    }

    renderReport(report);
  }

  function setOutputTab(tabName) {
    const state = ws();
    state.activeTab = tabName;
    document.querySelectorAll(".output-tab").forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.dataset.tab === tabName));
    });
    if (state.report) renderReport(state.report);
  }

  function renderReport(report) {
    const state = ws();
    const host = $("result-content");
    host.replaceChildren();

    // Update output tabs & counters
    $("result-tabs").hidden = false;
    $("tab-count-findings").textContent = String(report.findings.length);
    $("tab-count-provenance").textContent = report.provenanceChain.outputReceiptSha256.slice(0, 8);
    if (state.files.length >= 2 && report.diffSummary) {
      $("tab-count-diff").textContent = `+${report.diffSummary.added}/-${report.diffSummary.removed}`;
    } else {
      $("tab-count-diff").textContent = state.files.length >= 2 ? "Ready" : "2+ files";
    }
    document.querySelectorAll(".output-tab").forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.dataset.tab === state.activeTab));
    });

    // Metrics strip (shown across all tabs for immediate first-glance metrics)
    const metricsBox = el("div", "result-intro");
    report.metrics.forEach(([k, v]) => {
      const card = el("div", "metric");
      card.append(el("span", "metric__label", k), el("strong", "metric__value", v));
      metricsBox.append(card);
    });
    host.append(metricsBox);

    const summaryP = el("p", "result-copy");
    summaryP.append(el("strong", null, `${report.toolName} deterministic review: `), document.createTextNode(report.summary));
    host.append(summaryP);

    if (state.activeTab === "provenance") {
      renderProvenanceTab(host, report);
    } else if (state.activeTab === "diff") {
      renderDiffTab(host, report);
    } else {
      renderFindingsTab(host, report);
    }

    setResultState(
      report.draftHalted ? "DRAFT HALTED · REVIEW REQUIRED" : "VERIFIED · CITED DRAFT READY",
      report.draftHalted ? "warn" : "good"
    );
    $("result-actions").hidden = false;
    const revBtn = $("review-button");
    revBtn.disabled = false;
    revBtn.textContent = report.reviewedAt ? `Locally reviewed (${report.reviewedAt.slice(11, 19)}Z)` : "Mark locally reviewed";
  }

  function renderFindingsTab(host, report) {
    const state = ws();

    // Optional numeric series chart (MarketBrief)
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

    // Findings list with search, severity segmented filter, clickable [file:L##], and j/k navigation
    const fSec = el("section", "result-section");
    const toolbar = el("div", "findings-toolbar");
    toolbar.append(el("h4", null, `Line-cited findings (${report.findings.length})`));

    const controls = el("div", "findings-controls");
    const seg = el("div", "sev-seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Filter findings by severity");
    ["all", "high", "medium", "pass"].forEach((sev) => {
      const b = el("button", "sev-seg__btn", sev === "all" ? "All" : sev[0].toUpperCase() + sev.slice(1));
      b.type = "button";
      b.setAttribute("aria-pressed", String(state.severityFilter === sev));
      b.addEventListener("click", () => {
        state.severityFilter = sev;
        state.activeFindingIdx = -1;
        seg.querySelectorAll(".sev-seg__btn").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        drawFindings();
      });
      seg.append(b);
    });

    const filterInp = el("input", "findings-filter");
    filterInp.id = "findings-filter-input";
    filterInp.type = "search";
    filterInp.value = state.filterQuery;
    filterInp.placeholder = "Filter findings or [file:L##]…";
    filterInp.setAttribute("aria-label", "Filter findings");

    controls.append(seg, filterInp);
    toolbar.append(controls);
    fSec.append(toolbar);

    const listEl = el("ul", "result-list");
    listEl.id = "findings-list";

    const drawFindings = () => {
      listEl.replaceChildren();
      state.filterQuery = filterInp.value;
      const q = filterInp.value.trim().toLowerCase();
      const items = report.findings.filter((f) => {
        if (state.severityFilter !== "all" && f.severity !== state.severityFilter) return false;
        if (!q) return true;
        const citeTxt = (f.citations || []).map((c) => ENG.formatCite(c.file, c.line)).join(" ");
        return `${f.id} ${f.rule} ${f.severity} ${f.title} ${f.detail} ${f.quote} ${citeTxt}`.toLowerCase().includes(q);
      });

      if (!items.length) {
        const li = el("li", "finding-card");
        li.append(el("p", "finding-card__detail", "No findings match the current filter."));
        listEl.append(li);
        return;
      }

      items.forEach((f, idx) => {
        const li = el("li", `finding-card${idx === state.activeFindingIdx ? " is-kbd-active" : ""}`);
        li.dataset.findingIdx = String(idx);
        li.dataset.findingId = f.id;

        const head = el("div", "finding-card__head");
        head.append(
          el("span", "sev-pill", f.id),
          el("span", `sev-pill sev-pill--${f.severity}`, f.severity),
          el("span", "sev-pill", f.rule)
        );
        (f.citations || []).forEach((c) => {
          const label = ENG.formatCite(c.file, c.line);
          const cite = el("button", "cite-btn", label);
          cite.type = "button";
          cite.title = `Switch to ${c.file} and highlight line ${c.line}`;
          cite.addEventListener("click", () => {
            state.activeFindingIdx = idx;
            highlightActiveFindingCard();
            jumpToCitation(c.file, c.line);
          });
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

    filterInp.addEventListener("input", () => {
      state.activeFindingIdx = -1;
      drawFindings();
    });
    drawFindings();
    fSec.append(listEl);
    host.append(fSec);

    // Source-grounded Draft Gate OR Hard Halt Banner
    const dSec = el("section", "result-section");
    dSec.append(el("h4", null, "Source-grounded verification gate"));
    if (report.draftHalted) {
      const halt = el("div", "halt-box");
      halt.setAttribute("role", "alert");
      const hHead = el("div", "halt-box__head");
      hHead.append(
        el("span", "halt-box__title", "DRAFT HALTED · REVIEW REQUIRED"),
        el("span", "send-lock-chip", "Send action: Disabled")
      );
      halt.append(hHead);
      halt.append(el("p", null, "No draft was generated because mandatory source evidence or deterministic verification gates failed:"));
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
        report.draftText = box.value;
      });
      dSec.append(box);
      dSec.append(el("p", "micro", "Every bullet cites exact [filename:L##] lines from your loaded documents. Send action: Disabled — nothing is ever posted or transmitted."));
    }
    host.append(dSec);

    // Human decision boundary
    const hSec = el("section", "result-section");
    hSec.append(el("h4", null, "Required human decision"));
    hSec.append(el("p", "result-copy", report.humanDecision));
    host.append(hSec);
  }

  function renderProvenanceTab(host, report) {
    const prov = report.provenanceChain;
    const sec = el("section", "result-section");
    sec.append(el("h4", null, "Cryptographic Evidence & Provenance Chain"));
    sec.append(
      el(
        "p",
        "result-copy",
        "Every deterministic review links input file SHA-256 digests -> evaluated rule parameters -> exact [filename:L##] finding citations -> signed output receipt SHA-256."
      )
    );

    const grid = el("div", "prov-chain");

    // Stage 1: Input Files
    const s1 = el("div", "prov-stage");
    s1.append(el("div", "prov-stage__head", null));
    s1.firstChild.append(el("span", "prov-stage__step", "01 / INPUTS"), el("span", "count-chip", `${prov.inputFiles.length} file(s)`));
    s1.append(el("h4", null, "Input file hashes"));
    const l1 = el("ul", "prov-list");
    prov.inputFiles.forEach((f) => {
      const li = el("li", "prov-item");
      li.append(
        el("span", "prov-item__title", `${f.name} (${f.lines}L · ${formatBytes(f.bytes)})`),
        el("span", "prov-hash", `sha256:${f.sha256}`)
      );
      l1.append(li);
    });
    if (!prov.inputFiles.length) l1.append(el("li", "prov-item", "No input files loaded."));
    s1.append(l1);
    grid.append(s1);

    // Stage 2: Rules Evaluated
    const s2 = el("div", "prov-stage");
    const s2h = el("div", "prov-stage__head");
    s2h.append(el("span", "prov-stage__step", "02 / RULES"), el("span", "count-chip", `${prov.rulesEvaluated.length} evaluated`));
    s2.append(s2h, el("h4", null, "Deterministic rules evaluated"));
    const l2 = el("ul", "prov-list");
    prov.rulesEvaluated.forEach((r) => {
      const li = el("li", "prov-item");
      li.append(
        el("span", "prov-item__title", `${r.id} [${r.status}]`),
        el("span", "prov-hash", r.detail)
      );
      l2.append(li);
    });
    s2.append(l2);
    grid.append(s2);

    // Stage 3: Finding Citations
    const s3 = el("div", "prov-stage");
    const s3h = el("div", "prov-stage__head");
    s3h.append(el("span", "prov-stage__step", "03 / CITATIONS"), el("span", "count-chip", `${prov.uniqueCitations} refs`));
    s3.append(s3h, el("h4", null, "Cited evidence graph"));
    const sevCounts = { high: 0, medium: 0, pass: 0, info: 0 };
    report.findings.forEach((f) => { sevCounts[f.severity] = (sevCounts[f.severity] || 0) + 1; });
    const l3 = el("ul", "prov-list");
    l3.append(
      (() => {
        const li = el("li", "prov-item");
        li.append(
          el("span", "prov-item__title", `${prov.totalFindings} finding(s) across ${prov.uniqueCitations} unique [file:L##] pins`),
          el("span", "prov-hash", `HIGH:${sevCounts.high} · MED:${sevCounts.medium} · PASS:${sevCounts.pass} · INFO:${sevCounts.info}`)
        );
        return li;
      })()
    );
    report.findings.slice(0, 4).forEach((f) => {
      if (!f.citations.length) return;
      const c = f.citations[0];
      const li = el("li", "prov-item");
      const btn = el("button", "cite-btn", `${f.id} ${ENG.formatCite(c.file, c.line)}`);
      btn.type = "button";
      btn.addEventListener("click", () => jumpToCitation(c.file, c.line));
      li.append(btn);
      l3.append(li);
    });
    s3.append(l3);
    grid.append(s3);

    // Stage 4: Output Receipt SHA-256
    const s4 = el("div", "prov-stage");
    const s4h = el("div", "prov-stage__head");
    s4h.append(el("span", "prov-stage__step", "04 / RECEIPT"), el("span", "count-chip", "SHA-256"));
    s4.append(s4h, el("h4", null, "Output receipt seal"));
    const l4 = el("ul", "prov-list");
    const li4 = el("li", "prov-item");
    li4.append(
      el("span", "prov-item__title", report.draftHalted ? "Verdict: DRAFT HALTED · REVIEW REQUIRED" : "Verdict: VERIFIED · CITED DRAFT READY"),
      el("span", "prov-hash", `receipt:${prov.outputReceiptSha256}`),
      el("span", "prov-hash", `Send action: ${prov.sendAction} · Schema: ${report.schemaVersion}`)
    );
    l4.append(li4);
    s4.append(l4);

    const verifyRow = el("div", "prov-verify-row");
    const verifyBtn = el("button", "button button--secondary", "Verify SHA-256 hash");
    verifyBtn.type = "button";
    verifyBtn.id = "verify-receipt-hash-btn";
    const verifyOut = el("span", "prov-verify-badge", "");
    verifyOut.id = "verify-receipt-status";
    verifyOut.hidden = true;
    verifyBtn.addEventListener("click", async () => {
      const recomputed = await ENG.computeReceiptHash(ENG.stripRuntimeOnly(report));
      const match = recomputed === prov.outputReceiptSha256;
      verifyOut.textContent = match ? `MATCH ✓ (${recomputed.slice(0, 12)}…)` : "MISMATCH";
      verifyOut.className = `prov-verify-badge${match ? " prov-verify-badge--ok" : ""}`;
      verifyOut.hidden = false;
      showToast(match ? "Receipt SHA-256 verified against canonical payload" : "Receipt hash mismatch", match ? "good" : "warn");
    });
    verifyRow.append(verifyBtn, verifyOut);
    s4.append(verifyRow);
    grid.append(s4);

    sec.append(grid);

    // Structured JSON receipt disclosure
    const det = el("details", "raw-details");
    det.append(el("summary", null, "Inspect canonical signed JSON receipt"));
    det.append(el("pre", null, ENG.reportToJson(report)));
    sec.append(det);

    host.append(sec);
  }

  function renderDiffTab(host) {
    const state = ws();
    const sec = el("section", "result-section");
    sec.append(el("h4", null, "Cross-Document LCS Line-Level Diff"));

    if (state.files.length < 2) {
      sec.append(
        el(
          "p",
          "result-copy",
          "Load at least 2 files (upload multiple files, click '+ Add pasted file', or load starter files) to compute a deterministic line-level Longest Common Subsequence diff."
        )
      );
      host.append(sec);
      return;
    }

    const docA = state.files.find((f) => f.name === state.diffFileA) || state.files[0];
    const docB = state.files.find((f) => f.name === state.diffFileB && f.id !== docA.id) || state.files.find((f) => f.id !== docA.id) || state.files[1];
    state.diffFileA = docA.name;
    state.diffFileB = docB.name;

    const diff = ENG.computeLineDiff(docA, docB);

    const toolbar = el("div", "diff-toolbar");
    const selectors = el("div", "diff-selectors");

    const selA = el("select", "diff-select");
    selA.id = "diff-select-a";
    selA.setAttribute("aria-label", "Baseline document A");
    const selB = el("select", "diff-select");
    selB.id = "diff-select-b";
    selB.setAttribute("aria-label", "Revised document B");
    state.files.forEach((f) => {
      const oA = el("option", null, f.name);
      oA.value = f.name;
      if (f.name === docA.name) oA.selected = true;
      selA.append(oA);
      const oB = el("option", null, f.name);
      oB.value = f.name;
      if (f.name === docB.name) oB.selected = true;
      selB.append(oB);
    });
    selA.addEventListener("change", () => {
      state.diffFileA = selA.value;
      renderReport(state.report);
    });
    selB.addEventListener("change", () => {
      state.diffFileB = selB.value;
      renderReport(state.report);
    });

    const toggleOnly = el("button", "strip-btn", state.diffOnlyChanges ? "Showing: Changes only" : "Showing: Full diff");
    toggleOnly.type = "button";
    toggleOnly.addEventListener("click", () => {
      state.diffOnlyChanges = !state.diffOnlyChanges;
      renderReport(state.report);
    });

    selectors.append(selA, el("span", "doc-stats", "→"), selB, toggleOnly);

    const stats = el("div", "diff-stats");
    stats.append(
      el("span", "sev-pill sev-pill--pass", `+${diff.added} added`),
      el("span", "sev-pill sev-pill--high", `-${diff.removed} removed`),
      el("span", "sev-pill", `${diff.unchanged} equal`),
      el("span", "count-chip", diff.algorithm)
    );

    toolbar.append(selectors, stats);
    sec.append(toolbar);

    const box = el("div", "diff-box");
    const visibleOps = state.diffOnlyChanges ? diff.ops.filter((o) => o.type !== "equal") : diff.ops;
    const capped = visibleOps.slice(0, 600);
    if (!capped.length) {
      box.append(el("p", "source-lines__empty", "Documents are byte-identical (0 line differences)."));
    } else {
      const frag = document.createDocumentFragment();
      capped.forEach((op) => {
        const row = el("div", `diff-line diff-line--${op.type}`);

        if (op.lineA !== null) {
          const jA = el("button", "diff-line__jump", `A:${ENG.tagLine(op.lineA)}`);
          jA.type = "button";
          jA.title = `Jump to ${docA.name}:${ENG.tagLine(op.lineA)}`;
          jA.addEventListener("click", () => jumpToCitation(docA.name, op.lineA));
          row.append(jA);
        } else {
          row.append(el("span", "diff-line__num", "—"));
        }

        if (op.lineB !== null) {
          const jB = el("button", "diff-line__jump", `B:${ENG.tagLine(op.lineB)}`);
          jB.type = "button";
          jB.title = `Jump to ${docB.name}:${ENG.tagLine(op.lineB)}`;
          jB.addEventListener("click", () => jumpToCitation(docB.name, op.lineB));
          row.append(jB);
        } else {
          row.append(el("span", "diff-line__num", "—"));
        }

        const sign = op.type === "add" ? "+" : op.type === "remove" ? "-" : " ";
        row.append(el("span", "diff-line__sign", sign), el("span", "diff-line__text", op.text || " "));
        frag.append(row);
      });
      box.append(frag);
    }
    sec.append(box);
    host.append(sec);
  }

  function highlightActiveFindingCard() {
    const state = ws();
    const cards = document.querySelectorAll("#findings-list .finding-card");
    cards.forEach((c, idx) => {
      c.classList.toggle("is-kbd-active", idx === state.activeFindingIdx);
    });
    const activeCard = cards[state.activeFindingIdx];
    if (activeCard) {
      activeCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function stepFinding(delta) {
    const state = ws();
    if (!state.report || !state.report.findings.length) return;
    if (state.activeTab !== "findings") setOutputTab("findings");
    const cards = Array.from(document.querySelectorAll("#findings-list .finding-card[data-finding-id]"));
    if (!cards.length) return;
    const nextIdx =
      state.activeFindingIdx < 0
        ? delta > 0
          ? 0
          : cards.length - 1
        : (state.activeFindingIdx + delta + cards.length) % cards.length;
    state.activeFindingIdx = nextIdx;
    highlightActiveFindingCard();
    const fid = cards[nextIdx].dataset.findingId;
    const finding = state.report.findings.find((f) => f.id === fid);
    if (finding && finding.citations && finding.citations.length) {
      jumpToCitation(finding.citations[0].file, finding.citations[0].line);
    }
  }

  /* ==========================================================================
     CUSTOM RULE PACK BUILDER DRAWER (localStorage + JSON IMPORT/EXPORT)
     ========================================================================== */

  function renderRulesDrawerForm() {
    const host = $("rules-fields");
    const pack = rulePacks[currentTool.slug] || ENG.getDefaultRulePack(currentTool.slug);
    $("rules-drawer-title").textContent = `${currentTool.name} Rule Pack`;
    $("rules-tool-label").textContent = currentTool.name;
    $("rules-status").textContent = "";
    host.replaceChildren();

    (currentTool.ruleSchema || []).forEach((s) => {
      if (s.type === "boolean") {
        const wrap = el("div", "check-field");
        const inp = el("input");
        inp.type = "checkbox";
        inp.id = `rule-inp-${s.key}`;
        inp.dataset.ruleKey = s.key;
        inp.checked = Boolean(pack[s.key]);
        const labWrap = el("div");
        const lab = el("label", null, s.label);
        lab.htmlFor = inp.id;
        labWrap.append(lab);
        if (s.help) {
          const sm = el("small", null, s.help);
          sm.style.display = "block";
          labWrap.append(sm);
        }
        wrap.append(inp, labWrap);
        host.append(wrap);
        return;
      }
      const wrap = el("div", "field");
      const lab = el("label", null, s.label);
      lab.htmlFor = `rule-inp-${s.key}`;
      const inp = el("input");
      inp.id = `rule-inp-${s.key}`;
      inp.dataset.ruleKey = s.key;
      inp.type = s.type === "number" ? "number" : "text";
      inp.value = String(pack[s.key] ?? s.default ?? "");
      if (s.min !== undefined) inp.min = String(s.min);
      if (s.max !== undefined) inp.max = String(s.max);
      if (s.step !== undefined) inp.step = String(s.step);
      if (s.placeholder) inp.placeholder = s.placeholder;
      wrap.append(lab, inp);
      if (s.help) wrap.append(el("small", null, s.help));
      host.append(wrap);
    });
  }

  function openRulesDrawer() {
    rulesPrevFocus = document.activeElement;
    renderRulesDrawerForm();
    $("rules-backdrop").hidden = false;
    $("rules-drawer").hidden = false;
    $("rules-toggle").setAttribute("aria-expanded", "true");
    rulesOpen = true;
    const first = $("rules-fields").querySelector("input");
    if (first) first.focus();
  }

  function closeRulesDrawer() {
    if (!rulesOpen) return;
    $("rules-backdrop").hidden = true;
    $("rules-drawer").hidden = true;
    $("rules-toggle").setAttribute("aria-expanded", "false");
    rulesOpen = false;
    if (rulesPrevFocus && typeof rulesPrevFocus.focus === "function") rulesPrevFocus.focus();
  }

  async function saveRulesFromDrawer() {
    const next = { ...(rulePacks[currentTool.slug] || ENG.getDefaultRulePack(currentTool.slug)) };
    (currentTool.ruleSchema || []).forEach((s) => {
      const inp = $(`rule-inp-${s.key}`);
      if (!inp) return;
      if (s.type === "boolean") next[s.key] = inp.checked;
      else if (s.type === "number") {
        const n = Number(inp.value);
        if (Number.isFinite(n)) next[s.key] = n;
      } else {
        next[s.key] = inp.value;
      }
    });

    const compiled = ENG.compileCustomRegex(next);
    if (compiled.error) {
      $("rules-status").textContent = `Invalid regex: ${compiled.error}`;
      showToast(`Fix custom regex: ${compiled.error}`, "warn");
      return;
    }

    rulePacks[currentTool.slug] = next;
    ENG.saveAllRulePacks(rulePacks);
    updateRulesBadge();
    $("rules-status").textContent = `Saved ${currentTool.name} rules to localStorage.`;
    showToast(`Applied custom rules for ${currentTool.name}`, "good");
    closeRulesDrawer();

    if (ws().files.length > 0) {
      await runReview();
    }
  }

  async function resetCurrentToolRules() {
    rulePacks[currentTool.slug] = ENG.getDefaultRulePack(currentTool.slug);
    ENG.saveAllRulePacks(rulePacks);
    renderRulesDrawerForm();
    updateRulesBadge();
    $("rules-status").textContent = `Restored default rules for ${currentTool.name}.`;
    showToast(`Reset ${currentTool.name} rules to defaults`);
    if (ws().files.length > 0) await runReview();
  }

  function exportRulePacksJson() {
    triggerDownload(
      `ias-rule-packs-${Date.now()}.json`,
      JSON.stringify({ schemaVersion: "ias-rulepacks-v0.5.0", exportedAt: new Date().toISOString(), rulePacks }, null, 2),
      "application/json;charset=utf-8"
    );
    showToast("Exported Rule Packs (.json)", "good");
  }

  async function importRulePacksJson(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const src = parsed.rulePacks && typeof parsed.rulePacks === "object" ? parsed.rulePacks : parsed;
      let importedTools = 0;
      ENG.TOOLS.forEach((t) => {
        if (src[t.slug] && typeof src[t.slug] === "object") {
          const merged = { ...ENG.getDefaultRulePack(t.slug) };
          (t.ruleSchema || []).forEach((s) => {
            if (Object.prototype.hasOwnProperty.call(src[t.slug], s.key)) {
              const v = src[t.slug][s.key];
              if (s.type === "number" && Number.isFinite(Number(v))) merged[s.key] = Number(v);
              else if (s.type === "boolean") merged[s.key] = Boolean(v);
              else if (s.type !== "number") merged[s.key] = String(v ?? "");
            }
          });
          rulePacks[t.slug] = merged;
          importedTools++;
        }
      });
      ENG.saveAllRulePacks(rulePacks);
      renderRulesDrawerForm();
      updateRulesBadge();
      $("rules-status").textContent = `Imported rules for ${importedTools} tool(s).`;
      showToast(`Imported Rule Packs (${importedTools} tool(s))`, "good");
      if (ws().files.length > 0) await runReview();
    } catch (err) {
      $("rules-status").textContent = `Import failed: ${err.message}`;
      showToast("Could not import rule pack JSON", "warn");
    }
  }

  /* ==========================================================================
     CMD+K / CTRL+K QUICK SWITCHER MODAL
     ========================================================================== */

  function buildCmdkEntries(query) {
    const q = String(query || "").trim().toLowerCase();
    const state = ws();
    const entries = [];

    // 1. Tools
    ENG.TOOLS.forEach((t, idx) => {
      const hay = `${t.name} ${t.category} ${t.tagline} ${t.slug}`.toLowerCase();
      if (!q || hay.includes(q)) {
        entries.push({
          group: "Review Tools",
          title: `${String(idx + 1).padStart(2, "0")} · ${t.name}`,
          sub: `${t.category} — ${t.tagline}`,
          run: () => selectTool(t.slug, true)
        });
      }
    });

    // 2. Loaded Files
    state.files.forEach((f) => {
      const hay = `${f.name} ${f.sha256}`.toLowerCase();
      if (!q || hay.includes(q)) {
        entries.push({
          group: `Loaded Files (${currentTool.name})`,
          title: f.name,
          sub: `${f.lines.length} lines · ${formatBytes(f.bytes)} · sha256:${f.sha256.slice(0, 12)}`,
          run: () => selectFileById(f.id, true)
        });
      }
    });

    // 3. Active Report Findings
    if (state.report && state.report.findings.length) {
      state.report.findings.forEach((f, idx) => {
        const cites = (f.citations || []).map((c) => ENG.formatCite(c.file, c.line)).join(" ");
        const hay = `${f.id} ${f.rule} ${f.severity} ${f.title} ${cites}`.toLowerCase();
        if (!q || hay.includes(q)) {
          entries.push({
            group: `Findings (${state.report.toolName})`,
            title: `${f.id} [${f.severity.toUpperCase()}] ${f.title}`,
            sub: `${f.rule}${cites ? ` · ${cites}` : ""}`,
            run: () => {
              state.activeTab = "findings";
              state.activeFindingIdx = idx;
              renderReport(state.report);
              highlightActiveFindingCard();
              if (f.citations && f.citations.length) {
                jumpToCitation(f.citations[0].file, f.citations[0].line);
              }
            }
          });
        }
      });
    }

    // 4. Actions
    const actions = [
      { title: "Run multi-file review", sub: `Execute deterministic analyzer for ${currentTool.name}`, run: () => runReview() },
      { title: "Open Custom Rule Pack Builder", sub: `Customize thresholds, mandatory clauses & regex for ${currentTool.name}`, run: () => openRulesDrawer() },
      { title: "Load editable starter files", sub: `Populate multi-file sample documents for ${currentTool.name}`, run: () => loadStarterFiles() },
      { title: "Add new pasted document", sub: "Create a fresh named file in the multi-file tray", run: () => addNewPastedFile() }
    ];
    if (state.report) {
      actions.push(
        { title: "Export Markdown Audit Report (.md)", sub: "Download full Markdown audit report with SHA-256 provenance", run: () => $("download-md-button").click() },
        { title: "Export Signed JSON Receipt (.json)", sub: "Download structured receipt with SHA-256 provenance chain", run: () => $("download-json-button").click() },
        { title: "Export Findings Spreadsheet (.csv)", sub: "Download RFC-4180 CSV of all cited findings", run: () => $("download-csv-button").click() },
        { title: "View Evidence & Provenance Chain", sub: "Inspect input hashes -> rules -> citations -> output SHA-256", run: () => setOutputTab("provenance") },
        { title: "View Cross-Document LCS Diff", sub: "Compare any two loaded files line by line", run: () => setOutputTab("diff") }
      );
    }
    actions.forEach((a) => {
      if (!q || `${a.title} ${a.sub}`.toLowerCase().includes(q)) {
        entries.push({ group: "Actions", ...a });
      }
    });

    return entries.slice(0, 30);
  }

  function renderCmdkList() {
    const host = $("cmdk-results");
    host.replaceChildren();
    cmdkItems = buildCmdkEntries($("cmdk-input").value);
    if (cmdkIdx >= cmdkItems.length) cmdkIdx = 0;

    if (!cmdkItems.length) {
      host.append(el("div", "cmdk-empty", "No tools, files, findings, or actions match that query."));
      return;
    }

    let lastGroup = "";
    cmdkItems.forEach((item, idx) => {
      if (item.group !== lastGroup) {
        host.append(el("div", "cmdk-group-label", item.group));
        lastGroup = item.group;
      }
      const btn = el("button", `cmdk-item${idx === cmdkIdx ? " is-selected" : ""}`);
      btn.type = "button";
      btn.role = "option";
      btn.setAttribute("aria-selected", String(idx === cmdkIdx));
      const main = el("span", "cmdk-item__main");
      main.append(el("span", "cmdk-item__title", item.title), el("span", "cmdk-item__sub", item.sub));
      btn.append(main, el("span", "nav-item__arrow", "↵"));
      btn.addEventListener("mouseenter", () => {
        cmdkIdx = idx;
        updateCmdkSelection();
      });
      btn.addEventListener("click", () => {
        closeCmdk();
        item.run();
      });
      host.append(btn);
    });
  }

  function updateCmdkSelection() {
    const btns = $("cmdk-results").querySelectorAll(".cmdk-item");
    btns.forEach((b, i) => {
      const sel = i === cmdkIdx;
      b.classList.toggle("is-selected", sel);
      b.setAttribute("aria-selected", String(sel));
      if (sel) b.scrollIntoView({ block: "nearest" });
    });
  }

  function openCmdk() {
    if (rulesOpen) closeRulesDrawer();
    cmdkPrevFocus = document.activeElement;
    cmdkIdx = 0;
    $("cmdk-input").value = "";
    $("cmdk-backdrop").hidden = false;
    $("cmdk-modal").hidden = false;
    cmdkOpen = true;
    renderCmdkList();
    $("cmdk-input").focus();
  }

  function closeCmdk() {
    if (!cmdkOpen) return;
    $("cmdk-backdrop").hidden = true;
    $("cmdk-modal").hidden = true;
    cmdkOpen = false;
    if (cmdkPrevFocus && typeof cmdkPrevFocus.focus === "function") cmdkPrevFocus.focus();
  }

  /* ==========================================================================
     EXPORTS & OPTIONAL BYOK LLM (sessionStorage ONLY)
     ========================================================================== */

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
      showToast("BYOK config saved to sessionStorage", "good");
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
    showToast("Cleared BYOK credentials");
  }

  async function runByokSynthesis() {
    if (!ws().report) await runReview();
    const report = ws().report;
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
      const numberedLines = [];
      for (const f of ws().files) {
        for (const l of f.lines) {
          numberedLines.push(`${ENG.formatCite(f.name, l.num)} ${l.raw}`);
          if (numberedLines.length >= 160) break;
        }
        if (numberedLines.length >= 160) break;
      }
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
              content: `You are assisting the ${currentTool.name} multi-document review tool. Cite exact [filename:L##] references for every claim. If mandatory evidence is missing, explicitly state DRAFT HALTED and name what is missing.`
            },
            {
              role: "user",
              content: `Deterministic findings summary: ${report.summary}\nDraft halted: ${report.draftHalted}\n\nNumbered sources:\n${numberedLines.join("\n")}`
            }
          ]
        })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} from endpoint`);
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || "Empty response from model.";
      const body = $("byok-output-body");
      body.replaceChildren();
      const pre = el("pre", "finding-card__quote", content);
      body.append(pre);
      $("byok-output").hidden = false;
      $("byok-status").textContent = `Received BYOK response from ${model}.`;
    } catch (err) {
      $("byok-status").textContent = `BYOK request failed: ${err.message}. Deterministic findings above remain valid.`;
    } finally {
      runBtn.disabled = false;
    }
  }

  /* ==========================================================================
     LIVE EDITOR SYNC & BOOTSTRAP
     ========================================================================== */

  let hashTimer = null;
  function handleEditorInput() {
    const state = ws();
    const val = $("doc-input").value;
    let active = getActiveFile(state);
    if (!active) {
      if (!val.length) return;
      const name = uniqueFileName(state.files, $("active-filename").value || "pasted-document.txt");
      active = {
        id: `doc-${fileSeq++}`,
        name,
        text: val,
        bytes: new TextEncoder().encode(val).length,
        lines: ENG.splitLines(val),
        sha256: ""
      };
      state.files.push(active);
      state.activeFileId = active.id;
    } else {
      active.text = val;
      active.bytes = new TextEncoder().encode(val).length;
      active.lines = ENG.splitLines(val);
    }

    $("doc-stats").textContent = `${active.lines.length} line${active.lines.length === 1 ? "" : "s"} · ${formatBytes(active.bytes)}${active.sha256 ? ` · ${active.sha256.slice(0, 8)}` : ""}`;
    renderSourceInspector(active, []);

    clearTimeout(hashTimer);
    const targetDoc = active;
    hashTimer = setTimeout(async () => {
      targetDoc.sha256 = await ENG.sha256Hex(targetDoc.text);
      renderFileTray();
    }, 120);
  }

  function handleFilenameChange() {
    const state = ws();
    const active = getActiveFile(state);
    const val = $("active-filename").value.trim();
    if (!active || !val) return;
    if (active.name === val) return;
    const oldName = active.name;
    active.name = val;
    if (state.diffFileA === oldName) state.diffFileA = val;
    if (state.diffFileB === oldName) state.diffFileB = val;
    renderFileTray();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    loadByokSession();

    const initialHash = location.hash.replace(/^#/, "").trim().toLowerCase();
    selectTool(ENG.TOOLS.some((t) => t.slug === initialHash) ? initialHash : ENG.TOOLS[0].slug, false);

    $("tool-filter").addEventListener("input", renderNav);
    $("doc-input").addEventListener("input", handleEditorInput);
    $("active-filename").addEventListener("change", handleFilenameChange);
    $("active-filename").addEventListener("blur", handleFilenameChange);

    $("upload-trigger").addEventListener("click", () => $("file-input").click());
    $("file-input").addEventListener("change", async (e) => {
      await handleMultiFileLoad(e.target.files);
      e.target.value = "";
    });

    const dz = $("drop-zone");
    dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("is-dragover"); });
    dz.addEventListener("dragleave", () => dz.classList.remove("is-dragover"));
    dz.addEventListener("drop", async (e) => {
      e.preventDefault();
      dz.classList.remove("is-dragover");
      await handleMultiFileLoad(e.dataTransfer?.files);
    });

    $("add-file-button").addEventListener("click", addNewPastedFile);
    $("sample-button").addEventListener("click", loadStarterFiles);
    $("clear-button").addEventListener("click", () => {
      const state = ws();
      state.files = [];
      state.activeFileId = null;
      state.report = null;
      state.diffFileA = null;
      state.diffFileB = null;
      renderFileTray();
      selectTool(currentTool.slug, false);
      showToast(`Cleared workspace for ${currentTool.name}`);
    });

    $("run-form").addEventListener("submit", runReview);

    // Output tabs
    document.querySelectorAll(".output-tab").forEach((btn) => {
      btn.addEventListener("click", () => setOutputTab(btn.dataset.tab));
    });

    // BYOK toggle & actions
    $("byok-toggle").addEventListener("click", () => {
      const panel = $("byok-panel");
      const open = panel.hidden;
      panel.hidden = !open;
      $("byok-toggle").setAttribute("aria-expanded", String(open));
    });
    $("byok-save").addEventListener("click", saveByokSession);
    $("byok-clear").addEventListener("click", clearByokSession);
    $("byok-run").addEventListener("click", runByokSynthesis);

    // Full Audit Export Suite (.md / .json / .csv) + local review
    $("download-md-button").addEventListener("click", () => {
      const r = ws().report;
      if (!r) return;
      triggerDownload(`${r.toolSlug}-audit-${Date.now()}.md`, ENG.reportToMarkdown(r), "text/markdown;charset=utf-8");
      showToast("Exported Markdown Audit Report (.md)", "good");
    });
    $("download-json-button").addEventListener("click", () => {
      const r = ws().report;
      if (!r) return;
      triggerDownload(`${r.toolSlug}-receipt-${Date.now()}.json`, ENG.reportToJson(r), "application/json;charset=utf-8");
      showToast("Exported Signed JSON Receipt (.json)", "good");
    });
    $("download-csv-button").addEventListener("click", () => {
      const r = ws().report;
      if (!r) return;
      triggerDownload(`${r.toolSlug}-findings-${Date.now()}.csv`, ENG.reportToCsv(r), "text/csv;charset=utf-8");
      showToast("Exported Findings Spreadsheet (.csv)", "good");
    });
    $("review-button").addEventListener("click", () => {
      const r = ws().report;
      if (!r) return;
      r.reviewedAt = new Date().toISOString();
      $("review-button").textContent = `Locally reviewed (${r.reviewedAt.slice(11, 19)}Z)`;
      setResultState(r.draftHalted ? "REVIEWED · DRAFT HALTED" : "REVIEWED · LOCAL SIGN-OFF", "good");
      showToast("Recorded local human review timestamp", "good");
    });

    // Rule Pack Drawer wiring
    $("rules-toggle").addEventListener("click", () => (rulesOpen ? closeRulesDrawer() : openRulesDrawer()));
    $("rules-inline-btn").addEventListener("click", openRulesDrawer);
    $("rules-close").addEventListener("click", closeRulesDrawer);
    $("rules-backdrop").addEventListener("click", closeRulesDrawer);
    $("rules-save-btn").addEventListener("click", saveRulesFromDrawer);
    $("rules-reset-tool-btn").addEventListener("click", resetCurrentToolRules);
    $("rules-export-btn").addEventListener("click", exportRulePacksJson);
    $("rules-import-btn").addEventListener("click", () => $("rules-import-input").click());
    $("rules-import-input").addEventListener("change", async (e) => {
      await importRulePacksJson(e.target.files?.[0]);
      e.target.value = "";
    });

    // Cmd+K Quick Switcher wiring
    $("cmdk-trigger").addEventListener("click", openCmdk);
    $("cmdk-backdrop").addEventListener("click", closeCmdk);
    $("cmdk-input").addEventListener("input", () => {
      cmdkIdx = 0;
      renderCmdkList();
    });
    $("cmdk-input").addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (cmdkItems.length) {
          cmdkIdx = (cmdkIdx + 1) % cmdkItems.length;
          updateCmdkSelection();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdkItems.length) {
          cmdkIdx = (cmdkIdx - 1 + cmdkItems.length) % cmdkItems.length;
          updateCmdkSelection();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = cmdkItems[cmdkIdx];
        if (item) {
          closeCmdk();
          item.run();
        }
      }
    });

    // Global keyboard navigation: Cmd/Ctrl+K, Escape, j/k findings, r rules, / filter
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdkOpen) closeCmdk();
        else openCmdk();
        return;
      }
      if (e.key === "Escape") {
        if (cmdkOpen) { e.preventDefault(); closeCmdk(); return; }
        if (rulesOpen) { e.preventDefault(); closeRulesDrawer(); return; }
        return;
      }
      if (cmdkOpen || rulesOpen || e.metaKey || e.ctrlKey || e.altKey) return;

      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable) return;

      if (e.key === "j") {
        e.preventDefault();
        stepFinding(1);
      } else if (e.key === "k") {
        e.preventDefault();
        stepFinding(-1);
      } else if (e.key === "r") {
        e.preventDefault();
        openRulesDrawer();
      } else if (e.key === "/") {
        e.preventDefault();
        const fInp = $("findings-filter-input") || $("tool-filter");
        if (fInp) fInp.focus();
      }
    });

    window.addEventListener("hashchange", () => {
      const slug = location.hash.replace(/^#/, "").trim().toLowerCase();
      if (slug && slug !== currentTool.slug && ENG.TOOLS.some((t) => t.slug === slug)) {
        selectTool(slug, false);
      }
    });
  });
})();
