"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Letter } from "@/data/types";
import "./opened-letter-scene.css";

function LetterBody({ letter }: { letter: Letter }) {
  if (letter.id === "anniversary") return <AnniversaryLetterBody letter={letter} />;
  if (letter.id === "birthday") return <BirthdayLetterBody letter={letter} />;
  if (letter.id === "letter-0") return <AngryLetterBody letter={letter} />;
  if (letter.id === "letter-1") return <MadAtMeLetterBody letter={letter} />;
  if (letter.id === "letter-2") return <SadLetterBody letter={letter} />;
  if (letter.id === "letter-3") return <StressedLetterBody letter={letter} />;
  if (letter.id === "letter-4") return <MissMeLetterBody letter={letter} />;
  if (letter.id === "letter-5") return <FightLetterBody letter={letter} />;
  if (letter.id === "letter-6") return <DistantLetterBody letter={letter} />;
  if (letter.id === "letter-7") return <MotivationLetterBody letter={letter} />;
  if (letter.id === "letter-8") return <LoveReminderLetterBody letter={letter} />;
  if (letter.id === "letter-9") return <BadDayLetterBody letter={letter} />;
  if (letter.id === "letter-10") return <InsecureLetterBody letter={letter} />;
  if (letter.id === "letter-11") return <JealousLetterBody letter={letter} />;
  return <p className="ol-letter-body">{letter.body}</p>;
}

const angerLevels = [100, 75, 40, 10, 0];
const angerAttempts = [
  "attempt #1: say “i’m sorry baby”",
  "attempt #2: give janna kisses",
  "attempt #3: cuddle her and admit she’s always right",
  "attempt #4: look cute and say “i love you”",
];
const angerActions = ["TRY TO MAKE IT UP TO HER", "TRY HARDER", "KEEP GOING", "FINAL ATTEMPT"];

function MiniAngerJanna({ stage }: { stage: number }) {
  return (
    <svg className={`ol-anger-mini-janna ol-anger-reaction-${stage}`} viewBox="0 0 52 76" aria-hidden="true">
      <ellipse cx="26" cy="71" rx="16" ry="3" fill="#4d35404d" />
      <path d="M15 28Q7 7 26 4q20 3 12 31l-3 17H16Z" fill="#9d4d43" />
      <circle cx="26" cy="21" r="12" fill="#e4b39f" />
      <path d="M13 23Q12 4 28 4q16 2 11 22l-6-10-2 17-11-2-4-15Z" fill="#aa5045" />
      <path className="ol-anger-brows" d="m20 20 5-2m8 2-5-2" fill="none" stroke="#5a3033" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 26q3-2 6 0" fill="none" stroke="#6d3a3d" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 42q10-8 21 0l3 24H13Z" fill="#554052" />
      <g className="ol-anger-janna-arms" fill="none" stroke="#554052" strokeWidth="5" strokeLinecap="round">
        <path d="M17 44q8 8 18 5" />
        <path d="M36 43q-7 10-18 7" />
      </g>
      <g className="ol-anger-janna-open-arms" fill="none" stroke="#554052" strokeWidth="5" strokeLinecap="round">
        <path d="M17 43 10 53" />
        <path d="M36 43 41 52" />
      </g>
      <path d="M20 64v7m13-7v7" stroke="#392f40" strokeWidth="5" strokeLinecap="round" />
      <g className="ol-anger-marks" fill="none" stroke="#985265" strokeWidth="1.7" strokeLinecap="round"><path d="m8 20-5-3m7-2-2-5m35 7 5-3m-7 0 2-5" /></g>
    </svg>
  );
}

