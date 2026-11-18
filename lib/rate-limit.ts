/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Limitation: state lives in the memory of a single Node.js process. With several
 * instances / serverless workers each one keeps its own counters, so use a shared
 * store (e.g. Redis) before scaling horizontally.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    buckets.forEach((b, k) => {
      if (b.resetAt <= now) buckets.delete(k);
    });
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Clears a key, e.g. after a successful login. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
