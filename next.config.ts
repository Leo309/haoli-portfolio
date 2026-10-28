import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root: a stray package-lock.json in a parent folder made Next guess wrong locally
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  // AskHao reads the Markdown knowledge base with fs at runtime. File tracing can't see
  // those dynamic paths, so ship them with the function or it 500s in production only.
  outputFileTracingIncludes: {
    "/api/ask": ["./data/**/*", "./content/**/*"],
  },
};

export default nextConfig;
