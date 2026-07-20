# MAN Protocol Round 3 — Amended Run Report

Amendments in force (from the rounds-1/2 comparison): (1) third critic owning accessibility;
(2) closing Master diff-skim of the round's own edits; (3) DOM-test mandate for every concession
touching displayed text; (4) Novice global-tooltip-load lens. Budget raised to 168 KiB for this
round only (ARIA + DOM tests are structural machinery). Execution: 9 agents, 1.34M tokens, ~143 min,
22 commits. Result: 20 findings, 20 concessions, 0 defends, 0 defers. Final artifact: 172,030 bytes
(2 under budget), 59/59 self-tests green (41 -> 59; 18 new DOM-level tests), tag man-r3.

## Amendment outcomes

- **A11y critic (amendment 1):** 6 findings, 6 fixes — the axis untouched by three prior instruments:
  tooltip corpus AT-perceivable + keyboard-operable (shared live-region readout, Enter/Space/Escape),
  programmatic tab semantics, state-synced canvas text alternatives, live regions on all results,
  real-button jump links + arrow-key 3D rotation, contrast floors (1.9:1 -> 4.54:1).
- **Diff-skim (amendment 2): caught 2 introduced defects on its first outing** — a state-false
  aria-label written by the a11y phase itself, and a state-fragile DOM test written by the rigor
  phase. Both the exact class that produced a(19)=0 last round; both repaired in-round (R3-S1, R3-S2).
- **DOM-test mandate (amendment 3):** 20/20 concessions carried DOM assertions; suite 41 -> 59.
- **Tooltip-load lens (amendment 4):** the Novice's 6 findings were promotion demands (f_S why-box,
  Mazur's 'why a prime is a knot', the Redei symbol's defining rule, L(h^n), certificate-independence,
  deg-32 argument) — the systemic tooltip-gating regression of rounds 1-2 directly reversed.

## Ledger (round 3)