function MiniAngerJosh() {
  return (
    <svg className="ol-anger-mini-josh" viewBox="0 0 48 76" aria-hidden="true">
      <ellipse cx="24" cy="71" rx="15" ry="3" fill="#4d35404d" />
      <path d="M14 42q10-8 21 0l3 24H11Z" fill="#34394b" />
      <path className="ol-anger-josh-leg-a" d="M19 64v7" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" />
      <path className="ol-anger-josh-leg-b" d="M32 64v7" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" />
      <circle cx="25" cy="22" r="12" fill="#d8a98f" />
      <path d="M12 23Q11 7 25 7q17 0 14 19l-7-9-1 9-10-8-5 9Z" fill="#252735" />
      <path d="M32 22h10v7H32m-15-7H8v7h9m0-5h15" fill="none" stroke="#3f3643" strokeWidth="1.5" />
      <path className="ol-anger-josh-arms" d="M15 45 9 56m27-11 6 8" stroke="#34394b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function AngerMeter() {
  const [stage, setStage] = useState(0);
  const level = angerLevels[stage];

  return (
    <section className={`ol-anger-meter ol-anger-stage-${stage}`} aria-label={`Janna's anger level: ${level}%`}>
      <h2>JANNA’S ANGER LEVEL</h2>
      <div className="ol-anger-scene">
        <div className="ol-anger-gauge">
          <div className="ol-anger-track" aria-hidden="true"><i style={{ width: `${level}%` }} /><span /><span /><span /><span /></div>
          <strong>{level}%</strong>
          <p>{stage === 0 ? "DANGER. DO NOT APPROACH." : `anger level: ${level}%`}</p>
        </div>
        <div className="ol-anger-ground" aria-hidden="true" />
        <div className="ol-anger-janna"><MiniAngerJanna stage={stage} /></div>
        {stage >= 3 && <div className="ol-anger-josh"><MiniAngerJosh /></div>}
        {stage >= 2 && <div className="ol-anger-kisses" aria-hidden="true"><i>♡</i><i>♡</i><i>♡</i></div>}
        {stage === 4 && <span className="ol-anger-heart" aria-hidden="true">♡</span>}
      </div>
      {stage > 0 && (
        <ol className="ol-anger-attempts" aria-live="polite">
          {angerAttempts.slice(0, stage).map((attempt, index) => <li key={attempt} className={index === stage - 1 ? "is-current" : ""}>{attempt}</li>)}
        </ol>
      )}
      {stage < 4 ? (
        <button type="button" className="ol-anger-action" onClick={() => setStage((current) => Math.min(4, current + 1))}>{angerActions[stage]}</button>
      ) : (
        <div className="ol-anger-success" aria-live="polite">
          <strong>JANNA HAS BEEN SUCCESSFULLY DE-ANGRIFIED.</strong>
          <small>warning: results may vary depending on what you actually did.</small>
        </div>
      )}
    </section>
  );
}

function AngryLetterBody({ letter }: { letter: Letter }) {
  const sectionStart = letter.body.indexOf("okay, wait.");
  const meterStart = letter.body.indexOf("JANNA’S ANGER LEVEL", sectionStart);
  const existingContinuationStart = letter.body.indexOf("now text me this so i know you read my letter:", meterStart);
  const response = '"i have officially read the terms and conditions of having an angry girlfriend. i accept my punishment"';
  const beforeInsertion = letter.body.slice(0, sectionStart).trimEnd();
  const insertionIntro = letter.body.slice(sectionStart, meterStart).trim();
  const existingContinuation = letter.body.slice(existingContinuationStart);
  const [beforeResponse, afterResponse] = existingContinuation.split(response);

  return (
    <div className="ol-letter-body ol-angry-letter-body">
      <p>{beforeInsertion}</p>
      <p>{insertionIntro}</p>
      <AngerMeter />
      <p>{beforeResponse}<span className="ol-response-quote">{response}</span>{afterResponse}</p>
    </div>
  );
}

const joshNeeds = [
  { label: "I NEED SOME SPACE", response: "okay, my love. take all the time you need. i’ll still be here when you’re ready." },
  { label: "I WANT TO TALK ABOUT IT", response: "come talk to me. i promise i’ll listen first. no arguing, no interrupting, just you and me figuring this out." },
  { label: "I JUST WANT MY GIRLFRIEND", response: "come here, baby. argument temporarily suspended. you are now entitled to one very long janna hug." },
  { label: "I'M STILL MAD AT YOU", response: "please allow 1–3 business kisses for processing." },
] as const;

function JoshNeedIllustration({ choice }: { choice: number }) {
  if (choice === 0) {
    return <div className="ol-need-space-scene" aria-hidden="true"><div><MiniDistanceJanna /></div><span>still here ♡</span></div>;
  }
  if (choice === 1) {
    return <div className="ol-need-talk-scene" aria-hidden="true"><div><MiniDistanceJanna /></div><span>...</span><div><MiniDistanceJosh /></div></div>;
  }
  if (choice === 2) {
    return <div className="ol-need-hug-scene" aria-hidden="true"><div className="ol-need-hug-janna"><MiniDistanceJanna /></div><div className="ol-need-hug-josh"><MiniDistanceJosh /></div><span>♡</span><small>ARGUMENT TEMPORARILY SUSPENDED</small></div>;
  }
  return null;
}

function JoshNeedResponse({ choice, closing }: { choice: number; closing: boolean }) {
  const need = joshNeeds[choice];
  if (choice === 3) {
    return (
      <div className={`ol-need-response ol-need-pending${closing ? " is-closing" : ""}`}>
        <p>fair enough.</p>
        <div className="ol-forgiveness-request">
          <h3>JANNA FORGIVENESS REQUEST</h3>
          <span>STATUS:</span>
          <strong>PENDING</strong>
          <i aria-hidden="true"><b /></i>
        </div>
        <p>{need.response}</p>
      </div>
    );
  }
  return (
    <div className={`ol-need-response ol-need-response-${choice}${closing ? " is-closing" : ""}`}>
      <p>{need.response}</p>
      <JoshNeedIllustration choice={choice} />
    </div>
  );
}

function JoshNeedsChoice() {
  const [selected, setSelected] = useState<number | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const switchTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
  }, []);

  function choose(next: number) {
    if (next === selected || leaving !== null) return;
    if (switchTimer.current) window.clearTimeout(switchTimer.current);
    if (selected === null) {
      setSelected(next);
      return;
    }
    setLeaving(selected);
    setSelected(null);
    switchTimer.current = window.setTimeout(() => {
      setLeaving(null);
      setSelected(next);
    }, 280);
  }

  const activeChoice = selected ?? leaving;
  return (
    <section className="ol-josh-needs" aria-label="What Josh needs from Janna right now">
      <h2>WHAT DOES JOSH NEED FROM JANNA RIGHT NOW?</h2>
      <div className="ol-need-options">
        {joshNeeds.map((need, index) => {
          const active = activeChoice === index;
          return (
            <div className={`ol-need-option${active ? " is-selected" : ""}${activeChoice !== null && !active ? " is-softened" : ""}`} key={need.label}>
              <button type="button" onClick={() => choose(index)} aria-expanded={selected === index}>{need.label}</button>
              {active && <JoshNeedResponse choice={index} closing={leaving === index} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MadAtMeLetterBody({ letter }: { letter: Letter }) {
  const choiceMarkers: Set<string> = new Set(joshNeeds.map((need) => `[ ${need.label} ]`));
  const paragraphs = letter.body.split("\n\n");
  return (
    <div className="ol-letter-body ol-mad-at-me-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "WHAT DOES JOSH NEED FROM JANNA RIGHT NOW?") return <JoshNeedsChoice key={index} />;
        if (choiceMarkers.has(paragraph)) return null;
        const emphasis = paragraph === "but please don’t be mad forever."
          ? "ol-mad-please"
          : paragraph === "whatever happened, i want us to fix it together."
            ? "ol-mad-together"
            : paragraph === "come back when you’re ready."
              ? "ol-mad-return"
              : "";
        return <p key={index} className={emphasis}>{paragraph}</p>;
      })}
    </div>
  );
}

const birthdayWishOptions: Record<number, string> = {
  1: "selecting the perfect birthday wish...",
  2: "more money? tempting...",
  3: "more sleep? definitely needed...",
  4: "unlimited food? considering...",
  5: "1000 kisses from janna? already included...",
  6: "1000 kisses from janna? already included...",
  7: "final wish selected.",
};

const finalBirthdayWish = "i wish that this year brings you closer to everything you’ve been dreaming of — and that i get to be right beside you while it happens.";

function BirthdayWishMachine({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function makeWish() {
    if (phase !== 0) return;
    setPhase(1);
    [
      [700, 2], [1400, 3], [2100, 4], [2850, 5], [3500, 6],
      [4200, 7], [4800, 8], [5500, 9],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(10);
      onComplete();
    }, 6200));
  }

  const option = birthdayWishOptions[Math.min(phase, 7)];
  return (
    <div className={`ol-birthday-wish ol-birthday-phase-${phase}`}>
      <h2>JANNA’S BIRTHDAY WISH FOR JOSH</h2>
      <div className="ol-wish-device">
        <span className="ol-wish-star" aria-hidden="true">✦</span>
        <span className="ol-wish-crescent" aria-hidden="true">☾</span>
        <div className="ol-wish-candle" aria-hidden="true"><i /><span /></div>
        <div className="ol-wish-display" aria-live="polite"><strong key={phase}>{phase === 0 ? "♡   ?   ♡" : option}</strong></div>
        <div className="ol-wish-dial" aria-hidden="true"><i /><span>♡</span></div>
        <span className="ol-wish-coin" aria-hidden="true">◉</span>
        <span className="ol-wish-sleep" aria-hidden="true">☾</span>
        <span className="ol-wish-food" aria-hidden="true">✦</span>
        <div className="ol-wish-kisses"><span>✓ included</span><small>kisses owed: <b>{phase >= 6 ? "∞" : "1000+"}</b></small></div>
        <div className="ol-wish-janna"><MiniDistanceJanna /><i aria-hidden="true" /></div>
        <div className="ol-wish-josh"><MiniDistanceJosh /></div>
        <svg className="ol-wish-connection" viewBox="0 0 180 24" preserveAspectRatio="none" aria-hidden="true"><path d="M9 15Q89-2 171 15" /><text x="87" y="13">♡</text></svg>
        <div className="ol-wish-gift" aria-hidden="true"><i /><span /></div>
      </div>
      {phase < 2 && <button type="button" className="ol-wish-button" onClick={makeWish} disabled={phase === 1}>MAKE A WISH</button>}
      {phase >= 8 && <div className="ol-birthday-fortune"><p>{phase >= 9 ? finalBirthdayWish : ""}</p><div aria-hidden="true"><i>✦</i><i>♡</i><i>✦</i></div></div>}
    </div>
  );
}

function BirthdayLetterBody({ letter }: { letter: Letter }) {
  const [wishMade, setWishMade] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ MAKE A WISH ]");
  return (
    <div className="ol-letter-body ol-birthday-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "JANNA’S BIRTHDAY WISH FOR JOSH") return <BirthdayWishMachine key={index} onComplete={() => setWishMade(true)} />;
        if (paragraph === "[ MAKE A WISH ]") return null;
        if (!wishMade && index > markerIndex) return null;
        const className = paragraph.startsWith("and maybe next birthday") ? "ol-birthday-next" : paragraph === "happy birthday, mahal ko." ? "ol-birthday-happy" : paragraph === "i hope you know how loved you are today." ? "ol-birthday-loved" : paragraph === "especially by me." ? "ol-birthday-especially" : undefined;
        return <p key={index} className={className}>{paragraph}{paragraph === "especially by me." && <span aria-hidden="true">♡</span>}</p>;
      })}
    </div>
  );
}

const yearOneRecords = [
  ["♡", "memories made: countless"],
  ["✓", "arguments survived: somehow"],
  ["♡", "“I love you”s said: never enough"],
  ["✦", "distance defeated: every single day"],
  ["♡", "janna + josh: still choosing each other"],
];

const yearTwoLines = [
  "more late-night talks...",
  "more stupid jokes...",
  "more dates...",
  "more adventures...",
  "more kisses...",
  "more growing together...",
  "more us...",
];

