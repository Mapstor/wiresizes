// Better calculator audit: try interactive change AND click Calculate button
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const target = process.argv[2] || 'live'; // 'live' or 'local'
const baseUrl = target === 'local' ? 'http://localhost:3001' : 'https://wiresizes.com';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n')
  .filter(u => u.includes('/calculators/'))
  .map(u => u.replace('https://wiresizes.com', baseUrl));

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = [];

for (const url of urls) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200));
  });
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));

  let nav = false;
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    nav = true;
  } catch (e) {
    results.push({ url, error: String(e).slice(0, 80) });
    await page.close();
    continue;
  }
  await new Promise(r => setTimeout(r, 1500));

  const test = await page.evaluate(async () => {
    const getSig = () => {
      // Capture text in elements likely to hold results
      const sel = '[class*="result"], [class*="output"], [class*="ampacity"], ' +
                  '[class*="watts"], .text-2xl, .text-3xl, .text-4xl, .font-mono, ' +
                  '[ref], strong, b';
      const els = document.querySelectorAll(sel);
      return [...els].map(e => (e.textContent || '').slice(0, 100).trim()).filter(Boolean).join('|');
    };

    const inputs = [...document.querySelectorAll('input[type="number"]:not([disabled])')];
    const selects = [...document.querySelectorAll('select:not([disabled])')];
    const calcButtons = [...document.querySelectorAll('button')].filter(b => {
      const t = (b.textContent || '').toLowerCase();
      return t.includes('calculate') || t.includes('compute') || t.includes('compute');
    });

    const sigBefore = getSig();

    // Change first numeric input
    let changedInput = false;
    for (const inp of inputs) {
      const orig = inp.value;
      const newVal = Math.max(1, Number(orig) * 2 || 50);
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inp, String(newVal));
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      changedInput = true;
      break;
    }
    if (!changedInput && selects.length) {
      const sel = selects[0];
      if (sel.options.length > 1) {
        sel.selectedIndex = (sel.selectedIndex + 1) % sel.options.length;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        changedInput = true;
      }
    }

    // Wait for state propagation
    await new Promise(r => setTimeout(r, 400));

    // If a Calculate button exists, click it
    if (calcButtons.length) {
      calcButtons[0].click();
      await new Promise(r => setTimeout(r, 800));
    }

    const sigAfter = getSig();
    const reactive = sigBefore !== sigAfter;

    return {
      inputCount: inputs.length,
      selectCount: selects.length,
      hasCalculateButton: calcButtons.length > 0,
      changedInput,
      reactive,
      beforeLen: sigBefore.length,
      afterLen: sigAfter.length,
    };
  });

  results.push({
    url,
    ...test,
    consoleErrors: consoleErrors.length,
    consoleErrorSample: consoleErrors[0]?.slice(0, 180),
    pageErrors: pageErrors.length,
    pageErrorSample: pageErrors[0]?.slice(0, 180),
  });
  await page.close();
}
await browser.close();

console.log(`\n=== Calculator audit v2 (input change + Calculate click) — ${target.toUpperCase()} ===\n`);
const broken = results.filter(r => !r.reactive && (r.inputCount + r.selectCount > 0) && !r.error);
const reactive = results.filter(r => r.reactive);
const errs = results.filter(r => (r.consoleErrors || 0) > 0 || (r.pageErrors || 0) > 0);

console.log(`Tested: ${results.length}`);
console.log(`Reactive: ${reactive.length}`);
console.log(`Non-reactive (truly broken?): ${broken.length}`);
console.log(`With JS errors: ${errs.length}`);

if (broken.length) {
  console.log(`\n⚠ Non-reactive calcs:`);
  for (const r of broken) {
    const p = r.url.replace(baseUrl, '');
    console.log(`  ${p}  inputs=${r.inputCount} selects=${r.selectCount} calcBtn=${r.hasCalculateButton}`);
  }
}
if (errs.length) {
  console.log(`\n⚠ Calcs with JS errors:`);
  for (const r of errs) {
    const p = r.url.replace(baseUrl, '');
    console.log(`  ${p}  console=${r.consoleErrors} page=${r.pageErrors}`);
    if (r.pageErrorSample) console.log(`    pageerr: ${r.pageErrorSample}`);
    if (r.consoleErrorSample) console.log(`    console: ${r.consoleErrorSample}`);
  }
}
fs.writeFileSync('/tmp/wsaudit/calc-v2.json', JSON.stringify(results, null, 2));
