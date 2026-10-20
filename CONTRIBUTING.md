# Contributing

Issues and pull requests are welcome. The two most useful kinds are false alarms (the check script
flags text that is fine) and missed patterns (text that reads as machine-written and nothing flags
it).

## Reporting a false alarm or a missed pattern

Open an issue with the exact text, what the check script printed, and what you expected. Short
samples are best: one or two sentences that show the problem on their own.

## Changing a check

A change to `scripts/check.mjs` comes with tests in `tests/check.test.mjs`:

- A new check gets a row in `CASES` with at least one text that must fire it and one near miss that
  must not. The suite fails if a rule id in the script has no row.
- A fix for a false alarm adds the text that misfired as a negative case, so it stays fixed.
- A pattern that the script finds is marked **(check)** in `references/avoid.md`, or
  (partly checked) when it finds only the common forms.

Prefer missing a pattern to flagging good writing. A check that fires on ordinary technical prose
(a statistics term, a product name, a command-line flag) costs more trust than it earns.

## Writing for this repository

Every Markdown file here, except `examples/sloppy.md`, has to pass the check script with no hits,
and the tests enforce it. Wrap quoted bad examples in `<!-- check:off -->` and
`<!-- check:on -->`, and only those. Write in your own words: patterns in the catalogue are
described here, with sources linked where a rule comes from published work.

## Running the tests

```bash
node --test
```

Node.js 22 or later, no install step.

## The demo GIF

`docs/demo.gif` shows the check script's real output on the two examples. After changing the
script's output or the examples, render it again from the repository root with
`python3 docs/make-demo.py` (needs Pillow).

## Releasing

Add the changes under Unreleased in `CHANGELOG.md` as you go. To release, move them under a new
version heading with the date, set the same version in `SKILL.md` and `package.json`, and tag the
commit `vX.Y.Z`.
