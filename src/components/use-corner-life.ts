"use client";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { animate, useMotionValue, useSpring } from "motion/react";

type Rest = "awake" | "sleepy" | "seated" | "asleep" | "waking";
type Travel = "still" | "dragging" | "landing" | "walking";
type Context = "stargaze" | "excited" | "photo" | "heart" | "cozy" | null;
const POSITION_KEY = "ourverse-corner-position";

export function useCornerLife({ host, destination, blocked, reduced, interrupt }: {
  host: RefObject<HTMLDivElement | null>;
  destination: string;
  blocked: boolean;
  reduced: boolean;
  interrupt: () => void;
}) {
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 580, damping: 42, mass: .45 });
  const [rest, setRest] = useState<Rest>("awake");
  const [travel, setTravel] = useState<Travel>("still");
  const [context, setContext] = useState<Context>(null);
  const [contextLine, setContextLine] = useState("");
  const [direction, setDirection] = useState(1);
  const current = useRef({ blocked, reduced, interrupt, rest, travel });
  useEffect(() => { current.current = { blocked, reduced, interrupt, rest, travel }; }, [blocked, reduced, interrupt, rest, travel]);
  const lastActivity = useRef(Date.now());
  const drag = useRef<{ id: number; startX: number; startY: number; origin: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wakeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const walker = useRef<ReturnType<typeof animate> | null>(null);
  const dragObstacles = useRef<DOMRect[] | null>(null);

  function geometry() {
    const node = host.current;
    const left = node ? parseFloat(getComputedStyle(node).left) || 0 : 18;
    const width = node?.offsetWidth || 70;
    return { left, width, max: Math.max(0, window.innerWidth - left - width - 12), rect: node?.getBoundingClientRect() };
  }

  function safePosition(desired: number) {
    const { left, width, max, rect } = geometry();
    const target = Math.max(0, Math.min(max, desired));
    if (!rect) return target;
    const obstacles = dragObstacles.current ?? Array.from(document.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [role='button'], [role='navigation']"))
      .filter((el) => !host.current?.contains(el) && !el.closest(".world-home .living-world-carrier"))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0 && r.top < rect.bottom + 8 && r.bottom > rect.top - 8);
    const clear = (value: number) => obstacles.every((r) => left + value + width + 8 <= r.left || left + value - 8 >= r.right);
    if (clear(target)) return target;
    for (let step = 12; step <= max + 12; step += 12) {
      for (const candidate of [target - step, target + step]) if (candidate >= 0 && candidate <= max && clear(candidate)) return candidate;
    }
    return 0;
  }

  function remember() {
    const { max } = geometry();
    try { sessionStorage.setItem(POSITION_KEY, String(max ? x.get() / max : 0)); } catch { /* The companion still works without storage. */ }
  }

  function activity() {
    lastActivity.current = Date.now();
    if (current.current.rest !== "awake" && current.current.rest !== "waking") {
      current.current.rest = "waking";
      setRest("waking");
      setContext(null);
      setContextLine("");
      clearTimeout(wakeTimer.current);
      wakeTimer.current = setTimeout(() => { current.current.rest = "awake"; setRest("awake"); }, current.current.reduced ? 200 : 1450);
    }
  }

  useEffect(() => {
    const { max } = geometry();
    try {
      const stored = sessionStorage.getItem(POSITION_KEY);
      const saved = stored === null || stored.trim() === "" ? NaN : Number(stored);
      if (Number.isFinite(saved) && saved >= 0 && saved <= 1) { const restored = safePosition(saved * max); x.jump(restored); smoothX.jump(restored); }
    } catch { /* Use the default corner. */ }
    const align = () => {
      walker.current?.stop();
      current.current.travel = "still";
      setTravel("still");
      x.set(safePosition(x.get()));
      remember();
    };
    const screen = () => {
      if (document.hidden) {
        walker.current?.stop();
        current.current.travel = "still";
        setTravel("still");
        drag.current = null;
        dragObstacles.current = null;
      } else { activity(); align(); }
    };
    const face = (value: number) => {
      const { left, width } = geometry();
      if (host.current) host.current.dataset.edge = left + value + width / 2 > window.innerWidth / 2 ? "right" : "left";
    };
    const unsubscribe = x.on("change", face);
    face(x.get());
    window.addEventListener("resize", align);
    let scrollFrame = 0;
    const scroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; align(); }); };
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", screen);
    return () => {
      unsubscribe(); walker.current?.stop();
      clearTimeout(transitionTimer.current); clearTimeout(wakeTimer.current);
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("resize", align); window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", screen);
    };
  }, []);

  useEffect(() => {
    const awake = () => activity();
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "wheel"] as const;
    events.forEach((event) => window.addEventListener(event, awake, { passive: true }));
    const interval = setInterval(() => {
      const state = current.current;
      if (document.hidden || state.blocked || state.travel !== "still") return;
      const elapsed = Date.now() - lastActivity.current;
      const next: Rest = elapsed >= 150000 ? "asleep" : elapsed >= 95000 ? "seated" : elapsed >= 60000 ? "sleepy" : state.rest;
      if (next !== state.rest) {
        current.current.rest = next;
        setRest(next);
        setContext(null); setContextLine("");
        state.interrupt();
      }
    }, 2500);
    return () => { clearInterval(interval); events.forEach((event) => window.removeEventListener(event, awake)); };
  }, []);

  useEffect(() => {
    if (reduced) {
      if (current.current.travel === "walking") { current.current.travel = "still"; setTravel("still"); }
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    function schedule() {
      timeout = setTimeout(() => {
        const state = current.current;
        if (document.hidden || state.blocked || state.rest !== "awake" || state.travel !== "still" || drag.current || host.current?.matches(":hover, :focus-within")) { schedule(); return; }
        const origin = x.get();
        const sign = Math.random() > .5 ? 1 : -1;
        let target = safePosition(origin + sign * (30 + Math.random() * 34));
        if (Math.abs(target - origin) < 20) target = safePosition(origin - sign * 44);
        if (Math.abs(target - origin) < 20 || Math.abs(target - origin) > 72) { schedule(); return; }
        // Avoid walking through an occupied control on the way to a clear destination.
        for (let t = .2; t < 1; t += .2) {
          const point = origin + (target - origin) * t;
          if (Math.abs(safePosition(point) - point) > 2) { schedule(); return; }
        }
        state.interrupt();
        setContext(null); setContextLine("");
        current.current.travel = "walking"; setTravel("walking");
        setDirection(target > origin ? 1 : -1);
        walker.current = animate(x, target, { duration: Math.abs(target - origin) / 14, ease: "linear", onComplete: () => {
          current.current.travel = "still"; setTravel("still"); remember();
        } });
        schedule();
      }, 85000 + Math.random() * 65000);
    }
    schedule();
    return () => { clearTimeout(timeout); walker.current?.stop(); };
  }, [reduced]);

  useEffect(() => {
    const map: Record<string, Context> = { home: "stargaze", garden: "stargaze", games: "excited", memories: "photo", letters: "heart", room: "cozy" };
    let end: ReturnType<typeof setTimeout>;
    setContext(null); setContextLine("");
    const timer = setTimeout(() => {
      const state = current.current;
      if (!map[destination] || state.blocked || state.rest !== "awake" || state.travel !== "still" || document.hidden) return;
      try {
        const last = Number(sessionStorage.getItem("ourverse-corner-context")) || 0;
        if (Date.now() - last < 50000) return;
        sessionStorage.setItem("ourverse-corner-context", String(Date.now()));
      } catch { /* Context remains optional. */ }
      state.interrupt();
      setContext(map[destination]);
      if (destination === "garden") setContextLine("look what we’re growing ♡");
      end = setTimeout(() => { setContext(null); setContextLine(""); }, 4600);
    }, 2400);
    return () => { clearTimeout(timer); clearTimeout(end); };
  }, [destination]);

  function pointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    activity();
    walker.current?.stop();
    clearTimeout(transitionTimer.current);
    current.current.travel = "still"; setTravel("still");
    suppressClick.current = false;
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: x.get(), moved: false };
    const rect = geometry().rect;
    dragObstacles.current = rect ? Array.from(document.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [role='button'], [role='navigation']"))
      .filter((el) => !host.current?.contains(el) && !el.closest(".world-home .living-world-carrier")).map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0 && r.top < rect.bottom + 8 && r.bottom > rect.top - 8) : null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const point = drag.current;
    if (!point || point.id !== event.pointerId) return;
    const dx = event.clientX - point.startX;
    if (!point.moved && Math.hypot(dx, event.clientY - point.startY) < 7) return;
    if (!point.moved) {
      point.moved = true; suppressClick.current = true;
      current.current.interrupt(); setContext(null); setContextLine("");
      clearTimeout(wakeTimer.current); current.current.rest = "awake"; setRest("awake");
      current.current.travel = "dragging"; setTravel("dragging");
    }
    x.set(safePosition(point.origin + dx));
  }
  function pointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const point = drag.current;
    if (!point || point.id !== event.pointerId) return;
    drag.current = null;
    dragObstacles.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!point.moved) return;
    x.set(safePosition(x.get())); remember();
    current.current.travel = "landing"; setTravel("landing");
    transitionTimer.current = setTimeout(() => { current.current.travel = "still"; setTravel("still"); }, reduced ? 0 : 620);
  }
  function interruptLife() {
    activity(); walker.current?.stop();
    clearTimeout(transitionTimer.current); clearTimeout(wakeTimer.current);
    current.current.travel = "still"; setTravel("still");
    current.current.rest = "awake"; setRest("awake");
    setContext(null); setContextLine("");
  }
  return { x: reduced ? x : smoothX, rest, travel, context, contextLine, direction, pointerDown, pointerMove, pointerUp, interruptLife,
    consumeDragClick() { const value = suppressClick.current; suppressClick.current = false; return value; } };
}
