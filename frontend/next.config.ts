import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.10.30.13"],
};

export default nextConfig;
