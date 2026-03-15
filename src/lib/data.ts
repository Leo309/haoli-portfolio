export const personalInfo = {
  name: "Hao Li",
  title: "Analytics Engineer & Full Stack Developer",
  tagline:
    "I build data-driven solutions that turn raw data into actionable business insights and delightful digital experiences.",
  email: "haoli.van@outlook.com",
  github: "https://github.com/Leo309",
  linkedin: "https://www.linkedin.com/in/haoli-van/",
};

export const aboutParagraphs = [
  "I'm an analytics engineer and full-stack developer with a passion for transforming complex data into clear, actionable insights. My background spans e-commerce growth analytics, data platform architecture, and modern web development — allowing me to bridge the gap between data teams and business stakeholders.",
  "In my recent work, I've built end-to-end analytics platforms using Microsoft Fabric, designed data models following medallion architecture patterns, and created interactive dashboards that drive real business decisions. I enjoy the full spectrum — from writing SQL transformations and building data pipelines to crafting polished user interfaces.",
  "Beyond my core work, I'm deeply interested in AI agent orchestration — exploring how to coordinate AI agents to improve project quality and operational efficiency. I believe every technology investment ultimately comes down to two outcomes: driving more revenue or reducing costs. This lens shapes how I evaluate and adopt new tools, ensuring they deliver real business value rather than just technical novelty.",
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
    techStack: ["Microsoft Fabric", "PySpark", "Power BI", "Delta Lake", "Python"],
    githubUrl: "https://github.com/Leo309/ecommerce-analytics",
  },
  {
    title: "SaaS Feature Adoption Analytics",
    description:
      "Product analytics pipeline analyzing an AI feature launch for a B2B SaaS platform (~2,000 users, ~200K events). Built adoption funnel, cohort retention (30/60/90d), and DAU/MAU engagement analysis using dbt on BigQuery, orchestrated with Airflow in Docker, and visualized in Looker Studio.",
    techStack: ["BigQuery", "dbt", "Apache Airflow", "Docker", "Looker Studio", "Python"],
    githubUrl: "https://github.com/Leo309/saas-product-analytics",
  },
  {
    title: "CollabZen — Partner Management SaaS",
    description:
      "A partner management SaaS tool designed for SMBs, supporting influencer and affiliate partner tracking, project management, deliverable performance monitoring, and automated email reminders. Deployed and running in production.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Tailwind CSS"],
    liveUrl: "https://collabzen.ai",
    githubUrl: "#",
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

export const sections = ["about", "projects", "contact"] as const;
export type SectionId = (typeof sections)[number];
