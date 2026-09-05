export interface RateLimiter {
  check(key: string): { allowed: boolean; retryAfterSeconds?: number };
}

/**
 * Best-effort, single-instance rate limiter. Vercel serverless functions are
 * stateless and multi-region, so this counter resets on every cold start and
 * is never shared across concurrent instances — it is NOT a durable defense
 * and must not be relied on alone in production.
 *
 * Durable production rate limiting for this endpoint should come from a
 * platform/external capability instead, e.g. a Vercel Firewall rate-limit
 * rule scoped to `/api/inquiry` (Vercel Pro+, configured in the dashboard,
 * no code required) or a shared store such as Upstash Redis. See PHASE_5.md.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}

  check(key: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

    if (recent.length >= this.maxRequests) {
      const retryAfterSeconds = Math.ceil((recent[0] + this.windowMs - now) / 1000);
      this.hits.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
    }

    recent.push(now);
    this.hits.set(key, recent);
    return { allowed: true };
  }
}
