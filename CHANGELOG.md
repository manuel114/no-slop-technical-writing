# Changelog

Changes to the skill, the check script and the supporting files. Versions follow
[semantic versioning](https://semver.org): a new pattern or check is a minor version, a fix to a
false alarm or a wording change is a patch. The version in `SKILL.md` and `package.json` matches the
latest entry.

## [Unreleased]

### Added

- About 30 more patterns in `references/avoid.md`: stacked rhetorical questions, stranded contrasts,
  missing bridges, hollow intensifiers, template phrases, transition fillers, vague endorsements,
  "despite challenges" formulas, moral adjectives on things, analogy stacking, walls of text,
  uniform paragraph length, unnecessary hyphens, label full stops, synonym cycling, unexplained
  names and terms (which replaces the narrower "undefined jargon"), and a section on social and chat
  copy (hooks, launch openers, fake-casual register, reaction framing, engagement closers, hashtags,
  sycophancy, recap-flattery openers).
- A three-tier word list: tier 1 flagged every time, tier 2 when two or more share a paragraph,
  tier 3 only in bulk. About 100 words in all.
- **Keep:** notes on the noisiest rules, giving a case where the same words are fine.
- `--context technical|marketing|social|casual` sets how strict the check script is; the
  tolerance table is in `references/review.md`.
- The check script lists every short code and ID (DEV-6, E1, APP-123) at its first use, to check
  each is explained.
- An editing contract in `SKILL.md` for cleaning up someone else's draft.
- A labelled corpus in `tests/corpus/` (machine-like and human samples, each with its context) and
  `scripts/eval.mjs`, which scores the check script against it; `npm run eval`.

### Fixed

<!-- check:off -->

- "It is not X; it is Y" is now caught as a reversal, like "it's not X, it's Y".

<!-- check:on -->

- `references/charts.md` says which form the evidence for each kind of finding takes: a chart for
  a comparison or a change over time in collected data, a table for reference data, prose for a
  worked calculation or a forecast, quotes for interviews, a diagram for structure. The rule is
  sourced from eight a16z AI research notes. `SKILL.md` points to it, and its outline step now asks
  for the form of each finding's evidence.
- Chart rules for a source line under every chart, labelled events and trend lines, and SVG charts
  drawn from code for Markdown pages.
- `examples/clean.md` has two charts, drawn by `examples/charts/make-charts.mjs`: the cost of a
  request by part, and the saving by time of day. The break-even hit rate is worked out in prose.

### Changed

- A chart's finding can be stated in its title or in the heading or sentence just above it, with
  the title then saying what is measured.

### Fixed

- Line numbers in the report now match the source after front matter, fenced code and `check:off`
  regions, and HTML hits point to the line in the HTML file.
- Curly apostrophes and quotes match like straight ones, so a contraction typed with a curly
  apostrophe is caught the same way.
- Em dashes and bold inside Markdown tables no longer count, and HTML tables are skipped, as the
  README says.
- `references/review.md` runs the script from the installed skill folder, not the current one.

## [0.1.0] - 2026-10-20

First shareable version, named `no-slop-technical-writing`. Earlier private drafts were called
`technical-writing`.

### Added

- `SKILL.md` with rules for structure, voice, terms, numbers and process.
- `references/avoid.md`, a catalogue of 68 patterns to avoid, 40 of them marked as found by the
  check script.
- `references/replicate.md`, research-note patterns with links to the published pieces they come
  from.
- `references/charts.md` and `references/review.md`.
- `scripts/check.mjs`, a dependency-free checker for Markdown and HTML with `--json`, `--strict`,
  `--max-bold` and `--allow-em-dash`. It also exports `analyse()` for use from other scripts.
- `templates/page.html`, a single-file HTML research-note shell with chart and statistics helpers.
- `examples/` with a sloppy and a clean version of the same write-up.
- `tests/check.test.mjs`, run with `node --test`, and a CI workflow that runs it on Node.js 22 and
  24.
- README with install steps for Claude Code, Cursor, OpenAI Codex and other agents, and a demo
  GIF rendered from the check script's real output by `docs/make-demo.py`.

### Changed

- The bold limit no longer counts bold that labels a list item.
- Hit samples print on one line.
- `templates/page.html` has a viewport meta tag, so phones get the mobile layout, and its sample
  table lists every plotted point, so no value is visible only on hover.
