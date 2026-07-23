// Staleness is a property of the state, not of which event happened to fire, so
// this is called from renderLegendreTable — the one function every path that
// changes the display goes through — as well as on typing.
function pairsStaleSync() {
  const note = $id("pairsStale");
  if (!note) return;
  const p = parseIntegerInput($id("pInput").value), q = parseIntegerInput($id("qInput").value);
  const stale = pairsComputed.p !== null &&
    (p === null || q === null || p !== pairsComputed.p || q !== pairsComputed.q);
  note.textContent = stale
    ? `Showing (${pairsComputed.p}, ${pairsComputed.q}) — press Compute (or Enter) to use the pair now in the boxes.`
    : "";
}

["pInput", "qInput"].forEach(id => $id(id).addEventListener("input", pairsStaleSync));


const pairsState = { linked: false, liftOffset: 0, liftAnim: null };

const pairsCanvas = $id("pairsCanvas");

const pctx = pairsCanvas.getContext("2d");


function pairsCircles(offsetB) {
  return {
    A: { cx: 175, cy: 150, r: 85 },
    B: { cx: 245 + (offsetB || 0), cy: 150, r: 85 }
  };
}

// The two Seifert disks are drawn with these translucent tints over CANVAS_BG;
// labels sitting on them halo in the blend, not in the bare canvas colour.
const ARC_TINT = { S1: "#d9e6ee", S2: "#dcebe1" }; // 0.16 alpha of the stroke colour over CANVAS_BG

function renderPairs() {
  const off = pairsState.liftOffset || 0;
  const { A, B } = pairsCircles(off);
  pctx.clearRect(0, 0, pairsCanvas.width, pairsCanvas.height);

  const pts = circleIntersections(A, B);
  let underA = [], underB = [];
  if (pts.length === 2) {
    const aAngles = pts.map(p => angleOnCircle(A, p));
    const bAngles = pts.map(p => angleOnCircle(B, p));
    if (!pairsState.linked) {
      underB = bAngles; // A always on top
    } else {
      underB = [bAngles[0]]; // alternating
      underA = [aAngles[1]];
    }
  }
  drawCircleWithGaps(pctx, A, underA, { color: "#1b6ca8" });
  drawCircleWithGaps(pctx, B, underB, { color: "#2e8b57" });

  pctx.fillStyle = "#1b6ca8";
  pctx.font = "13px 'Palatino Linotype', Palatino, Georgia, serif";
  haloText(pctx, "K1", A.cx - 6, A.cy - A.r - 8);
  pctx.fillStyle = "#2e8b57";
  haloText(pctx, "K2", B.cx - 6, B.cy - B.r - 8);
  circleArrow(pctx, A, Math.PI, "#1b6ca8");
  circleArrow(pctx, B, 0, "#2e8b57");
  pairsCanvas.setAttribute("aria-label", `Two circles K1 (blue) and K2 (green), ${pairsState.linked ? "linked as the Hopf link" : "unlinked"}; lk in the label below.`);
}


function updatePairsLabels() {
  $id("pairsStateLabel").textContent = pairsState.linked ? "lk = ±1  (Hopf link)" : "lk = 0  (unlinked)";
}


$id("pairsToggleBtn").addEventListener("click", () => {
  pairsState.linked = !pairsState.linked;
  pairsState.liftOffset = 0;
  $id("pairsLiftNote").textContent = " ";
  updatePairsLabels();
  renderPairs();
  renderArcFigure(); // keep the symmetry figure in step
  // The two columns are meant to be one proposition proved twice, so the drawing
  // must not sit beside arithmetic for a different link. Bring the arithmetic to
  // the pair this topology exhibits — exactly what the presets do in reverse.
  const [tp, tq] = pairsState.linked ? [5n, 13n] : [5n, 29n];
  $id("pInput").value = String(tp); $id("qInput").value = String(tq);
  renderLegendreTable(tp, tq);
});


