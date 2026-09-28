"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, Cookie, Hand, MessageCircle, Sparkles } from "lucide-react";
import { OurVerseCharacter } from "./characters";
import { useUniverse } from "./provider";
import type { Expression } from "@/config/characters";
import { useCornerLife } from "./use-corner-life";
import "./corner-companion.css";

const lines = ["pssst Josh...", "hi handsome ♡", "come here", "I see you", "what are you doing?", "don’t ignore me >:(", "I missed you ♡"];
const surprises = ["wave", "stargaze", "heart", "sit", "sway", "search"] as const;
type Behavior = "idle" | (typeof surprises)[number];
type Reaction = "greet" | "hug" | "kiss" | "feed" | "poke";
const actions = [
  { id: "hug", label: "Hug", icon: Heart },
  { id: "kiss", label: "Kiss", icon: Sparkles },
  { id: "feed", label: "Feed", icon: Cookie },
  { id: "poke", label: "Poke", icon: Hand },
  { id: "talk", label: "Talk", icon: MessageCircle },
] as const;

export function CornerCompanion({ onVisit, destination }: { onVisit: () => void; destination: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { progress, update, unlock, discover } = useUniverse();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [phase, setPhase] = useState("anticipate");
  const [reactionLine, setReactionLine] = useState("");
  const [take, setTake] = useState(0);
  const [pokeLevel, setPokeLevel] = useState(0);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = useReducedMotion();
  const [behavior, setBehavior] = useState<Behavior>("idle");
  const [line, setLine] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const interaction = useRef({ hovered: false, focused: false, nextLine: 0, speaking: false });
  const life = useCornerLife({ host, destination, blocked: menuOpen || !!reaction, reduced: !!reducedMotion, interrupt: () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    busy.current = false;
    setReaction(null); setBehavior("idle"); setMenuOpen(false); setSpeaking(false);
    interaction.current.speaking = false;
  } });

  function perform(action: Reaction) {
    life.interruptLife();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    busy.current = true;
    setBehavior("idle");
    setReaction(action);
    setPhase("anticipate");
    setTake((n) => n + 1);
    if (action !== "greet") {
      setMenuOpen(false);
      discover("companion");
      const pokes = progress.pokes + (action === "poke" ? 1 : 0);
      if (action === "poke") {
        setPokeLevel(pokes);
        unlock("annoy");
        if (pokes >= 5) unlock("professional-annoyer");
      }
      if (action === "hug") unlock("hug");
      update((p) => ({ ...p, pokes: p.pokes + (action === "poke" ? 1 : 0), companion: {
        happiness: Math.min(100, Math.max(0, p.companion.happiness + (action === "poke" ? -5 : 7))),
        love: Math.min(100, p.companion.love + 3),
        miss: Math.max(0, p.companion.miss - (action === "hug" ? 8 : 2)),
      } }));
      setReactionLine(action === "hug" ? "hehe ♡" : action === "kiss" ? "oh! …one more? ♡" : action === "feed" ? "for me? ♡" : pokes >= 5 ? "STOP POKING ME >:(" : pokes >= 3 ? "Josh. I can poke back." : "hey! what was that?");
      button.current?.focus({ preventScroll: true });
    }
    const duration = action === "greet" ? 900 : action === "feed" ? 3600 : action === "poke" ? 1900 : 2900;
    timers.current.push(setTimeout(() => setPhase("act"), 160));
    timers.current.push(setTimeout(() => {
      setPhase("glow");
      if (action === "feed") setReactionLine("mmm. you know me so well ♡");
      if (action === "kiss") setReactionLine("okay, I’m melting ♡");
    }, action === "feed" ? 1650 : 650));
    timers.current.push(setTimeout(() => setPhase("settle"), duration - 350));
    timers.current.push(setTimeout(() => { busy.current = false; setReaction(null); }, duration));
  }

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => menu.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
    function outside(event: PointerEvent) { if (!host.current?.contains(event.target as Node)) setMenuOpen(false); }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); button.current?.focus({ preventScroll: true }); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);

  function greet(kind: "hovered" | "focused", active: boolean) {
    const state = interaction.current;
    state[kind] = active;
    const open = state.hovered || state.focused;
    if (open && !state.speaking && !busy.current) {
      setLine(state.nextLine);
      state.nextLine = (state.nextLine + 1) % lines.length;
      setBehavior("idle");
    }
    state.speaking = open;
    setSpeaking(open);
  }

  useEffect(() => {
    if (reducedMotion || menuOpen || reaction || life.rest !== "awake" || life.travel !== "still" || life.context) return;
    let timer: ReturnType<typeof setTimeout>;
    let previous = -1;
    function schedule(delay = 22000 + Math.random() * 23000) {
      timer = setTimeout(() => {
        if (document.hidden || interaction.current.speaking) { schedule(); return; }
        const next = (previous + 1 + Math.floor(Math.random() * (surprises.length - 1))) % surprises.length;
        previous = next;
        setBehavior(surprises[next]);
        timer = setTimeout(() => { setBehavior("idle"); schedule(); }, surprises[next] === "sit" ? 6500 : 4500);
      }, delay);
    }
    function visibility() {
      clearTimeout(timer);
      setBehavior("idle");
      if (!document.hidden) schedule();
    }
    schedule(13000 + Math.random() * 10000);
    document.addEventListener("visibilitychange", visibility);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", visibility); };
  }, [reducedMotion, menuOpen, reaction, life.rest, life.travel, life.context]);

  useEffect(() => {
    const target = button.current;
    if (!target || reducedMotion) return;
    const finePointer = window.matchMedia("(any-pointer: fine)");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    function settle() {
      if (!target) return;
      target.dataset.attentive = "false";
      target.style.setProperty("--gaze-x", "0px");
      target.style.setProperty("--gaze-y", "0px");
      target.style.setProperty("--head-turn", "0deg");
    }
    function track() {
      frame = 0;
      if (!target || document.hidden || busy.current || life.rest !== "awake" || life.travel !== "still") { settle(); return; }
      const box = target.getBoundingClientRect();
      const dx = pointerX - (box.left + box.width / 2);
      const dy = pointerY - (box.top + box.height * .35);
      const distance = Math.hypot(dx, dy);
      if (distance > 260) { settle(); return; }
      const attention = 1 - Math.max(0, distance - 110) / 150;
      target.dataset.attentive = "true";
      target.style.setProperty("--gaze-x", `${Math.max(-3, Math.min(3, dx / 35)) * attention}px`);
      target.style.setProperty("--gaze-y", `${Math.max(-2, Math.min(2, dy / 45)) * attention}px`);
      target.style.setProperty("--head-turn", `${Math.max(-5, Math.min(5, dx / 35)) * attention}deg`);
    }
    function move(event: PointerEvent) {
      if (!finePointer.matches || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(track);
    }
    function leave(event: PointerEvent) { if (!event.relatedTarget) { cancelAnimationFrame(frame); frame = 0; settle(); } }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", settle);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", settle);
      settle();
    };
  }, [reducedMotion, life.rest, life.travel]);

  const expression: Expression = life.travel === "dragging" ? "surprised"
    : ["sleepy", "seated", "asleep"].includes(life.rest) ? "sleepy"
    : life.rest === "waking" ? "surprised"
    : reaction === "kiss"
    ? (phase === "anticipate" || phase === "act" ? "surprised" : "laughing")
    : reaction === "hug" ? "laughing"
    : reaction === "feed" ? (phase === "act" ? "surprised" : "laughing")
    : reaction === "poke" ? (phase === "anticipate" || phase === "act" ? "surprised" : pokeLevel >= 5 ? "angry" : pokeLevel >= 3 ? "annoyed" : "confused")
    : behavior === "heart" || life.context === "heart" ? "blushing" : "happy";
  const displayBehavior = life.context === "stargaze" ? "stargaze" : life.context === "heart" ? "heart" : behavior;
  const resting = life.rest === "seated" || life.rest === "asleep";

  return (
    <>
    <svg className="corner-home-perch" viewBox="0 0 100 36" fill="none" stroke="#373049" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 13Q26 6 50 9Q75 5 93 13L88 24L67 29L51 33L29 28L12 23Z" fill="#50425f" />
      <path d="M12 17L29 28L47 31L39 20M67 29L78 18L88 16L88 24Z" fill="#685573" stroke="none" />
      <path d="M7 12Q26 5 50 8Q77 5 93 12Q90 21 63 22Q25 25 7 15Z" fill="#b5a4c7" />
      <path d="M15 13Q39 8 62 11Q78 9 87 13" stroke="#d5c4dd" strokeWidth="1.2" />
      <ellipse cx="48" cy="15" rx="23" ry="3.5" fill="#51445e" opacity=".22" stroke="none" />
      <path d="M85 7L86 4L87 7L90 8L87 9L86 12L85 9L82 8Z" fill="#e3cba6" stroke="none" />
    </svg>
    <motion.div ref={host} className="corner-companion-host" style={{ x: life.x }} data-travel={life.travel} onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenuOpen(false);
    }}>
    <button
      ref={button}
      type="button"
      className="companion-peek living-companion"
      data-behavior={displayBehavior}
      data-speaking={!menuOpen && life.travel === "still" && life.rest === "awake" && (speaking || !!reaction || !!life.contextLine)}
      data-reaction={reaction || "none"}
      data-phase={phase}
      data-travel={life.travel}
      data-rest={life.rest}
      data-context={life.context || "none"}
      data-direction={life.direction}
      onPointerDown={life.pointerDown}
      onPointerMove={life.pointerMove}
      onPointerUp={life.pointerUp}
      onPointerCancel={life.pointerUp}
      onLostPointerCapture={life.pointerUp}
      onClick={(e) => { if (life.consumeDragClick() && e.detail !== 0) return; if (!menuOpen) perform("greet"); setMenuOpen(!menuOpen); }}
      onPointerEnter={(e) => { if (e.pointerType !== "touch") { if (life.travel === "walking") life.interruptLife(); greet("hovered", true); } }}
      onPointerLeave={() => greet("hovered", false)}
      onFocus={() => greet("focused", true)}
      onBlur={() => greet("focused", false)}
      aria-label="Spend a moment with Mini Janna"
      aria-expanded={menuOpen}
      aria-controls={menuOpen ? menuId : undefined}
    >
      <OurVerseCharacter key={`character-${take}`} character="janna" pose={life.travel === "dragging" ? "idle" : life.travel === "walking" ? "walk" : life.rest === "asleep" ? "sleep" : resting || life.context === "cozy" ? "sit" : life.context === "excited" ? "celebrate" : reaction === "hug" && phase !== "settle" ? "hug" : behavior === "sit" ? "sit" : "idle"} expression={expression} />
      <span className="corner-speech" aria-hidden="true"><span key={reaction ? `${take}-${phase}` : line}>{reaction && reaction !== "greet" ? reactionLine : life.contextLine || lines[line]}</span></span>
      {displayBehavior === "heart" && <svg className="corner-gift-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20C-5 10 4 0 12 7C20 0 29 10 12 20Z" /></svg>}
      {life.rest === "asleep" && <span className="corner-sleep-note" aria-hidden="true">z</span>}
      {life.context === "photo" && <svg className="corner-keepsake" viewBox="0 0 32 36" aria-hidden="true"><path d="M2 1H30V35H2Z" fill="#eadfce" /><path d="M5 4H27V26H5Z" fill="#665974" /><circle cx="21" cy="10" r="4" fill="#d6c5ad" /><path d="M5 25L13 14L20 21L24 16L27 26Z" fill="#9f8c9d" /><path d="M12 31H21" stroke="#ae939e" /></svg>}
      {(reaction === "hug" || reaction === "kiss") && <span key={`${reaction}-hearts-${take}`} className="corner-reaction-hearts" aria-hidden="true">{[0, 1, 2].map((i) => <svg key={i} viewBox="0 0 24 24"><path d="M12 20C-5 10 4 0 12 7C20 0 29 10 12 20Z" /></svg>)}</span>}
      {reaction === "feed" && <svg key={`feed-snack-${take}`} className="corner-snack" viewBox="0 0 28 28" aria-hidden="true"><path d="M25 13A11 11 0 1 1 15 3Q13 8 18 9Q18 14 25 13Z" fill="#d6a26d" stroke="#f1c792" /><g fill="#71505a"><circle cx="9" cy="10" r="1.7" /><circle cx="8" cy="18" r="1.5" /><circle cx="16" cy="19" r="2" /></g></svg>}
      {reaction === "feed" && <span key={`crumb-${take}`} className="corner-snack-crumbs" aria-hidden="true"><i /><i /><i /></span>}
    </button>
    <AnimatePresence>
      {menuOpen && <motion.div
        ref={menu}
        id={menuId}
        className="corner-quick-actions"
        role="group"
        aria-label="Little moments with Janna"
        initial={{ opacity: 0, x: reducedMotion ? 0 : -6, y: reducedMotion ? 0 : 5 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: reducedMotion ? 0 : -4, y: reducedMotion ? 0 : 4 }}
        transition={{ duration: reducedMotion ? 0 : .18 }}
      >
        {actions.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => {
          if (id === "talk") { setMenuOpen(false); onVisit(); } else perform(id);
        }}><Icon size={14} strokeWidth={1.4} aria-hidden="true" /><span>{label}</span></button>)}
      </motion.div>}
    </AnimatePresence>
    <span className="sr-only" role="status" aria-live="polite">{reaction && reaction !== "greet" ? reactionLine : ""}</span>
    </motion.div>
    </>
  );
}
