"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Letter } from "@/data/types";
import "./letters-sanctuary.css";

type SanctuaryLetter = {
  letter: Letter;
  locked: boolean;
  lockLabel: string;
};

type LettersSanctuaryProps = {
  items: SanctuaryLetter[];
  opening: string | null;
  onSelect: (id: string) => void;
  onOpened: (letter: Letter) => void;
};

const palettes = ["rose", "midnight", "ivory", "sage", "peach", "violet"];
const seals = ["heart", "moon", "star", "flower", "leaf", "jj"];

function SealMark({ kind }: { kind: string }) {
  if (kind === "moon") return <path d="M18 9a8 8 0 1 0 6 13 7 7 0 1 1-6-13Z" />;
  if (kind === "star") return <path d="m18 8 2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5Z" />;
  if (kind === "flower") return <path d="M18 17c-8-9 7-12 3-2 8-7 11 8 2 4 7 8-8 11-4 2-8 7-11-8-2-4-7-8 8-11 4-2 8-7 11 8 2 4Z" />;
  if (kind === "leaf") return <path d="M10 24c2-10 8-14 16-14-1 9-6 15-16 14Zm2-2 11-9" />;
  if (kind === "jj") return <path d="M11 11v8c0 5-5 5-6 2m16-10v8c0 5-5 5-6 2" />;
  return <path d="M18 25C4 17 9 8 18 15c9-7 14 2 0 10Z" />;
}

