/* Klein A2: one COMPUTED surface picture. Standard ellipse position (the 3D view's own
   coordinates: semi-axes 2 and 1.1, one ellipse per coordinate plane), flat spanning
   disks. Everything below is numerically computed at load: the intersection segment of
   the two disks, its endpoints, and the signed punctures of K1 through Sigma2. */
function gammaComputedData() {
  const a = 2, b = 1.1, S = 200;
  // K1 in z = 0: (a cos t, b sin t, 0); Sigma1 = flat disk. K2 in x = 0: (0, a cos t, b sin t); Sigma2 = flat disk.
  // Disk1 ∩ Disk2 lies on the line x = z = 0; sample it and keep points inside BOTH disks.
  const inside1 = (x, y) => (x * x) / (a * a) + (y * y) / (b * b) <= 1 + 1e-12;
  const inside2 = (y, z) => (y * y) / (a * a) + (z * z) / (b * b) <= 1 + 1e-12;
  const seg = [];
  for (let i = 0; i <= S; i++) {
    const y = -2.2 + 4.4 * i / S;
    if (inside1(0, y) && inside2(y, 0)) seg.push(y);
  }
  const y0 = seg[0], y1 = seg[seg.length - 1];
  // Punctures of K1 through Sigma2: K1 hits x = 0 at t = π/2, 3π/2; sign = sign of dx/dt = −a sin t.
  const punctures = [Math.PI / 2, 3 * Math.PI / 2].map(t => ({
    y: b * Math.sin(t), sign: -a * Math.sin(t) > 0 ? +1 : -1,
    inSigma2: inside2(b * Math.sin(t), 0),
  }));
  return { a, b, y0, y1, punctures, len: y1 - y0 };
}

function renderGammaComputed() {
  const { a, b, y0, y1, punctures } = gammaComputedData();
  // View direction chosen so the two perpendicular ellipses actually INTERLEAVE on screen.
  // The old oblique projection put K1 entirely inside K2 (0 apparent crossings), which read
  // as two concentric coplanar loops. Rotating x by 15 deg and y by 60 deg gives 4 apparent
  // crossings with the two curves at comparable size - verified by counting segment
  // intersections of the projected polylines over a 400-point sampling.
  const cx = 168, cy = 100, s = 38;
  const RX = 15 * Math.PI / 180, RY = 60 * Math.PI / 180;
  const P = (x, y, z) => {
    const y1r = y * Math.cos(RX) - z * Math.sin(RX);
    const z1r = y * Math.sin(RX) + z * Math.cos(RX);
    const x2r = x * Math.cos(RY) + z1r * Math.sin(RY);
    return [cx + s * x2r, cy + s * y1r];
  };
  const path = pts => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + " Z";
  const E1 = [], E2 = [];
  for (let i = 0; i < 72; i++) {
    const t = 2 * Math.PI * i / 72;
    E1.push(P(a * Math.cos(t), b * Math.sin(t), 0));
    E2.push(P(0, a * Math.cos(t), b * Math.sin(t)));
  }
  const s0 = P(0, y0, 0), s1 = P(0, y1, 0);
  const pd = punctures.map(p => ({ xy: P(0, p.y, 0), sign: p.sign }));
  $id("gammaComputed").innerHTML =
    `<svg viewBox="0 0 340 205" role="img" aria-label="Computed figure: the two standard ellipses with flat spanning disks; the numerically computed intersection segment of the disks runs between the two computed puncture points of K1 through Sigma2, whose signs are plus and minus — the raw general-position picture whose tubing produces the closed curve gamma.">
      <path d="${path(E1)}" fill="#1b6ca8" fill-opacity="0.10" stroke="#1b6ca8" stroke-width="2.5"/>
      <path d="${path(E2)}" fill="#2e8b57" fill-opacity="0.10" stroke="#2e8b57" stroke-width="2.5"/>
      <line x1="${s0[0]}" y1="${s0[1]}" x2="${s1[0]}" y2="${s1[1]}" stroke="#7d3c98" stroke-width="4"/>
      ${pd.map(p => `<circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="4.5" fill="#f5a623" stroke="#333" stroke-width="1.2"/><text x="${p.xy[0] + 7}" y="${p.xy[1] - 6}" font-size="12" font-weight="bold" fill="#333">${p.sign > 0 ? "+" : "−"}</text>`).join("")}
      <text x="30" y="26" font-size="12" fill="#1b6ca8">K₁, Σ₁ (z = 0)</text>
      <text x="236" y="26" font-size="12" fill="#1e6b41">K₂, Σ₂ (x = 0)</text>
      <text x="170" y="182" font-size="10" fill="#666" text-anchor="middle">computed: Σ₁ ∩ Σ₂ = y ∈ [${y0.toFixed(2).replace("-", "−")}, ${y1.toFixed(2)}] — ends = the ± punctures</text>
    </svg>
    <div class="figcap"><b>computed, not schematic</b> — the standard ellipse position (the 3D view's own coordinates) with flat spanning disks: the intersection segment is sampled numerically and its endpoints land exactly on K₁'s two cancelling punctures through Σ₂ (signs from dx/dt, computed). The why-box's tubing trades the punctured ends for a closed curve — this figure computes the <i>before</i>, the cartoon above draws the <i>after</i>.</div>`;
}

