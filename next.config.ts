import type { NextConfig } from "next";

const isPagesBuild = process.env.LUMEN_PAGES_BUILD === "true";

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: "export",
      typescript: {
        tsconfigPath: "tsconfig.pages.json",
      },
    }
  : {};

export default nextConfig;
