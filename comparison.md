# Method Comparison — MAN Protocol (2 rounds) vs Baseline

Both measurements used a byte-identical instrument: six reviewer lenses scoring 0-10 against a
publication-standard rubric, findings adversarially verified by 3 independent skeptics
(confirmed = >=2/3). Baseline: 66 agents / 3.53M tokens. Post: 60 agents / 3.57M tokens.
The MAN run itself: 10 agents / 1.34M tokens / ~110 min / 30 commits.

## Scores

| Dimension | Baseline | Post-MAN | Delta |
|---|---|---|---|
| arithmetic-rigor | 7.0 | 8.0 | **+1.0** |
| topology-rigor | 7.0 | 8.0 | **+1.0** |
| pedagogy | 7.0 | 6.5 | −0.5 |
| code-quality | 6.5 | 6.5 | 0.0 |
| ux-accessibility | 5.0 | 4.5 | −0.5 |
| completeness | 6.5 | 7.0 | +0.5 |
| **mean** | **6.50** | **6.75** | **+0.25** |

Findings: 13 confirmed majors, 0 criticals, 59 minors (baseline) → 13 unique confirmed
(1 critical + 12 majors), 47 minors (post). The one critical was INTRODUCED by the run.

## What the protocol fixed (verified by the second measurement)

- Both baseline verifier-false-negative real defects: the invalid-input fall-through (R1-M3)
  and the Zeta "three faces agree" overclaim (R1-M5) — gone.
- The hardcoded Hilbert product row (R2-M5) — the baseline's only confirmed rigor major — gone.
- Four of the five confirmed pedagogy majors: mispaired opener (R1-N1), Magnus-before-definition
  (R1-N4), untaught sign conventions (R1-M6 et al.), unauditable displays (R2-N2/N6).
- Beyond the baseline's findings, expert-level rigor defects no prior pass had found:
  theta certificate non-uniqueness with explicit exploit elements (R2-M1/M4), the nonexistent
  rank-r tower under f_S (R1-M2), Redei normalization (R1-M1/M4), Lefschetz sign bookkeeping
  (R2-M6), the two-tier Redei definedness domain (R2-M2).
- Minors: 59 → 47. Self-tests: 32 → 41, the critics' exploits now regression tests.

## What the protocol missed (all six a11y majors persisted, verbatim)

No ARIA/text alternatives, no tab semantics, tooltip content invisible to assistive tech,
colorblind-unsafe palette, contrast failures, keyboard-unreachable spans. Cause: coverage
equals the critics' profiles — neither a professor of the domain nor a bright undergrad
reading for comprehension models a screen-reader user. The protocol finds what its critics
are tuned to see, nothing else.

Also persisted: the pure-function-only test suite (no DOM assertions), the unthrottled
three.js loop, and the Dictionary-as-entry-tab — the last one *protected by the run's own
INVARIANTS* (tab structure frozen), a reminder that invariants preserve known defects.

## What the protocol introduced

1. **a(19) = 0 (critical, 3/3 confirmed by five lenses).** False: 19 splits in Q(sqrt5),
   a(19) = 2; the intended inert example is a(13) = 0. Written by the final pedagogy
   revision (R2-N6) — the one phase with NO downstream check: Masters had already run,
   and the self-tests cover only pure functions, not displayed text.
2. **Ladder slot-label inconsistency (major).** R2-M2's two-tier fix updated the live
   Frobenius panel but not the static matrix tooltips describing the same slot.
3. **Tooltip-gating aggravation (major, systemic).** Stratification (§5's preferred
   resolution) + a hard byte budget (§0) systematically pushed load-bearing theory into
   hover tooltips (67 of them); the pedagogy and a11y scores both paid for it.

Items 1 and 2 were repaired after measurement, explicitly outside both instruments
(commits eb5357d..c098d75); 41/41 self-tests green at tag `man-final`.

## Verdict on the method

**The protocol performs exactly as designed — which is both its strength and its limit.**

- Along its critics' axes it is the sharpest instrument tested in this project: +1.0 on both
  rigor dimensions, with round 2 behaving precisely as §9 predicts (it found what round 1
  broke — the q=107 domain conflict — and applied round 1's own standard to survivors — theta).
  The dialectic structure produced real mathematics: counterexample elements, a Hensel
  argument, a conjugacy-invariance proof.
- The ledger prevented oscillation (no LOCKED entry was reopened); commit-per-task meant a
  110-minute 30-commit run needed zero recovery; the Apprentice self-policed the budget twice.
- Its failure modes are structural and predictable: (a) zero movement on axes no critic owns;
  (b) an unguarded final phase that can inject defects — the single critical of this run;
  (c) stratify-plus-budget quietly optimizes content into hover space, a global cost no
  single finding registers.
- Efficiency: 24 verified improvements for 1.34M tokens — roughly a third of the cost of one
  review-harness pass, and far more repair-per-token than any earlier method used on this
  artifact (my improvised "Modify/Add/Nix" rounds — a misreading of this protocol's name —
  never reached defects of the theta or f_S class).

**Recommended amendments if run again:** add a third critic profile owning accessibility;
close each round with a cheap Master skim of the final diff (would have caught a(19) and the
Ladder mismatch); extend the self-test suite to displayed DOM text so the artifact's own
gates cover the layer where both introduced defects lived; give the Novice an explicit
"global tooltip load" lens.

Net: mean +0.25 understates a real gain — the artifact is materially more correct and more
honest than at baseline, with the regression cost concentrated in dimensions the run was
never aimed at, and both introduced defects caught by the exit measurement and repaired.
