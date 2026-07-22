# Citation corpus

Reference material for every named theorem, paper, and book chapter the app cites. Built so a
future citation-verification pass reads this file first and only falls back to a fresh
WebSearch for citations not yet entered here. Every entry was fetched from a real source
(journal page, arXiv, library catalog) — none of this is written from model memory.

**How to use this file (for a future audit, human or AI):**
1. Before re-verifying a citation the app already makes, check here first.
2. If it's here and marked ✅, trust it and move on — don't re-search.
3. If it's here and marked ⚠️, it's a known open question — read the note, don't silently pick
   an answer without the project owner's input.
4. If a citation isn't here yet, verify it properly (real source, not memory) and add an entry
   in the same format before the audit ends, so the next pass doesn't redo the work.
5. When the app's *wording* around a citation changes, this file's line references may drift —
   they're a locator, not a guarantee; re-grep if a claim seems out of place.

Confidence key: **High** = pinpoint match (page/theorem number) against a primary source.
**Medium** = theorem and year are standard/correct but the exact single paper wasn't pinned
down with full certainty. **N/A** = not actually cited in the app; noted so nobody "fixes" a
citation that isn't there.

---

## Fixed this session (were wrong; now corrected in `index.html`)

### Iwasawa's growth-formula theorem — was cited to the wrong paper
- **Was:** "Iwasawa, Abh. Hamburg 20 (1956)" for λ = μ = 0 given p regular.
- **Correct:** K. Iwasawa, *On Γ-extensions of algebraic number fields*, Bull. Amer. Math. Soc.
  65 (1959), 183–226. This is where the growth-formula machinery (λ, μ, ν invariants,
  vanishing for regular p) actually appears.
- **The 1956 paper is real but unrelated:** K. Iwasawa, *A note on class numbers of algebraic
  number fields*, Abh. Math. Sem. Univ. Hamburg 20 (1956), 257–258 — a 2-page note proving
  that for every odd prime q and exponent e, infinitely many non-Galois degree-q fields have
  class number divisible by q^e. Nothing about the cyclotomic tower.
- **Confidence:** High. **Sources:** Springer record for the 1956 note; ProjectEuclid/AMS
  record for the 1959 paper.

### "Turaev's Alexander regulator" — fabricated, no such term exists
- Searched Turaev's actual torsion literature (*Reidemeister torsion in knot theory*, Russian
  Math. Surveys 41 (1986); *Introduction to Combinatorial Torsions*) and the broader
  arithmetic-topology regulator literature. No source anywhere calls anything this. It was
  also the app's *only* possessive named-attribution with no year/venue — every real one has
  one. Replaced with the app's own "honest gap" convention rather than a citation.
- If a real citable source for a link-side regulator analogue is later confirmed (candidates:
  Hillman–Matei–Morishita's Iwasawa invariants for links; a Mahler-measure/regulator paper by
  Kitano), cite that paper by author and year instead of reintroducing an invented name.

---

## Verified this session, correct as cited

