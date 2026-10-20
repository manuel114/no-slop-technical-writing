#!/usr/bin/env node
// Render the two charts in examples/clean.md as static SVG files. No dependencies; Node 22+.
// Every number comes from the prices and token counts below, the same ones as the article's table.
// Run from the repository root: node examples/charts/make-charts.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Token counts per request and prices in dollars per million tokens, from the article's table. */
const T = { instructions: 6000, conversation: 800, answer: 300 };
const P = { input: 3, write: 3.75, read: 0.3, output: 15 };

/** Cost in cents of some tokens at a price per million. */
const cents = (tokens, price) => (tokens * price) / 1e4;

/** Cost of each part of a request, in cents, for the three ways the instructions can be billed. */
const parts = {
  none: [cents(T.instructions, P.input), cents(T.conversation, P.input), cents(T.answer, P.output)],
  hit: [cents(T.instructions, P.read), cents(T.conversation, P.input), cents(T.answer, P.output)],
  miss: [cents(T.instructions, P.write), cents(T.conversation, P.input), cents(T.answer, P.output)],
};
const total = (k) => parts[k].reduce((a, b) => a + b, 0);
const [NONE, HIT, MISS] = [total("none"), total("hit"), total("miss")];
/** Average cost per request at a given hit rate. */
const avg = (h) => h * HIT + (1 - h) * MISS;
/** The hit rate above which caching costs less than not caching. */
const BREAK_EVEN = (MISS - NONE) / (MISS - HIT);

/** Colours: one per part of a request, plus ink and rules. Validated for contrast on white. */
const C = { s1: "#2f6fbd", s2: "#8fb3e0", s3: "#d98b2b", ink: "#1f2328", ink3: "#59636e", rule: "#d0d7de", grid: "#eef1f4" };
const FONT = `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"`;

