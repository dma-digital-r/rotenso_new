import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Temporary: later replaced by browser-language detection.
    return [{ source: "/", destination: "/pl", permanent: false }];
  },
};

export default nextConfig;
