"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Couple } from "./characters";
import { CentralHomeWorld, HomeWorldArt, SpaceRock } from "./home-world-art";
import "./living-universe.css";

type World = { id: string; name: string; note: string; art: string; ring: number; angle: number };
// Distinct nested paths use one clock to retain their cross-lane phase spacing,
// including during hover pauses. Clearance includes labels and hover copy.
const radii = [[330, 285], [470, 380], [610, 475]];
const orbitLanes: Record<string, number> = {
  memories: 0, world: 0,
  love: 1, room: 1, garden: 1,
  story: 2, letters: 2, games: 2, music: 2,
};
const orbitPeriod = 113;
const startingAngles: Record<string, number> = {
  memories: 215, love: 335, room: 95,
  story: 255, letters: 15, world: 35,
  games: 175, music: 295, garden: 135,
};
const noise = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function position(world: World, shift = 0) {
  const [rx, ry] = radii[orbitLanes[world.id] ?? world.ring];
  const angle = ((startingAngles[world.id] ?? world.angle) + shift) * Math.PI / 180;
  return [750 + rx * Math.cos(angle), 550 + ry * Math.sin(angle)];
}

function DeepSky() {
  return <div className="living-deep-sky" aria-hidden="true">
    <svg className="living-nebula" viewBox="-240 -182.4 1980 1504.8" preserveAspectRatio="none">
      <defs><filter id="home-nebula-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="37" /></filter><linearGradient id="home-nebula-color" x2="1" y2="1"><stop stopColor="#35345f" /><stop offset=".5" stopColor="#685071" /><stop offset="1" stopColor="#243356" /></linearGradient></defs>
      <g filter="url(#home-nebula-soft)" opacity=".3"><path d="M-40 870C109 488 391 854 603 462S1020 439 1185 64L1320 57C1074 532 896 344 781 648S263 690 82 1013Z" fill="url(#home-nebula-color)" /><path d="M-20 119C272 9 296 457 595 260S1094 102 1494 439L1528 597C1001 267 846 415 625 373S244 390-20 237Z" fill="#484b78" opacity=".45" /><path d="M121 944Q441 1055 694 794T1520 820L1457 966Q1143 876 821 955T121 944Z" fill="#8f607a" opacity=".35" /></g>
    </svg>
    <svg className="living-distant-stars" viewBox="0 0 1500 1140" preserveAspectRatio="none">
      {Array.from({ length: 165 }, (_, i) => <circle key={i} cx={noise(i + 41) * 1500} cy={noise(i * 3 + 71) * 1140} r={.55 + noise(i + 111) * 1.1} fill={i % 7 === 0 ? "#dfc39f" : "#c4bed8"} opacity={.15 + noise(i + 211) * .45} />)}
      {Array.from({ length: 14 }, (_, i) => { const x = 70 + noise(i + 601) * 1360, y = 40 + noise(i + 631) * 1060; return <g key={i} className={i % 3 === 0 ? "living-star-twinkle" : ""} style={{ animationDelay: `${-i * 1.7}s` }}><path d={`M${x} ${y-4}l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2Z`} fill={i % 4 ? "#cec5df" : "#e9d0aa"} opacity=".65" /></g>; })}
    </svg>
    <svg className="living-mid-stars" viewBox="0 0 1500 1140" preserveAspectRatio="none">
      {Array.from({ length: 24 }, (_, i) => <circle key={i} className={i % 8 === 0 ? "living-star-twinkle" : ""} cx={30 + noise(i + 891) * 1440} cy={50 + noise(i + 935) * 1030} r={1 + noise(i + 903) * 1.15} fill={i % 5 === 0 ? "#ecd5b2" : "#c5b9df"} opacity={.25 + noise(i + 988) * .4} />)}
    </svg>
    <i className="living-shooting-star" /><SpaceRock className="rock-distant" /><SpaceRock className="rock-middle" />
  </div>;
}

