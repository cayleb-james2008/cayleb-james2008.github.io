/* Theme synchronization for the three embedded live web apps (Ergon, Open-Ro, Fleet).
   - Inside an iframe on cayleb-james2008.github.io: follows the parent page's <html data-theme> live via MutationObserver.
   - Opened standalone at /demos/<app>/: respects the app's own Settings choice (data-key), then the site's localStorage("theme"), then prefers-color-scheme.
   Runs synchronously in <head> before React mounts so first paint and React state agree. */
(function () {
  var root = document.documentElement;
  var script = document.currentScript;
  var appKey = script ? script.getAttribute("data-key") : null;
  var mq = null;
  try { mq = matchMedia("(prefers-color-scheme: dark)"); } catch (e) { /* no media queries: light */ }
  var system = function () { return mq && mq.matches ? "dark" : "light"; };
  var host = null;
  try { if (window.parent && window.parent !== window) host = window.parent.document.documentElement; } catch (e) { /* cross-origin: standalone */ }
  var readKey = function (k) {
    if (!k) return null;
    try {
      var v = localStorage.getItem(k);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  };
  var pick = function () {
    if (host) {
      var ht = host.getAttribute("data-theme");
      if (ht === "dark" || ht === "light") return ht;
    }
    return readKey(appKey) || readKey("theme") || system();
  };
  var apply = function () {
    var t = pick();
    root.setAttribute("data-theme", t);
    root.classList.toggle("dark", t === "dark");
  };
  apply();
  if (host && window.MutationObserver) {
    new MutationObserver(apply).observe(host, { attributes: true, attributeFilter: ["data-theme"] });
  }
  if (!host && mq && mq.addEventListener) {
    mq.addEventListener("change", function () {
      if (!readKey(appKey) && !readKey("theme")) apply();
    });
  }
})();
