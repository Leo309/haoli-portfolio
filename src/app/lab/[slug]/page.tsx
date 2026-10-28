import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import TopBar from "@/components/TopBar";
import { getLabPost, getLabPosts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLabPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getLabPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Hao Li`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, url: `/lab/${slug}`, type: "article" },
  };
}

export default async function LabPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getLabPost(slug);
  if (!post) notFound();

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[680px] px-4 pb-20 sm:px-6">
        <Link href="/" className="-my-2 inline-block py-2 text-[13px] text-muted hover:text-accent">
          ← Back to home
        </Link>
        <p className="mt-8 font-mono text-[12px] text-muted">AI agent lab · {post.date}</p>
        <h1 className="mt-3 text-[32px] leading-tight font-bold tracking-[-0.03em]">{post.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{post.summary}</p>
        <div className="mt-8">
          <ArticleBody markdown={post.body} />
        </div>
      </main>
    </>
  );
}
