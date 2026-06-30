// Harvest independent French accommodations (chambres d'hôtes / guest houses /
// small hotels / chalets) that have their OWN website, from OpenStreetMap.
// Free (Overpass), no key. Writes scripts/france-raw.json for the scanner.
//
// Usage: node scripts/harvest-france.mjs [--target 800]

const TARGET = process.argv.includes("--target") ? Number(process.argv[process.argv.indexOf("--target") + 1]) : 800;

// chains / OTAs / booking platforms to drop — we only want true independents
const CHAIN = /(hilton|marriott|ihg\.com|accor|thistle|travelodge|premierinn|premier-inn|easyhotel|booking\.com|booking\.|hotels\.com|expedia|airbnb|vrbo|abritel|gites-de-france|kyriad|campanile|ibis|novotel|mercure|timhotel|b-and-b-hotels|hotelf1|logishotels|bestwestern|radisson|melia|wyndham|hyatt|sheraton|intercontinental|tripadvisor|trivago|hostelworld|booking)/i;

const QUERY = `
[out:json][timeout:240];
area["ISO3166-1"="FR"][admin_level=2]->.fr;
(
  nwr["tourism"="guest_house"]["website"](area.fr);
  nwr["tourism"="chalet"]["website"](area.fr);
  nwr["tourism"="hotel"]["website"]["stars"~"^[12]$"](area.fr);
);
out tags center ${Math.max(TARGET * 3, 2000)};
`;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

async function runOverpass() {
  for (const url of ENDPOINTS) {
    try {
      process.stderr.write(`Querying ${url} ...\n`);
      const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(QUERY), headers: { "content-type": "application/x-www-form-urlencoded" } });
      if (!res.ok) { process.stderr.write(`  ${res.status} ${res.statusText}\n`); continue; }
      const json = await res.json();
      if (json.elements?.length) return json.elements;
      process.stderr.write(`  0 elements, trying next mirror\n`);
    } catch (e) { process.stderr.write(`  failed: ${e.message}\n`); }
  }
  throw new Error("All Overpass mirrors failed");
}

const hostOf = (u) => { try { return new URL(u.startsWith("http") ? u : "https://" + u).hostname.replace(/^www\./, "").toLowerCase(); } catch { return null; } };

const els = await runOverpass();
process.stderr.write(`Got ${els.length} raw elements.\n`);

const seen = new Set();
const out = [];
for (const el of els) {
  const t = el.tags || {};
  const name = t.name || t["name:fr"];
  const website = t.website || t["contact:website"] || t.url;
  if (!name || !website) continue;
  if (CHAIN.test(website) || CHAIN.test(name)) continue;
  const host = hostOf(website);
  if (!host || seen.has(host)) continue;
  // drop obvious non-own-site hosts (social, link shorteners)
  if (/(facebook|instagram|linktr|wordpress\.com|wixsite|google\.|youtube|bit\.ly)/i.test(host)) continue;
  seen.add(host);
  out.push({ property_name: name, country: "France", city: t["addr:city"] || "", booking_url: website.startsWith("http") ? website : "https://" + website, kind: t.tourism });
  if (out.length >= TARGET) break;
}

const fs = await import("node:fs");
fs.writeFileSync("scripts/france-raw.json", JSON.stringify(out, null, 0));
const byKind = {};
for (const o of out) byKind[o.kind] = (byKind[o.kind] || 0) + 1;
console.log(`\nHarvested ${out.length} unique independent French sites with their own website.`);
console.log(`By type:`, byKind);
console.log(`Saved to scripts/france-raw.json`);