/** Wrap chart content in an SVG with a white card background, so it reads in light and dark themes. */
const svg = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}" ${FONT}>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="6" fill="#ffffff" stroke="${C.rule}"/>
${body}
</svg>
`;

/** Chart 1: stacked bars of what each part of a request costs, highest total first. */
const costChart = () => {
  const W = 720, L = 150, R = 70, top = 58, rowH = 46, max = 3;
  const rows = [["Miss", "miss"], ["No caching", "none"], ["Hit", "hit"]];
  const x = (v) => L + (v / max) * (W - L - R);
  const H = top + rows.length * rowH + 40;
  const names = ["Instructions", "Conversation so far", "Answer"];
  const cols = [C.s1, C.s2, C.s3];
  let g = "";
  names.forEach((n, i) => {
    const lx = L + i * 170;
    g += `<rect x="${lx}" y="20" width="12" height="12" fill="${cols[i]}"/><text x="${lx + 18}" y="30" font-size="13" fill="${C.ink3}">${n}</text>`;
  });
  for (let v = 0; v <= max; v += 0.5) g += `<line x1="${x(v)}" y1="${top - 8}" x2="${x(v)}" y2="${top + rows.length * rowH - 8}" stroke="${C.grid}"/><text x="${x(v)}" y="${top + rows.length * rowH + 10}" font-size="12" fill="${C.ink3}" text-anchor="middle">${v.toFixed(1)}¢</text>`;
  rows.forEach(([label, k], r) => {
    const y = top + r * rowH;
    let acc = 0;
    g += `<text x="${L - 10}" y="${y + 19}" font-size="13" fill="${C.ink}" text-anchor="end" font-weight="${k === "hit" ? 600 : 400}">${label}</text>`;
    parts[k].forEach((v, i) => {
      g += `<rect x="${x(acc)}" y="${y}" width="${x(acc + v) - x(acc)}" height="28" fill="${cols[i]}"/>`;
      acc += v;
    });
    g += `<text x="${x(acc) + 8}" y="${y + 19}" font-size="13" fill="${C.ink}" font-weight="600">${acc.toFixed(2)}¢</text>`;
  });
  g += `<text x="${(L + W - R) / 2}" y="${H - 8}" font-size="12" fill="${C.ink3}" text-anchor="middle">Cost of one request, in cents</text>`;
  return svg(W, H, `Cost of one request by part: a miss costs ${MISS.toFixed(2)} cents, no caching ${NONE.toFixed(2)}, a hit ${HIT.toFixed(2)}; only the instructions change.`, g);
};

/** Requests and hit rate by time of day, from the request logs (the article's second table). */
const PERIODS = [
  { label: "08:00 to 20:00", requests: 32960, hitRate: 0.97 },
  { label: "20:00 to 08:00", requests: 8240, hitRate: 0.72 },
];
const ALL = PERIODS.reduce((a, p) => a + p.requests, 0);
const MONTH_HIT_RATE = PERIODS.reduce((a, p) => a + p.requests * p.hitRate, 0) / ALL;
/** Saving against no caching at a hit rate, as a fraction. */
const saving = (h) => 1 - avg(h) / NONE;

/** Chart 2: saving against no caching by time of day, highest first, with the whole month highlighted. */
const savingChart = () => {
  const rows = [
    ...PERIODS.map((p) => ({ label: p.label, sub: `${p.requests.toLocaleString("en-US")} requests, ${Math.round(p.hitRate * 100)}% hits`, v: saving(p.hitRate), own: false })),
    { label: "Whole month", sub: `${ALL.toLocaleString("en-US")} requests, ${Math.round(MONTH_HIT_RATE * 100)}% hits`, v: saving(MONTH_HIT_RATE), own: true },
  ].sort((a, b) => b.v - a.v);
  const W = 720, L = 210, R = 60, top = 20, rowH = 54;
  const x = (v) => L + v * (W - L - R);
  const H = top + rows.length * rowH + 40;
  let g = "";
  for (let v = 0; v <= 1.0001; v += 0.2) g += `<line x1="${x(v)}" y1="${top - 6}" x2="${x(v)}" y2="${top + rows.length * rowH - 10}" stroke="${C.grid}"/><text x="${x(v)}" y="${top + rows.length * rowH + 8}" font-size="12" fill="${C.ink3}" text-anchor="middle">${Math.round(v * 100)}%</text>`;
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    g += `<text x="${L - 12}" y="${y + 14}" font-size="13" fill="${C.ink}" text-anchor="end" font-weight="${r.own ? 600 : 400}">${r.label}</text>`;
    g += `<text x="${L - 12}" y="${y + 30}" font-size="11" fill="${C.ink3}" text-anchor="end">${r.sub}</text>`;
    g += `<rect x="${x(0)}" y="${y + 2}" width="${x(r.v) - x(0)}" height="28" fill="${r.own ? C.s1 : C.s2}"/>`;
    g += `<text x="${x(r.v) + 8}" y="${y + 21}" font-size="13" fill="${C.ink}" font-weight="600">${Math.round(r.v * 100)}%</text>`;
  });
  g += `<text x="${(L + W - R) / 2}" y="${H - 8}" font-size="12" fill="${C.ink3}" text-anchor="middle">Saving on the average request, against no caching</text>`;
  return svg(W, H, rows.map((r) => `${r.label}: ${Math.round(r.v * 100)}% saving`).join("; "), g);
};

writeFileSync(join(here, "request-cost.svg"), costChart());
writeFileSync(join(here, "saving-by-time.svg"), savingChart());
console.log(`no caching ${NONE.toFixed(2)}¢, hit ${HIT.toFixed(2)}¢, miss ${MISS.toFixed(2)}¢, break-even ${(BREAK_EVEN * 100).toFixed(1)}%`);
for (const h of [0.72, MONTH_HIT_RATE, 0.97]) console.log(`hit rate ${h.toFixed(3)}: ${avg(h).toFixed(2)}¢, saving ${(saving(h) * 100).toFixed(1)}%`);
