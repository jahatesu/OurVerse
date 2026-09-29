import { expect, test, type Page } from "@playwright/test";

const titles = [
  "Open when I’m mad",
  "Open when you’re mad at me",
  "Open when you’re sad",
  "Open when you’re stressed",
  "Open when you miss me badly",
  "Open when we got in a fight",
  "Open when I’m distant",
  "Open when you need motivation",
  "Open when you need to remember how much I love you",
  "Open when you’re having a bad day",
  "Open when you’re feeling insecure",
  "Open when you’re jealous",
  "Our First Anniversary",
  "A Birthday Wish for You",
] as const;

async function enterUnlockedLetters(page: Page) {
  await page.goto("/#letters");
  await page.getByRole("button", { name: /Enter OurVerse/ }).click();
  await expect(page.locator(".letters-sanctuary")).toBeVisible();
  await page.keyboard.press("Alt+Shift+D");
  await page.getByRole("button", { name: "Unlock all / full universe" }).click();
  await page.evaluate(() => { location.hash = "letters"; });
  await expect(page.locator(".letters-sanctuary")).toBeVisible();
  await expect(page.locator(".ls-letter")).toHaveCount(14);
}

async function openLetter(page: Page, title: string) {
  const envelope = page.getByRole("button", { name: title, exact: true });
  await envelope.scrollIntoViewIfNeeded();
  const scrollY = await page.evaluate(() => window.scrollY);
  await envelope.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 5000 });
  await expect(dialog.getByRole("button", { name: "Close letter" })).toBeVisible();
  await page.waitForTimeout(950);
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const paper = dialog.locator(".ol-paper");
  await expect(paper).toBeVisible();
  const bounds = await paper.boundingBox();
  const viewport = page.viewportSize();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(-2);
  expect(bounds!.y).toBeGreaterThanOrEqual(-2);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 2);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 2);
  expect(await paper.evaluate((node) => node.scrollWidth <= node.clientWidth + 2)).toBe(true);
  const bodyText = dialog.locator(".ol-letter-body p").first();
  if (await bodyText.count()) {
    const color = await bodyText.evaluate((node) => getComputedStyle(node).color);
    expect(["rgb(53, 40, 45)", "rgb(43, 32, 37)"]).toContain(color);
  }
  return { dialog, paper, envelope, scrollY };
}

async function reachBottom(paper: ReturnType<Page["locator"]>) {
  await paper.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  expect(await paper.evaluate((node) => node.scrollTop + node.clientHeight >= node.scrollHeight - 2)).toBe(true);
}

async function closeLetter(page: Page, previousScrollY?: number) {
  await page.getByRole("button", { name: "Close letter" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 3000 });
  if (previousScrollY !== undefined) {
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - previousScrollY)).toBeLessThanOrEqual(2);
  }
}

