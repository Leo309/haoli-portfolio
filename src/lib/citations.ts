import type Anthropic from "@anthropic-ai/sdk";

// With citations on, Claude splits an answer into text blocks, each carrying the
// passages it rests on. The UI shows the answer plus one chip per cited document.
export function extractAnswer(content: Anthropic.ContentBlock[]): { text: string; sources: string[] } {
  const textBlocks = content.filter((b): b is Anthropic.TextBlock => b.type === "text");
  const sources: string[] = [];

  for (const block of textBlocks) {
    for (const citation of block.citations ?? []) {
      const title = "document_title" in citation ? citation.document_title : null;
      if (title && !sources.includes(title)) sources.push(title);
    }
  }

  return { text: textBlocks.map((b) => b.text).join(""), sources };
}
