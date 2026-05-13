// Check title/description/h1 uniqueness across all pages
import fs from 'node:fs';
const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');
const data = [];
for (const url of urls) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } });
  const html = await r.text();
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/) || [, ''])[1];
  const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/) || [, ''])[1];
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  const ogTitle = (html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/) || [, ''])[1];
  const ogImage = (html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) || [, ''])[1];
  const ogImageWidth = (html.match(/<meta[^>]+property="og:image:width"[^>]+content="([^"]+)"/) || [, ''])[1];
  const ogImageHeight = (html.match(/<meta[^>]+property="og:image:height"[^>]+content="([^"]+)"/) || [, ''])[1];
  const twitterCard = (html.match(/<meta[^>]+name="twitter:card"[^>]+content="([^"]+)"/) || [, ''])[1];
  data.push({ url, title, desc, h1, ogTitle, ogImage, ogImageWidth, ogImageHeight, twitterCard });
}

const dupTitle = {};
for (const d of data) {
  if (!dupTitle[d.title]) dupTitle[d.title] = [];
  dupTitle[d.title].push(d.url);
}
const dupDesc = {};
for (const d of data) {
  if (!dupDesc[d.desc]) dupDesc[d.desc] = [];
  dupDesc[d.desc].push(d.url);
}
const dupH1 = {};
for (const d of data) {
  if (!dupH1[d.h1]) dupH1[d.h1] = [];
  dupH1[d.h1].push(d.url);
}

console.log(`=== Uniqueness ===`);
let titleDupes = 0;
for (const [t, urls] of Object.entries(dupTitle)) if (urls.length > 1) { titleDupes++; console.log(`  TITLE DUP ("${t.slice(0,60)}"):`); urls.forEach(u => console.log(`    ${u}`)); }
let descDupes = 0;
for (const [d, urls] of Object.entries(dupDesc)) if (urls.length > 1) { descDupes++; console.log(`  DESC DUP: ${urls.length} pages share description`); urls.slice(0,3).forEach(u => console.log(`    ${u}`)); }
let h1Dupes = 0;
for (const [h, urls] of Object.entries(dupH1)) if (urls.length > 1) { h1Dupes++; console.log(`  H1 DUP ("${h.slice(0,60)}"): ${urls.length} pages`); urls.slice(0,3).forEach(u => console.log(`    ${u}`)); }
console.log(`\n  ${titleDupes} duplicate titles, ${descDupes} duplicate descriptions, ${h1Dupes} duplicate H1s`);

// OG image dimensions
console.log(`\n=== OG image consistency ===`);
const ogImageVals = new Set(data.map(d => d.ogImage));
console.log(`  Unique og:image URLs: ${ogImageVals.size}`);
for (const v of ogImageVals) console.log(`  → ${v}`);
const ogImageWidthVals = new Set(data.map(d => d.ogImageWidth).filter(Boolean));
const ogImageHeightVals = new Set(data.map(d => d.ogImageHeight).filter(Boolean));
console.log(`  Unique og:image:width: ${[...ogImageWidthVals].join(',')}`);
console.log(`  Unique og:image:height: ${[...ogImageHeightVals].join(',')}`);
const twitterCardVals = new Set(data.map(d => d.twitterCard).filter(Boolean));
console.log(`  Unique twitter:card: ${[...twitterCardVals].join(',')}`);

// Title length distribution
const titleLens = data.map(d => d.title.length).sort((a,b) => a-b);
console.log(`\n=== Length distribution ===`);
console.log(`  Title: min=${titleLens[0]} max=${titleLens[titleLens.length-1]} median=${titleLens[Math.floor(titleLens.length/2)]}`);
const descLens = data.map(d => d.desc.length).sort((a,b)=>a-b);
console.log(`  Desc:  min=${descLens[0]} max=${descLens[descLens.length-1]} median=${descLens[Math.floor(descLens.length/2)]}`);

// Missing data
for (const d of data) {
  if (!d.h1) console.log(`  NO H1: ${d.url}`);
  if (!d.ogTitle) console.log(`  NO og:title: ${d.url}`);
}
fs.writeFileSync('/tmp/wsaudit/uniqueness.json', JSON.stringify(data, null, 2));
