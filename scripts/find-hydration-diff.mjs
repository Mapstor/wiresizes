// Diff server HTML vs post-hydration DOM to find the exact mismatch
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const url = process.argv[2] || 'https://wiresizes.com/calculators/box-fill-calculator';

// Server HTML
const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } });
const serverHtml = await r.text();

// Client post-hydration HTML
const page = await browser.newPage();
// Capture hydration error info BEFORE it gets minified
await page.evaluateOnNewDocument(() => {
  window.__hydrationErrors = [];
  const origError = console.error;
  console.error = function(...args) {
    window.__hydrationErrors.push(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '));
    origError.apply(console, args);
  };
});
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3000));

const clientHtml = await page.content();
const errors = await page.evaluate(() => window.__hydrationErrors || []);

console.log('=== Captured hydration errors ===');
for (const e of errors) console.log(e.slice(0, 600));

// Compute approximate per-line diff in body region
const ssrBody = (serverHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, ''])[1];
const csrBody = (clientHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, ''])[1];

console.log('\n=== Length comparison ===');
console.log('SSR body length:', ssrBody.length);
console.log('CSR body length:', csrBody.length);

// Find first divergence
let i = 0;
const min = Math.min(ssrBody.length, csrBody.length);
while (i < min && ssrBody[i] === csrBody[i]) i++;
console.log('\nFirst diff at char position:', i);
console.log('SSR around:', ssrBody.slice(Math.max(0, i - 100), i + 200));
console.log('---');
console.log('CSR around:', csrBody.slice(Math.max(0, i - 100), i + 200));

await page.close();
await browser.close();
