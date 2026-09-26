export interface Memory {
  id: string;
  image: string;
  date: string;
  caption: string;
  description: string;
  category:
    "Us" | "Calls" | "Screenshots" | "Funny" | "Favorites" | "I Miss You";
}
export interface Milestone {
  date: string;
  title: string;
  description: string;
  photo: string;
  icon?: string;
  specialMessage?: string;
}
export interface Letter {
  id: string;
  title: string;
  body: string;
  unlockDate?: string;
}
export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface Song {
  title: string;
  artist: string;
  cover: string;
  message: string;
  audioUrl?: string;
  externalUrl?: string;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: "Stardust" | "Moonlight" | "Supernova";
  icon: string;
}
