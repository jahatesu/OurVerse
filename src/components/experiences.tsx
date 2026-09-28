"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { Couple, OurVerseCharacter } from "./characters";
import { Modal, SectionHeading } from "./ui";
import { useUniverse } from "./provider";
import {
  dailyMessages,
  coupons,
  mailboxNotes,
  questions,
  loveTraits,
  dreams,
  capsule,
  calendarEvents,
  patchNotes,
  gifts,
  type Coupon,
} from "@/data/expansion";
import { memories } from "@/data/memories";
import { settings } from "@/config/settings";
import { dateLabel, pick } from "@/lib/utils";
import { CHAOS_CATEGORY_META, CHAOS_PAPER_SLOTS, CHAOS_REACTIONS, JACKPOT_REWARDS, LOVE_LETTERS, RARE_DRAW_WEIGHTS, pickChaosEntry, pickUnseen, type ChaosEntry, type JackpotReward } from "@/data/chaos-jar";
import { DestinationArt } from "./galaxy";
import { RoomDiorama } from "./room-diorama";
import { AdventureMap } from "./adventure-map";
type Navigation = { navigate: (id: string) => void };
const homeSouvenirs = [
  { id: "coupons", label: "Tickets on the desk", kind: "tickets" },
  { id: "future", label: "Our someday notebook", kind: "notebook" },
  { id: "jar", label: "The little love jar", kind: "jar" },
  { id: "questions", label: "Stay up talking", kind: "phone" },
  { id: "gifts", label: "A mysterious parcel", kind: "parcel" },
] as const;

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
  { id: "sleep", name: "Bed", kind: "bed" },
  { id: "messages", name: "Laptop", kind: "laptop" },
  { id: "memories", name: "Photo frame", kind: "frame" },
  { id: "letters", name: "Bookshelf", kind: "books" },
  { id: "games", name: "Game console", kind: "console" },
  { id: "world", name: "Window", kind: "window" },
  { id: "calendar", name: "Calendar", kind: "calendar" },
  { id: "music", name: "Music player", kind: "radio" },
  { id: "mailbox", name: "Mailbox", kind: "mailbox" },
  { id: "garden", name: "Plant", kind: "plant" },
];

