export function formatPrice(amount: number | null, currency = "gbp"): string {
  if (amount == null) return "Price on request";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

export function prettyType(t: string): string {
  const map: Record<string, string> = {
    guest_house: "Guesthouse",
    hotel: "Boutique hotel",
    hostel: "Hostel",
    chalet: "Chalet",
    apartment: "Apartment",
    villa: "Villa",
    cottage: "Cottage",
    room: "Private room",
    house: "House",
  };
  return map[t] ?? t;
}

/** Suggest a standalone domain for a host's booking site from its name. */
export function suggestDomain(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 28);
  return `${base || "yourstay"}.com`;
}

export const CATEGORIES = [
  { key: "", label: "All", icon: "🏠" },
  { key: "apartment", label: "Apartments", icon: "🏙️" },
  { key: "guest_house", label: "Guesthouses", icon: "🏡" },
  { key: "hotel", label: "Boutique", icon: "🛎️" },
  { key: "villa", label: "Villas", icon: "🌴" },
  { key: "chalet", label: "Cabins", icon: "🏔️" },
  { key: "hostel", label: "Hostels", icon: "🎒" },
] as const;
