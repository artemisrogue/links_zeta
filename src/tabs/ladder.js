function chebotarevTally(X) { // Klein A4: class-by-class Frobenius counts to cutoff X
  const counts = { id: 0, corner: 0, "10": 0, "01": 0, "11": 0 }; let total = 0;
  for (let q = 3; q < X; q += 2) {
    const bq = BigInt(q);
    if (!isPrimeSmall(bq) || q === 13 || q === 61) continue;
    const f = frobeniusMatrix1361(bq);
    if (f.err) continue;
    const key = (f.chi1 || f.chi2) ? `${f.chi1}${f.chi2}` : (f.r === 0 ? "id" : "corner");
    counts[key]++; total++;
  }
  return { counts, total };
}

function renderChebTally() {
  const t0 = performance.now();
  const { counts, total } = chebotarevTally(3000);
  const ms = (performance.now() - t0).toFixed(0);
  const rows = [
    ["identity (splits completely — like 107)", "id", "1/8", 0.125],
    ["corner r = 1 (the triple level — like 937)", "corner", "1/8", 0.125],
    ["χ = (1,0)", "10", "1/4", 0.25], ["χ = (0,1)", "01", "1/4", 0.25], ["χ = (1,1) — order 4", "11", "1/4", 0.25],
  ];
  $id("chebOut").innerHTML =
    `<table class="symbolic"><tr><th scope="col">class</th><th scope="col">count</th><th scope="col">observed</th><th scope="col">Chebotarev</th></tr>`
    + rows.map(([label, k, pred, pv]) => `<tr><td class="k">${label}</td><td class="v">${counts[k]}</td><td class="v">${(counts[k] / total).toFixed(3)}</td><td class="v">${pred} = ${pv.toFixed(3)}</td></tr>`).join("")
    + `</table><div class="small-note" style="text-align:left;">${total} unramified odd primes &lt; 3000, tallied in ${ms} ms — every row is the Ladder machinery run per prime (Tonelli–Shanks included for the χ = 0 cases). Observed hugs predicted at a finite cutoff; the equidistribution itself is Chebotarev's theorem, cited not proved — the app is the demonstration bench.</div>`;
}


function buildMat(size, cells) {
  const table = $el("table");
  table.className = "mat";
  for (let r = 0; r < size; r++) {
    const tr = $el("tr");
    for (let c = 0; c < size; c++) {
      const td = $el("td");
      const key = `${r},${c}`;
      if (r === c) td.textContent = "1";
      else if (r < c && cells[key]) {
        td.textContent = cells[key].text;
        td.className = cells[key].cls;
        if (cells[key].tip) { td.classList.add("tt"); td.setAttribute("data-tip", cells[key].tip); }
      }
      else { td.textContent = "0"; td.style.color = "#767676"; }
      td.dataset.pos = key;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}


function initLadder() {
  const n2 = buildMat(2, {
    "0,1": { text: "χ", cls: "diag1 lit", tip: "The character / pairwise level: linking number mod 2, Legendre symbol. Always defined." }
  });
  $id("matN2").replaceWith(withId(n2, "matN2"));

  const n3cells = {
    "0,1": { text: "χ₁", cls: "diag1", tip: "Pairwise level: lk(K1,K2) mod 2 / the Legendre symbol (p1/p2)." },
    "1,2": { text: "χ₂", cls: "diag1", tip: "Pairwise level: lk(K2,K3) mod 2 / the Legendre symbol (p2/p3)." },
    "0,2": { text: "r", cls: "corner", tip: "Splitting in the Rédei field; defined when both χ vanish. If q ≡ 1 mod 4: the Rédei symbol ↔ μ̄(123)." },
  };
  $id("matN3").replaceWith(withId(buildMat(3, n3cells), "matN3"));

  const n4cells = {
    "0,1": { text: "χ₁", cls: "diag1", tip: "Pairwise level for the pair (1,2)." },
    "1,2": { text: "χ₂", cls: "diag1", tip: "Pairwise level for the pair (2,3)." },
    "2,3": { text: "χ₃", cls: "diag1", tip: "Pairwise level for the pair (3,4)." },
    "0,2": { text: "r₁₂₃", cls: "diag2", tip: "Triple level for (1,2,3): defined once the χ level vanishes." },
    "1,3": { text: "r₂₃₄", cls: "diag2", tip: "Triple level for (2,3,4): defined once the χ level vanishes." },
    "0,3": { text: "μ̄", cls: "corner", tip: "Quadruple level: μ̄(1234) / the quadruple symbol. Defined only when both triple levels vanish too." },
  };
  $id("matN4").replaceWith(withId(buildMat(4, n4cells), "matN4"));
}

function withId(el, id) {
  // The node being replaced carries accessibility attributes declared in markup;
  // a freshly built table would otherwise drop them on the floor at boot.
  const old = $id(id);
  el.id = id;
  if (old) for (const a of ["aria-label", "role"]) if (old.hasAttribute(a)) el.setAttribute(a, old.getAttribute(a));
  return el;
}


$qa(".arrow-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = btn.dataset.arrow;
    $qa("#matN3 td, #matN4 td").forEach(td => td.classList.remove("lit")); // scoped: N2's chi cell is a PERMANENT marker built at load, not a transient highlight
    const note = $id("ladderNote");
    if (idx === "0") {
      const td = $q("#matN3 td[data-pos='0,2']");
      if (td) td.classList.add("lit");
      note.textContent = "The corner entry r (Rédei/triple level) of N₃ is defined because the previous level's linking numbers vanished.";
    } else {
      ["0,2", "1,3", "0,3"].forEach(pos => {
        const td = $q(`#matN4 td[data-pos='${pos}']`);
        if (td) td.classList.add("lit");
      });
      note.textContent = "The second diagonal (triple levels) and the corner μ̄ (quadruple level) of N₄ are defined because the previous level vanished.";
    }
  });
});


