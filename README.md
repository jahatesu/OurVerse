# OurVerse ♡

A little universe for Janna and Josh. A personal, interactive scrapbook with memories, letters, games, a tiny virtual companion, and a few secrets written in the stars.

Built with **Next.js App Router, React, TypeScript, Tailwind CSS 4, Motion for React, and Lucide**. No backend, account, API key, remote font, or paid service is needed. The illustrations and Mini Janna avatar are original SVG/CSS assets included in the project.

## Run locally

Use Node.js 22 LTS or newer and npm.

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The first visit starts with an invitation; subsequent visits remember that you have entered. Navigation uses URL hashes, supports browser history, and preserves the music player.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build. The original Git repository and license are preserved.

## What’s inside

- **Home:** personalized dashboard, calendar-based relationship counter starting April 21, 2026, randomized affectionate messages, shortcuts, and pinned memories.
- **Our Story:** animated milestones with photos and complete-memory dialogs.
- **Memories:** filterable Polaroid scrapbook, six categories, and a lightbox with previous/next controls.
- **Letters:** opening envelopes, sample love letters, and letters that unlock on configurable dates.
- **Game Room:** scored relationship quiz; shuffled memory match with timer and moves; keyboard/mouse/touch heart-catching arcade; animated date roulette.
- **Mini Janna:** original avatar, hug/kiss/feed/annoy interactions, saved stats, and randomized keyword-based chat. Chat is scripted, does not contact an AI service, and resets when you leave the room.
- **Love:** 100 sample reasons revealed one at a time, saved progress, collected reasons, and 11 unlockable achievements with rarity styling.
- **Music:** shared floating/full player, vinyl animation, track selection, real playback and seeking when audio is configured, and personal song notes. Nothing autoplays.
- **Our World:** stylized map and live Philippines/Colorado clocks using `Asia/Manila` and `America/Denver`, including daylight-saving changes.
- **Secrets:** configurable password vault, hidden clues, and a final love letter after exploring seven sections.

Includes responsive navigation, visible keyboard focus, a skip link, focus-trapped dialogs with Escape-to-close and focus restoration, reduced-motion support, and touch controls. The game bundle loads on demand.

## Project structure

```text
src/
  app/                 Next.js page, layout, design system, favicon
  components/
    ourverse.tsx       Shell, intro, navigation, easter eggs
    provider.tsx       Versioned local progress and achievements
    dashboard.tsx      Home dashboard
    collections.tsx    Scrapbook, timeline, letters, reasons, achievements
    games.tsx          Four independent game components
    companion.tsx      Avatar interactions and scripted chat
    music.tsx          Shared audio provider and players
    world.tsx          Timezone clocks and map illustration
    secrets.tsx        Vault and final ending
    ui.tsx             Shared heading and accessible modal
  data/                Editable typed personal content
  lib/utils.ts         Dates, relationship duration, random selection
public/memories/       Illustrations; add your real photos here
tests/                 Desktop and mobile browser tests
```

## Personalizing OurVerse

Every piece of personal content lives in clean, typed configuration files under `src/config` and `src/data`. Janna can personalize the entire universe without searching through component code.

Sample memories, dates, quotes, puzzle photos, letters, and reasons are intentionally clear, editable placeholders.

> [!IMPORTANT]
> **Sentimental UX vs. Authentication**: All vault passwords, date locks, and code ciphers are client-side romantic interactive experiences. They are not cryptographic authentication or server-side security. Do not store sensitive credentials, private keys, or sensitive personal data in client source files.

---

### Customization Map & Actual File Paths

