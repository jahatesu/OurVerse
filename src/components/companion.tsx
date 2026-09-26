"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Cookie, Smile, Sparkles, Send } from "lucide-react";
import { companionResponses, chatRules, chatFallbacks } from "@/data/messages";
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
  const [messages, setMessages] = useState([
    {
      from: "janna",
      text: "Hi Josh! Your pocket-sized Janna is here. Say something sweet? ♡",
    },
  ]);
  useEffect(() => {
    if (chatLog.current)
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
  }, [messages]);
  function send(text: string) {
    if (!text.trim()) return;
    const rule = chatRules.find((rule) =>
      rule.keywords.some((keyword) => text.toLowerCase().includes(keyword)),
    );
    setMessages((m) => [
      ...m.slice(-48),
      { from: "josh", text: text.trim() },
      { from: "janna", text: pick(rule?.replies ?? chatFallbacks) },
    ]);
    setInput("");
    update((p) => ({ ...p, chats: p.chats + 1 }));
    if (progress.chats + 1 >= 5) unlock("chat");
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
        <section className="chat-card">
          <div className="chat-header">
            <span className="status-dot" />
            <h2>A little love line</h2>
            <small>Scripted chat · no AI</small>
          </div>
          <div className="chat-log" role="log" aria-live="polite" ref={chatLog}>
            {messages.map((message, i) => (
              <div key={i} className={`chat-message ${message.from}`}>
                <small>
                  {message.from === "janna" ? "Mini Janna" : "Josh"}
                </small>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="chat-suggestions">
            {["I miss you", "Hug", "Goodnight"].map((text) => (
              <button key={text} onClick={() => send(text)}>
                {text}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
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
              placeholder="Tell me what’s on your mind…"
              autoComplete="off"
            />
            <button
              className="icon-button"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>
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
