
window.gotoTab = function (name) {
  const btn = $q(`.tab-btn[data-tab="${name}"]`);
  if (!btn) return;
  btn.click();
  window.scrollTo(0, 0);
  // A jump that only repaints leaves keyboard focus on a button that is now on a
  // hidden panel, so the next Tab restarts from the top of the document. Move
  // focus to the panel the reader was sent to.
  const panel = $id("tab-" + name);
  if (panel) { panel.tabIndex = -1; panel.focus({ preventScroll: true }); }
};


// ARIA tablist wiring
$q("nav.tabs").setAttribute("role", "tablist");

$qa(".tab-btn").forEach(btn => {
  const n = btn.dataset.tab;
  btn.id = "tabbtn-" + n;
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-controls", "tab-" + n);
  btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
  const p = $id("tab-" + n);
  p.setAttribute("role", "tabpanel");
  p.setAttribute("aria-labelledby", btn.id);
  btn.addEventListener("click", () => {
    $qa(".tab-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
    $qa(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    $id("tab-" + btn.dataset.tab).classList.add("active");
  });
});


// One orientation note per mirror pair, shown only when the columns stack.
$qa(".twocol").forEach(tc => {
  const topo = tc.querySelector(".col.topo"), arith = tc.querySelector(".col.arith");
  if (!topo || !arith) return; // some .twocol blocks are not mirror pairs
  const n = document.createElement("div");
  n.className = "stacknote";
  n.innerHTML = "<b>Stacked view.</b> These two columns sit side by side on a wider screen, and the text refers to them that way: "
    + "<b>“at left” / “topology”</b> means the " + (topo.compareDocumentPosition(arith) & Node.DOCUMENT_POSITION_FOLLOWING ? "first" : "second")
    + " panel here, <b>“at right” / “arithmetic”</b> the other, and <b>“opposite”</b> means the other one of the pair.";
  tc.insertBefore(n, tc.firstChild);
});


// Enter was dead in every numeric box: a presenter could type a prime, press Enter,
// and leave the new value sitting above the previous pair's verdict. Bind each box to
// its own Compute, and mark the panel stale as soon as box and screen diverge.
[["pInput", "computeLegendre"], ["qInput", "computeLegendre"], ["frobInput", "frobCompute"],
 ["ccP1", "ccRun"], ["ccP2", "ccRun"], ["ccQ", "ccRun"], ["ccX", "ccRun"], ["ccY", "ccRun"], ["ccZ", "ccRun"]]
  .forEach(([input, button]) => {
    const el = $id(input), btn = $id(button);
    if (!el || !btn) return;
    el.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      btn.click();
    });
  });


