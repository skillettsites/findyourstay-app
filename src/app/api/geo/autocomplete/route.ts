import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Address autocomplete for the host "list your stay" form. We use Photon
// (OpenStreetMap, free, no key) which returns structured address parts AND
// coordinates in a single call, so we can derive the city, neighbourhood and
// country straight from the chosen address. No separate details lookup needed.
interface GeoResult {
  id: string;
  label: string;
  address: string;
  city: string;
  neighborhood: string;
  country: string;
  lat: number;
  lng: number;
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: Record<string, string | number | undefined>;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ results: [] });

  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=en`,
      { headers: { "User-Agent": "FindYourStay/1.0 (https://findyourstay.com)" }, signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) return NextResponse.json({ results: [] });
    const data = (await res.json()) as { features?: PhotonFeature[] };

    const results: GeoResult[] = [];
    for (const f of data.features ?? []) {
      const p = f.properties ?? {};
      const coords = f.geometry?.coordinates;
      if (!coords || coords.length < 2) continue;

      const name = str(p.name);
      const houseNo = str(p.housenumber);
      const street = str(p.street);
      const city = str(p.city) || str(p.town) || str(p.village) || str(p.county) || str(p.state) || name;
      const neighborhood = str(p.district) || str(p.suburb) || str(p.locality) || "";
      const country = str(p.country);

      // Build a human-readable label: "12 Harbour Street, Old Town, Brighton, UK"
      const line = [houseNo && street ? `${houseNo} ${street}` : street || name, neighborhood, city, country]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ");

      results.push({
        id: `${p.osm_id ?? ""}-${coords[0]},${coords[1]}`,
        label: line,
        address: [houseNo && street ? `${houseNo} ${street}` : street || name, city].filter(Boolean).join(", "),
        city,
        neighborhood,
        country,
        lat: coords[1],
        lng: coords[0],
      });
    }
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
