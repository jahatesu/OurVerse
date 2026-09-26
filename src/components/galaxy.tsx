"use client";
import { useState, type CSSProperties } from "react";
import { Couple } from "./characters";
import { CelestialArt } from "./celestial-art";
import { useUniverse } from "./provider";
import { dailyMessages } from "@/data/expansion";
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

function skyNoise(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function CosmicSky() {
  return (
    <div className="cosmic-sky" aria-hidden="true">
      <div className="cosmic-nebula nebula-violet" /><div className="cosmic-nebula nebula-indigo" /><div className="cosmic-nebula nebula-rose" />
      <div className="cosmic-cloud cloud-far" /><div className="cosmic-cloud cloud-middle" /><div className="cosmic-cloud cloud-close" />
      <div className="cosmic-fog fog-blue" /><div className="cosmic-fog fog-blush" />
      {[0, 1].map((cluster) => (
        <svg key={cluster} className={`distant-galaxy distant-galaxy-${cluster}`} viewBox="0 0 300 180">
          <ellipse className="galaxy-mist" cx="150" cy="90" rx="100" ry="24" />
          <ellipse className="galaxy-core" cx="150" cy="90" rx="28" ry="9" />
          {Array.from({ length: 65 }, (_, i) => {
            const radius = 9 + Math.pow(skyNoise(i + 250), .65) * 113;
            const angle = i * 2.399 + cluster;
            return <circle key={i} cx={150 + Math.cos(angle) * radius} cy={90 + Math.sin(angle) * radius * .29} r={.3 + skyNoise(i + 400) * .8} fill={i % 3 ? "#c4c0e2" : "#eed3b2"} opacity={.15 + skyNoise(i + 550) * .6} />;
          })}
        </svg>
      ))}
      {[0, 1, 2].map((layer) => (
        <div className={`cosmic-stars cosmic-depth-${layer}`} key={layer}>
          {Array.from({ length: [90, 44, 20][layer] }, (_, i) => <i key={i} style={{ left: `${skyNoise(i + layer * 101) * 100}%`, top: `${skyNoise(i * 3 + layer * 317 + 29) * 100}%`, "--star-size": `${.5 + skyNoise(i + 711) * (layer === 0 ? .8 : 1.8)}px`, "--star-light": .2 + skyNoise(i + 910) * .65, "--twinkle": `${3.7 + skyNoise(i + 192) * 9.3}s`, animationDelay: `${-skyNoise(i + 532) * 20}s` } as CSSProperties} />)}
        </div>
      ))}
      <div className="hero-starfield">{Array.from({ length: 9 }, (_, i) => <span key={i} className="hero-star" style={{ left: `${8 + skyNoise(i + 410) * 84}%`, top: `${12 + skyNoise(i + 921) * 67}%`, "--hero-size": `${3 + skyNoise(i + 851) * 3}px`, "--twinkle": `${6 + skyNoise(i + 729) * 9}s`, animationDelay: `${-skyNoise(i + 44) * 17}s` } as CSSProperties}><i /></span>)}</div>
      <div className="cosmic-dust">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ left: `${skyNoise(i + 313) * 100}%`, top: `${skyNoise(i + 151) * 100}%`, "--dust-time": `${19 + skyNoise(i + 221) * 27}s`, "--dust-x": `${-40 + skyNoise(i + 101) * 85}px`, animationDelay: `${-skyNoise(i + 87) * 40}s` } as CSSProperties} />)}</div>
      <span className="cosmic-meteor meteor-one" /><span className="cosmic-meteor meteor-two" /><span className="cosmic-comet" />
      <div className="cosmic-grain" /><div className="cosmic-vignette" />
    </div>
  );
}

