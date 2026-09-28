"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OurVerseCharacter } from "./characters";
import { characters, type Expression, type Pose } from "@/config/characters";
import { pick } from "@/lib/utils";
import { projectRoom, roomDepth, ROOM_WIDTH, ROOM_HEIGHT, ROOM_FURNITURE_DEPTH } from "./room-projection";
import "./room-life.css";

type CharacterName = "janna" | "josh";
type Activity =
  | "idle"
  | "walking"
  | "resting"
  | "reading"
  | "browsing"
  | "working"
  | "phone"
  | "watering"
  | "window"
  | "talking"
  | "drinking"
  | "waving"
  | "stretching"
  | "yawning"
  | "hugging"
  | "leaning"
  | "sleeping";
type Surface = "floor" | "sofa" | "bed" | "desk";
type Phase = "active" | "walking" | "arriving" | "settling" | "sleeping" | "waking" | "hidden";
type Direction = "left" | "right" | "front-left" | "front-right" | "back-left" | "back-right";
type Point = { x: number; y: number };
type AnchorName =
  | "floorIdleA"
  | "floorIdleB"
  | "floorIdleC"
  | "chatLeft"
  | "chatRight"
  | "hugLeft"
  | "hugRight"
  | "couchLeft"
  | "couchRight"
  | "bedJanna"
  | "bedJosh"
  | "deskChair"
  | "plant"
  | "window"
  | "bookshelf"
  | "coffeeTable";
type RoomAnchor = Point & {
  approach: Point;
  surface: Surface;
  facing: -1 | 1;
  lane: "left" | "right";
};
type PlanActor = {
  anchor: AnchorName;
  activity: Activity;
  pose: Pose;
  expression: Expression;
  speech?: string;
};
type Exchange = { janna: string; josh: string; first?: CharacterName };
type Plan = {
  id: string;
  weight: number;
  duration: [number, number];
  janna: PlanActor;
  josh: PlanActor;
  exchanges?: Exchange[];
};
type Actor = Point & PlanActor & {
  character: CharacterName;
  surface: Surface;
  facing: -1 | 1;
  direction: Direction;
  phase: Phase;
  travelMs: number;
  staying: boolean;
};

// Every destination is expressed in the diorama's own 8 × 8 world coordinates.
// Approach points sit on clear floor immediately in front of the matching object.
const roomAnchors: Record<AnchorName, RoomAnchor> = {
  floorIdleA: { x: 3.18, y: 6.92, approach: { x: 3.18, y: 6.92 }, surface: "floor", facing: 1, lane: "left" },
  floorIdleB: { x: 4.08, y: 7.28, approach: { x: 4.08, y: 7.28 }, surface: "floor", facing: 1, lane: "left" },
  floorIdleC: { x: 6.82, y: 6.78, approach: { x: 6.82, y: 6.78 }, surface: "floor", facing: -1, lane: "right" },
  chatLeft: { x: 4.03, y: 6.86, approach: { x: 4.03, y: 6.86 }, surface: "floor", facing: 1, lane: "left" },
  chatRight: { x: 5.78, y: 6.86, approach: { x: 5.78, y: 6.86 }, surface: "floor", facing: -1, lane: "right" },
  hugLeft: { x: 3.62, y: 6.82, approach: { x: 3.62, y: 6.82 }, surface: "floor", facing: 1, lane: "left" },
  hugRight: { x: 4.3, y: 6.82, approach: { x: 4.3, y: 6.82 }, surface: "floor", facing: -1, lane: "left" },
  couchLeft: { x: 5.15, y: 4.48, approach: { x: 5.82, y: 6.35 }, surface: "sofa", facing: 1, lane: "right" },
  couchRight: { x: 6.15, y: 4.48, approach: { x: 6.48, y: 6.25 }, surface: "sofa", facing: -1, lane: "right" },
  bedJanna: { x: 1.32, y: 3.2, approach: { x: 3.22, y: 6.38 }, surface: "bed", facing: 1, lane: "left" },
  bedJosh: { x: 2.31, y: 3.2, approach: { x: 3.58, y: 6.62 }, surface: "bed", facing: 1, lane: "left" },
  deskChair: { x: 5.85, y: 2.7, approach: { x: 6.72, y: 3.2 }, surface: "desk", facing: 1, lane: "right" },
  plant: { x: 7.56, y: 3.22, approach: { x: 7.56, y: 3.22 }, surface: "floor", facing: 1, lane: "right" },
  window: { x: 7.46, y: 3.48, approach: { x: 7.46, y: 3.48 }, surface: "floor", facing: 1, lane: "right" },
  bookshelf: { x: 3.42, y: 2.14, approach: { x: 3.42, y: 2.14 }, surface: "floor", facing: -1, lane: "left" },
  coffeeTable: { x: 3.64, y: 6.08, approach: { x: 3.64, y: 6.08 }, surface: "floor", facing: 1, lane: "left" },
};

