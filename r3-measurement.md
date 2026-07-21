# Round-3 Re-measurement — Amended Protocol Verdict

Instrument: the byte-identical pedagogy and ux-accessibility lenses (the two axes that regressed
after rounds 1-2), with the same 3-skeptic verification. 17 agents, 1.0M tokens.

## Score trajectory

| Dimension | Baseline | Post-R2 | Post-R3 (amended) | R3 delta | vs baseline |
|---|---|---|---|---|---|
| pedagogy | 7.0 | 6.5 | **7.5** | +1.0 | +0.5 |
| ux-accessibility | 5.0 | 4.5 | **6.5** | +2.0 | +1.5 |

Both axes the un-amended protocol damaged are now above their baselines. Confirmed majors in these
two dimensions: 10 (incl. 1 critical) after R2 -> 4 after R3. Zero introduced defects survived to
measurement (vs. one critical + one major introduced by rounds 1-2).

## Amendment-by-amendment verdict

1. **Accessibility critic: validated (+2.0).** Six fixes on the axis three prior instruments never
   moved. The two remaining ux majors are instructive: canvas-PAINTED colors failing contrast, and
   hue-only ring differentiation — the critic fixed every DOM color but never audited pixels drawn
   inside canvases. Even an axis-owning critic has a sub-axis blind spot.
2. **Master diff-skim: validated.** Caught two introduced defects in-round (state-false aria-label,
   state-fragile test) — exactly the a(19) class — and the re-measurement confirms nothing
   introduced survived. The tail is no longer unguarded.
3. **DOM-test mandate: validated.** 20/20 concessions carried DOM assertions; suite 41 -> 59, all
   green; the code-quality dimension's structural complaint (pure-function-only tests) is addressed.
4. **Tooltip-load lens: validated (+1.0 pedagogy).** Six promotions reversed the hover-gating
   regression. The two remaining pedagogy majors are the same *disclosure* genus the lens targets
   (crossing-sign rule and Mobius recipe living only in code comments) — instances it missed, not a
   class it missed.

## Remaining confirmed majors (all 3/3)

- **[major] [pedagogy]** index.html lines 1407, 486, 1866 (visible claims); rule only in code comments at lines 1370 and 1780 — The crossing-sign convention is never taught, though three tabs' live lk computations depend on it
- **[major] [pedagogy]** index.html lines 2125–2127 (table column), 528 ("Möbius counts"), 2149; derivation only in code (lin — The "primitive orbits of period n" column is displayed with no visible explanation of how the counts are obtained
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:1641 (palette), 1837-1845 (labels), 1849-1854 (arrows); 1320  — Canvas-drawn yellow and orange strokes and labels fail WCAG contrast on the near-white canvas background
- **[major] [ux-accessibility]** C:\Users\seand\claude_prime\index.html:1641 (B4W_COLORS), 1318-1321 (Borromean palette), 471 (clasp  — The 4-color Brunnian link diagram is distinguishable by hue alone, with a deutan-confusable green/dark-yellow pair at the pedagogically central clasp

Notable: the crossing-sign finding is the one baseline-confirmed major that survived all three
rounds — it fell between the Master (who read it as exposition) and the Novice (who took the signed
counts on faith). A protocol only finds what some critic owns; this one now has an obvious next owner.

## Rejected (1)
- [ux-accessibility] Canvases distort on narrow screens: max-width:100% without height:auto squashes every diagram on portrait phones (votes 0/3)

## Minors (20)
- [pedagogy] index.html line 317 (tooltip), duplicating lines 323 and 325; Dictionary rows at — Dictionary tab front-loads the hardest material; the Iwasawa tooltip is ~250 words of graduate content in a 250px hover box, stated three times
- [pedagogy] index.html line 981 (label text), line 341 (display), vs. line 339 (orientation  — "lk = ±1 (Hopf link)" hedges the sign although the tab claims orientations are fixed by the drawn arrows
- [pedagogy] index.html lines 484, 586, 459, 330 — Run-on, multiply-nested sentences at key explanatory moments exceed the stated audience's reading level
- [pedagogy] index.html line 490 (column sub) vs. lines 1989 and 2000 (where the value rule f — Quadruples arithmetic column never states its value rule up front; the bracket's meaning arrives at step 5
- [pedagogy] index.html lines 1006 ("isotopy"), 486 and 1413 ("Wirtinger presentation"), 330  — A handful of jargon terms are used before or without any gloss
- [pedagogy] index.html lines 2208–2209 (Zeta factor table), 1067–1072 (Pairs banner tooltips — "Splits"/"inert" — the value-rule vocabulary at every level — is never instantiated by a single concrete factorization
- [pedagogy] index.html line 437 (whyMu box) vs. line 1427 (step 4) — Two different definitions of μ̄(123) are given without stating that their agreement is itself a theorem
- [pedagogy] index.html line 352 (promise) vs. lines 1051–1055 (table rows) — Euler's criterion is promised as "exactly what the table below computes" but the intermediate residue is never displayed
- [pedagogy] index.html lines 444/1590–1610 (Triples Hasse SVG), 493/2010–2050 (Quads tower S — Field-lattice diagrams are never explained as diagrams; the Triples one has no caption at all
- [pedagogy] index.html lines 506 and 509 (zeta-face tooltips), 1963 (θ tooltip), 272 (scroll — Uniquely load-bearing caveats live in very long hover tooltips, degrading print/mobile/skim reading
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:7-282 (style block; no @media print anywh — No print stylesheet: printing captures only the active tab, and tooltip-only content is unprintable
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:900-918 — ARIA tablist implemented without arrow-key navigation or roving tabindex, deviating from the WAI-ARIA APG tabs pattern
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:920-924 (handler); 306, 324, 347, 365, 43 — Disclosure toggles (why-toggle buttons, self-tests button) expose no aria-expanded or aria-controls state
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:569, 575 — Ladder arrow buttons have no accessible name beyond the "➜" glyph
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:444, 493 (svg elements); 2012 (mouse-only — The two SVG field lattices lack accessible names/roles, and the quadTower's key θ explanation is a mouse-only SVG <title>
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:272 (overflow rule); 317, 1963 (oversized — Pinned tooltips longer than 55vh are keyboard-unscrollable, truncating content for sighted keyboard users
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:931 (static label) vs 1358-1362 (canvas-o — borroCanvas aria-label never reflects the isolate/fade state; the fade status is drawn as canvas-only text
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:1508-1526 (interaction), 429 (fixed 420px — 3D Borromean view: no touch/pointer rotation, a focusable div without a role, and a fixed-width container that overflows narrow columns
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:941, 1312, 1821 (2d contexts; no devicePi — Canvases are not devicePixelRatio-scaled, so all five figures render blurry on HiDPI displays
- [ux-accessibility] C:\Users\seand\claude_prime\index.html:370, 398, 448, 521, 548, 584 (div.section — Visual section headings are divs, and the Dictionary tab contains no headings at all — the document outline is incomplete

## Bottom line

The amended protocol repaired its own failure modes: the two regressed axes recovered past baseline,
no defect was introduced and left standing, and the artifact's own gates now cover the layer where
prior rounds were blind. Cost: 1.34M tokens for 20 verified improvements plus 2 in-round catches.
Score snapshot across the whole experiment: rigor 7/7 -> 8/8 (rounds 1-2), pedagogy 7 -> 6.5 -> 7.5,
ux 5 -> 4.5 -> 6.5, with 59 in-app tests standing guard. The method, amended, is a keeper.