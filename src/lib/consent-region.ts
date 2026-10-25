// Visitors whose country needs analytics consent first: the EU, the EEA (IS, LI, NO), the UK and Switzerland.
// The country comes from Vercel's x-vercel-ip-country request header; a missing header counts as covered.

export const CONSENT_COUNTRIES = [
  // EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA
  'IS', 'LI', 'NO',
  'GB',
  'CH',
];

export function consentRequired(country: string | null | undefined): boolean {
  const code = (country ?? '').trim().toUpperCase();
  return code === '' || CONSENT_COUNTRIES.includes(code);
}