| ID | Source | Issue (abridged) | Status |
|---|---|---|---|
| R3-M1 | Master | The f_S tooltip's 'unramified outside S' silently omits the archimedean convention; under the literal reading the displayed Z/4 x Z/4 is wrong (totall | LOCKED |
| R3-M2 | Master | The Main Conjecture is cited as 'Mazur–Wiles' without the parity hypothesis; Mazur–Wiles 1984 covers odd p, while l = 2 — the only prime the artifact  | LOCKED |
| R3-M3 | Master | The Redei-reciprocity tooltip flatly credits full S3-invariance to 'Proved by Rédei (1939)', a provenance the modern literature does not support, and  | LOCKED |
| R3-M4 | Master | The orbit-product face prints '(h pseudo-Anosov)' as the hypothesis for (1−t)²·ζ_h = ∏(1 − t^{/γ/})⁻¹, but B = −A is Anosov and violates the equality  | LOCKED |
| R3-M5 | Master | b4WordNote quantifies 'delete ANY component — set that xᵢ = 1' over a case (K₄) with no xᵢ, and promotes the longitude's collapse in a free-group quot | LOCKED |
| R3-M6 | Master | The displayed Magnus formula asserts four ±1 coefficients plus degree-3 completeness, but the suite pins only two coefficients and fmtCoef prints sign | LOCKED |
| R3-N1 | Novice | The app's most-cited theorem-like statement (the f_S finite-deck-group asymmetry) lives only in a 1,115-char hover tooltip that four tabs cite as if i | LOCKED |
| R3-N2 | Novice | The Quadruples banner's 4-ary bracket rests on well-definedness (the identity does not pin theta down; total positivity rejects opposite-verdict explo | LOCKED |
| R3-N3 | Novice | The Zeta tab's first displayed equation uses L(h^n) with its definition only inside a 592-char tooltip, leaving no visible bridge to the demo table's  | LOCKED |
| R3-N4 | Novice | The app's premise 'primes behave like knots' is never justified in visible text; Mazur's observation (Gal(F_p) = Z-hat = profinite pi_1(S^1), Spec Z 3 | LOCKED |
| R3-N5 | Novice | The Triples tab computes the Redei symbol step by step but never visibly states its defining rule (+1 iff q splits completely in the Redei field); the | LOCKED |
| R3-N6 | Novice | Load-bearing explanations sit in zero-affordance hover surfaces: the 'why deg 32 not 64' argument only in an SVG <title>, and the Ladder matrix cell m | LOCKED |
| R3-A1 | A11y | The ~80-definition tooltip corpus is CSS-pseudo-element-only (invisible to the accessibility tree), and pinning/scrolling is click-only — no keydown h | LOCKED |
| R3-A2 | A11y | The six-tab structure exists only as a CSS class on plain buttons — no tablist/tab/tabpanel roles, no aria-selected, no aria-controls, so activation i | LOCKED |
| R3-A3 | A11y | Five canvases carrying the topological half of the app expose no role, no aria-label, and no fallback content — a screen reader renders the left colum | LOCKED |
| R3-A4 | A11y | Every interactive computation writes results and validation errors into unfocused divs with no live-region semantics anywhere in the file, so a screen | LOCKED |
| R3-A5 | A11y | Cross-tab jump links and the ellipse-explanation toggle are click-only spans, the 3D view rotates only by mouse drag, and the delete-select and Dedeki | LOCKED |
| R3-A6 | A11y | The load-bearing vanished entries render at 1.7-1.9:1 (#bbb, #c8c4b8), in-canvas captions at 1.6-1.9:1, and the dotted #999 underline — the sole affor | LOCKED |
| R3-S1 | Skim | arcCanvas aria-label was set once at init to the linked-branch text (disks meeting in the segment) while the default state is unlinked, so AT users he | LOCKED |
| R3-S2 | Skim | The R3-M5 DOM self-test pinned b4WordNote's live textContent to B4W_HOME_TEXT unconditionally, so clicking 'Delete ring' (a first-class control that l | LOCKED |

## Resolutions (full)

### R3-M1 (Master)

**Issue.** The f_S tooltip's 'unramified outside S' silently omits the archimedean convention; under the literal reading the displayed Z/4 x Z/4 is wrong (totally real tower is Z/4 x Z/2), contradicting the line-314 orientability credo.

**Resolution.** index.html line ~308: tooltip now reads 'unramified outside S ∪ {∞}' and adds the l = 2 caveat — complex conjugation lands on (2,2), the totally real tower is the strictly smaller Z/4 × Z/2, and p ≡ 1 (mod 4) tames ∞ for Q(√p) only, not up the tower. Line ~314 credo scoped to 'in the quadratic resolvents' with a pointer to the stated convention. Amendment 3: new DOM self-test 'DOM: f_S tooltip states the archimedean convention...' asserts via querySelectorAll('#tab-dict [data-tip]') that the rendered data-tip contains both 'unramified outside S ∪ {∞}' and 'Z/4 × Z/2'. (e6e23e5)

### R3-M2 (Master)

**Issue.** The Main Conjecture is cited as 'Mazur–Wiles' without the parity hypothesis; Mazur–Wiles 1984 covers odd p, while l = 2 — the only prime the artifact computes with — is Greither (Ann. Inst. Fourier 42, 1992).

**Resolution.** index.html line ~547: inline text now 'f ≐ L_p (Mazur–Wiles; ℓ = 2 by Greither)'; tooltip now ends 'Proven over Q by Mazur–Wiles for odd ℓ; the case ℓ = 2 — the one prime every computation in this app instantiates — is Greither (1992).' Amendment 3: new DOM self-test 'DOM: Main Conjecture attribution carries the parity hypothesis...' locates the Iwasawa poly-demo in #tab-zeta and asserts the rendered inline text contains 'Mazur–Wiles; ℓ = 2 by Greither' and the data-tip contains 'Greither (1992)' and 'odd ℓ'. (85ea2b2)

### R3-M3 (Master)

**Issue.** The Redei-reciprocity tooltip flatly credits full S3-invariance to 'Proved by Rédei (1939)', a provenance the modern literature does not support, and 'all permutations' outruns the single live transposition shown.

**Resolution.** index.html renderQuadSteps step 2b (line ~1975): tooltip now reads 'Stated by Rédei (1939), but his symmetry argument is regarded as incomplete; the first complete proofs are modern (Corsman 2007; Stevenhagen), and mod 2 it also follows from Morishita's μ̄-identification (2004), the Triples tab's citation. The computation here exhibits one transposition instance live, not all of S₃.' Amendment 3: new DOM self-test 'DOM: Redei reciprocity tooltip (rendered in #quadSteps)...' asserts the JS-rendered data-tip contains 'Stated by Rédei (1939)', 'Corsman 2007', 'Stevenhagen', 'Morishita', and 'one transposition instance' (renderQuadSteps runs before runSelfTests in init, so the DOM is populated). (68abc27)

### R3-M4 (Master)

**Issue.** The orbit-product face prints '(h pseudo-Anosov)' as the hypothesis for (1−t)²·ζ_h = ∏(1 − t^{|γ|})⁻¹, but B = −A is Anosov and violates the equality at t¹; the sufficient hypothesis is Anosov on closed T² with positive eigenvalues, and the punctured fiber F itself fails the (1−t)² bookkeeping.

**Resolution.** index.html line ~502: fname now 'Product over periodic orbits (h Anosov on the closed torus, both eigenvalues positive — the demo's bookkeeping)'; the tooltip keeps the pseudo-Anosov pedagogy but states that pA alone does NOT suffice, gives the index-−1 mechanism (orientations of both foliations preserved), and carries the −A counterexample with the diverging sequences 5,5,20,45 vs −5,5,−20,45 and the H₂(F) = 0 punctured-fiber point. Line ~503: orbit-product clause now reads 'under the same closed-torus, positive-eigenvalue bookkeeping as the face above'. Amendment 3: new DOM self-test 'DOM: orbit-product face states its sufficient hypothesis...' asserts the rendered fname text contains 'Anosov on the closed torus, both eigenvalues positive' and the data-tip contains '−A is Anosov' and 'index is +1'. (554089c)

### R3-M5 (Master)

**Issue.** b4WordNote quantifies 'delete ANY component — set that xᵢ = 1' over a case (K₄) with no xᵢ, and promotes the longitude's collapse in a free-group quotient to geometric sublink triviality — the algebra-to-geometry inference the artifact rejects elsewhere.

**Resolution.** index.html line ~476: note now reads 'Delete K₁, K₂, or K₃ — algebraically, set that xᵢ = 1 — ... collapses to 1: the algebraic shadow of the deletion — it says the Milnor data vanish, while the sublinks' actual triviality (every 3-sublink, every pair) is the model's construction, as the honesty note below says of the drawing. Deleting K₄ is different: ℓ₄ is K₄'s own longitude, so there is no x₄ to set — the word leaves with its component. Yet the four together are inseparable.' Line ~1901: added const B4W_HOME_TEXT captured at load; restore handler now assigns it. Amendment 3: new DOM self-test 'DOM: b4WordNote quantifies over K1..K3 only...' asserts the rendered text contains the K₁/K₂/K₃ quantifier, 'algebraic shadow', 'Milnor data vanish', 'model's construction', 'no x₄ to set', does NOT contain 'Delete ANY component', and that B4W_HOME_TEXT equals the rendered text. Delete-K4-then-Restore round-trip additionally exercised in the browser: exact text restored. (b870984)

### R3-M6 (Master)

**Issue.** The displayed Magnus formula asserts four ±1 coefficients plus degree-3 completeness, but the suite pins only two coefficients and fmtCoef prints sign without magnitude — a regression could render a false formula while the suite stays green.

**Resolution.** index.html self-test suite: added test 'Magnus display fully pinned: deg<=3 support is exactly {1, +X1X2X3, -X2X1X3, -X3X1X2, +X3X2X1}, each |c| = 1; rendered magnusBox text matches' — checks s[''] === 1, the four coefficients strictly equal to +1/−1/−1/+1, that the set of keys of degree ≤ 3 is exactly the five allowed words, and that document.getElementById('magnusBox').textContent contains '↦ 1 + X₁X₂X₃ − X₂X₁X₃ − X₃X₁X₂ + X₃X₂X₁ + (deg ≥ 4)' and 'μ̄(1234) = 1'. (cf54543)

### R3-N1 (Novice)

**Issue.** The app's most-cited theorem-like statement (the f_S finite-deck-group asymmetry) lives only in a 1,115-char hover tooltip that four tabs cite as if it were a bibliography anchor, clips above the viewport, and cannot be scrolled; the Redei normalization conditions behind the visible 'normalized' checkmark are hover-only.

**Resolution.** Why-box #whyFS added under the Dictionary table; line-314 small-note clause now cites it; citations at the Pairs poly-demo tooltip, Triples poly-demo, and Zeta Main-Conjecture demo retargeted to 'the f_S why-box under the Dictionary table'; visible line at Quadruples step 2: '"normalized" = Redei's three conditions on (x,y,z): gcd(x,y,z) = 1, y even, x - y = 1 (mod 4)...'; CSS .tt.tt-open::after made scrollable and .tt-below flip rules added; click handler flips pinned tips below when el.getBoundingClientRect().top < 340; header hint added. Self-test added per amendment 3: 'DOM R3-N1: f_S asymmetry visible in the whyFS box; quad step 2 states Redei's normalization conditions' - asserts via DOM query that #whyFS renders 'unramified outside S ∪ {∞}', 'eᵢ = v_ℓ(pᵢ − 1)', 'Z/4 × Z/4', 'Z/4 × Z/2', and that #quadSteps renders the three conditions. (e3539ec)

### R3-N2 (Novice)

**Issue.** The Quadruples banner's 4-ary bracket rests on well-definedness (the identity does not pin theta down; total positivity rejects opposite-verdict exploits) that exists only in the theta and bracket tooltips, while the visible page stages a positivity check it never justifies and self-tests reference exploits the page never mentions.

**Resolution.** Appended to quad step 3 body: 'Why check positivity? The identity alone does not pin θ down: other solutions of X² − 101Z² = α pass it yet certify the opposite verdict — exhibited and rejected in the self-tests. Total positivity (with Amano's 2-adic normalization, cited not computed) excludes them; that is what makes the bracket below a function of the four primes alone (Amano's independence theorem).' Self-test added per amendment 3: 'DOM R3-N2: quad step 3 visibly justifies the positivity check (identity does not pin theta; Amano independence)' - asserts the rendered #quadSteps text contains 'does not pin θ down', 'opposite', and 'Amano's independence theorem'. (e3d50cc)

### R3-N3 (Novice)

**Issue.** The Zeta tab's first displayed equation uses L(h^n) with its definition only inside a 592-char tooltip, leaving no visible bridge to the demo table's tr(A^n) column; the (1-t)^2 factor's meaning is hover-only despite the demo below stating it plainly.

**Resolution.** Sum-over-iterates face now reads '... L(hⁿ)·tⁿ/n ), where L(hⁿ) := tr(hⁿ∗ on H₁) — the demo's tr(Aⁿ); sign convention in the tooltip'; orbit-product face formula now carries '(why (1−t)²? the H₀/H₂ bookkeeping — see the coefficient check in the demo below)'. Self-test added per amendment 3: 'DOM R3-N3: iterate face defines L(h^n) visibly (= tr on H1 = tr(A^n)); orbit face cross-references the (1-t)^2 check' - locates both .zeta-face elements by rendered text and asserts the new clauses. (88a0cab)

### R3-N4 (Novice)

**Issue.** The app's premise 'primes behave like knots' is never justified in visible text; Mazur's observation (Gal(F_p) = Z-hat = profinite pi_1(S^1), Spec Z 3-dimensional by Artin-Verdier, circle in a 3-space = knot) hides in a tooltip on the jargon term 'Spec Z' that a novice has no reason to hover.

**Resolution.** Added why-toggle 'Why are primes like knots at all? (Mazur's observation)' and why-box #whyKnots under the Dictionary intro: 'Each prime is secretly a circle: the Galois group of the finite field F_p is Ẑ — exactly the profinite fundamental group of the circle S¹ — so Spec F_p is a circle in disguise. And the space it sits in, Spec Z, behaves 3-dimensionally (étale cohomological dimension 3, by Artin–Verdier duality). A circle inside a 3-space is a knot — Mazur's observation, and the reason the table below is a dictionary rather than a coincidence.' Self-test added per amendment 3: 'DOM R3-N4: whyKnots box justifies the premise visibly' - asserts the rendered box text. (64dc531)