$id("pairsLiftBtn").addEventListener("click", () => {
  if (pairsState.liftAnim) cancelAnimationFrame(pairsState.liftAnim);
  const note = $id("pairsLiftNote");
  const start = performance.now();
  const duration = 900;
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    if (!pairsState.linked) {
      pairsState.liftOffset = 140 * t;
      note.textContent = t >= 1 ? "Separated — the circles were never entangled." : "";
    } else {
      const bounce = t < 0.55 ? (t / 0.55) : 1 - (t - 0.55) / 0.45;
      pairsState.liftOffset = 55 * Math.max(0, bounce);
      note.textContent = t >= 1 ? "Bounced back — an animation, not an argument: the return is this easing curve, not a proof. What is genuine is lk = ±1, computed from the crossings; that is the obstruction the picture is illustrating." : "";
    }
    renderPairs();
    if (t < 1) pairsState.liftAnim = requestAnimationFrame(step);
  }
  pairsState.liftAnim = requestAnimationFrame(step);
});


function isOneMod4(n) { return n > 1n && n % 4n === 1n; }


function renderPairsThread(p, q, sym) {
  const box = $id("pairsThread");
  if (sym !== 1 && sym !== -1) { box.style.display = "none"; return; }
  box.style.display = "";
  const e = (q - 1n) / 2n;
  const pw = powmod(p, e, q); // ±1 by Euler's criterion, computed
  let orbits;
  if (sym === 1) {
    const r = tonelliShanks(p, q);
    orbits = `Split: both roots exist mod ${q} — ${r[0]} and ${r[1]} = −${r[0]}, computed — and Frobenius fixes each: r<sup>${q}</sup> = (r²)<sup>${e}</sup>·r = ${p}<sup>${e}</sup>·r = r, since ${p}<sup>${e}</sup> ≡ ${pw} (mod ${q}). <b>Two orbits of period 1</b>: local factor ${localFactor(q, 1, 2)} = (1−t)⁻¹(1−t)⁻¹.`;
  } else {
    orbits = `Inert: the roots live upstairs in F<sub>${q}²</sub>, and Frobenius swaps them: r<sup>${q}</sup> = (r²)<sup>${e}</sup>·r = ${p}<sup>${e}</sup>·r = −r, since ${p}<sup>${e}</sup> ≡ ${pw} ≡ −1 (mod ${q}), computed. <b>One orbit of period 2</b>: local factor ${localFactor(q, 2, 2)} = (1−t)⁻¹(1+t)⁻¹.`;
  }
  box.innerHTML = `${TB}<b>The thread — this pair's Euler factor, live.</b> Frobenius x ↦ x<sup>${q}</sup> acts on the two roots of x² − ${p}. ${orbits} With t = ${q}⁻ˢ these are exactly the Euler factors — the per-prime pieces — of ζ<sub>Q(√${p})</sub> = ζ(s)·L(s, χ), Riemann's zeta (the K = Q case) times a twin series built from exactly these ±1 symbols: split ⇒ (1−t)⁻², inert ⇒ (1−t)⁻¹(1+t)⁻¹ = (1−t²)⁻¹ — assembled into the full zeta on the <button type="button" class="jump" onclick="gotoTab('zeta');var d=$id('zxSqrt5');if(d){d.open=true;d.scrollIntoView();}">Zeta tab</button>.`
    + (!isOneMod4(p) && !isOneMod4(q)
      ? `<div class="tln">↔ topology: <b>withheld for this pair</b> — both primes ≡ 3 (mod 4), so this symbol is order-dependent, (${p}/${q}) = −(${q}/${p}), while lk is symmetric: per the banner above, no lk-parity gloss. The Euler factor stands — it reads ${q}'s splitting in the specific field Q(√${p}) (fixed once and for all), where the ordering is part of the data.</div>`
      : `<div class="tln">↔ topology (cited reasoning, not computed): in the double cover of the K₁-complement — the cover this symbol mirrors — the preimage of K₂ is <span class="tt tt-left" data-tip="The coset argument, standard: K₂ lifts to a loop iff its class dies under π₁ → Z/2, i.e. iff lk(K₁,K₂) is even; preimage components = cosets of the image subgroup — even lk: two disjoint lifts; odd lk: one curve traversing K₂ twice.">two disjoint copies when lk is even</span> (two period-1 orbits of the deck action), one connected curve double-covering K₂ when lk is odd (one period-2 orbit). The same bookkeeping — and it is what the Lefschetz zeta of the deck transformation records.</div>`);
  ttFocusable(box);
}


