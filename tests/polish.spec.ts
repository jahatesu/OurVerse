import { test, expect } from "@playwright/test";

test("editorial layouts and character contact at desktop and mobile sizes", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter OurVerse" }).click();
  await expect(page.locator("main")).toBeVisible();
  for (const route of ["home", "room", "memories", "garden", "companion"]) {
    await page.evaluate((id) => {
      location.hash = id;
    }, route);
    await expect(page.locator(`.world-${route}`)).toBeVisible();
    await expect(page.locator(`.world-${route} h1`)).toBeVisible();
    await expect(page.locator(`.world-${route} > div`).first()).toHaveCSS(
      "opacity",
      "1",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${info.project.name}-polish-${route}.png`,
      fullPage: true,
    });
  }
  const stage = page.locator(".couple-playground");
  for (const scene of [
    "hold hands",
    "kiss",
    "hug",
    "dance",
    "walk",
    "celebrate",
    "sleep",
  ]) {
    await stage.getByRole("button", { name: scene, exact: true }).click();
    await expect(stage.locator(".character")).toHaveCount(2);
    if (scene === "hold hands" || scene === "dance") {
      const distance = await stage.evaluate((el) => {
        const a = el
          .querySelector(".character-janna .arm-right circle")!
          .getBoundingClientRect();
        const b = el
          .querySelector(".character-josh .arm-left circle")!
          .getBoundingClientRect();
        return Math.hypot(
          a.x + a.width / 2 - b.x - b.width / 2,
          a.y + a.height / 2 - b.y - b.height / 2,
        );
      });
      expect(distance).toBeLessThan(5);
    }
    await stage.screenshot({
      path: `test-results/${info.project.name}-pose-${scene.replace(" ", "-")}.png`,
    });
  }
  await page.evaluate(() => {
    location.hash = "games";
  });
  await page.getByRole("button", { name: /OurVerse Crossword/ }).click();
  await expect(page.locator(".crossword-grid")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/${info.project.name}-polish-crossword.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: /Janna Mode/ }).click();
  await page.getByRole("button", { name: "Flowering", exact: true }).click();
  await expect(page.locator(".plant-stage-svg-4")).toBeVisible();
  await page.screenshot({
    path: `test-results/${info.project.name}-polish-flowering.png`,
    fullPage: true,
  });
});