function IllustratedEnvelope({
  item,
  index,
  opening,
  onSelect,
}: {
  item: SanctuaryLetter;
  index: number;
  opening: string | null;
  onSelect: (id: string) => void;
}) {
  const letterRef = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);
  const lowerTitle = item.letter.title.toLowerCase();
  const isAnniversary = item.letter.id === "anniversary";
  const isBirthday = item.letter.id === "birthday";
  const palette = isAnniversary
    ? "ivory"
    : isBirthday
      ? "sage"
      : lowerTitle.includes("i’m mad")
        ? "rose"
        : lowerTitle.includes("you’re mad")
          ? "peach"
          : lowerTitle.includes("miss") || lowerTitle.includes("remember")
    ? "rose"
    : lowerTitle.includes("distant")
      ? "midnight"
      : lowerTitle.includes("sad")
        ? "ivory"
        : lowerTitle.includes("stressed") || lowerTitle.includes("jealous")
          ? "sage"
          : lowerTitle.includes("motivation") || lowerTitle.includes("insecure")
            ? "violet"
            : lowerTitle.includes("bad day")
              ? "peach"
            : palettes[index % palettes.length];
  const seal = isAnniversary
    ? "jj"
    : isBirthday
      ? "star"
      : lowerTitle.includes("i’m mad")
        ? "heart"
        : lowerTitle.includes("you’re mad")
          ? "star"
      : lowerTitle.includes("miss") || lowerTitle.includes("remember")
    ? "heart"
    : lowerTitle.includes("distant")
      ? "moon"
      : lowerTitle.includes("sad")
        ? "flower"
        : lowerTitle.includes("stressed") || lowerTitle.includes("motivation") || lowerTitle.includes("bad day") || lowerTitle.includes("insecure")
          ? "star"
          : lowerTitle.includes("jealous")
          ? "leaf"
          : lowerTitle.includes("fight")
            ? "jj"
            : seals[index % seals.length];
  const hasKiss = lowerTitle.includes("miss") || lowerTitle.includes("love");
  const hasFlower = lowerTitle.includes("sad") || lowerTitle.includes("bad day") || isAnniversary || isBirthday;
  const identity = isAnniversary
    ? "anniversary"
    : isBirthday
      ? "birthday"
      : lowerTitle.includes("fight")
        ? "fight"
        : lowerTitle.includes("distant")
          ? "distant"
          : lowerTitle.includes("stressed")
            ? "stressed"
            : lowerTitle.includes("jealous")
              ? "jealous"
              : lowerTitle.includes("insecure")
                ? "insecure"
                : lowerTitle.includes("bad day")
                  ? "bad-day"
                  : lowerTitle.includes("motivation")
                    ? "motivation"
                    : lowerTitle.includes("remember")
                      ? "love"
                    : lowerTitle.includes("miss")
                      ? "miss"
                      : lowerTitle.includes("sad")
                        ? "sad"
                        : lowerTitle.includes("i’m mad")
                          ? "im-mad"
                          : "youre-mad";
  const isOpening = opening === item.letter.id;
  const title = item.letter.title;
  const normalLabel = title.toLowerCase().startsWith("open when ");
  const longLabel = title.length > 42;
  const style = {
    "--letter-index": index,
    "--float-time": `${6.15 + index * 0.37}s`,
    "--float-delay": `${-0.8 - index * 0.71}s`,
    "--float-x-start": `${index % 2 ? 2 + (index % 3) : -2 - (index % 3)}px`,
    "--float-x-end": `${index % 2 ? -2 - (index % 3) : 2 + (index % 3)}px`,
    "--float-rise": `${-3 - (index % 5)}px`,
    "--float-sway-start": `${index % 2 ? -0.5 - (index % 4) * 0.2 : 0.5 + (index % 4) * 0.2}deg`,
    "--float-sway-end": `${index % 2 ? 0.6 + (index % 3) * 0.25 : -0.6 - (index % 3) * 0.25}deg`,
    "--reveal-delay": `${0.28 + index * 0.065}s`,
  } as CSSProperties;

  useEffect(() => {
    const node = letterRef.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={letterRef}
      className={`ls-letter ls-letter-${palette} ls-letter-${identity}${longLabel ? " has-long-label" : ""}${revealed ? " is-revealed" : ""}${isOpening ? " is-opening" : ""}${opening && !isOpening ? " is-receding" : ""}`}
      style={style}
      disabled={item.locked || opening !== null}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewportCenterX = (viewport?.offsetLeft ?? 0) + (viewport?.width ?? window.innerWidth) / 2;
        const viewportCenterY = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) / 2;
        event.currentTarget.style.setProperty("--open-viewport-x", `${viewportCenterX - (rect.left + rect.width / 2)}px`);
        event.currentTarget.style.setProperty("--open-viewport-y", `${viewportCenterY - (rect.top + rect.height / 2)}px`);
        onSelect(item.letter.id);
      }}
      aria-label={`${title}${item.locked ? `, locked, ${item.lockLabel}` : ""}`}
    >
      <span className="ls-float">
        <span className="ls-envelope-shell">
          <svg className="ls-envelope-art" viewBox="0 0 300 194" aria-hidden="true">
            <defs>
              <linearGradient id={`paper-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--paper-light)" />
                <stop offset=".55" stopColor="var(--paper)" />
                <stop offset="1" stopColor="var(--paper-shadow)" />
              </linearGradient>
              <linearGradient id={`fold-${index}`} x1=".2" y1="0" x2=".8" y2="1">
                <stop stopColor="var(--paper-mid)" />
                <stop offset="1" stopColor="var(--paper-shadow)" />
              </linearGradient>
              <filter id={`texture-${index}`} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed={index + 3} result="noise" />
                <feColorMatrix in="noise" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .055 0" />
              </filter>
            </defs>
            <path className="ls-envelope-edge" d="M15 23Q14 17 21 16L278 13Q286 14 286 22L290 173Q289 181 281 182L18 185Q10 183 11 175Z" />
            <path d="M18 20L281 17L285 178L15 181Z" fill={`url(#paper-${index})`} />
            <path d="M16 179 111 91q38-31 77 0l96 87Z" fill={`url(#fold-${index})`} opacity=".92" />
            <g className="ls-top-flap">
              <path d="m16 22 112 83q21 16 43 0L282 19Z" fill="var(--paper-mid)" />
              <path d="m17 22 111 78q21 15 43 0L281 19" fill="none" stroke="var(--seam)" strokeWidth="2" />
            </g>
            <path d="m17 179 99-85M284 177l-99-84" fill="none" stroke="var(--seam)" strokeWidth="1.6" opacity=".8" />
            <path d="M24 28 274 25M22 171l256-2" fill="none" stroke="var(--edge-light)" strokeWidth="2" opacity=".65" />
            <rect x="15" y="18" width="270" height="162" filter={`url(#texture-${index})`} opacity=".48" />
            {hasKiss && (
              <g className="ls-kiss" transform="translate(235 135) rotate(-12)" fill="var(--kiss)">
                <path d="M0 6Q10-4 21 5 12 11 0 6Z" opacity=".75" />
                <path d="M0 8Q11 15 22 6 13 5 0 8Z" opacity=".55" />
                <path d="M5 7q6-3 12 0" fill="none" stroke="var(--kiss)" strokeWidth="1" opacity=".7" />
              </g>
            )}
            {hasFlower && (
              <g className="ls-pressed-flower" transform="translate(48 122) rotate(-18)">
                <path d="M0 31Q14 15 13 0M9 11l-8-5m10 12 10-4" fill="none" stroke="#748979" strokeWidth="2" />
                <path d="M12 2c-10-7-11 7-2 5-3 10 11 7 6-1 10 2 7-11-1-6Z" fill="#b98b9f" />
                <circle cx="12" cy="4" r="2" fill="#dfc18e" />
              </g>
            )}
            {(lowerTitle.includes("distant") || lowerTitle.includes("motivation") || lowerTitle.includes("insecure") || isBirthday || isAnniversary) && (
              <g fill="var(--ink-accent)" opacity=".76">
                <path d="M242 43l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
                <circle cx="263" cy="64" r="2" /><circle cx="226" cy="58" r="1.5" />
              </g>
            )}
            {lowerTitle.includes("i’m mad") && (
              <g fill="none" stroke="var(--ink-accent)" strokeWidth="2" opacity=".7">
                <path d="M228 67q3-13 14-9 7-14 18-2 13-2 14 11Z" />
                <path d="m239 72-4 8m15-8-4 8m15-8-4 8" />
              </g>
            )}
            {lowerTitle.includes("you’re mad") && (
              <g fill="none" stroke="var(--ink-accent)" strokeWidth="2" opacity=".7">
                <path d="M235 76q-8-10 2-18m12 18q-8-12 3-22" />
                <path d="m268 51 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="var(--ink-accent)" />
              </g>
            )}
            {lowerTitle.includes("stressed") && (
              <g fill="none" stroke="var(--ink-accent)" strokeWidth="1.8" opacity=".7">
                <path d="M229 51q21-18 27 1-25-3-15 16 8-14 23-3" />
                <path d="m265 61 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="var(--ink-accent)" />
              </g>
            )}
            {lowerTitle.includes("fight") && (
              <g fill="none" stroke="var(--ink-accent)" strokeWidth="1.8" opacity=".68">
                <path d="m226 55 3 7 7 3-7 3-3 7-3-7-7-3 7-3Zm42 0 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM237 65q15 12 29 0" />
              </g>
            )}
            {lowerTitle.includes("jealous") && (
              <g fill="none" stroke="var(--ink-accent)" strokeWidth="1.8" opacity=".68">
                <path d="M230 76q5-22 29-27m-17 15q-12-10-16 2 10 7 16-2Zm9-7q5-14 17-8-3 12-17 8Z" />
                <path d="M260 72c-8-7-13 4 0 13 13-9 8-20 0-13Z" fill="var(--ink-accent)" />
              </g>
            )}
            {lowerTitle.includes("miss") && (
              <path d="M245 52c-9-7-15 5 0 15 15-10 9-22 0-15Zm20 17c-6-5-10 3 0 10 10-7 6-15 0-10Z" fill="var(--ink-accent)" opacity=".55" />
            )}
          </svg>
          <span className="ls-written-label">
            {normalLabel ? (
              <><small>Open when</small>{title.slice(10)}</>
            ) : isAnniversary ? (
              <>Our First<br />Anniversary</>
            ) : isBirthday ? (
              <>A Birthday Wish<br />for You</>
            ) : (
              <>{title}</>
            )}
          </span>
          <span className={`ls-wax ls-wax-${seal}`} aria-hidden="true">
            <svg viewBox="0 0 36 36"><SealMark kind={seal} /></svg>
          </span>
          {item.locked && <span className="ls-lock" aria-hidden="true"><i /><i /><b /></span>}
          <span className="ls-hover-spark ls-hover-spark-a" aria-hidden="true" />
          <span className="ls-hover-spark ls-hover-spark-b" aria-hidden="true" />
          <span className="ls-open-hint">{item.locked ? item.lockLabel : "open me ♡"}</span>
        </span>
        <span className="ls-letter-note">{item.locked ? item.lockLabel : "A little love, just for you."}</span>
      </span>
    </button>
  );
}

