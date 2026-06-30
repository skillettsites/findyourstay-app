// Outreach scanner — for each seed listing with its own website, check:
//   1. HTTPS health (cert valid? expired? http->https redirect?)  => the "issue" hook
//   2. MX records (can the domain receive email?)                 => basic deliverability
//   3. A contactable email scraped from their own homepage         => who to send to
//   4. (UK only, optional) Companies House active Ltd/LLP match    => PECR legal filter
// Zero npm deps: node:sqlite / node:tls / node:dns / global fetch. Cost: £0.
//
// Usage:  node scripts/scan-outreach.mjs [--all] [--limit N]
//   default: only legally-emailable countries (UK/FR/NL/BE/IE/PT/LU)
//   --all:   every listing with a site
// Optional env: CH_API_KEY (free Companies House key) enables UK incorporation check.

import { DatabaseSync } from "node:sqlite";
import tls from "node:tls";

const EMAILABLE = ["United Kingdom", "France", "Netherlands", "Belgium", "Ireland", "Portugal", "Luxembourg"];
// Big chains / OTAs that the OSM seed picks up in major cities — not our indie target.
const CHAIN = /(hilton|marriott|ihg\.com|accor|thistle|travelodge|premierinn|premier-inn|easyhotel|booking\.com|hotels\.com|expedia|radisson|bestwestern|hyatt|wyndham|melia|novotel|mercure|ibis|holidayinn|sheraton|intercontinental)/i;
const CONCURRENCY = 18;
const TIMEOUT = 9000;
const CH_KEY = process.env.CH_API_KEY || "";
const args = process.argv.slice(2);
const ALL = args.includes("--all");
const INPUT = args.includes("--input") ? args[args.indexOf("--input") + 1] : "";
const OUTFILE = args.includes("--out") ? args[args.indexOf("--out") + 1] : "scripts/outreach-scan.csv";
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : 0;

let rows;
if (INPUT) {
  const fsr = await import("node:fs");
  rows = JSON.parse(fsr.readFileSync(INPUT, "utf8")); // [{property_name, country, booking_url}]
} else {
  const db = new DatabaseSync("data/fys.db");
  rows = db.prepare("SELECT property_name, country, booking_url FROM listings WHERE booking_url IS NOT NULL AND booking_url != ''").all();
  if (!ALL) rows = rows.filter((r) => EMAILABLE.includes(r.country));
}
if (LIMIT) rows = rows.slice(0, LIMIT);

const hostOf = (u) => { try { return new URL(u).hostname.replace(/\/$/, ""); } catch { return null; } };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

// --- TLS cert check: connects on 443, returns authorized + days-to-expiry ---
function checkTLS(host) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; try { sock.destroy(); } catch {} resolve(v); } };
    const sock = tls.connect({ host, port: 443, servername: host, timeout: TIMEOUT, rejectUnauthorized: false }, () => {
      const cert = sock.getPeerCertificate();
      const authorized = sock.authorized;
      const err = sock.authorizationError;
      let days = null;
      if (cert && cert.valid_to) days = Math.round((new Date(cert.valid_to) - new Date("2026-06-30")) / 86400000);
      finish({ reachable: true, authorized, err: err ? String(err) : null, days });
    });
    sock.on("error", () => finish({ reachable: false }));
    sock.on("timeout", () => finish({ reachable: false }));
  });
}

// --- MX check via DNS-over-HTTPS (sandbox blocks direct port-53 DNS) ---
async function checkMX(domain) {
  try {
    const res = await withTimeout(fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, { headers: { accept: "application/dns-json" } }), TIMEOUT);
    const j = await res.json();
    return Array.isArray(j.Answer) && j.Answer.some((a) => a.type === 15);
  } catch { return false; }
}

