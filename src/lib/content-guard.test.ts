import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Everything that ships to visitors or to AskHao. The repo is public and the
// site is Hao's business card, so these rules are enforced, not just reviewed.
const SHIPPED_DIRS = ["data", "content", "src"];

function shippedFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      // Test files legitimately contain the forbidden patterns as fixtures
      else if (!/\.test\.tsx?$/.test(entry.name)) files.push(full);
    }
  };
  SHIPPED_DIRS.forEach((dir) => walk(path.join(process.cwd(), dir)));
  return files;
}

describe("shipped content", () => {
  const files = shippedFiles();

  it("finds the content folders", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s has no unfinished markers", (file) => {
    expect(fs.readFileSync(file, "utf8")).not.toMatch(/\bTODO\b|\[BUILDER|lorem ipsum/i);
  });

  it.each(files)("%s contains no phone number", (file) => {
    expect(fs.readFileSync(file, "utf8")).not.toMatch(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/);
  });

  it.each(files)("%s uses no pure black", (file) => {
    expect(fs.readFileSync(file, "utf8")).not.toMatch(/#000(000)?\b/i);
  });
});
