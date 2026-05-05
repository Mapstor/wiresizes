import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Per-article datePublished / dateModified for Article schema.
 *
 * Strategy (in order):
 *   1. git log on the file — first commit = datePublished, last = dateModified.
 *   2. fs.statSync mtime — may be reset by Vercel checkout, but works locally.
 *   3. FALLBACK_DATE — last resort.
 *
 * Resolves at build time during static prerender. Cached so repeated calls
 * for the same file in one build don't re-shell git.
 *
 * NOTE: git log step requires a full clone. Vercel does deep clones for
 * production by default; preview deployments may be shallow and will
 * silently fall through to fs.statSync.
 */

const FALLBACK_DATE = '2026-01-01'; // sane stable default
const cache = new Map<string, ArticleDates>();

export interface ArticleDates {
  datePublished: string; // ISO date YYYY-MM-DD
  dateModified: string;  // ISO date YYYY-MM-DD
}

function gitDate(file: string, args: string[]): string | null {
  try {
    const out = execSync(['git', 'log', ...args, '--', file].join(' '), {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return null;
    // git log can return multiple lines (--reverse). Take first.
    const first = out.split('\n')[0].trim();
    return first.slice(0, 10);
  } catch {
    return null;
  }
}

/**
 * @param relativeFilePath e.g. "src/app/guides/wire-sizing-guide/GuideClient.tsx"
 */
export function getArticleDates(relativeFilePath: string): ArticleDates {
  const cached = cache.get(relativeFilePath);
  if (cached) return cached;

  const file = resolve(process.cwd(), relativeFilePath);

  // Try git first.
  const firstCommit = gitDate(file, ['--reverse', '--format=%aI']);
  const lastCommit = gitDate(file, ['-1', '--format=%aI']);

  let datePublished = firstCommit;
  let dateModified = lastCommit;

  // Fall back to file mtime if git didn't produce a date.
  if (!datePublished || !dateModified) {
    try {
      const stat = statSync(file);
      const mtime = stat.mtime.toISOString().slice(0, 10);
      // birthtime not reliable across OSes; mtime as a single fallback.
      if (!datePublished) datePublished = mtime;
      if (!dateModified) dateModified = mtime;
    } catch {
      // file missing — leave as null
    }
  }

  const result: ArticleDates = {
    datePublished: datePublished ?? FALLBACK_DATE,
    dateModified: dateModified ?? FALLBACK_DATE,
  };
  cache.set(relativeFilePath, result);
  return result;
}
