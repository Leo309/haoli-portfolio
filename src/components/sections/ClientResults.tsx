import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { ArrowCircle } from "@/components/Icons";
import SectionHeader from "./SectionHeader";

// Three cards fill a row on desktop; any other count (2 or 4) uses two columns so no row has a hole
function gridColumns(count: number) {
  return count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
}

export default function ClientResults({ cases }: { cases: CaseStudy[] }) {
  return (
    <section aria-labelledby="client-results">
      <SectionHeader id="client-results" title="Client results" count={cases.length} />
      <div className={`grid gap-3 sm:grid-cols-2 ${gridColumns(cases.length)}`}>
        {cases.map((c, i) => {
          // With an odd count, the last card spans the 2-column tablet grid instead of sitting alone
          const isLoneLast = cases.length % 2 === 1 && i === cases.length - 1;
          return (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className={`group flex flex-col rounded-2xl border border-line bg-card p-[18px] pb-4 transition duration-200 hover:-translate-y-[3px] hover:border-[#cfe3d8] hover:shadow-[0_12px_28px_-12px_rgb(38_37_31/0.18)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${isLoneLast ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span className="text-xs text-muted">{c.client}</span>
              <span className="mt-3.5 text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em] tabular-nums">
                {c.metric}
              </span>
              <span className="mt-1 text-[12.5px] text-muted">{c.metricLabel}</span>
              <span className="mt-2 text-[13px] leading-[1.45] text-ink-2">{c.summary}</span>
              <span className="mt-auto flex justify-end pt-4">
                <ArrowCircle />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
