import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCase, getCases, getLabPost, getLabPosts, getNextCase } from "./content";

function caseFile(slug: string, order: number, extra: Record<string, string> = {}) {
  const fields: Record<string, string> = {
    title: `Title ${slug}`,
    client: "Client",
    metric: "25%",
    metricLabel: "reply rate",
    summary: "Summary",
    order: String(order),
    ...extra,
  };
  const frontMatter = Object.entries(fields)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}: "${value}"`.replace(`"${fields.order}"`, fields.order))
    .join("\n");
  return `---\n${frontMatter}\n---\n\n## The problem\n\nBody of ${slug}.\n`;
}

// Builds a throwaway content root so tests never depend on the real case files
function makeRoot(files: Record<string, string>) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  return root;
}

describe("case studies", () => {
  const root = makeRoot({
    "content/work/a.md": caseFile("a", 2),
    "content/work/b.md": caseFile("b", 1),
  });

  it("sorts cases by their order field", () => {
    expect(getCases(root).map((c) => c.slug)).toEqual(["b", "a"]);
  });

  it("returns null for an unknown slug", () => {
    expect(getCase("missing", root)).toBeNull();
  });

  it("wraps around to the first case after the last one", () => {
    expect(getNextCase("a", root).slug).toBe("b");
  });

  it("keeps the Markdown body without the front matter", () => {
    expect(getCase("a", root)?.body).toContain("Body of a.");
    expect(getCase("a", root)?.body).not.toContain("metric:");
  });

  it("names the file and the field when front matter is incomplete", () => {
    const badRoot = makeRoot({ "content/work/a.md": caseFile("a", 1, { metric: "" }) });
    expect(() => getCases(badRoot)).toThrow(/a\.md.*metric/);
  });
});

describe("lab posts", () => {
  const labFile = (date: string) => `---\ntitle: "Post ${date}"\ndate: "${date}"\nsummary: "S"\n---\n\nBody.\n`;
  const root = makeRoot({
    // Alphabetical file order (alpha, beta) is the opposite of date order on purpose
    "content/lab/alpha.md": labFile("2026-03"),
    "content/lab/beta.md": labFile("2026-10"),
  });

  it("lists posts newest first", () => {
    expect(getLabPosts(root).map((p) => p.slug)).toEqual(["beta", "alpha"]);
  });

  it("returns null for an unknown slug", () => {
    expect(getLabPost("missing", root)).toBeNull();
  });
});
