import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // The repo root holds the combined dev/build scripts; point Turbopack at it
    // so it does not guess the workspace root from the nearest lockfile.
    root: path.resolve(process.cwd(), ".."),
  },
};

export default nextConfig;
