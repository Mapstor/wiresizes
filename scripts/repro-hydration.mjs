// Reproduce hydration error against dev with full message
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const urls = [
  'http://localhost:3001/calculators/box-fill-calculator',
  'http://localhost:3001/calculators/btu-to-watts-calculator',
];

for (const url of urls) {
  console.log(`\n=== ${url.replace('http://localhost:3001', '')} ===`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = [];
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) errs.push({ kind: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (e) => errs.push({ kind: 'page', text: String(e) }));
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  for (const e of errs) {
    console.log(`[${e.kind}]`, e.text.slice(0, 600));
  }
  await page.close();
}
await browser.close();
