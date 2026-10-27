import Anthropic from "@anthropic-ai/sdk";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { personalInfo } from "@/lib/data";

// claude-sonnet-4-20250514 was retired, which broke this route with a 404 from the API.
// Haiku is the cheapest current model and is plenty for short Q&A over a small profile.
const CLAUDE_MODEL = "claude-haiku-5-5";
// Short factual Q&A doesn't need deep reasoning; "low" keeps answers fast and cheap
const CLAUDE_EFFORT = "low";
// Thinking is on by default for this model and counts toward max_tokens, so leave headroom
const MAX_OUTPUT_TOKENS = 4096;
const EMBEDDING_MODEL = "text-embedding-3-small";
const MAX_QUESTION_LENGTH = 500;
const MAX_TOOL_ROUNDS = 5;

// Module-level singletons — reused across warm invocations on Vercel
let _anthropic: Anthropic;
let _openai: OpenAI;
let _supabase: SupabaseClient;

function getAnthropicClient() {
  return (_anthropic ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }));
}
function getOpenAIClient() {
  return (_openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }));
}
function getSupabaseClient() {
  // service_role key because this runs server-side only and RLS blocks anon reads
  return (_supabase ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ));
}

// --- Tool Definitions ---
const tools: Anthropic.Tool[] = [
  {
    name: "search_background",
    description:
      "Search Hao Li's professional background, resume, skills, projects, and experience. Use this tool to find specific information before answering any question about Hao.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Natural language search query, e.g. 'Power BI dashboard experience' or 'Python ETL projects'",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_contact_info",
    description:
      "Returns Hao Li's contact information and professional links. Use when asked how to reach Hao or for his email/LinkedIn/portfolio.",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
];

// --- Tool Implementations ---
async function vectorSearch(query: string): Promise<string> {
  const embeddingRes = await getOpenAIClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  const { data, error } = await getSupabaseClient().rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 5,
    match_threshold: 0.3,
  });

  if (error) {
    console.error("Vector search error:", error);
    return "Error searching documents.";
  }

  if (!data?.length) return "No relevant information found in Hao's background.";

  return data
    .map(
      (d: { section: string; source: string; content: string; similarity: number }) =>
        `[${d.source} / ${d.section}] (relevance: ${(d.similarity * 100).toFixed(0)}%)\n${d.content}`
    )
    .join("\n\n---\n\n");
}

function getContactInfo(): string {
  return JSON.stringify(personalInfo);
}

// --- System Prompt ---
const SYSTEM_PROMPT = `You are an AI assistant on haoli.ai, representing Hao Li — a data and AI automation professional based in Vancouver, BC.

Your job is to answer questions from recruiters, hiring managers, and potential clients or collaborators about Hao's background, work, and projects accurately and professionally.

Rules:
1. Use the search_background tool before answering questions about Hao's skills, experience, projects, or current work. Do not guess or fabricate information.
2. Be concise and factual. Use specific numbers (years of experience, project metrics) when available.
3. If the retrieved context doesn't contain the answer, say "I don't have specific information about that in Hao's profile" rather than making something up.
4. Keep a professional but friendly tone — you're representing Hao to potential employers and collaborators.
5. If asked something unrelated to Hao's professional background, politely redirect: "I'm here to help with questions about Hao's professional background. What would you like to know?"
6. When appropriate, suggest reaching out to Hao directly using get_contact_info.`;

function callClaude(messages: Anthropic.MessageParam[]) {
  return getAnthropicClient().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    output_config: { effort: CLAUDE_EFFORT },
    system: SYSTEM_PROMPT,
    tools,
    messages,
  });
}

// --- Main API Handler ---
export async function POST(req: Request) {
  try {
    const { question, history = [] } = await req.json();

    if (!question || typeof question !== "string") {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return Response.json({ error: "Question too long" }, { status: 400 });
    }

    const messages: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: question },
    ];

    let response = await callClaude(messages);

    // Agentic loop — Claude may call tools multiple times before producing a final answer
    let rounds = 0;
    while (response.stop_reason === "tool_use" && rounds < MAX_TOOL_ROUNDS) {
      rounds++;

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      // Execute tool calls in parallel since they are independent
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          let result = "";
          if (toolUse.name === "search_background") {
            result = await vectorSearch((toolUse.input as { query: string }).query);
          } else if (toolUse.name === "get_contact_info") {
            result = getContactInfo();
          } else {
            result = `Unknown tool: ${toolUse.name}`;
          }
          return { type: "tool_result" as const, tool_use_id: toolUse.id, content: result };
        })
      );

      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });

      response = await callClaude(messages);
    }

    // A refusal or an exhausted tool loop can leave no text; never show the visitor a blank reply
    const answer =
      response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("") ||
      "Sorry, I couldn't answer that one. Try asking about Hao's experience, projects, or how to reach him.";

    // Clean history: text only, no tool exchanges, capped at 10 messages
    const cleanHistory: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: question },
      { role: "assistant", content: answer },
    ].slice(-10);

    return Response.json({ answer, history: cleanHistory });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
