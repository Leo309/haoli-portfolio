import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findForbiddenTerms, loadForbiddenTerms } from "./forbidden-terms";

describe("findForbiddenTerms", () => {
  const terms = ["acme widgets", "globex"];

  it("finds a multi-word term regardless of case and punctuation", () => {
    expect(findForbiddenTerms("We shipped it for ACME-widgets, last year.", terms)).toEqual(["acme widgets"]);
  });

  it("finds a single-word term", () => {
    expect(findForbiddenTerms("Globex asked for a dashboard", terms)).toEqual(["globex"]);
  });

  it("does not match inside a longer word", () => {
    expect(findForbiddenTerms("acmewidgets and globexcorp", terms)).toEqual([]);
  });
});

describe("loadForbiddenTerms", () => {
  it("reads one lowercase term per line, skipping blanks and comments", () => {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "terms-")), "terms.txt");
    fs.writeFileSync(file, "# clients\nAcme Widgets\n\n  Globex  \n");
    expect(loadForbiddenTerms(file)).toEqual(["acme widgets", "globex"]);
  });

  it("returns nothing when the private list doesn't exist", () => {
    expect(loadForbiddenTerms(path.join(os.tmpdir(), "does-not-exist.txt"))).toEqual([]);
  });
});
