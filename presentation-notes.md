# Presentation notes — Klein's notebook

**Standing rule: the app (`index.html`) is FROZEN. None of the items below is to be implemented until these notes have been reviewed and prioritized with the author.** This file is the only deliverable that changes; the deck (`presentation/knots-primes-presentation.pdf`) records how the talk runs against the app as it stands today.

---

## A. Mathematics notes (what the professor wrote down)

- **A1 — Module structure on screen.** The two load-bearing theorems (Milnor–Turaev τ ≐ Δ; Main Conjecture f_Λ ≐ L_p) are statements about *modules* — H₁ of the infinite cyclic cover over Z[t, t⁻¹], the Iwasawa module over Λ = Z_p[[T]]. The app shows the polynomials and names the modules in tooltips; a topologist wants at least one **presentation matrix** displayed on each side (the Wirtinger/Alexander matrix for a small link; the corresponding Λ-presentation, even schematically). This was Klein's principal request in the dialogue.
- **A2 — One computed surface picture.** All rung figures are (honestly labeled) schematics. Build one *computed* figure from the app's own data: from the drawn Borromean crossings, construct Seifert surface data numerically and exhibit γ = Σ₁ ∩ Σ₂ as computed output rather than cartoon. ("Computed numbers, cartoon geometry" is the current honest state; close the gap once, visibly.)
- **A3 — The five-component rung.** Keep the closing problem exactly as staged: topology ready (Magnus truncates at degree 5; deck group N₅(F₂), order 1024), arithmetic missing its quintuple independence theorem (the analogue of Amano's normalization). This is the thesis-problem slide; do not soften it.
- **A4 — Chebotarev, quantitatively.** The Ladder tab demonstrates instances; a small running tally (of user-entered primes, sorted by conjugacy class, against the predicted densities 1/8, 1/8, …) would make the "primes equidistribute like closed orbits" claim quantitative without pretending a browser proves a density theorem.
- **A5 — Test-suite hygiene (bug, fix when unfrozen).** The new Q&A DOM self-test asserts all Q&A items are closed **at run time**, violating the app's own state-robust standard (R3-S2): open any item, press *Run self-tests*, and the suite reads 100/101. Rewrite the assertion against state captured at load (as ZX_AT_LOAD does), or make it state-conditional.

## B. Legibility notes (for future presentations of the app)

- **B1 — Trim superfluous framing (author's directive).** Example named by the author: the Q&A intro paragraph ("The professor takes the chair…") is scene-setting that should compress to one working sentence. Sweep for the same register elsewhere: capstone flourishes, repeated "the jewel" framing, multi-clause hooks in card summaries. The rule of thumb for the next pass: every sentence either states mathematics, states provenance, or points somewhere — cut the rest.
- **B2 — Triples side-by-side aesthetics (author's directive).** The two rails drift out of balance: rung 2's arithmetic cell is half-empty against a full topology cell (visible in `presentation/img/12-rung2.png`); higher up, the topology and arithmetic columns lose vertical alignment as content grows. Future layout: a strict row grid where each topological cell and its arithmetic mirror share a row (and height), so the eye reads mirror-pairs horizontally at every scroll position.
- **B3 — Long-scroll tabs.** Triples now stacks columns → verdict banners → two towers → surface ladder → polynomial strip. In a live talk the presenter scrolls a lot; consider an in-tab mini-nav (sticky, four anchors) on Triples and Zeta.
- **B4 — Tooltips don't project.** Hover content is invisible to a seminar audience unless the presenter pins it. Consider a "presentation mode" that (a) enlarges base font, (b) allows pin-all-in-section, or (c) renders a chosen tooltip as a footnote strip under the section while presenting.
- **B5 — Card-opening choreography.** The minimized gallery reads well solo but requires the presenter to remember which cards to open and in what order. The deck now records the order; a URL-hash convention (e.g. `#open=zxK1361`) would let a presenter deep-link each beat with one click.
- **B6 — Self-tests are the closing move.** The suite lives at the footer; in a talk it is the last proof-of-honesty beat. A keyboard shortcut (e.g. `t`) to run-and-scroll would make the closing beat one keystroke.
- **B7 — Projected-size floors.** Some SVG captions sit at 9–10 px (tower edge labels, rung annotations). Fine at reading distance; at projector distance they vanish. Presentation mode should bump in-figure text ~25%.

## C. Recorded during capture (state of evidence)

- Deck images shot at 2× device scale from the app at commit `31ff3b7` + presentation assets; suite green **101/101** in the captured run (`presentation/img/36-selftests.png`, `_passline.txt`).
- The two dialogue criticisms (A1, A2) and the author's two directives (B1, B2) are the head of the queue when the freeze lifts.
