/* Small behaviours of supporting static pages, loaded with defer after the page's own script.
   - Lab: a pick rises its journey in once (150 ms, none under reduced motion); on narrow screens focuses the heading.
   - Projects index: keeps "checked DD Mon YYYY" dates together so "2026" never orphans onto its own line.
   - Non-lab static pages (/projects/*, /resume.html): provides a lightweight Cmd+K / Ctrl+K Quick Jump palette
     with ArrowUp/ArrowDown/Enter/Escape navigation (skipped on /lab/ so /lab/ owns its own Cmd+K). */
(function () {
  var reduced = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var ws = document.getElementById("workflow");
  var isLab = Boolean(ws && document.getElementById("workflow-nav")) || /^\/lab(\/|$)/.test(location.pathname || "");

  if (ws && document.getElementById("workflow-nav")) {
    document.addEventListener("click", function (e) {
      var item = e.target.closest && e.target.closest(".nav-item");
      if (!item) return;
      if (!reduced()) { ws.classList.remove("is-swapped"); void ws.offsetWidth; ws.classList.add("is-swapped"); }
      if (!matchMedia("(max-width: 1023px)").matches) return;
      ws.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      var h = document.getElementById("title");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".pp-card__meta > span:last-child"), function (s) {
    var t = s.firstChild;
    if (t && t.nodeType === 3) t.nodeValue = t.nodeValue.replace(/(checked) (\d+) (\w+) (\d{4})\s*$/, "$1\u00a0$2\u00a0$3\u00a0$4");
  });

  if (isLab) return;

  var inProjects = /\/projects\//.test(location.pathname || "");
  var rootPrefix = inProjects ? "../" : "./";
  var ITEMS = [
    { group: "Live web apps", title: "Ergon — live browser workspace", meta: "/demos/ergon/", href: rootPrefix + "demos/ergon/" },
    { group: "Live web apps", title: "Open-Ro Studio — Roblox Studio AI IDE", meta: "/demos/open-ro/", href: rootPrefix + "demos/open-ro/" },
    { group: "Live web apps", title: "Fleet — parallel worktree & DAG board", meta: "/demos/fleet/", href: rootPrefix + "demos/fleet/" },
    { group: "Live web apps", title: "Industry AI Suite /lab/ — 10-tool workbench", meta: "/lab/", href: rootPrefix + "lab/" },
    { group: "Pages", title: "Interactive Résumé Home", meta: "/", href: rootPrefix + "index.html" },
    { group: "Pages", title: "All 17 Project Pages", meta: "/projects/", href: rootPrefix + "projects/" },
    { group: "Pages", title: "Ergon Product Page", meta: "flagship", href: rootPrefix + "projects/ergon.html" },
    { group: "Pages", title: "Open-Ro Studio Product Page", meta: "flagship", href: rootPrefix + "projects/openro.html" },
    { group: "Pages", title: "Fleet Product Page", meta: "flagship", href: rootPrefix + "projects/fleet.html" },
    { group: "Pages", title: "Industry AI Suite Overview", meta: "suite", href: rootPrefix + "projects/industry-ai-suite.html" },
    { group: "Pages", title: "Sophos — Coding-Agent Desktop App", meta: "desktop", href: rootPrefix + "projects/sophos.html" },
    { group: "Pages", title: "dotz — Multi-Agent Harness Desktop", meta: "desktop", href: rootPrefix + "projects/dotz.html" },
    { group: "Pages", title: "Asmodeus — Chronological Backtesting", meta: "research", href: rootPrefix + "projects/asmodeus.html" },
    { group: "Pages", title: "Plain HTML Résumé", meta: "/resume.html", href: rootPrefix + "resume.html" },
  ];

  var backdrop = null, input = null, list = null, activeIdx = 0, filtered = ITEMS.slice(), prevFocus = null;

  function build() {
    if (backdrop) return;
    backdrop = document.createElement("div");
    backdrop.className = "cmdk-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML =
      '<div class="cmdk-dialog" role="dialog" aria-modal="true" aria-label="Quick jump">' +
      '  <div class="cmdk-head">' +
      '    <input class="cmdk-input" type="search" autocomplete="off" spellcheck="false" placeholder="Jump to a live app, product page, or résumé…" aria-label="Filter pages">' +
      '    <button type="button" class="cmdk-close" aria-label="Close quick jump">Esc</button>' +
      '  </div>' +
      '  <div class="cmdk-list" role="listbox" aria-label="Quick jump destinations"></div>' +
      '</div>';
    document.body.appendChild(backdrop);
    input = backdrop.querySelector(".cmdk-input");
    list = backdrop.querySelector(".cmdk-list");

    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });
    backdrop.querySelector(".cmdk-close").addEventListener("click", close);
    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); go(activeIdx); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
    });
    render("");
  }

  function render(query) {
    var q = (query || "").trim().toLowerCase();
    filtered = ITEMS.filter(function (it) {
      return !q || (it.title + " " + it.meta + " " + it.group).toLowerCase().indexOf(q) !== -1;
    });
    activeIdx = 0;
    list.innerHTML = "";
    if (!filtered.length) {
      var empty = document.createElement("p");
      empty.className = "cmdk-empty";
      empty.textContent = "No matching page.";
      list.appendChild(empty);
      return;
    }
    var lastGroup = "";
    filtered.forEach(function (it, idx) {
      if (it.group !== lastGroup) {
        lastGroup = it.group;
        var g = document.createElement("p");
        g.className = "cmdk-group";
        g.textContent = it.group;
        list.appendChild(g);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cmdk-item";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", String(idx === activeIdx));
      btn.dataset.idx = String(idx);
      btn.innerHTML = '<span class="cmdk-item__title"></span><span class="cmdk-item__meta"></span>';
      btn.querySelector(".cmdk-item__title").textContent = it.title;
      btn.querySelector(".cmdk-item__meta").textContent = it.meta;
      btn.addEventListener("mouseenter", function () { setActive(idx); });
      btn.addEventListener("click", function () { go(idx); });
      list.appendChild(btn);
    });
  }

  function setActive(idx) {
    activeIdx = idx;
    var btns = list.querySelectorAll(".cmdk-item");
    Array.prototype.forEach.call(btns, function (b, i) {
      b.setAttribute("aria-selected", String(i === activeIdx));
      if (i === activeIdx) b.scrollIntoView({ block: "nearest" });
    });
  }

  function move(delta) {
    if (!filtered.length) return;
    setActive((activeIdx + delta + filtered.length) % filtered.length);
  }

  function go(idx) {
    var item = filtered[idx];
    if (!item) return;
    close();
    location.assign(item.href);
  }

  function open() {
    build();
    prevFocus = document.activeElement;
    backdrop.hidden = false;
    input.value = "";
    render("");
    input.focus();
  }

  function close() {
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus();
  }

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (backdrop && !backdrop.hidden) close();
      else open();
    } else if (e.key === "Escape" && backdrop && !backdrop.hidden) {
      e.preventDefault();
      close();
    }
  });

  function mountTrigger() {
    var wrap = document.querySelector(".sub-masthead .settings-wrap");
    if (!wrap || wrap.querySelector(".quickjump-trigger")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "settings-trigger quickjump-trigger";
    btn.setAttribute("aria-label", "Quick jump (Ctrl+K)");
    btn.title = "Quick jump (Ctrl+K)";
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    btn.addEventListener("click", open);
    wrap.insertBefore(btn, wrap.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountTrigger);
  else mountTrigger();
})();
