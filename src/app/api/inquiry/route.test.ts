import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Resend is the network edge; everything else in the route runs for real
const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { POST } = await import("./route");

const valid = { name: "Ada", email: "ada@acme.com", need: "Our weekly sales report takes a full day to build." };
let ipCounter = 0;

// Each test gets its own IP so the module-level rate limiter doesn't leak between tests
function request(body: unknown, ip = `10.0.0.${++ipCounter}`) {
  return new Request("http://localhost/api/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("INQUIRY_FROM_EMAIL", "haoli.ai <inquiries@skynexdigital.com>");
  vi.stubEnv("INQUIRY_TO_EMAIL", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/inquiry", () => {
  it("sends the inquiry to the inbox with the visitor as reply-to", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "hello@skynexdigital.com",
      replyTo: "ada@acme.com",
      from: "haoli.ai <inquiries@skynexdigital.com>",
    });
  });

  it("returns field errors for an invalid inquiry", async () => {
    const res = await POST(request({ name: "", email: "x", need: "" }));
    expect(res.status).toBe(400);
    expect(Object.keys((await res.json()).errors)).toContain("email");
    expect(send).not.toHaveBeenCalled();
  });

  it("offers the email address when Resend isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect((await res.json()).fallbackEmail).toBe("hello@skynexdigital.com");
  });

  it("offers the email address when sending fails", async () => {
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect((await res.json()).fallbackEmail).toBe("hello@skynexdigital.com");
  });

  it("offers the email address when the Resend client throws", async () => {
    send.mockRejectedValue(new Error("network down"));
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect((await res.json()).fallbackEmail).toBe("hello@skynexdigital.com");
  });

  it("silently accepts honeypot spam without sending", async () => {
    const res = await POST(request({ ...valid, nickname: "bot" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate-limits the sixth request from one IP within an hour", async () => {
    for (let i = 0; i < 5; i++) expect((await POST(request(valid, "9.9.9.9"))).status).toBe(200);
    expect((await POST(request(valid, "9.9.9.9"))).status).toBe(429);
  });

  it("rejects a body that isn't JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/inquiry", { method: "POST", headers: { "x-forwarded-for": "8.8.8.8" }, body: "not json" })
    );
    expect(res.status).toBe(400);
  });
});