function runCertCockpit() { // Klein F4: the (p1,p2,q,x,y,z) door to redeiSymbol's rejection taxonomy
  const out = $id("ccOut");
  const primes = ["ccP1", "ccP2", "ccQ"].map(id => parseIntegerInput($id(id).value));
  // Certificate coordinates may be negative (some pairs have no normalized certificate with x > 0);
  // the engine accepts any sign — only the primes must be positive.
  const coords = ["ccX", "ccY", "ccZ"].map(id => {
    const raw = String($id(id).value).trim();
    return /^-?\d{1,9}$/.test(raw) ? BigInt(raw) : null;
  });
  if (primes.some(v => v === null) || coords.some(v => v === null)) { out.innerHTML = `<span style="color:var(--bad);">Primes: plain positive integers; certificate x, y, z: integers, sign allowed (at most 9 digits).</span>`; return; }
  const [p1, p2, q] = primes, [x, y, z] = coords;
  try {
    const r = redeiSymbol(p1, p2, q, x, y, z);
    out.innerHTML = `<b>[${p1}, ${p2}, ${q}] = ${r.value > 0 ? "+1" : "−1"}</b> — q ${r.value > 0 ? "splits completely" : "does not split completely"} in k<sub>${p1},${p2}</sub> (conjugates ${r.vals.join(", ")} mod ${q}, both Legendre ${r.value > 0 ? "+1" : "−1"}). Every check passed: identity, primitivity, Rédei normalization, definedness, primality.`;
  } catch (e) {
    // A domain failure cannot be fixed by editing the certificate; only a
    // certificate-shape failure can. Saying otherwise sends the reader hunting
    // for a triple that does not exist.
    const domainFail = /no certificate exists|must be distinct|not prime|≡ 1 \(mod 4\)|pairwise Legendre/.test(e.message);
    out.innerHTML = `<span style="color:var(--bad);">Rejected — ${e.message}.</span> <span style="color:var(--muted);">`
      + (domainFail
        ? `This is the <b>symbol's domain</b> talking, not your arithmetic: for these primes the symbol is undefined, so no certificate can rescue it. Change the primes.`
        : `This refusal is the engine enforcing well-definedness, not a bug: the primes are in the domain, so a valid certificate does exist — fix the certificate and the door opens.`)
      + `</span>`;
  }
}


function polyMul(A, B) {
  const R = {};
  for (const ka in A) {
    const ea = ka.split(",").map(Number);
    for (const kb in B) {
      const eb = kb.split(",").map(Number);
      const e = [ea[0] + eb[0], ea[1] + eb[1], ea[2] + eb[2]];
      const k = e.join(",");
      R[k] = (R[k] || 0) + A[ka] * B[kb];
      if (R[k] === 0) delete R[k];
    }
  }
  return R;
}

function expandDeltaBor() {
  // (t1-1)(t2-1)(t3-1), ti = 1+xi
  const f1 = { "1,0,0": 1 }; // (1+x1) - 1 = x1
  const f2 = { "0,1,0": 1 };
  const f3 = { "0,0,1": 1 };
  return polyMul(polyMul(f1, f2), f3);
}


const borroCanvas = $id("borroCanvas");

const bctx = borroCanvas.getContext("2d");

let isolateMode = "none";


function borroCircles() {
  const cx = 210, cy = 190, r = 100, R = 62; // cy raised from 175: K1's label baseline was at y=5 and clipped
  return {
    1: { cx: cx, cy: cy - R, r, color: "#1b6ca8", label: "K1" },
    2: { cx: cx - R * 0.87, cy: cy + R * 0.5, r, color: "#2e8b57", label: "K2" },
    3: { cx: cx + R * 0.87, cy: cy + R * 0.5, r, color: "#e67e22", label: "K3" },
  };
}


function dominates(i, j) {
  const cyc = { "1,2": true, "2,1": false, "2,3": true, "3,2": false, "3,1": true, "1,3": false };
  return cyc[`${i},${j}`];
}


