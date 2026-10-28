import type { MetadataRoute } from "next";
import { getCases, getLabPosts } from "@/lib/content";

const SITE_URL = "https://haoli.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...getCases().map((c) => ({ url: `${SITE_URL}/work/${c.slug}` })),
    ...getLabPosts().map((p) => ({ url: `${SITE_URL}/lab/${p.slug}` })),
  ];
}
