"use strict";

const TB = '<span class="thread-badge">ζ ↔ Δ</span>';


function powmod(a, e, m) {
  a = ((a % m) + m) % m;
  let result = 1n;
  while (e > 0n) {
    if (e & 1n) result = (result * a) % m;
    a = (a * a) % m;
    e >>= 1n;
  }
  return result;
}


function legendre(a, p) {
  a = ((a % p) + p) % p;
  if (a === 0n) return 0;
  const r = powmod(a, (p - 1n) / 2n, p);
  if (r === 1n) return 1;
  if (r === p - 1n) return -1;
  throw new Error(`legendre(${a},${p}): p not an odd prime`);
}


function tonelliShanks(n, p) {
  n = ((n % p) + p) % p;
  if (n === 0n) return [0n, 0n];
  if (legendre(n, p) !== 1) throw new Error(`${n} is not a QR mod ${p}`);
  if (p % 4n === 3n) {
    const r = powmod(n, (p + 1n) / 4n, p);
    return sortRoots(r, p);
  }
  let q = p - 1n, s = 0n;
  while (q % 2n === 0n) { q /= 2n; s += 1n; }
  let z = 2n;
  while (legendre(z, p) !== -1) z += 1n;
  let m = s;
  let c = powmod(z, q, p);
  let t = powmod(n, q, p);
  let r = powmod(n, (q + 1n) / 2n, p);
  while (true) {
    if (t === 1n) return sortRoots(r, p);
    let i = 0n, temp = t;
    while (temp !== 1n) { temp = (temp * temp) % p; i += 1n; }
    let bexp = 1n;
    for (let k = 0n; k < m - i - 1n; k++) bexp *= 2n;
    const b = powmod(c, bexp, p);
    m = i;
    c = (b * b) % p;
    t = (t * b * b) % p;
    r = (r * b) % p;
  }
}

function sortRoots(r, p) {
  const other = ((p - r) % p + p) % p;
  return [r, other].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}


function bigGcd(a, b) {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b;
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}


// [p1,p2,q]; certificate must be Redei-NORMALIZED: scaling by k multiplies the value by (k/q).
// legendre() assumes an odd PRIME modulus (Euler's criterion passes Euler pseudoprimes,
// e.g. legendre(2, 341) = +1 with 341 = 11·31); redeiSymbol enforces primality below so
// the prose "redeiSymbol() rejects them" is literally true of the function, not just the UI.
function redeiSymbol(p1, p2, q, x, y, z) {
  if (z === undefined) z = 1n;
  for (const [name, v] of [["p1", p1], ["p2", p2], ["q", q]])
    if (!isPrimeSmall(v)) throw new Error(`${name} = ${v} is not prime — the symbol is only defined for primes`);
  // Definedness first (depends only on the primes) — so out-of-domain probes hear the
  // real reason before any certificate-shape complaint (Klein-review follow-up).
  if (p1 % 4n !== 1n || p2 % 4n !== 1n || q % 4n !== 1n) throw new Error(`Rédei symbol needs p1 ≡ p2 ≡ q ≡ 1 (mod 4)`);
  if (p1 === p2 || p1 === q || p2 === q) throw new Error(`the three primes must be distinct — ${p1 === p2 ? "p1 = p2" : p1 === q ? "p1 = q" : "p2 = q"}`);
  // These three depend only on the primes, so they are definedness, not certificate
  // shape. Checked here, a pair with (p1/p2) = -1 hears that no certificate exists
  // rather than being told its certificate is wrong.
  if (legendre(p1, p2) !== 1) throw new Error(`(${p1}/${p2}) = −1, so x² − ${p1}y² = ${p2}z² has no primitive solution — no certificate exists for this pair, whatever you enter`);
  if (legendre(p1, q) !== 1) throw new Error(`(${p1}/${q}) = −1 — the symbol needs every pairwise Legendre symbol to be +1 (the previous rung must vanish)`);
  if (legendre(p2, q) !== 1) throw new Error(`(${p2}/${q}) = −1 — the symbol needs every pairwise Legendre symbol to be +1 (the previous rung must vanish)`);
  const identity = x * x - p1 * y * y - p2 * z * z;
  if (identity !== 0n) throw new Error(`Rédei identity fails: residual ${identity}`);
  const g = bigGcd(bigGcd(x, y), z);
  if (g !== 1n) throw new Error(`certificate not primitive: gcd(x,y,z) = ${g}`);
  if (y % 2n !== 0n) throw new Error(`normalization fails: y = ${y} must be even`);
  if (((x - y) % 4n + 4n) % 4n !== 1n) throw new Error(`normalization fails: x − y ≡ ${((x - y) % 4n + 4n) % 4n} (mod 4), need 1`);
  const roots = tonelliShanks(p1, q);
  const vals = roots.map(r => ((x + y * r) % q + q) % q);
  if (vals.some(v => v === 0n)) // q | x ± y√p1: exactly one conjugate vanishes (both would force q | gcd)
    throw new Error(`certificate shares a factor with q (q divides a conjugate of α) — q is not unramified in Q(√α) for this certificate; choose one with q ∤ z`);
  const legs = vals.map(v => legendre(v, q));
  if (legs[0] !== legs[1]) throw new Error(`conjugates disagree: ${legs}`);
  return { roots, vals, value: legs[0], identity };
}