| # | Citation as app states it | Full reference | Confidence |
|---|---|---|---|
| 1 | Milnor 1957 (μ̄ definition) | J. Milnor, *Isotopy of links*, in *Algebraic Geometry and Topology: A Symposium in Honor of S. Lefschetz*, Princeton Univ. Press, 1957, pp. 280–306 | High |
| 2 | Cochran 1990 | T.D. Cochran, *Derivatives of Links: Milnor's Concordance Invariants and Massey's Products*, Mem. Amer. Math. Soc. 84, no. 427 (1990), 73pp | High |
| 3 | Mellor–Melvin 2003 | B. Mellor, P. Melvin, *A geometric interpretation of Milnor's triple linking numbers*, Alg. Geom. Topol. 3 (2003), 557–568 | High |
| 4 | Milnor 1962 (torsion = Alexander poly) | J. Milnor, *A duality theorem for Reidemeister torsion*, Ann. of Math. (2) 76 (1962), 137–147 | High |
| 5 | Milnor 1968 (fibered links) | J. Milnor, *Infinite cyclic coverings*, in *Conference on the Topology of Manifolds* (Michigan State, 1967), Prindle Weber & Schmidt, 1968, pp. 115–133 | High |
| 6 | Stallings 1978 | J. Stallings, *Constructions of fibred knots and links*, Proc. Symp. Pure Math. 32.2, AMS, 1978, pp. 55–60 | High |
| 7 | Ferrero–Washington 1979 | B. Ferrero, L. Washington, *The Iwasawa invariant μ_p vanishes for abelian number fields*, Ann. of Math. (2) 109 (1979), 377–395 | High |
| 8 | Herbrand 1932 / Ribet 1976 | J. Herbrand, *Sur les classes des corps circulaires*, J. Math. Pures Appl. 11 (1932), 417–441; K. Ribet, *A modular construction of unramified p-extensions of Q(μ_p)*, Invent. Math. 34 (1976), 151–162 | High |
| 9 | Greither 1992 | C. Greither, *Class groups of abelian fields, and the main conjecture*, Ann. Inst. Fourier 42.3 (1992), 449–499 | High |
| 10 | Mazur–Wiles 1984 | B. Mazur, A. Wiles, *Class fields of abelian extensions of Q*, Invent. Math. 76 (1984), 179–330 | High |
| 11 | Artin–Verdier duality, 1964 | Announced (unpublished) at the AMS Woods Hole Summer Institute, July 1964; detailed treatment in B. Mazur, *Notes on étale cohomology of number fields*, Ann. Sci. ÉNS (4) 6.4 (1973), 521–552 | High |
| 12 | Minkowski 1891 | Standard result and year confirmed; single canonical paper not pinned to full certainty (Minkowski published related pieces in Comptes Rendus and Crelle the same year) | **Medium** |
| 13 | Torres 1953 | G. Torres, *On the Alexander Polynomial*, Ann. of Math. 57 (1953), 57–89 | High |
| 14 | Turaev 1986 | V.G. Turaev, *Reidemeister torsion in knot theory*, Russian Math. Surveys 41:1 (1986), 119–182 | High |
| 15 | Artin–Mazur 1965 | M. Artin, B. Mazur, *On periodic points*, Ann. of Math. (2) 81 (1965), 82–99 | High |
| 16 | von Staudt–Clausen (1840) | Independently discovered by Karl von Staudt and Thomas Clausen, both 1840 | High |
| 17 | Chebotarev 1926 | N. Tschebotareff, *Die Bestimmung der Dichtigkeit einer Menge von Primzahlen...*, Math. Ann. 95 (1926), 191–228 | High |
| 18 | Kronecker–Weber | Not actually cited anywhere in the app by name/author/year — only presupposed as background. Nothing to fix. | N/A |
| 19 | Freedman–Skora 1987 | M.H. Freedman, R. Skora, *Strange actions of groups on spheres*, J. Diff. Geom. 25 (1987), 75–98 — the round-circles/Borromean result is **Lemma 3.2, p. 89**, inside a paper whose headline topic (quasiconformal group actions) looks unrelated at a glance | High |
| 21 | Corsman 2007 | Jens Corsman, *Rédei Symbols and Governing Fields*, PhD thesis, McMaster University, 2007 (advisor: Manfred Kolster) | High |

**Also verified earlier this session, not re-checked by the background pass above:**
- **Amano, Tohoku Math. J. 66 (2014), 501–522** (arXiv:1311.1289): Theorem 3.1.6 (certificate
  conditions — identity, gcd/parity, λ² ≡ θ mod 4), Theorem 3.1.10 (ramification only at
  p₁,p₂,p₃, *finite primes only*), Theorem 3.1.11 (K = k_{p₁,p₂}·k_{p₃,p₂}(√θ₁)), hypotheses
  (3.2.1), Theorem 3.2.5 ([p₁,p₂,p₃,p₄] = (−1)^μ̄(1234)). High confidence — read directly from
  the paper twice, in two separate audit rounds.