export function LivingUniverse({ worlds, navigate, paused, activeRing, onSecret }: { worlds: World[]; navigate: (id: string) => void; paused: boolean; activeRing: number; onSecret: () => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const carriers = useRef<(HTMLDivElement | null)[]>([]);
  const destinationLayer = useRef<HTMLDivElement>(null);
  const hovering = useRef(new Set<string>());
  const focused = useRef(new Set<string>());
  const userPaused = useRef(paused);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  userPaused.current = paused;

  useEffect(() => {
    const element = scene.current, scroller = viewport.current;
    if (!element || !scroller) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = 0, rendered = 0, scale = element.clientWidth / 1500;
    let elapsed = 0, dockFrame = 0;
    // This is a fixed companion viewport corner, not a moving obstacle. The
    // background and central island do not belong to this interaction layer.
    const protectPerch = () => {
      dockFrame = 0;
      const layer = destinationLayer.current;
      const perch = document.querySelector(".corner-home-perch");
      if (!layer || !perch) return;
      const plane = element.getBoundingClientRect(), home = perch.getBoundingClientRect();
      const right = Math.min(plane.width, Math.max(0, home.right + 14 - plane.left));
      const top = Math.max(0, home.bottom - (window.matchMedia("(max-width: 700px)").matches ? 92 : 125) - plane.top);
      layer.style.clipPath = right === 0 || top >= plane.height ? "none" : `polygon(0 0, 100% 0, 100% 100%, ${right}px 100%, ${right}px ${top}px, 0 ${top}px)`;
    };
    const schedulePerch = () => { if (!dockFrame) dockFrame = requestAnimationFrame(protectPerch); };
    const placeWorlds = () => worlds.forEach((world, i) => {
      const arc = reduced.matches ? 0 : elapsed * 360 / orbitPeriod;
      const [x, y] = position(world, arc), [startX, startY] = position(world);
      const carrier = carriers.current[i];
      if (carrier) {
        carrier.style.setProperty("--travel-x", `${(x - startX) * scale}px`);
        carrier.style.setProperty("--travel-y", `${(y - startY) * scale}px`);
        carrier.style.setProperty("--world-depth", `${1 + (y - 550) / radii[orbitLanes[world.id] ?? world.ring][1] * .025}`);
        carrier.style.zIndex = y < 550 ? "1" : "3";
      }
    });
    const resize = new ResizeObserver(() => { scale = element.clientWidth / 1500; placeWorlds(); schedulePerch(); });
    resize.observe(element);
    window.addEventListener("scroll", schedulePerch, true);
    window.addEventListener("resize", schedulePerch);
    schedulePerch();
    scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
    // One phase clock choreographs the compact lane family. Pausing that family
    // preserves separation; artwork stays upright and resumes without a jump.
    const tick = (time: number) => {
      const delta = last ? Math.min(time - last, 70) : 0;
      last = time;
      const moving = !reduced.matches && !document.hidden && !userPaused.current && !hovering.current.size && !focused.current.size;
      if (moving) elapsed += delta / 1000;
      if (moving && time - rendered > 32) placeWorlds();
      if (time - rendered > 32) rendered = time;
      if (!reduced.matches) frame = requestAnimationFrame(tick);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (reduced.matches) {
        element.style.setProperty("--space-x", "0px"); element.style.setProperty("--space-y", "0px");
        carriers.current.forEach(carrier => { carrier?.style.setProperty("--travel-x", "0px"); carrier?.style.setProperty("--travel-y", "0px"); carrier?.style.setProperty("--world-depth", "1"); });
      }
      else frame = requestAnimationFrame(tick);
    };
    reduced.addEventListener("change", reset);
    if (!reduced.matches) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(dockFrame); resize.disconnect();
      window.removeEventListener("scroll", schedulePerch, true); window.removeEventListener("resize", schedulePerch);
      reduced.removeEventListener("change", reset); if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, [worlds]);

  useEffect(() => {
    const scroller = viewport.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    if (activeRing === 0) { scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2; return; }
    const guide = worlds.find(world => world.id === ["", "world", "music"][activeRing]);
    if (guide) scroller.scrollLeft = position(guide)[0] / 1500 * scroller.scrollWidth - scroller.clientWidth / 2;
  }, [activeRing, worlds]);

  return <div className={`living-scene-shell ${paused ? "living-paused" : ""}`}>
    <div className="living-background-viewport" aria-hidden="true"><DeepSky /></div>
    <div className="living-viewport" ref={viewport} role="region" aria-label="Our universe. Pan left or right to explore." tabIndex={0}>
    <div className={`living-universe ${paused ? "living-paused" : ""}`} ref={scene} data-active-ring={activeRing} aria-label="Explore our solar system" onPointerMove={e => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || e.pointerType !== "mouse") return;
      const box = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--space-x", `${Math.max(-7, Math.min(7, (e.clientX - box.left - box.width / 2) / box.width * 14))}px`);
      e.currentTarget.style.setProperty("--space-y", `${Math.max(-5, Math.min(5, (e.clientY - box.top - box.height / 2) / box.height * 10))}px`);
      const shell = e.currentTarget.parentElement?.parentElement;
      shell?.style.setProperty("--space-x", e.currentTarget.style.getPropertyValue("--space-x"));
      shell?.style.setProperty("--space-y", e.currentTarget.style.getPropertyValue("--space-y"));
    }} onPointerLeave={e => {
      e.currentTarget.style.setProperty("--space-x", "0px"); e.currentTarget.style.setProperty("--space-y", "0px");
      e.currentTarget.parentElement?.parentElement?.style.setProperty("--space-x", "0px");
      e.currentTarget.parentElement?.parentElement?.style.setProperty("--space-y", "0px");
    }}>
      <svg className="living-orbit-lines" viewBox="0 0 1500 1140" aria-hidden="true">
        {radii.map(([rx, ry], i) => <g key={i} className={`living-orbit orbit-${i}`}><ellipse cx="750" cy="550" rx={rx} ry={ry} /><ellipse className="orbit-faded-section" cx="750" cy="550" rx={rx} ry={ry} /><circle className="living-orbit-particle" r="2.3" fill="#e3c6a6" style={{ offsetPath: `path('M ${750-rx},550 a ${rx},${ry} 0 1,0 ${rx*2},0 a ${rx},${ry} 0 1,0 -${rx*2},0')`, animationDuration: `${[145, 190, 230][i]}s`, animationDelay: `${-i * 51}s` } as CSSProperties} /></g>)}
      </svg>
      <div className="living-center">
        <div className="central-landscape"><CentralHomeWorld /><div className="central-inhabitants"><Couple scene="hold-hands" /></div></div>
        <div className="central-world-caption"><span>THE HEART OF IT ALL</span><p>Janna <em>&</em> Josh</p><small>our favorite place is together.</small></div>
      </div>
      <div className="living-orbit-destinations" ref={destinationLayer}>
      {worlds.map((world, i) => { const [x,y] = position(world); return <div className={`living-world-carrier carrier-${world.id}`} key={world.id} ref={el => { carriers.current[i] = el; }} style={{ left: `${x / 15}%`, top: `${y / 11.4}%`, zIndex: y < 550 ? 1 : 3, "--world-rhythm": `${[13,19,17,23,21,29,15,31,27][i]}s`, "--world-delay": `${-i * 2.3}s` } as CSSProperties}>
        <button className={`living-world world-art-${world.art} ${pressed === world.id ? "world-entering" : ""}`} aria-label={`${world.name} — ${world.note}`} onPointerEnter={() => { hovering.current.add(world.id); scene.current?.classList.add("living-interacting"); }} onPointerLeave={() => { hovering.current.delete(world.id); if (!focused.current.size && !hovering.current.size) scene.current?.classList.remove("living-interacting"); }} onFocus={() => { focused.current.add(world.id); scene.current?.classList.add("living-interacting"); }} onBlur={() => { focused.current.delete(world.id); if (!hovering.current.size && !focused.current.size) scene.current?.classList.remove("living-interacting"); }} onClick={() => {
          if (clickTimer.current) return;
          setPressed(world.id);
          clickTimer.current = setTimeout(() => { clickTimer.current = null; navigate(world.id); setPressed(null); }, 90);
        }}>
          <span className="world-illustration"><HomeWorldArt kind={world.art} /></span>
          <span className="world-name"><i aria-hidden="true">✦</i> {world.name}</span>
          <span className="world-whisper">{world.note}</span>
        </button>
      </div>; })}
      </div>
      <div className="living-foreground" aria-hidden="true"><SpaceRock className="rock-near" /><span className="near-star">✧</span></div>
      <button className="living-secret" aria-label="An unusual object" onClick={onSecret}><svg viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3L18 12L27 15L18 18L15 27L12 18L3 15L12 12Z" fill="none" stroke="currentColor" /></svg></button>
    </div>
    </div>
  </div>;
}
