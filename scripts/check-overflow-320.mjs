import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URLS_FILE = '/tmp/wsaudit/urls.txt';
const VIEWPORT = { width: 320, height: 568, deviceScaleFactor: 2, isMobile: true };

const urls = fs.readFileSync(URLS_FILE, 'utf8').trim().split('\n');
const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = [];
for (const url of urls) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  try { await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }); }
  catch (e) { results.push({ url, error: String(e).slice(0, 80) }); await page.close(); continue; }
  await new Promise(r => setTimeout(r, 500));

  const overflow = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const overflowAmount = docW - vw;
    if (overflowAmount <= 1) return { overflow: 0 };
    function isInsideOverflowContainer(el) {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const cs = window.getComputedStyle(p);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflowX === 'hidden') {
          if (p.getBoundingClientRect().right <= vw + 1) return true;
        }
        p = p.parentElement;
      }
      return false;
    }
    const culprits = [];
    for (const el of document.querySelectorAll('body, body *')) {
      const r = el.getBoundingClientRect();
      if (r.right >= docW - 5 && r.right > vw + 1) {
        if (isInsideOverflowContainer(el)) continue;
        culprits.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          text: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 60).trim(),
          right: Math.round(r.right), width: Math.round(r.width),
        });
      }
    }
    culprits.sort((a, b) => a.width - b.width);
    return { overflow: overflowAmount, docW, culprits: culprits.slice(0, 2) };
  }, VIEWPORT.width);

  results.push({ url, ...overflow });
  await page.close();
}
await browser.close();

const bad = results.filter(r => (r.overflow || 0) > 1);
console.log(`\n=== LIVE @ 320px (iPhone SE) ===\n`);
if (bad.length === 0) {
  console.log('  ✓ All 53 pages render within 320px width');
} else {
  console.log(`  ⚠ ${bad.length} of ${results.length} pages overflow:\n`);
  bad.sort((a, b) => (b.overflow || 0) - (a.overflow || 0));
  for (const r of bad) {
    const path = r.url.replace('https://wiresizes.com', '') || '/';
    console.log(`  ${path} — overflow ${r.overflow}px, docW ${r.docW}px`);
    for (const c of (r.culprits || []).slice(0, 1)) {
      console.log(`    <${c.tag} class="${c.cls}"> w=${c.width}px`);
      if (c.text) console.log(`      "${c.text}"`);
    }
  }
}
