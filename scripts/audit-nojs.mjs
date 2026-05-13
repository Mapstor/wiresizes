// Verify that Googlebot's first-pass (no-JS) sees core content
// Check that critical content (title, h1, FAQ questions, main NEC text) is in initial HTML
import fs from 'node:fs';
const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

const findings = [];
for (const url of urls) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
  const html = await r.text();
  // Strip script/style/noscript
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/g, '')
    .replace(/<template[\s\S]*?<\/template>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const text = cleaned.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).length;
  const hasNEC = /NEC|National Electrical Code|310\.16|240\.4|220\.82/.test(text);
  const hasCalc = /calculator|calculate|wire|ampacity|voltage/i.test(text);
  const hasContact = /support|contact|@wiresizes\.com/.test(text);
  const hasFooter = /Privacy|Terms|Disclaimer|©|All rights reserved/.test(text);
  // Check for Suspense BAILOUT placeholders (indicates content not in initial HTML)
  const bailouts = (html.match(/BAILOUT_TO_CLIENT_SIDE_RENDERING/g) || []).length;
  // Check for "Loading calculator..." placeholder (means main calc UI deferred to client)
  const calcDeferred = html.includes('Loading calculator');
  findings.push({ url, wordCount, hasNEC, hasCalc, hasContact, hasFooter, bailouts, calcDeferred });
}

console.log(`=== No-JS / Googlebot-first-pass content audit ===\n`);
console.log(`Total pages: ${findings.length}`);
console.log(`Min word count without JS: ${Math.min(...findings.map(f => f.wordCount))}`);
console.log(`Max word count without JS: ${Math.max(...findings.map(f => f.wordCount))}`);
console.log(`Median: ${findings.map(f => f.wordCount).sort((a,b)=>a-b)[Math.floor(findings.length/2)]}`);

console.log(`\nPages with calc UI deferred (Loading... in SSR): ${findings.filter(f => f.calcDeferred).length}`);
const deferred = findings.filter(f => f.calcDeferred);
for (const f of deferred) console.log(`  ${f.url.replace('https://wiresizes.com','')} (${f.wordCount} words still in HTML)`);

console.log(`\nPages with NO NEC reference in initial HTML:`);
const noNEC = findings.filter(f => !f.hasNEC);
for (const f of noNEC) console.log(`  ${f.url.replace('https://wiresizes.com','')} (${f.wordCount} words)`);

console.log(`\nThinnest 5 pages (no-JS):`);
findings.sort((a,b) => a.wordCount - b.wordCount);
for (const f of findings.slice(0, 5)) console.log(`  ${f.url.replace('https://wiresizes.com','')} (${f.wordCount} words)`);

fs.writeFileSync('/tmp/wsaudit/nojs.json', JSON.stringify(findings, null, 2));
