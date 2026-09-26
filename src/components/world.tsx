"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Heart } from "lucide-react";
import { relationship } from "@/data/relationship";
import { SectionHeading } from "./ui";
function localTime(now: Date, zone: string) {
  return {
    time: new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hour: "numeric",
      minute: "2-digit",
    }).format(now),
    date: new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(now),
    hour: Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: zone,
        hour: "numeric",
        hourCycle: "h23",
      }).format(now),
    ),
  };
}
const greeting = (hour: number) =>
  hour < 5
    ? "Sweet dreams"
    : hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : hour < 21
          ? "Good evening"
          : "Sweet dreams";
export function World() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const locations = [
    {
      name: "Janna",
      location: "Philippines",
      zone: relationship.authorTimezone,
      flag: "🇵🇭",
    },
    {
      name: "Josh",
      location: "Colorado, USA",
      zone: relationship.recipientTimezone,
      flag: "🇺🇸",
    },
  ];
  return (
    <>
      <SectionHeading
        eyebrow="THE MILES ARE JUST A DETAIL"
        title="Two places. One us."
        description="Different views from our windows. The very same moon."
      />
      <section className="world-card">
        <div className="world-visual">
          <svg
            viewBox="0 0 800 330"
            role="img"
            aria-label="A stylized globe connecting Colorado in the United States to the Philippines"
          >
            <defs>
              <pattern
                id="map-dots"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="4" cy="4" r="2" fill="#6c648e" />
              </pattern>
              <linearGradient id="connection">
                <stop stopColor="#b8a3ee" />
                <stop offset="1" stopColor="#efaabd" />
              </linearGradient>
            </defs>
            <ellipse
              cx="400"
              cy="170"
              rx="360"
              ry="145"
              fill="none"
              stroke="#716684"
              opacity=".15"
            />
            <path
              d="M90 70 130 40 230 50 290 95 255 130 230 130 205 175 155 150 135 105ZM225 180 275 195 300 250 265 305 245 260ZM380 80 420 60 465 95 435 130 385 120ZM400 140 460 130 490 195 445 265 415 230ZM470 60 610 40 720 85 685 135 620 135 600 190 560 165 520 110ZM625 230 680 205 735 245 700 280 650 275Z"
              fill="url(#map-dots)"
            />
            <path
              className="world-connection"
              d="M183 118 Q400 -25 634 180"
              fill="none"
              stroke="url(#connection)"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <circle cx="183" cy="118" r="7" fill="#c6b2fa" />
            <circle cx="183" cy="118" r="17" fill="#c6b2fa" opacity=".15" />
            <circle cx="634" cy="180" r="7" fill="#ecb0c1" />
            <circle cx="634" cy="180" r="17" fill="#ecb0c1" opacity=".15" />
            <text x="150" y="160" fill="#d5cbea" fontSize="15">
              Josh
            </text>
            <text x="614" y="220" fill="#eed0dc" fontSize="15">
              Janna
            </text>
            <text x="395" y="82" fill="#edafc8" fontSize="28">
              ♡
            </text>
          </svg>
        </div>
        <div className="timezone-grid">
          {locations.map((person) => {
            const local = now ? localTime(now, person.zone) : null;
            const daytime = local && local.hour >= 6 && local.hour < 18;
            return (
              <div className="timezone-card" key={person.name}>
                <span className="eyebrow">
                  {person.flag} {person.location}
                </span>
                <h2>{person.name}</h2>
                <div className="local-time">
                  {local?.time ?? "—:—"}{" "}
                  {daytime ? <Sun size={26} /> : <Moon size={26} />}
                </div>
                <p>{local?.date ?? "Finding our stars…"}</p>
                <span className="timezone-greeting">
                  {local ? greeting(local.hour) : "Hello"}, my love.
                </span>
              </div>
            );
          })}
        </div>
        <blockquote>
          Despite all these miles,
          <br />
          <em>you’re still my favorite person.</em>
        </blockquote>
        <Heart className="world-heart" size={24} />
      </section>
    </>
  );
}
