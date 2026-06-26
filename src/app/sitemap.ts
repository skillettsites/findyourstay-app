import type { MetadataRoute } from "next";
import { getAllListingSlugs, getTopCities } from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/s`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE}/host`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [cityRows, slugRows] = await Promise.all([getTopCities(200), getAllListingSlugs(5000)]);
  const cities = cityRows.map((c) => ({
    url: `${SITE}/s?city=${c.citySlug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const listings = slugRows.map((l) => ({
    url: `${SITE}/rooms/${l.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...cities, ...listings];
}