### R3-N5 (Novice)

**Issue.** The Triples tab computes the Redei symbol step by step but never visibly states its defining rule (+1 iff q splits completely in the Redei field); the reader must reverse-engineer the value from correlating step 4 with the banner, and the Quadruples tab repeats the pattern at step 5.

**Resolution.** Triples .sub now reads '...computed live. The value rule: [p₁, p₂, q] = +1 if q splits completely in the Rédei field k_{p₁,p₂}, −1 if not (steps 3–4 decide which).'; quad step 5 body appends '(value rule, one level up from Triples: +1 = splits completely, −1 = not)'. Self-test added per amendment 3: 'DOM R3-N5: Redei value rule visible on Triples (+1 iff q splits completely) and echoed at quad step 5' - asserts the rendered #tab-triples .col.arith .sub and #quadSteps texts. (2989503)

### R3-N6 (Novice)

**Issue.** Load-bearing explanations sit in zero-affordance hover surfaces: the 'why deg 32 not 64' argument only in an SVG <title>, and the Ladder matrix cell meanings (which triples N4 tracks) only in bare title attributes - no underline, no cursor, no keyboard path, no discoverability.

**Resolution.** Tower small-note now ends: 'Why deg 32, not 8·8 = 64? The octics intersect exactly in Q(√8081) — their other quadratic subfields differ, and a D₄ octic has no cyclic quartic subfield — so 8·8/2 = 32.'; deg-32 SVG <title> removed; deg-64 <title> tail shortened to '(twisted certificates generate different K's: step 3)'; buildMat now does td.classList.add("tt"); td.setAttribute("data-tip", tip) instead of td.title = tip. Self-test added per amendment 3: 'DOM R3-N6: Ladder cell tips use the .tt affordance, no bare titles; why deg 32 is visible text' - asserts #matN4 td[data-pos='0,2'] has class tt, tabindex 0, the data-tip text, no title attribute, zero table.mat td[title] elements remain, and a #tab-quads .small-note renders '8·8/2 = 32'. (7cec499)

