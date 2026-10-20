#!/usr/bin/env node
// Flags the mechanical patterns in references/avoid.md. No dependencies; Node 22+.
// Usage: node check.mjs <file.md|file.html> [--json] [--context technical|marketing|social|casual] [--max-bold 3] [--allow-em-dash] [--strict]
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Tier 1: words that inflate a sentence on their own; flagged every time (stems match inflections). */
const INFLATED = [
  "delv(?:e|es|ed|ing)", "tapestr(?:y|ies)", "landscapes?", "realms?", "journeys?", "navigat(?:e|es|ed|ing)",
  "unlock(?:s|ed|ing)?", "unleash(?:es|ed|ing)?", "empower(?:s|ed|ing)?", "elevat(?:e|es|ed|ing)", "foster(?:s|ed|ing)?",
  "leverag(?:e|es|ed|ing)", "streamlin(?:e|es|ed|ing)", "supercharg(?:e|es|ed|ing)",
  "robust", "seamless(?:ly)?", "cutting-edge", "game-chang(?:er|ing)", "groundbreaking", "transformative",
  "pivotal", "crucial", "vital", "paramount", "intricate", "multifaceted", "holistic", "synerg(?:y|ies)",
  "paradigms?", "testament", "underscor(?:e|es|ed|ing)", "showcas(?:e|es|ed|ing)", "myriad", "plethora", "ever-evolving",
];
/** Tier 2: words that are fine alone but read as machine-made when two or more share a paragraph. */
const TIER2 = [
  "comprehensive", "enhanc(?:e|es|ed|ing|ement)", "optimi[sz](?:e|es|ed|ing)", "facilitat(?:e|es|ed|ing)", "utili[sz](?:e|es|ed|ing)",
  "innovative", "dynamic", "powerful", "meticulous(?:ly)?", "nuanced", "intricacies", "insightful", "invaluable",
  "bolster(?:s|ed|ing)?", "spearhead(?:s|ed|ing)?", "embark(?:s|ed|ing)?", "endeavou?rs?", "vibrant", "profound(?:ly)?",
  "compelling", "noteworthy", "unparalleled", "unwavering", "cornerstone", "linchpin", "bespoke", "curated", "elevated",
  "resonat(?:e|es|ed|ing)", "captivat(?:e|es|ed|ing)",
];
/** Tier 3: common words that only signal machine writing in bulk; flagged when they pass 3 per 100 words of a paragraph. */
const TIER3 = [
  "significant", "various", "numerous", "ensur(?:e|es|ed|ing)", "enabl(?:e|es|ed|ing)", "critical", "essential", "effective(?:ly)?",
  "efficient(?:ly)?", "overall", "crucially", "valuable", "ideal", "optimal", "impactful", "actionable", "deep dive",
  "at scale", "end-to-end", "best practices?", "real-world", "state-of-the-art", "seamlessly", "robustly",
  "holistically", "strategic(?:ally)?",
];
/** Hype that claims a quality instead of showing the number behind it. */
const HYPE = ["blazing(?:ly)?[- ]fast", "effortless(?:ly)?", "revolutionary", "best-in-class", "world-class", "next-level", "magic(?:al)?"];
/** Size words that need a number next to them. */
const VAGUE = ["significantly", "dramatically", "substantially", "vastly", "hugely", "a lot", "massively"];

