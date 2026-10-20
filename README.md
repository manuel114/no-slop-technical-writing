# no-slop-technical-writing

An agent skill for writing technical content that is plain and exact: how a system or method works,
the maths behind a decision, a measurement write-up, a design note. The model is the data-led
research note. The claim comes first with its numbers, each chart or table carries one finding, and
the sentences between them are flat statements of fact.

The skill has two halves. The writing rules tell the agent how to structure a piece, name terms,
handle numbers and state limits. The review half is a catalogue of 68 patterns that make text read
as machine-written, a check script for the 40 of them that a script can find, and an adversarial
read for the rest.

It follows the [Agent Skills](https://agentskills.io) `SKILL.md` format, so it works in Claude
Code, Cursor, OpenAI Codex and other agents that read that format.

## Before and after

The same CI caching write-up, first as an agent tends to produce it, then after the skill.
Both are in [examples/](examples/).

<!-- check:off -->

> **Before** ([examples/sloppy.md](examples/sloppy.md))
>
> In today's fast-paced world of software delivery, CI pipelines play a crucial role in how teams
> ship. In this post, we'll walk through how we unlocked dramatically faster builds. Let's dive in.
>
> It's not just about speed, it's about developer happiness. Slow builds don't just waste minutes;
> they break focus — and focus is the new currency. Studies show that context switching is costly.

<!-- check:on -->

> **After** ([examples/clean.md](examples/clean.md))
>
> A dependency cache made the average CI build 3.3 minutes shorter over 30 days: 5.8 minutes
> across 412 builds with the cache, against 9.1 minutes across 398 builds in the 30 days before.
> That is 22.8 hours of runner time a month, about $11 at $0.008 a runner-minute. The cache pays
> for itself whenever more than 11% of builds find it warm; this trial saw 87%.

The check script finds 12 hits in the first version's six sentences, and none in the second. The
second also leads with the result, says what it rests on, and gives the condition under which it
stops being true, which no script checks.

## What the check script reports

[`scripts/check.mjs`](scripts/check.mjs) reads a Markdown or HTML file and lists every hit with its
line. On the full sloppy example it reports 39 hits (first lines shown):

```text
$ node scripts/check.mjs examples/sloppy.md
examples/sloppy.md: 39 hits. Rewrite: 3 or more hits reads as machine-written.

Reversal (it's not X, it's Y) (2)
  line 6: It's not just about speed, it's
  line 27: isn't just a nice-to-have; it's

Colon set-up (1)
  line 11: Here's the thing:

Grand opener (1)
  line 3: In today's

Tacked-on -ing clause (2)
  line 13: , highlighting
  line 20: , underscoring
...
```

On the clean example it reports `examples/clean.md: 0 hits. Clean.`

The verdict has three levels: Clean (no hits), Review the hits (one or two), and Rewrite (three or
more). Phrases of the form ", not X" are listed separately to read by hand, because some of them
state a real distinction ("the lower bound, not the observed share").

Options:

| Flag | Effect |
| --- | --- |
| `--json` | Print a machine-readable report |
| `--strict` | Exit with code 1 at three or more hits, for CI |
| `--max-bold N` | Allow up to N bold phrases in prose (default 3; bold that labels a list item doesn't count) |
| `--allow-em-dash` | Don't flag em dashes, where house style allows them |

Quoted bad examples, such as a style guide's, can be left out by wrapping them in
`<!-- check:off -->` and `<!-- check:on -->`. Code, front matter, tables and URLs are skipped
already. The script needs Node.js 22 or later and has no dependencies.

## Install

The skill is the whole folder: `SKILL.md` loads files from `references/`, `scripts/` and
`templates/`, so copy all of it. Some agents require the folder name to match the `name` in
`SKILL.md`, which is `no-slop-technical-writing`.

### Claude Code

For every project:

```bash
git clone https://github.com/manuel114/no-slop-technical-writing ~/.claude/skills/no-slop-technical-writing
```

For one repository, clone it into `.claude/skills/no-slop-technical-writing` at the repository root
instead. Claude Code picks the skill up on its own when a request matches its description, and
`/no-slop-technical-writing` runs it directly.

### Cursor

Cursor reads skills from `.cursor/skills/` or `.agents/skills/` in a project, and from
`~/.cursor/skills/` for every project ([Cursor docs](https://cursor.com/docs/skills)). It also
reads `.claude/skills/`, so a copy installed for Claude Code works in Cursor without a second copy.

```bash
git clone https://github.com/manuel114/no-slop-technical-writing ~/.cursor/skills/no-slop-technical-writing
```

### OpenAI Codex

Codex reads skills from `.agents/skills/` in the repository and from `~/.agents/skills/` for every
project ([Codex docs](https://developers.openai.com/codex/skills)).

```bash
git clone https://github.com/manuel114/no-slop-technical-writing ~/.agents/skills/no-slop-technical-writing
```

### Other agents, or a plain copy

Any agent that reads `SKILL.md` folders takes the same folder; put it wherever that agent looks for
skills. For a tool without skill support, add the contents of `SKILL.md` to its instructions file
and keep the rest of the folder next to it, so the links to `references/` resolve. The check script
runs on its own anywhere Node.js 22 is installed:

```bash
node path/to/no-slop-technical-writing/scripts/check.mjs draft.md
```

To fail a CI job on a sloppy document, run it with `--strict`.

## Using it

Ask for the kind of piece the skill covers, for example "write up the benchmark results as a
research note", "explain how the retry budget works", or "de-slop this design doc". The agent
outlines first, drafts with every number computed, then runs the review in
[references/review.md](references/review.md): the check script, then a read against the
catalogue by a reader whose only job is to find slop.

For a standalone page, [templates/page.html](templates/page.html) is a single-file HTML research
note with light and dark themes, line and bar chart helpers with data tables, and binomial
statistics helpers.

## What's in the repository

| Path | What it holds |
| --- | --- |
| [SKILL.md](SKILL.md) | The rules: structure, voice, numbers, process |
| [references/avoid.md](references/avoid.md) | Patterns to avoid, each with an example and the fix |
| [references/replicate.md](references/replicate.md) | Research-note patterns to copy, with the published pieces they come from |
| [references/charts.md](references/charts.md) | Chart rules |
| [references/review.md](references/review.md) | The review pass |
| [scripts/check.mjs](scripts/check.mjs) | The check script |
| [templates/page.html](templates/page.html) | The HTML page shell |
| [examples/](examples/) | The before and after samples |
| [tests/](tests/) | Tests for the check script |

## Tests

```bash
node --test
```

Each check has a case that must fire it and a near miss that must not. Further cases cover the
places a pattern checker tends to misfire: tables, lists, URLs, code, front matter, decimals,
`check:off` regions, and statistics terms such as "true recall" or "the real rate". The suite
also runs the checker on every Markdown file in this repository, except the sloppy example, and
fails if any is not Clean. CI runs it on Node.js 22 and 24.

## House style

The rules are defaults. A project can add its own (banned words, required terms, a ban on em
dashes) in a small skill of its own that loads this one first. See
[CONTRIBUTING.md](CONTRIBUTING.md) to report a false alarm or propose a pattern.

## License

MIT. See [LICENSE](LICENSE).
