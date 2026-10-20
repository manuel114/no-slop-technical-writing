#!/usr/bin/env node
// Flags the mechanical patterns in references/avoid.md. No dependencies; Node 22+.
// Usage: node check.mjs <file.md|file.html> [--json] [--max-bold 3] [--allow-em-dash] [--strict]
import { readFileSync } from "node:fs";

/** Words that inflate a sentence without adding meaning (stems match common inflections). */
const INFLATED = [
  "delv(?:e|es|ed|ing)", "tapestr(?:y|ies)", "landscapes?", "realms?", "journeys?", "navigat(?:e|es|ed|ing)",
  "unlock(?:s|ed|ing)?", "unleash(?:es|ed|ing)?", "empower(?:s|ed|ing)?", "elevat(?:e|es|ed|ing)", "foster(?:s|ed|ing)?",
  "leverag(?:e|es|ed|ing)", "streamlin(?:e|es|ed|ing)", "supercharg(?:e|es|ed|ing)",
  "robust", "seamless(?:ly)?", "cutting-edge", "game-chang(?:er|ing)", "groundbreaking", "transformative",
  "pivotal", "crucial", "vital", "paramount", "intricate", "multifaceted", "holistic", "synerg(?:y|ies)",
  "paradigms?", "testament", "underscor(?:e|es|ed|ing)", "showcas(?:e|es|ed|ing)", "myriad", "plethora", "ever-evolving",
];
/** Hype that claims a quality instead of showing the number behind it. */
const HYPE = ["blazing(?:ly)?[- ]fast", "effortless(?:ly)?", "revolutionary", "best-in-class", "world-class", "next-level", "magic(?:al)?"];
/** Size words that need a number next to them. */
const VAGUE = ["significantly", "dramatically", "substantially", "vastly", "hugely", "a lot", "massively"];

