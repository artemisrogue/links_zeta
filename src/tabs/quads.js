
/* Brunnian-4loops.svg (AnonMoos, public domain); over/under via b4wOverOf. */

const B4W_SCALE = 420 / 588;

function b4wT(x, y) {
  return { x: (-123 + 0.139 * x) * B4W_SCALE, y: (850.44 - 0.139 * y) * B4W_SCALE };
}

const B4W_COLORS = { G: "#009900", Y: "#c9a500", R: "#cc2020", B: "#2020cc" };

const B4W_LABEL = { G: "K1", Y: "K2", R: "K3", B: "K4" };

const B4W_SELMAP = { 1: "G", 2: "Y", 3: "R", 4: "B" };

let b4wDeleted = null;

let b4wCache = null;


function b4wSampleCubic(p0, c1, c2, p1, n, out) {
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y
    });
  }
}

function b4wSampleLine(p0, p1, n, out) {
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    out.push({ x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) });
  }
}


// segs -> closed polyline, projected
function b4wPathToPoly(segs) {
  const pt = (s, i) => ({ x: s[i], y: s[i + 1] });
  const pts = [pt(segs[0], 1)];
  for (const s of segs) {
    if (s[0] === "C") b4wSampleCubic(pt(s, 1), pt(s, 3), pt(s, 5), pt(s, 7), 24, pts);
    else b4wSampleLine(pt(s, 1), pt(s, 3), 24, pts);
  }
  pts.pop(); // drop duplicated start
  return pts.map(p => b4wT(p.x, p.y));
}


function b4wCurves() {
  const G = [];
  for (let i = 0; i < 192; i++) {
    const t = (i / 192) * 2 * Math.PI;
    const q = b4wT(3000 + 1000 * Math.cos(t), 3960 + 500 * Math.sin(t));
    G.push(q);
  }
  const Y = [];
  for (let i = 0; i < 40; i++) Y.push(b4wT(3690, 5260 - (i / 40) * 2600));
  for (let i = 0; i < 48; i++) { const a = -(i / 48) * Math.PI;
    Y.push(b4wT(3000 + 690 * Math.cos(a), 2660 + 690 * Math.sin(a))); }
  for (let i = 0; i < 40; i++) Y.push(b4wT(2310, 2660 + (i / 40) * 2600));
  for (let i = 0; i < 48; i++) { const a = Math.PI - (i / 48) * Math.PI;
    Y.push(b4wT(3000 + 690 * Math.cos(a), 5260 + 690 * Math.sin(a))); }
  const R = b4wPathToPoly([
    ["C",2163.38,5338.86,2285.28,5460.76,2450.61,5529.24,2623,5529.24],
    ["L",2623,5529.24,2753,5529.24],
    ["C",2753,5529.24,2925.39,5529.24,3090.72,5460.76,3212.62,5338.86],
    ["L",3212.62,5338.86,4419.12,4132.36],
    ["C",4419.12,4132.36,4464.83,4086.65,4490.51,4024.65,4490.51,3960],
    ["C",4490.51,3960,4490.51,3895.35,4464.83,3833.35,4419.12,3787.64],
    ["L",4419.12,3787.64,3212.62,2581.14],
    ["C",3212.62,2581.14,3090.72,2459.24,2925.39,2390.76,2753,2390.76],
    ["L",2753,2390.76,2623,2390.76],
    ["C",2623,2390.76,2450.61,2390.76,2285.28,2459.24,2163.38,2581.14],
    ["L",2163.38,2581.14,1244.14,3500.38],
    ["C",1244.14,3500.38,1122.24,3622.28,1053.76,3787.61,1053.76,3960],
    ["C",1053.76,3960,1053.76,4132.39,1122.24,4297.72,1244.14,4419.62],
    ["L",1244.14,4419.62,2163.38,5338.86],
  ]);
  const B = b4wPathToPoly([
    ["C",2787.38,5338.86,2909.28,5460.76,3074.61,5529.24,3247,5529.24],
    ["L",3247,5529.24,3377,5529.24],
    ["C",3377,5529.24,3549.39,5529.24,3714.72,5460.76,3836.62,5338.86],
    ["L",3836.62,5338.86,4755.86,4419.62],
    ["C",4755.86,4419.62,4877.76,4297.72,4946.24,4132.39,4946.24,3960],
    ["C",4946.24,3960,4946.24,3787.61,4877.76,3622.28,4755.86,3500.38],
    ["L",4755.86,3500.38,3836.62,2581.14],
    ["C",3836.62,2581.14,3714.72,2459.24,3549.39,2390.76,3377,2390.76],
    ["L",3377,2390.76,3247,2390.76],
    ["C",3247,2390.76,3074.61,2390.76,2909.28,2459.24,2787.38,2581.14],
    ["L",2787.38,2581.14,1580.88,3787.64],
    ["C",1580.88,3787.64,1535.17,3833.35,1509.49,3895.35,1509.49,3960],
    ["C",1509.49,3960,1509.49,4024.65,1535.17,4086.65,1580.88,4132.36],
    ["L",1580.88,4132.36,2787.38,5338.86],
  ]);
  return { G, Y, R, B };
}


