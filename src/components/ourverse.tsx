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
import { OurVerseCharacter, Couple } from "./characters";
import { World } from "./world";
import { Vault, Ending } from "./secrets";
import { Modal } from "./ui";
import { settings } from "@/config/settings";
import { relationship } from "@/data/relationship";
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
  const [menu, setMenu] = useState(false);
  const [ending, setEnding] = useState(false);
  const [transition, setTransition] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [dev, setDev] = useState(false);
  const [randomHug, setRandomHug] = useState(false);
  const [clock, setClock] = useState(()=>new Date());
  const main = useRef<HTMLElement>(null);
  const logoClicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(()=>{const tick=setInterval(()=>setClock(new Date()),60000);return()=>clearInterval(tick)},[]);
  useEffect(()=>{if(!progress.entered)return;let leave:ReturnType<typeof setTimeout>;const visit=setTimeout(()=>{setRandomHug(true);leave=setTimeout(()=>setRandomHug(false),6000)},settings.rareHugDelayMs);return()=>{clearTimeout(visit);clearTimeout(leave)}},[progress.entered]);
  const navigate = useCallback(
    (id: string, history = true) => {
      setSection(id);
      setMenu(false);
      if (history) window.history.pushState(null, "", `#${id}`);
      update((p) =>
        p.explored.includes(id) ? p : { ...p, explored: [...p.explored, id] },
      );
      if (id === "world") unlock("world");
      if (["room", "world", "mission"].includes(id)) discover(id);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [update, unlock, discover],
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
      navigate(
        [
          ...navigation.map((n) => n[0]),
          "daily",
          "mailbox",
          "heartbeat",
          "hand",
          "press",
          "mission",
          "patch",
          "generator",
        ].includes(id)
          ? id
          : "home",
        false,
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
    (simulation ? (["birthday","anniversary","late-night"].includes(simulation) ? simulation : "normal") : "") ||
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
          : Number(new Intl.DateTimeFormat("en-GB",{timeZone:relationship.recipientTimezone,hour:"numeric",hourCycle:"h23"}).format(clock))<5 ? "late-night" : "";
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
            <button className="return-galaxy" onClick={() => travel("home")}>
              ← Back to our galaxy
            </button>
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
          <footer className="universe-footer">
            <span>OUR OWN LITTLE INFINITY</span>
            <button onClick={() => travel("press")} aria-label="A little heart">
              ♡
            </button>
            <span>MADE WITH LOVE, FROM JANNA</span>
          </footer>
          <FloatingPlayer navigate={() => travel("music")} />
          {section !== "companion" && (
            <button
              className="companion-peek"
              onClick={() => travel("companion")}
              aria-label="Visit Mini Janna and Mini Josh"
            >
              <OurVerseCharacter character="janna" pose="wave" />
              <span>pssst Josh…</span>
            </button>
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
      {randomHug && !menu && !ending && <div className="random-hug" aria-hidden="true"><Couple scene="hug"/></div>}
      {ending && <Ending onClose={() => setEnding(false)} />}
      {process.env.NODE_ENV === "development" && dev && (
        <Modal
          title="Janna’s development controls"
          onClose={() => setDev(false)}
        >
          <p>Local browser only. Alt + Shift + D to reopen.</p>
          <div className="dev-controls">
            {[
              "all",
              "achievements",
              "coupons",
              "constellation",
              "plant",
              "games",
              "puzzle",
              "letters",
              "vault",
              "capsule",
              "ending",
            ].map((area) => (
              <button
                key={area}
                onClick={() => {
                  reset(area);
                  setDev(false);
                  navigate("home");
                }}
              >
                Reset {area}
              </button>
            ))}
            <button onClick={() => reset("unlock")}>
              Unlock all / complete constellation
            </button>
            {["birthday", "anniversary", "late-night", "normal", ""].map((value) => (
              <button key={value} onClick={() => simulate(value)}>
                Simulate {value || "real clock"}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
