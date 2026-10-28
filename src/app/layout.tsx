import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import AskPanel from "@/components/AskPanel";
import InquiryForm from "@/components/InquiryForm";
import Panel from "@/components/Panel";
import { PanelProvider } from "@/components/PanelProvider";
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
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* Without JS the entrance animation never runs, so show the content as-is */}
        <noscript dangerouslySetInnerHTML={{ __html: "<style>[data-reveal]{opacity:1!important;transform:none!important}</style>" }} />
      </head>
      <body className="font-sans antialiased">
        <PanelProvider>
          {children}
          {/* Available on every page: each "Work with me" button opens it */}
          <Panel id="ask" title="Ask my AI">
            <AskPanel />
          </Panel>
          <Panel id="inquiry" title="Work with me">
            <InquiryForm />
          </Panel>
        </PanelProvider>
        <Analytics />
      </body>
    </html>
  );
}
