import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AskHao reads the Markdown knowledge base with fs at runtime. File tracing can't see
  // those dynamic paths, so ship them with the function or it 500s in production only.
  outputFileTracingIncludes: {
    "/api/ask": ["./data/**/*", "./content/**/*"],
  },
};

export default nextConfig;
