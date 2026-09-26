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
type Progress = {
  entered: boolean;
  unlocked: string[];
  explored: string[];
  reasons: number;
  companion: { happiness: number; love: number; miss: number };
  chats: number;
  vault: boolean;
};
const initial: Progress = {
  entered: false,
  unlocked: [],
  explored: [],
  reasons: 0,
  companion: { happiness: 70, love: 90, miss: 100 },
  chats: 0,
  vault: false,
};
type UniverseContext = {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  unlock: (id: string) => void;
  ready: boolean;
  toast: string;
  notify: (message: string) => void;
};
const Context = createContext<UniverseContext | null>(null);
export function UniverseProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
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
      value={{ progress, update, unlock, ready, toast, notify: setToast }}
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
