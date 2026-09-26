"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  Sparkles,
  BookHeart,
  Camera,
  Gamepad2,
  Mail,
  Music2,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { relationship } from "@/data/relationship";
import { affectionateMessages } from "@/data/messages";
import { memories } from "@/data/memories";
import { relationshipAge, dateLabel, pick } from "@/lib/utils";
import { Companion } from "./companion";
export function Dashboard({
  navigate,
}: {
  navigate: (section: string) => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [message, setMessage] = useState(() =>
    Math.floor(Math.random() * affectionateMessages.length),
  );
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    const change = setInterval(
      () =>
        setMessage((m) =>
          pick(affectionateMessages.map((_, i) => i).filter((i) => i !== m)),
        ),
      9000,
    );
    return () => {
      clearInterval(tick);
      clearInterval(change);
    };
  }, []);
  const age = now ? relationshipAge(relationship.startDate, now) : [0, 0, 0, 0];
  const destinations = [
    {
      id: "story",
      title: "Our Story",
      subtitle: "Every little beginning",
      icon: BookHeart,
      color: "pink",
    },
    {
      id: "memories",
      title: "Memory Room",
      subtitle: "Moments worth keeping",
      icon: Camera,
      color: "lavender",
    },
    {
      id: "games",
      title: "Game Room",
      subtitle: "A little friendly competition",
      icon: Gamepad2,
      color: "blue",
    },
    {
      id: "letters",
      title: "Open When…",
      subtitle: "A hug, in an envelope",
      icon: Mail,
      color: "peach",
    },
    {
      id: "love",
      title: "100 Reasons",
      subtitle: "And a hundred more",
      icon: Heart,
      color: "pink",
    },
    {
      id: "music",
      title: "Our Music",
      subtitle: "The soundtrack of us",
      icon: Music2,
      color: "lavender",
    },
  ];
  return (
    <>
      <div className="dashboard-greeting">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> OUR LITTLE CORNER OF THE UNIVERSE
          </span>
          <h1>
            Hi Josh <span className="pink-text">♡</span>
          </h1>
          <p>Different time zones. Same little universe.</p>
        </div>
        <span className="date-pill">
          ✧ &nbsp; Made of stardust & a little love
        </span>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-main">
          <section className="hero-card">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-copy">
              <span className="eyebrow">YOU + ME + EVERYTHING IN BETWEEN</span>
              <h2>
                My favorite place
                <br />
                is <em>where you are.</em>
              </h2>
              <p>
                A home for our memories, our little adventures,
                <br className="desktop-break" /> and all the love that bridges
                the miles.
              </p>
              <button
                className="primary-button"
                onClick={() => navigate("story")}
              >
                Explore our story <ArrowRight size={16} />
              </button>
              <span className="hero-footnote">
                <Heart size={12} /> Carefully crafted for my favorite human.
              </span>
            </div>
            <div className="planet-art" aria-hidden="true">
              <span className="planet-star star-a">✦</span>
              <span className="planet-star star-b">✧</span>
              <span className="planet-star star-c">+</span>
              <div className="planet">
                <div className="planet-face">˘ ◡ ˘</div>
                <span>♥</span>
              </div>
              <div className="planet-ring" />
              <span className="orbit-heart">♡</span>
              <span className="planet-caption">you’re my whole world.</span>
            </div>
          </section>
          <section className="counter-card">
            <div className="counter-label">
              <span className="icon-tile pink">
                <Heart size={19} />
              </span>
              <div>
                <h3>Us, and counting.</h3>
                <p>Since {dateLabel(relationship.startDate)}</p>
              </div>
            </div>
            <div className="counter-units">
              {age.map((value, i) => (
                <div key={i}>
                  <strong>{String(value).padStart(2, "0")}</strong>
                  <span>{["YEARS", "MONTHS", "DAYS", "HOURS"][i]}</span>
                </div>
              ))}
            </div>
            <span className="counter-infinity">∞</span>
          </section>
          <div className="section-label">
            <h2>
              A universe to explore <Sparkles size={16} />
            </h2>
            <span>Pick a little adventure</span>
          </div>
          <div className="destination-grid">
            {destinations.map(({ id, title, subtitle, icon: Icon, color }) => (
              <button
                className="destination-card"
                key={id}
                onClick={() => navigate(id)}
              >
                <span className={`icon-tile ${color}`}>
                  <Icon size={22} />
                </span>
                <ArrowUpRight className="card-arrow" size={16} />
                <h3>{title}</h3>
                <p>{subtitle}</p>
              </button>
            ))}
          </div>
          <div className="section-label">
            <h2>
              Pinned to my heart <Heart size={15} />
            </h2>
            <button
              className="text-button"
              onClick={() => navigate("memories")}
            >
              All memories <ArrowRight size={13} />
            </button>
          </div>
          <div className="home-memories">
            {memories.slice(0, 3).map((memory, i) => (
              <button
                onClick={() => navigate("memories")}
                className="polaroid"
                style={{ transform: `rotate(${[-3, 2, -2][i]}deg)` }}
                key={memory.id}
              >
                <span className="tape" />
                <Image
                  src={memory.image}
                  alt={memory.caption}
                  width={400}
                  height={290}
                />
                <span>{memory.caption}</span>
                <small>little moments, forever feelings</small>
              </button>
            ))}
          </div>
        </div>
        <aside className="dashboard-aside">
          <Companion compact />
          <section className="note-card">
            <span className="eyebrow">A LITTLE REMINDER</span>
            <span className="note-heart">♡</span>
            <p key={message}>{affectionateMessages[message]}</p>
            <span className="handwritten">always, Janna</span>
            <div className="note-dots">
              {affectionateMessages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(i)}
                  aria-label={`Reminder ${i + 1}`}
                  className={i === message ? "active" : ""}
                />
              ))}
            </div>
          </section>
          <button className="world-preview" onClick={() => navigate("world")}>
            <Globe2 size={21} />
            <h3>Two places. One us.</h3>
            <div>
              <span>PH 🇵🇭</span>
              <span className="world-preview-line">···· ♡ ····</span>
              <span>US 🇺🇸</span>
            </div>
            <p>Under the same sky, always.</p>
            <span className="text-button">
              Visit our world <ArrowUpRight size={13} />
            </span>
          </button>
          <div className="tiny-note">
            a little space on the internet.
            <br />
            an awful lot of love. ♡
          </div>
        </aside>
      </div>
    </>
  );
}
