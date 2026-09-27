"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { UniverseProvider, useUniverse } from "./provider";
import { MusicProvider, MusicRoom, FloatingPlayer } from "./music";
import { Galaxy, DestinationArt, destinations, Constellation } from "./galaxy";
import { MemoryRoom, Story, Letters, Love } from "./collections";
import { CompanionRoom } from "./companion";
import { Couple } from "./characters";
import { CornerCompanion } from "./corner-companion";
import { World } from "./world";
import { Vault, Ending } from "./secrets";
import { Modal } from "./ui";
import { settings } from "@/config/settings";
import { relationship } from "@/data/relationship";
import "./infinity-footer.css";
const GameRoom = dynamic(() => import("./games"), {
  loading: () => (
    <p className="section-loading">Turning on the arcade lights…</p>
  ),
});
const Experiences = dynamic(() => import("./experiences"), {
  loading: () => <p className="section-loading">Leaving a little light on…</p>,
});
const navigation = [
  ["home", "Galaxy"],
  ["room", "Our Home"],
  ["story", "Our Story"],
  ["memories", "Memories"],
  ["games", "Game Room"],
  ["letters", "Letters"],
  ["love", "Love"],
  ["music", "Music"],
  ["world", "Our World"],
  ["companion", "Mini Janna"],
  ["future", "Our Future"],
  ["coupons", "Love Coupons"],
  ["garden", "Love Garden"],
  ["messages", "Our Messages"],
  ["calendar", "Calendar"],
  ["jar", "Love Jar"],
  ["questions", "Couple Questions"],
  ["sleep", "Can’t Sleep"],
  ["travel", "Adventure Map"],
  ["gifts", "Mystery Gifts"],
  ["capsule", "Time Capsule"],
  ["vault", "The Secret Vault"],
];
const roomDestinationIds = [
  "coupons", "future", "jar", "questions", "gifts",
  "sleep", "mailbox", "memories", "letters", "music", "garden", "world", "calendar", "messages", "games",
];
const futureDestinationIds = ["capsule", "travel", "generator"];
export default function OurVerse() {
  return (
    <MotionConfig reducedMotion="user">
      <UniverseProvider>
        <MusicProvider>
          <Shell />
        </MusicProvider>
      </UniverseProvider>
    </MotionConfig>
  );
}
function Shell() {
  const {
    progress,
    update,
    unlock,
    ready,
    toast,
    discover,
    simulation,
    simulate,
    reset,
  } = useUniverse();
  const reduced = useReducedMotion();
  const [section, setSection] = useState("home");
  const [roomReturn, setRoomReturn] = useState<string | null>(null);
  const [futureReturn, setFutureReturn] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [ending, setEnding] = useState(false);
  const [transition, setTransition] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [dev, setDev] = useState(false);
  const [randomHug, setRandomHug] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const main = useRef<HTMLElement>(null);
  const logoClicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    if (!progress.entered) return;
    let leave: ReturnType<typeof setTimeout>;
    const visit = setTimeout(() => {
      setRandomHug(true);
      leave = setTimeout(() => setRandomHug(false), 6000);
    }, settings.rareHugDelayMs);
    return () => {
      clearTimeout(visit);
      clearTimeout(leave);
    };
  }, [progress.entered]);
  const navigate = useCallback(
    (id: string, history = true, restoreRoomReturn = false, restoreFutureReturn = false) => {
      const fromRoom = roomDestinationIds.includes(id) && (section === "room" || restoreRoomReturn);
      const fromFuture = futureDestinationIds.includes(id) && (section === "future" || restoreFutureReturn);
      setRoomReturn(fromRoom ? id : null);
      setFutureReturn(fromFuture ? id : null);
      setSection(id);
      setMenu(false);
      if (history) window.history.pushState(fromRoom ? { ourVerseRoomReturn: id } : fromFuture ? { ourVerseFutureReturn: id } : null, "", `#${id}`);
      update((p) =>
        p.explored.includes(id) ? p : { ...p, explored: [...p.explored, id] },
      );
      if (id === "world") unlock("world");
      if (["room", "world", "mission"].includes(id)) discover(id);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [section, update, unlock, discover],
  );
  function travel(id: string) {
    if (timer.current) clearTimeout(timer.current);
    if (reduced) {
      navigate(id);
      return;
    }
    setTransition(id);
    timer.current = setTimeout(() => {
      navigate(id);
      setTransition(null);
    }, 650);
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!ready || !progress.entered) return;
    const sync = () => {
      const id = location.hash.slice(1) || "home";
      const validId = [
        ...navigation.map((n) => n[0]),
        "daily",
        "mailbox",
        "heartbeat",
        "hand",
        "press",
        "mission",
        "patch",
        "generator",
      ].includes(id) ? id : "home";
      const restoreRoomReturn = window.history.state?.ourVerseRoomReturn === validId;
      const restoreFutureReturn = window.history.state?.ourVerseFutureReturn === validId;
      navigate(
        validId,
        false,
        restoreRoomReturn,
        restoreFutureReturn,
      );
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [ready, progress.entered, navigate]);
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
  }, [section]);
  useEffect(() => {
    let sequence: string[] = [];
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest(
          "input,textarea,select,[contenteditable]",
        )
      )
        return;
      sequence = [...sequence, e.key.toLowerCase()].slice(-10);
      if (
        sequence.join(",") ===
        "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a"
      ) {
        unlock("secret");
        discover("konami");
        navigate("mission");
      }
      if (e.shiftKey && e.key.toLowerCase() === "j") navigate("companion");
      if (
        process.env.NODE_ENV === "development" &&
        e.altKey &&
        e.shiftKey &&
        e.key.toLowerCase() === "d"
      )
        setDev((v) => !v);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [navigate, unlock, discover]);
  useEffect(() => {
    if (progress.explored.length >= 10) unlock("explorer");
    if (progress.discoveries.filter((id) => id.startsWith("game-")).length >= 4)
      unlock("arcade");
  }, [progress.explored.length, progress.discoveries, unlock]);
  function enter() {
    if (entering) return;
    setEntering(true);
    timer.current = setTimeout(
      () => {
        update((p) => ({
          ...p,
          entered: true,
          explored: [...new Set([...p.explored, "home"])],
        }));
        unlock("welcome");
        setEntering(false);
      },
      reduced ? 0 : 1200,
    );
  }
  const content =
    section === "home" ? (
      <Galaxy navigate={travel} />
    ) : section === "story" ? (
      <Story />
    ) : section === "memories" ? (
      <MemoryRoom />
    ) : section === "games" ? (
      <GameRoom />
    ) : section === "letters" ? (
      <Letters />
    ) : section === "love" ? (
      <>
        <Experiences section="traits" navigate={travel} />
        <Love />
      </>
    ) : section === "music" ? (
      <MusicRoom />
    ) : section === "world" ? (
      <World />
    ) : section === "companion" ? (
      <CompanionRoom />
    ) : section === "vault" ? (
      <Vault />
    ) : (
      <Experiences
        key={`${section}-${simulation}`}
        section={section}
        navigate={travel}
      />
    );
  const occasion =
    (simulation
      ? ["birthday", "anniversary", "late-night"].includes(simulation)
        ? simulation
        : "normal"
      : "") ||
    (() => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: relationship.authorTimezone,
        month: "2-digit",
        day: "2-digit",
      })
        .format(clock)
        .split("/");
      const date = parts.join("-");
      return settings.birthday === date
        ? "birthday"
        : settings.anniversary === date
          ? "anniversary"
          : Number(
                new Intl.DateTimeFormat("en-GB", {
                  timeZone: relationship.recipientTimezone,
                  hour: "numeric",
                  hourCycle: "h23",
                }).format(clock),
              ) < 5
            ? "late-night"
            : "";
    })();
  return (
    <>
      <div
        className={`starfield ${entering ? "warping" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 76 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              animationDelay: `${i % 7}s`,
              width: i % 5 === 0 ? 3 : 1,
              height: i % 5 === 0 ? 3 : 1,
            }}
          />
        ))}
      </div>
      {!ready ? (
        <div className="app-loading">Finding our little universe… ✧</div>
      ) : !progress.entered ? (
        <div className={`intro cinematic-intro ${entering ? "departing" : ""}`}>
          <div className="intro-orbit" />
          <div className="intro-moon" />
          <span className="eyebrow">A LITTLE PLACE OUTSIDE OF EVERYTHING</span>
          <h1>OURVERSE</h1>
          <span className="intro-names">Janna ♡ Josh</span>
          <p>
            somewhere between your world and mine,
            <br />
            we made our own.
          </p>
          <button
            className="primary-button"
            onClick={enter}
            disabled={entering}
          >
            Enter OurVerse ♡
          </button>
          <span className="intro-footer">
            ONE SKY. TWO HEARTS. OUR OWN LITTLE INFINITY.
          </span>
        </div>
      ) : (
        <div
          className={`app-shell universe-shell ${section === "sleep" ? "sleep-mode" : ""}`}
        >
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <header className="universe-header">
            <button
              className="universe-brand"
              onClick={() => {
                logoClicks.current++;
                if (logoClicks.current % 5 === 0) {
                  unlock("secret");
                  discover("logo-secret");
                  travel("patch");
                } else travel("home");
              }}
            >
              OURVERSE <span>✧</span>
            </button>
            <span className="header-dedication">
              JANNA ♡ JOSH <i> / </i> EST. APRIL 2026
            </span>
            <button
              ref={menuButton}
              className="universe-menu"
              aria-label="Open navigation"
              onClick={() => setMenu(true)}
            >
              Explore <span>☰</span>
            </button>
          </header>
          {occasion && occasion !== "normal" && (
            <button
              className={`occasion occasion-${occasion}`}
              onClick={() =>
                travel(occasion === "late-night" ? "sleep" : "letters")
              }
            >
              {occasion === "birthday"
                ? "✦ Happy birthday, my favorite human. ♡"
                : occasion === "anniversary"
                  ? "♡ Another chapter of choosing us. Happy anniversary."
                  : "Josh, why are you awake? Come sit with me. ☾"}
            </button>
          )}
          {section !== "home" && (
            <nav className="destination-return-nav" aria-label="Return navigation">
              <button className="return-galaxy" onClick={() => travel("home")}>
                ← Back to our galaxy
              </button>
              {roomReturn === section && (
                <a className="experience-home-return" href="#room">
                  ← Back to Our Home
                </a>
              )}
              {futureReturn === section && (
                <a className="experience-home-return" href="#future">
                  ← Back to Someday With You
                </a>
              )}
            </nav>
          )}
          <main
            ref={main}
            tabIndex={-1}
            id="main-content"
            className={`universe-main world-${section}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </main>
          {section !== "home" && (
            <div className="world-constellation">
              <Constellation />
            </div>
          )}
          <FloatingPlayer navigate={() => travel("music")} />
          <footer className="universe-footer infinity-footer">
            <div className="infinity-atmosphere" aria-hidden="true">
              <div className="infinity-haze" />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <i key={i} className={`infinity-star infinity-star-${i}`} />
              ))}
              {Array.from({ length: 28 }, (_, i) => (
                <i key={`distant-${i}`} className="infinity-star infinity-distant-star" style={{
                  left: `${4 + ((i * 37.71 + i * i * 3.13) % 92)}%`,
                  top: `${12 + ((i * 23.19 + i * i * 1.71) % 80)}%`,
                  width: i % 6 === 0 ? 2 : 1,
                  height: i % 6 === 0 ? 2 : 1,
                  animationDuration: `${7.3 + (i % 9) * 1.7}s`,
                  animationDelay: `${-i * 1.43}s`,
                }} />
              ))}
              <span className="infinity-dust dust-a" /><span className="infinity-dust dust-b" />
              <span className="infinity-dust dust-a" /><span className="infinity-dust dust-b" />

              <span className="infinity-shooting-star" />
              <span className="infinity-shooting-star infinity-shooting-star-two" />
              <span className="infinity-shooting-star infinity-shooting-star-three" />
            </div>
            <div className="infinity-letter">
              <p className="infinity-message">our own little infinity.</p>
              <p className="infinity-signature">
                made with love, from Janna
                <button className="infinity-heart" onClick={() => travel("press")} aria-label="A little heart">
                  <span className="infinity-heart-glyph" aria-hidden="true">♡</span>
                  <span className="infinity-heart-particles" aria-hidden="true"><i /><i /><i /></span>
                </button>
              </p>
            </div>
            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                className="dev-mode-pill"
                onClick={() => setDev(true)}
                title="Open Janna’s development controls (Alt + Shift + D)"
              >
                Janna Mode ✦
              </button>
            )}
          </footer>
          {section !== "companion" && (
            <CornerCompanion destination={section} onVisit={() => travel("companion")} />
          )}
          {progress.discoveries.length >= settings.constellationTarget && (
            <button
              className="ending-trigger"
              aria-label="One more little secret"
              onClick={() => setEnding(true)}
            >
              ✦
            </button>
          )}
        </div>
      )}
      {transition && (
        <div
          className={`world-transition transition-${transition}`}
          aria-hidden="true"
        >
          <DestinationArt
            kind={destinations.find((d) => d.id === transition)?.art || "stars"}
          />
          <span>
            {destinations.find((d) => d.id === transition)?.name ||
              "A little closer…"}
          </span>
        </div>
      )}
      {menu && (
        <Modal
          title="Where shall we go?"
          onClose={() => {
            setMenu(false);
            queueMicrotask(() => menuButton.current?.focus());
          }}
        >
          <nav className="explore-menu" aria-label="Main navigation">
            {navigation.map(([id, title]) => (
              <button
                key={id}
                aria-label={title}
                aria-current={section === id ? "page" : undefined}
                onClick={() => travel(id)}
              >
                {title}
                <span>↗</span>
              </button>
            ))}
          </nav>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          ✦ {toast}
        </div>
      )}
      {randomHug && !menu && !ending && (
        <div className="random-hug" aria-hidden="true">
          <Couple scene="hug" />
        </div>
      )}
      {ending && <Ending onClose={() => setEnding(false)} />}
      {process.env.NODE_ENV === "development" && dev && (
        <Modal
          title="Janna’s development controls"
          onClose={() => setDev(false)}
        >
          <p>Local browser testing only. Alt + Shift + D to toggle.</p>
          <div className="dev-controls">
            <div className="dev-group">
              <h4>Love Plant previews</h4>
              <div className="dev-buttons">
                {[
                  "Seed",
                  "Sprout",
                  "Small plant",
                  "Large plant",
                  "Flowering",
                ].map((label, stage) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      update((p) => ({
                        ...p,
                        plantActions: Array.from(
                          { length: stage * 4 },
                          (_, i) => `dev-plant-${i}`,
                        ),
                      }));
                      setDev(false);
                      navigate("garden");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dev-group">
              <h4>✦ Unlocks & Simulations</h4>
              <div className="dev-buttons">
                <button
                  type="button"
                  className="dev-action-primary"
                  onClick={() => {
                    reset("unlock-all");
                    setDev(false);
                    navigate("home");
                  }}
                >
                  Unlock all / full universe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("mature-plant");
                    setDev(false);
                    navigate("garden");
                  }}
                >
                  Mature Love Plant (Stage 4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("vault-unlock");
                    setDev(false);
                    navigate("vault");
                  }}
                >
                  Unlock Secret Vault
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("capsule-available");
                    setDev(false);
                    navigate("capsule");
                  }}
                >
                  Simulate Capsule / Gifts Open
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("constellation-full");
                    setDev(false);
                    navigate("home");
                  }}
                >
                  Full Constellation (Ending Ready)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("achievements-all");
                    setDev(false);
                    navigate("love");
                  }}
                >
                  Unlock All Achievements
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simulate("birthday");
                    setDev(false);
                  }}
                >
                  Simulate Birthday
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simulate("anniversary");
                    setDev(false);
                  }}
                >
                  Simulate Anniversary
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simulate("late-night");
                    setDev(false);
                  }}
                >
                  Simulate Late-Night (Can’t Sleep)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    simulate("");
                    setDev(false);
                  }}
                >
                  Reset Clock to Real Time
                </button>
              </div>
            </div>

            <div className="dev-group">
              <h4>↺ Reset Progress</h4>
              <div className="dev-buttons">
                <button
                  type="button"
                  onClick={() => {
                    reset("all");
                    setDev(false);
                    navigate("home");
                  }}
                >
                  Reset all progress
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("plant");
                    setDev(false);
                    navigate("garden");
                  }}
                >
                  Reset Love Plant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("achievements");
                    setDev(false);
                  }}
                >
                  Reset achievements
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("exploration");
                    setDev(false);
                  }}
                >
                  Reset exploration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("constellation");
                    setDev(false);
                  }}
                >
                  Reset constellation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("coupons");
                    setDev(false);
                    navigate("coupons");
                  }}
                >
                  Reset coupons
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("games");
                    setDev(false);
                    navigate("games");
                  }}
                >
                  Reset all games
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("puzzle");
                    setDev(false);
                  }}
                >
                  Reset Piece of Us
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("crossword");
                    setDev(false);
                  }}
                >
                  Reset crossword
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("code");
                    setDev(false);
                  }}
                >
                  Reset code puzzles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("vault");
                    setDev(false);
                  }}
                >
                  Reset vault lock
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("capsule");
                    setDev(false);
                  }}
                >
                  Reset time capsule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset("ending");
                    setDev(false);
                  }}
                >
                  Reset ending
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
