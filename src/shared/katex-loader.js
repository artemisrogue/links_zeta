/* Loads KaTeX from the vendored copy in vendor/katex/ (v0.16.11, self-hosted so the
   app stays fully offline-capable -- no CDN, no network dependency at all), mirroring
   the three.js loader pattern (see tabs/triples.js loadThree) for the honesty check
   even though the failure mode here is "file missing/corrupted" rather than "network
   down": onload gates on the library object actually existing, not just the load
   event; onerror just leaves the flag unset. No fallback renderer is needed here the
   way three.js has one -- .tt-katex tooltips already degrade to a plain .tt
   (data-tip only) by simply never calling ttKatexUpgrade(). Paths are relative to
   index.html itself, so this works identically deployed (GitHub Pages) and opened
   directly via file://. */
let katexLoaded = false, katexFailed = false;

(function loadKatex() {
  const link = $el("link");
  link.rel = "stylesheet";
  link.href = "vendor/katex/katex.min.css";
  document.head.appendChild(link);

  const s = $el("script");
  s.src = "vendor/katex/katex.min.js";
  s.onload = () => {
    katexLoaded = typeof katex !== "undefined";
    katexFailed = !katexLoaded;
    if (katexLoaded) ttKatexUpgrade();
  };
  s.onerror = () => { katexFailed = true; };
  document.head.appendChild(s);
})();
