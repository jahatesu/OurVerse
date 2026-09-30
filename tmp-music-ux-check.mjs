import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

async function enterMusic(page) {
  await page.goto("http://localhost:3000/#music", { waitUntil: "domcontentloaded" });
  const entrance = page.getByRole("button", { name: /Enter OurVerse/ });
  if (await entrance.waitFor({ timeout: 10000 }).then(() => true).catch(() => false)) {
    await entrance.click();
  }
  await page.getByRole("heading", { name: "The soundtrack of us." }).waitFor();
}

async function noteMetrics(page) {
  return page.evaluate(() => {
    const paper = document.querySelector(".music-janna-note");
    const body = document.querySelector(".music-note-body");
    if (!(paper instanceof HTMLElement) || !(body instanceof HTMLElement)) {
      throw new Error("Janna note was not rendered");
    }
    return {
      paperHeight: paper.getBoundingClientRect().height,
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      overflowY: getComputedStyle(body).overflowY,
      hasInternalScrollbar: body.scrollHeight > body.clientHeight + 1,
    };
  });
}

const notePage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
notePage.setDefaultTimeout(15000);
await notePage.route("https://open.spotify.com/embed/iframe-api/v1", (route) => route.abort());
await enterMusic(notePage);
const noteLengths = [];
for (let index = 0; index < 49; index += 1) {
  await notePage.locator(".music-track-list button").nth(index).evaluate((button) =>
    (button instanceof HTMLButtonElement ? button.click() : undefined),
  );
  await notePage.waitForTimeout(20);
  noteLengths.push((await notePage.locator(".music-note-body p").textContent())?.length ?? 0);
}
const shortestIndex = noteLengths.indexOf(Math.min(...noteLengths));
const longestIndex = noteLengths.indexOf(Math.max(...noteLengths));
const sortedNoteIndexes = noteLengths
  .map((length, index) => ({ length, index }))
  .sort((a, b) => a.length - b.length);
const mediumIndex = sortedNoteIndexes[Math.floor(sortedNoteIndexes.length / 2)].index;

async function layoutMetrics(page, index) {
  await page.locator(".music-track-list button").nth(index).evaluate((button) =>
    (button instanceof HTMLButtonElement ? button.click() : undefined),
  );
  await page.waitForTimeout(50);
  return page.evaluate((selectedIndex) => {
    const selectors = {
      environment: ".music-environment",
      rightCorner: ".music-right-corner",
      note: ".music-janna-note",
      noteBody: ".music-note-body",
      playlist: ".music-playlist",
      trackList: ".music-track-list",
      spotify: ".music-spotify-surface",
      lowerScene: ".music-cozy-corner",
    };
    const elements = Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) throw new Error(`${selector} was not rendered`);
      return [key, element];
    }));
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { top: bounds.top, right: bounds.right, bottom: bounds.bottom, left: bounds.left, width: bounds.width, height: bounds.height };
    };
    const boxes = Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, rect(element)]));
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const floorHeight = Number.parseFloat(getComputedStyle(elements.environment, "::before").height);
    const floorTop = boxes.environment.bottom - floorHeight;
    return {
      index: selectedIndex + 1,
      boxes,
      noteOverflowY: getComputedStyle(elements.noteBody).overflowY,
      noteHasScrollbar: elements.noteBody.scrollHeight > elements.noteBody.clientHeight + 1,
      environmentContainsRightColumn: boxes.rightCorner.bottom <= boxes.environment.bottom + 1,
      playlistContainsSpotify: boxes.spotify.top >= boxes.trackList.bottom && boxes.spotify.bottom <= boxes.playlist.bottom + 1,
      playlistAboveFloor: boxes.playlist.bottom <= floorTop + 1,
      lowerSceneFollowsPlaylist: boxes.lowerScene.top >= boxes.playlist.bottom,
      lowerSceneGap: boxes.lowerScene.top - boxes.playlist.bottom,
      playlistOverlapsLowerScene: overlaps(boxes.playlist, boxes.lowerScene),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  }, index);
}

