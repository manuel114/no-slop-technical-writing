# Patterns to avoid

Each entry says what the pattern looks like, usually with an example, and how to fix it. Entries
marked **(check)** are found by [`scripts/check.mjs`](../scripts/check.mjs), **(partly checked)**
ones in their commonest forms; the rest need a read. One hit is forgivable; three or more in a
piece means it reads as machine-written, so rewrite before it ships. When one paragraph holds
three or more, rewrite that paragraph from scratch rather than patching each hit.

The common thread: machine writing performs instead of informing. It dresses every sentence up,
reaches for the same few constructions, and fills gaps with detail that isn't real.

<!-- check:off -->

## Sentence shapes

- **The reversal (check).** "It's not X, it's Y." / "This isn't about A; it's about B." / "Not just
  X, but Y." The setup exists only to be knocked down. Fix: say Y. Keep a reversal only when the
  reader really would assume X and the difference matters ("the lower bound, not the observed
  share").
- **Negation chains (check).** "Not A. Not B. But C." / "no X, no Y, just Z". A longer reversal.
  Fix: say C, and why if it matters.
- **False concessions.** "While X is useful, Y…" used as a reflex to sound balanced, when nobody
  argued X. Fix: drop the concession, or make it a real trade-off with a number.
- **Groups of three.** Three parallel items or three short sentences in a row, chosen for rhythm
  rather than because there are three things. "Faster. Cheaper. Safer." Fix: list what's true,
  however many it is, in ordinary sentences.
- **Colon into a list of three.** "It comes down to three things: speed, cost and trust." Fix:
  state the finding; give the parts only if each carries a fact.
- **Staccato runs (check).** Three or more very short sentences in a row. Fix: join them into one
  sentence that says how they relate.
- **Same-opener runs (check).** Three or more sentences in a row starting with the same word
  ("This… This… This…"). Fix: vary the subject by saying what each sentence is about.
- **Mic-drop endings (check).** A paragraph that ends on a short fragment for effect ("And it
  works." "That's the point."). Fix: end on the last fact.
- **Colon set-ups (check).** "Here's the thing:", "The catch:", "The bottom line:", "The result:".
  Fix: state the thing.
- **Tacked-on -ing clauses (check).** ", highlighting the importance of…", ", underscoring…",
  ", reflecting…". A clause that claims a meaning instead of showing it. Fix: delete it, or make it
  a sentence with the evidence.
- **Stacked descriptions.** "a cheap model, carefully tuned, rarely wrong". Fix: one claim per
  clause, with its number.
- **Stacked hyphenated modifiers (check).** "a production-ready, state-of-the-art, AI-powered
  pipeline". Fix: keep the one that's measurable and say what it measures.
- **Rhetorical questions (partly checked)** as transitions or openers ("So what does this mean?",
  "Why does this matter?"). Fix: answer it as a statement.
- **Uniform rhythm.** Every sentence about the same length and shape, so nothing stands out. Fix:
  let sentence length follow the content; a long explanation can be long, a fact can be short.

## Who does what

- **Hidden actors.** Passives and fragments that drop who did it: "Mistakes were found",
  "Decided to cap rounds at 900". Fix: name the actor ("the reviewer found", "we cap rounds").
- **False agency (partly checked).** Giving data or tools intentions: "the data tells us", "the
  model decided", "the numbers don't lie". Fix: say who concluded what from which number.
- **Avoiding "is" (check).** "serves as", "stands as", "acts as", "functions as" where "is" works.
  Fix: use "is".

## Openings and endings

- **Grand openers (check).** "In today's rapidly evolving landscape…", "In the world of AI…",
  "Now more than ever…". Fix: open on the specific problem or result.
- **Scenario openers.** "Imagine a world where…", "Picture this:". Fix: open on a real case.
- **Announcing what's coming (check).** "In this post, we'll explore…", "Let's dive in." Fix: cut
  it and open on the first real sentence.
- **Summaries and send-offs (check).** "In conclusion", "Ultimately", "At the end of the day", a
  closing question, a "what's next" that promises nothing specific. Fix: end on the last piece of
  content.
- **Future-gazing closers (check).** "The future is bright", "only time will tell", "this is just
  the beginning". Fix: end on the last fact, or a dated, specific next step.

## Words and phrases

- **Inflated words (check).** delve, tapestry, landscape, realm, journey, navigate, unlock,
  unleash, empower, elevate, foster, leverage (as a verb), streamline, supercharge, robust,
  seamless, cutting-edge, game-changing, groundbreaking, transformative, pivotal, crucial, vital,
  paramount, intricate, multifaceted, holistic, synergy, paradigm, testament, underscore,
  showcase, myriad, plethora, ever-evolving. Fix: the plain word ("use", "important", "shows"), or
  delete it.
- **Hype and flourish (check).** blazing-fast, effortless(ly), revolutionary, best-in-class,
  world-class, next-level, magic. Fix: the number that would make the claim true, or cut it.
- **Significance inflation (check).** "marks a turning point", "plays a key role", "a pivotal
  moment", "sets the stage for". Fix: say what changed, by how much.
- **Novelty inflation (check).** "for the first time", "unprecedented", "never before seen". Fix:
  cut it unless you can cite that nobody did it before.
- **Transformation talk (check).** "transforms the way", "changes everything", "reimagines".
  Fix: what is different, measured before and after.
- **Aphorisms (check).** "X is the new Y", "data is the new oil". Fix: the specific claim.
- **"The real problem" (check).** "the real issue", "the real question", "what actually matters",
  used to sound insightful. Fix: name the problem. (Statistical terms like "true recall" or "the
  real rate" are fine; they are definitions.)
- **Self-labelled significance (check).** "The key insight is", "This is the crucial part",
  "Here's what's interesting". Fix: state it; the reader decides if it's key.
- **Narrated candour (check).** "To be honest", "Frankly", "Let's be clear", "The truth is". Fix:
  delete.
- **Confidence phrases (check).** "I'm confident that", "Rest assured", "without a doubt". Fix: the
  evidence, or the hedge it deserves.
- **Signposts (check).** "It's worth noting that", "Importantly,", "Interestingly,", "Notably,",
  "Needless to say". Fix: delete; if the sentence matters, it will show.
- **Filler phrases (check).** "in order to", "due to the fact that", "at this point in time",
  "in terms of", "the fact that". Fix: "to", "because", "now", or rephrase.
- **"Let's" (check).** "Let's look at", "Let's break this down". Fix: just do it.
- **Vague size words (check).** significantly, dramatically, substantially, vastly, a lot, hugely,
  when the sentence has no number. Fix: the number.
- **Empty hedges (partly checked).** "may potentially", "could possibly", "(arguably)", "it seems
  that it might". Hedge once, and only on a prediction. Never hedge the method or the measured
  result.
- **False ranges.** "from startups to enterprises", "from prompts to production", where the two
  ends aren't on one scale. Fix: name the cases you mean.

## Formatting

- **Bold everywhere (check).** Fix: bold the main claim and at most one or two key findings.
- **Em dashes (check)**, where house style bans them. Fix: commas, colons or parentheses.
- **Bullet lists for reasoning.** Bullets strip out the "because" between points. Fix: short
  paragraphs; keep bullets for parallel, one-line items, and use bold labels with a paragraph each
  for criteria compared side by side.
- **Bold-label bullets everywhere.** Every list item shaped "**Label:** sentence", even when the
  items aren't criteria. Fix: plain prose, or a plain list.
- **Bullets of bare noun phrases.** "Scalability", "Flexibility", "Ease of use" with nothing said
  about any of them. Fix: a sentence each with the fact, or cut.
- **Excessive structure.** Headings over two-paragraph sections, nested bullets, a table for two
  numbers. Fix: structure only what the reader needs to navigate.
- **Headings as slogans.** "One round, three numbers", "The magic number". Fix: say what the
  section covers or finds.
- **Listicle headings (check).** "7 ways to…", "5 lessons from…". Fix: a heading that states the
  finding.
- **Emoji, decorative symbols and title case everywhere** in body prose. Fix: remove; use sentence
  case for headings.

## Substance

- **Invented detail.** Any number, duration, count, place or feeling not in the sources ("after
  weeks of testing", "our small team", "users love it"). Filling a gap with a plausible guess is
  the same thing. Fix: cut it, or find the real figure.
- **Claims with no receipt.** A comparison or number the writer can't point to: a measurement, a
  cited source, or a calculation on the page. Fix: cite it, compute it, or cut it.
- **Vague attributions (check).** "experts say", "studies show", "research suggests", "it is widely
  believed". Fix: name and link the source, or cut the claim.
- **Borrowed authority.** "trusted by leading teams", "as used at top labs". Fix: name them with
  permission, or cut.
- **Contrast against the crowd (check).** "Most teams get this wrong", "unlike everyone else". It
  is an assumption about others dressed as insight. Fix: state what you do and why, with the
  number.
- **Rules that don't exist.** Describing a step, threshold or limit the process doesn't have
  ("we stop after three rounds"). Fix: check the source; describe only what's real.
- **Assumptions about others.** "Most vendors check against human labels." Fix: say what is
  known, and "we don't know" for the rest.
- **Low information density.** Paragraphs that restate the previous one in new words. Test: if
  you can delete a paragraph and nothing is lost, delete it. If you can shuffle the paragraphs and
  nothing breaks, there's no argument yet.
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
- **History in place of the present.** "This was 70% until October", "why not 30", "now uses X
  instead of Y" in a doc that should describe how things are. Fix: describe how it is. Comparing
  measurements over time ("the rate fell from 55% to 28% after the fix") is evidence, not history,
  and stays.
- **Unlabelled worst cases.** A ceiling presented as the expected result, which scares readers for
  no reason. Fix: call it a ceiling, say why real results land below, and what corrects it.
- **Defending.** Paragraphs that argue with an imagined critic. Fix: state the trade-off once,
  with its cost and what limits it.

## Leftovers from drafting

- **Unfilled placeholders (check).** `{{…}}`, `[TODO]`, `[insert …]`, "Lorem ipsum". Fix: fill or
  delete before it ships.
- **Assistant chatter (check).** "Great question", "I hope this helps", "Let me know if", "As an
  AI", "Certainly!". Fix: delete.
- **Reasoning out loud (check).** "Let me think step by step", "Okay, so", "First, I'll". Fix:
  delete; keep only the conclusion and its evidence.
- **Tool leftovers (check).** Citation markup from chat tools (`oaicite`, `【…】`), and
  `utm_source=chatgpt.com`-style tracking on links. Fix: clean the link and cite properly.
- **Knowledge-cutoff disclaimers (check).** "As of my last update", "based on my training data".
  Fix: a dated source.
