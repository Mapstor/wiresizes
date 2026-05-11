// Dump JSON-LD blocks for a single URL, pretty-printed
const url = process.argv[2];
const r = await fetch(url);
const html = await r.text();
const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
let m;
let i = 0;
while ((m = re.exec(html))) {
  console.log(`\n=== Block ${i++} ===\n`);
  try { console.log(JSON.stringify(JSON.parse(m[1]), null, 2)); }
  catch (e) { console.log('PARSE ERR:', e.message); console.log(m[1].slice(0, 300)); }
}