function AnniversaryStorybook({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function clearStoryTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  function completeYearOne() {
    if (phase !== 0) return;
    clearStoryTimers();
    setPhase(1);
    timers.current.push(window.setTimeout(() => setPhase(2), 700));
    timers.current.push(window.setTimeout(() => setPhase(3), 1500));
  }

  function turnPage() {
    if (phase !== 3) return;
    clearStoryTimers();
    setPhase(4);
    timers.current.push(window.setTimeout(() => setPhase(5), 850));
  }

  function unlockYearTwo() {
    if (phase !== 5) return;
    clearStoryTimers();
    setPhase(6);
    [
      [650, 7], [1250, 8], [1850, 9], [2450, 10], [3050, 11], [3650, 12], [4250, 13],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(14);
      onComplete();
    }, 5000));
  }

  const visibleYearTwoLines = phase < 7 ? 0 : Math.min(7, phase - 6);
  return (
    <div className={`ol-storybook-keepsake ol-story-phase-${phase}`}>
      <h2>OUR STORY</h2>
      <div className="ol-storybook">
        <div className="ol-story-binding" aria-hidden="true"><i /><i /><i /><i /></div>
        <section className="ol-year-two-page">
          <header><small>OUR STORY</small><h3>YEAR TWO</h3><b>{phase >= 14 ? "YEAR TWO UNLOCKED." : "status: locked"}</b></header>
          <div className="ol-year-two-lock" aria-hidden="true"><i /><span>♡</span></div>
          {phase === 6 && <p className="ol-year-two-unlocking">unlocking...</p>}
          {visibleYearTwoLines > 0 && <ol className="ol-year-two-lines">{yearTwoLines.slice(0, visibleYearTwoLines).map((line) => <li key={line}>{line}</li>)}</ol>}
          <div className="ol-year-two-janna"><MiniDistanceJanna /></div>
          <div className="ol-year-two-josh"><MiniDistanceJosh /></div>
          <span className="ol-year-two-heart" aria-hidden="true">♡</span>
          {(phase === 5 || phase === 6) && <button type="button" className="ol-year-two-unlock" onClick={unlockYearTwo} disabled={phase === 6}>UNLOCK WITH JANNA</button>}
          {phase >= 14 && <div className="ol-blank-future"><i /><i /><i /><span>to be continued...</span></div>}
        </section>
        <section className="ol-year-one-page">
          <header><small>OUR STORY</small><h3>YEAR ONE</h3><b>COMPLETE</b></header>
          <ul>{yearOneRecords.map(([mark, text], index) => <li key={text} className={index === 4 ? "is-choosing" : ""}><span aria-hidden="true">{mark}</span>{text}</li>)}</ul>
          <div className="ol-year-one-stamp">YEAR ONE —<br />COMPLETED</div>
          <div className="ol-year-one-sparkles" aria-hidden="true"><i>✦</i><i>♡</i><i>✦</i><i>·</i></div>
          {phase < 2 && <button type="button" className="ol-year-one-complete" onClick={completeYearOne} disabled={phase === 1}>COMPLETE YEAR ONE</button>}
          {phase === 3 && <button type="button" className="ol-turn-page" onClick={turnPage}>turn the page →</button>}
        </section>
      </div>
    </div>
  );
}

function AnniversaryLetterBody({ letter }: { letter: Letter }) {
  const [yearTwoUnlocked, setYearTwoUnlocked] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ COMPLETE YEAR ONE ]");
  const firstAgainIndex = paragraphs.indexOf("and another.");
  return (
    <div className="ol-letter-body ol-anniversary-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "OUR STORY") return <AnniversaryStorybook key={index} onComplete={() => setYearTwoUnlocked(true)} />;
        if (paragraph === "Year One: COMPLETE" || paragraph.startsWith("memories made: countless") || paragraph === "[ COMPLETE YEAR ONE ]") return null;
        if (!yearTwoUnlocked && index > markerIndex) return null;
        if (paragraph === "i get to find out with you.") return <p key={index} className="ol-anniversary-find-out">{paragraph}</p>;
        if (paragraph === "happy first anniversary, mahal ko.") return <p key={index} className="ol-anniversary-happy">{paragraph}</p>;
        if (paragraph === "now give me another.") return <p key={index} className="ol-anniversary-another ol-anniversary-another-a">{paragraph}</p>;
        if (paragraph === "and another.") return <p key={index} className={`ol-anniversary-another ${index === firstAgainIndex ? "ol-anniversary-another-b" : "ol-anniversary-another-c"}`}>{paragraph}</p>;
        if (paragraph === "i love you, josh.") return <p key={index} className="ol-anniversary-love">{paragraph}<span aria-hidden="true">✦ ♡ ✦</span></p>;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

function BoyfriendApplications({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function checkApplicants() {
    if (phase !== 0) return;
    setPhase(1);
    [
      [700, 2], [1450, 3], [2200, 4], [3050, 5], [3900, 6],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(7);
      onComplete();
    }, 4750));
  }

  return (
    <div className={`ol-applications ol-applications-phase-${phase}`}>
      <div className="ol-folder-scene">
        <div className="ol-folder-back">
          <span className="ol-folder-tab">JANNA’S BOYFRIEND<br />APPLICATIONS</span>
          <span className="ol-folder-confidential">♡ CONFIDENTIAL ♡</span>
          <span className="ol-folder-jj">J + J</span>
          <div className="ol-folder-blank ol-folder-blank-a" aria-hidden="true" />
          <div className="ol-folder-blank ol-folder-blank-b" aria-hidden="true" />
          <div className="ol-josh-application">
            <small>BOYFRIEND APPLICATION</small>
            <h3>JOSH</h3>
            <dl>
              <div><dt>status:</dt><dd>hired</dd></div>
              <div><dt>position:</dt><dd>boyfriend</dd></div>
              <div className="ol-application-contract"><dt>contract:</dt><dd>permanent</dd></div>
              <div className="ol-application-replacement"><dt>replacement needed:</dt><dd>no <span aria-hidden="true">obviously.</span></dd></div>
              <div><dt>janna interested in accepting new applicants:</dt><dd>absolutely not</dd></div>
            </dl>
            <span className="ol-hired-stamp">HIRED</span>
          </div>
          <div className="ol-folder-front">
            <span>position: boyfriend</span>
            <small>department: janna’s heart</small>
          </div>
        </div>
        <div className="ol-applicant-count">{phase < 3 ? "checking applications..." : "applicants found: 1"}</div>
        <div className="ol-applications-closed">APPLICATIONS<br />ARE NOW CLOSED.</div>
        <div className="ol-applications-janna"><MiniDistanceJanna /><i aria-hidden="true" /></div>
        <div className="ol-applications-josh"><MiniDistanceJosh /></div>
        <span className="ol-applications-heart" aria-hidden="true">♡</span>
      </div>
      {phase < 2 && <button type="button" className="ol-applications-button" onClick={checkApplicants} disabled={phase === 1}>CHECK CURRENT APPLICANTS</button>}
      {phase === 7 && <p className="ol-applications-happy">there. happy now, jealous boy?</p>}
    </div>
  );
}

function JealousLetterBody({ letter }: { letter: Letter }) {
  const [closed, setClosed] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ CHECK CURRENT APPLICANTS ]");
  return (
    <div className="ol-letter-body ol-jealous-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "JANNA’S BOYFRIEND APPLICATIONS") return <BoyfriendApplications key={index} onComplete={() => setClosed(true)} />;
        if (paragraph === "[ CHECK CURRENT APPLICANTS ]" || paragraph === "there. happy now, jealous boy?") return null;
        if (!closed && index > markerIndex) return null;
        const className = paragraph.startsWith("you never have to compete") ? "ol-jealous-heart-place" : paragraph === "your girl loves you." ? "ol-jealous-loves" : paragraph === "a lot." ? "ol-jealous-a-lot" : undefined;
        return <p key={index} className={className}>{paragraph}{paragraph === "a lot." && <span aria-hidden="true">♡</span>}</p>;
      })}
    </div>
  );
}