async function desktopCompositionMetrics(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.locator(".music-track-list button").nth(0).evaluate((button) =>
    (button instanceof HTMLButtonElement ? button.click() : undefined),
  );
  await page.locator(".music-track-list").evaluate((list) => {
    list.style.scrollBehavior = "auto";
    list.scrollTop = 0;
  });
  await page.waitForTimeout(100);
  const metrics = await page.evaluate(() => {
    const bounds = (selector) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) throw new Error(`${selector} was not rendered`);
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
    };
    const listBounds = document.querySelector(".music-track-list")?.getBoundingClientRect();
    const rowBounds = [...document.querySelectorAll(".music-track-list button")].map((row) => row.getBoundingClientRect());
    const noteBody = document.querySelector(".music-note-body");
    const title = document.querySelector(".music-now-playing h2");
    if (!(noteBody instanceof HTMLElement) || !(title instanceof HTMLElement)) throw new Error("Music content was not rendered");
    const titleStyle = getComputedStyle(title);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      heading: bounds(".music-night-heading"),
      environment: bounds(".music-environment"),
      recordPlayer: bounds(".music-record-player"),
      note: bounds(".music-janna-note"),
      playlist: bounds(".music-playlist"),
      playlistHeading: bounds(".music-playlist > h2"),
      playlistDescription: bounds(".music-playlist-dedication"),
      firstRow: bounds(".music-track-list button"),
      visiblePlaylistRows: listBounds ? rowBounds.filter((row) => row.top < Math.min(innerHeight, listBounds.bottom) && row.bottom > listBounds.top).length : 0,
      fullyVisiblePlaylistRows: listBounds ? rowBounds.filter((row) => row.top >= listBounds.top && row.bottom <= Math.min(innerHeight, listBounds.bottom)).length : 0,
      noteHasScrollbar: noteBody.scrollHeight > noteBody.clientHeight + 1,
      noteOverflowY: getComputedStyle(noteBody).overflowY,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      titleLines: Math.round(title.scrollHeight / Number.parseFloat(titleStyle.lineHeight)),
      titleClipped: title.scrollHeight > title.clientHeight + 1,
    };
  });
  await page.locator(".music-track-list button").nth(6).evaluate((button) =>
    (button instanceof HTMLButtonElement ? button.click() : undefined),
  );
  await page.waitForTimeout(50);
  const longTitle = await page.locator(".music-now-playing h2").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      text: element.textContent,
      lines: Math.round(element.scrollHeight / Number.parseFloat(style.lineHeight)),
      clipped: element.scrollHeight > element.clientHeight + 1,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    };
  });
  await page.locator(".music-track-list button").nth(0).evaluate((button) =>
    (button instanceof HTMLButtonElement ? button.click() : undefined),
  );
  await page.locator(".music-track-list").evaluate((list) => {
    list.style.scrollBehavior = "auto";
    list.scrollTop = 0;
  });
  return { ...metrics, longTitle };
}

if (process.argv.includes("--desktop-composition")) {
  const desktopComposition = {};
  for (const [width, height] of [[1366, 768], [1440, 900], [1920, 1080]]) {
    desktopComposition[`${width}x${height}`] = await desktopCompositionMetrics(notePage, width, height);
    if (process.argv.includes("--screenshot")) {
      await notePage.screenshot({ path: `tmp-music-${width}x${height}.png`, fullPage: true });
    }
  }
  process.stdout.write(JSON.stringify(desktopComposition, null, 2));
  await browser.close();
  process.exit(0);
}

const layouts = {
  short: await layoutMetrics(notePage, shortestIndex),
  medium: await layoutMetrics(notePage, mediumIndex),
  long: await layoutMetrics(notePage, longestIndex),
};
if (process.argv.includes("--screenshot")) {
  await notePage.screenshot({ path: "tmp-music-layout.png", fullPage: true });
}
const responsiveLayouts = {};
for (const width of [1024, 720]) {
  await notePage.setViewportSize({ width, height: 1000 });
  responsiveLayouts[width] = {
    short: await layoutMetrics(notePage, shortestIndex),
    medium: await layoutMetrics(notePage, mediumIndex),
    long: await layoutMetrics(notePage, longestIndex),
  };
}
await notePage.setViewportSize({ width: 1440, height: 1000 });

for (const [length, result] of Object.entries(layouts)) {
  if (
    result.noteHasScrollbar ||
    result.noteOverflowY !== "visible" ||
    !result.environmentContainsRightColumn ||
    !result.playlistContainsSpotify ||
    !result.playlistAboveFloor ||
    !result.lowerSceneFollowsPlaylist ||
    result.lowerSceneGap > 80 ||
    result.playlistOverlapsLowerScene ||
    result.horizontalOverflow
  ) {
    throw new Error(`Desktop ${length} note layout failed containment checks`);
  }
}
for (const [width, results] of Object.entries(responsiveLayouts)) {
  for (const [length, result] of Object.entries(results)) {
    if (
      result.noteHasScrollbar ||
      result.noteOverflowY !== "visible" ||
      !result.environmentContainsRightColumn ||
      !result.playlistContainsSpotify ||
      result.playlistOverlapsLowerScene ||
      result.horizontalOverflow
    ) {
      throw new Error(`${width}px ${length} note layout failed containment checks`);
    }
  }
}
await notePage.locator(".music-track-list button").nth(shortestIndex).evaluate((button) =>
  (button instanceof HTMLButtonElement ? button.click() : undefined),
);
const shortNote = { index: shortestIndex + 1, ...(await noteMetrics(notePage)) };
await notePage.locator(".music-track-list button").nth(longestIndex).evaluate((button) =>
  (button instanceof HTMLButtonElement ? button.click() : undefined),
);
const longNote = { index: longestIndex + 1, ...(await noteMetrics(notePage)) };
await notePage.locator(".music-track-list button").nth(0).evaluate((button) =>
  (button instanceof HTMLButtonElement ? button.click() : undefined),
);
const lyricFontStyle = await notePage.locator(".music-note-body strong em").first().evaluate(
  (element) => getComputedStyle(element).fontStyle,
);
await notePage.locator(".music-track-list button").nth(5).evaluate((button) =>
  (button instanceof HTMLButtonElement ? button.click() : undefined),
);
const colorado = await notePage.locator(".music-note-strong-emphasis").evaluate((element) => ({
  text: element.textContent,
  weight: getComputedStyle(element).fontWeight,
  decoration: getComputedStyle(element).textDecorationLine,
}));
process.stderr.write("note checks complete\n");

