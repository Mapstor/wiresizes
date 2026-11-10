// WSZ-021: a Next.js adapter that does nothing. Vercel's builder runs every build with its own adapter
// (NEXT_ADAPTER_PATH), and since Next.js 16.4 an adapter build writes prerendered pages and route bodies to
// .next/server/route-cache instead of .next/server/app. To check the gates against that layout before pushing:
//   rm -rf .next && NEXT_ADAPTER_PATH="$PWD/scripts/noop-adapter.mjs" npm run build
// The build log then says "Applying modifyConfig from noop-adapter" and check-structure counts its pages under
// .next/server/route-cache. Not imported by the site.
const noopAdapter = {
  name: 'noop-adapter',
  async modifyConfig(config) {
    return config;
  },
  async onBuildComplete() {},
};

export default noopAdapter;
