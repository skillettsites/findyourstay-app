import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1320, height: 900 } });
await page.goto("http://localhost:3000/s?city=lisbon", { waitUntil: "networkidle" });
await page.waitForTimeout(3500); // let tiles paint
const tiles = await page.locator("img.leaflet-tile").count();
const loaded = await page.evaluate(() =>
  Array.from(document.querySelectorAll("img.leaflet-tile")).filter((i) => i.complete && i.naturalWidth > 0).length,
);
const pins = await page.locator(".fys-price-pin").count();
console.log(`leaflet tiles in DOM: ${tiles}, actually loaded: ${loaded}, price pins: ${pins}`);
await page.screenshot({ path: "e2e/screens/zz-map-check.png" });
await browser.close();