function renderBorro() {
  const circles = borroCircles();
  bctx.clearRect(0, 0, borroCanvas.width, borroCanvas.height);
  const ids = ["1", "2", "3"];
  const visible = ids.filter(id => isolateMode === "none" || id !== isolateMode);
  const underAngles = { 1: [], 2: [], 3: [] };

  for (let a = 0; a < ids.length; a++) {
    for (let b = a + 1; b < ids.length; b++) {
      const i = ids[a], j = ids[b];
      if (!visible.includes(i) || !visible.includes(j)) continue;
      const pts = circleIntersections(circles[i], circles[j]);
      if (pts.length !== 2) continue;
      const iOver = dominates(i, j);
      const angI = pts.map(p => angleOnCircle(circles[i], p));
      const angJ = pts.map(p => angleOnCircle(circles[j], p));
      if (iOver) underAngles[j].push(...angJ);
      else underAngles[i].push(...angI);
    }
  }
  const arrowAngle = { 1: -Math.PI / 2, 2: 2.5, 3: 0.64 };
  for (const id of visible) {
    drawCircleWithGaps(bctx, circles[id], underAngles[id], { color: circles[id].color });
    bctx.fillStyle = circles[id].color;
    bctx.font = "13px 'Palatino Linotype', Palatino, Georgia, serif";
    const labelY = id === "1" ? circles[id].cy - circles[id].r - 8 : circles[id].cy + circles[id].r + 16;
    haloText(bctx, circles[id].label, circles[id].cx - 8, labelY);
    circleArrow(bctx, circles[id], arrowAngle[id], circles[id].color);
  }
  if (isolateMode !== "none") {
    bctx.fillStyle = "#666";
    bctx.font = "italic 12px 'Palatino Linotype', Palatino, Georgia, serif";
    haloText(bctx, `K${isolateMode} faded — the remaining pair is visibly unlinked (one ring entirely on top).`, 10, 364);
  }
  { // state-synced accessible name (the label was frozen at "no two linked" while a ring is faded)
    const c = $id("borroCanvas");
    c.setAttribute("aria-label", isolateMode === "none"
      ? "The Borromean rings: three circles K1 blue, K2 green, K3 orange, drawn with over and under crossings. No two are linked, yet the three cannot be pulled apart."
      : `The Borromean rings with K${isolateMode} faded out: the remaining two circles are visibly unlinked, one lying entirely on top of the other.`);
  }
}


$id("isolateSelect").addEventListener("change", (e) => {
  isolateMode = e.target.value;
  renderBorro();
});


// lk = (sum of signs)/2; y-down coords harmless — only zero totals asserted.
function borroComputeLk() {
  const circles = borroCircles();
  const ids = ["1", "2", "3"];
  const out = {};
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
    const i = ids[a], j = ids[b];
    const pts = circleIntersections(circles[i], circles[j]);
    let sum = 0;
    for (const pt of pts) {
      const ti = { x: -(pt.y - circles[i].cy), y: pt.x - circles[i].cx }; // CCW tangent
      const tj = { x: -(pt.y - circles[j].cy), y: pt.x - circles[j].cx };
      const iOver = dominates(i, j);
      const over = iOver ? ti : tj, under = iOver ? tj : ti;
      sum += Math.sign(over.x * under.y - over.y * under.x);
    }
    out[`${i}${j}`] = sum / 2;
  }
  return out; // {"12":0,"13":0,"23":0} expected
}


// Magnus expansion of [x1,x2]
function computeMagnusLongitude12() {
  const X1 = mgGen(1), X2 = mgGen(2);
  const M1 = { "": 1, ...X1 }, M2 = { "": 1, ...X2 };
  return mgCommutator(M1, mgInvOnePlusU(X1), M2, mgInvOnePlusU(X2));
}


