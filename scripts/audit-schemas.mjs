// JSON-LD schema audit
import fs from 'node:fs';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

const REQUIRED_BY_TYPE = {
  Article: ['headline', 'datePublished', 'author', 'publisher'],
  FAQPage: ['mainEntity'],
  HowTo: ['name', 'step'],
  Dataset: ['name', 'description'],
  BreadcrumbList: ['itemListElement'],
  WebApplication: ['name', 'applicationCategory'],
  Organization: ['name'],
  WebSite: ['name', 'url'],
  CollectionPage: ['name'],
  ItemList: ['itemListElement'],
  AboutPage: ['name'],
  ContactPage: ['name'],
};

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

function summarizeNode(node) {
  if (Array.isArray(node)) return node.map(summarizeNode);
  if (typeof node !== 'object' || node === null) return node;
  const t = node['@type'];
  return { '@type': t, keys: Object.keys(node).filter(k => !k.startsWith('@')) };
}

async function audit(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  });
  const html = await r.text();
  const blocks = extractJsonLd(html);

  const parsed = [];
  const errors = [];
  for (const [i, block] of blocks.entries()) {
    try {
      const obj = JSON.parse(block);
      // Each block could be an object, an array, or a graph
      const nodes = Array.isArray(obj) ? obj : (obj['@graph'] ? obj['@graph'] : [obj]);
      for (const n of nodes) {
        const type = n['@type'];
        const types = Array.isArray(type) ? type : [type];
        for (const t of types) {
          parsed.push({ blockIdx: i, type: t, keys: Object.keys(n) });
          const req = REQUIRED_BY_TYPE[t];
          if (req) {
            const missing = req.filter(k => !(k in n));
            if (missing.length) errors.push({ type: t, missing });
          }
        }
      }
    } catch (e) {
      errors.push({ blockIdx: i, parseError: String(e).slice(0, 100) });
    }
  }

  return { url, blockCount: blocks.length, types: parsed.map(p => p.type), parsed, errors };
}

const results = [];
const conc = 6;
let inflight = 0, idx = 0;
await new Promise((resolve) => {
  const tick = () => {
    while (inflight < conc && idx < urls.length) {
      const url = urls[idx++];
      inflight++;
      audit(url).then(r => results.push(r)).catch(e => results.push({ url, error: String(e).slice(0, 80) })).finally(() => {
        inflight--;
        if (idx === urls.length && inflight === 0) resolve();
        else tick();
      });
    }
  };
  tick();
});

results.sort((a, b) => a.url.localeCompare(b.url));

console.log(`\n=== JSON-LD schema audit ===\n`);
console.log(`Pages: ${results.length}`);

const noSchema = results.filter(r => r.blockCount === 0);
console.log(`Pages with NO JSON-LD: ${noSchema.length}`);
if (noSchema.length) {
  for (const r of noSchema) console.log(`  MISSING SCHEMA: ${r.url}`);
}

console.log(`\nType distribution across all pages:`);
const typeCount = {};
for (const r of results) {
  for (const t of r.types) typeCount[t] = (typeCount[t] || 0) + 1;
}
for (const [t, n] of Object.entries(typeCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t}: ${n} pages`);
}

console.log(`\nPages with schema errors:`);
let errCount = 0;
for (const r of results) {
  if (r.errors && r.errors.length) {
    console.log(`  ${r.url}`);
    for (const e of r.errors) console.log(`    -> ${JSON.stringify(e)}`);
    errCount++;
  }
}
if (errCount === 0) console.log('  (none)');

console.log(`\nPer-URL summary (truncated):`);
for (const r of results) {
  const path = r.url.replace('https://wiresizes.com', '') || '/';
  console.log(`  ${path.padEnd(50)} types=[${r.types.join(', ')}]`);
}

fs.writeFileSync('/tmp/wsaudit/schemas.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /tmp/wsaudit/schemas.json');
