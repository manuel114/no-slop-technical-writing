# Changelog

Changes to the skill, the check script and the supporting files. Versions follow
[semantic versioning](https://semver.org): a new pattern or check is a minor version, a fix to a
false alarm or a wording change is a patch. The version in `SKILL.md` and `package.json` matches the
latest entry.

## [Unreleased]

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
