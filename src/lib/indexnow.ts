// IndexNow submission for a host's own booking website. IndexNow is the instant
// indexing protocol used by Bing, Yandex and others: we POST the host's page URLs
// and they crawl them straight away. Google reads the same sitemap we publish.
import "server-only";

// A single shared key identifies us; it's served at /<key>.txt on each host domain.
export const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || "fysindexnow7c1b4a9e2d").replace(/[^a-z0-9]/gi, "");

const PATHS = ["", "rooms", "gallery", "location", "book"];

// Submit every page of a host's booking site to IndexNow. Best-effort.
export async function submitToIndexNow(host: string): Promise<boolean> {
  const clean = host.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!clean || clean.includes("localhost") || !clean.includes(".")) return false;
  const urlList = PATHS.map((p) => `https://${clean}/${p}`);
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: clean,
        key: INDEXNOW_KEY,
        keyLocation: `https://${clean}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
