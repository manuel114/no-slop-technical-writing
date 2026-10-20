# Patterns to replicate: the research note

The model is the data-led research note, as investment research teams publish them (for example
a16z's [AI retention benchmarks](https://a16z.com/ai-retention-benchmarks/)). It reads fast
because every part has one job: the claim comes first, each chart carries one finding, and the
prose between charts interprets rather than describes.

## The opening

1. **Diagnose.** The first paragraph names the real problem, often one the reader has framed
   wrong: "The issue is how we measure it, not the result itself." Specific, not grand.
2. **Explain why it's hard.** The second paragraph gives the reason the obvious approach fails,
   with a concrete example.
3. **State the thesis in bold.** One sentence with the exact rule or result and its numbers. It is
   the only bold in the opening.
4. **Promise the rest in one sentence**: what the page will show, not a table of contents.

## Sections

- **Headings name what the section covers or finds**, short and plain: "How a round works",
  "Why 45 flagged and 900 traces". A formula or range can sit in the heading ("M12 / M3").
- **Prose, not bullets.** Reasoning stays in paragraphs so the "because" survives. Lists only for
  parallel one-line items.
- **One section, one idea.** A section that needs two charts with different findings is two
  sections.

## Charts

- **Introduced by a framing paragraph**, never "Figure 3 shows…". The paragraph sets the question;
  the chart answers it.
- **Titled with the finding**, subtitled with what is measured. (Research notes often leave the
  title in the image alone; put it in text too, so it can be read, searched and checked.)
- **Followed by interpretation, not description.** The sentence after a chart does one of:
  - names the takeaway, with the number: "At 45 flagged, a 95% evaluator passes about 9 rounds in
    10.";
  - works an example: "Say the problem really shows up in 5% of traces…";
  - says what it means for the reader's decision.

  It never restates what the reader can already see.

## Numbers

- **Numbers anchor every claim**: rates, counts, prices, windows. A claim without a number is a
  candidate for cutting.
- **Worked scenarios** turn a formula into something the reader can feel: "For example, at a real
  rate of 5% and proven 80% specificity…".
- **Name the method** and link it the first time (Clopper–Pearson, Fisher's exact test), then use
  the plain name.

## Tone

- **Confident on the method, calibrated on the future.** Hedge predictions ("likely", "we think")
  once each; state measured results and method flatly.
- **Mostly medium-length sentences**, with the occasional short one when a fact deserves it. Not
  a steady beat of short ones.
- **Asides in parentheses** are fine for a definition or a quick qualification.
- **Caveats inline and brief**, as a clause where they apply. The big trade-offs get their own
  section ("Where we cut corners on purpose"), each with its cost and what limits it.

## Where we differ from the model

- **No rhetorical questions** as transitions, and **no closing question**. End on the last piece of
  content, or a short methods note.
- **No "how to use this" or "what's next" sections** unless the reader needs a procedure.
- **Every chart has a visible caption and its data as a table.**
