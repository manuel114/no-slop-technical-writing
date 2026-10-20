// Tests for scripts/check.mjs. Run with `node --test` (Node 22 or later, no dependencies).
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { analyse } from "../scripts/check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = join(root, "scripts", "check.mjs");

/** The rule ids that fire on a piece of Markdown (or HTML with `html: true`). */
const rules = (text, opts) => new Set(analyse(text, opts).hits.map((h) => h.rule));

/**
 * One row per rule: [rule id, texts that must fire it, texts that must not].
 * Negatives are close to the positive on purpose, so a rule that widens by accident fails here.
 */
const CASES = [
  ["reversal", ["It's not a caching problem, it's a timeout.", "This isn't about speed; it's about cost.", "The fix is not just faster, but cheaper."], ["The cache is not warm on the first request, so the first call takes 900 ms.", "The test covers not only the parser."]],
  ["colon-setup", ["Here's the thing: the cache was cold.", "The catch: it only works once."], ["The result was a 12% drop in latency."]],
  ["grand-opener", ["In today's fast-moving world, teams ship daily.", "In the world of databases, indexes matter."], ["Today the job ran in 4 minutes."]],
  ["announcing", ["In this post, we'll measure the cache.", "Without further ado, the numbers."], ["This post measures the cache hit rate over 30 days."]],
  ["lets", ["Let's dive in.", "Let's take a closer look at the queue."], ["Let the job run for 10 minutes before reading the counter."]],
  ["negation-chain", ["Not faster. Not cheaper. But simpler.", "No meetings, no tickets, just code."], ["The run did not fail, and the retry did not start."]],
  ["ing-clause", ["Latency fell 30%, highlighting the value of caching."], ["Latency fell 30% after we added caching, as the table shows."]],
  ["hyphen-stack", ["We built a production-ready, state-of-the-art pipeline."], ["We built a well-tested pipeline with a 99th-percentile latency of 40 ms."]],
  ["false-agency", ["The data tells us the cache helps.", "The model decided to retry."], ["From the data, we estimate the cache saves 40 ms."]],
  ["copula", ["The queue serves as a buffer."], ["The queue is a buffer between the two services.", "The server serves requests on port 8080."]],
  ["future-closer", ["Only time will tell.", "The possibilities are endless."], ["The next run is on Monday."]],
  ["significance", ["This release marks a turning point for the team.", "Caching plays a key role here."], ["This release adds a retry limit of 5."]],
  ["novelty", ["This is an unprecedented result.", "For the first time ever, the suite passed."], ["This is the first run with the new index."]],
  ["transformation", ["This transforms the way teams test.", "It changes everything about deploys."], ["The function transforms each row into a JSON object."]],
  ["aphorism", ["Data is the new oil."], ["The new index is 3 times smaller."]],
  ["real-problem", ["The real problem is the retry loop.", "What really matters is the tail."], ["The real rate is between 4% and 9%.", "The true recall is at least 80%."]],
  ["self-label", ["The key insight is that retries add load.", "Here's what's interesting about the tail."], ["The key is stored in the vault."]],
  ["candour", ["To be honest, the test was flaky.", "Let's be clear about the cost."], ["The test failed 2 times in 50 runs."]],
  ["confidence", ["Make no mistake, the cost is high.", "Rest assured, the data is safe."], ["The mistake was in the parser."]],
  ["filler", ["We cache results in order to save time.", "It failed due to the fact that the disk was full."], ["Rows are sorted in order of arrival.", "We cache results to save 40 ms per call."]],
  ["attribution", ["Studies show that caching helps.", "Experts agree on the limit."], ["Two studies (Lee, 2023; Park, 2024) measured a 20% gain."]],
  ["crowd", ["Most teams get this wrong."], ["Most requests finish in 40 ms."]],
  ["listicle", ["## 5 ways to speed up tests", "# The 3 lessons we learned"], ["## 5 results from the benchmark", "## Five changes we measured"]],
  ["placeholder", ["Owner: [TODO]", "Hello {{name}}, your report is ready.", "Lorem ipsum dolor sit amet."], ["The array a[0] holds the first value."]],
  ["chatter", ["Great question! The cache helps.", "I hope this helps."], ["We answered the question in the methods section."]],
  ["reasoning", ["Let me think step by step.", "Okay, so the cache is cold."], ["First, the job reads the queue."]],
  ["cutoff", ["As of my last update, the API had 3 versions."], ["As of 1 October 2026, the API has 3 versions."]],
  ["send-off", ["In conclusion, caching helps.", "Ultimately, the choice is yours."], ["The conclusion holds for runs under 10 minutes."]],
  ["signpost", ["It's worth noting that the cache is cold.", "Importantly, the tail grew."], ["The cold cache adds 200 ms."]],
  ["rhetorical", ["So what does this mean? It means less load.", "Why does this matter? Because load costs money."], ["This means the queue drains in 4 minutes."]],
  ["hedge-stack", ["This may potentially reduce load.", "The fix (arguably) helps."], ["This may reduce load by up to 20%."]],
  ["inflated", ["We leverage a robust cache.", "The results underscore the trend."], ["We use a cache with a 95% hit rate."]],
  ["hype", ["The new build is blazingly fast.", "Setup is effortless."], ["The new build takes 40 seconds, down from 90."]],
  ["emoji", ["Tests pass on every branch 🚀"], ["Tests pass on Node 22 and 24."]],
  ["tool-leftover", ["See the source.【4:0†source】", "See [the docs](https://example.com/?utm_source=chatgpt.com)."], ["See [the docs](https://example.com/docs)."]],
  ["em-dash", ["The cache, when warm — saves 40 ms.", "The cache -- when warm -- saves 40 ms."], ["The cache saves 40 ms when warm.", "Run it with --json for a report.", "Pages 3-5 cover the method."]],
  ["bold", ["**One** finding, **two** findings, **three** findings and **four** findings."], ["- **One:** the first item.\n- **Two:** the second.\n- **Three:** the third.\n- **Four:** the fourth.\n\nOnly **this** is bold in prose."]],
  ["same-opener", ["Retries add load to the queue. Retries add latency to every call. Retries hide the cause from the caller."], ["The cache is cold on start. The queue fills in 4 minutes. The job waits until both are ready."]],
  ["staccato", ["It failed. We retried. It passed."], ["It failed on the first run. We retried it after 5 minutes. It passed on the second attempt.", "- Fast.\n- Cheap.\n- Safe."]],
  ["vague", ["Caching significantly reduces latency."], ["Caching reduces latency significantly, from 90 ms to 40 ms."]],
  ["mic-drop", ["The cache cut p95 latency from 90 ms to 40 ms over 30 days. We kept it on for every service after that review. And it works."], ["The cache cut p95 latency from 90 ms to 40 ms over 30 days. We kept it on for every service after that review. It held at 40 ms for 30 days.", "The cache cut p95 latency from 90 ms to 40 ms. We kept it on for every service. See the table below."]],
];