const jannaViewResults = [
  "handsome: yes",
  "cute: annoyingly",
  "smart: absolutely",
  "someone i’m proud of: always",
  "perfect: no",
  "needs to be perfect: never",
  "loved by janna: more than he realizes",
];

function JannasMirror({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function lookThroughJannasEyes() {
    if (phase !== 0) return;
    setPhase(1);
    [
      [700, 2], [1300, 3], [1900, 4], [2500, 5], [3100, 6],
      [3800, 7], [4450, 8], [5100, 9], [5750, 10],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(11);
      onComplete();
    }, 6450));
  }

  const visibleResults = phase < 2 ? 0 : phase <= 6 ? phase - 1 : phase === 7 ? 5 : Math.min(7, phase - 2);
  return (
    <div className={`ol-janna-mirror ol-mirror-phase-${phase}`}>
      <h2>JANNA’S MIRROR</h2>
      <div className="ol-mirror-visual">
        <div className="ol-mirror-frame">
          <div className="ol-mirror-glass">
            <div className="ol-mirror-josh"><MiniDistanceJosh /></div>
            <div className="ol-mirror-fog" aria-hidden="true" />
            <div className="ol-mirror-doubts" aria-hidden="true"><span>not enough?</span><span>what if...</span><span>comparison</span><span>doubt</span></div>
            <div className="ol-mirror-stars" aria-hidden="true"><i>✦</i><i>·</i><i>✦</i></div>
            <span className="ol-mirror-heart" aria-hidden="true">♡</span>
          </div>
          <span className="ol-mirror-engraving ol-mirror-engraving-a" aria-hidden="true">✦</span>
          <span className="ol-mirror-engraving ol-mirror-engraving-b" aria-hidden="true">♡</span>
          <i className="ol-mirror-stand" aria-hidden="true" />
        </div>
      </div>
      {phase === 1 && <p className="ol-mirror-loading">loading janna’s view of josh...</p>}
      {visibleResults > 0 && <ol className="ol-mirror-results">{jannaViewResults.slice(0, visibleResults).map((result, index) => <li key={result} className={index === 4 ? "is-perfect" : index === 5 ? "is-never" : index === 6 ? "is-loved" : ""}><span aria-hidden="true">✓</span>{result}</li>)}</ol>}
      {phase < 2 && <button type="button" className="ol-mirror-button" onClick={lookThroughJannasEyes} disabled={phase === 1}><span>LOOK AT YOURSELF</span><b>THROUGH MY EYES</b></button>}
      {phase >= 10 && <div className="ol-mirror-warning"><b>WARNING:</b> your own mirror may be experiencing insecurity-related technical difficulties. please use janna’s until further notice.</div>}
      {phase === 11 && <p className="ol-mirror-accurate">there. much more accurate.</p>}
    </div>
  );
}

function InsecureLetterBody({ letter }: { letter: Letter }) {
  const [reflected, setReflected] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ LOOK AT YOURSELF THROUGH MY EYES ]");
  return (
    <div className="ol-letter-body ol-insecure-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "JANNA’S MIRROR") return <JannasMirror key={index} onComplete={() => setReflected(true)} />;
        if (paragraph === "[ LOOK AT YOURSELF THROUGH MY EYES ]" || paragraph === "there. much more accurate.") return null;
        if (!reflected && index > markerIndex) return null;
        if (paragraph === "you just have to be josh.") return <p key={index} className="ol-mirror-be-josh">you just have to be <strong>josh</strong>.</p>;
        if (paragraph === "because that’s my favorite person you’re talking about.") return <p key={index} className="ol-mirror-favorite">{paragraph}<span aria-hidden="true">↖ this guy ♡</span></p>;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

const badDaySteps: Record<number, string> = {
  3: "deleting bad memories...",
  4: "deleting unnecessary stress...",
  5: "deleting things we cannot control...",
  6: "keeping josh...",
  7: "keeping janna...",
  8: "keeping us...",
};

function DeleteToday({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [choice, setChoice] = useState<"yes" | "hell" | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function askToDelete() {
    if (phase === 0) setPhase(1);
  }

  function confirmDelete(selected: "yes" | "hell") {
    if (phase !== 1) return;
    setChoice(selected);
    setPhase(2);
    [
      [350, 3], [1050, 4], [1750, 5], [2500, 6], [3200, 7], [3900, 8],
      [4500, 9], [5100, 10],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(11);
      onComplete();
    }, 5700));
  }

  const step = badDaySteps[phase];
  return (
    <div className={`ol-day-delete ol-day-phase-${phase}`}>
      <div className="ol-day-stage">
        <div className="ol-day-report">
          <span className="ol-day-tape" aria-hidden="true" />
          <h2>TODAY</h2>
          <dl>
            <div><dt>status:</dt><dd>terrible</dd></div>
            <div><dt>rating:</dt><dd>0/10</dd></div>
            <div><dt>would janna recommend:</dt><dd>absolutely not</dd></div>
          </dl>
          <div className="ol-day-zero-stars" aria-hidden="true">☆ ☆ ☆ ☆ ☆</div>
          <span className="ol-day-ew" aria-hidden="true">ew</span>
          <span className="ol-day-cloud" aria-hidden="true"><i /></span>
        </div>
        <div className="ol-day-bin" aria-hidden="true"><i /><span /><b /></div>
      </div>
      {phase === 0 && <button type="button" className="ol-day-delete-button" onClick={askToDelete}>DELETE THIS DAY</button>}
      {(phase === 1 || phase === 2) && (
        <div className="ol-day-confirmation">
          <p>are you sure you want to delete this shitty day?</p>
          <div>
            <button type="button" className={choice === "yes" ? "is-pressed" : ""} onClick={() => confirmDelete("yes")} disabled={phase !== 1}>YES</button>
            <button type="button" className={choice === "hell" ? "is-pressed" : ""} onClick={() => confirmDelete("hell")} disabled={phase !== 1}>HELL YES</button>
          </div>
        </div>
      )}
      {step && <p key={phase} className={`ol-day-step${phase >= 6 ? " is-keeping" : ""}`}>{phase >= 6 && <span aria-hidden="true">✓</span>}{step}{phase === 8 && <b aria-hidden="true">♡</b>}</p>}
      {phase >= 10 && <div className="ol-day-stamp">TODAY HAS BEEN MOVED TO TRASH.</div>}
      {phase === 11 && <p className="ol-day-gone">there. gone.</p>}
    </div>
  );
}

function BadDayLetterBody({ letter }: { letter: Letter }) {
  const [deleted, setDeleted] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ DELETE THIS DAY ]");
  return (
    <div className="ol-letter-body ol-bad-day-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "TODAY") return <DeleteToday key={index} onComplete={() => setDeleted(true)} />;
        if (paragraph.startsWith("status: terrible") || paragraph === "[ DELETE THIS DAY ]" || paragraph === "there. gone.") return null;
        if (!deleted && index > markerIndex) return null;
        const className = paragraph === "you did enough." ? "ol-day-enough" : paragraph === "tomorrow, we try again." ? "ol-day-tomorrow" : paragraph === "me." ? "ol-day-me" : undefined;
        return <p key={index} className={className}>{paragraph}{paragraph === "tomorrow, we try again." && <span aria-hidden="true">✦</span>}{paragraph === "me." && <span aria-hidden="true">♡</span>}</p>;
      })}
    </div>
  );
}

const loveCalculationStages = [
  "♡  ? ? ?  ♡",
  "calculating...",
  "texts sent: too many",
  "hours spent together: still not enough",
  "times janna thinks about josh: concerning",
  "kisses owed: infinite",
  "future memories planned: countless",
  "128...",
  "9,482...",
  "∞...",
  "???...",
  "♡♡♡...",
  "ERROR",
  "ERROR: NUMBER TOO LARGE",
];

