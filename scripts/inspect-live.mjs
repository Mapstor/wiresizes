import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1');
const url = process.argv[2] || 'https://wiresizes.com/calculators/ev-charger-calculator';
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
const info = await page.evaluate(() => {
  const docW = document.documentElement.scrollWidth;
  const selects = [...document.querySelectorAll('select')].map(s => ({
    width: Math.round(s.getBoundingClientRect().width),
    right: Math.round(s.getBoundingClientRect().right),
    options: s.options.length,
    longest: Math.max(...[...s.options].map(o => o.textContent.length)),
    longestText: [...s.options].sort((a,b)=>b.textContent.length-a.textContent.length)[0]?.textContent.trim(),
  }));
  // Walk DOM to find the widest descendant
  const widest = [];
  for (const el of document.querySelectorAll('body, body *')) {
    const r = el.getBoundingClientRect();
    if (r.right > 380 && r.width > 100) {
      widest.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 90),
        width: Math.round(r.width),
        right: Math.round(r.right),
        textHead: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 60).trim(),
      });
    }
  }
  widest.sort((a, b) => b.width - a.width);
  return { docW, selects, widest: widest.slice(0, 10) };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
