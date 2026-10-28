# Products

Hao built all of these products through Skynex Digital.

## GeoGrade (paused)

Website: geograde.ai

**What it does**: GeoGrade audits AI search visibility for local, high-ticket service businesses such as MedSpas, cosmetic dentists, plastic surgeons and immigration attorneys. It tells owners whether AI assistants (ChatGPT, Perplexity, Google AI, Gemini) recommend their business, and what to fix when they don't.

**How it works**:

- **The agent**: a "coordinator" agent on Claude Managed Agents runs each audit end to end. The steps are:
  1. Fetch the business's website and parse its structured data.
  2. Run AI-search scans of the business.
  3. Identify its top competitor and scan that competitor.
  4. Compute a visibility score.
  5. Write a 1,500–2,200-word report and email it to the owner.
- **Tools**: Hao wrote an MCP server (FastMCP) that gives the agent 11 tools.
- **Founder operations**:
  - These run through a Telegram bot, with `/audit`, `/status`, `/approve` and `/reject` commands.
  - Paid reports go through a server-side approval gate that the agent cannot bypass. In testing it did try.
- **Abuse protection**: per-IP and global daily cost ceilings.

**Stack**: Python, FastAPI, FastMCP, Claude Managed Agents, Supabase Postgres, Cloudflare (Pages, R2), Resend, Telegram, Next.js 16.

**Status**: paused.

- The free audit tier was built and validated end to end.
- The paid tier was not finished before Hao paused the product.

## Real Return Analyzer (live)

Website: realreturns.skynexdigital.com · GitHub: github.com/Leo309/Real-Return-Analyzer

Real Return Analyzer is a financial education web app. It uses historical data from 7 major economies (1970–2024) to show how inflation erodes purchasing power, and what different investments really returned after inflation. It is available in English, Chinese and French.

**Stack**: Next.js, React, TypeScript, Chart.js, Zustand.

## CollabZen (paused)

Website: collabzen.ai

CollabZen is partner management software for SMBs and DTC brands. It covers:

- influencer and affiliate partner tracking
- project management
- deliverable performance monitoring
- automated email reminders

Hao built it from 0 to 1 and launched it in production. It is currently paused.

**Stack**: Next.js, TypeScript, Supabase, Stripe, Tailwind CSS.

## CrushWatch (live)

Website: crushwatch.app

CrushWatch is a Claude skill that tracks follower and following changes on Instagram. It sells for $29.99, paid once.

- **Privacy**: it runs locally in the user's own Claude Desktop, so no credentials are shared and no data leaves the user's machine.
- **Purchase and delivery**: Stripe Checkout triggers a Cloudflare Worker, which emails a signed download link through Resend.
