# Peer Review — BASELINE (pre-MAN protocol)

Artifact: `baseline-index.html` (snapshot at tag `man-r0`). Instrument: 6 independent reviewer lenses
(arithmetic rigor, topology rigor, pedagogy, code quality, UX/accessibility, completeness), each producing
a 0–10 score against publication standard plus located findings; every critical/major finding then
adversarially verified by 3 independent skeptics (confirmed = ≥2/3 votes). 66 agents, 3.53M tokens.

## Scores

| Dimension | Score /10 |
|---|---|
| arithmetic-rigor | 7 |
| topology-rigor | 7 |
| pedagogy | 7 |
| code-quality | 6.5 |
| ux-accessibility | 5 |
| completeness | 6.5 |
| **mean** | **6.50** |

### Score rationales (abridged)

**arithmetic-rigor — 7.** The core arithmetic is genuinely airtight — a rarity. I re-implemented and fuzz-tested every number-theory routine in C:\Users\seand\claude_prime\index.html against independent references in Node: Tonelli-Shanks passes 466 brute-force square-root cases over 23 primes including hard 2-adic cases (257, 449, 12289, 65537); Euler's criterion is correct on its intended domain (a=0 -> 0, prime modulus -> +/-1, composite modulus almost always throws); every displayed Legendre symbol, both Redei conclusions ([13,61,937] = -1; Amano's [5,8081,101,449] = -1 with all five triple symbols +1) were reconfir…

**topology-rigor — 7.** An unusually rigorous teaching artifact: I independently re-derived or numerically verified essentially every quantitative claim (Fox calculus for Δ_Bor, Magnus coefficients, Rédei/Amano symbols, Hilbert factors, fig-8 traces/orbits, ζ_Q(√5)(2) against an independent reference, the 3D two-disk intersection geometry, and pixel-level over/under fidelity of all three link diagrams against the original AnonMoos SVG), and everything computed is correct; the computed-vs-cited honesty labeling is exemplary. It falls short of the 9+ band because an expert referee does find two substantive items: the Z…

**pedagogy — 7.** This is genuinely strong teaching work, well above "competent": every tab states its punchline early (lines 298, 329/342, 459, 494, 555); worked examples precede generalities everywhere (the (5,29)/(5,13) presets, the (13,61,937) step-by-step Rédei computation, the entry-by-entry arc/product-formula table at lines 378-386 which is the pedagogical high point — the two-column device genuinely aligns rather than juxtaposes, especially via the "↔ arithmetic / ↔ topology" mirror lines inside each Triples step); the honesty notes (lines 478, 495, 520) are exemplary; the math is remarkably careful — …

**code-quality — 6.5.** The mathematical core is genuinely airtight: I extracted every pure function into Node and all 30 self-tests pass; I independently re-verified the Legendre/Tonelli-Shanks/Redei computations, the Magnus coefficients, the fig-8 Lucas/Fibonacci identities, the Dedekind zeta faces, the D4/N4(F2) group-theory claims, and the hard-coded lattice numbers (40405=5*8081, 816181=101*8081) — no mathematically false claim is displayed for any valid input, certificates are checked at runtime and throw loudly when wrong, the O(n^2) crossing detection is computed once and cached, input sanitization is strict …

**ux-accessibility — 5.** Competent but with real gaps (5/10). There is genuine, above-average accessibility effort for a hand-rolled single-file app: semantic landmarks (header/nav/main/footer), real button elements everywhere, inputs wrapped in labels, tooltips made focusable and tap-pinnable (lines 856-876), canvases that scale proportionally via max-width:100%, a 820px single-column breakpoint, default focus outlines left intact, and test results encoded with symbols plus color. However, the screen-reader experience is essentially absent: the file contains not one ARIA attribute, so all four canvases and both SVG l…

**completeness — 6.5.** The artifact's internal-consistency and honest-scoping architecture is unusually strong for a teaching app: all 32 self-tests pass at runtime with accurate names (verified in a live browser), every headline invariant ([13,61,937]=−1, μ̄(123)=1, μ̄(1234)=1, quad symbol −1, Lucas/Fibonacci zeta coefficients, Tonelli–Shanks roots, Rédei identities) is genuinely computed rather than quoted, cited-not-computed claims are mostly labeled with attributions (Amano, Rédei 1939, Freedman–Skora, Mazur–Wiles, Milnor), and the two honesty notes (Brunnian figure at line 478, closed-torus substitution at line…

