// Supabase Auth (server side) via @supabase/ssr. Cookie-based sessions.
// We only use auth to identify the logged-in host; all DB access stays on the
// service-role client in db.ts, so no RLS dependency.
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { sb, T } from "./sb";

const URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\\n$/, "").trim();
const ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").replace(/\\n$/, "").trim();

// Server client bound to the request cookies. In a Server Component the
// cookie write is a no-op (Next forbids it there); the middleware refreshes
// the session instead, so reads still work.
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) store.set(name, value, options);
        } catch {
          /* called from a Server Component — ignore */
        }
      },
    },
  });
}

export interface SessionUser {
  id: string;
  email: string;
}

export async function getUser(): Promise<SessionUser | null> {
  try {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user?.email) return null;
    return { id: data.user.id, email: data.user.email };
  } catch {
    return null;
  }
}

// Ensure a fys_hosts row exists for this authed user (idempotent). Returns the
// host id (== auth user id).
export async function ensureHost(user: SessionUser, name?: string): Promise<string> {
  await sb.from(T.hosts).upsert(
    { id: user.id, email: user.email, ...(name ? { name } : {}) },
    { onConflict: "id" },
  );
  return user.id;
}

export async function getHostEmail(hostId: string | null): Promise<string | null> {
  if (!hostId) return null;
  const { data } = await sb.from(T.hosts).select("email").eq("id", hostId).maybeSingle();
  return (data?.email as string) ?? null;
}
