import { ImageResponse } from 'next/og';

// Site-wide default OG / social card. Routes can override by adding their
// own opengraph-image.tsx (or .png/.jpg). 1200x630 is the canonical size
// for Facebook, LinkedIn, Slack, Twitter (summary_large_image), Discord,
// iMessage. Generated at build time — no runtime cost.

export const alt = 'wiresizes.com: wire gauge charts and calculators';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#0f172a';
const BLUE = '#1d4ed8';
const INDIGO = '#1e3a8a';
const AMBER = '#fbbf24';
const SKY = '#bae6fd';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: INDIGO,
          backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, ${INDIGO} 55%, ${NAVY} 100%)`,
          color: 'white',
          padding: '64px 80px',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex',
          }}
        />

        {/* Brand row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${AMBER} 0%, #d97706 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 900,
              color: INDIGO,
              marginRight: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
          >
            W
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.01em' }}>
              WireSizes.com
            </span>
            <span style={{ fontSize: 20, color: SKY, fontWeight: 500 }}>
              Wire gauge charts and calculators
            </span>
          </div>
        </div>

        {/* Headline area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Wire Size Calculator
          </div>
        </div>
      </div>
    ),
    size,
  );
}
