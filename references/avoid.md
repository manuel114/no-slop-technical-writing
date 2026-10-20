# Patterns to avoid

Each entry: what it looks like, an example, and the fix. Entries marked **(check)** are found by
[`scripts/check.mjs`](../scripts/check.mjs); the rest need a read. One hit is forgivable; three or
more in a piece means it reads as machine-written, so rewrite before it ships.

The common thread: machine writing performs instead of informing. It dresses every sentence up,
reaches for the same few constructions, and fills gaps with detail that isn't real.

## Sentence shapes

- **The reversal (check).** "It's not X, it's Y." / "This isn't about A; it's about B." / "Not just
  X, but Y." The setup exists only to be knocked down. Fix: say Y. Keep a reversal only when the
  reader really would assume X and the difference matters ("the lower bound, not the observed
  share").
- **Groups of three.** Three parallel items or three short sentences in a row, chosen for rhythm
  rather than because there are three things. "Faster. Cheaper. Safer." Fix: list what's true,
  however many it is, in ordinary sentences.
- **Staccato runs (check).** Three or more very short sentences in a row. Fix: join them into one
  sentence that says how they relate.
- **Mic-drop endings (check).** A paragraph that ends on a short fragment for effect ("And it
  works." "That's the point."). Fix: end on the last fact.
- **Colon set-ups (check).** "Here's the thing:", "The catch:", "The bottom line:", "The result:".
  Fix: state the thing.
- **Stacked descriptions.** "a cheap model, carefully tuned, rarely wrong". Fix: one claim per
  clause, with its number.
- **Rhetorical questions** as transitions ("So what does this mean?"). Fix: answer it as a
  statement.

## Openings and endings

- **Grand openers (check).** "In today's rapidly evolving landscape…", "In the world of AI…",
  "Now more than ever…". Fix: open on the specific problem or result.
- **Announcing what's coming (check).** "In this post, we'll explore…", "Let's dive in." Fix: start.
- **Summaries and send-offs (check).** "In conclusion", "Ultimately", "At the end of the day", a
  closing question, a "what's next" that promises nothing specific. Fix: end on the last piece of
  content.

## Words

- **Inflated words (check).** delve, tapestry, landscape, realm, journey, navigate, unlock,
  unleash, empower, elevate, foster, harness, leverage (as a verb), streamline, supercharge,
  robust, seamless, cutting-edge, game-changing, groundbreaking, transformative, pivotal, crucial,
  vital, paramount, intricate, multifaceted, holistic, synergy, paradigm, testament, underscore,
  showcase, myriad, plethora, ever-evolving. Fix: the plain word ("use", "important", "shows"), or
  delete it.
- **Hype and flourish (check).** blazing-fast, effortless(ly), revolutionary, best-in-class,
  world-class, next-level, magic. Fix: the number that would make the claim true, or cut it.
- **Signposts (check).** "It's worth noting that", "Importantly,", "Interestingly,", "Notably,",
  "Needless to say". Fix: delete; if the sentence matters, it will show.
- **Vague size words (check).** significantly, dramatically, substantially, vastly, a lot, hugely,
  when the sentence has no number. Fix: the number.
- **Empty hedges.** "may potentially", "could possibly", "it seems that it might". Hedge once, and
  only on a prediction. Never hedge the method or the measured result.

## Formatting

- **Bold everywhere (check).** Fix: bold the main claim and at most one or two key findings.
- **Em dashes (check)**, where house style bans them. Fix: commas, colons or parentheses.
- **Bullet lists for reasoning.** Bullets strip out the "because" between points. Fix: short
  paragraphs; keep bullets for parallel, one-line items.
- **Headings as slogans.** "One round, three numbers", "The magic number". Fix: say what the
  section covers or finds.
- **Emoji, decorative symbols and title-case everywhere** in body prose. Fix: remove.

## Substance

- **Invented detail.** Any number, duration, count, place or feeling not in the sources ("after
  weeks of testing", "our small team", "users love it"). That is fabrication. Fix: cut it, or find
  the real figure.
- **Claims with no receipt.** A comparison or number the writer can't point to: a measurement, a
  cited source, or a calculation on the page. Fix: cite it, compute it, or cut it.
- **Rules that don't exist.** Describing a step, threshold or limit the process doesn't have
  ("we stop after three rounds"). Fix: check the source; describe only what's real.
- **Assumptions about others.** "Most vendors check against human labels." Fix: say what is
  known, and "we don't know" for the rest.
- **Performing every sentence.** A steady beat of punchlines; nothing is allowed to be flat. This
  is the deepest tell and no check finds it. Fix: most sentences should just carry a fact.

## Technical writing in particular

- **Term drift.** The same idea under several names ("proven", "cautious number", "lower bound").
  Fix: pick one, define it, use it everywhere.
- **Mixed estimates.** True, observed and proven (or measured and estimated) used in one sentence
  without saying which. Fix: label each number.
- **Undefined jargon.** A statistical term with no plain explanation or link. Fix: name it, then a
  clause saying what it means.
- **Vague thresholds.** "fails by a little", "a small sample". Fix: the number.
- **History in place of the present.** "This was 70% until October", "why not 30". Fix: describe
  how it is.
- **Unlabelled worst cases.** A ceiling presented as the expected result, which scares readers for
  no reason. Fix: call it a ceiling, say why real results land below, and what corrects it.
- **Defending.** Paragraphs that argue with an imagined critic. Fix: state the trade-off once,
  with its cost and what limits it.
