import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // (Optional) Ignore TypeScript build errors as well
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