test.describe("#letters focused QA", () => {
  test.setTimeout(240_000);

  test("hub mapping, clickability, scroll preservation, and responsive usability", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await enterUnlockedLetters(page);

    for (const title of titles) await expect(page.getByRole("button", { name: title, exact: true })).toBeEnabled();
    expect(await page.locator(".ls-letter").evaluateAll((nodes) => nodes.every((node) => {
      const label = node.querySelector(".ls-written-label")!.getBoundingClientRect();
      const shell = node.querySelector(".ls-envelope-shell")!.getBoundingClientRect();
      return label.left >= shell.left - 2 && label.right <= shell.right + 2 && label.top >= shell.top - 2 && label.bottom <= shell.bottom + 2;
    }))).toBe(true);

    for (const viewport of [
      { width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 768, height: 1024 },
      { width: 430, height: 932 }, { width: 390, height: 844 }, { width: 360, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      await expect(page.locator(".ls-letter")).toHaveCount(14);
      expect(await page.locator(".ls-letter").evaluateAll((nodes) => nodes.every((node) => {
        const box = node.getBoundingClientRect();
        return box.width > 80 && box.left >= -2 && box.right <= document.documentElement.scrollWidth + 2;
      }))).toBe(true);
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    const opened = await openLetter(page, titles[11]);
    await expect(opened.dialog.getByRole("heading", { name: "you’re jealous" })).toBeVisible();
    await reachBottom(opened.paper);
    await closeLetter(page, opened.scrollY);
    expect(errors).toEqual([]);
  });

  test("anger, response choices, sad letter, and stress button", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await enterUnlockedLetters(page);

    let opened = await openLetter(page, titles[0]);
    await expect(opened.dialog.locator(".ol-anger-gauge strong")).toHaveText("100%");
    for (const [button, level] of [["TRY TO MAKE IT UP TO HER", "75%"], ["TRY HARDER", "40%"], ["KEEP GOING", "10%"], ["FINAL ATTEMPT", "0%"]] as const) {
      await opened.dialog.getByRole("button", { name: button }).click();
      await expect(opened.dialog.locator(".ol-anger-gauge strong")).toHaveText(level);
    }
    await expect(opened.dialog.getByText("JANNA HAS BEEN SUCCESSFULLY DE-ANGRIFIED.")).toBeVisible();
    await expect(opened.dialog.getByText("warning: results may vary depending on what you actually did.")).toBeVisible();
    await expect(opened.dialog.getByText("now text me this so i know you read my letter:")).toBeVisible();
    await closeLetter(page);
    opened = await openLetter(page, titles[0]);
    await expect(opened.dialog.locator(".ol-anger-gauge strong")).toHaveText("100%");
    await closeLetter(page);

    opened = await openLetter(page, titles[1]);
    const choices = [
      ["I NEED SOME SPACE", "okay, my love. take all the time you need. i’ll still be here when you’re ready."],
      ["I WANT TO TALK ABOUT IT", "come talk to me. i promise i’ll listen first. no arguing, no interrupting, just you and me figuring this out."],
      ["I JUST WANT MY GIRLFRIEND", "come here, baby. argument temporarily suspended. you are now entitled to one very long janna hug."],
      ["I'M STILL MAD AT YOU", "please allow 1–3 business kisses for processing."],
    ] as const;
    for (const [choice, response] of choices) {
      await opened.dialog.getByRole("button", { name: choice }).click();
      await expect(opened.dialog.getByText(response)).toBeVisible({ timeout: 2000 });
      await expect(opened.dialog.locator(".ol-need-response")).toHaveCount(1);
      await page.waitForTimeout(320);
    }
    await expect(opened.dialog.getByText("PENDING", { exact: true })).toBeVisible();
    await closeLetter(page);
    opened = await openLetter(page, titles[1]);
    await expect(opened.dialog.locator(".ol-need-response")).toHaveCount(0);
    await closeLetter(page);

    opened = await openLetter(page, titles[2]);
    await opened.dialog.getByRole("button", { name: "Find Janna's hidden heart" }).click();
    await expect(opened.dialog.getByText("you found one of my kisses.")).toBeVisible();
    const checks = opened.dialog.locator(".ol-prescription button");
    await expect(checks).toHaveCount(7);
    await checks.nth(0).click();
    await checks.nth(3).click();
    await expect(checks.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(checks.nth(3)).toHaveAttribute("aria-pressed", "true");
    await expect(checks.nth(1)).toHaveAttribute("aria-pressed", "false");
    await reachBottom(opened.paper);
    await closeLetter(page);

    opened = await openLetter(page, titles[3]);
    const stress = opened.dialog.getByRole("button", { name: "Press the stress button" });
    await stress.dblclick();
    await expect(opened.dialog.locator(".ol-stress-fortune")).toHaveCount(1);
    const first = await opened.dialog.locator(".ol-stress-fortune p").innerText();
    await page.waitForTimeout(450);
    await stress.click();
    await page.waitForTimeout(450);
    await expect(opened.dialog.locator(".ol-stress-fortune")).toHaveCount(1);
    expect(await opened.dialog.locator(".ol-stress-fortune p").innerText()).not.toBe(first);
    await closeLetter(page);
    expect(errors).toEqual([]);
  });

  test("distance, fight, reconnect, motivation, and calculator sequences", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await enterUnlockedLetters(page);

    let opened = await openLetter(page, titles[4]);
    await opened.dialog.getByRole("button", { name: "TAP TO BRING JANNA CLOSER" }).click();
    for (const step of ["1000 miles...", "500 miles...", "100 miles...", "10 miles...", "1 mile...", "0 miles."]) {
      await expect(opened.dialog.locator(".ol-distance-scene > b")).toHaveText(step, { timeout: 1500 });
    }
    await expect(opened.dialog.getByRole("button", { name: "0 miles apart ♡" })).toBeVisible({ timeout: 2000 });
    await closeLetter(page);

    opened = await openLetter(page, titles[5]);
    const fix = opened.dialog.getByRole("button", { name: /FIX IT/ });
    await fix.dblclick();
    await expect(opened.dialog.getByText("JANNA + JOSH")).toBeVisible({ timeout: 4000 });
    await expect(opened.dialog.getByText("THE PROBLEM")).toBeVisible();
    await expect(opened.dialog.locator(".ol-fight-team-label")).toHaveCount(1);
    await closeLetter(page);

    opened = await openLetter(page, titles[6]);
    await opened.dialog.getByRole("button", { name: "RECONNECT" }).dblclick();
    await expect(opened.dialog.getByText("searching for josh...")).toBeVisible();
    await expect(opened.dialog.getByText("found him.")).toBeVisible({ timeout: 1500 });
    await expect(opened.dialog.getByText("restoring connection...")).toBeVisible({ timeout: 1500 });
    await expect(opened.dialog.locator(".ol-signal-receipt")).toContainText("connection:STRONG", { timeout: 5000 });
    await expect(opened.dialog.locator(".ol-signal-receipt")).toContainText("love:STILL HERE");
    await expect(opened.dialog.locator(".ol-signal-receipt")).toContainText("janna:probably just in her head again");
    await closeLetter(page);

    opened = await openLetter(page, titles[7]);
    await opened.dialog.getByRole("button", { name: "GET A JANNA BOOST" }).dblclick();
    for (const level of ["25%", "50%", "75%", "99%", "100% — JOSH IS SO BACK."]) {
      await expect(opened.dialog.locator(".ol-battery-status")).toContainText(level, { timeout: 1800 });
    }
    await expect(opened.dialog.getByRole("button", { name: "BOOST AGAIN" })).toBeVisible();
    await opened.dialog.getByRole("button", { name: "BOOST AGAIN" }).click();
    await expect(opened.dialog.locator(".ol-battery-status")).toContainText("25%", { timeout: 1800 });
    await closeLetter(page);

    opened = await openLetter(page, titles[8]);
    await opened.dialog.getByRole("button", { name: "CALCULATE" }).dblclick();
    await expect(opened.dialog.getByText("ERROR: NUMBER TOO LARGE")).toBeVisible({ timeout: 8000 });
    await expect(opened.dialog.getByText("unable to calculate.")).toBeVisible();
    await expect(opened.dialog.locator(".ol-love-machine")).toHaveCount(1);
    await closeLetter(page);
    expect(errors).toEqual([]);
  });

  test("bad day, mirror, and applications sequences", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await enterUnlockedLetters(page);

    for (const confirmation of ["YES", "HELL YES"] as const) {
      const opened = await openLetter(page, titles[9]);
      await opened.dialog.getByRole("button", { name: "DELETE THIS DAY" }).dblclick();
      await expect(opened.dialog.getByText("are you sure you want to delete this shitty day?")).toBeVisible();
      await opened.dialog.getByRole("button", { name: confirmation, exact: true }).dblclick();
      await expect(opened.dialog.getByText("TODAY HAS BEEN MOVED TO TRASH.")).toBeVisible({ timeout: 8000 });
      await expect(opened.dialog.getByText("there. gone.")).toBeVisible();
      await expect(opened.dialog.locator(".ol-day-bin")).toBeVisible();
      await closeLetter(page);
    }

    let opened = await openLetter(page, titles[10]);
    await expect(opened.dialog.locator("video, canvas")).toHaveCount(0);
    await opened.dialog.getByRole("button", { name: /LOOK AT YOURSELF/ }).dblclick();
    await expect(opened.dialog.getByText("handsome: yes")).toBeVisible({ timeout: 2500 });
    await expect(opened.dialog.getByText("perfect: no")).toBeVisible({ timeout: 4500 });
    await expect(opened.dialog.getByText("needs to be perfect: never")).toBeVisible({ timeout: 3500 });
    await expect(opened.dialog.getByText("loved by janna: more than he realizes")).toBeVisible({ timeout: 2500 });
    await expect(opened.dialog.getByText("there. much more accurate.")).toBeVisible({ timeout: 2500 });
    await closeLetter(page);

    opened = await openLetter(page, titles[11]);
    await opened.dialog.getByRole("button", { name: "CHECK CURRENT APPLICANTS" }).dblclick();
    await expect(opened.dialog.getByText("applicants found: 1")).toBeVisible({ timeout: 3000 });
    await expect(opened.dialog.locator(".ol-josh-application")).toContainText("status:hired", { timeout: 3000 });
    await expect(opened.dialog.locator(".ol-josh-application")).toContainText("position:boyfriend");
    await expect(opened.dialog.locator(".ol-josh-application")).toContainText("contract:permanent");
    await expect(opened.dialog.locator(".ol-josh-application")).toContainText("replacement needed:no");
    await expect(opened.dialog.locator(".ol-josh-application")).toContainText("janna interested in accepting new applicants:absolutely not");
    await expect(opened.dialog.getByText("HIRED", { exact: true })).toBeVisible();
    await expect(opened.dialog.locator(".ol-applications-closed")).toBeVisible({ timeout: 4000 });
    await closeLetter(page);
    expect(errors).toEqual([]);
  });

  test("special letters, confetti lifecycle, reset behavior, and close during animation", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await enterUnlockedLetters(page);

    let opened = await openLetter(page, titles[0]);
    await page.waitForTimeout(1300);
    await expect(opened.dialog.locator(".ol-special-confetti")).toHaveCount(0);
    await closeLetter(page);

    opened = await openLetter(page, titles[12]);
    await expect(opened.dialog.locator(".ol-special-confetti-anniversary")).toBeVisible({ timeout: 2000 });
    await expect(opened.dialog.locator(".ol-special-confetti")).toHaveCSS("pointer-events", "none");
    await expect(opened.dialog.getByRole("button", { name: "Close letter" })).toBeEnabled();
    await opened.dialog.getByRole("button", { name: "COMPLETE YEAR ONE" }).dblclick();
    await expect(opened.dialog.locator(".ol-year-one-stamp")).toBeVisible({ timeout: 2500 });
    await opened.dialog.getByRole("button", { name: /turn the page/ }).dblclick();
    await expect(opened.dialog.getByText("status: locked")).toBeVisible({ timeout: 1800 });
    await opened.dialog.getByRole("button", { name: "UNLOCK WITH JANNA" }).dblclick();
    await expect(opened.dialog.getByText("YEAR TWO UNLOCKED.")).toBeVisible({ timeout: 7000 });
    await expect(opened.dialog.getByText("to be continued...")).toBeVisible();
    await expect(opened.dialog.locator(".ol-special-confetti")).toHaveCount(0, { timeout: 6000 });
    await closeLetter(page);
    opened = await openLetter(page, titles[12]);
    await expect(opened.dialog.locator(".ol-special-confetti-anniversary")).toBeVisible({ timeout: 2000 });
    await expect(opened.dialog.getByRole("button", { name: "COMPLETE YEAR ONE" })).toBeVisible();
    await closeLetter(page);

    opened = await openLetter(page, titles[13]);
    await expect(opened.dialog.locator(".ol-special-confetti-birthday")).toBeVisible({ timeout: 2000 });
    await opened.dialog.getByRole("button", { name: "MAKE A WISH" }).dblclick();
    await expect(opened.dialog.getByText("final wish selected.")).toBeVisible({ timeout: 6000 });
    await expect(opened.dialog.getByText(/i wish that this year brings you closer/)).toBeVisible({ timeout: 2500 });
    await expect(opened.dialog.locator(".ol-birthday-fortune")).toHaveCount(1);
    await closeLetter(page);

    opened = await openLetter(page, titles[10]);
    await opened.dialog.getByRole("button", { name: /LOOK AT YOURSELF/ }).click();
    await page.waitForTimeout(400);
    await closeLetter(page);
    opened = await openLetter(page, titles[10]);
    await expect(opened.dialog.getByRole("button", { name: /LOOK AT YOURSELF/ })).toBeEnabled();
    await closeLetter(page);
    await page.waitForTimeout(7000);
    expect(errors).toEqual([]);
  });
});
