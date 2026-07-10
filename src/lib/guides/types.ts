// Content model for host-facing SEO guides. Structured blocks (not MDX) so every
// article renders with consistent styling, automatic Article/FAQ/Breadcrumb schema,
// inline CTAs, and is easy to generate/maintain. Inline text supports **bold**,
// _italic_ and [label](href) — parsed by the renderer.

export type Block =
  | { t: "h2"; text: string; id?: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "table"; caption?: string; head: string[]; rows: string[][] }
  | { t: "callout"; tone?: "win" | "info" | "warn"; title?: string; text: string }
  | { t: "stats"; items: { value: string; label: string }[] }
  | { t: "quote"; text: string; cite?: string }
  | { t: "cta"; title: string; body?: string; label: string; href: string }
  // "You'd keep £X" money callout — the £ maths is computed from these inputs.
  | { t: "savings"; price?: number; bookingsPerYear?: number; otaRate?: number; ota?: string; label?: string; href?: string }
  // Interactive £ calculator embedded mid-article (client component).
  | { t: "calculator"; variant: "ota" | "airbnb" | "bookingcom"; title?: string };

export type Faq = { q: string; a: string };

export type GuideCategory =
  | "Commissions & fees"
  | "Direct bookings"
  | "Your website"
  | "Growth"
  | "Data & research";

export type Guide = {
  slug: string;
  category: GuideCategory;
  /** SEO <title> (≈55-60 chars). */
  title: string;
  /** On-page H1 (can differ slightly from title). */
  h1: string;
  /** Meta description (≈150-160 chars). */
  description: string;
  /** Standfirst / intro paragraph under the H1. */
  dek: string;
  keywords: string[];
  /** ISO date strings. */
  date: string;
  updated?: string;
  readMins: number;
  /** 40-60 word direct answer shown above the takeaways — the block LLMs and
   *  featured snippets lift verbatim. Answer-first. */
  answerFirst?: string;
  /** Short skimmable "key takeaways" — great for featured snippets + LLM answers. */
  takeaways?: string[];
  blocks: Block[];
  faqs?: Faq[];
  /** Slugs of related guides for internal linking. */
  related?: string[];
};