function LanternCorner() {
  return (
    <svg className="ls-lantern-corner" viewBox="0 0 420 310" aria-hidden="true">
      <defs>
        <radialGradient id="lantern-light"><stop stopColor="#ffd78f" stopOpacity=".65" /><stop offset="1" stopColor="#e8a466" stopOpacity="0" /></radialGradient>
        <linearGradient id="book-cover" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#715268" /><stop offset="1" stopColor="#33293f" /></linearGradient>
      </defs>
      <ellipse className="ls-lantern-pool" cx="116" cy="170" rx="135" ry="120" fill="url(#lantern-light)" />
      <path d="M0 251Q124 230 242 247t178-8v71H0Z" fill="#151527" />
      <path d="M18 244q68-12 146 1l-4 19H16Z" fill="#392b42" />
      <path d="M32 222q70-10 144 3l-4 22H27Z" fill="#5b3f55" />
      <path d="M43 195q75-9 147 4l-5 26H38Z" fill="url(#book-cover)" stroke="#9b7180" />
      <text x="72" y="214" fill="#e2c5b2" fontFamily="Georgia, serif" fontSize="10" letterSpacing="2">OUR LETTERS ♡</text>
      <g className="ls-lantern" transform="translate(67 57)">
        <path d="M22 28Q24 1 54 1t32 27" fill="none" stroke="#9e806a" strokeWidth="5" />
        <path d="M16 42h76l-9 103H25Z" fill="#44344a" stroke="#b08a6d" strokeWidth="3" />
        <path d="M32 54h44l-5 72H38Z" fill="#f1b865" opacity=".72" />
        <path className="ls-flame" d="M54 113q-15-17 3-36 17 23 2 37Z" fill="#ffe0a0" />
        <path d="M9 35h90v10H9Zm10 105h70l-8 13H27Z" fill="#795d59" />
        <path d="M39 54 34 129m35-75 7 75" stroke="#d5b190" strokeWidth="2" opacity=".55" />
      </g>
      <g className="ls-sleeping-cat" transform="translate(205 197)">
        <ellipse cx="66" cy="66" rx="78" ry="16" fill="#090a15" opacity=".55" />
        <path d="M23 52Q20 14 55 13q52-5 65 40-13 22-54 20Q36 74 23 52Z" fill="#242235" />
        <path className="ls-cat-tail" d="M23 46Q7 32 13 16l18 14M105 38q32 0 39 22 4 17-19 20" fill="none" stroke="#242235" strokeWidth="14" strokeLinecap="round" />
        <path d="m33 22 5-20 15 16m21 0L91 3l-2 25" fill="#29263b" stroke="#45354f" strokeWidth="2" />
        <path d="M43 35q5 4 10 0m14 0q5 4 10 0" fill="none" stroke="#d4b991" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 49q8 5 16 0" fill="none" stroke="#9e7485" strokeWidth="2" />
      </g>
      <path d="M184 279q35-27 70 4m-47-1 19-29" fill="none" stroke="#947c73" strokeWidth="3" />
      <path d="M316 267q9-27 19-3 17-18 17 9" fill="none" stroke="#698377" strokeWidth="3" />
      <circle cx="325" cy="258" r="5" fill="#c895a6" /><circle cx="351" cy="267" r="4" fill="#e1c7bb" />
    </svg>
  );
}

