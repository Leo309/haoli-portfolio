# haoli.ai

Personal site of Hao Li: **I put AI to work.** I build AI tools and automations that save businesses time and money.

The site shows client results, products and AI experiments. It has two calls to action: a "Work with me" inquiry form for clients and a resume link for recruiters. It also hosts **AskHao**, an agent that answers questions about Hao's work and cites its sources.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Geist / Geist Mono, Framer Motion
- **AI:** Claude Haiku 5.5 via `@anthropic-ai/sdk` (long context, prompt caching, citations, tool use)
- **Email:** Resend, which delivers the inquiry form
- **Content:** Markdown with front matter (`gray-matter`, `react-markdown`)
- **Tests:** Vitest + Testing Library
- **Hosting:** Vercel, with Web Analytics

## Structure

```
data/                     AskHao knowledge base, one Markdown file per topic
content/work/*.md         Case studies, rendered at /work/[slug] and also read by AskHao
content/lab/*.md          Lab write-ups, rendered at /lab/[slug] and also read by AskHao
src/lib/site.ts           Typed home-page data: profile, products, lab, experience
src/lib/content.ts        Loads and validates case and lab Markdown
src/lib/knowledge.ts      Turns data + content into cited, cached document blocks
src/app/page.tsx          Home: sticky identity column + sections
src/app/api/ask           AskHao endpoint
src/app/api/inquiry       "Work with me" form endpoint
src/components/           UI, including the shared <dialog> panel for AskHao and the form
```

Pages and AskHao read the same Markdown, so there is one source of truth. `npm test` includes a content guard that fails if shipped content contains unfinished markers, phone numbers, pure black, or a client name. The client-name list lives in a gitignored local file, so the guard never publishes the names it protects.

## AskHao

Every question sends Claude the whole knowledge base as `document` blocks with citations enabled. A single `cache_control` breakpoint sits after the last document, so the ~13K-token prefix (instructions + documents) is read from the prompt cache after the first request. Each answer comes back with the documents it cites, and the UI shows them as source chips. A hand-written agentic loop keeps one tool, `get_contact_info`, which returns public contact channels only.

Guards:

- 500-character questions
- the client-sent history is sanitized to 10 alternating text turns
- 20 questions per IP per hour (in-memory, a cost guard)

Measured cost: about $0.0002–0.0005 per cached question, and about $0.002 when the cache is cold.

## Architecture evolution

**v1 (RAG).**

1. Profile chunks were embedded with OpenAI `text-embedding-3-small` and stored in Supabase pgvector.
2. Each question was embedded the same way and matched with a `match_documents` RPC (similarity threshold lowered to 0.3).
3. A hand-written Claude tool-use loop, with no LangChain, decided when to call `search_background`.

**Why it changed.**

- The free Supabase project paused after a week without traffic, which took the agent down.
- Short questions missed the right chunks.
- The ingest script had to be re-run after every edit and had its own ID-collision bug.

**v2 (long context).** The whole knowledge base is ~3,300 words, tiny next to Haiku 5.5's 1M-token context. Giving the model everything removed two services (embeddings and the vector DB) and the ingest step, and ended retrieval misses. Prompt caching keeps it cheap, and citations make every answer checkable.

**When RAG would come back.** When the corpus outgrows the context window, changes constantly, or needs per-user access control.

The full write-up is at [/lab/why-i-removed-rag](https://haoli.ai/lab/why-i-removed-rag).

## Environment variables

| Name | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AskHao |
| `RESEND_API_KEY` | Sends inquiry emails |
| `INQUIRY_FROM_EMAIL` | Sender on a Resend-verified domain, e.g. `haoli.ai <inquiries@skynexdigital.com>` |
| `INQUIRY_TO_EMAIL` | Inbox for inquiries (defaults to `hello@skynexdigital.com`) |

Without the Resend variables, the form shows the email address instead of failing silently.

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run typecheck
npm run lint
npm run build
```
