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
const selector = process.argv[3];
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
const info = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { error: 'not found' };
  const chain = [];
  let p = el;
  while (p && p !== document.body) {
    const cs = window.getComputedStyle(p);
    const r = p.getBoundingClientRect();
    chain.push({
      tag: p.tagName.toLowerCase(),
      cls: (p.className || '').toString().slice(0, 80),
      width: Math.round(r.width),
      left: Math.round(r.left),
      right: Math.round(r.right),
      paddingL: cs.paddingLeft,
      paddingR: cs.paddingRight,
      marginL: cs.marginLeft,
      marginR: cs.marginRight,
      minW: cs.minWidth,
    });
    p = p.parentElement;
  }
  return { chain, docW: document.documentElement.scrollWidth };
}, selector);
console.log(JSON.stringify(info, null, 2));
await browser.close();
