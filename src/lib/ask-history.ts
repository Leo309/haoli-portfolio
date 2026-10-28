import type Anthropic from "@anthropic-ai/sdk";

// The browser sends the conversation back on each question, so treat it as untrusted:
// only plain text turns survive, in a shape the API accepts.

export type ChatTurn = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 10;
const MAX_TURN_LENGTH = 2000;

function isTurn(value: unknown): value is ChatTurn {
  if (typeof value !== "object" || value === null) return false;
  const turn = value as Record<string, unknown>;
  return (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
}

export function sanitizeHistory(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) return [];

  // Strict alternation: a turn with the same role as the one before it is dropped
  const alternating: ChatTurn[] = [];
  for (const item of input.filter(isTurn)) {
    if (alternating.length === 0 ? item.role !== "user" : item.role === alternating.at(-1)!.role) continue;
    alternating.push({ role: item.role, content: item.content.slice(0, MAX_TURN_LENGTH) });
  }

  let turns = alternating.slice(-MAX_TURNS);
  // Must start with the visitor and end with an answer, because the new question comes next
  if (turns[0]?.role === "assistant") turns = turns.slice(1);
  if (turns.at(-1)?.role === "user") turns = turns.slice(0, -1);
  return turns;
}

export function buildMessages(
  docs: Anthropic.DocumentBlockParam[],
  history: ChatTurn[],
  question: string
): Anthropic.MessageParam[] {
  const turns: ChatTurn[] = [...history, { role: "user", content: question }];
  // The documents ride on the first turn, so the cached prefix is identical on every request
  return turns.map((turn, i) =>
    i === 0 ? { role: "user", content: [...docs, { type: "text", text: turn.content }] } : { role: turn.role, content: turn.content }
  );
}
