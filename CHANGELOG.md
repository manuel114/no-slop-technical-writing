# Changelog

Changes to the skill, the check script and the supporting files. Versions follow
[semantic versioning](https://semver.org): a new pattern or check is a minor version, a fix to a
false alarm or a wording change is a patch. The version in `SKILL.md` and `package.json` matches the
latest entry.

## [Unreleased]

## [0.1.0] - 2026-10-20

First shareable version.

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
- README with install steps for Claude Code, Cursor, OpenAI Codex and other agents.

### Changed

- The bold limit no longer counts bold that labels a list item.
- Hit samples print on one line.
