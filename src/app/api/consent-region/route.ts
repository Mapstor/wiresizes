// Whether this visitor's region needs analytics consent first, from Vercel's x-vercel-ip-country header.
import { consentRequired } from '@/lib/consent-region';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const consent = consentRequired(request.headers.get('x-vercel-ip-country'));
  return Response.json({ consent }, { headers: { 'Cache-Control': 'no-store' } });
}
