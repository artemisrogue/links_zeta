# Audit process — how to check this app efficiently and correctly

Notes for whoever (human or AI, any model tier) runs the next correctness pass on
`index.html`. Read this before starting; it exists specifically to stop the next pass from
re-paying costs this session already paid.

## The two defect classes, and why they need different tools

Every real defect found across many audit rounds on this app falls into one of two shapes,
and they call for different verification strategies. Diagnose which one you're looking at
before picking a tool.

**1. External fact-checking** — a citation, theorem statement, or definition is wrong against
the literature (right author/plausible year/wrong specific paper; a theorem name that doesn't
exist; a chapter number that's stale against a newer edition). Fix: check
[`citation-corpus.md`](citation-corpus.md) first. It's cheaper and more reliable than a fresh
web search, because it was built by actually fetching primary sources rather than trusting
search-result summaries. Only WebSearch/WebFetch for citations not yet in the corpus, and
add a verified entry when you do.

**2. Internal self-inconsistency** — nothing external is wrong; the app just stopped agreeing
with itself. A caption says one thing, an aria-label a screen reader hits says another; a
tooltip's field-degree claim contradicts the figure eighteen pixels away; a self-test restores
state from the wrong source and leaks a stale caption into the boot view. A citation corpus
does nothing for these. The lever here is different: **encode the invariant as a permanent
self-test**, don't just fix the prose. A prose fix gets re-broken by the next edit; a
mutation-tested self-test catches it forever for free. See "Converting a finding into a test"
below.

A useful sanity check when triaging a finding: if fixing it required opening a browser tab to
a journal page, it's class 1. If fixing it required reading two parts of the *same* screen
against each other, it's class 2.

## Converting a finding into a test — and verifying the test itself

Every fix in this project's history that mattered got a self-test, following the pattern
already established in the suite (search `runSelfTests()` for `t("DOM:` to see the existing
ones). When you add one:

1. **Write the test as an assertion about state, not about a specific string surviving.**
   Prefer "the sync note is non-empty iff the pair is in the licensed case" over "the sync
   note contains this exact sentence" — the former survives future rewording, the latter
   breaks the next time someone improves the prose.
2. **Mutation-test it before trusting it.** Copy the file, revert your fix in the copy (or
   inject the specific wrong value you're guarding against), run the suite against the copy,
   and confirm your new test is the one that fails — and that it's the *only* new failure. Do
   this by rebuilding the mutant fresh against the current file each time; a stale mutant from
   an earlier edit will give you a false read. This session's mutation-testing habit caught
   three otherwise-invisible test bugs (below) that would have shipped as false confidence.
3. **Check the test at BOOT, not just when manually clicked.** `runSelfTests()` runs once at
   page load and its results sit in the DOM before any button is pressed. A test that only
   gets exercised correctly after a user clicks "Run self-tests" can still ship a false-green
   boot state — this exact gap let a false caption sit on the live site for roughly an hour
   earlier this session. If your invariant matters at rest, assert it against a snapshot taken
   before any test-suite side effects run (see `PAIRS_AT_LOAD` in the source for the pattern),
   and place tests whose correctness depends on running *after* other tests' side effects
   (state-mutating probes) at the **end** of the registration order.

## Traps specific to this codebase — found the hard way, don't rediscover them

- **Some code named after one tab physically belongs to another.** `renderSurfaceLadder`,
  `sladderBox`, `rung1/2/3*`, and `gammaComputed`/`renderGammaComputed` all sound Ladder-tab
  content but write DOM ids that live inside `<section id="tab-triples">` — they're the
  "surface ladder" pedagogical subsection of Triples, not the Ladder tab. The same pattern
  recurs with `renderQuad449Worked`, `n4Matrix`/`n4RulePredict`/`n4RuleCheck`/`n4ChiCases`,
  and `renderB4Worked` — all "quad/n4"-flavored names whose cards physically live inside
  `<section id="tab-zeta">` as worked-example summaries, not inside Quadruples. **Never assign
  code to a file/section by what its identifier sounds like — grep the actual `$id(...)`/
  `#id` targets in its body and confirm which `<section>` those ids live in.** Found while
  splitting `index.html` into per-tab source files (src/tabs/*.js); a name-matching split
  would have silently misfiled both clusters.
- **`data-tip` is CSS `content: attr(...)`, i.e. plain text.** Any HTML tag inside a `data-tip`
  attribute value — `<i>`, `<sub>`, anything — renders literally on screen as visible angle
  brackets. Never put markup in a `data-tip`. (Five tooltips shipped this way in one session
  before a guard test existed; the test now scans all `data-tip` values for tag-shaped
  substrings.)
- **A `"` character inside a `data-tip="..."` value silently truncates the attribute** at the
  browser's HTML parse layer — everything after it is lost, with no error. Never quote a
  paper title or phrase with literal double quotes inside a `data-tip`; state it unquoted
  (the app's own citation style already does this — `Cited: Author, Venue Vol (Year)`, no
  quotation marks around the title).
- **`.innerText` returns empty for content inside a closed `<details>` element.** A test
  checking `document.body.innerText` for a banned or required phrase will pass vacuously if
  that phrase lives inside a collapsed card — which most of this app's content does by
  default. Use `.textContent` when you need the check to be state-independent.
- **`<script>` is a DOM child of `<body>`.** `document.body.textContent` includes the full
  source text of every `<script>` tag — including your own test's comments and string
  literals. A test checking `body.textContent` for a banned phrase can trip on its own source
  code the moment that phrase appears in an explanatory comment. Scope such checks to `<main>`
  (or another container that excludes `<footer>`/`<script>`), not `<body>`.
- **Multi-step string-replacement edits are where syntax errors hide.** A single `.replace()`
  call that's individually well-formed can still leave a dangling parenthesis when a *second*
  `.replace()` is meant to complete a fragment the first one left mid-expression. If you must
  edit in steps, re-read the full resulting block afterward rather than trusting each step's
  local correctness — and always check for a live JS `pageerror` after any test-suite edit,
  not just the button's displayed pass count. A broken `<script>` block leaves the suite frozen
  at its static "Run self-tests" label, which reads as "hasn't been clicked yet," not as
  "broken" — easy to miss if you only glance at the button text.
- **Compound "fix" edits break the thing they were fixing.** Twice this session, correcting
  one clause of a sentence silently changed what a pronoun or antecedent two clauses later
  referred to (θ's "that compositum" rebinding to a degree-4 field instead of the intended
  degree-32 one). After any prose fix that touches a sentence with more than one clause,
  re-read the *whole* sentence, not just the diff — and where the app draws a figure showing
  the same fact (a tower diagram, a table), cross-check the fixed sentence against the figure
  before shipping.
- **CSS pseudo-elements (`::after`/`::before`) can't host injected child DOM.** The `.tt`
  tooltip's box is `content: attr(data-tip)` on a `::after` — pure text, by construction. Real
  rendered content (KaTeX output, or anything else needing actual child elements) needs a real
  DOM node, not a pseudo-element. `.tt-katex` (added in the KaTeX pilot) works around this by
  adding a genuine child `<span class="tt-bubble">` instead, gated behind a `.katex-on` class
  that's only added once KaTeX has actually rendered into it — see `shared/tooltips.js`
  `ttKatexUpgrade()`.
- **LaTeX inside a JS template literal needs every backslash doubled.** `\bigl`, `\Delta`,
  `\mathbb{Z}` etc. all start with `\`, and JS string/template-literal escaping treats some of
  those as real escape sequences (`\b` is backspace) and silently drops the backslash on
  unrecognized ones — either way the LaTeX corrupts silently, no error. Static HTML attributes
  (`data-latex="..."` in a `.html` file) don't have this problem; only LaTeX embedded in a
  `.js` file's template-literal string does. Verified end-to-end (not just by inspection) by an
  independent fact-check agent tracing the actual runtime string KaTeX receives.
- **Two tooltips can share the exact same visible label text across different tabs.** Both the
  Dictionary tab and the Zeta tab have a `.tt` reading "Iwasawa polynomial" (different
  `data-tip`, same label). A `querySelector`/`find` keyed on visible text alone will silently
  grab whichever one is first in DOM order — usually the wrong one if you wanted a specific
  tab's copy. Scope the query to the tab's `<section>` (e.g. `#tab-zeta .tt`), not the whole
  document, whenever text content isn't provably unique.

## Verification checklist for any fix in this project

1. Suite green (`node maincheck.js` or equivalent) — check the actual boot state, not just a
   manual click.
2. Zero `pageerror` events on load.
3. Zero tooltip markup (there's a standing test for this — confirm it still passes).
4. Zero horizontal overflow at 360/500/700/900/1400px.
5. If you added a self-test, mutation-test it against a freshly rebuilt reverted copy.
6. Screenshot the affected card/tab and actually look at the image if the change is visual.
7. Verify live after deploy, not just locally — GitHub Pages builds lag the push by a minute
   or two; poll the build status rather than assuming the first "built" response is *your*
   commit's build.
