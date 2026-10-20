# Charts

A chart in technical writing carries one finding. Use a colour-validated palette and thin marks
(any data-visualisation guide will do); these rules sit on top.

## When a finding gets a chart

Decide the form of the evidence for each finding while outlining, from what kind of finding it is:

| The finding is | Show it as |
| --- | --- |
| A comparison, or a change over time, in data you collected | A chart, with its numbers as a table |
| Reference data: prices, specs, rankings, lists | A table |
| A worked calculation | Prose, one step per sentence, with units |
| A forecast or an argument | Prose |
| What people said in interviews | Quotes, with how many said it |
| How the parts of a system fit together | A diagram |

The table comes from eight AI research notes by a16z, sorted image by image (October 2026). Their
two CIO surveys ([2024](https://a16z.com/generative-ai-enterprise-2024/),
[2025](https://a16z.com/ai-enterprise-2025/)) chart 26 of their 32 numbered findings, with 32 charts
in all. Of the six without a chart, five are qualitative points from interviews and one is a
forecast.
[LLMflation](https://a16z.com/llmflation-llm-inference-cost/) charts the price of the cheapest
model over time, then argues in prose whether the fall will continue.
[The high cost of AI compute](https://a16z.com/navigating-the-high-cost-of-ai-compute/) has no
charts: its prices and GPU specs are tables, and its cost of running a model is a calculation
written out step by step. [Emerging architectures for LLM applications](https://a16z.com/emerging-architectures-for-llm-applications/)
and [Who owns the generative AI platform?](https://a16z.com/who-owns-the-generative-ai-platform/)
use diagrams for the stack and prose for the rest.

A table of numbers is not a substitute for a chart when the finding is a comparison: the chart
shows the difference at a glance, and the table lets the reader check it.

## How to draw it

- **The finding is stated next to the chart**, either in the chart's title ("The rarer the
  problem, the more false flags push the number up") or in the heading or sentence just above it,
  with the title then saying what is measured ("LLM vendor usage over time"). The a16z notes
  mostly do the second. Never a slogan.
- **Subtitle = what is measured, by what** ("Chance of passing in one round, by true recall").
- **A source line under every chart**: where the data comes from, and its date.
- **Mark events and trends on the chart**, labelled: a release, a dashed trend line ("10x cheaper
  a year"), an arrow with the ratio between two bars.
- Give each chart a **legend**, the **data as a table** (a "Show the numbers" fold-out works), and
  a **caption** that says how to read it first and gives the formula or source last.
- **Chart titles must not look like section headings**: smaller, with no extra label or divider
  above them.
- **Reference lines say what they mark** and sit where they can't be misread as a threshold they
  aren't.
- **Sort bar charts highest first.** Highlight your own value and label it with what it is ("Our
  bar: proven 80%"); the caption explains how it translates to the other bars.
- **Isolate one effect.** A chart about one quantity holds the others fixed, and the caption says
  what is held fixed ("assumes every real case is caught").
- **Label what-if axes honestly.** If a line plots a true value nobody can measure, call it
  "true", and say in the caption how to read it against the measured or proven number.
- **A process is a step diagram, not a chart.**
- **Hover and tables.** Interactive charts get a tooltip; every chart's numbers are also readable
  without hovering.
- **In Markdown**, draw the chart as an SVG file from code that reads the same numbers as the text,
  embed it as an image with alt text that gives the key numbers, and keep the numbers as a table
  next to it. On an HTML page, use the helpers in `templates/page.html`.
