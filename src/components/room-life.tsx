"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OurVerseCharacter } from "./characters";
import type { Expression, Pose } from "@/config/characters";
import { pick } from "@/lib/utils";

type Activity = "resting" | "reading" | "studying" | "coding" | "gaming" | "sleeping" | "window" | "talking" | "watching";
type Surface = "floor" | "sofa" | "bed" | "desk";
type Point = { x: number; y: number };
type FloorName = "bedside" | "sofaFront" | "center" | "windowFront" | "deskFront" | "shelfFront";
type Actor = Point & {
  character: "janna" | "josh";
  pose: Pose;
  expression: Expression;
  activity: Activity;
  surface: Surface;
  facing: -1 | 1;
  phase: "walking" | "entering" | "active" | "leaving";
  speech?: string;
};
type PlanActor = Omit<Actor, "character" | "phase"> & { approach: Point };
type Exchange = { janna: string; josh: string };
type Plan = { janna: PlanActor; josh: PlanActor; duration: [number, number]; exchanges?: Exchange[] };

// The room SVG is 1000×600. Its floor begins at y≈426–455 and extends to y=600.
// Furniture extents are taken from RoomIllustration's transformed SVG groups.
const FLOOR_EXCLUSIONS = [
  { left: 25, right: 325, top: 344, bottom: 545 }, // bed + footboard
  { left: 405, right: 637, top: 424, bottom: 550 }, // sofa
  { left: 756, right: 980, top: 342, bottom: 489 }, // desk, legs, and chair
  { left: 658, right: 727, top: 366, bottom: 471 }, // plant
];
const WALKABLE_FLOOR: Record<FloorName, Point> = {
  bedside: { x: 370, y: 565 },
  sofaFront: { x: 510, y: 565 },
  center: { x: 660, y: 565 },
  windowFront: { x: 740, y: 548 },
  deskFront: { x: 868, y: 565 },
  shelfFront: { x: 375, y: 550 },
};
const ACTIVITY_ANCHORS = {
  sofaLeft: { x: 468, y: 516 },
  sofaRight: { x: 565, y: 516 },
  bedLeft: { x: 104, y: 435 },
  bedRight: { x: 207, y: 435 },
} satisfies Record<string, Point>;
// The chair seat is x=839.6–898.6, y=425–444 after its parent
// translate(140 0) scale(.88 1) transform. The seated hips are at (70, 144)
// in the 140×180 character viewBox; this ground anchor puts that point at the
// transformed seat center (869.1, 434.5) for both characters.
const DESK_CHAIR_SEATED: Point = { x: 869, y: 463 };

const floorTopAt = (x: number) => x <= 114 ? 455 - (29 * x) / 114 : 426 + (8 * (x - 114)) / 886;
const isWalkableFloorPoint = ({ x, y }: Point) =>
  y >= floorTopAt(x) + 10 &&
  !FLOOR_EXCLUSIONS.some((zone) => x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom);
const invalidWaypoint = Object.entries(WALKABLE_FLOOR).find(([, point]) => !isWalkableFloorPoint(point));
if (invalidWaypoint) throw new Error(`Room-life waypoint ${invalidWaypoint[0]} is outside the walkable floor.`);

// Every movement waypoint is intentionally kept in the open foreground floor lane.
const floorPoint = (name: FloorName) => WALKABLE_FLOOR[name];
const floorActivity = (name: FloorName, activity: Activity, pose: Pose = "idle", expression: Expression = "happy", facing: -1 | 1 = 1, speech?: string): PlanActor => {
  const point = floorPoint(name);
  return { ...point, approach: point, activity, pose, expression, facing, surface: "floor", speech };
};
const sofaActivity = (seat: "sofaLeft" | "sofaRight", activity: Activity, pose: Pose = "sit", expression: Expression = "happy", facing: -1 | 1 = 1, speech?: string): PlanActor => {
  const point = ACTIVITY_ANCHORS[seat];
  return { ...point, approach: { x: point.x, y: floorPoint("sofaFront").y }, activity, pose, expression, facing, surface: "sofa", speech };
};
const bedActivity = (side: "bedLeft" | "bedRight"): PlanActor => ({
  ...ACTIVITY_ANCHORS[side], approach: floorPoint("bedside"), activity: "sleeping", pose: "sleep", expression: "sleepy", facing: 1, surface: "bed",
});
const deskActivity = (activity: "studying" | "gaming", pose: "sit" | "gaming", speech?: string): PlanActor => ({
  ...DESK_CHAIR_SEATED, approach: floorPoint("deskFront"), activity, pose, expression: "happy", facing: 1, surface: "desk", speech,
});

