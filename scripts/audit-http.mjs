// HTTP + indexability audit
import fs from 'node:fs';

const urls = fs.readFileSync('/tmp/wsaudit/urls.txt', 'utf8').trim().split('\n');

async function check(url) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
    redirect: 'manual',
  });
  const h = Object.fromEntries(r.headers);
  return {
    url,
    status: r.status,
    location: h.location,
    contentType: h['content-type'],
    xRobotsTag: h['x-robots-tag'],
    age: h.age,
    cacheControl: h['cache-control'],
    contentLength: h['content-length'] || (await r.text().then(t => t.length).catch(() => -1)),
  };
}

const results = [];
const conc = 6;
let inflight = 0, idx = 0;
await new Promise((resolve) => {
  const tick = () => {
    while (inflight < conc && idx < urls.length) {
      const url = urls[idx++];
      inflight++;
      check(url).then(r => results.push(r)).catch(e => results.push({ url, error: String(e).slice(0, 80) })).finally(() => {
        inflight--;
        if (idx === urls.length && inflight === 0) resolve();
        else tick();
      });
    }
  };
  tick();
});

results.sort((a, b) => a.url.localeCompare(b.url));

const bad = results.filter(r => r.status !== 200 || r.xRobotsTag?.includes('noindex'));
console.log(`\n=== HTTP audit @ Googlebot UA ===\n`);
console.log(`Total: ${results.length}, OK 200: ${results.filter(r => r.status === 200).length}`);
console.log(`Redirects: ${results.filter(r => r.status >= 300 && r.status < 400).length}`);
console.log(`4xx/5xx: ${results.filter(r => r.status >= 400).length}`);
console.log(`Noindex: ${results.filter(r => r.xRobotsTag?.includes('noindex')).length}`);

if (bad.length) {
  console.log(`\nProblem URLs:`);
  for (const r of bad) {
    console.log(`  ${r.status} ${r.url}${r.location ? ' -> ' + r.location : ''}${r.xRobotsTag ? ' [x-robots: ' + r.xRobotsTag + ']' : ''}`);
  }
}

fs.writeFileSync('/tmp/wsaudit/http.json', JSON.stringify(results, null, 2));
console.log('\nSaved to /tmp/wsaudit/http.json');
