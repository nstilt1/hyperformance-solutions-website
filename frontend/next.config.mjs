/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_URL
          ? new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname
          : "cdn.hyperformancesolutions.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        // Proxy the kaleidoscope source image so the WASM fetch stays same-origin.
        // On localhost the remote server doesn't send CORS headers, so a direct
        // fetch from the WASM runtime fails. In production (Amplify) the request
        // goes to the same domain and this rewrite is a no-op passthrough.
        source: "/wasm-assets/og-pink-flower-comp-3.jpg",
        destination:
          "https://cdn.hyperformancesolutions.com/media/images/og-pink-flower-comp-3.jpg",
      },
    ];
  },

  async headers() {
    return [
      {
        // Normal WASM file
        source: "/wasm/:path*.wasm",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
      {
        // Brotli-compressed WASM file
        source: "/wasm/:path*.wasm.br",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Content-Encoding", value: "br" },
        ],
      },
      {
        source: "/wasm/:path*.wasm.gz",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Content-Encoding", value: "gzip" },
        ],
      },
    ];
  },
};

export default nextConfig;
