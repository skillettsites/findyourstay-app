// Headed, watch-along end-to-end tour of findyourstay.com that collects bugs.
// Run: node e2e/site-tour.mjs   (opens a visible browser; runs against production)
// LIVE Stripe: checkout uses promo "dave100" (100% off) so the total is £0.
// Login OTP: the script submits the email, then waits for e2e/otp.txt (the 6-digit
// code) — supplied mid-run — or for you to type it in the open browser.

import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://findyourstay.com";
const EMAIL = "davidskillett@hotmail.co.uk";
const PROMO = "FYSTEST"; // uppercase — Stripe Checkout uppercases the promo box, so lowercase codes (dave100) fail there
const SKIP_PUBLIC = process.env.SKIP_PUBLIC === "1";
const PUBLIC_STEPS = new Set(["Homepage", "Host landing /host", "Guides hub + 3 articles", "Build preview /host/build (desktop)", "Guest: search + listing + enquiry", "Host microsite (example) all pages", "Mobile checks (390px)"]);
const DIR = "e2e/tour";
fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync("e2e/_tour_status.txt", "starting");
try { fs.unlinkSync("e2e/otp.txt"); } catch {}

const bugs = [];
const bug = (sev, where, msg) => { bugs.push({ sev, where, msg: String(msg).slice(0, 220) }); console.log(`   [${sev.toUpperCase()}] ${where} :: ${String(msg).slice(0, 160)}`); };
const status = (s) => { fs.writeFileSync("e2e/_tour_status.txt", s); console.log(`\n>>> ${s}`); };
let shotN = 0;
const shot = async (page, name) => { try { await page.screenshot({ path: `${DIR}/${String(++shotN).padStart(2, "0")}-${name}.png` }); } catch {} };

// noise filter for network/console
const IGNORE = /favicon|\.well-known|gtag|analytics|doubleclick|fonts\.gstatic|hotjar|sentry|googletagmanager|stripe\.com\/v3|\/__nextjs/i;

const authFile = "e2e/auth.json";
const useAuth = process.env.USE_AUTH === "1" && fs.existsSync(authFile);
const browser = await chromium.launch({ headless: false, slowMo: 300 });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...(useAuth ? { storageState: authFile } : {}) });
const page = await ctx.newPage();

page.on("console", (m) => { if (m.type() === "error" && !IGNORE.test(m.text())) bug("console", shortUrl(page), m.text()); });
page.on("pageerror", (e) => bug("major", shortUrl(page), "JS error: " + e.message));
page.on("response", (r) => { const s = r.status(); const u = r.url(); if (s >= 400 && u.startsWith(BASE) && !IGNORE.test(u)) bug(s >= 500 ? "major" : "minor", "net", `${s} ${u.replace(BASE, "")}`); });

function shortUrl(p) { try { return p.url().replace(BASE, "") || "/"; } catch { return "?"; } }
const visible = async (loc) => { try { return await loc.first().isVisible(); } catch { return false; } }

async function step(name, fn) {
  if (SKIP_PUBLIC && PUBLIC_STEPS.has(name)) return;
  status(name);
  try { await fn(); } catch (e) { bug("major", name, "step threw: " + (e.message || e)); await shot(page, "ERR-" + name.replace(/\W+/g, "_")); }
}

// ---------- PUBLIC TOUR ----------
await step("Homepage", async () => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const t = await page.title();
  if (!/findyourstay/i.test(t)) bug("major", "/", "unexpected title: " + t);
  if (!(await visible(page.getByRole("link", { name: /for hosts/i })))) bug("minor", "/", "'For hosts' nav link not visible");
  await shot(page, "home");
});

