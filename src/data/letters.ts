import type { Letter } from "./types";
export const letters: Letter[] = [
  ...[
    "I’m mad",
    "you’re mad",
    "you’re sad",
    "you’re stressed",
    "you miss me badly",
    "we get in a fight",
    "I’m distant",
    "you need motivation",
    "you need to remember how much I love you",
    "you’re having a bad day",
    "you’re feeling insecure",
    "you’re jealous",
  ].map((title, i) => ({
    id: `letter-${i}`,
    title: `Open when ${title}`,
    body: [
      "My Josh,\n\nIf I could fold myself into this envelope, I would. Until I can hold your hand, let these words keep you company. You are loved, on the easy days and the hard ones.\n\nTake a breath. Drink some water. Imagine the longest hug. I’m right here, in your corner.\n\nAlways,\nJanna ♡",
      "Hey, my favorite human.\n\nYou do not have to have everything figured out tonight. Rest your shoulders. You are enough exactly as you are. I believe in you, and I’m so glad I get to love you.\n\nYours,\nJanna ♡",
    ][i % 2],
  })),
  {
    id: "anniversary",
    title: "Our First Anniversary",
    unlockDate: "2027-04-21T00:00:00+08:00",
    body: "A whole year of choosing us. Replace this sample with an anniversary letter.\n\nHere’s to our next chapter. ♡",
  },
  {
    id: "birthday",
    title: "A Birthday Wish for You",
    occasion: "birthday",
    body: "Happy birthday, my favorite human! Replace this sample with your birthday letter. ♡",
  },
];