function b4wSegIntersect(a1, a2, b1, b2) {
  const d1 = { x: a2.x - a1.x, y: a2.y - a1.y };
  const d2 = { x: b2.x - b1.x, y: b2.y - b1.y };
  const den = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(den) < 1e-12) return null;
  const s = ((b1.x - a1.x) * d2.y - (b1.y - a1.y) * d2.x) / den;
  const t = ((b1.x - a1.x) * d1.y - (b1.y - a1.y) * d1.x) / den;
  if (s <= 0 || s >= 1 || t <= 0 || t >= 1) return null;
  return { pt: { x: a1.x + s * d1.x, y: a1.y + s * d1.y }, ta: d1, tb: d2 };
}


const B4W_GY_SPLIT = (850.44 - 0.139 * 3960) * B4W_SCALE; // canvas y of green's center line

function b4wOverOf(pair, pt) {
  if (pair === "GY") return pt.y > B4W_GY_SPLIT ? "G" : "Y"; // green over on its lower half
  if (pair === "BY") return "B";
  if (pair === "RY") return "Y";
  if (pair === "RB") return "R";
  return null;
}


function b4wCrossings() {
  if (b4wCache) return b4wCache;
  const curves = b4wCurves();
  const names = ["G", "Y", "R", "B"];
  const crossings = [];
  const counts = {};
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
    const i = names[a], j = names[b];
    const key = i + j; // GY, GR, GB, YR, YB, RB in loop order
    const A = curves[i], Bc = curves[j];
    let n = 0;
    for (let u = 0; u < A.length; u++) {
      const a1 = A[u], a2 = A[(u + 1) % A.length];
      for (let v = 0; v < Bc.length; v++) {
        const hit = b4wSegIntersect(a1, a2, Bc[v], Bc[(v + 1) % Bc.length]);
        if (hit) {
          n++;
          let rulekey = key;
          if (key === "YR") rulekey = "RY";
          if (key === "YB") rulekey = "BY";
          crossings.push({ i, j, key: rulekey, pt: hit.pt, ti: hit.ta, tj: hit.tb, over: b4wOverOf(rulekey, hit.pt) });
        }
      }
    }
    counts[key] = n;
  }
  b4wCache = { curves, crossings, counts };
  return b4wCache;
}


function b4wComputeLk() {
  const { crossings, counts } = b4wCrossings();
  const sums = { GY: 0, RY: 0, BY: 0, RB: 0 };
  for (const c of crossings) {
    if (!(c.key in sums)) continue;
    const over = c.over === c.i ? c.ti : c.tj;
    const under = c.over === c.i ? c.tj : c.ti;
    sums[c.key] += Math.sign(over.x * under.y - over.y * under.x);
  }
  return {
    GY: sums.GY / 2, RY: sums.RY / 2, BY: sums.BY / 2, RB: sums.RB / 2,
    GR: 0, GB: 0,
    counts
  };
}