const floorExclusions = [
  { left: .56, right: 3.08, top: 2.64, bottom: 6.08 }, // bed
  { left: 3.04, right: 4.3, top: 2.42, bottom: 3.58 }, // nightstand
  { left: 3.88, right: 5.6, top: 5.15, bottom: 6.12 }, // coffee table
  { left: 4.34, right: 7.1, top: 3.72, bottom: 5.12 }, // couch
  { left: 3.96, right: 7.46, top: .4, bottom: 1.9 }, // desk
  { left: 5.3, right: 6.42, top: 2.18, bottom: 3.12 }, // desk chair
  { left: 6.9, right: 7.62, top: 2.22, bottom: 2.92 }, // plant
  { left: 4.64, right: 5.62, top: 6.12, bottom: 7.08 }, // parcel
];
const isWalkable = ({ x, y }: Point) => x > 0 && x < 8 && y > 0 && y < 8 && !floorExclusions.some((zone) => x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom);
Object.entries(roomAnchors).forEach(([name, anchor]) => {
  if (!isWalkable(anchor.approach)) throw new Error(`Room-life approach ${name} is not on clear floor.`);
});

const actor = (anchor: AnchorName, activity: Activity, pose: Pose = "idle", expression: Expression = "happy", speech?: string): PlanActor => ({
  anchor,
  activity,
  pose,
  expression,
  speech,
});

const conversations: Exchange[] = [
  { janna: "hi ♡", josh: "hi" },
  { janna: "nothinggg", josh: "what are you doing", first: "josh" },
  { janna: "babe", josh: "hmm?" },
  { janna: "look", josh: "what" },
  { janna: "same", josh: "hungry", first: "josh" },
  { janna: "i'm sleepy", josh: "go sleep" },
  { janna: "love you", josh: "love you too" },
  { janna: "hehe", josh: "come here", first: "josh" },
  { janna: "five more minutes", josh: "you said that already" },
];

