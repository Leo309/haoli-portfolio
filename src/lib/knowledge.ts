import fs from "node:fs";
import path from "node:path";
import type Anthropic from "@anthropic-ai/sdk";
import { getCases, getLabPosts } from "./content";

// AskHao v2 gives the model the whole knowledge base on every question.
// At ~13K tokens with instructions it's cheaper and more reliable than retrieval (see content/lab/why-i-removed-rag.md).

export interface KnowledgeDocument {
  title: string;
  text: string;
}

// Fixed order: who Hao is first, then the evidence. Order matters for the cache prefix too.
const DATA_FILES = ["profile", "experience", "products", "lab", "skills", "data-projects", "education"];

// A public bot shouldn't hand out a phone number, even if one slips into the data later
export function redactPhoneNumbers(text: string): string {
  return text.replace(/\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b|\(\d{3}\)\s?\d{3}[-.\s]\d{4}\b/g, "[removed]");
}

function titleFromHeading(markdown: string, fallback: string): string {
  return markdown.match(/^#\s+(.+)$/m)?.[1].trim() ?? fallback;
}

export function loadKnowledgeDocuments(root: string = process.cwd()): KnowledgeDocument[] {
  const dataDocs = DATA_FILES.map((name) => {
    const text = fs.readFileSync(path.join(root, "data", `${name}.md`), "utf8");
    return { title: titleFromHeading(text, name), text };
  });
  const caseDocs = getCases(root).map((c) => ({ title: `Case: ${c.title}`, text: `# ${c.title}\n\n${c.client}\n\n${c.body}` }));
  const labDocs = getLabPosts(root).map((p) => ({ title: `Lab: ${p.title}`, text: `# ${p.title}\n\n${p.body}` }));

  return [...dataDocs, ...caseDocs, ...labDocs].map((doc) => ({ ...doc, text: redactPhoneNumbers(doc.text) }));
}

export function toDocumentBlocks(docs: KnowledgeDocument[]): Anthropic.DocumentBlockParam[] {
  return docs.map((doc, i) => ({
    type: "document",
    source: { type: "text", media_type: "text/plain", data: doc.text },
    title: doc.title,
    citations: { enabled: true },
    // One breakpoint after the last document caches tools + system + the whole knowledge base
    ...(i === docs.length - 1 ? { cache_control: { type: "ephemeral" as const } } : {}),
  }));
}