function renderTopoTripleSteps() {
  const container = $id("topoTripleSteps");
  container.innerHTML = "";
  const steps = [];
  const mirror = txt => `<div style="color:var(--arith);font-size:.8rem;margin-top:4px;">↔ arithmetic: ${txt}</div>`;

  const lk = borroComputeLk();
  steps.push({
    head: "1. Pairwise: computed from the diagram's signed crossings",
    body: `lk(K1,K2) = ${lk["12"]} &nbsp; lk(K1,K3) = ${lk["13"]} &nbsp; lk(K2,K3) = ${lk["23"]} — at each pair's two crossings the signs cancel: the topological unlink.`
      + mirror("(13/61) = (13/937) = (61/937) = +1, computed by Euler's criterion.")
  });

  steps.push({
    head: "2. The certificate the vanishing leaves behind: the longitude",
    body: `Because every lk = 0, the word K3 traces in the complement of K1 ∪ K2 — its <span class="tt tt-left" data-tip="The longitude of a component: the path the component itself follows, read as a word in the meridians x₁, x₂ of the other components. Pairwise lk = 0 says the exponent sums vanish, i.e. the word lies in the commutator subgroup [F,F] — that and no more: zero exponent sums do not make a word a single commutator ([x₁,x₂]² has zero exponent sums and is not one, by Wicks).">longitude</span> — lies in [F,F], where F is the free group on the meridians x₁, x₂ of K1 and K2 (a meridian: a small loop encircling that component once): that is everything vanishing lk gives. That it is the specific commutator ℓ₃ = [x₁, x₂] is Milnor's Wirtinger computation for the standard Borromean diagram, taken here as the model word rather than recomputed from the drawing — the same standard the Quadruples tab's honesty note applies to B₄.`
      + mirror("the Rédei element α = 23 + 6√13 — solvable exactly because the pairwise symbol is +1. Both certificates exist only because the previous level vanished.")
  });

  const C12 = computeMagnusLongitude12();
  const c12 = C12["1,2"] || 0, c21 = C12["2,1"] || 0;
  steps.push({
    head: "3. Evaluate the certificate: Magnus expansion (computed live)",
    body: `Substitute x₁ ↦ 1 + X₁, x₂ ↦ 1 + X₂, xᵢ⁻¹ ↦ 1 − Xᵢ + Xᵢ² − ⋯ (X₁, X₂ noncommuting) and multiply out: [x₁,x₂] ↦ 1 ${c12 >= 0 ? "+" : "−"} X₁X₂ ${c21 >= 0 ? "+" : "−"} X₂X₁ + (deg ≥ 3)`
      + mirror("evaluate α at 937: Tonelli–Shanks for √13, then Legendre of both conjugates — both −1.")
  });

  steps.push({
    head: "4. Read the invariant",
    body: `μ̄(123) = coefficient of X₁X₂ = <b>${c12}</b> (<span class="tt tt-left" data-tip="Milnor (1957): expand the longitude of one component as a word in the meridians of the others through the Magnus embedding xᵢ ↦ 1 + Xᵢ (free group into noncommuting power series, faithfully); the coefficient of X₁X₂⋯ is μ̄, an isotopy invariant precisely when the lower-order invariants vanish — each level's vanishing is what makes the next coefficient independent of the presentation choices. Geometric face: the tube-and-count argument in the μ̄ why-box above — same hypothesis, same number. Cited: Milnor, Isotopy of links (1957); the coefficient here is computed live.">Milnor</span>: the coefficient of X₁X₂ in the expansion of ℓ₃).`
      + mirror("[13, 61, 937] = −1: the same level, read through Frobenius instead of Magnus.")
  });

  for (const s of steps) {
    const div = $el("div");
    div.className = "step";
    div.innerHTML = `<div class="head">${s.head}</div><div class="eq">${s.body}</div>`;
    container.appendChild(div);
  }
  $id("topoTripleBanner").innerHTML =
    `<b>μ̄(123) = ${c12}</b> — no two linked, all three linked: the Borromean rings. <span class="tt" data-tip="The sign of μ̄(123) depends on orientations and component ordering (reversing one component negates it). The +1 shown is read off the model word [x₁,x₂], not derived from the drawn diagram — that would require its Wirtinger presentation, which this app does not compute, and the mirror choice [x₂,x₁] gives −1. What is convention-free is μ̄(123) = ±1 ≠ 0, mirroring [13,61,937] = −1 ≠ +1.">(sign?)</span>`;
  ttFocusable();
}


let threeLoaded = false, threeFailed = false;

