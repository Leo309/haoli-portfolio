# AI agent lab

These are Hao's experiments with AI, newest first. Dates are year and month.

## AskHao: an agent that answers questions about Hao (v1 2026-03, v2 2026-10)

AskHao is the agent on haoli.ai.

**v1 (RAG)**:

- Questions were embedded with OpenAI `text-embedding-3-small` and matched against Hao's profile in Supabase pgvector.
- A hand-written Claude tool-use loop decided when to search. No LangChain was involved.

**v2 (long context)**:

- The whole profile is about 4,000 tokens, small enough to give the model in full. Hao removed the retrieval layer.
- AskHao now runs on Claude Haiku 5.5 with the full profile as documents, prompt caching and citations.
- Every answer shows its sources.
- The change removed two services (OpenAI embeddings and the vector database) and ended the retrieval misses.

**When RAG would come back**: if the knowledge base outgrows the context window, changes constantly, or needs per-user access control.

## Claude Prompt Films (2026-09)

GitHub: github.com/Leo309/claude-prompt-films

One prompt becomes a finished 90-second film:

- Claude Code researches and sources the facts, designs the film and writes the animation in HTML Canvas.
- It synthesizes the soundtrack with the Web Audio API.
- It then reviews its own contact sheets until the frames are clean.
- No video models, stock footage or samples are used.

The series has five episodes so far, including LeBron James, Cristiano Ronaldo, Lionel Messi and Shohei Ohtani. Each one renders in 16:9 and 9:16 from the same code.

## TikTok → ad video pipeline (2026-03)

An n8n workflow that captures trending TikTok content through the TikTok API, turns it into storyboards and generates ad videos. It was built for DTC brand clients.

## Why I removed RAG from my own agent (2026-10)

This is a write-up of the AskHao v1 → v2 decision: when long context beats retrieval, what changed, and what it cost.
