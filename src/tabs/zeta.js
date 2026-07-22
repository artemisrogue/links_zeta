function computeMagnusL5() { // Klein F2: one commutator deeper — [[[x1,x2],x3],x4], within the existing degree-5 truncation
  const C123 = computeMagnusTripleCommutator();
  const u = { ...C123 }; delete u[""];
  const X4 = mgGen(4);
  return mgCommutator(C123, mgInvOnePlusU(u), { "": 1, ...X4 }, mgInvOnePlusU(X4));
}

function renderPresMat() { // Klein A1: one presentation matrix per side
  // Topology: fibered case — the Alexander module IS presented by tI − h₁∗ (Milnor 1968).
  // det computed by literal polynomial arithmetic: (t−2)(t−1) − (−1)(−1).
  const mul = (a, b) => { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => r[i + j] += x * y)); return r; };
  const sub = (a, b) => { const r = a.slice(); b.forEach((x, i) => r[i] = (r[i] || 0) - x); return r; };
  const det = sub(mul([-2, 1], [-1, 1]), [1]); // coefficients of det(tI − A), constant first
  const ok = det.length === 3 && det[0] === 1 && det[1] === -3 && det[2] === 1;
  $id("presMatTopo").innerHTML =
    `<b>The module itself, presented.</b> For a fibered knot the Alexander module — H₁ of the infinite cyclic cover as a Z[t, t⁻¹]-module — is <i>presented by the matrix tI − h₁∗</i> (Milnor 1968: the cover is F × ℝ). For 4₁, with h₁∗ = A = [[2,1],[1,1]]:
     <div class="eq" style="margin:6px 0;">H₁(<span class="acc">X̃</span>∞) ≅ Z[t,t⁻¹]² ⁄ (tI − A),&nbsp;&nbsp; tI − A = <table class="mat" style="display:inline-table;vertical-align:middle;"><tr><td>t−2</td><td>−1</td></tr><tr><td>−1</td><td>t−1</td></tr></table></div>
     det computed live by polynomial arithmetic: ${det[2] === 1 ? "" : det[2]}t² ${det[1] < 0 ? "−" : "+"} ${Math.abs(det[1])}t + ${det[0]} <span class="${ok ? "ok" : "fail"}">${ok ? "= Δ₄₁ ✓" : "✗"}</span> — the polynomial the Zeta tab's figure-eight card verifies as the zeta.`;
  // Arithmetic: the Λ-side at the level the literature pins — size and determinant ideal.
  $id("presMatArith").innerHTML =
    `<b>The mirror module, presented at the cited level.</b> The Iwasawa module of an irregular prime is a Λ = Z<sub>p</sub>[[T]]-module; for p = 37 — the classical gallery's first knotted prime (the knotted-prime card above) — the relevant ω-eigenspace has <span class="tt" data-tip="Iwasawa invariants of p = 37: λ = 1, μ = 0 — cited: μ = 0 by Ferrero–Washington (1979); λ-values from the standard tables (Washington, Cyclotomic Fields, §13; Ernvall–Metsänkylä computations). λ = its characteristic polynomial's degree, the same λ the knotted-prime card defines.">λ = 1, μ = 0</span>, so its characteristic polynomial is linear and the smallest faithful presentation is 1×1:
     <div class="eq" style="margin:6px 0;">X<sub>∞</sub><sup>(ω-eigenspace)</sup> ∼ Λ ⁄ ( f₃₇(T) ),&nbsp;&nbsp; ⟨ f₃₇(T) ⟩ = <table class="mat" style="display:inline-table;vertical-align:middle;"><tr><td>f₃₇(T)</td></tr></table>,&nbsp; deg f₃₇ = λ = 1</div>
     Honesty: the matrix's <i>size and determinant ideal</i> are what the cited results pin (char ideal = (L<sub>p</sub>), the Main Conjecture above); its entries need class-group tower data this app does not carry — displayed schematically, said so. The 2×2 twin at left is fully computed.`;
}

function renderFiveWorked() {
  const s5 = computeMagnusL5();
  const c = s5["1,2,3,4"] || 0;
  const low12 = s5["1,2"] || 0, low123 = s5["1,2,3"] || 0;
  const M5 = [...Array(5)].map((_, i) => [...Array(5)].map((_, j) => i === j ? 1 : (i === 0 && j === 4 ? (((c % 2) + 2) % 2) : 0)));
  const o = matOrderF2(M5);
  $id("fiveWorked").innerHTML =
    `<div class="step"><div class="head">The invariant, live.</div><div class="eq">ℓ₅ = [[[x₁,x₂],x₃],x₄] — Milnor's model, one commutator deeper than B₄ — expanded through the same Magnus machinery (truncation degree 5, already in this page): coefficient of X₁X₂X₃X₄ = <b>${c}</b>, lower coefficients ${low12}, ${low123} — so μ̄(12345) = ${c} at the model level, the app's B₄ honesty standard one rung up.</div></div>`
    + `<div class="step"><div class="head">The counting space, live.</div><div class="eq">ρ(K₅) sits at the corner of N₅(F₂) — order of the group: 2¹⁰ = ${2 ** 10}; powering the 5×5 matrix literally gives order <b>${o}</b>. In the ${2 ** 10}-sheet cover, K₅'s preimage is <b>${2 ** 10 / o} loops of ${o === 2 ? "double length" : "length ×" + o}</b> — K₅-orbit factor <b>${tFactor(o, 2 ** 10)}</b>: the twin the arithmetic column cannot yet produce.</div></div>`;
}


function renderZetaThread(qOrd) { // capstone; factors recomputed live (null: quad symbol undefined)
  $id("zetaThread").innerHTML =
    `${TB}<b>You have been computing zeta functions all along.</b> The trail: the Pairs box's split/inert local factors; the Triples box's ${localFactor(937, frobOrderTriple(937n).ord, 8)} at 937; the Ladder's order-into-orbits reading; the Quadruples box's ${qOrd ? localFactor(449, qOrd, 64) + " at 449" : "449 factor — undefined this run, not asserted"} — the Euler factors of this dictionary's fields. The left column's Fix(hⁿ) and orbit counts below are the same bookkeeping for a monodromy. Milnor–Turaev and the Main Conjecture close the loop: Δ<sub>L</sub> and f<sub>S</sub> are, up to units, these zetas. And the two contrast boxes below keep the dials apart: linking at t = 1, knotting in the spectrum. Worked examples below, each with its lesson: the gallery cards cash this capstone out — two- through five-linked plus the contrast pair, both sides at every rung except the fifth, whose arithmetic side is honestly blank.`;
}


// K1: link zeta
function polyMul1(a, b) {
  const r = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
  return r;
}

// Delta_Bor(t,…,t) in u = t-1
function borDiagCoeffs() {
  const poly = expandDeltaBor(), out = [];
  for (const k in poly) { const d = k.split(",").reduce((s, e) => s + +e, 0); out[d] = (out[d] || 0) + poly[k]; }
  for (let i = 0; i < out.length; i++) out[i] = out[i] || 0;
  return out;
}

function torresBorOneVar() { // (t-1)*Delta(t,…,t), ascending in t
  const d = borDiagCoeffs(), u = [-1, 1];
  let acc = [0], pw = [1];
  for (let k = 0; k < d.length; k++) {
    if (d[k]) { const s = pw.map(c => c * d[k]); acc = (s.length > acc.length ? s : acc).map((_, i) => (acc[i] || 0) + (s[i] || 0)); }
    pw = polyMul1(pw, u);
  }
  return polyMul1(acc, u);
}

