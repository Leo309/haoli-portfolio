export const personalInfo = {
  name: "Hao Li",
  title: "AI Automation & Data",
  tagline:
    "I build AI agents and automations that turn messy business data into results.",
  email: "haoli.van@outlook.com",
  github: "https://github.com/Leo309",
  linkedin: "https://www.linkedin.com/in/haoli-van/",
  portfolio: "https://haoli.ai",
  location: "Coquitlam, BC, Canada",
  status:
    "Data Analysis & Research Officer at Vancity Community Foundation (Reaching Home) · Founder of Skynex Digital · Open to AI automation and AI enablement roles, consulting projects, and collaborations",
};

export const aboutParagraphs = [
  "By day, I'm a Data Analysis & Research Officer at Vancity Community Foundation, working on Reaching Home — Canada's community-based homelessness strategy. On the side, I run Skynex Digital, my one-person company, where I build and ship products like GeoGrade, which checks whether ChatGPT recommends your business.",
  "My foundation is analytics engineering. I've rebuilt reporting platforms on Microsoft Fabric and Power BI used by around 200 staff, and built end-to-end pipelines with PySpark, dbt, and BigQuery. That background is what makes the AI work practical: an agent is only as useful as the data it can reach.",
  "I care about AI that pays for itself. Every technology investment comes down to two outcomes, more revenue or lower costs, and that lens shapes what I build — from AI agents like AskHao to automations for small businesses.",
];

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: "E-Commerce Growth Analytics Platform",
    description:
      "End-to-end analytics pipeline on Microsoft Fabric for a multi-channel DTC brand (Shopify, Amazon, TikTok Shop — 10K+ orders). Features Medallion architecture (Bronze → Silver → Gold) with PySpark ETL, star schema data modeling, automated pipeline orchestration, and a 3-page Power BI executive dashboard.",
    techStack: ["Microsoft Fabric", "PySpark", "SQL", "Power BI", "Delta Lake", "Python"],
    githubUrl: "https://github.com/Leo309/ecommerce-analytics",
  },
  {
    title: "SaaS Feature Adoption Analytics",
    description:
      "Product analytics pipeline analyzing an AI feature launch for a B2B SaaS platform (~2,000 users, ~200K events). Built adoption funnel, cohort retention (30/60/90d), and DAU/MAU engagement analysis using dbt on BigQuery, orchestrated with Airflow in Docker, and visualized in Looker Studio.",
    techStack: ["BigQuery", "dbt", "SQL", "Apache Airflow", "Docker", "Looker Studio", "Python"],
    githubUrl: "https://github.com/Leo309/saas-product-analytics",
  },
  {
    title: "CollabZen — Partner Management SaaS",
    description:
      "A partner management SaaS tool designed for SMBs, supporting influencer and affiliate partner tracking, project management, deliverable performance monitoring, and automated email reminders. Built from 0 to 1 and launched in production; currently paused.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Tailwind CSS"],
    liveUrl: "https://collabzen.ai",
    githubUrl: "#",
  },
  {
    title: "haoli.ai — AI Resume Agent",
    description:
      "A RAG-powered AI agent built for this portfolio that lets recruiters query my professional background via natural language. Uses Claude's native tool use API for autonomous tool selection, OpenAI embeddings with Supabase pgvector for semantic search, and a custom agentic loop — no LangChain.",
    techStack: ["Next.js", "TypeScript", "Claude API", "OpenAI Embeddings", "Supabase pgvector", "Vercel"],
    githubUrl: "https://github.com/Leo309/haoli-portfolio",
  },
  {
    title: "Real Return Analyzer",
    description:
      "A financial education web app that uses historical data from 7 major economies (1970-2024) to help users understand how inflation erodes purchasing power and the real returns of different investments. Supports English, Chinese, and French.",
    techStack: ["Next.js", "React", "TypeScript", "Chart.js", "Zustand"],
    liveUrl: "https://realreturns.skynexdigital.com",
    githubUrl: "#",
  },
];

// "ask" is left out while the AskAgent section is hidden (see page.tsx)
export const sections = ["about", "projects", "contact"] as const;
export type SectionId = (typeof sections)[number];
