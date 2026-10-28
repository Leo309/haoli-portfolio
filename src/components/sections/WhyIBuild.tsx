import { whyIBuild } from "@/lib/site";
import SectionHeader from "./SectionHeader";

export default function WhyIBuild() {
  return (
    <section aria-labelledby="why-i-build">
      <SectionHeader id="why-i-build" title="Why I build" />
      <p className="text-xl leading-snug font-bold tracking-[-0.02em]">{whyIBuild.heading}</p>
      {whyIBuild.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-2">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
