// Data gate for the held waves (research/held-waves-rules.md §1): for each page of a wave, BUILD when every required
// domain is verified in research/data-sources.csv and every engine group it uses has golden cases; HOLD otherwise,
// naming what blocks it. Optional domains are listed with their status: a feature that rides on one is offered only
// when it is verified.
//   node scripts/data-gate.mjs WSZ-008        (one wave; exit 0 either way, the output is the record)
//   node scripts/data-gate.mjs                (every wave)
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/verified/csv.mjs';

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const registry = new Map(parseCsv(read('research/data-sources.csv')).map((r) => [r.domain, r.status]));
const golden = new Set(JSON.parse(read('research/golden-cases.json')).cases.map((c) => c.group));
const pages = parseCsv(read('research/held-pages-domains.csv'));
const wave = process.argv[2];
const list = (s) => (s ?? '').split(';').map((x) => x.trim()).filter(Boolean);
const status = (d) => registry.get(d) ?? 'missing';

let build = 0;
let hold = 0;
for (const page of pages.filter((p) => !wave || p.wave === wave)) {
  const blocking = list(page.required_domains).filter((d) => status(d) !== 'verified');
  const missingGroups = list(page.engine_groups).filter((g) => !golden.has(g));
  const optional = list(page.optional_domains).map((d) => `${d} ${status(d)}`);
  const ok = blocking.length === 0 && missingGroups.length === 0;
  if (ok) build++;
  else hold++;
  const why = [
    ...blocking.map((d) => `${d} ${status(d)}`),
    ...missingGroups.map((g) => `golden cases missing for ${g} — ask chat`),
  ];
  console.log(
    `${ok ? 'BUILD' : 'HOLD '}  ${page.wave}  ${page.slug}` +
      (why.length ? `  blocked by: ${why.join('; ')}` : '') +
      (optional.length ? `  optional: ${optional.join('; ')}` : ''),
  );
}
console.log(`data-gate: ${build} BUILD, ${hold} HOLD${wave ? ` (${wave})` : ''}`);
