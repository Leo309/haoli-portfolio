// Sliding-window rate limiter kept in memory.
// On Vercel each function instance has its own memory, so this is a cost guard
// against one visitor hammering the API, not a hard security boundary.

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now: number = Date.now()) {
      // Keep only the hits still inside the window
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        // The oldest hit leaving the window frees the next slot
        return { ok: false, retryAfterMs: windowMs - (now - recent[0]) };
      }

      recent.push(now);
      hits.set(key, recent);
      return { ok: true, retryAfterMs: 0 };
    },
  };
}
