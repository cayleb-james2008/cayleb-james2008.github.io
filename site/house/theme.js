/* Theme bootstrap and Settings popover for static pages (matches app/src/sections/Masthead.tsx):
   light by default, dark when the system asks until the visitor picks Light or Dark inside Settings;
   choice persists in localStorage ("theme") across every page of the site. */
(function () {
  var root = document.documentElement;
  var reduced = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var system = function () { try { return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; } };
  var stored = function () { try { var t = localStorage.getItem("theme"); return t === "dark" || t === "light" ? t : null; } catch (e) { return null; } };
  root.setAttribute("data-theme", stored() || system());

  function mount() {
    var bar = document.querySelector(".sub-masthead");
    if (!bar || bar.querySelector(".settings-wrap")) return;

    var wrap = document.createElement("div");
    wrap.className = "settings-wrap";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "settings-trigger";
    trigger.setAttribute("aria-label", "Settings");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="3"></circle>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
      "</svg>";

    var pop = document.createElement("div");
    pop.className = "settings-popover";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Settings");
    pop.hidden = true;

    var head = document.createElement("p");
    head.className = "settings-popover__head";
    head.textContent = "Settings";

    var row = document.createElement("div");
    row.className = "settings-popover__row";

    var label = document.createElement("span");
    label.className = "settings-popover__label";
    label.textContent = "Appearance";

    var seg = document.createElement("div");
    seg.className = "settings-seg";
    seg.id = "themeBtn";
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Appearance");

    var mkBtn = function (mode, text) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "settings-seg__btn";
      b.dataset.mode = mode;
      b.textContent = text;
      b.addEventListener("click", function () {
        if (root.getAttribute("data-theme") === mode) return;
        var swap = function () {
          root.setAttribute("data-theme", mode);
          paint();
          try { localStorage.setItem("theme", mode); } catch (e) {}
        };
        if (document.startViewTransition && !reduced()) document.startViewTransition(swap);
        else swap();
      });
      return b;
    };

    var lightBtn = mkBtn("light", "Light");
    var darkBtn = mkBtn("dark", "Dark");
    seg.appendChild(lightBtn);
    seg.appendChild(darkBtn);
    row.appendChild(label);
    row.appendChild(seg);
    pop.appendChild(head);
    pop.appendChild(row);
    wrap.appendChild(trigger);
    wrap.appendChild(pop);

    var paint = function () {
      var cur = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      lightBtn.setAttribute("aria-pressed", String(cur === "light"));
      darkBtn.setAttribute("aria-pressed", String(cur === "dark"));
    };

    var setOpen = function (open) {
      pop.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        pop.style.right = "0";
        var rect = pop.getBoundingClientRect();
        if (rect.left < 12) {
          pop.style.right = String(Math.round(rect.left - 12)) + "px";
        }
        paint();
        (root.getAttribute("data-theme") === "dark" ? darkBtn : lightBtn).focus();
      }
    };

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(pop.hidden);
    });

    document.addEventListener("click", function (e) {
      if (!pop.hidden && !wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pop.hidden) {
        setOpen(false);
        trigger.focus();
      }
    });

    var resume = bar.querySelector(".sub-resume");
    if (resume) bar.insertBefore(wrap, resume);
    else bar.appendChild(wrap);
    paint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