### R3-A1 (A11y)

**Issue.** The ~80-definition tooltip corpus is CSS-pseudo-element-only (invisible to the accessibility tree), and pinning/scrolling is click-only — no keydown handler, no role, no expanded state, no Escape dismissal.

**Resolution.** ttFocusable() now also sets role=button and aria-expanded=false on every .tt; new ttSet/ttCloseAll/ttAnnounce path shared by click, Enter/Space (document keydown, preventDefault on Space), and Escape-closes-all; a focusin listener plus every pin copies data-tip into a new visually-hidden aria-live div #ttReadout and points aria-describedby at it, making tip text real DOM content; header hint extended to name the keys ('Enter/Space pins too, Esc closes'); tt-below flip logic preserved verbatim. Self-test 'DOM R3-A1' pins role/tabindex/aria-expanded, the Enter-pin (tt-open + readout equals data-tip + describedby), Escape close, and the header text. (eed2842)

### R3-A2 (A11y)

**Issue.** The six-tab structure exists only as a CSS class on plain buttons — no tablist/tab/tabpanel roles, no aria-selected, no aria-controls, so activation is imperceptible non-visually.

**Resolution.** At init the nav gets role=tablist and each button gets id=tabbtn-<name>, role=tab, aria-controls=tab-<name>, aria-selected synced to .active; each section gets role=tabpanel + aria-labelledby; the click handler flips aria-selected alongside the class (wiring merged into the existing forEach to save bytes). Self-test 'DOM R3-A2' asserts the full role/controls/labelledby wiring, exactly one aria-selected=true, and that it flips on a synthetic activation — written state-independently (captures the current tab, switches away, switches back) so the suite stays green from any tab. (6fe5389)

