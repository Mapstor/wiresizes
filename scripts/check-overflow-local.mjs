import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URLS_FILE = '/tmp/wsaudit/urls.txt';
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true };

// Rewrite live URLs to localhost
const urls = fs.readFileSync(URLS_FILE, 'utf8').trim().split('\n')
  .map(u => u.replace('https://wiresizes.com', 'http://localhost:3001'));

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = [];

for (const url of urls) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
  );
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    results.push({ url, error: String(e).slice(0, 80) });
    await page.close();
    continue;
  }
  await new Promise((r) => setTimeout(r, 400));

  const overflow = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const overflowAmount = docW - vw;
    if (overflowAmount <= 1) return { overflow: 0 };

    function isInsideOverflowContainer(el) {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const cs = window.getComputedStyle(p);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflowX === 'hidden') {
          const cr = p.getBoundingClientRect();
          if (cr.right <= vw + 1) return true;
        }
        p = p.parentElement;
      }
      return false;
    }

    const culprits = [];
    for (const el of document.querySelectorAll('body, body *')) {
      const rect = el.getBoundingClientRect();
      if (rect.right >= docW - 5 && rect.right > vw + 1) {
        if (isInsideOverflowContainer(el)) continue;
        culprits.push({
          tag: el.tagName.toLowerCase(),
          id: el.id ? `#${el.id}` : '',
          cls: (el.className || '').toString().slice(0, 100).trim(),
          text: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 70).trim(),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    }
    culprits.sort((a, b) => a.width - b.width);
    return { overflow: overflowAmount, docW, culprits: culprits.slice(0, 3) };
  }, VIEWPORT.width);

  results.push({ url, ...overflow });
  await page.close();
}

await browser.close();

const overflowing = results.filter((r) => (r.overflow || 0) > 1);
console.log(`\n=== LOCAL build mobile overflow at 375px ===\n`);
if (overflowing.length === 0) {
  console.log('  ✓ All 53 pages render within 375px width');
} else {
  console.log(`  ⚠ ${overflowing.length} of ${results.length} pages overflow:\n`);
  overflowing.sort((a, b) => (b.overflow || 0) - (a.overflow || 0));
  for (const r of overflowing) {
    const path = r.url.replace('http://localhost:3001', '') || '/';
    console.log(`  ${path} — overflow ${r.overflow}px, docW ${r.docW}px`);
    if (r.culprits && r.culprits.length) {
      for (const c of r.culprits.slice(0, 2)) {
        console.log(`    <${c.tag}${c.id} class="${c.cls.slice(0, 70)}"> w=${c.width}px r=${c.right}px`);
        if (c.text) console.log(`      "${c.text.slice(0, 70)}"`);
      }
    }
  }
}
fs.writeFileSync('/tmp/wsaudit/overflow-local.json', JSON.stringify(results, null, 2));