function borUnipotentTraces(n) { // literal powers; char poly (t-1)^4
  const U = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 1]];
  const mul = (A, B) => A.map((r, i) => r.map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
  let P = U; const tr = [];
  for (let k = 1; k <= n; k++) { tr.push(P[0][0] + P[1][1] + P[2][2] + P[3][3]); P = mul(P, U); }
  return tr;
}

const fmtM = n => String(n).replace("-", "−");

function polyStr1(a) {
  let s = "";
  for (let k = a.length - 1; k >= 0; k--) if (a[k]) s += (a[k] < 0 ? " − " : " + ") + (Math.abs(a[k]) === 1 && k > 0 ? "" : Math.abs(a[k])) + (k > 0 ? "t" + (k > 1 ? supN(k) : "") : "");
  return s.replace(/^ \+ /, "");
}

function renderBorroZeta() {
  const chi = 3 - 6, b1 = 1 - chi;
  const dg = borDiagCoeffs(), one = torresBorOneVar(), hopf = polyMul1([-1, 1], [1]);
  const coefStr = one.slice().reverse().map(fmtM).join(", ");
  const topD = dg.length - 1;
  const uTr = borUnipotentTraces(4), fTr = fig8Traces(4);
  $id("borroZeta").innerHTML =
    `${TB}<b>Linking lives at t = 1.</b> The Borromean rings are a <b>fibered</b> link (Stallings 1978: <span class="tt" data-tip="Stallings (1978): the closure of a homogeneous braid is a fibered link, fiber its Bennequin surface. A braid: strands crossing as they descend; σᵢ crosses strands i, i+1 (σᵢ⁻¹ its mirror); the closure ties each bottom to its own top — these rings close (σ₁σ₂⁻¹)³. Homogeneous: each σᵢ keeps one sign — here σ₁ always +, σ₂ always −. Sketch: the Bennequin surface, pushed once around the braid axis, sweeps out the whole complement — a product region — and Stallings' fibration criterion (finitely generated commutator subgroup of π₁) certifies the bundle. Cited: Stallings, Proc. Symp. Pure Math. 32 (1978).">closures of homogeneous braids</span> are fibered; these close (σ₁σ₂⁻¹)³), fiber its <span class="tt" data-tip="Seifert's algorithm on the closed braid: one disk per strand, one twisted band per crossing; for a homogeneous braid this surface is the fiber (Stallings).">Bennequin surface</span>: χ = strands − crossings = 3 − 6 = ${fmtM(chi)} (χ = Euler characteristic here, not this tab's Dirichlet character), so <span class="tt" data-tip="b₁ = rank of H₁ (the H₁ black box above). Why 1 − χ: this surface is connected with boundary — one disk (χ = 1) plus b₁ bands, each dropping χ by 1.">b₁</span> = 1 − (${fmtM(chi)}) = ${b1}.`
    + `<div><b><span class="tt" data-tip="Torres (1953): for a link of r ≥ 2 components, the one-variable Alexander polynomial is (t−1)·Δ_L(t,…,t) up to units — collapse all variables to one and pay a factor (t−1). Proof idea, a sketch: the one-variable polynomial reads H₁ of the total-winding Z-cover; comparing its Wang sequence with the Zʳ-cover's chain complex, all deck variables identified to t, the identification frees exactly one extra copy of the coefficient ring with trivial deck action — the (t−1). Cited: Torres, Ann. of Math. 57 (1953); the collapse is computed live here.">Torres (1953)</span>, live:</b> the one-variable Alexander polynomial of a ≥ 2-component link is (t−1)·Δ<sub>L</sub>(t,…,t). On the Triples grid, tᵢ = t sends each xᵢ ↦ (t−1): summing coefficients by total degree (computed) gives ${dg[topD] === 1 ? "" : fmtM(dg[topD])}(t−1)${supN(topD)}; times (t−1), multiplied out live: (t−1)${supN(one.length - 1)} = ${polyStr1(one)} — coefficients <b>${coefStr}</b>. Hopf sanity: (t−1)·1 = ${polyStr1(hopf)}, degree ${hopf.length - 1} = b₁ of the annulus fiber.</div>`
    + `<div><b>Milnor (1968):</b> for a fibered link the infinite cyclic cover is F × ℝ, so H₁ = H₁(F) with t acting as the monodromy h₁∗ — the one-variable Δ <i>is</i> det(tI − h₁∗) up to units. Here det(tI − h₁∗) = (t−1)⁴ on the b₁ = ${b1} fiber: <b>every eigenvalue is 1</b> — unipotent, <b>homological</b> entropy 0 (defined below) — the <i>geometric</i> monodromy is pseudo-Anosov, since the complement is hyperbolic (two ideal regular octahedra, Thurston 1978), so its topological entropy is positive; what is flat here is the action on H₁, which is all any face on this card uses — Lefschetz numbers flat: tr(h₁∗ⁿ) = ${uTr.join(", ")}, … (a stand-in unipotent with this characteristic polynomial, powered live — every quantity used is forced by the eigenvalues alone), against ${fTr.join(", ")}, … below.</div>`
    + `<div><b>The punchline:</b> this link of unknots has a zeta with <b>no spectral content</b> — everything sits in the Taylor coefficients at t = 1: exactly the μ̄ hierarchy this app computes, Δ<sub>Bor</sub> = x₁x₂x₃ under t = 1 + x — <button type="button" class="jump" onclick="gotoTab('triples');var d=$id('deltaBorGrid');if(d)d.scrollIntoView({block:'center'});">the Triples grid</button>. <b>Scope:</b> exhibited, not a theorem — unknotted components alone do not force it: the (2,4) torus link (two unknots, lk = 2, fibered) has Δ ≐ (t−1)(t²+1) — eigenvalues ±i ≠ 1 (unit circle: entropy 0, spectral content nonetheless). 'Linking' here names the vanishing-μ̄ story, checked above for this link.</div>`;
}


/* fig-8 monodromy A = [[2,1],[1,1]]; all faces computed. */

const FIG8_A = [[2, 1], [1, 1]];

const FIG8_K = 8; // series truncation degree


function fig8Traces(count) {
  // literal matrix powers (the recurrence is a TEST)
  const mul = (a, b) => [
    [a[0][0]*b[0][0]+a[0][1]*b[1][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]],
    [a[1][0]*b[0][0]+a[1][1]*b[1][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]]];
  const tr = [];
  let P = [[1, 0], [0, 1]];
  for (let n = 1; n <= count; n++) { P = mul(P, FIG8_A); tr.push(P[0][0] + P[1][1]); }
  return tr;
}


function expOfPowerSum(coeffs, K) {
  // exp(Σ c_n tⁿ/n) to degree K: E_m = (1/m) Σ c_j E_{m−j}
  const E = [1];
  for (let m = 1; m <= K; m++) {
    let s = 0;
    for (let j = 1; j <= m; j++) s += coeffs[j - 1] * E[m - j];
    E.push(s / m);
  }
  return E;
}


function fig8Mobius(n) {
  let m = 1, x = n;
  for (let p = 2; p * p <= x; p++) if (x % p === 0) { x /= p; if (x % p === 0) return 0; m = -m; }
  if (x > 1) m = -m;
  return m;
}


