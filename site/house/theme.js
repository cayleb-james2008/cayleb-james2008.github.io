/* The theme of the static pages, the same rule as the résumé page (app/src/chrome/theme.tsx) and the house skill's theme toggle: light by
   default, dark when the system asks until the person chooses, and the choice is kept in localStorage (key "theme", guarded) so every page
   of the site opens in it. Loaded as a blocking script in <head>, so the page is painted in its theme the first time. */
(function () {
  var root = document.documentElement;
  var reduced = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var system = function () { try { return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; } };
  var stored = function () { try { var t = localStorage.getItem("theme"); return t === "dark" || t === "light" ? t : null; } catch (e) { return null; } };
  root.setAttribute("data-theme", stored() || system());

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
      var swap = function () { root.setAttribute("data-theme", next); paint(); try { localStorage.setItem("theme", next); } catch (e) { /* private mode: the choice is just not remembered */ } };
      // a cross-fade of the whole page (View Transitions); without the API, or under reduced motion, it simply swaps
      if (document.startViewTransition && !reduced()) document.startViewTransition(swap); else swap();
    });
    var resume = bar.querySelector(".sub-resume");
    if (resume) bar.insertBefore(button, resume); else bar.appendChild(button);
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
