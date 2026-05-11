// Render audit: server-rendered HTML visible to Googlebot
import fs from 'node:fs';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

async function audit(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  });
  const html = await r.text();

  // Extract <body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const text = stripTags(body);

  // Meta tags
  const title = extract(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = extract(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
  const canonical = extract(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  const robots = extract(html, /<meta[^>]+name="robots"[^>]+content="([^"]+)"/i);
  const ogTitle = extract(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  const ogDesc = extract(html, /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
  const ogImage = extract(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  const ogUrl = extract(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i);
  const twitterCard = extract(html, /<meta[^>]+name="twitter:card"[^>]+content="([^"]+)"/i);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  const linkCount = (html.match(/<a\s[^>]*href=/gi) || []).length;

  return {
    url,
    status: r.status,
    htmlBytes: html.length,
    textChars: text.length,
    textWords: text.split(/\s+/).filter(Boolean).length,
    title,
    titleLen: title?.length || 0,
    description,
    descLen: description?.length || 0,
    canonical,
    robots,
    ogTitle,
    ogDesc,
    ogImage,
    ogUrl,
    twitterCard,
    h1Count,
    h2Count,
    linkCount,
  };
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

console.log(`\n=== Render audit (Googlebot UA) ===\n`);

// Flag: thin pages, missing title/desc, h1 count != 1, missing canonical, missing OG
const issues = [];
for (const r of results) {
  const p = r.url.replace('https://wiresizes.com', '') || '/';
  if (r.error) { issues.push(`${p}: ERROR ${r.error}`); continue; }
  if (!r.title) issues.push(`${p}: missing <title>`);
  if (r.titleLen > 65) issues.push(`${p}: title ${r.titleLen} chars (>65)`);
  if (!r.description) issues.push(`${p}: missing meta description`);
  if (r.descLen > 165) issues.push(`${p}: description ${r.descLen} chars (>165)`);
  if (r.h1Count === 0) issues.push(`${p}: no <h1>`);
  if (r.h1Count > 1) issues.push(`${p}: ${r.h1Count} <h1> tags`);
  if (!r.canonical) issues.push(`${p}: no canonical`);
  if (!r.ogTitle) issues.push(`${p}: no og:title`);
  if (!r.ogImage) issues.push(`${p}: no og:image`);
  if (r.textWords < 300) issues.push(`${p}: thin content (${r.textWords} words)`);
}

if (issues.length === 0) {
  console.log('  ✓ No issues found');
} else {
  console.log(`Issues found (${issues.length}):`);
  for (const i of issues) console.log('  ⚠ ' + i);
}

console.log(`\nWord-count summary:`);
results.sort((a, b) => (a.textWords || 0) - (b.textWords || 0));
for (const r of results.slice(0, 10)) {
  const p = r.url.replace('https://wiresizes.com', '') || '/';
  console.log(`  ${p.padEnd(50)} ${r.textWords} words, ${(r.htmlBytes / 1024).toFixed(1)} KB HTML`);
}
console.log(`  ...`);
for (const r of results.slice(-5)) {
  const p = r.url.replace('https://wiresizes.com', '') || '/';
  console.log(`  ${p.padEnd(50)} ${r.textWords} words, ${(r.htmlBytes / 1024).toFixed(1)} KB HTML`);
}

fs.writeFileSync('/tmp/wsaudit/render.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /tmp/wsaudit/render.json');
