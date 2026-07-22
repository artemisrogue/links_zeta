# Math/correctness audit — draft, not yet implemented

**Status:** DRAFT. Nothing in this document has been applied to `index.html`. This file is
itself uncommitted (`git status` will show it untracked) — it exists for review and comparison,
not as part of the app.

**Scope:** Fresh, literature-verified pass over the entire app at `HEAD` (commit `6cea6d5`),
focused on mathematical correctness — statement logic, definitions, theorem attributions,
independent recomputation of every displayed number, the strength-labeling of the dictionary
correspondences, and a systematic sweep for visible-text vs. hidden-text (aria-label/title)
divergence. Produced by seven parallel audit agents, each finding then faced an independent
skeptic instructed to refute it by default; I personally re-verified the two highest-severity
items against primary/secondary sources myself before writing this report.

**Headline:** The app is in materially better shape than at any previous audit point. Five
findings surfaced, one was refuted, four survived — and two of the four are the same underlying
defect caught by two different lenses, so there are **three distinct issues**, none of them a
computational error. All prior-round defects (the invented "Amano's independence theorem," the
θ/compositum degree break, the Brieskorn-sphere overclaim, the ramification-at-∞ misattribution,
etc.) were re-checked and confirmed still fixed and mutually consistent.

---

## Confirmed findings

### 1. [MAJOR] Iwasawa's regular-prime theorem cited to the wrong paper

**Where:** Zeta tab, "Contrast: what a knotted prime adds — regular vs irregular" card
(`#knottedPrime`, tooltip on "Iwasawa's theorem"), echoed in Q&A #11.

**Current text:** *"Iwasawa's theorem (1956): if p does not divide the class number of Q(ζ_p),
then p divides the class number of no layer Q(ζ_{p^n}) of the cyclotomic tower — the Iwasawa
module vanishes... λ = μ = 0... Cited: Iwasawa, Abh. Hamburg 20 (1956)."*

**Why wrong:** I checked this myself. Iwasawa's 1956 Hamburg note, *"A note on class numbers of
algebraic number fields,"* Abh. Math. Sem. Univ. Hamburg 20 (1956), 257–258, proves an unrelated
result: for every odd prime *q* and every *e*, there exist infinitely many non-Galois degree-*q*
number fields whose class number is divisible by *q^e*. It says nothing about the cyclotomic
ℤ_p-tower, λ/μ-invariants, or regular primes. The λ = μ = 0 growth-formula machinery this claim
actually rests on is the content of Iwasawa's later paper, *"On Γ-extensions of algebraic number
fields,"* Bull. Amer. Math. Soc. 65 (1959), 183–226 — confirmed independently via search. This is
the right author, a plausible-looking year, and the wrong specific paper — the exact
misattribution shape this project has hit before (e.g. "Amano's independence theorem").

The underlying *mathematics* the app states is true; only the citation is wrong.

**Proposed fix (not applied):** Repoint the citation in both the Zeta-tab tooltip and Q&A #11 to
Iwasawa, *"On Γ-extensions of algebraic number fields,"* Bull. Amer. Math. Soc. 65 (1959),
183–226 (or cite a standard textbook treatment, e.g. Washington's *Introduction to Cyclotomic
Fields*, for the vanishing-λ,μ corollary). Change "(1956)" to "(1959)" at both sites.

---

### 2. [MAJOR/MINOR — same defect, two lenses] "Turaev's Alexander regulator" appears fabricated

**Where:** Zeta tab, "Torsion orders" row, the class-number card (`#zxClassNo` /
`classNoThread`, in `renderCovers()`).

