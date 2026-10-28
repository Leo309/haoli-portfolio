import { describe, expect, it } from "vitest";
import { formatInquiryEmail, validateInquiry } from "./inquiry";

const valid = {
  name: "Ada",
  email: "ada@acme.com",
  need: "Our weekly sales report takes a full day to build.",
  company: "Acme",
};

describe("validateInquiry", () => {
  it("accepts a complete inquiry and trims fields", () => {
    const result = validateInquiry({ ...valid, name: "  Ada  " });
    expect(result).toEqual({ ok: true, isSpam: false, data: { ...valid, name: "Ada" } });
  });

  it("reports every invalid field at once", () => {
    const result = validateInquiry({ name: "", email: "x", need: "short" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["email", "name", "need"]);
  });

  it("enforces length limits", () => {
    const tooLong = validateInquiry({ ...valid, name: "a".repeat(101), need: "a".repeat(2001), company: "a".repeat(201) });
    expect(tooLong.ok).toBe(false);
    if (!tooLong.ok) expect(Object.keys(tooLong.errors).sort()).toEqual(["company", "name", "need"]);
  });

  it("treats company as optional", () => {
    expect(validateInquiry({ ...valid, company: undefined }).ok).toBe(true);
  });

  it("rejects input that isn't an object", () => {
    expect(validateInquiry("nope").ok).toBe(false);
    expect(validateInquiry(null).ok).toBe(false);
  });

  it("flags a filled honeypot as spam without rejecting it", () => {
    const result = validateInquiry({ ...valid, nickname: "bot" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.isSpam).toBe(true);
  });
});

describe("formatInquiryEmail", () => {
  it("names the sender and company in the subject", () => {
    expect(formatInquiryEmail(valid).subject).toBe("haoli.ai inquiry from Ada (Acme)");
  });

  it("omits the company when there is none", () => {
    expect(formatInquiryEmail({ name: "Ada", email: "ada@acme.com", need: valid.need }).subject).toBe("haoli.ai inquiry from Ada");
  });

  it("includes the visitor's message and email in the body", () => {
    const { text } = formatInquiryEmail(valid);
    expect(text).toContain(valid.need);
    expect(text).toContain("ada@acme.com");
  });
});