function LoveCalculator({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function calculate() {
    if (phase !== 0) return;
    setPhase(1);
    [
      [700, 2], [1450, 3], [2200, 4], [3000, 5], [3800, 6],
      [4450, 7], [4620, 8], [4790, 9], [4960, 10], [5130, 11], [5300, 12],
      [5700, 13],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(14);
      onComplete();
    }, 6400));
  }

  const display = phase === 14 ? loveCalculationStages[13] : loveCalculationStages[Math.min(phase, 13)];
  return (
    <div className={`ol-love-calculator ol-love-calc-phase-${phase}`}>
      <h2>HOW MUCH DOES<br />JANNA LOVE JOSH?</h2>
      <div className="ol-love-machine">
        <span className="ol-love-wire ol-love-wire-a" aria-hidden="true">♡</span>
        <span className="ol-love-wire ol-love-wire-b" aria-hidden="true">J + J</span>
        <span className="ol-love-gear ol-love-gear-a" aria-hidden="true">✦</span>
        <span className="ol-love-gear ol-love-gear-b" aria-hidden="true">✦</span>
        <div className="ol-love-display" aria-live="polite">
          <strong key={phase}>{display}</strong>
          {phase >= 13 && <small>unable to calculate.</small>}
        </div>
        <div className="ol-love-meter" aria-hidden="true"><i /><span>♡</span></div>
        <span className="ol-love-warning" aria-hidden="true" />
        <span className="ol-love-smoke" aria-hidden="true">oops</span>
        <div className="ol-love-sparks" aria-hidden="true"><i>✦</i><i>♡</i><i>✦</i></div>
      </div>
      {phase < 2 && <button type="button" className="ol-love-calculate" onClick={calculate} disabled={phase === 1}>CALCULATE</button>}
      {phase === 14 && <p className="ol-love-broke">see? you broke it.<span aria-hidden="true">↗</span></p>}
    </div>
  );
}

function LoveReminderLetterBody({ letter }: { letter: Letter }) {
  const [calculated, setCalculated] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ CALCULATE ]");
  const firstAgainIndex = paragraphs.indexOf("and again.");
  return (
    <div className="ol-letter-body ol-love-reminder-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "HOW MUCH DOES JANNA LOVE JOSH?") return <LoveCalculator key={index} onComplete={() => setCalculated(true)} />;
        if (paragraph === "[ CALCULATE ]" || paragraph === "see? you broke it.") return null;
        if (!calculated && index > markerIndex) return null;
        if (paragraph === "out of all the people in this huge world, somehow i found you.") {
          return <p key={index} className="ol-love-found">out of all the people in this huge world, somehow i found <strong>you</strong>.</p>;
        }
        if (paragraph === "and i would choose you again.") return <p key={index} className="ol-love-again ol-love-again-a">{paragraph}</p>;
        if (paragraph === "and again.") return <p key={index} className={`ol-love-again ${index === firstAgainIndex ? "ol-love-again-b" : "ol-love-again-c"}`}>{paragraph}</p>;
        if (paragraph === "in every universe, mahal ko.") return <p key={index} className="ol-love-universe">{paragraph}<span aria-hidden="true">· ✦ · ♡ · ✦ ·</span></p>;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

const batteryStages = [
  { percent: 12, message: "LOW MOTIVATION" },
  { percent: 12, message: "charging..." },
  { percent: 25, message: "because i believe in you." },
  { percent: 50, message: "because you’ve done hard things before." },
  { percent: 75, message: "because quitting now would be lame." },
  { percent: 99, message: "because your girlfriend said so." },
  { percent: 100, message: "JOSH IS SO BACK." },
];

function MiniBatteryJosh() {
  return <svg viewBox="0 0 46 72" aria-hidden="true"><ellipse cx="23" cy="68" rx="15" ry="3" fill="#4d35404d" /><g className="ol-battery-josh-body"><path d="M13 39q10-8 21 0l3 24H10Z" fill="#34394b" /><path d="M17 61v7m13-7v7" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" /><circle cx="23" cy="21" r="11" fill="#d8a98f" /><path d="M11 22Q9 6 23 6q17 0 14 19l-7-8-1 8-10-7-5 9Z" fill="#252735" /><path d="M30 21h9v7h-9m-14-7H7v7h9m0-5h14" fill="none" stroke="#3f3643" strokeWidth="1.5" /><path d="M13 42 8 53m27-11 4 10" stroke="#34394b" strokeWidth="4" strokeLinecap="round" /><path className="ol-battery-tired-face" d="M18 29q5-2 10 1" fill="none" stroke="#865866" strokeWidth="1.4" /></g></svg>;
}

function JoshBattery({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function charge() {
    if (phase > 0 && phase < 6) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (phase === 6) setPhase(0);
    const startDelay = phase === 6 ? 220 : 0;
    timers.current.push(window.setTimeout(() => setPhase(1), startDelay));
    [
      [850, 2],
      [1750, 3],
      [2650, 4],
      [3550, 5],
      [4650, 6],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => {
      setPhase(next);
      if (next === 6) onComplete();
    }, delay + startDelay)));
  }

  const stage = batteryStages[phase];
  const segmentFill = [0, 1, 2, 3].map((segment) => {
    if (phase < 2) return segment === 0 ? 12 : 0;
    if (phase === 5) return segment < 3 ? 100 : segment === 3 ? 96 : 0;
    const filled = Math.min(4, phase - 1);
    return segment < filled ? 100 : 0;
  });

  return (
    <div className={`ol-battery-keepsake ol-battery-phase-${phase}`}>
      <h2>JOSH BATTERY</h2>
      <div className="ol-battery-scene">
        <span className="ol-battery-ground" aria-hidden="true" />
        <div className="ol-battery-josh"><MiniBatteryJosh /></div>
        <div className="ol-battery-shell" aria-label={`${stage.percent}% motivation`}>
          <div className="ol-battery-segments">{segmentFill.map((fill, index) => <i key={index}><span style={{ width: `${fill}%` }} /></i>)}</div>
        </div>
        <div className="ol-battery-janna"><MiniDistanceJanna /></div>
        <span className="ol-battery-uh-oh" aria-hidden="true">uh oh</span>
        <div className="ol-battery-sparkles" aria-hidden="true"><i>✦</i><i>♡</i><i>✦</i><i>·</i></div>
      </div>
      <div className="ol-battery-status"><strong>{stage.percent}%{phase === 0 ? " — " : phase === 6 ? " — " : ""}{phase === 0 || phase === 6 ? stage.message : ""}</strong>{phase > 0 && phase < 6 && <span>{stage.message}</span>}</div>
      <button type="button" className="ol-battery-boost" onClick={charge} disabled={phase > 0 && phase < 6}>{phase === 6 ? "BOOST AGAIN" : "GET A JANNA BOOST"}</button>
      {phase === 6 && <p className="ol-battery-fixed">there. fixed.</p>}
    </div>
  );
}

function MotivationLetterBody({ letter }: { letter: Letter }) {
  const [charged, setCharged] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ GET A JANNA BOOST ]");
  return (
    <div className="ol-letter-body ol-motivation-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "JOSH BATTERY") return <JoshBattery key={index} onComplete={() => setCharged(true)} />;
        if (paragraph.startsWith("[ 12%") || paragraph === "[ GET A JANNA BOOST ]" || paragraph === "there. fixed.") return null;
        if (!charged && index > markerIndex) return null;
        const className = paragraph === "“see? i knew you could do it.”" ? "ol-motivation-quote" : paragraph === "now go make your girl proud." ? "ol-motivation-push" : undefined;
        return <p key={index} className={className}>{paragraph}</p>;
      })}
    </div>
  );
}

