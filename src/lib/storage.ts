// Server-only photo storage seam. Production uses Vercel Blob (object storage)
// when BLOB_READ_WRITE_TOKEN is set; locally it writes to /public/places. This
// is the swap point that fixes the "writing to /public fails on serverless"
// problem without changing any caller.
import "server-only";
import path from "node:path";
import fs from "node:fs";

export async function storePhoto(buf: Buffer, filename: string): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const { put } = await import("@vercel/blob");
    const { url } = await put(`places/${filename}`, buf, { access: "public", token, contentType: "image/jpeg" });
    return url;
  }
  const dir = path.join(process.cwd(), "public", "places");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buf);
  return `/places/${filename}`;
}
