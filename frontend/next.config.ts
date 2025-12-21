import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost",
);

const remotePattern: RemotePattern = {
  protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
  hostname: apiUrl.hostname,
  port: apiUrl.port,
  pathname: "/images/**",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [remotePattern],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost/api/:path*",
      },
    ];
  },
};

export default nextConfig;
