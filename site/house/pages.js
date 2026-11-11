/* Small behaviours of two supporting pages, loaded with defer after the page's own script.
   Lab: a pick rises its journey in once (150 ms, none under reduced motion); on a screen under 1024 px the journey opens below the rail, so its
   heading is brought to the top of the screen and takes focus, and the tap shows its result where the finger is.
   Projects index: each card's "repo · checked date" line keeps the date whole (its spaces become no-break spaces, in the same text node), so a wrap falls
   before "checked" and never leaves "2026" alone. */
(function () {
  var reduced = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var ws = document.getElementById("workflow");
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
})();
