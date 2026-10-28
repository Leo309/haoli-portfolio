// Validation and email formatting for the "Work with me" form.
// Runs on the server; the form shows the same messages next to each field.

export interface Inquiry {
  name: string;
  email: string;
  need: string;
  company?: string;
}

export type InquiryField = "name" | "email" | "need" | "company";

export type InquiryValidation =
  | { ok: true; data: Inquiry; isSpam: boolean }
  | { ok: false; errors: Partial<Record<InquiryField, string>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateInquiry(input: unknown): InquiryValidation {
  const body = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const name = text(body.name);
  const email = text(body.email);
  const need = text(body.need);
  const company = text(body.company);
  const errors: Partial<Record<InquiryField, string>> = {};

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > 100) errors.name = "Please keep your name under 100 characters.";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) errors.email = "Please enter a valid email address.";

  if (need.length < 10) errors.need = "Please add a sentence or two about what you need.";
  else if (need.length > 2000) errors.need = "Please keep this under 2,000 characters.";

  if (company.length > 200) errors.company = "Please keep this under 200 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: { name, email, need, ...(company ? { company } : {}) },
    // Bots fill every field, including the hidden "nickname" one people never see
    isSpam: text(body.nickname) !== "",
  };
}

export function formatInquiryEmail(inquiry: Inquiry): { subject: string; text: string } {
  const from = inquiry.company ? `${inquiry.name} (${inquiry.company})` : inquiry.name;
  return {
    subject: `haoli.ai inquiry from ${from}`,
    text: [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      inquiry.company ? `Company / website: ${inquiry.company}` : null,
      "",
      "What they want to save time or money on:",
      inquiry.need,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  };
}