function b4wDrawPoly(ctx, pts, color, gaps, alpha) {
  const GAP = 6;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  let drawing = false;
  for (let u = 0; u <= pts.length; u++) {
    const p = pts[u % pts.length];
    const nearGap = gaps.some(g => Math.hypot(p.x - g.x, p.y - g.y) < GAP);
    if (nearGap) { drawing = false; }
    else {
      if (!drawing) { ctx.moveTo(p.x, p.y); drawing = true; }
      else ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
  ctx.restore();
}


function renderB4() {
  const canvas = $id("b4Canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { curves, crossings } = b4wCrossings();

  const gaps = { G: [], Y: [], R: [], B: [] };
  for (const c of crossings) {
    if (b4wDeleted === c.i || b4wDeleted === c.j) continue;
    const underName = c.over === c.i ? c.j : c.i;
    gaps[underName].push(c.pt);
  }
  for (const name of ["G", "B", "R", "Y"]) {
    b4wDrawPoly(ctx, curves[name], B4W_COLORS[name], b4wDeleted === name ? [] : gaps[name],
      b4wDeleted === name ? 0.12 : 1);
  }
  ctx.font = "13px 'Palatino Linotype', Palatino, Georgia, serif";
  const lbl = (name, x, y) => {
    ctx.fillStyle = b4wDeleted === name ? "#666" : B4W_COLORS[name];
    haloText(ctx, B4W_LABEL[name] + " (" + { G: "green", Y: "yellow", R: "red", B: "blue" }[name] + ")", x, y);
  };
  lbl("Y", 160, 14);
  lbl("R", 4, 150);
  lbl("B", 330, 150);
  lbl("G", 175, 232);

  const arrowIdx = { G: 12, Y: 5, R: 30, B: 30 };
  for (const name of ["G", "Y", "R", "B"]) {
    if (b4wDeleted === name) continue;
    const pts = curves[name], i = arrowIdx[name];
    drawOrientationArrow(ctx, pts[i],
      { x: pts[i + 1].x - pts[i].x, y: pts[i + 1].y - pts[i].y }, B4W_COLORS[name]);
  }

  const lk = b4wComputeLk();
  const pairs = [["GY", "K1,K2"], ["RY", "K2,K3"], ["BY", "K2,K4"], ["RB", "K3,K4"]];
  const parts = [];
  for (const [key, label] of pairs) {
    if (b4wDeleted && key.includes(b4wDeleted)) continue;
    parts.push(`lk(${label}) = ${lk[key]}`);
  }
  const disjoint = [];
  if (!b4wDeleted || !"GR".includes(b4wDeleted)) disjoint.push("K1∩K3");
  if (!b4wDeleted || !"GB".includes(b4wDeleted)) disjoint.push("K1∩K4");
  const disjointClause = disjoint.length
    ? `; ${disjoint.join(" = ")} = ∅` : "";
  $id("b4LkNote").innerHTML =
    `computed from the diagram's signed crossings: ${parts.join(", ")}${disjointClause} — every pair unlinked.`;
  canvas.setAttribute("aria-label", `Four-component Brunnian link${b4wDeleted ? ", with " + B4W_LABEL[b4wDeleted] + " deleted (faded)" : ""}; linking data in the note below.`);
}


const B4W_DELETE_TEXT = {
  G: "Cut K1 (green): the clasp yellow closed around it now holds nothing — yellow slides free, and the rest follows.",
  Y: "Cut K2 (yellow): green, met only by yellow, floats off at once; red and blue part as well.",
  R: "Cut K3 (red): the red–blue frame is broken and the remaining three separate.",
  B: "Cut K4 (blue): the red–blue frame is broken and the remaining three separate.",
};


const B4W_HOME_TEXT = $id("b4WordNote").textContent; // pins the static note

$id("deleteBtn").addEventListener("click", () => {
  b4wDeleted = B4W_SELMAP[$id("deleteSelect").value];
  const idx = { G: 1, Y: 2, R: 3 }[b4wDeleted]; // B = K4 is the component the word belongs to, not a letter in it
  let collapse = "";
  if (idx) { // perform the collapse the note promises rather than asserting it
    const rep = magnusCollapseReport(idx);
    collapse = ` <span class="mln"><b>Computed just now:</b> set x<sub>${idx}</sub> = 1 in ℓ₄ = [[x₁,x₂],x₃] and re-expand from scratch — the X₁X₂X₃ coefficient goes <b>${rep.before} → 0</b>, and every other term vanishes with it (${rep.terms.length} non-constant terms survive), so ℓ₄ ≡ 1 <span class="${rep.trivial ? "ok" : "fail"}">${rep.trivial ? "✓" : "✗"}</span>. That is the Brunnian collapse in the algebra: K₄'s longitude stops being a commutator the moment any one of its three letters dies.</span>`;
  } else if (b4wDeleted === "B") {
    collapse = ` <span class="mln"><b>Note:</b> K₄ is the component ℓ₄ <i>is the longitude of</i>, so deleting it removes the word rather than a letter in it. What is left is the 3-component sublink, and Milnor's link is Brunnian: every proper sublink is the unlink, so there is nothing left to measure.</span>`;
  }
  $id("b4WordNote").innerHTML =
    B4W_DELETE_TEXT[b4wDeleted] + " The figure's documented property: “cutting any loop releases the other three.”" + collapse;
  renderB4();
});

$id("restoreBtn").addEventListener("click", () => {
  b4wDeleted = null;
  $id("b4WordNote").textContent = B4W_HOME_TEXT;
  renderB4();
});


function renderMagnus() {
  const series = computeMagnusTripleCommutator();
  const c123 = series["1,2,3"] || 0;
  const c213 = series["2,1,3"] || 0;
  const c312 = series["3,1,2"] || 0;
  const c321 = series["3,2,1"] || 0;
  const box = $id("magnusBox");
  box.innerHTML =
    `<span class="tt" data-tip="The Magnus expansion embeds the free group on x₁,…,x_n into power series in noncommuting variables via xᵢ ↦ 1 + Xᵢ, xᵢ⁻¹ ↦ 1 − Xᵢ + Xᵢ² − ⋯. This word is ℓ₄, K₄'s longitude in the model B₄, and μ̄(1234) is its X₁X₂X₃-coefficient — exactly as ℓ₃ = [x₁,x₂] and the X₁X₂-coefficient were Triples steps 2 and 4, one level up.">[[x₁,x₂],x₃]</span> ↦ 1 + <span class="hi">X₁X₂X₃</span> ${fmtCoef(c213)}X₂X₁X₃ ${fmtCoef(c312)}X₃X₁X₂ ${fmtCoef(c321)}X₃X₂X₁ + (deg ≥ 4)`
    + `<div style="font-size:.85rem;color:var(--muted);margin-top:8px;">computed via <span class="tt" data-tip="Words in X₁,X₂,X₃ as arrays, coefficients keyed by the word, degree > 5 discarded; (1+u)⁻¹ = 1 − u + u² − ⋯. About forty lines of code, running live.">truncated noncommutative series</span> &nbsp;·&nbsp; coefficient of X₁X₂X₃ : <b class="hi" style="background:none;">μ̄(1234) = ${c123}</b></div>`;
}

function fmtCoef(c) { return c < 0 ? `− ` : `+ `; }


// θ = (a+b√5) + (c+d√5)√101. X² − 101Z² = α does NOT determine θ.
function quadThetaEmbeddings(a, b, c, d) {
  const s5 = Math.sqrt(5), s101 = Math.sqrt(101), out = [];
  for (const e5 of [1, -1]) for (const e101 of [1, -1])
    out.push((a + b * e5 * s5) + (c + d * e5 * s5) * e101 * s101);
  return out;
}

function quadThetaTotallyPositive(a, b, c, d) { return quadThetaEmbeddings(a, b, c, d).every(v => v > 0); }

function quadThetaIdentity(a, b, c, d) { // residuals against α = 241 + 100√5, exact BigInt
  return [a * a + 5n * b * b - 101n * (c * c + 5n * d * d) - 241n, 2n * a * b - 202n * c * d - 100n];
}


function renderQuadSteps() {
  const container = $id("quadSteps");
  container.innerHTML = "";
  const steps = [];

  // Step 0: Amano's own hypotheses (3.2.1) -- the app previously stated the theorem under
  // strictly weaker conditions than the paper proves it under. p1 = 5 mod 8 is computed;
  // the class-number condition is outside this app's engine and is labelled as cited.
  const p1mod8 = 5n % 8n;
  steps.push({
    head: "0. Amano's hypotheses, checked",
    body: `p₁ ≡ 5 (mod 8): 5 mod 8 = <b>${p1mod8}</b> <span class="${p1mod8 === 5n ? "ok" : "fail"}">${p1mod8 === 5n ? "✓" : "✗"}</span> (computed — note this is stronger than ≡ 1 mod 4, which is all the other three primes need)`
      + ` &nbsp;·&nbsp; p₂, p₃, p₄ ≡ 1 (mod 4): ${[8081n, 101n, 449n].map(x => `${x} mod 4 = ${x % 4n}`).join(", ")} <span class="${[8081n, 101n, 449n].every(x => x % 4n === 1n) ? "ok" : "fail"}">✓</span> (computed)`
      + `<div class="mln"><b>h(Q(√5)) = 1</b> — Amano also assumes the class number of Q(√p₁) is one. <i>Cited, not computed:</i> class numbers are outside this app's engine, exactly like the "all other places" row of the Hilbert table. It is a standard fact that Q(√5) has class number 1. The remaining hypotheses — all six pairwise and all four triple symbols trivial — are steps 1 and 2b below, computed.</div>`
  });

  const pairs = [[5n, 8081n], [5n, 101n], [5n, 449n], [8081n, 101n], [8081n, 449n], [101n, 449n]];
  const pairSyms = pairs.map(([a, b]) => [a, b, legendre(a, b)]);
  steps.push({
    head: "1. Six pairwise Legendre symbols",
    body: pairSyms.map(([a, b, l]) => `(${a}/${b})=${l > 0 ? "+1" : l}`).join(" &nbsp; ")
  });

  const redeiDefs = [
    { p1: 5n, p2: 8081n, x: 241n, y: 100n, label: "(5, 8081): α = 241 + 100√5" },
    { p1: 5n, p2: 101n, x: 11n, y: 2n, label: "(5, 101): 11 + 2√5" },
    { p1: 101n, p2: 8081n, x: 1009n, y: 100n, label: "(101, 8081): 1009 + 100√101" },
  ];
  let identityLines = redeiDefs.map(d => {
    const resid = d.x * d.x - d.p1 * d.y * d.y - d.p2;
    const norm = bigGcd(bigGcd(d.x, d.y), 1n) === 1n && d.y % 2n === 0n && ((d.x - d.y) % 4n + 4n) % 4n === 1n; // z = 1 throughout this tab
    return `${d.label} &nbsp; — &nbsp; ${d.x}² − ${d.p1}·${d.y}² − ${d.p2} = <span class="${resid === 0n ? "ok" : "fail"}">${resid.toString()}</span>`
      + ` &nbsp; <span class="${norm ? "ok" : "fail"}">${norm ? "normalized ✓" : "NOT normalized ✗"}</span>`;
  }).join("<br>");
  identityLines += `<div class="mln">"normalized" = Rédei's three conditions on (x,y,z): gcd(x,y,z) = 1, y even, x − y ≡ 1 (mod 4) — what makes the field, hence the symbol, independent of the certificate.</div>`;
  steps.push({ head: `2. Rédei elements (identity + <span class="tt tt-left" data-tip="Rédei's normalization of the certificate (x,y,z): gcd(x,y,z) = 1, y ≡ 0 (mod 2), x − y ≡ 1 (mod 4). Only among normalized solutions is the Rédei field — hence the symbol — independent of the certificate; redeiSymbol() enforces this, and the check is displayed here, computed live.">normalization</span> checks)`, body: identityLines });

  const tripleResults = [];
  tripleResults.push({ label: "[5, 8081, 101]", ...redeiSymbol(5n, 8081n, 101n, 241n, 100n, 1n) });
  tripleResults.push({ label: "[5, 101, 8081]", ...redeiSymbol(5n, 101n, 8081n, 11n, 2n, 1n) });
  tripleResults.push({ label: "[5, 8081, 449]", ...redeiSymbol(5n, 8081n, 449n, 241n, 100n, 1n) });
  tripleResults.push({ label: "[5, 101, 449]", ...redeiSymbol(5n, 101n, 449n, 11n, 2n, 1n) });
  tripleResults.push({ label: "[101, 8081, 449]", ...redeiSymbol(101n, 8081n, 449n, 1009n, 100n, 1n) });
  steps.push({
    head: "2b. Triple Rédei symbols — all vanish (+1): the triple level is trivial",
    body: tripleResults.map(t => `${t.label} = ${t.value > 0 ? "+1" : "−1"}`).join(" &nbsp; ")
      + `<div class="mln">Note the first two entries: [5, 8081, 101] and [5, 101, 8081] are the <i>same three primes in different orders</i>, computed through two entirely different Rédei elements (α = 241+100√5 versus 11+2√5) — and they agree. That is <span class="tt" data-tip="Rédei's symbol is invariant under all permutations of its three entries — the arithmetic mirror of μ̄'s symmetry properties. Stated and proved by Rédei (1939, Satz 4) for arguments of the kind used here — three primes ≡ 1 (mod 4) with all pairwise Legendre symbols +1 — where his omission of the infinite prime costs nothing. The fully general form, aware of 2 and ∞, is modern: Stevenhagen, 'Rédei reciprocity, governing fields and negative Pell', which also corrects the earlier treatment in Corsman's 2007 thesis. Mod 2 it follows as well from Morishita's μ̄-identification (2004), the Triples tab's citation. The computation here exhibits one transposition instance live, not all of S₃.">Rédei reciprocity</span>, witnessed live.</div>`
  });

  const thetaX = 25n, c5 = 2n, c101 = 2n;
  const alphaX = 241n, alphaY = 100n;
  const ratPart = thetaX * thetaX + 5n * c5 * c5 - 101n * c101 * c101;
  const sqrt5Coef = 2n * thetaX * c5;
  const ratCheck = ratPart - alphaX;
  const sqrt5Check = sqrt5Coef - alphaY;
  const thetaEmb = quadThetaEmbeddings(25, 2, 2, 0);
  const thetaPos = thetaEmb.every(v => v > 0);
  steps.push({
    head: `3. The new level: <span class="tt tt-left" data-tip="θ is to the quadruple level what α was to the triple level: an element of Z[√5, √101], whose square root generates K over the compositum of the two Rédei fields k₅,₈₀₈₁·k₁₀₁,₈₀₈₁ — that compositum has degree 32, and adjoining √θ is the degree-2 step to K's 64 (Amano, Thm 3.1.11). Note the two fields are being distinguished: θ lives in the degree-4 field Q(√5, √101); the extension it generates sits over the degree-32 one. (The certificate (X, Y, Z) below is what lives in Z[√5], one ring up from the triple level's Z.) That θ has four real embeddings rather than two is exactly this. The identity below does NOT pin θ down (the visible note below the checks). Amano's Theorem 3.2.5, under hypotheses (3.2.1), gives [p₁,p₂,p₃,p₄] = (−1)^μ̄(1234), which is what makes the bracket a function of the four primes. His conditions on the certificate are the identity, gcd/parity, and λ² ≡ θ (mod 4) — total positivity is this app's own additional filter, not one of his, and it is what excludes the exhibited exploit here. His ramification statement (Theorem 3.1.10) is about the finite primes. K = compositum(√θ) is Galois over Q with group N₄(F₂), ramified only at 5, 8081, 101 — so unramified at ∞ (θ totally positive: checked live below) and at 2 (Amano's 2-adic normalization: cited, not computed — the Triples tab's Wirtinger standard). Mechanism: solutions differ by norm-1 factors η = ξ/ξ̄ (Hilbert 90), twisting K(√θ) to K(√(N(ξ)θ)) — redeiSymbol's certificate-scaling, one ring up; ξ = 10+√101 (norm −1) gives θ″ = −(10+√101)²·θ, totally negative — an imaginary, ∞-ramified K(√−θ) — invisible mod 449 since (−1/449) = +1. Positivity catches both exploits; self-tested.">θ</span> = 25 + 2√5 + 2√101, with (25+2√5)² − 101·2² − α = 0 in Z[√5], where α = 241 + 100√5 is the Rédei element of (5, 8081) from step 2 (identity + positivity checks)`,
    body: `rational part: ${ratPart.toString()} − ${alphaX} = <span class="${ratCheck === 0n ? "ok" : "fail"}">${ratCheck.toString()}</span>`
      + `<br>√5-coefficient: ${sqrt5Coef.toString()} − ${alphaY} = <span class="${sqrt5Check === 0n ? "ok" : "fail"}">${sqrt5Check.toString()}</span>`
      + `<br>totally positive (K unramified at ∞): embeddings ≈ {${thetaEmb.map(v => v.toFixed(2)).join(", ")}} <span class="${thetaPos ? "ok" : "fail"}">${thetaPos ? "all > 0 ✓" : "NOT totally positive ✗"}</span>`
      + `<div class="mln">Why check positivity? The identity alone does not pin θ down: other solutions of X² − 101Z² = α pass it yet certify the <i>opposite</i> verdict — exhibited and rejected in the self-tests. Total positivity excludes them. Be precise about whose condition this is: Amano's certificate conditions are the identity, gcd/parity, and λ² ≡ θ (mod 4) — <i>cited, not computed</i>; total positivity is this app's own filter, sufficient to reject the exploit above. What makes the bracket a function of the four primes alone is Amano's Theorem 3.2.5 under hypotheses (3.2.1).</div>`
  });

  const roots5 = tonelliShanks(5n, 449n);
  const roots101 = tonelliShanks(101n, 449n);
  steps.push({
    head: "4. √5 mod 449 and √101 mod 449 via Tonelli–Shanks",
    body: `√5 ≡ {${roots5.map(String).join(", ")}} &nbsp;&nbsp; √101 ≡ {${roots101.map(String).join(", ")}}`
  });

  const r5 = roots5[0], r101 = roots101[0];
  const signs = [[1n, 1n], [1n, -1n], [-1n, 1n], [-1n, -1n]];
  const conjVals = signs.map(([s1, s2]) => {
    const v = 25n + 2n * s1 * r5 + 2n * s2 * r101;
    return ((v % 449n) + 449n) % 449n;
  });
  const conjLegs = conjVals.map(v => legendre(v, 449n));
  const allNeg = conjLegs.every(l => l === -1), allPos = conjLegs.every(l => l === 1);
  steps.push({
    head: `5. Four <span class="tt tt-left" data-tip="The four residues are the Galois conjugates of θ mod 449; 'does 449 split completely in K = k₅,₈₀₈₁·k₁₀₁,₈₀₈₁(√θ)?' reduces to: are they all squares mod 449? Their common value is the symbol (+1: splits completely; −1: not), and the agreement of all four is the well-definedness check, witnessed live — Triples step 4, one level up.">conjugates</span> 25 ± 2√5 ± 2√101 mod 449, and their Legendre symbols`,
    body: `values = {${conjVals.map(String).join(", ")}} &nbsp; symbols = {${conjLegs.map(l => l > 0 ? "+1" : l).join(", ")}}`
      + (allNeg ? " — 449 does not split completely in K" : allPos ? " — 449 splits completely in K" : " — conjugate guard tripped (impossible at a prime modulus): symbol undefined")
      + ` <span style="color:var(--muted);font-size:.8rem;">(value rule, one level up from Triples: +1 = splits completely, −1 = not)</span>`
  });

  for (const st of steps) {
    const div = $el("div");
    div.className = "step";
    div.innerHTML = `<div class="head">${st.head}</div><div class="eq">${st.body}</div>`;
    container.appendChild(div);
  }

  const banner = $id("quadBanner");
  banner.innerHTML = `<b><span class="tt" data-tip="Amano's theorem, with his actual hypotheses (3.2.1): for four primes with p₁ ≡ 5 (mod 8), p₂, p₃, p₄ ≡ 1 (mod 4), all pairwise Legendre and all triple Rédei symbols trivial, AND the class number of Q(√p₁) equal to 1, there is a degree-64 field K, Galois over Q with group N₄(F₂), ramified only at p₁, p₂, p₃ (his Theorem 3.1.10, a statement about the finite primes; 2 is unramified by his 2-adic normalization) — and unramified at ∞ because this quadruple's own θ is totally positive, which the app checks and which is NOT one of Amano's conditions — and [p₁,p₂,p₃,p₄] reads whether p₄ splits completely in K. The 4-ary notation asserts the value depends on the four primes alone, not on θ: that is Amano's Theorem 3.2.5 under hypotheses (3.2.1), together with the step-3 conditions — the identity alone would not justify it (see the rejected exploits in the self-tests). It equals (−1) to the arithmetic Milnor invariant μ₂(1234), extending Legendre and Rédei one level up. Cited: Amano, Tohoku Math. J. 66 (2014), 501–522.">[5, 8081, 101, 449]</span> = ${allNeg ? "−1" : allPos ? "+1" : "?"}</b> — ${allNeg ? "no two linked, no three linked, all four linked: the arithmetic B₄." : allPos ? "449 splits completely in K: unlinked at the fourth level." : "conjugate guard tripped (impossible at a prime modulus) — the symbol is undefined."}`;

  $id("quadThread").innerHTML = quadThreadHTML(allNeg, allPos);
  renderZetaThread(allNeg ? 2 : allPos ? 1 : null);

  renderMagnus();
  renderQuadTower();
  ttFocusable();
}


// R4-S3: assert nothing definite when the symbol is undefined.
function quadThreadHTML(allNeg, allPos) {
  const pre = `${TB}<b>The thread, two levels up.</b> `;
  if (!allNeg && !allPos) return pre + `The conjugate check failed — forbidden at a prime modulus (Frobenius-stability makes agreement a theorem, so this branch is an internal guard) — the symbol is undefined (banner above): no Frobenius order, orbit count, or Euler factor is asserted at 449.`;
  const qOrd = allNeg ? 2 : 1; // N4(F2) corner: nontrivial iff all four symbols are -1
  return pre + `449 splits completely in the degree-32 compositum — its six pairwise and four triple symbols, computed above, are all +1 — but the quadruple ${allNeg ? "−1" : "+1"} puts Frob₄₄₉ at <b>order ${qOrd}</b> in Gal(K/Q) ≅ N₄(F₂): the 64 points of the cover fall into ${64 / qOrd} orbits of period ${qOrd}, local factor ${localFactor(449, qOrd, 64)}. The Pairs box's ${allNeg ? "inert" : "split"} bookkeeping, two levels up — and the polynomial recording it is the next Alexander-type invariant in the tower.`;
}


function renderQuadTower() {
  const svg = $id("quadTower");
  svg.innerHTML = `
<g font-size="10.5" text-anchor="middle">
<g><title>θ is not a square in the compositum (Amano), so adjoining √θ doubles the degree: 64 = 2⁶ = |N₄(F₂)|. It is this K — Galois over Q, real, ramified only at 5, 8081, 101 — that the quadruple symbol reads (twisted certificates generate different K's: step 3).</title>
<rect class="hasse-box" x="80" y="4" width="260" height="26"/>
<text class="hasse-label" x="210" y="21">K = k₅,₈₀₈₁·k₁₀₁,₈₀₈₁(√θ) — deg 64</text></g>
<line x1="210" y1="30" x2="210" y2="59" stroke="#333"/>
<text x="218" y="49" font-size="9" fill="#666" text-anchor="start">deg 2 (√θ)</text>
<rect class="hasse-box" x="95" y="59" width="230" height="26"/>
<text class="hasse-label" x="210" y="76">k₅,₈₀₈₁ · k₁₀₁,₈₀₈₁ — deg 32</text>
<line x1="210" y1="85" x2="125" y2="117" stroke="#333"/>
<line x1="210" y1="85" x2="295" y2="117" stroke="#333"/>
<rect class="hasse-box" x="53" y="117" width="144" height="26"/>
<text class="hasse-label" x="125" y="134">k₅,₈₀₈₁ (D₄, deg 8)</text>
<rect class="hasse-box" x="223" y="117" width="144" height="26"/>
<text class="hasse-label" x="295" y="134">k₁₀₁,₈₀₈₁ (D₄, deg 8)</text>
<line x1="125" y1="143" x2="125" y2="177" stroke="#333"/>
<text x="131" y="164" font-size="9" fill="#666" text-anchor="start">deg 2 (√α)</text>
<line x1="295" y1="143" x2="295" y2="177" stroke="#333"/>
<rect class="hasse-box" x="55" y="177" width="140" height="26"/>
<text class="hasse-label" x="125" y="194">Q(√5, √8081)</text>
<rect class="hasse-box" x="225" y="177" width="140" height="26"/>
<text class="hasse-label" x="295" y="194">Q(√101, √8081)</text>
<text x="370" y="194" font-size="9" fill="#666" text-anchor="start">deg 4</text>
<line x1="125" y1="203" x2="80" y2="237" stroke="#333"/>
<line x1="125" y1="203" x2="210" y2="237" stroke="#333"/>
<line x1="295" y1="203" x2="210" y2="237" stroke="#333"/>
<line x1="295" y1="203" x2="340" y2="237" stroke="#333"/>
<rect class="hasse-box" x="40" y="237" width="80" height="26"/>
<text class="hasse-label" x="80" y="254">Q(√5)</text>
<rect class="hasse-box" x="160" y="237" width="100" height="26"/>
<text class="hasse-label" x="210" y="254">Q(√8081)</text>
<rect class="hasse-box" x="300" y="237" width="80" height="26"/>
<text class="hasse-label" x="340" y="254">Q(√101)</text>
<text x="385" y="254" font-size="9" fill="#666" text-anchor="start">deg 2</text>
<line x1="210" y1="296" x2="80" y2="263" stroke="#333"/>
<line x1="210" y1="296" x2="210" y2="263" stroke="#333"/>
<line x1="210" y1="296" x2="340" y2="263" stroke="#333"/>
<rect class="hasse-box" x="180" y="296" width="60" height="26"/>
<text class="hasse-label" x="210" y="313">Q</text>
<text x="250" y="330" font-style="italic" fill="#666" font-size="11" text-anchor="start">Gal(K/Q) ≅ N₄(F₂)</text>
</g>`;
}
