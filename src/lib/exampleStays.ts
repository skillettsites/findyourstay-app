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
  heroImage: null,
  hasBookingSite: true,
  verified: false,
  tier: "featured" as const,
  rating: null,
  reviewCount: 0,
  attribution: null,
  payStripe: "https://buy.stripe.com/example",
  payPaypal: "https://www.paypal.com/paypalme/example",
  perks: ["Best price guaranteed", "Free welcome drink", "Free late checkout"],
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
    // Coherent set: ocean-view beach house + bright coastal rooms, all with sea.
    photos: [
      img("1730005523015-422bd53dda0b"), // ocean view from the beach house
      img("1770414173168-f6c666501225"), // bright coastal bedroom
      img("1762529716272-b316f61502e7"), // coastal living room, neutral tones
      img("1779903726439-5c27e3996c8a"), // dining area with ocean view
      img("1765421617367-4b6f88423be9"), // reading nook with ocean view
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
    // Coherent set: Lisbon riverside establishing shot + stylish loft interiors.
    photos: [
      img("1690585552493-2f4406dae499"), // Lisbon, river and bridge
      img("1759264244827-1dde5bee00a5"), // loft living room, brick wall
      img("1718066236069-a4d42a6436a1"), // bright room, floor-to-ceiling windows
      img("1768413292179-d958b344f1d4"), // modern loft kitchen with staircase
      img("1592928302636-c83cf1e1c887"), // lounge, parquet floor
      img("1697748525265-7431cba075b6"), // Lisbon trams (the neighbourhood)
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
    // Coherent set: snowy chalet exterior + warm wood interiors with fireplaces.
    photos: [
      img("1605153123052-528d89be0d4e"), // chalet below a snow-capped mountain
      img("1645640933655-7f0c401388c7"), // living room, stone fireplace, big windows
      img("1780391592801-5e8867523492"), // luxurious wooden chalet interior
      img("1761470484741-badac5364858"), // cosy wood-panelled dining/seating room
      img("1652400094047-04a7907d798a"), // bedroom
      img("1673100938846-1d6c184ecb69"), // chalet and snowy mountain (gallery)
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