let pairsComputed = { p: null, q: null };

function renderLegendreTable(p, q) {
  pairsComputed = { p, q }; // what is on screen, as distinct from what is in the boxes
  // The sync note is a statement ABOUT the pair being drawn, so it must not survive
  // a repaint. Without this, the boot-time self-test's (3,7) probe left "Both primes
  // are ≡ 3 (mod 4)" sitting under the figure while the panel showed (5, 29).
  { const sn = $id("pairsSyncNote"); if (sn) sn.textContent = ""; }
  setTimeout(pairsStaleSync, 0);
  const warn = $id("pairsWarn");
  const table = $id("legendreTable");
  const banner = $id("pairsBanner");
  table.innerHTML = "";
  banner.textContent = "";
  banner.className = "banner";
  if (!isPrimeSmall(p) || !isPrimeSmall(q) || p === q || p === 2n || q === 2n) {
    warn.style.color = "var(--bad)";
    warn.setAttribute("role", "alert"); // a refusal, not a remark
    warn.textContent = "Cannot compute — " + (p === q ? "p and q must be distinct primes."
      : (p === 2n || q === 2n) ? "p and q must be odd — the prime 2 needs its own local analysis (it is the ramification the mod-4 convention tames)."
      : "Enter two distinct odd primes — Euler's criterion presumes an odd prime modulus.");
    // Hypotheses failed: nothing below may be computed or typeset.
    renderHilbertTable(p, q, null, null);
    renderPairsThread(p, q, null);
    return;
  } else if (isOneMod4(p) && isOneMod4(q)) {
    warn.style.color = "var(--muted)";
    warn.setAttribute("role", "status"); // a remark about the pair, not a refusal
    warn.textContent = "Both ≡ 1 (mod 4): the papers' orientability convention — the 2-adic factor is +1 and (p/q) = (q/p) on the nose.";
  } else if (isOneMod4(p) || isOneMod4(q)) {
    warn.style.color = "var(--muted)";
    warn.setAttribute("role", "status"); // a remark about the pair, not a refusal
    warn.textContent = "One of the pair is ≡ 3 (mod 4) — outside the papers' convention, but since the other is ≡ 1 (mod 4) the 2-adic Hilbert factor is still +1, so reciprocity still reads (p/q) = (q/p). One caveat: Q(√p) for p ≡ 3 (mod 4) has discriminant 4p — ramified at 2 as well as p — so the 'surface touching only its own knot' reading belongs to the ≡ 1 slot; splitting and symmetry are what survive here.";
  } else {
    warn.style.color = "var(--muted)";
    warn.setAttribute("role", "status"); // a remark about the pair, not a refusal
    warn.textContent = "Both ≡ 3 (mod 4): reciprocity flips sign, (p/q) = −(q/p) — the −1 is exactly the 2-adic factor in the product formula below, which is the point: the ≡ 1 (mod 4) convention does not make that factor go away, it chooses the case where it equals +1. Here it is visible as a term rather than hidden as an exception. Caveat that applies to both fields now: for p ≡ 3 (mod 4), Q(√p) has discriminant 4p — ramified at 2 as well as p — so the 'surface touching only its own knot' reading belongs to the ≡ 1 slot; splitting and antisymmetry are what survive.";
  }
  let pq, qp, err = null;
  try { pq = legendre(p, q); } catch (e) { err = e.message; }
  try { qp = legendre(q, p); } catch (e) { err = e.message; }
  if (err) {
    table.innerHTML = `<tr><td colspan="2" class="fail">${err}</td></tr>`;
    renderHilbertTable(p, q, null, null);
    renderPairsThread(p, q, null);
    return;
  }
  const bothThree = !isOneMod4(p) && !isOneMod4(q);
  const rows = [
    [`(p / q) via <span class="tt tt-left tt-katex" data-tip="a^((p−1)/2) mod p is +1 exactly when a is a nonzero square mod p, and p−1 (i.e. −1) when it is not. Computed here with BigInt fast exponentiation — every symbol on this page goes through this one function." data-latex-html="<span class='katex-frag' data-latex='a^{(p-1)/2} \\bmod p'>a^((p−1)/2) mod p</span> is +1 exactly when a is a nonzero square mod p, and p−1 (i.e. −1) when it is not. Computed here with BigInt fast exponentiation — every symbol on this page goes through this one function.">Euler's criterion</span>`, `(${p} / ${q}) = ${pq > 0 ? "+1" : pq < 0 ? "−1" : "0"}`],
    ["(q / p)", `(${q} / ${p}) = ${qp > 0 ? "+1" : qp < 0 ? "−1" : "0"}`],
    ["reciprocity", bothThree
      ? (pq === -qp ? '<span class="ok">(p/q) = −(q/p) ✓ (both ≡ 3 mod 4: the sign is the 2-adic factor)</span>' : '<span class="fail">(p/q) ≠ −(q/p) ?!</span>')
      : (pq === qp ? '<span class="ok">(p/q) = (q/p) ✓</span>' : '<span class="fail">(p/q) ≠ (q/p) ?!</span>')],
  ];
  for (const [k, v] of rows) {
    const tr = $el("tr");
    tr.innerHTML = `<td class="k">${k}</td><td class="v">${v}</td>`;
    table.appendChild(tr);
  }
  // Gloss only where (p/q) = (q/p) (R2-M3).
  const noGloss = `. <b>No linking gloss here</b>: with both primes ≡ 3 (mod 4) the symbol is order-dependent — (${p}/${q}) = −(${q}/${p}), swap the inputs and the banner flips — while lk is symmetric (proved twice on this tab). The Hopf/unlink dictionary is reserved for pairs with a prime ≡ 1 (mod 4).`;
  if (pq === 1) {
    banner.classList.add("topo");
    banner.innerHTML = bothThree
      ? `<b>+1</b> — ${q} <span class="tt" data-tip="The prime ${q} factors into two distinct primes in the ring of integers of Q(√${p}): Frobenius is trivial.">splits</span> in Q(√${p})${noGloss}`
      : `<b>+1</b> — ${q} <span class="tt" data-tip="The prime ${q} factors into two distinct primes in the ring of integers of Q(√${p}): Frobenius is trivial, the curve misses the surface — no puncture.">splits</span> in Q(√${p}): unlinked.`;
  } else if (pq === -1) {
    banner.innerHTML = bothThree
      ? `<b>−1</b> — ${q} is <span class="tt" data-tip="The prime ${q} stays prime in Q(√${p}): Frobenius is the flip √${p} ↦ −√${p}.">inert</span> in Q(√${p})${noGloss}`
      : `<b>−1</b> — ${q} is <span class="tt" data-tip="The prime ${q} stays prime in Q(√${p}): Frobenius is the flip √${p} ↦ −√${p} — one puncture, the mod-2 shadow of lk = ±1.">inert</span> in Q(√${p}): the Hopf pair.`;
  } else {
    banner.innerHTML = `<b>0</b> — ${q} <span class="tt" data-tip="The prime divides the discriminant: it 'branches' in the field, like a singular point of the covering. Excluded by the p ≡ 1 (mod 4), p ≠ q convention.">ramifies</span> in Q(√${p}).`;
  }
  renderHilbertTable(p, q, pq, qp);
  renderPairsThread(p, q, pq);
  ttFocusable();
}


