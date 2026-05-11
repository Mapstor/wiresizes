// Render each live page at iPhone SE viewport (375x667) and detect
// horizontal overflow. Reports the offending element with its tag,
// class, dimensions, and the rightmost edge offset.
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
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  );
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    results.push({ url, error: String(e).slice(0, 80) });
    await page.close();
    continue;
  }

  // Wait for any post-hydration layout shifts
  await new Promise((r) => setTimeout(r, 800));

  const overflow = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const overflowAmount = docW - vw;
    if (overflowAmount <= 1) return { overflow: 0 };

    // Find every element whose right edge exceeds the viewport
    const culprits = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1 && rect.width < docW) {
        // Get a stable identifier for the element
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().slice(0, 80).trim();
        const id = el.id ? `#${el.id}` : '';
        const text = (el.textContent || '').replace(/\s+/g, ' ').slice(0, 60).trim();
        culprits.push({
          tag,
          id,
          cls,
          text,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflow: Math.round(rect.right - vw),
        });
      }
    }
    // Pick the deepest (most-specific) and worst overflow
    culprits.sort((a, b) => b.overflow - a.overflow);
    return { overflow: overflowAmount, culprits: culprits.slice(0, 5) };
  }, VIEWPORT.width);

  results.push({ url, ...overflow });
  await page.close();
}

await browser.close();

// Report
console.log(`\n=== Mobile horizontal overflow (375px viewport) ===\n`);
const overflowing = results.filter((r) => (r.overflow || 0) > 1);
if (overflowing.length === 0) {
  console.log('  ✓ All 53 pages render within 375px width');
} else {
  console.log(`  ⚠ ${overflowing.length} of ${results.length} pages overflow at 375px:\n`);
  overflowing.sort((a, b) => (b.overflow || 0) - (a.overflow || 0));
  for (const r of overflowing) {
    const path = r.url.replace('https://wiresizes.com', '') || '/';
    console.log(`  ${path}`);
    console.log(`    page width: 375 + ${r.overflow}px overflow (total ${375 + (r.overflow || 0)}px)`);
    if (r.culprits) {
      for (const c of r.culprits.slice(0, 3)) {
        console.log(
          `      <${c.tag}${c.id}${c.cls ? ` class="${c.cls}"` : ''}> ` +
            `right=${c.right}px width=${c.width}px overflow=${c.overflow}px`
        );
        if (c.text) console.log(`        text: "${c.text}"`);
      }
    }
    console.log('');
  }
}

const errored = results.filter((r) => r.error);
if (errored.length) {
  console.log(`\n  Page-load errors: ${errored.length}`);
  for (const r of errored) console.log(`    ${r.url}: ${r.error}`);
}

fs.writeFileSync('/tmp/wsaudit/overflow-results.json', JSON.stringify(results, null, 2));