function ArchedWindow() {
  return (
    <svg className="ls-window" viewBox="0 0 330 620" aria-hidden="true">
      <defs>
        <linearGradient id="window-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#322750" /><stop offset=".58" stopColor="#765276" /><stop offset="1" stopColor="#c4838e" /></linearGradient>
        <linearGradient id="window-frame" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a98b9e" /><stop offset=".5" stopColor="#5e4969" /><stop offset="1" stopColor="#2d283e" /></linearGradient>
      </defs>
      <path d="M43 570V186Q43 39 165 24q122 15 122 162v384Z" fill="#16162a" stroke="url(#window-frame)" strokeWidth="25" />
      <path d="M68 548V190Q68 73 165 52q97 21 97 138v358Z" fill="url(#window-sky)" />
      <g className="ls-window-clouds" fill="#d7a2b1" opacity=".52">
        <path d="M62 389q30-38 68-9 31-47 78-4 34-18 61 21v48H62Z" />
        <path d="M68 470q42-38 83 1 46-58 113 6v71H68Z" fill="#8f6b91" />
      </g>
      <path d="M165 55v493M68 288h194" stroke="#4a3c59" strokeWidth="9" />
      <g fill="#f1d5b2"><circle cx="111" cy="154" r="2" /><circle cx="218" cy="120" r="2.5" /><path d="m204 211 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" /></g>
      <path d="M303 73q-45 78-18 169t-8 204q-17 65-8 151" fill="none" stroke="#596f67" strokeWidth="7" />
      <path d="M289 151q-30-21-36 13 28 10 36-13Zm-1 86q28-25 35 7-23 18-35-7Zm-3 133q-31-21-37 12 25 15 37-12Z" fill="#78907d" stroke="#40594f" strokeWidth="2" />
      <g fill="#d7a5b3"><circle cx="277" cy="195" r="9" /><circle cx="296" cy="310" r="8" /><circle cx="268" cy="466" r="10" /></g>
    </svg>
  );
}

