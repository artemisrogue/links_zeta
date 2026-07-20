# MAN Protocol Run Report — 2 Rounds (test output)

Protocol: `MAN-protocol.md` (Master / Apprentice / Novice). Parameters: ARTIFACT = index.html;
ARTIFACT_TYPE = mixed; DOMAIN = arithmetic topology; N = 2; EXCHANGE_DEPTH = 6; BUDGET = 160 KiB;
NOVICE = bright undergrad (group theory + modular arithmetic only); MASTER = professor of the domain.
Execution: 10 agents (2 Masters + Apprentice + Novice + Apprentice per round), 1.34M tokens, ~110 min,
commit-per-task per protocol section 3. Result: 24 findings, 24 concessions, 0 defends, 0 defers,
2 self-initiated budget passes, all entries LOCKED. Final artifact: 163,833 bytes (7 under budget),
41/41 self-tests green (up from 32 — critics' exploits became regression tests).

## Ledger

| ID | Round | Source | Issue (abridged) | Status |
|---|---|---|---|---|
| R1-M1 | 1 | Master | redeiSymbol certifies a predicate weaker than Redei's theorem: unnormalized certificates pass all checks yet change the symbol's value, while the tooltip assert | LOCKED |
| R1-M2 | 1 | Master | f_S is defined via a 'rank-r tower of l-adic extensions of Q unramified outside S' that does not exist for r >= 2, and line 450 asserts a theorem-shaped claim ( | LOCKED |
| R1-M3 | 1 | Master | The invalid-input guard in renderLegendreTable warns but only returns for p or q = 2, so composite or equal inputs fall through to Euler's criterion and typeset | LOCKED |
| R1-M4 | 1 | Master | Same well-definedness failure viewed from the code contract: the acceptance domain provably fails to determine the value (k=2 exploit at q=269), the definedness | LOCKED |
| R1-M5 | 1 | Master | One symbol zeta_h names two functions differing by (1-t)^2: the H1-zeta (faces 1-2) and the Artin-Mazur orbit zeta (face 3); the page claims all three faces agr | LOCKED |
| R1-M6 | 1 | Master | Step 2 presents l_3 = [x1,x2] as a consequence of lk = 0 via a false biconditional (zero exponent sums = commutator), and the banner claims the +1 sign follows  | LOCKED |
| R1-N1 | 1 | Novice | The Dictionary opener's parallel structure asserts Hopf link <-> (5, 29), which the Pairs presets, Zeta tab, and code comments all contradict ((5,29) is the spl | LOCKED |
| R1-N2 | 1 | Novice | The Pairs tab's only main-text definition of the Legendre symbol is via an unintroduced Frobenius; the elementary square-mod-q / Euler's-criterion characterizat | LOCKED |
| R1-N3 | 1 | Novice | ∆_Hopf's value is discussed (line 391) before the Alexander polynomial is ever introduced in main text, and the recurring polynomial strip on three tabs plus th | LOCKED |
| R1-N4 | 1 | Novice | Triples step 2 uses [F,F] without identifying F or defining 'meridian' in main text, and step 3 applies the Magnus expansion with the substitution rule stated n | LOCKED |
| R1-N5 | 1 | Novice | The Zeta tab's announced 'sum resummed as a product' mechanism is never exhibited: the bridge identity exp(Σ λⁿtⁿ/n) = (1−λt)⁻¹ is absent, so the live demo read | LOCKED |
| R1-N6 | 1 | Novice | Quadruples step 3's defining equation for θ contains a bare α while step 2 defined three different Rédei elements, making the displayed identity uncheckable wit | LOCKED |
| R2-M1 | 2 | Master | Step 3 certifies theta by the defining identity alone and typesets a 4-ary symbol, but the identity admits a second integral solution theta' = 494+225sqrt5+(50+ | LOCKED |
| R2-M2 | 2 | Master | The Ladder renders triple-level mu-bar verdicts for q = 3 (mod 4) (default q = 107) while redeiSymbol throws for the same q, with both behaviors labeled as defi | LOCKED |
| R2-M3 | 2 | Master | For pairs both = 3 (mod 4) the Pairs banner applies the Hopf/unlink gloss to an order-dependent symbol: (3,7) typesets 'the Hopf pair' while (7,3) typesets 'unl | LOCKED |
| R2-M4 | 2 | Master | Same well-definedness failure via unit twists: theta'' = -(10+sqrt101)^2*theta passes the only displayed check yet generates a totally imaginary field ramified  | LOCKED |
| R2-M5 | 2 | Master | For (3,7) the Hilbert panel prints 'forces (p/q)(q/p) = 1' and 'collapses to (p/q)(q/p) = 1' while its own rows three lines up display (3/7)(7/3) = -1; both har | LOCKED |
| R2-M6 | 2 | Master | Both zeta-tab tooltips display Sigma(-1)^i while silently computing with Sigma(-1)^(i+1): the full alternating count is 1 - tr (a sign, not just an H0 constant) | LOCKED |
| R2-N1 | 2 | Novice | Line 476's 'the word' has no antecedent: [[x₁,x₂],x₃] is never identified as ℓ₄, K₄'s longitude in Milnor's model B₄, nor is the X₁X₂X₃-coefficient rule or the  | LOCKED |
| R2-N2 | 2 | Novice | The two rows the 'same proof' table stands on — v = p and v = q — have a why-column that restates notation ('(q/p) — the symbol (q/p)') while every other row ca | LOCKED |
| R2-N3 | 2 | Novice | Step 5 shows four residues and four symbols but never states the rule taking them to the banner (symbol = common value = splitting of 449 in K; agreement = well | LOCKED |
| R2-N4 | 2 | Novice | H₁ is never introduced at any level anywhere in the app, though the Zeta topology column's central objects are 'eigenvalues of h∗ on H₁(F;Q)' and 'the monodromy | LOCKED |
| R2-N5 | 2 | Novice | Two adjacent displays of the same product contradict as written: face 3 (line 502) is orbit-indexed with exponent −1, while the live panel (line 2167) kept inde | LOCKED |
| R2-N6 | 2 | Novice | The 'sum over ideals' face displays a number whose defining inputs (how many ideals of each norm) exist only in a source comment; the page's pointer 'norms coun | LOCKED |

## Resolutions (full)

### R1-M1 (Master, round 1)

**Issue.** redeiSymbol certifies a predicate weaker than Redei's theorem: unnormalized certificates pass all checks yet change the symbol's value, while the tooltip asserts solution-independence without the normalization hypothesis.

**Resolution.** redeiSymbol (index.html ~line 676) now enforces primitivity, y = 0 mod 2, and x - y = 1 mod 4, with a docstring explaining why (scaling by k multiplies the value by (k/q)); added bigGcd helper. Triples-tab Redei-field tooltip now reads 'independent of the normalized solution chosen' with the three conditions and the sqrt(k)-twist failure mode stated; the Redei-element tooltip in renderTripleSteps says (23,6,1) is normalized and unnormalized solutions are rejected. New self-test: (115,30,5) for [13,61,937] throws while (23,6,1) still gives -1, with (5/937) = -1 checked live. (079fd4d)

### R1-M2 (Master, round 1)

**Issue.** f_S is defined via a 'rank-r tower of l-adic extensions of Q unramified outside S' that does not exist for r >= 2, and line 450 asserts a theorem-shaped claim (Redei symbol = surviving f_S coefficient) about the undefined object.

**Resolution.** Dictionary f_S tooltip (line 308) rewritten: names the asymmetry (no rank-r tower over Q, finite deck group with the Z/4 x Z/4 example), places the module over Z_l[[u_1,...,u_r]] with the relations (1+u_i)^{l^{e_i}} = 1, defines f_S as a Fitting-ideal generator up to a unit, cites Morishita's Knots and Primes ch. 9-12, and separates Iwasawa's Lambda = Z_l[[T]] cyclotomic story. Line 394 tooltip: finite deck group, complete group ring. Line 450: definite coefficient claim replaced by the cited mu_2(123) identification, with the f_S-coefficient phrasing explicitly marked 'analogy, not theorem'. Line 546 no longer writes f_S for the cyclotomic characteristic series (now 'f = L_p, Mazur-Wiles'). (c0a0af5)

### R1-M3 (Master, round 1)

**Issue.** The invalid-input guard in renderLegendreTable warns but only returns for p or q = 2, so composite or equal inputs fall through to Euler's criterion and typeset a fake reciprocity failure, a false splitting banner, and a Hilbert product row showing -1 with a cross.

**Resolution.** renderLegendreTable invalid branch now calls renderHilbertTable(p, q, null, null) and returns for every invalid case (composite, equal, or even), with a comment stating why nothing below may be computed; the p===2/q===2 special-cased return line was removed. (c08617a)

### R1-M4 (Master, round 1)

**Issue.** Same well-definedness failure viewed from the code contract: the acceptance domain provably fails to determine the value (k=2 exploit at q=269), the definedness conditions of line 307 (all pairwise symbols +1, primes 1 mod 4) are never checked, and the test suite is blind because every tested q has (2/q) = +1.

**Resolution.** redeiSymbol gained the mod-4 and (p1/p2) = +1 checks with a comment tying them to the Dictionary's stated definition; quad-tab step 2 renamed to 'identity + normalization checks' and each certificate's normalization is computed and displayed live with a tooltip stating the three conditions; two new self-tests: the k=2 exploit at q=269 (with (2/269) = -1 checked) and definedness rejection ([13,61,7] via mod 4; the (5,13) pair's only certificate (0,0,0) via primitivity, with (5/13) = -1 checked). (805f06c)

### R1-M5 (Master, round 1)

**Issue.** One symbol zeta_h names two functions differing by (1-t)^2: the H1-zeta (faces 1-2) and the Artin-Mazur orbit zeta (face 3); the page claims all three faces agree while printing 1,3,8,21,... next to 1,1,3,8,..., and the tests never compare across the pairs.

**Resolution.** Face-3 formula now reads (1-t)^2 * zeta_h(t) = prod_gamma (1 - t^{|gamma|})^{-1}, with a tooltip identifying the orbit product as the Artin-Mazur zeta and deriving the (1-t)^2 from Fix = tr - 2; line-517 sub rewritten to 'two zeta functions... equal to (1-t)^2 * zeta_h, shown below to be exactly that'; line-502 note scopes Milnor's theorem to the H1-zeta and gives the orbit product as (1-t)^2 * Delta^{-1}; renderLefschetz header now 'Two zetas, three identities' and computes/displays the (1-t)^2 * (H1 face) coefficients with a live check against the orbit face; new self-test verifies the cross identity coefficient-by-coefficient and that the two zetas genuinely differ. (62ea7e6)

### R1-M6 (Master, round 1)

**Issue.** Step 2 presents l_3 = [x1,x2] as a consequence of lk = 0 via a false biconditional (zero exponent sums = commutator), and the banner claims the +1 sign follows from 'the conventions fixed here' though nothing computed from the drawing distinguishes [x1,x2] from [x2,x1].

**Resolution.** Longitude tooltip now says exponent sums vanishing means membership in [F,F] 'and no more', citing Wicks; step 2 body separates what lk = 0 gives (membership) from what Wirtinger gives (the specific word), and marks [x1,x2] as Milnor's model word taken as given, explicitly invoking the same standard as the Quadruples honesty note; banner tooltip replaces 'with the conventions fixed here it is +1' with the statement that +1 is read off the model word, the app does not compute the diagram's Wirtinger presentation, [x2,x1] gives -1, and only mu(123) = +/-1 != 0 is convention-free; the arithmetic mirror line no longer says 'writable as a commutator exactly because lk = 0'; borroComputeLk comment documents the canvas-coordinate mirror and why only zeros are asserted. (4b2a4f5)

### R1-N1 (Novice, round 1)

**Issue.** The Dictionary opener's parallel structure asserts Hopf link <-> (5, 29), which the Pairs presets, Zeta tab, and code comments all contradict ((5,29) is the split/unlinked pair; (5,13) is the Hopf pair).

**Resolution.** index.html line 298 now reads '...the Hopf link and the pair (5, 13), the unlink and the pair (5, 29); the Borromean rings and the triple (13, 61, 937).' Both pairings are now correct and explicit. (82f7180)

### R1-N2 (Novice, round 1)

**Issue.** The Pairs tab's only main-text definition of the Legendre symbol is via an unintroduced Frobenius; the elementary square-mod-q / Euler's-criterion characterization the target reader can verify lives only in tooltips.

**Resolution.** index.html line 342 sub now opens: '(p₁/p₂) asks an elementary question: is p₁ a nonzero square mod p₂? +1 if yes, −1 if not — computable by hand via Euler's criterion, p₁^((p₂−1)/2) mod p₂, which is exactly what the table below computes.' Then the puncture/Frobenius sentence follows as 'its Galois restatement', with (p₁/p₂) = Frob_{p₂}(√p₁)/√p₁. (21515df)

### R1-N3 (Novice, round 1)

**Issue.** ∆_Hopf's value is discussed (line 391) before the Alexander polynomial is ever introduced in main text, and the recurring polynomial strip on three tabs plus the facing 'Iwasawa module' line all depend on the missing introduction.

**Resolution.** index.html line 391: poly-demo now opens 'Every link L carries a computable polynomial invariant, the Alexander polynomial ∆_L(t₁,…,t_r): one variable per component, defined up to a unit', with a tooltip giving the black-box reading and deferring the rigorous definition to the Dictionary's ∆_L row; then '∆_Hopf ≐ 1' follows. Line 394: 'the Iwasawa module — the arithmetic side's H₁-of-the-cover, whose order polynomial f_S plays the role ∆_L just played — carries nothing beyond the Legendre symbol itself' (existing R1-M2-compliant tooltip unchanged). (cb39de6)

### R1-N4 (Novice, round 1)

**Issue.** Triples step 2 uses [F,F] without identifying F or defining 'meridian' in main text, and step 3 applies the Magnus expansion with the substitution rule stated nowhere on the tab, making the displayed expansion uncheckable.

**Resolution.** index.html renderTopoTripleSteps: step 2 now reads 'lies in [F,F], where F is the free group on the meridians x₁, x₂ of K1 and K2 (a meridian: a small loop encircling that component once): that is everything vanishing lk gives.' Step 3 body now opens 'Substitute x₁ ↦ 1 + X₁, x₂ ↦ 1 + X₂, xᵢ⁻¹ ↦ 1 − Xᵢ + Xᵢ² − ⋯ (X₁, X₂ noncommuting) and multiply out:' before the live expansion. (1aab48b)

### R1-N5 (Novice, round 1)

**Issue.** The Zeta tab's announced 'sum resummed as a product' mechanism is never exhibited: the bridge identity exp(Σ λⁿtⁿ/n) = (1−λt)⁻¹ is absent, so the live demo reads as numerical magic.

**Resolution.** index.html: new small-note inserted after the eigenvalue-product face (after old line 500): 'The resummation engine, shown once: −log(1 − x) = Σ_{n≥1} xⁿ/n, so for one eigenvalue exp( Σ_n λⁿtⁿ/n ) = (1 − λt)⁻¹; summing the exponents over eigenvalues is allowed because tr(hⁿ∗) = Σ_j λⱼⁿ. Every sum-into-product identity on this page, in both columns, is this one line — run per eigenvalue, per orbit, or per prime (log of an Euler factor: Σ_n Np⁻ⁿˢ/n).' (dd364be)

### R1-N6 (Novice, round 1)

**Issue.** Quadruples step 3's defining equation for θ contains a bare α while step 2 defined three different Rédei elements, making the displayed identity uncheckable without reverse-engineering the digits.

**Resolution.** index.html renderQuadSteps step 3 head now ends: '...− α = 0 in Z[√5], where α = 241 + 100√5 is the Rédei element of (5, 8081) from step 2'. (cae2f9e)

### R2-M1 (Master, round 2)

**Issue.** Step 3 certifies theta by the defining identity alone and typesets a 4-ary symbol, but the identity admits a second integral solution theta' = 494+225sqrt5+(50+22sqrt5)sqrt101 whose four conjugates mod 449 are all squares, flipping the displayed conclusion.

**Resolution.** Step 3 renamed '(identity + positivity checks)'; theta tooltip now states the identity does NOT pin theta down and gives Amano's conditions, separating what is checked live (identity, total positivity = unramified at infinity) from what is cited (2-adic normalization - explicitly held to the Triples tab's Wirtinger standard). New helpers quadThetaEmbeddings/quadThetaTotallyPositive/quadThetaIdentity; step 3 displays the four real embeddings {49.57, 9.37, 40.63, 0.43} with the all>0 check live. Banner bracket gains a tooltip: the 4-ary notation is licensed by Amano's theorem, not the identity. New self-test: theta' passes the identity, all four conjugates mod 449 are squares (opposite verdict), rejected by total positivity - exactly the role (115,30,5) plays at the triple level. (8fd6316 (prose tightened in a5f6cfb))

### R2-M2 (Master, round 2)

**Issue.** The Ladder renders triple-level mu-bar verdicts for q = 3 (mod 4) (default q = 107) while redeiSymbol throws for the same q, with both behaviors labeled as definedness - two components enforcing incompatible domains for one invariant.

**Resolution.** Ladder paragraph gains 'The definedness domain, precisely:' stating the two-tier domain once. renderFrobenius verdicts respect it: q = 1 (mod 4) keeps the linking language and names the symbol value ([13,61,q] = +/-1, verified consistent at q = 113); q = 3 (mod 4) - including the default 107 and q = 3 - asserts only the field-splitting fact and explicitly declines the Borromean/mu-bar reading, pointing to the domain note. New self-test pins the coexistence by design: corner of rho(Frob_107) defined (r = 0) while redeiSymbol(13,61,107,...) throws on /mod 4/. Existing 107/937 matrix tests unchanged and still honest (they assert splitting facts). (da1b854)

### R2-M3 (Master, round 2)

**Issue.** For pairs both = 3 (mod 4) the Pairs banner applies the Hopf/unlink gloss to an order-dependent symbol: (3,7) typesets 'the Hopf pair' while (7,3) typesets 'unlinked' for the same unordered pair, contradicting the symmetry of lk proved on the same tab.

**Resolution.** Banner branches now condition on bothThree: for both = 3 (mod 4), the split/inert statement stays (tooltips stripped of puncture language) followed by 'No linking gloss here: the symbol is order-dependent - (p/q) = -(q/p), swap the inputs and the banner flips - while lk is symmetric (proved twice on this tab); the Hopf/unlink dictionary is reserved for pairs with a prime = 1 (mod 4).' Other classes unchanged ((5,13) still renders 'the Hopf pair'). Rendered output verified for (3,7), (7,3), (5,13). New self-test: (3/7) = -1 and (7/3) = +1. (5527c4e)

### R2-M4 (Master, round 2)

**Issue.** Same well-definedness failure via unit twists: theta'' = -(10+sqrt101)^2*theta passes the only displayed check yet generates a totally imaginary field ramified at infinity, invisible to the mod-449 computation since (-1/449) = +1.

**Resolution.** Theta tooltip extended with the mechanism: norm-1 factors via Hilbert 90, the twist K(sqrt(N(xi) theta)), and the worked xi = 10+sqrt101 (norm -1) case producing the imaginary infinity-ramified K(sqrt(-theta)), invisible mod 449 because (-1/449) = +1. quadTower sqrt(theta) tooltip now says it is this K - Galois, real, ramified only at 5, 8081, 101 - that the symbol reads. New self-test: theta'' passes the identity, all four conjugate symbols still -1 with (-1/449) = +1 checked live, totally negative, rejected by positivity. (23f480f (prose tightened in a5f6cfb))

### R2-M5 (Master, round 2)

**Issue.** For (3,7) the Hilbert panel prints 'forces (p/q)(q/p) = 1' and 'collapses to (p/q)(q/p) = 1' while its own rows three lines up display (3/7)(7/3) = -1; both hard-coded conclusion strings suppress the 2-adic factor unconditionally.

**Resolution.** Product-row cell and note are now conditional on the v = 2 factor: unchanged when it is +1; when it is -1 the cell reads 'forces (p/q)(q/p) = -1 - the -1 is the v = 2 factor' and the note collapses the formula to (p,q)_2*(p/q)(q/p) = 1 with (p,q)_2 = -1, keeping the closedness framing honestly. Rendered output verified for (3,7) and (5,13). New self-test: (3,7) has 2-adic factor -1, (p/q)(q/p) = -1, full product +1. (7704cf1)

### R2-M6 (Master, round 2)

**Issue.** Both zeta-tab tooltips display Sigma(-1)^i while silently computing with Sigma(-1)^(i+1): the full alternating count is 1 - tr (a sign, not just an H0 constant), and Fix = tr - 2 is honest only as #Fix = -L_full via fixed-point index -1.

**Resolution.** Face-1 tooltip: L(h^n) = tr on H1 alone; the full Lefschetz number equals 1 - tr for the fiber surface - 'the H0-term MINUS ours: a sign as well as a constant' - and the alternating-product Lefschetz zeta equals det(I - t h*)/(1-t), our zeta_h reciprocated over (1-t); bridge stated so no sign is hidden. Face-3 tooltip: derives Fix = tr - 2 as #Fix = -(2 - tr(A^n)) with the index -1 named; constants are the H0/H2 traces, the overall sign is the fixed-point index. Line-503 note: Milnor's theorem given first in the literature's convention, zeta_Lef = Delta_K/(1-t) with Alexander in the numerator, then translated to zeta_h = Delta_K^(-1). No computed value changes; R1-M5's tests untouched and green. (6edf60e)

### R2-N1 (Novice, round 2)

**Issue.** Line 476's 'the word' has no antecedent: [[x₁,x₂],x₃] is never identified as ℓ₄, K₄'s longitude in Milnor's model B₄, nor is the X₁X₂X₃-coefficient rule or the delete-Kᵢ = set-xᵢ = 1 substitution stated, breaking the template Triples steps 2/4 established.

**Resolution.** index.html #b4WordNote (line 476) now reads: 'Delete ANY component — algebraically, set that xᵢ = 1 — and the word below, ℓ₄ = [[x₁,x₂],x₃] (K₄'s longitude in Milnor's model B₄, written in the meridians x₁, x₂, x₃ of the other three), collapses to 1: …'. The magnus-box tooltip on [[x₁,x₂],x₃] (renderMagnus) now ends: 'This word is ℓ₄, K₄'s longitude in the model B₄, and μ̄(1234) is its X₁X₂X₃-coefficient — exactly as ℓ₃ = [x₁,x₂] and the X₁X₂-coefficient were Triples steps 2 and 4, one level up.' The honest note's 'algebraic certificate below' now has a named antecedent directly above it. (a84240c)

### R2-N2 (Novice, round 2)

**Issue.** The two rows the 'same proof' table stands on — v = p and v = q — have a why-column that restates notation ('(q/p) — the symbol (q/p)') while every other row carries an actual reason, leaving the identity (p,q)_p = (q/p) unjustified in both the static table and the live Hilbert table.

**Resolution.** 

### R2-N3 (Novice, round 2)

**Issue.** Step 5 shows four residues and four symbols but never states the rule taking them to the banner (symbol = common value = splitting of 449 in K; agreement = well-definedness), and the banner's rendered logic can only print '−1' or a bare '?'.

**Resolution.** index.html renderQuadSteps: step-5 head now reads 'Four conjugates …' with a tooltip: the four residues are the Galois conjugates of θ mod 449; 'does 449 split completely in K = k₅,₈₀₈₁·k₁₀₁,₈₀₈₁(√θ)?' reduces to: are they all squares? their common value is the symbol (+1 splits / −1 not), and the agreement of all four is the well-definedness check, witnessed live — Triples step 4, one level up. Step-5 body appends the reading ('— 449 does not split completely in K', conditional). Banner now renders three outcomes: −1 (arithmetic B₄), +1 ('449 splits completely in K: unlinked at the fourth level'), or disagreement ('symbol undefined'); allNeg/allPos computed once before the step is pushed. (53dc415)

### R2-N4 (Novice, round 2)

**Issue.** H₁ is never introduced at any level anywhere in the app, though the Zeta topology column's central objects are 'eigenvalues of h∗ on H₁(F;Q)' and 'the monodromy acts on H₁ by A' — the one load-bearing term without even a black-box tooltip, unlike ∆_L which got exactly this treatment in R1-N3.

**Resolution.** index.html line 500 face title: H₁(F;Q) now carries a tooltip — 'H₁ of a space, black-box (the ∆_L standard of the Pairs tab): closed loops up to deformation and merging form an abelian group. For a torus — punctured or not — it is Z², generated by the two core loops; any continuous self-map merges loops linearly, inducing a 2×2 integer matrix h∗. That matrix is all this column uses.' Placed at the eigenvalue face, upstream of line 518's 'acts on H₁ by A' and the live table. (6461784)

### R2-N5 (Novice, round 2)

**Issue.** Two adjacent displays of the same product contradict as written: face 3 (line 502) is orbit-indexed with exponent −1, while the live panel (line 2167) kept index γ but exponent −o_γ — literally a different function from what the code computes (one factor (1−t^d)^{−o_d} per period d).

**Resolution.** index.html renderLefschetz: live label is now '∏_d (1 − t^d)^{−o_d}'; the muted note after the Artin–Mazur pair adds '(this product runs over periods d, with o_d the table's primitive-orbit count; grouping the orbit-indexed face-3 product ∏_γ by period |γ| = d gives exactly one factor (1 − t^d)^{−o_d} per period)'; the source comment at the fig8 block now reads ∏_d (1−t^d)^{−o_d} — periods d. No computed value changed. (8ed3e9f)

### R2-N6 (Novice, round 2)

**Issue.** The 'sum over ideals' face displays a number whose defining inputs (how many ideals of each norm) exist only in a source comment; the page's pointer 'norms counted by the splitting recipe' resolves to nothing on the page.

**Resolution.** index.html line 532: '(sum over ideals)' now carries a tooltip — 'What is summed: a(n)/n², a(n) = #ideals of norm n. Split p ((p/5) = +1): two prime ideals of norm p, a(p^k) = k+1. Inert p: one of norm p², so a(p^k) = 1 (k even), 0 (k odd). Ramified: a(5^k) = 1. Multiplicative in n — so a(4) = 1, a(11) = 2, a(19) = 0: hand-checkable at small N.' Line 536's pointer now reads 'the splitting recipe — the tooltip above'. (3f387e3)

## Dialogue highlights

### round1

- **R1-M1 (Master/arith)** at function redeiSymbol, line 671 (checks at lines 673-680), together with the Triples-tab tooltip at l: Your function's docstring says the symbol is "certified" by any (x,y,z) with x² − p₁y² − p₂z² = 0, and your tooltip asserts the Rédei field is "independent of the solution chosen." Both are false as stated: redeiSymbol(13,61,937, 115,30,5) passes every check you perform — identit...
- **R1-M2 (Master/arith)** at Dictionary-table tooltip at line 308: "The characteristic power series of the Galois group of the ma: Over Q there is no "rank-r tower of ℓ-adic extensions unramified outside S" for r ≥ 2. For ℓ ∉ S the Galois group of the maximal abelian extension of Q unramified outside S is ∏_{p∈S} Z_p^× modulo the global units, whose pro-ℓ part is ∏_{p∈S} (ℓ-part of Z/(p−1)) — finite; for you...
- **R1-M3 (Master/arith)** at renderLegendreTable, lines 987-1010: the invalid-input branch at line 987 sets a warning but returns: Enter (p, q) = (21, 13). Since legendre(13n, 21n) happens to return +1 (Euler's criterion with the composite modulus 21 is meaningless but does not throw here) and legendre(21n, 13n) = −1, the page renders — beneath a mere warning — the row "(13/21) = +1", a red failure row "(p/q...
- **R1-M4 (Master/topo)** at function redeiSymbol, index.html lines 671-682; tooltip at line 432 ("independent of the solution ch: redeiSymbol accepts any integer certificate (x,y,z) satisfying x² − p₁y² − p₂z² = 0 with (p₁/q) = (p₂/q) = +1, and returns the Legendre symbol of x + y√p₁ mod q. On that acceptance domain the return value is not a function of (p₁,p₂,q): scaling a certificate by k multiplies α by ...
- **R1-M5 (Master/topo)** at zeta-face boxes at lines 499-501 (three expressions all set equal to ζ_h(t)); sub at line 517 ("All : Lines 499-501 bind one symbol ζ_h(t) to three expressions: exp(Σ L(hⁿ)tⁿ/n) with your declared convention L(hⁿ) := tr(hⁿ∗|H₁), det(I − t·h∗)⁻¹, and the orbit product ∏_γ(1 − t^{|γ|})⁻¹. The first two are identically equal, but the orbit product equals exp(Σ Fix(hⁿ)tⁿ/n), and your...
- **R1-M6 (Master/topo)** at Triples tab, renderTopoTripleSteps step 2 at line 1377 ("Because every lk = 0, the curve K3 traces i: The tooltip's biconditional is false: vanishing exponent sums characterizes membership in the commutator subgroup, not being a commutator — [x₁,x₂]² has zero exponent sums and is famously not a commutator in F(x₁,x₂) (Wicks). More importantly, step 2 presents ℓ₃ = [x₁,x₂] as a co...
- **R1-N1 (Novice)** at C:\Users\seand\claude_prime\index.html, line 298 (Dictionary tab, opening paragraph): "using the sma: I read this semicolon list as two correspondences — Hopf link ↔ (5, 29), Borromean rings ↔ (13, 61, 937) — because the second pairing IS a correspondence (both carry the nontrivial triple invariant). So I filed away "(5, 29) is the arithmetic Hopf link." Then the Pairs tab told m...
- **R1-N2 (Novice)** at Line 342 (Pairs tab, Arithmetic panel sub): "(p₁/p₂) := Frob_{p₂}(√p₁)/√p₁": This is the only definition of the Legendre symbol offered in main text anywhere in the app, and it is the one I cannot use: I do not know what Frob is as a function, what applying it to √p₁ means, or why the quotient is ±1. The definition I could fully own with my background — (...
- **R1-N3 (Novice)** at Line 391 (Pairs tab, 'What the polynomials say at this stage'): "∆_Hopf(t₁,t₂) ≐ 1 — a unit, as triv: What polynomial? I stopped at ∆_Hopf: no main text anywhere says what the Alexander polynomial is, where the variables t₁, t₂ come from, or by what right a link has a polynomial attached to it at all. The only definition on offer is the Dictionary tooltip (line 308: "the order of...
- **R1-N4 (Novice)** at Triples tab, rendered steps 2–3 (source lines 1405 and 1412–1413): "its longitude — lies in [F,F]" a: I know commutator subgroups, so [F,F] is notation I can read — but F is never identified. Free group? On which generators? The answer ("the Magnus expansion embeds the free group on x₁,…,x_n…") first appears in a tooltip one tab LATER, in the Quadruples magnus box (line 1901). Li...
- **R1-N5 (Novice)** at Zeta tab, lines 499–500 (first two 'faces'): "ζ_h(t) = exp( Σ_{n≥1} L(hⁿ)·tⁿ/n )" followed by "ζ_h(t: The whole tab is framed as "a sum, resummed as a product, in two different ways" (line 494; also line 298 and the caption at line 549) — but the identity that actually performs the resummation is never shown. At line 499 I stopped: why exp, and why tⁿ/n? At line 500 the product f...
- **R1-N6 (Novice)** at Quadruples tab, rendered step 3 (source line 1950): "3. The new level: θ = 25 + 2√5 + 2√101, with (2: Which α? Step 2 (lines 1918–1922) defined three different Rédei elements: α = 241 + 100√5 for (5, 8081), 11 + 2√5 for (5, 101), and 1009 + 100√101 for (101, 8081). The app's core promise is that I can check every displayed identity, but this one is uncheckable as written: I could...

### round2

- **R2-M1 (Master/arith)** at renderQuadSteps step 3, C:\Users\seand\claude_prime\index.html lines 1950–1954 (tooltip on θ at line: Step 3 presents x'² − 101y'² − α = 0 as θ's "defining identity" and checks exactly that (two component identities, lines 1952–1953) — nothing else — and the banner then typesets the result in 4-ary symbol notation, i.e. as a function of the four primes. It is not. Take θ' = (494 ...
- **R2-M2 (Master/arith)** at renderFrobenius, C:\Users\seand\claude_prime\index.html lines 2337–2340 (r = 0 text: "completely unl: 107 ≡ 3 (mod 4). So the Ladder tab's flagship, default-rendered example of the triple level — "q = 107 splits completely in k₁₃,₆₁ … completely unlinked from the pair, through the triple level," pinned by the self-test at line 2495 — is an argument at which the artifact's own red...
- **R2-M3 (Master/arith)** at renderLegendreTable banner, C:\Users\seand\claude_prime\index.html lines 1049–1056 (inert branch lin: For inputs both ≡ 3 (mod 4) the banner's topological glosses assert a linking interpretation that cannot exist. Enter (p, q) = (3, 7): (3/7) = −1, and the page typesets "−1 — 7 is inert in Q(√3): the Hopf pair", tooltip claiming this is "the mod-2 shadow of lk = ±1". Swap the inp...
- **R2-M4 (Master/topo)** at renderQuadSteps step 3 (index.html lines 1944-1954, the θ block and its tooltip 'Its defining identi: Step 2 of this very tab now displays live Rédei-normalization checks for each α because Round 1 established that the defining identity alone does not determine the field or the symbol — yet step 3 certifies θ = 25 + 2√5 + 2√101 by nothing but the identity (25+2√5)² − 101·2² − α =...
- **R2-M5 (Master/topo)** at renderHilbertTable (index.html): line 1084, product-row cell 'forces (p/q)(q/p) = 1', and line 1086,: For the legal input p = 3, q = 7 — a case the same render path now handles deliberately (the warn text at line 1026 explains 'Both ≡ 3 (mod 4): reciprocity flips sign, (p/q) = −(q/p) — the −1 is exactly the 2-adic factor in the product formula below', and the reciprocity row at l...
- **R2-M6 (Master/topo)** at Zeta tab, face-1 tooltip at line 499 ('L(hⁿ) here denotes tr(hⁿ∗ on H₁) — the interesting part of th: The alternating count you write down, Σ(−1)ⁱ tr(hⁿ∗ on Hᵢ), equals tr(H₀) − tr(H₁) = 1 − tr(Aⁿ) for the fiber surface: it differs from your L(hⁿ) = tr(Aⁿ) by a sign, not 'only by the constant H₀-term'. The sign is load-bearing: exponentiating the true alternating counts gives 1, ...
- **R2-N1 (Novice)** at index.html Quadruples tab — line 476 (#b4WordNote: "Delete ANY component and the word collapses to 1: Line 476 says "Delete ANY component and the word collapses to 1" — which word? At that point no word has appeared on the tab; the referent only shows up lower, in the magnus box, as [[x₁,x₂],x₃]. And when it does appear, it is never identified. The Triples tab taught me the whole...
- **R2-N2 (Novice)** at index.html Pairs tab — static "same proof" table rows lines 382-383 ("the surviving factor at v = p:: The section is titled "one proposition, two proofs, one mechanism" and line 377 promises "The two proofs are the same proof — entry by entry." I could verify every entry of the topology column, and every OTHER row of the Hilbert table carries an actual reason: v = ∞ has "both p, ...
- **R2-N3 (Novice)** at index.html Quadruples tab — renderQuadSteps step 5 (lines 1998-2001: four conjugate values and symbo: Step 5 shows me four residues and four Legendre symbols {−1, −1, −1, −1}, and the banner then declares [5, 8081, 101, 449] = −1. What is the rule that takes step 5 to the banner? On the Triples tab this inference was stated: step 4's tooltip explained that "does 937 split complet...
- **R2-N4 (Novice)** at index.html — line 394 (first main-text use, Pairs: "the arithmetic side's H₁-of-the-cover"), line 50: H₁ is never introduced anywhere in the app, at any level, and the entire Zeta topology column runs on it. I first hit it at line 394 ("H₁-of-the-cover") where I could coast, but at line 500 the object of study is literally "eigenvalues of h∗ on H₁(F;Q)" and at line 518 the demo's...
- **R2-N5 (Novice)** at index.html Zeta tab — renderLefschetz line 2167 displays "∏_γ (1 − t^{|γ|})^{−o_γ}" (same notation i: The static face-3 formula (line 502) and the live panel's version of the same product (line 2167) contradict each other as written, and I stopped when I tried the coefficient check the panel invites. Line 502 indexes over orbits γ with exponent −1: each primitive orbit contribute...
- **R2-N6 (Novice)** at index.html Zeta tab — line 532 ("Σ_{N(𝔞)≤N} N(𝔞)⁻² (sum over ideals)") and line 536 ("the ideal sum : The first of the three converging numbers is labeled "sum over ideals," and I cannot compute or even spot-check it: nothing on the page says what is being summed. The N(a) tooltip (line 507) tells me the norm of an ideal but not how many ideals of each norm exist, and line 536's ...