export function Galaxy({ navigate }: { navigate: (id: string) => void }) {
  const [now] = useState(() => new Date());
  const [activeRing, setActiveRing] = useState(0);
  const [paused, setPaused] = useState(false);
  const { discover, notify } = useUniverse();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return (
    <div className={`galaxy solar-galaxy ${paused ? "orbits-paused" : ""}`}>
      <CosmicSky />
      <header className="galaxy-title solar-title">
        <span className="eyebrow">OUR OWN LITTLE INFINITY</span>
        <h1>Somewhere, <em>just us.</em></h1>
        <p>Everything in this universe leads back to you.</p>
      </header>
      <div className="solar-mobile-rings" aria-label="Choose an orbit">
        {["Close to heart", "Our story", "Little adventures"].map((name, i) => <button key={name} aria-pressed={activeRing === i} onClick={() => setActiveRing(i)}>{name}<small>0{i + 1}</small></button>)}
      </div>
      <div className="solar-system" aria-label="Explore our solar system" onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const box = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--pointer-x", `${(e.clientX - box.left - box.width / 2) / 50}px`);
        e.currentTarget.style.setProperty("--pointer-y", `${(e.clientY - box.top - box.height / 2) / 60}px`);
        e.currentTarget.parentElement?.style.setProperty("--sky-x", `${(e.clientX - box.left - box.width / 2) / 75}px`);
        e.currentTarget.parentElement?.style.setProperty("--sky-y", `${(e.clientY - box.top - box.height / 2) / 85}px`);
      }} onPointerLeave={(e) => { e.currentTarget.style.setProperty("--pointer-x", "0px"); e.currentTarget.style.setProperty("--pointer-y", "0px"); e.currentTarget.parentElement?.style.setProperty("--sky-x", "0px"); e.currentTarget.parentElement?.style.setProperty("--sky-y", "0px"); }}>
        <div className="solar-light-field" aria-hidden="true" />
        <div className="solar-foreground" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${skyNoise(i + 611) * 100}%`, top: `${skyNoise(i + 718) * 100}%`, animationDelay: `${-i * 4.7}s`, "--dust-time": `${24 + i * 2.7}s` } as CSSProperties} />)}</div>
        <div className="solar-center">
          <div className="solar-aura" aria-hidden="true" />
          <div className="solar-heartlights" aria-hidden="true">{[0, 1, 2, 3].map((i) => <svg key={i} viewBox="0 0 24 24" style={{ "--heart-x": `${[-44, 28, -12, 52][i]}px`, "--heart-drift": `${[-16, 22, -9, 12][i]}px`, animationDelay: `${[-1, -7, -12, -4][i]}s`, animationDuration: `${[13, 17, 19, 23][i]}s` } as CSSProperties}><path d="M12 20C-5 10 4 0 12 7C20 0 29 10 12 20Z" /></svg>)}</div>
          <div className="solar-center-sparkles" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ left: `${8 + skyNoise(i + 551) * 84}%`, top: `${skyNoise(i + 381) * 75}%`, animationDelay: `${-i * 2.3}s`, animationDuration: `${5.3 + i * 1.1}s` } as CSSProperties} />)}</div>
          <span className="solar-center-kicker">THE HEART OF IT ALL</span>
          <Couple scene="hold-hands" />
          <p>Janna <span>&</span> Josh</p>
          <small>our favorite place is together.</small>
        </div>
        {[0, 1, 2].map((ring) => (
          <div key={ring} className={`solar-track solar-track-${ring} ${activeRing === ring ? "mobile-active" : ""}`}>
            <div className="solar-orbit-path" aria-hidden="true" />
            <div className="orbit-light-runner" aria-hidden="true"><i /></div>
            {destinations.filter((d) => d.ring === ring).map((d, i) => (
              <div key={d.id} className="orbit-carrier" style={{ "--angle": `${d.angle}deg`, "--mobile-angle": `${-90 + i * 120}deg` } as CSSProperties}>
                <span className="orbit-passing-light" aria-hidden="true" />
                <button className={`solar-destination destination-${d.id}`} onClick={() => navigate(d.id)} aria-label={`${d.name} — ${d.note}`}>
                  <span className="destination-halo" aria-hidden="true" />
                  <CelestialArt kind={d.art} />
                  <strong>{d.name}</strong>
                  <span className="solar-destination-note">{d.note}</span>
                  <span className="destination-sparks" aria-hidden="true"><i /><i /><i /></span>
                </button>
              </div>
            ))}
          </div>
        ))}
        <button className="solar-secret" aria-label="An unusual object" onClick={() => { discover("secret-object"); notify("YOU WEREN’T SUPPOSED TO FIND THAT. ♡"); navigate("vault"); }}><svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3L18 12L27 15L18 18L15 27L12 18L3 15L12 12Z" fill="none" stroke="currentColor" /></svg></button>
      </div>
      <div className="solar-navigation-note"><span>nine little worlds. one gravitational pull.</span><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume orbits" : "Pause orbits"}</button></div>
      <footer className="galaxy-bottom solar-footer">
        <Constellation />
        <button className="daily-note" onClick={() => navigate("daily")}>
          <span className="eyebrow">A NOTE IN YOUR ORBIT · {now.toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
          <p>{dailyMessages[day % dailyMessages.length]}</p>
          <span className="solar-note-signature">with love, Janna ↗</span>
        </button>
      </footer>
    </div>
  );
}
