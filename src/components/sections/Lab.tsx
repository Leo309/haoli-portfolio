import Link from "next/link";
import { lab, type LabEntry } from "@/lib/site";
import { OpenPanelButton } from "@/components/PanelProvider";
import StatusLabel from "@/components/StatusLabel";
import SectionHeader from "./SectionHeader";

const ROW = "grid grid-cols-[64px_1fr_auto] items-baseline gap-3 border-b border-line px-0.5 py-3 sm:grid-cols-[76px_1fr_auto] sm:gap-3.5";
const INTERACTIVE = "w-full text-left transition-colors hover:bg-card/60";

function RowContent({ entry }: { entry: LabEntry }) {
  return (
    <>
      <span className="font-mono text-[11.5px] text-muted">{entry.date}</span>
      <span>
        <span className="font-medium">{entry.title}</span>{" "}
        <span className="text-ink-2">— {entry.description}</span>
      </span>
      <StatusLabel status={entry.status} />
    </>
  );
}

// A changelog: newest first, so the page visibly keeps moving
export default function Lab() {
  return (
    <section aria-labelledby="lab">
      <SectionHeader id="lab" title="AI agent lab" />
      <div className="border-t border-line">
        {lab.map((entry) => {
          if (entry.opensAsk) {
            return (
              <OpenPanelButton key={entry.title} panel="ask" className={`${ROW} ${INTERACTIVE}`}>
                <RowContent entry={entry} />
              </OpenPanelButton>
            );
          }
          if (entry.href?.startsWith("/")) {
            return (
              <Link key={entry.title} href={entry.href} className={`${ROW} ${INTERACTIVE}`}>
                <RowContent entry={entry} />
              </Link>
            );
          }
          if (entry.href) {
            return (
              <a key={entry.title} href={entry.href} target="_blank" rel="noopener noreferrer" className={`${ROW} ${INTERACTIVE}`}>
                <RowContent entry={entry} />
              </a>
            );
          }
          return (
            <div key={entry.title} className={ROW}>
              <RowContent entry={entry} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
