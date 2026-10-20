# Review before it ships

Two passes: a detector for word-level tells, then an adversarial read for what a detector can't
see. Run both on anything longer than a few paragraphs.

## 1. The detector

Run [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) (MIT, Conor Bronsdon).
Clone it into a scratch directory rather than copying it in, and pin a commit:

```bash
git clone https://github.com/conorbronsdon/avoid-ai-writing /tmp/avoid-ai-writing
git -C /tmp/avoid-ai-writing checkout 209815cdeb4af942616daec89a5e0a706c804e3a
```

Give it plain text or Markdown. For HTML, strip `<style>` and `<script>` and keep headings and
bold. Then:

```bash
node /tmp/avoid-ai-writing/bin/avoid-ai-writing.js --context technical --source-mode rendered-markdown file.md
```

It prints JSON with a `score`, a `label` and a list of `issues`. Aim for "Clean". Fix every issue
you can't justify, and say which you kept and why. Its full pattern catalogue is in its
`references/patterns.md`. It covers most mechanical tells (antithesis snaps, groups of three,
colon set-ups, mic-drop fragments, grand openers, em dashes, invented detail), so don't re-list
them here.

## 2. The adversarial read

The writer reads past their own tells. So the read is done by a reader whose only job is to find
slop: for anything long or high-stakes, a separate agent with no stake in the phrasing. Default to
flagging when unsure.

Report each hit as three things: **the quoted phrase**, **which tell it is**, and **the plain
rewrite**. One hit is forgivable; **three or more means the piece reads as machine-written and is
rewritten** before it ships.

Read especially for the two tells a detector barely sees, which matter most in technical writing:

- **Performing every sentence.** A relentless mic-drop cadence. Real technical writing is mostly
  flat; the fact carries the line.
- **Claims with no receipt.** A number, comparison or assertion the writer can't point to a source
  for. Either cite it, compute it on the page, or cut it.

Also check, against [the main rules](../SKILL.md):

- the same word for the same thing throughout, and each term defined before use;
- every number traced to code or a source, and matching its table;
- no rule, step or threshold described that the process doesn't have;
- worst cases labelled as ceilings;
- "X, not Y" kept only where it states a real distinction ("the lower bound, not the observed
  share").

## The fix

Write the plain declarative sentence and let the fact carry it. State the number flatly. Cut what
isn't real.