function renderHilbertTable(p, q, pq, qp) {
  const table = $id("hilbertTable");
  const note = $id("hilbertNote");
  table.innerHTML = "";
  if (pq === null || pq === undefined || qp === null || qp === undefined) {
    note.textContent = "Enter valid primes on the Arithmetic panel above.";
    return;
  }
  // Klein C3/F3: (p,q)_2 computed by genuine 2-adic solvability — a primitive zero of
  // z² = px² + qy² mod 8 (Hensel: odd squares lift from mod 8) — NOT by the reciprocity-
  // equivalent closed form, which is displayed only as the cross-check so the ✓ can fail.
  const two = hilbert2adic(p, q);
  const twoClosed = Number((p - 1n) / 2n % 2n) * Number((q - 1n) / 2n % 2n) % 2 === 0 ? 1 : -1;
  const rows = [
    ["v = ∞", "+1", "both p, q > 0"],
    ["v = 2", two > 0 ? "+1" : "−1", `computed: primitive solvability of z² ≡ px² + qy² (mod 8) — 512 triples enumerated; odd squares lift 8-adically (Hensel). Closed form (−1)<sup>((p−1)/2)·((q−1)/2)</sup> = ${twoClosed > 0 ? "+1" : "−1"} ${two === twoClosed ? "— agrees ✓ (an independent check: that formula is reciprocity-equivalent, so it never gets to vote here)" : "— DISAGREES ✗"}`],
    ["v ∉ {2, p, q, ∞}", "+1", `<i>cited, not enumerated</i> — a standard theorem about an infinite family of places: p and q are units in Z<sub>v</sub>, so the form z² = px² + qy² has a primitive v-adic zero (Hensel). The two rows below and the v = 2 row above are computed for this pair; this one is quoted.`],
    [`v = ${p}`, qp > 0 ? "+1" : "−1", `(${q}/${p}): mod ${p} the px² term dies, forcing z² ≡ ${q}y² (y a unit) — solvable iff ${q} is a square mod ${p}; Hensel lifts the converse`],
    [`v = ${q}`, pq > 0 ? "+1" : "−1", `(${p}/${q}): the same argument mod ${q}`],
  ];
  const product = two * pq * qp;
  for (const [k, v, why] of rows) {
    const tr = $el("tr");
    tr.innerHTML = `<td class="k">${k}</td><td class="v">${v}</td><td style="color:var(--muted);font-size:.8rem;">${why}</td>`;
    table.appendChild(tr);
  }
  const tr = $el("tr");
  tr.innerHTML = `<td class="k"><b>∏<sub>v</sub> (p,q)<sub>v</sub></b></td><td class="v ${product === 1 ? "ok" : "fail"}">${product > 0 ? "+1 ✓" : "−1 ✗"}</td><td style="color:var(--muted);font-size:.8rem;">${two === 1 ? "forces (p/q)(q/p) = 1" : "forces (p/q)(q/p) = −1 — the −1 is the v = 2 factor"}</td>`;
  table.appendChild(tr);
  note.innerHTML = (two === 1
    ? `The product formula collapses to (${p}/${q})(${q}/${p}) = 1 — reciprocity is the closedness of one global object.`
    : `The product formula collapses to (p,q)₂·(${p}/${q})(${q}/${p}) = 1 with (p,q)₂ = −1 here, i.e. (${p}/${q})(${q}/${p}) = −1 — the sign flip of this congruence class is itself part of the closedness of the same global object.`)
    // The whole argument in one place: the mod-4 convention is a choice of where a local term vanishes.
    + `<div class="honest" style="margin-top:10px;"><b>What the ≡ 1 (mod 4) convention actually is.</b> Every place contributes a factor and the factors multiply to 1 — that is the product formula, and it holds for <i>every</i> pair. The archimedean and the unramified places give +1 always; the two interesting places give the Legendre symbols; and the whole difference between the two cases is <b>the single factor at v = 2</b>, computed above by 2-adic solvability. Choosing p ≡ 1 (mod 4) does not remove that factor — <b>it selects the pairs where it equals +1</b>, so that (p/q) = (q/p) on the nose and the symbol can be read as a symmetric linking number. Take both primes ≡ 3 (mod 4) and the factor is −1: reciprocity flips, the symbol stops being symmetric, and this app withholds the linking gloss. So the convention is not a technicality tucked into the hypotheses — it is the decision to work where one local term is invisible, and the ≡ 3 case is the same theorem with that term switched on. <span style="color:var(--muted);">Try (3, 7) above to see it.</span></div>`;
}


