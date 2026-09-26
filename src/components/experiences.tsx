"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Couple, OurVerseCharacter } from "./characters";
import { Modal, SectionHeading } from "./ui";
import { useUniverse } from "./provider";
import {
  dailyMessages,
  conversations,
  coupons,
  jarNotes,
  mailboxNotes,
  questions,
  loveTraits,
  dreams,
  capsule,
  calendarEvents,
  patchNotes,
  travel,
  gifts,
  futureOptions,
  type Coupon,
} from "@/data/expansion";
import { memories } from "@/data/memories";
import { settings } from "@/config/settings";
import { dateLabel, pick } from "@/lib/utils";
import { DestinationArt } from "./galaxy";
type Navigation = { navigate: (id: string) => void };
export default function Experiences({
  section,
  navigate,
}: { section: string } & Navigation) {
  switch (section) {
    case "room":
      return <OurHome navigate={navigate} />;
    case "traits":
      return <Things navigate={navigate} />;
    case "hand":
      return <HoldHand />;
    case "heartbeat":
      return <Heartbeat />;
    case "coupons":
      return <Coupons />;
    case "messages":
      return <Messages />;
    case "calendar":
      return <Calendar />;
    case "daily":
      return <Daily />;
    case "mailbox":
      return <Mailbox />;
    case "jar":
      return <LoveJar />;
    case "questions":
      return <Questions />;
    case "garden":
      return <Garden />;
    case "future":
      return <Future navigate={navigate} />;
    case "capsule":
      return <Capsule />;
    case "travel":
      return <Adventure />;
    case "gifts":
      return <Gifts />;
    case "generator":
      return <Generator />;
    case "press":
      return <DoNotPress navigate={navigate} />;
    case "mission":
      return <Mission navigate={navigate} />;
    case "patch":
      return <Patch navigate={navigate} />;
    case "sleep":
      return <Sleep navigate={navigate} />;
    default:
      return <OurHome navigate={navigate} />;
  }
}
const roomObjects = [
  { id: "sleep", name: "Bed", kind: "bed", x: 22, y: 72 },
  { id: "messages", name: "Laptop", kind: "laptop", x: 75, y: 65 },
  { id: "memories", name: "Photo frame", kind: "frame", x: 19, y: 30 },
  { id: "letters", name: "Bookshelf", kind: "books", x: 85, y: 28 },
  { id: "games", name: "Game console", kind: "console", x: 52, y: 83 },
  { id: "world", name: "Window", kind: "window", x: 48, y: 29 },
  { id: "calendar", name: "Calendar", kind: "calendar", x: 72, y: 28 },
  { id: "music", name: "Music player", kind: "radio", x: 87, y: 80 },
  { id: "mailbox", name: "Mailbox", kind: "mailbox", x: 10, y: 48 },
  { id: "garden", name: "Plant", kind: "plant", x: 65, y: 79 },
];
function OurHome({ navigate }: Navigation) {
  const [lampOn, setLampOn] = useState(true);
  const [scene, setScene] = useState<
    "sit" | "hoodie" | "sleep" | "gaming" | "hug"
  >("sit");
  return (
    <>
      <SectionHeading
        eyebrow="THE LIGHT IS ALWAYS ON FOR YOU"
        title="Our Home"
        description="An imaginary room. A very real wish. Touch something and see where it takes you."
      />
      <div className="cozy-room">
        <svg
          className="room-atmosphere"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="room-moonlight" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#bdc4df" stopOpacity=".12" />
              <stop offset="1" stopColor="#bdc4df" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M430 210L540 210L890 575L575 575Z"
            fill="url(#room-moonlight)"
          />
          <path
            d="M18 417H982M18 426H982M30 430L0 600M200 430L155 600M400 430L385 600M600 430L620 600M800 430L850 600M970 430L1000 600"
            stroke="#c2a699"
            strokeOpacity=".13"
            fill="none"
          />
          <path
            d="M0 53Q250 135 500 65Q750 135 1000 53"
            stroke="#baa8b4"
            strokeOpacity=".4"
            fill="none"
          />
          {[65, 170, 280, 390, 610, 720, 830, 935].map((x) => (
            <g
              key={x}
              transform={`translate(${x} ${65 + Math.sin((x / 1000) * Math.PI) * 27})`}
            >
              <path d="M0 0V10" stroke="#bda6a1" />
              <ellipse cy="14" rx="3" ry="5" fill="#ecd5a8" opacity=".8" />
            </g>
          ))}
          <path
            d="M5 5V408M995 5V408"
            stroke="#c2a699"
            strokeOpacity=".17"
            strokeWidth="25"
          />
        </svg>
        <div className="room-floor" />
        <div className="room-rug" />
        <div className="room-desk" />
        <button
          className={`room-lamp ${lampOn ? "" : "lamp-off"}`}
          aria-label="Turn the lamp on or off"
          aria-pressed={lampOn}
          onClick={() => setLampOn((on) => !on)}
        >
          <i />
          <span />
        </button>
        {roomObjects.map((o) => (
          <button
            key={o.id}
            className={`room-object object-${o.kind}`}
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
            onClick={() => navigate(o.id)}
            aria-label={`${o.name} — ${o.id === "sleep" ? "Can’t Sleep" : o.id}`}
          >
            <span className="object-drawing" aria-hidden="true">
              {o.kind === "window" ? (
                <svg
                  viewBox="0 0 140 140"
                  aria-hidden="true"
                  className="window-landscape"
                >
                  <circle cx="96" cy="33" r="15" fill="#e2d8bf" />
                  <circle cx="103" cy="27" r="14" fill="#17213a" />
                  <path
                    d="M0 100L30 62L62 103L92 73L140 116V140H0Z"
                    fill="#333d59"
                  />
                  <path
                    d="M0 120Q34 100 70 118T140 108V140H0Z"
                    fill="#242c45"
                  />
                  <g fill="#e5d4bc">
                    <circle cx="32" cy="31" r="1" />
                    <circle cx="60" cy="18" r="1.5" />
                    <circle cx="118" cy="68" r="1" />
                  </g>
                </svg>
              ) : o.kind === "books" ? (
                <svg viewBox="0 0 110 80" aria-hidden="true">
                  <path d="M3 78V25H17V78Z" fill="#9e7486" />
                  <path d="M19 78V12H37V78Z" fill="#a8aca1" />
                  <path d="M39 78V20H52V78Z" fill="#c1a18d" />
                  <path d="M55 78V7H70V78Z" fill="#797b9e" />
                  <path d="M82 78L70 24L85 21L98 75Z" fill="#ad8490" />
                  <g stroke="#e2d1ba" strokeWidth="2" opacity=".65">
                    <path d="M7 33H13M7 65H13M23 23H33M23 29H33M43 31H48M59 18H66M59 65H66M78 32L85 30" />
                  </g>
                </svg>
              ) : o.kind === "calendar" ? (
                "21"
              ) : o.kind === "frame" ? (
                <svg viewBox="0 0 80 90" aria-hidden="true">
                  <path d="M0 0H80V90H0Z" fill="#d9c5b4" />
                  <circle cx="57" cy="25" r="11" fill="#ede0c5" />
                  <path d="M0 62Q25 28 53 62L80 50V90H0Z" fill="#7f8394" />
                  <path d="M0 75Q30 53 80 75V90H0Z" fill="#555e72" />
                  <path
                    d="M38 51C22 40 21 61 39 69C59 57 53 41 38 51Z"
                    fill="#e4b4bb"
                  />
                </svg>
              ) : o.kind === "laptop" ? (
                "you online? ♡"
              ) : o.kind === "console" ? (
                "+   • •"
              ) : o.kind === "radio" ? (
                "♫"
              ) : o.kind === "mailbox" ? (
                "✉"
              ) : o.kind === "plant" ? (
                <DestinationArt kind="garden" />
              ) : (
                ""
              )}
            </span>
            <span className="object-label">{o.name}</span>
          </button>
        ))}
        <button
          className="room-residents"
          aria-label="Interact with Janna and Josh"
          onClick={() =>
            setScene(pick(["hoodie", "sleep", "gaming", "hug", "sit"]))
          }
        >
          <Couple scene={scene} />
        </button>
      </div>
      <p className="room-note handwritten">
        someday, no more goodbyes through a screen.
      </p>
      <div className="world-links">
        {[
          ["coupons", "Tickets on the desk"],
          ["future", "Our someday notebook"],
          ["jar", "The little love jar"],
          ["questions", "Stay up talking"],
          ["gifts", "A mysterious parcel"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => navigate(id)}>
            {label} ↗
          </button>
        ))}
      </div>
    </>
  );
}
function Things({ navigate }: Navigation) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="things-world">
      <SectionHeading
        eyebrow="ALL THE LITTLE THINGS THAT MAKE YOU, YOU"
        title="Things I love about you."
        description="A hundred reasons could never quite explain it. Start here."
      />
      <div
        className={`trait-orbit reaction-${selected === null ? "idle" : loveTraits[selected][1]}`}
      >
        <div className="trait-josh">
          <OurVerseCharacter
            character="josh"
            pose="wave"
            expression={selected === null ? "happy" : "blushing"}
          />
        </div>
        {loveTraits.map(([title], i) => (
          <button
            key={title}
            style={
              {
                "--angle": `${(i * 360) / loveTraits.length}deg`,
              } as CSSProperties
            }
            className="trait"
            onClick={() => setSelected(i)}
          >
            {title}
          </button>
        ))}
        <span className="trait-effects" aria-hidden="true">
          {selected === null
            ? "✧"
            : loveTraits[selected][1] === "waves"
              ? "))) ♫ ((("
              : loveTraits[selected][1] === "stars"
                ? "✦ ✧ ✦"
                : "♡ ♡ ♡"}
        </span>
      </div>
      <div className="trait-message" aria-live="polite">
        {selected !== null && (
          <>
            <OurVerseCharacter
              character="janna"
              expression={
                loveTraits[selected][1] === "laugh" ? "laughing" : "love-struck"
              }
            />
            <p>{loveTraits[selected][2]}</p>
          </>
        )}
      </div>
      <div className="world-links">
        <button onClick={() => navigate("hand")}>Hold my hand ♡</button>
        <button onClick={() => navigate("heartbeat")}>
          Listen to my heart ↗
        </button>
        <button onClick={() => navigate("coupons")}>
          A little promise, on a ticket ↗
        </button>
      </div>
    </section>
  );
}
function HoldHand() {
  const [holding, setHolding] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState(false);
  const { discover } = useUniverse();
  const start = useRef(0);
  useEffect(() => {
    if (!holding) return;
    const tick = setInterval(() => {
      const s = Math.floor((performance.now() - start.current) / 1000);
      setSeconds(s);
      if (s >= 20) discover("hold-hand");
    }, 200);
    const stop = () => setHolding(false);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      clearInterval(tick);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [holding, discover]);
  function begin() {
    if (holding) return;
    start.current = performance.now();
    setSeconds(0);
    setHolding(true);
    setTouched(true);
  }
  return (
    <section
      className={`quiet-experience hold-experience ${holding ? "holding" : ""}`}
      style={{ "--warmth": Math.min(seconds / 20, 1) } as CSSProperties}
    >
      <SectionHeading
        eyebrow="STAY HERE A MOMENT"
        title="Hold my hand."
        description="There is nowhere else we need to be."
      />
      <Couple scene={holding ? "hold-hands" : "sit"} />
      <p className="emotional-line" aria-live="polite">
        {!holding
          ? touched
            ? "come back :("
            : "A little closer?"
          : seconds >= 20
            ? "I love you, Josh."
            : seconds >= 10
              ? "okay now I’m smiling like an idiot."
              : seconds >= 5
                ? "don’t let go yet."
                : "right here. with you."}
      </p>
      <button
        className="primary-button hold-button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          begin();
        }}
        onPointerUp={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        onLostPointerCapture={() => setHolding(false)}
        onBlur={() => setHolding(false)}
        onKeyDown={(e) => {
          if ([" ", "Enter"].includes(e.key)) {
            e.preventDefault();
            begin();
          }
        }}
        onKeyUp={(e) => {
          if ([" ", "Enter"].includes(e.key)) setHolding(false);
        }}
      >
        Hold Janna’s hand
      </button>
      <p>Press and hold · touch, mouse, Space or Enter</p>
      <span className="hold-hearts" aria-hidden="true">
        {holding ? "♡ ".repeat(Math.min(10, 1 + Math.floor(seconds / 2))) : ""}
      </span>
    </section>
  );
}
function Heartbeat() {
  const [taps, setTaps] = useState(0);
  const { discover } = useUniverse();
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="ONE VERY SPECIFIC SIDE EFFECT"
        title="You make my heart do this."
        description="Go on. Try it."
      />
      <button
        key={taps}
        className={`heartbeat ${taps ? "thump" : ""}`}
        aria-label="Tap my heart"
        onClick={() => {
          setTaps((t) => t + 1);
          discover("heartbeat");
        }}
      >
        ♥
      </button>
      <p className="emotional-line" aria-live="polite">
        {taps
          ? ["you", "make", "my", "heart", "do", "this."][(taps - 1) % 6]
          : "♡"}
      </p>
      <span className="eyebrow">{taps ? "THUMP." : ""}</span>
    </section>
  );
}
function Coupons() {
  const { progress, update, discover } = useUniverse();
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [scene, setScene] = useState<"kiss" | "hug" | null>(null);
  const [now] = useState(() => Date.now());
  return (
    <>
      <SectionHeading
        eyebrow="ADMIT ONE VERY LOVED BOYFRIEND"
        title="Janna’s Love Coupons"
        description="Tiny paper promises. Big girlfriend energy."
      />
      {scene && <Couple scene={scene} caption="Redeemed with love. ♡" />}
      <div className="ticket-roll">
        {coupons.map((c) => {
          const redeemed = progress.redeemed[c.id] || 0;
          const expired = !!c.expiration && now >= Date.parse(c.expiration);
          return (
            <article
              className={`love-ticket ${redeemed >= c.quantity ? "redeemed" : ""}`}
              key={c.id}
            >
              <span className="ticket-symbol">{c.icon}</span>
              <div>
                <span className="eyebrow">
                  JANNA’S LOVE COUPONS · No. {c.id.split("-")[1]}
                </span>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <small>{c.terms}</small>
              </div>
              <div className="ticket-stub">
                <span>
                  {redeemed} / {c.quantity} used
                </span>
                <button
                  className="secondary-button"
                  disabled={redeemed >= c.quantity || expired}
                  onClick={() => setSelected(c)}
                >
                  {expired
                    ? "Expired"
                    : redeemed >= c.quantity
                      ? "REDEEMED ♡"
                      : "Redeem"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {selected && (
        <Modal
          title={`Redeem ${selected.title}?`}
          onClose={() => setSelected(null)}
        >
          <p>Are you sure you want to use your {selected.title} coupon?</p>
          <div className="dialog-actions">
            <button
              className="secondary-button"
              onClick={() => setSelected(null)}
            >
              Never mind
            </button>
            <button
              className="primary-button"
              onClick={() => {
                const c = selected;
                update((p) => ({
                  ...p,
                  redeemed: {
                    ...p.redeemed,
                    [c.id]: Math.min(c.quantity, (p.redeemed[c.id] || 0) + 1),
                  },
                }));
                discover("coupon");
                setScene(c.id === "coupon-0" ? "kiss" : "hug");
                setSelected(null);
              }}
            >
              {selected.id === "coupon-0"
                ? "Give me my kiss"
                : "Yes, redeem it ♡"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
function Messages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const { discover } = useUniverse();
  const c = conversations[index];
  useEffect(() => {
    if (visible >= c.messages.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1300);
    return () => clearTimeout(t);
  }, [visible, c]);
  return (
    <>
      <SectionHeading
        eyebrow="LITTLE WORDS. BIG FEELINGS."
        title="Our Messages"
        description="Conversations worth keeping. Replace these imagined exchanges with our own."
      />
      <div className="conversation">
        <span className="eyebrow">{c.title}</span>
        {c.messages.slice(0, visible).map((m, i) => (
          <div className={`chat-message ${m.sender.toLowerCase()}`} key={i}>
            <small>
              {m.sender} · {m.timestamp}
            </small>
            <p>{m.text}</p>
            {m.image && (
              <Image
                src={m.image}
                alt="A moon shared across the miles"
                width={260}
                height={180}
              />
            )}
            <span>{m.reaction}</span>
          </div>
        ))}
      </div>
      <div className="dialog-actions">
        <button
          className="secondary-button"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => i - 1);
            setVisible(1);
          }}
        >
          Previous
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            setVisible(1);
            discover("messages");
          }}
        >
          Replay
        </button>
        <button
          className="secondary-button"
          disabled={index === conversations.length - 1}
          onClick={() => {
            setIndex((i) => i + 1);
            setVisible(1);
            discover("messages");
          }}
        >
          Next
        </button>
      </div>
      <Couple scene="sit" />
    </>
  );
}
function Calendar() {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const { progress } = useUniverse();
  const events = [
    ...calendarEvents,
    ...(settings.birthday
      ? [
          {
            date: `${month.getFullYear()}-${settings.birthday}`,
            title: "Josh’s birthday",
            type: "birthday",
            story: "Happy birthday, my favorite human. ♡",
          },
        ]
      : []),
    ...memories.map((m) => ({
      date: m.date,
      title: m.caption,
      type: "memory",
      story: m.description,
    })),
    ...dreams
      .filter((d) => progress.dreams[d.id])
      .map((d) => ({
        date: progress.dreams[d.id].slice(0, 10),
        title: d.title,
        type: "memory",
        story: d.description,
      })),
  ];
  const start = month.getDay();
  const length = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  return (
    <>
      <SectionHeading
        eyebrow="DAYS WE KEEP. DAYS WE LOOK FORWARD TO."
        title="Our little calendar"
        description="Every ordinary square can become something lovely."
      />
      <section className="paper-calendar">
        <div className="calendar-toolbar">
          <button
            aria-label="Previous month"
            onClick={() =>
              setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            ←
          </button>
          <h2>
            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </h2>
          <button
            aria-label="Next month"
            onClick={() =>
              setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            →
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
          {Array.from({ length: start }, (_, i) => (
            <i key={`empty-${i}`} />
          ))}
          {Array.from({ length }, (_, i) => {
            const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
            const found = events.filter((e) => e.date === date);
            return (
              <button
                key={date}
                aria-label={`${date}${found.length ? ": " + found.map((e) => e.title).join(", ") : ""}`}
                onClick={() => setSelected(date)}
              >
                {i + 1}
                <small>
                  {found
                    .map((e) =>
                      e.type === "birthday"
                        ? "♔"
                        : e.type === "memory"
                          ? "♡"
                          : e.type === "milestone"
                            ? "★"
                            : "✦",
                    )
                    .join("")}
                </small>
              </button>
            );
          })}
        </div>
        <p>♡ memory · ★ milestone · ♔ birthday · ✦ special</p>
      </section>
      {selected && (
        <Modal title={dateLabel(selected)} onClose={() => setSelected(null)}>
          {events
            .filter((e) => e.date === selected)
            .map((e) => (
              <article key={e.title}>
                <h3>{e.title}</h3>
                <p>{e.story}</p>
              </article>
            ))}
          {!events.some((e) => e.date === selected) && (
            <p>An unwritten little day. There’s room for a memory here.</p>
          )}
        </Modal>
      )}
    </>
  );
}
function Daily() {
  const [date] = useState(() => new Date());
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow={date.toLocaleDateString("en", { dateStyle: "full" })}
        title="Josh’s message for today"
        description="One little thought to carry with you."
      />
      <blockquote className="paper-message">
        {dailyMessages[day % dailyMessages.length]}
        <span className="handwritten">♡ Janna</span>
      </blockquote>
      <Couple scene="hug" />
    </section>
  );
}
function Mailbox() {
  const [note, setNote] = useState("");
  const { discover } = useUniverse();
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="SPECIAL DELIVERY. NO POSTAGE NEEDED."
        title="You have mail ♡"
        description="Nothing urgent. Just me, thinking about you."
      />
      <button
        className={`big-mailbox ${note ? "mail-open" : ""}`}
        aria-label="Open love mailbox"
        onClick={() => {
          setNote(pick(mailboxNotes));
          discover("mailbox");
        }}
      >
        ✉<span>J + J</span>
      </button>
      {note && (
        <p className="paper-message" aria-live="polite">
          {note}
          <span className="handwritten">♡ Janna</span>
        </p>
      )}
    </section>
  );
}
function LoveJar() {
  const [note, setNote] = useState<(typeof jarNotes)[number] | null>(null);
  const [shake, setShake] = useState(0);
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="A LITTLE BIT OF EVERYTHING"
        title="The love jar"
        description="Love, nonsense, questions, and something to try together."
      />
      <div
        key={shake}
        className={`love-jar ${shake ? "jar-shake" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${15 + ((i * 23) % 60)}%`,
              top: `${25 + ((i * 13) % 50)}%`,
              rotate: `${i * 41}deg`,
            }}
          >
            ♡
          </i>
        ))}
      </div>
      <button
        className="primary-button"
        onClick={() => {
          setShake((s) => s + 1);
          setNote(pick(jarNotes));
        }}
      >
        Shake the jar
      </button>
      {note && (
        <p className="paper-message" aria-live="polite">
          <small>{note.category}</small>
          {note.text}
        </p>
      )}
    </section>
  );
}
function Questions() {
  const [category, setCategory] = useState<keyof typeof questions>("Deep");
  const [index, setIndex] = useState(0);
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="ONE MORE QUESTION BEFORE WE SLEEP"
        title="Tell me something."
        description="No scores. No right answers. Just us."
      />
      <div className="filter-tabs">
        {Object.keys(questions).map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => {
              setCategory(c as keyof typeof questions);
              setIndex(0);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="emotional-line">
        {questions[category][index % questions[category].length]}
      </p>
      <button className="primary-button" onClick={() => setIndex((i) => i + 1)}>
        Another question ↗
      </button>
      <Couple scene="sit" />
    </section>
  );
}
export function LovePlantArt({ stage }: { stage: number }) {
  const stageLabels = [
    "Seed — resting in the warm soil",
    "Sprout — two tiny leaves reaching up",
    "Small plant — growing strong roots",
    "Large plant — leafy and thriving",
    "Flowering plant — blooming in full love",
  ];
  return (
    <svg
      className={`plant-illustration plant-stage-svg-${stage}`}
      viewBox="0 0 240 260"
      role="img"
      aria-label={stageLabels[stage]}
    >
      <defs>
        <radialGradient id="plantGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fde2ec" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#fcd3e1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fcd3e1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b67a84" />
          <stop offset="50%" stopColor="#c58a94" />
          <stop offset="100%" stopColor="#9e656f" />
        </linearGradient>
        <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a343d" />
          <stop offset="100%" stopColor="#674954" />
        </linearGradient>
      </defs>

      {/* Pot Shadow */}
      <ellipse cx="120" cy="238" rx="68" ry="12" fill="#00000030" />

      {/* Pot Body */}
      <path
        d="M74 180L88 234C89 237 92 239 95 239H145C148 239 151 237 152 234L166 180Z"
        fill="url(#potGrad)"
      />
      {/* Pot Rim */}
      <path
        d="M68 174H172C175 174 176 176 175 179L171 184H69L65 179C64 176 65 174 68 174Z"
        fill="#b67a84"
      />
      <path
        d="M71 176H169"
        stroke="#dfa5af"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Stamped Heart on Pot */}
      <path
        d="M120 213C120 213 113 207 113 202C113 198 116 196 119 197C120 197.5 120 199 120 199C120 199 120 197.5 121 197C124 196 127 198 127 202C127 207 120 213 120 213Z"
        fill="#deb4bd"
        opacity="0.75"
      />

      {/* Soil */}
      <ellipse cx="120" cy="180" rx="46" ry="11" fill="url(#soilGrad)" />
      <ellipse cx="120" cy="179" rx="38" ry="7" fill="#3a272f" opacity="0.6" />

      {/* Stage 0: SEED */}
      {stage === 0 && (
        <g className="stage-seed-group">
          {/* Subtle warm glow around seed */}
          <ellipse
            cx="120"
            cy="175"
            rx="18"
            ry="10"
            fill="#fcecc4"
            opacity="0.25"
          />
          {/* Tiny soil details */}
          <circle cx="108" cy="178" r="1.5" fill="#694b56" />
          <circle cx="132" cy="179" r="1.2" fill="#694b56" />
          <circle cx="114" cy="181" r="1" fill="#7a5764" />
          <circle cx="128" cy="181" r="1" fill="#7a5764" />
          {/* The Seed */}
          <ellipse
            cx="120"
            cy="175"
            rx="8.5"
            ry="6"
            fill="#deb485"
            stroke="#9f774e"
            strokeWidth="1.5"
          />
          <path
            d="M116 175Q120 177 124 175"
            stroke="#835c36"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hopeful tiny green bud tip emerging */}
          <path
            d="M122 173Q123 169 125 170"
            stroke="#8cc399"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="118" cy="173" r="1" fill="#ffffff" opacity="0.85" />
        </g>
      )}

      {/* Stage 1: SPROUT */}
      {stage === 1 && (
        <g className="stage-sprout-group">
          {/* Gentle sprout stem */}
          <path
            d="M120 178Q119 160 120 144"
            stroke="#7ba88a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left cotyledon (first baby leaf) */}
          <path
            d="M120 148C106 146 95 139 93 131C101 127 114 134 120 146Z"
            fill="#9cc7a7"
            stroke="#6e987c"
            strokeWidth="1.2"
          />
          <path
            d="M97 132Q108 137 118 147"
            stroke="#bfe2ca"
            strokeWidth="1"
            fill="none"
          />
          {/* Right cotyledon (second baby leaf) */}
          <path
            d="M120 147C134 144 145 137 147 129C139 125 126 133 120 145Z"
            fill="#8bb896"
            stroke="#5f896b"
            strokeWidth="1.2"
          />
          <path
            d="M143 130Q132 135 122 146"
            stroke="#b4dcbe"
            strokeWidth="1"
            fill="none"
          />
          {/* Tiny glistening dewdrop */}
          <circle cx="94" cy="131" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="95" cy="132" r="0.8" fill="#ffffff" />
        </g>
      )}

      {/* Stage 2: SMALL PLANT */}
      {stage === 2 && (
        <g className="stage-small-group">
          {/* Sturdy young stem */}
          <path
            d="M120 178Q118 145 120 112"
            stroke="#6e9b7d"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lower left leaf */}
          <path
            d="M120 162C92 165 74 154 68 140C86 134 110 143 120 159Z"
            fill="#719e83"
            stroke="#537b63"
            strokeWidth="1.2"
          />
          <path
            d="M71 141Q95 146 118 160"
            stroke="#97beaa"
            strokeWidth="1"
            fill="none"
          />
          {/* Lower right leaf */}
          <path
            d="M120 156C148 159 166 147 172 133C154 128 130 138 120 153Z"
            fill="#628f73"
            stroke="#476f57"
            strokeWidth="1.2"
          />
          <path
            d="M169 134Q145 139 122 154"
            stroke="#8ab29c"
            strokeWidth="1"
            fill="none"
          />
          {/* Upper left leaf */}
          <path
            d="M120 136C98 131 84 120 82 106C98 104 114 115 120 133Z"
            fill="#86b297"
            stroke="#628e73"
            strokeWidth="1.2"
          />
          <path
            d="M84 107Q102 116 118 134"
            stroke="#abd1ba"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Upper right leaf */}
          <path
            d="M120 130C142 124 156 112 158 98C142 97 126 108 120 127Z"
            fill="#78a489"
            stroke="#568267"
            strokeWidth="1.2"
          />
          <path
            d="M156 99Q138 109 122 128"
            stroke="#9ec6ae"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Top budding shoot */}
          <path
            d="M120 114C114 105 116 94 120 89C124 94 126 105 120 114Z"
            fill="#a6cfb4"
            stroke="#7ba489"
            strokeWidth="1"
          />
        </g>
      )}

      {/* Stage 3: LARGE PLANT */}
      {stage === 3 && (
        <g className="stage-large-group">
          {/* Main trunk */}
          <path
            d="M120 178Q117 132 120 68"
            stroke="#5c876e"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left branch */}
          <path
            d="M119 146Q94 138 70 118"
            stroke="#5c876e"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 118C48 118 34 105 32 90C50 88 66 100 70 116Z"
            fill="#568268"
            stroke="#3e644d"
            strokeWidth="1"
          />
          <path
            d="M80 128C58 138 46 132 40 120C56 112 74 118 79 126Z"
            fill="#67947a"
            stroke="#4b755c"
            strokeWidth="1"
          />
          <path
            d="M94 138C80 152 66 150 60 140C72 130 88 132 92 136Z"
            fill="#77a48a"
            stroke="#5a866d"
            strokeWidth="1"
          />

          {/* Right branch */}
          <path
            d="M120 134Q146 126 170 104"
            stroke="#5c876e"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M170 104C192 104 206 92 208 78C190 76 174 88 170 102Z"
            fill="#4e7960"
            stroke="#375d46"
            strokeWidth="1"
          />
          <path
            d="M160 114C182 124 194 118 200 106C184 98 166 104 161 112Z"
            fill="#5f8c72"
            stroke="#456f57"
            strokeWidth="1"
          />
          <path
            d="M146 124C160 138 174 136 180 126C168 116 152 118 148 122Z"
            fill="#729f85"
            stroke="#547f67"
            strokeWidth="1"
          />

          {/* Upper canopy leaves */}
          <path
            d="M120 102Q102 86 88 66"
            stroke="#6e9b7f"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 66C70 62 60 48 62 36C76 38 88 52 88 64Z"
            fill="#78a58a"
            stroke="#58856b"
            strokeWidth="1"
          />

          <path
            d="M120 95Q140 80 154 60"
            stroke="#6e9b7f"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M154 60C170 56 180 42 178 30C164 32 152 46 154 58Z"
            fill="#6d9b7f"
            stroke="#4f7b61"
            strokeWidth="1"
          />

          {/* Crown top leaves */}
          <path
            d="M120 68C108 52 110 36 120 28C130 36 132 52 120 68Z"
            fill="#8fc0a2"
            stroke="#699a7d"
            strokeWidth="1"
          />

          {/* Romantic curling vine tendril */}
          <path
            d="M120 115C132 108 138 98 134 90C130 84 122 88 124 94C126 98 132 98 133 94"
            stroke="#a1ccb3"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Stage 4: FLOWERING */}
      {stage === 4 && (
        <g className="stage-flowering-group">
          {/* Subtle magical romantic halo/aura */}
          <circle cx="120" cy="52" r="54" fill="url(#plantGlow)" />

          {/* Mature branching trunk and leafy canopy */}
          <path
            d="M120 178Q117 132 120 72"
            stroke="#568067"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left branch */}
          <path
            d="M119 146Q94 138 70 118"
            stroke="#568067"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 118C48 118 34 105 32 90C50 88 66 100 70 116Z"
            fill="#527d63"
            stroke="#3a6148"
            strokeWidth="1"
          />
          <path
            d="M80 128C58 138 46 132 40 120C56 112 74 118 79 126Z"
            fill="#638f75"
            stroke="#476f57"
            strokeWidth="1"
          />
          <path
            d="M94 138C80 152 66 150 60 140C72 130 88 132 92 136Z"
            fill="#729e84"
            stroke="#558066"
            strokeWidth="1"
          />

          {/* Right branch */}
          <path
            d="M120 134Q146 126 170 104"
            stroke="#568067"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M170 104C192 104 206 92 208 78C190 76 174 88 170 102Z"
            fill="#4a735b"
            stroke="#355842"
            strokeWidth="1"
          />
          <path
            d="M160 114C182 124 194 118 200 106C184 98 166 104 161 112Z"
            fill="#5a866d"
            stroke="#406951"
            strokeWidth="1"
          />
          <path
            d="M146 124C160 138 174 136 180 126C168 116 152 118 148 122Z"
            fill="#6d997f"
            stroke="#4f7a62"
            strokeWidth="1"
          />

          {/* Upper branches */}
          <path
            d="M120 102Q102 86 88 66"
            stroke="#659074"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 66C70 62 60 48 62 36C76 38 88 52 88 64Z"
            fill="#749f84"
          />

          <path
            d="M120 95Q140 80 154 60"
            stroke="#659074"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M154 60C170 56 180 42 178 30C164 32 152 46 154 58Z"
            fill="#68947a"
          />

          {/* Left Side Blossom */}
          <g className="flower-side-left">
            <ellipse cx="68" cy="98" rx="8" ry="10" fill="#f4b2c6" />
            <ellipse cx="62" cy="106" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="76" cy="106" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="70" cy="113" rx="8" ry="8" fill="#e28aa4" />
            <circle
              cx="69"
              cy="106"
              r="4.5"
              fill="#fde3a2"
              stroke="#e9bf6d"
              strokeWidth="0.8"
            />
          </g>

          {/* Right Side Blossom */}
          <g className="flower-side-right">
            <ellipse cx="172" cy="88" rx="8" ry="10" fill="#f4b2c6" />
            <ellipse cx="166" cy="96" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="180" cy="96" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="174" cy="103" rx="8" ry="8" fill="#e28aa4" />
            <circle
              cx="173"
              cy="96"
              r="4.5"
              fill="#fde3a2"
              stroke="#e9bf6d"
              strokeWidth="0.8"
            />
          </g>

          {/* Central Crown Blossom */}
          <g className="flower-crown-main">
            {/* 5 Outer Rose Petals */}
            <ellipse
              cx="120"
              cy="30"
              rx="12"
              ry="16"
              fill="#f3a7bf"
              stroke="#dd88a3"
              strokeWidth="1"
            />
            <ellipse
              cx="100"
              cy="42"
              rx="15"
              ry="13"
              fill="#eb98b1"
              stroke="#d67c97"
              strokeWidth="1"
            />
            <ellipse
              cx="140"
              cy="42"
              rx="15"
              ry="13"
              fill="#eb98b1"
              stroke="#d67c97"
              strokeWidth="1"
            />
            <ellipse
              cx="108"
              cy="62"
              rx="14"
              ry="13"
              fill="#e287a1"
              stroke="#cb6b86"
              strokeWidth="1"
            />
            <ellipse
              cx="132"
              cy="62"
              rx="14"
              ry="13"
              fill="#e287a1"
              stroke="#cb6b86"
              strokeWidth="1"
            />

            {/* 5 Inner Cream-Blush Petals */}
            <ellipse cx="120" cy="38" rx="8" ry="11" fill="#fce0eb" />
            <ellipse cx="109" cy="46" rx="9" ry="8" fill="#fcd7e5" />
            <ellipse cx="131" cy="46" rx="9" ry="8" fill="#fcd7e5" />
            <ellipse cx="113" cy="56" rx="8" ry="8" fill="#f9c8da" />
            <ellipse cx="127" cy="56" rx="8" ry="8" fill="#f9c8da" />

            {/* Golden Core with Tiny Heart Center */}
            <circle
              cx="120"
              cy="49"
              r="8"
              fill="#fde29f"
              stroke="#e9bc65"
              strokeWidth="1.2"
            />
            <path
              d="M120 52C120 52 116 48.5 116 46C116 44 117.5 43 119 43.8C119.6 44.2 120 44.8 120 44.8C120 44.8 120.4 44.2 121 43.8C122.5 43 124 44 124 46C124 48.5 120 52 120 52Z"
              fill="#dd854e"
            />
          </g>

          {/* Falling Flower Petals */}
          <path
            d="M96 142C92 137 94 130 99 131C104 132 102 139 96 142Z"
            fill="#f4b5c8"
            opacity="0.9"
          />
          <path
            d="M148 150C143 145 145 138 150 139C155 140 153 147 148 150Z"
            fill="#f4b5c8"
            opacity="0.9"
          />

          {/* Sparkles around blooms */}
          <text
            x="88"
            y="24"
            fill="#ffe299"
            fontSize="15"
            className="plant-sparkle"
          >
            ✦
          </text>
          <text
            x="144"
            y="26"
            fill="#ffe299"
            fontSize="17"
            className="plant-sparkle"
          >
            ✦
          </text>
          <text
            x="44"
            y="82"
            fill="#ffd4e0"
            fontSize="13"
            className="plant-sparkle"
          >
            ✧
          </text>
          <text
            x="188"
            y="74"
            fill="#ffd4e0"
            fontSize="13"
            className="plant-sparkle"
          >
            ✧
          </text>
        </g>
      )}
    </svg>
  );
}

