// Module hooks for `npm test` (node --experimental-strip-types --import ./tests/register.mjs --test ...).
// - "@/..." resolves to src/...
// - extensionless relative and "@/..." specifiers try .ts, .tsx, then /index.ts
// - .json files load as ES modules (default export = the parsed JSON)
// Node strips types but does not compile them: modules loaded here must use erasable TypeScript only.
import { register } from 'node:module';
import { isMainThread } from 'node:worker_threads';
import { statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

if (isMainThread) {
  register(import.meta.url);
}

const SRC_URL = new URL('../src/', import.meta.url);
const CANDIDATE_SUFFIXES = ['.ts', '.tsx', '/index.ts'];

function isFile(url) {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
}

function resolveLocal(specifier, parentURL) {
  let base;
  if (specifier.startsWith('@/')) {
    base = new URL(specifier.slice(2), SRC_URL);
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (!parentURL) return null;
    base = new URL(specifier, parentURL);
  } else {
    return null;
  }
  if (isFile(base)) return base.href;
  for (const suffix of CANDIDATE_SUFFIXES) {
    const candidate = new URL(base.href + suffix);
    if (isFile(candidate)) return candidate.href;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const local = resolveLocal(specifier, context.parentURL);
  if (local) {
    return nextResolve(local, context);
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('.json')) {
    const text = await readFile(fileURLToPath(url), 'utf8');
    return {
      format: 'module',
      source: `export default ${JSON.stringify(JSON.parse(text))};\n`,
      shortCircuit: true,
    };
  }
  if (url.startsWith('file:') && url.endsWith('.ts') && !url.includes('/node_modules/')) {
    return nextLoad(url, { ...context, format: 'module-typescript' });
  }
  return nextLoad(url, context);
}
