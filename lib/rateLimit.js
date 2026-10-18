// Small in-memory sliding-window rate limiter for the public API routes.
// Serverless instances are ephemeral and not shared, so this is a per-instance
// deterrent; pair it with a Vercel Firewall rate-limit rule for a hard cap.
// Expired keys are pruned on the fly instead of wiping the whole table, so a
// flood of unique keys can never reset everyone else's limits.

export function createRateLimiter({ windowMs, max, maxKeys = 10000 }) {
  const hits = new Map();

  const prune = (now) => {
    for (const [key, stamps] of hits) {
      if (!stamps.length || now - stamps[stamps.length - 1] >= windowMs) hits.delete(key);
    }
  };

  // Returns true when `key` has used up its allowance for the current window.
  return function isLimited(key) {
    if (!key) return false;
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    if (hits.size > maxKeys) {
      prune(now);
      // Still over capacity: drop the least recently seen keys only.
      const excess = hits.size - maxKeys;
      if (excess > 0) {
        let dropped = 0;
        for (const oldKey of hits.keys()) {
          if (dropped >= excess) break;
          if (oldKey !== key) {
            hits.delete(oldKey);
            dropped += 1;
          }
        }
      }
    }
    return recent.length > max;
  };
}
