import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Route handler can write cookies, so sign-out clears the session here.
export async function POST() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", SITE), { status: 303 });
}

export async function GET() {
  return POST();
}
