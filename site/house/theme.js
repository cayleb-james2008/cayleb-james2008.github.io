/* The theme of the static pages, the same rule as the résumé page (app/src/chrome/theme.tsx): light by default, dark when the
   system asks, and a press on the switch decides for this load only (a reload starts from the system scheme again). Loaded as a
   blocking script in <head>, so the page is painted in its theme the first time. */
(function () {
  var root = document.documentElement;
  var reduced = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var system = function () { try { return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; } };
  root.setAttribute("data-theme", system());

  function mount() {
    var bar = document.querySelector(".sub-masthead");
    if (!bar || bar.querySelector(".theme-switch")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-switch";
    var paint = function () {
      var dark = root.getAttribute("data-theme") === "dark";
      button.textContent = dark ? "Light" : "Dark";
      button.setAttribute("aria-label", dark ? "Switch to the light theme" : "Switch to the dark theme");
    };
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      var swap = function () { root.setAttribute("data-theme", next); paint(); };
      // a cross-fade of the whole page (View Transitions); without the API, or under reduced motion, it simply swaps
      if (document.startViewTransition && !reduced()) document.startViewTransition(swap); else swap();
    });
    var resume = bar.querySelector(".sub-resume");
    if (resume) bar.insertBefore(button, resume); else bar.appendChild(button);
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
