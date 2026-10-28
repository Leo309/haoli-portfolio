import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the home page, every case study and every lab post", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://haoli.ai",
      "https://haoli.ai/work/manufacturer-data-strategy",
      "https://haoli.ai/work/dtc-cold-email",
      "https://haoli.ai/work/influencer-crm",
      "https://haoli.ai/lab/why-i-removed-rag",
    ]);
  });
});
