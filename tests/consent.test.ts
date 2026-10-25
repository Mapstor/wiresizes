// WSZ-002 step 8b: the consent region rule, and Google's tag loads only from the consent component.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { consentRequired } from '../src/lib/consent-region';

const repoRoot = join(import.meta.dirname, '..');

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe('consentRequired', () => {
  it('is true for SI, DE, GB, CH and NO', () => {
    for (const country of ['SI', 'DE', 'GB', 'CH', 'NO']) assert.equal(consentRequired(country), true, country);
  });

  it('is false for US, CA and AU', () => {
    for (const country of ['US', 'CA', 'AU']) assert.equal(consentRequired(country), false, country);
  });

  it('is true when the country header is empty or missing', () => {
    assert.equal(consentRequired(''), true);
    assert.equal(consentRequired(undefined), true);
    assert.equal(consentRequired(null), true);
  });
});

describe('Google tag', () => {
  it('"googletagmanager.com" appears in no file under src except src/components/analytics/Consent.tsx', () => {
    const files = filesUnder(join(repoRoot, 'src'))
      .filter((file) => readFileSync(file, 'utf8').includes('googletagmanager.com'))
      .map((file) => relative(repoRoot, file));
    assert.deepEqual(files, [join('src', 'components', 'analytics', 'Consent.tsx')]);
  });
});
