import type { Metadata } from "next";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
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
      </body>
    </html>
  );
}
