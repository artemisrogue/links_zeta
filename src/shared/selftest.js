
function runSelfTests() {
  const results = [];
  function t(name, fn) {
    try {
      const ok = fn();
      results.push({ name, ok: !!ok });
    } catch (e) {
      results.push({ name: name + " — threw: " + e.message, ok: false });
    }
  }
  const arrEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

  t("legendre(5,29) === 1", () => legendre(5n, 29n) === 1);
  t("legendre(5,13) === -1", () => legendre(5n, 13n) === -1);
  t("legendre(13,61) === 1", () => legendre(13n, 61n) === 1);
  t("legendre(13,937) === 1", () => legendre(13n, 937n) === 1);
  t("legendre(61,937) === 1", () => legendre(61n, 937n) === 1);
  t("tonelliShanks(13,937) === [386,551]", () => arrEq(tonelliShanks(13n, 937n), [386n, 551n]));
  t("redeiSymbol(13,61,937,[23,6,1]) === -1", () => redeiSymbol(13n, 61n, 937n, 23n, 6n, 1n).value === -1);

  t("redeiSymbol normalization: scaled certificate (115,30,5) rejected (would flip by (5/937) = -1)", () => {
    let threw = false;
    try { redeiSymbol(13n, 61n, 937n, 115n, 30n, 5n); } catch (e) { threw = /primitive/.test(e.message); }
    return threw && legendre(5n, 937n) === -1
      && (115n * 115n - 13n * 30n * 30n - 61n * 25n) === 0n;
  });

  const pairs = [[5n, 8081n], [5n, 101n], [5n, 449n], [8081n, 101n], [8081n, 449n], [101n, 449n]];
  t("all six pairwise symbols of {5,8081,101,449} === 1", () => pairs.every(([a, b]) => legendre(a, b) === 1));

  t("redeiSymbol(5,8081,449,[241,100,1]) === 1", () => redeiSymbol(5n, 8081n, 449n, 241n, 100n, 1n).value === 1);
  t("redeiSymbol(5,101,449,[11,2,1]) === 1", () => redeiSymbol(5n, 101n, 449n, 11n, 2n, 1n).value === 1);
  t("redeiSymbol(101,8081,449,[1009,100,1]) === 1", () => redeiSymbol(101n, 8081n, 449n, 1009n, 100n, 1n).value === 1);

  t("tonelliShanks(5,449) roots === {118,331}", () => arrEq(tonelliShanks(5n, 449n), [118n, 331n]));
  t("tonelliShanks(101,449) roots === {185,264}", () => arrEq(tonelliShanks(101n, 449n), [185n, 264n]));

  t("conjugates 25±2·118±2·185 mod 449 === {182,340,159,317}, each legendre -1", () => {
    const signs = [[1n, 1n], [1n, -1n], [-1n, 1n], [-1n, -1n]];
    const vals = signs.map(([s1, s2]) => ((25n + 2n * s1 * 118n + 2n * s2 * 185n) % 449n + 449n) % 449n);
    const expected = [182n, 340n, 159n, 317n];
    const sortedVals = [...vals].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const sortedExp = [...expected].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    return arrEq(sortedVals, sortedExp) && vals.every(v => legendre(v, 449n) === -1);
  });

  t("theta' = 494+225sqrt5+(50+22sqrt5)sqrt101: same identity, OPPOSITE verdict mod 449 - rejected: not totally positive", () => {
    const [r, s] = quadThetaIdentity(494n, 225n, 50n, 22n);
    if (r !== 0n || s !== 0n) return false; // passes the identity
    if (quadThetaTotallyPositive(494, 225, 50, 22)) return false; // fails positivity
    if (!quadThetaTotallyPositive(25, 2, 2, 0)) return false; // real theta passes
    const conj = [];
    for (const r5 of [118n, 331n]) for (const r101 of [185n, 264n])
      conj.push((((494n + 225n * r5) + (50n + 22n * r5) * r101) % 449n + 449n) % 449n);
    return conj.every(v => legendre(v, 449n) === 1); // all squares: verdict flipped
  });

  t("theta'' = -(10+sqrt101)^2*theta: same identity, mod-449 invisible ((-1/449) = +1), totally negative - positivity rejects it", () => {
    const [r, s] = quadThetaIdentity(-9065n, -402n, -902n, -40n);
    if (r !== 0n || s !== 0n) return false;
    if (!quadThetaEmbeddings(-9065, -402, -902, -40).every(v => v < 0)) return false;
    if (quadThetaTotallyPositive(-9065, -402, -902, -40)) return false;
    const conj = [];
    for (const r5 of [118n, 331n]) for (const r101 of [185n, 264n])
      conj.push((((-9065n - 402n * r5) + (-902n - 40n * r5) * r101) % 449n + 449n) % 449n);
    return legendre(448n, 449n) === 1 && conj.every(v => legendre(v, 449n) === -1);
  });

  t("Magnus: coeff X1X2X3 === 1, X2X1X3 === -1", () => {
    const s = computeMagnusTripleCommutator();
    return (s["1,2,3"] || 0) === 1 && (s["2,1,3"] || 0) === -1;
  });

  t("Magnus display pinned: deg<=3 support exactly {1, +X1X2X3, -X2X1X3, -X3X1X2, +X3X2X1}, |c| = 1; magnusBox text matches", () => {
    const s = computeMagnusTripleCommutator();
    if ((s[""] || 0) !== 1) return false;
    if ((s["1,2,3"] || 0) !== 1 || (s["2,1,3"] || 0) !== -1 || (s["3,1,2"] || 0) !== -1 || (s["3,2,1"] || 0) !== 1) return false;
    const allowed = new Set(["", "1,2,3", "2,1,3", "3,1,2", "3,2,1"]);
    const low = Object.keys(s).filter(k => (k === "" ? 0 : k.split(",").length) <= 3);
    if (low.length !== 5 || !low.every(k => allowed.has(k))) return false;
    const txt = $id("magnusBox").textContent;
    return txt.includes("↦ 1 + X₁X₂X₃ − X₂X₁X₃ − X₃X₁X₂ + X₃X₂X₁ + (deg ≥ 4)") && txt.includes("μ̄(1234) = 1");
  });

  t("Delta_Bor(1+x): all coefficients below top degree vanish; top === 1 === mu(123)", () => {
    const poly = expandDeltaBor();
    const keys = Object.keys(poly);
    return keys.length === 1 && poly["1,1,1"] === 1;
  });

  t("both = 3 (mod 4) order-dependent: (3/7) = -1, (7/3) = +1 - no Hopf/unlink gloss in that class", () => legendre(3n, 7n) === -1 && legendre(7n, 3n) === 1);

  t("Hilbert product formula: product over places === 1 for (5,29) and (5,13) — v = 2 factor by mod-8 enumeration, not the closed form (Klein C3)", () => {
    const hilbertProduct = (p, q) => hilbert2adic(p, q) * legendre(p, q) * legendre(q, p);
    return hilbertProduct(5n, 29n) === 1 && hilbertProduct(5n, 13n) === 1;
  });

  t("Hilbert (3,7): enumerated 2-adic factor -1, (p/q)(q/p) = -1, product still 1; enumeration === closed form on all odd prime pairs < 60 (independence check)", () => {
    if (!(hilbert2adic(3n, 7n) === -1 && legendre(3n, 7n) * legendre(7n, 3n) === -1
      && hilbert2adic(3n, 7n) * legendre(3n, 7n) * legendre(7n, 3n) === 1)) return false;
    const ps = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n];
    return ps.every(p => ps.every(q => {
      const closed = Number((p - 1n) / 2n % 2n) * Number((q - 1n) / 2n % 2n) % 2 === 0 ? 1 : -1;
      return hilbert2adic(p, q) === closed;
    }));
  });

  t("fig-8 monodromy: tr(A^n) = 3tr(A^{n-1}) - tr(A^{n-2}); tr = 3,7,18,...,103682 (Lucas)", () => {
    const tr = fig8Traces(12);
    return tr[0] === 3 && tr[1] === 7 && tr[11] === 103682
      && tr.slice(2).every((x, i) => x === 3 * tr[i + 1] - tr[i]);
  });

  t("fig-8 zeta: iterate face === eigenvalue face === 1,3,8,21,55,144,... (Fibonacci F_2k)", () => {
    const { sumFace, eigFace } = fig8Data();
    const fib = [1, 3, 8, 21, 55, 144, 377, 987, 2584];
    return sumFace.every((c, i) => Math.abs(c - eigFace[i]) < 1e-6)
      && eigFace.slice(0, 9).every((c, i) => c === fib[i]);
  });

  t("fig-8 orbits: Mobius counts are nonneg integers with sum_{d|n} d*o_d = Fix(n)", () => {
    const { fix, orb } = fig8Data();
    if (!orb.every(o => o >= 0 && Number.isInteger(o))) return false;
    return fix.every((f, i) => {
      const n = i + 1; let s = 0;
      for (let d = 1; d <= n; d++) if (n % d === 0) s += d * orb[d - 1];
      return s === f;
    });
  });

  t("fig-8 zeta: orbit product === exp(sum Fix t^n/n) (coeffs 0..8)", () => {
    const { fixFace, orbFace } = fig8Data();
    return fixFace.every((c, i) => Math.abs(c - orbFace[i]) < 1e-6);
  });

  t("fig-8: orbit zeta === (1-t)^2 * H1-zeta, coefficient by coefficient", () => {
    const { sumFace, fixFace } = fig8Data();
    const cross = sumFace.map((c, i) => c - 2 * (sumFace[i - 1] || 0) + (sumFace[i - 2] || 0));
    return cross.every((c, i) => Math.abs(c - fixFace[i]) < 1e-6)
      && Math.abs(sumFace[1] - fixFace[1]) > 0.5; // and they really are different functions
  });

  t("Q(sqrt5): chi pattern +,-,-,+,0; a(11)=2, a(13)=0, a(169)=1, a(4)=1, a(5)=1", () => {
    const spf = spfSieve(200);
    const vals = [chi5(1), chi5(2), chi5(3), chi5(4), chi5(5)];
    if (JSON.stringify(vals) !== JSON.stringify([1, -1, -1, 1, 0])) return false;
    const a = (() => {
      const N = 200, arr = new Array(N + 1).fill(0); arr[1] = 1;
      for (let n = 2; n <= N; n++) {
        const p = spf[n]; let m = n, k = 0;
        while (m % p === 0) { m /= p; k++; }
        const c = chi5(p);
        arr[n] = (p === 5 ? 1 : c === 1 ? k + 1 : (k % 2 === 0 ? 1 : 0)) * arr[m];
      }
      return arr;
    })();
    return a[11] === 2 && a[13] === 0 && a[169] === 1 && a[4] === 1 && a[5] === 1;
  });

  t("zeta_{Q(sqrt5)}(2): ideal sum, Euler product, zeta*L agree (N=3000, tol 1e-3; measured truncation error ~2.4e-4)", () => {
    // Klein D2: tolerance tightened from 5e-3 (was ~25x looser than the measured error).
    const { ideal, prod, zl } = dedekindValues(3000);
    return Math.abs(ideal - zl) < 1e-3 && Math.abs(prod - zl) < 1e-3 && Math.abs(ideal - prod) < 1e-3;
  });
  t("Klein F1 pure: ideal-sum face agrees with the pinned Euler product — Σ a(n)n⁻² over 200-smooth unramified n ≤ 120000 within 1e-5 of 1.0673950922954751", () => {
    const { sum } = k1361IdealFace(200, 120000);
    return Math.abs(sum - 1.0673950922954751) < 1e-5;
  });
  t("Klein F2 pure: μ̄(12345) = 1 at the model level (coefficient of X₁X₂X₃X₄ in [[[x₁,x₂],x₃],x₄]), lower coefficients 0; 5×5 corner has order 2 in N₅(F₂); 1024/2 = 512", () => {
    const s5 = computeMagnusL5();
    const M5 = [...Array(5)].map((_, i) => [...Array(5)].map((_, j) => i === j ? 1 : (i === 0 && j === 4 ? 1 : 0)));
    return (s5["1,2,3,4"] || 0) === 1 && (s5["1,2"] || 0) === 0 && (s5["1,2,3"] || 0) === 0
      && matOrderF2(M5) === 2 && 1024 / matOrderF2(M5) === 512;
  });
  t("DOM Klein F2/F4: five-component half-rung (worked topology + honest blank naming N₅(F₂)); cockpit seeded (5,29,109;7,2,1) = +1 and rejecting a scaled certificate", () => {
    const fw = $id("fiveWorked").textContent, fb = $id("fiveBlank").textContent;
    if (!(fw.includes("512 loops of double length") && fw.includes("(1 − t²)⁻⁵¹²")
      && fb.includes("missing") && fb.includes("N₅(F₂)") && fb.includes("blank"))) return false;
    const heads = [...$qa("#tab-zeta .zx-row-head")].map(e => e.textContent);
    if (!heads.some(h => h.includes("Five components"))) return false;
    // State-robust: assert the load snapshot and the engine, never the live cockpit output.
    if (!CCOUT_AT_LOAD.includes("[5, 29, 109] = +1")) return false;
    if (redeiSymbol(5n, 29n, 109n, 7n, 2n, 1n).value !== 1) return false;
    let rejected = false;
    try { redeiSymbol(5n, 29n, 109n, 21n, 6n, 3n); } catch (e) { rejected = /primitive|gcd/.test(e.message); }
    return rejected;
  });
  t("Klein A2 pure: computed surface picture — Σ₁ ∩ Σ₂ segment ends exactly at K₁'s two punctures through Σ₂ (y = ±1.1), signs cancel, both punctures inside Σ₂", () => {
    const d = gammaComputedData();
    return Math.abs(d.y0 + 1.1) < 1e-9 && Math.abs(d.y1 - 1.1) < 1e-9 && Math.abs(d.len - 2.2) < 1e-9
      && d.punctures.length === 2 && d.punctures[0].sign + d.punctures[1].sign === 0
      && d.punctures.every(p => p.inSigma2);
  });
  t("DOM Klein A1/A2: presentation matrices rendered (det = t² − 3t + 1 ✓ live; Λ-side 1×1 at cited level); computed-γ figure present with honesty caption", () => {
    const pt = $id("presMatTopo").textContent, pa = $id("presMatArith").textContent, g = $id("gammaComputed").textContent;
    return pt.includes("tI − A") && pt.includes("t² − 3t + 1") && pt.includes("Δ₄₁ ✓")
      && pa.includes("λ = 1") && pa.includes("deg f₃₇ = λ = 1") && pa.includes("class-group tower data this app does not carry")
      && g.includes("computed, not schematic") && g.includes("the ± punctures");
  });
  t("Klein A4 pure: Chebotarev tally over the 427 unramified odd primes < 3000 — id 50, corner 47, χ-classes 109/111/110 (observed hugs 1/8,1/8,1/4,1/4,1/4)", () => {
    const { counts, total } = chebotarevTally(3000);
    return total === 427 && counts.id === 50 && counts.corner === 47
      && counts["10"] === 109 && counts["01"] === 111 && counts["11"] === 110;
  });
  t("Klein C8 pure: irregularIndicesAsync chunk bookkeeping, driven synchronously across the 599-row boundary — 691 → [12, 200], equal to the synchronous twin", () => {
    let got = null, ticks = 0;
    irregularIndicesAsync(691, () => { ticks++; }, idx => { got = idx; }, f => f());
    const syncIdx = irregularIndices(691);
    return !!got && got.join(",") === "12,200" && got.join(",") === syncIdx.join(",") && ticks >= 1;
  });

  t("Frobenius matrix: rho(Frob_937) has chi1=chi2=0, corner r=1 (matches [13,61,937] = -1)", () => {
    const f = frobeniusMatrix1361(937n);
    return !f.err && f.chi1 === 0 && f.chi2 === 0 && f.r === 1;
  });

  t("Frobenius matrix: rho(Frob_107) is the identity (splits completely in k_{13,61})", () => {
    const f = frobeniusMatrix1361(107n);
    return !f.err && f.chi1 === 0 && f.chi2 === 0 && f.r === 0;
  });

  t("two-tier domain: rho(Frob_107) corner is a defined splitting datum, while the Redei SYMBOL [13,61,107] is rejected by the mod-4 check", () => {
    const f = frobeniusMatrix1361(107n);
    let threw = false;
    try { redeiSymbol(13n, 61n, 107n, 23n, 6n, 1n); } catch (e) { threw = /mod 4/.test(e.message); }
    return !f.err && f.r === 0 && threw && 107n % 4n === 3n;
  });

  t("Frobenius matrix: corner undefined when superdiagonal nonzero (q=5: chi=(1,0); q=17: chi=(0,1))", () => {
    const f5 = frobeniusMatrix1361(5n), f17 = frobeniusMatrix1361(17n);
    return f5.chi1 === 1 && f5.chi2 === 0 && f5.r === null
      && f17.chi1 === 0 && f17.chi2 === 1 && f17.r === null
      && !!frobeniusMatrix1361(13n).err && !!frobeniusMatrix1361(2n).err;
  });

  t("input sanitizer: rejects '1e5', '1.5', '-7', '', 10-digit; accepts '937' as 937n", () => {
    return parseIntegerInput("1e5") === null && parseIntegerInput("1.5") === null
      && parseIntegerInput("-7") === null && parseIntegerInput("") === null
      && parseIntegerInput("1234567890") === null && parseIntegerInput("937") === 937n
      && parseIntegerInput(" 107 ") === 107n;
  });

  t("certificate-dependence: [13,61,269] = -1 via (23,6,1); k=2 exploit (46,12,2) would report +1 ((2/269) = -1) - rejected", () => {
    let threw = false;
    try { redeiSymbol(13n, 61n, 269n, 46n, 12n, 2n); } catch (e) { threw = /primitive/.test(e.message); }
    return threw && legendre(2n, 269n) === -1
      && redeiSymbol(13n, 61n, 269n, 23n, 6n, 1n).value === -1;
  });

  t("definedness: [13,61,7] rejected (7 !== 1 mod 4); (5,13): (5/13) = -1, imprimitive (0,0,0) certificate rejected", () => {
    let a = false, b = false;
    try { redeiSymbol(13n, 61n, 7n, 23n, 6n, 1n); } catch (e) { a = /mod 4/.test(e.message); }
    try { redeiSymbol(5n, 13n, 29n, 0n, 0n, 0n); } catch (e) { b = /primitive/.test(e.message); }
    return a && b && legendre(5n, 13n) === -1;
  });

  t("Redei reciprocity instance: [5,8081,101] === [5,101,8081] via two different Redei elements", () => {
    return redeiSymbol(5n, 8081n, 101n, 241n, 100n, 1n).value
      === redeiSymbol(5n, 101n, 8081n, 11n, 2n, 1n).value;
  });

  t("Brunnian-4loops: all six pairwise lk === 0 (computed from redrawn crossings)", () => {
    const lk = b4wComputeLk();
    return ["GY", "RY", "BY", "RB", "GR", "GB"].every(k => lk[k] === 0);
  });

  t("Brunnian-4loops: crossing counts GY=4, YR=4, YB=4, RB=2, GR=0, GB=0", () => {
    const { counts } = b4wComputeLk();
    return counts.GY === 4 && counts.YR === 4 && counts.YB === 4 && counts.RB === 2
      && counts.GR === 0 && counts.GB === 0;
  });

  t("Borromean diagram: lk === 0 for all three pairs, computed from signed crossings", () => {
    const lk = borroComputeLk();
    return lk["12"] === 0 && lk["13"] === 0 && lk["23"] === 0;
  });

  t("Magnus of longitude [x1,x2]: coeff X1X2 === 1 (= mu(123)), X2X1 === -1", () => {
    const C = computeMagnusLongitude12();
    return (C["1,2"] || 0) === 1 && (C["2,1"] || 0) === -1;
  });

  // R3 DOM assertions: rendered text pinned per amendment 3
  t("DOM R3-M5: b4WordNote K1..K3 only; algebraic shadow; model credited; K4 separate; Restore exercised (state-robust)", () => {
    const s = B4W_HOME_TEXT;
    if (!(s.includes("Delete K₁, K₂, or K₃") && s.includes("algebraic shadow") && s.includes("Milnor data vanish")
      && s.includes("model's construction") && s.includes("no x₄ to set") && !s.includes("Delete ANY component"))) return false;
    const was = b4wDeleted;
    $id("restoreBtn").click();
    const ok = b4wDeleted === null && $id("b4WordNote").textContent === s;
    if (was) $id("deleteBtn").click();
    return ok;
  });
  t("DOM R3-M4: orbit face states its hypothesis; tooltip carries the -A counterexample", () => {
    const f = [...$qa("#tab-zeta .zeta-face .fname")].find(e => e.textContent.includes("Product over periodic orbits"));
    if (!f || !f.textContent.includes("Anosov on the closed torus, both eigenvalues positive")) return false;
    const tip = f.querySelector("[data-tip]");
    return !!tip && tip.getAttribute("data-tip").includes("−A is Anosov") && tip.getAttribute("data-tip").includes("index is +1");
  });
  t("DOM R3-M3: Rédei reciprocity credited to Rédei for this regime, Stevenhagen for the general form; evidence scoped to one transposition", () => {
    return [...$qa("#quadSteps [data-tip]")].some(el => {
      const s = el.getAttribute("data-tip");
      // Stevenhagen's paper states that Corsman's 2007 thesis rests on an incorrect
      // lemma, so the app must not credit Corsman with the completing proof.
      return s.includes("Stated and proved by Rédei (1939, Satz 4)")
        && s.includes("Stevenhagen") && s.includes("corrects the earlier treatment in Corsman")
        && !/first complete proofs are modern/.test(s)
        && s.includes("Morishita") && s.includes("one transposition instance");
    });
  });
  t("DOM R3-M2: Main Conjecture parity (Mazur-Wiles odd l; l = 2 by Greither)", () => {
    const demo = [...$qa("#tab-zeta .poly-demo")].find(d => d.textContent.includes("Iwasawa Main Conjecture"));
    if (!demo || !demo.textContent.includes("Mazur–Wiles; ℓ = 2 by Greither")) return false;
    const tip = demo.querySelector('[data-tip*="Greither (1992)"]');
    return !!tip && tip.getAttribute("data-tip").includes("odd ℓ");
  });
  t("DOM R3-M1: f_S tooltip keeps S ∪ {∞} and the totally real Z/4 × Z/2", () => {
    return [...$qa("#tab-dict [data-tip]")].some(el => {
      const s = el.getAttribute("data-tip");
      return s.includes("unramified outside S ∪ {∞}") && s.includes("Z/4 × Z/2");
    });
  });

  // R3 pedagogy DOM assertions
  t("DOM R3-N1: f_S asymmetry visible in whyFS; quad step 2 states normalization conditions", () => {
    const b = $id("whyFS");
    if (!b) return false;
    const s = b.textContent, q = $id("quadSteps").textContent;
    return s.includes("unramified outside S ∪ {∞}") && s.includes("eᵢ = v_ℓ(pᵢ − 1)")
      && s.includes("Z/4 × Z/4") && s.includes("Z/4 × Z/2")
      && q.includes("gcd(x,y,z) = 1, y even, x − y ≡ 1 (mod 4)");
  });
  t("DOM R3-N2: quad step 3 justifies positivity (identity does not pin theta; Amano)", () => {
    const q = $id("quadSteps").textContent;
    return q.includes("does not pin θ down") && q.includes("opposite")
      && q.includes("Amano's Theorem 3.2.5") && q.includes("this app's own filter");
  });
  t("DOM R3-N3: iterate face defines L(h^n) visibly; orbit face cross-refs the (1-t)^2 check", () => {
    const faces = [...$qa("#tab-zeta .zeta-face")];
    const sum = faces.find(f => f.textContent.includes("Sum over iterates"));
    const orb = faces.find(f => f.textContent.includes("Product over periodic orbits"));
    return !!sum && sum.textContent.includes("where L(hⁿ) := tr(hⁿ∗ on H₁)") && sum.textContent.includes("tr(Aⁿ)")
      && !!orb && orb.textContent.includes("why (1−t)²?");
  });
  t("DOM R3-N4: whyKnots premise visible (profinite pi_1(S^1); Artin-Verdier; circle in 3-space)", () => {
    const b = $id("whyKnots");
    return !!b && b.textContent.includes("profinite fundamental group of the circle")
      && b.textContent.includes("Artin–Verdier") && b.textContent.includes("A circle inside a 3-space is a knot");
  });
  t("DOM R3-N5: Redei value rule visible on Triples; echoed at quad step 5", () => {
    const sub = $q("#tab-triples .col.arith .sub");
    const q = $id("quadSteps").textContent;
    return !!sub && sub.textContent.includes("+1 if q splits completely") && q.includes("+1 = splits completely");
  });
  t("DOM R3-N6: Ladder tips use .tt, no bare titles; 'why deg 32' visible", () => {
    const td = $q("#matN4 td[data-pos='0,2']");
    if (!td || !td.classList.contains("tt") || td.getAttribute("tabindex") !== "0") return false;
    if (!(td.getAttribute("data-tip") || "").includes("Triple level for (1,2,3)") || td.getAttribute("title")) return false;
    if ([...$qa("table.mat td[title]")].length !== 0) return false;
    return [...$qa("#tab-quads .small-note")].some(n => n.textContent.includes("8·8/2 = 32"));
  });

  // R3 a11y DOM assertions (amendment 3)
  const ga = (id, a) => $id(id).getAttribute(a);
  t("DOM R3-A1: .tt button semantics; Enter pins readout; Esc closes; header names keys", () => {
    const el = $q("#tab-dict .tt");
    if (!el || el.getAttribute("role") !== "button" || el.getAttribute("tabindex") !== "0"
      || el.getAttribute("aria-expanded") !== "false") return false;
    const pinnedBefore = [...$qa(".tt.tt-open")]; // Klein D9: restore the presenter's pins afterwards
    el.focus({ preventScroll: true });
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    const open = el.classList.contains("tt-open") && el.getAttribute("aria-expanded") === "true"
      && el.getAttribute("aria-describedby") === "ttReadout"
      && $id("ttReadout").textContent === el.getAttribute("data-tip");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const closed = !el.classList.contains("tt-open") && el.getAttribute("aria-expanded") === "false";
    el.blur();
    pinnedBefore.forEach(x => ttSet(x, true)); // restore discipline, matching R4-T5/R3-M5
    return open && closed && $q("header p").textContent.includes("Enter/Space pins too, Esc closes");
  });
  t("DOM R3-A2: tab roles wired; exactly one aria-selected, flipping on activation", () => {
    if ($q("nav.tabs").getAttribute("role") !== "tablist") return false;
    const btns = [...$qa(".tab-btn")];
    if (btns.length !== 7 || !btns.every(b => b.getAttribute("role") === "tab" && b.getAttribute("aria-controls") === "tab-" + b.dataset.tab
      && $id("tab-" + b.dataset.tab).getAttribute("role") === "tabpanel"
      && $id("tab-" + b.dataset.tab).getAttribute("aria-labelledby") === b.id)) return false;
    const sel = () => btns.filter(b => b.getAttribute("aria-selected") === "true");
    const before = sel();
    if (before.length !== 1 || !before[0].classList.contains("active")) return false;
    const other = btns.find(b => b !== before[0]);
    other.click();
    const flipped = sel().length === 1 && sel()[0] === other;
    before[0].click();
    return flipped && sel().length === 1 && sel()[0] === before[0];
  });
  t("DOM R3-A3: canvases expose role=img + nonempty aria-label; pairs/arc/b4 labels track state", () => {
    const ok = ["pairsCanvas", "arcCanvas", "borroCanvas", "b4Canvas"].every(id =>
      ga(id, "role") === "img" && (ga(id, "aria-label") || "").length > 20);
    return ok && ga("pairsCanvas", "aria-label").includes(pairsState.linked ? "Hopf" : "unlinked")
      && ga("arcCanvas", "aria-label").includes(pairsState.linked ? "meeting in the segment" : "pulled apart")
      && ga("b4Canvas", "aria-label").includes(b4wDeleted ? "deleted" : "Brunnian");
  });
  t("DOM R3-A4: aria-live on result surfaces; #pairsWarn switches role refusal/remark", () => {
    const live = ["pairsBanner", "hilbertNote", "pairsLiftNote", "b4WordNote", "ladderNote", "frobExplain"].every(id => ga(id, "aria-live") === "polite")
      && $q(".euler-vals").getAttribute("aria-live") === "polite" && ga("frobWarn", "role") === "alert";
    // #pairsWarn carries two different kinds of message; colour alone must not be
    // the only thing telling them apart. A refusal is role=alert and is prefixed
    // "Cannot compute —"; a remark about an admissible pair is role=status.
    // Restore what was on SCREEN, not what was in the boxes: if the presenter has
    // typed a prime and not pressed Compute, restoring from the boxes would commit it
    // and silently change the mathematics on display mid-demo.
    const shown = { ...pairsComputed };
    const boxes = [$id("pInput").value, $id("qInput").value];
    const syncNote = $id("pairsSyncNote").innerHTML;
    const state = () => [ga("pairsWarn", "role"), $id("pairsWarn").textContent.startsWith("Cannot compute —")];
    const run = (a, b) => { $id("pInput").value = a; $id("qInput").value = b; $id("computeLegendre").click(); return state(); };
    const refusal = run("9", "29"), remark = run("3", "7");
    if (shown.p !== null) renderLegendreTable(shown.p, shown.q); // repaint the displayed pair
    $id("pInput").value = boxes[0]; $id("qInput").value = boxes[1]; // and hand the boxes back untouched
    $id("pairsSyncNote").innerHTML = syncNote; // ... including the note the probe overwrote
    pairsStaleSync();
    return live && refusal[0] === "alert" && refusal[1] === true
      && remark[0] === "status" && remark[1] === false;
  });
  t("DOM R3-A5: jumps + ellipse toggle real buttons; select/slider named; 3D arrow keys", () => {
    const jumps = [...$qa(".jump")];
    if (jumps.length < 3 || !jumps.every(el => el.tagName === "BUTTON" && el.type === "button")) return false;
    const fs = $id("fsTooltip");
    if (fs.tagName !== "BUTTON" || ga("fsTooltip", "aria-controls") !== "fsExplain") return false;
    const was = ga("fsTooltip", "aria-expanded");
    fs.click();
    const toggled = ga("fsTooltip", "aria-expanded") !== was
      && ($id("fsExplain").style.display === "block") === (was === "false");
    fs.click();
    return toggled && ga("fsTooltip", "aria-expanded") === was
      && (ga("deleteSelect", "aria-label") || "").length > 0
      && ga("dedekindN", "aria-label") === "summation limit X"
      && $q("#borro3dWrap .small-note").textContent.includes("arrow keys");
  });
  t("DOM R3-A6: contrast floors — zeros and dotted underline at #767676", () => {
    const grey = "rgb(118, 118, 118)";
    const fm = $q("#frobMatrix td[style]");
    return getComputedStyle($q("#deltaBorGrid .coef-cell.zero")).color === grey
      && $q("#matN3 td[data-pos='1,0']").style.color === grey
      && (!fm || fm.style.color === grey)
      && getComputedStyle($q(".tt")).borderBottomColor === grey;
  });

  // R4 thread DOM assertions
  t("R4-T2 pure: 5^6 mod 13 = 12 (swap), 5^14 mod 29 = 1 (fix), x^2-5 mod 29: {11,18}", () => {
    return powmod(5n, 6n, 13n) === 12n && powmod(5n, 14n, 29n) === 1n
      && arrEq(tonelliShanks(5n, 29n), [11n, 18n]) && (11n * 11n) % 29n === 5n;
  });
  t("R4-T3: ord(937) = 2, ord(107) = 1 by powering; n3Order matches (chi1,chi2) on all 8", () => {
    if (frobOrderTriple(937n).ord !== 2 || frobOrderTriple(107n).ord !== 1) return false;
    for (const a of [0, 1]) for (const b of [0, 1]) for (const c of [0, 1])
      if (n3Order(a, b, c) !== ((a || b || c) ? (a && b ? 4 : 2) : 1)) return false;
    return true;
  });
  t("DOM R4-T3: Triples thread - order 2, 4 orbits, (1 − 937⁻²ˢ)⁻⁴; contrast (1 − 107⁻ˢ)⁻⁸; Milnor-Turaev; Ladder jump", () => {
    const s = $id("triplesThread").textContent;
    return s.includes("order 2") && s.includes("4 orbits of period 2") && s.includes("(1 − 937⁻²ˢ)⁻⁴")
      && s.includes("order 1") && s.includes("8 fixed points") && s.includes("(1 − 107⁻ˢ)⁻⁸")
      && s.includes("Milnor–Turaev") && s.includes("μ̄(123)")
      && s.includes("ρ(Frob937) ∈ N₃(F₂)") && s.includes("two roots of x² − p")
      && !!$q('#triplesThread .jump[onclick*="ladder"]');
  });
  t("DOM R4-T6: capstone factors match Triples/Quadruples; notes back-point to Pairs", () => {
    const z = $id("zetaThread").textContent, N = [...$qa("#tab-zeta .small-note")];
    const f3 = "(1 − 937⁻²ˢ)⁻⁴", f4 = "(1 − 449⁻²ˢ)⁻³²";
    return z.includes("computing zeta functions all along") && z.includes(f3) && z.includes(f4)
      && $id("triplesThread").textContent.includes(f3)
      && $id("quadThread").textContent.includes(f4)
      && z.includes("Main Conjecture")
      && N.some(n => n.textContent.includes("same orbit bookkeeping as the Pairs box"))
      && N.some(n => n.textContent.includes("Pairs box's local factors, multiplied together"));
  });
  t("DOM R4-T5: Ladder q=7: order 4, 2 orbits, (1 − 7⁻⁴ˢ)⁻²; 107 order 1; 937 order 2 (state restored)", () => {
    const exp = $id("frobExplain"), mat = $id("frobMatrix"), warn = $id("frobWarn");
    const s0 = [exp.innerHTML, mat.innerHTML, warn.textContent];
    const grab = q => { renderFrobenius(q); return exp.textContent; };
    const a = grab(7n), b = grab(107n), c = grab(937n);
    exp.innerHTML = s0[0]; mat.innerHTML = s0[1]; warn.textContent = s0[2];
    return legendre(13n, 7n) === -1 && legendre(61n, 7n) === -1
      && a.includes("order 4") && a.includes("2 orbits of length 4") && a.includes("(1 − 7⁻⁴ˢ)⁻²") && a.includes("why well-defined?")
      && b.includes("order 1") && b.includes("(1 − 107⁻ˢ)⁻⁸")
      && c.includes("order 2") && c.includes("(1 − 937⁻²ˢ)⁻⁴");
  });
  t("DOM R4-T4: Quadruples thread - order 2, 32 orbits, (1 − 449⁻²ˢ)⁻³²; split + inert bookkeeping; rung label (two levels up)", () => {
    const s = $id("quadThread").textContent;
    return s.includes("order 2") && s.includes("32 orbits of period 2") && s.includes("(1 − 449⁻²ˢ)⁻³²")
      && s.includes("degree-32 compositum") && s.includes("inert bookkeeping")
      && s.includes("two levels up") && !s.includes("three levels up")
      && $id("triplesThread").textContent.includes("one level up");
  });
  t("DOM R4-T2: Pairs thread - split 11/18 + (1 − 29⁻ˢ)⁻²; inert 5^6 ≡ 12 + (1 − 13⁻²ˢ)⁻¹; twin honesty; handoff glossed (state restored)", () => {
    const box = $id("pairsThread");
    const saved = box.innerHTML, savedDisp = box.style.display;
    renderPairsThread(5n, 29n, 1);
    const s = box.textContent;
    const okSplit = s.includes("11 and 18") && s.includes("Two orbits of period 1") && s.includes("(1 − 29⁻ˢ)⁻²")
      && s.includes("per-prime pieces") && s.includes("Riemann's zeta (the K = Q case)") && s.includes("twin series");
    renderPairsThread(5n, 13n, -1);
    const s2 = box.textContent;
    const okInert = s2.includes("≡ 12 ≡ −1 (mod 13)") && s2.includes("One orbit of period 2")
      && s2.includes("(1 − 13⁻²ˢ)⁻¹") && s2.includes("cited reasoning, not computed");
    box.innerHTML = saved; box.style.display = savedDisp;
    return okSplit && okInert;
  });
  t("DOM R4-T1: Dictionary thread box states the destination; coda points at it", () => {
    const b = $id("threadDict");
    const badge = b && b.querySelector(".thread-badge");
    return !!badge && badge.textContent.includes("ζ ↔ Δ") && b.textContent.includes("Where this is going")
      && b.textContent.includes("Alexander polynomial") && b.textContent.includes("zeta function")
      && b.textContent.includes("Lefschetz zeta of a monodromy")
      && b.textContent.includes("zeta of its own cover up to units")
      && b.textContent.includes("Zeta tab cashes everything out")
      && $q("#tab-dict .coda").textContent.includes("boxes track");
  });

  t("DOM R4-S1: both ≡ 3 mod 4 — lk-parity gloss withheld both ways ((3,7) inert, (7,3) split), per R2-M3 banner (state restored)", () => {
    const box = $id("pairsThread"), s0 = box.innerHTML, d0 = box.style.display;
    renderPairsThread(3n, 7n, -1); const a = box.textContent;
    renderPairsThread(7n, 3n, 1); const b = box.textContent;
    renderPairsThread(5n, 29n, 1); const c = box.textContent; // a licensed pair keeps the gloss
    box.innerHTML = s0; box.style.display = d0;
    return legendre(3n, 7n) === -1 && legendre(7n, 3n) === 1
      && a.includes("One orbit of period 2") && b.includes("Two orbits of period 1")
      && [a, b].every(s => s.includes("withheld for this pair") && !s.includes("lk is even") && !s.includes("lk is odd"))
      && c.includes("lk is even");
  });

  t("DOM R4-S2: Triples thread cites 107 as splitting datum, not '+1 symbol'; redeiSymbol still rejects 107", () => {
    const s = $id("triplesThread").textContent;
    let threw = false;
    try { redeiSymbol(13n, 61n, 107n, 23n, 6n, 1n); } catch (e) { threw = /mod 4/.test(e.message); }
    return threw && s.includes("splits completely in k₁₃,₆₁") && s.includes("splitting datum, not a symbol value")
      && s.includes("outside the symmetric symbol's domain") && !s.includes("Had the symbol been +1");
  });

  t("DOM R4-S3: quadThread tracks banner — '?' no factor; all-+1 order 1; live all-−1; capstone null-honest (state restored)", () => {
    const u = quadThreadHTML(false, false), sp = quadThreadHTML(false, true);
    if (!(u.includes("symbol is undefined") && !u.includes("local factor") && !u.includes("449⁻") && !u.includes("orbits of period"))) return false;
    if (!(sp.includes("order 1") && sp.includes("64 orbits of period 1") && sp.includes("(1 − 449⁻ˢ)⁻⁶⁴") && sp.includes("split bookkeeping") && !sp.includes("inert"))) return false;
    const d = $el("div");
    d.innerHTML = quadThreadHTML(true, false);
    if ($id("quadThread").textContent !== d.textContent) return false;
    const z = $id("zetaThread"), z0 = z.innerHTML;
    renderZetaThread(null);
    const ok = z.textContent.includes("undefined this run, not asserted") && !z.textContent.includes("449⁻");
    z.innerHTML = z0;
    return ok;
  });

  // R5: linking vs knotting (user-directed)
  t("R5-K1 pure: Torres diagonal [0,0,0,1] = u^3; (t-1)^4 = 1,-4,6,-4,1; unipotent traces all 4", () => {
    return arrEq(borDiagCoeffs(), [0, 0, 0, 1]) && arrEq(torresBorOneVar(), [1, -4, 6, -4, 1])
      && borUnipotentTraces(6).every(x => x === 4);
  });
  t("DOM R5-K1: Borromean box — b1 line, coefficients, eigenvalue-1, badge + Triples jump", () => {
    const s = $id("borroZeta").textContent;
    return s.includes("b₁ = 1 − (−3) = 4") && s.includes("1, −4, 6, −4, 1")
      && s.includes("every eigenvalue is 1")
      && !!$q('#borroZeta .jump[onclick*="triples"]') && !!$q("#borroZeta .thread-badge");
  });
  t("DOM R5-K2: knotting-contrast heading; 3-row table + Lucas tooltip; dichotomy names both dials", () => {
    const d = $id("fig8Dichotomy").textContent;
    return [...$qa("#tab-zeta .col.topo h2")].some(e => e.textContent.includes("Contrast: what knotting adds"))
      && $qa("#lefschetzTable tr").length === 4 && !!$q("#lefschetzTable th [data-tip*='Lucas']")
      && d.includes("spectral dial") && d.includes("coefficients-at-1 dial")
      && d.includes("entropy log φ²") && d.includes("4, 4, 4");
  });
  t("R5-K3 pure: irregular 37:[32] 59:[44] 67:[58] 101:[68] 103:[24]; 691 has 12; cast else regular", () => {
    return arrEq(irregularIndices(37), [32]) && arrEq(irregularIndices(59), [44])
      && arrEq(irregularIndices(67), [58]) && arrEq(irregularIndices(101), [68])
      && arrEq(irregularIndices(103), [24]) && irregularIndices(691).includes(12)
      && [5, 13, 29, 61, 449, 937].every(p => irregularIndices(p).length === 0);
  });
  t("DOM R5-K3: 101 irregular at B68, 449 regular; gallery; 8081 on demand (state-robust)", () => {
    const rows = [...$qa("#knottedTable tr")].map(r => r.textContent);
    const a = rows.find(s => s.startsWith("101")), b = rows.find(s => s.startsWith("449"));
    const s = $id("knottedPrime").textContent;
    return rows.length === 7
      && !!a && a.includes("irregular") && a.includes("knotted") && a.includes("B68 ≡ 0 (mod 101)")
      && !!b && b.includes("regular") && b.includes("unknotted")
      && s.includes("691 (B12, B200)")
      // state-robust (R3-S2)
      && ($id("verdict8081").textContent === "" ? !$id("check8081").disabled
        : /computing|8081 is/.test($id("verdict8081").textContent));
  });
  t("DOM R5-K4: stitches — grid zeta note + jump; Dictionary two-dials sentence; capstone pointer", () => {
    return $q("#tab-triples .col.topo .poly-demo").textContent.includes("the link's own zeta")
      && !!$q('#tab-triples .poly-demo .jump[onclick*="zeta"]')
      && $id("threadDict").textContent.includes("Two dials feed these zetas")
      && $id("threadDict").textContent.includes("the contrast boxes on the Zeta tab keep them apart")
      && $id("zetaThread").textContent.includes("keep the dials apart: linking at t = 1, knotting in the spectrum");
  });

  t("DOM R5-N1: Bernoulli — rationals + seed B₀ = 1 visible; vSC tooltip carries the p-integrality bridge", () => {
    const s = $id("knottedPrime").textContent, tip = $q('#knottedPrime [data-tip*="Staudt"]');
    return s.includes("rationals") && s.includes("B₀ = 1") && s.includes("p | numerator ⟺ B")
      && !!tip && ["p-integral", "(p−1) | k", "divides the numerator"].every(x => tip.getAttribute("data-tip").includes(x));
  });
  t("DOM R5-N2: object = Iwasawa's own Λ, not f_S; λ = degree + dilatation disclaimer; Kummer/Iwasawa cited; class group tooltipped", () => {
    const s = $id("knottedPrime").textContent;
    return !!$q('#knottedPrime [data-tip*="NOT f_S"]') && !!$q('#knottedPrime [data-tip*="ideal class group"]')
      && s.includes("λ = its degree") && s.includes("same letter, different object")
      && s.includes("Kummer's criterion") && s.includes("Iwasawa's theorem")
      && s.includes("eigenspace of Galois on the p-part");
  });
  t("DOM R5-N3: braid-closure/Bennequin/b₁ tooltips in the Borromean box; χ Euler-vs-character disclaimer visible", () => {
    return !!$q('#borroZeta [data-tip*="σᵢ crosses strands"]')
      && !!$q('#borroZeta [data-tip*="one disk per strand"]')
      && !!$q('#borroZeta [data-tip*="dropping χ by 1"]')
      && $id("borroZeta").textContent.includes("Euler characteristic here, not this tab's Dirichlet character");
  });
  t("DOM R5-N4: punchline scoped — this link; T(2,4) counterexample; exhibited, not a theorem; entropy defined", () => {
    const s = $id("borroZeta").textContent;
    return s.includes("this link of unknots") && s.includes("(2,4) torus link") && s.includes("not a theorem")
      && s.includes("entropy 0 (defined below)") && !!$q('#fig8Dichotomy [data-tip*="spectral radius"]');
  });

  // R6 G1: the surface ladder (session A)
  t("R6-G1 pure: N(alpha) identity 23·23 − 13·36 === 61 (the norm lands on the second prime)", () => 23n * 23n - 13n * 36n === 61n);
  t("DOM R6-G1: three rung headings (K₂ through Σ₁ / γ = Σ₁ ∩ Σ₂ / K₃ through γ) on the rail layout", () => {
    const titles = [...$qa("#sladderBox .rung-title")].map(e => e.textContent);
    return titles.length === 3
      && titles[0].includes("Rung 1") && titles[0].includes("K₂ through Σ₁")
      && titles[1].includes("Rung 2") && titles[1].includes("γ = Σ₁ ∩ Σ₂")
      && titles[2].includes("Rung 3") && titles[2].includes("K₃ through γ");
  });
  t("DOM R6-G1: live values — rung1 (13/61) = +1 & lk = 0; rung2 529 − 468 = 61; rung3 μ̄(123) = 1 ↔ [13,61,937] = −1", () => {
    return $id("rung1Arith").textContent.includes("(13/61) = +1")
      && $id("rung1Lk").textContent === "0"
      && $id("rung2Arith").textContent.includes("529 − 468 = 61")
      && $id("rung3Arith").textContent.includes("μ̄(123) = 1")
      && $id("rung3Arith").textContent.includes("[13, 61, 937] = −1")
      && $id("rung3Mu").textContent === "1";
  });
  t("DOM R6-G1: counted lines — (1 − 61⁻ˢ)⁻²; 'nothing yet' + 8 sheets; 4 loops winding twice + (1 − 937⁻²ˢ)⁻⁴; figures role=img + schematic caps", () => {
    const figs = ["rung1Fig", "rung2Fig", "rung3Fig"];
    return $id("rung1Count").textContent.includes("What is being counted")
      && $id("rung1Count").textContent.includes("(1 − 61⁻ˢ)⁻²")
      && $id("rung2Count").textContent.includes("What is being counted: nothing yet")
      && $id("rung2Count").textContent.includes("8 sheets")
      && $id("rung3Count").textContent.includes("4 loops, each winding twice")
      && $id("rung3Count").textContent.includes("(1 − 937⁻²ˢ)⁻⁴")
      && figs.every(id => $id(id).getAttribute("role") === "img" && ($id(id).getAttribute("aria-label") || "").length > 30)
      && $qa("#sladderBox .figcap").length === 4 // three schematics + Klein A2's computed figure
      && [...$qa("#sladderBox .figcap")].every(e => e.textContent.includes("schematic"));
  });

  // R6 G6: cover-lattice twins (session A)
  t("R6-G6 pure: |G|/ord bookkeeping by matrix powering — 8/ord(ρK₃) === 4, 64/ord(ρK₄) === 32, identity order 1", () => {
    const o3 = n3Order(0, 0, 1);
    const o4 = matOrderF2([[1, 0, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
    return o3 === 2 && 8 / o3 === 4 && o4 === 2 && 64 / o4 === 32
      && matOrderF2([[1, 0], [0, 1]]) === 1 && quad449Ord() === 2;
  });
  t("DOM R6-G6a: Triples twin — mod-2 Heisenberg top box (topological name) + deck = D₄ note, γ-unwinds edge, linking-probe annotation; caption 4 loops winding twice ↔ 937's 4 primes of residue degree 2, factor twins, Zeta jump + anchor", () => {
    const s = $id("tripleCoverHasse").textContent, c = $id("tripleCoverCap").textContent;
    return $id("tripleCoverHasse").getAttribute("role") === "img"
      && s.includes("mod-2 Heisenberg cover") && !s.includes("Rédei cover") && s.includes("deck = D₄, 8 sheets") && s.includes("mirrors k₁₃,₆₁")
      && s.includes("γ unwinds") && s.includes("exists because lk = 0")
      && c.includes("named for its deck group, not for Rédei")
      && s.includes("the covers the linking") && s.includes("numbers probe")
      && c.includes("4 loops winding twice") && c.includes("937's 4 primes of residue degree 2")
      && c.includes("(1 − t²)⁻⁴") && c.includes("(1 − 937⁻²ˢ)⁻⁴")
      && !!$q('#tripleCoverCap .jump[onclick*="zetaK1361"]') && !!$id("zetaK1361");
  });
  t("DOM R6-G6b: Quads twin — 64-sheet top with deck N₄(F₂), Heisenberg H₁₂/H₂₃ boxes (topological names), through-K₂ annotations, Milnor-model label; caption 32 loops of double length ↔ 449's 32 orbits, factor twins", () => {
    const s = $id("quadCoverTower").textContent, c = $id("quadCoverCap").textContent;
    return $id("quadCoverTower").getAttribute("role") === "img"
      && s.includes("64-sheet cover") && s.includes("N₄(F₂)")
      && s.includes("H₁₂ — Heisenberg, 8 sheets") && !s.includes("Rédei") && !s.includes("8081")
      && s.includes("through the shared K₂") && s.includes("Milnor-model")
      && s.includes("32 sheets") && s.includes("Milnor 1957") && s.includes("Amano 2014")
      && c.includes("32 loops of double length") && c.includes("449's 32 orbits of size 2")
      && c.includes("(1 − t²)⁻³²") && c.includes("(1 − 449⁻²ˢ)⁻³²");
  });
  t("DOM R6-G6c: Pairs mini twin — double-cover box, both cases drawn and captioned (2 loops / 1 loop winding twice)", () => {
    const s = $id("pairsCoverMini").textContent, c = $id("pairsCoverCap").textContent;
    return $id("pairsCoverMini").getAttribute("role") === "img"
      && s.includes("the double cover") && s.includes("K₂ lifts to 2 loops") && s.includes("1 loop, winds twice")
      && c.includes("2 loops") && c.includes("1 loop winding twice") && c.includes("residue degree 2");
  });
  t("DOM R6-G6: correspondence caption (tooltipped, cited) on all three twins; blue accent class styles the manifold boxes", () => {
    const ids = ["pairsCoverCorr", "tripleCoverCorr", "quadCoverCorr"];
    if (!ids.every(id => $id(id).textContent.includes("the Galois correspondence, both sides")
      && !!$q("#" + id + " [data-tip*='covering-space' i], #" + id + " [data-tip*='Covering-space']"))) return false;
    const box = $q("#tripleCoverHasse rect.hasse-box.cover");
    return !!box && getComputedStyle(box).stroke === "rgb(27, 108, 168)"
      && !!$q("#quadCoverTower rect.hasse-box.cover") && !!$q("#pairsCoverMini rect.hasse-box.cover");
  });

  // R6 G2: the Zeta gallery (session B)
  t("DOM R6-G2: gallery — every .zx card closed at load; summary h2 + hook; nonempty Lesson line each; R5-K1/K2/K3 pins alive inside cards", () => {
    const cards = [...$qa("#tab-zeta details.zx")];
    const LESSON = "Lesson (links ↔ primes):";
    return cards.length >= 4
      && ZX_AT_LOAD.length === cards.length && ZX_AT_LOAD.every(x => x.open === false)
      && cards.every(d => !!d.querySelector("summary h2 .zx-hook"))
      && cards.every(d => {
        const L = d.querySelector(".zx-lesson");
        return !!L && L.textContent.startsWith(LESSON) && L.textContent.length > LESSON.length + 20;
      })
      && $id("borroZeta").textContent.includes("every eigenvalue is 1")
      && $id("fig8Dichotomy").textContent.includes("coefficients-at-1 dial")
      && [...$qa("#knottedTable tr")].some(r => r.textContent.includes("B68 ≡ 0 (mod 101)"))
      && $id("zetaThread").textContent.includes("keep the dials apart: linking at t = 1, knotting in the spectrum");
  });
  t("DOM organic: Q&A tab — 14 professor questions, all closed at load (state-robust snapshot), intro present, jumps into the app, honesty vocabulary intact", () => {
    const items = [...$qa("#qaList details.qa-item")];
    const txt = $id("qaList").textContent;
    return items.length === 14
      && QA_AT_LOAD.length === 14 && QA_AT_LOAD.every(o => o === false)
      && items.every(d => !!d.querySelector("summary h2"))
      && $id("qaIntro").textContent.length > 100
      && $qa("#qaList button.jump").length >= 10
      && txt.includes("Mazur") && txt.includes("Artin–Verdier") && txt.includes("Chebotarev")
      && txt.includes("It is not a functor");
  });
  t("DOM organic: gallery spine stratified by component count — six row heads (two/three/four/five/contrast/torsion) and the Hopf card worked live", () => {
    const heads = [...$qa("#tab-zeta .zx-row-head")].map(e => e.textContent);
    return heads.length === 6
      && heads[0].includes("Two components") && heads[1].includes("Three components")
      && heads[2].includes("Four components") && heads[3].includes("Five components")
      && heads[4].includes("knotting") && heads[5].includes("Torsion orders")
      && $qa("#tab-zeta details.zx").length >= 12
      && $id("hopfWorked").textContent.includes("1 loop winding twice")
      && $id("hopfWorked").textContent.includes("(1 − 13⁻²ˢ)⁻¹")
      && $id("hopfWorked").textContent.includes("(1 − 29⁻ˢ)⁻²")
      && $q("#zxHopf .zx-lesson").textContent.startsWith("Lesson (links ↔ primes):")
      && ZX_AT_LOAD.some(x => x.id === "zxHopf" && x.open === false); // Klein E: assert the load snapshot, not live state
  });

  // R6 G3: worked 3-linked zetas (session B); reference values Node-verified from extracted machinery
  t("R6-G3a pure: k13,61 f-table — f(2)=4, f(3)=2, f(5)=2, f(7)=4, f(11)=4, f(17)=f(19)=f(23)=f(29)=2, f(107)=1, f(937)=2; partial Euler product s=2, p≤200 = 1.0673950922954751 ± 1e-6 over 44 primes", () => {
    const want = { 2: 4, 3: 2, 5: 2, 7: 4, 11: 4, 17: 2, 19: 2, 23: 2, 29: 2, 107: 1, 937: 2 };
    const { prod, count } = k1361PartialEuler(2, 200);
    return Object.keys(want).every(p => k1361FrobData(BigInt(p)).ord === want[p])
      && count === 44 && Math.abs(prod - 1.0673950922954751) < 1e-6;
  });
  t("DOM R6-G3a: k13,61 card — 11 rows, each factor = live localFactor(p, ord, 8); 937/107 orbit glosses; product displayed = computed to 6 decimals; ramified-omitted clause; two-tier dagger note", () => {
    const ps = [2, 3, 5, 7, 11, 17, 19, 23, 29, 107, 937];
    const rows = [...$qa("#k1361Table tr")].slice(1);
    if (rows.length !== 11) return false;
    const ok = ps.every((p, i) => rows[i].cells[0].textContent.startsWith(String(p))
      && rows[i].textContent.includes(localFactor(p, k1361FrobData(BigInt(p)).ord, 8)));
    const s = $id("k1361Worked").textContent;
    return ok && rows[10].textContent.includes("4 orbits of size 2 — the triple symbol's −1")
      && rows[9].textContent.includes("splits completely")
      && s.includes(k1361PartialEuler(2, 200).prod.toFixed(6))
      && s.includes("p = 13 and p = 61 — are omitted")
      && s.includes("splitting datum") && s.includes("q ≡ 1 (mod 4)")
      && $q("#zxK1361 .zx-lesson").textContent.includes("the whole product feels it")
      && !!$id("zetaK1361");
  });
  t("R6-G3b pure: exp(Σ 4tⁿ/n) = (1 − t)⁻⁴ coefficient by coefficient — 1,4,10,20,35,56,84,120,165 = C(n+3,3) by literal products; traces all 4", () => {
    const e = expOfPowerSum(borUnipotentTraces(8), 8);
    const b = []; for (let n = 0; n <= 8; n++) b.push(((n + 1) * (n + 2) * (n + 3)) / 6);
    return borUnipotentTraces(8).every(x => x === 4)
      && e.every((c, i) => Math.abs(c - b[i]) < 1e-9)
      && b[4] === 35 && b[8] === 165;
  });
  t("DOM R6-G3b: worked Borromean card — both coefficient rows + ✓ equal; (1 − t²)⁻⁴ twin of (1 − 937⁻²ˢ)⁻⁴; 4 loops winding twice; objects kept distinct; jumps to link-zeta card and Triples tower", () => {
    const s = $id("borroWorked").textContent;
    return s.includes("1, 4, 10, 20, 35, 56, 84, 120, 165")
      && s.includes("✓ equal, coefficient by coefficient")
      && s.includes("C(n+3,3) = (n+1)(n+2)(n+3)/6")
      && s.includes("4 loops, each winding twice")
      && s.includes("(1 − t²)⁻⁴") && s.includes("(1 − 937⁻²ˢ)⁻⁴")
      && s.includes("Keep them apart — different objects:")
      && s.includes("fixed points of the monodromy on H₁") && s.includes("loop-orbits among the 8 sheets")
      && !!$q('#borroWorked .jump[onclick*="zxBorro"]')
      && !!$q('#borroWorked .jump[onclick*="tripleCoverHasse"]');
  });

  // R6 G4: worked 4-linked zetas (session B)
  t("R6-G4a pure: N4(F2) order rule brute-forced over all 64 elements; χ-case sets — (0,0,0):{1,2}, (0,1,0):{2}, (1,0,0)/(0,0,1)/(1,0,1):{2,4}, (1,1,0)/(0,1,1)/(1,1,1):{4}", () => {
    if (n4RuleCheck() !== 64) return false;
    const want = { "0,0,0": "1,2", "1,0,0": "2,4", "0,1,0": "2", "1,1,0": "4", "0,0,1": "2,4", "1,0,1": "2,4", "0,1,1": "4", "1,1,1": "4" };
    return n4ChiCases().every(({ c1, c2, c3, orders }) => want[[c1, c2, c3].join(",")] === orders.join(","));
  });
  t("DOM R6-G4a: 449 card — rule OK line; 8 honest χ-case rows ('needs the r-entries' where computed multi-valued); worked branch tracks live symbols (R4-S3/R3-S2); no-Euler-product clause", () => {
    const s = $id("quad449Worked").textContent;
    if (!s.includes("rule checked over all 64 elements: OK")) return false;
    const rows = [...$qa("#n4CasesTable tr")].slice(1);
    if (rows.length !== 8) return false;
    if (!(rows[0].textContent.includes("1 or 2 — needs the r- and corner entries")
      && rows[1].textContent.includes("2 or 4 — needs the r-entries") && rows[1].textContent.includes("r₂₃₄")
      && rows[2].textContent.includes("2 — whatever the r-entries")
      && rows[4].textContent.includes("2 or 4 — needs the r-entries") && rows[4].textContent.includes("r₁₂₃")
      && rows[5].textContent.includes("r₂₃₄ ⊕ r₁₂₃")
      && rows[3].textContent.includes("4 — regardless") && rows[7].textContent.includes("4 — regardless"))) return false;
    const w = quad449Ord();
    const branchOK = w === 2 ? s.includes("32 orbits of size 2") && s.includes("(1 − 449⁻²ˢ)⁻³²") && s.includes("−1 → corner q = 1")
      : w === 1 ? s.includes("64 orbits of size 1") && s.includes("(1 − 449⁻ˢ)⁻⁶⁴")
      : s.includes("no corner, no order, no Euler factor asserted") && !s.includes("449⁻");
    return branchOK && s.includes("not computable from this app's data");
  });
  t("R6-G4b pure: μ̄(1234) = 1 via Magnus of [[x₁,x₂],x₃]; corner matrix of N₄(F₂) has order 2 by literal powering; 64/2 = 32", () => {
    const mu = computeMagnusTripleCommutator()["1,2,3"] || 0;
    return mu === 1 && matOrderF2(n4Matrix(0, 0, 0, 0, 0, 1)) === 2
      && 64 / matOrderF2(n4Matrix(0, 0, 0, 0, 0, 1)) === 32;
  });
  t("DOM R6-G4b: B4 card — μ̄(1234) = 1 live; 32 loops of double length + (1 − t²)⁻³²; Milnor-model label + citations; 449-twin clause tracks live symbols; Quads tower jump; lesson", () => {
    const s = $id("b4Worked").textContent;
    const w = quad449Ord();
    const twinOK = w === 2 ? s.includes("(1 − 449⁻²ˢ)⁻³²")
      : w === 1 ? s.includes("no inert twin") : s.includes("not asserted this run");
    return s.includes("μ̄(1234) = 1") && s.includes("32 loops of double length") && s.includes("(1 − t²)⁻³²")
      && s.includes("Milnor-model level") && s.includes("Milnor 1957") && s.includes("Morishita ch. 8") && s.includes("Amano 2014")
      && twinOK && !!$q('#b4Worked .jump[onclick*="quadCoverTower"]')
      && $q("#zxB4 .zx-lesson").textContent.includes("the 64-sheet cover hears it");
  });

  // R6 G5: stitches (session B)
  t("DOM R6-G5: Ladder sentence + surface-ladder jump; capstone gallery clause appended (R4-T6/R5-K4 pins intact); Dictionary γ ↔ α row, both cells tooltipped", () => {
    const L = $id("ladderSurfaceStitch");
    const z = $id("zetaThread").textContent;
    const row = [...$qa("#tab-dict table.dict tr")].find(r => r.textContent.includes("γ = Σ₁ ∩ Σ₂"));
    return !!L && L.textContent.includes("climbs this ladder with surfaces in hand")
      && !!$q('#ladderSurfaceStitch .jump[onclick*="surfaceLadder"]')
      && z.includes("keep the dials apart: linking at t = 1, knotting in the spectrum")
      && z.includes("Worked examples below, each with its lesson")
      && z.includes("computing zeta functions all along")
      && !!row && row.textContent.includes("Rédei element") && row.textContent.includes("exists since (p₁/p₂) = +1")
      && !!row.querySelector("td.t [data-tip]") && !!row.querySelector("td.a [data-tip]");
  });

  t("STATE: the Pairs panels agree with the pair on screen — at load, and now", () => {
    // The sync note asserts the drawing is deliberately NOT synced to the pair. That
    // is licensed for exactly one reason: both primes usable and both ≡ 3 (mod 4).
    // Any other time it is on screen, it has outlived the pair it describes.
    const noteLicensed = (p, q) => {
      if (p === null || q === null) return false;
      const usable = isPrimeSmall(p) && isPrimeSmall(q) && p !== q && p !== 2n && q !== 2n;
      return usable && p % 4n === 3n && q % 4n === 3n;
    };
    // At load the app seeds (5, 29) — both ≡ 1 (mod 4) — so neither note is licensed.
    if (noteLicensed(5n, 29n)) return false;           // guards the premise itself
    if (PAIRS_AT_LOAD.sync !== "") return false;
    if (PAIRS_AT_LOAD.stale !== "") return false;
    if (!PAIRS_AT_LOAD.banner.includes("unlinked")) return false;
    // And right now, whatever has been clicked since.
    if (pairsComputed.p === null) return true;
    const noteShown = $id("pairsSyncNote").textContent.trim() !== "";
    if (noteShown !== noteLicensed(pairsComputed.p, pairsComputed.q)) return false;
    const boxesMatch = parseIntegerInput($id("pInput").value) === pairsComputed.p
      && parseIntegerInput($id("qInput").value) === pairsComputed.q;
    return ($id("pairsStale").textContent.trim() !== "") === !boxesMatch;
  });

  t("Fox–Weber: |H₁| of the trefoil's branched covers, two independent ways, and the gcd law", () => {
    // Route 1: literal 2x2 integer matrix powering, then det(A^n - I). This never
    // touches the trace recurrence the renderer uses.
    const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]],
                           [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    const A = [[1, -1], [1, 0]];
    const byMatrix = n => { let M = [[1, 0], [0, 1]]; for (let k = 0; k < n; k++) M = mul(M, A);
      return Math.abs((M[0][0] - 1) * (M[1][1] - 1) - M[0][1] * M[1][0]); };
    // Route 2: Fox–Weber as stated — the product of Δ over the n-th roots of unity,
    // in complex floating point, which shares no arithmetic with either integer route.
    const byRoots = n => {
      let re = 1, im = 0;
      for (let j = 0; j < n; j++) {
        const th = 2 * Math.PI * j / n, c = Math.cos(th), sN = Math.sin(th);
        // Δ(z) = z² − z + 1 at z = e^{iθ}
        const dr = Math.cos(2 * th) - c + 1, di = Math.sin(2 * th) - sN;
        [re, im] = [re * dr - im * di, re * di + im * dr];
      }
      return Math.hypot(re, im);
    };
    const rows = coversData();
    if (rows.length < 8) return false;
    for (const r of rows) {
      if (byMatrix(r.n) !== r.ord) return false;                    // integer route agrees
      if (Math.abs(byRoots(r.n) - r.ord) > 1e-6) return false;      // Fox–Weber agrees
      if ((r.ord === 1) !== (gcdInt(r.n, 6) === 1)) return false;   // the gcd law
    }
    // and the table on screen shows those orders
    const shown = $id("coversTable").textContent;
    return rows.every(r => shown.includes(r.infinite ? "∞" : String(r.ord)))
      && shown.includes("Poincaré") && $id("coversNote").textContent.includes("✓");
  });

  t("DOM: no tooltip carries markup — data-tip renders as plain text via content: attr()", () => {
    // .tt::after uses content: attr(data-tip), so any <i>/<b>/<sub> inside the
    // attribute is printed literally on screen. Five tooltips shipped that way
    // before this check existed.
    const withMarkup = [...$qa("[data-tip]")]
      .filter(e => /<\/?[a-zA-Z][^>]*>/.test(e.getAttribute("data-tip") || ""));
    return $qa("[data-tip]").length > 100 && withMarkup.length === 0;
  });

  t("DOM: Iwasawa's growth-formula theorem cites the 1959 paper, both places, and no 1956 misattribution survives", () => {
    // The 1956 Hamburg note is a real, different Iwasawa result (q^e-divisibility for
    // non-Galois degree-q fields) -- it must not appear attached to the lambda=mu=0 claim.
    const tip = [...$qa("[data-tip]")].map(e => e.getAttribute("data-tip")).find(v => (v || "").includes("the unknotted case"));
    const qa11 = ($id("qaList") || document.body).textContent;
    return !!tip && tip.includes("Iwasawa's theorem (1959)") && tip.includes("Bull. Amer. Math. Soc. 65 (1959)")
      && !tip.includes("(1956)")
      && qa11.includes("Iwasawa's theorem (1959) forces") && !qa11.includes("Iwasawa's theorem (1956)");
  });

  t("DOM: no possessive named-result attribution lacks a year/venue citation (the Turaev-regulator class of error)", () => {
    // Every real named theorem/construction in the app carries a year or venue right beside it.
    // A possessive named attribution with no nearby digit is exactly the pattern the fabricated
    // regulator name once had. Scoped to <main>, not <body>: <script> is a child of <body>, so
    // body.textContent would pick up this very source file's own comments. And textContent, not
    // innerText -- this claim lives inside a closed <details> card, and innerText returns empty
    // for collapsed content, which would make the check pass vacuously. The banned phrase is
    // split across two string literals so this comment cannot trip the check on itself.
    const scope = ($q("main") || document.body).textContent;
    const banned = ["Turaev", "s Alexander regulator"].join("'");
    return !scope.includes(banned)
      && [...$qa("[data-tip]")].every(e => !(e.getAttribute("data-tip") || "").includes(banned));
  });

  t("DOM: the mod-2-only cross-reference points at the Q&A item that actually makes the claim", () => {
    const tip = [...$qa("[data-tip]")].find(e => (e.getAttribute("data-tip") || "").includes("mismatch first bites"));
    const qa6 = ($id("qaList") || document.body).textContent;
    // Q&A #6 must actually state both halves of what the tooltip claims it "collects".
    return !!tip && tip.getAttribute("data-tip").includes("Q&A #6 collects both")
      && !tip.getAttribute("data-tip").includes("fracture (4) collects both")
      && /lk.{0,20}∈.{0,3}Z|lk is an integer|Everything in this app is mod 2/.test(qa6);
  });

  t("DOM: every Morishita chapter-8/9-12/12 citation names its edition, and the boundary-link definition credits Smythe", () => {
    // These chapter numbers are correct for the 1st edition and off by one against the 2024
    // 2nd edition (a new ch. 7 shifts everything after it) -- every site making one of these
    // citations must say which edition, not leave it ambiguous.
    const scope = ($q("main") || document.body).innerHTML;
    const chapterSites = [
      "Morishita ch. 8, 1st ed.", "Morishita (chs. 4/8, 1st ed.)", "Morishita chs. 4/8, 1st ed.",
      "Morishita ch. 12, 1st ed.", "Morishita, Knots and Primes, ch. 9–12, 1st ed.",
      "Morishita, Knots and Primes, chs. 9–12, 1st ed.",
    ];
    const editionsStated = chapterSites.filter(s2 => scope.includes(s2)).length;
    const noBareChapterCite = !/Morishita,? (ch\.|chs\.) (8|9|12|4\/8|9–12)(?!,)/.test(scope.replace(/1st ed\./g, ""));
    return editionsStated >= 6
      && scope.includes("boundary link when its components bound pairwise-disjoint Seifert surfaces (the term is Smythe's, 1966)")
      && noBareChapterCite;
  });

  t("DOM KaTeX: .tt-katex degrades to a plain .tt (no upgrade, no new DOM) when KaTeX is unavailable", () => {
    // The honesty guarantee is structural, not a separate fallback code path: without
    // .katex-on, none of the .tt-katex CSS rules apply and the element renders exactly
    // like a plain .tt off its untouched data-tip, via content: attr() as always.
    const saved = window.katex;
    const probe = $el("span");
    probe.className = "tt tt-katex";
    probe.setAttribute("data-tip", "plain fallback text");
    probe.setAttribute("data-latex-html", "plain fallback text <span class='katex-frag' data-latex='x'>x</span>");
    probe.style.cssText = "position:absolute;left:-9999px;";
    try {
      window.katex = undefined;
      document.body.appendChild(probe);
      ttKatexUpgrade();
      return !probe.classList.contains("katex-on") && probe.children.length === 0;
    } finally {
      probe.remove();
      window.katex = saved;
    }
  });

  t("DOM KaTeX: all converted tooltips render real typeset math when KaTeX loads (Fox's formula, Iwasawa polynomial, both Euler's-criterion sites, unipotent order, cyclotomic tower)", () => {
    if (typeof katex === "undefined") return true; // network-dependent; only assert what actually loaded
    const pilots = [...$qa(".tt-katex")];
    return pilots.length === 6
      && pilots.every(el => el.classList.contains("katex-on"))
      && pilots.every(el => el.querySelector(".tt-bubble .katex"));
  });

  t("DOM KaTeX: converted tooltips keep their exact plain-text data-tip fallback unchanged", () => {
    const pilots = [...$qa(".tt-katex")];
    const tips = pilots.map(el => el.getAttribute("data-tip") || "");
    return pilots.length === 6
      && tips.some(v => v.includes("|H1(Mn)| = |Res(Delta(t), t^n - 1)|"))
      && tips.some(v => v.includes("Λ = Z_p[[T]]"))
      && tips.filter(v => v.includes("a^((p−1)/2) mod p") || v.includes("p₁^((p₂−1)/2) mod p₂")).length === 2
      && tips.some(v => v.includes("2^(n(n−1)/2)"))
      && tips.some(v => v.includes("Q(ζ_p) ⊂ Q(ζ_{p²}) ⊂ Q(ζ_{p³})"));
  });

  t("DOM KaTeX: every .tt-katex data-latex-html carries at least one well-formed katex-frag with LaTeX source", () => {
    const pilots = [...$qa(".tt-katex")];
    return pilots.length === 6 && pilots.every(el => {
      const html = el.getAttribute("data-latex-html") || "";
      const tmp = $el("div");
      tmp.innerHTML = html;
      const frags = [...tmp.querySelectorAll(".katex-frag")];
      return frags.length >= 1 && frags.every(f => (f.getAttribute("data-latex") || "").length > 0);
    });
  });

  const list = $id("testList");
  list.innerHTML = "";
  for (const r of results) {
    const li = $el("li");
    li.className = r.ok ? "pass" : "fail";
    li.textContent = (r.ok ? "✔ " : "✘ ") + r.name;
    list.appendChild(li);
  }
  const panel = $id("testsPanel");
  panel.classList.add("open");
  const allPass = results.every(r => r.ok);
  const domN = results.filter(r => r.name.startsWith("DOM ")).length; // Klein D2: two species, said so
  const split = `(${results.length - domN} computational, ${domN} rendered-text pins)`;
  $id("runTestsBtn").textContent = allPass
    ? `Self-tests: ${results.length}/${results.length} passed ${split}`
    : `Self-tests: ${results.filter(r => r.ok).length}/${results.length} passed ${split} — see failures`;
}
