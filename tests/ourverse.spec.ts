import { expect, test, type Page } from "@playwright/test";

async function enter(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter OurVerse" }).click();
  await expect(
    page.getByRole("heading", { name: "Somewhere, just us." }),
  ).toBeVisible();
}
async function navigate(page: Page, name: string) {
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name, exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
}

test("intro, navigation, photos, letters, local persistence, and responsive layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await enter(page);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-home.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await navigate(page, "Mini Janna");
  await page
    .locator(".companion-actions")
    .getByRole("button", { name: "Hug", exact: true })
    .click();
  await navigate(page, "Memories");
  await page.getByRole("button", { name: "Calls", exact: true }).click();
  await expect(page.locator(".memory-grid .polaroid")).toHaveCount(1);
  await page.locator(".memory-grid .polaroid").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await navigate(page, "Letters");
  await page.getByRole("button", { name: "Open when you miss me" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".letter-paper")).toContainText("My Josh");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await navigate(page, "Love");
  await page.getByRole("button", { name: "Reveal a reason" }).click();
  await expect(page.locator(".reason-count")).toContainText("1");
  await page.reload();
  await expect(page.locator(".reason-count")).toContainText("1");
  await navigate(page, "Our World");
  await expect(page.locator(".local-time").first()).toContainText(/\d+:\d+/);
  await navigate(page, "Mini Janna");
  await page
    .getByRole("textbox", { name: "Message Mini Janna" })
    .fill("I miss you");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".chat-message")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("quiz scoring, roulette, memory matching, and arcade input", async ({
  page,
}, testInfo) => {
  await enter(page);
  await navigate(page, "Game Room");
  await page
    .getByRole("button", { name: /How well do you know Janna/ })
    .click();
  for (const [i, answer] of [
    "April 21, 2026",
    "The Philippines",
    "At least another hour",
    "All of the above",
    "Teleportation",
  ].entries()) {
    await page.getByRole("button", { name: new RegExp(answer) }).click();
    await page
      .getByRole("button", {
        name: i === 4 ? "See my results" : "Next question",
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Boyfriend privileges maintained" }),
  ).toBeVisible();
  await expect(page.locator(".game-result")).toContainText("5 / 5");
  await page.getByRole("button", { name: "Back to the game room" }).click();
  await page.getByRole("button", { name: /Date Roulette/ }).click();
  await page.getByRole("button", { name: "Spin our next adventure" }).click();
  await expect(page.locator(".roulette-result h3")).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole("button", { name: "Back to the game room" }).click();
  await page.getByRole("button", { name: /Memory Match/ }).click();
  const cards = page.locator(".match-card");
  const seen = new Map<string, number[]>();
  for (let i = 0; i < 12; i += 2) {
    await cards.nth(i).click();
    await cards.nth(i + 1).click();
    for (const index of [i, i + 1]) {
      const symbol = (await cards.nth(index).innerText()).trim();
      seen.set(symbol, [...(seen.get(symbol) ?? []), index]);
    }
    await expect
      .poll(async () => {
        const classes = await cards.nth(i).getAttribute("class");
        return classes?.includes("matched") || !classes?.includes("revealed");
      })
      .toBe(true);
  }
  for (const indices of seen.values()) {
    if (
      !(await cards.nth(indices[0]).getAttribute("class"))?.includes("matched")
    ) {
      await cards.nth(indices[0]).click();
      await cards.nth(indices[1]).click();
      await expect(cards.nth(indices[0])).toHaveClass(/matched/);
    }
  }
  await expect(page.locator(".win-banner")).toBeVisible();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-memory-win.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(page.locator(".matched")).toHaveCount(0);
  await page.getByRole("button", { name: "Back to the game room" }).click();
  await page.getByRole("button", { name: /Catch My Hearts/ }).click();
  await page.getByRole("button", { name: "Let’s catch hearts" }).click();
  await expect(page.locator(".falling-heart").first()).toBeVisible();
  const basket = page.locator(".heart-basket");
  const before = await basket.getAttribute("style");
  if (testInfo.project.name === "desktop") {
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(250);
    await page.keyboard.up("ArrowRight");
  } else {
    const box = await page.locator(".catch-arena").boundingBox();
    await page.touchscreen.tap(
      box!.x + box!.width * 0.8,
      box!.y + box!.height * 0.8,
    );
  }
  expect(await basket.getAttribute("style")).not.toEqual(before);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeVisible();
});

test("vault password, no autoplay, and final ending", async ({ page }) => {
  await enter(page);
  await navigate(page, "The Secret Vault");
  await page.getByLabel("Secret vault password").fill("incorrect");
  await page.getByRole("button", { name: "Unlock the vault" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Not quite" }),
  ).toBeVisible();
  await page.getByLabel("Secret vault password").fill("04212026");
  await page.getByRole("button", { name: "Unlock the vault" }).click();
  await expect(
    page.getByRole("heading", { name: "You’ve always had the key" }),
  ).toBeVisible();
  for (const name of [
    "Our Story",
    "Memories",
    "Letters",
    "Love",
    "Music",
    "Our World",
  ])
    await navigate(page, name);
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("ourverse-v1")!);
    saved.discoveries = Array.from(
      { length: 14 },
      (_, i) => `tested-discovery-${i}`,
    );
    localStorage.setItem("ourverse-v1", JSON.stringify(saved));
  });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "One more little secret" }),
  ).toBeVisible();
  expect(
    await page.locator("audio").evaluate((el: HTMLAudioElement) => el.paused),
  ).toBe(true);
  await page.getByRole("button", { name: "One more little secret" }).click();
  for (let i = 0; i < 7; i++)
    await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.locator(".ending")).toContainText(
    "because I made it for you",
  );
});
