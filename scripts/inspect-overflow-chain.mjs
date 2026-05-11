import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
const url = process.argv[2];
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
const info = await page.evaluate((vw) => {
  // Walk up from each element that overflows to the body, recording the chain
  const docW = document.documentElement.scrollWidth;
  const overflows = [];
  for (const el of document.querySelectorAll('body, body *')) {
    const r = el.getBoundingClientRect();
    if (r.right >= docW - 5 && r.right > vw + 1) {
      // Walk to body, capture ancestors
      const chain = [];
      let p = el;
      while (p && p !== document.body) {
        const cs = window.getComputedStyle(p);
        const pr = p.getBoundingClientRect();
        chain.push({
          tag: p.tagName.toLowerCase(),
          cls: (p.className || '').toString().slice(0, 80),
          width: Math.round(pr.width),
          right: Math.round(pr.right),
          minW: cs.minWidth,
          overflowX: cs.overflowX,
        });
        p = p.parentElement;
      }
      overflows.push({
        leaf: {
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          width: Math.round(r.width),
          right: Math.round(r.right),
        },
        chain,
      });
    }
  }
  overflows.sort((a, b) => a.leaf.width - b.leaf.width);
  // Group by similar chain (find DISTINCT problems)
  const seen = new Set();
  const distinct = [];
  for (const o of overflows) {
    const key = o.leaf.tag + '|' + o.leaf.cls + '|' + o.leaf.right;
    if (seen.has(key)) continue;
    seen.add(key);
    distinct.push(o);
  }
  return { docW, sample: distinct.slice(0, 4) };
}, 375);
console.log(JSON.stringify(info, null, 2));
await browser.close();
