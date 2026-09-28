"use client";
import { useState } from "react";
import { LivingUniverse } from "./living-universe";
import { useUniverse } from "./provider";
import { settings } from "@/config/settings";
import "./galaxy.css";
export { CelestialArt as DestinationArt } from "./celestial-art";

export const destinations = [
  { id: "memories", name: "Memory Moon", note: "little moments, kept forever", art: "moon", ring: 0, angle: 215 },
  { id: "love", name: "Love Planet", note: "you. a hundred times over.", art: "heart", ring: 0, angle: 335 },
  { id: "room", name: "Our Home", note: "leave the light on for me", art: "house", ring: 0, angle: 95 },
  { id: "story", name: "Story Constellation", note: "every star led to you", art: "stars", ring: 1, angle: 265 },
  { id: "letters", name: "Letter Constellation", note: "a hug in an envelope", art: "letter", ring: 1, angle: 25 },
  { id: "world", name: "Our World", note: "same sky. same us.", art: "earth", ring: 1, angle: 145 },
  { id: "games", name: "Game Planet", note: "player two, always", art: "arcade", ring: 2, angle: 195 },
  { id: "music", name: "Music Satellite", note: "the soundtrack of us", art: "satellite", ring: 2, angle: 315 },
  { id: "garden", name: "Love Garden", note: "look what we’re growing", art: "garden", ring: 2, angle: 75 },
];

export function Constellation({ full = false, illuminated }: { full?: boolean; illuminated?: number }) {
  const { progress } = useUniverse();
  const count = Math.min(settings.constellationTarget, illuminated ?? progress.discoveries.length);
  const points = Array.from({ length: settings.constellationTarget }, (_, i) => [20 + i * (330 / Math.max(1, settings.constellationTarget - 1)), 35 + Math.sin(i * 1.8) * 23]);
  return (
    <div className={`our-constellation ${full ? "full" : ""}`} aria-label={`Our Constellation: ${count} of ${settings.constellationTarget} stars connected`}>
      <svg viewBox="0 0 370 75" role="img" aria-label="Stars connecting as you explore">
        <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke="#ffffff14" />
        <polyline points={points.slice(0, count).map((p) => p.join(",")).join(" ")} fill="none" stroke="#d7bbd4" />
        {points.map(([x, y], i) => <text key={i} x={x - 6} y={y + 5} fill={i < count ? "#f1d9ab" : "#726980"} fontSize="14">{i < count ? "✦" : "☆"}</text>)}
      </svg>
      <span>OUR CONSTELLATION · {count} / {settings.constellationTarget}</span>
    </div>
  );
}

export function Galaxy({ navigate }: { navigate: (id: string) => void }) {
  const [activeRing, setActiveRing] = useState(0);
  const [paused, setPaused] = useState(false);
  const { discover, notify } = useUniverse();
  return (
    <div className={`galaxy solar-galaxy living-galaxy ${paused ? "orbits-paused" : ""}`}>
      <header className="galaxy-title solar-title">
        <span className="eyebrow">OUR OWN LITTLE INFINITY</span>
        <h1>Somewhere, <em>just us.</em></h1>
        <p>Everything in this universe leads back to you.</p>
      </header>
      <div className="solar-mobile-rings" aria-label="Choose an orbit">
        {["Close to heart", "Our story", "Little adventures"].map((name, i) => <button key={name} aria-pressed={activeRing === i} onClick={() => setActiveRing(i)}>{name}<small>0{i + 1}</small></button>)}
      </div>
      <LivingUniverse worlds={destinations} navigate={navigate} paused={paused} activeRing={activeRing} onSecret={() => { discover("secret-object"); notify("YOU WEREN’T SUPPOSED TO FIND THAT. ♡"); navigate("vault"); }} />
      <div className="solar-navigation-note"><span>nine little worlds. one gravitational pull.</span><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume orbits" : "Pause orbits"}</button></div>
    </div>
  );
}
