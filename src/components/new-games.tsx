"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { puzzlePhotos, crossword, codePuzzles, quotes } from "@/data/expansion";
import { useUniverse } from "./provider";
import { Couple, OurVerseCharacter } from "./characters";
function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === i)) [a[0], a[1]] = [a[1], a[0]];
  return a;
}
export function PhotoPuzzle() {
  const [size, setSize] = useState(3);
  const [photo, setPhoto] = useState(0);
  const [pieces, setPieces] = useState(() => shuffle(9));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const { discover, unlock } = useUniverse();
  const won = pieces.every((v, i) => v === i);
  useEffect(() => {
    if (won) {
      unlock("puzzle");
      discover("game-puzzle");
    }
  }, [won, unlock, discover]);
  function restart(n = size) {
    setPieces(shuffle(n * n));
    setSelected(null);
    setMoves(0);
  }
  return (
    <div className="photo-puzzle">
      <span className="eyebrow">PIECE OF US</span>
      <h2>Somehow, we fit.</h2>
      <p>Tap two pieces to swap them. Every piece can move anywhere.</p>
      <div className="puzzle-options">
        <label>
          Difficulty{" "}
          <select
            value={size}
            onChange={(e) => {
              const n = Number(e.target.value);
              setSize(n);
              restart(n);
            }}
          >
            {[3, 4, 5].map((n, i) => (
              <option key={n} value={n}>
                {["Easy", "Medium", "Hard"][i]} · {n} × {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Photo{" "}
          <select
            value={photo}
            onChange={(e) => {
              setPhoto(Number(e.target.value));
              restart();
            }}
          >
            {puzzlePhotos.map((p, i) => (
              <option key={p.src} value={i}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="placeholder-note">
        Illustrated placeholders · ready for a photo of Janna + Josh.
      </p>
      <div
        className={`photo-pieces ${won ? "puzzle-complete" : ""}`}
        style={{ gridTemplateColumns: `repeat(${size},1fr)` }}
      >
        {pieces.map((piece, i) => (
          <button
            key={i}
            aria-label={`Position ${i + 1}, piece ${piece + 1}${piece === i ? ", correct" : ""}`}
            aria-pressed={selected === i}
            disabled={won}
            className={`${selected === i ? "selected" : ""} ${piece === i ? "correct-piece" : ""}`}
            style={{
              backgroundImage: `url(${puzzlePhotos[photo].src})`,
              backgroundSize: `${size * 100}% ${size * 100}%`,
              backgroundPosition: `${((piece % size) * 100) / (size - 1)}% ${(Math.floor(piece / size) * 100) / (size - 1)}%`,
            }}
            onClick={() => {
              if (selected === null) {
                setSelected(i);
                return;
              }
              if (selected !== i) {
                setPieces((p) => {
                  const next = [...p];
                  [next[i], next[selected]] = [next[selected], next[i]];
                  return next;
                });
                setMoves((m) => m + 1);
              }
              setSelected(null);
            }}
          >
            <span>{piece === i ? "✦" : piece + 1}</span>
          </button>
        ))}
      </div>
      <p>
        {moves} swaps · {pieces.filter((v, i) => v === i).length} /{" "}
        {pieces.length} pieces home
      </p>
      {won && (
        <div className="game-result" role="status">
          <h2>YOU FIXED US ♡</h2>
          <p>
            No matter how scattered things get,
            <br />
            somehow we always find our way back together.
          </p>
          <Couple scene="celebrate" />
        </div>
      )}
      <button className="secondary-button" onClick={() => restart()}>
        Shuffle again
      </button>
    </div>
  );
}
export function Crossword() {
  const { unlock, discover } = useUniverse();
  const [values, setValues] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState(false);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const cells = useMemo(() => {
    const result: Record<
      string,
      { letter: string; number?: number; entries: number[] }
    > = {};
    crossword.entries.forEach((e, index) =>
      e.answer.split("").forEach((letter, i) => {
        const key = `${e.row + (e.direction === "down" ? i : 0)}-${e.col + (e.direction === "across" ? i : 0)}`;
        if (!result[key]) result[key] = { letter, entries: [] };
        result[key].entries.push(index);
        if (i === 0) result[key].number = e.number;
      }),
    );
    return result;
  }, []);
  const entry = crossword.entries[active];
  const entryKeys = entry.answer
    .split("")
    .map(
      (_, i) =>
        `${entry.row + (entry.direction === "down" ? i : 0)}-${entry.col + (entry.direction === "across" ? i : 0)}`,
    );
  const won = Object.entries(cells).every(
    ([key, cell]) => values[key] === cell.letter,
  );
  useEffect(() => {
    if (won) {
      unlock("crossword");
      discover("game-crossword");
    }
  }, [won, unlock, discover]);
  function clue(index: number) {
    const e = crossword.entries[index];
    inputs.current[`${e.row}-${e.col}`]?.focus();
    setActive(index);
  }
  return (
    <div className="crossword-game">
      <span className="eyebrow">OURVERSE HISTORIAN IN TRAINING</span>
      <h2>OurVerse Crossword</h2>
      <p>
        Tap a clue, then type. Arrow keys move through the grid; tap a crossing
        twice to change direction.
      </p>
      <p className="active-clue" aria-live="polite">
        {entry.number} {entry.direction}: {entry.clue}
      </p>
      <div className="crossword-layout">
        <div
          className="crossword-grid"
          style={{ gridTemplateColumns: `repeat(${crossword.cols},1fr)` }}
        >
          {Array.from({ length: crossword.rows * crossword.cols }, (_, i) => {
            const row = Math.floor(i / crossword.cols),
              col = i % crossword.cols,
              key = `${row}-${col}`,
              cell = cells[key];
            return cell ? (
              <label
                key={key}
                className={`${entryKeys.includes(key) ? "active-word" : ""} ${checked && values[key] !== cell.letter ? "wrong-cell" : ""}`}
              >
                <small>{cell.number}</small>
                <input
                  ref={(el) => {
                    inputs.current[key] = el;
                  }}
                  aria-label={`Row ${row + 1}, column ${col + 1}${cell.number ? `, clue ${cell.number}` : ""}`}
                  maxLength={1}
                  value={values[key] || ""}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  inputMode="text"
                  onFocus={() => {
                    if (!cell.entries.includes(active))
                      setActive(cell.entries[0]);
                  }}
                  onClick={() => {
                    if (cell.entries.length > 1)
                      setActive(
                        cell.entries[
                          (cell.entries.indexOf(active) + 1) %
                            cell.entries.length
                        ],
                      );
                  }}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^a-z]/gi, "")
                      .toUpperCase();
                    setValues((v) => ({ ...v, [key]: value }));
                    setChecked(false);
                    if (value) {
                      const next = entryKeys[entryKeys.indexOf(key) + 1];
                      if (next) inputs.current[next]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    let target = "";
                    if (e.key === "Backspace" && !values[key])
                      target = entryKeys[entryKeys.indexOf(key) - 1];
                    if (e.key === "ArrowRight") target = `${row}-${col + 1}`;
                    if (e.key === "ArrowLeft") target = `${row}-${col - 1}`;
                    if (e.key === "ArrowDown") target = `${row + 1}-${col}`;
                    if (e.key === "ArrowUp") target = `${row - 1}-${col}`;
                    if (target && inputs.current[target]) {
                      e.preventDefault();
                      inputs.current[target]?.focus();
                    }
                  }}
                />
              </label>
            ) : (
              <span className="crossword-block" key={key} />
            );
          })}
        </div>
        <div className="crossword-clues">
          {["across", "down"].map((dir) => (
            <section key={dir}>
              <h3>{dir.toUpperCase()}</h3>
              {crossword.entries.map(
                (e, i) =>
                  e.direction === dir && (
                    <button
                      key={e.number}
                      className={active === i ? "active" : ""}
                      onClick={() => clue(i)}
                    >
                      {e.number}. {e.clue}
                    </button>
                  ),
              )}
            </section>
          ))}
        </div>
      </div>
      <div className="dialog-actions">
        <button className="secondary-button" onClick={() => setChecked(true)}>
          Check letters
        </button>
        <button
          className="secondary-button"
          disabled={won}
          onClick={() => {
            const key = entryKeys.find((k) => values[k] !== cells[k].letter);
            if (key) setValues((v) => ({ ...v, [key]: cells[key].letter }));
          }}
        >
          Hint: one letter
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            setValues({});
            setChecked(false);
          }}
        >
          Reset crossword
        </button>
      </div>
      {checked && !won && (
        <p role="status">Highlighted squares need another look.</p>
      )}
      {won && (
        <div className="game-result" role="status">
          <h2>Turns out you really do know us. ♡</h2>
          <Couple scene="celebrate" />
        </div>
      )}
    </div>
  );
}
export function CrackCode() {
  const { progress, update, unlock, discover } = useUniverse();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState(false);
  const current = codePuzzles[progress.fragments];
  return (
    <div className="code-game">
      <span className="eyebrow">OPERATION: J ♡ J</span>
      <h2>Crack the Code</h2>
      <div
        className="key-fragments"
        aria-label={`${progress.fragments} of ${codePuzzles.length} key fragments`}
      >
        {codePuzzles.map((_, i) => (
          <span key={i}>{i < progress.fragments ? "◆" : "◇"}</span>
        ))}
      </div>
      {current ? (
        <>
          <span className="eyebrow">
            DOSSIER {progress.fragments + 1} · {current.type}
          </span>
          <p className="cipher">{current.clue}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                answer.toUpperCase().replace(/[^A-Z0-9]/g, "") ===
                current.answer
              ) {
                const next = progress.fragments + 1;
                update((p) => ({
                  ...p,
                  fragments: Math.min(codePuzzles.length, p.fragments + 1),
                  vault: next === codePuzzles.length || p.vault,
                }));
                setFeedback("KEY FRAGMENT ACQUIRED. A little closer.");
                setAnswer("");
                setHint(false);
                if (next === codePuzzles.length) {
                  unlock("code");
                  unlock("vault");
                  discover("game-code");
                }
              } else
                setFeedback("Not quite. Try a different angle, agent Josh.");
            }}
          >
            <label htmlFor="code-answer">Decoded message</label>
            <input
              id="code-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={40}
              autoComplete="off"
            />
            <button className="primary-button" disabled={!answer.trim()}>
              Submit answer
            </button>
          </form>
          <button className="text-button" onClick={() => setHint(true)}>
            Request a clue
          </button>
          {hint && <p>{current.hint}</p>}
        </>
      ) : (
        <div className="game-result">
          <h2>ACCESS GRANTED ♡</h2>
          <p>All six fragments found. The Secret Vault is open.</p>
          <Couple scene="celebrate" />
        </div>
      )}
      <p role="status">{feedback}</p>
    </div>
  );
}
export function KissAttack() {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(20);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [target, setTarget] = useState({ id: 0, x: 50, y: 50, hit: false });
  const { unlock, discover } = useUniverse();
  const hit = useRef(false);
  const score = useRef(0);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (!hit.current) setMissed((n) => n + 1);
      hit.current = false;
      setTarget((t) => ({
        id: t.id + 1,
        x: 12 + Math.random() * 76,
        y: 15 + Math.random() * 65,
        hit: false,
      }));
      setRemaining((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (remaining > 0 || !running) return;
    const timer = setTimeout(() => {
      setRunning(false);
      discover("game-kisses");
      if (score.current >= 10) unlock("kisses");
    }, 0);
    return () => clearTimeout(timer);
  }, [remaining, running, discover, unlock]);
  function catchKiss() {
    if (!running || hit.current) return;
    hit.current = true;
    score.current++;
    setCaught(score.current);
    setTarget((t) => ({ ...t, hit: true }));
  }
  return (
    <div>
      <span className="eyebrow">SIGNED, SEALED, SMOOCHED</span>
      <h2>Kiss Attack</h2>
      <p>
        Tap the kiss before it disappears. Keyboard: press Space in the arena.
      </p>
      <div className="game-score">
        <span>{caught} caught</span>
        <span>{missed} missed</span>
        <span>{remaining}s</span>
      </div>
      <div
        className="kiss-arena"
        tabIndex={0}
        aria-label="Kiss arena. Press Space to catch a kiss."
        onKeyDown={(e) => {
          if (e.code === "Space") {
            e.preventDefault();
            catchKiss();
          }
        }}
      >
        {running && remaining > 0 && !target.hit && (
          <button
            className="kiss-target"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label="Catch kiss"
            onClick={catchKiss}
          >
            ♡
          </button>
        )}
        {!running && (
          <div className="arena-overlay">
            <OurVerseCharacter
              character="janna"
              expression={remaining === 0 ? "blushing" : "happy"}
            />
            <p>
              {remaining === 0
                ? `Janna owes you ${caught} real kisses.`
                : "Incoming affection. Prepare yourself."}
            </p>
            <button
              className="primary-button"
              onClick={() => {
                score.current = 0;
                hit.current = false;
                setCaught(0);
                setMissed(0);
                setRemaining(20);
                setTarget({ id: 0, x: 50, y: 50, hit: false });
                setRunning(true);
              }}
            >
              {remaining === 0 ? "Play again" : "Start Kiss Attack"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export function WhoSaidIt() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const { discover } = useUniverse();
  const done = index >= quotes.length;
  return (
    <div className="who-game">
      <span className="eyebrow">SOUNDS SUSPICIOUSLY FAMILIAR</span>
      <h2>Who Said It?</h2>
      <p className="placeholder-note">
        Sample quotes · replace with our real conversations.
      </p>
      {done ? (
        <div className="game-result">
          <h2>
            {score} / {quotes.length} little memories
          </h2>
          <Couple scene="celebrate" />
          <button
            className="secondary-button"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setAnswer(null);
            }}
          >
            Play again
          </button>
        </div>
      ) : (
        <>
          <blockquote className="emotional-line">
            “{quotes[index].text}”
          </blockquote>
          <div className="speaker-choices">
            {(["Janna", "Josh"] as const).map((name) => (
              <button
                key={name}
                disabled={answer !== null}
                onClick={() => {
                  setAnswer(name);
                  if (name === quotes[index].speaker) setScore((s) => s + 1);
                }}
              >
                <OurVerseCharacter
                  character={name === "Janna" ? "janna" : "josh"}
                  expression="happy"
                />
                {name}
              </button>
            ))}
          </div>
          {answer && (
            <>
              <p role="status">
                {answer === quotes[index].speaker
                  ? "You know us. ♡"
                  : `That was ${quotes[index].speaker}!`}
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setIndex((i) => i + 1);
                  setAnswer(null);
                  if (index === quotes.length - 1) discover("game-quotes");
                }}
              >
                Next quote
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
