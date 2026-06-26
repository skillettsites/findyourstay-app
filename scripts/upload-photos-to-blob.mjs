// Upload local seed photos to Vercel Blob and repoint Supabase photo URLs.
// Re-runnable; updates each listing as its photos finish so the live site fills
// in progressively.
import { put } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);
const token = process.env.BLOB_READ_WRITE_TOKEN.replace(/^"|"$/g, "").replace(/\\n$/, "").trim();

let from = 0;
const pageSize = 1000;
const all = [];
for (;;) {
  const { data } = await sb.from("fys_listings").select("id,photos").range(from, from + pageSize - 1);
  if (!data || !data.length) break;
  all.push(...data);
  if (data.length < pageSize) break;
  from += pageSize;
}
const todo = all.filter((l) => Array.isArray(l.photos) && l.photos.some((p) => typeof p === "string" && p.startsWith("/places/")));
console.log(`${todo.length} listings need photo migration`);

let done = 0, uploaded = 0;
async function processListing(l) {
  const out = [];
  for (const p of l.photos) {
    if (typeof p === "string" && p.startsWith("/places/")) {
      const fp = path.join("public", p);
      if (fs.existsSync(fp)) {
        try {
          const { url } = await put(`places/${path.basename(p)}`, fs.readFileSync(fp), {
            access: "public", token, contentType: "image/jpeg", addRandomSuffix: false, allowOverwrite: true,
          });
          out.push(url);
          uploaded++;
        } catch {
          /* skip this photo */
        }
      }
    } else {
      out.push(p);
    }
  }
  if (out.length) await sb.from("fys_listings").update({ photos: out }).eq("id", l.id);
  done++;
  if (done % 100 === 0) console.log(`  ${done}/${todo.length} listings · ${uploaded} photos uploaded`);
}

const CONC = 10;
let idx = 0;
async function worker() { while (idx < todo.length) await processListing(todo[idx++]); }
await Promise.all(Array.from({ length: CONC }, () => worker()));
console.log(`Done. Uploaded ${uploaded} photos across ${done} listings.`);
