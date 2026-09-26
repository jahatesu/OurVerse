"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Home,
  BookHeart,
  Camera,
  Gamepad2,
  Mail,
  Heart,
  Music2,
  Globe2,
  Sparkles,
  Menu,
  X,
  LockKeyhole,
  ArrowRight,
  Star,
  VolumeX,
} from "lucide-react";
import { UniverseProvider, useUniverse } from "./provider";
import { MusicProvider, MusicRoom, FloatingPlayer } from "./music";
import { Dashboard } from "./dashboard";
import { MemoryRoom, Story, Letters, Love } from "./collections";
import { CompanionRoom } from "./companion";
import { World } from "./world";
import { Vault, Ending } from "./secrets";
const GameRoom = dynamic(() => import("./games"), {
  loading: () => (
    <div className="section-loading">Gathering a little stardust… ✧</div>
  ),
});
const navigation = [
  { id: "home", title: "Home", icon: Home },
  { id: "story", title: "Our Story", icon: BookHeart },
  { id: "memories", title: "Memories", icon: Camera },
  { id: "games", title: "Game Room", icon: Gamepad2 },
  { id: "letters", title: "Letters", icon: Mail },
  { id: "love", title: "Love", icon: Heart },
  { id: "music", title: "Music", icon: Music2 },
  { id: "world", title: "Our World", icon: Globe2 },
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
  const { progress, update, unlock, ready, toast, notify } = useUniverse();
  const [section, setSection] = useState("home");
  const [mobile, setMobile] = useState(false);
  const [ending, setEnding] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [heartClicks, setHeartClicks] = useState(0);
  const cursor = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (!mobile) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobile(false);
        document
          .querySelector<HTMLButtonElement>(".mobile-bar .icon-button")
          ?.focus();
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", close);
    };
  }, [mobile]);
  const navigate = useCallback(
    (id: string, history = true) => {
      setSection(id);
      setMobile(false);
      if (history) window.history.pushState(null, "", `#${id}`);
      update((p) =>
        p.explored.includes(id) ? p : { ...p, explored: [...p.explored, id] },
      );
      if (id === "world") unlock("world");
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [update, unlock],
  );
  useEffect(() => {
    if (!ready || !progress.entered) return;
    const sync = () => {
      const id = window.location.hash.slice(1) || 'home';
      if ([...navigation.map((n) => n.id), "companion", "vault"].includes(id))
        navigate(id, false);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [navigate, ready, progress.entered]);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    main.current?.focus({ preventScroll: true });
  }, [section]);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !cursor.current) return;
      cursor.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    let sequence: string[] = [];
    const code = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).matches("input, textarea")) return;
      sequence = [...sequence, event.key].slice(-10);
      if (sequence.join(",") === code.join(",")) {
        unlock("secret");
        notify(
          "A hidden constellation! The vault key remembers April 21, 2026.",
        );
      }
      if (event.shiftKey && event.key.toLowerCase() === "j")
        navigate("companion");
    };
    window.addEventListener("keydown", key);
    console.info(
      "✧ OurVerse: built with love, for Josh. Some constellations are found one arrow at a time. ♡",
    );
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", key);
    };
  }, [unlock, notify, navigate]);
  function enter() {
    update((p) => ({
      ...p,
      entered: true,
      explored: [...new Set([...p.explored, "home"])],
    }));
    unlock("welcome");
    notify("Welcome home, Josh ♡");
  }
  function logo() {
    setLogoClicks((n) => n + 1);
    if ((logoClicks + 1) % 5 === 0) {
      unlock("secret");
      notify(
        "A little clue: our beginning is the key. Eight digits. MMDDYYYY.",
      );
      navigate("vault");
    } else navigate("home");
  }
  const content =
    section === "home" ? (
      <Dashboard navigate={navigate} />
    ) : section === "story" ? (
      <Story />
    ) : section === "memories" ? (
      <MemoryRoom />
    ) : section === "games" ? (
      <GameRoom />
    ) : section === "letters" ? (
      <Letters />
    ) : section === "love" ? (
      <Love />
    ) : section === "music" ? (
      <MusicRoom />
    ) : section === "world" ? (
      <World />
    ) : section === "companion" ? (
      <CompanionRoom />
    ) : (
      <Vault />
    );
  return (
    <>
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 38 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              animationDelay: `${i % 7}s`,
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
            }}
          />
        ))}
      </div>
      <div className="cursor-glow" ref={cursor} aria-hidden="true" />
      {!ready ? (
        <div className="app-loading">
          <Sparkles />
          <span>Finding our little universe…</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!progress.entered ? (
            <motion.div
              key="intro"
              className="intro"
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.6 }}
            >
              <div className="intro-orbit" />
              <span className="intro-star">✦</span>
              <span className="eyebrow">FOR JANNA’S FAVORITE HUMAN</span>
              <h1>
                OurVerse<span>✧</span>
              </h1>
              <p>A little universe made just for you.</p>
              <button className="primary-button" onClick={enter}>
                Enter OurVerse ♡ <ArrowRight size={18} />
              </button>
              <small>
                Somewhere between the stars, there’s a place for us.
              </small>
              <div className="intro-footer">
                HANDCRAFTED WITH LOVE · EST. APRIL 2026
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="app-shell"
            >
              <a className="skip-link" href="#main-content">
                Skip to content
              </a>
              <div className="mobile-bar">
                <button className="brand" onClick={logo}>
                  <Sparkles size={23} />
                  OurVerse<span>♡</span>
                </button>
                <button
                  className="icon-button"
                  onClick={() => setMobile(!mobile)}
                  aria-label={mobile ? "Close navigation" : "Open navigation"}
                  aria-expanded={mobile}
                  aria-controls="main-navigation"
                >
                  {mobile ? <X /> : <Menu />}
                </button>
              </div>
              {mobile && (
                <button
                  className="nav-scrim"
                  aria-label="Close navigation"
                  onClick={() => setMobile(false)}
                />
              )}
              <aside className={`sidebar ${mobile ? "open" : ""}`}>
                <button className="brand desktop-brand" onClick={logo}>
                  <Sparkles size={25} />
                  OurVerse<span>♡</span>
                </button>
                <p className="brand-tagline">a little universe. just us.</p>
                <div className="sidebar-divider" />
                <span className="nav-label">OUR UNIVERSE</span>
                <nav id="main-navigation" aria-label="Main navigation">
                  {navigation.map(({ id, title, icon: Icon }) => (
                    <button
                      key={id}
                      className={`nav-item ${section === id ? "active" : ""}`}
                      aria-current={section === id ? "page" : undefined}
                      aria-label={title}
                      onClick={() => navigate(id)}
                    >
                      <Icon size={18} />
                      <span>{title}</span>
                      {section === id && <span className="nav-active-dot" />}
                      {id === "letters" && <small>10</small>}
                    </button>
                  ))}
                </nav>
                <div className="sidebar-divider" />
                <span className="nav-label">A LITTLE EXTRA MAGIC</span>
                <button
                  className={`nav-item ${section === "companion" ? "active" : ""}`}
                  aria-label="Mini Janna"
                  onClick={() => navigate("companion")}
                >
                  <span className="mini-janna-icon">✿</span>
                  <span>Mini Janna</span>
                  <span className="mini-new">NEW</span>
                </button>
                <button
                  className={`nav-item vault-nav ${section === "vault" ? "active" : ""}`}
                  onClick={() => navigate("vault")}
                >
                  <LockKeyhole size={16} />
                  <span>The Secret Vault</span>
                </button>
                <div className="sidebar-bottom">
                  <div className="sidebar-love">
                    <span>J</span>
                    <Heart size={12} />
                    <span>J</span>
                    <div>
                      <strong>Our favorite little thing.</strong>
                      <small>Janna & Josh · since 2026</small>
                    </div>
                  </div>
                  <p>
                    Built with a whole lot of{" "}
                    <button
                      aria-label="A little heart"
                      onClick={() => {
                        setHeartClicks((n) => n + 1);
                        if (heartClicks >= 6) {
                          unlock("secret");
                          notify(
                            "Seven little hearts, one very big love. Try the stars next.",
                          );
                        }
                      }}
                    >
                      ♡
                    </button>
                  </p>
                </div>
              </aside>
              <div className="main-shell">
                <header className="topbar">
                  <span>
                    <span className="topbar-home">Our Universe</span>
                    <span className="breadcrumb-slash">/</span>
                    {navigation.find((n) => n.id === section)?.title ??
                      (section === "companion" ? "Mini Janna" : "Secret Vault")}
                  </span>
                  <div>
                    <span className="just-us">
                      <span className="status-dot" /> Just you & me
                    </span>
                    <span className="topbar-divider" />
                    <button
                      className="icon-button hidden-star"
                      aria-label="A small star"
                      onClick={() => {
                        unlock("secret");
                        notify(
                          "You found a wish! The date everything started opens a secret door.",
                        );
                      }}
                    >
                      <Star size={17} />
                    </button>
                    <span className="user-avatar">
                      J<span>♡</span>
                    </span>
                  </div>
                </header>
                <main id="main-content" tabIndex={-1} ref={main}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={section}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {content}
                    </motion.div>
                  </AnimatePresence>
                  <footer className="main-footer">
                    <span>
                      OURVERSE <span>✧</span> OUR OWN LITTLE INFINITY
                    </span>
                    <span>
                      Made with love, from the Philippines to Colorado.
                    </span>
                  </footer>
                </main>
              </div>
              <FloatingPlayer navigate={() => navigate("music")} />
              {progress.explored.length >= 7 && (
                <button
                  className="ending-trigger"
                  aria-label="One more little secret"
                  onClick={() => setEnding(true)}
                >
                  ♡
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Sparkles size={17} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      {ending && <Ending onClose={() => setEnding(false)} />}
      <span className="sr-only">
        <VolumeX />
        Music never plays automatically.
      </span>
    </>
  );
}