// --- http -> https redirect check ---
async function checkRedirect(host) {
  try {
    const res = await withTimeout(fetch("http://" + host, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 FYSscan" } }), TIMEOUT);
    const loc = res.headers.get("location") || "";
    if ([301, 302, 307, 308].includes(res.status) && loc.toLowerCase().startsWith("https")) return true;
    // some servers answer http with 200 (no redirect) — that's a flag
    return false;
  } catch { return null; }
}

// --- scrape a contactable email: homepage first, then contact/legal pages ---
const ROLE = ["bookings", "reservations", "reservation", "reservations", "enquiries", "enquiry", "reception", "accueil", "contact", "info", "infos", "hello", "bonjour", "stay", "book", "mail"];
// French sites very often hide the address on these pages, not the homepage.
const CONTACT_PATHS = ["/contact", "/nous-contacter", "/contactez-nous", "/mentions-legales", "/contact.html", "/en/contact"];

// Real consumer mail providers French hosts use (besides their own domain).
const PROVIDERS = /@(gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|wanadoo|orange|free|laposte|sfr|neuf|bbox|gmx|icloud|me|aol|protonmail|proton)\.[a-z.]{2,}$/i;
// JS / tracking tokens that produce fake "emails" from minified scripts.
const JUNK = /(push|indexof|prototype|function|datalayer|elfsight|analytics|gtag|recaptcha|wpcf7|sentry|wixpress|cloudflare|googleapis|gstatic|jsdelivr|jquery|bootstrap|fontawesome|schema\.org|w3\.org|example\.|domain\.com|email\.com|yourdomain|mailservice|teste@teste|\.js|\.min|\.png|@2x|sentry\.io|godaddy)/i;

async function fetchEmails(u, base) {
  try {
    const res = await withTimeout(fetch(u, { headers: { "user-agent": "Mozilla/5.0 FYSscan" } }), TIMEOUT);
    let html = (await res.text()).slice(0, 400000);
    // de-obfuscate ONLY when there are real delimiters: "[at]", "(at)", " at ", "[dot]", " dot "
    html = html
      .replace(/\s*[\[(]\s*(at|arobase)\s*[\])]\s*/gi, "@").replace(/\s+(at|arobase)\s+/gi, "@")
      .replace(/\s*[\[(]\s*(dot|point)\s*[\])]\s*/gi, ".").replace(/\s+(dot|point)\s+/gi, ".");
    const found = [...html.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,13}/gi)].map((m) => m[0].toLowerCase());
    return [...new Set(found)].filter((e) => !JUNK.test(e) && !/\.(png|jpg|jpeg|gif|webp|svg|css|js)$/.test(e));
  } catch { return []; }
}

async function scrapeEmail(url, host) {
  const base = host.replace(/^www\./, "");
  // only trust same-domain addresses or real consumer providers — kills JS garbage
  const ok = (e) => e.endsWith("@" + base) || PROVIDERS.test(e);
  const score = (e) => (e.endsWith("@" + base) ? 100 : 40) + (ROLE.indexOf(e.split("@")[0]) >= 0 ? 50 - ROLE.indexOf(e.split("@")[0]) : 0);
  const rank = (list) => { const c = list.filter(ok); c.sort((a, b) => score(b) - score(a)); return c.slice(0, 3).join("; "); };
  for (const root of [url, "https://" + host]) {
    const r = rank(await fetchEmails(root, base));
    if (r) return r;
  }
  for (const p of CONTACT_PATHS) {
    const r = rank(await fetchEmails("https://" + host + p, base));
    if (r) return r;
  }
  return "";
}

// --- Companies House active Ltd/LLP match (UK only, optional) ---
async function checkCH(name) {
  if (!CH_KEY) return "no_key";
  try {
    const q = encodeURIComponent(name.slice(0, 60));
    const res = await withTimeout(fetch(`https://api.company-information.service.gov.uk/search/companies?q=${q}&items_per_page=5`, {
      headers: { authorization: "Basic " + Buffer.from(CH_KEY + ":").toString("base64") },
    }), TIMEOUT);
    if (!res.ok) return "ch_err";
    const data = await res.json();
    const hit = (data.items || []).find((i) => i.company_status === "active");
    return hit ? `Ltd:${hit.company_number}` : "not_incorporated";
  } catch { return "ch_err"; }
}