function renderFrobenius(q) {
  const warn = $id("frobWarn");
  const mat = $id("frobMatrix");
  const exp = $id("frobExplain");
  const f = frobeniusMatrix1361(q);
  if (f.err) {
    warn.style.color = "var(--bad)";
    warn.textContent = f.err;
    mat.innerHTML = ""; exp.innerHTML = "";
    return;
  }
  warn.textContent = " ";
  const corner = f.r === null
    ? `<span class="tt" data-tip="With a nonzero superdiagonal, conjugating the matrix changes this entry: it is basis-dependent, i.e. not an invariant of q. It becomes one exactly when χ₁ = χ₂ = 0.">∗</span>`
    : `<b>${f.r}</b>`;
  mat.innerHTML =
    `<tr><td>1</td><td class="diag1${f.chi1 ? " lit" : ""}">${f.chi1}</td><td class="corner${f.r !== null ? " lit" : ""}">${corner}</td></tr>` +
    `<tr><td style="color:#767676">0</td><td>1</td><td class="diag1${f.chi2 ? " lit" : ""}">${f.chi2}</td></tr>` +
    `<tr><td style="color:#767676">0</td><td style="color:#767676">0</td><td>1</td></tr>`;
  let text;
  if (f.r === null) {
    text = `(13/${q}) = ${f.chi1 ? "−1" : "+1"}, (61/${q}) = ${f.chi2 ? "−1" : "+1"}: the pairwise level is already nonzero — q = ${q} is "linked" with ${f.chi1 && f.chi2 ? "both 13 and 61" : f.chi1 ? "13" : "61"}. The corner is <b>not an invariant</b> here (hover the ∗): the ladder stops at the first nonvanishing level.`;
  } else if (f.r === 0) {
    const tail = q % 4n === 1n
      ? ` — q is completely unlinked from the pair, through the triple level: the Rédei symbol [13, 61, ${q}] = +1.`
      : `. (q ≡ 3 mod 4: the splitting datum is well-defined for any odd unramified q, but the symmetric Rédei symbol — the triple <i>linking</i> reading — asks for q ≡ 1 mod 4; see the domain note above.)`;
    text = `(13/${q}) = (61/${q}) = +1, and α = 23 + 6·√13 ≡ 23 + 6·${f.rt} ≡ ${f.v1} (mod ${q}) is a <b>square</b> mod ${q}: q = ${q} splits completely in the degree-8 field k₁₃,₆₁. Frobenius is the <b>identity matrix</b>${tail}`;
  } else {
    const tail = q === 937n ? `This is exactly <button type="button" class="jump" onclick="gotoTab('triples')">the Triples tab's [13, 61, 937] = −1</button>, now wearing its matrix.`
      : q % 4n === 1n ? `q = ${q} is linked to the pair only at the triple level — a Borromean partner: [13, 61, ${q}] = −1.`
      : `q = ${q} does not split completely in k₁₃,₆₁ — an honest fact about one specific field. (q ≡ 3 mod 4: outside the domain of the symmetric Rédei symbol, so no Borromean/μ̄ reading is asserted; see the domain note above.)`;
    text = `(13/${q}) = (61/${q}) = +1 — pairwise invisible — but α ≡ 23 + 6·${f.rt} ≡ ${f.v1} (mod ${q}) is a <b>non-square</b> mod ${q}: the corner lights up. ${tail}`;
  }
  const oA = n3Order(f.chi1, f.chi2, f.r === null ? 0 : f.r), oB = n3Order(f.chi1, f.chi2, f.r === null ? 1 : f.r);
  const ordNote = f.r === null ? ` (<span class="tt" data-tip="Conjugation preserves order, and with χ ≠ 0 both corner values give the same count — computed both ways: ${oA} = ${oB}. Rule, self-tested on all 8 elements: identity iff all vanish; order 4 iff χ₁ = χ₂ = 1; else 2.">why well-defined?</span>)` : "";
  exp.innerHTML = `<div class="step" style="margin:0;">${text}</div>`
    + `<div class="thread" style="margin:8px 0 0;">${TB}ρ(Frob<sub>${q}</sub>) has <b>order ${oA}</b>, computed by powering the matrix${ordNote}: the 8-element cover falls into ${8 / oA} orbit${8 / oA > 1 ? "s" : ""} of length ${oA} — local factor ${localFactor(q, oA, 8)}. These matrices are the deck groups of the covers whose zeta functions the Pairs/Triples/Quadruples boxes compute; the matrix order <i>is</i> the period of q's orbit.</div>`;
  ttFocusable();
}


$id("frobCompute").addEventListener("click", () => {
  const q = parseIntegerInput($id("frobInput").value);
  if (q === null) {
    $id("frobWarn").style.color = "var(--bad)";
    $id("frobWarn").textContent = "Enter a plain decimal integer (no exponents or fractions), at most 9 digits.";
    $id("frobMatrix").innerHTML = "";
    $id("frobExplain").innerHTML = "";
    return;
  }
  renderFrobenius(q);
});

for (const [id, val] of [["frobPreset107", 107], ["frobPreset937", 937], ["frobPreset5", 5], ["frobPreset17", 17], ["frobPreset7", 7]]) {
  $id(id).addEventListener("click", () => {
    $id("frobInput").value = val;
    renderFrobenius(BigInt(val));
  });
}