/** Pattern rules run over the whole prose: [id, label, regex]. */
const PATTERNS = [
  ["reversal", "Reversal (it's not X, it's Y)", /\b(?:it'?s|this is|that'?s|is|are|was|were)\s+not\s+(?:just\s+|only\s+|about\s+)?[^.;:!?\n]{1,80}?[,;:]\s*(?:it'?s|it is|but|they'?re|they are|this is|that'?s)\b/gi],
  ["reversal", "Reversal (it's not X, it's Y)", /\bisn'?t\s+(?:just\s+|about\s+)?[^.;!?\n]{1,80}?[,;]\s*it'?s\b/gi],
  ["reversal", "Reversal (not just X, but Y)", /\bnot\s+(?:just|only|merely)\s+[^.;!?\n]{1,80}?,?\s+but\s+/gi],
  ["colon-setup", "Colon set-up", /(?:^|[.!?]\s+)(?:here'?s (?:the thing|why|what|how)|the (?:catch|kicker|bottom line|result|truth|answer|question|twist|takeaway)|bottom line|spoiler)\s*:/gim],
  ["grand-opener", "Grand opener", /\b(?:in today'?s|in an? (?:ever|rapidly|fast)[- ](?:evolving|changing|moving|paced)|in the (?:world|realm|age|era) of|now more than ever)\b/gi],
  ["announcing", "Announcing what's coming", /\b(?:in this (?:post|article|piece|guide|note),? (?:we'?ll|we will|i'?ll)|without further ado)\b/gi],
  ["lets", "\"Let's\" construction", /\blet'?s (?:dive in|look at|break (?:this|it) down|take a (?:closer )?look|unpack|walk through|explore)\b/gi],
  ["negation-chain", "Negation chain", /\bnot\s+\w+(?:\s+\w+)?[.,]\s+not\s+\w+(?:\s+\w+)?[.,]\s+(?:but|just|only)\b|\bno\s+\w+,\s+no\s+\w+,\s+(?:just|only)\b/gi],
  ["ing-clause", "Tacked-on -ing clause", /,\s+(?:highlighting|underscoring|reflecting|showcasing|emphasi[sz]ing|demonstrating|illustrating|signall?ing|cementing|solidifying)\b/gi],
  ["hyphen-stack", "Stacked hyphenated modifiers", /\b[a-z]+(?:-[a-z]+)+,\s+[a-z]+(?:-[a-z]+)+\s+[a-z]+/gi],
  ["false-agency", "False agency", /\b(?:the\s+)?(?:data|numbers|results|metrics)\s+(?:tells?|told)\s+us\b|\bthe numbers don'?t lie\b|\bthe (?:model|algorithm|data) (?:decided|wants|believes|knows)\b/gi],
  ["copula", "Avoiding \"is\"", /\b(?:serves|served|stands|stood|acts|functions)\s+as\s+(?:a|an|the)\b/gi],
  ["future-closer", "Future-gazing closer", /\b(?:the future is (?:bright|here)|only time will tell|this is (?:just|only) the beginning|the possibilities are endless)\b/gi],
  ["significance", "Significance inflation", /\b(?:marks? an? (?:turning point|new era|milestone|pivotal moment)|plays? an? (?:key|vital|crucial|pivotal|central) role|sets? the stage for|paves? the way for)\b/gi],
  ["novelty", "Novelty inflation", /\b(?:for the first time(?: ever)?|unprecedented|never[- ]before[- ]seen)\b/gi],
  ["transformation", "Transformation talk", /\b(?:transforms? (?:the way|how)|changes? everything|reimagin(?:e|es|ed|ing))\b/gi],
  ["aphorism", "Aphorism", /\b\w+ (?:is|are) the new \w+\b/gi],
  ["real-problem", "\"The real problem\"", /\bthe (?:real|actual) (?:issue|problem|question|story|challenge|reason)\b|\bwhat (?:really|actually) matters\b/gi],
  ["self-label", "Self-labelled significance", /\b(?:the key (?:insight|takeaway|point) (?:is|here)|this is the (?:crucial|key|important) (?:part|bit|point)|here'?s what'?s (?:interesting|fascinating|surprising)|what'?s (?:fascinating|interesting) (?:is|here))\b/gi],
  ["candour", "Narrated candour", /\b(?:to be (?:honest|frank)|frankly(?=,)|let'?s be (?:clear|honest)|the truth is)\b/gi],
  ["confidence", "Confidence phrase", /\b(?:i'?m confident that|rest assured|without a doubt|make no mistake)\b/gi],
  ["filler", "Filler phrase", /\b(?:in order to|due to the fact that|at this point in time|the fact that)\b/gi],
  ["attribution", "Vague attribution", /\b(?:experts (?:say|agree|believe)|studies (?:show|suggest|have shown)|research (?:shows|suggests|has shown)|it is widely (?:believed|accepted|known)|many (?:believe|argue|say))\b/gi],
  ["crowd", "Contrast against the crowd", /\b(?:most (?:teams|people|companies|developers|engineers|founders) (?:get|think|believe|assume|miss|ignore|judge)|unlike (?:everyone else|most (?:teams|companies|tools)))\b/gi],
  ["listicle", "Listicle heading", /^#{1,6}\s+(?:the\s+)?\d+\s+(?:ways|reasons|lessons|things|tips|tricks|mistakes|rules)\b/gim],
  ["placeholder", "Unfilled placeholder", /\{\{[^}\n]*\}\}|\[(?:TODO|TBD|insert[^\]\n]*)\]|lorem ipsum/gi],
  ["chatter", "Assistant chatter", /\b(?:great question|i hope this helps|let me know if|as an ai\b|happy to help)|\bcertainly!/gi],
  ["reasoning", "Reasoning out loud", /\b(?:let me think(?: step by step)?|okay, so\b|first, i'?ll)/gi],
  ["cutoff", "Knowledge-cutoff disclaimer", /\b(?:as of my (?:last|latest) (?:update|knowledge)|based on my training data|my knowledge cutoff)\b/gi],
  ["send-off", "Summary or send-off", /\b(?:in conclusion|in summary|to sum up|ultimately(?=,)|at the end of the day|all in all)\b/gi],
  ["signpost", "Signpost", /\b(?:it'?s worth noting(?: that)?|it is worth noting|importantly,|interestingly,|notably,|needless to say|it goes without saying)/gi],
  ["rhetorical", "Rhetorical question", /\b(?:so,? )?(?:what does (?:this|that) mean|why does (?:this|it|that) matter|what'?s the catch|the question is)\b[^?\n]*\?/gi],
  ["hedge-stack", "Stacked hedge", /\b(?:may|might|could) (?:potentially|possibly|perhaps)\b|\(arguably\)/gi],
  ["intensifier", "Hollow intensifier", /\b(?:genuinely|truly|incredibly|extremely)\b|\ba real (?:improvement|difference|win|step|game-changer)\b/gi],
  ["template", "Template phrase", /\ba (?:\w+ )?step (?:towards|toward|forward)\b|\bwhether you'?re an? [^,.\n]{1,40} or\b/gi],
  ["transition", "Transition filler", /(?:^|[.!?]\s+)(?:moreover|furthermore|additionally),|\bwhen it comes to\b|\bthat (?:being )?said,/gim],
  ["endorsement", "Vague endorsement", /\bworth (?:reading|exploring|a look|your time|checking out|paying attention to)\b/gi],
  ["despite-formula", "\"Despite challenges\" formula", /\bdespite (?:these |the |its |their |some )?(?:challenges|hurdles|setbacks|obstacles)\b[^.\n]{0,80}\b(?:continues?|remains?)\b/gi],
  ["moral-adjective", "Moral adjective on a thing", /\b(?:honest|responsible|ethical|brave|humble|trustworthy)\s+(?:metrics?|pipelines?|dashboards?|code|architecture|apis?|numbers?|data|models?|benchmarks?)\b/gi],
  ["stranded-contrast", "Stranded contrast", /\b(?:it|they|we|this|that) (?:does|do|is|are|can|did|works?)\.\s+(?:it|they|we|this|that) (?:really|truly|absolutely|actually) (?:does|do|is|are|can|did|works?)\b/gi],
  ["hook", "Infomercial hook", /\bbut wait\b|\bwant to know the secret\b|\bhere'?s the kicker\b|\byou won'?t believe\b/gi],
  ["launch-opener", "Launch-copy opener", /^(?:[Mm]eet|[Ii]ntroducing|[Ss]ay hello to) [A-Z][^.\n]{0,60}[.!]/gm],
  ["fake-casual", "Fake-casual register", /\b(?:it slaps|lowkey|ngl|no cap|chef'?s kiss|hits different)\b/gi],
  ["reaction", "Stock reaction framing", /\b[\w-]+(?: [\w-]+)?\? (?:absolutely|definitely|yes|100%)[.!]/gi],
  ["engagement", "Engagement closer", /\bdrop a comment\b|\blet me know in the comments\b|\blike and (?:share|subscribe)\b|\bsmash that\b|^thoughts\?\s*$/gim],
  ["sycophancy", "Sycophancy or acknowledgement loop", /\byou'?re absolutely right\b|\bwhat a great (?:question|point)\b|\bgreat point\b|\bas you (?:rightly|correctly) (?:pointed out|noted|said)\b/gi],
  ["inflated", "Inflated word", new RegExp(`\\b(?:${INFLATED.join("|")})\\b`, "gi")],
  ["hype", "Hype", new RegExp(`\\b(?:${HYPE.join("|")})\\b`, "gi")],
  ["emoji", "Emoji in prose", /\p{Emoji_Presentation}/gu],
];

/** Leftovers from chat tools, matched on the raw file before links are stripped. */
const RAW_PATTERNS = [["tool-leftover", "Tool leftover", /oaicite|【[^】\n]*】|utm_source=(?:chatgpt\.com|openai)/gi]];

/**
 * How many hits of a rule each context lets through before they count. Rules not listed allow none;
 * Infinity switches a rule off. Technical is the default and the strictest.
 */
export const TOLERANCE = {
  technical: {},
  marketing: { lets: 1, rhetorical: 1, "stacked-questions": 1, "uniform-paragraphs": Infinity },
  social: { emoji: 2, hashtags: Infinity, staccato: 1, "mic-drop": 1, rhetorical: 1, lets: 1, "launch-opener": 1, bold: Infinity, "wall-of-text": Infinity, "uniform-paragraphs": Infinity },
  casual: { lets: 2, "fake-casual": 2, rhetorical: 1, staccato: 1, "mic-drop": 1, emoji: 1, candour: 1, "uniform-paragraphs": Infinity },
};

/** Parse command-line flags. */
export const parseArgs = (argv) => {
  const o = { file: null, json: false, maxBold: 3, allowEmDash: false, strict: false, context: "technical" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") o.json = true;
    else if (a === "--allow-em-dash") o.allowEmDash = true;
    else if (a === "--strict") o.strict = true;
    else if (a === "--max-bold") o.maxBold = Number(argv[++i]);
    else if (a === "--context") o.context = argv[++i];
    else if (a === "-h" || a === "--help") o.help = true;
    else o.file = a;
  }
  return o;
};

/** Turn HTML into Markdown-ish prose: headings, bold and paragraphs kept, markup and code dropped. */
const fromHtml = (html) =>
  html
    .replace(/<(script|style|code|pre|table)[\s\S]*?<\/\1>/gi, "")
    .replace(/<h([1-6])[^>]*>/gi, (_, n) => "\n\n" + "#".repeat(Number(n)) + " ")
    .replace(/<\/?(strong|b)>/gi, "**")
    .replace(/<(p|li|div|figcaption|h[1-6]|tr|br)[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'");

/** Blank out a removed region but keep its line breaks, so later line numbers still match the source. */
const blank = (m) => m.replace(/[^\n]/g, "");

/** Remove regions between check:off and check:on comments (to the end of the file if check:on is missing). */
const dropOff = (s) => s.replace(/<!--\s*check:off\s*-->[\s\S]*?(?:<!--\s*check:on\s*-->|$)/g, blank);

/** Drop front matter, fenced code, inline code and check:off regions, which aren't prose to judge. */
const proseOnly = (md) =>
  dropOff(md).replace(/^---\n[\s\S]*?\n---\n/, blank).replace(/```[\s\S]*?```/g, blank).replace(/`[^`\n]*`/g, "").replace(/\]\([^)\s]*\)/g, "]").replace(/https?:\/\/\S+/g, "");

/** Split a paragraph into sentences. */
const sentences = (p) => p.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"(])/).filter(Boolean);

/** Count words in a sentence. */
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** 1-based line number of an offset. */
const lineAt = (text, i) => text.slice(0, i).split("\n").length;

/** Run every check and return the hits. */
const check = (text, o, raw = "") => {
  const hits = [];
  const add = (rule, label, sample, line) => hits.push({ rule, label, sample: sample.replace(/\s+/g, " ").trim().slice(0, 140), line });
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
  for (const [rule, label, re] of RAW_PATTERNS) for (const m of raw.matchAll(re)) add(rule, label, m[0], lineAt(raw, m.index));
  if (!o.allowEmDash) for (const m of text.matchAll(/—|\s--\s/g)) if (!inTable(m.index)) add("em-dash", "Em dash", text.slice(Math.max(0, m.index - 30), m.index + 30), lineAt(text, m.index));
  /** Bold that opens a list item is a label for that item, so it doesn't count as emphasis. */
  const isListLabel = (i) => /^\s*(?:[-*]|\d+\.)\s+$/.test(text.slice(text.lastIndexOf("\n", i - 1) + 1, i));
  const bold = [...text.matchAll(/\*\*[^*\n]+\*\*/g)].filter((b) => !isListLabel(b.index) && !inTable(b.index));
  if (bold.length > o.maxBold) add("bold", `Bold used ${bold.length} times (max ${o.maxBold})`, bold.map((b) => b[0]).slice(0, 3).join(" · "), lineAt(text, bold[0].index));
  let offset = 0;
  /** Word counts of consecutive prose paragraphs, for the uniform-length check. */
  let streak = [];
  /** Flag a run of five or more prose paragraphs of nearly the same length. */
  const closeStreak = () => {
    if (streak.length >= 5) add("uniform-paragraphs", "Uniform paragraph length", `${streak.length} paragraphs of ${Math.min(...streak.map((x) => x.n))} to ${Math.max(...streak.map((x) => x.n))} words`, streak[0].line);
    streak = [];
  };
  const tier2 = new RegExp(`\\b(?:${TIER2.join("|")})\\b`, "gi"), tier3 = new RegExp(`\\b(?:${TIER3.join("|")})\\b`, "gi");
  for (const block of text.split(/\n\s*\n/)) {
    const start = text.indexOf(block, offset); offset = start + block.length;
    const t = block.trim();
    if (!t || t.startsWith("#") || t.startsWith("|") || /^(?:[-*]|\d+\.)\s/.test(t)) { if (t) closeStreak(); continue; }
    const n = words(t);
    if (n > 180) add("wall-of-text", `Wall of text (${n} words in one paragraph)`, t, lineAt(text, start));
    if (n >= 40) {
      const avg = streak.length ? streak.reduce((a, x) => a + x.n, 0) / streak.length : n;
      if (streak.length && Math.abs(n - avg) > avg * 0.15) closeStreak();
      streak.push({ n, line: lineAt(text, start) });
    } else closeStreak();
    const t2 = [...new Set([...t.matchAll(tier2)].map((m) => m[0].toLowerCase()))];
    if (t2.length >= 2) add("inflated-cluster", "Inflated words clustered in one paragraph", t2.join(", "), lineAt(text, start));
    const t3 = [...t.matchAll(tier3)].map((m) => m[0].toLowerCase());
    if (t3.length >= 3 && t3.length / n > 0.03) add("inflated-density", `Filler words at high density (${t3.length} in ${n} words)`, t3.join(", "), lineAt(text, start));
    const ss = sentences(t.replace(/\*\*/g, ""));
    let qs = 0;
    for (const s of ss) { qs = s.trim().endsWith("?") ? qs + 1 : 0; if (qs === 2) add("stacked-questions", "Stacked rhetorical questions", s, lineAt(text, start)); }
    let run = 0, same = 1;
    /** First word of a sentence, ignoring articles. */
    const opener = (x) => (x.match(/^[("']*([\p{L}']+)/u) || [])[1]?.toLowerCase();
    ss.forEach((s, i) => {
      const w = opener(s);
      same = i > 0 && w && !["the", "a", "an"].includes(w) && w === opener(ss[i - 1]) ? same + 1 : 1;
      if (same === 3) add("same-opener", "Same-opener run", ss.slice(i - 2, i + 1).join(" "), lineAt(text, start));
      run = words(s) <= 5 ? run + 1 : 0;
      if (run === 3) add("staccato", "Staccato run", ss.slice(i - 2, i + 1).join(" "), lineAt(text, start));
      const vague = VAGUE.find((v) => new RegExp(`\\b${v}\\b`, "i").test(s));
      if (vague && !/\d/.test(s)) add("vague", `Vague size word ("${vague}") with no number`, s, lineAt(text, start));
    });
    const last = ss[ss.length - 1] || "";
    if (ss.length >= 3 && words(last) <= 4 && !/\d/.test(last) && !/^see\b/i.test(last) && !/:$/.test(last)) add("mic-drop", "Mic-drop ending", ss[ss.length - 1], lineAt(text, start));
  }
  closeStreak();
  const tags = [...text.matchAll(/(?:^|\s)#[A-Za-z][\w]*/g)];
  if (tags.length >= 3) add("hashtags", `Hashtags (${tags.length})`, tags.map((m) => m[0].trim()).slice(0, 5).join(" "), lineAt(text, tags[0].index));
  const notes = [...text.matchAll(/,\s+not\s+[^,.;\n]{1,40}/g)].filter((m) => !inTable(m.index)).map((m) => ({ kind: "x-not-y", sample: m[0].trim(), line: lineAt(text, m.index) }));
  /** Short codes and IDs (DEV-6, E1, APP-123), listed at first use so a reader can check each is explained. */
  const seenCodes = new Set();
  for (const m of text.matchAll(/\b(?:[A-Z]{2,6}-\d+|[A-Z]\d{1,2})\b/g)) {
    if (seenCodes.has(m[0]) || inTable(m.index)) continue;
    seenCodes.add(m[0]);
    notes.push({ kind: "name", sample: text.slice(m.index, m.index + 60).split("\n")[0], line: lineAt(text, m.index) });
  }
  return { hits, notes };
};

/** The verdict for a number of hits. */
export const verdict = (n) => (n === 0 ? "Clean" : n < 3 ? "Review the hits" : "Rewrite: 3 or more hits reads as machine-written");

/** Check a document's raw text. Set `html` for an HTML page; other options as for the command line. */
export const analyse = (input, { html = false, maxBold = 3, allowEmDash = false, context = "technical" } = {}) => {
  if (!TOLERANCE[context]) throw new Error(`Unknown context "${context}"; use ${Object.keys(TOLERANCE).join(", ")}`);
  // Curly quotes become straight ones (same length, so offsets don't move) so "Let’s" matches like "Let's".
  const raw = input.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  const text = html ? proseOnly(fromHtml(dropOff(raw))) : proseOnly(raw);
  const { hits: all, notes } = check(text, { maxBold, allowEmDash }, dropOff(raw));
  const allowed = TOLERANCE[context], used = {};
  const hits = all.filter((h) => (used[h.rule] = (used[h.rule] ?? 0) + 1) > (allowed[h.rule] ?? 0));
  if (html) for (const h of [...hits, ...notes]) h.line = sourceLine(raw, h.sample) ?? h.line;
  return { hits, notes, verdict: verdict(hits.length) };
};

/** The source line of a sample in an HTML file, allowing tags and line breaks between its first words. */
const sourceLine = (raw, sample) => {
  const ws = sample.replace(/\*\*/g, "").split(/\s+/).filter(Boolean).slice(0, 4).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!ws.length) return null;
  const m = new RegExp(ws.join("(?:\\s|<[^>]+>)+"), "i").exec(raw);
  return m ? lineAt(raw, m.index) : null;
};

/** Command-line entry point. */
const main = () => {
  const o = parseArgs(process.argv.slice(2));
  if (o.help || !o.file) {
    console.log("Usage: node check.mjs <file.md|file.html> [--json] [--context technical|marketing|social|casual] [--max-bold 3] [--allow-em-dash] [--strict]");
    process.exit(o.help ? 0 : 2);
  }
  let raw;
  try { raw = readFileSync(o.file, "utf8"); } catch (e) { console.error(`Can't read ${o.file}: ${e.message}`); process.exit(2); }
  const { hits, notes } = analyse(raw, { ...o, html: /\.html?$/i.test(o.file) });
  if (o.json) {
    console.log(JSON.stringify({ file: o.file, hits: hits.length, verdict: verdict(hits.length), details: hits, xNotY: notes.filter((n) => n.kind === "x-not-y"), names: notes.filter((n) => n.kind === "name") }, null, 2));
  } else {
    console.log(`${o.file}: ${hits.length} hit${hits.length === 1 ? "" : "s"}. ${verdict(hits.length)}.`);
    const byRule = Map.groupBy(hits, (h) => h.label);
    for (const [label, hs] of byRule) {
      console.log(`\n${label} (${hs.length})`);
      hs.slice(0, 5).forEach((h) => console.log(`  line ${h.line}: ${h.sample}`));
      if (hs.length > 5) console.log(`  … ${hs.length - 5} more`);
    }
    const xs = notes.filter((n) => n.kind === "x-not-y"), names = notes.filter((n) => n.kind === "name");
    if (xs.length) {
      console.log(`\nTo read by hand: ", not …" (${xs.length}). Keep each only if it states a real distinction.`);
      xs.slice(0, 5).forEach((n) => console.log(`  line ${n.line}: ${n.sample}`));
    }
    if (names.length) {
      console.log(`\nTo read by hand: codes and IDs at first use (${names.length}). Check each is explained or linked there.`);
      names.slice(0, 8).forEach((n) => console.log(`  line ${n.line}: ${n.sample}`));
    }
  }
  process.exit(o.strict && hits.length >= 3 ? 1 : 0);
};

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
