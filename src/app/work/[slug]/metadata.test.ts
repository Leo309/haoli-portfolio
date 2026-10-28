import { describe, expect, it, vi } from "vitest";

// next/font only works inside the Next compiler
vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "" }), Geist_Mono: () => ({ variable: "" }) }));
import { generateMetadata as caseMetadata } from "./page";
import { generateMetadata as labMetadata } from "../../lab/[slug]/page";
import { metadata as rootMetadata } from "../../layout";

// Sharing a single case with a prospect should show the large preview card, not plain text
describe("share previews", () => {
  it("gives case pages the site preview image and a large card", async () => {
    const meta = await caseMetadata({ params: Promise.resolve({ slug: "dtc-cold-email" }) });
    expect(meta.openGraph?.images).toEqual(["/opengraph-image"]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("gives lab posts the site preview image and a large card", async () => {
    const meta = await labMetadata({ params: Promise.resolve({ slug: "why-i-removed-rag" }) });
    expect(meta.openGraph?.images).toEqual(["/opengraph-image"]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("asks for a large card on the home page too", () => {
    expect(rootMetadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
