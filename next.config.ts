import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Since Next.js 16.3, `next dev` writes a managed block into AGENTS.md at the
  // repo root when it detects an AI agent. CLAUDE.md and DEVLOG.md are this repo's
  // agent instructions; version-matched docs stay in node_modules/next/dist/docs/.
  agentRules: false,
  // Tree-shake icon imports — without this, lucide-react ships every icon
  // even though we only use ~80 distinct ones.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wiresizes.com',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect duplicate calculator routes to canonical versions
      {
        source: '/calculators/amps-to-watts',
        destination: '/calculators/amps-to-watts-calculator',
        permanent: true,
      },
      {
        source: '/calculators/watts-to-amps',
        destination: '/calculators/watts-to-amps-calculator',
        permanent: true,
      },
      {
        source: '/calculators/ohms-law',
        destination: '/calculators/ohms-law-calculator',
        permanent: true,
      },
      {
        source: '/calculators/conduit-fill',
        destination: '/calculators/conduit-fill-calculator',
        permanent: true,
      },
      {
        source: '/calculators/three-phase',
        destination: '/calculators/three-phase-calculator',
        permanent: true,
      },
      {
        source: '/calculators/pool-pump',
        destination: '/calculators/pool-pump-calculator',
        permanent: true,
      },
      {
        source: '/calculators/horsepower-to-amps',
        destination: '/calculators/horsepower-to-amps-calculator',
        permanent: true,
      },
      {
        source: '/calculators/kw-to-amps',
        destination: '/calculators/kilowatts-to-amps-calculator',
        permanent: true,
      },
      {
        source: '/calculators/ground-wire-size',
        destination: '/calculators/ground-wire-calculator',
        permanent: true,
      },
      {
        source: '/calculators/ac-wire-size',
        destination: '/calculators/air-conditioner-calculator',
        permanent: true,
      },
      {
        source: '/calculators/garage-subpanel-wire-size',
        destination: '/calculators/garage-subpanel-calculator',
        permanent: true,
      },
      // WSZ-002: overlapping or retired pages merged into their closest page
      {
        source: '/calculators/ev-charger-calculator',
        destination: '/guides/wire-size-for-ev-charger',
        permanent: true,
      },
      {
        source: '/calculators/ev-charger-wire-size-calculator',
        destination: '/guides/wire-size-for-ev-charger',
        permanent: true,
      },
      {
        source: '/calculators/hot-tub-wire-size-calculator',
        destination: '/calculators/hot-tub-calculator',
        permanent: true,
      },
      {
        source: '/calculators/electrical-load-calculator',
        destination: '/calculators/residential-load-calculator',
        permanent: true,
      },
      {
        source: '/guides/wire-sizing-guide',
        destination: '/calculators/wire-size-calculator',
        permanent: true,
      },
      {
        source: '/guides/electrical-safety',
        destination: '/guides',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;