| Feature / Content                 | File Path                                 | What to Edit                                                                                                                                                       |
| --------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Relationship Core**             | `src/data/relationship.ts`                | Names (`Janna`, `Josh`), start date (`April 21, 2026`), timezones (`Asia/Manila`, `America/Denver`), vault password, hint, and final love letter.                  |
| **Settings & Special Dates**      | `src/config/settings.ts`                  | Josh's birthday (`"08-25"`, August 25, 2003), anniversary (`"04-21"`), constellation target, rare hug delay, and Mission Control console telemetry.                |
| **Mini Janna Appearance**         | `src/config/characters.ts`                | Hair color (`#8b0000` deep auburn/red), hair highlight, skin tone, outfit colors, accessories (moon hair pin).                                                     |
| **Mini Josh Appearance**          | `src/config/characters.ts`                | Hair color (`#171820` soft black), hair highlight, skin tone, outfit colors, rounded glasses toggle and style.                                                     |
| **Memories Scrapbook**            | `src/data/memories.ts`                    | Array of memories: photo paths, captions, dates, categories (`calls`, `gaming`, `milestones`, `ordinary`, `someday`, `favorites`), and complete narrative stories. |
| **Story Constellation**           | `src/data/timeline.ts`                    | Chapters in your relationship journey: dates, milestone titles, descriptions, photo paths, icons, and blockquote special messages.                                 |
| **Letters Constellation**         | `src/data/letters.ts`                     | Envelope titles, letter bodies (`\n\n` for paragraphs), romantic occasions, and optional ISO `unlockDate` timestamps (e.g. `2027-04-21T00:00:00+08:00`).           |
| **Things I Love About You**       | `src/data/expansion.ts` (`loveTraits`)    | Orbiting traits around Mini Josh (title, reaction animation trigger, and heartfelt caption).                                                                       |
| **100 Reasons**                   | `src/data/reasons.ts`                     | Array of 100 unique personal reasons why you love him.                                                                                                             |
| **Relationship Quiz**             | `src/data/quiz.ts`                        | Questions, 4 answer choices per question, zero-based `correct` answer index, and post-question explanations.                                                       |
| **OurVerse Crossword**            | `src/data/expansion.ts` (`crossword`)     | Grid dimensions, intersecting Across/Down entries, answers, clue numbers, and romantic clues.                                                                      |
| **Code Ciphers (Crack the Code)** | `src/data/expansion.ts` (`codePuzzles`)   | 6 relationship ciphers (A1Z26, Caesar cipher, symbol substitution, hidden acronym, date code, word scramble) with hints and answers.                               |
| **Who Said It?**                  | `src/data/expansion.ts` (`quotes`)        | Memorable quotes and conversations with attribution (`Janna` or `Josh`).                                                                                           |
| **Date Roulette Ideas**           | `src/data/dateIdeas.ts`                   | Date activities and romantic plans on the spinning roulette wheel.                                                                                                 |
| **Music Satellite**               | `src/data/songs.ts`                       | Song titles, artists, album art covers, personal love notes, optional local audio files (`/audio/...`), and optional streaming links.                              |
| **Josh's Daily Messages**         | `src/data/expansion.ts` (`dailyMessages`) | Affectionate daily notes revealed deterministically on the desk each day.                                                                                          |
| **Love Mailbox**                  | `src/data/expansion.ts` (`mailboxNotes`)  | Surprise notes Josh finds when opening the front-porch mailbox.                                                                                                    |
| **The Love Jar**                  | `src/data/expansion.ts` (`jarNotes`)      | Categorized notes (`Love`, `Funny`, `Memory`, `Question`, `Challenge`) drawn when shaking the physical jar.                                                        |
| **Couple Questions**              | `src/data/expansion.ts` (`questions`)     | Late-night conversation prompts categorized under `Deep`, `Romantic`, `Funny`, `Future`, and `Random`.                                                             |
| **Love Coupons**                  | `src/data/expansion.ts` (`coupons`)       | Redeemable romantic coupon tickets (title, description, terms, icons, quantity).                                                                                   |
| **Future Dreams Checklist**       | `src/data/expansion.ts` (`dreams`)        | Someday goals (`Close the distance`, `Airport hug`, `Movie night`) that turn into scrapbook memories when checked.                                                 |
| **Time Capsule**                  | `src/data/expansion.ts` (`capsule`)       | Written date, unlock date (`April 21, 2027`), and long-term future love letter.                                                                                    |
| **Adventure Map**                 | `src/data/expansion.ts` (`travel`)        | Coordinate pins on the world map for Janna (Philippines), Josh (Colorado), and future dream destinations.                                                          |
| **Mystery Gifts**                 | `src/data/expansion.ts` (`gifts`)         | Date-locked gift boxes with surprise reveals.                                                                                                                      |
| **Future Generator**              | `src/data/expansion.ts` (`futureOptions`) | Humorous and sweet randomized combinations for house, pets, who cooks, who cleans, and kisses.                                                                     |
| **Josh's Mission Control**        | `src/config/settings.ts` (`mission`)      | Retro console monitors: Boyfriend Status, Janna Love Level, Kisses Owed, Hugs Pending, Distance, and Missing You status.                                           |
| **Relationship Patch Notes**      | `src/data/expansion.ts` (`patchNotes`)    | Version string, changes/improvements, known unresolved issues (e.g. Distance bug), and upcoming features.                                                          |
| **Achievements**                  | `src/data/achievements.ts`                | 11 unlockable badges (titles, descriptions, icons, rarity tiers). IDs are linked to local progression.                                                             |
| **Secret Vault Content**          | `src/data/secrets.ts`                     | Unlocked vault tabs: `playlists`, `letters`, `promises`, `confessions`, and future travel plans.                                                                   |
| **Cinematic Ending**              | `src/data/expansion.ts` (`endingLines`)   | 10 staged emotional lines revealed sequentially during the cinematic reunion finale under the starry sky.                                                          |

---

### Step-by-Step Customization Guide

#### 1. Adding Real Photos & Puzzle Pictures

Place your image files in `public/memories/` (e.g. `public/memories/first-photo.webp` or `public/memories/josh.jpg`).

- In `src/data/memories.ts`, set `image: "/memories/first-photo.webp"`.
- In `src/data/expansion.ts`, update `puzzlePhotos` to reference your photos for the **Piece of Us** sliding puzzle.
- Recommended image size: 1200×900px or 1600×1200px in WebP or JPG.
- Next.js Image automatically optimizes and serves these images with responsive sizing.

#### 2. Setting Important Dates