const plans: Plan[] = [
  { id: "read-and-work", weight: 4, duration: [28000, 50000], janna: actor("couchLeft", "reading", "sit"), josh: actor("deskChair", "working", "sit") },
  { id: "phone-and-window", weight: 3.5, duration: [22000, 40000], janna: actor("couchLeft", "phone", "sit"), josh: actor("window", "window") },
  { id: "water-and-phone", weight: 1.5, duration: [10000, 15000], janna: actor("plant", "watering"), josh: actor("couchRight", "phone", "sit") },
  { id: "browse-and-work", weight: 2.2, duration: [12000, 20000], janna: actor("bookshelf", "browsing"), josh: actor("deskChair", "working", "sit") },
  { id: "couch-together", weight: 4.5, duration: [30000, 58000], janna: actor("couchLeft", "resting", "sit"), josh: actor("couchRight", "resting", "sit") },
  { id: "quiet-lean", weight: .8, duration: [18000, 30000], janna: actor("couchLeft", "leaning", "sit", "blushing"), josh: actor("couchRight", "resting", "sit", "happy") },
  { id: "bed-phone-and-work", weight: 2, duration: [18000, 32000], janna: actor("bedJanna", "phone", "sit"), josh: actor("deskChair", "working", "sit") },
  { id: "window-and-books", weight: 2.2, duration: [14000, 26000], janna: actor("window", "window"), josh: actor("bookshelf", "browsing") },
  { id: "tea-break", weight: 1.6, duration: [9000, 16000], janna: actor("coffeeTable", "drinking"), josh: actor("floorIdleC", "idle") },
  { id: "janna-wave", weight: .8, duration: [3000, 4300], janna: actor("floorIdleA", "waving", "wave", "smiling", "hi ♡"), josh: actor("floorIdleC", "idle", "idle", "happy") },
  { id: "josh-wave", weight: .7, duration: [3000, 4300], janna: actor("floorIdleA", "idle"), josh: actor("floorIdleC", "waving", "wave", "smiling", "hi") },
  { id: "stretch-break", weight: 1.25, duration: [3200, 4500], janna: actor("floorIdleB", "stretching"), josh: actor("couchRight", "phone", "sit") },
  { id: "floor-chat", weight: 2.2, duration: [9000, 15000], janna: actor("chatLeft", "talking"), josh: actor("chatRight", "talking"), exchanges: conversations },
  { id: "couch-chat", weight: 2.4, duration: [12000, 22000], janna: actor("couchLeft", "talking", "sit"), josh: actor("couchRight", "talking", "sit"), exchanges: conversations },
  { id: "small-hug", weight: .38, duration: [6000, 8500], janna: actor("hugLeft", "hugging", "hug", "blushing"), josh: actor("hugRight", "hugging", "hug", "blushing") },
  { id: "both-sleep", weight: .48, duration: [65000, 95000], janna: actor("bedJanna", "sleeping", "sleep", "sleepy"), josh: actor("bedJosh", "sleeping", "sleep", "sleepy") },
  { id: "janna-nap", weight: .7, duration: [36000, 58000], janna: actor("bedJanna", "sleeping", "sleep", "sleepy"), josh: actor("couchRight", "phone", "sit") },
  { id: "wander-left-right", weight: 3.5, duration: [9000, 18000], janna: actor("floorIdleA", "idle"), josh: actor("floorIdleC", "idle") },
  { id: "wander-center", weight: 3.2, duration: [8000, 16000], janna: actor("floorIdleB", "idle"), josh: actor("floorIdleC", "idle") },
  { id: "josh-waters", weight: 1.05, duration: [10000, 15000], janna: actor("bookshelf", "browsing"), josh: actor("plant", "watering") },
  { id: "janna-works", weight: 2.6, duration: [30000, 62000], janna: actor("deskChair", "working", "sit"), josh: actor("coffeeTable", "drinking") },
  { id: "sleepy-pause", weight: .9, duration: [3500, 5200], janna: actor("floorIdleA", "yawning", "idle", "sleepy", "yawn"), josh: actor("couchRight", "resting", "sit") },
];

// Plans are the reservation system: every exclusive physical destination may
// be occupied by only one resident during a scene.
const exclusiveAnchors = new Set<AnchorName>(["couchLeft", "couchRight", "bedJanna", "bedJosh", "deskChair", "plant", "window", "bookshelf", "coffeeTable"]);
plans.forEach((plan) => {
  if (plan.janna.anchor === plan.josh.anchor && exclusiveAnchors.has(plan.janna.anchor)) {
    throw new Error(`Room-life plan ${plan.id} assigns both residents to ${plan.janna.anchor}.`);
  }
});

function resolveActor(character: CharacterName, planActor: PlanActor, phase: Phase = "active"): Actor {
  const anchor = roomAnchors[planActor.anchor];
  return {
    character,
    ...planActor,
    x: anchor.x,
    y: anchor.y,
    surface: anchor.surface,
    facing: anchor.facing,
    direction: anchor.facing < 0 ? "left" : "right",
    phase,
    travelMs: 900,
    staying: false,
  };
}

const initialActors: Actor[] = [resolveActor("janna", plans[0].janna), resolveActor("josh", plans[0].josh)];

const projectedDistance = (a: Point, b: Point) => {
  const from = projectRoom(a.x, a.y);
  const to = projectRoom(b.x, b.y);
  return Math.hypot(from.x - to.x, from.y - to.y);
};

