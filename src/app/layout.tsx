import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hao Li — Analytics Engineer & Full Stack Developer",
  description:
    "Personal portfolio of Hao Li — building data-driven solutions and delightful digital experiences.",
  openGraph: {
    title: "Hao Li — Analytics Engineer & Full Stack Developer",
    description:
      "Personal portfolio of Hao Li — building data-driven solutions and delightful digital experiences.",
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
