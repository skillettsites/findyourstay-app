// Core domain types for the FindYourStay directory.
// These mirror the spec's data model; the local SQLite store and the future
// Supabase/Postgres store both map onto these shapes.

export type ListingTier = "free" | "standard" | "featured" | "pro";
export type ListingStatus = "unclaimed" | "pending" | "active" | "suspended";
export type SiteTheme = "classic" | "modern" | "coastal";
export type PriceRange = "budget" | "mid" | "luxury";
export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "cottage"
  | "room"
  | "guest_house"
  | "hostel"
  | "hotel"
  | "chalet";

export interface Listing {
  id: string;
  hostId: string | null; // null = unclaimed seed
  status: ListingStatus;
  source: "host" | "osm_seed";
  propertyName: string;
  slug: string;
  citySlug: string;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  neighborhood: string | null;
  description: string | null;
  propertyType: PropertyType;
  priceRange: PriceRange;
  pricePerNight: number | null;
  currency: string;
  amenities: string[];
  photos: string[];
  bookingUrl: string | null; // host's own direct-booking site
  hasBookingSite: boolean; // FYS-hosted booking site add-on enabled
  verified: boolean; // Stripe-KYC verified host
  tier: ListingTier;
  rating: number | null;
  reviewCount: number;
  attribution: string | null; // e.g. "© OpenStreetMap contributors"
  siteTheme: SiteTheme; // chosen booking-site template
  createdAt: string;
}

export interface CitySummary {
  citySlug: string;
  cityName: string;
  country: string;
  count: number;
  lat: number;
  lng: number;
  coverPhoto: string | null;
}

export interface ListingQuery {
  q?: string;
  citySlug?: string;
  country?: string;
  propertyType?: PropertyType;
  amenities?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "rating";
  limit?: number;
  offset?: number;
}

export const AMENITIES_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Washing Machine",
  "Pool",
  "Hot Tub",
  "Garden",
  "Balcony",
  "Free Parking",
  "Pet Friendly",
  "Gym",
  "Wheelchair Accessible",
  "EV Charger",
  "Beach Access",
  "Breakfast Included",
] as const;

export const TIER_CONFIG = {
  free: { name: "Free", yearly: 0, monthly: 0, maxPhotos: 0, badge: null },
  standard: { name: "Standard", yearly: 7900, monthly: 799, maxPhotos: 6, badge: null },
  featured: { name: "Featured", yearly: 14900, monthly: 1499, maxPhotos: 10, badge: "Featured Stay" },
  pro: { name: "Pro", yearly: 29900, monthly: 2999, maxPhotos: 20, badge: "Top Pick" },
} as const;
