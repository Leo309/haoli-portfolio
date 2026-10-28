import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it } from "vitest";
import { extractAnswer } from "./citations";

function cite(title: string | null): Anthropic.CitationCharLocation {
  return {
    type: "char_location",
    cited_text: "x",
    document_index: 0,
    document_title: title,
    start_char_index: 0,
    end_char_index: 1,
    file_id: null,
  };
}

const text = (t: string, citations: Anthropic.TextCitation[] | null = null): Anthropic.ContentBlock =>
  ({ type: "text", text: t, citations }) as Anthropic.TextBlock;

describe("extractAnswer", () => {
  it("joins text blocks and collects the cited document titles", () => {
    expect(extractAnswer([text("He built "), text("GeoGrade", [cite("Products")])])).toEqual({
      text: "He built GeoGrade",
      sources: ["Products"],
    });
  });

  it("de-duplicates sources and keeps first-seen order", () => {
    const result = extractAnswer([
      text("a", [cite("Experience")]),
      text("b", [cite("Products"), cite("Experience")]),
    ]);
    expect(result.sources).toEqual(["Experience", "Products"]);
  });

  it("ignores non-text blocks and untitled citations", () => {
    const thinking = { type: "thinking", thinking: "…", signature: "s" } as Anthropic.ContentBlock;
    expect(extractAnswer([thinking, text("Hi", [cite(null)])])).toEqual({ text: "Hi", sources: [] });
  });
});
