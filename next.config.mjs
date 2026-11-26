import path from "node:path";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pages can be .md and .mdx files too
  pageExtensions: ["js", "jsx", "md", "mdx"],
  /* config options here */
  cacheComponents: true,
  // Memoize components for us
  reactCompiler: true,
  partialPrefetching: true,
  // Where "use cache: remote" keeps its entries
  cacheHandlers: {
    remote: path.resolve("cache-handlers/redis-handler.js"),
  },
  // Lifetimes of our own, by kind of data
  cacheLife: {
    // Changes when an editor adds a trail
    catalog: { stale: 600, revalidate: 21600, expire: 604800 },
    // Reviews appear within a minute
    community: { stale: 60, revalidate: 60, expire: 3600 },
    // Long in the browser, short on the server
    pinned: { stale: 120, revalidate: 5, expire: 300 },
    // For labs and counters
    quick: { stale: 30, revalidate: 5, expire: 60 },
  },
  experimental: {
    // Detect the network, and retry what failed
    useOffline: true,
    // Turn on forbidden() and unauthorized()
    authInterrupts: true,
    // Our own limit is 2 MB
    serverActions: { bodySizeLimit: "4mb" },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/old-trails", destination: "/trails", permanent: true },
    ];
  },
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: [
      // Only this server may be optimized
      { protocol: "http", hostname: "localhost", port: "4001" },
    ],
    // Local servers are blocked by default
    dangerouslyAllowLocalIP: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        // Leave CSS Modules to Next
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Add the MDX loader around the config
const withMDX = createMDX({});

export default withMDX(nextConfig);
