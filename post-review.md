# Peer Review — POST-MAN (after 2 protocol rounds)

Artifact: `index.html` at commit `0d720db` (24 MAN concessions + 2 budget passes after tag `man-r0`).
Instrument: byte-identical to the baseline review — same six lenses, same rubric, same 3-skeptic
adversarial verification. 60 agents, 3.57M tokens.

## Scores

| Dimension | Score /10 |
|---|---|
| arithmetic-rigor | 8 |
| topology-rigor | 8 |
| pedagogy | 6.5 |
| code-quality | 6.5 |
| ux-accessibility | 4.5 |
| completeness | 7 |
| **mean** | **6.75** |

### Score rationales (abridged)

**arithmetic-rigor — 8.** Exceptionally careful work: every live computation I could check independently is correct. Euler's criterion, Tonelli-Shanks (brute-forced on 609 cases incl. p=65537), the Redei procedure with normalization enforcement, [13,61,937] = -1, Amano's quadruple (all pairwise and triple symbols +1, quadruple -1 with conjugates {182,340,159,317}), the Hilbert 2-adic factor and product formula (verified for all odd prime pairs < 200), the mod-4 reciprocity trichotomy, the Dedekind zeta faces (converging to zeta(2)L(2,chi5) = 1.1616712 = closed form), the fig-8 Lefschetz/Artin-Mazur zeta bookkeeping inc…

