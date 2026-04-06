const buckets = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_WINDOW_SECONDS = Number(Deno.env.get("AI_RATE_LIMIT_WINDOW_SECONDS") ?? "60");
const DEFAULT_MAX_REQUESTS = Number(Deno.env.get("AI_RATE_LIMIT_MAX_REQUESTS") ?? "20");

function getClientIdentifier(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  
  // Extract UUID or meaningful sub part from JWT instead of just "Bearer eyJhb..."
  const authHeader = req.headers.get("authorization") || req.headers.get("apikey");
  let authIdentifier = "anon";
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const payloadStr = atob(payloadBase64);
        const payload = JSON.parse(payloadStr);
        if (payload.sub) {
          authIdentifier = payload.sub; // User UUID
        }
      }
    } catch (e) {
      // Fallback
      authIdentifier = authHeader.slice(0, 24);
    }
  }

  return `${authIdentifier}-${forwardedFor || realIp || "unknown"}`;
}

export function enforceRateLimit(
  req: Request,
  scope: string,
  options?: { maxRequests?: number; windowSeconds?: number },
): { allowed: true; remaining: number; resetAt: number } | { allowed: false; retryAfter: number } {
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const windowSeconds = options?.windowSeconds ?? DEFAULT_WINDOW_SECONDS;

  const now = Date.now();
  const windowMs = Math.max(windowSeconds, 1) * 1000;
  const key = `${scope}:${getClientIdentifier(req)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(maxRequests - 1, 0), resetAt: now + windowMs };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1) };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { allowed: true, remaining: Math.max(maxRequests - existing.count, 0), resetAt: existing.resetAt };
}
