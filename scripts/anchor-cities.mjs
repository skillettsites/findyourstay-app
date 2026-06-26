// ~80 anchor cities across every region. The seed script queries OpenStreetMap
// around each one. Start dense here; expand the list any time.
export const ANCHOR_CITIES = [
  // Europe
  { slug: "london", name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { slug: "edinburgh", name: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883 },
  { slug: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { slug: "lisbon", name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { slug: "porto", name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
  { slug: "barcelona", name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { slug: "madrid", name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { slug: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { slug: "florence", name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558 },
  { slug: "amsterdam", name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { slug: "berlin", name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { slug: "vienna", name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { slug: "prague", name: "Prague", country: "Czechia", lat: 50.0755, lng: 14.4378 },
  { slug: "athens", name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { slug: "dubrovnik", name: "Dubrovnik", country: "Croatia", lat: 42.6507, lng: 18.0944 },
  // North America
  { slug: "new-york", name: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
  { slug: "san-francisco", name: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194 },
  { slug: "new-orleans", name: "New Orleans", country: "United States", lat: 29.9511, lng: -90.0715 },
  { slug: "savannah", name: "Savannah", country: "United States", lat: 32.0809, lng: -81.0912 },
  { slug: "asheville", name: "Asheville", country: "United States", lat: 35.5951, lng: -82.5515 },
  { slug: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { slug: "vancouver", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { slug: "mexico-city", name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { slug: "oaxaca", name: "Oaxaca", country: "Mexico", lat: 17.0732, lng: -96.7266 },
  // Latin America
  { slug: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { slug: "cusco", name: "Cusco", country: "Peru", lat: -13.5319, lng: -71.9675 },
  { slug: "medellin", name: "Medellin", country: "Colombia", lat: 6.2442, lng: -75.5812 },
  // Asia
  { slug: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { slug: "kyoto", name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
  { slug: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { slug: "chiang-mai", name: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853 },
  { slug: "bali", name: "Bali", country: "Indonesia", lat: -8.4095, lng: 115.1889 },
  { slug: "hanoi", name: "Hanoi", country: "Vietnam", lat: 21.0278, lng: 105.8342 },
  { slug: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { slug: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
  // Middle East
  { slug: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { slug: "dubai", name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  // Africa
  { slug: "marrakesh", name: "Marrakesh", country: "Morocco", lat: 31.6295, lng: -7.9811 },
  { slug: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { slug: "zanzibar", name: "Zanzibar", country: "Tanzania", lat: -6.1659, lng: 39.2026 },
  // Oceania
  { slug: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { slug: "queenstown", name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626 },
];

// Domains we strip out: a listing pointing at an OTA is NOT a direct-booking venue.
export const OTA_DOMAINS = [
  "booking.com",
  "airbnb.",
  "expedia.",
  "hotels.com",
  "vrbo.",
  "agoda.",
  "hostelworld.",
  "tripadvisor.",
  "trip.com",
  "lastminute.",
  "trivago.",
  "kayak.",
  "hrs.",
  "ostrovok.",
];
