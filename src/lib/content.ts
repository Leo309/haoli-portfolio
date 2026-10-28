import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Case studies and lab posts are Markdown files with front matter.
// The pages render them, and AskHao reads the same files, so there is one source of truth.

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  metric: string;
  metricLabel: string;
  summary: string;
  order: number;
  body: string;
}

export interface LabPost {
  slug: string;
  title: string;
  date: string; // YYYY-MM
  summary: string;
  body: string;
}

const CASE_FIELDS = ["title", "client", "metric", "metricLabel", "summary", "order"] as const;
const LAB_FIELDS = ["title", "date", "summary"] as const;

// Reads every .md file in a folder; a missing required field fails the build loudly
// instead of shipping a half-empty card.
function readFolder(dir: string, requiredFields: readonly string[]) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === "") {
          throw new Error(`${file}: missing front matter field "${field}"`);
        }
      }
      return { slug: file.replace(/\.md$/, ""), data, body: content.trim() };
    });
}

export function getCases(root: string = process.cwd()): CaseStudy[] {
  return readFolder(path.join(root, "content", "work"), CASE_FIELDS)
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title),
      client: String(data.client),
      metric: String(data.metric),
      metricLabel: String(data.metricLabel),
      summary: String(data.summary),
      order: Number(data.order),
      body,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getCase(slug: string, root?: string): CaseStudy | null {
  return getCases(root).find((c) => c.slug === slug) ?? null;
}

export function getNextCase(slug: string, root?: string): CaseStudy {
  const cases = getCases(root);
  const index = cases.findIndex((c) => c.slug === slug);
  return cases[(index + 1) % cases.length];
}

export function getLabPosts(root: string = process.cwd()): LabPost[] {
  return readFolder(path.join(root, "content", "lab"), LAB_FIELDS).map(({ slug, data, body }) => ({
    slug,
    title: String(data.title),
    date: String(data.date),
    summary: String(data.summary),
    body,
  }));
}

export function getLabPost(slug: string, root?: string): LabPost | null {
  return getLabPosts(root).find((p) => p.slug === slug) ?? null;
}