**Current text:** *"Two ingredients of that formula do not transport: the regulator has only a
subtle analogue (Turaev's Alexander regulator), and √|d_K| has none at all."*

**Why wrong:** I searched independently and found no such term anywhere in Turaev's actual
torsion literature (*Reidemeister torsion in knot theory*, Russian Math. Surveys 41 (1986);
*Introduction to Combinatorial Torsions*) or in the broader arithmetic-topology regulator
literature. Turaev's real, well-documented contribution in this space is sign-refined
Reidemeister–Turaev torsion and the Conway function — not anything called a "regulator." This is
also the **only** possessive named-result attribution anywhere in the file that carries no
adjacent year/venue citation — every other named result in the app (Milnor 1962, Turaev 1986,
Torres 1953, Cochran 1990, Rédei 1939, Amano 2014, Ferrero–Washington 1979, ...) has one, and the
app's own Q&A #10 "Cited:" inventory — which lists every other real Turaev citation in the file —
omits this one. That combination (uncited, absent from the app's own citation inventory, not
locatable in the literature) is the same shape as the invented "Amano's independence theorem"
found in an earlier round, recurring under a different name in a part of the app that round
didn't touch.

There *is* real work constructing a link-side analogue of the regulator (e.g. Hillman–Matei–
Morishita's Iwasawa invariants for links), but it is not due to Turaev and not called this.

**Proposed fix (not applied):** Either (a) drop the specific name-and-author parenthetical and
use the app's own established "honest gap" convention elsewhere (e.g. the five-component Zeta
card's "not in the literature this app cites"), or (b) if a real citable source is confirmed
(Hillman–Matei–Morishita, or a Mahler-measure/regulator paper by Kitano or similar), cite that
paper by author and year instead.

---

### 3. [MINOR] A Dictionary tooltip's cross-reference points at the wrong Q&A fracture

**Where:** Dictionary tab, Pairs row, the "— mod 2 only" annotation on the Legendre-symbol cell
(the tooltip), cross-referencing Q&A item 14's "Five fractures" list.

**Current text:** *"This is where the mismatch first bites: lk is an integer, the symbol is a
sign. It repeats one rung up — μ̄(123) is an integer, [p₁,p₂,p₃] is a sign — and Q&A fracture (4)
collects both."*

**Why wrong:** I read both sites directly. Q&A fracture (4), in full, reads: *"The ring mismatch:
Δ_L lives over ℤ[t₁^±1,...,t_r^±1] with deck group ℤ^r, while over Q no ℤ^r-cover exists —
f_S's deck group is finite and Iwasawa's genuine ℤ_p-tower ramifies at p itself... so the two
polynomials live over honestly different rings."* That is exclusively about the Alexander-
polynomial/Iwasawa-polynomial ring mismatch — it never mentions `lk`, μ̄, the Legendre symbol, or
the Rédei symbol. A reader who follows the pointer to check the claim finds a different fracture
than the one promised. (Q&A item 6 is where the integer-vs-sign mismatch is actually discussed,
and its own cross-reference correctly points at fracture 4 for a *different*, adjacent point —
the ring mismatch — not this one.)

**Proposed fix (not applied):** Point the Dictionary tooltip's cross-reference at Q&A item 6
instead (drop "fracture (4) collects both"), or extend fracture (4)'s own text to state the
integer-vs-sign collapse explicitly so the pointer becomes true. Either way, the citation should
not point at content it doesn't contain.

---

## Refuted (for the record — do not act on these)

- **"e·f·g = |G| restated without its Galois hypothesis"** at a second site (Triples-tab
  "residue degree" tooltip, line ~2494), proposed as the same defect already fixed once at the
  Q&A/Dictionary site. Refuted: the skeptic compared the two texts directly and found the
  Triples-tab tooltip already carries an equivalent qualifying clause; not a live duplicate of
  the fixed defect.

---

## Confirmed correct (high-value negative results — checked, not just assumed)

- **All prior-round defects re-verified as still fixed and mutually consistent:** zero remaining
  occurrences of "Amano's independence theorem" anywhere (six sites + the self-test that pinned
  it); the θ/compositum tooltip's field-degree chain now matches the app's own `quadTower` SVG
  figure exactly (θ ∈ degree-4 field, generates K over the degree-32 compositum, degree-2 step to
  64); the `coversTable` aria-label matches its visible table including the n=6 non-sphere row;
  the Amano banner tooltip no longer attributes unramifiedness at ∞ to Amano.
- **~380+ additional independent recomputations, zero disagreements:** Legendre symbols (by
  enumerating squares mod p, not Euler's criterion), Tonelli–Shanks roots (brute force), Rédei
  symbols (direct construction), Milnor invariants (independent Magnus expansion), matrix orders
  in N₂/N₃/N₄(𝔽₂) including the full 64-element N₄ order rule, the trefoil's branched-cover
  orders |H₁(M_n)| for n = 2..12 by three independent methods, the Dedekind zeta partial product,
  Lefschetz/Fix/orbit counts for the figure-eight, Bernoulli/irregularity data including 101 at
  B₆₈, and the full 427-prime Chebotarev tally.
- **Brieskorn homology-sphere condition verified as a theorem, not an app-local claim:**
  Σ(p,q,r) is a homology sphere iff p,q,r are pairwise coprime (standard fact); gcd(n,6)=1 is
  proved equivalent to {2,3,n} pairwise coprime, matching the app's computed table exactly.
  Fox/Weber citation and chronology (Fox 1956; C. Weber, *Enseign. Math.* 25 (1979)) confirmed
  correct, including that "Fox–Weber formula" is an attested standard name.
  
- **Rédei-reciprocity historiography verified against Stevenhagen's actual paper**
  (arXiv:1806.06250): confirms Rédei's original Satz 4, confirms Corsman's thesis "rel[ies]
  heavily on an incorrect lemma," confirms "no dyadic ramification subtleties arise" for
  primes ≡ 1 (mod 4) — exactly the regime the app uses.
- **Systematic hidden-text sweep across all 7 tabs found no other divergence:** every static
  aria-label (29), the one SVG `<title>` element, all figure captions (rung1/2/3Fig, matrices,
  cover towers), and all 127 `data-tip` attributes (91 distinct texts, 12 reused terms — each
  checked and found to be a compatible elaboration, not a contradiction) were harvested live and
  cross-checked against their adjacent visible text. No `title=` attributes exist anywhere in the
  document, eliminating that entire shadow-text channel.
- **Dictionary correspondences correctly strength-labeled throughout:** every row where a
  correspondence is analogy-strength rather than theorem-strength is explicitly flagged as such
  in its own tooltip (checked against the app's own "theorem / computed live / analogy never
  trade places" rule, row by row).
- Suite reads **111/111** at boot with zero interaction and after an exhaustive interaction churn
  pass; zero console errors across the full sweep.

---

## For your model-tier comparison

- 7 lens agents + 5 skeptic-refutation agents = 12 total, all on the (session-inherited) model
  you'd set for this turn.
- ~2.0M subagent tokens, ~574 tool calls, wall-clock a little over 20 minutes for the full
  workflow.
- Signal-to-noise this round was high: 5 raw findings, 1 refuted, 3 distinct real issues, 0 false
  positives that I could find on my own re-check of the top two. Compare this yield against the
  33/23/14/11-finding counts from the four prior polish-loop iterations audited under Opus — the
  surface is converging, and what's left is citation-precision-grade rather than statement-level.