### R3-A3 (A11y)

**Issue.** Five canvases carrying the topological half of the app expose no role, no aria-label, and no fallback content — a screen reader renders the left columns as nothing — and the arc pulse animates indefinitely with no reduced-motion gate.

**Resolution.** Init loop sets role=img on pairsCanvas/arcCanvas/borroCanvas/b4Canvas with static labels for arc and borro; renderPairs and renderB4 set state-tracking labels (Hopf/unlinked; which ring is deleted) deferring to the adjacent live text; initBorro3D labels the WebGL canvas role=img; new REDUCED_MOTION matchMedia gate skips the pulse draw and the animation loop under prefers-reduced-motion (direct renders still draw the static figure). Self-test 'DOM R3-A3' asserts role=img + nonempty labels on all four ids and that pairs/b4 labels match current pairsState.linked/b4wDeleted. To fund the bytes, the b4w path data was mechanically re-encoded (same numbers, same order, array form) — verified by the existing crossing-count (4/4/4/2/0/0) and lk-zero self-tests plus a painted-pixel check. (5319147)

### R3-A4 (A11y)

**Issue.** Every interactive computation writes results and validation errors into unfocused divs with no live-region semantics anywhere in the file, so a screen-reader user hears silence after Compute.

**Resolution.** aria-live=polite added to #pairsBanner, #hilbertNote, #pairsLiftNote, #b4WordNote, #ladderNote, #frobExplain and the .euler-vals wrapper around the three Dedekind values; role=alert on #pairsWarn and #frobWarn. Self-test 'DOM R3-A4' asserts every one of those attributes by id (shared ga() helper introduced for the a11y tests). (a77c920)

### R3-A5 (A11y)