function fig8Data() {
  const tr = fig8Traces(12);
  const fix = tr.map(t => t - 2);
  const orb = [];
  for (let n = 1; n <= 12; n++) {
    let s = 0;
    for (let d = 1; d <= n; d++) if (n % d === 0) s += fig8Mobius(n / d) * fix[d - 1];
    orb.push(s / n);
  }
  const sumFace = expOfPowerSum(tr, FIG8_K);
  const eigFace = [1, 3];
  for (let m = 2; m <= FIG8_K; m++) eigFace.push(3 * eigFace[m - 1] - eigFace[m - 2]);
  const fixFace = expOfPowerSum(fix, FIG8_K);
  let orbFace = new Array(FIG8_K + 1).fill(0); orbFace[0] = 1;
  const smul = (a, b) => {
    const r = new Array(FIG8_K + 1).fill(0);
    for (let i = 0; i <= FIG8_K; i++) for (let j = 0; i + j <= FIG8_K; j++) r[i + j] += a[i] * (b[j] || 0);
    return r;
  };
  for (let d = 1; d <= FIG8_K; d++) {
    if (orb[d - 1] <= 0) continue;
    const f = new Array(FIG8_K + 1).fill(0); f[0] = 1; // (1 − t^d)^{−o_d}
    for (let k = 1; d * k <= FIG8_K; k++) {
      let c = 1;
      for (let i = 1; i <= k; i++) c = c * (orb[d - 1] - 1 + i) / i;
      f[d * k] = c;
    }
    orbFace = smul(orbFace, f);
  }
  return { tr, fix, orb, sumFace, eigFace, fixFace, orbFace };
}


// Trefoil branched cyclic covers. Delta_3_1 = t^2 - t + 1, so the monodromy trace
// obeys s_n = s_{n-1} - s_{n-2} with s_0 = 2, s_1 = 1, and Fox's formula collapses to
// |H1(M_n)| = |det(A^n - I)| = |2 - s_n|. All integers; 0 means H1 is infinite.
const COVERS_N = 9;

function coversData() {
  const s = [2, 1];
  for (let n = 2; n <= COVERS_N; n++) s.push(s[n - 1] - s[n - 2]);
  const rows = [];
  for (let n = 2; n <= COVERS_N; n++) {
    const ord = Math.abs(2 - s[n]);
    rows.push({ n, trace: s[n], ord, infinite: ord === 0, g: gcdInt(n, 6) });
  }
  return rows;
}

function gcdInt(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }

function renderCovers() {
  const rows = coversData();
  const head = `<tr><th scope="col">n</th><th scope="col">tr(Aⁿ)</th><th scope="col">|H₁(M<sub>n</sub>)| = |2 − tr(Aⁿ)|</th><th scope="col">Σ(2, 3, n)</th><th scope="col">gcd(n, 6)</th></tr>`;
  const body = rows.map(r => {
    const ordCell = r.infinite
      ? `<b>∞</b> <span class="mln">(not a rational homology sphere)</span>`
      : `<b>${r.ord}</b>${r.ord === 1 ? ` <span class="ok">homology sphere</span>` : ""}`;
    // Name every row (the cover IS Sigma(2,3,n)); only n = 5 gets the further
    // identification, which is the one diffeomorphism type this app will assert.
    const name = `Σ(2, 3, ${r.n})` + (r.n === 5 ? ' <span class="ok">= Poincaré sphere</span>' : "");
    return `<tr><td>${r.n}</td><td>${r.trace}</td><td>${ordCell}</td><td>${name}</td><td>${r.g}</td></tr>`;
  }).join("");
  $id("coversTable").innerHTML = head + body;

  const ones = rows.filter(r => r.ord === 1).map(r => r.n);
  const coprime = rows.filter(r => r.g === 1).map(r => r.n);
  const law = ones.length === coprime.length && ones.every((v, i) => v === coprime[i]);
  $id("coversNote").innerHTML =
    `<b>Computed over n = 2…${COVERS_N}:</b> |H₁| = 1 exactly at n = ${ones.join(", ")}, and gcd(n, 6) = 1 exactly at n = ${coprime.join(", ")} `
    + `<span class="${law ? "ok" : "fail"}">${law ? "✓ the two lists agree" : "✗"}</span>. `
    + `So the homology spheres among these covers are precisely those with gcd(n, 6) = 1 — a complete answer, in one line, to "which of these have class number one".`;
  $id("coversThread").innerHTML =
    `<b>ζ ↔ Δ</b> The order in the middle column is |det(Aⁿ − I)| — the very determinant the `
    + `<button type="button" class="jump" onclick="gotoTab('zeta')">figure-eight card</button> above evaluates as its Lefschetz fixed-point count Fix(hⁿ). `
    + `One determinant, two readings: a count of fixed points there, an order of a torsion group here. That is the whole content of "the zeta function knows the homology".`;
  $id("classNoNote").innerHTML =
    `<b>Computed here:</b> nothing new — this card's arithmetic is the divisibility p | h(Q(ζ<sub>p</sub>)) ⇔ p irregular, and the Bernoulli witness for it is already computed in the card above `
    + `(101 is irregular at B₆₈). <b>Not computed:</b> h itself, for any field. The app says so wherever h appears.`;
  $id("classNoThread").innerHTML =
    `<b>ζ ↔ Δ</b> Both sides are orders of the group the zeta function's special behaviour measures — |H₁| through Fox's resultant, h through the class number formula's leading coefficient at s = 0. `
    + `Two ingredients of that formula do <i>not</i> transport: √|d<sub>K</sub>| has no analogue at all, and the regulator's role has no established name in the literature this app cites — Turaev's refined torsion touches the same territory but is not this, and dressing the gap in a borrowed name would be exactly the mistake this app exists to avoid. Naming what fails to cross is part of reading the dictionary honestly.`;
}


function renderLefschetz() {
  const { tr, fix, orb, sumFace, eigFace, fixFace, orbFace } = fig8Data();
  const table = $id("lefschetzTable");
  table.innerHTML = `<tr><th scope="col"><span class="tt tt-left" data-tip="Continues: tr(Aⁿ) = L₂ₙ, the even-indexed Lucas numbers 3, 7, 18, 47, 123, … (φ² growth); the checks below still run to degree 8.">n (1–3 of ∞)</span></th><th scope="col">tr(Aⁿ)</th><th scope="col">Fix(hⁿ) = tr − 2</th><th scope="col">primitive orbits of period n</th></tr>`
    + [0, 1, 2].map(i =>
      `<tr><td class="k">${i + 1}</td><td class="v">${tr[i]}</td><td class="v">${fix[i]}</td><td class="v">${orb[i]}</td></tr>`).join("");
  const rows = [
    ["exp( Σ tr(Aⁿ)·tⁿ/n )", sumFace],
    ["det(I − tA)⁻¹ = (1 − 3t + t²)⁻¹", eigFace],
  ];
  const rows2 = [
    ["exp( Σ Fix(hⁿ)·tⁿ/n )", fixFace],
    ["∏<sub>d</sub> (1 − t<sup>d</sup>)<sup>−o<sub>d</sub></sup>", orbFace],
  ];
  const fmt = a => a.map(x => Math.round(x)).join(", ");
  const eq1 = sumFace.every((c, i) => Math.abs(c - eigFace[i]) < 1e-6);
  const eq2 = fixFace.every((c, i) => Math.abs(c - orbFace[i]) < 1e-6);
  // Cross-check: orbit zeta === (1 − t)²·H₁-zeta.
  const cross = sumFace.map((c, i) => c - 2 * (sumFace[i - 1] || 0) + (sumFace[i - 2] || 0));
  const eq3 = cross.every((c, i) => Math.abs(c - fixFace[i]) < 1e-6);
  $id("lefschetzFaces").innerHTML =
    `<div class="head">Two zetas, three identities, coefficient by coefficient (degrees 0…${FIG8_K}):</div>
     <div class="eq">${rows[0][0]} = ${fmt(sumFace)}<br>${rows[1][0]} = ${fmt(eigFace)}
       &nbsp;<span class="${eq1 ? "ok" : "fail"}">${eq1 ? "✓ equal" : "✗"}</span>
       <span style="color:var(--muted);font-size:.8rem;"> — iterates ↔ eigenvalues: the two faces of ζ<sub>h</sub> (the coefficients are F₂, F₄, F₆, …)</span><br>
      ${rows2[0][0]} = ${fmt(fixFace)}<br>${rows2[1][0]} = ${fmt(orbFace)}
       &nbsp;<span class="${eq2 ? "ok" : "fail"}">${eq2 ? "✓ equal" : "✗"}</span>
       <span style="color:var(--muted);font-size:.8rem;"> — iterate counts ↔ periodic orbits: the two faces of the Artin–Mazur zeta (this product runs over periods d, with o<sub>d</sub> the table's primitive-orbit count; grouping the orbit-indexed face-3 product ∏<sub>γ</sub> by period |γ| = d — the letter γ indexing orbits here, not the Triples curve — gives exactly one factor (1 − t<sup>d</sup>)<sup>−o<sub>d</sub></sup> per period)</span><br>
      (1−t)²·(H₁ face) = ${fmt(cross)}
       &nbsp;<span class="${eq3 ? "ok" : "fail"}">${eq3 ? "✓ equals the orbit face" : "✗"}</span>
       <span style="color:var(--muted);font-size:.8rem;"> — the two zetas differ by exactly the H₀ and H₂ terms of the closed torus</span></div>`;
  const lam = (3 + Math.sqrt(5)) / 2;
  $id("fig8Dichotomy").innerHTML =
    `${TB}<b>The dichotomy.</b> Knotting is the <b>spectral dial</b>: the pseudo-Anosov monodromy pushes eigenvalues off 1 — φ² ≈ ${lam.toFixed(3)} and φ⁻² — <span class="tt" data-tip="Entropy: log of the spectral radius of h₁∗ — the exponential growth rate of the traces and orbit counts; unit-circle spectra give 0.">entropy</span> log φ² ≈ ${Math.log(lam).toFixed(3)} > 0, Lefschetz numbers exponential: ${tr.slice(0, 4).join(", ")}, … against the Borromean box's constant ${borUnipotentTraces(3).join(", ")}, …. Linking is the <b>coefficients-at-1 dial</b>: eigenvalues all 1, everything in the Taylor coefficients at t = 1. Independent dials — the arithmetic mirror sits opposite.`;
}