$id("computeLegendre").addEventListener("click", () => {
  const p = parseIntegerInput($id("pInput").value);
  const q = parseIntegerInput($id("qInput").value);
  if (p === null || q === null) {
    const warn = $id("pairsWarn");
    warn.style.color = "var(--bad)";
    warn.setAttribute("role", "alert");
    warn.textContent = "Cannot compute — enter plain decimal integers (no exponents or fractions), at most 9 digits.";
    // Clear everything downstream: leaving the previous pair's results up makes
    // the panel describe primes that are no longer in the boxes.
    $id("legendreTable").innerHTML = "";
    const banner = $id("pairsBanner");
    banner.textContent = ""; banner.className = "banner";
    renderHilbertTable(null, null, null, null);
    renderPairsThread(null, null, null);
    $id("pairsSyncNote").textContent = "";
    return;
  }
  renderLegendreTable(p, q);
  // Klein D3: Compute syncs the topology drawing exactly as the presets do, whenever the lk gloss is licensed.
  const usable = isPrimeSmall(p) && isPrimeSmall(q) && p !== q && p !== 2n && q !== 2n;
  const licensed = usable && (p % 4n === 1n || q % 4n === 1n);
  if (licensed) {
    const pp = p % 4n === 1n ? p : q, qq = pp === p ? q : p;
    setPairsTopology(legendre(pp, qq) === -1);
    $id("pairsSyncNote").textContent = "";
  } else if (usable) {
    // Both ≡ 3 (mod 4): the symbol is order-dependent, so it licenses no lk-parity reading —
    // the drawing is deliberately NOT synced. Say so, or a refusal looks like a stale render.
    $id("pairsSyncNote").innerHTML = "<b>The picture is not being updated for this pair, on purpose.</b> Both primes are ≡ 3 (mod 4), so (p/q) is order-dependent and licenses no linking-parity reading — there is nothing to sync it to. The drawing above still shows whatever state you last set by hand; it is a toggle, not a mirror of this computation.";
  } else {
    $id("pairsSyncNote").textContent = "";
  }
});

