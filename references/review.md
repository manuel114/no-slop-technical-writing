# Review before it ships

Two passes: the check script for the mechanical patterns, then an adversarial read for what a
script can't see. Run both on anything longer than a few paragraphs; for short copy, the read
alone is enough.

## 1. The check script

[`scripts/check.mjs`](../scripts/check.mjs) flags every pattern marked **(check)** in
[avoid.md](avoid.md). It has no dependencies and reads Markdown or HTML (for HTML it drops styles,
scripts and code, and keeps headings and bold).

```bash
node scripts/check.mjs file.md
node scripts/check.mjs page.html --max-bold 3
node scripts/check.mjs file.md --json --strict
```

Options: `--max-bold N` (default 3), `--allow-em-dash` where house style permits them, `--json`
for a machine-readable report, and `--strict` to exit 1 at three or more hits (for CI).

It prints each hit with its line, a verdict (Clean / Review the hits / Rewrite), and a separate
list of ", not …" phrases to read by hand. Aim for Clean. Fix every hit you can't justify, and say
which you kept and why. Quoted examples of bad writing (in a style guide, say) will trip it. Wrap them in
`<!-- check:off -->` and `<!-- check:on -->` to leave them out.

## 2. The adversarial read

The writer reads past their own tells. So the read is done by a reader whose only job is to find
slop: for anything long or high-stakes, a separate agent with no stake in the phrasing. Default to
flagging when unsure.

Read against every entry in [avoid.md](avoid.md), and especially the ones no script finds:

- **Performing every sentence**: a steady beat of punchlines where most sentences should just
  carry a fact.
- **Groups of three** chosen for rhythm.
- **Invented detail** and **claims with no receipt**: each number traced to a measurement, a
  source, or a calculation on the page.
- **Rules that don't exist** and **assumptions about others**.
- **Term drift**, **mixed estimates** (true, observed, proven), **unlabelled worst cases**,
  **history** and **defending**.

Then check it against [replicate.md](replicate.md): claim first, headings that say what the section
finds, prose not bullets, the sentence after each chart interpreting rather than describing.

Report each hit as three things: **the quoted phrase**, **which pattern it is**, and **the plain
rewrite**. One hit is forgivable; **three or more means the piece reads as machine-written and is
rewritten** before it ships.

## The fix

Write the plain declarative sentence and let the fact carry it: state the number flatly, and cut
any detail that isn't in the sources.