// zeta of Q(sqrt5): a(n) recipe in the ideal-sum tooltip

function chi5(n) { return n % 5 === 0 ? 0 : Number(legendre(BigInt(n), 5n)); }


function spfSieve(N) {
  const spf = new Array(N + 1).fill(0);
  for (let i = 2; i <= N; i++) if (!spf[i]) for (let j = i; j <= N; j += i) if (!spf[j]) spf[j] = i;
  return spf;
}


function dedekindValues(N) {
  const spf = spfSieve(N);
  const a = new Array(N + 1).fill(0); a[1] = 1;
  for (let n = 2; n <= N; n++) {
    const p = spf[n]; let m = n, k = 0;
    while (m % p === 0) { m /= p; k++; }
    const c = chi5(p);
    const ap = p === 5 ? 1 : (c === 1 ? k + 1 : (k % 2 === 0 ? 1 : 0));
    a[n] = ap * a[m];
  }
  let ideal = 0, z = 0, L = 0, prod = 1;
  for (let n = 1; n <= N; n++) {
    ideal += a[n] / (n * n);
    z += 1 / (n * n);
    L += chi5(n) / (n * n);
    if (n >= 2 && spf[n] === n) {
      const c = chi5(n);
      prod *= n === 5 ? 1 / (1 - 1 / (n * n))
        : c === 1 ? 1 / ((1 - 1 / (n * n)) * (1 - 1 / (n * n)))
        : 1 / (1 - 1 / (n * n * n * n));
    }
  }
  return { ideal, prod, zl: z * L };
}


function renderDedekind() {
  const N = parseInt($id("dedekindN").value, 10);
  $id("dedekindNLabel").textContent = "X = " + N;
  const { ideal, prod, zl } = dedekindValues(N);
  $id("dedekindIdeal").textContent = ideal.toFixed(8);
  $id("dedekindProd").textContent = prod.toFixed(8);
  $id("dedekindZL").textContent = zl.toFixed(8);
  // sample Euler factors, live
  const rows = [
    [5n, "ramified — the surface's own boundary", "(1 − 5⁻ˢ)⁻¹"],
    [11n, null, null],
    [13n, null, null],
    [29n, null, null],
  ];
  const table = $id("dedekindFactors");
  table.innerHTML = `<tr><th scope="col">p</th><th scope="col">χ(p) = (5/p), live</th><th scope="col">Euler factor of ζ<sub>K</sub> at p</th></tr>` + rows.map(([p, note, factor]) => {
    if (note !== null) return `<tr><td class="k">${p}</td><td class="v">0</td><td class="v">${factor} <span style="color:var(--muted);font-size:.8rem;">${note}</span></td></tr>`;
    const c = legendre(5n, p);
    const f = c === 1 ? `(1 − ${p}⁻ˢ)⁻² <span style="color:var(--muted);font-size:.8rem;">split: two primes above ${p} — unlinked</span>`
      : `(1 − ${p}⁻²ˢ)⁻¹ <span style="color:var(--muted);font-size:.8rem;">inert: one prime of norm ${p}² — ${p === 13n ? "the Hopf pair!" : "linked"}</span>`;
    return `<tr><td class="k">${p}</td><td class="v">${c > 0 ? "+1" : "−1"}</td><td class="v">${f}</td></tr>`;
  }).join("");
}

$id("dedekindN").addEventListener("input", renderDedekind);


/* K3: regular = unknotted, irregular = knotted (Mazur). Numbers safe: residues < p < 2^13. */
function bernoulliRowModP(p, inv, B, m) { // B_m = -(1/(m+1)) Σ_{j<m} C(m+1,j) B_j mod p
  if (m > 1 && m % 2 === 1) { B[m] = 0; return; } // odd Bernoullis vanish
  let s = 0, c = 1; // c walks C(m+1, j)
  for (let j = 0; j < m; j++) {
    s = (s + c * B[j]) % p;
    c = c * ((m + 1 - j) % p) % p * inv[j + 1] % p;
  }
  B[m] = ((p - s) % p) * inv[m + 1] % p;
}

function invTableModP(p) {
  const inv = new Array(p); inv[1] = 1;
  for (let i = 2; i < p; i++) inv[i] = (p - Math.floor(p / i)) * inv[p % i] % p;
  return inv;
}

function bIdx(B, p) { // even k ≤ p-3 with B_k ≡ 0; regular iff empty
  const idx = [];
  for (let k = 2; k <= p - 3; k += 2) if (B[k] === 0) idx.push(k);
  return idx;
}

function irregularIndices(p) {
  const inv = invTableModP(p), B = new Array(p - 2).fill(0); B[0] = 1;
  for (let m = 1; m <= p - 3; m++) bernoulliRowModP(p, inv, B, m);
  return bIdx(B, p);
}

function irregularIndicesAsync(p, onTick, onDone, schedule) { // chunked; scheduler injectable so tests can drive the chunk bookkeeping synchronously
  if (!schedule) schedule = f => setTimeout(f, 0);
  const inv = invTableModP(p), B = new Array(p - 2).fill(0); B[0] = 1;
  let m = 1;
  (function chunk() {
    const end = Math.min(p - 3, m + 599);
    for (; m <= end; m++) bernoulliRowModP(p, inv, B, m);
    if (m <= p - 3) { onTick(m / (p - 3)); schedule(chunk); }
    else onDone(bIdx(B, p));
  })();
}

