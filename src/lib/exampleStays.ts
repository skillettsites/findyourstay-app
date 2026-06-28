import type { Listing, SiteTheme } from "./types";

// Three curated example stays used purely to showcase the booking-site
// templates: a beach stay (Coastal), a city stay (Modern) and a mountain stay
// (Classic). Not in the database, served directly by the /sites/[slug] route.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=70`;

const BASE = {
  hostId: null,
  status: "active" as const,
  source: "host" as const,
  priceRange: "luxury" as const,
  currency: "gbp",
  bookingUrl: null,
  hasBookingSite: true,
  verified: false,
  tier: "featured" as const,
  rating: null,
  reviewCount: 0,
  attribution: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const EXAMPLE_STAYS: Record<string, Listing> = {
  "beach-house-algarve": {
    ...BASE,
    id: "example-beach",
    propertyName: "Blue Bay Beach House",
    slug: "beach-house-algarve",
    citySlug: "lagos",
    cityName: "Lagos",
    country: "Portugal",
    lat: 37.0905,
    lng: -8.6743,
    neighborhood: "Praia da Luz",
    description:
      "A bright, breezy house just steps from the sand, with sea views from the terrace and the sound of the waves to wake up to. The perfect base for a slow Algarve escape, swims before breakfast, long lunches and golden-hour walks along the bay.",
    propertyType: "villa",
    pricePerNight: 165,
    amenities: ["Beach Access", "Sea View", "WiFi", "Air Conditioning", "Kitchen", "Balcony", "Free Parking", "Garden"],
    photos: [
      img("1507525428034-b723cf961d3e"),
      img("1505228395891-9a51e7e86bf6"),
      img("1506953823976-52e1fdc0149a"),
      img("1473116763249-2faaef81ccda"),
      img("1519046904884-53103b34b206"),
    ],
    siteTheme: "coastal",
  },
  "city-loft-lisbon": {
    ...BASE,
    id: "example-city",
    propertyName: "The Riverside Loft",
    slug: "city-loft-lisbon",
    citySlug: "lisbon",
    cityName: "Lisbon",
    country: "Portugal",
    lat: 38.7223,
    lng: -9.1393,
    neighborhood: "Baixa",
    description:
      "A light-filled loft in the heart of the city, moments from the best cafes, galleries and rooftop bars. Floor-to-ceiling windows, a calm palette and everything within walking distance, for a stay that puts you right in the middle of it all.",
    propertyType: "apartment",
    pricePerNight: 130,
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Washing Machine", "Heating", "Lift", "City View"],
    photos: [
      img("1502602898657-3e91760cbb34"),
      img("1513635269975-59663e0ac1ad"),
      img("1496442226666-8d4d0e62e6e9"),
      img("1431274172761-fca41d930114"),
      img("1480714378408-67cf0d13bc1b"),
    ],
    siteTheme: "modern",
  },
  "mountain-chalet-geres": {
    ...BASE,
    id: "example-mountain",
    propertyName: "Pinewood Mountain Chalet",
    slug: "mountain-chalet-geres",
    citySlug: "geres",
    cityName: "Gerês",
    country: "Portugal",
    lat: 41.7295,
    lng: -8.1916,
    neighborhood: "Peneda-Gerês",
    description:
      "A warm timber chalet wrapped in pine forest and mountain air, with a wood burner, deep armchairs and views that go on for miles. Hike, swim in the lagoons, then come home to a slow evening by the fire.",
    propertyType: "chalet",
    pricePerNight: 140,
    amenities: ["Mountain View", "WiFi", "Heating", "Kitchen", "Free Parking", "Hot Tub", "Garden", "Pet Friendly"],
    photos: [
      img("1464822759023-fed622ff2c3b"),
      img("1454496522488-7a8e488e8606"),
      img("1506905925346-21bda4d32df4"),
      img("1483728642387-6c3bdd6c93e5"),
      img("1480497490787-505ec076689f"),
    ],
    siteTheme: "classic",
  },
};

// Which example stay showcases each template.
export const EXAMPLE_BY_THEME: Record<SiteTheme, string> = {
  classic: "mountain-chalet-geres",
  modern: "city-loft-lisbon",
  coastal: "beach-house-algarve",
};

export const EXAMPLE_TEMPLATES: { theme: SiteTheme; label: string; place: string; slug: string }[] = [
  { theme: "classic", label: "Classic", place: "mountain chalet", slug: "mountain-chalet-geres" },
  { theme: "modern", label: "Modern", place: "city loft", slug: "city-loft-lisbon" },
  { theme: "coastal", label: "Coastal", place: "beach house", slug: "beach-house-algarve" },
];
