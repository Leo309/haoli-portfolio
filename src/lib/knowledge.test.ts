import { describe, expect, it } from "vitest";
import { loadKnowledgeDocuments, redactPhoneNumbers, toDocumentBlocks } from "./knowledge";

describe("loadKnowledgeDocuments", () => {
  const docs = loadKnowledgeDocuments();
  const titles = docs.map((d) => d.title);

  it("starts with the profile, titled by its H1", () => {
    expect(titles[0]).toBe("Profile");
  });

  it("includes every data file in a fixed order", () => {
    expect(titles.slice(0, 7)).toEqual([
      "Profile",
      "Experience",
      "Products",
      "AI agent lab",
      "Skills",
      "Data projects",
      "Education",
    ]);
  });

  it("adds case studies and lab posts with a prefix", () => {
    expect(titles).toContain("Case: Cold email that gets replies");
    expect(titles).toContain("Lab: Why I removed RAG from my own agent");
  });

  it("never hands the model a phone number", () => {
    for (const doc of docs) expect(doc.text).not.toMatch(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/);
  });
});

describe("redactPhoneNumbers", () => {
  it("removes phone numbers but keeps year ranges", () => {
    expect(redactPhoneNumbers("call 604-555-0199, founded 1970–2024")).toBe("call [removed], founded 1970–2024");
  });

  it("handles dots, spaces and parentheses", () => {
    expect(redactPhoneNumbers("(604) 555 0199 or 604.555.0199")).toBe("[removed] or [removed]");
  });
});

describe("toDocumentBlocks", () => {
  const blocks = toDocumentBlocks([
    { title: "Profile", text: "A" },
    { title: "Products", text: "B" },
  ]);

  it("turns each document into a cited plain-text document block", () => {
    expect(blocks[0]).toEqual({
      type: "document",
      source: { type: "text", media_type: "text/plain", data: "A" },
      title: "Profile",
      citations: { enabled: true },
    });
  });

  it("puts the cache breakpoint on the last block only", () => {
    expect(blocks[0].cache_control).toBeUndefined();
    expect(blocks[1].cache_control).toEqual({ type: "ephemeral" });
  });
});
