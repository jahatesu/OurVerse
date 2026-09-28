"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Letter } from "@/data/types";
import "./opened-letter-scene.css";

type OpenedLetterSceneProps = {
  letter: Letter;
  onClose: () => void;
};

function letterIdentity(letter: Letter) {
  const title = letter.title.toLowerCase();
  if (letter.id === "anniversary") return "champagne";
  if (letter.id === "birthday") return "sage";
  if (title.includes("distant")) return "midnight";
  if (title.includes("stressed") || title.includes("jealous")) return "sage";
  if (title.includes("motivation") || title.includes("insecure")) return "violet";
  if (title.includes("sad") || title.includes("fight")) return "ivory";
  if (title.includes("you’re mad") || title.includes("bad day")) return "peach";
  return "rose";
}

function OpenEnvelope() {
  return (
    <div className="ol-envelope" aria-hidden="true">
      <div className="ol-envelope-back" />
      <div className="ol-envelope-inner" />
      <div className="ol-envelope-flap" />
      <div className="ol-envelope-front" />
      <i className="ol-wax-fragment ol-wax-fragment-a" />
      <i className="ol-wax-fragment ol-wax-fragment-b" />
    </div>
  );
}

function PressedFlower() {
  return (
    <svg className="ol-pressed-flower" viewBox="0 0 82 155" aria-hidden="true">
      <path d="M39 145Q31 91 44 31M38 101Q17 92 10 69M41 83q24-13 31-35" fill="none" stroke="#6f8069" strokeWidth="3" />
      <path d="M36 103q-21-18-29 2 18 15 29-2Zm7-21q23-20 31 2-20 15-31-2Z" fill="#83927d" opacity=".88" />
      <g fill="#c9869b" stroke="#efd0c7" strokeWidth="1.5">
        <path d="M42 34c-23-17-26 20-4 15-7 23 27 17 16-3 24 5 18-27-2-17Z" />
        <path d="M17 70c-13-10-15 12-2 9-4 14 16 10 10-2 14 3 11-16-1-10Z" />
      </g>
      <path className="ol-flower-tape" d="M17 56 66 48l5 22-50 8Z" fill="#eadcc3" opacity=".58" />
    </svg>
  );
}

function KissMark() {
  return (
    <svg className="ol-kiss" viewBox="0 0 100 60" aria-hidden="true">
      <path d="M8 28Q31 1 51 20 70 1 93 27 69 34 51 31 30 35 8 28Z" />
      <path d="M9 33q21 27 43 12 20 14 41-14-21 6-41 3-22 5-43-1Z" opacity=".72" />
      <path d="M24 29q27-8 55-1M29 36q22 8 45-1" fill="none" stroke="#6f304b" strokeWidth="2" opacity=".38" />
    </svg>
  );
}

function ReadingWindow() {
  return (
    <svg className="ol-window" viewBox="0 0 290 500" aria-hidden="true">
      <defs>
        <linearGradient id="ol-window-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#17162f" /><stop offset=".58" stopColor="#4c3a6b" /><stop offset="1" stopColor="#9a687e" /></linearGradient>
      </defs>
      <path d="M28 473V165Q28 34 145 18q117 16 117 147v308Z" fill="#18162a" stroke="#69546f" strokeWidth="18" />
      <path d="M49 455V166Q49 62 145 40q96 22 96 126v289Z" fill="url(#ol-window-sky)" />
      <path d="M145 40v415M49 276h192" stroke="#40364f" strokeWidth="7" />
      <path d="M89 129a35 35 0 1 0 33 49 31 31 0 1 1-33-49Z" fill="#dfd4c2" opacity=".8" />
      <g fill="#efdbbd"><circle cx="192" cy="118" r="2" /><circle cx="79" cy="224" r="2" /><path d="m204 206 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" /></g>
      <g className="ol-window-clouds" fill="#c997af" opacity=".38"><path d="M49 357q35-38 70-7 32-43 71-4 27-17 51 14v61H49Z" /><path d="M49 408q39-32 78-1 47-39 114 10v38H49Z" fill="#756188" /></g>
      <path d="M268 91q-41 73-17 154t-10 189" fill="none" stroke="#526b60" strokeWidth="7" />
      <path d="M254 181q-29-18-34 12 25 12 34-12Zm-2 84q24-21 32 6-21 16-32-6Zm-7 113q-29-15-32 15 26 9 32-15Z" fill="#718577" />
      <g fill="#c48b9e"><circle cx="251" cy="222" r="8" /><circle cx="259" cy="325" r="7" /><circle cx="235" cy="408" r="8" /></g>
    </svg>
  );
}