function JannaSignal({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function reconnect() {
    if (phase !== 0) return;
    setPhase(1);
    [
      [720, 2],
      [1220, 3],
      [1700, 4],
      [2110, 5],
      [2520, 6],
      [2930, 7],
    ].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setPhase(next), delay)));
    timers.current.push(window.setTimeout(() => {
      setPhase(8);
      onComplete();
    }, 3540));
  }

  const activeBars = phase < 5 ? 1 : Math.min(4, phase - 3);
  const travel = phase < 3 ? 0 : Math.min(1, (phase - 3) / 4);
  const status = phase === 0 ? "WEAK..." : phase === 1 ? "searching for josh..." : phase === 2 ? "found him." : phase < 8 ? "restoring connection..." : "STRONG";
  return (
    <div className={`ol-signal-keepsake ol-signal-phase-${phase}`}>
      <h2>JANNA SIGNAL</h2>
      <div className="ol-signal-scene">
        <svg className="ol-signal-path" viewBox="0 0 360 74" preserveAspectRatio="none" aria-hidden="true"><path d="M42 46Q111 20 180 43t139-8" /><g fill="#c29a6c"><circle cx="88" cy="31" r="1.6" /><circle cx="218" cy="34" r="1.8" /><path d="m274 16 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" /></g></svg>
        <div className="ol-signal-janna" style={{ left: `${7 + travel * 29}%` }}><MiniDistanceJanna /></div>
        <div className="ol-signal-josh" style={{ left: `${82 - travel * 32}%` }}><MiniDistanceJosh /></div>
        <i className="ol-signal-traveller" aria-hidden="true" />
        <span className="ol-signal-connected-heart" aria-hidden="true">♡</span>
      </div>
      {phase < 8 ? (
        <div className="ol-signal-readout">
          <span>connection to josh:</span>
          <div className="ol-signal-bars" aria-label={`${activeBars} of 4 signal bars`}><i className="is-active" /><i className={activeBars >= 2 ? "is-active" : ""} /><i className={activeBars >= 3 ? "is-active" : ""} /><i className={activeBars >= 4 ? "is-active" : ""} /></div>
          <b>{status}</b>
        </div>
      ) : (
        <dl className="ol-signal-receipt">
          <div><dt>connection:</dt><dd>STRONG</dd></div>
          <div><dt>love:</dt><dd>STILL HERE</dd></div>
          <div><dt>janna:</dt><dd>probably just in her head again</dd></div>
        </dl>
      )}
      {phase < 2 && <button type="button" className="ol-signal-button" onClick={reconnect} disabled={phase > 0}>RECONNECT</button>}
      {phase === 8 && <p className="ol-signal-found-line">see? you didn’t lose me.</p>}
    </div>
  );
}