(function loadThree() {
  const s = $el("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  // onload fires for any 200 response; only the object proves three.js arrived,
  // and without this check a captive-portal or wrong-content 200 skips the fallback.
  s.onload = () => { threeLoaded = typeof THREE !== "undefined"; threeFailed = !threeLoaded; };
  s.onerror = () => { threeFailed = true; }; // Klein F5/D11: keep the button; a no-network fallback renders instead
  document.head.appendChild(s);
})();


/* Klein F5: self-contained canvas fallback — three rotating ellipses, no library.
   Same standard position as the real view (semi-axes 2 and 1.1, one per coordinate plane). */
let fallback3d = null;

function initBorro3DFallback() {
  const box = $id("borro3dContainer");
  box.innerHTML = "";
  const cv = document.createElement("canvas");
  cv.width = 420; cv.height = 340; cv.style.width = "100%";
  box.appendChild(cv);
  const ctx = cv.getContext("2d");
  const st = { rx: 0.45, ry: 0.55 };
  const colors = ["#1b6ca8", "#2e8b57", "#c0392b"];
  function draw() {
    ctx.clearRect(0, 0, 420, 340);
    const cx = 210, cy = 170, sc = 78;
    const rot = (p) => { // rotate about y by st.ry then x by st.rx
      let [x, y, z] = p;
      let x1 = x * Math.cos(st.ry) + z * Math.sin(st.ry), z1 = -x * Math.sin(st.ry) + z * Math.cos(st.ry);
      let y1 = y * Math.cos(st.rx) - z1 * Math.sin(st.rx), z2 = y * Math.sin(st.rx) + z1 * Math.cos(st.rx);
      return [x1, y1, z2];
    };
    const a = 2, b = 1.1;
    const ell = [
      t => [a * Math.cos(t), b * Math.sin(t), 0],
      t => [0, a * Math.cos(t), b * Math.sin(t)],
      t => [b * Math.sin(t), 0, a * Math.cos(t)],
    ];
    ell.forEach((f, i) => {
      ctx.beginPath();
      for (let k = 0; k <= 90; k++) {
        const p = rot(f(2 * Math.PI * k / 90));
        const X = cx + sc * p[0], Y = cy - sc * p[1];
        k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.strokeStyle = colors[i]; ctx.lineWidth = 3; ctx.stroke();
    });
    ctx.fillStyle = "#767676"; ctx.font = "11px serif";
    haloText(ctx, "offline fallback — no depth sorting; drag or arrow keys to rotate", 60, 330);
  }
  draw();
  let dragging = false, px = 0, py = 0;
  cv.addEventListener("mousedown", e => { dragging = true; px = e.clientX; py = e.clientY; });
  window.addEventListener("mousemove", e => { if (!dragging) return; st.ry += (e.clientX - px) / 120; st.rx += (e.clientY - py) / 120; px = e.clientX; py = e.clientY; draw(); });
  window.addEventListener("mouseup", () => { dragging = false; });
  cv.tabIndex = 0;
  cv.setAttribute("role", "img");
  cv.setAttribute("aria-label", "Fallback 3D view: the three standard ellipses, rotatable with arrow keys.");
  cv.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { st.ry -= 0.1; draw(); e.preventDefault(); }
    if (e.key === "ArrowRight") { st.ry += 0.1; draw(); e.preventDefault(); }
    if (e.key === "ArrowUp") { st.rx -= 0.1; draw(); e.preventDefault(); }
    if (e.key === "ArrowDown") { st.rx += 0.1; draw(); e.preventDefault(); }
  });
  return true;
}


let borro3dState = null;

$id("borro3dToggle").addEventListener("click", () => {
  const wrap = $id("borro3dWrap");
  const showing = wrap.style.display !== "none";
  $id("borro3dToggle").setAttribute("aria-expanded", String(!showing));
  if (showing) { wrap.style.display = "none"; return; }
  wrap.style.display = "block";
  if (typeof THREE !== "undefined") { // gate on the object: a 200 that is not three.js still fires onload
    if (fallback3d) { $id("borro3dContainer").innerHTML = ""; fallback3d = null; borro3dState = null; } // CDN arrived late: retire the fallback before the real view
    if (!borro3dState) initBorro3D();
  }
  else if (!fallback3d) { fallback3d = initBorro3DFallback(); } // offline or still loading: honest, self-contained
});

$id("fsTooltip").addEventListener("click", e => {
  const el = $id("fsExplain");
  const show = el.style.display === "none";
  el.style.display = show ? "block" : "none";
  e.currentTarget.setAttribute("aria-expanded", String(show));
});


function initBorro3D() {
  const container = $id("borro3dContainer");
  const w = container.clientWidth, h = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfdfdfb);
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(4, 3, 6);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "3D Borromean rings: three ellipses, one per coordinate plane.");
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const a = 2, b = 1.1, segs = 128;
  function ellipseCurve(plane) {
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2;
      const u = a * Math.cos(t), v = b * Math.sin(t);
      let x, y, z;
      if (plane === "xy") { x = u; y = v; z = 0; }
      else if (plane === "yz") { x = 0; y = u; z = v; }
      else { x = v; y = 0; z = u; }
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }
  const colors = [0x1b6ca8, 0x2e8b57, 0xe67e22]; // 2D ring colors
  ["xy", "yz", "zx"].forEach((plane, idx) => {
    const geom = new THREE.BufferGeometry().setFromPoints(ellipseCurve(plane));
    const mat = new THREE.LineBasicMaterial({ color: colors[idx], linewidth: 2 });
    group.add(new THREE.Line(geom, mat));
  });

  container.tabIndex = 0;
  container.setAttribute("aria-label", "3D Borromean rings; drag or arrow keys to rotate");
  container.addEventListener("keydown", e => {
    const d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
    if (!d) return;
    e.preventDefault();
    group.rotation.x += d[0] * 0.15;
    group.rotation.y += d[1] * 0.15;
  });
  let dragging = false, lastX = 0, lastY = 0;
  renderer.domElement.addEventListener("mousedown", e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener("mouseup", () => dragging = false);
  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    group.rotation.y += dx * 0.01;
    group.rotation.x += dy * 0.01;
    lastX = e.clientX; lastY = e.clientY;
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  borro3dState = { scene, camera, renderer, group };
}


