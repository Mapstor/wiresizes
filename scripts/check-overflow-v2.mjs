// More-accurate horizontal overflow detection. Filters out elements that
// are inside overflow-x-auto / overflow-x-scroll containers (which contain
// their content even if the rect extends past the viewport).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URLS_FILE = '/tmp/wsaudit/urls.txt';
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true };

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
  await new Promise((r) => setTimeout(r, 600));

  const overflow = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const overflowAmount = docW - vw;
    if (overflowAmount <= 1) return { overflow: 0 };

    function isInsideOverflowContainer(el) {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const cs = window.getComputedStyle(p);
        if (
          cs.overflowX === 'auto' ||
          cs.overflowX === 'scroll' ||
          cs.overflowX === 'hidden'
        ) {
          // The container has constrained x-overflow — if THIS element's
          // bounding rect extends past the container's right edge but the
          // container itself fits in the viewport, the bounding rect is a
          // false positive for page-level overflow.
          const containerRect = p.getBoundingClientRect();
          if (containerRect.right <= vw + 1) return true;
        }
        p = p.parentElement;
      }
      return false;
    }

    const culprits = [];
    const all = document.querySelectorAll('body, body *');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      // Only count elements that extend to the actual document right edge
      // (within ~5px) — those are what define the page's scrollWidth.
      if (rect.right >= docW - 5 && rect.right > vw + 1) {
        if (isInsideOverflowContainer(el)) continue;
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().slice(0, 100).trim();
        const id = el.id ? `#${el.id}` : '';
        const text = (el.textContent || '').replace(/\s+/g, ' ').slice(0, 80).trim();
        culprits.push({
          tag, id, cls, text,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    }
    // Find the most-specific culprit (smallest, deepest)
    culprits.sort((a, b) => a.width - b.width);
    return { overflow: overflowAmount, docW, culprits: culprits.slice(0, 4) };
  }, VIEWPORT.width);

  results.push({ url, ...overflow });
  await page.close();
}

await browser.close();

console.log(`\n=== Mobile horizontal overflow at 375px (filtered, real page-width culprits only) ===\n`);
const overflowing = results.filter((r) => (r.overflow || 0) > 1);
if (overflowing.length === 0) {
  console.log('  ✓ All 53 pages render within 375px width');
} else {
  console.log(`  ⚠ ${overflowing.length} of ${results.length} pages overflow at 375px:\n`);
  overflowing.sort((a, b) => (b.overflow || 0) - (a.overflow || 0));
  for (const r of overflowing) {
    const path = r.url.replace('https://wiresizes.com', '') || '/';
    console.log(`  ${path}  (overflow ${r.overflow}px, page width ${r.docW}px)`);
    if (r.culprits && r.culprits.length) {
      for (const c of r.culprits.slice(0, 2)) {
        console.log(
          `    <${c.tag}${c.id}${c.cls ? ` class="${c.cls}"` : ''}> width=${c.width}px right=${c.right}px`
        );
        if (c.text) console.log(`      text: "${c.text.slice(0, 80)}"`);
      }
    } else {
      console.log(`    (no element identified at document right edge)`);
    }
    console.log('');
  }
}

fs.writeFileSync('/tmp/wsaudit/overflow-v2.json', JSON.stringify(results, null, 2));