function renderKnottedPrime() {
  const t0 = performance.now();
  const cast = [5, 13, 29, 61, 101, 449, 937].map(p => [p, irregularIndices(p)]);
  const gal = [37, 59, 67, 103, 691].map(p => [p, irregularIndices(p)]);
  const ms = (performance.now() - t0).toFixed(1);
  const row = ([p, idx]) => `<tr><td class="k">${p}</td><td class="v">${idx.length === 0
    ? `regular — <span style="color:var(--good);">unknotted</span>: ${p - 3 <= 2 ? "B₂" : `B₂, B₄, …, B<sub>${p - 3}</sub> all`} ≢ 0 (mod ${p}); trivial Iwasawa polynomial, λ = 0`
    : `<b>irregular — <span style="color:var(--arith);">knotted</span></b>: ${idx.map(k => `B<sub>${k}</sub> ≡ 0 (mod ${p})`).join(", ")}`}</td></tr>`;
  $id("knottedPrime").innerHTML =
    `${TB}<b>Knotting lives in the spectrum — arithmetically too.</b> Mazur's dictionary ("Remarks on the Alexander polynomial", unpublished, c. 1963–64; cf. Morishita ch. 12, 1st ed.): a knot's Alexander polynomial ↔ a prime's <span class="tt" data-tip="Iwasawa's own characteristic polynomial over Λ = Z_p[[T]] — the cyclotomic-tower variant the Dictionary's f_S entry flags (deck group genuinely Z_p, tower ramified at p itself), NOT f_S with its finite deck group: the definedness domain shifts — each prime here reads its own p-tower."><b>Iwasawa polynomial</b></span> for its own <span class="tt" data-tip="The cyclotomic tower of p: Q(ζ_p) ⊂ Q(ζ_{p²}) ⊂ Q(ζ_{p³}) ⊂ ⋯, adjoining p-power roots of unity layer by layer; its deck (Galois) group is Z_p — the arithmetic analogue of unrolling the infinite cyclic cover of a knot complement, layer by layer.">cyclotomic Z<sub>p</sub>-tower</span> — its own Alexander-type invariant, with <b>λ = its degree</b> (not the figure-eight card's dilatation λ opposite: same letter, different object). Regular prime: trivial polynomial, <b>unknotted</b> — <span class="tt" data-tip="Kummer's criterion (1850): p divides the class number of Q(ζ_p) — p is irregular — exactly when p divides the numerator of one of B₂, B₄, …, B_{p−3}. Proof idea, a sketch: the class number factors as h⁻·h⁺; the analytic class number formula writes h⁻ essentially as a product of the values −B_k/k, so p | h⁻ is a Bernoulli divisibility, and Kummer showed p cannot divide h⁺ without dividing h⁻. The criterion is cited (modern proof: Washington, Cyclotomic Fields, Thm 5.34); which B_k vanish mod p is what this table computes live.">Kummer's criterion</span> (regular ⟺ no B<sub>k</sub> ≡ 0 below) plus <span class="tt" data-tip="Iwasawa's theorem (1959): if p does not divide the class number of Q(ζ_p), then p divides the class number of no layer Q(ζ_{pⁿ}) of the cyclotomic tower — the Iwasawa module vanishes, the characteristic polynomial is a unit, λ = μ = 0: the unknotted case. Proof idea, a covering-space sketch: the tower is totally ramified at the unique prime above p, which forces the norm maps on p-parts of class groups to be surjective; Nakayama's lemma then generates every layer's p-part from the bottom one, which is zero. Cited: Iwasawa, On Γ-extensions of algebraic number fields, Bull. Amer. Math. Soc. 65 (1959), 183–226 (the 1956 Hamburg note under his name is a different, unrelated result); the regular verdicts in the table are computed.">Iwasawa's theorem</span> (p ∤ class number at every layer of the tower, so λ = 0). Irregular: <b>knotted</b>. The test is Bernoulli: the B<sub>k</sub> are the <b>rationals</b> seeded by B₀ = 1 and generated by B<sub>m</sub> = −(1/(m+1)) Σ<sub>j&lt;m</sub> C(m+1, j) B<sub>j</sub>; p is irregular iff p divides the numerator of some B<sub>k</sub>, k = 2, 4, …, p−3. Run mod p — legitimate: <span class="tt" data-tip="Von Staudt–Clausen (1840): for even k, B_k + Σ 1/q over primes q with (q−1) | k is an integer — the denominator of B_k is exactly the product of those q. Sketch, counting in (Z/q)ˣ: the power sum 1ᵏ + ⋯ + (q−1)ᵏ mod q is −1 when (q−1) | k (every term is 1) and 0 otherwise (a generator reshuffles the sum), and the Bernoulli numbers are the coefficients turning power sums into polynomials. Consequence used here: p divides the denominator only if (p−1) | k — impossible for even k ≤ p−3 — so those B_k are p-integral, the recurrence reduces mod p, and B_k ≡ 0 (mod p) ⟺ p divides the numerator.">von Staudt–Clausen</span> keeps those denominators prime to p, so B<sub>k</sub> mod p is defined and p | numerator ⟺ B<sub>k</sub> ≡ 0 (mod p). <span class="tt" data-tip="Herbrand–Ribet: for even k, the ω¹⁻ᵏ-eigenspace of Gal(Q(ζ_p)/Q) on the p-part of the class group is nontrivial iff p divides the numerator of B_k. One direction is Herbrand (1932): the Stickelberger element annihilates the class group, and its eigencomponents kill the eigenspace unless p | B_k. The converse is Ribet (1976), the modular-forms construction: a congruence between an Eisenstein series and a cusp form at p manufactures an unramified p-extension of Q(ζ_p) realizing exactly that eigenspace. Cited, not computed — only the Bernoulli divisibilities here are live. Ribet, Invent. Math. 34 (1976).">Herbrand–Ribet</span>: p | B<sub>k</sub> ⇔ a nontrivial ω<sup>1−k</sup>-eigenspace of Galois on the p-part of the <span class="tt" data-tip="The ideal class group of Q(ζ_p): fractional ideals modulo principal ones — a finite abelian group, the field's failure of unique factorization; its p-part under the Galois action (ω = the character on p-th roots of unity) is the arithmetic H₁ the tower's polynomial reads.">class group</span> of Q(ζ<sub>p</sub>) — λ (that is, the degree) as the spectral dial.`
    + `<div>The cast, judged at load (${ms} ms):</div>`
    + `<table class="symbolic" id="knottedTable" aria-label="The cast of primes used in this app, each judged regular or irregular by Kummer's criterion, with the Bernoulli index witnessing any irregularity.">${cast.map(row).join("")}</table>`
    + `<div><b>The jewel:</b> 101 — one of Amano's four quadruple primes — is <b>knotted</b>: the app contained a knotted prime all along, and the linking story never noticed. Independent dials: the ℓ = 2 linking tower of {5, 8081, 101, 449} and the p = 101 cyclotomic tower are different covers of different things.</div>`
    + `<div class="mln">The classical gallery, computed: ${gal.map(([p, idx]) => `${p} (${idx.map(k => `B<sub>${k}</sub>`).join(", ")})`).join(", ")}.</div>`
    + `<div class="controls"><button class="ctrl" id="check8081">check 8081</button><span class="small-note" id="verdict8081" aria-live="polite"></span></div>`;
  $id("check8081").addEventListener("click", () => {
    const btn = $id("check8081"), out = $id("verdict8081");
    btn.disabled = true;
    const note = f => `computing B₂ … B₈₀₇₈ mod 8081, chunked so the page stays live … ≈ ${Math.round(100 * f * f)}% done`;
    out.textContent = note(0);
    const s0 = performance.now();
    irregularIndicesAsync(8081,
      f => { out.textContent = note(f); },
      idx => {
        const dt = Math.round(performance.now() - s0);
        out.innerHTML = idx.length === 0
          ? `<b>8081 is regular — unknotted</b>: no B<sub>k</sub> ≡ 0 (mod 8081), k = 2, …, 8078 (${dt} ms). All four Amano primes: three unknotted, one (101) knotted.`
          : `<b>8081 is irregular — knotted</b> at ${idx.map(k => `B<sub>${k}</sub>`).join(", ")} (${dt} ms).`;
        btn.disabled = false; btn.textContent = "re-check 8081"; // recompute-on-demand, per the house rule
      });
  });
}


