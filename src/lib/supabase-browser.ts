"use client";

import { createBrowserClient } from "@supabase/ssr";

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

// Browser Supabase client. Persists the session to cookies (via @supabase/ssr)
// so Server Components and route handlers can read it.
export function supabaseBrowser() {
  return createBrowserClient(URL, ANON);
}
