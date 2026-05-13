// Run overflow check across all 53 pages at 5 viewport widths against LOCAL prod build
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n')
  .map(u => u.replace('https://wiresizes.com', 'http://localhost:3001'));
const widths = [320, 360, 375];

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = {};

for (const w of widths) {
  const overflowing = [];
  for (const url of urls) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 800, deviceScaleFactor: 2, isMobile: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
    try { await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }); }
    catch (e) { await page.close(); continue; }
    await new Promise(r => setTimeout(r, 400));
    const info = await page.evaluate((vw) => {
      const docW = document.documentElement.scrollWidth;
      const overflow = docW - vw;
      if (overflow <= 1) return { overflow: 0 };
      const culprits = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 40) {
          let p = el.parentElement, skip = false;
          while (p && p !== document.body) {
            const cs = window.getComputedStyle(p);
            if (['auto', 'scroll', 'hidden'].includes(cs.overflowX)) {
              if (p.getBoundingClientRect().right <= vw + 1) { skip = true; break; }
            }
            p = p.parentElement;
          }
          if (skip) continue;
          culprits.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 60),
            text: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 45),
            width: Math.round(r.width),
          });
        }
      }
      culprits.sort((a, b) => a.width - b.width);
      return { overflow, docW, culprits: culprits.slice(0, 1) };
    }, w);
    if ((info.overflow || 0) > 1) overflowing.push({ url, ...info });
    await page.close();
  }
  results[w] = overflowing;
  console.log(`\n=== ${w}px: ${overflowing.length} pages overflow ===`);
  overflowing.sort((a, b) => b.overflow - a.overflow);
  for (const r of overflowing) {
    const c = r.culprits?.[0];
    const path = r.url.replace('http://localhost:3001', '') || '/';
    console.log(`  ${path.padEnd(45)} +${r.overflow}px ${c ? `<${c.tag} "${c.cls.slice(0,30)}" w=${c.width}>` : ''}`);
    if (c?.text) console.log(`    "${c.text}"`);
  }
}
await browser.close();
fs.writeFileSync('/tmp/wsaudit/overflow-multi-local.json', JSON.stringify(results, null, 2));
