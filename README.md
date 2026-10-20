# technical-writing

An agent skill for writing technical content that is plain, exact and free of AI slop: how a
system or method works, the maths behind a decision, a measurement write-up, a design note.

It gives the agent:

- **Rules** for structure, voice, terms and numbers ([SKILL.md](SKILL.md)): lead with the claim,
  name a term then explain it, keep true / observed / proven apart, compute every number, frame
  worst cases as ceilings.
- **Chart rules** ([references/charts.md](references/charts.md)): titles that state the finding,
  captions that say how to read the chart, one effect per chart.
- **A review pass** ([references/review.md](references/review.md)): the
  [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) detector for word-level
  tells, then an adversarial read for cadence and claims with no source.
- **A page shell** ([templates/page.html](templates/page.html)): a single-file HTML research note
  with light and dark themes, line and bar chart helpers with tooltips and data tables, and
  binomial statistics helpers (Clopper–Pearson bounds, pass chances, normal-approximation ranges).

## Install

Copy this folder into your agent's skills directory, for example `~/.claude/skills/technical-writing`
for Claude Code, or `.claude/skills/technical-writing` in a repository. It follows the
[Agent Skills](https://agentskills.io) `SKILL.md` format.

The review pass needs Node.js to run the detector; everything else is plain Markdown and HTML.

## House style

The rules are defaults. A project can layer its own on top (banned punctuation, terms, content-type
gates) with a small skill of its own that loads this one first.

## Credits

The review pass runs [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) by
Conor Bronsdon (MIT) as a dependency; it is not copied here.

## License

MIT. See [LICENSE](LICENSE).
