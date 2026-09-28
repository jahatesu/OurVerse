"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OurVerseCharacter } from "./characters";
import type { Expression, Pose } from "@/config/characters";
import { pick } from "@/lib/utils";
import { projectRoom, roomDepth, ROOM_WIDTH, ROOM_HEIGHT, ROOM_FURNITURE_DEPTH } from "./room-projection";

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

// All anchors and movement points are world coordinates on the shared diamond floor.
const FLOOR_EXCLUSIONS = [
  { left: .6, right: 3.05, top: 2.68, bottom: 6 },
  { left: 4.38, right: 7.06, top: 3.78, bottom: 5.05 },
  { left: 4, right: 7.42, top: .45, bottom: 1.85 },
  { left: 5.34, right: 6.37, top: 2.23, bottom: 3.1 },
  { left: 6.95, right: 7.58, top: 2.28, bottom: 2.87 },
];
const WALKABLE_FLOOR: Record<FloorName, Point> = {
  bedside: { x: 3.4, y: 6.5 },
  sofaFront: { x: 5.9, y: 6.3 },
  center: { x: 3.9, y: 6.8 },
  windowFront: { x: 6.65, y: 3.25 },
  deskFront: { x: 6.65, y: 3.2 },
  shelfFront: { x: 3.5, y: 2.15 },
};
const ACTIVITY_ANCHORS = {
  sofaLeft: { x: 5.15, y: 4.48 },
  sofaRight: { x: 6.15, y: 4.48 },
  bedLeft: { x: 1.32, y: 3.2 },
  bedRight: { x: 2.31, y: 3.2 },
} satisfies Record<string, Point>;
const DESK_CHAIR_SEATED: Point = { x: 5.85, y: 2.7 };

const isWalkableFloorPoint = ({ x, y }: Point) =>
  x > 0 && x < 8 && y > 0 && y < 8 &&
  !FLOOR_EXCLUSIONS.some((zone) => x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom);
const invalidWaypoint = Object.entries(WALKABLE_FLOOR).find(([, point]) => !isWalkableFloorPoint(point));
if (invalidWaypoint) throw new Error(`Room-life waypoint ${invalidWaypoint[0]} is outside the walkable floor.`);

// Floor activities use clear world-space positions around the furniture.
const floorPoint = (name: FloorName) => WALKABLE_FLOOR[name];
const floorActivity = (name: FloorName, activity: Activity, pose: Pose = "idle", expression: Expression = "happy", facing: -1 | 1 = 1, speech?: string): PlanActor => {
  const point = floorPoint(name);
  return { ...point, approach: point, activity, pose, expression, facing, surface: "floor", speech };
};
const sofaActivity = (seat: "sofaLeft" | "sofaRight", activity: Activity, pose: Pose = "sit", expression: Expression = "happy", facing: -1 | 1 = 1, speech?: string): PlanActor => {
  const point = ACTIVITY_ANCHORS[seat];
  return { ...point, approach: floorPoint("sofaFront"), activity, pose, expression, facing, surface: "sofa", speech };
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
  { janna: floorActivity("center", "talking", "idle", "happy", 1), josh: { ...floorActivity("center", "talking", "idle", "happy", -1), x: 5.85, y: 6.85, approach: { x: 5.85, y: 6.85 } }, duration: [18000, 30000], exchanges: [
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
  { janna: floorActivity("windowFront", "watching", "idle", "happy", -1), josh: deskActivity("gaming", "gaming"), duration: [16000, 26000], exchanges: [
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
const distance = (a: Point, b: Point) => {
  const from = projectRoom(a.x, a.y), to = projectRoom(b.x, b.y);
  return Math.hypot(from.x - to.x, from.y - to.y);
};
const exitPoint = (actor: Actor): Point => actor.surface === "bed" ? floorPoint("bedside") : actor.surface === "sofa" ? floorPoint("sofaFront") : actor.surface === "desk" ? floorPoint("deskFront") : { x: actor.x, y: actor.y };
// Clear side corridors connect through the open front of the floor.
function floorRoute(from: Point, to: Point): Point[] {
  const fromLane = from.x > 5.6 ? 7.78 : 4.32;
  const toLane = to.x > 5.6 ? 7.78 : 4.32;
  const points = [{ x: fromLane, y: from.y }, { x: fromLane, y: 7.5 }, { x: toLane, y: 7.5 }, { x: toLane, y: to.y }, to];
  return points.filter((point, index) => distance(index ? points[index - 1] : from, point) > 2);
}

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
      const exits = current.map(exitPoint);
      const leaving = current.map((actor, index) => ({ ...actor, ...exits[index], surface: "floor" as const, pose: reducedMotion ? "idle" as const : "walk" as const, phase: "leaving" as const, speech: undefined }));
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
        const routes = lane.map((actor) => floorRoute(actor, plan[actor.character].approach));
        const advance = (step: number) => {
          if (step >= Math.max(...routes.map((route) => route.length))) { beginActivity(plan); return; }
          publish((items) => items.map((actor, index) => {
            const target = routes[index][step];
            if (!target) return actor;
            const facing: -1 | 1 = projectRoom(target.x, target.y).x < projectRoom(actor.x, actor.y).x ? -1 : 1;
            return { ...actor, ...target, facing };
          }));
          later(() => advance(step + 1), reducedMotion ? 100 : 1050);
        };
        advance(0);
      }, exitDelay);
    };
    later(nextCycle, 9000 + Math.random() * 7000);
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="room-life-layer" role="group" aria-label="Janna and Josh spending a quiet day at home">
        {actors.map((actor) => {
          const elevation = actor.surface === "bed" ? .98 : actor.surface === "sofa" ? .39 : actor.surface === "desk" ? .35 : 0;
          const point = projectRoom(actor.x, actor.y, elevation);
          const actorDepth = actor.surface === "bed" ? ROOM_FURNITURE_DEPTH.bed + 2 : actor.surface === "sofa" ? ROOM_FURNITURE_DEPTH.couch + 2 : actor.surface === "desk" ? ROOM_FURNITURE_DEPTH.chair + 2 : roomDepth(actor.x, actor.y);
          const style = {
            left: `${point.x / ROOM_WIDTH * 100}%`,
            top: `${point.y / ROOM_HEIGHT * 100}%`,
            zIndex: actorDepth,
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
              <OurVerseCharacter character={actor.character} pose={actor.pose} expression={actor.expression} sleepHeadOnly={sleeping} />
              {(actor.activity === "reading" || actor.activity === "studying") && <svg className="room-life-book" viewBox="0 0 34 25" aria-hidden="true"><path d="M2 4Q10 1 17 6V23Q10 18 2 21ZM32 4Q24 1 17 6V23Q24 18 32 21Z" fill="#ead9c8" stroke="#96748a" strokeWidth="1.5"/><path d="M17 7V21M6 8Q11 7 14 10M20 10Q25 7 29 8" fill="none" stroke="#ba91a2" strokeWidth="1"/></svg>}
            </div>
          );
        })}
      </div>
    </>
  );
}
