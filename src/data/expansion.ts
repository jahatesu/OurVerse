export const dailyMessages = [
  "I hope you know that somewhere on the other side of the planet there’s a girl who thinks you’re ridiculously cute.",
  "An ordinary day with you is still my favorite adventure.",
  "Whatever today asks of you, you have me in your corner.",
  "I would choose you in every timezone.",
  "Drink water. Unclench your jaw. Accept this tiny forehead kiss.",
  "I miss you in all the quiet spaces between things.",
  "One day, goodnight won’t have to mean hanging up.",
];
export const conversations: {
  title: string;
  messages: {
    sender: "Janna" | "Josh";
    text: string;
    timestamp: string;
    reaction?: string;
    image?: string;
  }[];
}[] = [
  {
    title: "Five more minutes · an imagined little conversation",
    messages: [
      { sender: "Janna", text: "You should sleep.", timestamp: "11:41 PM" },
      {
        sender: "Josh",
        text: "Five more minutes?",
        timestamp: "11:42 PM",
        reaction: "♡",
      },
      {
        sender: "Janna",
        text: "Okay. But only because you’re my favorite.",
        timestamp: "11:42 PM",
      },
    ],
  },
  {
    title: "A sky to share · an imagined little conversation",
    messages: [
      {
        sender: "Janna",
        text: "Look at the moon tonight.",
        timestamp: "8:10 PM",
        image: "/memories/moon.svg",
      },
      {
        sender: "Josh",
        text: "Same moon. Same us.",
        timestamp: "8:12 PM",
        reaction: "♡",
      },
    ],
  },
];
export interface Coupon {
  id: string;
  title: string;
  description: string;
  terms: string;
  quantity: number;
  icon: string;
  expiration?: string;
}
export const coupons: Coupon[] = [
  {
    id: "coupon-v2-yes-day",
    title: "YES DAY",
    description: "For one whole day, I can't say no to you.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "♡",
  },
  {
    id: "coupon-v2-win-argument",
    title: "FINE, YOU WIN THIS ARGUMENT",
    description: "Cash this in and the argument is officially yours. No more fighting my case.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "∞",
  },
  {
    id: "coupon-v2-noods",
    title: "NOODS OF YOUR CHOICE",
    description: "Your choice, your request. Redeem whenever you're in the mood for a little surprise.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "✦",
  },
  {
    id: "coupon-v2-argument-truce",
    title: "ARGUMENT TRUCE",
    description: "Call an immediate ceasefire. We stop, cool down, and come back to it with love.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 2,
    icon: "✦",
  },
  {
    id: "coupon-v2-unli-day",
    title: "UNLI 🧠 FOR A DAY",
    description: "Redeem wisely—you only get one.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "✦",
  },
  {
    id: "coupon-v2-make-out",
    title: "1 HOUR MAKE-OUT SESH",
    description: "One uninterrupted hour reserved for kissing, cuddling, and getting completely distracted by each other.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 2,
    icon: "♡",
  },
  {
    id: "coupon-v2-reassurance",
    title: "EMERGENCY REASSURANCE",
    description: "Redeem whenever you need extra love, reassurance, attention, and a reminder that I'm right here.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 2,
    icon: "♡",
  },
  {
    id: "coupon-v2-fantasy",
    title: "TRY THAT FANTASY",
    description: "That fantasy you've had on your mind? This is your coupon to finally tell me about it and explore it together.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "✦",
  },
  {
    id: "coupon-v2-lingerie",
    title: "LINGERIE NIGHT",
    description: "Pick the night and I'll dress up just for you.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "♡",
  },
  {
    id: "coupon-v2-back-massage",
    title: "BACK MASSAGE",
    description: "One proper back massage on demand. Lie down, relax, and let me take care of you.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "✦",
  },
  {
    id: "coupon-v2-striptease",
    title: "STRIPTEASE",
    description: "One private little show, performed just for you.",
    terms: "Arrange a time together. No expiration date.",
    quantity: 1,
    icon: "✦",
  },
];
export const jarNotes = [
  { category: "Love", text: "You are my favorite place to land." },
  { category: "Funny", text: "Stop being so handsome. It’s inconvenient." },
  {
    category: "Memory",
    text: "Tell me about a call you wish had lasted longer.",
  },
  { category: "Question", text: "What tiny thing made you smile today?" },
  {
    category: "Challenge",
    text: "Send real Janna a ridiculously specific compliment.",
  },
];
export const mailboxNotes = [
  "Just reminding you that you’re cute.",
  "I wish you were here.",
  "Drink water.",
  "Stop being so handsome. It’s inconvenient.",
  "Come give me attention.",
];
export const questions = {
  Deep: [
    "What’s one tiny thing I do that makes you feel loved?",
    "What helps you feel safe enough to be yourself?",
  ],
  Romantic: [
    "What moment would you replay with me?",
    "What does home feel like to you?",
  ],
  Funny: [
    "If I turned into a worm, how long are you legally required to keep dating me?",
    "Which of us would survive a week on the moon?",
  ],
  Future: [
    "Where should our first big trip together be?",
    "What should our first ordinary Sunday look like?",
  ],
  Random: ["What snack is our relationship?", "Pick a song for tonight."],
};
export const loveTraits = [
  ["Your eyes", "stars", "My favorite little constellations."],
  ["Your smile", "glow", "There goes my entire train of thought."],
  ["Your voice", "waves", "The sound that makes the miles go quiet."],
  ["Your humor", "laugh", "You make ordinary days ridiculous. Thank you."],
  ["Your heart", "beat", "So much kindness in one human."],
  ["Your kindness", "glow", "You make the world softer."],
  ["Your weirdness", "wiggle", "My favorite kind of strange."],
  ["The way you love me", "hearts", "I feel chosen, again and again."],
  ["The way you comfort me", "glow", "Even far away, you feel like home."],
  ["Your laugh", "laugh", "I would cross oceans to hear it in person."],
  ["Your personality", "stars", "Every little part that makes you, you."],
] as const;
export interface Dream {
  id: string;
  title: string;
  description: string;
  category: string;
  photo: string;
}
export const dreams: Dream[] = [
  "Finally close the distance",
  "Airport hug",
  "Cook together",
  "Travel somewhere new",
  "Movie night on the same couch",
  "Annoy each other IRL",
  "Take our favorite photo",
  "Spontaneous road trip",
].map((title, i) => ({
  id: `dream-${i}`,
  title,
  description: "Someday becomes a day we get to keep.",
  category: i === 3 || i === 7 ? "Adventure" : "Together",
  photo: "/memories/sunset.svg",
}));
export const capsule = {
  written: "2026-04-21T00:00:00+08:00",
  opens: "2027-04-21T00:00:00+08:00",
  letter:
    "Dear future us, I hope the little things still make us smile. I hope we kept choosing each other. Here’s to every ordinary day we dreamed of sharing. ♡ Janna",
};
export const calendarEvents = [
  {
    date: "2026-04-21",
    title: "Our beginning",
    type: "milestone",
    story: "The day our little universe began.",
  },
  {
    date: "2027-04-21",
    title: "Our first anniversary",
    type: "special",
    story: "One year of us. Our time capsule opens today.",
  },
];
export const puzzlePhotos = [
  { src: "/memories/moon.svg", title: "Under our moon" },
  { src: "/memories/sunset.svg", title: "Our someday sunset" },
  { src: "/memories/night.svg", title: "Five more minutes" },
];
export const crossword = {
  rows: 7,
  cols: 7,
  entries: [
    {
      number: 1,
      row: 0,
      col: 4,
      direction: "down",
      answer: "JANNA",
      clue: "Your red-haired player two (5)",
    },
    {
      number: 2,
      row: 1,
      col: 3,
      direction: "across",
      answer: "SAME",
      clue: "___ sky, ___ moon, ___ us (4)",
    },
    {
      number: 3,
      row: 3,
      col: 1,
      direction: "across",
      answer: "MOON",
      clue: "We see the same one at night (4)",
    },
    {
      number: 4,
      row: 3,
      col: 2,
      direction: "down",
      answer: "OURS",
      clue: "Yours + mine = ___ (4)",
    },
    {
      number: 5,
      row: 6,
      col: 0,
      direction: "across",
      answer: "JOSH",
      clue: "Janna’s favorite human (4)",
    },
  ],
} as const;
export const codePuzzles = [
  {
    type: "A1Z26",
    clue: "10 · 1 · 14 · 14 · 1",
    hint: "A = 1, B = 2…",
    answer: "JANNA",
  },
  {
    type: "Caesar cipher",
    clue: "ORYH",
    hint: "Move every letter three places backward.",
    answer: "LOVE",
  },
  {
    type: "Symbol substitution",
    clue: "☾ ♡ ✦ ✦",
    hint: "☾ = M, ♡ = I, ✦ = S",
    answer: "MISS",
  },
  {
    type: "Hidden clue",
    clue: "Just one star holds our small hopes.",
    hint: "Take the first letter of the first four words.",
    answer: "JOSH",
  },
  {
    type: "Date clue",
    clue: "Eight digits. Our beginning.",
    hint: "MMDDYYYY. The Story Constellation remembers.",
    answer: "04212026",
  },
  {
    type: "Word scramble",
    clue: "V E R O U R S E",
    hint: "The little universe you are standing in.",
    answer: "OURVERSE",
  },
];
export const quotes = [
  { text: "Stop being so handsome. It’s inconvenient.", speaker: "Janna" },
  { text: "Five more minutes?", speaker: "Josh" },
  { text: "Mine now.", speaker: "Janna" },
  { text: "Same moon. Same us.", speaker: "Josh" },
] as const;
export const patchNotes = {
  version: "2.6.0",
  changes: [
    "Improved communication",
    "Increased cuddle requirement by 200%",
    "Josh remains annoyingly handsome",
    "Distance bug remains unresolved",
  ],
  issues: [
    "Insufficient physical hugs",
    "Timezone mismatch",
    "Janna misses Josh",
    "Josh occasionally annoying",
  ],
  upcoming: ["Airport hug", "Same timezone", "Unlimited kisses"],
};
export const travel = [
  { name: "Janna · Philippines", x: 79, y: 58, future: false },
  { name: "Josh · Colorado", x: 23, y: 36, future: false },
  { name: "Add a place we’ve been", x: 48, y: 48, future: false },
  {
    name: "Our someday adventure · choose a destination",
    x: 62,
    y: 25,
    future: true,
  },
];
export const gifts: {
  id: string;
  title: string;
  opens: string;
  message: string;
}[] = [
  {
    id: "anniversary-gift",
    title: "A little anniversary surprise",
    opens: "2027-04-21T00:00:00+08:00",
    message:
      "An entire year of us. Your gift: one very long hug, waiting to happen. Replace this sample with your surprise.",
  },
];
export const futureOptions = {
  House: [
    "Cozy apartment",
    "A home with a moonlit balcony",
    "Tiny house, enormous snack cupboard",
  ],
  Pets: ["17 cats", "One very spoiled cat", "A dog who steals our couch"],
  "Who cooks": ["Josh", "Janna, with supervision", "Both of us, badly"],
  "Who cleans": [
    "Definitely not Janna",
    "Whoever loses the game",
    "Teamwork (allegedly)",
  ],
  "Arguments caused by games": [
    "482",
    "Just one very long rematch",
    "Zero. We have matured. Probably.",
  ],
  Kisses: ["∞"],
};
export const endingLines = [
  "Josh.",
  "You’ve seen our memories.",
  "You’ve read my letters.",
  "You’ve played my stupid games.",
  "You’ve explored our little universe.",
  "But the truth is…",
  "You are my favorite part of it.",
  "Out of everything I’ve ever made, this is my favorite — because I made it for you.",
  "I love you. ♡",
  "— Janna",
];
