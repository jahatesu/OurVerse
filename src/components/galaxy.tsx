"use client";
import { useState, type CSSProperties } from "react";
import { Couple } from "./characters";
import { useUniverse } from "./provider";
import { dailyMessages } from "@/data/expansion";
import { settings } from "@/config/settings";
export const destinations = [
  {
    id: "memories",
    name: "Memory Moon",
    note: "little moments, kept forever",
    x: 21,
    y: 24,
    art: "moon",
  },
  {
    id: "story",
    name: "Story Constellation",
    note: "every star led to you",
    x: 48,
    y: 13,
    art: "stars",
  },
  {
    id: "letters",
    name: "Letter Constellation",
    note: "a hug in an envelope",
    x: 77,
    y: 23,
    art: "letter",
  },
  {
    id: "games",
    name: "Game Planet",
    note: "player two, always",
    x: 13,
    y: 58,
    art: "arcade",
  },
  {
    id: "love",
    name: "Love Planet",
    note: "you. a hundred times over.",
    x: 43,
    y: 52,
    art: "heart",
  },
  {
    id: "world",
    name: "Our World",
    note: "same sky. same us.",
    x: 83,
    y: 59,
    art: "earth",
  },
  {
    id: "room",
    name: "Our Home",
    note: "leave the light on for me",
    x: 62,
    y: 77,
    art: "house",
  },
  {
    id: "music",
    name: "Music Satellite",
    note: "the soundtrack of us",
    x: 12,
    y: 88,
    art: "satellite",
  },
  {
    id: "garden",
    name: "Love Garden",
    note: "look what we’re growing",
    x: 38,
    y: 87,
    art: "garden",
  },
];
export function DestinationArt({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 220 160"
      aria-hidden="true"
      className={`destination-art art-${kind}`}
    >
      {kind === "moon" ? (
        <>
          <circle cx="110" cy="75" r="59" fill="#d9d8e7" />
          <path
            d="M127 17A59 59 0 0 1 128 132A66 66 0 0 0 127 17"
            fill="#9c9bbf"
          />
          <g fill="#b8b6d1">
            <ellipse cx="80" cy="54" rx="13" ry="10" />
            <circle cx="119" cy="92" r="16" />
            <circle cx="77" cy="97" r="7" />
            <circle cx="122" cy="39" r="5" />
          </g>
          <path
            d="M46 116Q110 157 177 102"
            stroke="#eadab5"
            strokeWidth="1"
            fill="none"
          />
          <text x="163" y="110" fill="#f9e4bc" fontSize="23">
            ✦
          </text>
        </>
      ) : kind === "stars" ? (
        <>
          <path
            d="M27 105L68 41L108 75L154 29L193 104L108 75L107 136"
            stroke="#c0b4ed"
            strokeWidth="1"
            fill="none"
          />
          {[
            [27, 105],
            [68, 41],
            [108, 75],
            [154, 29],
            [193, 104],
            [107, 136],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill="#bca5e7" opacity=".13" />
              <text x={x - 6} y={y + 5} fill="#e4d3fa" fontSize="18">
                ✦
              </text>
            </g>
          ))}
        </>
      ) : kind === "letter" ? (
        <g transform="rotate(-12 110 80)">
          <path d="M42 41L177 41L177 121L42 121Z" fill="#e6d5be" />
          <path
            d="M42 41L110 93L177 41M42 121L85 81M177 121L135 81"
            fill="none"
            stroke="#b8a48f"
            strokeWidth="2"
          />
          <circle cx="110" cy="88" r="14" fill="#9d5269" />
          <text x="102" y="94" fill="#f5d6d5" fontSize="21">
            ♡
          </text>
          <path
            d="M15 75L26 22L75 12M178 129L202 97L194 37"
            fill="none"
            stroke="#c9b8d4"
            strokeDasharray="3 7"
          />
        </g>
      ) : kind === "arcade" ? (
        <>
          <ellipse cx="109" cy="99" rx="84" ry="45" fill="#525180" />
          <ellipse cx="109" cy="94" rx="84" ry="33" fill="#7874a6" />
          <g transform="rotate(-7 110 80)">
            <path d="M72 15H139L150 104H63Z" fill="#ba8198" />
            <path d="M80 31H133L136 76H77Z" fill="#1c243c" />
            <text x="89" y="60" fill="#e9abc6" fontSize="23">
              ♡
            </text>
            <path d="M73 84H141" stroke="#e1c8da" strokeWidth="3" />
            <circle cx="125" cy="94" r="4" fill="#f9d1a4" />
            <path d="M84 94V85" stroke="#292637" strokeWidth="3" />
          </g>
          <circle cx="159" cy="68" r="5" fill="#eec9a7" />
        </>
      ) : kind === "heart" ? (
        <>
          <ellipse cx="110" cy="81" rx="65" ry="54" fill="#a96680" />
          <path
            d="M57 53Q120 46 174 84M49 81Q116 66 168 108"
            stroke="#ca91a8"
            strokeWidth="13"
            fill="none"
          />
          <ellipse
            cx="110"
            cy="85"
            rx="101"
            ry="22"
            stroke="#e3b7c5"
            strokeWidth="4"
            fill="none"
            transform="rotate(-23 110 85)"
          />
          <text x="95" y="90" fontSize="33" fill="#f9e3dc">
            ♡
          </text>
        </>
      ) : kind === "earth" ? (
        <>
          <circle cx="110" cy="76" r="58" fill="#617fa4" />
          <path
            d="M70 33L107 29L119 49L96 67L88 91L65 86L55 65M147 47L163 61L156 96L136 106L129 76L110 61M88 109L108 99L126 126L110 135"
            fill="#9bac9c"
          />
          <path
            d="M58 98Q121 12 165 74"
            fill="none"
            stroke="#f6e5b8"
            strokeDasharray="3 4"
          />
          <circle cx="72" cy="77" r="4" fill="#fbe6b5" />
          <circle cx="159" cy="67" r="4" fill="#fbe6b5" />
        </>
      ) : kind === "house" ? (
        <>
          <ellipse cx="110" cy="128" rx="83" ry="20" fill="#605367" />
          <path d="M53 68L111 22L166 68V126H53Z" fill="#676079" />
          <path
            d="M39 72L111 15L180 73"
            fill="none"
            stroke="#b18c94"
            strokeWidth="10"
          />
          <path d="M95 128V87H127V128" fill="#edc58a" />
          <rect x="65" y="79" width="20" height="24" fill="#f7d8a3" />
          <rect x="137" y="79" width="18" height="24" fill="#f7d8a3" />
          <path d="M151 46V19H162V56" fill="#766479" />
        </>
      ) : kind === "satellite" ? (
        <g transform="rotate(-23 110 80)">
          <path
            d="M34 52H75V104H34ZM146 52H187V104H146Z"
            fill="#6686a7"
            stroke="#aec5d8"
            strokeWidth="2"
          />
          <path
            d="M48 52V104M61 52V104M160 52V104M173 52V104M34 69H75M34 87H75M146 69H187M146 87H187"
            stroke="#adc3d5"
          />
          <path d="M74 78H146" stroke="#b8b3ca" strokeWidth="6" />
          <rect x="90" y="52" width="40" height="61" rx="8" fill="#c5b6ca" />
          <path
            d="M110 52V27M92 23Q110 47 130 23"
            fill="none"
            stroke="#d8c6d7"
            strokeWidth="4"
          />
          <circle cx="111" cy="79" r="12" fill="#69577f" />
          <text x="102" y="85" fill="#efd5df">
            ♫
          </text>
        </g>
      ) : kind === "garden" ? (
        <>
          <ellipse cx="110" cy="125" rx="68" ry="22" fill="#736986" />
          <path d="M85 103H138L129 137H95Z" fill="#bc8c8e" />
          <path
            d="M111 109V48M111 86Q76 88 77 64Q104 61 111 86M111 73Q139 80 150 49Q118 43 111 73"
            stroke="#9ebda6"
            fill="#7caa97"
            strokeWidth="3"
          />
          <g fill="#d6a4be">
            <circle cx="111" cy="39" r="12" />
            <circle cx="96" cy="49" r="12" />
            <circle cx="125" cy="49" r="12" />
            <circle cx="110" cy="60" r="12" />
          </g>
          <circle cx="111" cy="49" r="9" fill="#f2d69b" />
        </>
      ) : (
        <>
          <path
            d="M76 37L147 56L137 125L66 106Z"
            fill="#66617c"
            stroke="#a89bc4"
          />
          <circle cx="108" cy="81" r="17" fill="#252338" />
          <path d="M108 77V90" stroke="#e6c399" strokeWidth="3" />
          <circle cx="108" cy="75" r="4" fill="#e6c399" />
        </>
      )}
    </svg>
  );
}
export function Constellation({ full = false, illuminated }: { full?: boolean; illuminated?: number }) {
  const { progress } = useUniverse();
  const count = Math.min(
    settings.constellationTarget,
    illuminated ?? progress.discoveries.length,
  );
  const points = Array.from(
    { length: settings.constellationTarget },
    (_, i) => [20 + i * (330 / Math.max(1,settings.constellationTarget-1)), 35 + Math.sin(i * 1.8) * 23],
  );
  return (
    <div
      className={`our-constellation ${full ? "full" : ""}`}
      aria-label={`Our Constellation: ${count} of ${settings.constellationTarget} stars connected`}
    >
      <svg
        viewBox="0 0 370 75"
        role="img"
        aria-label="Stars connecting as you explore"
      >
        <polyline
          points={points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="#ffffff14"
        />
        <polyline
          points={points
            .slice(0, count)
            .map((p) => p.join(","))
            .join(" ")}
          fill="none"
          stroke="#d7bbd4"
        />
        {points.map(([x, y], i) => (
          <text
            key={i}
            x={x - 6}
            y={y + 5}
            fill={i < count ? "#f1d9ab" : "#726980"}
            fontSize="14"
          >
            {i < count ? "✦" : "☆"}
          </text>
        ))}
      </svg>
      <span>
        OUR CONSTELLATION · {count} / {settings.constellationTarget}
      </span>
    </div>
  );
}
export function Galaxy({ navigate }: { navigate: (id: string) => void }) {
  const [now] = useState(() => new Date());
  const { discover, notify } = useUniverse();
  const day = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  return (
    <div className="galaxy">
      <header className="galaxy-title">
        <span className="eyebrow">A TINY UNIVERSE. AN AWFUL LOT OF LOVE.</span>
        <h1>
          Somewhere, <em>just us.</em>
        </h1>
        <p>Pick a star. Follow your heart. Stay a little longer.</p>
      </header>
      <div
        className="galaxy-canvas"
        onPointerMove={(e) => {
          if (
            e.pointerType !== "mouse" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--drift",
            `${(e.clientX - r.left - r.width / 2) / 80}px`,
          );
        }}
      >
        <div className="galaxy-orbit orbit-a" />
        <div className="galaxy-orbit orbit-b" />
        <span className="map-whisper handwritten">
          a place for every little piece of us
        </span>
        {destinations.map((d, i) => (
          <button
            className={`galaxy-destination destination-${d.id}`}
            key={d.id}
            style={
              {
                "--x": `${d.x}%`,
                "--y": `${d.y}%`,
                "--delay": `${-i * 0.7}s`,
              } as CSSProperties
            }
            onClick={() => navigate(d.id)}
          >
            <DestinationArt kind={d.art} />
            <strong>{d.name}</strong>
            <span>{d.note}</span>
          </button>
        ))}
        <button
          className="galaxy-secret"
          aria-label="An unusual object"
          onClick={() => {
            discover("secret-object");
            notify("YOU WEREN’T SUPPOSED TO FIND THAT. ♡");
            navigate("vault");
          }}
        >
          ✧
        </button>
        <div className="galaxy-couple">
          <Couple scene="sit" />
          <span className="handwritten">you’re my whole world.</span>
        </div>
      </div>
      <div className="galaxy-bottom">
        <Constellation />
        <button className="daily-note" onClick={() => navigate("daily")}>
          <span className="eyebrow">
            JOSH’S MESSAGE FOR TODAY ·{" "}
            {now.toLocaleDateString("en", { month: "short", day: "numeric" })}
          </span>
          <p>{dailyMessages[day % dailyMessages.length]}</p>
          <span className="handwritten">♡ Janna</span>
        </button>
      </div>
    </div>
  );
}