function DistantLetterBody({ letter }: { letter: Letter }) {
  const [connected, setConnected] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ RECONNECT ]");
  return (
    <div className="ol-letter-body ol-distant-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "JANNA SIGNAL") return <JannaSignal key={index} onComplete={() => setConnected(true)} />;
        if (paragraph.startsWith("connection to josh:") || paragraph === "[ RECONNECT ]" || paragraph === "see? you didn’t lose me.") return null;
        if (!connected && index > markerIndex) return null;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

function MiniFightJanna() {
  return <svg viewBox="0 0 48 78" aria-hidden="true"><ellipse cx="24" cy="73" rx="16" ry="3" fill="#4d35404d" /><circle cx="24" cy="22" r="12" fill="#e4b39f" /><path d="M11 25Q7 5 25 5q18 2 12 27l-7-13-2 18-12-3-2-16Z" fill="#a74f43" /><path d="M13 39q11-8 23 0l3 25H10Z" fill="#4a3b50" /><path className="ol-fight-leg-a" d="M17 62v10" stroke="#332b3d" strokeWidth="5" strokeLinecap="round" /><path className="ol-fight-leg-b" d="M31 62v10" stroke="#332b3d" strokeWidth="5" strokeLinecap="round" /><g className="ol-fight-annoyed"><path d="m12 42 23 12m1-12L13 54" stroke="#352d40" strokeWidth="4" strokeLinecap="round" /><path d="M17 20h5m5 0h5" stroke="#704551" strokeWidth="1.6" /></g><g className="ol-fight-soft"><path d="M14 42 8 54m26-12 6 11" stroke="#4a3b50" strokeWidth="4" strokeLinecap="round" /><path d="M19 25q5 3 10 0" fill="none" stroke="#965f69" strokeWidth="1.4" /></g></svg>;
}

function MiniFightJosh() {
  return <svg viewBox="0 0 48 78" aria-hidden="true"><ellipse cx="24" cy="73" rx="16" ry="3" fill="#4d35404d" /><circle cx="24" cy="22" r="12" fill="#d8a98f" /><path d="M11 24Q9 7 24 7q18 0 14 20l-8-9-1 9-10-8-5 10Z" fill="#252735" /><path d="M30 20h10v7H30m-12-7H8v7h10m0-5h12" fill="none" stroke="#3f3643" strokeWidth="1.5" /><path d="M13 40q11-8 23 0l3 24H10Z" fill="#34394b" /><path className="ol-fight-leg-a" d="M17 62v10" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" /><path className="ol-fight-leg-b" d="M31 62v10" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" /><g className="ol-fight-annoyed"><path d="m12 43 23 12m1-12L13 55" stroke="#2d3142" strokeWidth="4" strokeLinecap="round" /><path d="M18 18h5m5 0h5" stroke="#604550" strokeWidth="1.6" /></g><g className="ol-fight-soft"><path d="M14 43 8 55m26-12 6 11" stroke="#34394b" strokeWidth="4" strokeLinecap="round" /><path d="M20 27q5 3 10 0" fill="none" stroke="#895865" strokeWidth="1.4" /></g></svg>;
}

function FightKeepsake({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function fixFight() {
    if (phase !== 0) return;
    setPhase(1);
    timers.current.push(window.setTimeout(() => setPhase(2), 620));
    timers.current.push(window.setTimeout(() => setPhase(3), 1080));
    timers.current.push(window.setTimeout(() => {
      setPhase(4);
      onComplete();
    }, 2320));
  }

  return (
    <div className={`ol-fight-keepsake ol-fight-phase-${phase}`}>
      <h2>CURRENT FIGHT</h2>
      <div className="ol-fight-scene">
        <span className="ol-fight-ground" aria-hidden="true" />
        <div className="ol-fight-janna"><MiniFightJanna /></div>
        <div className="ol-fight-josh"><MiniFightJosh /></div>
        <div className="ol-fight-versus">VS.<svg viewBox="0 0 72 34" aria-hidden="true"><path d="M3 6 68 28M6 30 66 5" /></svg></div>
        <span className="ol-fight-heart" aria-hidden="true">♡</span>
        <svg className="ol-fight-problem" viewBox="0 0 70 60" aria-hidden="true"><path d="M7 37q-8-17 11-20 7-19 23-6 18-8 21 10 14 7 2 19H10Z" /><path d="m31 39-7 13 11-4-2 10" /><path d="M5 13 0 8m61-2 5-5M18 4l-2-4" /></svg>
      </div>
      <div className="ol-fight-old-label">Janna <span>vs.</span> Josh</div>
      {phase === 0 && <button type="button" className="ol-fight-fix" onClick={fixFight}>THAT DOESN’T LOOK RIGHT.<br /><b>FIX IT</b></button>}
      {phase === 4 && <div className="ol-fight-team-label"><strong>JANNA + JOSH</strong><span>VS.</span><b>THE PROBLEM</b></div>}
      {phase === 4 && <p className="ol-fight-better">there. much better.</p>}
    </div>
  );
}

function FightLetterBody({ letter }: { letter: Letter }) {
  const [fixed, setFixed] = useState(false);
  const paragraphs = letter.body.split("\n\n");
  const markerIndex = paragraphs.indexOf("[ THAT DOESN’T LOOK RIGHT. FIX IT ]");
  return (
    <div className="ol-letter-body ol-fight-letter-body">
      {paragraphs.map((paragraph, index) => {
        if (paragraph === "CURRENT FIGHT") return <FightKeepsake key={index} onComplete={() => setFixed(true)} />;
        if (paragraph === "Janna vs. Josh" || paragraph === "[ THAT DOESN’T LOOK RIGHT. FIX IT ]" || paragraph === "there. much better.") return null;
        if (!fixed && index > markerIndex) return null;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

const distanceSteps = ["1000 miles...", "500 miles...", "100 miles...", "10 miles...", "1 mile...", "0 miles."];
const distanceProgress = [0, .2, .46, .7, .88, 1];

function MiniDistanceJanna() {
  return <svg viewBox="0 0 42 68" aria-hidden="true"><ellipse cx="21" cy="64" rx="14" ry="3" fill="#4d35404d" /><g className="ol-distance-janna-body"><path d="M11 24Q4 5 21 3q18 2 11 29L28 44H13Z" fill="#8f463f" /><circle cx="21" cy="18" r="11" fill="#e4b39f" /><path d="M9 20Q8 3 23 3q14 2 10 20l-5-8-2 15-10-1-3-14Z" fill="#a74f43" /><path d="M15 15q7-7 14 1" fill="none" stroke="#d9846f" strokeWidth="2" /><path d="M12 36q9-7 19 0l3 21H9Z" fill="#4a3b50" /><path className="ol-distance-leg-a" d="M15 55v9" stroke="#332b3d" strokeWidth="5" strokeLinecap="round" /><path className="ol-distance-leg-b" d="M28 55v9" stroke="#332b3d" strokeWidth="5" strokeLinecap="round" /><path d="M12 39 6 50m25-11 6 9" stroke="#4a3b50" strokeWidth="4" strokeLinecap="round" /></g></svg>;
}

function MiniDistanceJosh() {
  return <svg viewBox="0 0 42 68" aria-hidden="true"><ellipse cx="21" cy="64" rx="14" ry="3" fill="#4d35404d" /><path d="M12 37q9-8 19 0l3 21H9Z" fill="#34394b" /><path d="M15 56v8m13-8v8" stroke="#292d3d" strokeWidth="5" strokeLinecap="round" /><circle cx="21" cy="19" r="11" fill="#d8a98f" /><path d="M9 20Q8 5 21 5q16 0 13 18l-6-8-1 8-9-7-5 8Z" fill="#252735" /><path d="M28 19h9v7h-9m-14-7H6v7h8m0-5h14" fill="none" stroke="#3f3643" strokeWidth="1.5" /><path d="M11 40 6 50m26-10 5 9" stroke="#34394b" strokeWidth="4" strokeLinecap="round" /></svg>;
}

function DistanceKeepsake() {
  const [step, setStep] = useState(-1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (step < 0 || complete) return;
    if (step === distanceSteps.length - 1) {
      const timer = window.setTimeout(() => setComplete(true), 850);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 760);
    return () => window.clearTimeout(timer);
  }, [complete, step]);

  const progress = step < 0 ? 0 : distanceProgress[step];
  return (
    <div className={`ol-distance-keepsake${step >= 0 && !complete ? " is-travelling" : ""}${complete ? " is-complete" : ""}`}>
      <h2>DISTANCE BETWEEN JOSH AND JANNA</h2>
      <div className="ol-distance-scene">
        <svg className="ol-distance-path" viewBox="0 0 360 76" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 60Q89 52 177 59t163-1" /><path className="ol-distance-dots" d="M43 51Q118 22 179 47t137-13" />
          <g fill="#96718c"><circle cx="82" cy="35" r="2" /><circle cx="152" cy="31" r="1.5" /><circle cx="246" cy="38" r="2" /><path d="m291 20 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" /></g>
          <path className="ol-distance-cloud" d="M116 46q8-13 20-4 9-17 25-1 11-4 18 8h-63Z" />
        </svg>
        <div className="ol-distance-janna" style={{ left: `${8 + progress * 68}%` }}><MiniDistanceJanna /></div>
        <div className="ol-distance-josh"><MiniDistanceJosh /></div>
        <span className="ol-distance-heart" aria-hidden="true">♡</span>
        <b>{step < 0 ? "way too fucking far" : distanceSteps[step]}</b>
      </div>
      <dl className="ol-distance-facts">
        <div><dt>physical distance</dt><dd>way too fucking far</dd></div>
        <div><dt>heart distance</dt><dd>0 miles</dd></div>
        <div><dt>amount i love you</dt><dd>cannot be calculated</dd></div>
      </dl>
      <button type="button" className="ol-distance-button" disabled={step >= 0} onClick={() => setStep(0)}>{complete ? "0 miles apart ♡" : "TAP TO BRING JANNA CLOSER"}</button>
      {complete && <p className="ol-distance-arrival">there.<br />i’m with you now.</p>}
    </div>
  );
}

function MissMeLetterBody({ letter }: { letter: Letter }) {
  return (
    <div className="ol-letter-body ol-miss-letter-body">
      {letter.body.split("\n\n").map((paragraph, index) => {
        if (paragraph === "DISTANCE BETWEEN JOSH AND JANNA") return <DistanceKeepsake key={index} />;
        if (paragraph.startsWith("physical distance:") || paragraph === "[TAP TO BRING JANNA CLOSER]") return null;
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

const stressMessages = [
  "one thing at a time, baby. you don’t have to figure out your whole life tonight.",
  "janna says you’re doing better than you think. unfortunately, she’s always right.",
  "you have survived 100% of your stressful days so far. pretty sexy of you.",
  "take five minutes. the world can survive without josh for five minutes. i cannot, but that’s different.",
  "emergency forehead kiss delivered: mwah. now breathe, handsome.",
];

const stressEmphasis = new Set([
  "this is officially a janna-mandated break!",
  "unclench your jaw.\ndrop your shoulders.\ntake one biiiiig breath.",
  "“baby, my brain is too loud.”",
  "you got me. ♡",
]);

function StressButton() {
  const [messageIndex, setMessageIndex] = useState<number | null>(null);
  const [noteVisible, setNoteVisible] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [detail, setDetail] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function pressButton() {
    if (pressing) return;
    setPressing(true);
    setNoteVisible(false);
    timers.current.push(window.setTimeout(() => {
      let next = Math.floor(Math.random() * (stressMessages.length - (messageIndex === null ? 0 : 1)));
      if (messageIndex !== null && next >= messageIndex) next += 1;
      setMessageIndex(next);
      setDetail(Math.floor(Math.random() * 3));
      setNoteVisible(true);
    }, messageIndex === null ? 120 : 180));
    timers.current.push(window.setTimeout(() => setPressing(false), 430));
  }

  return (
    <div className={`ol-stress-device${pressing ? " is-pressing" : ""}`}>
      <span className="ol-stress-annotation">for emergencies only<i aria-hidden="true">↓</i></span>
      <div className="ol-stress-mount">
        <i className="ol-stress-screw ol-stress-screw-a" aria-hidden="true" />
        <i className="ol-stress-screw ol-stress-screw-b" aria-hidden="true" />
        <button type="button" className="ol-stress-button" onClick={pressButton} aria-label="Press the stress button">
          <span>PRESS THE STRESS<br />BUTTON</span>
        </button>
      </div>
      {messageIndex !== null && (
        <div className={`ol-stress-fortune${noteVisible ? " is-visible" : " is-retracting"}`}>
          <p>{stressMessages[messageIndex]}</p>
          <i className={`ol-stress-detail ol-stress-detail-${detail}`} aria-hidden="true">{detail === 0 ? "♡" : detail === 1 ? "✦" : "mwah"}</i>
        </div>
      )}
    </div>
  );
}

function StressedLetterBody({ letter }: { letter: Letter }) {
  return (
    <div className="ol-letter-body ol-stressed-letter-body">
      {letter.body.split("\n\n").map((paragraph, index) => {
        if (paragraph === "[THIS IS WHERE THE INTERACTIVE STRESS BUTTON GOES]") return <StressButton key={index} />;
        return <p key={index} className={stressEmphasis.has(paragraph) ? "ol-stress-emphasis" : ""}>{paragraph}</p>;
      })}
    </div>
  );
}

const sadReward = new Set([
  "you found one of my kisses.",
  "unfortunately, you have an unlimited supply.",
  "redeemable from janna anytime, anywhere.\nno expiration date. ♡",
]);

const sadEmphasis = new Set([
  "whatever happened today is only one tiny page in our whole story.",
  "i hid something for you in this letter.",
  "you came here because you were sad.\nbut you’re leaving with one of my kisses.",
  "you have me. ♡",
]);

function SadLetterBody({ letter }: { letter: Letter }) {
  const [kissFound, setKissFound] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const paragraphs = letter.body.split("\n\n");
  const discoveryIndex = paragraphs.findIndex((paragraph) => paragraph.trimEnd() === "no scrolling past this part until you find it, cheater.");

  function togglePrescription(index: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="ol-letter-body ol-sad-letter-body">
      {paragraphs.map((paragraph, index) => {
        const paragraphKey = paragraph.trimEnd();
        if (sadReward.has(paragraphKey)) return null;
        if (!kissFound && index > discoveryIndex) return null;
        if (paragraph.startsWith("☐ ")) {
          return (
            <div className="ol-prescription" key={index} aria-label="Doctor Janna's prescription">
              {paragraph.split("\n").map((item, itemIndex) => {
                const isChecked = checked.has(itemIndex);
                return (
                  <button type="button" key={item} className={isChecked ? "is-checked" : ""} aria-pressed={isChecked} onClick={() => togglePrescription(itemIndex)}>
                    <span className="ol-ink-checkbox" aria-hidden="true" />
                    <span>{item.slice(2)}</span>
                  </button>
                );
              })}
            </div>
          );
        }

        const isPillow = paragraphKey === "hug the nearest pillow";
        const isDiscoveryPoint = paragraphKey === "no scrolling past this part until you find it, cheater.";
        return (
          <Fragment key={index}>
            <p className={`${isPillow || sadEmphasis.has(paragraphKey) ? "ol-sad-emphasis" : ""}${isPillow ? " ol-pillow-instruction" : ""}`}>
              {paragraph}
              {isPillow && <span className="ol-pillow-doodle" aria-hidden="true" />}
            </p>
            {isDiscoveryPoint && (
              <div className={`ol-heart-hunt${kissFound ? " is-found" : ""}`}>
                <button type="button" className="ol-hidden-heart" aria-label="Find Janna's hidden heart" aria-pressed={kissFound} onClick={() => setKissFound(true)}>
                  <span aria-hidden="true">♡</span>
                  <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
                </button>
                {kissFound && (
                  <div className="ol-secret-kiss-note" aria-live="polite">
                    <b>you found one of my kisses. </b>
                    <p>unfortunately, you have an unlimited supply.</p>
                    <p>redeemable from janna anytime, anywhere.<br />no expiration date. ♡</p>
                  </div>
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

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

type SpecialConfettiVariant = "anniversary" | "birthday";

function SpecialLetterConfetti({ variant }: { variant: SpecialConfettiVariant }) {
  const particleCount = variant === "anniversary" ? 28 : 34;
  const colors = variant === "anniversary"
    ? ["#d8ad63", "#c48792", "#ead8bd", "#9a687c", "#e6c77f", "#b7677e"]
    : ["#bd6f83", "#ead9c1", "#79566f", "#d3a15f", "#cf929d", "#e3c181"];

  return (
    <div className={`ol-special-confetti ol-special-confetti-${variant}`} aria-hidden="true">
      {Array.from({ length: particleCount }, (_, index) => {
        const shape = variant === "anniversary"
          ? index % 9 === 0 ? "heart" : index % 7 === 0 ? "star" : index % 6 === 0 ? "circle" : "paper"
          : index % 17 === 0 ? "heart" : index % 13 === 0 ? "star" : index % 7 === 0 ? "circle" : "paper";
        const group = index % 3;
        const x = group === 0
          ? 4 + ((index * 7) % 21)
          : group === 1
            ? 75 + ((index * 11) % 20)
            : 39 + ((index * 13) % 23);
        const direction = x < 35 ? 1 : x > 65 ? -1 : (index % 2 ? 1 : -1);
        const size = shape === "paper" ? 5 + (index % 4) : 7 + (index % 3);
        const style = {
          "--ol-confetti-x": `${x}%`,
          "--ol-confetti-burst-x": `${direction * (18 + ((index * 9) % 31))}px`,
          "--ol-confetti-drift-x": `${direction * (8 + ((index * 17) % 43))}px`,
          "--ol-confetti-fall": `${58 + (index % 15)}svh`,
          "--ol-confetti-turn-a": `${direction * (65 + ((index * 29) % 155))}deg`,
          "--ol-confetti-turn-b": `${direction * (310 + ((index * 47) % 420))}deg`,
          "--ol-confetti-duration": `${2.55 + ((index * 17) % 81) / 100}s`,
          "--ol-confetti-delay": `${((index * 19) % 31) / 100}s`,
          "--ol-confetti-color": colors[index % colors.length],
          "--ol-confetti-width": `${shape === "paper" ? size : size + 1}px`,
          "--ol-confetti-height": `${shape === "paper" ? size + 4 + (index % 3) : size + 1}px`,
        } as CSSProperties;

        return (
          <i
            key={index}
            className={`ol-confetti-piece is-${shape}${index % 9 === 0 ? " is-metallic" : ""}`}
            style={style}
          >
            {shape === "heart" ? "\u2661" : shape === "star" ? "\u2726" : null}
          </i>
        );
      })}
    </div>
  );
}

export function OpenedLetterScene({ letter, onClose }: OpenedLetterSceneProps) {
  const [closing, setClosing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const closingRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const identity = letterIdentity(letter);
  const regularTitle = letter.title.toLowerCase().startsWith("open when ");
  const paperTitle = regularTitle ? letter.title.slice(10) : letter.title;

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setShowConfetti(false);
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

  useEffect(() => {
    setShowConfetti(false);
    if (letter.id !== "anniversary" && letter.id !== "birthday") return;

    const startTimer = window.setTimeout(() => {
      if (!closingRef.current) setShowConfetti(true);
    }, 1050);
    const cleanupTimer = window.setTimeout(() => setShowConfetti(false), 4750);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [letter.id]);

  const scene = (
    <section className={`opened-letter-scene ol-${identity}${letter.id === "letter-2" ? " ol-sad-letter" : ""}${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="opened-letter-title">
      <div className="ol-night-depth" aria-hidden="true" />
      <div className="ol-stars" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--ol-star": index, "--ol-sx": `${(index * 37 + 7) % 96}%`, "--ol-sy": `${(index * 53 + 11) % 91}%`, "--ol-time": `${6 + index * .13}s`, "--ol-delay": `${index * -.4}s` } as CSSProperties} />)}</div>
      <div className="ol-distant-envelopes" aria-hidden="true"><i /><i /><i /></div>
      <ReadingWindow />
      <CozyReadingProps />
      <DeskDetails />
      <button ref={closeRef} className="ol-close" onClick={requestClose} aria-label="Close letter">×</button>
      <div className="ol-letter-stage">
        <OpenEnvelope />
        {showConfetti && (
          <SpecialLetterConfetti variant={letter.id === "anniversary" ? "anniversary" : "birthday"} />
        )}
        <article className="ol-paper">
          <div className="ol-paper-grain" aria-hidden="true" />
          <header className="ol-paper-header">
            <small>{regularTitle ? "Open when" : "A keepsake for you"}</small>
            <h1 id="opened-letter-title">{paperTitle}</h1>
            <span>for my Josh ♡</span>
          </header>
          <div className="ol-rule" aria-hidden="true"><i /><i /><i /></div>
          <LetterBody letter={letter} />
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