## Confirmed findings (13) — each survived 3-skeptic adversarial verification

- **[major] [topology-rigor]** index.html lines 1059, 1061 (contradicting 1001 and 1016) — The Hilbert product-formula panel hardcodes 'forces (p/q)(q/p) = 1' and 'The product formula collapses to (p/q)(q/p) = 1' for all inputs — false whenever p ≡ q ≡ 3 (mod 4), a case the UI explicitly supports and correctly describes in the adjacent panel. *(votes 3/3)*
- **[major] [pedagogy]** index.html:298 (Dictionary tab, opening paragraph) — The app's first paragraph mispairs its running examples: "the Hopf link and the pair (5, 29)" — but (5,29) is the split/unlinked example. *(votes 3/3)*
- **[major] [pedagogy]** index.html:1384-1391 (Triples tab, topology steps 3-4) — The Magnus expansion is used as the load-bearing computation before it is ever defined; its definition appears only in a tooltip on the NEXT tab (line 1873). *(votes 3/3)*
- **[major] [pedagogy]** index.html:329, 304, 1371, 1843 (app-wide; sign rule only in code comments at 1332-1334, 1754) — The sign convention for signed crossings/punctures — the app's central topological quantity — is never stated in any student-visible text. *(votes 3/3)*
- **[major] [pedagogy]** index.html:297-322 (Dictionary tab, the landing tab) — The novice's entry point is a dense two-column jargon table whose ~20 load-bearing definitions exist only as hover tooltips, capped by a coda sentence comprehensible only after touring the app — with no signal that this tab is a map to return to. *(votes 2/3)*
- **[major] [code-quality]** index.html:2330-2507 (runSelfTests) — Self-test suite tests only pure functions; the display layer — where the one real bug lives — has zero coverage. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 330, 366, 407, 464 (canvases); 435, 485 (SVGs); 420 (3D container) — No text alternative for any graphical content: all four canvases and both SVG field lattices lack aria-label, role, title, or fallback content. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 285-292 (markup), 882-889 (behavior) — The tab UI is not marked up as tabs: no role=tablist/tab/tabpanel, no aria-selected, no aria-controls, no arrow-key navigation. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 250-269 (CSS), 856-876 (JS), content e.g. 302-311 — The tooltip system's content never reaches assistive technology, and it fails WCAG 1.4.13 (not dismissible with Esc, not hoverable). *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 1614 (palette), 463 (clasp prose), 1807 (draw order) — The 4-component Brunnian diagram's palette is not colorblind-safe: green #009900 vs yellow #c9a500 collapse to near-identical hues under deuteranopia, and green vs red #cc2020 is the classic protan/deutan confusion pair. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 1614 (color), 118 (canvas bg #fdfdfb), 1815-1817 (label) — The yellow K2 stroke (#c9a500 on #fdfdfb) has ~2.3:1 contrast, failing WCAG 1.4.11 non-text contrast (3:1); its 13px canvas text label fails 4.5:1 text contrast. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html lines 315, 535, 2302 (.jump spans); 421 + 1428-1431 (#fsTooltip) — Click-only span controls are unreachable by keyboard: the three .jump cross-tab links and the 'Why ellipses, not circles?' toggle are spans with onclick and no tabindex, role, or key handler (WCAG 2.1.1). *(votes 3/3)*
- **[major] [completeness]** index.html line 298 (Dictionary tab intro), contradicted by lines 1026-1028, 1083-1092, 535 — Framing sentence pairs 'the Hopf link and the pair (5, 29)', but everywhere else in the app (5,29) is the unlinked/split pair and (5,13) is the Hopf pair. *(votes 3/3)*

## Rejected by verification (7) — with an instrument caveat

All seven rejections concern two underlying claims (the Zeta-tab 'three faces agree' phrasing; the
invalid-input fall-through in the Legendre calculator). Both were independently raised by multiple
reviewer lenses, and both were independently discovered and FIXED by the concurrently-running MAN
Masters (commits R1-M3, R1-M5). The 0/3 verification votes here are therefore best read as verifier
false negatives (skeptics primed to refute exaggeration rejected claims whose core was real), not as
evidence the findings were spurious.