// (p,q)_2 for odd p, q by genuine 2-adic solvability: a primitive zero of z² = px² + qy²
// mod 8 (odd squares lift 8-adically — Hensel). Independent of reciprocity, unlike the
// closed form (−1)^{ε(p)ε(q)}, which the UI shows only as a cross-check.
function hilbert2adic(p, q) {
  const pm = Number(((p % 8n) + 8n) % 8n), qm = Number(((q % 8n) + 8n) % 8n);
  for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) for (let z = 0; z < 8; z++) {
    if (x % 2 === 0 && y % 2 === 0 && z % 2 === 0) continue;
    if (((z * z - pm * x * x - qm * y * y) % 8 + 8) % 8 === 0) return 1;
  }
  return -1;
}


function isPrimeSmall(n) { // trial division
  if (n < 2n) return false;
  if (n % 2n === 0n) return n === 2n;
  for (let d = 3n; d * d <= n; d += 2n) if (n % d === 0n) return false;
  return true;
}


function parseIntegerInput(raw) {
  raw = String(raw).trim();
  if (!/^[0-9]{1,9}$/.test(raw)) return null;
  return BigInt(raw);
}


function circleIntersections(c1, c2) {
  const dx = c2.cx - c1.cx, dy = c2.cy - c1.cy;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > c1.r + c2.r || d < Math.abs(c1.r - c2.r)) return [];
  const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
  const h2 = c1.r * c1.r - a * a;
  if (h2 < 0) return [];
  const h = Math.sqrt(Math.max(0, h2));
  const xm = c1.cx + (a * dx) / d, ym = c1.cy + (a * dy) / d;
  const rx = -dy * (h / d), ry = dx * (h / d);
  return [{ x: xm + rx, y: ym + ry }, { x: xm - rx, y: ym - ry }];
}


function angDist(a, b) {
  let d = Math.abs(a - b) % (2 * Math.PI);
  return Math.min(d, 2 * Math.PI - d);
}