- **Relationship Start**: Set in `src/data/relationship.ts` (`startDate: "2026-04-21T00:00:00+08:00"`).
- **Anniversary**: Handled automatically on April 21 (`settings.anniversary = "04-21"`).
- **Josh's Birthday**: Set to August 25, 2003. In `src/config/settings.ts`, `birthday: "08-25"` controls the annual celebration in `"MM-DD"` format.
  When his birthday arrives, a special banner appears across the universe and birthday-locked letters unlock automatically!

#### 3. Setting Timezones & Clocks

In `src/data/relationship.ts`:

- `authorTimezone: "Asia/Manila"` (Janna's timezone in the Philippines)
- `recipientTimezone: "America/Denver"` (Josh's Mountain Time in Colorado)
  Both clocks update in real time with live Daylight Saving Time calculations and day/night sky indicators.

#### 4. Configuring Music Tracks

In `src/data/songs.ts`, you can configure your favorite songs:

- If you have an audio file, put it in `public/audio/our-song.mp3` and set `audioUrl: "/audio/our-song.mp3"`.
- If no audio file is provided, OurVerse gracefully presents the song notes, vinyl record visual, and streaming links without crashing or faking playback.

#### 5. Local Progress & Persistence

All progress is saved directly in the user's browser under the `ourverse-v1` `localStorage` key.
Saved state includes:

- Entered universe state
- Explored worlds & destinations
- Revealed reasons counter (0–100)
- Mini Janna happiness / affection stats
- Redeemed love coupons
- Checked future dreams
- Written sky wishes
- Solved crossword & puzzle completions
- Code fragments & vault unlocked state
- Unlocked achievements
- Cinematic ending viewed

Progress persists across browser refreshes and browser restarts.

---

### Development-Only "Janna Mode" & Testing Controls

When running locally in development (`npm run dev`), Janna has access to complete testing controls:

- **Shortcut**: Press <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> anywhere on the screen.
- **Mobile/Click**: Click the discreet **`Janna Mode ✦`** button in the footer.

The development modal provides:

- **Instant Unlocks**:
  - Full Universe (all achievements, vault open, 100 reasons, mature plant, ending ready)
  - Mature Love Plant (flowering stage 4 with blooms and sparkles)
  - Unlock Secret Vault
  - Unlock Time Capsule & Gifts (fast-forwards countdown)
  - Complete Constellation (illuminates all 14+ stars)
  - Unlock All Achievements
- **Simulations**:
  - Simulate Birthday (tests birthday banner, greeting, and birthday letter unlock)
  - Simulate Anniversary (tests anniversary celebration)
  - Simulate Late-Night Mode (tests Can't Sleep atmosphere when hour is past midnight)
  - Reset Clock to Real Time
- **Targeted Resets**:
  - Reset all progress to fresh visitor state
  - Reset Love Plant back to seed
  - Reset achievements
  - Reset constellation discoveries
  - Reset redeemed coupons
  - Reset games (quiz, memory match, Piece of Us, crossword, code ciphers)
  - Reset secret vault
  - Reset time capsule
  - Reset cinematic ending

_(These testing controls are completely stripped in production builds and never visible to normal visitors.)_

<details>
<summary>Creator’s guide to easter eggs & secrets (spoilers)</summary>

- **Logo Secret**: Click the `OURVERSE ✧` header logo 5 times to reveal a hidden shortcut to the Relationship Patch Notes.
- **Konami Code**: Enter <kbd>↑</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> <kbd>←</kbd> <kbd>→</kbd> <kbd>B</kbd> <kbd>A</kbd> outside an input field to activate Josh's Mission Control console.
- **Quick Companion**: Press <kbd>Shift</kbd> + <kbd>J</kbd> to jump straight to Mini Janna.
- **Footer Heart**: Click the tiny heart `♡` in the universe footer to visit the "DO NOT PRESS" button.
- **Cozy Room Interactions**: Tap the desk lamp to turn room lighting on/off; tap Janna and Josh to cycle through cuddling scenes (hoodie stealing, gaming together, sleeping, hugging).
- **Shooting Star Wishes**: Catch shooting stars in the Love Garden to write real wishes into your shared sky.
- **Love Plant Growth**: Every 4 discoveries across OurVerse grows the Love Plant through 5 distinct visual stages: Seed → Sprout → Small Plant → Large Plant → Flowering Plant.
- **Secret Vault**: Unlocks with the relationship date (`04212026`), by decoding all 6 code ciphers, or by revealing all 100 reasons.
- **Cinematic Ending**: Once you illuminate the 14 stars of the Story Constellation, a glowing starlight icon appears in the bottom right leading to the 10-step reunion finale.

</details>

## Browser tests and formatting

```bash
npm run test:e2e
npm run format:check
```

Playwright runs desktop and mobile Chromium tests using locally installed Microsoft Edge and starts the development server if needed. Without Edge, run `npx playwright install chromium` and remove `channel: 'msedge'` entries in `playwright.config.ts` to use bundled Chromium. Tests cover navigation, persistence, dialogs, quiz results, card matching, roulette, arcade controls, vault entry, and the ending. Screenshots/traces go into ignored `test-results/`.

Use `npm run format` to format source files. No analytics, maps API, AI API, or other external service is required. Deployment is optional and is not performed by this project setup.
