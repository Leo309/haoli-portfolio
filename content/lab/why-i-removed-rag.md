---
title: "Why I removed RAG from my own agent"
date: "2026-10"
summary: "My site's agent started as a RAG system. For a knowledge base this small, giving the model everything worked better."
---

AskHao is the agent on this site. You ask it about my work, and it answers from my profile. The first version was built the way most tutorials tell you to build this: retrieval-augmented generation, or RAG. The second version has no retrieval at all. Here's why.

## What v1 was

- My profile lived in Markdown files, split into chunks.
- Each chunk was embedded with OpenAI's `text-embedding-3-small` and stored in Supabase pgvector.
- A question went through the same embedding. A `match_documents` query found the closest chunks.
- Claude ran in a hand-written tool-use loop, with no framework. It decided when to call `search_background` and when to call `get_contact_info`.

It worked, and it was a good exercise. It was also more machinery than the problem needed.

## What went wrong

- **The database fell asleep.** Supabase pauses free projects after a week without traffic. A personal site doesn't get daily traffic, so the agent kept losing its memory. It could only tell visitors that search was failing.
- **Retrieval missed.** Short questions didn't land close enough to the right chunk, so I lowered the match threshold to 0.3 to get any hits at all. A looser threshold means noisier context.
- **The pipeline had its own bugs.** Chunk IDs used only the first 20 characters of a section heading, so two roles at the same employer collided and one quietly overwrote the other. Every fix meant re-running the ingest script.

## Why long context won

My whole profile, case studies included, is about 3,300 words. With the instructions and citation markup, the model reads roughly 13,000 tokens per question. That is tiny next to the million tokens Claude Haiku 5.5 can read, so v2 gives it everything on every question:

- **Nothing to miss.** The model sees every fact, not the five chunks a similarity score picked.
- **Prompt caching** keeps it cheap. The profile is the same on every request, so it's cached and re-read at a fraction of the normal input price.
- **Citations** show the source behind every answer, so you can see what each claim rests on.
- **Two services fewer.** No embeddings API, no vector database, no ingest step. Editing a Markdown file updates the agent.

## What it costs

I measured it:

- **First question in a while: about $0.002.** The ~13,000-token prefix gets written to the cache.
- **Every question after that: about $0.0002–0.0005.** The prefix is read from the cache at a tenth of the normal input price, so most of the cost is the answer itself.
- **A thousand questions** cost roughly $0.30 to $2, depending on how many arrive while the cache is still warm, with no database or embeddings bill on top.

## When RAG comes back

RAG is the right tool when:

- the corpus is bigger than the context window,
- it changes all the time,
- or different users may only see different documents.

If this site grows a large archive of write-ups, I'll add retrieval back for that part. Until then, the simplest thing that works is to hand the model the whole file.