function drawCircleWithGaps(ctx, circle, underAngles, opts) {
  opts = opts || {};
  const steps = 900;
  const gapW = opts.gapWidth || 0.10;
  const color = opts.color || "#1b6ca8";
  const width = opts.lineWidth || 4.5;
  const alpha = opts.alpha === undefined ? 1 : opts.alpha;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  let drawing = false;
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 2 * Math.PI + (circle.phase || 0);
    const isGap = underAngles.some(a => angDist(theta, a) < gapW);
    const x = circle.cx + circle.r * Math.cos(theta) * (circle.sx || 1);
    const y = circle.cy + circle.r * Math.sin(theta) * (circle.sy || 1);
    if (isGap) {
      drawing = false;
    } else {
      if (!drawing) { ctx.moveTo(x, y); drawing = true; }
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}


function angleOnCircle(circle, pt) {
  return Math.atan2((pt.y - circle.cy) / (circle.sy || 1), (pt.x - circle.cx) / (circle.sx || 1));
}


// arrowhead at p along dir — the SAME dir every signed count uses.
function drawOrientationArrow(ctx, p, dir, color) {
  const len = Math.hypot(dir.x, dir.y) || 1;
  const ux = dir.x / len, uy = dir.y / len;
  const nx = -uy, ny = ux;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(p.x + 7 * ux, p.y + 7 * uy);
  ctx.lineTo(p.x - 5 * ux + 4.5 * nx, p.y - 5 * uy + 4.5 * ny);
  ctx.lineTo(p.x - 5 * ux - 4.5 * nx, p.y - 5 * uy - 4.5 * ny);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}


function circleArrow(ctx, circle, theta, color) {
  const p = { x: circle.cx + circle.r * Math.cos(theta), y: circle.cy + circle.r * Math.sin(theta) };
  drawOrientationArrow(ctx, p, { x: -Math.sin(theta), y: Math.cos(theta) }, color);
}


const MAGNUS_MAXDEG = 5;

function mgAdd(series, word, coeff) {
  if (word.length > MAGNUS_MAXDEG) return;
  const k = word.join(",");
  series[k] = (series[k] || 0) + coeff;
  if (Math.abs(series[k]) < 1e-9) delete series[k];
}

function mgMul(A, B) {
  const R = {};
  for (const ka in A) {
    const wa = ka === "" ? [] : ka.split(",").map(Number);
    for (const kb in B) {
      const wb = kb === "" ? [] : kb.split(",").map(Number);
      const w = wa.concat(wb);
      if (w.length > MAGNUS_MAXDEG) continue;
      mgAdd(R, w, A[ka] * B[kb]);
    }
  }
  return R;
}

function mgOne() { return { "": 1 }; }

function mgGen(i) { const s = {}; s[String(i)] = 1; return s; }

function mgInvOnePlusU(u) {
  let result = mgOne();
  let term = mgOne();
  for (let k = 1; k <= MAGNUS_MAXDEG; k++) {
    const negU = {};
    for (const key in u) negU[key] = -u[key];
    term = mgMul(term, negU);
    for (const key in term) mgAdd(result, key === "" ? [] : key.split(",").map(Number), term[key]);
  }
  return result;
}

function mgCommutator(A, Ainv, B, Binv) { return mgMul(mgMul(A, B), mgMul(Ainv, Binv)); }


function magnusTripleWithKilled(killed) {
  // Set the deleted component's meridian to 1 (its Magnus image becomes the constant series)
  // and re-expand l4 = [[x1,x2],x3] from scratch. Every coefficient must vanish.
  const one = { "": 1 };
  const M = i => (i === killed ? { ...one } : { "": 1, ...mgGen(i) });
  const Minv = i => (i === killed ? { ...one } : mgInvOnePlusU(mgGen(i)));
  const C12 = mgCommutator(M(1), Minv(1), M(2), Minv(2));
  const u12 = { ...C12 }; delete u12[""];
  return mgCommutator(C12, mgInvOnePlusU(u12), M(3), Minv(3));
}

function magnusCollapseReport(killed) {
  const s4 = magnusTripleWithKilled(killed);
  const terms = Object.keys(s4).filter(k => k !== "");
  const full = computeMagnusTripleCommutator();
  return { trivial: terms.length === 0, terms, before: full["1,2,3"] || 0 };
}

function computeMagnusTripleCommutator() {
  const X1 = mgGen(1), X2 = mgGen(2), X3 = mgGen(3);
  const M1 = { "": 1, ...X1 }, M2 = { "": 1, ...X2 }, M3 = { "": 1, ...X3 };
  const M1inv = mgInvOnePlusU(X1), M2inv = mgInvOnePlusU(X2), M3inv = mgInvOnePlusU(X3);
  const C12 = mgCommutator(M1, M1inv, M2, M2inv);
  const u12 = { ...C12 }; delete u12[""];
  const C12inv = mgInvOnePlusU(u12);
  return mgCommutator(C12, C12inv, M3, M3inv);
}


// Canvas labels sit on top of the strokes they annotate. A halo in the canvas
// background colour keeps them legible without moving them off what they point at.
const CANVAS_BG = "#fdfdfb";

function haloText(ctx, text, x, y, bg) {
  // bg lets a caller name the colour the label actually sits on -- a label lying on
  // a tinted Seifert surface haloed in the canvas colour prints a pale smear.
  const lw = ctx.lineWidth, sj = ctx.lineJoin, ss = ctx.strokeStyle;
  ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.strokeStyle = bg || CANVAS_BG;
  ctx.strokeText(text, x, y);
  ctx.lineWidth = lw; ctx.lineJoin = sj; ctx.strokeStyle = ss;
  ctx.fillText(text, x, y);
}


function supN(n) { return String(n).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join(""); }

function localFactor(q, ord, deg) { return `(1 − ${q}⁻${ord === 1 ? "" : supN(ord)}ˢ)⁻${supN(deg / ord)}`; }


/* R6 G6: cover-lattice twins — captions computed live; the towers themselves cited (covering-space theory). */
function matOrderF2(M) { // order of a 0/1 unitriangular matrix over F2, by literal powering (reuses n3Mul)
  const idStr = M.map((r, i) => r.map((_, j) => (i === j ? 1 : 0)).join("")).join("");
  let P = M, o = 1;
  while (P.map(r => r.join("")).join("") !== idStr) { P = n3Mul(P, M); o++; if (o > 64) throw new Error("order > 64?"); }
  return o;
}

function quad449Ord() { // 449's four conjugate symbols, recomputed from scratch; null if they disagree
  const r5 = tonelliShanks(5n, 449n)[0], r101 = tonelliShanks(101n, 449n)[0];
  const legs = [[1n, 1n], [1n, -1n], [-1n, 1n], [-1n, -1n]]
    .map(([a, b]) => legendre(((25n + 2n * a * r5 + 2n * b * r101) % 449n + 449n) % 449n, 449n));
  return legs.every(l => l === -1) ? 2 : legs.every(l => l === 1) ? 1 : null;
}

function tFactor(o, deg) { return `(1 − t${o === 1 ? "" : supN(o)})⁻${supN(deg / o)}`; }


/* rho(Frob_q) in N3(F2) for (13,61): chi_i from (13/q), (61/q); corner via alpha = 23+6√13 mod q. */

function frobeniusMatrix1361(q) {
  if (q === 2n) return { err: `q = 2 needs the mod-8 splitting criterion, not Euler's — computed on demand here: 13 ≡ ${13n % 8n}, 61 ≡ ${61n % 8n} (mod 8), both ≢ 1, so 2 is inert in each quadratic and f(2) = ${frobeniusAt2_1361().ord}. The ζ of k₁₃,₆₁ card (Zeta tab) shows the same row.` };
  if (q < 3n || q % 2n === 0n || !isPrimeSmall(q)) return { err: "q must be an odd prime (composite input has no single Frobenius)." };
  if (q === 13n || q === 61n) return { err: "q must avoid the ramified primes 13 and 61 — Frobenius is not defined at a branch point (the knot cannot loop around itself)." };
  const a = legendre(13n, q), b = legendre(61n, q);
  const chi1 = a === 1 ? 0 : 1, chi2 = b === 1 ? 0 : 1;
  if (chi1 || chi2) return { q, chi1, chi2, r: null };
  const rt = tonelliShanks(13n, q)[0];
  const v1 = ((23n + 6n * rt) % q + q) % q;
  const v2 = ((23n + 6n * (q - rt)) % q + q) % q;
  const l1 = legendre(v1, q), l2 = legendre(v2, q);
  if (l1 !== l2) return { err: "conjugates disagree — impossible for prime q; is q composite?" };
  return { q, chi1, chi2, r: l1 === 1 ? 0 : 1, rt, v1, v2 };
}


// N3(F2) order by literal powering ((chi1,chi2) rule is a TEST)
function n3Mul(X, Y) { return X.map((r, i) => r.map((_, j) => r.reduce((s, _, k) => s ^ (X[i][k] & Y[k][j]), 0))); }

function n3Order(a, b, c) {
  const M = [[1, a, c], [0, 1, b], [0, 0, 1]];
  let P = M, n = 1;
  while (P.flat().join("") !== "100010001") { P = n3Mul(P, M); n++; if (n > 8) throw new Error("order > 8?"); }
  return n;
}

// q = 2 needs its own rule (mod-8 splitting, not Euler's criterion, which needs an odd
// modulus) -- shared by both frobeniusMatrix1361's error message (Ladder) and
// k1361FrobData's q=2 branch (Zeta), so there is exactly one computation of it, not two.
function frobeniusAt2_1361() {
  const chi1 = 13n % 8n === 1n ? 0 : 1, chi2 = 61n % 8n === 1n ? 0 : 1;
  const oA = n3Order(chi1, chi2, 0), oB = n3Order(chi1, chi2, 1);
  return oA === oB ? { chi1, chi2, ord: oA } : { err: "corner-dependent order at 2?" };
}

function frobOrderTriple(q) { // reuses frobeniusMatrix1361
  const f = frobeniusMatrix1361(q);
  return f.err ? f : { ...f, ord: n3Order(f.chi1, f.chi2, f.r === null ? 0 : f.r) };
}