if (process.argv.includes("--layout-only")) {
  process.stdout.write(JSON.stringify({ layouts, responsiveLayouts, shortNote, longNote, lyricFontStyle, colorado }, null, 2));
  await browser.close();
  process.exit(0);
}

const playbackPage = await browser.newPage();
playbackPage.setDefaultTimeout(15000);
const pageErrors = [];
playbackPage.on("pageerror", (error) => pageErrors.push(error.message));
playbackPage.on("console", (message) => {
  if (message.text().includes("[music-spotify]")) process.stderr.write(`${message.text()}\n`);
});
await enterMusic(playbackPage);
await playbackPage.locator(".music-spotify-surface iframe").waitFor({ timeout: 20000 });
await playbackPage.waitForTimeout(800);
process.stderr.write("spotify iframe ready\n");
const playerButton = playbackPage.locator(".music-record-player .play-button");
const vinyl = playbackPage.locator(".music-vinyl");
const initial = {
  label: await playerButton.getAttribute("aria-label"),
  spinning: await vinyl.evaluate((element) => element.classList.contains("playing")),
};

await playbackPage.locator(".music-track-list button").nth(1).click();
await playbackPage.waitForFunction(() =>
  document.querySelector(".music-record-player .play-button")?.getAttribute("aria-label") === "Pause music",
);
process.stderr.write("track 2 playing\n");
await playbackPage.waitForTimeout(1200);
const track2 = {
  title: await playbackPage.locator(".music-now-playing h2").textContent(),
  spinning: await vinyl.evaluate((element) => element.classList.contains("playing")),
  iframeSrc: await playbackPage.locator(".music-spotify-surface iframe").getAttribute("src"),
  currentTime: await playbackPage.locator(".music-times span").first().textContent(),
};

await playerButton.click();
await playbackPage.waitForFunction(() =>
  document.querySelector(".music-record-player .play-button")?.getAttribute("aria-label") === "Play music",
);
const paused = {
  label: await playerButton.getAttribute("aria-label"),
  spinning: await vinyl.evaluate((element) => element.classList.contains("playing")),
};
process.stderr.write("track 2 paused\n");

await playbackPage.locator(".music-track-list button").nth(2).click();
await playbackPage.waitForFunction(() =>
  document.querySelector(".music-record-player .play-button")?.getAttribute("aria-label") === "Pause music",
);
const track3 = {
  title: await playbackPage.locator(".music-now-playing h2").textContent(),
  spinning: await vinyl.evaluate((element) => element.classList.contains("playing")),
};
process.stderr.write("track 3 playing\n");

await playbackPage.locator(".music-track-list button").nth(3).click();
await playbackPage.waitForTimeout(75);
await playbackPage.locator(".music-track-list button").nth(4).click();
await playbackPage.waitForFunction(() =>
  document.querySelector(".music-now-playing h2")?.textContent === "Your Call" &&
  document.querySelector(".music-record-player .play-button")?.getAttribute("aria-label") === "Pause music",
);
await playbackPage.waitForTimeout(500);
const rapidSelection = {
  title: await playbackPage.locator(".music-now-playing h2").textContent(),
  spinning: await vinyl.evaluate((element) => element.classList.contains("playing")),
  iframeSrc: await playbackPage.locator(".music-spotify-surface iframe").getAttribute("src"),
  iframeCount: await playbackPage.locator(".music-spotify-surface iframe").count(),
};

process.stdout.write(JSON.stringify({ shortNote, longNote, lyricFontStyle, colorado, initial, track2, paused, track3, rapidSelection, pageErrors }, null, 2));
await browser.close();
