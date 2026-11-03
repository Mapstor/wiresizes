// The source registry, research/data-sources.csv, read at build time: attribution(domain) gives a data domain's
// attribution text, URL, verification date and status for <Sources> and <AsOf>. Server only: it reads the file with
// fs, so no client component may import it.
import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from './csv.mjs';

export interface Attribution {
  /** The registry's attribution string, rendered as is. */
  text: string;
  url: string;
  /** YYYY-MM-DD */
  verified_date: string;
  status: string;
}

let rows: Map<string, Record<string, string>> | null = null;

function registryRows(): Map<string, Record<string, string>> {
  if (!rows) {
    const csv = readFileSync(join(process.cwd(), 'research', 'data-sources.csv'), 'utf8');
    rows = new Map(parseCsv(csv).map((row) => [row.domain, row]));
  }
  return rows;
}

/** A verified domain's attribution. Throws, and so fails the build, for a domain that is missing or not verified. */
export function attribution(domain: string): Attribution {
  const row = registryRows().get(domain);
  if (!row) throw new Error(`data-sources.csv has no domain "${domain}"`);
  if (row.status !== 'verified') throw new Error(`data-sources.csv: domain "${domain}" is "${row.status}", not verified`);
  if (!row.attribution || !row.url || !/^\d{4}-\d{2}-\d{2}$/.test(row.verified_date)) {
    throw new Error(`data-sources.csv: domain "${domain}" needs an attribution, a url and a verified_date`);
  }
  return { text: row.attribution, url: row.url, verified_date: row.verified_date, status: row.status };
}