function CozyReadingProps() {
  return (
    <svg className="ol-cozy-props" viewBox="0 0 420 330" aria-hidden="true">
      <defs><radialGradient id="ol-lantern-glow"><stop stopColor="#ffd28b" stopOpacity=".55" /><stop offset="1" stopColor="#e59c67" stopOpacity="0" /></radialGradient></defs>
      <ellipse className="ol-lantern-glow" cx="120" cy="155" rx="120" ry="115" fill="url(#ol-lantern-glow)" />
      <path d="M15 271h224v24H8Z" fill="#493447" /><path d="M28 242h230v30H18Z" fill="#694b60" /><path d="M43 211h210v33H31Z" fill="#3e334c" stroke="#a27883" />
      <path d="M67 230h105" stroke="#d4b7a6" strokeWidth="2" /><text x="73" y="225" fill="#d8bdac" fontFamily="Georgia,serif" fontSize="10" letterSpacing="2">OUR LETTERS</text>
      <g transform="translate(63 53)"><path d="M21 23Q24 0 49 0t29 23" fill="none" stroke="#9c7c68" strokeWidth="5" /><path d="M15 37h71l-8 111H25Z" fill="#3b3041" stroke="#a67f64" strokeWidth="3" /><path d="M29 49h42l-5 79H35Z" fill="#e8ad61" opacity=".7" /><path className="ol-flame" d="M50 116q-14-18 2-36 15 21 2 37Z" fill="#ffe0a0" /><path d="M8 30h86v10H8Zm10 112h69l-9 13H27Z" fill="#765859" /></g>
      <g className="ol-cat" transform="translate(236 210)"><ellipse cx="65" cy="73" rx="80" ry="16" fill="#090a15" opacity=".5" /><path d="M17 57Q17 18 54 17q54-4 68 41-15 22-56 20Q31 80 17 57Z" fill="#242235" /><path d="m31 25 6-21 16 17m21-1L92 4l-3 28" fill="#29263b" stroke="#493850" strokeWidth="2" /><path d="M23 54Q3 35 13 16m103 32q34 4 30 27" fill="none" stroke="#242235" strokeWidth="13" strokeLinecap="round" /><path d="M43 41q5 4 10 0m16 0q5 4 10 0" fill="none" stroke="#d4b991" strokeWidth="2" /></g>
      <g fill="#c993a4"><circle cx="31" cy="298" r="7" /><circle cx="54" cy="287" r="5" /><circle cx="264" cy="302" r="6" /></g>
    </svg>
  );
}

function DeskDetails() {
  return (
    <svg className="ol-desk-details" viewBox="0 0 900 150" aria-hidden="true">
      <path d="M0 104q430-24 900 2v44H0Z" fill="#17131f" opacity=".92" />
      <path d="M95 87h225" stroke="#bd936f" strokeWidth="10" strokeLinecap="round" transform="rotate(-4 208 91)" />
      <path d="m319 69 25 12-28 7Z" fill="#d8c4a8" />
      <path d="M650 72h150l17 77H635Z" fill="#d5c2ad" opacity=".68" transform="rotate(4 726 110)" />
      <circle cx="545" cy="104" r="28" fill="#895269" /><path d="m545 88 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill="#e2ba9c" />
      <path d="M413 116q19-35 36 1m-19-8 4-34" fill="none" stroke="#6d836f" strokeWidth="4" /><circle cx="435" cy="76" r="8" fill="#c58a9c" />
    </svg>
  );
}

export function OpenedLetterScene({ letter, onClose }: OpenedLetterSceneProps) {
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const identity = letterIdentity(letter);
  const regularTitle = letter.title.toLowerCase().startsWith("open when ");
  const paperTitle = regularTitle ? letter.title.slice(10) : letter.title;

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 620);
  }

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const scene = (
    <section className={`opened-letter-scene ol-${identity}${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="opened-letter-title">
      <div className="ol-night-depth" aria-hidden="true" />
      <div className="ol-stars" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--ol-star": index, "--ol-sx": `${(index * 37 + 7) % 96}%`, "--ol-sy": `${(index * 53 + 11) % 91}%`, "--ol-time": `${6 + index * .13}s`, "--ol-delay": `${index * -.4}s` } as CSSProperties} />)}</div>
      <div className="ol-distant-envelopes" aria-hidden="true"><i /><i /><i /></div>
      <ReadingWindow />
      <CozyReadingProps />
      <DeskDetails />
      <button ref={closeRef} className="ol-close" onClick={requestClose} aria-label="Close letter">×</button>
      <div className="ol-letter-stage">
        <OpenEnvelope />
        <article className="ol-paper">
          <div className="ol-paper-grain" aria-hidden="true" />
          <header className="ol-paper-header">
            <small>{regularTitle ? "Open when" : "A keepsake for you"}</small>
            <h1 id="opened-letter-title">{paperTitle}</h1>
            <span>for my Josh ♡</span>
          </header>
          <div className="ol-rule" aria-hidden="true"><i /><i /><i /></div>
          <p className="ol-letter-body">{letter.body}</p>
          <span className="ol-margin-doodle ol-doodle-heart" aria-hidden="true">♡</span>
          <span className="ol-margin-doodle ol-doodle-jj" aria-hidden="true">J + J</span>
          <span className="ol-margin-doodle ol-doodle-stars" aria-hidden="true">✦ · ✧</span>
          <PressedFlower />
          <KissMark />
        </article>
      </div>
    </section>
  );
  return typeof document === "undefined" ? null : createPortal(scene, document.body);
}
