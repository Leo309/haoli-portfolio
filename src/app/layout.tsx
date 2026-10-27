import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hao Li — AI Automation & Data",
  description:
    "Hao Li builds AI agents and automations that turn messy business data into results. Data & research by day, founder of Skynex Digital.",
  openGraph: {
    title: "Hao Li — AI Automation & Data",
    description:
      "Hao Li builds AI agents and automations that turn messy business data into results. Data & research by day, founder of Skynex Digital.",
    url: "https://haoli.ai",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