function renderTripleSteps() {
  const p1 = 13n, p2 = 61n, q = 937n;
  const container = $id("tripleSteps");
  container.innerHTML = "";
  const steps = [];

  const mirrorT = txt => `<div style="color:var(--topo);font-size:.8rem;margin-top:4px;">↔ topology: ${txt}</div>`;
  const l1 = legendre(p1, p2), l2 = legendre(p1, q), l3 = legendre(p2, q);
  steps.push({
    head: "1. Pairwise: every pair fully split — the arithmetic unlink",
    body: `(13/61) = ${l1 > 0 ? "+1" : l1} &nbsp; (13/937) = ${l2 > 0 ? "+1" : l2} &nbsp; (61/937) = ${l3 > 0 ? "+1" : l3}`
      + mirrorT("lk(K1,K2) = lk(K1,K3) = lk(K2,K3) = 0, computed from the diagram's crossings.")
  });

  const x = 23n, y = 6n, z = 1n;
  const resid = x * x - p1 * y * y - p2 * z * z;
  steps.push({
    head: `2. <span class="tt tt-left" data-tip="The element α = x + y√p₁ whose square root generates the Rédei field. It exists because (p₁/p₂) = +1 makes the quadratic form equation solvable; among Rédei-normalized solutions — gcd(x,y,z) = 1, y even, x − y ≡ 1 (mod 4), all satisfied by (23,6,1) — the field does not depend on which one is used. Unnormalized solutions generate genuinely different fields (scaling by k twists by √k), so redeiSymbol() rejects them.">Rédei element</span>: x² − 13y² − 61z² = 0 with (x,y,z) = (23,6,1); α = 23 + 6√13`,
    body: `23² − 13·6² − 61·1² = ${(23n * 23n).toString()} − ${(13n * 36n).toString()} − 61 = <span class="${resid === 0n ? "ok" : "fail"}">${resid.toString()}</span> &nbsp; (solvable exactly because (13/61) = +1)`
      + mirrorT("the longitude ℓ₃ — in the commutator subgroup exactly because every lk = 0; equal to the model word [x₁,x₂] by Milnor's computation.")
  });

  const roots = tonelliShanks(p1, q);
  steps.push({
    head: `3. √13 mod 937 via <span class="tt tt-left" data-tip="The general algorithm for square roots modulo a prime. For p ≡ 3 (mod 4) one can just raise to the power (p+1)/4, but 937 ≡ 1 (mod 4), so the full algorithm — factoring out the 2-part of p−1 and walking a nonresidue's powers — is required. Implemented live on this page.">Tonelli–Shanks</span> (937 ≡ 1 mod 4: no shortcut available)`,
    body: `roots = {${roots.map(String).join(", ")}}`
  });

  const conjs = roots.map(r => ((x + y * r) % q + q) % q);
  const legs = conjs.map(v => legendre(v, q));
  steps.push({
    head: `4. Both <span class="tt tt-left" data-tip="The two square roots ±√13 mod 937 give the two Galois conjugates of α reduced mod 937. 'Does 937 split completely in the Rédei field?' reduces to: are these residues squares mod 937? The symbol is well defined because both conjugates give the same answer.">conjugates</span> 23 + 6·(±√13) mod 937, then Legendre mod 937`,
    body: `values = {${conjs.map(String).join(", ")}} &nbsp; symbols = {${legs.map(l => l > 0 ? "+1" : l).join(", ")}} — 937 does not split completely in k<sub>13,61</sub>`
      + mirrorT("the Magnus expansion of ℓ₃ — evaluated coefficient of X₁X₂ = μ̄(123) = 1. The same level, read through Magnus instead of Frobenius.")
  });

  for (const s of steps) {
    const div = $el("div");
    div.className = "step";
    div.innerHTML = `<div class="head">${s.head}</div><div class="eq">${s.body}</div>`;
    container.appendChild(div);
  }

  const result = redeiSymbol(p1, p2, q, x, y, z);
  const banner = $id("tripleBanner");
  banner.innerHTML = `<b>[13, 61, 937] = ${result.value > 0 ? "+1" : "−1"}</b> — no two linked, all three linked: the arithmetic Borromean rings.`;

  const f937 = frobOrderTriple(937n), f107 = frobOrderTriple(107n);
  $id("triplesThread").innerHTML =
    `${TB}<b>The thread, one level up.</b> On the 8 embeddings of k₁₃,₆₁ — this level's version of the Pairs box's two roots of x² − p — Frobenius at 937 acts with <b>order ${f937.ord}</b>: ${8 / f937.ord} orbits of period ${f937.ord}, local factor ${localFactor(937, f937.ord, 8)} of ζ<sub>k₁₃,₆₁</sub>. The matrix behind the order, ρ(Frob<sub>937</sub>) ∈ N₃(F₂), is displayed and powered live on the <button type="button" class="jump" onclick="gotoTab('ladder');$id('frobPreset937').click()">Ladder tab, preset q = 937</button>: the pairwise +1's carry it past the biquadratic level, the Rédei −1 stops it short of splitting completely.`
    + `<div class="small-note" style="text-align:left;">Contrast q = 107, which splits completely in k₁₃,₆₁: order ${f107.ord}, computed — ${8 / f107.ord} fixed points, ${localFactor(107, f107.ord, 8)}. A splitting datum, not a symbol value: 107 ≡ 3 (mod 4) sits outside the symmetric symbol's domain (the Ladder's domain note).</div>`
    + `<div class="tln">↔ topology: Δ<sub>Bor</sub> is the same story — by Milnor–Turaev it <i>is</i> the zeta-type invariant (torsion) of the abelian cover, and its surviving top coefficient μ̄(123) is the analogue of the order-2 obstruction at 937.</div>`;

  renderTripleHasse();
  ttFocusable();
}