const plans: Plan[] = [
  { janna: sofaActivity("sofaLeft", "reading"), josh: deskActivity("gaming", "gaming"), duration: [18000, 28000] },
  { janna: bedActivity("bedLeft"), josh: deskActivity("gaming", "gaming"), duration: [30000, 48000] },
  { janna: deskActivity("studying", "sit"), josh: sofaActivity("sofaRight", "resting"), duration: [20000, 34000] },
  { janna: floorActivity("windowFront", "window", "idle", "happy", -1), josh: bedActivity("bedRight"), duration: [22000, 38000] },
  { janna: sofaActivity("sofaLeft", "reading"), josh: floorActivity("shelfFront", "reading", "idle", "happy", 1), duration: [18000, 30000] },
  { janna: sofaActivity("sofaLeft", "resting"), josh: sofaActivity("sofaRight", "resting", "sit", "happy", -1), duration: [24000, 40000], exchanges: [
    { janna: "can we just stay here?", josh: "yeah" },
    { janna: "pay attention to me", josh: "i am" },
    { janna: "more", josh: "come cuddle" },
    { janna: "break time?", josh: "you said that before" },
    { janna: "what should we do?", josh: "whatever you want" },
  ] },
  { janna: sofaActivity("sofaLeft", "gaming", "gaming"), josh: deskActivity("gaming", "gaming"), duration: [22000, 36000] },
  { janna: floorActivity("center", "talking", "idle", "happy", 1), josh: { ...floorActivity("center", "talking", "idle", "happy", -1), x: 745, approach: { x: 745, y: 565 } }, duration: [18000, 30000], exchanges: [
    { janna: "are you hungry?", josh: "kinda" },
    { janna: "Josh", josh: "what?" },
    { janna: "what do you wanna do?", josh: "come sit" },
    { janna: "you tired?", josh: "a little" },
    { janna: "look at the moon", josh: "pretty" },
  ] },
  { janna: bedActivity("bedLeft"), josh: bedActivity("bedRight"), duration: [38000, 58000], exchanges: [
    { janna: "you should sleep", josh: "you first" },
    { janna: "five more minutes...", josh: "okay, sleepyhead" },
    { janna: "i'm comfy", josh: "goodnight, baby" },
  ] },
  { janna: sofaActivity("sofaLeft", "resting"), josh: deskActivity("studying", "sit"), duration: [21000, 35000] },
  { janna: { ...floorActivity("windowFront", "watching", "idle", "happy", -1), x: 742, approach: { x: 742, y: 565 } }, josh: deskActivity("gaming", "gaming"), duration: [16000, 26000], exchanges: [
    { janna: "are you winning?", josh: "...maybe" },
    { janna: "what are you playing?", josh: "come watch" },
    { janna: "one more game?", josh: "obviously" },
    { janna: "that doesn't count", josh: "it totally counts" },
  ] },
  { janna: floorActivity("windowFront", "window", "idle", "happy", -1), josh: floorActivity("shelfFront", "reading", "idle", "happy", 1), duration: [22000, 37000] },
  { janna: sofaActivity("sofaLeft", "talking", "hug", "blushing", 1), josh: sofaActivity("sofaRight", "talking", "hug", "blushing", -1), duration: [10000, 16000], exchanges: [
    { janna: "come cuddle", josh: "come here" },
    { janna: "stay here", josh: "i'm right here" },
    { janna: "miss you", josh: "i got you" },
  ] },
  { janna: sofaActivity("sofaLeft", "talking", "kiss", "blushing", 1), josh: sofaActivity("sofaRight", "talking", "kiss", "blushing", -1), duration: [9000, 14000], exchanges: [
    { janna: "can i have a kiss?", josh: "always" },
    { janna: "you love me right?", josh: "yeah baby" },
    { janna: "hi baby ♡", josh: "hi" },
  ] },
];