function movementDirection(from: Point, to: Point): { facing: -1 | 1; direction: Direction } {
  const start = projectRoom(from.x, from.y);
  const finish = projectRoom(to.x, to.y);
  const dx = finish.x - start.x;
  const dy = finish.y - start.y;
  const facing: -1 | 1 = dx < 0 ? -1 : 1;
  if (Math.abs(dy) < 7) return { facing, direction: dx < 0 ? "left" : "right" };
  return { facing, direction: dy < 0 ? (dx < 0 ? "back-left" : "back-right") : (dx < 0 ? "front-left" : "front-right") };
}

function segmentDuration(from: Point, to: Point, reducedMotion: boolean) {
  if (reducedMotion) return 90;
  return Math.max(520, Math.min(1450, projectedDistance(from, to) * 5.2));
}

function safeRoute(from: Actor, destinationName: AnchorName, character: CharacterName): Point[] {
  const destination = roomAnchors[destinationName];
  if (from.staying) return [];
  if (projectedDistance(from, destination.approach) < 5) return [];
  const offset = character === "janna" ? -.12 : .12;
  const leftLane = 3.66 + offset;
  const rightLane = 7.7 + offset;
  const laneX = destination.lane === "left" ? leftLane : rightLane;
  const frontY = character === "janna" ? 7.3 : 7.52;
  const sourceLaneX = from.x < 5.1 ? leftLane : rightLane;
  const points: Point[] = [];
  if (from.anchor === "bookshelf") {
    points.push({ x: 4.34, y: 2.14 }, { x: 4.34, y: 3.65 }, { x: leftLane, y: 3.65 }, { x: leftLane, y: frontY });
  } else if (from.y < 6.7) points.push({ x: sourceLaneX, y: from.y }, { x: sourceLaneX, y: frontY });
  else points.push({ x: sourceLaneX, y: frontY });
  if (Math.abs(sourceLaneX - laneX) > .2) points.push({ x: laneX, y: frontY });
  if (destinationName === "bookshelf") {
    points.push({ x: leftLane, y: 3.65 }, { x: 4.34, y: 3.65 }, { x: 4.34, y: 2.14 }, destination.approach);
  } else {
    points.push({ x: laneX, y: destination.approach.y }, destination.approach);
  }
  return points.filter((point, index) => projectedDistance(index ? points[index - 1] : from, point) > 4);
}

function weightedPlan(lastId: string, cyclesSinceSleep: number) {
  if (cyclesSinceSleep >= 13) return plans.find((plan) => plan.id === "both-sleep")!;
  const candidates = plans.filter((plan) => plan.id !== lastId);
  const total = candidates.reduce((sum, plan) => sum + plan.weight, 0);
  let cursor = Math.random() * total;
  return candidates.find((plan) => (cursor -= plan.weight) <= 0) || candidates[candidates.length - 1];
}