function renderTripleHasse() {
  const svg = $id("tripleHasse");
  svg.innerHTML = `
<g font-size="12" text-anchor="middle">
<rect class="hasse-box" x="130" y="8" width="160" height="26"/>
<text class="hasse-label" x="210" y="25">k₁₃,₆₁ = Q(√13,√61,√α)</text>
<text x="296" y="20" font-style="italic" fill="#666" font-size="11" text-anchor="start">Gal = D₄, order 8</text>
<text x="296" y="36" font-style="italic" fill="#666" font-size="10" text-anchor="start">the "Σ1 ∩ Σ2" of the primes</text>
<line x1="210" y1="34" x2="210" y2="56" stroke="#333"/>
<text x="220" y="50" font-size="10" fill="#666" text-anchor="start">deg 2 (√α)</text>
<rect class="hasse-box" x="135" y="56" width="150" height="26"/>
<text class="hasse-label" x="210" y="73">Q(√13, √61)</text>
<line x1="210" y1="82" x2="115" y2="104" stroke="#333"/>
<line x1="210" y1="82" x2="305" y2="104" stroke="#333"/>
<rect class="hasse-box" x="60" y="104" width="110" height="26"/>
<text class="hasse-label" x="115" y="121">Q(√13)</text>
<rect class="hasse-box" x="250" y="104" width="110" height="26"/>
<text class="hasse-label" x="305" y="121">Q(√61)</text>
<line x1="210" y1="152" x2="115" y2="130" stroke="#333"/>
<line x1="210" y1="152" x2="305" y2="130" stroke="#333"/>
<rect class="hasse-box" x="180" y="152" width="60" height="26"/>
<text class="hasse-label" x="210" y="169">Q</text>
</g>`;
}


