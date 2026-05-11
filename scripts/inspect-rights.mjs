import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
await page.goto(process.argv[2], { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
const out = await page.evaluate(() => {
  const docW = document.documentElement.scrollWidth;
  const rights = {};
  for (const el of document.querySelectorAll('body, body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > 375.5) {
      const key = Math.round(r.right);
      if (!rights[key]) rights[key] = [];
      rights[key].push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 90),
        w: Math.round(r.width),
      });
    }
  }
  // List distinct right edges, max first
  // Group close edges and show MIN that is near docW (since docW is page-defining edge)
  const keys = Object.keys(rights).map(Number).sort((a, b) => b - a);
  const summary = [];
  // Show edges within ±5px of docW
  const docW2 = document.documentElement.scrollWidth;
  for (const k of keys) {
    if (Math.abs(k - docW2) <= 5) {
      summary.push({ right: k, n: rights[k].length, samples: rights[k].slice(0, 5) });
    }
  }
  return { docW, edges: summary };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