function LowerSanctuaryDetails() {
  return (
    <svg className="ls-lower-details" viewBox="0 0 1600 720" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="lower-candle-glow"><stop stopColor="#ffd99c" stopOpacity=".38" /><stop offset="1" stopColor="#d99b72" stopOpacity="0" /></radialGradient>
        <linearGradient id="lower-book" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#76546c" /><stop offset="1" stopColor="#30263d" /></linearGradient>
      </defs>
      <g className="ls-lower-nook" transform="translate(1245 420)">
        <path d="M0 228q190-18 390 0v28H0Z" fill="#211b2a" stroke="#5b4252" strokeWidth="4" />
        <path d="M22 205h164v23H17Z" fill="#493547" />
        <path d="M34 178h178v28H26Z" fill="url(#lower-book)" stroke="#9b7180" />
        <path d="M51 150h144v29H42Z" fill="#655063" stroke="#a17e83" />
        <text x="71" y="170" fill="#d9bdac" fontFamily="Georgia,serif" fontSize="11" letterSpacing="2">OUR LETTERS</text>
        <g transform="translate(213 117)">
          <ellipse cx="34" cy="64" rx="75" ry="67" fill="url(#lower-candle-glow)" />
          <rect x="17" y="29" width="34" height="70" rx="7" fill="#ddc6ac" />
          <path className="ls-lower-flame" d="M34 29q-12-17 2-29 13 16 2 29Z" fill="#f5c477" />
          <path d="M20 47q8 6 28 0" fill="none" stroke="#b59682" strokeWidth="2" />
        </g>
        <g transform="translate(269 26)">
          <rect x="0" y="0" width="105" height="87" rx="3" fill="#32283b" stroke="#9b7b83" strokeWidth="7" />
          <rect x="15" y="15" width="75" height="57" fill="#d8c2bb" />
          <text x="52" y="49" textAnchor="middle" fill="#77576b" fontFamily="Georgia,serif" fontStyle="italic" fontSize="17">J + J</text>
        </g>
        <path d="M252 111h125l8 73H241Z" fill="#dfcdb8" transform="rotate(-4 313 148)" />
        <path d="M269 132h90m-84 14h76m-69 14h61" stroke="#967b7e" strokeWidth="2" opacity=".48" />
        <path d="M242 193h122" stroke="#b68b69" strokeWidth="7" strokeLinecap="round" transform="rotate(7 303 196)" />
        <circle cx="222" cy="203" r="16" fill="#895369" /><path d="m222 193 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#e2ba9c" />
      </g>
    </svg>
  );
}

