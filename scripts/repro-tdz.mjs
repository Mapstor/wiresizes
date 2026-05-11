// Reproduce the TDZ error against dev server with full stack traces
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const urls = [
  'http://localhost:3001/calculators/electrical-load-calculator',
  'http://localhost:3001/calculators/garage-subpanel-calculator',
  'http://localhost:3001/calculators/three-phase-calculator',
];

for (const url of urls) {
  console.log(`\n=== ${url.replace('http://localhost:3001', '')} ===`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errs.push({ kind: 'console', text: msg.text() });
  });
  page.on('pageerror', (e) => errs.push({ kind: 'page', text: String(e), stack: e.stack }));
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('NAV ERROR:', String(e).slice(0, 200));
  }
  await new Promise(r => setTimeout(r, 1500));
  for (const e of errs) {
    console.log(`[${e.kind}]`, e.text.slice(0, 400));
    if (e.stack) console.log(e.stack.slice(0, 800));
  }
  await page.close();
}
await browser.close();
