"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Brain,
  Heart,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { quiz } from "@/data/quiz";
import { dateIdeas } from "@/data/dateIdeas";
import { heartMessages } from "@/data/messages";
import { pick } from "@/lib/utils";
import { useUniverse } from "./provider";
import { SectionHeading } from "./ui";
const games = [
  {
    id: "quiz",
    title: "How well do you know Janna?",
    description: "Time to put those boyfriend credentials to the test.",
    icon: Brain,
    tag: "THE BOYFRIEND EXAM",
    color: "lavender",
  },
  {
    id: "match",
    title: "Memory Match",
    description: "Find the pairs. Keep the memories. Win my heart.",
    icon: Sparkles,
    tag: "A LITTLE BRAIN MAGIC",
    color: "blue",
  },
  {
    id: "catch",
    title: "Catch My Hearts",
    description: "All this love has to go somewhere. Catch it!",
    icon: Heart,
    tag: "POCKET-SIZED ARCADE",
    color: "pink",
  },
  {
    id: "roulette",
    title: "Date Roulette",
    description: "Can’t decide what to do? Leave it to the stars.",
    icon: Shuffle,
    tag: "TONIGHT, SORTED",
    color: "peach",
  },
];
export default function GameRoom() {
  const [game, setGame] = useState<string | null>(null);
  return (
    <>
      <SectionHeading
        eyebrow="PLAYER TWO HAS ENTERED"
        title="A little playful competition."
        description="High scores, tiny victories, and a very biased cheerleader. Ready, Josh?"
      />
      {game ? (
        <>
          <button
            className="text-button back-button"
            onClick={() => setGame(null)}
          >
            <ArrowLeft size={16} /> Back to the game room
          </button>
          <section className="game-panel">
            {game === "quiz" ? (
              <Quiz />
            ) : game === "match" ? (
              <MemoryMatch />
            ) : game === "catch" ? (
              <CatchHearts />
            ) : (
              <Roulette />
            )}
          </section>
        </>
      ) : (
        <div className="game-hub">
          {games.map(
            ({ id, title, description, icon: Icon, tag, color }, i) => (
              <button
                key={id}
                className={`game-hub-card ${color}`}
                onClick={() => setGame(id)}
              >
                <div className="game-illustration">
                  <Icon size={65} strokeWidth={1} />
                  <span>✧</span>
                  <small>0{i + 1}</small>
                </div>
                <span className="eyebrow">{tag}</span>
                <h2>{title}</h2>
                <p>{description}</p>
                <span className="text-button">
                  Let’s play <span>→</span>
                </span>
              </button>
            ),
          )}
        </div>
      )}
    </>
  );
}
function Quiz() {
  const { unlock } = useUniverse();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const question = quiz[index];
  function answer(option: number) {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.answer) setScore((s) => s + 1);
  }
  function next() {
    if (index + 1 === quiz.length) {
      setDone(true);
      if (score === quiz.length) unlock("quiz");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }
  return (
    <div className="quiz-game">
      <span className="eyebrow">THE VERY OFFICIAL BOYFRIEND EXAM</span>
      {done ? (
        <div className="game-result">
          <Trophy size={56} />
          <h2>
            {score >= quiz.length - 1
              ? "Boyfriend privileges maintained ♡"
              : score > 1
                ? "Cute enough to get extra credit."
                : "WHO ARE YOU AND WHAT DID YOU DO WITH JOSH?"}
          </h2>
          <p>
            {score} / {quiz.length} correct answers
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setDone(false);
            }}
          >
            <RotateCcw size={16} /> Play again
          </button>
        </div>
      ) : (
        <>
          <div className="game-score">
            <span>
              Question {index + 1} / {quiz.length}
            </span>
            <span>{score} correct</span>
          </div>
          <div className="reason-progress">
            <i style={{ width: `${((index + 1) / quiz.length) * 100}%` }} />
          </div>
          <h2>{question.question}</h2>
          <div className="quiz-options">
            {question.options.map((option, i) => (
              <button
                disabled={selected !== null}
                className={
                  selected !== null
                    ? i === question.answer
                      ? "correct"
                      : selected === i
                        ? "incorrect"
                        : ""
                    : ""
                }
                onClick={() => answer(i)}
                key={option}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
                {selected !== null && i === question.answer && " ✓"}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="quiz-feedback" aria-live="polite">
              <p>
                {selected === question.answer
                  ? "Exactly right! ♡ "
                  : "A little reminder: "}
                {question.explanation}
              </p>
              <button className="primary-button" onClick={next}>
                {index + 1 === quiz.length ? "See my results" : "Next question"}{" "}
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
const symbols = ["♡", "☾", "✿", "✧", "☀", "♫"];
function shuffledDeck() {
  const cards = [...symbols, ...symbols].map((symbol, id) => ({ symbol, id }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
function MemoryMatch() {
  const { unlock } = useUniverse();
  const [cards, setCards] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const won = matched.length === symbols.length;
  useEffect(() => {
    if (!started || won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [started, won]);
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((id) => cards.find((card) => card.id === id)!);
    const timer = setTimeout(() => {
      if (a.symbol === b.symbol) setMatched((m) => [...m, a.symbol]);
      setFlipped([]);
    }, 750);
    return () => clearTimeout(timer);
  }, [flipped, cards]);
  useEffect(() => {
    if (won) unlock("memory");
  }, [won, unlock]);
  function restart() {
    setCards(shuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
  }
  return (
    <div className="match-game">
      <span className="eyebrow">SOME THINGS JUST BELONG TOGETHER</span>
      <h2>Memory Match</h2>
      <div className="game-score">
        <span>{moves} moves</span>
        <span>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
        <span>{matched.length} / 6 pairs</span>
      </div>
      <div className="match-grid">
        {cards.map((card) => {
          const revealed =
            flipped.includes(card.id) || matched.includes(card.symbol);
          return (
            <motion.button
              key={card.id}
              animate={{ rotateY: revealed ? 0 : 180 }}
              className={`match-card ${revealed ? "revealed" : ""} ${matched.includes(card.symbol) ? "matched" : ""}`}
              aria-label={
                revealed
                  ? `${card.symbol} ${matched.includes(card.symbol) ? "matched" : "revealed"}`
                  : `Reveal card ${card.id + 1}`
              }
              disabled={revealed || flipped.length === 2}
              onClick={() => {
                setStarted(true);
                setFlipped((f) => [...f, card.id]);
                if (flipped.length === 1) setMoves((m) => m + 1);
              }}
            >
              <span>{revealed ? card.symbol : "✦"}</span>
            </motion.button>
          );
        })}
      </div>
      {won && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="win-banner"
          role="status"
        >
          ✧ A perfect pair. Just like us. You won! ✧
        </motion.div>
      )}
      <button className="secondary-button" onClick={restart}>
        <RotateCcw size={15} /> Restart
      </button>
    </div>
  );
}
type FallingHeart = { id: number; x: number; y: number };
function CatchHearts() {
  const { unlock } = useUniverse();
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [basket, setBasket] = useState(50);
  const [message, setMessage] = useState("");
  const area = useRef<HTMLDivElement>(null);
  const engine = useRef({
    hearts: [] as FallingHeart[],
    basket: 50,
    score: 0,
    lives: 3,
    spawn: 0,
    nextId: 0,
  });
  const keys = useRef({ left: false, right: false });
  const move = useCallback((x: number) => {
    engine.current.basket = Math.max(8, Math.min(92, x));
    setBasket(engine.current.basket);
  }, []);
  useEffect(() => {
    if (!running) return;
    let frame: number;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const state = engine.current;
      if (keys.current.left) move(state.basket - 65 * dt);
      if (keys.current.right) move(state.basket + 65 * dt);
      state.spawn += dt;
      if (state.spawn > Math.max(0.3, 0.85 - state.score * 0.017)) {
        state.hearts.push({
          id: state.nextId++,
          x: 10 + Math.random() * 80,
          y: -5,
        });
        state.spawn = 0;
      }
      const speed = 23 + state.score * 0.8;
      state.hearts = state.hearts.filter((heart) => {
        heart.y += speed * dt;
        if (
          heart.y >= 84 &&
          heart.y <= 94 &&
          Math.abs(heart.x - state.basket) < 11
        ) {
          state.score++;
          setScore(state.score);
          setMessage(
            state.score === 20
              ? "✧ 20 hearts! Certified Heart Catcher! ✧"
              : pick(heartMessages),
          );
          if (state.score === 20) unlock("hearts");
          return false;
        }
        if (heart.y > 100) {
          state.lives--;
          setLives(Math.max(0, state.lives));
          return false;
        }
        return true;
      });
      setHearts([...state.hearts]);
      if (state.lives <= 0) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, move, unlock]);
  useEffect(() => {
    if (!running) return;
    const stop = () => {
      keys.current = { left: false, right: false };
      setRunning(false);
    };
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, [running]);
  function start() {
    engine.current = {
      hearts: [],
      basket: 50,
      score: 0,
      lives: 3,
      spawn: 0,
      nextId: 0,
    };
    setHearts([]);
    setScore(0);
    setLives(3);
    setBasket(50);
    setMessage("Catch a little love!");
    setStarted(true);
    setRunning(true);
    area.current?.focus();
  }
  return (
    <div className="catch-game">
      <span className="eyebrow">LOVE IS IN THE AIR. LITERALLY.</span>
      <h2>Catch My Hearts</h2>
      <div className="game-score">
        <span>{score} hearts caught</span>
        <span aria-label={`${lives} lives`}>
          {"♥".repeat(Math.max(0, lives))}
          {"♡".repeat(3 - Math.max(0, lives))}
        </span>
      </div>
      <div
        className="catch-arena"
        ref={area}
        tabIndex={0}
        role="application"
        aria-label="Catch hearts. Move with arrow keys, A and D, or drag your finger."
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
            e.preventDefault();
            keys.current[
              e.key === "ArrowLeft" || e.key === "a" ? "left" : "right"
            ] = true;
          }
        }}
        onKeyUp={(e) => {
          if (["ArrowLeft", "a"].includes(e.key)) keys.current.left = false;
          if (["ArrowRight", "d"].includes(e.key)) keys.current.right = false;
        }}
        onPointerDown={(e) => {
          if (!running) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const rect = e.currentTarget.getBoundingClientRect();
          move(((e.clientX - rect.left) / rect.width) * 100);
        }}
        onPointerMove={(e) => {
          if (!running) return;
          if (e.pointerType === "mouse" || e.buttons) {
            const rect = e.currentTarget.getBoundingClientRect();
            move(((e.clientX - rect.left) / rect.width) * 100);
          }
        }}
      >
        <span className="arena-stars">✧ · . ✦ . · ✧</span>
        {hearts.map((heart) => (
          <span
            className="falling-heart"
            key={heart.id}
            style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
          >
            ♥
          </span>
        ))}
        <div className="heart-basket" style={{ left: `${basket}%` }}>
          ╰♥╯
        </div>
        {!running && (
          <div className="arena-overlay">
            <Heart size={40} />
            <h3>
              {!started
                ? "A whole sky of love."
                : lives <= 0
                  ? `${score} little pieces of my heart ♡`
                  : "Taking a tiny breather."}
            </h3>
            <button
              className="primary-button"
              onClick={
                started && lives > 0
                  ? () => {
                      setRunning(true);
                      area.current?.focus();
                    }
                  : start
              }
            >
              {started && lives > 0
                ? "Resume"
                : started
                  ? "Play again"
                  : "Let’s catch hearts"}
            </button>
          </div>
        )}
      </div>
      <p className="catch-message" aria-live="polite">
        {message || "Catch 20 to unlock a special achievement."}
      </p>
      <div className="game-controls">
        <span>← → / A D · Mouse · Touch & drag</span>
        {running && (
          <button className="text-button" onClick={() => setRunning(false)}>
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
function Roulette() {
  const reduced = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const target = useRef(0);
  const colors = [
    "#76639f",
    "#ad778e",
    "#647fa0",
    "#947199",
    "#79709e",
    "#aa887f",
    "#607f88",
    "#8c6d96",
  ];
  function spin() {
    if (spinning) return;
    const index = Math.floor(Math.random() * dateIdeas.length);
    target.current = index;
    const angle = 360 / dateIdeas.length;
    const desired = (360 - (index * angle + angle / 2)) % 360;
    const current = rotation % 360;
    setRotation(rotation + 1800 + ((desired - current + 360) % 360));
    setSelected(null);
    setSpinning(true);
  }
  return (
    <div className="roulette-game">
      <span className="eyebrow">LET THE UNIVERSE PLAN TONIGHT</span>
      <h2>Date Roulette</h2>
      <div className="wheel-wrap">
        <span className="wheel-pointer">▼</span>
        <motion.div
          className="roulette-wheel"
          style={{
            background: `conic-gradient(${dateIdeas.map((_, i) => `${colors[i % colors.length]} ${(i * 100) / dateIdeas.length}% ${((i + 1) * 100) / dateIdeas.length}%`).join(",")})`,
          }}
          animate={{ rotate: rotation }}
          transition={{
            duration: reduced ? 0.1 : 4.8,
            ease: [0.12, 0.8, 0.18, 1],
          }}
          onAnimationComplete={() => {
            if (spinning) {
              setSelected(target.current);
              setSpinning(false);
            }
          }}
        >
          {dateIdeas.map((idea, i) => (
            <div
              className="wheel-label"
              key={idea}
              style={{
                transform: `rotate(${(i * 360) / dateIdeas.length + 180 / dateIdeas.length}deg)`,
              }}
            >
              <span>{idea}</span>
            </div>
          ))}
        </motion.div>
        <span className="wheel-center">♡</span>
      </div>
      <button className="primary-button" onClick={spin} disabled={spinning}>
        {spinning ? "Consulting the stars…" : "Spin our next adventure"}{" "}
        <Shuffle size={16} />
      </button>
      <div className="roulette-result" aria-live="polite">
        {selected !== null ? (
          <>
            <span className="eyebrow">IT’S A DATE</span>
            <h3>{dateIdeas[selected]} ♡</h3>
            <p>Put your phones on do-not-disturb. Except for each other.</p>
          </>
        ) : (
          <p>Eight possibilities. One favorite person.</p>
        )}
      </div>
    </div>
  );
}