**Issue.** Cross-tab jump links and the ellipse-explanation toggle are click-only spans, the 3D view rotates only by mouse drag, and the delete-select and Dedekind slider have no accessible name.

**Resolution.** All four .jump spans (including the generated Triples-tab jump) and #fsTooltip converted to <button type="button"> with a CSS reset rule preserving the existing styling; fsTooltip gains aria-expanded/aria-controls synced in its handler; aria-label="component to delete" on #deleteSelect and aria-label="summation limit N" on #dedekindN; #borro3dContainer becomes focusable (tabIndex=0, aria-label) with ArrowLeft/Right/Up/Down mapped to the same group.rotation increments as drag; note text now reads 'Drag or arrow keys to rotate.' Self-test 'DOM R3-A5' asserts button-ness of all jumps and fsTooltip, the aria-expanded round-trip on a double toggle, both accessible names, and the arrow-keys note text (3D handler itself is CDN-gated so it is exercised only behaviorally, not in the suite). (d375097)

### R3-A6 (A11y)

**Issue.** The load-bearing vanished entries render at 1.7-1.9:1 (#bbb, #c8c4b8), in-canvas captions at 1.6-1.9:1, and the dotted #999 underline — the sole affordance marking definition-bearing terms — at ~2.8:1.

**Resolution.** #bbb -> #767676 in .coef-cell.zero; dotted #999 -> #767676 on .tt; #c8c4b8 -> #767676 in buildMat and all three frobMatrix zero cells; canvas caption fillStyle #bbb -> #666 (Borromean fade note) and #ccc -> #666 (deleted-ring labels). Self-test 'DOM R3-A6' asserts getComputedStyle color rgb(118,118,118) on a rendered .coef-cell.zero, the #matN3 below-diagonal zero, the live #frobMatrix zero (guarded for the empty-matrix error state), and borderBottomColor on .tt. (d8f8adc)

### R3-S1 (Skim)

**Issue.** arcCanvas aria-label was set once at init to the linked-branch text (disks meeting in the segment) while the default state is unlinked, so AT users heard the exact negation of the visible caption 'Σ₁ ∩ Σ₂ = ∅', and the R3-A3 self-test only asserted label length for arcCanvas, staying green over the false rendered assertion.

**Resolution.** Init loop entry for arcCanvas blanked (role=img kept); ARC_TEXT gained per-mode label fields (linked: 'Two spanning disks meeting in the segment Σ1∩Σ2; argument in the caption and note beside.', unlinked: 'Two spanning disks pulled apart, so Σ1∩Σ2 = ∅; caption and note beside.'); renderArcFigure's mode-change block now does arcCanvas.setAttribute('aria-label', ARC_TEXT[mode].label). Amendment 3: the 'DOM R3-A3' self-test extended with ga('arcCanvas','aria-label').includes(pairsState.linked ? 'meeting in the segment' : 'pulled apart'), the same state-conditioned form as the pairs/b4 clauses. Browser-verified: label flips with the toggle in both directions, matches the adjacent caption in both states, 59/59 green both ways. Funded by comment-only trims (arc-figure comments, lk/crossing comments, lattice comment). (2fd6554)

### R3-S2 (Skim)

**Issue.** The R3-M5 DOM self-test pinned b4WordNote's live textContent to B4W_HOME_TEXT unconditionally, so clicking 'Delete ring' (a first-class control that legitimately rewrites the node) then re-running the suite produced a false FAIL with zero defects present, violating the 'suite remains green and honest' invariant that R3-A3's state-conditioned tests respected.

**Resolution.** Test rewritten: const s = B4W_HOME_TEXT; all six M5 content clauses (K₁/K₂/K₃ quantifier, algebraic shadow, Milnor data vanish, model's construction, no x₄, no 'Delete ANY component') assert the constant; then const was = b4wDeleted; restoreBtn.click(); assert b4wDeleted === null && b4WordNote.textContent === s; if (was) deleteBtn.click() to restore the user's state. Test name updated to '(state-robust); Restore exercised live'. Browser-verified: 59/59 green at load, after Delete K3 + re-run (previously FAIL), state preserved through the run (b4wDeleted still 'R', delete text intact), green after Restore, and green in the mixed linked+deleted stress case; negative controls confirm a tampered home text and a wrong restore render still fail. Funded by comment-only micro-trims (Redei certificate, theta, tooltip-pin, arrowhead, Magnus, tablist, path-format comments). (667f2b6)
