"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { achievements } from "@/data/achievements";
import { codePuzzles } from "@/data/expansion";
type Progress = {
  entered: boolean;
  unlocked: string[];
  explored: string[];
  reasons: number;
  companion: { happiness: number; love: number; miss: number };
  chats: number;
  vault: boolean;
  discoveries: string[];
  redeemed: Record<string, number>;
  wishes: string[];
  dreams: Record<string, string>;
  fragments: number;
  pokes: number;
  plantActions: string[];
  endingSeen: boolean;
};
const initial: Progress = {
  entered: false,
  unlocked: [],
  explored: [],
  reasons: 0,
  companion: { happiness: 70, love: 90, miss: 100 },
  chats: 0,
  vault: false,
  discoveries: [],
  redeemed: {},
  wishes: [],
  dreams: {},
  fragments: 0,
  pokes: 0,
  plantActions: [],
  endingSeen: false,
};
type UniverseContext = {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  unlock: (id: string) => void;
  ready: boolean;
  toast: string;
  notify: (message: string) => void;
  discover: (id: string) => void;
  reset: (area: string) => void;
  simulation: string;
  simulate: (value: string) => void;
};
const Context = createContext<UniverseContext | null>(null);
export function UniverseProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [simulation, simulate] = useState("");
  const previous = useRef<string[] | null>(null);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(localStorage.getItem("ourverse-v1") || "null");
        if (saved && typeof saved === "object") {
          const loaded = {
            ...initial,
            ...saved,
            entered: saved.entered === true,
            vault: saved.vault === true,
            discoveries: Array.isArray(saved.discoveries)
              ? saved.discoveries.filter((v: unknown) => typeof v === "string")
              : [],
            plantActions: Array.isArray(saved.plantActions)
              ? saved.plantActions.filter((v: unknown) => typeof v === "string")
              : [],
            wishes: Array.isArray(saved.wishes)
              ? saved.wishes
                  .filter((v: unknown) => typeof v === "string")
                  .slice(0, 100)
              : [],
            redeemed:
              saved.redeemed &&
              typeof saved.redeemed === "object" &&
              !Array.isArray(saved.redeemed)
                ? Object.fromEntries(
                    Object.entries(saved.redeemed).filter(
                      ([, v]) =>
                        typeof v === "number" && Number.isFinite(v) && v >= 0,
                    ),
                  )
                : {},
            dreams:
              saved.dreams &&
              typeof saved.dreams === "object" &&
              !Array.isArray(saved.dreams)
                ? Object.fromEntries(
                    Object.entries(saved.dreams).filter(
                      ([, v]) =>
                        typeof v === "string" && Number.isFinite(Date.parse(v)),
                    ),
                  )
                : {},
            fragments: Math.min(
              codePuzzles.length,
              Math.max(0, Math.floor(Number(saved.fragments) || 0)),
            ),
            pokes: Math.max(0, Math.floor(Number(saved.pokes) || 0)),
            endingSeen: saved.endingSeen === true,
            unlocked: Array.isArray(saved.unlocked)
              ? saved.unlocked.filter(
                  (id: unknown) =>
                    typeof id === "string" &&
                    achievements.some((a) => a.id === id),
                )
              : [],
            explored: Array.isArray(saved.explored)
              ? saved.explored.filter((id: unknown) => typeof id === "string")
              : [],
            reasons: Math.min(
              100,
              Math.max(0, Math.floor(Number(saved.reasons) || 0)),
            ),
            chats: Math.max(0, Number(saved.chats) || 0),
            companion: {
              happiness: Math.min(
                100,
                Math.max(0, Number(saved.companion?.happiness) || 0),
              ),
              love: Math.min(
                100,
                Math.max(0, Number(saved.companion?.love) || 0),
              ),
              miss: Math.min(
                100,
                Math.max(0, Number(saved.companion?.miss) || 0),
              ),
            },
          };
          previous.current = loaded.unlocked;
          setProgress(loaded);
        }
      } catch {}
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("ourverse-v1", JSON.stringify(progress));
      } catch {}
    }
  }, [progress, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  const update = useCallback(
    (fn: (p: Progress) => Progress) => setProgress(fn),
    [],
  );
  const unlock = useCallback((id: string) => {
    setProgress((p) =>
      p.unlocked.includes(id) ? p : { ...p, unlocked: [...p.unlocked, id] },
    );
  }, []);
  const discover = useCallback((id: string) => {
    setProgress((p) =>
      p.discoveries.includes(id)
        ? p
        : {
            ...p,
            discoveries: [...p.discoveries, id],
            plantActions: [...new Set([...p.plantActions, id])],
          },
    );
  }, []);
  const reset = useCallback((area: string) => {
    if (process.env.NODE_ENV !== "development") return;
    if (area === "unlock" || area === "unlock-all") simulate("unlocked");
    if (area === "capsule-available") simulate("capsule");
    if (area === "all" || area === "capsule" || area === "letters")
      simulate("");
    setProgress((p) => {
      switch (area) {
        case "all":
          return initial;
        case "unlock":
        case "unlock-all":
          return {
            ...p,
            entered: true,
            vault: true,
            fragments: codePuzzles.length,
            reasons: 100,
            discoveries: Array.from({ length: 20 }, (_, i) => `dev-${i}`),
            plantActions: Array.from({ length: 20 }, (_, i) => `dev-${i}`),
            unlocked: achievements.map((a) => a.id),
          };
        case "achievements":
          return { ...p, unlocked: [] };
        case "achievements-all":
          return { ...p, unlocked: achievements.map((a) => a.id) };
        case "exploration":
          return { ...p, explored: ["home"] };
        case "constellation":
          return { ...p, discoveries: [], explored: ["home"] };
        case "constellation-full":
        case "ending-available":
          return {
            ...p,
            discoveries: Array.from({ length: 16 }, (_, i) => `dev-star-${i}`),
          };
        case "plant":
          return { ...p, plantActions: [] };
        case "mature-plant":
          return {
            ...p,
            plantActions: Array.from(
              { length: 20 },
              (_, i) => `dev-plant-${i}`,
            ),
            unlocked: [...new Set([...p.unlocked, "plant"])],
          };
        case "coupons":
          return { ...p, redeemed: {} };
        case "vault":
          return { ...p, vault: false, fragments: 0 };
        case "vault-unlock":
          return { ...p, vault: true, fragments: codePuzzles.length };
        case "games":
          return {
            ...p,
            fragments: 0,
            discoveries: p.discoveries.filter((id) => !id.startsWith("game-")),
            unlocked: p.unlocked.filter(
              (id) =>
                ![
                  "quiz",
                  "memory",
                  "hearts",
                  "puzzle",
                  "crossword",
                  "code",
                  "kisses",
                  "arcade",
                ].includes(id),
            ),
          };
        case "puzzle":
          return {
            ...p,
            unlocked: p.unlocked.filter((id) => id !== "puzzle"),
            discoveries: p.discoveries.filter((id) => id !== "game-puzzle"),
          };
        case "crossword":
          return {
            ...p,
            unlocked: p.unlocked.filter((id) => id !== "crossword"),
            discoveries: p.discoveries.filter((id) => id !== "game-crossword"),
          };
        case "code":
          return {
            ...p,
            fragments: 0,
            unlocked: p.unlocked.filter((id) => id !== "code"),
            discoveries: p.discoveries.filter((id) => id !== "game-code"),
          };
        case "capsule":
          return {
            ...p,
            discoveries: p.discoveries.filter((id) => id !== "capsule"),
          };
        case "letters":
          return {
            ...p,
            discoveries: p.discoveries.filter((id) => id !== "letter"),
          };
        case "ending":
          return { ...p, endingSeen: false };
        default:
          return {
            ...p,
            discoveries: p.discoveries.filter((id) => !id.includes(area)),
            unlocked: p.unlocked.filter((id) => !id.includes(area)),
          };
      }
    });
  }, []);
  useEffect(() => {
    if (!ready) return;
    const added = progress.unlocked.filter(
      (id) => !(previous.current ?? []).includes(id),
    );
    previous.current = progress.unlocked;
    if (!added.length || added[0] === "welcome") return;
    const timer = setTimeout(
      () =>
        setToast(
          `Achievement unlocked · ${achievements.find((a) => a.id === added[0])?.title ?? "Stargazer"}`,
        ),
      100,
    );
    return () => clearTimeout(timer);
  }, [progress.unlocked, ready]);
  return (
    <Context.Provider
      value={{
        progress,
        update,
        unlock,
        ready,
        toast,
        notify: setToast,
        discover,
        reset,
        simulation,
        simulate,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useUniverse() {
  const value = useContext(Context);
  if (!value) throw new Error("UniverseProvider missing");
  return value;
}
