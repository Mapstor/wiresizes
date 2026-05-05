import { ImageResponse } from 'next/og';

// Site-wide default OG / social card. Routes can override by adding their
// own opengraph-image.tsx (or .png/.jpg). 1200x630 is the canonical size
// for Facebook, LinkedIn, Slack, Twitter (summary_large_image), Discord,
// iMessage. Generated at build time — no runtime cost.

export const alt = 'WireSizes.com — Free NEC-compliant electrical wire size calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#0f172a';
const BLUE = '#1d4ed8';
const INDIGO = '#1e3a8a';
const AMBER = '#fbbf24';
const SKY = '#bae6fd';
const SLATE_300 = '#cbd5e1';
const WHITE_10 = 'rgba(255, 255, 255, 0.08)';
const WHITE_20 = 'rgba(255, 255, 255, 0.18)';

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
              Professional Electrical Calculators
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
          <div
            style={{
              fontSize: 36,
              color: SLATE_300,
              marginTop: 20,
              fontWeight: 500,
              display: 'flex',
            }}
          >
            Free • NEC 2023 compliant • Trusted by 50,000+ electricians
          </div>
        </div>

        {/* Reference pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {[
            ['15 A', '14 AWG'],
            ['20 A', '12 AWG'],
            ['30 A', '10 AWG'],
            ['50 A', '6 AWG'],
            ['100 A', '1 AWG'],
            ['200 A', '2/0'],
          ].map(([amps, awg], i) => (
            <div
              key={amps}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: WHITE_10,
                border: `1px solid ${WHITE_20}`,
                borderRadius: 999,
                padding: '14px 22px',
                fontSize: 22,
                fontWeight: 600,
                marginRight: i === 5 ? 0 : 12,
              }}
            >
              <span style={{ color: AMBER, marginRight: 10 }}>{amps}</span>
              <span style={{ color: 'white', opacity: 0.6, marginRight: 10 }}>→</span>
              <span style={{ color: 'white' }}>{awg}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
