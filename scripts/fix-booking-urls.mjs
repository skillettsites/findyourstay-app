// Remove broken / OTA "Book direct" links so no listing shows a dead or wrong
// link. Keeps 401/403/429 (live sites that just block automated checkers).
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);

const problems = JSON.parse(fs.readFileSync("booking-url-problems.json", "utf8"));

// Bucket by issue.
const buckets = {};
for (const p of problems) {
  const key = /redirects to OTA/.test(p.issue) ? "ota"
    : p.issue === "timeout" ? "timeout"
    : p.issue === "unreachable" ? "unreachable"
    : /^status 5/.test(p.issue) ? "5xx"
    : /^status 4(04|10)/.test(p.issue) ? "404/410"
    : /^status 4(01|03|29)/.test(p.issue) ? "blocked(keep)"
    : "other4xx";
  (buckets[key] ??= []).push(p);
}
console.log("Problem breakdown:");
for (const [k, v] of Object.entries(buckets)) console.log(`  ${k.padEnd(14)} ${v.length}`);

// Clear everything except the "blocked(keep)" bucket.
const toClear = problems.filter((p) =>
  /redirects to OTA|timeout|unreachable/.test(p.issue) ||
  /^status 5/.test(p.issue) ||
  /^status 4(04|10)/.test(p.issue) ||
  /^status 4(00|08|99)/.test(p.issue),
);
console.log(`\nClearing booking_url on ${toClear.length} listings (keeping bot-blocked ones)…`);

let done = 0;
for (let i = 0; i < toClear.length; i += 200) {
  const slugs = toClear.slice(i, i + 200).map((p) => p.slug);
  const { error } = await sb.from("fys_listings").update({ booking_url: null }).in("slug", slugs);
  if (error) { console.error("batch error:", error.message); break; }
  done += slugs.length;
  console.log(`  ${done}/${toClear.length}`);
}

const { count: stillLinked } = await sb.from("fys_listings").select("*", { count: "exact", head: true }).not("booking_url", "is", null);
console.log(`\nDone. Listings still showing a Book-direct link: ${stillLinked}`);
