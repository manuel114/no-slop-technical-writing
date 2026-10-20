<div align="center">

# no-slop-technical-writing

An agent skill for technical writing that reads like a data-led research note, with a check script
that flags machine-written patterns.

[![test](https://github.com/manuel114/no-slop-technical-writing/actions/workflows/test.yml/badge.svg)](https://github.com/manuel114/no-slop-technical-writing/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Agent Skills](https://img.shields.io/badge/format-Agent%20Skills-6f42c1)](https://agentskills.io)
[![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-informational)](CHANGELOG.md)
[![X @manuel_mch](https://img.shields.io/badge/X-@manuel__mch-black?logo=x&logoColor=white)](https://x.com/manuel_mch)

<img src="docs/demo.gif" alt="The check script reports 30 hits on a sloppy write-up, then 0 hits on a clean version of the same write-up" width="780">

</div>

---

Give this skill to your coding agent when you need a technical write-up, such as a design doc or a
benchmark report. It does two things.

1. **It writes the piece.** The result comes first, every number is computed in code, and the
   sentences are plain.
2. **It checks the piece.** The check script looks for 40 of the 68 patterns in the skill's catalogue of
   machine-written text, such as `It's not X, it's Y` or `Let's dive in`. The agent then rereads the
   piece against the whole catalogue; for a long or high-stakes piece, a separate agent does the read.

It works in Claude Code, Cursor and OpenAI Codex, and in other agents that read the
[Agent Skills](https://agentskills.io) format.

## Before and after

The opening of the same article about prompt caching, first in a deliberately sloppy version, then
written to the skill's rules. The full articles, including the clean one's two charts, are in
[examples/](examples/).

<!-- check:off -->

> **Before** ([examples/sloppy.md](examples/sloppy.md))
>
> In the rapidly evolving landscape of LLM applications, cost has become a crucial concern. We
> recently rolled out prompt caching for our support assistant — and the results were nothing short
> of transformative.
>
> It's not just about saving money, it's about unlocking the ability to scale. Cheaper prompts.
> Faster answers. Happier users.

<!-- check:on -->

> **After** ([examples/clean.md](examples/clean.md))
>
> A support assistant sends the same 6,000-token instructions with every request. Prompt caching
> (the provider keeps that repeated part and charges a tenth of the normal price to reuse it)
> brought the average request from 2.5 cents to 1.0 cent over 30 days, or from $1,026 to $427 for
> the month. **Caching saves money as long as more than 22% of requests find the cache warm; here
> 92% did.**

The check script finds 8 hits in the first version's six sentences and none in the second. The
first never says how much was saved. The second gives the saving with its numbers, explains
the one term a reader may not know, and says when caching stops paying.

## What the check script reports

[`scripts/check.mjs`](scripts/check.mjs) reads a Markdown or HTML file and lists every hit with its
line. On the full sloppy example it reports 30 hits (first lines shown):

```text
$ node scripts/check.mjs examples/sloppy.md
examples/sloppy.md: 30 hits. Rewrite: 3 or more hits reads as machine-written.

Reversal (it's not X, it's Y) (1)
  line 7: It's not just about saving money, it's

Colon set-up (1)
  line 25: Here's the thing:

Announcing what's coming (1)
  line 10: In this post, we'll

"Let's" construction (1)
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
`templates/`, so copy all of it. The Agent Skills format requires the folder name to match the
`name` in `SKILL.md`, which is `no-slop-technical-writing`.

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
runs on its own anywhere Node.js 22 or later is installed:

```bash
node path/to/no-slop-technical-writing/scripts/check.mjs draft.md
```

To fail a CI job on a sloppy document, run it with `--strict`.

## Using it

Ask for the kind of piece the skill covers, for example "write up the benchmark results as a
research note" or "check this design doc for machine-written patterns". The agent outlines first,
drafts with every number computed, then runs the review in
[references/review.md](references/review.md).

For a standalone page, [templates/page.html](templates/page.html) is a single-file HTML research
note with light and dark themes, line and bar chart helpers with data tables, and helpers for pass
rates and the range they could plausibly fall in.

## What's in the repository

| Path | What it holds |
| --- | --- |
| [SKILL.md](SKILL.md) | The rules: structure, voice, numbers, process |
| [references/avoid.md](references/avoid.md) | Patterns to avoid, each with an example and the fix |
| [references/replicate.md](references/replicate.md) | Research-note patterns to copy, with the published pieces they come from |
| [references/charts.md](references/charts.md) | When a finding gets a chart, and how to draw it |
| [references/review.md](references/review.md) | The review pass |
| [scripts/check.mjs](scripts/check.mjs) | The check script |
| [templates/page.html](templates/page.html) | The HTML page shell |
| [examples/](examples/) | The before and after samples |
| [tests/](tests/) | Tests for the check script |
| [docs/](docs/) | The demo GIF and the script that renders it |

## Tests

Run them from the skill's own folder:

```bash
node --test
```

Each rule has a case that must fire it and a near miss that must not. Further cases cover the
places a check script can misfire: tables, lists, URLs, code, front matter, decimals,
`check:off` regions, and statistics terms such as "true recall" or "the real rate". The suite
also runs the check script on every Markdown file in this repository, except the sloppy example, and
fails if any is not Clean. CI runs it on Node.js 22 and 24.

## House style

The rules are defaults. A project can add its own, such as banned words or required terms, in its
own instructions; where those are stricter, they win. Where a project's style allows em dashes, run
the check script with `--allow-em-dash`. See
[CONTRIBUTING.md](CONTRIBUTING.md) to report a false alarm or propose a pattern.

## License

MIT. See [LICENSE](LICENSE).
