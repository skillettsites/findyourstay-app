import { NextResponse } from "next/server";
import { getCitySuggestions } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const suggestions = await getCitySuggestions(q, 6);
  return NextResponse.json({ suggestions });
}