/* R6 G3 (session B): worked 3-linked zetas, both sides. Every number computed at runtime;
   reference values Node-verified against the orchestrator's table before pinning. */
function k1361FrobData(p) { // Frobenius data at any unramified prime, p = 2 included
  if (p === 2n) {
    // 2 is unramified in k13,61 (Rédei's normalization; cited on the card). Its Frobenius
    // restricted to Q(√d), d ≡ 1 (mod 4): split iff d ≡ 1 (mod 8) — computed from 13, 61 mod 8.
    const chi1 = 13n % 8n === 1n ? 0 : 1, chi2 = 61n % 8n === 1n ? 0 : 1;
    const oA = n3Order(chi1, chi2, 0), oB = n3Order(chi1, chi2, 1);
    return oA === oB ? { q: 2n, chi1, chi2, r: null, ord: oA } : { err: "corner-dependent order at 2?" };
  }
  return frobOrderTriple(p);
}

function k1361PartialEuler(s, X) { // ∏ over unramified p ≤ X of (1 − p^{−fs})^{−8/f}
  let prod = 1, count = 0;
  for (let n = 2n; n <= BigInt(X); n++) {
    if (!isPrimeSmall(n) || n === 13n || n === 61n) continue;
    const f = k1361FrobData(n).ord;
    prod *= Math.pow(1 - Math.pow(Number(n), -f * s), -(8 / f));
    count++;
  }
  return { prod, count };
}

function renderK1361Worked() {
  const ps = [2n, 3n, 5n, 7n, 11n, 17n, 19n, 23n, 29n, 107n, 937n];
  const pm = v => v ? "−1" : "+1";
  const rows = ps.map(p => {
    const d = k1361FrobData(p);
    const f = d.ord, g = 8 / f;
    const dag = p % 4n === 3n && d.r !== null;
    let pair, corner;
    if (p === 2n) {
      pair = `13 ≡ ${13n % 8n}, 61 ≡ ${61n % 8n} (mod 8): 2 inert in both quadratics <span class="tt" data-tip="For d ≡ 1 (mod 4), 2 splits in Q(√d) iff d ≡ 1 (mod 8) — the standard criterion, applied live to 13 and 61. That 2 is unramified in the full degree-8 field at all is Rédei's normalization (cited: Rédei 1939; Morishita chs. 4/8, 1st ed.) — the y-even, x − y ≡ 1 (mod 4) conditions the Triples tab checks.">(why?)</span>`;
      corner = "∗";
    } else {
      pair = `(13/${p}) = ${pm(d.chi1)}, (61/${p}) = ${pm(d.chi2)}`;
      corner = d.r === null ? "∗" : `α ${d.r ? "non-square" : "square"} mod ${p} → ${d.r}`;
    }
    const orb = p === 937n ? `4 orbits of size 2 — the triple symbol's −1`
      : p === 107n ? `8 orbits of size 1 — splits completely`
      : `${g} orbit${g > 1 ? "s" : ""} of size ${f}`;
    return `<tr><td class="k">${p}${dag ? " †" : ""}</td><td class="v">${pair}</td><td class="v">${corner}</td><td class="v">${f}</td><td class="v">${orb}</td><td class="v">${localFactor(p, f, 8)}</td></tr>`;
  }).join("");
  const { prod, count } = k1361PartialEuler(2, 200);
  $id("k1361Worked").innerHTML =
    `<div class="sub">The local rule at every unramified p — that is every p except 13 and 61, <b>2 and ∞ included</b> (k₁₃,₆₁/Q is unramified outside {13, 61}: at 2 by Rédei's normalization — cited, Rédei 1939; Morishita chs. 4/8, 1st ed. — and at ∞ because this pair's own α = 23 + 6√13 is totally positive, which the normalization does <i>not</i> guarantee in general): e = 1, so f·g = 8 reads as <b>the 8 embeddings falling into g = 8/f Frobenius orbits of size f = ord ρ(Frob<sub>p</sub>)</b>, local factor (1 − p<sup>−fs</sup>)<sup>−8/f</sup>. Each row below powers the Ladder tab's matrix, live.</div>`
    + `<div class="tscroll"><table class="symbolic" id="k1361Table" aria-label="Splitting data for the degree-8 Redei field k(13,61): each prime's pairwise symbols, corner Redei symbol, residue degree and orbit count."><tr><th scope="col">p</th><th scope="col">pairwise level, computed</th><th scope="col">corner r</th><th scope="col">f = ord ρ(Frob<sub>p</sub>)</th><th scope="col">orbit picture</th><th scope="col">local factor of ζ<sub>k₁₃,₆₁</sub></th></tr>${rows}</table></div>`
    + `<div class="mln">∗ = superdiagonal nonzero: the corner is basis-dependent there (Ladder tab), but the order is not — powered both ways, it agrees. † p ≡ 3 (mod 4): the corner is a <b>splitting datum</b> in the field k₁₃,₆₁ itself (fixed once and for all) — defined for any odd unramified q — not a symmetric Rédei symbol value, which asks for q ≡ 1 (mod 4) (the Ladder's domain note).</div>`
    + `<div class="step"><b>Multiplied out, live — the partial Euler product at s = 2:</b> <span class="eq">∏<sub>p ≤ 200 unramified</sub> (1 − p<sup>−2f(p)</sup>)<sup>−8/f(p)</sup> = <b>${prod.toFixed(6)}</b></span> (${count} primes, six decimals). Honesty: the two ramified factors — p = 13 and p = 61 — are omitted; their Euler-factor form is not asserted here. The 937 row is the Triples tab's ${localFactor(937, 2, 8)}: one triple symbol, felt by the whole product.</div>`
    + (() => { // Klein F1: the ideal-sum face — same unramified data, summed instead of multiplied
      const { sum, terms } = k1361IdealFace(200, 120000);
      const agree = Math.abs(sum - prod) < 1e-5;
      return `<div class="step"><b>The ideal-sum face, live:</b> the same ${count} primes, summed instead of multiplied — a(p<sup>k</sup>) = C(k/f + g − 1, g − 1) ideals of norm p<sup>k</sup> when f | k (else 0), extended multiplicatively and summed over the ${terms.toLocaleString()} unramified 200-<span class="tt" data-tip="n is P-smooth when every prime factor of n is ≤ P. Restricting the ideal sum to 200-smooth norms coprime to 13·61 makes it converge to exactly the same truncation as the product face — the two faces then must agree, and the display checks that they do.">smooth</span> norms n ≤ 120000: <span class="eq">Σ a(n)·n<sup>−2</sup> = <b>${sum.toFixed(6)}</b></span> <span class="${agree ? "ok" : "fail"}">${agree ? "— agrees with the product face ✓" : "— disagrees ✗"}</span> (|Σ − ∏| = ${Math.abs(sum - prod).toExponential(1)}). The third face, honestly: Gal(k₁₃,₆₁/Q) ≅ D₄ is <b>nonabelian</b>, so the character face upgrades from Dirichlet L-functions to Artin L-functions — stated (Artin 1923/1930), not computed; the degree-2 cards above, in the two-component row, run the abelian version.</div>`;
    })();
  ttFocusable($id("k1361Worked"));
}

