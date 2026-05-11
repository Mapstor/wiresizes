// Capture full React hydration error from live, including stack
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const url of [
  'https://wiresizes.com/calculators/box-fill-calculator',
  'https://wiresizes.com/calculators/btu-to-watts-calculator',
]) {
  console.log(`\n=== ${url} ===`);
  const page = await browser.newPage();
  // Don't enable JS errors, capture everything
  const events = [];
  page.on('pageerror', e => events.push({ kind: 'PAGEERR', msg: String(e), stack: e.stack }));
  page.on('console', m => {
    if (['error', 'warning'].includes(m.type())) events.push({ kind: m.type().toUpperCase(), msg: m.text(), location: m.location() });
  });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Capture the page error #418 args from the URL itself
  for (const e of events) {
    console.log(`[${e.kind}]`);
    console.log('  msg:', e.msg.slice(0, 800));
    if (e.stack) console.log('  stack:', e.stack.slice(0, 1000));
    if (e.location?.url) console.log('  loc:', e.location.url, e.location.lineNumber);
  }
  await page.close();
}
await browser.close();
