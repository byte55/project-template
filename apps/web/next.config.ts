import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages are imported as TS source → let Next transpile them
  transpilePackages: ["@app/shared", "@app/db", "@app/api", "better-auth"],
};

export default nextConfig;