await step("Host landing /host", async () => {
  await page.goto(`${BASE}/host`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  if (!(await visible(page.getByText(/see what your site would look like/i)))) bug("minor", "/host", "hero CTA missing");
  if (!(await visible(page.getByText(/\/yr|per year|£/i)))) bug("minor", "/host", "pricing not visible");
  await page.mouse.wheel(0, 1600); await page.waitForTimeout(800);
  await shot(page, "host");
});

await step("Guides hub + 3 articles", async () => {
  await page.goto(`${BASE}/guides`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  if (!(await visible(page.getByRole("heading", { name: /keep more of every booking/i })))) bug("minor", "/guides", "hub hero missing");
  const slugs = ["booking-commission-compared", "how-to-get-direct-bookings", "airbnb-host-fees-explained"];
  for (const s of slugs) {
    await page.goto(`${BASE}/guides/${s}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    if (!(await visible(page.locator("h1")))) bug("major", "/guides/" + s, "no H1");
    if (!(await visible(page.getByRole("link", { name: /build my free preview|see how it works|see your free site/i })))) bug("minor", "/guides/" + s, "no inline CTA found");
    await page.mouse.wheel(0, 1400); await page.waitForTimeout(900);
    if (!(await visible(page.getByText(/keep 100% of your bookings/i)))) bug("minor", "/guides/" + s, "sticky add-stay bar did not appear on scroll");
  }
  await shot(page, "guide-article");
});

await step("Build preview /host/build (desktop)", async () => {
  await page.goto(`${BASE}/host/build`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const frame = page.frameLocator("iframe[title='Your site preview']");
  // the just-fixed scaling: pay buttons must be visible in the preview
  const payVisible = await visible(frame.getByText(/pay with paypal/i));
  if (!payVisible) bug("major", "/host/build", "pay buttons NOT visible in desktop preview (scaling/zoom issue)");
  // vibe switching
  for (const v of ["City", "Mountain", "Beach"]) {
    await page.getByRole("button", { name: new RegExp(`^${v}$`, "i") }).first().click().catch(() => {});
    await page.waitForTimeout(900);
  }
  // fill details + live update
  await page.getByPlaceholder(/sea view guesthouse/i).fill("Tour Test Stay").catch(() => bug("minor", "/host/build", "name field not found"));
  await page.getByPlaceholder(/^porto$/i).fill("Bath").catch(() => {});
  await page.getByPlaceholder(/portugal/i).fill("England").catch(() => {});
  await page.waitForTimeout(1500);
  const updated = await visible(frame.getByText(/Tour Test Stay/i));
  if (!updated) bug("major", "/host/build", "preview did not live-update with typed name");
  await shot(page, "build-desktop");
});

await step("Guest: search + listing + enquiry", async () => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const search = page.getByPlaceholder(/search destinations|where/i).first();
  if (await visible(search)) { await search.fill("Lisbon"); await page.waitForTimeout(800); await search.press("Enter"); }
  else { await page.goto(`${BASE}/s?q=Lisbon`, { waitUntil: "domcontentloaded" }); }
  await page.waitForTimeout(1800);
  const card = page.locator("a[href^='/rooms/']").first();
  if (!(await visible(card))) { bug("major", "/s", "no listing cards in search results"); return; }
  await card.click(); await page.waitForTimeout(1800);
  if (!(await visible(page.locator("h1")))) bug("major", "/rooms", "listing detail has no H1");
  const enq = page.getByPlaceholder(/email/i).first();
  if (await visible(enq)) { await enq.fill(EMAIL); }
  else bug("minor", "/rooms", "no enquiry email field found on listing");
  await shot(page, "listing");
});

await step("Host microsite (example) all pages", async () => {
  for (const seg of ["", "/rooms", "/gallery", "/location", "/book"]) {
    const r = await page.goto(`${BASE}/sites/beach-house-algarve${seg}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(900);
    if (r && r.status() >= 400) bug("major", "/sites/beach-house-algarve" + seg, "status " + r.status());
    if (!(await visible(page.locator("h1, .font-serif").first()))) bug("minor", "microsite" + seg, "no heading rendered");
  }
  if (!(await visible(page.getByText(/pay with paypal/i)))) bug("minor", "microsite/book", "book page missing pay buttons");
  await shot(page, "microsite-book");
});

await step("Mobile checks (390px)", async () => {
  await page.setViewportSize({ width: 390, height: 780 });
  await page.goto(BASE, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1000); await shot(page, "m-home");
  await page.goto(`${BASE}/host/build`, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500);
  if (!(await visible(page.getByRole("link", { name: /see my website/i })))) bug("minor", "mobile /host/build", "'See my website' button missing on mobile");
  if (await visible(page.locator("iframe[title='Your site preview']"))) bug("minor", "mobile /host/build", "embedded iframe should NOT show on mobile");
  await shot(page, "m-build");
  await page.goto(`${BASE}/guides/booking-commission-compared`, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(900); await shot(page, "m-guide");
  await page.setViewportSize({ width: 1440, height: 900 });
});

// ---------- HOST SIGNUP (auth + free-code checkout) ----------
await step("Host signup: build -> create -> login", async () => {
  if (useAuth) { await page.goto(`${BASE}/host/new`, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500); console.log("   reusing saved auth, skipped login"); return; }
  await page.goto(`${BASE}/host/build`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.getByPlaceholder(/sea view guesthouse/i).fill("Tour Test Stay").catch(() => {});
  await page.getByPlaceholder(/^porto$/i).fill("Bath").catch(() => {});
  await page.getByRole("link", { name: /create this site|make it live/i }).first().click().catch(() => bug("major", "build", "create CTA not clickable"));
  await page.waitForTimeout(2000);
  if (!/\/login/.test(page.url())) { await page.goto(`${BASE}/host/new`, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500); }
  // login email step
  const emailInput = page.locator("input[type=email]").first();
  if (await visible(emailInput)) {
    await emailInput.fill(EMAIL);
    await page.getByRole("button", { name: /email me a code/i }).click();
    await page.waitForTimeout(2500);
    status("WAITING_OTP — type the 6-digit code from your email into the browser (5 min window)");
    // wait up to 300s for e2e/otp.txt (injected) OR for the code box to be filled manually
    const codeInput = page.locator("input[inputmode='numeric']").first();
    let entered = false;
    for (let i = 0; i < 150; i++) {
      if (fs.existsSync("e2e/otp.txt")) {
        const code = fs.readFileSync("e2e/otp.txt", "utf8").trim().replace(/\D/g, "");
        if (code.length >= 6) { await codeInput.fill(code); await page.getByRole("button", { name: /verify & continue/i }).click(); entered = true; break; }
      }
      const cur = await codeInput.inputValue().catch(() => "");
      if (cur.replace(/\D/g, "").length >= 6) { await page.getByRole("button", { name: /verify & continue/i }).click(); entered = true; break; }
      await page.waitForTimeout(2000);
    }
    if (!entered) { bug("blocker", "/login", "no OTP code supplied within window"); return; }
    await page.waitForTimeout(3000);
    await ctx.storageState({ path: authFile }).catch(() => {});
    console.log("   logged in; saved auth session to " + authFile);
  } else bug("minor", "login", "email input not found (already logged in?)");
});

await step("Listing wizard -> checkout (dave100)", async () => {
  if (!/host\/new/.test(page.url())) { await page.goto(`${BASE}/host/new`, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500); }
  // advance through the wizard (1 details -> 2 photos -> 3 bookings -> 4 plan), step-scoped
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(1000);
    const stepTxt = (await page.locator("text=/Step \\d of 4/").first().innerText().catch(() => "")).replace(/\s+/g, " ");
    if (stepTxt) console.log("   wizard:", stepTxt);
    const sn = (stepTxt.match(/Step (\d)/) || [])[1] || "";

    if (sn === "1") {
      const nameInput = page.getByPlaceholder(/sea view guesthouse/i).first();
      if (await visible(nameInput) && !(await nameInput.inputValue())) await nameInput.fill("Tour Test Stay");
      const addr = page.locator('input[autocomplete="off"]').first();
      if (await visible(addr)) {
        await addr.click(); await page.waitForTimeout(400);
        await addr.fill(""); await addr.type("Bath", { delay: 70 }); await page.waitForTimeout(1900);
        const sug = page.locator("ul li, [role=option]").first();
        if (await visible(sug)) await sug.click().catch(() => {});
        else bug("major", "wizard step1", "no address suggestions for 'Bath'");
        await page.waitForTimeout(500);
      }
    } else if (sn === "3") {
      const urlInput = page.locator('main input[type="url"], main input[placeholder*="http" i], main input[placeholder*="yoursite" i], main input[placeholder*=".com" i]').first();
      if (await visible(urlInput)) await urlInput.fill("https://teststay.example.com").catch(() => {});
    } else if (sn === "4") {
      const paid = page.getByText(/£\s?(79|149|299)/).first();
      if (await visible(paid)) { await paid.click().catch(() => {}); await page.waitForTimeout(400); }
    } else {
      for (const inp of await page.locator("main input[type=text], main input:not([type]):not([type=radio]):not([type=checkbox]), main textarea").all())
        { try { if (await inp.isVisible() && !(await inp.inputValue())) await inp.fill("Test"); } catch {} }
    }

    // advance — exact "Next", else the final publish/pay button
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    const pubBtn = page.getByRole("button", { name: /publish|make it live|go to payment|^pay|checkout/i }).first();
    const btn = (await visible(nextBtn)) ? nextBtn : ((await visible(pubBtn)) ? pubBtn : null);
    if (!btn) { bug("major", "wizard", "no advance button on " + (stepTxt || "?")); break; }
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    for (let w = 0; w < 14 && (await btn.isDisabled().catch(() => false)); w++) await page.waitForTimeout(500);
    if (await btn.isDisabled().catch(() => false)) { bug("major", "wizard", "advance button stayed disabled on " + stepTxt); await shot(page, "stuck-" + sn); break; }
    await btn.click().catch(() => {});
    await page.waitForTimeout(3000);
    if (/checkout\.stripe\.com/.test(page.url())) break;
    if (/host\/dashboard|\/rooms\//.test(page.url())) break; // free plan published without Stripe
  }
  await shot(page, "wizard-end");
  // Stripe checkout
  if (/checkout\.stripe\.com/.test(page.url())) {
    status("STRIPE CHECKOUT — applying dave100");
    await page.waitForTimeout(2500);
    const promoToggle = page.getByText(/add promotion code|promotion code/i).first();
    if (await visible(promoToggle)) { await promoToggle.click().catch(() => {}); await page.waitForTimeout(800); }
    const promo = page.getByPlaceholder(/promotion|promo/i).first();
    if (await visible(promo)) { await promo.fill(PROMO); await page.getByRole("button", { name: /^apply$/i }).click().catch(() => {}); await page.waitForTimeout(2500); }
    else bug("major", "stripe", "no promotion-code box on checkout (allow_promotion_codes off?)");
    const body = await page.locator("body").innerText().catch(() => "");
    const zero = /£0\.00|\bGBP\s?0\b|Total.*0\.00/i.test(body);
    if (!zero) bug("blocker", "stripe", "total is NOT £0.00 after dave100 — NOT completing payment");
    await shot(page, "stripe-checkout");
    if (zero) {
      const pay = page.getByRole("button", { name: /subscribe|pay|start|confirm/i }).first();
      if (await visible(pay)) { await pay.click().catch(() => {}); await page.waitForTimeout(6000); }
    }
  } else bug("major", "wizard", "did not reach Stripe checkout (wizard may need different steps or free plan chosen)");
});

await step("Post-checkout: dashboard", async () => {
  await page.goto(`${BASE}/host/dashboard`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  if (/\/login/.test(page.url())) bug("major", "/host/dashboard", "redirected to login (session not established)");
  else if (!(await visible(page.locator("h1, h2").first()))) bug("minor", "/host/dashboard", "dashboard did not render");
  await shot(page, "dashboard");
});

// ---------- REPORT ----------
const order = { blocker: 0, major: 1, minor: 2, console: 3 };
bugs.sort((a, b) => (order[a.sev] ?? 9) - (order[b.sev] ?? 9));
const counts = bugs.reduce((m, b) => ((m[b.sev] = (m[b.sev] || 0) + 1), m), {});
let md = `# FindYourStay site tour — bug report\n\nRun: ${new Date().toISOString()} against ${BASE}\n\n`;
md += `Totals: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ") || "no issues found"}\n\n`;
for (const sev of ["blocker", "major", "minor", "console"]) {
  const list = bugs.filter((b) => b.sev === sev);
  if (!list.length) continue;
  md += `## ${sev.toUpperCase()} (${list.length})\n`;
  for (const b of list) md += `- **${b.where}** — ${b.msg}\n`;
  md += `\n`;
}
md += `\nScreenshots in \`${DIR}/\`.\n`;
fs.writeFileSync("e2e/bug-report.md", md);
status("DONE");
console.log("\n" + md);
console.log("Leaving the browser open for 20s so you can look around...");
await page.waitForTimeout(20000);
await browser.close();