function Garden() {
  const { progress, discover, unlock } = useUniverse();
  const [wish, setWish] = useState(false);
  const stage = Math.min(4, Math.floor(progress.plantActions.length / 4));
  useEffect(() => {
    discover("garden-visit");
    if (stage === 4) unlock("plant");
  }, [discover, stage, unlock]);
  return (
    <section className="quiet-experience garden-world">
      <svg className="garden-landscape" viewBox="0 0 1100 750" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="885" cy="130" r="54" fill="#d3c8ac" opacity=".12" />
        <circle cx="905" cy="117" r="49" fill="#101421" />
        <path d="M0 570Q180 455 390 558T770 538T1100 560V750H0Z" fill="#293b3c" opacity=".42" />
        <path d="M0 641Q230 530 440 642T860 610T1100 620V750H0Z" fill="#1a3032" opacity=".7" />
        <path d="M0 709Q250 645 500 710T1100 686V750H0Z" fill="#0c1c23" />
        {[55, 115, 170, 900, 965, 1040].map((x, i) => (
          <g key={x} transform={`translate(${x} ${690 - (i % 3) * 18}) scale(${i % 2 ? .85 : 1.1})`} fill="#4c6660" stroke="#657d6b" strokeWidth="1" opacity=".6">
            <path d="M0 35Q-15 -30 8 -115M-4 -30Q-45 -73 -38 -90Q-6 -79 -4 -30M0 -53Q40 -83 35 -104Q4 -94 0 -53M-3 0Q-50 -28 -45 -48Q-13 -36 -3 0" />
            <path d="M8 -115Q-8 -137 6 -144Q28 -140 8 -115" fill="#b593a2" stroke="none" />
          </g>
        ))}
        {[[155, 340], [920, 435], [270, 515], [815, 350], [98, 485], [1005, 295]].map(([x, y]) => (
          <g key={x} fill="#d8bd8e"><circle cx={x} cy={y} r="8" opacity=".045" /><circle cx={x} cy={y} r="1.5" opacity=".65" /></g>
        ))}
      </svg>
      <SectionHeading
        eyebrow="A LITTLE LOVE, EVERY DAY"
        title="Look what we’re growing."
        description="Memories, letters, games, puzzles and discoveries all help our plant grow."
      />
      <div className={`growing-plant plant-stage-${stage}`}>
        <LovePlantArt stage={stage} />
        <span className="plant-stage-title">
          {
            [
              "A seed of us",
              "Hello, little sprout",
              "Putting down roots",
              "A little taller, together",
              "Look what we grew. ♡",
            ][stage]
          }
        </span>
        <small className="plant-stage-hint">
          {stage === 4
            ? "Fully in bloom. Beautiful and loved, just like us."
            : `${progress.plantActions.length % 4} / 4 discoveries toward next growth stage`}
        </small>
      </div>
      <Couple scene={stage === 4 ? "celebrate" : "sit"} />
      <button
        className="shooting-star"
        aria-label="Catch a shooting star"
        onClick={() => setWish(true)}
      >
        ✦ <span>catch a little wish</span>
      </button>
      <div className="wish-sky">
        {progress.wishes.map((w, i) => (
          <span key={i} title={w}>
            ✦<small>{w}</small>
          </span>
        ))}
      </div>
      {wish && <Wish onClose={() => setWish(false)} />}
    </section>
  );
}
function Wish({ onClose }: { onClose: () => void }) {
  const { update, discover } = useUniverse();
  const [text, setText] = useState("");
  return (
    <Modal title="Make a wish for us." onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          update((p) => ({
            ...p,
            wishes: [...p.wishes, text.trim()].slice(-100),
          }));
          discover("shooting-star");
          onClose();
        }}
      >
        <label htmlFor="wish">A little someday</label>
        <input
          id="wish"
          maxLength={160}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="primary-button" disabled={!text.trim()}>
          Keep it in our sky ✦
        </button>
      </form>
    </Modal>
  );
}
function Future({ navigate }: Navigation) {
  const { progress, update, discover } = useUniverse();
  return (
    <>
      <SectionHeading
        eyebrow="OUR FAVORITE UNWRITTEN CHAPTER"
        title="Someday, with you."
        description="Little dreams waiting to become memories."
      />
      <div className="future-path">
        <Couple scene="walk" />
        {dreams.map((d) => (
          <label
            key={d.id}
            className={`dream ${progress.dreams[d.id] ? "dream-complete" : ""}`}
          >
            <input
              type="checkbox"
              checked={!!progress.dreams[d.id]}
              onChange={(e) => {
                const checked = e.target.checked;
                update((p) => {
                  const next = { ...p.dreams };
                  if (checked) next[d.id] = new Date().toISOString();
                  else delete next[d.id];
                  return { ...p, dreams: next };
                });
                if (checked) discover("future-dream");
              }}
            />
            <span>
              <strong>{d.title}</strong>
              <small>
                {progress.dreams[d.id]
                  ? `A memory now · ${dateLabel(progress.dreams[d.id])}`
                  : d.description}
              </small>
            </span>
            <span className="handwritten">{d.category}</span>
          </label>
        ))}
      </div>
      <div className="world-links">
        {[
          ["capsule", "Our time capsule"],
          ["travel", "Our adventure map"],
          ["generator", "An extremely scientific future"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => navigate(id)}>
            {label} ↗
          </button>
        ))}
      </div>
    </>
  );
}
function useNow() {
  const { simulation } = useUniverse();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return simulation === "unlocked" || simulation === "capsule"
    ? Math.max(
        now,
        Date.parse(capsule.opens),
        ...gifts.map((g) => Date.parse(g.opens)),
      ) + 1000
    : now;
}
function Capsule() {
  const now = useNow();
  const [open, setOpen] = useState(false);
  const { discover } = useUniverse();
  const left = Date.parse(capsule.opens) - now;
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="WORDS WAITING FOR FUTURE US"
        title="Our Time Capsule"
        description={`Written ${dateLabel(capsule.written)} · Opens ${dateLabel(capsule.opens)}`}
      />
      <button
        className={`capsule ${open ? "capsule-open" : ""}`}
        disabled={left > 0}
        onClick={() => {
          setOpen(true);
          discover("capsule");
        }}
        aria-label="Open time capsule"
      >
        {open ? "♡" : "✧"}
      </button>
      {left > 0 ? (
        <p className="emotional-line">
          {Math.ceil(left / 86400000)} days until this little someday.
          <small>
            {Math.floor(left / 3600000) % 24}h {Math.floor(left / 60000) % 60}m{" "}
            {Math.floor(left / 1000) % 60}s
          </small>
        </p>
      ) : open ? (
        <p className="paper-message">{capsule.letter}</p>
      ) : (
        <p>It’s time. Open it together.</p>
      )}
    </section>
  );
}
function Adventure() {
  const [pin, setPin] = useState("");
  return (
    <>
      <SectionHeading
        eyebrow="THE WORLD IS BIG. OUR LIST IS LONG."
        title="Our adventure map"
        description="Where we are, and all the places we might be."
      />
      <div className="adventure-map">
        <svg viewBox="0 0 800 440" aria-hidden="true">
          <path
            d="M60 70L150 37L260 72L288 142L230 180L180 149L132 197L82 126ZM223 210L300 235L318 309L270 396L239 340ZM376 84L448 57L500 110L450 152L392 131ZM421 168L495 145L540 238L473 343L431 285ZM504 58L680 44L744 130L686 183L624 167L586 245L550 150ZM653 310L727 286L776 342L711 381Z"
            fill="#687a87"
            opacity=".35"
          />
          <path
            d="M182 158Q404 8 631 255"
            stroke="#e6bdba"
            fill="none"
            strokeDasharray="5 9"
          />
        </svg>
        {travel.map((p) => (
          <button
            key={p.name}
            className={`travel-pin ${p.future ? "future-pin" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => setPin(p.name)}
            aria-label={p.name}
          >
            ✦<span>{p.name}</span>
          </button>
        ))}
      </div>
      <p className="emotional-line" aria-live="polite">
        {pin || "A little closer, one adventure at a time."}
      </p>
    </>
  );
}
function Gifts() {
  const now = useNow();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <SectionHeading
        eyebrow="SOME THINGS ARE WORTH THE WAIT"
        title="Mystery gifts"
        description="A little surprise, tied up with a promise."
      />
      <div className="gift-shelf">
        {gifts.map((g) => (
          <div key={g.id}>
            <button
              className={`gift-box ${open === g.id ? "gift-open" : ""}`}
              disabled={now < Date.parse(g.opens)}
              aria-label={`Open ${g.title}`}
              onClick={() => setOpen(g.id)}
            >
              ✦
            </button>
            <h2>{g.title}</h2>
            <p>Do not open until {dateLabel(g.opens)}</p>
            <p>
              {now < Date.parse(g.opens)
                ? `${Math.ceil((Date.parse(g.opens) - now) / 86400000)} days remaining`
                : "It’s yours to open."}
            </p>
            {open === g.id && <p className="paper-message">{g.message}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
function Generator() {
  const [result, setResult] = useState<Record<string, string>>({});
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="PLAYFUL NONSENSE. ABSOLUTELY NOT A PREDICTION."
        title="Our extremely scientific future"
        description="The universe has run the numbers. They are suspicious."
      />
      <dl className="future-result">
        {Object.entries(result).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <button
        className="primary-button"
        onClick={() =>
          setResult(
            Object.fromEntries(
              Object.entries(futureOptions).map(([k, v]) => [k, pick(v)]),
            ),
          )
        }
      >
        {Object.keys(result).length ? "Generate again" : "Consult the universe"}
      </button>
      <Couple scene="hoodie" />
    </section>
  );
}
function DoNotPress({ navigate }: Navigation) {
  const [count, setCount] = useState(0);
  const { unlock, discover } = useUniverse();
  return (
    <section
      className={`quiet-experience forbidden ${count >= 5 ? "heart-explosion" : ""}`}
    >
      <SectionHeading
        eyebrow="DEFINITELY NOTHING TO SEE HERE"
        title={count >= 5 ? "I LOVE YOUUUUU" : "Do not press."}
        description="A perfectly reasonable instruction."
      />
      <button
        className="forbidden-button"
        disabled={count >= 5}
        onClick={() => {
          setCount((c) => c + 1);
          if (count === 4) {
            unlock("do-not-press");
            discover("do-not-press");
          }
        }}
      >
        DO NOT PRESS
      </button>
      <p className="emotional-line" aria-live="polite">
        {
          [
            "",
            "I told you not to press it.",
            "Josh.",
            "seriously?",
            "Fine.",
            "♡ ♡ ♡ ♡ ♡",
          ][Math.min(count, 5)]
        }
      </p>
      {count >= 5 && (
        <>
          <Couple scene="hug" />
          <button className="text-button" onClick={() => navigate("mission")}>
            A suspicious little console appeared… ↗
          </button>
        </>
      )}
    </section>
  );
}
function Mission({ navigate }: Navigation) {
  return (
    <section className="mission-terminal">
      <span className="eyebrow">CLASSIFIED · BOYFRIEND EYES ONLY</span>
      <h1>Josh’s Mission Control</h1>
      <dl>
        {Object.entries(settings.mission).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <h2>SYSTEM STATUS</h2>
      <p>
        ♡ Relationship ONLINE
        <br />♡ Janna OBSESSED
        <br />♡ Josh CUTE
      </p>
      <p className="terminal-warning">
        WARNING: Girlfriend requires attention.
      </p>
      <button onClick={() => navigate("companion")}>
        [ Give girlfriend attention ]
      </button>
      <button onClick={() => navigate("patch")}>
        [ Read relationship patch notes ]
      </button>
    </section>
  );
}
function Patch({ navigate }: Navigation) {
  return (
    <section className="patch-notes">
      <span className="eyebrow">A DEVELOPER’S LOVE LANGUAGE</span>
      <h1>OURVERSE</h1>
      <h2>Relationship v{patchNotes.version}</h2>
      {[
        ["PATCH NOTES", patchNotes.changes],
        ["KNOWN ISSUES", patchNotes.issues],
        ["UPCOMING FEATURES", patchNotes.upcoming],
      ].map(([title, items]) => (
        <section key={title as string}>
          <h3>{title}</h3>
          <ul>
            {(items as string[]).map((t) => (
              <li key={t}>♡ {t}</li>
            ))}
          </ul>
        </section>
      ))}
      <button className="text-button" onClick={() => navigate("mission")}>
        Open Mission Control ↗
      </button>
      <p className="handwritten">distance fix scheduled. date: someday.</p>
    </section>
  );
}
function Sleep({ navigate }: Navigation) {
  const { unlock, discover } = useUniverse();
  useEffect(() => {
    unlock("night");
    discover("sleep");
  }, [unlock, discover]);
  return (
    <section className="quiet-experience bedtime">
      <SectionHeading
        eyebrow="IT’S OKAY TO PUT THE WORLD DOWN"
        title="Can’t sleep?"
        description="Pretend I’m laying next to you."
      />
      <Couple scene="sleep" />
      <p className="emotional-line">
        Relax your shoulders.
        <br />
        You don’t need to solve tomorrow tonight.
        <br />
        I’m right here.
      </p>
      <div className="world-links">
        <button onClick={() => navigate("letters")}>A bedtime letter ↗</button>
        <button onClick={() => navigate("music")}>
          Something quiet to listen to ↗
        </button>
      </div>
    </section>
  );
}
