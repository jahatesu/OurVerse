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
        <div className="room-floor" />
        <div className="room-rug" />
        <div className="room-desk" />
        <button
          className="room-lamp"
          aria-label="Turn the lamp on or off"
          onClick={(e) => e.currentTarget.classList.toggle("lamp-off")}
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
                "✦  ☾  ·"
              ) : o.kind === "books" ? (
                "▥ ▤ ▥"
              ) : o.kind === "calendar" ? (
                "21"
              ) : o.kind === "frame" ? (
                "♡"
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
        <span className="room-note handwritten">
          someday, no more goodbyes through a screen.
        </span>
      </div>
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
    ...(settings.birthday ? [{date:`${month.getFullYear()}-${settings.birthday}`,title:"Josh’s birthday",type:"birthday",story:"Happy birthday, my favorite human. ♡"}] : []),
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
                          e.type === "birthday" ? "♔" : e.type === "memory"
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
      <SectionHeading
        eyebrow="A LITTLE LOVE, EVERY DAY"
        title="Look what we’re growing."
        description="Memories, letters, games, puzzles and discoveries all help our plant grow."
      />
      <div className={`growing-plant plant-stage-${stage}`}>
        <svg className="plant-illustration" viewBox="0 0 240 260" role="img" aria-label={["Seed", "Sprout", "Small plant", "Large plant", "Flowering plant"][stage]}>
          <ellipse cx="120" cy="236" rx="70" ry="12" fill="#0003"/>
          <path d="M76 180H164L150 232H90Z" fill="#b27d85"/><ellipse cx="120" cy="180" rx="44" ry="10" fill="#73545e"/>
          {stage===0 ? <ellipse cx="120" cy="179" rx="8" ry="4" fill="#e6c29d"/> : <g><path d={`M120 180Q109 ${160-stage*15} 120 ${160-stage*29}`} stroke="#91b99d" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {Array.from({length:stage+1},(_,i)=><path key={i} d={i%2===0?`M118 ${165-i*25}Q75 ${170-i*25} 78 ${142-i*25}Q109 ${140-i*25} 118 ${165-i*25}`:`M117 ${165-i*25}Q158 ${172-i*25} 167 ${137-i*25}Q129 ${138-i*25} 117 ${165-i*25}`} fill={i%2===0?"#8fb09d":"#6f9b8a"}/>)}
          {stage===4&&<g fill="#dca8bf"><circle cx="120" cy="34" r="16"/><circle cx="103" cy="49" r="16"/><circle cx="136" cy="49" r="16"/><circle cx="120" cy="64" r="16"/><circle cx="120" cy="49" r="12" fill="#f0d395"/></g>}</g>}
        </svg>
        <span>
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
      </div>
      <Couple scene="sit" />
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
  const {simulation} = useUniverse();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return simulation === "unlocked" ? Math.max(now,Date.parse(capsule.opens),...gifts.map(g=>Date.parse(g.opens)))+1000 : now;
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
