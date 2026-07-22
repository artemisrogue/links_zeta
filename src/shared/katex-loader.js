/* Loads KaTeX from CDN for the .tt-katex tooltip variant, mirroring the three.js
   loader pattern (see tabs/triples.js loadThree): unpinned CDN fetch, onload gates
   on the library object actually existing (a captive-portal or wrong-content 200
   still fires onload), onerror just leaves the flag unset. No fallback renderer is
   needed here the way three.js has one -- .tt-katex tooltips already degrade to a
   plain .tt (data-tip only) by simply never calling ttKatexUpgrade(). */
let katexLoaded = false, katexFailed = false;

(function loadKatex() {
  const link = $el("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
  document.head.appendChild(link);

  const s = $el("script");
  s.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
  s.onload = () => {
    katexLoaded = typeof katex !== "undefined";
    katexFailed = !katexLoaded;
    if (katexLoaded) ttKatexUpgrade();
  };
  s.onerror = () => { katexFailed = true; };
  document.head.appendChild(s);
})();