async function scanOne(r) {
  const host = hostOf(r.booking_url);
  if (!host) return null;
  const [tlsRes, redirect, mx] = await Promise.all([
    checkTLS(host),
    checkRedirect(host),
    checkMX(host.replace(/^www\./, "")),
  ]);
  const chain = CHAIN.test(host) ? "chain" : "indie";
  const email = await scrapeEmail(r.booking_url, host);
  const ch = r.country === "United Kingdom" ? await checkCH(r.property_name) : "n/a";

  const flags = [];
  if (!tlsRes.reachable) flags.push("NO_HTTPS");
  else if (!tlsRes.authorized) flags.push("CERT_INVALID");
  else if (tlsRes.days !== null && tlsRes.days < 0) flags.push("CERT_EXPIRED");
  else if (tlsRes.days !== null && tlsRes.days < 21) flags.push("CERT_EXPIRING");
  if (redirect === false) flags.push("NO_HTTPS_REDIRECT");
  if (!mx) flags.push("NO_MX");

  const security = flags.some((f) => ["NO_HTTPS", "CERT_INVALID", "CERT_EXPIRED"].includes(f));
  const hook = security ? "STRONG (security)" : flags.includes("NO_HTTPS_REDIRECT") ? "MEDIUM (redirect)" : "soft (direct-booking)";

  return {
    country: r.country, name: r.property_name, host, type: chain,
    https: !tlsRes.reachable ? "none" : !tlsRes.authorized ? "invalid" : tlsRes.days < 0 ? "expired" : "ok",
    cert_days: tlsRes.days ?? "",
    redirect: redirect === null ? "?" : redirect ? "yes" : "no",
    mx: mx ? "yes" : "no",
    email, ch, flags: flags.join("|"), hook,
  };
}

// --- run with a concurrency pool ---
const out = [];
let i = 0, done = 0;
async function worker() {
  while (i < rows.length) {
    const r = rows[i++];
    const res = await scanOne(r).catch(() => null);
    if (res) out.push(res);
    done++;
    if (done % 25 === 0) process.stderr.write(`  scanned ${done}/${rows.length}\n`);
  }
}
console.error(`Scanning ${rows.length} domains (${ALL ? "ALL countries" : "emailable countries"})${CH_KEY ? " + Companies House" : " (no CH key)"}...`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// --- write CSV + summary ---
const cols = ["country", "name", "host", "type", "https", "cert_days", "redirect", "mx", "email", "ch", "flags", "hook"];
const csv = [cols.join(",")].concat(out.map((o) => cols.map((c) => `"${String(o[c] ?? "").replace(/"/g, "'")}"`).join(","))).join("\n");
const fs = await import("node:fs");
fs.writeFileSync(OUTFILE, csv);

const n = out.length;
const indie = out.filter((o) => o.type === "indie");
const ni = indie.length;
const sec = indie.filter((o) => o.hook.startsWith("STRONG")).length;
const med = indie.filter((o) => o.hook.startsWith("MEDIUM")).length;
const withMx = indie.filter((o) => o.mx === "yes").length;
const withEmail = indie.filter((o) => o.email).length;
const reachable = indie.filter((o) => o.mx === "yes" && o.email).length;
const byCountry = {};
for (const o of indie) (byCountry[o.country] ??= { n: 0, sec: 0, email: 0 }), byCountry[o.country].n++, o.hook.startsWith("STRONG") && byCountry[o.country].sec++, o.email && byCountry[o.country].email++;

console.log(`\n===== OUTREACH SCAN RESULTS =====`);
console.log(`Scanned ${n} sites — ${ni} independent, ${n - ni} chains/OTAs (excluded from targeting).`);
console.log(`\nAmong the ${ni} INDEPENDENT sites:`);
console.log(`  SECURITY problem (no/expired/invalid HTTPS) = STRONG hook: ${sec}  (${Math.round(sec / ni * 100)}%)`);
console.log(`  No http->https redirect = MEDIUM hook:                     ${med}  (${Math.round(med / ni * 100)}%)`);
console.log(`  Has a mail server (MX):                                    ${withMx}  (${Math.round(withMx / ni * 100)}%)`);
console.log(`  Contactable email scraped from their site:                ${withEmail}  (${Math.round(withEmail / ni * 100)}%)`);
console.log(`  >> Ready to email (has MX + an address):                  ${reachable}`);
console.log(`\nIndependent sites by country:`);
for (const [c, v] of Object.entries(byCountry).sort((a, b) => b[1].n - a[1].n))
  console.log(`  ${c}: ${v.n} | ${v.sec} security-issue | ${v.email} with email`);
console.log(`\nFull table written to ${OUTFILE}`);