function setPairsTopology(linked) {
  { const n = $id("pairsSyncNote"); if (n) n.textContent = ""; } // any deliberate change of the drawing retires the not-syncing note
  pairsState.linked = linked;
  pairsState.liftOffset = 0;
  $id("pairsLiftNote").textContent = " ";
  updatePairsLabels();
  renderPairs();
  renderArcFigure();
}

$id("preset529").addEventListener("click", () => {
  $id("pInput").value = 5; $id("qInput").value = 29;
  renderLegendreTable(5n, 29n);
  setPairsTopology(false); // +1: the unlinked pair — sync the topology panel
});

$id("preset513").addEventListener("click", () => {
  $id("pInput").value = 5; $id("qInput").value = 13;
  renderLegendreTable(5n, 13n);
  setPairsTopology(true); // −1: the Hopf pair
});


const arcCanvas = $id("arcCanvas");

const actx = arcCanvas.getContext("2d");

let arcPulseT = 0;

let lastArcMode = null;


const ARC_TEXT = {
  linked: {
    label: "Two spanning disks meeting in the segment Σ1∩Σ2; argument in the caption and note beside.",
    caption: `This is a 3-D picture, not a Venn diagram: the two disks are <b>not</b> in the same plane. Σ₁ is a flat disk in a <b>horizontal</b> plane, Σ₂ a flat disk in a <b>vertical</b> plane, threaded through each other like two chain links with soap films. Two <span class="tt" data-tip="Meeting cleanly at an angle, like two pages of an open book — neither tangent nor parallel. Transversality is what makes the intersection a clean 1-dimensional object.">transverse</span> planes meet in a line; the two disks meet in the drawn <b>segment</b> — that segment is "the arc" Σ₁ ∩ Σ₂.`,
    note: `The dashed quarter of K₂ passes underneath Σ₁. A <span class="tt tt-left" data-tip="A finite union of circles and closed segments. Each segment contributes +1 at one end and −1 at the other (∂[0,1] = {1} − {0}), so the signed count of all boundary points is 0.">compact oriented 1-manifold</span> has signed boundary count 0; the segment's end on K₁ is the point where K₁ pierces Σ₂ (counted by lk(K₂,K₁)), its end on K₂ is where K₂ pierces Σ₁ (counted by lk(K₁,K₂)) — one object, two ends, so the counts agree. The pulse travels the segment. <b>What the picture assumes and the argument does not:</b> both surfaces are drawn as flat disks, which is available here only because both components are unknotted. The argument needs no disks — only transversality and the fact that a compact oriented 1-manifold has signed boundary count 0 — so it runs unchanged for Seifert surfaces of any genus, where the intersection is a union of arcs and circles rather than the single segment drawn.`
  },
  unlinked: {
    label: "Two spanning disks pulled apart, so Σ1∩Σ2 = ∅; caption and note beside.",
    caption: `Unlinked, with the same 3-D staging: Σ₁ horizontal, Σ₂ vertical — but now the disks can be pulled apart, so Σ₁ ∩ Σ₂ = ∅. Nothing to count at either end: 0 = 0, the trivial case of the same principle.`,
    note: `Here, for the split unlink, the two disks pull apart outright: Σ₁ ∩ Σ₂ = ∅ and both counts vanish, so symmetry holds for free. Be careful with the general statement — lk = 0 does <i>not</i> by itself let you choose Σ₁ and Σ₂ disjoint (that is a <b>boundary link</b>, strictly stronger). The Borromean rings have all three lk = 0 and are not a boundary link: no choice makes all three surfaces pairwise disjoint, and none makes Σ₁ and Σ₂ disjoint while both still miss K₃ — which is exactly why a curve γ survives at rung 2 of the ladder. (Taken two at a time they <i>are</i> an unlink, so Σ₁ and Σ₂ alone can be pulled apart; the surfaces then have to cross K₃.) Toggle to the Hopf link above to watch the segment appear.`
  }
};


