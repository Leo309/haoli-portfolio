import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import TopBar from "@/components/TopBar";
import { getCase, getCases, getNextCase } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

// Every case page is generated at build time; unknown slugs 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Hao Li`,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary, url: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();
  const next = getNextCase(slug);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[680px] px-4 pb-20 sm:px-6">
        <Link href="/" className="-my-2 inline-block py-2 text-[13px] text-muted hover:text-accent">
          ← Back to home
        </Link>
        <p className="mt-8 text-[13px] text-muted">{study.client}</p>
        <p className="mt-3 text-[44px] leading-none font-extrabold tracking-[-0.035em] tabular-nums">{study.metric}</p>
        <p className="mt-2 text-[14px] text-muted">{study.metricLabel}</p>
        <h1 className="mt-6 text-[28px] leading-tight font-bold tracking-[-0.025em]">{study.title}</h1>

        <div className="mt-6">
          <ArticleBody markdown={study.body} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <button
            type="button"
            data-panel="inquiry"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-[10px] bg-accent px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-ink"
          >
            Work with me <span aria-hidden>→</span>
          </button>
          {next.slug !== study.slug && (
            <Link href={`/work/${next.slug}`} className="-my-2 py-2 text-[13.5px] font-medium text-ink-2 hover:text-accent">
              Next case → <span className="text-muted">{next.title}</span>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
