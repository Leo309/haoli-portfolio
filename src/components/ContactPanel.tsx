"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { links } from "@/lib/site";

// hi@haoli.ai is forwarded by Cloudflare Email Routing to Hao's inbox, so the site
// needs no email service of its own. Copy covers visitors whose mailto links do nothing.
export default function ContactPanel() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      trackEvent("contact_email_copy");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; the address stays visible and selectable either way
    }
  }

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-ink-2">
        Tell me what&apos;s eating your team&apos;s time or budget, and a line about your business. I read and reply
        to every message myself.
      </p>

      <p className="mt-6 text-[12px] font-semibold tracking-[0.06em] text-muted uppercase">Email</p>
      <p className="mt-1 text-[26px] font-extrabold tracking-[-0.02em] select-all">{links.email}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex min-h-11 items-center rounded-[10px] bg-accent px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-ink"
        >
          {copied ? "Copied ✓" : "Copy email"}
        </button>
        <a
          href={`mailto:${links.email}?subject=${encodeURIComponent("Hello from haoli.ai")}`}
          onClick={() => trackEvent("contact_email_open")}
          className="inline-flex min-h-11 items-center rounded-[10px] border border-line-2 bg-card px-4 text-[13.5px] font-semibold transition-colors hover:border-ink-2"
        >
          Open in your email app
        </a>
      </div>
      {/* Announce the copy result to screen readers too */}
      <p role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </p>

      <p className="mt-8 text-[13px] text-muted">
        Prefer LinkedIn?{" "}
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-2">
          Message me there
        </a>
        .
      </p>
    </div>
  );
}