type PlanIndex = typeof plans[number];
type ActiveActor = Omit<Actor, "character" | "phase">;
const initialActors: Actor[] = [
  { character: "janna", ...plans[0].janna, phase: "active" },
  { character: "josh", ...plans[0].josh, phase: "active" },
];

const jannaLines: Partial<Record<Activity, string[]>> = {
  resting: ["Joshhh", "baby?", "come here", "sit with me", "i'm boreddd", "pay attention to me", "hi baby ♡", "look at me", "i'm hungry", "what should we eat?", "do you want snacks?", "come cuddle", "you love me right?", "hehe", "miss you", "stay here", "don't gooo", "i'm comfy", "i don't wanna get up", "i need a break", "i'm tired"],
  reading: ["one more chapter", "this part is so good", "one more page", "this is getting interesting", "wait, listen to this", "i'm supposed to be studying", "Josh look", "come see this", "actually... distract me", "lemme finish this"],
  studying: ["almost done", "need a tiny break", "why isn't this working", "one more bug...", "okay NOW it should work", "finally", "my brain hurts", "i need coffee", "lemme finish this", "wait i get it now", "why did that break", "it worked!!", "don't distract me", "actually... distract me", "i'm supposed to be studying", "break time?", "Josh look", "come see this", "my brain is fried", "i need a break"],
  coding: ["why isn't this working", "one more bug...", "okay NOW it should work", "finally", "wait i get it now", "why did that break", "it worked!!", "don't distract me", "actually... distract me", "my brain is fried", "Josh look", "come see this"],
  gaming: ["rematch?", "you're pretty good", "one more game?", "no way", "that doesn't count", "look at this", "okay, my turn", "don't distract me", "actually... distract me", "hehe"],
  window: ["look at the moon", "it's so pretty", "come look", "stay here", "the sky looks so soft", "hi baby ♡", "i'm sleepy", "look at me"],
  talking: ["Joshhh", "baby?", "whatcha doing?", "come here", "sit with me", "pay attention to me", "hi baby ♡", "look at me", "what should we eat?", "do you want snacks?", "can i have a kiss?", "you love me right?", "hehe", "miss you", "don't gooo", "come cuddle", "stay here", "i'm boreddd"],
  watching: ["what are you playing?", "are you winning?", "look at me", "pay attention to me", "one more game?", "hehe", "i'm supposed to be studying"],
  sleeping: ["five more minutes...", "mm, sleepy", "i'm sleepy", "i need a nap", "i'm tired", "i don't wanna get up", "i'm comfy"],
};
const joshLines: Partial<Record<Activity, string[]>> = {
  resting: ["what?", "yeah baby?", "come here", "i'm right here", "hehe", "you okay?", "you sleepy?", "go rest", "you should sleep", "want something to eat?", "what do you wanna do?", "come sit", "stay here", "look", "you're cute", "hi", "what are you doing?", "you done yet?", "take a break", "come cuddle", "i got you"],
  reading: ["this one's interesting", "listen to this part", "look at this", "one more page", "i like this bit", "you'd like this one"],
  studying: ["you've got this", "need some tea?", "take a break", "you still studying?", "almost there", "want me to bring you something?", "look", "you done yet?"],
  coding: ["you've got this", "need some tea?", "take a break", "you done coding?", "want me to bring you something?", "look"],
  gaming: ["one more game", "hehe", "wait wait wait", "i almost had that", "no way", "how did that happen", "okay that was bad", "lemme try again", "i'm winning", "don't distract me", "okay maybe distract me", "look at this", "that doesn't count", "one more round", "i swear i'm almost done", "five more minutes"],
  window: ["pretty, isn't it?", "look at those stars", "look", "it's nice out tonight", "come sit", "stay here", "you okay?"],
  talking: ["what?", "yeah baby?", "i'm right here", "hehe", "you okay?", "you sleepy?", "go rest", "you should sleep", "want something to eat?", "what do you wanna do?", "come sit", "stay here", "look", "you're cute", "hi", "what are you doing?", "take a break", "come cuddle", "i got you"],
  watching: ["one more game", "wait wait wait", "look at this", "that doesn't count", "i almost had that", "okay maybe distract me"],
  sleeping: ["sleep well", "goodnight, baby", "you should sleep", "you first", "rest, okay?", "five more minutes?", "stay cozy"],
};
function randomizedSpeech(actor: Actor, previous: string) {
  const lines = (actor.character === "janna" ? jannaLines : joshLines)[actor.activity] || [];
  const choices = lines.filter((line) => line !== previous);
  return choices.length ? pick(choices) : lines[0] || "";
}
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function RoomLife() {
  const [actors, setActors] = useState(initialActors);
  const [reducedMotion, setReducedMotion] = useState(false);
  const actorsRef = useRef(actors);
  const lastPlan = useRef(0);
  const lastLines = useRef({ janna: "", josh: "" });

  const publish = (next: Actor[] | ((previous: Actor[]) => Actor[])) => {
    const resolved = typeof next === "function" ? next(actorsRef.current) : next;
    actorsRef.current = resolved;
    setActors(resolved);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let active = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (active) callback();
      }, delay);
      timers.add(timer);
    };
    const choosePlan = (): PlanIndex => {
      const candidates = plans.map((_, index) => index).filter((index) => index !== lastPlan.current);
      const index = pick(candidates);
      lastPlan.current = index;
      return plans[index];
    };
    const beginActivity = (plan: PlanIndex) => {
      const from = actorsRef.current;
      const entering: Actor[] = ["janna", "josh"].map((character) => ({
        character: character as Actor["character"],
        ...plan[character as "janna" | "josh"],
        phase: "entering",
        speech: undefined,
      }));
      const settle = reducedMotion ? 100 : Math.max(800, Math.min(1500, 700 + Math.max(...entering.map((actor) => {
        const previous = from.find((item) => item.character === actor.character)!;
        return distance(previous, actor);
      })) * 6));
      publish(entering);
      later(() => {
        const say = Math.random() < 0.32;
        const shouldSpeak = entering.map(() => say && Math.random() < 0.58);
        // Shared exchanges replace two independently selected lines, so they
        // add context without increasing how often either character speaks.
        const exchange = shouldSpeak.every(Boolean) && plan.exchanges?.length
          ? pick(plan.exchanges)
          : undefined;
        const settled = entering.map((actor, index) => {
          const lastLine = lastLines.current[actor.character];
          let speech = exchange?.[actor.character];
          if (!speech && shouldSpeak[index]) speech = randomizedSpeech(actor, lastLine);
          if (speech === lastLine) speech = undefined;
          if (speech) lastLines.current[actor.character] = speech;
          return { ...actor, phase: "active" as const, speech };
        });
        publish(settled);
        later(() => publish((items) => items.map((actor) => ({ ...actor, speech: undefined }))), 5200);
        const [minimum, maximum] = plan.duration;
        later(nextCycle, reducedMotion ? (minimum + maximum) / 2 : minimum + Math.random() * (maximum - minimum) + 1800 + Math.random() * 2200);
      }, settle);
    };
    const nextCycle = () => {
      const plan = choosePlan();
      const current = actorsRef.current;
      const exits = current.map((actor) => actor.surface === "bed" ? floorPoint("bedside") : { x: actor.x, y: 565 });
      const leaving = current.map((actor) => actor.surface === "bed"
        ? { ...actor, ...floorPoint("bedside"), surface: "floor" as const, pose: reducedMotion ? "idle" as const : actor.pose, phase: "leaving" as const, speech: undefined }
        : { ...actor, y: 565, surface: "floor" as const, pose: reducedMotion ? "idle" as const : "walk" as const, phase: "leaving" as const, speech: undefined });
      publish(leaving);
      const exitDelay = reducedMotion ? 100 : 850;
      later(() => {
        const lane = current.map((actor, index) => ({
          ...leaving[index],
          ...exits[index],
          surface: "floor" as const,
          pose: reducedMotion ? "idle" as const : "walk" as const,
          phase: "walking" as const,
          speech: undefined,
        }));
        publish(lane);
        const routed: Actor[] = lane.map((actor) => {
          const target = plan[actor.character].approach;
          const facing: -1 | 1 = target.x < actor.x ? -1 : 1;
          return { ...actor, ...target, facing };
        });
        const routeDistance = Math.max(...lane.map((actor) => distance(actor, plan[actor.character].approach)));
        const routeTime = reducedMotion ? 100 : Math.max(2300, Math.min(2800, 1800 + routeDistance * 2));
        later(() => beginActivity(plan), routeTime);
        publish(routed);
      }, exitDelay);
    };
    later(nextCycle, 9000 + Math.random() * 7000);
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [reducedMotion]);

  const sofaOccupied = actors.some((actor) => actor.surface === "sofa");
  const bedOccupied = actors.some((actor) => actor.surface === "bed");
  const deskOccupied = actors.some((actor) => actor.surface === "desk");

  return (
    <>
      <div className="room-life-layer" role="group" aria-label="Janna and Josh spending a quiet day at home">
        {actors.map((actor) => {
          const style = {
            left: `${actor.x / 10}%`,
            top: `${actor.y / 6}%`,
            zIndex: Math.round(actor.y / 25),
            "--room-facing": actor.facing,
          } as CSSProperties;
          const sleeping = actor.surface === "bed";
          return (
            <div
              key={actor.character}
              className={`room-life-person room-life-${actor.character} room-life-${actor.activity} room-life-${actor.surface} room-life-pose-${actor.pose} room-life-phase-${actor.phase}`}
              style={style}
            >
              {actor.speech && <span className="room-life-bubble" role="status">{actor.speech}</span>}
              {sleeping && actor.character === "josh" && (
                <svg className="room-life-sleep-body" viewBox="0 0 260 180" aria-hidden="true">
                  <path d="M119 103Q132 91 148 103L169 118Q204 117 239 136L245 158Q207 171 165 156L126 145Q112 132 119 103Z" fill="#41404f" stroke="#242333" strokeWidth="5" strokeLinejoin="round" />
                  <path d="M134 111Q151 118 168 139" fill="none" stroke="#d5b5aa" strokeWidth="10" strokeLinecap="round" />
                  <ellipse cx="171" cy="141" rx="8" ry="5" fill="#e4b9ab" />
                </svg>
              )}
              <OurVerseCharacter character={actor.character} pose={actor.pose} expression={actor.expression} sleepHeadOnly={sleeping} />
              {(actor.activity === "reading" || actor.activity === "studying") && <svg className="room-life-book" viewBox="0 0 34 25" aria-hidden="true"><path d="M2 4Q10 1 17 6V23Q10 18 2 21ZM32 4Q24 1 17 6V23Q24 18 32 21Z" fill="#ead9c8" stroke="#96748a" strokeWidth="1.5"/><path d="M17 7V21M6 8Q11 7 14 10M20 10Q25 7 29 8" fill="none" stroke="#ba91a2" strokeWidth="1"/></svg>}
            </div>
          );
        })}
      </div>
      <svg className="room-life-foreground" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        {sofaOccupied && <svg x="405" y="424" width="232" height="110" viewBox="364 432 393 120" preserveAspectRatio="none"><path d="M390 518Q559 535 730 518V536Q559 552 390 536Z" fill="#674d62" stroke="#b68f9e" strokeWidth="3"/><path d="M410 535V549M708 535V549" stroke="#5a414e" strokeWidth="11"/></svg>}
        {bedOccupied && <g transform="translate(-18 0) scale(.9 1)"><path d="M61 418Q119 399 181 419L215 442Q270 399 370 424V486H61Z" fill="#8e7fa9" stroke="#c5a4b0" strokeWidth="3"/><path d="M71 437Q137 421 199 441M226 439Q292 419 357 440" fill="none" stroke="#d9bcca" strokeOpacity=".48" strokeWidth="3"/></g>}
        {deskOccupied && <path d="M756 368H980" fill="none" stroke="#c3a08a" strokeWidth="2"/>}
      </svg>
    </>
  );
}
