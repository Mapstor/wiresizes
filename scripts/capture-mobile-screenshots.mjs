// Take mobile screenshots at multiple widths and find ACTUAL overflow
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
const widths = [320, 360, 375, 390, 414];

for (const w of widths) {
  await page.setViewport({ width: w, height: 800, deviceScaleFactor: 2, isMobile: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
  await page.goto('https://wiresizes.com/calculators/wire-size-calculator', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  const info = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth;
    const overflow = docW - vw;
    // Find elements that go beyond viewport
    const culprits = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 50) {
        // Skip overflow-x-auto descendants
        let p = el.parentElement, skip = false;
        while (p && p !== document.body) {
          const cs = window.getComputedStyle(p);
          if (['auto','scroll','hidden'].includes(cs.overflowX)) {
            const pr = p.getBoundingClientRect();
            if (pr.right <= vw + 1) { skip = true; break; }
          }
          p = p.parentElement;
        }
        if (skip) continue;
        culprits.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          text: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 60),
          width: Math.round(r.width),
          right: Math.round(r.right),
        });
      }
    }
    culprits.sort((a, b) => a.width - b.width);
    return { docW, overflow, culprits: culprits.slice(0, 4) };
  }, w);
  console.log(`\n=== ${w}px viewport ===`);
  console.log(`docW=${info.docW}px overflow=${info.overflow}px`);
  for (const c of info.culprits) {
    console.log(`  <${c.tag} class="${c.cls}"> w=${c.width}px r=${c.right}px`);
    if (c.text) console.log(`    "${c.text}"`);
  }
  await page.screenshot({ path: `/tmp/wsaudit/wire-size-${w}px.png`, fullPage: false });
}
await browser.close();
