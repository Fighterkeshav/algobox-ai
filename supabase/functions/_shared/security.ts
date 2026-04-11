import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
const FALLBACK_ALLOWED_ORIGINS = [
  "https://algobox-ai.vercel.app",
  "https://algobox.ai",
  "http://localhost:5173",
  "http://localhost:3000",
];

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function getAllowedOrigins() {
  return allowedOrigins.length > 0 ? allowedOrigins : FALLBACK_ALLOWED_ORIGINS;
}

export function corsHeadersForRequest(req: Request): Record<string, string> {
  const requestOrigin = req.headers.get("origin")?.trim();
  const allowed = getAllowedOrigins();
  const allowOrigin = requestOrigin && allowed.includes(requestOrigin)
    ? requestOrigin
    : allowed[0] ?? "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}

export async function requireAuthenticatedUser(req: Request): Promise<{ id: string; email?: string | null }> {
  const token = getBearerToken(req);
  if (!token) {
    throw new Error("Unauthorized: missing Bearer token");
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Server misconfiguration: Supabase auth env vars are missing");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw new Error("Unauthorized: invalid or expired token");
  }

  return { id: data.user.id, email: data.user.email };
}