/* R6 G1: the surface ladder — every displayed number computed at runtime. */
function renderSurfaceLadder() {
  const lk = borroComputeLk();
  $id("rung1Lk").textContent = String(lk["12"]);
  const s61 = legendre(13n, 61n);
  const ord61 = s61 === 1 ? 1 : 2;
  const loops12 = ((lk["12"] % 2) + 2) % 2 === 0 ? 2 : 1; // topological count from lk parity, not from the symbol
  $id("rung1Arith").innerHTML =
    `(13/61) = <b>${s61 > 0 ? "+1" : "−1"}</b>, computed live by Euler's criterion — 61 ${s61 > 0 ? "splits" : "does not split"} in Q(√13): ${2 / ord61} primes upstairs, each fixed by Frobenius. The same vanishing, said arithmetically: no obstruction at the pairwise level (step 1 at left computes all three pairs of the triple).`;
  $id("rung1Count").innerHTML =
    `<b>What is being counted:</b> sheets and fixed points. Left: in the double cover of S³ ∖ K₁ — the cover (13/61) mirrors — K₂'s preimage is <b>${loops12} loops</b>, computed from the diagram's lk parity (the Pairs tab's coset argument, cited there). Right: <b>${2 / ord61} primes</b> above 61, <span class="tt" data-tip="f = residue degree of a prime above p: the size of its Frobenius orbit; the prime upstairs has norm p^f. In e·f·g = |G| (ramification × residue degree × number of primes above), unramified means e = 1, so f·g = |G|: (orbit size) × (orbit count) — the same bookkeeping the cover runs upstairs as (winding) × (loops).">residue degree</span> ${ord61} — that is ${2 / ord61} one-point Frobenius orbits — Euler factor <b>${localFactor(61, ord61, 2)}</b> of ζ<sub>Q(√13)</sub>. Split = two sheets = two fixed points: the factor (1 − p⁻ˢ)⁻².`;

  const nx = 23n * 23n, ny = 13n * 36n, nval = nx - ny;
  const nok = nval === 61n;
  $id("rung2Arith").innerHTML =
    `Rédei's certificate is the arithmetic γ: α = 23 + 6√13, with norm N(α) = 23² − 13·6² = ${nx} − ${ny} = <b>${nval}</b> <span class="${nok ? "ok" : "fail"}">${nok ? "— the second prime itself ✓" : "≠ 61 ✗"}</span> (one line, computed live). α exists exactly because rung 1 vanished: (13/61) = +1 makes x² − 13y² − 61z² = 0 solvable, step 2 at left. The Rédei field k₁₃,₆₁ = Q(√13, √61, √α) is <span class="tt" data-tip="'Unwinds' = γ's lift upstairs is no longer a closed loop of the same length: the double cover attached to √α is nontrivial across γ. The same degree-2 step on the field side is k₁₃,₆₁ over Q(√13, √61) — the √α level of both towers (γ ↔ √α; Morishita ch. 8, 1st ed. — the correspondence is cited, not computed).">the cover where γ unwinds</span>: γ ↔ √α, level for level.`;
  const twinJump = $id("tripleCoverHasse")
    ? ` — drawn box-for-box in <button type="button" class="jump" onclick="$id('tripleCoverHasse').scrollIntoView()">the cover tower above</button> —` : " —";
  $id("rung2Count").innerHTML =
    `<b>What is being counted: nothing yet.</b> This rung builds the <i>counting space</i>: the mod-2 Heisenberg cover of S³ ∖ (K₁ ∪ K₂), with 2³ = ${2 ** 3} sheets and deck group N₃(F₂) ≅ D₄, existing precisely because lk ≡ 0 (Morishita ch. 4/8, 1st ed., cited)${twinJump} opposite the degree-${2 ** 3} field k₁₃,₆₁, its arithmetic mirror. Rung 3 counts orbits in it.`;

  const c12m = computeMagnusLongitude12()["1,2"] || 0;
  $id("rung3Mu").textContent = String(c12m);
  const red = redeiSymbol(13n, 61n, 937n, 23n, 6n, 1n);
  const f = frobOrderTriple(937n);
  const mu2 = ((c12m % 2) + 2) % 2;
  const o3 = n3Order(0, 0, mu2);
  $id("rung3Arith").innerHTML =
    `[13, 61, 937] = <b>${red.value > 0 ? "+1" : "−1"}</b>, computed live (steps 3–4 at left): Frobenius at 937 moves √α — 937 refuses the top rung exactly as K₃ refuses to pull off γ. The two verdicts, side by side: μ̄(123) = ${c12m} (read through Magnus) ↔ [13, 61, 937] = ${red.value > 0 ? "+1" : "−1"} (read through Frobenius).`;
  $id("rung3Count").innerHTML =
    `<b>What is being counted:</b> orbits upstairs. Left: ρ(K₃) ∈ N₃(F₂) has entries (lk(K₃,K₁), lk(K₃,K₂), μ̄(123)) mod 2 = (${((lk["13"] % 2) + 2) % 2}, ${((lk["23"] % 2) + 2) % 2}, ${mu2}), all computed above; powering the matrix gives order ${o3} — so K₃'s preimage in the ${2 ** 3}-sheet cover is <b>${8 / o3} loops, ${o3 === 2 ? "each winding twice" : `each winding ${o3} time${o3 > 1 ? "s" : ""}`}</b> (a loop's preimage has |G|/ord(ρ) components — standard covering-space counting, cited). Right: 937's ${2 ** 3} points upstairs fall into <b>${8 / f.ord} Frobenius orbits of size ${f.ord}</b> — ${8 / f.ord} primes above 937 of residue degree ${f.ord} — Euler factor <b>${localFactor(937, f.ord, 8)}</b> of ζ<sub>k₁₃,₆₁</sub>. That factor <i>is</i> the count: the zeta is counting loops in the cover / primes above.`;
  ttFocusable($id("sladderBox"));
}


function renderDeltaBorGrid() {
  const grid = $id("deltaBorGrid");
  const poly = expandDeltaBor();
  const monomials = [
    ["0,0,0", "1"],
    ["1,0,0", "x₁"], ["0,1,0", "x₂"], ["0,0,1", "x₃"],
    ["1,1,0", "x₁x₂"], ["1,0,1", "x₁x₃"], ["0,1,1", "x₂x₃"],
    ["1,1,1", "x₁x₂x₃"],
  ];
  grid.innerHTML = "";
  for (const [key, label] of monomials) {
    const c = poly[key] || 0;
    const div = $el("div");
    const isTop = key === "1,1,1";
    div.className = "coef-cell" + (c === 0 ? " zero" : "") + (isTop && c !== 0 ? " top" : "");
    div.innerHTML = `${label}<br><b>${c}</b>${isTop && c === 1 ? " = μ̄(123)" : ""}`;
    grid.appendChild(div);
  }
}
