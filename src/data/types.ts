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
  occasion?: "birthday";
}
export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
export type SongNoteSegmentStyle =
  | "lyric"
  | "emphasis"
  | "reference"
  | "strong-emphasis";
export interface SongNoteSegment {
  text: string;
  style?: SongNoteSegmentStyle;
  italic?: boolean;
}
export interface Song {
  id: string;
  number: number;
  title: string;
  artist: string;
  cover: string;
  note: string | SongNoteSegment[];
  audioUrl?: string;
  externalUrl?: string;
  spotifyUri?: string;
  artworkUrl?: string;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: "Stardust" | "Moonlight" | "Supernova";
  icon: string;
}
