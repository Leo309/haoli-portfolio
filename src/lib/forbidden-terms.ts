import fs from "node:fs";
import path from "node:path";

// Client names must never appear in this public repo. The list itself lives in
// private/forbidden-terms.txt (gitignored, one name per line), so neither the names
// nor guessable hashes of them are ever committed.
const DEFAULT_LIST = path.join(process.cwd(), "private", "forbidden-terms.txt");
const MAX_WORDS_PER_TERM = 3;

export function loadForbiddenTerms(file: string = DEFAULT_LIST): string[] {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith("#"));
}

function words(text: string): string[] {
  return text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

// Compares every run of 1–3 consecutive words, so a name only matches as whole words
export function findForbiddenTerms(text: string, terms: string[]): string[] {
  const wanted = new Set(terms.map((term) => words(term).join(" ")));
  const tokens = words(text);
  const found = new Set<string>();

  for (let start = 0; start < tokens.length; start++) {
    for (let size = 1; size <= MAX_WORDS_PER_TERM && start + size <= tokens.length; size++) {
      const phrase = tokens.slice(start, start + size).join(" ");
      if (wanted.has(phrase)) found.add(phrase);
    }
  }
  return [...found];
}