- [arithmetic-rigor] index.html:517 (also 2113-2120, honesty note 520, face box 501) — The Zeta tab claims 'All three faces of zeta_h are computed below and shown to agree, coefficient by coefficient', but the computed orbit face is a different power series from the eigenvalue face, and no cross-pair equality holds or is checked. *(votes 0/3)*
- [arithmetic-rigor] index.html:986-1010 (renderLegendreTable), 1026-1030 (banner), 1044-1061 (renderHilbertTable) — Invalid inputs (composite, 1, perfect squares, p=q) fall through after a one-line warning and the app renders authoritative false arithmetic: 'splits in Q(sqrt4)' banners, a 'v = 4' place of Q in the Hilbert table, and a product-formula row showing '-1 x' when the product is actually 0. *(votes 0/3)*
- [topology-rigor] index.html lines 499–502, 517, 520, 2114 (comment 2022–2028) — The Zeta tab presents the naive orbit product ∏_γ(1−t^{|γ|})⁻¹ as a third equal 'face' of ζ_h and claims all three faces are 'shown to agree, coefficient by coefficient' — but the orbit face is a different function, and the app's own displayed numbers prove it. *(votes 0/3)*
- [pedagogy] index.html:987-1031, 1036-1061 (Pairs tab Legendre/Hilbert calculators) — Composite Euler-pseudoprime input renders authoritative output showing the product formula FAILING (red ✗) and a nonsense "splits: unlinked" banner — the opposite of the tab's lesson. *(votes 0/3)*
- [code-quality] index.html:987-992 (renderLegendreTable) — Invalid-input guard falls through: only the p==2/q==2 sub-case returns, so composite or equal inputs render full (false) results beneath the warning. *(votes 0/3)*
- [completeness] index.html line 517 (Zeta tab), display code lines 2096-2121, definitions line 499-501, honesty note line 520 — Claim 'All three faces of ζ_h are computed below and shown to agree, coefficient by coefficient' overstates the demo: it shows two pairwise agreements of two DIFFERENT series, and ζ_h's own orbit face is never computed. *(votes 0/3)*
- [completeness] index.html lines 987-1002 (renderLegendreTable), lines 1044-1050 (renderHilbertTable) — Input validation warns but does not gate rendering: composite or equal inputs still render banners and tables containing mathematically false statements. *(votes 0/3)*

## Unverified minor findings (59)