function k1361IdealFace(P, N) { // Klein F1: Dirichlet face over P-smooth unramified norms ≤ N
  const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
  let vals = new Float64Array(N + 1); vals[1] = 1;
  for (let q = 2; q <= P; q++) {
    if (!isPrimeSmall(BigInt(q)) || q === 13 || q === 61) continue;
    const f = k1361FrobData(BigInt(q)).ord, g = 8 / f;
    const nv = new Float64Array(N + 1);
    for (let n = 1; n <= N; n++) {
      if (vals[n] === 0) continue;
      nv[n] += vals[n];
      let pk = 1;
      for (let k = 1; ; k++) {
        pk *= q; if (n * pk > N) break;
        if (k % f === 0) nv[n * pk] += vals[n] * binom(k / f + g - 1, g - 1);
      }
    }
    vals = nv;
  }
  let sum = 0, terms = 0;
  for (let n = 1; n <= N; n++) if (vals[n]) { sum += vals[n] / (n * n); terms++; }
  return { sum, terms };
}

function renderBorroWorked() {
  const K = 8;
  const tr = borUnipotentTraces(K);
  const lhs = expOfPowerSum(tr, K).map(Math.round);
  const rhs = [];
  for (let n = 0; n <= K; n++) rhs.push(((n + 1) * (n + 2) * (n + 3)) / 6); // C(n+3,3) by literal products
  const eq = lhs.every((c, i) => c === rhs[i]);
  const mu2 = (((computeMagnusLongitude12()["1,2"] || 0) % 2) + 2) % 2;
  const o = n3Order(0, 0, mu2);
  $id("borroWorked").innerHTML =
    `<div class="step"><div class="head">Object 1 — the monodromy zeta ζ<sub>h</sub>: lives on the fiber's homology.</div><div class="eq">tr(h₁∗ⁿ) = ${tr.slice(0, 4).join(", ")}, … (a stand-in unipotent with the same characteristic polynomial, powered live — every quantity used depends only on the eigenvalues), so both faces multiply out to degree ${K}:<br>exp( Σ 4tⁿ/n ) = ${lhs.join(", ")}<br>(1 − t)⁻⁴ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = ${rhs.join(", ")} &nbsp;<span class="${eq ? "ok" : "fail"}">${eq ? "✓ equal, coefficient by coefficient" : "✗"}</span><br><span style="color:var(--muted);font-size:.8rem;">the right side computed as C(n+3,3) = (n+1)(n+2)(n+3)/6 by literal products — polynomial growth: a unipotent zeta has Taylor content only, no spectral growth.</span></div></div>`
    + `<div class="step"><div class="head">Object 2 — the cover-orbit factor: lives in the covering space upstairs.</div><div class="eq">In the 8-sheet mod-2 Heisenberg cover of S³ ∖ (K₁ ∪ K₂), ρ(K₃) = (0, 0, μ̄ mod 2) = (0, 0, ${mu2}) has order ${o} (powered live), so K₃'s preimage is <b>${8 / o} loops, each winding ${o === 2 ? "twice" : o + "×"}</b> — K₃-orbit local factor <b>${tFactor(o, 8)}</b>: the exact topological twin of 937's ${localFactor(937, 2, 8)}.</div></div>`
    + `<div class="mln"><b>Keep them apart — different objects:</b> ζ<sub>h</sub> counts fixed points of the monodromy on H₁ of the fiber; the cover-orbit factor counts K₃'s loop-orbits among the 8 sheets. Both are Borromean bookkeeping, and both are worked above: <button type="button" class="jump" onclick="var d=$id('zxBorro');d.open=true;d.scrollIntoView();">the link-zeta card</button> · <button type="button" class="jump" onclick="gotoTab('triples');$id('tripleCoverHasse').scrollIntoView();">the tower of covers, Triples tab</button>.</div>`;
}


/* Organic pass: the two-component worked card — the Hopf link, both faces, every symbol live. */
function renderHopfWorked() {
  const c13 = Number(legendre(5n, 13n)), c29 = Number(legendre(5n, 29n));
  $id("hopfWorked").innerHTML =
    `<div class="step"><div class="head">Face 1 — the monodromy zeta: trivial, and honestly so.</div><div class="eq">The Hopf link is <span class="tt" data-tip="The complement fibers over the circle with fiber the obvious annulus between the two rings (the Hopf band). Fiberedness is a cited classical fact (Stallings 1978 covers it as the smallest homogeneous braid closure, (σ₁)²).">fibered</span>; the fiber is an annulus, H₁ = Z, and the monodromy acts on it by the identity — so det(tI − h₁∗) = t − 1. Torres agrees, computed: (t − 1) · Δ<sub>Hopf</sub>(t, t) = (t − 1) · 1 = t − 1, degree 1 = b₁(annulus). The smallest fibered link has a zeta with no room for anything but linking.</div></div>`
    + `<div class="step"><div class="head">Face 2 — the cover-orbit factor: the dial, both positions.</div><div class="eq">lk(K₁, K₂) = 1 is odd, so in the double cover of S³ ∖ K₁ the loop K₂ lifts to <b>1 loop winding twice</b> — local factor <b>(1 − t²)⁻¹</b> ↔ (5/13) = ${c13 > 0 ? "+1" : "−1"} (computed live): 13 inert in Q(√5), Euler factor (1 − 13⁻²ˢ)⁻¹. Unlink instead — lk even — and K₂ lifts to <b>2 loops</b>: (1 − t)⁻² ↔ (5/29) = ${c29 > 0 ? "+1" : "−1"} (live): 29 split, (1 − 29⁻ˢ)⁻². <button type="button" class="jump" onclick="gotoTab('pairs');var d=$id('pairsCoverMini');if(d)d.scrollIntoView({block:'center'});">the lift picture, Pairs tab</button></div></div>`
    + `<div class="mln">Everything the higher rows do is already here at n = 2: a cover, a loop upstairs, |deck| = (loop count) × (winding) — and the mirror field reading the same dial as e·f·g. The three-, four- and five-component rows below just climb to deeper covers.</div>`;
}


/* R6 G4 (session B): worked 4-linked zetas. Order rule Node-verified (64/64) before display. */
function n4Matrix(c1, c2, c3, r1, r2, qq) { // entries: superdiag chi1..3, second diag r123, r234, corner q
  return [[1, c1, r1, qq], [0, 1, c2, r2], [0, 0, 1, c3], [0, 0, 0, 1]];
}

function n4RulePredict(c1, c2, c3, r1, r2, qq) {
  // M = I + N; char 2: M^2 = I + N^2, N^4 = 0. N^2 entries: (1,3) = c1c2, (2,4) = c2c3, (1,4) = c1r2 XOR r1c3.
  const nsq = (c1 & c2) | (c2 & c3) | ((c1 & r2) ^ (r1 & c3));
  return nsq ? 4 : (c1 | c2 | c3 | r1 | r2 | qq) ? 2 : 1;
}

function n4RuleCheck() { // rule vs literal powering, all 64 elements
  let ok = 0;
  for (let b = 0; b < 64; b++) {
    const e = [b & 1, (b >> 1) & 1, (b >> 2) & 1, (b >> 3) & 1, (b >> 4) & 1, (b >> 5) & 1];
    if (matOrderF2(n4Matrix(...e)) === n4RulePredict(...e)) ok++;
  }
  return ok;
}