function RoomSleepPose({ character, waking }: { character: CharacterName; waking: boolean }) {
  const palette = characters[character];
  const janna = character === "janna";
  return (
    <svg className={`room-life-sleeper room-life-sleeper-${character} ${waking ? "is-waking" : ""}`} viewBox="0 0 210 150" role="img" aria-label={`${palette.name} sleeping under the blanket`}>
      <g className="room-life-sleeper-breath">
        <g transform="translate(210 0) scale(-1 1)">
        <ellipse cx="111" cy="125" rx="79" ry="12" fill="#2b2135" opacity=".24" />
        {janna && <path d="M19 35Q5 67 22 87Q43 97 66 80L72 35Z" fill={palette.hairColor} />}
        <path d="M56 61Q76 66 91 78L173 118L154 137L63 92Q49 82 56 61Z" fill={palette.outfit} stroke="#2e293b" strokeWidth="5" />
        <path d="M126 102Q158 112 184 127" fill="none" stroke={palette.outfit} strokeWidth="20" strokeLinecap="round" />
        <path d="M158 130L186 135" fill="none" stroke="#ddd1ca" strokeWidth="9" strokeLinecap="round" />
        <circle cx="51" cy="49" r="35" fill={palette.skin} stroke="#3a2d3e" strokeWidth="4" />
        <path d={janna ? "M16 50Q10 10 50 7Q93 8 88 54Q73 42 65 24Q48 49 21 42Z" : "M16 48Q14 12 51 8Q91 9 87 53L74 39L66 24Q50 42 23 39Z"} fill={palette.hairColor} />
        <path d="M25 27Q41 12 60 17" fill="none" stroke={palette.hairHighlight} strokeWidth="4" strokeLinecap="round" opacity=".8" />
        <path d="M32 54Q38 59 44 54M58 54Q64 59 70 54" fill="none" stroke="#392d35" strokeWidth="3" strokeLinecap="round" />
        {!janna && <g fill="none" stroke="#393847" strokeWidth="2.5"><rect x="26" y="44" width="25" height="18" rx="6" /><rect x="53" y="44" width="25" height="18" rx="6" /><path d="M51 51H54" /></g>}
        <path d="M75 77Q96 84 110 100" fill="none" stroke={palette.skin} strokeWidth="11" strokeLinecap="round" />
        <circle cx="110" cy="100" r="6" fill={palette.skin} />
        <path className="room-life-personal-blanket" d="M67 80Q103 73 138 96Q171 107 196 128L181 148H83Q68 123 67 80Z" fill={janna ? "#a987a7" : "#8c83a1"} stroke="#cbb4cb" strokeWidth="3" />
        <path d="M79 89Q110 84 139 102M112 135Q143 126 181 143" fill="none" stroke="#e0c8d8" strokeWidth="3" opacity=".5" strokeLinecap="round" />
        </g>
      </g>
      {!waking && <><text className="room-life-sleep-z room-life-sleep-z-one" x="86" y="24">z</text><text className="room-life-sleep-z room-life-sleep-z-two" x="101" y="10">z</text></>}
    </svg>
  );
}

function PhoneProp() {
  return <svg className="room-life-prop room-life-phone" viewBox="0 0 28 40" aria-hidden="true"><rect x="4" y="2" width="20" height="34" rx="5" fill="#39364c" stroke="#c9bad3" strokeWidth="2" /><rect x="7" y="6" width="14" height="23" rx="3" fill="#a9bbd1" /><circle cx="14" cy="32" r="1.5" fill="#e8d8d0" /></svg>;
}

function BookProp() {
  return <svg className="room-life-prop room-life-book" viewBox="0 0 34 25" aria-hidden="true"><path d="M2 4Q10 1 17 6V23Q10 18 2 21ZM32 4Q24 1 17 6V23Q24 18 32 21Z" fill="#ead9c8" stroke="#96748a" strokeWidth="1.5" /><path d="M17 7V21M6 8Q11 7 14 10M20 10Q25 7 29 8" fill="none" stroke="#ba91a2" strokeWidth="1" /></svg>;
}

function MugProp() {
  return <svg className="room-life-prop room-life-mug" viewBox="0 0 34 34" aria-hidden="true"><path d="M6 9H25V29Q16 34 7 29Z" fill="#d9b9b1" stroke="#785f78" strokeWidth="2" /><path d="M25 14Q34 12 31 23Q28 27 24 24" fill="none" stroke="#d9b9b1" strokeWidth="5" /><path d="M11 5Q8 1 12-3M18 5Q15 0 19-4" fill="none" stroke="#f1d8cf" strokeWidth="1.5" opacity=".65" /></svg>;
}

function WateringProp() {
  return <svg className="room-life-prop room-life-watering-can" viewBox="0 0 82 58" aria-hidden="true"><path d="M20 20H56L61 52H17Z" fill="#9eafb0" stroke="#4e5365" strokeWidth="3" /><path d="M22 22Q25 5 42 7Q56 8 57 24" fill="none" stroke="#788c91" strokeWidth="5" /><path d="M57 27L79 17L82 24L59 39Z" fill="#9eafb0" stroke="#4e5365" strokeWidth="3" /><path className="room-life-water-stream" d="M78 29Q82 40 73 51M70 32Q74 43 66 54" fill="none" stroke="#a9cbd1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 4" /></svg>;
}

