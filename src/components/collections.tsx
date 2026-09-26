"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useReducedMotion } from "motion/react";
import { Heart, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { memories } from "@/data/memories";
import { timeline } from "@/data/timeline";
import { letters } from "@/data/letters";
import { reasons } from "@/data/reasons";
import { achievements } from "@/data/achievements";
import type { Memory, Milestone, Letter } from "@/data/types";
import { dateLabel } from "@/lib/utils";
import { SectionHeading, Modal } from "./ui";
import { useUniverse } from "./provider";
import { Couple } from "./characters";
import { dreams } from "@/data/expansion";
import { settings } from "@/config/settings";
import { relationship } from "@/data/relationship";
export function MemoryRoom() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Memory | null>(null);
  const { unlock, discover, progress } = useUniverse();
  return (
    <>
      <SectionHeading
        eyebrow="OUR VERY OWN TIME CAPSULE"
        title="Pinned to my heart."
        description="The big moments. The blurry screenshots. The little things that mean everything."
      />
      <div className="filter-tabs" aria-label="Memory categories">
        {[
          "All",
          "Us",
          "Calls",
          "Screenshots",
          "Funny",
          "Favorites",
          "I Miss You",
        ].map((item) => (
          <button
            aria-pressed={category === item}
            className={category === item ? "active" : ""}
            key={item}
            onClick={() => {
              setCategory(item);
              if (item === "Calls") unlock("call");
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <Couple scene="sit" caption="remember this little piece of us?" />
      <div
        className="memory-grid scrapbook"
        onPointerMove={(e) => {
          if (
            e.pointerType !== "mouse" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          const box = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--paper-drift",
            `${(e.clientX - box.left - box.width / 2) / 90}px`,
          );
        }}
        onPointerLeave={(e) =>
          e.currentTarget.style.setProperty("--paper-drift", "0px")
        }
      >
        {memories
          .filter((m) => category === "All" || m.category === category)
          .map((memory, i) => (
            <motion.button
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, rotate: [-2, 2, -1][i % 3] }}
              className="polaroid"
              key={memory.id}
              onClick={() => {
                setSelected(memory);
                discover("memory");
              }}
            >
              <span className="tape" />
              <Image
                src={memory.image}
                alt={memory.caption}
                width={600}
                height={430}
              />
              <span>{memory.caption}</span>
              <small>
                {dateLabel(memory.date)} · {memory.category}
              </small>
            </motion.button>
          ))}
      </div>
      {dreams
        .filter((d) => progress.dreams[d.id])
        .map((d) => (
          <button
            key={d.id}
            className="polaroid dream-memory"
            onClick={() =>
              setSelected({
                id: d.id,
                image: d.photo,
                date: progress.dreams[d.id],
                caption: d.title,
                description: d.description,
                category: "Us",
              })
            }
          >
            <Image src={d.photo} alt={d.title} width={350} height={240} />
            <span>{d.title}</span>
            <small>
              {dateLabel(progress.dreams[d.id])} · A dream became a memory
            </small>
          </button>
        ))}
      <p className="placeholder-note">
        Illustrated sample memories — ready for our real photographs.
      </p>
      {selected && (
        <Modal title={selected.caption} onClose={() => setSelected(null)}>
          <Image
            className="modal-photo"
            src={selected.image}
            alt={selected.caption}
            width={900}
            height={650}
          />
          <span className="eyebrow">
            {dateLabel(selected.date)} · {selected.category}
          </span>
          <p>{selected.description}</p>
          <div className="modal-pagination">
            <button
              onClick={() =>
                setSelected(
                  memories[
                    (memories.indexOf(selected) + memories.length - 1) %
                      memories.length
                  ],
                )
              }
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setSelected(
                  memories[(memories.indexOf(selected) + 1) % memories.length],
                )
              }
            >
              Next →
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Story() {
  const { discover, progress } = useUniverse();
  const [selected, setSelected] = useState<Milestone | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end center"],
  });
  const reduced = useReducedMotion();
  return (
    <>
      <SectionHeading
        eyebrow="EVERY CHAPTER LEADS TO YOU"
        title="The story of us."
        description="A few moments that turned you and me into our favorite word: us."
      />
      <div className="timeline story-constellation" ref={timelineRef}>
        <svg
          className="story-lines"
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M130 200L490 80L830 260"
            fill="none"
            stroke="#c2afd8"
            strokeDasharray="5 8"
          />
        </svg>
        <motion.div
          className="timeline-progress"
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
          aria-hidden="true"
        />
        {timeline.map((item, i) => (
          <motion.button
            className={`timeline-item ${progress.discoveries.includes(`story-${i}`) ? "illuminated" : ""}`}
            key={item.title}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            onClick={() => {
              setSelected(item);
              discover(`story-${i}`);
            }}
          >
            <span className="timeline-dot">{item.icon}</span>
            <div className="timeline-copy">
              <span className="eyebrow">
                CHAPTER 0{i + 1} · {dateLabel(item.date)}
              </span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span className="text-button">
                Step into this memory <ArrowRight size={14} />
              </span>
            </div>
            <Image src={item.photo} alt={item.title} width={450} height={325} />
          </motion.button>
        ))}
      </div>
      <p className="story-next">
        And so many unwritten chapters… <span>♡</span>
      </p>
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <Image
            className="modal-photo"
            src={selected.photo}
            alt={selected.title}
            width={900}
            height={650}
          />
          <span className="eyebrow">{dateLabel(selected.date)}</span>
          <p>{selected.description}</p>
          {selected.specialMessage && (
            <blockquote>{selected.specialMessage}</blockquote>
          )}
        </Modal>
      )}
    </>
  );
}
export function Letters() {
  const { discover, simulation } = useUniverse();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  return (
    <>
      <SectionHeading
        eyebrow="WORDS TO KEEP YOU COMPANY"
        title="For whenever you need me."
        description="A little piece of my heart, sealed just for you. Pick the one you need today."
      />
      <div className="letters-grid">
        {letters.map((letter) => {
          const birthdayToday =
            new Intl.DateTimeFormat("en-US", {
              timeZone: relationship.recipientTimezone,
              month: "2-digit",
              day: "2-digit",
            })
              .format(new Date(now))
              .replace("/", "-") === settings.birthday;
          const locked =
            simulation === "unlocked"
              ? false
              : letter.occasion === "birthday"
                ? !(birthdayToday || simulation === "birthday")
                : !!letter.unlockDate &&
                  now < new Date(letter.unlockDate).getTime() &&
                  !(
                    simulation === "anniversary" && letter.id === "anniversary"
                  );
          return (
            <button
              key={letter.id}
              className={`letter-card ${locked ? "locked" : ""}`}
              disabled={locked || opening !== null}
              onClick={() => setOpening(letter.id)}
            >
              <motion.div
                className={`envelope ${opening === letter.id ? "envelope-opening" : ""}`}
                animate={
                  opening === letter.id
                    ? {
                        rotateX: [0, 60, 0],
                        y: [0, -15, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.65 }}
                onAnimationComplete={() => {
                  if (opening === letter.id) {
                    setSelected(letter);
                    discover("letter");
                    setOpening(null);
                  }
                }}
              >
                <i className="envelope-paper" aria-hidden="true">
                  dear Josh, ♡
                </i>
                <div className="envelope-flap" />
                <span>
                  {locked ? <LockKeyhole size={20} /> : <Heart size={22} />}
                </span>
              </motion.div>
              <h3>{letter.title}</h3>
              <p>
                {locked
                  ? letter.occasion === "birthday"
                    ? settings.birthday
                      ? "For your birthday"
                      : "Birthday date to be added"
                    : `Opens ${dateLabel(letter.unlockDate!)}`
                  : "A little love, just for you"}
              </p>
            </button>
          );
        })}
      </div>
      <p className="placeholder-note">
        Letters include sample prose, ready for Janna’s own words.
      </p>
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="letter-paper">
            <Mail size={24} />
            <p>{selected.body}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Love() {
  const { progress, update, unlock, discover } = useUniverse();
  const [showAchievements, setShowAchievements] = useState(false);
  function reveal() {
    if (progress.reasons >= 100) return;
    update((p) => ({ ...p, reasons: Math.min(100, p.reasons + 1) }));
    if (progress.reasons === 0) discover("reasons");
    if (progress.reasons === 99) {
      unlock("reasons");
      discover("100-reasons");
      update((p) => ({ ...p, vault: true }));
    }
  }
  return (
    <>
      <SectionHeading
        eyebrow="IN CASE YOU EVER FORGET"
        title="A hundred little reasons."
        description="Why you? I’m so glad you asked. Let me count the ways."
      />
      <section className="reasons-card">
        <div className="reasons-orb">♡</div>
        <span className="eyebrow">REASONS I LOVE YOU</span>
        <motion.p
          key={progress.reasons}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {progress.reasons
            ? reasons[progress.reasons - 1]
            : "Some things are too lovely to keep to myself."}
        </motion.p>
        <div className="reason-progress">
          <i style={{ width: `${progress.reasons}%` }} />
        </div>
        <span className="reason-count">
          {progress.reasons} <span>/ 100 little reasons</span>
        </span>
        <button
          className="primary-button"
          onClick={reveal}
          disabled={progress.reasons >= 100}
        >
          {progress.reasons >= 100
            ? "All 100, kept forever ♡"
            : "Reveal a reason ♡"}
        </button>
        {progress.reasons === 100 && (
          <div className="secret-reason">
            <h3>You really thought there were only 100?</h3>
            <p>
              There’s an infinity left. The Secret Vault is now open for you —
              find its mysterious object in our galaxy.
            </p>
          </div>
        )}
      </section>
      <button
        className="achievement-toggle"
        onClick={() => setShowAchievements(!showAchievements)}
      >
        <span>✧ &nbsp; Boyfriend achievements</span>
        <span>
          {progress.unlocked.length} / {achievements.length} &nbsp;{" "}
          {showAchievements ? "−" : "+"}
        </span>
      </button>
      {showAchievements && <AchievementGrid />}
      {progress.reasons > 0 && (
        <details className="revealed-reasons">
          <summary>Your collection of reasons</summary>
          <ol>
            {reasons.slice(0, progress.reasons).map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}
export function AchievementGrid() {
  const { progress } = useUniverse();
  return (
    <div className="achievements-grid">
      {achievements.map((achievement) => {
        const unlocked = progress.unlocked.includes(achievement.id);
        return (
          <article
            key={achievement.id}
            className={`achievement ${unlocked ? "unlocked" : ""} rarity-${achievement.rarity.toLowerCase()}`}
          >
            <span className="achievement-icon">
              {unlocked ? achievement.icon : <LockKeyhole size={22} />}
            </span>
            <span className="eyebrow">
              {achievement.rarity} · {unlocked ? "Unlocked" : "Locked"}
            </span>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
          </article>
        );
      })}
    </div>
  );
}
