export type ChaosType = "blame" | "wouldRather" | "court" | "battle" | "doNow" | "mystery" | "emergency" | "wildcard";

export type ChaosEntry =
  | { id: string; type: "blame"; prompt: string }
  | { id: string; type: "wouldRather"; optionA: string; optionB: string }
  | { id: string; type: "court"; caseText: string; verdicts: string[] }
  | { id: string; type: "battle"; battle: string; prize: string }
  | { id: string; type: "doNow" | "mystery" | "emergency"; prompt: string }
  | { id: string; type: "wildcard"; mode: "prompt"; prompt: string }
  | { id: string; type: "wildcard"; mode: "choice"; choices: { label: string; prompt: string }[] };

export const CHAOS_CATEGORY_META: Record<ChaosType, { label: string; symbol: string; weight: number }> = {
  blame: { label: "THE BLAME GAME", symbol: "☞", weight: 5 },
  wouldRather: { label: "WOULD YOU RATHER", symbol: "↔", weight: 5 },
  court: { label: "RELATIONSHIP COURT", symbol: "⚖", weight: 3 },
  battle: { label: "COUPLE BATTLE", symbol: "VS", weight: 4 },
  doNow: { label: "DO IT NOW", symbol: "!", weight: 5 },
  mystery: { label: "MYSTERY MISSION", symbol: "?", weight: 3 },
  emergency: { label: "EMERGENCY", symbol: "⚠", weight: 1 },
  wildcard: { label: "WILDCARD", symbol: "★", weight: 3 },
};

export const CHAOS_PAPER_SLOTS: ChaosType[] = [
  "blame", "wouldRather", "doNow", "battle", "court", "mystery", "wildcard", "emergency",
  "blame", "wouldRather", "doNow", "battle", "court", "mystery", "wildcard", "blame", "wouldRather", "doNow",
];

const blamePrompts = [
  "Who says “I'm not hungry” and then steals food?", "Who would spend $200 because it was “on sale”?", "Who loses their phone while holding it?",
  "Who starts getting ready later?", "Who orders food when there's food at home?", "Who lasts longer in a zombie apocalypse?",
  "Who says “five more minutes” and means thirty?", "Who buys something just because it was cute?", "Who is more dramatic when sick?",
  "Who would accidentally spoil a movie?", "Who sends the most chaotic voice notes?", "Who takes longer to choose what to watch?",
  "Who would forget why they walked into a room?", "Who is more likely to nap through an alarm?", "Who would name a pet something ridiculous?",
  "Who adds the most things to the future date list?", "Who would get distracted halfway through telling a story?", "Who would laugh first during a serious face-off?",
];
const wouldRather = [
  ["Let Josh choose your outfit for a week", "Let Janna redesign the gaming setup"], ["Share one bathroom forever", "Share one computer forever"],
  ["$10 million, but no food delivery", "Normal money, but free delivery forever"], ["Always be 30 minutes early", "Always be 10 minutes late"],
  ["Josh picks every movie for a month", "Janna picks every meal for a month"], ["Only text in voice notes for a day", "Only communicate in memes for a day"],
  ["A tiny house with perfect snacks", "A huge house with one suspiciously slow Wi-Fi router"], ["Trade playlists for a week", "Trade phone wallpapers for a week"],
  ["Plan a surprise date with $10", "Plan a fancy date with no photos allowed"], ["Have matching silly pajamas", "Have matching dramatic profile pictures"],
  ["Josh narrates your day like a sports game", "Janna adds dramatic music to Josh's day"], ["One year of choosing the snacks", "One year of choosing the shows"],
  ["A week with no “what should we eat?”", "A week with no “what should we watch?”"], ["Take one very chaotic vacation", "Take three extremely well-planned mini dates"],
];
const courtCases = [
  "Someone said they weren't hungry, then ate half the other person's fries.", "Someone fell asleep during the movie they picked.",
  "Someone took the blanket and denies everything.", "Someone said “anything is fine” and rejected every food suggestion.",
  "Someone said they were ready but was still looking for their phone.", "Someone watched the next episode without the other person.",
  "Someone forgot where they put something and blamed the other person.", "Someone sent “on my way” before actually leaving.",
  "Someone stole the good charger and claims it was communal property.", "Someone picked a show, then scrolled through it for twenty minutes.",
  "Someone said “one more video” and started a whole new playlist.", "Someone sent a blurry photo and called it evidence.",
  "Someone left a message on read while actively sending memes.", "Someone asked what time it was after checking their phone.",
];
const battles = [
  ["Rock Paper Scissors · best of 3", "Winner chooses tonight's movie."], ["First person to make the other laugh", "Winner gets to pick the next snack."],
  ["Staring contest · no cheating", "Winner chooses the next video to watch."], ["Both guess a number from 1–10; closest to 7 wins", "Winner gets bragging rights for 12 minutes."],
  ["Send your ugliest selfie; judge together", "Worst selfie wins the title of brave."], ["Who can stay quiet longer on the call?", "Winner picks the next conversation topic."],
  ["Guess the song from a 5-second hum", "Winner chooses the next song."], ["Draw the other person in 30 seconds", "Winner gets to frame the masterpiece (mentally)."],
  ["Rock Paper Scissors · loser tells a silly story", "Winner chooses the story topic."], ["Who can find the oldest photo of you two first?", "Winner gets first pick of the next throwback."],
  ["Make the best dramatic movie-poster pose on video", "Winner gets the imaginary award."],
];
const doNowPrompts = [
  "Send the other person a selfie right now. No retakes.", "Send a 10-second voice note saying something nice.", "Give one compliment. You can't say “cute.”",
  "Send the last photo in your camera roll.", "Send one song that reminds you of us.", "Text using only emojis for the next five messages.",
  "Change the other person's contact name for one hour.", "Send the weirdest sticker you have.", "Send a photo of what you can see right now.",
  "Record a tiny weather report from wherever you are.", "Send a voice note saying your best fake movie-trailer line.",
  "Find a nearby object and give it a dramatic name.", "Send a photo of today's snack situation.", "Type a compliment with your eyes closed. No fixing typos.",
  "Send a 5-second clip of the sound around you.", "Pick a song for the other person's walk-on music.",
  "Send three emojis that describe your current mood.", "Send a message that would make the other person laugh.",
];
const mysteryPrompts = [
  "You have 5 minutes. Find the oldest photo of us you can.", "Pick a future year and tell each other what you imagine life looks like.",
  "Find something in your room that reminds you of the other person.", "Describe the other person using exactly three words.",
  "Scroll your camera roll without looking, stop, and send the photo you landed on.", "Choose one food neither of you has tried; add it to the future date list.",
  "Find the first photo you ever sent each other.", "Pick an object near you and invent its dramatic backstory together.",
  "Find a photo that deserves a ridiculous caption. Send it with the caption.", "Choose a place you'd both like to visit and share one tiny plan for it.",
  "Find the most unexpected thing within arm's reach and present your discovery.",
];
const emergencyPrompts = [
  "EMERGENCY ATTENTION REQUIRED. Janna requires attention immediately.", "EMERGENCY COMPLIMENT. Tell Josh one thing you like about him. Immediately.",
  "EMERGENCY SELFIE. Both subjects must submit current face evidence.", "EMERGENCY I LOVE YOU. You know what to do.",
  "EMERGENCY DATE PLANNING. Pick one thing we should do together someday.", "EMERGENCY VOICE NOTE. Send one. No reason required.",
  "EMERGENCY SNACK REPORT. Submit your current snack status.", "EMERGENCY MEME DELIVERY. Send the first one that makes you think of us.",
  "EMERGENCY SONG REQUEST. Choose a song for the next little call moment.",
];
const wildcardPrompts = [
  "Josh gets one question. Janna has to answer honestly.", "Janna chooses what Josh watches next.", "Both send one photo. No context allowed.",
  "Pick a number from 1–20. Closest wins absolutely nothing.", "Swap profile pictures for one hour.", "Tell each other your current food craving.",
  "Send one message you think would make the other person laugh.", "Choose one tiny thing to look forward to together this week.",
  "Give each other a ridiculous new nickname for the next ten minutes.", "Take turns adding one word to a very bad story.",
  "Send the most recent screenshot you can safely share.", "Choose a theme song for the other person's day.", "Describe your day as a fake product review.",
];