function n4ChiCases() { // per chi pattern: the set of orders over the 8 (r123, r234, q) fillings
  const out = [];
  for (let c = 0; c < 8; c++) {
    const c1 = c & 1, c2 = (c >> 1) & 1, c3 = (c >> 2) & 1;
    const set = new Set();
    for (let r = 0; r < 8; r++) set.add(matOrderF2(n4Matrix(c1, c2, c3, r & 1, (r >> 1) & 1, (r >> 2) & 1)));
    out.push({ c1, c2, c3, orders: [...set].sort() });
  }
  return out;
}

function renderQuad449Worked() {
  const checked = n4RuleCheck();
  const caseRows = n4ChiCases().map(({ c1, c2, c3, orders }) => {
    const key = orders.join(",");
    const verdict =
      key === "4" ? "4 — regardless of the r-entries: the χ-products already make N² ≠ 0"
      : key === "2" ? "2 — whatever the r-entries: N² = 0 identically, N ≠ 0"
      : key === "2,4" ? `<b>2 or 4 — needs the r-entries</b>: N²'s corner is ${c1 && c3 ? "r₂₃₄ ⊕ r₁₂₃" : c1 ? "r₂₃₄" : "r₁₂₃"}`
      : "<b>1 or 2 — needs the r- and corner entries</b>: 2 iff any of r₁₂₃, r₂₃₄, q is nonzero";
    return `<tr><td class="k">(${c1}, ${c2}, ${c3})</td><td class="v">${verdict}</td></tr>`;
  }).join("");
  // 449, three-branch honesty (R4-S3): everything recomputed live; assert nothing on disagreement
  const c449 = [legendre(5n, 449n), legendre(8081n, 449n), legendre(101n, 449n)];
  const r123 = redeiSymbol(5n, 8081n, 449n, 241n, 100n, 1n).value;
  const r234 = redeiSymbol(101n, 8081n, 449n, 1009n, 100n, 1n).value;
  const w = quad449Ord();
  const lower0 = c449.every(l => l === 1) && r123 === 1 && r234 === 1;
  let worked;
  if (!lower0) {
    worked = `The lower levels did not all vanish this run — the worked case's hypotheses fail; nothing asserted at 449 (the Quadruples banner rules).`;
  } else if (w === null) {
    worked = `χ and r all vanish (computed), but the conjugate check failed — at a prime modulus the four values must agree (Frobenius-stability), so this branch is an internal guard, not a contingency — the symbol is undefined: no corner, no order, no Euler factor asserted at 449 (the Quadruples banner rules).`;
  } else {
    const corner = w === 2 ? 1 : 0;
    const ord = matOrderF2(n4Matrix(0, 0, 0, 0, 0, corner));
    worked = `χ = (0, 0, 0) — (5/449), (8081/449), (101/449) all +1, computed — and r₁₂₃ = r₂₃₄ = 0 — [5, 8081, 449] = [101, 8081, 449] = +1, computed: every entry of N vanishes except possibly the corner. The quadruple symbol, recomputed from the four conjugates of θ mod 449: ${w === 2 ? "−1 → corner q = 1" : "+1 → corner q = 0"}. By the rule (N² = 0${corner ? ", N ≠ 0" : " and N = 0"}) and by powering (computed): <b>order ${ord}</b> — <b>${64 / ord} orbits of size ${ord}</b>, local factor <b>${localFactor(449, ord, 64)}</b>${ord === 2 ? " — the thread's R4 factor, now derived from the rule" : " — split bookkeeping at the top level"}.`;
  }
  $id("quad449Worked").innerHTML =
    `<div class="step"><div class="head">The order rule of N₄(F₂) — stated, then brute-forced.</div><div class="eq">Write M = I + N — this N is the strictly-upper part of the single matrix M, not the group N₄(F₂) — with N carrying χ₁, χ₂, χ₃ (superdiagonal), r₁₂₃, r₂₃₄ (second diagonal), q (corner; the matrix slot, not a prime). In characteristic 2, (I + N)² = I + N² and N⁴ = 0, and N² has exactly three entries that can survive: (1,3) = χ₁χ₂, &nbsp; (2,4) = χ₂χ₃, &nbsp; (1,4) = χ₁r₂₃₄ ⊕ r₁₂₃χ₃. <b>Order: 4 iff N² ≠ 0; else 2 iff N ≠ 0; else 1.</b> &nbsp; <span class="${checked === 64 ? "ok" : "fail"}">${checked === 64 ? "rule checked over all 64 elements: OK ✓" : `rule FAILED brute force: ${checked}/64`}</span> <span style="color:var(--muted);font-size:.8rem;">(every element literally powered, live)</span></div></div>`
    + `<div class="sub">f by χ-cases — the honest table: each row's verdict is the computed set of orders over the eight (r₁₂₃, r₂₃₄, q) fillings. Where f is not determined, the row says exactly which deeper entry it needs — definedness tracked, the Ladder's discipline.</div>`
    + `<table class="symbolic" id="n4CasesTable" aria-label="Residue degree f as a function of the character triple, brute-forced over all 64 elements of N4(F2)."><tr><th scope="col">(χ₁, χ₂, χ₃)</th><th scope="col">f = ord ρ(Frob<sub>p</sub>), by the rule</th></tr>${caseRows}</table>`
    + `<div class="step"><div class="head">The worked prime: 449.</div><div class="eq">${worked}</div></div>`
    + `<div class="mln">Why no full Euler product on this card: for a general prime p the r-entries — its splitting data in the two Rédei octics — are not computable from this app's data; only the structure (the rule, the eight χ-cases) and the worked prime are shown. Unramified local rule, for the record: (1 − p<sup>−fs</sup>)<sup>−64/f</sup> with f = ord ρ(Frob<sub>p</sub>) in N₄(F₂).</div>`;
}

function renderB4Worked() {
  const mu = computeMagnusTripleCommutator()["1,2,3"] || 0;
  const mu2 = ((mu % 2) + 2) % 2;
  const ord = matOrderF2(n4Matrix(0, 0, 0, 0, 0, mu2));
  const w = quad449Ord();
  const twin = w === 2 ? `the exact twin of the 449 card's ${localFactor(449, 2, 64)} (conjugate symbols recomputed live)`
    : w === 1 ? `449 splits completely this run — no inert twin on the arithmetic side; the model's μ̄ stands alone`
    : `449's twin not asserted this run (conjugate guard tripped — impossible at a prime modulus; the Quadruples banner rules)`;
  $id("b4Worked").innerHTML =
    `<div class="step"><div class="head">The invariant, then the count.</div><div class="eq">μ̄(1234) = ${mu} — the coefficient of X₁X₂X₃ in the Magnus expansion of ℓ₄ = [[x₁,x₂],x₃], computed live (the Quadruples tab's own machinery). It places ρ(K₄) at the corner of N₄(F₂): entries (χ, r) all 0, corner μ̄ mod 2 = ${mu2}. Powered live: <b>order ${ord}</b>. In the 64-sheet cover, K₄'s preimage is therefore <b>${64 / ord} loops of ${ord === 2 ? "double length" : "length ×" + ord}</b> — |G| = count × size — K₄-orbit local factor <b>${tFactor(ord, 64)}</b>: ${twin}.</div></div>`
    + `<div class="mln"><b>Honesty — worked at the Milnor-model level</b>, the app's B₄ standard: μ̄(1234) is computed for Milnor's model B₄ (cited: Milnor 1957; Morishita ch. 8, 1st ed.; Amano 2014), not read off the drawn diagram (the Quadruples tab's honesty note). The tower this counts in: <button type="button" class="jump" onclick="gotoTab('quads');$id('quadCoverTower').scrollIntoView();">the 64-sheet cover, Quadruples tab</button>.</div>`;
}
