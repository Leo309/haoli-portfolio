"use client";

import { useEffect, useState } from "react";
import { validateInquiry, type InquiryField } from "@/lib/inquiry";
import { trackEvent } from "@/lib/analytics";
import { links } from "@/lib/site";
import { usePanel } from "./PanelProvider";

type Status = "idle" | "sending" | "sent" | "unavailable" | "error";

const FIELDS: { name: InquiryField; label: string; type: "text" | "email" | "textarea"; optional?: boolean; autoComplete?: string }[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "need", label: "What do you want to save time or money on?", type: "textarea" },
  { name: "company", label: "Company / website", type: "text", optional: true, autoComplete: "organization" },
];

// Puts keyboard and screen-reader users right on the field that needs fixing
function focusFirstError(form: HTMLFormElement, errors: Partial<Record<InquiryField, string>>) {
  const first = FIELDS.find((field) => errors[field.name]);
  if (first) (form.elements.namedItem(first.name) as HTMLElement | null)?.focus();
}

const INPUT = "mt-1.5 w-full rounded-[10px] border bg-card px-3 py-2.5 text-[14px] text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-soft)]";

export default function InquiryForm() {
  const { open, closePanel } = usePanel();
  const [errors, setErrors] = useState<Partial<Record<InquiryField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fallbackEmail, setFallbackEmail] = useState(links.email);

  // Reopening the panel after a successful send starts a fresh form
  useEffect(() => {
    if (open === "inquiry" && status === "sent") setStatus("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return; // a double click must not send twice

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    // Same rules as the server, so mistakes show instantly
    const check = validateInquiry(values);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirstError(form, check.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        trackEvent("inquiry_submit");
        form.reset();
        setStatus("sent");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        focusFirstError(form, data.errors);
      } else if (res.status === 503) {
        setFallbackEmail(data.fallbackEmail ?? links.email);
        setStatus("unavailable");
      } else {
        setMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      // Offline or the request never landed: still give a way to reach Hao
      setStatus("unavailable");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-6">
        <p className="text-lg font-bold">Thanks, I&apos;ll be in touch soon.</p>
        <button type="button" onClick={closePanel} className="mt-5 min-h-10 rounded-[10px] border border-line-2 bg-card px-4 text-[13.5px] font-semibold">
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="mb-5 text-[14px] leading-relaxed text-ink-2">
        Tell me what&apos;s eating your team&apos;s time or budget. I&apos;ll read every message myself.
      </p>

      {FIELDS.map((field) => {
        const error = errors[field.name];
        const errorId = `inquiry-${field.name}-error`;
        const common = {
          id: `inquiry-${field.name}`,
          name: field.name,
          autoComplete: field.autoComplete,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          className: `${INPUT} ${error ? "border-danger" : "border-line-2"}`,
        };
        return (
          <div key={field.name} className="mb-4">
            <label htmlFor={common.id} className="text-[13px] font-semibold">
              {field.label}
              {field.optional && <span className="font-normal text-muted"> (optional)</span>}
            </label>
            {field.type === "textarea" ? <textarea {...common} rows={5} /> : <input {...common} type={field.type} />}
            {error && (
              <p id={errorId} className="mt-1 text-[12.5px] text-danger">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot: hidden from people and screen readers; bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="inquiry-nickname">Nickname</label>
        <input id="inquiry-nickname" name="nickname" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Every failure, whatever the cause, ends with a way to reach Hao directly */}
      {(status === "unavailable" || status === "error") && (
        <p role="alert" className="mb-4 rounded-[10px] border border-line bg-card p-3 text-[13.5px] text-ink-2">
          {status === "error" ? message : "The form couldn't send right now."} Please email me at{" "}
          <a href={`mailto:${fallbackEmail}`} className="font-semibold text-accent underline underline-offset-2">
            {fallbackEmail}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-ink disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