export const CHAOS_ENTRIES: ChaosEntry[] = [
  ...blamePrompts.map((prompt, i): ChaosEntry => ({ id: `blame-${i}`, type: "blame", prompt })),
  ...wouldRather.map(([optionA, optionB], i): ChaosEntry => ({ id: `rather-${i}`, type: "wouldRather", optionA, optionB })),
  ...courtCases.map((caseText, i): ChaosEntry => ({ id: `court-${i}`, type: "court", caseText, verdicts: ["JANNA IS GUILTY", "JOSH IS GUILTY", "BOTH ARE GUILTY"] })),
  ...battles.map(([battle, prize], i): ChaosEntry => ({ id: `battle-${i}`, type: "battle", battle, prize })),
  ...doNowPrompts.map((prompt, i): ChaosEntry => ({ id: `now-${i}`, type: "doNow", prompt })),
  ...mysteryPrompts.map((prompt, i): ChaosEntry => ({ id: `mystery-${i}`, type: "mystery", prompt })),
  ...emergencyPrompts.map((prompt, i): ChaosEntry => ({ id: `emergency-${i}`, type: "emergency", prompt })),
  ...wildcardPrompts.map((prompt, i): ChaosEntry => ({ id: `wild-${i}`, type: "wildcard", mode: "prompt", prompt })),
  { id: "wild-choice-0", type: "wildcard", mode: "choice", choices: [{ label: "TRUTH", prompt: "What tiny thing always makes your day better?" }, { label: "DARE", prompt: "Send a dramatic 5-second intro for your next video call." }] },
];

export const CHAOS_REACTIONS = ["the court has spoken.", "noted for future arguments.", "evidence collected.", "no appeals.", "interesting choice.", "relationship data collected.", "Josh will remember this.", "Janna has questions.", "officially on the record."];

export function pickChaosEntry(used: Set<string>): ChaosEntry {
  const categoryTypes = Object.keys(CHAOS_CATEGORY_META) as ChaosType[];
  const available = (type: ChaosType) => CHAOS_ENTRIES.filter((entry) => entry.type === type && !used.has(entry.id));
  const weightedTypes = categoryTypes.flatMap((type) => Array.from({ length: CHAOS_CATEGORY_META[type].weight }, () => type));
  let weightedAvailable = weightedTypes.filter((type) => available(type).length > 0);
  if (weightedAvailable.length === 0) {
    used.clear();
    weightedAvailable = weightedTypes;
  }
  const type = weightedAvailable[Math.floor(Math.random() * weightedAvailable.length)];
  const pool = available(type);
  const entry = pool[Math.floor(Math.random() * pool.length)];
  used.add(entry.id);
  return entry;
}