$qa(".why-toggle").forEach(btn => {
  // expose disclosure state and target (the pattern #fsTooltip already uses)
  btn.setAttribute("aria-controls", btn.dataset.why);
  btn.setAttribute("aria-expanded", String($id(btn.dataset.why).classList.contains("open")));
  btn.addEventListener("click", () => {
    const open = $id(btn.dataset.why).classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
});


// Canvas text alternatives (R3-A3)
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)");

for (const [id, lbl] of [
  ["pairsCanvas", ""],
  ["arcCanvas", ""],
  ["borroCanvas", "Borromean rings: three circles, no two linked; linking numbers computed in step 1 below."],
  ["b4Canvas", ""],
]) {
  const c = $id(id);
  c.setAttribute("role", "img");
  if (lbl) c.setAttribute("aria-label", lbl);
}

function renderCoverTwins() {
  // (a) Triples: rho(K3) = corner of N3(F2) with mu-bar mod 2; orbit count = |deck|/order
  const mu2 = (((computeMagnusLongitude12()["1,2"] || 0) % 2) + 2) % 2;
  const o3 = n3Order(0, 0, mu2);
  const f9 = frobOrderTriple(937n);
  $id("tripleCoverCap").innerHTML =
    `The top cover <span class="acc">X̃</span> is the <span class="tt" data-tip="A purely topological construction: π₁ of the link complement maps onto N₃(F₂), the group of upper-unitriangular 3×3 matrices over F₂ (≅ D₄), meridians to the generator matrices; the 8-sheet cover it classifies is the mod-2 Heisenberg cover. Why it exists exactly when lk(K₁,K₂) is even, a sketch: N₃(F₂) is the central extension of F₂² by F₂ classified by the cup product x₁ ∪ x₂, and that class evaluates to lk mod 2 — the meridian map lifts iff the pairwise level vanishes: the lower vanishing IS the lifting obstruction vanishing. Morishita (chs. 4/8, 1st ed.) builds it as the topological mirror of Rédei's field k₁₃,₆₁ — the analogy is his; the cover itself owes nothing to number theory.">mod-2 Heisenberg cover</span> — named for its deck group, not for Rédei; the field k₁₃,₆₁ opposite is its arithmetic <i>mirror</i>, not its definition. In <span class="acc">X̃</span>: K₃'s preimage is <b>${8 / o3} loops winding ${o3 === 2 ? "twice" : o3 + "×"}</b> — ρ(K₃) = (lk, lk, μ̄) mod 2 = (0, 0, ${mu2}), order ${o3} by powering, all computed — ↔ <b>937's ${8 / f9.ord} primes of residue degree ${f9.ord}</b> in k₁₃,₆₁ (Frobenius order ${f9.ord}, computed). Loops × winding = ${8 / o3} × ${o3} = ${(8 / o3) * o3} = |deck| on the left; g × f = ${8 / f9.ord} × ${f9.ord} = ${(8 / f9.ord) * f9.ord} = [k₁₃,₆₁ : Q] on the right — the same <span class="tt" data-tip="A loop with monodromy of order d in a deck group G has preimage |G|/d loops, each winding d times (standard covering-space counting, cited); a prime with Frobenius of order f in Gal has g = |Gal|/f primes above it, each of residue degree f (e = 1 here). One bookkeeping, two languages: |G| = count × size.">|G| = count × size bookkeeping</span>, and the factor twins ${tFactor(o3, 8)} / ${localFactor(937, f9.ord, 8)} — worked through on <button type="button" class="jump" onclick="gotoTab('zeta');var d=$id('zxK1361');if(d)d.open=true;var a=$id('zetaK1361');if(a)a.scrollIntoView();">the ζ of k₁₃,₆₁ card</button> of the Zeta tab.`;
  // (b) Quads: rho(K4) = corner of N4(F2) with mu-bar(1234) mod 2 (Milnor-model level)
  const q2 = (((computeMagnusTripleCommutator()["1,2,3"] || 0) % 2) + 2) % 2;
  const o4 = matOrderF2([[1, 0, 0, q2], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
  const w449 = quad449Ord();
  const arith449 = w449 === null
    ? `449's factor: nothing asserted — the conjugate check failed, which a prime modulus forbids (the four values are Frobenius-stable, so agreement is forced; this branch is an internal guard, not a mathematical contingency — the banner at right rules)`
    : `<b>449's ${64 / w449} orbits of size ${w449}</b> (conjugate symbols recomputed live): factor twins <b>${tFactor(o4, 64)}</b> / <b>${localFactor(449, w449, 64)}</b>`;
  $id("quadCoverCap").innerHTML =
    `In the top cover: K₄'s preimage is <b>${64 / o4} loops of ${o4 === 2 ? "double length" : "length ×" + o4}</b> — ρ(K₄) sits at the corner of N₄(F₂), entries 0 except μ̄(1234) mod 2 = ${q2} (computed at left; Milnor-model honesty, as the note above), order ${o4} by powering — ↔ ${arith449}. The two Heisenberg covers share the component K₂ the way the two Rédei fields opposite share the prime 8081 — the shared object is what lets the join reach 32 sheets, not 64.`;
  // (c) Pairs: both cases, static by design (state-independent)
  $id("pairsCoverCap").innerHTML =
    `K₂'s preimage upstairs: <b>2 loops</b> when lk(K₁,K₂) is even — split, two primes above — versus <b>1 loop winding twice</b> when lk is odd — inert: the Hopf case, one prime of residue degree 2. Either way loops × winding = 2 = |deck| — and the ζ ↔ Δ box above turns whichever case you compute into its Euler factor, live.`;
  ttFocusable($id("tripleCoverCap"));
  ttFocusable($id("quadCoverCap"));
}

$id("runTestsBtn").addEventListener("click", () => {
  const panel = $id("testsPanel");
  if (panel.classList.contains("open")) { panel.classList.remove("open"); return; }
  runSelfTests();
});


updatePairsLabels();
renderPairs();
renderLegendreTable(5n, 29n);
renderArcFigure();
arcAnimLoop();
renderBorro();
renderTripleSteps();
renderTopoTripleSteps();
renderSurfaceLadder();
renderCoverTwins();
renderDeltaBorGrid();
renderQuadSteps();
renderB4();
renderBorroZeta();
renderCovers();
renderLefschetz();
renderDedekind();
renderKnottedPrime();
renderK1361Worked();
renderBorroWorked();
renderHopfWorked();
renderFiveWorked();
$id("ccRun").addEventListener("click", runCertCockpit);
runCertCockpit(); // seeded (5, 29, 109; 7, 2, 1) — computed at load like everything else
renderQuad449Worked();
renderB4Worked();
initLadder();
renderFrobenius(107n);
renderPresMat();
renderGammaComputed();
$id("chebRun").addEventListener("click", renderChebTally);
ttFocusable();
$id("qaExpand").addEventListener("click", () => $qa("#qaList details").forEach(d => d.open = true));
$id("qaCollapse").addEventListener("click", () => $qa("#qaList details").forEach(d => d.open = false));

// R6 G2: pin the gallery's load state (state-robust: captured once, before any user interaction)
const ZX_AT_LOAD = [...$qa("#tab-zeta details.zx")].map(d => ({ id: d.id, open: d.open }));
const QA_AT_LOAD = [...$qa("#qaList details.qa-item")].map(d => d.open); // Klein A5: Q&A load state, captured once
const CCOUT_AT_LOAD = $id("ccOut").textContent; // cockpit's seeded verdict, captured once (state-robust pin)
// Pairs panel at rest, captured before the suite touches it. Twice now a fix has
// leaked probe state into the boot view — once leaving a caption reading "Both
// primes are ≡ 3 (mod 4)" under a figure showing 5 and 29 — and both times a green
// suite shipped it, because nothing asserted that the page's panels agree with each
// other when nobody has done anything.
const PAIRS_AT_LOAD = {
  sync: $id("pairsSyncNote").textContent.trim(),
  stale: $id("pairsStale").textContent.trim(),
  banner: $id("pairsBanner").textContent.trim(),
};
runSelfTests();
$id("testsPanel").classList.remove("open");


/* Klein B5: deep links — #tab=zeta&open=zxK1361,zxHopf&goto=zetaK1361 (presenter choreography, one click per beat). */
function routeFromHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  const dec = s => { try { return decodeURIComponent(s); } catch (e) { return s; } }; // malformed %-escapes must not abort the boot tail
  const params = Object.fromEntries(h.split("&").map(kv => kv.split("=").map(dec)));
  if (params.tab) try { gotoTab(params.tab); } catch (e) { }
  if (params.open) params.open.split(",").forEach(id => { const d = $id(id); if (d && d.tagName === "DETAILS") d.open = true; });
  const target = params.goto || (params.open || "").split(",")[0];
  if (target && $id(target)) setTimeout(() => $id(target).scrollIntoView({ block: "start" }), 60);
}

(function trackNavHeight() {
  const nav = $q("nav.tabs");
  if (!nav) return;
  const set = () => document.documentElement.style.setProperty("--navh", (nav.offsetHeight + 8) + "px");
  set();
  addEventListener("resize", set);
  if (window.ResizeObserver) new ResizeObserver(set).observe(nav);
})();


routeFromHash();
// Back/Forward and in-session fragment edits must move the page too, or the URL
// and what is on screen disagree -- which for a presenter driving from bookmarks
// is the whole point of the feature.
window.addEventListener("hashchange", routeFromHash);


/* Klein B6: 't' runs the suite and shows it — the closing beat, one keystroke. */
document.addEventListener("keydown", e => {
  if (e.key !== "t" || e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
  $id("runTestsBtn").click();
  $id("runTestsBtn").scrollIntoView({ block: "start" });
});


/* Klein D12: roving tabindex on the tablist — one tab stop, arrows move between tabs. */
(function rovingTabs() {
  const tabs = [...$qa(".tab-btn")];
  const sync = () => tabs.forEach(b => b.tabIndex = b.classList.contains("active") ? 0 : -1);
  sync();
  $q("nav.tabs").addEventListener("keydown", e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    tabs[j].click(); tabs[j].focus(); sync();
  });
  tabs.forEach(b => b.addEventListener("click", () => setTimeout(sync, 0)));
})();
