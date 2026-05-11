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
  // Server HTML (no JS)
  const serverRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } });
  const serverHtml = await serverRes.text();
  // Pull just the calculator section from server HTML using a marker
  const ssrCalcMatch = serverHtml.match(/<div[^>]*max-w-4xl[^>]*>([\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/);

  // Client HTML after hydration (JS enabled)
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  const clientHtml = await page.evaluate(() => {
    const el = document.querySelector('.max-w-4xl');
    return el ? el.outerHTML : '';
  });
  // Find first diff between server and client first 5KB of similar region
  const sample = clientHtml.slice(0, 3000);
  console.log('CLIENT first 3000 chars of calc section:');
  console.log(sample);
  await page.close();
}
await browser.close();
