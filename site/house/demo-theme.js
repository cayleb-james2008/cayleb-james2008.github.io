/* The theme of the three demo apps (Ergon, DSH Fleet, OpenBell), the same rule as the résumé page: light by default, dark when the system asks.
   Inside the résumé page's frame the app follows that page's switch (the frame is the same origin, so it can read the page's data-theme and watch it);
   opened on its own it follows the system scheme, live. A blocking script in <head>, so the app is painted in its theme the first time. */
(function () {
  var root = document.documentElement;
  var mq = null;
  try { mq = matchMedia("(prefers-color-scheme: dark)"); } catch (e) { /* no media queries: light */ }
  var system = function () { return mq && mq.matches ? "dark" : "light"; };
  var host = null;
  try { if (window.parent && window.parent !== window) host = window.parent.document.documentElement; } catch (e) { /* another origin: follow the system */ }
  var pick = function () { var t = host && host.getAttribute("data-theme"); return t === "dark" || t === "light" ? t : system(); };
  var apply = function () { root.setAttribute("data-theme", pick()); };
  apply();
  if (host && window.MutationObserver) new MutationObserver(apply).observe(host, { attributes: true, attributeFilter: ["data-theme"] });
  if (mq && mq.addEventListener) mq.addEventListener("change", apply);
})();
