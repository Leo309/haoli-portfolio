"use client";

import { trackEvent, type EventName } from "@/lib/analytics";

// An external link that records a click event before the browser follows it
export default function TrackedLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: EventName;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}
