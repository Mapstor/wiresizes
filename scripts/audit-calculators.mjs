// Functional calculator test: load each calc, modify inputs, verify reactivity
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n')
  .filter(u => u.includes('/calculators/'));

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

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    results.push({ url, error: String(e).slice(0, 80), broken: true });
    await page.close();
    continue;
  }
  // Let hydration settle
  await new Promise(r => setTimeout(r, 1200));

  // Test reactivity: collect numbers visible on page, change first input/select, re-collect, diff
  const test = await page.evaluate(async () => {
    const grabSignature = () => {
      // Capture the most likely "result" text — bold/big/result-keyword elements
      const candidates = document.querySelectorAll(
        '.font-bold, .font-semibold, .text-2xl, .text-3xl, .text-4xl, ' +
        '[class*="result"], [class*="output"], [class*="ampac"], [class*="wire"]'
      );
      const txts = [];
      for (const el of candidates) {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t && t.length < 200) txts.push(t);
      }
      return txts.join('|');
    };

    const inputs = [...document.querySelectorAll('input[type="number"], input[type="text"]:not([readonly])')];
    const selects = [...document.querySelectorAll('select')];
    const sliders = [...document.querySelectorAll('input[type="range"]')];
    const tabs = [...document.querySelectorAll('button[role="tab"], button[aria-pressed]')];

    const before = grabSignature();
    const beforeNumeric = (document.body.textContent.match(/\d+(\.\d+)?/g) || []).join(',');

    let changed = false;
    let action = null;

    // Try changing a number input first
    for (const inp of inputs) {
      if (inp.disabled || inp.readOnly) continue;
      const orig = inp.value;
      const newVal = Math.max(1, Number(orig) * 2 || 50);
      inp.focus();
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inp, String(newVal));
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      action = `input ${inp.name || inp.placeholder || '?'} ${orig} -> ${newVal}`;
      break;
    }
    if (!action) {
      // Try changing a select
      for (const sel of selects) {
        if (sel.disabled) continue;
        if (sel.options.length < 2) continue;
        const orig = sel.selectedIndex;
        const newIdx = (orig + 1) % sel.options.length;
        sel.selectedIndex = newIdx;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        action = `select ${sel.name || '?'} idx ${orig} -> ${newIdx}`;
        break;
      }
    }
    if (!action) {
      // Try clicking a tab
      for (const tab of tabs) {
        tab.click();
        action = `clicked button "${(tab.textContent || '').trim().slice(0, 30)}"`;
        break;
      }
    }

    // Wait for React render
    await new Promise(r => setTimeout(r, 600));

    const after = grabSignature();
    const afterNumeric = (document.body.textContent.match(/\d+(\.\d+)?/g) || []).join(',');

    changed = before !== after || beforeNumeric !== afterNumeric;

    return {
      inputCount: inputs.length,
      selectCount: selects.length,
      sliderCount: sliders.length,
      tabCount: tabs.length,
      hasCalculatorBody: !!document.querySelector('main, [role="main"], .calculator, [class*="alculator"]'),
      action,
      changed,
      beforeLen: before.length,
      afterLen: after.length,
      sample: changed ? after.slice(0, 200) : null,
    };
  });

  results.push({
    url,
    ...test,
    consoleErrors: consoleErrors.length,
    consoleErrorSample: consoleErrors[0],
    pageErrors: pageErrors.length,
    pageErrorSample: pageErrors[0],
  });
  await page.close();
}

await browser.close();

const broken = results.filter(r => r.broken || (!r.changed && r.action && r.inputCount + r.selectCount > 0));
const noInputs = results.filter(r => !r.action && r.inputCount + r.selectCount + r.tabCount === 0);
const ok = results.filter(r => r.changed);

console.log(`\n=== Calculator functional audit ===\n`);
console.log(`Tested: ${results.length} calculator pages`);
console.log(`Reactive (output changed on input): ${ok.length}`);
console.log(`Likely broken (no change after input): ${broken.length}`);
console.log(`No detectable inputs/tabs: ${noInputs.length}`);

if (broken.length) {
  console.log(`\n⚠ Possibly broken:`);
  for (const r of broken) {
    const p = r.url.replace('https://wiresizes.com', '');
    console.log(`  ${p}`);
    console.log(`    inputs=${r.inputCount} selects=${r.selectCount} tabs=${r.tabCount}`);
    console.log(`    action: ${r.action}`);
    if (r.error) console.log(`    error: ${r.error}`);
    if (r.consoleErrors) console.log(`    console errors: ${r.consoleErrors} (${r.consoleErrorSample || ''})`);
    if (r.pageErrors) console.log(`    page errors: ${r.pageErrors} (${r.pageErrorSample || ''})`);
  }
}

const withConsoleErrs = results.filter(r => r.consoleErrors > 0 || r.pageErrors > 0);
if (withConsoleErrs.length) {
  console.log(`\n⚠ Pages with console / runtime errors:`);
  for (const r of withConsoleErrs) {
    const p = r.url.replace('https://wiresizes.com', '');
    console.log(`  ${p}  console=${r.consoleErrors} page=${r.pageErrors}`);
    if (r.consoleErrorSample) console.log(`    "${r.consoleErrorSample}"`);
    if (r.pageErrorSample) console.log(`    "${r.pageErrorSample}"`);
  }
}

fs.writeFileSync('/tmp/wsaudit/calculators.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /tmp/wsaudit/calculators.json');
