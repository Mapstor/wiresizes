// One-off: wrap each unwrapped <table> with a <div className="overflow-x-auto">
// to prevent horizontal page overflow at mobile widths.
import fs from 'node:fs';
import path from 'node:path';

const repo = '/Users/markovisic/Desktop/wirecalculators/wiresizes';

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.tsx$/.test(e.name)) yield p;
  }
}

let totalWraps = 0;
const perFile = [];

for (const f of walk(path.join(repo, 'src/app'))) {
  let src = fs.readFileSync(f, 'utf8');
  let changed = false;
  let wraps = 0;

  // Iterate from the end of the file backward so positions don't shift.
  // Find all <table> tag positions first.
  const tablePositions = [];
  const re = /<table\b/g;
  let m;
  while ((m = re.exec(src))) tablePositions.push(m.index);

  for (let i = tablePositions.length - 1; i >= 0; i--) {
    const tableStart = tablePositions[i];
    // Check if already wrapped — look at the previous ~400 chars
    const ctx = src.slice(Math.max(0, tableStart - 400), tableStart);
    if (/overflow-x|overflow-auto/.test(ctx)) continue;

    // Find matching </table>
    const after = src.slice(tableStart);
    const endMatch = after.match(/<\/table>/);
    if (!endMatch) continue;
    const tableEnd = tableStart + endMatch.index + '</table>'.length;

    // Determine indentation by looking at the line containing <table
    const lineStart = src.lastIndexOf('\n', tableStart) + 1;
    const indentMatch = src.slice(lineStart, tableStart).match(/^[ \t]*/);
    const indent = indentMatch ? indentMatch[0] : '';

    // Insert wrapper. Use a slightly outdented opening + the table indented.
    const before = src.slice(0, tableStart);
    const tableContent = src.slice(tableStart, tableEnd);
    const after2 = src.slice(tableEnd);

    src =
      before +
      `<div className="overflow-x-auto">\n${indent}  ` +
      tableContent.replace(/\n/g, `\n  `) +
      `\n${indent}</div>` +
      after2;
    wraps++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, src);
    perFile.push({ file: f.replace(repo + '/', ''), wraps });
    totalWraps += wraps;
  }
}

console.log(`Wrapped ${totalWraps} tables across ${perFile.length} files:`);
for (const { file, wraps } of perFile) {
  console.log(`  ${wraps}×  ${file}`);
}