export function LettersSanctuary({ items, opening, onSelect, onOpened }: LettersSanctuaryProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (!opening) return;
    const item = itemsRef.current.find(({ letter }) => letter.id === opening);
    if (!item) return;
    const timer = window.setTimeout(() => onOpened(item.letter), 780);
    return () => window.clearTimeout(timer);
  }, [onOpened, opening]);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty("--parallax-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--parallax-y", y.toFixed(3));
  }

  return (
    <section
      ref={sceneRef}
      className={`letters-sanctuary${opening ? " has-opening" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--parallax-x", "0");
        event.currentTarget.style.setProperty("--parallax-y", "0");
      }}
    >
      <div className="ls-sky" aria-hidden="true"><i /><i /><i /></div>
      <div className="ls-stars ls-stars-far" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ "--sx": `${(i * 37 + 9) % 97}%`, "--sy": `${(i * 61 + 13) % 91}%`, "--sd": `${i * -.37}s`, "--ss": `${1 + (i % 3) * .45}px`, "--st": `${5.7 + (i % 7) * .71}s` } as CSSProperties} />)}</div>
      <div className="ls-stars ls-stars-near" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--sx": `${(i * 43 + 17) % 94}%`, "--sy": `${(i * 29 + 8) % 86}%`, "--sd": `${i * -.53}s`, "--ss": `${2 + (i % 3)}px`, "--st": `${7.1 + (i % 5) * .83}s` } as CSSProperties} />)}</div>
      <svg className="ls-threads" viewBox="0 0 1600 1050" preserveAspectRatio="none" aria-hidden="true">
        <path d="M310 360Q590 160 875 345t390-35" /><path d="M430 760q260-290 590-118t360-170" />
        <circle cx="512" cy="269" r="4" /><circle cx="937" cy="389" r="3" /><circle cx="781" cy="637" r="4" />
      </svg>
      <header className="ls-heading">
        <span>✧ WORDS TO KEEP YOU COMPANY</span>
        <h1>For whenever<br />you need me.</h1>
        <p>A little piece of my heart, sealed just for you.<br />Pick the one you need today.</p>
        <svg viewBox="0 0 64 28" aria-hidden="true"><path d="M5 17q10-13 20 0 10-13 20 0-10 11-20 8Q15 28 5 17Zm42 2q8-8 13-2" /></svg>
      </header>
      <div className="ls-hanging-charms" aria-hidden="true">
        <i /><i /><i />
      </div>
      <i className="ls-drifting-petal" aria-hidden="true" />
      <div className="ls-cluster">
        {items.map((item, index) => (
          <IllustratedEnvelope key={item.letter.id} item={item} index={index} opening={opening} onSelect={onSelect} />
        ))}
      </div>
      <LanternCorner />
      <ArchedWindow />
      <LowerSanctuaryDetails />
    </section>
  );
}
