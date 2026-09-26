export const characters = {
  janna: {
    name: "Janna",
    hairColor: "#8b0000 ",
    hairHighlight: "#da7650",
    hairStyle: "long waves",
    skin: "#f2c7b1",
    outfit: "#252230",
    accentColor: "#d797aa",
    accessories: ["moon hair pin"],
  },
  josh: {
    name: "Josh",
    ethnicity: "Korean",
    hairColor: "#171820",
    hairHighlight: "#353744",
    hairStyle: "soft side part",
    skin: "#edc9b0",
    glasses: true,
    glassesStyle: "rounded graphite",
    outfit: "#50576b",
    accentColor: "#a8bdd9",
    accessories: ["glasses"],
  },
} as const;
export const characterPalette = { eyes:"#33272c", mouth:"#80444b", blush:"#dc7888", glasses:"#272938", shoes:"#e7d9cf", pin:"#f3dca6", tears:"#a9cce9", heart:"#bd546c" };
export type Expression =
  | "idle"
  | "happy"
  | "smiling"
  | "laughing"
  | "blushing"
  | "love-struck"
  | "annoyed"
  | "angry"
  | "sad"
  | "sleepy"
  | "excited"
  | "surprised"
  | "crying-happy"
  | "confused"
  | "embarrassed"
  | "proud";
export type Pose =
  | "idle"
  | "wave"
  | "sit"
  | "walk"
  | "run"
  | "hug"
  | "kiss"
  | "sleep"
  | "hold-hands"
  | "poke"
  | "celebrate"
  | "dance"
  | "gaming"
  | "confused";
