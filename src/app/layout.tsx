import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = `${profile.name} — ${profile.headline.replace(/\.$/, "")}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://haoli.ai"),
  title,
  description: profile.subline,
  openGraph: {
    title,
    description: profile.subline,
    url: "https://haoli.ai",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
