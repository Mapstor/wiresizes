#!/usr/bin/env node
// WSZ-003b gate b: every unit-bearing number in a live page's visible text sits inside an element whose data-src is a
// verified domain of research/data-sources.csv, calc:<ENGINE_ID> of an engine whose DOMAINS are all verified, or
// input (D-15). Node built-ins only. Run after `rm -rf .next && npm run build` (postbuild runs it).
//
// Units (scripts/lib/gate-rules.mjs): A, amps, V, volts, kV, W, kW, kVA, kVAR, VA, Ω, ohms, °C, °F, %, ft, feet, in,
// inches, mm, mm², m, km, cmil, kcmil, lb, kg, hp, Btu/h, ton; a "$" amount counts too. Exempt: text inside
// [data-size] (size names, <Size>); years, dates and NEC section numbers carry no unit, so they never count.
// Engines: the ENGINE_ID and DOMAINS exports of src/lib/calculations/*.ts.
// Prints the count per route. Fails only for routes in scripts/gates.config.json numberTrace.enforce; a route joins
// that list when its rebuild wave has wired every number.

import { readFileSync } from 'node:fs';
import { engineDomains, gatesConfig, livePages, registryRows, tokenizeHtml, withdrawnRoutes } from './lib/build-output.mjs';
import { traceNumbers, validDataSrc } from './lib/gate-rules.mjs';

const verified = new Set([...registryRows()].filter(([, row]) => row.status === 'verified').map(([domain]) => domain));
const engines = engineDomains();
const isValid = (src) => validDataSrc(src, verified, engines);
const enforce = new Set(gatesConfig().numberTrace?.enforce ?? []);

const pages = livePages();
const missing = [...enforce].filter((route) => !pages.some((p) => p.route === route));
const failures = [];
const invalid = [];
let untracedTotal = 0;
let tracedTotal = 0;
for (const { file, route } of pages) {
  const events = tokenizeHtml(readFileSync(file, 'utf8'));
  for (const e of events) {
    if (e.type === 'open' && e.attrs['data-src'] !== undefined && !isValid(e.attrs['data-src'])) invalid.push(`${route}: data-src="${e.attrs['data-src']}"`);
  }
  const numbers = traceNumbers(events, isValid);
  const untraced = numbers.filter((n) => !n.traced);
  untracedTotal += untraced.length;
  tracedTotal += numbers.length - untraced.length;
  const enforced = enforce.has(route);
  console.log(`${enforced ? 'enforced' : 'report  '}  ${route}: ${untraced.length} untraced, ${numbers.length - untraced.length} traced`);
  if (enforced && untraced.length) failures.push(...untraced.map((n) => `${route}: "${n.match}"${n.src ? ` (data-src="${n.src}")` : ''}`));
}

for (const line of invalid) console.log(`invalid data-src: ${line}`);
for (const route of missing) console.log(`enforced route without a live page: ${route}`);
for (const line of failures.slice(0, 50)) console.log(`FAIL ${line}`);
if (failures.length > 50) console.log(`FAIL … and ${failures.length - 50} more`);
console.log('');
console.log(`check-number-trace: ${failures.length} untraced number(s) on enforced routes`);
console.log(`  live prerendered pages: ${pages.length} (${withdrawnRoutes().length} withdrawn routes skipped); enforced routes: ${enforce.size}`);
console.log(`  unit-bearing numbers: ${tracedTotal} traced, ${untracedTotal} untraced; data-src values that do not trace: ${invalid.length}`);
console.log(`  verified registry domains: ${verified.size}; engines: ${engines.size}`);
process.exit(failures.length || missing.length ? 1 : 0);