describe("each rule fires on its pattern and stays quiet on a near miss", () => {
  for (const [rule, positives, negatives] of CASES) {
    test(rule, () => {
      for (const p of positives) assert.ok(rules(p).has(rule), `expected ${rule} on: ${p}`);
      for (const n of negatives) assert.ok(!rules(n).has(rule), `unexpected ${rule} on: ${n}`);
    });
  }
});

test("every rule id in the script has a case", () => {
  const src = readFileSync(script, "utf8");
  const ids = new Set([...src.matchAll(/^\s*\["([a-z-]+)", "/gm)].map((m) => m[1]));
  for (const m of src.matchAll(/add\("([a-z-]+)"/g)) ids.add(m[1]);
  const covered = new Set(CASES.map(([r]) => r));
  assert.deepEqual([...ids].filter((id) => !covered.has(id)), []);
});

describe("false alarms", () => {
  test("table rows are not judged as prose", () => {
    const md = "| Option | Note |\n| --- | --- |\n| A | Fast. Cheap. Safe. |\n| B | Studies show it, not just faster, but cheaper |";
    assert.deepEqual(analyse(md).hits, []);
  });
  test("list items are not staccato or mic-drops", () => {
    assert.deepEqual(analyse("- Fast.\n- Cheap.\n- Safe.\n- Done.").hits, []);
  });
  test("URLs and link targets are ignored", () => {
    const md = "The guide is at https://example.com/leverage-robust-tapestry and [here](https://example.com/seamless-journey).";
    assert.deepEqual(analyse(md).hits, []);
  });
  test("statistics terms are plain words", () => {
    const md = "The true recall is at least 80%, and the real rate sits between 4% and 9%. The observed share was 12 in 40, and the actual rate is unknown.";
    assert.deepEqual(analyse(md).hits, []);
  });
  test("decimals and version numbers do not split sentences", () => {
    assert.deepEqual(analyse("The p-value was 0.03 on run 2.1.4 of the suite, with 1.5 retries per job on average.").hits, []);
  });
  test("code is not judged as prose", () => {
    const md = "Run `serves as a — leverage` here.\n\n```js\n// It's not X, it's Y — robust\nconst a = 1;\n```";
    assert.deepEqual(analyse(md).hits, []);
  });
  test("front matter is not judged as prose", () => {
    assert.deepEqual(analyse("---\ndescription: A robust, seamless tool — truly\n---\n\nThe tool counts words.").hits, []);
  });
  test("check:off regions are skipped up to check:on", () => {
    const md = "<!-- check:off -->\nIt's not X, it's Y. Let's dive in.\n<!-- check:on -->\n\nThe report lists 3 hits.";
    assert.deepEqual(analyse(md).hits, []);
    assert.ok(rules(md + "\n\nLet's dive in.").has("lets"), "text after check:on is checked again");
  });
  test("check:off with no check:on runs to the end of the file", () => {
    assert.deepEqual(analyse("The report lists 3 hits.\n\n<!-- check:off -->\nLet's dive in. Studies show it.").hits, []);
  });
  test("a reversal that states a real distinction goes to the read-by-hand list", () => {
    const r = analyse("Use the lower bound, not the observed share.");
    assert.deepEqual(r.hits, []);
    assert.equal(r.notes.length, 1);
  });
});

describe("options", () => {
  test("--allow-em-dash turns off the em dash rule", () => {
    assert.ok(!rules("The cache — when warm — saves 40 ms.", { allowEmDash: true }).has("em-dash"));
  });
  test("--max-bold sets the bold limit", () => {
    const md = "**One** and **two** and **three** and **four** findings.";
    assert.ok(!rules(md, { maxBold: 4 }).has("bold"));
    assert.ok(rules(md, { maxBold: 3 }).has("bold"));
  });
  test("HTML: scripts, styles and code are dropped; headings and bold are kept", () => {
    const html = `<html><head><style>.a{content:"leverage"}</style></head><body>
<h2>5 ways to speed up tests</h2>
<p>The cache cut latency from 90 ms to 40 ms.</p>
<pre><code>It's not X, it's Y</code></pre>
<script>const robust = "—";</script>
<p><strong>a</strong> <b>b</b> <strong>c</strong> <strong>d</strong></p>
</body></html>`;
    const fired = rules(html, { html: true });
    assert.ok(fired.has("listicle"));
    assert.ok(fired.has("bold"));
    assert.ok(!fired.has("reversal") && !fired.has("inflated") && !fired.has("em-dash"));
  });
  test("HTML: check:off regions are skipped", () => {
    assert.deepEqual(analyse("<p>The run took 4 minutes.</p><!-- check:off --><p>Let's dive in.</p><!-- check:on -->", { html: true }).hits, []);
  });
  test("verdict follows the hit count", () => {
    assert.equal(analyse("The run took 4 minutes.").verdict, "Clean");
    assert.match(analyse("Let's dive in.").verdict, /^Review/);
    assert.match(analyse("Let's dive in. Studies show it is robust. In conclusion, it works.").verdict, /^Rewrite/);
  });
});

describe("command line", () => {
  const dir = mkdtempSync(join(tmpdir(), "check-"));
  /** Write a temporary file and run the script on it with extra flags. */
  const run = (content, flags = [], name = "doc.md") => {
    const file = join(dir, name);
    writeFileSync(file, content);
    return spawnSync(process.execPath, [script, file, ...flags], { encoding: "utf8" });
  };
  const sloppy = "Let's dive in. Studies show it is robust. In conclusion, it works.";

  test("prints a summary line and exits 0", () => {
    const r = run("The run took 4 minutes.");
    assert.equal(r.status, 0);
    assert.match(r.stdout, /0 hits\. Clean\./);
  });
  test("--json prints a report", () => {
    const r = run(sloppy, ["--json"]);
    const report = JSON.parse(r.stdout);
    assert.equal(report.hits, report.details.length);
    assert.ok(report.hits >= 3);
  });
  test("--strict exits 1 at three or more hits and 0 below", () => {
    assert.equal(run(sloppy, ["--strict"]).status, 1);
    assert.equal(run("Let's dive in.", ["--strict"]).status, 0);
  });
  test("an .html file is read as HTML", () => {
    const r = run("<p>The run took <code>— leverage</code> 4 minutes.</p>", ["--json"], "page.html");
    assert.equal(JSON.parse(r.stdout).hits, 0);
  });
  test("a missing file exits 2", () => {
    assert.equal(spawnSync(process.execPath, [script, join(dir, "nope.md")], { encoding: "utf8" }).status, 2);
  });
  test("no file prints usage and exits 2; --help exits 0", () => {
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, "--help"], { encoding: "utf8" }).status, 0);
  });
});

describe("this repository follows its own rules", () => {
  /** Every Markdown file in the repo, except the deliberately sloppy example. */
  const markdown = (d) =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.name.startsWith(".") && e.name !== ".github" ? [] : e.isDirectory() ? markdown(join(d, e.name)) : e.name.endsWith(".md") ? [join(d, e.name)] : [],
    );
  for (const file of markdown(root).filter((f) => !f.endsWith("sloppy.md"))) {
    test(`${relative(root, file)} is Clean`, () => {
      assert.deepEqual(analyse(readFileSync(file, "utf8")).hits.map((h) => `${h.label} (line ${h.line}): ${h.sample}`), []);
    });
  }
  test("examples/sloppy.md reads as machine-written", () => {
    assert.ok(analyse(readFileSync(join(root, "examples", "sloppy.md"), "utf8")).hits.length >= 3);
  });
});
