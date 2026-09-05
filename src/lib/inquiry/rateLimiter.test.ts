import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter } from "./rateLimiter.js";

describe("InMemoryRateLimiter", () => {
  it("allows requests under the limit", () => {
    const limiter = new InMemoryRateLimiter(3, 60_000);
    expect(limiter.check("ip-1").allowed).toBe(true);
    expect(limiter.check("ip-1").allowed).toBe(true);
    expect(limiter.check("ip-1").allowed).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const limiter = new InMemoryRateLimiter(2, 60_000);
    limiter.check("ip-2");
    limiter.check("ip-2");
    const result = limiter.check("ip-2");
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const limiter = new InMemoryRateLimiter(1, 60_000);
    limiter.check("ip-a");
    const other = limiter.check("ip-b");
    expect(other.allowed).toBe(true);
  });
});
