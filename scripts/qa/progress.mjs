#!/usr/bin/env node
// Prints how far a site's QA pass has come, from qa/pages.csv. Zero Claude tokens, no dependencies.
// Site copy of portfolio-qa kit/progress.mjs plus the uncited-number figure on the Sourcing line (WSZ-018).
//
//   node scripts/qa/progress.mjs [qa/pages.csv] [qa/config.json]
//
// Tracks: S sourcing, P prose, D design, F function/UX. Status per row and track:
// todo | done | clean (fine at baseline, skipped) | n/a (out of scope). done, clean and n/a count as complete.
// *_bad is the 0-10 "how bad it was" score written when a row is actually fixed.
import { readFileSync } from 'node:fs';

const csvPath = process.argv[2] ?? 'qa/pages.csv';
const cfg = JSON.parse(readFileSync(process.argv[3] ?? 'qa/config.json', 'utf8'));
const parseCsv = (s) => {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head = [], ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
};
const rows = parseCsv(readFileSync(csvPath, 'utf8'));
const COMPLETE = new Set(['done', 'clean', 'n/a']);
const TRACKS = { S: 'Sourcing', P: 'Prose', D: 'Design', F: 'Function' };
const w = { S: 25, P: 25, D: 25, F: 25, ...(cfg.weights ?? {}) };
const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '–');
const bar = (p) => '█'.repeat(Math.round(p * 10)) + '░'.repeat(10 - Math.round(p * 10));
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : '–'; };

const today = new Date().toISOString().slice(0, 10);
const inScope = rows.filter((r) => !['S', 'P', 'D', 'F'].every((t) => r[t] === 'n/a'));
console.log(`${cfg.site ?? 'site'} · ${today} · ${rows.length} pages (${rows.length - inScope.length} out of scope)`);
let overall = 0, wsum = 0, doneUnits = 0, todoUnits = 0;
for (const [t, name] of Object.entries(TRACKS)) {
  const total = rows.length;
  const complete = rows.filter((r) => COMPLETE.has(r[t])).length;
  const done = rows.filter((r) => r[t] === 'done');
  const clean = rows.filter((r) => r[t] === 'clean').length;
  const todo = rows.filter((r) => r[t] === 'todo').length;
  const bad = done.map((r) => Number(r[`${t}_bad`])).filter((n) => Number.isFinite(n) && String(n) !== '');
  const p = total ? complete / total : 0;
  overall += w[t] * p; wsum += w[t];
  doneUnits += (w[t] * done.length) / Math.max(1, total);
  todoUnits += (w[t] * todo.length) / Math.max(1, total);
  let line = `${name.padEnd(9)} ${String(Math.round(p * 100)).padStart(3)}% ${bar(p)}  ${done.length} done · ${clean} clean · ${todo} todo · avg badness found ${avg(bad)}`;
  if (t === 'S') {
    const u = rows.filter((r) => r.S === 'todo' && r.uncited_auto !== '').map((r) => Number(r.uncited_auto)).filter(Number.isFinite);
    line += ` · uncited numbers ${u.reduce((a, b) => a + b, 0)} on todo (median ${median(u)} per page)`;
  }
  if (t === 'P') line += ` · prose counter median ${median(rows.filter((r) => r.P === 'todo').map((r) => Number(r.prose_auto)).filter(Number.isFinite))}/1k on todo`;
  if (t === 'F') line += ` · sweep findings on ${rows.filter((r) => Number(r.func_auto) > 0).length} pages`;
  console.log(line);
  if (t === 'D') {
    const tpl = new Map();
    for (const r of rows.filter((x) => x.D !== 'n/a')) { const k = r.template; tpl.set(k, (tpl.get(k) ?? true) && COMPLETE.has(r.D)); }
    console.log(`${''.padEnd(9)}      templates ${[...tpl.values()].filter(Boolean).length}/${tpl.size} complete (${[...tpl.keys()].join(', ')})`);
  }
  const last = done.filter((r) => r[`${t}_bad`] !== '').sort((a, b) => a.updated.localeCompare(b.updated)).slice(-10);
  if (last.length === 10 && Number(avg(last.map((r) => Number(r[`${t}_bad`])))) <= 2)
    console.log(`${''.padEnd(9)}      stop rule met: the last 10 ${name.toLowerCase()} fixes averaged ≤2. Mark the remaining todo rows clean unless a counter flags them.`);
}
console.log(`Overall   ${String(Math.round((overall / wsum) * 100)).padStart(3)}% ${bar(overall / wsum)}  weights ${Object.entries(w).map(([k, v]) => `${k}${v}`).join(' ')}`);
const sessions = new Set(rows.filter((r) => ['S', 'P', 'D', 'F'].some((t) => r[t] === 'done')).map((r) => r.updated)).size;
if (!sessions || !doneUnits) console.log('Pace      measured after the first work session');
else console.log(`Pace      ${sessions} work day(s) so far · about ${Math.ceil(todoUnits / (doneUnits / sessions))} more at this pace`);