**topology-rigor — 8.** This is an unusually rigorous artifact, and it survives hostile refereeing almost everywhere. I verified (by independent computation, not just re-running its code): all displayed Legendre/Tonelli–Shanks/Rédei/Amano numerics, including the exploit certificates the self-tests reject; the Hilbert-symbol local factors and the 2-adic sign bookkeeping in all four mod-4 classes; the 3D arc figure is exactly right (the flat disks {x²+y²≤1, z=0} and {(x−1)²+z²≤1, y=0} meet in precisely the segment (0,0,0)–(1,0,0), with the endpoints on K₂ and K₁ and the piercing points labeled with the correct lk(K₁,K₂…

**pedagogy — 6.5.** This is far above the median teaching artifact in analogy pedagogy: the two-column parallel genuinely teaches rather than juxtaposes (every Triples/Quads step carries a live "↔ arithmetic:"/"↔ topology:" mirror line, lines 1405/1534; the reciprocity proof is aligned entry-by-entry in a two-column table, lines 378-386; "Triples step 4, one level up" pointers, line 1994), worked examples precede generalities on Pairs/Triples/Quads, presets sync both columns (lines 1118-1127), honesty notes are exemplary (lines 478, 521), punchlines are early on 5 of 6 tabs, and all 41 self-tests pass with no con…

**code-quality — 6.5.** The computational core is genuinely excellent: every headline number I re-derived independently (separate Jacobi implementation, Tonelli-Shanks root verification, Magnus coefficients, diagram crossing counts, fig-8 zeta identities, and zeta_{Q(sqrt5)}(2) against the closed form zeta(2)*4pi^2/(25*sqrt5)) checks out, the O(n^2) crossing detection is computed once and cached (b4wCache), input parsing is strict and tested, and the self-test suite includes unusually good adversarial cases (unnormalized Redei certificates, twisted theta exploits, the two-tier q=107 domain test). But the artifact con…

**ux-accessibility — 4.5.** Real accessibility craftsmanship is visible in places — every tooltip term is made keyboard-focusable and touch-pinnable (lines 881–897), canvases scale responsively with aspect ratio preserved (verified empirically: no distortion, no page overflow), focus outlines are never suppressed, landmarks (header/nav/main/footer) are used, the p/q inputs have real labels, and most canvas states are mirrored in DOM text. But the artifact contains not a single ARIA attribute: all four primary canvas diagrams and both SVG field lattices have no text alternative (WCAG 1.1.1), the tab interface has no tab s…

**completeness — 7.** The honesty discipline is close to exemplary: I independently recomputed every headline displayed number (all Legendre/Rédei/quadruple symbols, Tonelli-Shanks roots, conjugate values, Lucas/Fibonacci data, zeta faces) and they all check out; the full script runs without errors and all 41 self-tests pass; cited-vs-computed labeling (Milnor's Wirtinger word, Amano's 2-adic normalization, the Brunnian property, Freedman-Skora) is applied carefully; convention pitfalls (mod-4 domain, mu-bar sign, H1-only vs alternating Lefschetz zeta, corner-datum vs Redei-symbol domains) are stated and even self-…

## Confirmed findings (17 entries; the a(19)=0 defect appears 5×, once per lens — 13 unique)

- **[critical] [arithmetic-rigor]** C:\Users\seand\claude_prime\index.html:532 — Tooltip asserts a(19) = 0 for the ideal-count function of Q(sqrt5); the true value is a(19) = 2 — a mathematically false displayed claim. *(votes 3/3)*
- **[critical] [topology-rigor]** index.html line 532 (Zeta tab, ideal-sum tooltip) — Mathematically false displayed claim: the tooltip asserts a(19) = 0 for the ideal-count function of Q(√5); in fact a(19) = 2. *(votes 3/3)*
- **[critical] [pedagogy]** index.html line 532 (Zeta tab, ideal-sum tooltip) — Mathematically false claim: the tooltip asserts a(19) = 0, but 19 splits in Q(√5) and a(19) = 2. *(votes 3/3)*
- **[major] [pedagogy]** index.html lines 308, 394, 450, 547, 1972, 2007 — Systemic: essential theory is hover-gated in tooltips that visible text cites as if they were sections; nothing anchors, prints, or skims. *(votes 3/3)*
- **[major] [pedagogy]** index.html lines 2271-2272 and 2278-2283 vs lines 580, 2318-2319 — The static Ladder matrix tooltips label slots inconsistently with the app's own live Frobenius demo; no single evaluation makes the labels correct. *(votes 3/3)*
- **[major] [pedagogy]** index.html lines 1931-1936, 1951-1961 vs 2277-2284, 556, 596 — Unexplained mismatch: the Quadruples tab computes six pairwise and four triple symbols, but the N₄ matrix offers only three χ slots and two r slots. *(votes 2/3)*
- **[major] [pedagogy]** index.html lines 297-322, especially rows 308-311 and guidance at line 321 — The Dictionary — the densest, least-teachable page — is the entry tab, with reading guidance buried at the bottom and four rows unreadable until tabs 5-6. *(votes 3/3)*
- **[critical] [code-quality]** C:\Users\seand\claude_prime\index.html line 532 — Mathematically false displayed claim: tooltip asserts a(19) = 0 for the ideal-count function of Q(sqrt(5)); the correct value is a(19) = 2. *(votes 3/3)*
- **[major] [code-quality]** C:\Users\seand\claude_prime\index.html lines 2388-2630 (suite), 1077 vs 2469-2481, 2189-2196 vs 2518-2533 — Self-test suite tests only pure functions, never any rendered DOM output, and twice tests a duplicated copy of a production formula instead of the production code path. *(votes 3/3)*
- **[major] [code-quality]** C:\Users\seand\claude_prime\index.html lines 1519-1523 (loop), 1456-1466 (toggle), 1508-1517 (listeners) — The three.js render loop runs at full frame rate forever once the 3D view has been opened, even after the view is hidden or another in-app tab is selected; the renderer is never paused or disposed. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:330 (also 366, 407, 464; SVGs at 435, 485) — All four canvas diagrams and both SVG lattices have no text alternative of any kind (no role, aria-label, or fallback content) — WCAG 1.1.1 failure on the app's primary figures. *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:285-292 (handler 903-910) — The tab interface is plain buttons with no tablist/tab/tabpanel roles, no aria-selected, no aria-controls, and no arrow-key navigation; the selected tab is conveyed only by a CSS class — WCAG 4.1.2 name/role/value failur *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:315, 536, 580, 2357 (.jump spans); 421 + 1467-1470 (#fsTooltip) — Interactive spans with onclick handlers — the three cross-tab .jump links, the generated .jump in the Frobenius explainer, and the 'Why ellipses, not circles?' reveal — have no tabindex, role, or key handler and are comp *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:250-269 (CSS), 881-897 (JS) — The 67 data-tip tooltips — which carry a large share of the artifact's mathematical exposition — are rendered purely as CSS ::after attr(data-tip) content: unreliably exposed to screen readers, not dismissable with Escap *(votes 3/3)*
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:1647 (color), 118 (canvas background), 1848-1850 (label) — The yellow component K2 (#c9a500) of the 4-component Brunnian diagram renders at 2.33:1 against the #fdfdfb canvas — failing WCAG 1.4.11 non-text contrast (3:1) for the stroke and failing text contrast (4.5:1) badly for  *(votes 3/3)*
- **[critical] [completeness]** C:\Users\seand\claude_prime\index.html line 532 — False displayed value: tooltip claims a(19) = 0 for the ideal count of Q(sqrt(5)); the correct value is 2, and the app's own dedekindValues() computes 2. *(votes 3/3)*
- **[major] [completeness]** C:\Users\seand\claude_prime\index.html lines 2271-2284 vs lines 580, 2315-2326 — Ladder tab: the static N3/N4 matrix tooltips and the live rho(Frob_q) panel assign different meanings to the same matrix slot using the same notation, with no reconciliation. *(votes 3/3)*

## Rejected by verification (1)

- [pedagogy] The Rédei symbol — the central object of the Triples tab — is never defined in visible text anywhere in the app. *(votes 0/3)*

## Unverified minor findings (47)

- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:428 — The triple-point-count formula for mu-bar(123) is attributed to Milnor; the geometric surface-intersection formula is due to Cochran and Mellor–Melvin.
- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:1960 — Full permutation invariance of the Redei symbol is credited as 'Proved by Rédei (1939)'; the modern literature regards Rédei's proof as incomplete, completed by Corsman a
- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:302 — The Spec Z tooltip's 'étale cohomological dimension 3, by Artin–Verdier duality' is only true away from the prime 2 — the very prime the whole app's arithmetic lives at.
- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:1909 — fmtCoef renders Magnus coefficients as bare signs, silently assuming magnitude 1; correct for the values actually computed but would misdisplay any other value.
- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:627-634 — legendre()'s advertised guard ('p not an odd prime') is only partially enforced: legendre(5n,2n) returns +1 and legendre(1n,9n) returns +1 silently.
- [arithmetic-rigor] C:\Users\seand\claude_prime\index.html:683-703 — redeiSymbol() never checks that p1, p2, q are prime, so with composite arguments it could return an undefined 'symbol' instead of throwing.
- [topology-rigor] index.html line 428 (Triples tab, whyMu why-box) — The triple-point formula for μ̄(123) is attributed to Milnor and asserted "independent of all choices" without citing the actual provenance or the general-position caveat
- [topology-rigor] index.html line 476 (Quadruples tab, b4WordNote) — The claim that setting xᵢ = 1 in ℓ₄ = [[x₁,x₂],x₃] certifies "every 3-sublink trivial" overreaches: it cannot cover the sublink obtained by deleting K₄ itself.
- [pedagogy] index.html lines 1416, 1424, 1441 (Triples); definition only at line 463 (Quads tooltip) — Commutator notation [x₁,x₂] and "commutator subgroup [F,F]" are used on the Triples tab before any definition; the aba⁻¹b⁻¹ gloss appears one tab later.
- [pedagogy] index.html line 314 vs lines 677-690 and 432 — "On the arithmetic side well-definedness is automatic" overclaims: one tab later the app itself shows arithmetic well-definedness at the triple level is NOT automatic (Ré
- [pedagogy] index.html line 499; partial visible correction at line 503 — The Zeta tab's first displayed formula uses L(hⁿ) whose definition — and whose deliberate deviation from the standard Lefschetz number — lives only in a tooltip.
- [pedagogy] index.html line 406 (contrast lines 459, 494, 556) — The Triples tab has no opening thesis statement; its punchline appears only in the closing caption strip.
- [pedagogy] index.html line 580 — The Ladder's definedness-domain explanation is a ~250-word wall of text placed before the interactive demo it qualifies.
- [pedagogy] index.html lines 2253, 2021, 2026 (contrast .tt convention, lines 251-269) — The Ladder matrices and both Hasse-tower SVGs hide explanations behind native title attributes with no visual affordance, inconsistent with the app's dotted-underline too
- [pedagogy] index.html lines 1099-1109 vs 1110-1127 — Manual "Compute" leaves the two Pairs columns free to contradict each other; only the presets sync the topology panel.
- [pedagogy] index.html line 524 — Heading "The zeta of an actual arithmetic link: ζ of Q(√5)" misapplies the dictionary's own correspondence — Q(√5) is a field (covering-space side), not a set of primes.
- [pedagogy] index.html line 502 (qualifier only in tooltip; honesty note at line 521) — The orbit-product face displays the torus-specific factor (1−t)² under the general heading "Product over periodic orbits (h pseudo-Anosov)".
- [pedagogy] index.html line 1958 (bridge stated only at line 580) — "Triple Rédei symbols — all vanish (+1)" uses additive vanishing language for the multiplicative value +1 before the ±1 ↔ F₂ identification has been given.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 1866-1876 — Deleting K1 (green) renders a malformed sentence: '...signed crossings: lk(K2,K3) = 0, lk(K2,K4) = 0, lk(K3,K4) = 0;  = ∅ - every pair unlinked.'
- [code-quality] C:\Users\seand\claude_prime\index.html lines 2636-2653 — The init pipeline has no error isolation: one exception in any of the 15 sequential render calls silently blanks every subsequent panel.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 967-974 vs 976-995 — The Unlinked/Hopf toggle does not cancel a running lift animation, producing transiently inconsistent state and note text.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 1295-1302 (and 1229) — Pulse animation speed is frame-rate dependent, and the static unlinked arc figure is redrawn at full frame rate while the Pairs tab is visible.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 608-609 and throughout the script — Roughly 60 top-level function declarations leak onto window; only gotoTab is intentionally exported.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 1763, 757-773, 1062-1064 — Dead code: an unused 'pair' variable with a no-op replace, ellipse-support parameters (sx/sy/phase) no caller ever sets, and an unreachable 'ramifies' banner branch.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 627-634, 683-703 — API-level robustness gaps: legendre() silently returns +1 for modulus 2, and redeiSymbol() never checks that its three primes are actually prime.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 118 and 420 — Responsive layout defects below 420px: canvas aspect-ratio distortion and a fixed-width 3D container that overflows.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 1447-1453 — three.js is loaded from the CDN without a Subresource Integrity hash, and unconditionally at startup although the 3D view is optional.
- [code-quality] C:\Users\seand\claude_prime\index.html lines 1906-1909 (and 1424) — Magnus-series display renders signs only, silently assuming every coefficient is exactly +/-1.
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:1317 (K3 orange), 1349-1353 and 955-958 (13px canva — Additional canvas contrast shortfalls: the orange Borromean ring #e67e22 measures 2.80:1 (below the 3:1 non-text minimum), and the 13px canvas text labels in sea-green (#
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:1356-1358 — The isolate-mode caption drawn on the Borromean canvas ('K.. faded — the remaining pair is visibly unlinked...') is 12px italic #bbb on #fdfdfb — 1.89:1, far below any te
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:2255 (matrix zeros #c8c4b8), 233 (.coef-cell.zero # — Deliberately de-emphasized values fall to unreadable contrast: unipotent-matrix zeros at 1.74:1, ∆_Bor zero coefficients at 1.92:1, and the 'lit' cell highlight at 1.09:1
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:1647 (B4W_COLORS), 1315-1317 (Borromean colors) — Colorblind-safety of the link diagrams is only partially engineered: the green #009900 / yellow #c9a500 pair — which meet at the B4 diagram's pedagogically central commut
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:528 (slider), 467-472 (deleteSelect), 563/569 (arro — Several controls have no accessible name: the Dedekind N range slider is programmatically unlabeled (the 'N = 2000' span at 529 is not associated), the delete-ring select
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:354, 434, 484, 589-592, 602-604 — No aria-live regions anywhere: results computed on demand — the Legendre banner, warnings, the Frobenius matrix and explainer, and the self-test pass/fail list — update s
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:70-71 (tab-panel display:none); no @media print any — No print stylesheet exists: printing captures only the currently active tab (the other five panels are display:none), with the tab strip, buttons, sliders, and the self-t
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:1229-1233, 1295-1302 (pulse loop); 71-72 (fade) — The arc figure's orange pulse animates continuously via an unconditional requestAnimationFrame loop with no pause control and no prefers-reduced-motion handling — a WCAG 
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:420 (fixed 420px container), 1508-1517 (mouse-only  — The optional 3D Borromean view is doubly limited: its container is a hard inline width:420px (the one element that escapes the otherwise-correct responsive treatment, ove
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:2253 (buildMat title), 2266-2284 (level tooltips) — The ladder matrices' explanatory tooltips (what χ, r, and μ̄ mean at each level) are delivered via the title attribute on non-focusable <td> cells — reachable only by mou
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:348-350, 586-587 (inputs); 1099-1109, 2366-2376 (cl — Pressing Enter in the p/q or Frobenius q number inputs does nothing — the inputs are not in a <form> and no key handler exists, so keyboard users must Tab to the Compute 
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:297 (Dictionary panel), 110/360/388/439/514/541/578 — Heading hierarchy is weak for AT navigation: tab panels have no headings of their own (the Dictionary tab has none at all), the true section titles ('Symmetry: one propos
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:955-958, 1236-1250, 1845-1853 (13px/11px canvas tex — Canvas-drawn labels are set at 11-13px in the 420px-wide coordinate system; when canvases scale down responsively (verified to ~276px at phone width) the effective text s
- [completeness] C:\Users\seand\claude_prime\index.html lines 443-446, 867-873, 2461-2465 — The Delta_Bor 'expanding live' demo pre-substitutes by hand, making the computation and its self-test near-tautological, and the polynomial itself is a cited input that i
- [completeness] C:\Users\seand\claude_prime\index.html lines 2590-2593 and 1797-1799 — Self-test name 'all six pairwise lk === 0 (computed from redrawn crossings)' overstates: the GR and GB zeros are hardcoded constants in b4wComputeLk's return, not compute
- [completeness] C:\Users\seand\claude_prime\index.html line 314 vs lines 677-702 and 432 — Dictionary note 'on the arithmetic side well-definedness is automatic' is unscoped and in tension with the Triples/Quads tabs' central point that Redei normalization is l
- [completeness] C:\Users\seand\claude_prime\index.html lines 282 and 459 — The artifact self-describes as 'A teaching companion to the papers' but never identifies the papers - no titles, authors, or links anywhere in the page.
- [completeness] C:\Users\seand\claude_prime\index.html lines 2518-2533 vs 2187-2196 — The 'Q(sqrt5): chi pattern / a(n) values' self-test re-implements the ideal-count recurrence inline instead of exercising dedekindValues, so it tests a copy of the logic 
- [completeness] C:\Users\seand\claude_prime\index.html line 1906 — The Magnus box hardcodes the '+ X1X2X3' leading term of the displayed expansion instead of rendering its computed coefficient, and fmtCoef prints signs without magnitudes