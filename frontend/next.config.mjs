/** @type {import('next').NextConfig} */
const nextConfig = {
  // Same renderer setup as the root site so the Featured preview matches it.
  async rewrites() {
    return [
      {
        // Same-origin proxy for the renderer's source texture (never displayed).
        source: "/wasm-assets/og-pink-flower-comp-3.jpg",
        destination: "https://cdn.hyperformancesolutions.com/media/images/og-pink-flower-comp-3.jpg",
      },
    ];
  },
  async headers() {
    return [
      { source: "/wasm/:path*.wasm", headers: [{ key: "Content-Type", value: "application/wasm" }] },
    ];
  },
};

export default nextConfig;