/** Pattern rules run over the whole prose: [id, label, regex]. */
const PATTERNS = [
  ["reversal", "Reversal (it's not X, it's Y)", /\b(?:it'?s|this is|that'?s|is|are|was|were)\s+not\s+(?:just\s+|only\s+|about\s+)?[^.;:!?\n]{1,80}?[,;:]\s*(?:it'?s|but|they'?re|this is|that'?s)\b/gi],
  ["reversal", "Reversal (it's not X, it's Y)", /\bisn'?t\s+(?:just\s+|about\s+)?[^.;!?\n]{1,80}?[,;]\s*it'?s\b/gi],
  ["reversal", "Reversal (not just X, but Y)", /\bnot\s+(?:just|only|merely)\s+[^.;!?\n]{1,80}?,?\s+but\s+/gi],
  ["colon-setup", "Colon set-up", /(?:^|[.!?]\s+)(?:here'?s (?:the thing|why|what|how)|the (?:catch|kicker|bottom line|result|truth|answer|question|twist|takeaway)|bottom line|spoiler)\s*:/gim],
  ["grand-opener", "Grand opener", /\b(?:in today'?s|in an? (?:ever|rapidly|fast)[- ](?:evolving|changing|moving|paced)|in the (?:world|realm|age|era) of|now more than ever)\b/gi],
  ["announcing", "Announcing what's coming", /\b(?:in this (?:post|article|piece|guide|note),? (?:we'?ll|we will|i'?ll)|let'?s dive in|let'?s (?:take a look|explore)|without further ado)\b/gi],
  ["send-off", "Summary or send-off", /\b(?:in conclusion|in summary|to sum up|ultimately(?=,)|at the end of the day|all in all)\b/gi],
  ["signpost", "Signpost", /\b(?:it'?s worth noting(?: that)?|it is worth noting|importantly,|interestingly,|notably,|needless to say|it goes without saying)/gi],
  ["rhetorical", "Rhetorical question", /\b(?:so,? )?(?:what does (?:this|that) mean|why does (?:this|it|that) matter|what'?s the catch|the question is)\b[^?\n]*\?/gi],
  ["hedge-stack", "Stacked hedge", /\b(?:may|might|could) (?:potentially|possibly|perhaps)\b/gi],
  ["inflated", "Inflated word", new RegExp(`\\b(?:${INFLATED.join("|")})\\b`, "gi")],
  ["hype", "Hype", new RegExp(`\\b(?:${HYPE.join("|")})\\b`, "gi")],
  ["emoji", "Emoji in prose", /\p{Extended_Pictographic}/gu],
];

/** Parse command-line flags. */
const parseArgs = (argv) => {
  const o = { file: null, json: false, maxBold: 3, allowEmDash: false, strict: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") o.json = true;
    else if (a === "--allow-em-dash") o.allowEmDash = true;
    else if (a === "--strict") o.strict = true;
    else if (a === "--max-bold") o.maxBold = Number(argv[++i]);
    else if (a === "-h" || a === "--help") o.help = true;
    else o.file = a;
  }
  return o;
};

/** Turn HTML into Markdown-ish prose: headings, bold and paragraphs kept, markup and code dropped. */
const fromHtml = (html) =>
  html
    .replace(/<(script|style|code|pre)[\s\S]*?<\/\1>/gi, "")
    .replace(/<h([1-6])[^>]*>/gi, (_, n) => "\n\n" + "#".repeat(Number(n)) + " ")
    .replace(/<\/?(strong|b)>/gi, "**")
    .replace(/<(p|li|div|figcaption|h[1-6]|tr|br)[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'");

/** Drop front matter, fenced code and inline code, which aren't prose. */
const proseOnly = (md) =>
  md.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

/** Split a paragraph into sentences. */
const sentences = (p) => p.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"(])/).filter(Boolean);

/** Count words in a sentence. */
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** 1-based line number of an offset. */
const lineAt = (text, i) => text.slice(0, i).split("\n").length;

/** Run every check and return the hits. */
const check = (text, o) => {
  const hits = [];
  const add = (rule, label, sample, line) => hits.push({ rule, label, sample: sample.trim().slice(0, 140), line });
  const seen = new Set();
  const lines = text.split("\n");
  /** Whether a match sits in a Markdown table row, where fragments and symbols are normal. */
  const inTable = (i) => lines[lineAt(text, i) - 1].trimStart().startsWith("|");
  for (const [rule, label, re] of PATTERNS) for (const m of text.matchAll(re)) {
    if (inTable(m.index)) continue;
    const key = `${rule}:${lineAt(text, m.index)}:${Math.floor(m.index / 40)}`;
    if (rule === "reversal" && seen.has(key)) continue;
    seen.add(key); add(rule, label, m[0], lineAt(text, m.index));
  }
  if (!o.allowEmDash) for (const m of text.matchAll(/—|\s--\s/g)) add("em-dash", "Em dash", text.slice(Math.max(0, m.index - 30), m.index + 30), lineAt(text, m.index));
  const bold = [...text.matchAll(/\*\*[^*\n]+\*\*/g)];
  if (bold.length > o.maxBold) add("bold", `Bold used ${bold.length} times (max ${o.maxBold})`, bold.map((b) => b[0]).slice(0, 3).join(" · "), lineAt(text, bold[0].index));
  let offset = 0;
  for (const block of text.split(/\n\s*\n/)) {
    const start = text.indexOf(block, offset); offset = start + block.length;
    const t = block.trim();
    if (!t || t.startsWith("#") || t.startsWith("|") || /^(?:[-*]|\d+\.)\s/.test(t)) continue;
    const ss = sentences(t.replace(/\*\*/g, ""));
    let run = 0;
    ss.forEach((s, i) => {
      run = words(s) <= 5 ? run + 1 : 0;
      if (run === 3) add("staccato", "Staccato run", ss.slice(i - 2, i + 1).join(" "), lineAt(text, start));
      const vague = VAGUE.find((v) => new RegExp(`\\b${v}\\b`, "i").test(s));
      if (vague && !/\d/.test(s)) add("vague", `Vague size word ("${vague}") with no number`, s, lineAt(text, start));
    });
    if (ss.length >= 3 && words(ss[ss.length - 1]) <= 4 && !/\d/.test(ss[ss.length - 1])) add("mic-drop", "Mic-drop ending", ss[ss.length - 1], lineAt(text, start));
  }
  const notes = [...text.matchAll(/,\s+not\s+[^,.;\n]{1,40}/g)].filter((m) => !inTable(m.index)).map((m) => ({ sample: m[0].trim(), line: lineAt(text, m.index) }));
  return { hits, notes };
};

/** The verdict for a number of hits. */
const verdict = (n) => (n === 0 ? "Clean" : n < 3 ? "Review the hits" : "Rewrite: 3 or more hits reads as machine-written");

const o = parseArgs(process.argv.slice(2));
if (o.help || !o.file) {
  console.log("Usage: node check.mjs <file.md|file.html> [--json] [--max-bold 3] [--allow-em-dash] [--strict]");
  process.exit(o.help ? 0 : 2);
}
let raw;
try { raw = readFileSync(o.file, "utf8"); } catch (e) { console.error(`Can't read ${o.file}: ${e.message}`); process.exit(2); }
const text = proseOnly(/\.html?$/i.test(o.file) ? fromHtml(raw) : raw);
const { hits, notes } = check(text, o);
if (o.json) {
  console.log(JSON.stringify({ file: o.file, hits: hits.length, verdict: verdict(hits.length), details: hits, xNotY: notes }, null, 2));
} else {
  console.log(`${o.file}: ${hits.length} hit${hits.length === 1 ? "" : "s"}. ${verdict(hits.length)}.`);
  const byRule = Map.groupBy(hits, (h) => h.label);
  for (const [label, hs] of byRule) {
    console.log(`\n${label} (${hs.length})`);
    hs.slice(0, 5).forEach((h) => console.log(`  line ${h.line}: ${h.sample}`));
    if (hs.length > 5) console.log(`  … ${hs.length - 5} more`);
  }
  if (notes.length) {
    console.log(`\nTo read by hand: ", not …" (${notes.length}). Keep each only if it states a real distinction.`);
    notes.slice(0, 5).forEach((n) => console.log(`  line ${n.line}: ${n.sample}`));
  }
}
process.exit(o.strict && hits.length >= 3 ? 1 : 0);
