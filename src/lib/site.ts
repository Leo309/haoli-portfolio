// Typed site data for the home page. Long-form content (case studies, lab posts,
// AskHao's knowledge base) lives in Markdown under content/ and data/.

export type Status = "live" | "paused" | "experiment";

// Status is always shown as text next to its colored dot, never by color alone
export const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  paused: "Paused",
  experiment: "Experiment",
};

export interface Product {
  name: string;
  status: Status;
  description: string;
  url: string;
  displayUrl: string;
  tile: { letter: string; bg: string; fg: string };
}

export interface LabEntry {
  date: string; // YYYY-MM
  title: string;
  description: string;
  status: Status;
  href?: string;
  opensAsk?: boolean;
}

export interface ExperienceEntry {
  years: string;
  role: string;
  org: string;
}

// Month AskHao v2 and its write-up go live; update if the launch slips
export const LAUNCH_MONTH = "2026-10";

export const profile = {
  name: "Hao Li",
  location: "Vancouver, BC",
  headline: "I put AI to work.",
  subline: "I build AI tools and automations that save businesses time and money.",
  availability: "Open to projects & AI roles",
};

const LINKEDIN_URL = "https://www.linkedin.com/in/haoli-van/";

export const links = {
  linkedin: LINKEDIN_URL,
  github: "https://github.com/Leo309",
  email: "hello@skynexdigital.com",
  skynex: "https://www.skynexdigital.com",
  // No resume PDF yet, so LinkedIn stands in; switch to "/resume.pdf" once it exists
  resume: LINKEDIN_URL,
};

export const products: Product[] = [
  {
    name: "GeoGrade",
    status: "paused",
    description: "Does ChatGPT recommend your clinic? AI search visibility audits for local businesses.",
    url: "https://geograde.ai",
    displayUrl: "geograde.ai",
    tile: { letter: "G", bg: "#eef7d0", fg: "#5c7a12" },
  },
  {
    name: "CrushWatch",
    status: "live",
    description: "A Claude skill that tracks Instagram follower changes, privately on your own machine.",
    url: "https://crushwatch.app",
    displayUrl: "crushwatch.app",
    tile: { letter: "C", bg: "#f6e7ea", fg: "#9a3b52" },
  },
  {
    name: "Real Return Analyzer",
    status: "live",
    description: "What your money really earned after inflation, across 7 economies.",
    url: "https://realreturns.skynexdigital.com",
    displayUrl: "realreturns.skynexdigital.com",
    tile: { letter: "R", bg: "#e6eef8", fg: "#2f5f9e" },
  },
  {
    name: "CollabZen",
    status: "paused",
    description: "Partner CRM for DTC brands. Built 0 → 1 and launched.",
    url: "https://collabzen.ai",
    displayUrl: "collabzen.ai",
    tile: { letter: "C", bg: "#f3ece4", fg: "#8a5a2b" },
  },
];

// Newest first
export const lab: LabEntry[] = [
  {
    date: LAUNCH_MONTH,
    title: "Why I removed RAG from my own agent",
    description: "When long context beats retrieval",
    status: "live",
    href: "/lab/why-i-removed-rag",
  },
  {
    date: LAUNCH_MONTH,
    title: "AskHao",
    description: "An agent that answers questions about me, with sources",
    status: "live",
    opensAsk: true,
  },
  {
    date: "2026-09",
    title: "Claude Prompt Films",
    description: "One prompt becomes a 90-second film",
    status: "live",
    href: "https://github.com/Leo309/claude-prompt-films",
  },
  {
    date: "2026-03",
    title: "TikTok → ad video pipeline",
    description: "Trends to storyboard to ad, on n8n",
    status: "experiment",
  },
];

export const experience: ExperienceEntry[] = [
  {
    years: "2026 — now",
    role: "Data Analysis & Research Officer",
    org: "Vancity Community Foundation · Reaching Home",
  },
  { years: "2025 — now", role: "Founder", org: "Skynex Digital" },
  { years: "2024", role: "SQL / Data Visualization Developer", org: "University of Victoria" },
];

export const whyIBuild = {
  heading: "A few hours of work. Thousands saved every year.",
  paragraphs: [
    "A team down the hall mentioned it was time to renew their software subscription again: several thousand dollars a year, for a tool that did a simple data transformation. No one on the team had the skills to replace it. I spent a few hours writing a small Python tool, packaged so they could run it themselves, and they cancelled the subscription.",
    "That's when it clicked. Most businesses don't need more software. They need someone who can build the small thing that fits. AI makes that faster and cheaper than ever. So that's what I do.",
  ],
};
