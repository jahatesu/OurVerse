const beginnings = [
  "Your kindness",
  "Your laugh",
  "Your patience",
  "Your curiosity",
  "Your warmth",
  "Your honesty",
  "Your silly side",
  "Your thoughtfulness",
  "Your courage",
  "Your heart",
];
const endings = [
  "makes an ordinary day feel special.",
  "reminds me how lucky I am.",
  "makes the distance feel smaller.",
  "is one of my favorite things about you.",
  "gives me another reason to smile.",
  "feels like coming home.",
  "makes our little world brighter.",
  "stays with me after we say goodnight.",
  "makes me excited for our future.",
  "is something I never want you to change.",
];
// 100 editable sample reasons. Replace any or all with your own specific memories.
export const reasons = beginnings.flatMap((beginning) =>
  endings.map((ending) => `${beginning} ${ending}`),
);