function WorkProp() {
  return <svg className="room-life-prop room-life-keyboard" viewBox="0 0 46 19" aria-hidden="true"><path d="M3 3H42L46 16H0Z" fill="#81778e" stroke="#453c53" strokeWidth="2" /><path d="M7 7H38M9 11H40" stroke="#c6b7cb" strokeWidth="1.5" strokeDasharray="3 2" /></svg>;
}

export function RoomLife() {
  const [actors, setActors] = useState(initialActors);
  const [reducedMotion, setReducedMotion] = useState(false);
  const actorsRef = useRef(actors);
  const lastPlanId = useRef(plans[0].id);
  const cyclesSinceSleep = useRef(0);

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

    function clearSpeech() {
      publish((items) => items.map((item) => ({ ...item, speech: undefined })));
    }

    function scheduleSpeech(plan: Plan) {
      if (plan.exchanges?.length && Math.random() < .74) {
        const exchange = pick(plan.exchanges);
        const first = exchange.first || "janna";
        const second: CharacterName = first === "janna" ? "josh" : "janna";
        later(() => publish((items) => items.map((item) => ({ ...item, speech: item.character === first ? exchange[first] : undefined }))), 1200);
        later(() => publish((items) => items.map((item) => ({ ...item, speech: item.character === second ? exchange[second] : undefined }))), 3900);
        later(clearSpeech, 6800);
        return;
      }
      const scripted = (["janna", "josh"] as CharacterName[]).map((name) => ({ name, line: plan[name].speech })).filter((item) => item.line);
      if (scripted.length) {
        const chosen = pick(scripted);
        later(() => publish((items) => items.map((item) => ({ ...item, speech: item.character === chosen.name ? chosen.line : undefined }))), 900);
        later(clearSpeech, Math.min(4200, plan.duration[0] - 300));
      }
    }

    function beginActivity(plan: Plan) {
      const arriving = (["janna", "josh"] as CharacterName[]).map((character) => resolveActor(character, plan[character], "arriving"));
      publish(arriving);
      later(() => {
        publish(arriving.map((item) => ({ ...item, phase: item.activity === "sleeping" ? "sleeping" as const : "active" as const })));
        scheduleSpeech(plan);
        const [minimum, maximum] = plan.duration;
        const duration = reducedMotion ? (minimum + maximum) / 2 : minimum + Math.random() * (maximum - minimum);
        later(nextCycle, duration);
      }, reducedMotion ? 100 : 950);
    }

    function walkRoute(plan: Plan) {
      const routes = (["janna", "josh"] as CharacterName[]).map((character, index) => safeRoute(actorsRef.current[index], plan[character].anchor, character));
      const advance = (step: number) => {
        if (step >= Math.max(0, ...routes.map((route) => route.length))) {
          publish((items) => items.map((item, index) => routes[index].length
            ? { ...item, pose: "idle" as Pose, phase: "settling" as const }
            : { ...item, phase: "settling" as const }));
          later(() => beginActivity(plan), reducedMotion ? 60 : 360);
          return;
        }
        let wait = reducedMotion ? 90 : 520;
        publish((items) => items.map((item, index) => {
          const target = routes[index][step];
          if (!target) return item.staying ? { ...item, phase: "settling" as Phase } : { ...item, pose: "idle" as Pose, phase: "settling" as Phase };
          const travelMs = segmentDuration(item, target, reducedMotion);
          wait = Math.max(wait, travelMs);
          const direction = movementDirection(item, target);
          return { ...item, ...target, ...direction, surface: "floor" as const, activity: "walking" as const, pose: reducedMotion ? "idle" as Pose : "walk" as Pose, phase: "walking" as const, travelMs, speech: undefined };
        }));
        later(() => advance(step + 1), wait + (reducedMotion ? 10 : 90));
      };
      advance(0);
    }

    function departFor(plan: Plan) {
      const current = actorsRef.current;
      const leaving = current.map((item) => {
        const destination = plan[item.character];
        if (item.anchor === destination.anchor && item.surface === roomAnchors[destination.anchor].surface && !(item.activity === "sleeping" && destination.activity !== "sleeping")) {
          return { ...item, phase: "settling" as const, speech: undefined, staying: true, travelMs: 0 };
        }
        const exit = roomAnchors[item.anchor].approach;
        const travelMs = segmentDuration(item, exit, reducedMotion);
        const direction = movementDirection(item, exit);
        return {
          ...item,
          ...exit,
          ...direction,
          surface: "floor" as const,
          activity: "walking" as const,
          pose: reducedMotion ? "idle" as Pose : "walk" as Pose,
          phase: item.surface === "bed" ? "hidden" as const : "walking" as const,
          speech: undefined,
          travelMs,
          staying: false,
        };
      });
      publish(leaving);
      later(() => publish((items) => items.map((item, index) => item.staying
        ? { ...item, phase: "settling" as const }
        : current[index].surface === "bed"
          ? { ...item, pose: "idle" as Pose, phase: "settling" as const }
          : { ...item, phase: "walking" as const })), reducedMotion ? 40 : 180);
      const visibleTravel = leaving.filter((item, index) => !item.staying && current[index].surface !== "bed").map((item) => item.travelMs);
      const wait = reducedMotion ? 100 : Math.max(500, ...visibleTravel);
      later(() => walkRoute(plan), wait + 120);
    }

    function nextCycle() {
      const plan = weightedPlan(lastPlanId.current, cyclesSinceSleep.current);
      lastPlanId.current = plan.id;
      cyclesSinceSleep.current = plan.id === "both-sleep" ? 0 : cyclesSinceSleep.current + 1;
      const hasSleeper = actorsRef.current.some((item) => item.activity === "sleeping");
      if (hasSleeper) {
        publish((items) => items.map((item) => item.activity === "sleeping" ? { ...item, phase: "waking" as const, speech: undefined } : { ...item, speech: undefined }));
        later(() => departFor(plan), reducedMotion ? 100 : 900);
      } else {
        departFor(plan);
      }
    }

    later(nextCycle, 10000 + Math.random() * 7000);
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [reducedMotion]);

  return (
    <div className="room-life-layer" role="group" aria-label="Janna and Josh spending a quiet day at home">
      {actors.map((resident) => {
        const elevation = resident.surface === "bed" ? .98 : resident.surface === "sofa" ? .39 : resident.surface === "desk" ? .35 : 0;
        const point = projectRoom(resident.x, resident.y, elevation);
        const actorDepth = resident.activity === "watering"
          ? ROOM_FURNITURE_DEPTH.plant - 1
          : resident.surface === "bed"
            ? ROOM_FURNITURE_DEPTH.bed + 2
            : resident.surface === "sofa"
              ? ROOM_FURNITURE_DEPTH.couch + 2
              : resident.surface === "desk"
                ? ROOM_FURNITURE_DEPTH.chair + 2
                : roomDepth(resident.x, resident.y);
        const style = {
          left: `${point.x / ROOM_WIDTH * 100}%`,
          top: `${point.y / ROOM_HEIGHT * 100}%`,
          zIndex: actorDepth,
          "--room-facing": resident.facing,
          "--room-travel-ms": `${resident.travelMs}ms`,
        } as CSSProperties;
        const sleeping = resident.activity === "sleeping";
        return (
          <div
            key={resident.character}
            className={`room-life-person room-life-${resident.character} room-life-${resident.activity} room-life-${resident.surface} room-life-pose-${resident.pose} room-life-phase-${resident.phase} room-life-direction-${resident.direction}`}
            style={style}
            data-anchor={resident.anchor}
          >
            {resident.speech && <span className="room-life-bubble" role="status">{resident.speech}</span>}
            {sleeping ? (
              <RoomSleepPose character={resident.character} waking={resident.phase === "waking"} />
            ) : (
              <OurVerseCharacter character={resident.character} pose={resident.pose} expression={resident.expression} />
            )}
            {(resident.activity === "reading" || resident.activity === "browsing") && <BookProp />}
            {resident.activity === "phone" && <PhoneProp />}
            {resident.activity === "drinking" && <MugProp />}
            {resident.activity === "watering" && <WateringProp />}
            {resident.activity === "working" && <WorkProp />}
          </div>
        );
      })}
    </div>
  );
}
