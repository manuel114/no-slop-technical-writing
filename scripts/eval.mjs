#!/usr/bin/env node
// Scores the check script against the labelled corpus in tests/corpus. No dependencies; Node 22+.
// Usage: node scripts/eval.mjs [--json]
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyse } from "./check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The context named in a sample's front matter ("context: social"), or technical. */
const contextOf = (text) => text.match(/^---\n[\s\S]*?\bcontext:\s*(\w+)[\s\S]*?\n---/)?.[1] ?? "technical";

/** Run every sample and say whether the check script judged it as labelled. */
export const evaluate = () => {
  const rows = [];
  for (const label of ["machine", "human"]) {
    const dir = join(root, "tests", "corpus", label);
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
      const text = readFileSync(join(dir, name), "utf8");
      const context = contextOf(text);
      const { hits } = analyse(text, { context });
      // A machine sample should get a Rewrite verdict (3+ hits); a human one should not.
      const ok = label === "machine" ? hits.length >= 3 : hits.length < 3;
      rows.push({ sample: `${label}/${name}`, label, context, hits: hits.length, ok, rules: [...new Set(hits.map((h) => h.rule))] });
    }
  }
  const of = (l) => rows.filter((r) => r.label === l);
  return { rows, caught: of("machine").filter((r) => r.ok).length, machine: of("machine").length, passed: of("human").filter((r) => r.ok).length, human: of("human").length };
};

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = evaluate();
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    for (const row of r.rows) console.log(`${row.ok ? "ok  " : "MISS"} ${row.sample} (${row.context}): ${row.hits} hits${row.rules.length ? ` [${row.rules.join(", ")}]` : ""}`);
    console.log(`\nMachine samples flagged for a rewrite: ${r.caught} of ${r.machine}. Human samples left alone: ${r.passed} of ${r.human}.`);
  }
  process.exit(r.caught === r.machine && r.passed === r.human ? 0 : 1);
}