// disks meet in (x,0,0), 0<=x<=1
function arcProj(x, y, z) {
  return { X: 130 + 110 * x + 30 * y, Y: 150 - 95 * z + 26 * y };
}


function arcPathFromParam(fn, s0, s1, steps) {
  actx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const s = s0 + (i / steps) * (s1 - s0);
    const p = fn(s);
    if (i === 0) actx.moveTo(p.X, p.Y); else actx.lineTo(p.X, p.Y);
  }
}


function renderArcFigure() {
  const mode = pairsState.linked ? "linked" : "unlinked";
  if (mode !== lastArcMode) {
    lastArcMode = mode;
    arcCanvas.setAttribute("aria-label", ARC_TEXT[mode].label);
    $id("arcCaption").innerHTML = ARC_TEXT[mode].caption;
    $id("arcNote").innerHTML = ARC_TEXT[mode].note;
    ttFocusable();
  }
  if (mode === "unlinked") { renderArcFigureUnlinked(); return; }
  actx.clearRect(0, 0, arcCanvas.width, arcCanvas.height);

  const K1of = t => arcProj(Math.cos(t), Math.sin(t), 0);
  const K2of = s => arcProj(1 + Math.cos(s), 0, Math.sin(s));

  // Sigma2 behind, Sigma1 front
  actx.save();
  actx.globalAlpha = 0.16;
  actx.fillStyle = "#2e8b57";
  arcPathFromParam(K2of, 0, 2 * Math.PI, 90);
  actx.closePath(); actx.fill();
  actx.fillStyle = "#1b6ca8";
  arcPathFromParam(K1of, 0, 2 * Math.PI, 90);
  actx.closePath(); actx.fill();
  actx.restore();

  actx.lineWidth = 3.5;
  actx.lineCap = "round";
  actx.strokeStyle = "#1b6ca8";
  arcPathFromParam(K1of, 0, 2 * Math.PI, 180);
  actx.stroke();

  actx.strokeStyle = "#2e8b57";
  arcPathFromParam(K2of, -Math.PI / 2, Math.PI, 140); // visible 3/4
  actx.stroke();
  actx.save();
  actx.globalAlpha = 0.4;
  actx.setLineDash([6, 5]);
  actx.lineWidth = 2.5;
  arcPathFromParam(K2of, Math.PI, 1.5 * Math.PI, 50); // hidden quarter
  actx.stroke();
  actx.restore();

  // Sigma1 ∩ Sigma2: (0,0,0) -> (1,0,0)
  const P2 = arcProj(0, 0, 0); // where K2 pierces Sigma1
  const P1 = arcProj(1, 0, 0); // where K1 pierces Sigma2
  actx.strokeStyle = "#333";
  actx.lineWidth = 3.5;
  actx.beginPath();
  actx.moveTo(P2.X, P2.Y);
  actx.lineTo(P1.X, P1.Y);
  actx.stroke();

  function dot(p, color) {
    actx.fillStyle = color;
    actx.beginPath();
    actx.arc(p.X, p.Y, 5.5, 0, 2 * Math.PI);
    actx.fill();
  }
  dot(P1, "#1b6ca8");
  dot(P2, "#2e8b57");

  if (!REDUCED_MOTION.matches) {
    const t = (Math.sin(arcPulseT) + 1) / 2;
    actx.fillStyle = "#f5a623";
    actx.beginPath();
    actx.arc(P2.X + t * (P1.X - P2.X), P2.Y, 6, 0, 2 * Math.PI);
    actx.fill();
  }

  actx.font = "12px 'Palatino Linotype', Palatino, Georgia, serif";
  actx.fillStyle = "#1b6ca8";
  haloText(actx, "K1 bounds Σ1 — horizontal plane", 12, 112);
  actx.fillStyle = "#2e8b57";
  haloText(actx, "K2 bounds Σ2 — vertical plane", 248, 44);
  actx.fillStyle = "#333";
  actx.textAlign = "center";
  haloText(actx, "Σ1 ∩ Σ2", (P1.X + P2.X) / 2, P2.Y - 12);
  actx.font = "11px 'Palatino Linotype', Palatino, Georgia, serif";
  actx.fillStyle = "#2e8b57";
  haloText(actx, "K2 pierces Σ1 here", P2.X - 28, P2.Y + 24, ARC_TINT.S1);
  haloText(actx, "→ lk(K1,K2)", P2.X - 28, P2.Y + 38, ARC_TINT.S1);
  actx.fillStyle = "#1b6ca8";
  haloText(actx, "K1 pierces Σ2 here", P1.X + 44, P1.Y + 24, ARC_TINT.S2);
  haloText(actx, "→ lk(K2,K1)", P1.X + 44, P1.Y + 38, ARC_TINT.S2);
  actx.textAlign = "start";
}