- **Stevenhagen, *Rédei reciprocity, governing fields and negative Pell*** (arXiv:1806.06250;
  published Math. Proc. Cambridge Philos. Soc. 172.3 (2022), 627–654): confirms Rédei 1939
  Satz 4; confirms Corsman's thesis "rel[ies] heavily on an incorrect lemma [5, Lemma 5.1.2]";
  confirms "no dyadic ramification subtleties arise" for primes ≡ 1 (mod 4). High confidence.
- **Fox–Weber formula:** R.H. Fox, Ann. of Math. 64 (1956); C. Weber, *Sur une formule de
  R. H. Fox concernant l'homologie des revêtements cycliques*, Enseign. Math. (2) 25 (1979),
  261–272. "Fox–Weber formula" is an attested standard name in the literature. High confidence.

---

## Resolved this session, second source checked before touching anything

Both items below were flagged after the first research pass as needing a second look before
acting. Both got one. One held up; one didn't — worth reading the second case as a demonstration
of why the "verify before acting" rule in `AUDIT-PROCESS.md` exists.

### ✅ Morishita chapter numbers — confirmed against a complete table of contents, annotated
Fetched a complete, quotable 15-chapter table of contents (Stanford SearchWorks catalog record
for the 2024 2nd edition) rather than trusting the first pass's summary. It confirmed the
original finding exactly: **1st edition** (Universitext, Springer, 2011/2012) ch. 8 = Milnor
Invariants; chs. 9–12 = Alexander/Iwasawa Modules through the Main Conjecture — **the app's
numbers matched this edition exactly.** **2nd edition** (Springer, 2024) inserts one new
chapter 7 ("Idelic Class Field Theory for 3-Manifolds and Number Rings"), shifting everything
after it by exactly one: Milnor Invariants → ch. 9, the Main Conjecture chapter → ch. 13.
Chapters 1–6 (including the "chs. 2–4" / "ch. 3" dictionary citations) are unaffected in both
editions and needed no change.

**Fixed:** every chapter-number citation that shifts between editions now says "1st ed." — 14
sites across the Dictionary, Triples, Zeta, and Q&A tabs (three of them were missed on the
first implementation pass and only caught by the regression test built alongside the fix,
which checks for any bare, edition-less chapter citation). Locked in by a self-test,
mutation-checked against two independent reverted copies.

### ✅ "Boundary links ⇒ μ̄ vanishes" — Smythe hypothesis checked directly, didn't hold up as stated
The first pass suggested this vanishing theorem might be credited to N. Smythe rather than
Milnor 1957, citing "the survey's Theorem 3.9." Fetched the actual survey (Meilhan, *Linking
number and Milnor invariants*, arXiv:1812.03319) and read it directly rather than trusting the
summary. **Theorem 3.9 in that paper is about concordance invariance, credited to Stallings and
Casson — a different theorem entirely.** The boundary-link vanishing claim is the very next,
UNCITED sentence: "Let us also mention here that Milnor invariants are all zero for a boundary
link... " — no citation attached at all in this source. The first pass had matched the wrong
theorem number to the claim.

**What did hold up, independently confirmed from two sources:** the *term* "boundary link"
itself is Smythe's — N. Smythe, *Boundary links*, in Topology Seminar Wisconsin 1965 (R.H.
Bing, ed.), Ann. of Math. Studies 60, Princeton Univ. Press, 1966, pp. 69–72.

**Fixed, precisely rather than by swapping one citation for another:** the boundary-link
tooltip now credits Smythe 1966 for the *term/definition* (well-evidenced), and states the
vanishing property as a consequence of Milnor's 1957 construction rather than a separately
cited theorem (since no source substantiates crediting it elsewhere, and it genuinely is an
immediate corollary — the defining disjointness lets every preferred longitude be pushed
entirely off the other components' surfaces, directly triggering vanishing in Milnor's own
Magnus-coefficient construction).

---

## Not yet verified (lower priority — not load-bearing enough to have blocked this pass)

Anything the app cites that doesn't appear above hasn't been checked yet against a primary
source this session. Add an entry here — or better, a real verified one above — before trusting
it in a future report.
