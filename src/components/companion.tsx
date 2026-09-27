"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, Cookie, Smile, Sparkles, Send, Wifi, BatteryFull } from "lucide-react";
import { useUniverse } from "./provider";
import { SectionHeading } from "./ui";
import { Couple, type CoupleScene } from "./characters";
export function Companion({ compact = false }: { compact?: boolean }) {
  const { progress, update, unlock, discover, ready } = useUniverse();
  const [reaction, setReaction] = useState<"idle" | "Hug" | "Kiss">("idle");
  const [interaction, setInteraction] = useState("");
  const [exchange, setExchange] = useState<{ josh: string; janna: string } | null>(null);
  const [dialogueClosing, setDialogueClosing] = useState(false);
  const [snack, setSnack] = useState<"samgyupsal" | "strawberry" | "cookie" | "mochi">("strawberry");
  const [animation, setAnimation] = useState(0);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const visitedRef = useRef(false);
  const dialogueTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnnoyDialogue = useRef<{ josh: string; janna: string } | null>(null);
  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const bound = (value: number) => Math.max(0, Math.min(100, value));
  const hugs = [
    { josh: "Come here, baby.", janna: "Finallyyy. Don't let go ♡" },
    { josh: "I needed this hug too.", janna: "Mhm. You're staying right here." },
    { josh: "My favorite place is here.", janna: "Then keep your arms around me." },
  ];
  const kisses = [
    { josh: "One more kiss?", janna: "You owe me like 100 more." },
    { josh: "Kiss for my pretty girl?", janna: "Only one? Absolutely not." },
    { josh: "Come closer, love.", janna: "I was already coming ♡" },
  ];
  const foods = [
    { item: "samgyupsal" as const, josh: "Have some samgyupsal, my love.", janna: "AAAA thank you baby ♡" },
    { item: "strawberry" as const, josh: "A strawberry for you.", janna: "The sweetest one? That's me, right?" },
    { item: "cookie" as const, josh: "I saved you the last cookie.", janna: "You do love me. Hand it over." },
    { item: "mochi" as const, josh: "Tiny mochi for my tiny Janna.", janna: "Cute. I want three more." },
  ];
  const mood = progress.companion.miss >= 70 ? "misses you" : progress.companion.happiness >= 75 ? "feeling adored" : progress.companion.happiness < 35 ? "needs a cuddle" : "cozy with you";

  useEffect(() => {
    if (!ready || visitedRef.current) return;
    visitedRef.current = true;
    const now = Date.now();
    const last = progress.companion.lastInteraction;
    const days = last > 0 ? Math.floor(Math.max(0, now - last) / 86_400_000) : 0;
    update((p) => {
      if (p.companion.lastInteraction !== last) return p;
      return {
        ...p,
        companion: {
          ...p.companion,
          happiness: bound(p.companion.happiness - Math.min(8, days)),
          miss: bound(p.companion.miss + Math.min(24, days * 3)),
          lastInteraction: now,
        },
      };
    });
  }, [ready, progress.companion.lastInteraction, update]);

  async function interact(action: "Hug" | "Kiss" | "Feed" | "Annoy") {
    if (busyRef.current) return;
    busyRef.current = true;
    if (dialogueTimer.current) clearTimeout(dialogueTimer.current);
    setDialogueClosing(false);
    setBusy(true);
    setAnimation((n) => n + 1);
    discover("companion");
    update((p) => ({
      ...p,
      pokes: p.pokes + (action === "Annoy" ? 1 : 0),
      companion: {
        ...p.companion,
        happiness: bound(p.companion.happiness + (action === "Annoy" ? -2 : action === "Feed" ? 8 : 7)),
        love: bound(p.companion.love + (action === "Annoy" ? 0 : 1)),
        miss: bound(p.companion.miss - (action === "Annoy" ? 3 : 12)),
        lastInteraction: Date.now(),
      },
    }));
    if (action === "Hug") unlock("hug");
    if (action === "Annoy") {
      unlock("annoy");
      const variant = progress.pokes % 4 + 1;
      const lines = [
        [
          { josh: "hehe", janna: "Joshhh stop!" },
          { josh: "what?", janna: "JOSHHHH" },
        ],
        [
          { josh: "you still love me though", janna: "You're so annoying >:(" },
          { josh: "I didn't do anything", janna: "Keep going. See what happens." },
        ],
        [
          { josh: "catch me first", janna: "Josh, I can chase you, you know." },
          { josh: "hehe, too slow", janna: "Come back here!" },
        ],
        [
          { josh: "what?", janna: "No more kisses for you." },
          { josh: "catch me first", janna: "I'm warning you >:(" },
        ],
      ];
      const choices = lines[variant - 1].filter((line) => line.josh !== lastAnnoyDialogue.current?.josh || line.janna !== lastAnnoyDialogue.current?.janna);
      const exchangeForAnnoy = choices[Math.floor(Math.random() * choices.length)] || lines[variant - 1][0];
      lastAnnoyDialogue.current = exchangeForAnnoy;
      setReaction("idle");
      setExchange(exchangeForAnnoy);
      setInteraction(`annoy-${variant}`);
      if (progress.pokes + 1 >= 5) unlock("professional-annoyer");
      if (variant === 3) {
        await pause(500);
        setInteraction("annoy-3-chase");
        await pause(1650);
      } else if (variant === 4) {
        const snacks: (typeof snack)[] = ["samgyupsal", "strawberry", "cookie", "mochi"];
        setSnack(snacks[Math.floor(Math.random() * snacks.length)]);
        await pause(550);
        setInteraction("annoy-4-away");
        await pause(650);
        setInteraction("annoy-4-reach");
        await pause(900);
      } else {
        await pause(1900);
      }
    } else if (action === "Feed") {
      const chosen = foods[Math.floor(Math.random() * foods.length)];
      setSnack(chosen.item);
      setReaction("idle");
      setExchange({ josh: chosen.josh, janna: chosen.janna });
      setInteraction("feed-notice");
      await pause(600);
      setInteraction("feed-offer");
      await pause(650);
      setInteraction("feed-bite");
      await pause(700);
      setInteraction("feed-chew");
      await pause(850);
      setInteraction("feed-satisfied");
      await pause(950);
    } else {
      const lines = action === "Hug" ? hugs : kisses;
      setExchange(lines[Math.floor(Math.random() * lines.length)]);
      setReaction(action);
      setInteraction(action.toLowerCase());
      // Preserve the existing Hug and Kiss choreography.
      await pause(2500);
    }
    setReaction("idle");
    setInteraction("");
    setDialogueClosing(true);
    dialogueTimer.current = setTimeout(() => {
      setExchange(null);
      setDialogueClosing(false);
    }, 380);
    setBusy(false);
    busyRef.current = false;
  }

  return (
    <section className={`companion-card ${compact ? "compact" : ""}`}>
      <div className="companion-header">
        <h2>Mini Janna <span>✿</span></h2>
        <span className="online-pill"><i /> {mood}</span>
      </div>
      <div className={`avatar-stage companion-stage ${interaction ? "is-interacting" : ""}`}>
        <Couple
          key={`couple-${animation}`}
          scene={reaction === "Kiss" ? "kiss" : reaction === "Hug" ? "hug" : "idle"}
          interaction={interaction}
          food={snack}
          dialogueJanna={exchange?.janna}
          dialogueJosh={exchange?.josh}
          dialogueClosing={dialogueClosing}
          jannaExpression={interaction ? undefined : progress.companion.miss >= 70 ? "love-struck" : progress.companion.happiness < 35 ? "annoyed" : "happy"}
        />
      </div>
      <div className={`stat-bars companion-stats ${interaction ? "stat-pulse" : ""}`}>
        {([
          ["Happiness", progress.companion.happiness, progress.companion.happiness >= 75 ? "glowing" : progress.companion.happiness >= 40 ? "cozy" : "needs cuddles"],
          ["Love", progress.companion.love, progress.companion.love >= 75 ? "steady & sweet" : "growing together"],
          ["Miss Josh", progress.companion.miss, progress.companion.miss >= 70 ? "missed you lots" : progress.companion.miss >= 35 ? "a little" : "right here"],
        ] as const).map(([label, value, note]) => (
          <div className="stat-row" key={label}>
            <span><b>{label}</b><em>{note}</em></span>
            <div role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${value}%` }} />
            </div>
            <small>{value}%</small>
          </div>
        ))}
      </div>
      <div className="companion-actions">
        {([ ["Hug", Heart], ["Kiss", Sparkles], ["Feed", Cookie], ["Annoy", Smile] ] as const).map(([action, Icon]) => (
          <button key={action} disabled={busy} onClick={() => void interact(action)}>
            <Icon size={15} /><span>{action}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
export function CompanionRoom() {
  const [scene, setScene] = useState<CoupleScene>("idle");
  const [sceneRun, setSceneRun] = useState(0);
  const [sceneDialogue, setSceneDialogue] = useState<{ janna: string; josh?: string } | null>(null);
  const chatLog = useRef<HTMLDivElement>(null);
  const sceneDialogueTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pokeDialogueIndex = useRef(0);
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
  useEffect(() => () => { if (sceneDialogueTimer.current) clearTimeout(sceneDialogueTimer.current); }, []);
  function selectCoupleScene(nextScene: CoupleScene) {
    if (sceneDialogueTimer.current) clearTimeout(sceneDialogueTimer.current);
    setSceneDialogue(null);
    setScene(nextScene);
    setSceneRun((run) => run + 1);
    if (nextScene === "poke") {
      const lines = ["Joshhh >:(", "stop poking me!", "you're annoying", "JOSH."];
      const line = lines[pokeDialogueIndex.current % lines.length];
      pokeDialogueIndex.current += 1;
      setSceneDialogue({ janna: line });
      sceneDialogueTimer.current = setTimeout(() => setSceneDialogue(null), 2600);
    } else if (nextScene === "gaming") {
      const exchanges = [
        { janna: "HOW DID YOU DO THAT", josh: "skill issue" },
        { janna: "you're cheating >:(", josh: "hehe" },
        { janna: "rematch.", josh: "you almost had me" },
        { janna: "BABE!", josh: "that was close" },
      ];
      setSceneDialogue(exchanges[sceneRun % exchanges.length]);
      sceneDialogueTimer.current = setTimeout(() => setSceneDialogue(null), 2600);
    }
  }
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
        <Couple key={`${scene}-${sceneRun}`} scene={scene} dialogueJanna={sceneDialogue?.janna} dialogueJosh={sceneDialogue?.josh} />
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
              onClick={() => selectCoupleScene(s)}
            >
              {s === "idle" ? "stand together" : s.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
