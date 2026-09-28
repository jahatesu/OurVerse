"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { dailyMessages } from "@/data/expansion";
import { songs } from "@/data/songs";
import { settings } from "@/config/settings";
import { Controls, usePlayer } from "./music";
import { useUniverse } from "./provider";
import { EdgeCloud, EdgeDrifter, EdgeHorizon, EdgeMemories, EdgeMoon, EdgeNook, EdgeTurntable } from "./home-edge-art";
import "./home-edge-footer.css";

const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function HomeEdgeFooter({ navigate, onDev }: { navigate: (id: string) => void; onDev: () => void }) {
  const [now] = useState(() => new Date());
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  const { progress } = useUniverse();
  const count = Math.min(settings.constellationTarget, progress.discoveries.length);
  const player = usePlayer(), song = songs[player.index];
  const reduced = useReducedMotion();
  const scene = useRef<HTMLElement>(null);
  const vinyl = useRef<SVGGElement>(null);
  const recordMotion = useRef({ angle: 0, speed: 0 });

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const groups = Array.from(element.querySelectorAll<HTMLElement>("[data-edge-depth]"));
    if (reduced) {
      element.classList.remove("edge-motion-ready");
      groups.forEach(group => group.style.setProperty("--edge-shift", "0px"));
      return;
    }
    let frame = 0;
    const paint = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      if (box.bottom < -150 || box.top > window.innerHeight + 150) return;
      const mobile = window.innerWidth < 700;
      groups.forEach(group => {
        const parent = group.parentElement!;
        const center = box.top + parent.offsetTop + parent.offsetHeight / 2;
        const depth = Number(group.dataset.edgeDepth);
        const offset = Math.max(mobile ? -42 : -85, Math.min(mobile ? 42 : 85, (window.innerHeight * .55 - center) * depth * (mobile ? .55 : 1)));
        group.style.setProperty("--edge-shift", `${offset.toFixed(2)}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("edge-revealed"); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: "40px" });
    element.classList.add("edge-motion-ready");
    element.querySelectorAll("[data-edge-reveal]").forEach(item => observer.observe(item));
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      element.classList.remove("edge-motion-ready");
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let frame = 0, last = 0;
    const spin = (time: number) => {
      const delta = last ? Math.min((time - last) / 1000, .07) : 0;
      last = time;
      const state = recordMotion.current, target = player.playing && !document.hidden ? 24 : 0;
      state.speed += (target - state.speed) * (1 - Math.exp(-delta * 3));
      state.angle = (state.angle + state.speed * delta) % 360;
      vinyl.current?.setAttribute("transform", `rotate(${state.angle.toFixed(3)})`);
      if (player.playing || state.speed > .04) frame = requestAnimationFrame(spin);
      else state.speed = 0;
    };
    if (player.playing || recordMotion.current.speed > 0) frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, [player.playing, player.index, reduced]);

  return <footer className="home-edge" ref={scene} aria-label="The quiet edge of OurVerse">
    <div className="edge-far-space" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".04">
      <svg viewBox="0 0 1600 1700" preserveAspectRatio="none"><defs><linearGradient id="edge-nebula-color" x2="1" y2="1"><stop stopColor="#5b4b76" stopOpacity="0" /><stop offset=".5" stopColor="#6d5174" stopOpacity=".16" /><stop offset="1" stopColor="#485c7c" stopOpacity="0" /></linearGradient><filter id="edge-nebula-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="42" /></filter></defs>
        <g filter="url(#edge-nebula-soft)">
        <path d="M-250 580C300 160 210 1090 740 593S1600 452 1880 70L1880 230C1410 760 990 483 771 919S213 680-250 883Z" fill="url(#edge-nebula-color)" />
        <path d="M-200 1260Q284 1061 535 1230T1720 931L1720 1320Q967 1510 713 1360T-200 1440Z" fill="#7a607a" opacity=".045" />
        </g>
        {Array.from({ length: 92 }, (_, i) => { const x = 20 + ((i * 197.31 + i * i * 31.21) % 1560), y = 20 + ((i * 133.71 + i * i * 11.9) % 1640); return <circle key={i} cx={x} cy={y} r={i % 11 === 0 ? 1.7 : .85} fill={i % 7 === 0 ? "#dfc5a8" : "#bab4d0"} opacity={.17 + (i % 5) * .08} />; })}
      </svg>
    </div></div>
    <div className="edge-cloud edge-cloud-far" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".09"><EdgeCloud variant={1} /></div></div>
    <div className="edge-drifter distant" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".08"><EdgeDrifter planet /></div></div>

    <section className="edge-daily" aria-label="Today's changing note"><div className="edge-depth-inner" data-edge-depth=".07"><div className="edge-reveal" data-edge-reveal>
      <div className="edge-day-moon"><EdgeMoon /></div>
      <button className="edge-daily-note" onClick={() => navigate("daily")}>
        <span className="edge-eyebrow">A GENTLE REMINDER FOR TODAY · {now.toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
        <p>{dailyMessages[day % dailyMessages.length]}</p>
        <span className="edge-note-signature">with love, Janna ↗</span>
      </button>
      <span className="edge-note-heart" aria-hidden="true">♡</span>
    </div></div></section>

    <div className="edge-nook" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".16"><div className="edge-reveal" data-edge-reveal><EdgeNook /></div></div></div>

    <section className="edge-little-moments" aria-label={`Little Moments: ${count} of ${settings.constellationTarget} stars connected`}><div className="edge-depth-inner" data-edge-depth=".18"><div className="edge-reveal" data-edge-reveal>
      <h2>Little Moments</h2><p className="edge-eyebrow">A CONSTELLATION OF US</p>
      <EdgeMemories count={count} target={settings.constellationTarget} />
      <span className="edge-discovery-count">{count} / {settings.constellationTarget} stars connected</span>
    </div></div></section>

    <section className={`edge-record ${player.playing ? "is-playing" : ""}`} aria-label="Our illustrated record player"><div className="edge-depth-inner" data-edge-depth=".20"><div className="edge-reveal" data-edge-reveal>
      <EdgeTurntable vinylRef={vinyl} />
      <div className="edge-record-caption">
        <span className="edge-eyebrow">A LITTLE SOUND IN THE SILENCE</span>
        <button className="edge-track-title" onClick={() => navigate("music")}>{song.title}</button>
        <p className="edge-track-artist">{song.artist}</p>
        <Controls />
        <label className="sr-only" htmlFor="home-edge-progress">Track position</label>
        <input id="home-edge-progress" type="range" min={0} max={player.duration || 1} step={.1} value={player.time} disabled={!player.duration} onChange={e => player.seek(Number(e.target.value))} />
        <div className="edge-track-times"><span>{timeLabel(player.time)}</span><span>{timeLabel(player.duration)}</span></div>
        <p className="edge-soundtrack-line">Our soundtrack, forever.</p>
        {player.error && <p className="edge-audio-notice" role="status">{player.error}</p>}
      </div>
    </div></div></section>

    <div className="edge-cloud edge-cloud-mid" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".14"><EdgeCloud /></div></div>
    <div className="edge-drifter near" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".28"><EdgeDrifter /></div></div>
    <div className="edge-cloud edge-cloud-near" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".28"><EdgeCloud /></div></div>
    <div className="edge-cloud edge-cloud-front" aria-hidden="true"><div className="edge-depth-inner" data-edge-depth=".34"><EdgeCloud variant={1} /></div></div>

    <section className="edge-finale" aria-label="See you tomorrow"><div className="edge-depth-inner" data-edge-depth=".10">
      <EdgeHorizon />
      <div className="edge-goodnight edge-reveal" data-edge-reveal>
        <p>in every universe,<br className="edge-mobile-break" /> i&apos;m inlove with you</p>
        <span>made with love, from Janna <button onClick={() => navigate("press")} aria-label="A little heart">♡</button></span>
      </div>
    </div></section>
    {process.env.NODE_ENV === "development" && <button className="edge-dev" onClick={onDev} title="Open Janna’s development controls (Alt + Shift + D)">Janna Mode ✦</button>}
  </footer>;
}
