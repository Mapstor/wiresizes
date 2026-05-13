// Extract text nodes from SSR HTML and CSR DOM, diff them token-by-token
import puppeteer from 'puppeteer-core';

const url = process.argv[2];

// Server HTML
const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } });
const serverHtml = await r.text();

// Client HTML after hydration
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3000));

// Get the text from CSR-rendered body
const csrText = await page.evaluate(() => {
  function getText(el) {
    const out = [];
    for (const node of el.childNodes) {
      if (node.nodeType === 3) {
        const t = node.textContent.replace(/\s+/g, ' ').trim();
        if (t) out.push(t);
      } else if (node.nodeType === 1) {
        if (['SCRIPT', 'STYLE', 'TEMPLATE'].includes(node.tagName)) continue;
        out.push(...getText(node));
      }
    }
    return out;
  }
  return getText(document.body);
});

await browser.close();

// Parse SSR HTML similarly
function ssrText(html) {
  // Strip scripts and styles
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  html = html.replace(/<style[\s\S]*?<\/style>/g, '');
  html = html.replace(/<template[\s\S]*?<\/template>/g, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  // Extract text inside <body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  const body = bodyMatch ? bodyMatch[1] : html;
  // Split on tags, get text
  return body.split(/<[^>]+>/).map(s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim()).filter(Boolean);
}

const ssr = ssrText(serverHtml);

// Token diff
console.log(`SSR: ${ssr.length} text nodes`);
console.log(`CSR: ${csrText.length} text nodes`);

const max = Math.max(ssr.length, csrText.length);
let firstDiff = -1;
for (let i = 0; i < max; i++) {
  if (ssr[i] !== csrText[i]) {
    firstDiff = i;
    break;
  }
}

if (firstDiff < 0) {
  console.log('\n  No text differences found.');
} else {
  console.log(`\n  First text diff at index ${firstDiff}:`);
  console.log(`  SSR[${firstDiff-1}] = "${(ssr[firstDiff-1] || '').slice(0, 100)}"`);
  console.log(`  SSR[${firstDiff}]   = "${(ssr[firstDiff] || '').slice(0, 100)}"`);
  console.log(`  ---`);
  console.log(`  CSR[${firstDiff-1}] = "${(csrText[firstDiff-1] || '').slice(0, 100)}"`);
  console.log(`  CSR[${firstDiff}]   = "${(csrText[firstDiff] || '').slice(0, 100)}"`);
  console.log(`\n  Subsequent 5 nodes:`);
  for (let i = firstDiff; i < Math.min(firstDiff + 5, max); i++) {
    const s = (ssr[i] || '<missing>').slice(0, 80);
    const c = (csrText[i] || '<missing>').slice(0, 80);
    const mark = s === c ? '  ' : '!!';
    console.log(`  [${i}] ${mark} SSR: "${s}"`);
    console.log(`         CSR: "${c}"`);
  }
}
