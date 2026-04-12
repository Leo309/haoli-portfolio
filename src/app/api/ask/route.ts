import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Lazy-init clients to avoid build-time errors when env vars are empty
function getClients() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  // Use service_role key because this runs server-side only and RLS blocks anon reads
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return { anthropic, openai: openaiClient, supabase: supabaseClient };
}

// --- Tool Definitions ---
// These tell Claude what tools it can use. Claude decides WHEN and HOW to call them.
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
async function vectorSearch(
  query: string,
  clients: ReturnType<typeof getClients>
): Promise<string> {
  // Step 1: Embed the query using OpenAI
  const embeddingRes = await clients.openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  // Step 2: Search Supabase for similar chunks via pgvector
  const { data, error } = await clients.supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 5,
    match_threshold: 0.3,
  });

  if (error) {
    console.error("Vector search error:", error);
    return "Error searching documents.";
  }

  if (!data?.length) return "No relevant information found in Hao's background.";

  // Step 3: Format results for Claude
  return data
    .map(
      (d: {
        section: string;
        source: string;
        content: string;
        similarity: number;
      }) =>
        `[${d.source} / ${d.section}] (relevance: ${(d.similarity * 100).toFixed(0)}%)\n${d.content}`
    )
    .join("\n\n---\n\n");
}

function getContactInfo(): string {
  return JSON.stringify({
    email: "haoli.van@outlook.com",
    phone: "778-922-8089",
    linkedin: "https://linkedin.com/in/haoli-van",
    portfolio: "https://haoli.ai",
    location: "Coquitlam, BC, Canada",
    status:
      "Open to full-time opportunities in Data Analytics, BI Development, Analytics Engineering, and AI Engineering",
  });
}

// --- System Prompt ---
const SYSTEM_PROMPT = `You are an AI assistant on haoli.ai, representing Hao Li — a data professional based in Vancouver, BC.

Your job is to answer recruiter and hiring manager questions about Hao's background accurately and professionally.

Rules:
1. ALWAYS use the search_background tool before answering questions about Hao's skills, experience, or projects. Do not guess or fabricate information.
2. Be concise and factual. Use specific numbers (years of experience, project metrics) when available.
3. If the retrieved context doesn't contain the answer, say "I don't have specific information about that in Hao's profile" rather than making something up.
4. Keep a professional but friendly tone — you're representing Hao to potential employers.
5. If asked something unrelated to Hao's professional background, politely redirect: "I'm here to help with questions about Hao's professional background. What would you like to know?"
6. When appropriate, suggest the recruiter reach out directly using get_contact_info.`;

// --- Main API Handler ---
export async function POST(req: Request) {
  try {
    const clients = getClients();
    const { question, history = [] } = await req.json();

    if (!question || typeof question !== "string") {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const messages: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: question },
    ];

    // --- Agentic Loop ---
    // Claude may call tools multiple times before producing a final answer.
    let response = await clients.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Keep looping while Claude wants to use tools
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        let result = "";

        if (toolUse.name === "search_background") {
          const input = toolUse.input as { query: string };
          result = await vectorSearch(input.query, clients);
        } else if (toolUse.name === "get_contact_info") {
          result = getContactInfo();
        } else {
          result = `Unknown tool: ${toolUse.name}`;
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Add assistant's tool calls and tool results to conversation
      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });

      // Call Claude again with tool results
      response = await clients.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages,
      });
    }

    // Extract final text answer
    const answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Build clean conversation history (text only, no tool exchanges)
    // This keeps context manageable and prevents tool_use/tool_result noise
    const cleanHistory: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: question },
      { role: "assistant", content: answer },
    ].slice(-10); // Keep last 10 messages to control token costs

    return Response.json({ answer, history: cleanHistory });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
