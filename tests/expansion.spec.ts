import { test, expect, type Page } from "@playwright/test";
import { crossword, codePuzzles } from "../src/data/expansion";
test.beforeEach(()=>{test.setTimeout(90000)});
async function enter(page: Page, id = "home") {
  await page.goto(`/#${id}`);
  await page.getByRole("button", { name: "Enter OurVerse" }).click();
  await expect(page.locator("main")).toBeVisible();
}
async function go(page: Page, id: string) {
  await page.evaluate((id) => {
    location.hash = id;
  }, id);
  await expect(page.locator(`.world-${id}`)).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}
test("galaxy destinations, home hotspots, both mascots and world presentation", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await enter(page);
  await expect(page.locator(".galaxy-destination")).toHaveCount(9);
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/${info.project.name}-galaxy.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: /Our Home leave/ }).click();
  await expect(page.locator(".cozy-room")).toBeVisible();
  await expect(page.locator(".room-object")).toHaveCount(10);
  await expect(page.locator(".room-residents .character-janna")).toBeVisible();
  await expect(page.locator(".room-residents .character-josh")).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/${info.project.name}-room.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Laptop — messages" }).click();
  await expect(page.locator(".conversation .chat-message")).toHaveCount(3);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".conversation img")).toBeVisible();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await go(page, "memories");
  await expect(page.locator(".scrapbook")).toBeVisible();
  await page.screenshot({
    path: `test-results/${info.project.name}-scrapbook.png`,
    fullPage: true,
  });
  await go(page, "story");
  await page.locator(".timeline-item").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await go(page, "world");
  await expect(page.locator(".timezone-card .character")).toHaveCount(2);
  await noOverflow(page);
  await go(page, "music");
  expect(
    await page.locator("audio").evaluate((a: HTMLAudioElement) => a.paused),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Play music", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "little silence" }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("love interactions, companion pokes, coupons and persisted discoveries", async ({
  page,
}) => {
  await enter(page, "love");
  await page.getByRole("button", { name: "Your voice", exact: true }).click();
  await expect(page.locator(".trait-message")).toContainText("miles go quiet");
  await noOverflow(page);
  await page.getByRole("button", { name: "Hold my hand" }).click();
  const hand = page.getByRole("button", { name: "Hold Janna’s hand" });
  await page.clock.install();
  await hand.focus();
  await page.keyboard.down("Space");
  await page.clock.runFor(21000);
  await expect(page.locator(".hold-experience")).toContainText(
    "I love you, Josh.",
  );
  await page.keyboard.up("Space");
  await page.clock.resume();
  await expect(page.locator(".hold-experience")).toContainText("come back :(");
  await go(page, "heartbeat");
  await page.getByRole("button", { name: "Tap my heart" }).click();
  await expect(page.locator(".emotional-line")).toHaveText("you");
  await go(page, "companion");
  for (let i = 0; i < 5; i++)
    await page
      .locator(".companion-actions")
      .getByRole("button", { name: "Annoy" })
      .click();
  await expect(page.locator(".companion-bubble")).toContainText(
    "STOP POKING ME",
  );
  await page
    .locator(".companion-actions")
    .getByRole("button", { name: "Kiss", exact: true })
    .click();
  await expect(page.locator(".avatar-stage .couple-kiss")).toBeVisible();
  await page
    .locator(".couple-playground")
    .getByRole("button", { name: "hoodie", exact: true })
    .click();
  await expect(page.locator(".couple-playground")).toContainText("mine now.");
  await go(page, "coupons");
  await page
    .locator(".love-ticket")
    .first()
    .getByRole("button", { name: "Redeem", exact: true })
    .click();
  await page.getByRole("button", { name: "Never mind" }).click();
  await expect(page.locator(".redeemed")).toHaveCount(0);
  await page
    .locator(".love-ticket")
    .first()
    .getByRole("button", { name: "Redeem", exact: true })
    .click();
  await page.getByRole("button", { name: "Give me my kiss" }).click();
  await expect(page.locator(".couple-kiss")).toBeVisible();
  await page.reload();
  await expect(
    page.locator(".love-ticket").first().getByRole("button"),
  ).toBeDisabled();
  const save = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ourverse-v1")!),
  );
  expect(save.discoveries).toContain("coupon");
  expect(save.unlocked).toContain("professional-annoyer");
});
test("photo puzzle at every difficulty and real intersecting crossword", async ({
  page,
}, info) => {
  await enter(page, "games");
  await page.getByRole("button", { name: /Piece of Us/ }).click();
  for (const size of [3, 4, 5]) {
    await page.getByLabel("Difficulty").selectOption(String(size));
    const tiles = page.locator(".photo-pieces button");
    await expect(tiles).toHaveCount(size * size);
    for (let i = 0; i < size * size; i++) {
      const labels = await tiles.evaluateAll((els) =>
        els.map((el) => el.getAttribute("aria-label")!),
      );
      const current = Number(labels[i].match(/piece (\d+)/)![1]) - 1;
      if (current === i) continue;
      const source = labels.findIndex(
        (l) => Number(l.match(/piece (\d+)/)![1]) - 1 === i,
      );
      await tiles.nth(i).click();
      await tiles.nth(source).click();
    }
    await expect(
      page.getByRole("heading", { name: "YOU FIXED US" }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Back to the game room" }).click();
  await page.getByRole("button", { name: /OurVerse Crossword/ }).click();
  const expected = new Map<string, string>();
  for (const e of crossword.entries)
    for (let i = 0; i < e.answer.length; i++) {
      const row = e.row + (e.direction === "down" ? i : 0),
        col = e.col + (e.direction === "across" ? i : 0);
      const key = `${row}-${col}`;
      if (expected.has(key)) expect(expected.get(key)).toBe(e.answer[i]);
      expected.set(key, e.answer[i]);
    }
  for (const [key, letter] of expected) {
    const [r, c] = key.split("-").map(Number);
    await page
      .getByRole("textbox", {
        name: new RegExp(`^Row ${r + 1}, column ${c + 1}(,|$)`),
      })
      .fill(letter);
  }
  await expect(
    page.getByRole("heading", { name: "Turns out you really do know us." }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/${info.project.name}-crossword.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Reset crossword" }).click();
  await expect(page.locator(".game-result")).toHaveCount(0);
});
test("code fragments unlock the vault, kiss scoring and quote game", async ({
  page,
}) => {
  await enter(page, "games");
  await page.getByRole("button", { name: /Crack the Code/ }).click();
  for (const p of codePuzzles) {
    await page.getByLabel("Decoded message").fill(p.answer);
    await page.getByRole("button", { name: "Submit answer" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "ACCESS GRANTED" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /Crack the Code/ }).click();
  await expect(
    page.getByRole("heading", { name: "ACCESS GRANTED" }),
  ).toBeVisible();
  await go(page, "vault");
  await expect(
    page.getByRole("heading", { name: "You’ve always had the key" }),
  ).toBeVisible();
  await go(page, "games");
  await page.getByRole("button", { name: /Kiss Attack/ }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "Start Kiss Attack" }).click();
  await page.getByRole("button", { name: "Catch kiss", exact: true }).click();
  await page.clock.runFor(22000);
  await page.clock.resume();
  await expect(page.locator(".kiss-arena")).toContainText(
    "Janna owes you 1 real kisses.",
  );
  await expect(page.locator(".game-score")).toContainText("19 missed");
  await page.getByRole("button", { name: "Back to the game room" }).click();
  await page.getByRole("button", { name: /Who Said It/ }).click();
  for (const name of ["Janna", "Josh", "Janna", "Josh"]) {
    await page
      .locator(".speaker-choices")
      .getByRole("button", { name, exact: false })
      .click();
    await page.getByRole("button", { name: "Next quote" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "4 / 4 little memories" }),
  ).toBeVisible();
});
test("calendar, garden, wishes, future memories, date locks and hidden extras", async ({
  page,
}, info) => {
  await enter(page, "daily");
  const note = await page.locator(".paper-message").innerText();
  await page.reload();
  await expect(page.locator(".paper-message")).toHaveText(note, {useInnerText:true});
  await go(page, "calendar");
  await page.getByRole("button", { name: "Next month" }).click();
  await page.locator(".calendar-grid button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await go(page, "mailbox");
  await page.getByRole("button", { name: "Open love mailbox" }).click();
  await expect(page.locator(".paper-message")).toBeVisible();
  await go(page, "jar");
  await page.getByRole("button", { name: "Shake the jar" }).click();
  await expect(page.locator(".paper-message")).toBeVisible();
  await go(page, "questions");
  await page.getByRole("button", { name: "Funny", exact: true }).click();
  await expect(page.locator(".emotional-line")).toContainText("worm");
  await go(page, "garden");
  await page.getByRole("button", { name: "Catch a shooting star" }).click();
  await page.getByLabel("A little someday").fill("Same timezone, someday");
  await page.getByRole("button", { name: "Keep it in our sky" }).click();
  await page.reload();
  await expect(page.locator(".wish-sky")).toContainText(
    "Same timezone, someday",
  );
  await go(page, "future");
  await page.getByRole("checkbox").first().check();
  await go(page, "memories");
  await expect(page.locator(".dream-memory")).toContainText(
    "Finally close the distance",
  );
  await go(page, "capsule");
  await expect(
    page.getByRole("button", { name: "Open time capsule" }),
  ).toBeDisabled();
  await go(page, "gifts");
  await expect(page.locator(".gift-box")).toBeDisabled();
  await go(page, "travel");
  await page
    .getByRole("button", { name: "Josh · Colorado", exact: true })
    .click();
  await expect(page.locator(".emotional-line")).toContainText(
    "Josh · Colorado",
  );
  await go(page, "generator");
  await page.getByRole("button", { name: "Consult the universe" }).click();
  await expect(page.locator(".future-result>div")).toHaveCount(6);
  await go(page, "press");
  for (let i = 0; i < 5; i++)
    await page
      .getByRole("button", { name: "DO NOT PRESS", exact: true })
      .click();
  await expect(
    page.getByRole("heading", { name: "I LOVE YOUUUUU" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /suspicious little console/ }).click();
  await expect(page.locator(".mission-terminal")).toContainText("999999%");
  await page
    .getByRole("button", { name: /Read relationship patch notes/ })
    .click();
  await expect(page.locator(".patch-notes")).toContainText(
    "Distance bug remains unresolved",
  );
  await noOverflow(page);
  await go(page, "sleep");
  await expect(page.locator(".couple-sleep")).toBeVisible();
  await go(page, "games");
  await page.screenshot({
    path: `test-results/${info.project.name}-arcade.png`,
    fullPage: true,
  });
});
test("cinematic reunion is fully navigable with reduced motion", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enter(page);
  await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem("ourverse-v1")!);
    p.discoveries = Array.from({ length: 14 }, (_, i) => `explored-${i}`);
    localStorage.setItem("ourverse-v1", JSON.stringify(p));
  });
  await page.reload();
  await page.getByRole("button", { name: "One more little secret" }).click();
  for (let i = 0; i < 10; i++)
    await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.locator(".cinematic-ending")).toContainText(
    "to be continued…",
  );
  await expect(page.locator(".cinematic-ending .couple-sit")).toBeVisible();
  await page.screenshot({
    path: `test-results/${info.project.name}-ending.png`,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
