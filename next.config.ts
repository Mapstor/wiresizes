import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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