import Link from "next/link";
import type { EventName } from "@/lib/analytics";
import TrackedLink from "@/components/TrackedLink";

interface SectionHeaderProps {
  title: string;
  id: string;
  count?: number;
  link?: { href: string; label: string; external?: boolean; event?: EventName };
}

// Small uppercase label + two-digit count + thin rule + optional link, shared by every section
export default function SectionHeader({ title, id, count, link }: SectionHeaderProps) {
  // Negative margin + padding grows the tap area to ~43px without moving the layout
  const linkClass = "-my-3 shrink-0 py-3 text-[12.5px] text-muted transition-colors hover:text-accent";

  return (
    <div className="mb-4 flex items-center gap-2.5">
      <h2 id={id} className="text-xs font-semibold tracking-[0.06em] text-ink-2 uppercase">
        {title}
      </h2>
      {count !== undefined && (
        <span className="font-mono text-[11px] text-muted">{String(count).padStart(2, "0")}</span>
      )}
      <span aria-hidden className="h-px flex-1 bg-line" />
      {link &&
        (link.event ? (
          <TrackedLink href={link.href} event={link.event} className={linkClass}>
            {link.label}
          </TrackedLink>
        ) : link.external ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {link.label}
          </a>
        ) : (
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
    </div>
  );
}
