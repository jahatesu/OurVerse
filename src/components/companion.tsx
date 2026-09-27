"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Cookie, Smile, Sparkles, Send, Wifi, BatteryFull } from "lucide-react";
import { companionResponses } from "@/data/messages";
import { pick } from "@/lib/utils";
import { useUniverse } from "./provider";
import { SectionHeading } from "./ui";
import { Couple, type CoupleScene } from "./characters";
export function Companion({ compact = false }: { compact?: boolean }) {
  const { progress, update, unlock, discover } = useUniverse();
  const [reaction, setReaction] = useState("");
  const [bubble, setBubble] = useState("Waiting for my favorite human…");
  const [animation, setAnimation] = useState(0);
  function interact(action: keyof typeof companionResponses) {
    setReaction(action);
    setAnimation((n) => n + 1);
    setBubble(pick(companionResponses[action]));
    discover("companion");
    if (action === "Annoy") {
      update((p) => ({ ...p, pokes: p.pokes + 1 }));
      setBubble(
        progress.pokes >= 4
          ? "STOP POKING ME >:("
          : progress.pokes >= 2
            ? "Josh. I can chase you, you know."
            : "JOSHHHH",
      );
      if (progress.pokes >= 4) unlock("professional-annoyer");
    }
    update((p) => ({
      ...p,
      companion: {
        happiness: Math.min(
          100,
          Math.max(0, p.companion.happiness + (action === "Annoy" ? -5 : 7)),
        ),
        love: Math.min(100, p.companion.love + 3),
        miss: Math.max(0, p.companion.miss - (action === "Hug" ? 8 : 2)),
      },
    }));
    if (action === "Hug") unlock("hug");
    if (action === "Annoy") unlock("annoy");
  }
  return (
    <section className={`companion-card ${compact ? "compact" : ""}`}>
      <div className="companion-header">
        <h2>
          Mini Janna <span>✿</span>
        </h2>
        <span className="online-pill">
          <i /> here for you
        </span>
      </div>
      <div className="avatar-stage">
        <Couple
          key={animation}
          scene={
            reaction === "Kiss"
              ? "kiss"
              : reaction === "Hug"
                ? "hug"
                : reaction === "Annoy"
                  ? "poke"
                  : reaction === "Feed"
                    ? "celebrate"
                    : "idle"
          }
        />
      </div>
      <p className="companion-bubble" aria-live="polite">
        {bubble}
      </p>
      <div className="stat-bars">
        {(
          [
            ["Happiness", progress.companion.happiness],
            ["Love", progress.companion.love],
            ["Miss Josh", progress.companion.miss],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <div
              role="meter"
              aria-label={label}
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${value}%` }} />
            </div>
            <small>{value}%</small>
          </div>
        ))}
      </div>
      <div className="companion-actions">
        {(
          [
            ["Hug", Heart],
            ["Kiss", Sparkles],
            ["Feed", Cookie],
            ["Annoy", Smile],
          ] as const
        ).map(([action, Icon]) => (
          <button key={action} onClick={() => interact(action)}>
            <Icon size={15} />
            <span>{action}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
export function CompanionRoom() {
  const [scene, setScene] = useState<CoupleScene>("idle");
  const chatLog = useRef<HTMLDivElement>(null);
  const { progress, update, unlock } = useUniverse();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{ from: "josh" | "janna"; text: string; time: Date }[]>([
    {
      from: "janna",
      text: "hello Josh, you made it ♡",
      time: new Date(),
    },
  ]);
  useEffect(() => {
    if (chatLog.current)
      chatLog.current.scrollTo({ top: chatLog.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  async function send(text: string) {
    if (!text.trim() || typing) return;
    const next = [...messages, { from: "josh", text: text.trim(), time: new Date() }].slice(-40);
    setMessages(next);
    setInput("");
    setError("");
    setTyping(true);
    update((p) => ({ ...p, chats: p.chats + 1 }));
    if (progress.chats + 1 >= 5) unlock("chat");
    try {
      const response = await fetch("/api/mini-janna", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ from, text }) => ({ role: from === "josh" ? "user" : "assistant", content: text })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't reach Mini Janna right now.");
      setMessages((current) => [...current, { from: "janna", text: data.reply, time: new Date() }].slice(-40));
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't reach Mini Janna right now."); }
    finally { setTyping(false); }
  }
  return (
    <>
      <SectionHeading
        eyebrow="A POCKET-SIZED PIECE OF HOME"
        title="Mini Janna"
        description="Tiny girlfriend. Very big feelings. Entirely powered by affection (and a little code)."
      />
      <div className="companion-room">
        <Companion />
        <section className="chat-card phone-shell" aria-label="Mini Janna chat">
          <div className="phone-screen">
          <div className="phone-status"><span>9:41</span><span className="island" /><span><Wifi size={13}/><BatteryFull size={15}/></span></div>
          <div className="chat-header">
            <span className="janna-avatar">♡</span>
            <div className="chat-title"><h2>Mini Janna</h2><small><i className="status-dot"/> online ♡</small></div>
            <span className="ai-label">AI character · OurVerse</span>
          </div>
          <div className="chat-log" role="log" aria-live="polite" ref={chatLog}>
            {messages.map((message, i) => (
              <div key={i} className={`chat-message ${message.from}`}>
                <p>{message.text}</p><time>{message.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
              </div>
            ))}
          </div>
          {typing && <div className="typing-bubble" aria-label="Mini Janna is typing"><i/><i/><i/></div>}
          <div className="chat-suggestions">
            {["I miss you ♡", "come here for a hug", "goodnight"].map((text) => (
              <button key={text} onClick={() => void send(text)}>
                {text}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Message Mini Janna
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Message Mini Janna"
              autoComplete="off"
            />
            <button
              className="icon-button"
              disabled={!input.trim() || typing}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>
          {error && <p className="chat-error" role="status">{error}</p>}
          <p className="phone-caption">A little AI character in OurVerse · just for fun</p>
          </div>
        </section>
      </div>
      <section className="couple-playground">
        <h2>Two little people. Our whole universe.</h2>
        <Couple key={scene} scene={scene} />
        <div className="world-links">
          {(
            [
              "idle",
              "sit",
              "hold-hands",
              "hug",
              "kiss",
              "heart",
              "sleep",
              "hoodie",
              "poke",
              "gaming",
              "walk",
              "dance",
              "celebrate",
            ] as CoupleScene[]
          ).map((s) => (
            <button
              key={s}
              aria-pressed={s === scene}
              onClick={() => setScene(s)}
            >
              {s === "idle" ? "stand together" : s.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
