// Turn france-leads.csv into a Resend-ready, personalised send list.
// Picks the email variant + {{probleme}} line + a personalised preview link.
// Only includes leads that are actually emailable (has MX + a scraped address).
//
// Usage: node scripts/generate-send-list.mjs [--limit 500]

import fs from "node:fs";

const LIMIT = process.argv.includes("--limit") ? Number(process.argv[process.argv.indexOf("--limit") + 1]) : 500;
const SITE = "https://findyourstay-app.vercel.app"; // swap to findyourstay.com when live

const parse = (l) => (l.match(/"(?:[^"]|"")*"/g) || []).map((s) => s.slice(1, -1).replace(/""/g, '"'));
const lines = fs.readFileSync("scripts/france-leads.csv", "utf8").split("\n").slice(1).filter(Boolean);

const PROB = {
  hard: "votre site n'affiche pas de connexion sécurisée (HTTPS) valide",
  redirect: "votre site ne bascule pas automatiquement vers une connexion sécurisée (HTTPS)",
};

const seenEmail = new Set();
const out = [];
for (const l of lines) {
  const c = parse(l);
  if (c.length < 12) continue;
  const [country, name, host, type, https, cert_days, redirect, mx, email, ch, flags] = c;
  if (mx !== "yes" || !email) continue;                 // must be reachable
  const addr = email.split(";")[0].trim().toLowerCase();
  if (!/^[^@]+@[^@]+\.[a-z]{2,}$/.test(addr) || seenEmail.has(addr)) continue;
  seenEmail.add(addr);

  const fl = flags ? flags.split("|") : [];
  let variant, probleme;
  if (fl.some((f) => ["NO_HTTPS", "CERT_INVALID", "CERT_EXPIRED"].includes(f))) { variant = "A"; probleme = PROB.hard; }
  else if (fl.includes("NO_HTTPS_REDIRECT")) { variant = "A"; probleme = PROB.redirect; }
  else { variant = "B"; probleme = ""; }

  const vibe = type === "chalet" ? "mountain" : type === "hotel" ? "city" : "mountain";
  const preview = `${SITE}/sites/preview?vibe=${vibe}&name=${encodeURIComponent(name)}&country=France&type=${type === "guest_house" ? "guest_house" : type}&price=120`;

  out.push({ email: addr, nom: name, host, variant, probleme, lien_apercu: preview });
  if (out.length >= LIMIT) break;
}

const cols = ["email", "nom", "host", "variant", "probleme", "lien_apercu"];
const csv = [cols.join(",")].concat(out.map((o) => cols.map((k) => `"${String(o[k] ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
fs.writeFileSync("scripts/france-send-list.csv", csv);

const a = out.filter((o) => o.variant === "A").length;
console.log(`Send-ready France list: ${out.length} leads`);
console.log(`  Variant A (security hook): ${a}`);
console.log(`  Variant B (soft / direct-booking): ${out.length - a}`);
console.log(`Written to scripts/france-send-list.csv`);
