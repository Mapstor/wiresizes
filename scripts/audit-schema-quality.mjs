// Deep-dive schema quality audit — look at field completeness
import fs from 'node:fs';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) blocks.push(m[1].trim());
  return blocks;
}

function findByType(graphNodes, type) {
  return graphNodes.find((n) => n['@type'] === type || (Array.isArray(n['@type']) && n['@type'].includes(type)));
}

async function audit(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  });
  const html = await r.text();
  const blocks = extractJsonLd(html);

  const all = [];
  for (const b of blocks) {
    try {
      const obj = JSON.parse(b);
      const nodes = Array.isArray(obj) ? obj : (obj['@graph'] ? obj['@graph'] : [obj]);
      for (const n of nodes) all.push(n);
    } catch (e) { /* already caught */ }
  }

  const issues = [];

  // Per-type quality checks
  const article = findByType(all, 'Article');
  if (article) {
    if (!article.author || (Array.isArray(article.author) && article.author.length === 0)) issues.push('Article: no author');
    if (!article.publisher) issues.push('Article: no publisher');
    if (!article.dateModified) issues.push('Article: no dateModified');
    if (!article.datePublished) issues.push('Article: no datePublished');
    if (!article.image) issues.push('Article: no image');
    if (!article.mainEntityOfPage) issues.push('Article: no mainEntityOfPage');
    if (!article.description) issues.push('Article: no description');
    // Body word count - Article schema needs descriptive body via wordCount or articleBody
  }

  const faq = findByType(all, 'FAQPage');
  if (faq) {
    const qs = faq.mainEntity || [];
    if (!Array.isArray(qs)) issues.push('FAQPage: mainEntity not array');
    else if (qs.length < 3) issues.push(`FAQPage: only ${qs.length} Q&A (recommend 3+)`);
    else {
      for (const [i, q] of qs.entries()) {
        if (q['@type'] !== 'Question') issues.push(`FAQ Q${i}: type=${q['@type']}, expected Question`);
        if (!q.name) issues.push(`FAQ Q${i}: missing name (question text)`);
        if (!q.acceptedAnswer) issues.push(`FAQ Q${i}: missing acceptedAnswer`);
        else if (!q.acceptedAnswer.text) issues.push(`FAQ Q${i}: acceptedAnswer.text missing`);
      }
    }
  }

  const howto = findByType(all, 'HowTo');
  if (howto) {
    const steps = howto.step || [];
    if (!Array.isArray(steps)) issues.push('HowTo: step not array');
    else if (steps.length < 3) issues.push(`HowTo: only ${steps.length} steps (recommend 3+)`);
    else {
      for (const [i, s] of steps.entries()) {
        if (s['@type'] !== 'HowToStep') issues.push(`HowTo step ${i}: type=${s['@type']}`);
        if (!s.name) issues.push(`HowTo step ${i}: missing name`);
        if (!s.text) issues.push(`HowTo step ${i}: missing text`);
      }
    }
  }

  const webApp = findByType(all, 'WebApplication');
  if (webApp) {
    if (!webApp.applicationCategory) issues.push('WebApplication: no applicationCategory');
    if (!webApp.operatingSystem) issues.push('WebApplication: no operatingSystem');
    if (!webApp.url) issues.push('WebApplication: no url');
    if (!webApp.description) issues.push('WebApplication: no description');
    if (webApp.aggregateRating) issues.push('WebApplication: HAS aggregateRating (Google flags fake ratings)');
    if (!webApp.offers) issues.push('WebApplication: no offers (recommended for free tools)');
  }

  const breadcrumb = findByType(all, 'BreadcrumbList');
  if (breadcrumb) {
    const items = breadcrumb.itemListElement || [];
    if (items.length < 2) issues.push(`BreadcrumbList: only ${items.length} items`);
    for (const [i, item] of items.entries()) {
      if (!item.name) issues.push(`Breadcrumb item ${i}: no name`);
      if (item['@type'] !== 'ListItem') issues.push(`Breadcrumb item ${i}: @type=${item['@type']}`);
    }
  }

  const dataset = findByType(all, 'Dataset');
  if (dataset) {
    if (!dataset.name) issues.push('Dataset: no name');
    if (!dataset.description) issues.push('Dataset: no description');
    if (!dataset.creator && !dataset.publisher) issues.push('Dataset: no creator or publisher');
    if (!dataset.license) issues.push('Dataset: no license');
    if (!dataset.distribution && !dataset.url) issues.push('Dataset: no distribution or url');
    if (!dataset.variableMeasured) issues.push('Dataset: no variableMeasured (recommended for tables)');
  }

  return { url, types: all.map(n => n['@type']).flat(), issues };
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

console.log(`\n=== Schema quality audit (Google rich-result requirements) ===\n`);

let totalIssues = 0;
for (const r of results) {
  if (r.issues && r.issues.length) {
    const p = r.url.replace('https://wiresizes.com', '') || '/';
    console.log(`${p}`);
    for (const i of r.issues) console.log(`  ⚠ ${i}`);
    totalIssues += r.issues.length;
  }
}

if (totalIssues === 0) {
  console.log('  ✓ All schemas pass quality checks');
} else {
  console.log(`\nTotal quality issues: ${totalIssues}`);
}

fs.writeFileSync('/tmp/wsaudit/schema-quality.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /tmp/wsaudit/schema-quality.json');