function OurHome({ navigate }: Navigation) {
  const [lampOn, setLampOn] = useState(true);
  return (
    <>
      <SectionHeading
        eyebrow="THE LIGHT IS ALWAYS ON FOR YOU"
        title="Our Home"
        description="Janna and Josh's little home, filled with shared stories. Look around and see where each keepsake takes you."
      />
      <RoomDiorama objects={roomObjects} keepsakes={homeSouvenirs} navigate={navigate} lampOn={lampOn} onToggleLamp={() => setLampOn((on) => !on)} />
      <p className="room-note handwritten">
        someday, no more goodbyes through a screen.
      </p>
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
        {coupons.map((c, index) => {
          const redeemed = Math.min(c.quantity, progress.redeemed[c.id] || 0);
          const remainingUses = c.quantity - redeemed;
          const exhausted = remainingUses === 0;
          const expired = !!c.expiration && now >= Date.parse(c.expiration);
          return (
            <article
              className={`love-ticket ticket-variant-${index % 4} ${exhausted ? "redeemed" : ""}`}
              key={c.id}
            >
              <span className="ticket-symbol" aria-hidden="true" />
              <div className="ticket-main">
                <span className="eyebrow">
                  JANNA’S LOVE COUPONS · No. {String(index).padStart(2, "0")}
                </span>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <small>{c.terms}</small>
                <button
                  className="secondary-button ticket-redeem"
                  disabled={exhausted || expired}
                  onClick={() => setSelected(c)}
                >
                  {expired
                    ? "Expired"
                    : exhausted
                      ? "REDEEMED"
                      : "Redeem"}
                </button>
              </div>
              <div className="ticket-stub">
                <span className="ticket-used">{exhausted ? "REDEEMED" : `USES · ${remainingUses}`}</span>
                <div className="ticket-barcode" aria-hidden="true">
                  {Array.from({ length: 15 }, (_, bar) => <i key={bar} />)}
                </div>
                <small className="ticket-stub-code">JV · {String(index).padStart(2, "0")}</small>
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
                setScene(c.id === "coupon-v2-yes-day" ? "kiss" : "hug");
                setSelected(null);
              }}
            >
              {selected.id === "coupon-v2-yes-day"
                ? "Give me my kiss"
                : "Yes, redeem it ♡"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
type FirstConversationMessage =
  | { id: string; sender: "Janna" | "Josh"; type: "text"; text: string }
  | { id: string; sender: "Janna" | "Josh"; type: "image"; imageSrc: string };

const FIRST_CONVERSATION: FirstConversationMessage[] = [
  { id: "message-01", sender: "Janna", type: "text", text: "hiii this is janna" },
  { id: "message-02", sender: "Josh", type: "text", text: "hey" },
  { id: "message-03", sender: "Josh", type: "text", text: "soo what's your hair color this month?" },
  { id: "message-04", sender: "Janna", type: "text", text: "hahaha guess" },
  { id: "message-05", sender: "Josh", type: "text", text: "hmm pink?" },
  { id: "message-06", sender: "Janna", type: "text", text: "noo way how'd you knoww" },
  { id: "message-07", sender: "Josh", type: "text", text: "show me plzzzz" },
  { id: "message-08", sender: "Janna", type: "image", imageSrc: "/memories/first-conversation-janna.jpg" },
  { id: "message-09", sender: "Josh", type: "text", text: "ugh wait it looks so good" },
  { id: "message-10", sender: "Josh", type: "text", text: "and the choker too omg" },
];

function ConversationPhoto({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="imessage-photo is-placeholder" role="img" aria-label="Photo placeholder">
    <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="22" rx="3"/><circle cx="11" cy="12" r="2.5"/><path d="m6 24 7-7 4 4 3-3 6 6"/></svg>
    <span>photo goes here ♡</span>
  </div>;
  return <div className="imessage-photo is-loaded">
    <Image src={src} alt="Janna's photo attachment from the first conversation" width={1200} height={900} sizes="(max-width: 700px) 176px, 196px" unoptimized onError={() => setFailed(true)} />
  </div>;
}
function Messages() {
  const messages = FIRST_CONVERSATION;
  const [visible, setVisible] = useState(1);
  const [typing, setTyping] = useState(false);
  const [endingVisible, setEndingVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const { discover } = useUniverse();
  const conversationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(messages.length);
      setTyping(false);
      setEndingVisible(true);
      return;
    }
    if (visible >= messages.length) {
      const timer = window.setTimeout(() => setEndingVisible(true), 480);
      return () => window.clearTimeout(timer);
    }
    const showTyping = visible === 2 || visible === 8;
    const typingTimer = showTyping ? window.setTimeout(() => setTyping(true), 90) : undefined;
    const revealDelay = visible === 7 ? 540 : showTyping ? 390 : visible === 6 ? 370 : 300;
    const revealTimer = window.setTimeout(() => {
      setTyping(false);
      setVisible((current) => Math.min(current + 1, messages.length));
    }, revealDelay);
    return () => {
      if (typingTimer !== undefined) window.clearTimeout(typingTimer);
      window.clearTimeout(revealTimer);
    };
  }, [visible, messages.length, replayKey]);

  useEffect(() => {
    if (visible < 2) return;
    const newest = conversationRef.current?.querySelector<HTMLElement>(`[data-message-index="${visible - 1}"]`);
    const previous = conversationRef.current?.querySelector<HTMLElement>(`[data-message-index="${visible - 2}"]`);
    if (!newest || !previous) return;
    const previousRect = previous.getBoundingClientRect();
    const newestRect = newest.getBoundingClientRect();
    const userFollowingConversation = previousRect.bottom > 0 && previousRect.top < window.innerHeight;
    if (userFollowingConversation && newestRect.bottom > window.innerHeight - 56) {
      window.scrollBy({ top: Math.min(150, newestRect.bottom - window.innerHeight + 72), behavior: "smooth" });
    }
  }, [visible]);

  function replayConversation() {
    setVisible(1);
    setTyping(false);
    setEndingVisible(false);
    setReplayKey((key) => key + 1);
    discover("messages");
    conversationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="messages-archive">
      <SectionHeading
        eyebrow="✦ THE VERY BEGINNING ✦"
        title="Where It All Started"
        description="Our first conversation, preserved exactly as it happened."
      />
      <div className="archive-mark">✦ OURVERSE ARCHIVE <span>·</span> ENTRY 001 ✦</div>
      <div className="conversation-chat-window" ref={conversationRef} role="region" aria-label="Janna and Josh's first message conversation">
        <header className="imessage-header">
          <span className="contact-avatar" aria-hidden="true">
            <svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="5"/><path d="M6 28c.5-6 4-9 10-9s9.5 3 10 9"/></svg>
          </span>
          <span className="contact-name">Josh</span>
          <span className="contact-chevron" aria-hidden="true">›</span>
        </header>
        <div className="imessage-date">April 9, 2026</div>
        <div className="imessage-thread" aria-label="First conversation messages">
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const next = messages[index + 1];
            const sameAsPrevious = previous?.sender === message.sender;
            const sameAsNext = next?.sender === message.sender;
            const isFirstOutgoing = index === 0;
            return (
              <div
                className={`imessage-row ${message.sender === "Janna" ? "outgoing" : "incoming"} ${sameAsPrevious ? "same-as-previous" : ""} ${sameAsNext ? "same-as-next" : ""} ${index < visible ? "is-revealed" : "is-unrevealed"}`}
                data-message-index={index}
                key={message.id}
              >
                {message.type === "image" ? (
                  <ConversationPhoto src={message.imageSrc} />
                ) : (
                  <div className={`imessage-bubble ${message.sender === "Janna" ? "janna-bubble" : "josh-bubble"}`}>
                    <p>{message.text}</p>
                  </div>
                )}
                {isFirstOutgoing && index < visible && <span className="first-message-annotation">↳ the message that started everything</span>}
              </div>
            );
          })}
          {typing && visible < messages.length && (
            <div className={`imessage-row ${messages[visible].sender === "Janna" ? "outgoing" : "incoming"} is-revealed`} aria-hidden="true">
              <div className={`imessage-typing ${messages[visible].sender === "Janna" ? "janna-bubble" : "josh-bubble"}`}><i/><i/><i/></div>
            </div>
          )}
        </div>
      </div>
      {endingVisible && <div className="conversation-ending is-visible" aria-live="polite">
        <span aria-hidden="true">✦</span>
        <p>And that was only the beginning.</p>
      </div>}
      <button className="archive-replay" type="button" onClick={replayConversation}>↻ REPLAY OUR FIRST CONVERSATION</button>
    </div>
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
  type JarPhase = "idle" | "resetting" | "anticipating" | "shaking" | "selecting" | "escaping" | "flying" | "landing" | "unfolding" | "revealed" | "closing";
  type GameState = { status: "unanswered" } | { status: "choosing-winner" } | { status: "answered" | "completed"; choice?: string; reaction: string } | { status: "mission-revealed" } | { status: "wild-revealed"; choice: string; prompt: string };
  type DrawKind = "normal" | "jackpot" | "double" | "loveLetter";
  type SettledDoublePaper = { entry: ChaosEntry; flight: Flight; slotIndex: number; rotation: number; stage: "escaping" | "flying" | "landing" | "unfolding" | "open" };
  type Flight = {
    left: number;
    top: number;
    targetLeft: number;
    targetTop: number;
    foldWidth: number;
    foldHeight: number;
    openWidth: number;
    openHeight: number;
    rotation: number;
    scale: number;
  };
  const [entry, setEntry] = useState<ChaosEntry | null>(null);
  const [game, setGame] = useState<GameState>({ status: "unanswered" });
  const [secondGame, setSecondGame] = useState<GameState>({ status: "unanswered" });
  const [settledDoublePapers, setSettledDoublePapers] = useState<SettledDoublePaper[]>([]);
  const [drawKind, setDrawKind] = useState<DrawKind>("normal");
  const [jackpotReward, setJackpotReward] = useState<JackpotReward | null>(null);
  const [letterMessage, setLetterMessage] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterMessageVisible, setLetterMessageVisible] = useState(false);
  const [letterKept, setLetterKept] = useState(false);
  const [jackpotClaimed, setJackpotClaimed] = useState(false);
  const [specialActionBusy, setSpecialActionBusy] = useState(false);
  const [specialAside, setSpecialAside] = useState("");
  const [specialAsideVisible, setSpecialAsideVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [caseNumber, setCaseNumber] = useState(0);
  const [secondCaseNumber, setSecondCaseNumber] = useState(0);
  const [phase, setPhase] = useState<JarPhase>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [paperSpace, setPaperSpace] = useState(false);
  const [unfolded, setUnfolded] = useState(false);
  const sequenceLock = useRef(false);
  const usedEntries = useRef(new Set<string>());
  const usedRewards = useRef(new Set<string>());
  const usedLetters = useRef(new Set<string>());
  const rareNextNormal = useRef(false);
  const promptTimer = useRef<number | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const deskRef = useRef<HTMLDivElement | null>(null);
  const jarRef = useRef<HTMLDivElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const flightNoteRef = useRef<HTMLDivElement | null>(null);
  const resultCopyRef = useRef<HTMLDivElement | null>(null);
  const doublePaperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const jackpotSlotIndex = 6;
  const loveLetterSlotIndex = 17;
  const paperTypeAt = (index: number): string => index === jackpotSlotIndex ? "jackpot" : index === loveLetterSlotIndex ? "loveLetter" : CHAOS_PAPER_SLOTS[index];
  const slips = CHAOS_PAPER_SLOTS.map((type, index) => index === jackpotSlotIndex ? "✦" : index === loveLetterSlotIndex ? "♡" : CHAOS_CATEGORY_META[type].symbol);

  useEffect(() => () => {
    if (promptTimer.current !== null) window.clearTimeout(promptTimer.current);
  }, []);

  const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const pauseFor = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));
  async function animateElement(element: Element | null, frames: Keyframe[], duration: number, easing = "ease-in-out", keepFinalFrame = false) {
    if (!element) return;
    let animation: Animation;
    try {
      animation = element.animate(frames, { duration, easing, fill: "none" });
    } catch {
      return;
    }
    try {
      await animation.finished;
    } catch {
      // A later interaction may cancel an animation during unmount.
    } finally {
      if (keepFinalFrame) {
        try { animation.commitStyles(); } catch { /* The next state update supplies the settled pose. */ }
      }
      animation.cancel();
    }
  }
  async function animateFlightElement(element: HTMLElement | null, frames: Keyframe[], duration: number, easing: string, settle: () => void) {
    if (!element) return;
    let animation: Animation;
    try {
      animation = element.animate(frames, { duration, easing, fill: "none" });
    } catch {
      flushSync(settle);
      return;
    }
    try {
      await animation.finished;
    } catch {
      // Keep the next settled flight pose if the animation is interrupted.
    } finally {
      flushSync(settle);
      animation.cancel();
    }
  }
  async function waitForLayoutMotion(elements: Array<HTMLElement | null>) {
    await nextFrame();
    const animations = elements
      .filter((element): element is HTMLElement => element !== null)
      .flatMap((element) => element.getAnimations());
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  }

  function chooseDrawKind(): DrawKind {
    if (rareNextNormal.current) {
      rareNextNormal.current = false;
      return "normal";
    }
    if (process.env.NODE_ENV !== "production") {
      const forced = new URLSearchParams(window.location.search).get("jarDebug");
      if (forced === "jackpot" || forced === "double" || forced === "love-letter") {
        rareNextNormal.current = true;
        return forced === "love-letter" ? "loveLetter" : forced;
      }
      if (forced === "normal") return "normal";
    }
    const total = Object.values(RARE_DRAW_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [kind, weight] of Object.entries(RARE_DRAW_WEIGHTS) as Array<[DrawKind, number]>) {
      roll -= weight;
      if (roll < 0) {
        if (kind !== "normal") rareNextNormal.current = true;
        return kind;
      }
    }
    return "normal";
  }

  async function animateSelectedPaper(slotIndex: number, currentEntry: ChaosEntry | null, paperNumber = 0, kind: DrawKind = drawKind): Promise<Flight> {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gentle = kind === "loveLetter";
    setSelectedIndex(slotIndex);
    setEntry(currentEntry);
    setFlight(null);
    setUnfolded(false);
    setPhase("selecting");
    if (paperNumber === 1) await pauseFor(300);
    await nextFrame();
    const scene = sceneRef.current;
    const jar = jarRef.current;
    if (!scene || !jar) throw new Error("The Love Jar scene is unavailable");
    const sourcePaper = jar.querySelector<HTMLElement>(`[data-jar-note="${slotIndex}"]`);
    if (!sourcePaper) throw new Error("The selected paper is unavailable");
    await waitForLayoutMotion([sourcePaper]);

    const sceneRect = scene.getBoundingClientRect();
    const sourceRect = sourcePaper.getBoundingClientRect();
    const sourceStyle = getComputedStyle(sourcePaper);
    const matrix = new DOMMatrixReadOnly(sourceStyle.transform);
    const rotation = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    const sourceScale = Math.hypot(matrix.a, matrix.b) * (parseFloat(sourceStyle.getPropertyValue("scale")) || 1);
    const foldWidth = parseFloat(sourceStyle.width) || sourceRect.width;
    const foldHeight = parseFloat(sourceStyle.height) || sourceRect.height;
    const mobile = sceneRect.width <= 700;
    const isDouble = kind === "double";
    const openWidth = isDouble ? (mobile ? Math.max(270, sceneRect.width - 28) : Math.min(280, sceneRect.width * .31)) : mobile ? Math.max(250, sceneRect.width - 32) : Math.min(370, sceneRect.width * .42);
    const openHeight = mobile ? 236 : 208;
    const targetLeft = isDouble ? mobile ? 14 : sceneRect.width * (paperNumber === 0 ? .33 : .66) : mobile ? 16 : sceneRect.width * .54;
    const targetTop = isDouble ? mobile ? 330 + paperNumber * 340 : sceneRect.height - 44 - 450 + 105 + paperNumber * 52 : mobile ? 640 - 38 - 415 + 155 : sceneRect.height - 44 - 220 + 16;
    const left = sourceRect.left - sceneRect.left + (sourceRect.width - foldWidth) / 2;
    const top = sourceRect.top - sceneRect.top + (sourceRect.height - foldHeight) / 2;
    const nextFlight: Flight = { left, top, targetLeft, targetTop, foldWidth, foldHeight, openWidth, openHeight, rotation, scale: sourceScale };
    flushSync(() => {
      setFlight(nextFlight);
      setPhase(reducedMotion ? "flying" : "escaping");
    });
    await nextFrame();
    const flyingNote = flightNoteRef.current;
    if (!flyingNote) throw new Error("The selected paper could not be lifted from the jar");

    if (reducedMotion) {
      await animateFlightElement(flyingNote, [
        { transform: `translate(0, 0) rotate(${rotation}deg) scale(${sourceScale})`, opacity: .94 },
        { transform: `translate(${(targetLeft - left) * .5}px, ${(targetTop - top) * .5 - 8}px) rotate(${rotation * .35}deg) scale(${sourceScale * .98})`, opacity: 1, offset: .58 },
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 },
      ], 240, "ease-out", () => {
        setFlight({ ...nextFlight, left: targetLeft, top: targetTop, rotation: 0, scale: 1 });
        setPhase("landing");
      });
    } else {
      const jarRect = jar.getBoundingClientRect();
      const jarTop = jarRect.top - sceneRect.top;
      const openingLeft = jarRect.left - sceneRect.left + (jarRect.width - foldWidth) / 2;
      const openingTop = jarTop + 30;
      const clearLeft = openingLeft + 4;
      const clearTop = Math.max(4, jarTop - foldHeight - 7);
      const mouthDx = openingLeft - left;
      const mouthDy = openingTop - top;
      const clearDx = clearLeft - left;
      const clearDy = clearTop - top;
      const exitDuration = gentle ? 880 : 650;
      await Promise.all([
        animateFlightElement(flyingNote, [
          { transform: `perspective(700px) translate(0, 0) rotateX(0deg) rotate(${rotation}deg) scale(${sourceScale})`, offset: 0 },
          { transform: `perspective(700px) translate(${mouthDx * .72}px, ${mouthDy}px) rotateX(7deg) rotate(${rotation - 5}deg) scale(${sourceScale * .96})`, offset: .48 },
          { transform: `perspective(700px) translate(${clearDx}px, ${clearDy + 12}px) rotateX(-5deg) rotate(${rotation - 11}deg) scale(${sourceScale * .93})`, offset: .82 },
          { transform: `perspective(700px) translate(${clearDx}px, ${clearDy}px) rotateX(0deg) rotate(${rotation - 8}deg) scale(${sourceScale * .94})`, offset: 1 },
        ], exitDuration, gentle ? "cubic-bezier(.35,.45,.28,1)" : "cubic-bezier(.22,.66,.25,1)", () => {
          setFlight({ ...nextFlight, left: left + clearDx, top: top + clearDy, rotation: rotation - 8, scale: sourceScale * .94 });
          setPhase("flying");
        }),
        animateElement(lidRef.current, [
          { translate: "0 0", rotate: "0deg", offset: 0 },
          { translate: "0 -10px", rotate: "4deg", offset: .42 },
          { translate: "0 -6px", rotate: "2deg", offset: .72 },
          { translate: "0 0", rotate: "0deg", offset: 1 },
        ], exitDuration, "cubic-bezier(.2,.72,.25,1)"),
      ]);
      await nextFrame();
      const escapeLeft = left + clearDx;
      const escapeTop = top + clearDy;
      if (kind === "double" && paperNumber === 0) {
        return { ...nextFlight, left: escapeLeft, top: escapeTop, rotation: rotation - 8, scale: sourceScale * .94 };
      }
      const dx = targetLeft - escapeLeft;
      const dy = targetTop - escapeTop;
      const arcLift = Math.max(0, Math.min(mobile ? 24 : 42, clearTop - 4));
      await animateFlightElement(flightNoteRef.current, [
        { transform: `perspective(700px) translate(0, 0) rotateX(0deg) rotate(${rotation - 8}deg) scale(${sourceScale * .94})`, boxShadow: "0 3px 5px #25182455, inset 0 1px #fff9", offset: 0 },
        { transform: `perspective(700px) translate(${dx * .22}px, ${dy * .14 - arcLift}px) rotateX(8deg) rotate(${rotation - 15}deg) scale(${sourceScale * .9})`, boxShadow: "0 5px 9px #100b1c42, inset 0 1px #fff9", offset: .28 },
        { transform: `perspective(700px) translate(${dx * .62}px, ${dy * .52 - arcLift * 1.15}px) rotateX(-3deg) rotate(${rotation - 4}deg) scale(${sourceScale * .93})`, boxShadow: "0 7px 13px #100b1c48, inset 0 1px #fff9", offset: .58 },
        { transform: `perspective(700px) translate(${dx * .88}px, ${dy * .86 - arcLift * .4}px) rotateX(4deg) rotate(3deg) scale(${sourceScale * .97})`, boxShadow: "0 11px 18px #100b1c58, inset 0 1px #fff9", offset: .83 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`, boxShadow: "0 12px 20px #100b1c55, inset 0 1px #fff9", offset: 1 },
      ], gentle ? 930 : 720, gentle ? "cubic-bezier(.3,.55,.3,1)" : "cubic-bezier(.2,.68,.24,1)", () => {
        setFlight({ ...nextFlight, left: targetLeft, top: targetTop, rotation: 0, scale: 1 });
        setPhase("landing");
      });
    }

    if (reducedMotion && kind === "double" && paperNumber === 0) {
      return { ...nextFlight, left: targetLeft, top: targetTop, rotation: 0, scale: 1 };
    }

    await nextFrame();
    await animateElement(flightNoteRef.current, [
      { transform: "translate(0, 0) rotate(0deg) scale(1)", boxShadow: "0 8px 14px #100b1c38, inset 0 1px #fff9", offset: 0 },
      { transform: "translate(0, 3px) rotate(.8deg) scale(1.015)", boxShadow: "0 15px 22px #100b1c66, inset 0 1px #fff9", offset: .28 },
      { transform: "translate(0, -2px) rotate(-.35deg) scale(.995)", boxShadow: "0 13px 21px #100b1c5c, inset 0 1px #fff9", offset: .58 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", boxShadow: "0 12px 20px #100b1c55, inset 0 1px #fff9", offset: 1 },
    ], reducedMotion ? 170 : gentle ? 360 : 280, "cubic-bezier(.2,.72,.28,1)");
    await pauseFor(gentle ? 360 : 240);

    if (kind === "loveLetter") {
      const envelope = flightNoteRef.current;
      if (!envelope) throw new Error("The letter landed but could not be opened");
      await animateElement(envelope, [
        { width: `${foldWidth}px`, height: `${foldHeight}px`, transform: "rotate(0deg) scale(1)" },
        { width: "112px", height: "76px", transform: "rotate(-1deg) scale(1.02)" },
      ], reducedMotion ? 140 : 320, "cubic-bezier(.2,.7,.3,1)", true);
      const envelopeFlight = { ...nextFlight, foldWidth: 112, foldHeight: 76 };
      flushSync(() => setFlight(envelopeFlight));
      setPhase("revealed");
      setUnfolded(false);
      return envelopeFlight;
    }

    setPhase("unfolding");
    await nextFrame();
    const paper = flightNoteRef.current;
    if (!paper) throw new Error("The paper reached the desk but could not unfold");
    await animateFlightElement(paper, [
      { width: `${foldWidth}px`, height: `${foldHeight}px`, transform: "perspective(700px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)", offset: 0 },
      { width: `${foldWidth * 1.7}px`, height: `${foldHeight * 1.35}px`, transform: "perspective(700px) rotateX(12deg) rotateY(-55deg) rotate(-3deg) scale(.97)", offset: .25 },
      { width: `${openWidth * .54}px`, height: `${openHeight * .58}px`, transform: "perspective(700px) rotateX(-9deg) rotateY(12deg) rotate(2deg) scale(1.01)", offset: .52 },
      { width: `${openWidth}px`, height: `${openHeight * .86}px`, transform: "perspective(700px) rotateX(6deg) rotateY(-4deg) rotate(-1deg) scale(1)", offset: .78 },
      { width: `${openWidth}px`, height: `${openHeight}px`, transform: "perspective(700px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)", offset: 1 },
    ], reducedMotion ? 250 : 820, "cubic-bezier(.2,.78,.22,1)", () => {
      setFlight((current) => current ? { ...current, rotation: 0, scale: 1 } : current);
      setUnfolded(true);
    });
    await pauseFor(reducedMotion ? 80 : 190);
    return nextFlight;
  }

  function updateFirstDoublePaper(stage: SettledDoublePaper["stage"], nextFlight: Flight) {
    setSettledDoublePapers((current) => current.map((paper, index) => index === 0 ? { ...paper, flight: nextFlight, stage, rotation: stage === "open" ? -1.5 : stage === "flying" ? paper.rotation : 0 } : paper));
  }

  async function finishFirstDoublePaper(paper: SettledDoublePaper) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await nextFrame();
    const node = doublePaperRefs.current[0];
    if (!node) throw new Error("The first selected paper could not continue its flight");
    const flight = paper.flight;
    const dx = flight.targetLeft - flight.left;
    const dy = flight.targetTop - flight.top;
    const arcLift = Math.min(36, Math.max(0, flight.top - 8));
    await animateFlightElement(node, reducedMotion ? [
      { transform: `translate(0, 0) rotate(${flight.rotation}deg) scale(${flight.scale})`, opacity: 1, offset: 0 },
      { transform: `translate(${dx * .5}px, ${dy * .5 - 8}px) rotate(0deg) scale(.98)`, opacity: 1, offset: .58 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1, offset: 1 },
    ] : [
      { transform: `perspective(700px) translate(0, 0) rotateX(0deg) rotate(${flight.rotation}deg) scale(${flight.scale})`, boxShadow: "0 3px 5px #25182455, inset 0 1px #fff9", offset: 0 },
      { transform: `perspective(700px) translate(${dx * .24}px, ${dy * .16 - arcLift}px) rotateX(8deg) rotate(${flight.rotation - 7}deg) scale(.9)`, boxShadow: "0 5px 9px #100b1c42, inset 0 1px #fff9", offset: .28 },
      { transform: `perspective(700px) translate(${dx * .63}px, ${dy * .54 - arcLift * 1.1}px) rotateX(-3deg) rotate(${flight.rotation + 3}deg) scale(.94)`, boxShadow: "0 7px 13px #100b1c48, inset 0 1px #fff9", offset: .6 },
      { transform: `perspective(700px) translate(${dx * .88}px, ${dy * .87 - arcLift * .35}px) rotateX(4deg) rotate(-1deg) scale(.98)`, boxShadow: "0 11px 18px #100b1c58, inset 0 1px #fff9", offset: .84 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`, boxShadow: "0 12px 20px #100b1c55, inset 0 1px #fff9", offset: 1 },
    ], reducedMotion ? 240 : 720, reducedMotion ? "ease-out" : "cubic-bezier(.2,.68,.24,1)", () => {
      updateFirstDoublePaper("landing", { ...flight, left: flight.targetLeft, top: flight.targetTop, rotation: 0, scale: 1 });
    });
    await nextFrame();
    await animateElement(node, [
      { transform: "translate(0, 0) rotate(0deg) scale(1)", boxShadow: "0 8px 14px #100b1c38, inset 0 1px #fff9", offset: 0 },
      { transform: "translate(0, 3px) rotate(.8deg) scale(1.015)", boxShadow: "0 15px 22px #100b1c66, inset 0 1px #fff9", offset: .28 },
      { transform: "translate(0, -2px) rotate(-.35deg) scale(.995)", boxShadow: "0 13px 21px #100b1c5c, inset 0 1px #fff9", offset: .58 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", boxShadow: "0 12px 20px #100b1c55, inset 0 1px #fff9", offset: 1 },
    ], reducedMotion ? 150 : 260, "cubic-bezier(.2,.72,.28,1)");
    await pauseFor(220);
    updateFirstDoublePaper("unfolding", { ...flight, left: flight.targetLeft, top: flight.targetTop, rotation: 0, scale: 1 });
    await nextFrame();
    await animateFlightElement(node, [
      { width: `${flight.foldWidth}px`, height: `${flight.foldHeight}px`, transform: "perspective(700px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)", offset: 0 },
      { width: `${flight.foldWidth * 1.7}px`, height: `${flight.foldHeight * 1.35}px`, transform: "perspective(700px) rotateX(12deg) rotateY(-55deg) rotate(-3deg) scale(.97)", offset: .25 },
      { width: `${flight.openWidth * .54}px`, height: `${flight.openHeight * .58}px`, transform: "perspective(700px) rotateX(-9deg) rotateY(12deg) rotate(2deg) scale(1.01)", offset: .52 },
      { width: `${flight.openWidth}px`, height: `${flight.openHeight * .86}px`, transform: "perspective(700px) rotateX(6deg) rotateY(-4deg) rotate(-1deg) scale(1)", offset: .78 },
      { width: `${flight.openWidth}px`, height: `${flight.openHeight}px`, transform: "perspective(700px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)", offset: 1 },
    ], reducedMotion ? 250 : 820, "cubic-bezier(.2,.78,.22,1)", () => {
      updateFirstDoublePaper("open", { ...flight, left: flight.targetLeft, top: flight.targetTop, rotation: 0, scale: 1 });
    });
  }

  async function drawFromJar(afterClosing = false) {
    if (sequenceLock.current && !afterClosing) return;
    if (phase !== "idle" && !afterClosing) return;
    sequenceLock.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (promptTimer.current !== null) window.clearTimeout(promptTimer.current);
    const selectedKind = chooseDrawKind();
    const drawnEntries = selectedKind === "double"
      ? (() => { const first = pickChaosEntry(usedEntries.current); return [first, pickChaosEntry(usedEntries.current, [first.type])] as [ChaosEntry, ChaosEntry]; })()
      : selectedKind === "normal" ? [pickChaosEntry(usedEntries.current)] : [];
    const slotFor = (drawn: ChaosEntry, excluded: number[] = []) => pick(CHAOS_PAPER_SLOTS.flatMap((type, index) => type === drawn.type && index !== jackpotSlotIndex && index !== loveLetterSlotIndex && !excluded.includes(index) ? [index] : []));
    const selectedSlots: number[] = selectedKind === "jackpot" ? [jackpotSlotIndex]
      : selectedKind === "loveLetter" ? [loveLetterSlotIndex]
        : selectedKind === "double" ? (() => { const first = slotFor(drawnEntries[0]); return [first, slotFor(drawnEntries[1], [first])]; })()
          : [slotFor(drawnEntries[0])];
    const selectedReward = selectedKind === "jackpot" ? pickUnseen(JACKPOT_REWARDS, usedRewards.current) : null;
    const selectedLetter = selectedKind === "loveLetter" ? pickUnseen(LOVE_LETTERS, usedLetters.current) : null;
    setDrawKind(selectedKind);
    setJackpotReward(selectedReward);
    setLetterMessage(selectedLetter?.message ?? "");
    setLetterOpen(false);
    setLetterMessageVisible(false);
    setLetterKept(false);
    setJackpotClaimed(false);
    setSpecialActionBusy(false);
    setSettledDoublePapers([]);
    setSpecialAsideVisible(false);
    setSpecialAside("");
    setEntry(drawnEntries[0] ?? null);
    setCaseNumber(100 + Math.floor(Math.random() * 900));
    setSecondCaseNumber(100 + Math.floor(Math.random() * 900));
    setGame({ status: "unanswered" });
    setSecondGame({ status: "unanswered" });
    setPromptVisible(false);
    setSelectedIndex(selectedSlots[0] ?? null);
    setFlight(null);
    setUnfolded(false);
    setPaperSpace(true);
    setPhase("anticipating");

    try {
      const scene = sceneRef.current;
      const jar = jarRef.current;
      if (!scene || !jar) throw new Error("The Love Jar scene is unavailable");
      const expansion = waitForLayoutMotion([scene, deskRef.current]);
      await Promise.all([
        expansion,
        animateElement(jar, [
          { rotate: "0deg", offset: 0 },
          { rotate: "1.35deg", translate: "0 0", offset: 1 },
        ], 190, "cubic-bezier(.2,.7,.3,1)", true),
        animateElement(lidRef.current, [
          { translate: "0 0", rotate: "0deg", offset: 0 },
          { translate: "0 -3px", rotate: "-2deg", offset: .5 },
          { translate: "0 0", rotate: "0deg", offset: 1 },
        ], 190),
      ]);

      if (!reducedMotion) {
        setPhase("shaking");
        await nextFrame();
        const paperAnimations = [...jar.querySelectorAll<HTMLElement>(".jar-note")]
          .flatMap((paper) => paper.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
        await Promise.all([
          animateElement(jar, [
            { rotate: "1.35deg", translate: "0 0", offset: 0 },
            { rotate: "-4.4deg", translate: "-1px 1px", offset: .12 },
            { rotate: "5.2deg", translate: "1px 0", offset: .27 },
            { rotate: "-4.2deg", translate: "-1px 1px", offset: .43 },
            { rotate: "3.2deg", translate: "1px 0", offset: .59 },
            { rotate: "-2.35deg", translate: "-1px 0", offset: .73 },
            { rotate: "1.5deg", translate: "0 0", offset: .85 },
            { rotate: "-.65deg", translate: "0 -1px", offset: .94 },
            { rotate: "0deg", translate: "0 0", offset: 1 },
          ], 930, "cubic-bezier(.28,.05,.36,1)", true),
          Promise.all(paperAnimations),
        ]);
      } else {
        await animateElement(jar, [
          { rotate: "1.35deg", translate: "0 0" },
          { rotate: "0deg", translate: "0 0" },
        ], 120, "ease-out", true);
      }

      if (selectedKind === "jackpot") {
        setSpecialAside("wait...");
        setSpecialAsideVisible(true);
        await pauseFor(260);
        setSpecialAside("this one's different.");
        await pauseFor(360);
        setSpecialAsideVisible(false);
      }

      const firstFlight = await animateSelectedPaper(selectedSlots[0], drawnEntries[0] ?? null, 0, selectedKind);
      if (selectedKind === "double") {
        const firstDoublePaper: SettledDoublePaper = { entry: drawnEntries[0], flight: firstFlight, slotIndex: selectedSlots[0], rotation: firstFlight.rotation, stage: "flying" };
        flushSync(() => {
          setSettledDoublePapers([firstDoublePaper]);
          setFlight(null);
          setUnfolded(false);
          setEntry(drawnEntries[1]);
          setGame({ status: "unanswered" });
          setSecondGame({ status: "unanswered" });
          setSelectedIndex(selectedSlots[1]);
          setPhase("selecting");
        });
        const secondDraw = async () => {
          setSpecialAside("uh...");
          setSpecialAsideVisible(true);
          await pauseFor(170);
          setSpecialAside("two came out.");
          await pauseFor(220);
          setSpecialAsideVisible(false);
          await animateSelectedPaper(selectedSlots[1], drawnEntries[1], 1, selectedKind);
          setFlight((current) => current ? { ...current, rotation: 1.5 } : current);
        };
        await Promise.all([finishFirstDoublePaper(firstDoublePaper), secondDraw()]);
      }
      setPhase("revealed");
      sequenceLock.current = false;
      promptTimer.current = window.setTimeout(() => setPromptVisible(true), reducedMotion ? 100 : 180);
    } catch (error) {
      console.error("[Love Jar] Paper draw animation failed:", error instanceof Error ? error.message : "unknown error");
      setPaperSpace(false);
      setFlight(null);
      setSelectedIndex(null);
      setUnfolded(false);
      setEntry(null);
      setGame({ status: "unanswered" });
      setSecondGame({ status: "unanswered" });
      setSettledDoublePapers([]);
      setDrawKind("normal");
      setSpecialAsideVisible(false);
      setLetterOpen(false);
      setLetterMessageVisible(false);
      setLetterKept(false);
      setJackpotClaimed(false);
      setSpecialActionBusy(false);
      setPromptVisible(false);
      setPhase("idle");
      sequenceLock.current = false;
    }
  }

  async function openLoveLetter() {
    if (phase !== "revealed" || sequenceLock.current || letterOpen || !flight) return;
    sequenceLock.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLetterOpen(true);
    await nextFrame();
    const paper = flightNoteRef.current;
    if (paper) {
      await animateFlightElement(paper, [
        { width: "112px", height: "76px", transform: "perspective(700px) rotateY(0deg) rotate(0deg) scale(1)" },
        reducedMotion
          ? { width: `${flight.openWidth}px`, height: `${flight.openHeight}px`, transform: "translateY(-2px) scale(1)", offset: .72 }
          : { width: `${flight.openWidth * .62}px`, height: `${flight.openHeight * .8}px`, transform: "perspective(700px) rotateY(-28deg) rotate(-2deg) scale(1.02)", offset: .42 },
        { width: `${flight.openWidth}px`, height: `${flight.openHeight}px`, transform: "perspective(700px) rotateY(0deg) rotate(0deg) scale(1)" },
      ], reducedMotion ? 180 : 720, reducedMotion ? "ease-out" : "cubic-bezier(.22,.7,.25,1)", () => {
        setFlight((current) => current ? { ...current, rotation: 0, scale: 1 } : current);
        setUnfolded(true);
      });
    }
    await pauseFor(180);
    setLetterMessageVisible(true);
    sequenceLock.current = false;
  }

  function claimJackpot() {
    if (phase !== "revealed" || !promptVisible || sequenceLock.current || jackpotClaimed) return;
    sequenceLock.current = true;
    setSpecialActionBusy(true);
    setJackpotClaimed(true);
  }

  function keepLoveLetter() {
    if (phase !== "revealed" || !letterMessageVisible || sequenceLock.current || letterKept) return;
    setLetterKept(true);
  }

  async function drawAnother() {
    if (phase !== "revealed" || sequenceLock.current) return;
    if (promptTimer.current !== null) window.clearTimeout(promptTimer.current);
    sequenceLock.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("closing");
    await nextFrame();
    const copy = resultCopyRef.current;
    if (copy) {
      await animateElement(copy, [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(5px)" },
      ], reducedMotion ? 90 : 140, "ease-in", true);
    }
    await Promise.all(settledDoublePapers.map(async (settled, index) => {
      const note = doublePaperRefs.current[index];
      if (!note) return;
      const copy = note.querySelector<HTMLElement>(".jar-revealed-copy");
      if (copy) await animateElement(copy, [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(4px)" },
      ], reducedMotion ? 70 : 120, "ease-in", true);
      const height = note.getBoundingClientRect().height;
      await animateElement(note, reducedMotion ? [
        { width: `${settled.flight.openWidth}px`, height: `${height}px`, opacity: 1, transform: `rotate(${settled.rotation}deg) scale(1)` },
        { width: `${settled.flight.foldWidth}px`, height: `${settled.flight.foldHeight}px`, opacity: .65, transform: "rotate(0deg) scale(.84)" },
      ] : [
        { width: `${settled.flight.openWidth}px`, height: `${height}px`, opacity: 1, transform: `perspective(700px) rotateY(0deg) rotate(${settled.rotation}deg) scale(1)`, offset: 0 },
        { width: `${settled.flight.openWidth * .68}px`, height: `${height * .76}px`, opacity: 1, transform: "perspective(700px) rotateY(24deg) rotate(-2deg) scale(.97)", offset: .34 },
        { width: `${settled.flight.openWidth * .38}px`, height: `${settled.flight.foldHeight * 1.25}px`, opacity: .8, transform: "perspective(700px) rotateY(-54deg) rotate(2deg) scale(.9)", offset: .72 },
        { width: `${settled.flight.foldWidth}px`, height: `${settled.flight.foldHeight}px`, opacity: .65, transform: "perspective(700px) rotateX(56deg) rotate(0deg) scale(.84)", offset: 1 },
      ], reducedMotion ? 160 : 390, reducedMotion ? "ease-out" : "cubic-bezier(.3,.08,.65,.55)", true);
    }));
    const paper = flightNoteRef.current;
    if (paper && flight) {
      const openedHeight = paper.getBoundingClientRect().height;
      await animateElement(paper, reducedMotion ? [
        { width: `${flight.openWidth}px`, height: `${openedHeight}px`, transform: "rotate(0deg) scale(1)", opacity: 1, offset: 0 },
        { width: `${flight.foldWidth}px`, height: `${flight.foldHeight}px`, transform: "rotate(0deg) scale(.82)", opacity: 1, offset: 1 },
      ] : [
        { width: `${flight.openWidth}px`, height: `${openedHeight}px`, transform: "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)", offset: 0 },
        { width: `${flight.openWidth * .72}px`, height: `${openedHeight * .78}px`, transform: "perspective(700px) rotateX(-10deg) rotateY(25deg) scale(.98)", offset: .28 },
        { width: `${flight.openWidth * .48}px`, height: `${openedHeight * .48}px`, transform: "perspective(700px) rotateX(18deg) rotateY(-58deg) scale(.94)", offset: .58 },
        { width: `${flight.openWidth * .3}px`, height: `${flight.foldHeight * 1.3}px`, transform: "perspective(700px) rotateX(-28deg) rotateY(22deg) scale(.9)", offset: .82 },
        { width: `${flight.foldWidth}px`, height: `${flight.foldHeight}px`, transform: "perspective(700px) rotateX(64deg) rotateY(0deg) scale(.86)", opacity: 1, offset: 1 },
      ], reducedMotion ? 180 : 430, reducedMotion ? "ease-out" : "cubic-bezier(.35,.05,.7,.35)", true);
    }
    if (paper && flight && selectedIndex !== null && jarRef.current && sceneRef.current) {
      flushSync(() => setUnfolded(false));
      const returningNote = flightNoteRef.current;
      const sourcePaper = jarRef.current.querySelector<HTMLElement>(`[data-jar-note="${selectedIndex}"]`);
      if (returningNote && sourcePaper) {
        const sceneRect = sceneRef.current.getBoundingClientRect();
        const sourceRect = sourcePaper.getBoundingClientRect();
        const sourceStyle = getComputedStyle(sourcePaper);
        const sourceMatrix = new DOMMatrixReadOnly(sourceStyle.transform);
        const sourceRotation = Math.atan2(sourceMatrix.b, sourceMatrix.a) * 180 / Math.PI;
        const sourceScale = Math.hypot(sourceMatrix.a, sourceMatrix.b) * (parseFloat(sourceStyle.getPropertyValue("scale")) || 1);
        const sourceLeft = sourceRect.left - sceneRect.left + (sourceRect.width - flight.foldWidth) / 2;
        const sourceTop = sourceRect.top - sceneRect.top + (sourceRect.height - flight.foldHeight) / 2;
        const dx = sourceLeft - flight.left;
        const dy = sourceTop - flight.top;
        await animateFlightElement(returningNote, reducedMotion ? [
          { transform: "rotate(0deg) scale(.82)", opacity: 1, offset: 0 },
          { transform: `translate(${dx * .5}px, ${dy * .5}px) rotate(${sourceRotation * .5}deg) scale(${sourceScale * .9})`, opacity: .6, offset: .55 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${sourceRotation}deg) scale(${sourceScale})`, opacity: 0, offset: 1 },
        ] : [
          { transform: "perspective(700px) rotateX(64deg) rotateY(0deg) scale(.86)", opacity: 1, offset: 0 },
          { transform: `translate(${dx * .58}px, ${dy * .48 - 16}px) perspective(700px) rotateX(28deg) rotateY(-8deg) rotate(${sourceRotation - 5}deg) scale(${sourceScale * .9})`, opacity: .82, offset: .55 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${sourceRotation}deg) scale(${sourceScale})`, opacity: 0, offset: 1 },
        ], reducedMotion ? 150 : 330, reducedMotion ? "ease-out" : "cubic-bezier(.25,.65,.3,1)", () => {
          setFlight(null);
          setSelectedIndex(null);
          setEntry(null);
          setGame({ status: "unanswered" });
          setSecondGame({ status: "unanswered" });
          setSettledDoublePapers([]);
          setPromptVisible(false);
          setPhase("resetting");
        });
      }
    }
    if (flightNoteRef.current) {
      setUnfolded(false);
      setEntry(null);
      setGame({ status: "unanswered" });
      setSecondGame({ status: "unanswered" });
      setSettledDoublePapers([]);
      setPromptVisible(false);
      setFlight(null);
      setSelectedIndex(null);
      setPhase("resetting");
    }
    await waitForLayoutMotion([sceneRef.current, deskRef.current, jarRef.current]);
    await drawFromJar(true);
  }

  const sceneClass = [
    "jar-desk-scene",
    paperSpace ? "has-paper-space" : "",
    drawKind === "double" ? "has-double-notes" : "",
    phase === "anticipating" ? "is-anticipating" : "",
    phase === "shaking" ? "is-shaking" : "",
    phase === "selecting" ? "is-selecting" : "",
    phase === "escaping" ? "is-extracting" : "",
    phase === "flying" || phase === "landing" || phase === "unfolding" || phase === "revealed" || phase === "closing" || settledDoublePapers.length > 0 ? "has-open-note" : "",
  ].filter(Boolean).join(" ");
  const busy = phase !== "idle" && phase !== "revealed";
  function renderChaosContent(currentEntry: ChaosEntry | null = entry, currentGame: GameState = game, gameIndex = 0) {
    const entry = currentEntry;
    const game = currentGame;
    const paperCaseNumber = gameIndex === 1 ? secondCaseNumber : caseNumber;
    const setCurrentGame = gameIndex === 0 ? setGame : setSecondGame;
    const answerCurrent = (choice: string, status: "answered" | "completed" = "answered") => {
      if (phase !== "revealed" || sequenceLock.current) return;
      setCurrentGame({ status, choice, reaction: pick(CHAOS_REACTIONS) });
    };
    if (!entry || !promptVisible) return null;
    if (game.status === "wild-revealed") return <><p className="chaos-prompt">{game.prompt}</p><span className="chaos-reaction">{game.choice} selected.</span></>;
    if (entry.type === "blame") return <>
      <p className="chaos-prompt">{entry.prompt}</p>
      <div className="chaos-options" aria-label="Choose who is most likely">
        {["JANNA", "JOSH"].map((name) => <button key={name} className={`chaos-choice ${game.status === "answered" && game.choice === name ? "is-marked" : ""}`} type="button" disabled={phase !== "revealed" || sequenceLock.current || game.status !== "unanswered"} onClick={() => answerCurrent(name)}>{name}</button>)}
      </div>
      {game.status === "answered" && <span className="chaos-reaction">{game.reaction}</span>}
    </>;
    if (entry.type === "wouldRather") return <>
      <div className="chaos-options chaos-rather-options" aria-label="Choose one">
        {[entry.optionA, entry.optionB].map((option, i) => <div className="chaos-option-wrap" key={i}>{i === 1 && <span className="chaos-or">OR</span>}<button type="button" className={`chaos-choice chaos-option ${game.status === "answered" && game.choice === option ? "is-marked" : ""}`} disabled={phase !== "revealed" || sequenceLock.current || game.status !== "unanswered"} onClick={() => answerCurrent(option)}>{option}</button></div>)}
      </div>
      {game.status === "answered" && <span className="chaos-reaction">{game.reaction}</span>}
    </>;
    if (entry.type === "court") return <>
      <div className="chaos-case-number">CASE #{paperCaseNumber}</div>
      <small className="chaos-overline">THE CASE</small><p className="chaos-prompt">{entry.caseText}</p>
      <div className="chaos-options">{entry.verdicts.map((verdict) => <button key={verdict} type="button" className={`chaos-choice ${game.status === "answered" && game.choice === verdict ? "is-marked chaos-stamp" : ""}`} disabled={phase !== "revealed" || sequenceLock.current || game.status !== "unanswered"} onClick={() => answerCurrent(verdict)}>{verdict}</button>)}</div>
      {game.status === "answered" && <span className="chaos-reaction">{game.choice} · CASE CLOSED</span>}
    </>;
    if (entry.type === "battle") return <>
      <small className="chaos-overline">THE BATTLE</small><p className="chaos-prompt">{entry.battle}</p>
      <small className="chaos-overline">THE PRIZE</small><p className="chaos-prize">{entry.prize}</p>
      {game.status === "unanswered" && <button className="chaos-action" type="button" disabled={phase !== "revealed" || sequenceLock.current} onClick={() => { if (phase === "revealed" && !sequenceLock.current) setCurrentGame({ status: "choosing-winner" }); }}>WE HAVE A WINNER →</button>}
      {game.status === "choosing-winner" && <div className="chaos-options">{["JANNA", "JOSH"].map((name) => <button className="chaos-choice" type="button" key={name} disabled={phase !== "revealed" || sequenceLock.current} onClick={() => answerCurrent(name, "completed")}>{name} WON</button>)}</div>}
      {game.status === "completed" && <span className="chaos-reaction chaos-victory">✦ {game.choice} WON ✦</span>}
    </>;
    if (entry.type === "mystery") return game.status === "mission-revealed" || game.status === "completed" ? <>
      <p className="chaos-prompt">{entry.prompt}</p>
      {game.status !== "completed" && <button className="chaos-action" type="button" disabled={phase !== "revealed" || sequenceLock.current} onClick={() => { if (phase === "revealed" && !sequenceLock.current) setCurrentGame({ status: "completed", reaction: "mission accepted." }); }}>MISSION ACCEPTED →</button>}
      {game.status === "completed" && <span className="chaos-reaction">{game.reaction}</span>}
    </> : <>
      <span className="chaos-classified">CLASSIFIED</span>
      <button className="chaos-action" type="button" disabled={phase !== "revealed" || sequenceLock.current} onClick={() => { if (phase === "revealed" && !sequenceLock.current) setCurrentGame({ status: "mission-revealed" }); }}>REVEAL MISSION</button>
    </>;
    if (entry.type === "wildcard" && entry.mode === "choice") return game.status === "unanswered" ? <div className="chaos-options">{entry.choices.map((choice) => <button className="chaos-choice" type="button" key={choice.label} disabled={phase !== "revealed" || sequenceLock.current} onClick={() => { if (phase === "revealed" && !sequenceLock.current) setCurrentGame({ status: "wild-revealed", choice: choice.label, prompt: choice.prompt }); }}>{choice.label}</button>)}</div> : null;
    if (entry.type === "wildcard") return <><p className="chaos-prompt">{entry.prompt}</p>{game.status !== "completed" && <button className="chaos-action" type="button" onClick={() => answerCurrent("done", "completed")}>DONE →</button>}{game.status === "completed" && <span className="chaos-reaction">{game.reaction}</span>}</>;
    if (entry.type === "doNow") return <><p className="chaos-prompt">{entry.prompt}</p>{game.status !== "completed" && <button className="chaos-action" type="button" onClick={() => answerCurrent("done", "completed")}>DONE →</button>}{game.status === "completed" && <span className="chaos-reaction">{game.reaction}</span>}</>;
    if (entry.type === "emergency") return <><p className="chaos-prompt">{entry.prompt}</p>{game.status !== "completed" && <button className="chaos-action" type="button" onClick={() => answerCurrent("acknowledged", "completed")}>ACKNOWLEDGED →</button>}{game.status === "completed" && <span className="chaos-reaction">{game.reaction}</span>}</>;
    return null;
  }
  function renderDrawAnotherButton() {
    return <button className="jar-draw-another" type="button" onClick={() => void drawAnother()} disabled={phase !== "revealed" || !promptVisible || sequenceLock.current || specialActionBusy}>DRAW ANOTHER →</button>;
  }
  function renderNormalPaperContent(paperEntry: ChaosEntry | null, paperGame: GameState, gameIndex: number, showDrawAnother: boolean) {
    if (!paperEntry) return null;
    return <div className={`jar-revealed-copy chaos-content chaos-${paperEntry.type}`} data-chaos-type={paperEntry.type} aria-live="polite">
      <div className="chaos-category-heading"><small>{CHAOS_CATEGORY_META[paperEntry.type].label}</small><span aria-hidden="true">{CHAOS_CATEGORY_META[paperEntry.type].symbol}</span></div>
      {renderChaosContent(paperEntry, paperGame, gameIndex)}
      <span aria-hidden="true">J + J</span>
      {showDrawAnother && renderDrawAnotherButton()}
    </div>;
  }
  function renderJackpotContent() {
    if (!jackpotReward) return null;
    return <div className="jar-revealed-copy chaos-content jar-jackpot-copy" aria-live="polite">
      <div className="chaos-category-heading"><small>✦ JACKPOT ✦</small><span aria-hidden="true">✦</span></div>
      {promptVisible && <><h3>{jackpotReward.title}</h3><p>{jackpotReward.message}</p>
        {!jackpotClaimed ? <button className="jar-special-action" type="button" onClick={claimJackpot}>CLAIM JACKPOT ♡</button> : <><span className="jar-claim-stamp" onAnimationEnd={() => { sequenceLock.current = false; setSpecialActionBusy(false); }}>CLAIMED</span><span className="chaos-reaction">the universe cannot take this back.</span>{renderDrawAnotherButton()}</>}
      </>}
      <span aria-hidden="true">J + J</span>
    </div>;
  }
  function renderLoveLetterContent() {
    if (!letterOpen) return <div ref={resultCopyRef} className="jar-envelope-controls">
      <span className="jar-envelope-monogram">J + J</span>
      {promptVisible && <button className="jar-special-action" type="button" onClick={() => void openLoveLetter()}>OPEN ♡</button>}
    </div>;
    return <div ref={resultCopyRef} className="jar-revealed-copy chaos-content jar-letter-copy" aria-live="polite">
      <div className="chaos-category-heading"><small>A LITTLE NOTE FOR YOU</small><span aria-hidden="true">♡</span></div>
      {letterMessageVisible && <p>{letterMessage}</p>}
      {letterMessageVisible && !letterKept && <button className="jar-special-action" type="button" onClick={keepLoveLetter}>KEEP THIS ONE ♡</button>}
      {letterKept && <><span className="jar-kept-mark">kept ♡</span>{renderDrawAnotherButton()}</>}
      <span aria-hidden="true">J + J</span>
    </div>;
  }
  const flightStyle: CSSProperties | undefined = flight ? {
    left: `${flight.left}px`,
    top: `${flight.top}px`,
    width: `${unfolded ? flight.openWidth : flight.foldWidth}px`,
    height: unfolded ? "auto" : `${flight.foldHeight}px`,
    transform: `rotate(${flight.rotation}deg) scale(${flight.scale})`,
    "--jar-open-width": `${flight.openWidth}px`,
    "--jar-open-height": `${flight.openHeight}px`,
  } as CSSProperties : undefined;

  return (
    <section className="quiet-experience love-jar-experience">
      <SectionHeading
        eyebrow="A LITTLE BIT OF EVERYTHING"
        title="The Love Jar"
        description="Love, chaos, dares, and whatever happens when we shake it."
      />
      <div ref={sceneRef} className={sceneClass} aria-label="A keepsake jar filled with folded notes on a little writing desk">
        {specialAsideVisible && <div className="jar-special-aside" aria-live="polite">{specialAside}</div>}
        <div className="jar-desk-glow" aria-hidden="true" />
        <span className="jar-desk-star star-one" aria-hidden="true">✦</span>
        <span className="jar-desk-star star-two" aria-hidden="true">✧</span>
        <span className="jar-desk-star star-three" aria-hidden="true">·</span>
        <div className="jar-loose-note loose-note-one" aria-hidden="true"><span>♡</span></div>
        <div className="jar-loose-note loose-note-two" aria-hidden="true"><span>?</span></div>
        <div className="jar-pencil" aria-hidden="true"><i /></div>
        <div className="jar-ribbon" aria-hidden="true" />
        <div className="jar-flower" aria-hidden="true"><i /><span>✿</span></div>
        <div ref={deskRef} className="jar-desk-surface" aria-hidden="true">
          <div className="jar-desk-seam" />
        </div>
        <div ref={jarRef} className="love-jar" aria-hidden="true">
          <div ref={lidRef} className="jar-lid"><span /></div>
          <div className="jar-rim" />
          <div className="jar-glass-body">
            <div className="jar-notes">
              {slips.map((symbol, i) => (
                <i
                  className={`jar-note note-${i + 1} ${i === jackpotSlotIndex ? "jar-note-jackpot" : ""} ${i === loveLetterSlotIndex ? "jar-note-envelope" : ""} ${selectedIndex === i && phase === "selecting" ? "is-selected" : ""} ${flight && selectedIndex === i || settledDoublePapers.some((paper) => paper.slotIndex === i) ? "is-extracted" : ""}`}
                  data-jar-note={i}
                  data-chaos-type={paperTypeAt(i)}
                  key={i}
                >{symbol}</i>
              ))}
            </div>
            <div className="jar-glass-glint" />
          </div>
          <div className="jar-neck-band" />
          <div className="jar-label"><b>J + J</b><span>THE LOVE JAR</span></div>
          <div className="jar-base-glint" />
        </div>
        {settledDoublePapers.map((paper, index) => (
          <div
            ref={(node) => { doublePaperRefs.current[index] = node; }}
            key={`double-paper-${paper.slotIndex}`}
            className={`jar-flight-note jar-double-static ${paper.stage === "landing" || paper.stage === "unfolding" || paper.stage === "open" ? "is-landed" : ""} ${paper.stage === "unfolding" || paper.stage === "open" ? "is-opening" : ""} ${paper.stage === "open" ? "is-open" : ""} ${phase === "closing" ? "is-closing" : ""}`}
            data-chaos-type={paper.entry.type}
            style={{
              left: `${paper.stage === "open" || paper.stage === "unfolding" || paper.stage === "landing" ? paper.flight.targetLeft : paper.flight.left}px`,
              top: `${paper.stage === "open" || paper.stage === "unfolding" || paper.stage === "landing" ? paper.flight.targetTop : paper.flight.top}px`,
              width: `${paper.stage === "open" || paper.stage === "unfolding" ? paper.flight.openWidth : paper.flight.foldWidth}px`,
              height: paper.stage === "open" ? "auto" : paper.stage === "unfolding" ? `${paper.flight.openHeight}px` : `${paper.flight.foldHeight}px`,
              transform: `rotate(${paper.rotation}deg) scale(${paper.flight.scale})`, zIndex: 8,
              "--jar-open-width": `${paper.flight.openWidth}px`, "--jar-open-height": `${paper.flight.openHeight}px`,
            } as CSSProperties}
            aria-hidden={phase !== "revealed" && phase !== "closing"}
          >
            {paper.stage === "unfolding" && <><span className="jar-fold-crease fold-horizontal" aria-hidden="true" /><span className="jar-fold-crease fold-diagonal" aria-hidden="true" /></>}
            {paper.stage !== "open" && <span className="jar-fold-symbol" aria-hidden="true">{CHAOS_CATEGORY_META[paper.entry.type].symbol}</span>}
            {paper.stage === "open" && renderNormalPaperContent(paper.entry, game, 0, false)}
          </div>
        ))}
        {flight && (
          <div
            ref={flightNoteRef}
            className={`jar-flight-note ${phase === "escaping" ? "is-lifting" : ""} ${phase === "landing" || phase === "unfolding" || phase === "revealed" || phase === "closing" ? "is-landed" : ""} ${drawKind !== "loveLetter" && (phase === "unfolding" || phase === "revealed" || unfolded) ? "is-opening" : ""} ${unfolded ? "is-open" : ""} ${drawKind === "loveLetter" && !unfolded ? "is-letter-envelope" : ""} ${drawKind === "loveLetter" && letterOpen && !unfolded && phase !== "closing" ? "is-letter-opening" : ""} ${phase === "closing" ? "is-closing" : ""} ${drawKind === "jackpot" ? "is-jackpot-paper" : ""}`}
            data-chaos-type={drawKind === "jackpot" ? "jackpot" : drawKind === "loveLetter" ? "loveLetter" : entry?.type}
            style={flightStyle}
            aria-hidden={phase !== "revealed" && phase !== "closing"}
          >
            {phase === "unfolding" && <span className="jar-fold-crease fold-horizontal" aria-hidden="true" />}
            {phase === "unfolding" && <span className="jar-fold-crease fold-diagonal" aria-hidden="true" />}
            {!unfolded && <span className="jar-fold-symbol" aria-hidden="true">{slips[selectedIndex ?? 0]}</span>}
            {drawKind === "loveLetter" && letterOpen && !unfolded && phase !== "closing" && <span className="jar-letter-slide" aria-hidden="true">J + J</span>}
            {(phase === "revealed" || phase === "closing") && drawKind === "loveLetter" && (!letterOpen || unfolded) && renderLoveLetterContent()}
            {(phase === "revealed" || phase === "closing") && drawKind === "jackpot" && <div ref={resultCopyRef}>{renderJackpotContent()}</div>}
            {(phase === "revealed" || phase === "closing") && drawKind !== "jackpot" && drawKind !== "loveLetter" && entry && (
              <div ref={resultCopyRef}>
                {renderNormalPaperContent(entry, drawKind === "double" ? secondGame : game, drawKind === "double" ? 1 : 0, true)}
              </div>
            )}
          </div>
        )}
        {drawKind === "jackpot" && flight && (phase === "landing" || phase === "unfolding" || phase === "revealed") && <div className="jar-jackpot-sparks" style={{ left: `${flight.left + flight.openWidth / 2}px`, top: `${flight.top + flight.openHeight / 2}px` }} aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i><i>✧</i></div>}
      </div>
      {phase !== "revealed" && phase !== "closing" && (
        <div className="jar-invitation">
          <button
            className="jar-shake-button"
            onClick={() => void drawFromJar()}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? "THE PAPER IS IN MOTION..." : "SHAKE THE JAR"}
          </button>
          <small>no telling what comes out.</small>
        </div>
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
type FutureObjectKind = "capsule" | "map" | "research";
function FutureObjectArt({ kind }: { kind: FutureObjectKind }) {
  if (kind === "capsule") return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="91" cy="111" rx="55" ry="9" fill="#080914" opacity=".35" />
      <path d="M42 53Q45 43 58 43H122Q135 43 138 54L132 101Q90 114 48 101Z" fill="#806577" stroke="#d3b29d" strokeWidth="3" />
      <path d="M39 48Q40 36 53 34L122 37Q137 38 140 49L136 62Q91 69 43 60Z" fill="#b18485" stroke="#ead0b7" strokeWidth="3" />
      <path d="M58 47L61 99M119 49L116 102" stroke="#dfc19f" strokeWidth="3" opacity=".75" />
      <path d="M88 39Q78 25 68 34Q69 45 89 51Q109 41 105 30Q97 24 88 39Z" fill="#d89caf" stroke="#f0cfca" strokeWidth="2" />
      <path d="M71 72L108 75L105 92L73 89Z" fill="#f1e3cc" stroke="#d2b79f" strokeWidth="2" />
      <path d="M78 78L98 80M78 83L93 85" stroke="#9a7688" strokeWidth="2" strokeLinecap="round" />
      <path d="M128 69L131 75L138 77L132 80L130 87L127 81L121 79L127 76Z" fill="#f2dcae" />
      <path d="M49 29C45 24 39 29 49 36C59 29 53 24 49 29Z" fill="#efc2cf" />
    </svg>
  );
  if (kind === "map") return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="89" cy="111" rx="61" ry="8" fill="#080914" opacity=".28" />
      <path d="M29 34L68 23L108 36L148 25V94L109 107L69 94L30 105Z" fill="#e7d9c3" stroke="#c7a994" strokeWidth="3" strokeLinejoin="round" />
      <path d="M68 23L69 94M108 36L109 107" fill="none" stroke="#b7948f" strokeWidth="2" />
      <path d="M39 48Q56 40 76 52T112 62T139 46" fill="none" stroke="#bd7f91" strokeWidth="3" strokeDasharray="4 5" />
      <path d="M47 43C42 34 31 40 47 54C63 40 52 34 47 43Z" fill="#cb8097" />
      <path d="M120 56C115 47 104 53 120 67C136 53 125 47 120 56Z" fill="#cb8097" />
      <circle cx="84" cy="77" r="8" fill="#d8b46f" stroke="#fff0d7" strokeWidth="2" />
      <path d="M83 76L102 50L107 65L94 68L84 81Z" fill="#82708e" stroke="#5f506c" strokeWidth="1.5" />
      <path d="M34 95L43 83L51 97ZM130 35L135 28L141 37Z" fill="#f4dfb7" stroke="#b89a85" strokeWidth="1.5" />
      <path d="M145 78L148 84L155 86L149 90L147 96L144 90L138 88L144 85Z" fill="#d4b477" />
    </svg>
  );
  return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="89" cy="112" rx="53" ry="8" fill="#080914" opacity=".3" />
      <path d="M53 24Q53 17 61 17H120Q128 17 128 25V102H53Z" fill="#806c7d" stroke="#d6c4c4" strokeWidth="3" />
      <path d="M61 31H120V102H61Z" fill="#efe3d0" stroke="#b89da6" strokeWidth="2" />
      <path d="M82 18V29M99 18V29" stroke="#d5b483" strokeWidth="3" />
      <path d="M70 78L83 68L93 71L108 48" fill="none" stroke="#a34861" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M103 49L109 45L111 53" fill="none" stroke="#a34861" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 83H112M70 61H112M70 39H112" stroke="#c3b1ae" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M74 36C70 31 64 36 74 43C84 36 78 31 74 36Z" fill="#cc879d" />
      <path d="M46 47L49 53L56 55L50 59L48 66L45 60L39 58L45 54Z" fill="#f0dbb0" />
      <path d="M129 82L132 88L139 90L133 94L131 100L128 94L122 92L128 89Z" fill="#f0dbb0" />
      <path d="M128 39L144 45L141 76L128 72Z" fill="#d6a7a7" stroke="#eed4c8" strokeWidth="2" />
      <path d="M132 49L139 52M131 57L138 60" stroke="#7d526c" strokeWidth="2" />
    </svg>
  );
}
function Future({ navigate }: Navigation) {
  type BucketDream = {
    id: string;
    text: string;
    author: "Janna" | "Josh" | null;
    completed: boolean;
    completedAt: string | null;
  };
  const storageKey = "ourverse-future-bucket-list-v1";
  const starters: BucketDream[] = [
    "Live together",
    "Get married",
    "Go to a concert together",
    "Travel together",
    "Adopt a pet",
    "Go on a road trip together",
    "Celebrate anniversary",
    "Meet each other's parents",
  ].map((text, index) => ({ id: `starter-${index + 1}`, text, author: null, completed: false, completedAt: null }));
  const [bucketDreams, setBucketDreams] = useState<BucketDream[]>(starters);
  const [storageReady, setStorageReady] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [author, setAuthor] = useState<"Janna" | "Josh">("Janna");

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved)) {
        const seenIds = new Set<string>();
        const valid = saved.filter((dream): dream is BucketDream => {
          const isValid = !!dream && typeof dream === "object" &&
            typeof dream.id === "string" && typeof dream.text === "string" &&
            dream.text.trim().length > 0 && dream.text.length <= 120 &&
            (dream.author === null || dream.author === "Janna" || dream.author === "Josh") &&
            typeof dream.completed === "boolean" &&
            (dream.completedAt === null || (typeof dream.completedAt === "string" && Number.isFinite(Date.parse(dream.completedAt))));
          if (!isValid || seenIds.has(dream.id)) return false;
          seenIds.add(dream.id);
          return true;
        });
        if (valid.length || saved.length === 0) setBucketDreams(valid);
      }
    } catch {
      // A malformed or unavailable saved value falls back to the starter list.
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(storageKey, JSON.stringify(bucketDreams)); } catch {}
  }, [bucketDreams, storageReady]);

  const totalSpreads = Math.max(1, Math.ceil(bucketDreams.length / 10));
  const safeSpreadIndex = Math.min(spreadIndex, totalSpreads - 1);
  const spreadDreams = bucketDreams.slice(safeSpreadIndex * 10, safeSpreadIndex * 10 + 10);
  const pages = [spreadDreams.slice(0, 5), spreadDreams.slice(5, 10)];
  const toggleDream = (dream: BucketDream) => {
    if (dream.completed && !window.confirm("Mark this dream as not completed?")) return;
    setBucketDreams((current) => current.map((item) => item.id === dream.id
      ? { ...item, completed: !item.completed, completedAt: item.completed ? null : new Date().toISOString() }
      : item));
  };
  const removeDream = (dream: BucketDream) => {
    if (!window.confirm("Remove this dream from our bucket list?")) return;
    const remaining = bucketDreams.filter((item) => item.id !== dream.id);
    setBucketDreams(remaining);
    setSpreadIndex((index) => Math.min(index, Math.max(0, Math.ceil(remaining.length / 10) - 1)));
  };
  const addDream = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newText.trim();
    if (!text || text.length > 120) return;
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `dream-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const next = [...bucketDreams, { id, text, author, completed: false, completedAt: null }];
    setBucketDreams(next);
    setSpreadIndex(Math.floor((next.length - 1) / 10));
    setNewText("");
    setAddOpen(false);
  };
  const renderDream = (dream: BucketDream) => (
    <div className={`notebook-entry${dream.completed ? " notebook-entry-complete" : ""}`} key={dream.id}>
      <button
        type="button"
        className="notebook-checkbox"
        role="checkbox"
        aria-checked={dream.completed}
        aria-label={`${dream.completed ? "Mark incomplete" : "Mark complete"}: ${dream.text}`}
        onClick={() => toggleDream(dream)}
      >{dream.completed ? <span aria-hidden="true">✓</span> : null}</button>
      <span className="notebook-entry-copy">
        <span className="notebook-entry-text">{dream.text}</span>
        {dream.author && <small className="notebook-entry-author">— {dream.author}</small>}
        {dream.completed && dream.completedAt && <small className="notebook-entry-date">we did it · {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dream.completedAt))}</small>}
      </span>
      <button type="button" className="notebook-delete" aria-label={`Remove ${dream.text}`} onClick={() => removeDream(dream)}>×</button>
    </div>
  );

  return (
    <>
      <SectionHeading
        eyebrow="OUR BUCKET LIST"
        title="Someday, with you."
        description="little promises, big dreams, and everything we want to do someday."
      />
      <section className="future-notebook" aria-label="Janna and Josh's shared bucket-list notebook">
        <span className="notebook-tape" aria-hidden="true" />
        <span className="notebook-paperclip" aria-hidden="true" />
        <div className="notebook-spread notebook-page-arrive" key={safeSpreadIndex}>
          <section className="notebook-page notebook-page-left" aria-label="Notebook left page">
            <div className="notebook-page-heading">
              <span>for the someday version of us</span>
              <small>{String(safeSpreadIndex * 2 + 1).padStart(2, "0")}</small>
            </div>
            <div className={`notebook-entries${pages[0].length >= 4 ? " notebook-entries-full" : ""}`}>
              {pages[0].map(renderDream)}
            </div>
            <div className="notebook-couple-doodle" aria-label="Janna and Josh">
              <svg viewBox="0 0 80 70" aria-hidden="true"><path d="M40 60C31 51 8 38 11 22C14 7 32 10 40 24C49 9 68 8 70 23C72 39 51 53 40 60Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 20Q24 15 29 20M52 52Q59 47 62 41" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              <span>J + J</span>
            </div>
            <span className="notebook-margin-note">keep this one ♡</span>
          </section>
          <section className="notebook-page notebook-page-right" aria-label="Notebook right page">
            <div className="notebook-page-heading">
              <span>little plans, just ours</span>
              <small>{String(safeSpreadIndex * 2 + 2).padStart(2, "0")}</small>
            </div>
            <div className={`notebook-entries${pages[1].length >= 4 ? " notebook-entries-full" : ""}`}>
              {pages[1].map(renderDream)}
            </div>
            <div className="notebook-flower" aria-hidden="true">
              <svg viewBox="0 0 70 80"><path d="M35 42Q28 58 34 75M34 63Q22 54 15 60Q22 71 34 67M35 57Q47 47 55 53Q49 64 35 62" fill="none" stroke="#71806c" strokeWidth="2" strokeLinecap="round"/><path d="M35 37C27 31 29 23 35 24C41 23 43 31 35 37ZM35 37C28 42 20 39 22 33C23 27 31 29 35 37ZM35 37C42 29 50 27 51 33C53 39 44 42 35 37Z" fill="#d78f9f" stroke="#bd7588" strokeWidth="1.5"/><circle cx="35" cy="36" r="4" fill="#e3c486"/></svg>
            </div>
            <div className="notebook-counts"><span>dreams written · {bucketDreams.length}</span><span>dreams lived · {bucketDreams.filter((dream) => dream.completed).length}</span></div>
          </section>
          <span className="notebook-spine" aria-hidden="true" />
        </div>
        <div className="notebook-lower-tools">
          <button type="button" className="notebook-add-mock" aria-expanded={addOpen} onClick={() => setAddOpen((open) => !open)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5L5.5 14L16.7 2.8Q18 1.5 19.3 2.8L21.2 4.7Q22.5 6 21.2 7.3L10 18.5L4 18.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14.8 4.8L19.2 9.2M4 18.5L9 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>+ write a new dream</button>
          <nav className="notebook-pagination" aria-label="Notebook pages">
            <button type="button" aria-label="Previous spread" disabled={safeSpreadIndex === 0} onClick={() => setSpreadIndex((index) => Math.max(0, index - 1))}>‹ previous</button>
            <small>{String(safeSpreadIndex + 1).padStart(2, "0")} / {String(totalSpreads).padStart(2, "0")}</small>
            <button type="button" aria-label="Next spread" disabled={safeSpreadIndex >= totalSpreads - 1} onClick={() => setSpreadIndex((index) => Math.min(totalSpreads - 1, index + 1))}>next ›</button>
          </nav>
        </div>
        {addOpen && <form className="notebook-write-form" onSubmit={addDream}>
          <label htmlFor="future-dream-text">what should we do someday?</label>
          <textarea id="future-dream-text" value={newText} onChange={(event) => setNewText(event.target.value)} maxLength={120} required rows={2} />
          <fieldset>
            <legend>written by:</legend>
            {(["Janna", "Josh"] as const).map((name) => <label key={name}><input type="radio" name="dream-author" value={name} checked={author === name} onChange={() => setAuthor(name)} />{name}</label>)}
          </fieldset>
          <span className="notebook-form-hint">{newText.trim().length}/120</span>
          <button type="submit" disabled={!newText.trim()}>add to our list ♡</button>
        </form>}
      </section>
      <div className="world-links future-destinations">
        {[
          ["capsule", "Our time capsule"],
          ["travel", "Our adventure map"],
          ["generator", "An extremely scientific future"],
        ].map(([id, label]) => (
          <button className="future-destination" key={id} onClick={() => navigate(id)} aria-label={label}>
            <span className="future-destination-art">
              <FutureObjectArt kind={id === "capsule" ? "capsule" : id === "travel" ? "map" : "research"} />
            </span>
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
  const opensAt = Date.parse("2036-09-27T00:00:00+08:00");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = (() => {
    if (now === null || now >= opensAt) return [0, 0, 0, 0, 0];
    const zoneOffset = 8 * 60 * 60 * 1000;
    const localNow = new Date(now + zoneOffset);
    const localTarget = new Date(opensAt + zoneOffset);
    let years = localTarget.getUTCFullYear() - localNow.getUTCFullYear();
    let anniversary = new Date(localNow);
    anniversary.setUTCFullYear(localNow.getUTCFullYear() + years);
    if (anniversary.getTime() > localTarget.getTime()) {
      years -= 1;
      anniversary = new Date(localNow);
      anniversary.setUTCFullYear(localNow.getUTCFullYear() + years);
    }
    let remaining = Math.max(0, localTarget.getTime() - anniversary.getTime());
    const days = Math.floor(remaining / 86_400_000);
    remaining %= 86_400_000;
    const hours = Math.floor(remaining / 3_600_000);
    remaining %= 3_600_000;
    const minutes = Math.floor(remaining / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    return [years, days, hours, minutes, seconds];
  })();

  return (
    <section className="quiet-experience capsule-experience">
      <SectionHeading
        eyebrow="WORDS WAITING FOR FUTURE US"
        title="Our Time Capsule"
        description="Written September 27, 2026 · Opens September 27, 2036"
      />
      <p className="capsule-introduction">
        <strong>A little piece of us, sealed away for ten years.</strong>
        <span>Inside are words we wrote to our future selves, photographs of who we were, and a voice from a version of us that will someday feel far away. This capsule stays closed until 2036—waiting quietly to remind us what our love, our lives, and our dreams looked like ten years ago.</span>
      </p>

      <div className="capsule-story">
        <div className="memory-capsule-art" role="img" aria-label="A sealed keepsake box with a letter, two Polaroid photographs, and a small cassette tucked inside, marked 2026 to 2036">
          <svg viewBox="0 0 460 300" aria-hidden="true">
            <defs>
              <linearGradient id="capsule-box" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b99a83"/><stop offset=".48" stopColor="#8c6c72"/><stop offset="1" stopColor="#5b4c66"/></linearGradient>
              <linearGradient id="capsule-lid" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d5b89c"/><stop offset="1" stopColor="#92777b"/></linearGradient>
              <linearGradient id="capsule-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d99cad"/><stop offset="1" stopColor="#a86f89"/></linearGradient>
              <filter id="capsule-shadow" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
            </defs>
            <ellipse cx="232" cy="264" rx="148" ry="17" fill="#050713" opacity=".42" filter="url(#capsule-shadow)"/>
            <g className="capsule-memory-photos">
              <g transform="rotate(-13 155 92)"><rect x="108" y="35" width="78" height="102" rx="3" fill="#f0e4d6" stroke="#fff3e3" strokeWidth="2"/><rect x="116" y="43" width="62" height="66" fill="#93849a"/><path d="M119 99L136 78L147 88L159 66L175 99Z" fill="#d5b4b4"/><path d="M138 63c-5-8-14-2 0 9c14-11 5-17 0-9Z" fill="#f4d9d8"/><path d="M119 119H160" stroke="#bd9b96" strokeWidth="2" strokeLinecap="round"/></g>
              <g transform="rotate(10 286 79)"><rect x="255" y="23" width="70" height="91" rx="3" fill="#f3e9d9" stroke="#fff4e7" strokeWidth="2"/><rect x="262" y="30" width="56" height="58" fill="#798399"/><circle cx="282" cy="53" r="10" fill="#d9b0b2"/><path d="M264 83L279 67L290 77L302 59L316 83Z" fill="#d9c5ae"/><path d="M268 99H302" stroke="#b79891" strokeWidth="2" strokeLinecap="round"/></g>
            </g>
            <g className="capsule-memory-letter" transform="rotate(4 223 94)"><path d="M185 55L260 61L254 143L180 137Z" fill="#f5ebd9" stroke="#d3bba4" strokeWidth="2"/><path d="M185 55L221 94L260 61M221 94L180 137M221 94L254 143" fill="none" stroke="#d2b39d" strokeWidth="1.5"/><path d="M198 111L237 114M198 119L230 122" stroke="#a47c8d" strokeWidth="2" strokeLinecap="round" opacity=".65"/><path d="M213 77c-5-8-14-2 0 9c14-11 5-17 0-9Z" fill="#c9879b"/></g>
            <g className="capsule-memory-tape" transform="rotate(-6 314 132)"><rect x="278" y="105" width="82" height="54" rx="7" fill="#6f5365" stroke="#d5b58f" strokeWidth="2"/><rect x="287" y="113" width="64" height="37" rx="4" fill="#d8c7b2"/><circle cx="300" cy="131" r="9" fill="#6f5365" stroke="#b79091" strokeWidth="2"/><circle cx="338" cy="131" r="9" fill="#6f5365" stroke="#b79091" strokeWidth="2"/><path d="M309 130L315 136L322 126L329 132" fill="none" stroke="#a87086" strokeWidth="2" strokeLinecap="round"/><text x="319" y="110" textAnchor="middle" fill="#f1e2d0" fontSize="7" letterSpacing="1">VOICE · 2026</text></g>
            <path d="M92 132Q99 116 121 116H342Q365 116 375 136L361 231Q235 254 106 231Z" fill="url(#capsule-box)" stroke="#e0c9a8" strokeWidth="3"/>
            <path d="M99 128Q101 105 124 102L345 111Q366 112 372 133L366 153Q235 169 96 148Z" fill="url(#capsule-lid)" stroke="#f0d9b7" strokeWidth="3"/>
            <path d="M119 121Q233 138 354 128" fill="none" stroke="#f1dec2" strokeWidth="2" opacity=".6"/>
            <path d="M218 111L230 115L225 241L211 238Z" fill="url(#capsule-ribbon)" opacity=".96"/>
            <path d="M211 116Q191 94 180 108Q179 124 215 132Q248 119 239 103Q226 93 211 116Z" fill="url(#capsule-ribbon)" stroke="#e9bdc4" strokeWidth="2"/>
            <path d="M219 127Q246 126 250 143L229 157L218 139Z" fill="#b97891" stroke="#e8bfc6" strokeWidth="1.5"/>
            <circle cx="219" cy="147" r="14" fill="#d8b98d" stroke="#f0dfc2" strokeWidth="2"/>
            <path d="M219 141c-4-6-10-1 0 6c10-7 4-12 0-6Z" fill="#8b5d76"/>
            <path d="M126 176L188 181M250 184L337 178" stroke="#ebd8c3" strokeWidth="1.5" opacity=".55"/>
            <text x="232" y="207" textAnchor="middle" fill="#f1e3cf" fontSize="12" letterSpacing="3" fontFamily="Georgia,serif">J + J</text>
            <text x="232" y="224" textAnchor="middle" fill="#ead4bd" fontSize="8" letterSpacing="2" fontFamily="Georgia,serif">2026  ·  2036</text>
            <path d="M78 71L82 79L91 81L83 85L81 94L77 86L69 83L77 80Z" fill="#e4d2b0" opacity=".8"/>
            <path d="M383 91L386 97L393 99L387 102L385 109L382 103L376 101L382 98Z" fill="#c8b3d5" opacity=".75"/>
          </svg>
          <span className="capsule-seal-label">SEALED · 2026</span>
        </div>

        <div className="capsule-contents" aria-label="What is waiting inside">
          <p>INSIDE, WAITING FOR US</p>
          <div><span className="capsule-content-mark capsule-letter-mark" aria-hidden="true" /><span>Letter to our future selves</span></div>
          <div><span className="capsule-content-mark capsule-photo-mark" aria-hidden="true" /><span>Photographs of us</span></div>
          <div><span className="capsule-content-mark capsule-voice-mark" aria-hidden="true" /> <span>A voice from 2026</span></div>
          <small>OPEN IN 2036</small>
        </div>
      </div>

      <div className="capsule-countdown-wrap" aria-live="off">
        <p>Until we meet these versions of ourselves again.</p>
        <div className="capsule-countdown" aria-label="Time remaining until September 27, 2036">
          {["YEARS", "DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, index) => (
            <div className="capsule-countdown-unit" key={label}>
              <strong>{now === null ? "—" : String(countdown[index]).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <small>Some memories are worth waiting for.</small>
      </div>
    </section>
  );
}
function Adventure() {
  return <AdventureMap />;
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
  type Finding = { category: string; finding: string };
  type Report = {
    reportNumber: string;
    house: string;
    location: string;
    kids: { count: number; detail: string };
    pets: string;
    cooking: string;
    cleaning: string;
    paying: string;
    bankAccount: { amountUsd: number; detail: string };
    bedTerritory: { jannaPercent: number; joshPercent: number; detail: string };
    kisses: { amount: string; detail: string };
    bonusFindings: Finding[];
    reaction: { janna: string; josh: string };
  };
  const [result, setResult] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const statusLines = [
    "calculating domestic chaos...",
    "consulting highly reputable stars...",
    "estimating blanket ownership...",
    "checking future bank statements...",
    "counting hypothetical children...",
    "running kissing simulations...",
    "peer review rejected. continuing anyway...",
    "checking fridge politics...",
  ];

  useEffect(() => {
    if (!loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setStatusIndex((index) => (index + 1) % statusLines.length),
      850,
    );
    return () => window.clearInterval(timer);
  }, [loading, statusLines.length]);

  async function consult() {
    if (loading) return;
    setLoading(true);
    setError(false);
    setStatusIndex(Math.floor(Math.random() * statusLines.length));
    const startedAt = Date.now();
    try {
      const response = await fetch("/api/future-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recent }),
      });
      const data = await response.json();
      if (!response.ok || !data.report) throw new Error("Report unavailable");
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 2400 - (Date.now() - startedAt))),
      );
      setResult(data.report as Report);
      setRecent((items) =>
        [
          `${data.report.house}; ${data.report.location}; ${data.report.bonusFindings?.map((item: Finding) => item.category).join(", ")}`,
          ...items,
        ].slice(0, 4),
      );
    } catch {
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 1700 - (Date.now() - startedAt))),
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  const currency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="quiet-experience future-generator">
      <SectionHeading
        eyebrow="PLAYFUL NONSENSE. ABSOLUTELY NOT A PREDICTION."
        title="Our extremely scientific future"
        description="The universe has run the numbers. The methodology is under investigation."
      />
      <div className="future-o-matic" aria-label="Future-O-Matic celestial research machine">
        <div className="future-o-matic-dial dial-left"><span>J + J</span><i>∞</i></div>
        <div className="future-o-matic-core">
          <span className="machine-kicker">OURVERSE FUTURE RESEARCH DIVISION</span>
          <svg viewBox="0 0 260 150" role="img" aria-label="A whimsical celestial prediction machine">
            <path d="M45 117Q36 99 48 79L58 53Q64 35 83 35H177Q196 35 202 53L212 79Q224 99 215 117Z" fill="#332746" stroke="#d7bf91" strokeWidth="2" />
            <path d="M70 53Q130 24 190 53M61 105Q130 128 199 105" fill="none" stroke="#bc91b5" strokeWidth="1.5" strokeDasharray="3 6" />
            <circle cx="130" cy="78" r="31" fill="#17182d" stroke="#e3c994" strokeWidth="2" />
            <circle cx="130" cy="78" r="22" fill="#716081" opacity=".7" />
            <path d="M130 58C122 47 110 61 130 78C150 61 138 47 130 58Z" fill="#e8b9cb" />
            <path d="M130 89V99M117 106H143" stroke="#e8d7bb" strokeWidth="2" strokeLinecap="round" />
            <circle cx="74" cy="77" r="5" fill="#d8a9be" /><circle cx="186" cy="77" r="5" fill="#d8a9be" />
            <path d="M73 78L63 86M187 78L197 86" stroke="#dfc992" strokeWidth="2" />
            <path d="M31 37L35 47L45 51L35 55L31 65L27 55L17 51L27 47Z" fill="#e8d8b6" />
            <path d="M225 37L228 45L236 48L228 51L225 59L222 51L214 48L222 45Z" fill="#c7afd5" />
            <text x="130" y="20" textAnchor="middle" fill="#e7d6df" fontSize="10" letterSpacing="3">FUTURE-O-MATIC</text>
          </svg>
          <span className="machine-equation">J + J = ??? <b>♡² × ∞</b></span>
        </div>
        <div className="future-o-matic-dial dial-right"><span>DATA</span><i>12%</i></div>
      </div>

      <div className="generator-action-zone">
        <button className="primary-button" disabled={loading} onClick={consult}>
          {loading ? "CONSULTING..." : result || error ? "CONSULT AGAIN" : "CONSULT THE UNIVERSE"}
        </button>
        {loading && <p className="generator-calculation" aria-live="polite">{statusLines[statusIndex]}</p>}
        {!loading && (result || error) && <p className="generator-footnote">The universe reserves the right to contradict itself.</p>}
      </div>

      {error && !loading && (
        <div className="generator-error" role="status">
          <h2>Scientific equipment malfunction.</h2>
          <p>The universe appears to be withholding its findings. Try consulting it again.</p>
        </div>
      )}

      {result && !loading && !error && (
        <article className="future-research-report" aria-live="polite">
          <header className="research-report-header">
            <div><span>OURVERSE FUTURE RESEARCH DIVISION</span><span>CASE FILE: J + J</span></div>
            <h2>Future Report <b>#{result.reportNumber}</b></h2>
            <p>After extensive calculations, questionable methodology, and absolutely no peer review, the universe has reached the following conclusions.</p>
          </header>
          <div className="report-science-scribble" aria-hidden="true"><span>J + J = ∞</span><span>compatibility coefficient: suspicious</span><span>peer review: rejected</span></div>
          <div className="report-findings">
            <section className="finding-wide"><h3>Our House</h3><p>{result.house}</p></section>
            <section className="finding-wide"><h3>Where We End Up</h3><p>{result.location}</p></section>
            <section className="finding-highlight"><h3>How Many Kids</h3><strong>{result.kids.count}</strong><p>{result.kids.detail}</p></section>
            <section><h3>Pet Situation</h3><p>{result.pets}</p></section>
            <section><h3>Who Cooks</h3><p>{result.cooking}</p></section>
            <section><h3>Who Cleans</h3><p>{result.cleaning}</p></section>
            <section><h3>Who Pays</h3><p>{result.paying}</p></section>
            <section className="finding-highlight"><h3>Our Bank Account</h3><strong>{currency(result.bankAccount.amountUsd)}</strong><p>{result.bankAccount.detail}</p><small>fictional USD. scientifically unverified.</small></section>
            <section className="finding-highlight"><h3>Bed Territory</h3><strong>{result.bedTerritory.jannaPercent}% / {result.bedTerritory.joshPercent}%</strong><p>Janna · Josh</p><p>{result.bedTerritory.detail}</p></section>
            <section className="finding-highlight"><h3>Kisses</h3><strong>{result.kisses.amount}</strong><p>{result.kisses.detail}</p></section>
            {result.bonusFindings.map((item, index) => <section className="bonus-finding" key={`${item.category}-${index}`}><span>Bonus Finding {index + 1}</span><h3>{item.category}</h3><p>{item.finding}</p></section>)}
          </div>
          <footer className="report-reaction"><span>Subject reactions · inconclusive</span><p>The subjects were consulted. Their testimony is now attached to the visual record.</p></footer>
          <div className="report-stamp" aria-hidden="true">QUESTIONABLE<br />SCIENCE</div>
        </article>
      )}

      <div className={`generator-couple-space ${result || error ? "has-report" : ""}`}>
        <Couple
          scene="sit"
          dialogueJanna={!loading && !error ? result?.reaction.janna : undefined}
          dialogueJosh={!loading && !error ? result?.reaction.josh : undefined}
        />
      </div>
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
