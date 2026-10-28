import { experience, links } from "@/lib/site";
import SectionHeader from "./SectionHeader";

export default function Experience() {
  return (
    <section aria-labelledby="experience">
      <SectionHeader
        id="experience"
        title="Experience"
        link={{ href: links.resume, label: "Full resume ↗", external: true, event: "resume_click" }}
      />
      <ul>
        {experience.map((e) => (
          <li key={e.org} className="grid grid-cols-[88px_1fr] gap-3.5 py-2.5 sm:grid-cols-[96px_1fr]">
            <span className="pt-0.5 font-mono text-[11.5px] text-muted">{e.years}</span>
            <span>
              <span className="block font-semibold">{e.role}</span>
              <span className="block text-[13px] text-ink-2">{e.org}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
