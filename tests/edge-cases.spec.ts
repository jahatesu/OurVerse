import { expect, test, type Page } from "@playwright/test";

async function openSection(page: Page, id: string) {
  await page.goto(`/#${id}`);
  await page.getByRole("button", { name: "Enter OurVerse" }).click();
  await expect(page.locator("main")).toBeVisible();
}

test("all reasons unlock the vault and survive a reload", async ({ page }) => {
  await openSection(page, "love");
  const reveal = page.getByRole("button", { name: "Reveal a reason" });
  for (let i = 0; i < 100; i++) await reveal.click();
  await expect(
    page.getByRole("heading", {
      name: "You really thought there were only 100?",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "All 100, kept forever" }),
  ).toBeDisabled();
  await page.reload();
  await expect(page.locator(".reason-count")).toContainText("100");
  await page.goto("/#vault");
  await expect(
    page.getByRole("heading", { name: "You’ve always had the key" }),
  ).toBeVisible();
});

test("arcade collision, scoring, and achievement work through 20 catches", async ({
  page,
}) => {
  await openSection(page, "games");
  await page.getByRole("button", { name: /Catch My Hearts/ }).click();
  // Keep all hearts in the central lane, then exercise real frame updates and collisions.
  await page.evaluate(() => {
    Math.random = () => 0.5;
  });
  await page.clock.install();
  await page.getByRole("button", { name: "Let’s catch hearts" }).click();
  await page.clock.runFor(25000);
  await expect
    .poll(async () => page.locator(".game-score").innerText())
    .toMatch(/(?:2[0-9]|[3-9][0-9]) hearts caught/);
  await expect
    .poll(async () =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("ourverse-v1")!).unlocked,
      ),
    )
    .toContain("hearts");
});

test("reduced motion, date locks, dialog focus, and browser history", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openSection(page, "letters");
  await expect(
    page.getByRole("button", { name: /Our first anniversary/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Open when you miss me" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open when you miss me" }),
  ).toBeFocused();
  await page.goto("/#home");
  const mobile = page.getByRole("button", { name: "Open navigation" });
  await mobile.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Our Story", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The story of us." }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Somewhere, just us." }),
  ).toBeVisible();
});
