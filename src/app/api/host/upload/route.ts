import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getUser } from "@/lib/auth";

// Host photo upload -> Vercel Blob. Returns a public URL to store on the listing.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please log in to upload." }, { status: 401 });

  let file: FormDataEntryValue | null;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  if (!(file instanceof File)) return NextResponse.json({ error: "No image was provided." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
  if (file.size > 8_000_000) return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
  const key = `host/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  try {
    const blob = await put(key, file, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Upload failed, please try again." }, { status: 500 });
  }
}
