import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";
import { getClientIp } from "./client-ip";

describe("createRateLimiter", () => {
  it("blocks the request after the limit within the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("ip", 0).ok).toBe(true);
    expect(limiter.check("ip", 5).ok).toBe(true);
    const third = limiter.check("ip", 10);
    expect(third.ok).toBe(false);
    expect(third.retryAfterMs).toBeGreaterThan(0);
  });

  it("allows requests again once the window has passed", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    limiter.check("ip", 0);
    limiter.check("ip", 5);
    expect(limiter.check("ip", 1001).ok).toBe(true);
  });

  it("counts each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0).ok).toBe(true);
    expect(limiter.check("b", 0).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 10.0.0.1" }))).toBe("1.1.1.1");
  });

  it("falls back to x-real-ip, then to 'unknown'", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "2.2.2.2" }))).toBe("2.2.2.2");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