function renderArcFigureUnlinked() {
  actx.clearRect(0, 0, arcCanvas.width, arcCanvas.height);
  const K1 = { cx: 105, cy: 160, rx: 88, ry: 30 };
  const K2 = { cx: 330, cy: 135, rx: 48, ry: 88 };

  actx.save();
  actx.globalAlpha = 0.16;
  actx.fillStyle = "#1b6ca8";
  actx.beginPath();
  actx.ellipse(K1.cx, K1.cy, K1.rx, K1.ry, 0, 0, 2 * Math.PI);
  actx.fill();
  actx.fillStyle = "#2e8b57";
  actx.beginPath();
  actx.ellipse(K2.cx, K2.cy, K2.rx, K2.ry, 0, 0, 2 * Math.PI);
  actx.fill();
  actx.restore();

  actx.lineWidth = 3.5;
  actx.strokeStyle = "#1b6ca8";
  actx.beginPath();
  actx.ellipse(K1.cx, K1.cy, K1.rx, K1.ry, 0, 0, 2 * Math.PI);
  actx.stroke();
  actx.strokeStyle = "#2e8b57";
  actx.beginPath();
  actx.ellipse(K2.cx, K2.cy, K2.rx, K2.ry, 0, 0, 2 * Math.PI);
  actx.stroke();

  actx.font = "12px 'Palatino Linotype', Palatino, Georgia, serif";
  actx.fillStyle = "#1b6ca8";
  haloText(actx, "K1 bounds Σ1 — horizontal plane", 20, 112);
  actx.fillStyle = "#2e8b57";
  haloText(actx, "K2 bounds Σ2 — vertical plane", 240, 30);
  actx.fillStyle = "#333";
  actx.font = "15px 'Palatino Linotype', Palatino, Georgia, serif";
  actx.textAlign = "center";
  haloText(actx, "Σ1 ∩ Σ2 = ∅", 214, 140);
  haloText(actx, "0 = 0", 214, 165);
  actx.textAlign = "start";
}


function arcAnimLoop() {
  arcPulseT += 0.03;
  if (!REDUCED_MOTION.matches && $id("tab-pairs").classList.contains("active")) {
    renderArcFigure();
  }
  requestAnimationFrame(arcAnimLoop);
}