- [arithmetic-rigor] index.html:432 (Redei-field tooltip) — Tooltip states the Redei field is 'independent of the solution chosen' for x^2 - p1 y^2 - p2 z^2 = 0, omitting Redei's normalization conditions, without which the octic (and hence the symbol) is not well defined.
- [arithmetic-rigor] index.html:450 (also 446, 543) — The general mechanism claim 'the polynomial's leading surviving coefficient is the triple invariant' is loose: the sound general theorem gives mu-bar(123)^2 (Cochran; cf. Murasugi/Traldi), not mu-bar(123); the two coincide here only because mu-bar = 1.
- [arithmetic-rigor] index.html:499 (L(h^n) tooltip) — Tooltip says tr(h^n* on H1) differs from the full alternating fixed-point count 'only by the constant H0-term'; it also differs by an overall sign.
- [arithmetic-rigor] index.html:629 (legendre), 646-647 (tonelliShanks) — Latent library edge cases at p=2: legendre(a,2) silently returns +1 for odd a (exponent (2-1)/2 = 0), and tonelliShanks(n,2) infinite-loops hunting a nonresidue that cannot exist.
- [arithmetic-rigor] index.html:315 — 'the eigenvalue of the flow and the unit of the field are the same number' - literally false: the eigenvalue is phi^2 = 2.618..., the fundamental unit is phi = 1.618...; they are the same number only up to squaring.
- [topology-rigor] index.html line 499 (tooltip), line 502 — The tooltip justifying the L(hⁿ) = tr(hⁿ∗|H₁) convention — 'differs from [the full alternating fixed-point count] only by the constant H₀-term' — silently drops a sign, and 'Milnor's theorem: ζ_h ≐ Δ_K⁻¹' is the reciprocal of Milnor's actual statement.
- [topology-rigor] index.html lines 987–992, 1024–1031, 1059 — Invalid inputs fall through to a fully rendered table: p = q renders 'reciprocity ✓' for 0 = 0, a 'ramifies' banner, and a Hilbert row showing the product formula as '−1 ✗' — displaying a true theorem as failing; composite Euler–Jacobi pseudoprime inputs would render a confident split/inert banner.
- [topology-rigor] index.html lines 446, 1589 (also 543) — 'The single surviving coefficient is μ̄(123) = 1' asserts an on-the-nose equality between two convention-dependent signs; since Δ_L is only defined up to units ±t₁ᵃt₂ᵇt₃ᶜ, the intrinsic statement is only |coefficient| = |μ̄(123)| = 1.
- [topology-rigor] index.html line 428 — The triple-point-count formula for μ̄(123) is attributed '(Milnor)'; the geometric interpretation (signed triple points of Seifert surfaces chosen disjoint from the other components) is due to Cochran and Mellor–Melvin, while Milnor defined μ̄ via the Magnus expansion.
- [topology-rigor] index.html line 1910 — 'Rédei's symbol is invariant under all permutations… Proved by Rédei (1939)' overstates both the history and the topological mirror: full permutation invariance in modern generality is due to Corsman and Stevenhagen, and μ̄(123) is only cyclically invariant (anti-invariant under transpositions) over Z.
- [topology-rigor] index.html lines 1343–1348, 1760–1762 (with 943) — The crossing-sign formula sign = cross(t_over, t_under) is evaluated in canvas coordinates (y down, left-handed frame), so it is the mirror of the standard convention as read off the screen; harmless here only because every displayed signed sum is 0, and the one pinnable nonzero case (the drawn Hopf link) is hedged to 'lk = ±1'.
- [topology-rigor] index.html line 315 (also 538) — 'The eigenvalue of the flow and the unit of the field are the same number' — the eigenvalue is φ² and the fundamental unit is φ; they are not the same number (φ² is a unit, but not the fundamental one, and not φ).
- [topology-rigor] index.html line 1730 — Dead code in b4wCrossings: the variable `pair` is computed and never used, and its chain includes the no-op .replace("GR","GR").
- [pedagogy] index.html:1976, 1981, 2201 (Quadruples tower SVG; Ladder matrices) — Load-bearing explanations are hidden in undiscoverable native tooltips (SVG <title>, td.title) while the app trains users on dotted-underline .tt tooltips.
- [pedagogy] index.html:499 (Zeta tab, sum-over-iterates face) — The convention L(hⁿ) := tr(hⁿ∗|H₁) — without which the three displayed zeta faces are mutually inconsistent — exists only inside a hover tooltip.
- [pedagogy] index.html:304, 342, 1377 (tooltips) — "Meridian" is used inside the definitions of other terms (Frobenius, longitude) but is never defined anywhere in the app.
- [pedagogy] index.html:450 (Triples tab, "What the polynomials say now") — The claim that the Rédei symbol "is the coefficient the Iwasawa polynomial f_S reports" is stated in the same declarative voice as proven theorems, with no hedge or hypotheses.
- [pedagogy] index.html:1377 (longitude tooltip) — Tooltip conflates "exponent sums vanish" with "the word is a commutator": vanishing exponent sums only place the longitude in the commutator subgroup.
- [pedagogy] index.html:1919-1953, 1908 (Quadruples tab, arithmetic steps 3-5) — The quadruple symbol [p₁,p₂,p₃,p₄] is never explicitly defined, the "↔ topology" mirror lines vanish exactly where the parallel is hardest, and the crucial triple-vanishing step is numbered "2b".
- [pedagogy] index.html:506, 531, 535 (Zeta tab, arithmetic column; recipe only in code comment at 2124-2125) — "Ideal" is never defined for an audience with no algebraic number theory, and the ideal-counting recipe generating the displayed "sum over ideals" is never surfaced in student-visible text.
- [pedagogy] index.html:1064-1074 vs 1083-1092 (Pairs tab) — Free-form "Compute" updates only the arithmetic column, leaving a stale topology picture that can silently contradict the banner.
- [pedagogy] index.html:968 (Pairs tab, lift animation note) — "A genuine crossing survives every isotopy" — crossings are diagram artifacts, not isotopy invariants.
- [pedagogy] index.html:476 (Quadruples tab, initial note) — Initial note references "the word collapses to 1" before any group word has been introduced on the tab.
- [pedagogy] index.html:211-212, 2214-2231, 555 (Ladder tab) — The ladder silently repurposes the app's trained color code (blue = topology, red = arithmetic) as blue = pairwise level, red = triple level.
- [pedagogy] index.html:282 (header) and app-wide — "A teaching companion to the papers" — the papers are never identified, and there is no bibliography for any of the name-dropped results.
- [pedagogy] index.html:302 (Spec Z tooltip, Dictionary tab) — First-exposure tooltip escalates to "étale cohomological dimension 3, by Artin–Verdier duality" — far above the stated audience precisely where intuition is needed.
- [code-quality] index.html:1480-1484 (initBorro3D animate) — three.js render loop runs at ~60fps forever once the 3D view is opened, even after it is hidden or the user switches tabs.
- [code-quality] index.html:1260-1267 (arcAnimLoop) with 1137, 1219-1258 — The arc figure is fully redrawn at ~60fps even in the unlinked mode where the image is completely static.
- [code-quality] index.html:1730 (b4wCrossings) — Dead variable `pair` with a nonsensical self-replace, evidence of an abandoned normalization approach.
- [code-quality] index.html:721-752 (drawCircleWithGaps, angleOnCircle) — Dead generality: circle.phase/sx/sy and opts.gapWidth/lineWidth/alpha are supported but never supplied by any caller.
- [code-quality] index.html:607-608 and throughout the script — ~70 top-level bindings in a classic script — every function lands on window; no IIFE or module wrapper.
- [code-quality] index.html:2237-2254 (arrow-btn handler) vs 590, 2292-2295 — Ladder arrow buttons strip the highlight from the live Frobenius matrix because the selector matches every table.mat.
- [code-quality] index.html:946-953, 1075-1082 vs 955-974 (pairs lift animation) — Toggle and preset handlers reset lift state without cancelling an in-flight lift animation, which keeps mutating state and posts a stale note.
- [code-quality] index.html:118 (canvas CSS rule) — canvas { max-width:100% } without height:auto distorts every diagram's aspect ratio on narrow viewports; no devicePixelRatio scaling anywhere.
- [code-quality] index.html:2513-2530 (init chain) — Unguarded init: a single throw in any render step silently aborts everything after it, including the self-tests.
- [code-quality] index.html:1951-1953 (renderQuadSteps banner) — Quadruple-symbol banner falls back to an unexplained "?" and never checks that the four conjugate symbols agree.
- [code-quality] index.html:1550-1570 (renderTripleHasse), 1974-2015 (renderQuadTower) — The two field-lattice SVGs are static strings full of hard-coded displayed numbers, quietly violating the app's own computed-at-runtime principle.
- [code-quality] index.html:963 with 906-911, 330 (lift-apart animation) — "Lift apart" pushes K2 off the right edge of the 420px canvas: cx = 245+140 = 385 with r = 85 reaches x = 470.
- [code-quality] index.html:640-643 (tonelliShanks p ≡ 3 mod 4 shortcut) — The p ≡ 3 (mod 4) fast path is never exercised by the self-test suite, though it is reachable from user input on the Ladder tab.
- [code-quality] index.html:626-633 (legendre) with 614-623 (powmod) — legendre() silently returns +1 for modulus 2 instead of throwing — a latent trap in the file's single most shared utility.
- [code-quality] index.html:409-415, 1295, 1320-1323 (isolate control) — UI says "fade K1/K2/K3" but the isolated ring is removed entirely, not faded.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 2201 (td.title), 2214-2231 (ladder cell tips), 1976 and 1981 (SVG <title>) — Substantive explanations delivered only via hover title attributes: ladder matrix-cell definitions and the quad-tower degree arguments ('Why 32 and not 64...') are mouse-hover-only.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 527-528 (slider), 467 (deleteSelect), 562/568 (arrow buttons) — Several controls lack accessible names: the Dedekind N range slider's label is a disconnected span, deleteSelect has no label, and the ladder arrow buttons are named only by the '➜' glyph.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 2203 (#c8c4b8 zeros), 233 (.coef-cell.zero #bbb), 1321-1323 (canvas #bbb caption) — Meaningful de-emphasized text falls far below contrast minima: matrix zero entries at ~1.7:1, vanished-coefficient cells at ~1.9:1, and the 12px canvas caption 'K faded — the remaining pair is visibly unlinked' at ~1.9:1.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html line 80 (only media query in file); 70 (.tab-panel display:none) — No print consideration at all: only the active tab prints, five-sixths of the app is unprintable per print job, and all tooltip/title-bound definitions are lost on paper.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 354, 434, 484, 588, 603 (result containers); 1064-1074, 2308-2318 (compute handlers) — No live regions: computed results (Legendre banner, Rédei banner, Frobenius matrix, warnings, self-test list) update silently for screen-reader users after pressing Compute or Run self-tests.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 1260-1267 (arcAnimLoop), 1194-1198 (pulse), 71-72 (fade) — No prefers-reduced-motion support: the arc-figure pulse animates indefinitely via requestAnimationFrame with no pause control.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 1470-1478 (mouse-only drag), 420 (fixed 420px container), 1419-1422 (alert dialogs) — The optional 3D Borromean view is mouse-only (no touch or keyboard rotation despite 'Drag to rotate'), its fixed 420px container overflows phone viewports, and load-state feedback uses blocking alert() dialogs.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 360, 388, 439, 513, 540, 577 (.section-head divs); 297 (Dictionary panel); 301 (th without scope) — Heading semantics are incomplete: section titles are styled <div>s rather than headings, the Dictionary panel has no heading at all, and table headers lack scope.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 860-862 (ttFocusable) with ~60+ .tt instances across 302-311, 329, 342, 361, 371, etc. — Tab-stop pollution: every tooltip term is a tabindex=0 stop, so keyboard users must traverse dozens of stops (e.g. ~20 in the Dictionary table alone) to reach actual controls, with no skip link.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 254-256 (fixed 250px width, centered), 1026-1030 and 2290 (generated tips without edge classes) — Tooltips have a fixed 250px width anchored above the term; dynamically generated tooltips never receive the tt-left/tt-right edge-correction classes, so near viewport edges on narrow screens they clip offscreen.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 337/355/427 (why-toggles), 417 (3D toggle), 601+2503-2507 (self-test toggle) — Disclosure controls expose no state: the why-toggle buttons, 3D toggle, and Run self-tests toggle lack aria-expanded/aria-controls.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html lines 934, 1201, 1209, 1315, 1812 (13px/12px/11px canvas text) with 118 (max-width scaling) — Canvas-drawn annotation text (11-13px at native 420px width) shrinks to an effective ~8-9px when the canvas scales down on phones, below comfortable legibility.
- [completeness] index.html lines 2219-2221 (static N₃ tooltips) vs line 579 and lines 2263-2274 (live Frobenius demo), same Ladder tab — Two different slot-assignment conventions for the N₃(F₂) superdiagonal are presented on the same tab with no bridging remark.
- [completeness] index.html line 499 (L(hⁿ) tooltip) — Tooltip claims tr(hⁿ∗ on H₁) 'differs from [the full alternating fixed-point count] only by the constant H₀-term'; it also differs by an overall sign.
- [completeness] index.html lines 1873-1876 (renderMagnus), line 1385 (renderTopoTripleSteps), lines 2073-2074 and 2104 (fig8Data/renderLefschetz), comment line 2028 — Hardcoded fragments inside displays that present themselves as computed: leading '+ X₁X₂X₃' sign, coefficient magnitudes dropped by fmtCoef, and the characteristic polynomial (1−3t+t²) hardcoded rather than derived from FIG8_A.
- [completeness] index.html line 2467 (self-test name) vs line 1766 (b4wComputeLk return) — Self-test 'Brunnian-4loops: all six pairwise lk === 0 (computed from redrawn crossings)' overclaims: lk.GR and lk.GB are hardcoded 0, so two of the six assertions are tautological.
- [completeness] index.html lines 450 (Triples tab arith poly-box), 486, 595, 2014 (Gal(K/Q) ≅ N₄(F₂)) — Two strong cited-not-computed arithmetic claims lack the attribution labels the app otherwise applies diligently, and the arithmetic column never exhibits any concrete Iwasawa polynomial to parallel the live Δ_Bor expansion.
- [completeness] index.html lines 1951-1953 (renderQuadSteps banner logic) — Quad banner fallback conflates 'symbol = +1' with 'symbol ill-defined': allNeg ? '−1' : '?' would display '?' even if all four conjugates were quadratic residues (a well-defined +1).

## Bottom line (baseline)

Mean 6.50/10. The mathematical core is repeatedly described as airtight — reviewers independently
re-verified the number theory and topology and found no false displayed result for valid input. The
deductions concentrate in: (1) an input-validation fall-through that renders false mathematics for
adversarial input; (2) one overclaiming sentence on the Zeta tab; (3) pedagogy-order defects (Magnus
used before defined; sign conventions never taught; a jargon-wall landing tab; one mispaired example
in the opening paragraph); (4) an essentially absent screen-reader/a11y layer; (5) display-layer code
discipline below the standard of the computational core (no DOM-level tests, unguarded init, dead code).