// Crawl every page, extract every internal <a href> + <img src>, HEAD-check
import fs from 'node:fs';
const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

const baseHost = 'https://wiresizes.com';
const found = new Set();
const images = new Set();
const externalLinks = new Set();

for (const url of urls) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await r.text();
  // Extract <a href="...">
  for (const m of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = m[1];
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href.startsWith('/')) {
      found.add(baseHost + href.split('#')[0].split('?')[0]);
    } else if (href.startsWith(baseHost)) {
      found.add(href.split('#')[0].split('?')[0]);
    } else if (href.startsWith('http')) {
      externalLinks.add(href);
    }
  }
  // Extract <img src="..."> AND <source srcset> AND og:image
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = m[1];
    if (src.startsWith('data:')) continue;
    if (src.startsWith('/')) images.add(baseHost + src);
    else if (src.startsWith('http')) images.add(src);
  }
  for (const m of html.matchAll(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/g)) {
    images.add(m[1]);
  }
}

console.log(`Total unique internal page links found: ${found.size}`);
console.log(`Total unique image URLs found: ${images.size}`);
console.log(`Total unique external links found: ${externalLinks.size}`);

// HEAD-check internal links
const badInternal = [];
const allInternal = [...found];
async function checkBatch(arr, concurrency = 8) {
  const out = [];
  let idx = 0, inflight = 0;
  await new Promise((resolve) => {
    const tick = () => {
      while (inflight < concurrency && idx < arr.length) {
        const u = arr[idx++];
        inflight++;
        fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'manual' })
          .then(r => out.push({ url: u, status: r.status, location: r.headers.get('location') }))
          .catch(e => out.push({ url: u, status: 0, error: String(e).slice(0, 60) }))
          .finally(() => {
            inflight--;
            if (idx === arr.length && inflight === 0) resolve();
            else tick();
          });
      }
    };
    tick();
  });
  return out;
}

const internalResults = await checkBatch(allInternal);
for (const r of internalResults) {
  if (r.status !== 200) badInternal.push(r);
}
console.log(`\n=== Internal link check ===`);
console.log(`  ${internalResults.length} unique URLs checked`);
console.log(`  ${badInternal.length} non-200`);
if (badInternal.length) {
  for (const r of badInternal.slice(0, 20)) {
    console.log(`  ${r.status} ${r.url}${r.location ? ' -> ' + r.location : ''}`);
  }
}

const imageResults = await checkBatch([...images]);
const badImages = imageResults.filter(r => r.status !== 200 && r.status !== 0);
console.log(`\n=== Image check ===`);
console.log(`  ${imageResults.length} unique images checked`);
console.log(`  ${badImages.length} non-200`);
if (badImages.length) {
  for (const r of badImages.slice(0, 20)) {
    console.log(`  ${r.status} ${r.url}${r.location ? ' -> ' + r.location : ''}`);
  }
}

fs.writeFileSync('/tmp/wsaudit/links.json', JSON.stringify({ internalResults, imageResults }, null, 2));
