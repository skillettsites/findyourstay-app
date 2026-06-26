import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const SHOTS = "e2e/screens";
fs.mkdirSync(SHOTS, { recursive: true });

let shotN = 0;
async function shot(page: Page, name: string) {
  shotN += 1;
  await page.screenshot({ path: `${SHOTS}/${String(shotN).padStart(2, "0")}-${name}.png`, fullPage: false });
  console.log(`  screenshot: ${name}`);
}

const next = (page: Page) => page.getByRole("button", { name: "Next", exact: true });

test.describe("FindYourStay end-to-end", () => {
  test("Guest: search a destination and send an enquiry", async ({ page }) => {
    console.log("GUEST JOURNEY");
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Find your stay/i })).toBeVisible();
    await shot(page, "guest-home");

    await page.getByTestId("hero-where").click();
    await page.getByTestId("hero-where").fill("Edinburgh");
    await page.getByRole("button", { name: /Edinburgh/ }).first().click();
    await page.getByTestId("hero-search").click();

    await page.waitForURL(/\/s\b/);
    await expect(page.locator('a[href^="/rooms/"]').first()).toBeVisible();
    await shot(page, "guest-results");

    await page.locator('a[href^="/rooms/"]').first().click();
    await page.waitForURL(/\/rooms\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await shot(page, "guest-listing");

    await page.getByRole("button", { name: /Send the host an enquiry/i }).click();
    await page.getByPlaceholder("Your email").fill("traveller@example.com");
    await page.getByRole("button", { name: /^Send enquiry$/i }).click();
    await expect(page.getByText(/noted your interest|Enquiry sent/i)).toBeVisible();
    await shot(page, "guest-enquiry-sent");
    console.log("  PASS: guest enquiry confirmed");
  });

  test("Host A: has own website, lists and links to it", async ({ page }) => {
    console.log("HOST A JOURNEY (own website)");
    await page.goto("/host");
    await page.locator('a[href="/host/new"]').first().click();
    await page.waitForURL(/\/host\/new/);
    await shot(page, "hostA-wizard-start");

    await page.getByPlaceholder("e.g. Sea View Guesthouse").fill("Pulitzer House Barcelona");
    await page.getByRole("combobox").selectOption("hotel");
    await page.getByPlaceholder("Start typing a city").fill("Barcelona");
    await page.getByRole("button", { name: /Barcelona/ }).first().click();
    await next(page).click();

    await page.getByPlaceholder("95").fill("140");
    await page.getByPlaceholder(/A cosy place/).fill("A bright townhouse near the centre.");
    await shot(page, "hostA-step2");
    await next(page).click();

    await page.getByText("I have my own website").click();
    await page.getByPlaceholder("https://your-website.com/book").fill("https://pulitzerhouse.example.com/book");
    await shot(page, "hostA-step3-own-site");
    await next(page).click();

    await page.getByRole("button", { name: /standard/ }).click();
    await page.getByPlaceholder("Maria").fill("Alex");
    await page.getByPlaceholder("you@email.com").fill("alex@example.com");
    await shot(page, "hostA-step4-plan");
    await page.getByRole("button", { name: /Publish/ }).click();

    await expect(page.getByText("You're live!")).toBeVisible({ timeout: 30_000 });
    await shot(page, "hostA-live");

    await page.getByRole("link", { name: /View your listing/i }).click();
    await expect(page.getByRole("link", { name: /Book direct on owner/i })).toBeVisible();
    await shot(page, "hostA-listing-bookdirect");
    console.log("  PASS: Host A live with own booking link");
  });

  test("Host B: no website, has one built for them", async ({ page }) => {
    console.log("HOST B JOURNEY (build me a website)");
    await page.goto("/host");
    await page.getByRole("button", { name: /Add a booking website/i }).nth(2).click();
    await shot(page, "hostB-addon-on");
    await page.getByRole("link", { name: /Choose Featured \+ Website/i }).first().click();
    await page.waitForURL(/\/host\/new\?tier=featured&website=1/);

    await page.getByPlaceholder("e.g. Sea View Guesthouse").fill("Maria's Cosy Cabin");
    await page.getByRole("combobox").selectOption("cottage");
    await page.getByPlaceholder("Start typing a city").fill("Edinburgh");
    await page.getByRole("button", { name: /Edinburgh/ }).first().click();
    await next(page).click();

    await page.getByPlaceholder("95").fill("90");
    await shot(page, "hostB-step2-autophotos");
    await next(page).click();

    await page.getByText("Build me a website").click();
    await expect(page.locator('input[value$=".com"]').first()).toBeVisible();
    await shot(page, "hostB-step3-build-site");
    await next(page).click();

    await page.getByPlaceholder("Maria").fill("Maria");
    await page.getByPlaceholder("you@email.com").fill("maria@example.com");
    await shot(page, "hostB-step4-plan");
    await page.getByRole("button", { name: /Publish/ }).click();

    await expect(page.getByText("You're live!")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/build your booking website/i)).toBeVisible();
    await shot(page, "hostB-live");
    console.log("  PASS: Host B live with website-build confirmation");
  });
});
