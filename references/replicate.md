# Patterns to replicate: the research note

The model is the data-led research note, such as a16z's
[AI retention benchmarks](https://a16z.com/ai-retention-benchmarks/),
[The high cost of AI compute](https://a16z.com/navigating-the-high-cost-of-ai-compute/)
and [Emerging architectures for LLM applications](https://a16z.com/emerging-architectures-for-llm-applications/). Every part has one job: the
claim comes first, each chart carries one finding, and the prose between charts says what the
chart means.

## The opening

1. **Diagnose.** The first paragraph names the real problem, often one the reader has framed
   wrong, and makes it specific. For example: "Most teams judge an evaluator by what it scored on
   one test set. But that score moves from one set to the next, so the question that matters is
   the lowest its recall could plausibly be."
2. **Explain why it's hard.** The second paragraph gives the reason the obvious approach fails,
   with a concrete example.
3. **Say what the page rests on.** One sentence on where the knowledge comes from: how many
   rounds, traces, interviews or measurements, and from when. Readers weigh every later claim
   against it.
4. **State the thesis in bold.** One sentence with the exact rule or result and its numbers. It is
   the only bold in the opening.
5. **Promise the rest in one sentence**: what the page will show, in one line rather than a list
   of sections.

## Sections

- **Headings name what the section covers or finds**, short and plain: "How a round works",
  "Why 45 flagged and 900 traces". A formula or range can sit in the heading ("M12 / M3").
- **The skim test.** Reading only the headings and the bold should tell the whole story. If it
  doesn't, a heading names a topic where it should state a finding.
- **Reasoning in prose.** Reasoning stays in paragraphs so the "because" survives. Lists only for
  parallel one-line items.
- **Bold labels for side-by-side criteria.** When comparing options on several criteria, give each
  criterion a bold label and a short paragraph ("**Price:** …", "**Availability:** …"). This keeps
  the reasoning that a bullet would strip out.
- **One section, one idea.** A section that needs two charts with different findings is two
  sections.

## Charts

- **Introduced by a framing paragraph**, never "Figure 3 shows…". The paragraph sets the question;
  the chart answers it.
- **Titled with the finding**, subtitled with what is measured. (Research notes often leave the
  title in the image alone; put it in text too, so it can be read, searched and checked.)
- **Followed by what it means.** The sentence after a chart does one of these:
  - names the takeaway, with the number: "At 45 flagged, a 95% evaluator passes about 9 rounds in
    10.";
  - works an example: "Say the problem really shows up in 5% of traces…";
  - says what it means for the reader's decision.

  It never restates what the reader can already see.

## Numbers

- **Numbers anchor every claim**: rates, counts, prices, windows. A claim without a number is a
  candidate for cutting.
- **Rule of thumb, then one worked example.** Give the formula with named variables, then run it
  on one real case with every step and unit shown, so the reader can redo it.
- **Worked scenarios** turn a formula into a concrete case: "For example, at a real
  rate of 5% and proven 80% specificity…".
- **Say why an estimate is rough, where it's made.** Right after a simplified number, list what
  it leaves out ("First, it assumes… Second, it ignores…"), so the reader doesn't over-trust it.
- **Ranges when the inputs vary.** "between 20 and 40 hours", with what drives the spread, beats
  one falsely exact figure.
- **Date the numbers that change.** Prices, costs and timings carry an "as of" date, and are
  marked indicative when they depend on setup.
- **Name the method** and link it the first time (Clopper–Pearson, Fisher's exact test), then use
  the plain name.

## Tone

- **Confident on the method, calibrated on the future.** Hedge predictions ("likely", "we think")
  once each; state measured results and method flatly.
- **Mostly medium-length sentences**, with the occasional short one when a fact deserves it. Not
  a steady beat of short ones.
- **Name the open questions plainly.** "We don't know yet whether…" as its own sentence, where
  it applies, instead of hedges spread through the text.
- **Conditional advice.** "If X, do Y; otherwise Z" beats an absolute rule when the right choice
  depends on the case.
- **Asides in parentheses** are fine for a definition or a quick qualification.
- **Caveats inline and brief**, as a clause where they apply. The big trade-offs get a section of
  their own (for example "Where we cut corners on purpose"), each with its cost and what limits it.

## Where we differ from the model

- **No rhetorical questions** as transitions, and **no closing question**. End on the last piece of
  content, or a short methods note.
- **No "how to use this" or "what's next" sections** unless the reader needs a procedure.
- **Every chart has a visible caption and its data as a table.**
