"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Couple, OurVerseCharacter } from "./characters";
import { Modal, SectionHeading } from "./ui";
import { useUniverse } from "./provider";
import {
  dailyMessages,
  conversations,
  coupons,
  jarNotes,
  mailboxNotes,
  questions,
  loveTraits,
  dreams,
  capsule,
  calendarEvents,
  patchNotes,
  gifts,
  type Coupon,
} from "@/data/expansion";
import { memories } from "@/data/memories";
import { settings } from "@/config/settings";
import { dateLabel, pick } from "@/lib/utils";
import { DestinationArt } from "./galaxy";
import { RoomLife } from "./room-life";
import { AdventureMap } from "./adventure-map";
type Navigation = { navigate: (id: string) => void };
type SouvenirKind = "tickets" | "notebook" | "jar" | "phone" | "parcel";
const homeSouvenirs = [
  { id: "coupons", label: "Tickets on the desk", kind: "tickets" },
  { id: "future", label: "Our someday notebook", kind: "notebook" },
  { id: "jar", label: "The little love jar", kind: "jar" },
  { id: "questions", label: "Stay up talking", kind: "phone" },
  { id: "gifts", label: "A mysterious parcel", kind: "parcel" },
] as const;

function SouvenirArt({ kind }: { kind: SouvenirKind }) {
  if (kind === "tickets") return <svg viewBox="0 0 120 88" aria-hidden="true"><g transform="rotate(8 66 40)"><path d="M36 19H105V29Q98 35 105 41V62H36V51Q43 45 36 39Z" fill="#b89caf" stroke="#e2cad2" strokeWidth="2"/><path d="M47 27H94M47 34H81" stroke="#604a68" strokeWidth="2" strokeDasharray="2 3"/><path d="M83 48C78 42 71 48 83 57C95 48 89 42 83 48Z" fill="#f2d2cd"/><path d="M20 28H83V38Q76 44 83 50V72H20V61Q27 55 20 49Z" fill="#f3e4d2" stroke="#fff0dc" strokeWidth="2"/><path d="M31 38H69M31 44H61" stroke="#9d7890" strokeWidth="2" strokeDasharray="2 3"/><path d="M66 57L69 62L75 63L71 67L72 73L66 70L61 73L62 67L58 63L64 62Z" fill="#d9b77a"/></g></svg>;
  if (kind === "notebook") return <svg viewBox="0 0 120 88" aria-hidden="true"><g transform="rotate(-7 60 45)"><path d="M24 17Q26 12 32 13L94 21V73L31 65Q24 64 24 58Z" fill="#e8d8c9"/><path d="M31 13L99 20V70L31 64Q26 63 26 57V19Q26 14 31 13Z" fill="#74617e" stroke="#c6afc9" strokeWidth="2"/><path d="M37 22V60M44 28L85 33M44 37L82 41M44 46L75 49" stroke="#eadedb" strokeWidth="2" opacity=".8"/><path d="M66 24L70 70" stroke="#bca4d0" strokeWidth="4"/><path d="M61 25L66 29L71 25V59L66 64L61 59Z" fill="#d89aae"/><path d="M86 52C82 47 76 52 86 60C96 52 91 47 86 52Z" fill="#f1c4cf"/></g></svg>;
  if (kind === "jar") return <svg viewBox="0 0 120 88" aria-hidden="true"><path d="M42 18H78V25L85 32V68Q85 76 77 76H43Q35 76 35 68V32L42 25Z" fill="#b9c5d94a" stroke="#e5d8e6" strokeWidth="2.5"/><path d="M39 20H81V30H39Z" fill="#b889a5" stroke="#e7c5d2" strokeWidth="2"/><path d="M39 27Q60 34 81 27M37 31Q60 38 83 31" fill="none" stroke="#e8c992" strokeWidth="2"/><path d="M47 47C43 42 38 47 47 54C56 47 51 42 47 47Z" fill="#f2d2dc"/><path d="M68 54C63 48 58 54 68 61C78 54 73 48 68 54Z" fill="#d7c8e6"/><path d="M52 63L67 65M44 39L51 40" stroke="#fff2e4" strokeWidth="2" strokeLinecap="round"/><path d="M60 18C54 10 48 17 60 23C72 17 66 10 60 18Z" fill="#d99ab0"/></svg>;
  if (kind === "phone") return <svg viewBox="0 0 120 88" aria-hidden="true"><path d="M29 22Q29 16 36 16H77Q84 16 84 23V73Q84 79 77 79H36Q29 79 29 72Z" fill="#24243b" stroke="#c7b5d8" strokeWidth="3"/><rect x="35" y="25" width="43" height="43" rx="5" fill="#d9d0e5"/><path d="M41 34H67Q71 34 71 38V43H50L45 47V43H41Z" fill="#f7eee4"/><path d="M45 51H69Q72 51 72 55V60H55L50 64V60H45Z" fill="#e3a9c0"/><circle cx="73" cy="30" r="2" fill="#d89bb4"/><path d="M94 20A10 10 0 1 0 104 35A8 8 0 0 1 94 20Z" fill="#eedfbf"/><path d="M19 27L21 32L26 34L21 36L19 41L17 36L12 34L17 32Z" fill="#e4c88f"/></svg>;
  return <svg viewBox="0 0 120 88" aria-hidden="true"><g transform="rotate(-5 60 47)"><path d="M24 30L58 14L96 29V68L60 82L24 65Z" fill="#b88978" stroke="#e4c6ad" strokeWidth="2"/><path d="M24 30L60 44L96 29M60 44V81" fill="none" stroke="#f1d8ba" strokeWidth="3"/><path d="M56 17L63 17L67 44L59 44Z" fill="#e9c992"/><path d="M28 36L35 39V55L28 52ZM85 35L92 32V49L85 52Z" fill="#d99caf"/><rect x="40" y="50" width="24" height="16" rx="2" fill="#f3e7d8"/><path d="M48 58Q52 53 56 58Q52 62 48 58Z" fill="none" stroke="#937a91" strokeWidth="1.5"/><path d="M78 62L81 67L86 68L82 72L83 77L78 74L73 77L74 72L70 68L76 67Z" fill="#f1d390"/></g></svg>;
}

export default function Experiences({
  section,
  navigate,
}: { section: string } & Navigation) {
  switch (section) {
    case "room":
      return <OurHome navigate={navigate} />;
    case "traits":
      return <Things navigate={navigate} />;
    case "hand":
      return <HoldHand />;
    case "heartbeat":
      return <Heartbeat />;
    case "coupons":
      return <Coupons />;
    case "messages":
      return <Messages />;
    case "calendar":
      return <Calendar />;
    case "daily":
      return <Daily />;
    case "mailbox":
      return <Mailbox />;
    case "jar":
      return <LoveJar />;
    case "questions":
      return <Questions />;
    case "garden":
      return <Garden />;
    case "future":
      return <Future navigate={navigate} />;
    case "capsule":
      return <Capsule />;
    case "travel":
      return <Adventure />;
    case "gifts":
      return <Gifts />;
    case "generator":
      return <Generator />;
    case "press":
      return <DoNotPress navigate={navigate} />;
    case "mission":
      return <Mission navigate={navigate} />;
    case "patch":
      return <Patch navigate={navigate} />;
    case "sleep":
      return <Sleep navigate={navigate} />;
    default:
      return <OurHome navigate={navigate} />;
  }
}
const roomObjects = [
  { id: "sleep", name: "Bed", kind: "bed", x: 17.5, y: 74 },
  { id: "messages", name: "Laptop", kind: "laptop", x: 87, y: 55 },
  { id: "memories", name: "Photo frame", kind: "frame", x: 21, y: 30 },
  { id: "letters", name: "Bookshelf", kind: "books", x: 50, y: 31 },
  { id: "games", name: "Game console", kind: "console", x: 94, y: 59 },
  { id: "world", name: "Window", kind: "window", x: 74, y: 31 },
  { id: "calendar", name: "Calendar", kind: "calendar", x: 87, y: 27 },
  { id: "music", name: "Music player", kind: "radio", x: 58, y: 40 },
  { id: "mailbox", name: "Mailbox", kind: "mailbox", x: 9, y: 58 },
  { id: "garden", name: "Plant", kind: "plant", x: 69, y: 70 },
];
function RoomIllustration() {
  return (
    <svg className="room-illustration" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="room-back-wall" x2="0" y2="1"><stop stopColor="#45415d"/><stop offset="1" stopColor="#302e47"/></linearGradient>
        <linearGradient id="room-side-wall" x2="1" y2="1"><stop stopColor="#29283f"/><stop offset="1" stopColor="#38324b"/></linearGradient>
        <linearGradient id="room-floor-wood" x2="0" y2="1"><stop stopColor="#755e60"/><stop offset="1" stopColor="#463b4c"/></linearGradient>
        <linearGradient id="room-window-glow" x2="0" y2="1"><stop stopColor="#a9b8df" stopOpacity=".46"/><stop offset="1" stopColor="#a9b8df" stopOpacity="0"/></linearGradient>
        <linearGradient id="room-quilt" x2="1" y2="1"><stop stopColor="#a68ca8"/><stop offset="1" stopColor="#725e80"/></linearGradient>
        <linearGradient id="room-sofa" x2="0" y2="1"><stop stopColor="#a77e91"/><stop offset="1" stopColor="#73596f"/></linearGradient>
        <filter id="room-soft-shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      {/* A little cutaway shell: side return, back wall, baseboard, then grounded floor. */}
      <path d="M0 22L114 57V410L0 455Z" fill="url(#room-side-wall)"/>
      <path d="M114 57L971 57L1000 420L114 410Z" fill="url(#room-back-wall)"/>
      <path d="M114 57L971 57V75L114 75Z" fill="#625872" opacity=".5"/>
      <path d="M115 75V407M967 75L995 416" stroke="#c7b7c533" strokeWidth="2"/>
      <path d="M114 386L1000 397V434L114 426Z" fill="#9a7e7b"/>
      <path d="M114 394L1000 405" stroke="#d2b5a7" strokeOpacity=".45" strokeWidth="4"/>
      <path d="M0 455L114 426L1000 434V600H0Z" fill="url(#room-floor-wood)"/>
      <path d="M0 455L114 426L1000 434" fill="none" stroke="#c2a28d" strokeWidth="7" opacity=".72"/>
      <g stroke="#d9bdad" strokeOpacity=".13" strokeWidth="2">
        <path d="M0 495L1000 475M0 550L1000 528M142 428L83 600M330 430L315 600M548 431L570 600M765 433L827 600M930 434L1000 581"/>
        <path d="M0 522H1000M0 577H1000"/>
      </g>
      <path d="M138 100Q310 75 470 99T802 98T962 94M132 366Q355 350 540 367T960 364" fill="none" stroke="#cbb7cb" strokeOpacity=".12" strokeWidth="2"/>

      {/* Moonlit window: the cool light spills softly onto the room. */}
      <g className="scene-window">
      <path d="M638 91H823V296H638Z" fill="url(#room-window-glow)" opacity=".8"/>
      <rect x="661" y="107" width="145" height="161" rx="7" fill="#252e49" stroke="#c3aec0" strokeWidth="11"/>
      <rect x="673" y="119" width="121" height="137" rx="2" fill="#1e2943"/>
      <path d="M674 221L706 184L735 221L759 196L793 230V256H674Z" fill="#45516b"/>
      <path d="M674 240Q709 218 743 238T793 231V256H674Z" fill="#39445e"/>
      <path d="M752 136A19 19 0 1 0 773 164A16 16 0 0 1 752 136Z" fill="#ecdfc0"/>
      <g fill="#f0e7d5"><circle cx="703" cy="143" r="2"/><circle cx="780" cy="185" r="1.7"/><circle cx="723" cy="171" r="1.3"/><path d="M743 128l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g>
      <path d="M734 109V268M673 200H793" stroke="#c2b0c1" strokeWidth="7"/>
      <path d="M650 91Q635 180 652 290L674 276V108ZM816 91Q834 174 814 289L795 275V108Z" fill="#8b647d" stroke="#b98ea0" strokeWidth="3"/>
      <path d="M650 92Q662 104 674 108M816 92Q804 104 795 108" fill="none" stroke="#ddbdc3" strokeWidth="5"/>
      </g>

      {/* Wall memories, calendar, and a varied little bookshelf. */}
      <g className="scene-frame">
      <rect x="150" y="125" width="112" height="104" rx="4" fill="#a88473" stroke="#e0c3a3" strokeWidth="5"/>
      <rect x="159" y="134" width="94" height="85" fill="#273149"/>
      <circle cx="216" cy="158" r="14" fill="#eadab9"/>
      <path d="M160 200L188 168L210 197L228 178L252 201V219H160Z" fill="#58647b"/>
      <path d="M196 190C182 178 176 196 196 207C215 196 210 178 196 190Z" fill="#d79eaf"/>
      </g>
      <path d="M286 166H367V229H286Z" fill="#332e46" stroke="#bda5b2" strokeWidth="3"/>
      <path d="M286 166L326 144L367 166" fill="#9a7182" stroke="#d4b7bd" strokeWidth="3"/>
      <text x="326" y="204" textAnchor="middle" fill="#f0e2cd" fontSize="21" fontFamily="serif">J + J</text>
      <g className="scene-bookshelf">
      <path d="M420 166H604V263H420Z" fill="#4c3d4a" stroke="#a27c70" strokeWidth="8"/>
      <path d="M422 155H603V166H422Z" fill="#9b766d" stroke="#d2b49a" strokeWidth="3"/>
      <path d="M435 153V124H457V153ZM461 153V114H482V153ZM488 153V132H505V153Z" fill="#a66f7d" stroke="#d4b5aa" strokeWidth="2"/>
      <path d="M511 153V119H534V153ZM539 153V129H559V153Z" fill="#72748e" stroke="#c9b8bc" strokeWidth="2"/>
      <path d="M432 142H454M465 134H479M515 132H530M543 141H556" stroke="#ead3bd" strokeWidth="2" opacity=".7"/>
      <path d="M570 152Q579 133 588 151V156H570Z" fill="#67806e"/>
      <rect x="566" y="153" width="26" height="8" rx="3" fill="#b98577"/>
      <path d="M420 166V263H604V166M420 215H604" fill="none" stroke="#a27c70" strokeWidth="8"/>
      <path d="M435 207V178H449V207ZM453 207V183H468V207ZM473 207V173H489V207Z" fill="#927080"/>
      <path d="M496 207H535V197H496ZM501 194H541V184H501Z" fill="#d2b398"/>
      <circle cx="558" cy="193" r="10" fill="#d9b675"/><path d="M550 207Q558 197 566 207V212H550Z" fill="#ce9caf"/>
      <path d="M438 258V228H455V258ZM459 258V235H479V258ZM483 258V224H497V258Z" fill="#77758d"/>
      <path d="M507 258H552V249H507ZM513 246H556V237H513Z" fill="#b68a79"/>
      </g>
      <g className="scene-calendar">
      <path d="M833 111H912V203H833Z" fill="#efe0cd" stroke="#a97e88" strokeWidth="5"/>
      <path d="M833 133H912" stroke="#c99aa0" strokeWidth="10"/>
      <text x="872" y="167" textAnchor="middle" fill="#66546b" fontSize="25" fontFamily="serif">21</text>
      <path d="M848 181H860M866 181H878M884 181H896" stroke="#ab91a0" strokeWidth="3"/>
      </g>

      {/* Bedside grouping: substantial frame, layered bedding, pillows, lamp and keepsakes. */}
      <g className="scene-bed" transform="translate(-18 0) scale(.9 1)">
      <ellipse cx="245" cy="522" rx="196" ry="28" fill="#171528" opacity=".4" filter="url(#room-soft-shadow)"/>
      <path d="M48 358Q49 344 64 344H365Q380 344 380 360V504H48Z" fill="#644958" stroke="#ba9589" strokeWidth="5"/>
      <path d="M58 366H370V494H58Z" fill="#c2a5a0"/>
      <path d="M65 379Q70 365 91 369L181 382V423L68 421Z" fill="#f1e2d5" stroke="#d9c5bc" strokeWidth="3"/>
      <path d="M190 378Q200 364 219 369L300 382V423L194 421Z" fill="#e8d9d2" stroke="#d9c5bc" strokeWidth="3"/>
      <path d="M61 418Q119 399 181 419L215 442Q270 399 370 424V486H61Z" fill="url(#room-quilt)" stroke="#c5a4b0" strokeWidth="3"/>
      <path d="M71 437Q137 421 199 441M226 439Q292 419 357 440M72 463Q148 447 205 465M223 466Q291 446 358 463" fill="none" stroke="#d9bcca" strokeOpacity=".48" strokeWidth="3"/>
      <path d="M204 432L224 441L215 470L197 461Z" fill="#e0c9bc"/>
      <rect x="43" y="497" width="340" height="22" rx="5" fill="#9b736f"/>
      <path d="M58 518V545M366 518V545" stroke="#674a52" strokeWidth="12"/>
      </g>
      {/* Bedside table and warm lamp. */}
      <g className="scene-bedside" transform="translate(25 0) scale(.8 1)">
      <ellipse cx="427" cy="491" rx="51" ry="11" fill="#211a2c" opacity=".3"/>
      <path d="M390 408H466V481H390Z" fill="#82615d" stroke="#c2a087" strokeWidth="4"/>
      <path d="M384 401H472V414H384Z" fill="#bd987c"/>
      <path d="M398 432H458V464H398Z" fill="#74565a" stroke="#b48c7d" strokeWidth="2"/>
      <circle cx="428" cy="448" r="3" fill="#e8d0a5"/>
      <path d="M417 400V365M439 400V365" stroke="#d2b78d" strokeWidth="4"/>
      <path d="M405 367Q428 331 451 367Z" fill="#e4c89b" stroke="#f1ddb7" strokeWidth="3"/>
      <ellipse className="room-lamp-glow" cx="428" cy="376" rx="47" ry="62" fill="#e8c98c" opacity=".16"/>
      <path d="M404 395H452" stroke="#a37d72" strokeWidth="5"/>
      <path d="M405 397H451V407H405Z" fill="#d6b58d"/>
      <rect x="386" y="383" width="17" height="15" rx="2" fill="#d9c6a8"/><path d="M389 388H400M389 392H398" stroke="#a38483"/>
      </g>

      {/* Central rug and loveseat create a clear, welcoming sitting zone. */}
      <g transform="translate(163 155) scale(.65 .77)">
      <path d="M360 511Q538 467 725 499Q808 515 801 553Q784 584 580 583Q386 582 349 552Q339 535 360 511Z" fill="#171526" opacity=".52"/>
      <path d="M363 486Q536 445 724 477Q791 489 783 533Q768 564 580 565Q395 564 359 535Q344 514 363 486Z" fill="#5b506a" stroke="#b59caf" strokeWidth="5"/>
      <path d="M383 496Q541 466 708 491Q754 499 750 527Q734 545 579 546Q420 547 384 524Z" fill="#665a74" stroke="#d0b8c5" strokeWidth="2"/>
      </g>
      <svg className="scene-sofa" x="405" y="424" width="232" height="110" viewBox="364 432 393 120" preserveAspectRatio="none" overflow="visible">
      <path d="M420 458Q422 435 448 432H671Q695 436 696 459V492Q560 468 420 495Z" fill="#8c6d83" stroke="#c69cac" strokeWidth="4"/>
      <path d="M375 494Q364 465 385 448Q403 433 436 445L460 464V520L390 530Q368 520 375 494ZM745 492Q757 462 737 447Q716 434 687 445L666 466V521L730 531Q750 520 745 492Z" fill="url(#room-sofa)" stroke="#c69cac" strokeWidth="4"/>
      <path d="M450 470Q478 451 514 468L510 512Q478 527 447 509ZM526 466Q562 454 593 469L594 510Q560 526 524 511ZM608 467Q640 454 670 472L661 514Q630 524 602 511Z" fill="#c8a8b3" stroke="#e0c3c8" strokeWidth="2"/>
      <path d="M468 480Q478 476 488 480M548 478Q558 474 568 479M626 480Q636 476 646 480" fill="none" stroke="#f0d8d7" strokeOpacity=".65" strokeWidth="3"/>
      <path d="M390 518Q559 535 730 518V536Q559 552 390 536Z" fill="#674d62" stroke="#b68f9e" strokeWidth="3"/>
      <path d="M410 535V549M708 535V549" stroke="#5a414e" strokeWidth="11"/>
      </svg>
      {/* Low coffee table in front of the loveseat, grounded on the rug. */}
      <g className="scene-coffee-table" transform="translate(96 265) scale(.8 .55)">
      <ellipse cx="558" cy="561" rx="77" ry="13" fill="#171426" opacity=".33"/>
      <path d="M497 527L505 565M612 527L606 565" stroke="#674d50" strokeWidth="8"/>
      <path d="M477 518Q558 495 640 518Q649 524 640 533Q558 553 477 533Q467 526 477 518Z" fill="#a17b70" stroke="#d4aa91" strokeWidth="4"/>
      <path d="M492 520Q558 504 625 520" fill="none" stroke="#e1c0a0" strokeWidth="3" opacity=".7"/>
      <path d="M523 543Q535 537 547 543V563H523Z" fill="#e1cdb9" stroke="#f3e3d0" strokeWidth="2"/>
      <path d="M547 547Q555 545 553 554Q551 559 547 555" fill="none" stroke="#eee0cf" strokeWidth="2"/>
      <path d="M526 547H544" stroke="#aa8990" strokeWidth="2"/>
      <path d="M581 542C575 535 568 543 581 552C594 543 587 535 581 542Z" fill="#dca4b6"/>
      </g>

      {/* Desk and hobby corner: monitor, console, books, headphones, and a little task lamp. */}
      <g transform="translate(140 0) scale(.88 1)">
      <ellipse cx="827" cy="496" rx="128" ry="19" fill="#181626" opacity=".35"/>
      <path d="M700 342H955V368H700Z" fill="#bd9579" stroke="#e1b99a" strokeWidth="4"/>
      <path d="M716 368V483M937 368V483" stroke="#8d6864" strokeWidth="17"/>
      <path d="M716 405H779V481H716Z" fill="#8e6c66" stroke="#bd947d" strokeWidth="3"/>
      <path d="M727 424H768V461H727Z" fill="#76585d"/><circle cx="748" cy="442" r="3" fill="#d9b684"/>
      <g className="scene-laptop">
      <rect x="783" y="313" width="89" height="29" rx="5" fill="#302d46" stroke="#b8a9bd" strokeWidth="4"/>
      <path d="M792 320H863V336H792Z" fill="#8498b4" opacity=".85"/>
      <path d="M819 342L836 342L846 352H811Z" fill="#958c9d"/>
      <path d="M789 353H865V361H789Z" fill="#dfd2d0"/>
      </g>
      <g className="scene-console">
      <rect x="887" y="341" width="39" height="21" rx="5" fill="#6f6077" stroke="#d6c0c7" strokeWidth="3"/>
      <circle cx="898" cy="351" r="2" fill="#ecd9ad"/><circle cx="906" cy="351" r="2" fill="#ecd9ad"/><circle cx="914" cy="351" r="2" fill="#ecd9ad"/>
      </g>
      <path d="M879 341Q901 307 923 341" fill="none" stroke="#d2b6c2" strokeWidth="5"/><path d="M882 342V353M920 342V353" stroke="#c9aec0" strokeWidth="6"/>
      <path d="M922 338V300M939 338V300" stroke="#c8aa8d" strokeWidth="4"/><path d="M910 302Q931 274 951 302Z" fill="#e4c696" stroke="#f2dfb4" strokeWidth="3"/><ellipse cx="931" cy="315" rx="35" ry="43" fill="#e1bd7c" opacity=".08"/>
      <path d="M706 336H736V310H706Z" fill="#ede0cd"/><path d="M709 317H732M709 323H729M709 329H726" stroke="#ae8f95" strokeWidth="2"/>
      <path d="M736 337V320H749V337ZM751 337V314H765V337ZM768 337V323H779V337Z" fill="#907080" stroke="#d2b4a7" strokeWidth="2"/>
      <path d="M841 335L851 319L862 335Z" fill="#6f8978"/><rect x="842" y="335" width="20" height="5" rx="2" fill="#b77f75"/>
      <path d="M688 485H966" stroke="#4c3d4a" strokeWidth="9"/>
      <path d="M684 489H968" stroke="#c3a08a" strokeWidth="3"/>
      </g>

      {/* Plant by the moonlit window; little entry mailbox is built into the side wall. */}
      <g className="scene-plant" transform="translate(48 0)">
      <path d="M610 411H665L657 471H618Z" fill="#a46f73" stroke="#d5a797" strokeWidth="3"/>
      <path d="M637 410Q620 380 603 387Q610 408 636 417M640 408Q640 369 661 366Q668 391 643 417M633 410Q616 399 616 374Q639 381 640 410M644 409Q655 386 679 390Q672 413 645 420" fill="#708b76" stroke="#a4b38b" strokeWidth="2"/>
      </g>
      <g className="scene-mailbox">
      <path d="M72 330Q92 312 112 330V380H72Z" fill="#795569" stroke="#c09baa" strokeWidth="3"/>
      <path d="M69 328Q92 308 115 328V338H69Z" fill="#bb8798"/>
      <path d="M78 347H106V370H78Z" fill="#4a3d57" stroke="#d4b3b7" strokeWidth="2"/>
      <path d="M83 353H101M83 358H98" stroke="#e4cad0" strokeWidth="2"/>
      <path d="M92 339V349" stroke="#e5c99b" strokeWidth="3"/>
      </g>
      {/* A tiny music player tucked into the lower bookcase shelf. */}
      <g className="scene-radio">
      <rect x="559" y="229" width="42" height="26" rx="4" fill="#3b354d" stroke="#c4a5a0" strokeWidth="3"/>
      <rect x="564" y="234" width="25" height="7" rx="2" fill="#d3b8a7"/>
      <circle cx="592" cy="244" r="5" fill="#d6b97f"/><path d="M567 247H584" stroke="#9c8394" strokeWidth="2"/>
      </g>
      {/* The headphones hang neatly over the desk chair back. */}
      <g className="scene-desk-chair" transform="translate(140 0) scale(.88 1)">
      <path d="M793 391Q793 377 808 377H849Q863 377 863 392V428H793Z" fill="#755e76" stroke="#b38c9e" strokeWidth="4"/>
      <path d="M800 391H856V420H800Z" fill="#94768e"/>
      <path d="M795 425H862V444H795Z" fill="#b88d91" stroke="#d1aaa3" strokeWidth="3"/>
      <path d="M808 444L801 481M849 444L857 481M829 444V477" stroke="#8d7478" strokeWidth="6"/>
      <path d="M806 400Q827 365 850 400" fill="none" stroke="#d2b6c2" strokeWidth="6"/>
      <path d="M809 397V412M847 397V412" stroke="#c9aec0" strokeWidth="8" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
function OurHome({ navigate }: Navigation) {
  const [lampOn, setLampOn] = useState(true);
  return (
    <>
      <SectionHeading
        eyebrow="THE LIGHT IS ALWAYS ON FOR YOU"
        title="Our Home"
        description="Janna and Josh's little home, filled with shared stories. Look around and see where each keepsake takes you."
      />
      <div className="cozy-room">
        <RoomIllustration />
        <button
          className={`room-lamp ${lampOn ? "" : "lamp-off"}`}
          aria-label="Turn the lamp on or off"
          aria-pressed={lampOn}
          onClick={() => setLampOn((on) => !on)}
        >
          <i />
          <span />
        </button>
        {roomObjects.map((o) => (
          <button
            key={o.id}
            className={`room-object object-${o.kind}`}
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
            onClick={() => navigate(o.id)}
            aria-label={`${o.name} — ${o.id === "sleep" ? "Can’t Sleep" : o.id}`}
          >
            <span className="object-drawing" aria-hidden="true">
              {o.kind === "window" ? (
                <svg
                  viewBox="0 0 140 140"
                  aria-hidden="true"
                  className="window-landscape"
                >
                  <circle cx="96" cy="33" r="15" fill="#e2d8bf" />
                  <circle cx="103" cy="27" r="14" fill="#17213a" />
                  <path
                    d="M0 100L30 62L62 103L92 73L140 116V140H0Z"
                    fill="#333d59"
                  />
                  <path
                    d="M0 120Q34 100 70 118T140 108V140H0Z"
                    fill="#242c45"
                  />
                  <g fill="#e5d4bc">
                    <circle cx="32" cy="31" r="1" />
                    <circle cx="60" cy="18" r="1.5" />
                    <circle cx="118" cy="68" r="1" />
                  </g>
                </svg>
              ) : o.kind === "books" ? (
                <svg viewBox="0 0 110 80" aria-hidden="true">
                  <path d="M3 78V25H17V78Z" fill="#9e7486" />
                  <path d="M19 78V12H37V78Z" fill="#a8aca1" />
                  <path d="M39 78V20H52V78Z" fill="#c1a18d" />
                  <path d="M55 78V7H70V78Z" fill="#797b9e" />
                  <path d="M82 78L70 24L85 21L98 75Z" fill="#ad8490" />
                  <g stroke="#e2d1ba" strokeWidth="2" opacity=".65">
                    <path d="M7 33H13M7 65H13M23 23H33M23 29H33M43 31H48M59 18H66M59 65H66M78 32L85 30" />
                  </g>
                </svg>
              ) : o.kind === "calendar" ? (
                "21"
              ) : o.kind === "frame" ? (
                <svg viewBox="0 0 80 90" aria-hidden="true">
                  <path d="M0 0H80V90H0Z" fill="#d9c5b4" />
                  <circle cx="57" cy="25" r="11" fill="#ede0c5" />
                  <path d="M0 62Q25 28 53 62L80 50V90H0Z" fill="#7f8394" />
                  <path d="M0 75Q30 53 80 75V90H0Z" fill="#555e72" />
                  <path
                    d="M38 51C22 40 21 61 39 69C59 57 53 41 38 51Z"
                    fill="#e4b4bb"
                  />
                </svg>
              ) : o.kind === "laptop" ? (
                "you online? ♡"
              ) : o.kind === "console" ? (
                "+   • •"
              ) : o.kind === "radio" ? (
                "♫"
              ) : o.kind === "mailbox" ? (
                "✉"
              ) : o.kind === "plant" ? (
                <DestinationArt kind="garden" />
              ) : (
                ""
              )}
            </span>
            <span className="object-label">{o.name}</span>
          </button>
        ))}
        <RoomLife />
      </div>
      <p className="room-note handwritten">
        someday, no more goodbyes through a screen.
      </p>
      <div className="world-links home-souvenirs">
        {homeSouvenirs.map(({ id, label, kind }) => (
          <button key={id} className={`home-souvenir souvenir-${kind}`} type="button" onClick={() => navigate(id)} aria-label={label}>
            <span className="souvenir-art"><SouvenirArt kind={kind} /><i aria-hidden="true" /></span>
            <span className="souvenir-label">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
function Things({ navigate }: Navigation) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="things-world">
      <SectionHeading
        eyebrow="ALL THE LITTLE THINGS THAT MAKE YOU, YOU"
        title="Things I love about you."
        description="A hundred reasons could never quite explain it. Start here."
      />
      <div
        className={`trait-orbit reaction-${selected === null ? "idle" : loveTraits[selected][1]}`}
      >
        <div className="trait-josh">
          <OurVerseCharacter
            character="josh"
            pose="wave"
            expression={selected === null ? "happy" : "blushing"}
          />
        </div>
        {loveTraits.map(([title], i) => (
          <button
            key={title}
            style={
              {
                "--angle": `${(i * 360) / loveTraits.length}deg`,
              } as CSSProperties
            }
            className="trait"
            onClick={() => setSelected(i)}
          >
            {title}
          </button>
        ))}
        <span className="trait-effects" aria-hidden="true">
          {selected === null
            ? "✧"
            : loveTraits[selected][1] === "waves"
              ? "))) ♫ ((("
              : loveTraits[selected][1] === "stars"
                ? "✦ ✧ ✦"
                : "♡ ♡ ♡"}
        </span>
      </div>
      <div className="trait-message" aria-live="polite">
        {selected !== null && (
          <>
            <OurVerseCharacter
              character="janna"
              expression={
                loveTraits[selected][1] === "laugh" ? "laughing" : "love-struck"
              }
            />
            <p>{loveTraits[selected][2]}</p>
          </>
        )}
      </div>
      <div className="world-links">
        <button onClick={() => navigate("hand")}>Hold my hand ♡</button>
        <button onClick={() => navigate("heartbeat")}>
          Listen to my heart ↗
        </button>
        <button onClick={() => navigate("coupons")}>
          A little promise, on a ticket ↗
        </button>
      </div>
    </section>
  );
}
function HoldHand() {
  const [holding, setHolding] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState(false);
  const { discover } = useUniverse();
  const start = useRef(0);
  useEffect(() => {
    if (!holding) return;
    const tick = setInterval(() => {
      const s = Math.floor((performance.now() - start.current) / 1000);
      setSeconds(s);
      if (s >= 20) discover("hold-hand");
    }, 200);
    const stop = () => setHolding(false);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      clearInterval(tick);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [holding, discover]);
  function begin() {
    if (holding) return;
    start.current = performance.now();
    setSeconds(0);
    setHolding(true);
    setTouched(true);
  }
  return (
    <section
      className={`quiet-experience hold-experience ${holding ? "holding" : ""}`}
      style={{ "--warmth": Math.min(seconds / 20, 1) } as CSSProperties}
    >
      <SectionHeading
        eyebrow="STAY HERE A MOMENT"
        title="Hold my hand."
        description="There is nowhere else we need to be."
      />
      <Couple scene={holding ? "hold-hands" : "sit"} />
      <p className="emotional-line" aria-live="polite">
        {!holding
          ? touched
            ? "come back :("
            : "A little closer?"
          : seconds >= 20
            ? "I love you, Josh."
            : seconds >= 10
              ? "okay now I’m smiling like an idiot."
              : seconds >= 5
                ? "don’t let go yet."
                : "right here. with you."}
      </p>
      <button
        className="primary-button hold-button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          begin();
        }}
        onPointerUp={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        onLostPointerCapture={() => setHolding(false)}
        onBlur={() => setHolding(false)}
        onKeyDown={(e) => {
          if ([" ", "Enter"].includes(e.key)) {
            e.preventDefault();
            begin();
          }
        }}
        onKeyUp={(e) => {
          if ([" ", "Enter"].includes(e.key)) setHolding(false);
        }}
      >
        Hold Janna’s hand
      </button>
      <p>Press and hold · touch, mouse, Space or Enter</p>
      <span className="hold-hearts" aria-hidden="true">
        {holding ? "♡ ".repeat(Math.min(10, 1 + Math.floor(seconds / 2))) : ""}
      </span>
    </section>
  );
}
function Heartbeat() {
  const [taps, setTaps] = useState(0);
  const { discover } = useUniverse();
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="ONE VERY SPECIFIC SIDE EFFECT"
        title="You make my heart do this."
        description="Go on. Try it."
      />
      <button
        key={taps}
        className={`heartbeat ${taps ? "thump" : ""}`}
        aria-label="Tap my heart"
        onClick={() => {
          setTaps((t) => t + 1);
          discover("heartbeat");
        }}
      >
        ♥
      </button>
      <p className="emotional-line" aria-live="polite">
        {taps
          ? ["you", "make", "my", "heart", "do", "this."][(taps - 1) % 6]
          : "♡"}
      </p>
      <span className="eyebrow">{taps ? "THUMP." : ""}</span>
    </section>
  );
}
function Coupons() {
  const { progress, update, discover } = useUniverse();
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [scene, setScene] = useState<"kiss" | "hug" | null>(null);
  const [now] = useState(() => Date.now());
  return (
    <>
      <SectionHeading
        eyebrow="ADMIT ONE VERY LOVED BOYFRIEND"
        title="Janna’s Love Coupons"
        description="Tiny paper promises. Big girlfriend energy."
      />
      {scene && <Couple scene={scene} caption="Redeemed with love. ♡" />}
      <div className="ticket-roll">
        {coupons.map((c, index) => {
          const redeemed = Math.min(c.quantity, progress.redeemed[c.id] || 0);
          const remainingUses = c.quantity - redeemed;
          const exhausted = remainingUses === 0;
          const expired = !!c.expiration && now >= Date.parse(c.expiration);
          return (
            <article
              className={`love-ticket ticket-variant-${index % 4} ${exhausted ? "redeemed" : ""}`}
              key={c.id}
            >
              <span className="ticket-symbol" aria-hidden="true" />
              <div className="ticket-main">
                <span className="eyebrow">
                  JANNA’S LOVE COUPONS · No. {String(index).padStart(2, "0")}
                </span>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <small>{c.terms}</small>
                <button
                  className="secondary-button ticket-redeem"
                  disabled={exhausted || expired}
                  onClick={() => setSelected(c)}
                >
                  {expired
                    ? "Expired"
                    : exhausted
                      ? "REDEEMED"
                      : "Redeem"}
                </button>
              </div>
              <div className="ticket-stub">
                <span className="ticket-used">{exhausted ? "REDEEMED" : `USES · ${remainingUses}`}</span>
                <div className="ticket-barcode" aria-hidden="true">
                  {Array.from({ length: 15 }, (_, bar) => <i key={bar} />)}
                </div>
                <small className="ticket-stub-code">JV · {String(index).padStart(2, "0")}</small>
              </div>
            </article>
          );
        })}
      </div>
      {selected && (
        <Modal
          title={`Redeem ${selected.title}?`}
          onClose={() => setSelected(null)}
        >
          <p>Are you sure you want to use your {selected.title} coupon?</p>
          <div className="dialog-actions">
            <button
              className="secondary-button"
              onClick={() => setSelected(null)}
            >
              Never mind
            </button>
            <button
              className="primary-button"
              onClick={() => {
                const c = selected;
                update((p) => ({
                  ...p,
                  redeemed: {
                    ...p.redeemed,
                    [c.id]: Math.min(c.quantity, (p.redeemed[c.id] || 0) + 1),
                  },
                }));
                discover("coupon");
                setScene(c.id === "coupon-v2-yes-day" ? "kiss" : "hug");
                setSelected(null);
              }}
            >
              {selected.id === "coupon-v2-yes-day"
                ? "Give me my kiss"
                : "Yes, redeem it ♡"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
function Messages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const { discover } = useUniverse();
  const c = conversations[index];
  useEffect(() => {
    if (visible >= c.messages.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1300);
    return () => clearTimeout(t);
  }, [visible, c]);
  return (
    <>
      <SectionHeading
        eyebrow="LITTLE WORDS. BIG FEELINGS."
        title="Our Messages"
        description="Conversations worth keeping. Replace these imagined exchanges with our own."
      />
      <div className="conversation">
        <span className="eyebrow">{c.title}</span>
        {c.messages.slice(0, visible).map((m, i) => (
          <div className={`chat-message ${m.sender.toLowerCase()}`} key={i}>
            <small>
              {m.sender} · {m.timestamp}
            </small>
            <p>{m.text}</p>
            {m.image && (
              <Image
                src={m.image}
                alt="A moon shared across the miles"
                width={260}
                height={180}
              />
            )}
            <span>{m.reaction}</span>
          </div>
        ))}
      </div>
      <div className="dialog-actions">
        <button
          className="secondary-button"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => i - 1);
            setVisible(1);
          }}
        >
          Previous
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            setVisible(1);
            discover("messages");
          }}
        >
          Replay
        </button>
        <button
          className="secondary-button"
          disabled={index === conversations.length - 1}
          onClick={() => {
            setIndex((i) => i + 1);
            setVisible(1);
            discover("messages");
          }}
        >
          Next
        </button>
      </div>
      <Couple scene="sit" />
    </>
  );
}
function Calendar() {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const { progress } = useUniverse();
  const events = [
    ...calendarEvents,
    ...(settings.birthday
      ? [
          {
            date: `${month.getFullYear()}-${settings.birthday}`,
            title: "Josh’s birthday",
            type: "birthday",
            story: "Happy birthday, my favorite human. ♡",
          },
        ]
      : []),
    ...memories.map((m) => ({
      date: m.date,
      title: m.caption,
      type: "memory",
      story: m.description,
    })),
    ...dreams
      .filter((d) => progress.dreams[d.id])
      .map((d) => ({
        date: progress.dreams[d.id].slice(0, 10),
        title: d.title,
        type: "memory",
        story: d.description,
      })),
  ];
  const start = month.getDay();
  const length = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  return (
    <>
      <SectionHeading
        eyebrow="DAYS WE KEEP. DAYS WE LOOK FORWARD TO."
        title="Our little calendar"
        description="Every ordinary square can become something lovely."
      />
      <section className="paper-calendar">
        <div className="calendar-toolbar">
          <button
            aria-label="Previous month"
            onClick={() =>
              setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            ←
          </button>
          <h2>
            {month.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </h2>
          <button
            aria-label="Next month"
            onClick={() =>
              setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            →
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
          {Array.from({ length: start }, (_, i) => (
            <i key={`empty-${i}`} />
          ))}
          {Array.from({ length }, (_, i) => {
            const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
            const found = events.filter((e) => e.date === date);
            return (
              <button
                key={date}
                aria-label={`${date}${found.length ? ": " + found.map((e) => e.title).join(", ") : ""}`}
                onClick={() => setSelected(date)}
              >
                {i + 1}
                <small>
                  {found
                    .map((e) =>
                      e.type === "birthday"
                        ? "♔"
                        : e.type === "memory"
                          ? "♡"
                          : e.type === "milestone"
                            ? "★"
                            : "✦",
                    )
                    .join("")}
                </small>
              </button>
            );
          })}
        </div>
        <p>♡ memory · ★ milestone · ♔ birthday · ✦ special</p>
      </section>
      {selected && (
        <Modal title={dateLabel(selected)} onClose={() => setSelected(null)}>
          {events
            .filter((e) => e.date === selected)
            .map((e) => (
              <article key={e.title}>
                <h3>{e.title}</h3>
                <p>{e.story}</p>
              </article>
            ))}
          {!events.some((e) => e.date === selected) && (
            <p>An unwritten little day. There’s room for a memory here.</p>
          )}
        </Modal>
      )}
    </>
  );
}
function Daily() {
  const [date] = useState(() => new Date());
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow={date.toLocaleDateString("en", { dateStyle: "full" })}
        title="Josh’s message for today"
        description="One little thought to carry with you."
      />
      <blockquote className="paper-message">
        {dailyMessages[day % dailyMessages.length]}
        <span className="handwritten">♡ Janna</span>
      </blockquote>
      <Couple scene="hug" />
    </section>
  );
}
function Mailbox() {
  const [note, setNote] = useState("");
  const { discover } = useUniverse();
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="SPECIAL DELIVERY. NO POSTAGE NEEDED."
        title="You have mail ♡"
        description="Nothing urgent. Just me, thinking about you."
      />
      <button
        className={`big-mailbox ${note ? "mail-open" : ""}`}
        aria-label="Open love mailbox"
        onClick={() => {
          setNote(pick(mailboxNotes));
          discover("mailbox");
        }}
      >
        ✉<span>J + J</span>
      </button>
      {note && (
        <p className="paper-message" aria-live="polite">
          {note}
          <span className="handwritten">♡ Janna</span>
        </p>
      )}
    </section>
  );
}
function LoveJar() {
  const [note, setNote] = useState<(typeof jarNotes)[number] | null>(null);
  const [shake, setShake] = useState(0);
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="A LITTLE BIT OF EVERYTHING"
        title="The love jar"
        description="Love, nonsense, questions, and something to try together."
      />
      <div
        key={shake}
        className={`love-jar ${shake ? "jar-shake" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${15 + ((i * 23) % 60)}%`,
              top: `${25 + ((i * 13) % 50)}%`,
              rotate: `${i * 41}deg`,
            }}
          >
            ♡
          </i>
        ))}
      </div>
      <button
        className="primary-button"
        onClick={() => {
          setShake((s) => s + 1);
          setNote(pick(jarNotes));
        }}
      >
        Shake the jar
      </button>
      {note && (
        <p className="paper-message" aria-live="polite">
          <small>{note.category}</small>
          {note.text}
        </p>
      )}
    </section>
  );
}
function Questions() {
  const [category, setCategory] = useState<keyof typeof questions>("Deep");
  const [index, setIndex] = useState(0);
  return (
    <section className="quiet-experience">
      <SectionHeading
        eyebrow="ONE MORE QUESTION BEFORE WE SLEEP"
        title="Tell me something."
        description="No scores. No right answers. Just us."
      />
      <div className="filter-tabs">
        {Object.keys(questions).map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => {
              setCategory(c as keyof typeof questions);
              setIndex(0);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="emotional-line">
        {questions[category][index % questions[category].length]}
      </p>
      <button className="primary-button" onClick={() => setIndex((i) => i + 1)}>
        Another question ↗
      </button>
      <Couple scene="sit" />
    </section>
  );
}
export function LovePlantArt({ stage }: { stage: number }) {
  const stageLabels = [
    "Seed — resting in the warm soil",
    "Sprout — two tiny leaves reaching up",
    "Small plant — growing strong roots",
    "Large plant — leafy and thriving",
    "Flowering plant — blooming in full love",
  ];
  return (
    <svg
      className={`plant-illustration plant-stage-svg-${stage}`}
      viewBox="0 0 240 260"
      role="img"
      aria-label={stageLabels[stage]}
    >
      <defs>
        <radialGradient id="plantGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fde2ec" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#fcd3e1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fcd3e1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b67a84" />
          <stop offset="50%" stopColor="#c58a94" />
          <stop offset="100%" stopColor="#9e656f" />
        </linearGradient>
        <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a343d" />
          <stop offset="100%" stopColor="#674954" />
        </linearGradient>
      </defs>

      {/* Pot Shadow */}
      <ellipse cx="120" cy="238" rx="68" ry="12" fill="#00000030" />

      {/* Pot Body */}
      <path
        d="M74 180L88 234C89 237 92 239 95 239H145C148 239 151 237 152 234L166 180Z"
        fill="url(#potGrad)"
      />
      {/* Pot Rim */}
      <path
        d="M68 174H172C175 174 176 176 175 179L171 184H69L65 179C64 176 65 174 68 174Z"
        fill="#b67a84"
      />
      <path
        d="M71 176H169"
        stroke="#dfa5af"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Stamped Heart on Pot */}
      <path
        d="M120 213C120 213 113 207 113 202C113 198 116 196 119 197C120 197.5 120 199 120 199C120 199 120 197.5 121 197C124 196 127 198 127 202C127 207 120 213 120 213Z"
        fill="#deb4bd"
        opacity="0.75"
      />

      {/* Soil */}
      <ellipse cx="120" cy="180" rx="46" ry="11" fill="url(#soilGrad)" />
      <ellipse cx="120" cy="179" rx="38" ry="7" fill="#3a272f" opacity="0.6" />

      {/* Stage 0: SEED */}
      {stage === 0 && (
        <g className="stage-seed-group">
          {/* Subtle warm glow around seed */}
          <ellipse
            cx="120"
            cy="175"
            rx="18"
            ry="10"
            fill="#fcecc4"
            opacity="0.25"
          />
          {/* Tiny soil details */}
          <circle cx="108" cy="178" r="1.5" fill="#694b56" />
          <circle cx="132" cy="179" r="1.2" fill="#694b56" />
          <circle cx="114" cy="181" r="1" fill="#7a5764" />
          <circle cx="128" cy="181" r="1" fill="#7a5764" />
          {/* The Seed */}
          <ellipse
            cx="120"
            cy="175"
            rx="8.5"
            ry="6"
            fill="#deb485"
            stroke="#9f774e"
            strokeWidth="1.5"
          />
          <path
            d="M116 175Q120 177 124 175"
            stroke="#835c36"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hopeful tiny green bud tip emerging */}
          <path
            d="M122 173Q123 169 125 170"
            stroke="#8cc399"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="118" cy="173" r="1" fill="#ffffff" opacity="0.85" />
        </g>
      )}

      {/* Stage 1: SPROUT */}
      {stage === 1 && (
        <g className="stage-sprout-group">
          {/* Gentle sprout stem */}
          <path
            d="M120 178Q119 160 120 144"
            stroke="#7ba88a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left cotyledon (first baby leaf) */}
          <path
            d="M120 148C106 146 95 139 93 131C101 127 114 134 120 146Z"
            fill="#9cc7a7"
            stroke="#6e987c"
            strokeWidth="1.2"
          />
          <path
            d="M97 132Q108 137 118 147"
            stroke="#bfe2ca"
            strokeWidth="1"
            fill="none"
          />
          {/* Right cotyledon (second baby leaf) */}
          <path
            d="M120 147C134 144 145 137 147 129C139 125 126 133 120 145Z"
            fill="#8bb896"
            stroke="#5f896b"
            strokeWidth="1.2"
          />
          <path
            d="M143 130Q132 135 122 146"
            stroke="#b4dcbe"
            strokeWidth="1"
            fill="none"
          />
          {/* Tiny glistening dewdrop */}
          <circle cx="94" cy="131" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="95" cy="132" r="0.8" fill="#ffffff" />
        </g>
      )}

      {/* Stage 2: SMALL PLANT */}
      {stage === 2 && (
        <g className="stage-small-group">
          {/* Sturdy young stem */}
          <path
            d="M120 178Q118 145 120 112"
            stroke="#6e9b7d"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lower left leaf */}
          <path
            d="M120 162C92 165 74 154 68 140C86 134 110 143 120 159Z"
            fill="#719e83"
            stroke="#537b63"
            strokeWidth="1.2"
          />
          <path
            d="M71 141Q95 146 118 160"
            stroke="#97beaa"
            strokeWidth="1"
            fill="none"
          />
          {/* Lower right leaf */}
          <path
            d="M120 156C148 159 166 147 172 133C154 128 130 138 120 153Z"
            fill="#628f73"
            stroke="#476f57"
            strokeWidth="1.2"
          />
          <path
            d="M169 134Q145 139 122 154"
            stroke="#8ab29c"
            strokeWidth="1"
            fill="none"
          />
          {/* Upper left leaf */}
          <path
            d="M120 136C98 131 84 120 82 106C98 104 114 115 120 133Z"
            fill="#86b297"
            stroke="#628e73"
            strokeWidth="1.2"
          />
          <path
            d="M84 107Q102 116 118 134"
            stroke="#abd1ba"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Upper right leaf */}
          <path
            d="M120 130C142 124 156 112 158 98C142 97 126 108 120 127Z"
            fill="#78a489"
            stroke="#568267"
            strokeWidth="1.2"
          />
          <path
            d="M156 99Q138 109 122 128"
            stroke="#9ec6ae"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Top budding shoot */}
          <path
            d="M120 114C114 105 116 94 120 89C124 94 126 105 120 114Z"
            fill="#a6cfb4"
            stroke="#7ba489"
            strokeWidth="1"
          />
        </g>
      )}

      {/* Stage 3: LARGE PLANT */}
      {stage === 3 && (
        <g className="stage-large-group">
          {/* Main trunk */}
          <path
            d="M120 178Q117 132 120 68"
            stroke="#5c876e"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left branch */}
          <path
            d="M119 146Q94 138 70 118"
            stroke="#5c876e"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 118C48 118 34 105 32 90C50 88 66 100 70 116Z"
            fill="#568268"
            stroke="#3e644d"
            strokeWidth="1"
          />
          <path
            d="M80 128C58 138 46 132 40 120C56 112 74 118 79 126Z"
            fill="#67947a"
            stroke="#4b755c"
            strokeWidth="1"
          />
          <path
            d="M94 138C80 152 66 150 60 140C72 130 88 132 92 136Z"
            fill="#77a48a"
            stroke="#5a866d"
            strokeWidth="1"
          />

          {/* Right branch */}
          <path
            d="M120 134Q146 126 170 104"
            stroke="#5c876e"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M170 104C192 104 206 92 208 78C190 76 174 88 170 102Z"
            fill="#4e7960"
            stroke="#375d46"
            strokeWidth="1"
          />
          <path
            d="M160 114C182 124 194 118 200 106C184 98 166 104 161 112Z"
            fill="#5f8c72"
            stroke="#456f57"
            strokeWidth="1"
          />
          <path
            d="M146 124C160 138 174 136 180 126C168 116 152 118 148 122Z"
            fill="#729f85"
            stroke="#547f67"
            strokeWidth="1"
          />

          {/* Upper canopy leaves */}
          <path
            d="M120 102Q102 86 88 66"
            stroke="#6e9b7f"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 66C70 62 60 48 62 36C76 38 88 52 88 64Z"
            fill="#78a58a"
            stroke="#58856b"
            strokeWidth="1"
          />

          <path
            d="M120 95Q140 80 154 60"
            stroke="#6e9b7f"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M154 60C170 56 180 42 178 30C164 32 152 46 154 58Z"
            fill="#6d9b7f"
            stroke="#4f7b61"
            strokeWidth="1"
          />

          {/* Crown top leaves */}
          <path
            d="M120 68C108 52 110 36 120 28C130 36 132 52 120 68Z"
            fill="#8fc0a2"
            stroke="#699a7d"
            strokeWidth="1"
          />

          {/* Romantic curling vine tendril */}
          <path
            d="M120 115C132 108 138 98 134 90C130 84 122 88 124 94C126 98 132 98 133 94"
            stroke="#a1ccb3"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Stage 4: FLOWERING */}
      {stage === 4 && (
        <g className="stage-flowering-group">
          {/* Subtle magical romantic halo/aura */}
          <circle cx="120" cy="52" r="54" fill="url(#plantGlow)" />

          {/* Mature branching trunk and leafy canopy */}
          <path
            d="M120 178Q117 132 120 72"
            stroke="#568067"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left branch */}
          <path
            d="M119 146Q94 138 70 118"
            stroke="#568067"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 118C48 118 34 105 32 90C50 88 66 100 70 116Z"
            fill="#527d63"
            stroke="#3a6148"
            strokeWidth="1"
          />
          <path
            d="M80 128C58 138 46 132 40 120C56 112 74 118 79 126Z"
            fill="#638f75"
            stroke="#476f57"
            strokeWidth="1"
          />
          <path
            d="M94 138C80 152 66 150 60 140C72 130 88 132 92 136Z"
            fill="#729e84"
            stroke="#558066"
            strokeWidth="1"
          />

          {/* Right branch */}
          <path
            d="M120 134Q146 126 170 104"
            stroke="#568067"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M170 104C192 104 206 92 208 78C190 76 174 88 170 102Z"
            fill="#4a735b"
            stroke="#355842"
            strokeWidth="1"
          />
          <path
            d="M160 114C182 124 194 118 200 106C184 98 166 104 161 112Z"
            fill="#5a866d"
            stroke="#406951"
            strokeWidth="1"
          />
          <path
            d="M146 124C160 138 174 136 180 126C168 116 152 118 148 122Z"
            fill="#6d997f"
            stroke="#4f7a62"
            strokeWidth="1"
          />

          {/* Upper branches */}
          <path
            d="M120 102Q102 86 88 66"
            stroke="#659074"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M88 66C70 62 60 48 62 36C76 38 88 52 88 64Z"
            fill="#749f84"
          />

          <path
            d="M120 95Q140 80 154 60"
            stroke="#659074"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M154 60C170 56 180 42 178 30C164 32 152 46 154 58Z"
            fill="#68947a"
          />

          {/* Left Side Blossom */}
          <g className="flower-side-left">
            <ellipse cx="68" cy="98" rx="8" ry="10" fill="#f4b2c6" />
            <ellipse cx="62" cy="106" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="76" cy="106" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="70" cy="113" rx="8" ry="8" fill="#e28aa4" />
            <circle
              cx="69"
              cy="106"
              r="4.5"
              fill="#fde3a2"
              stroke="#e9bf6d"
              strokeWidth="0.8"
            />
          </g>

          {/* Right Side Blossom */}
          <g className="flower-side-right">
            <ellipse cx="172" cy="88" rx="8" ry="10" fill="#f4b2c6" />
            <ellipse cx="166" cy="96" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="180" cy="96" rx="9" ry="8" fill="#ec9bb3" />
            <ellipse cx="174" cy="103" rx="8" ry="8" fill="#e28aa4" />
            <circle
              cx="173"
              cy="96"
              r="4.5"
              fill="#fde3a2"
              stroke="#e9bf6d"
              strokeWidth="0.8"
            />
          </g>

          {/* Central Crown Blossom */}
          <g className="flower-crown-main">
            {/* 5 Outer Rose Petals */}
            <ellipse
              cx="120"
              cy="30"
              rx="12"
              ry="16"
              fill="#f3a7bf"
              stroke="#dd88a3"
              strokeWidth="1"
            />
            <ellipse
              cx="100"
              cy="42"
              rx="15"
              ry="13"
              fill="#eb98b1"
              stroke="#d67c97"
              strokeWidth="1"
            />
            <ellipse
              cx="140"
              cy="42"
              rx="15"
              ry="13"
              fill="#eb98b1"
              stroke="#d67c97"
              strokeWidth="1"
            />
            <ellipse
              cx="108"
              cy="62"
              rx="14"
              ry="13"
              fill="#e287a1"
              stroke="#cb6b86"
              strokeWidth="1"
            />
            <ellipse
              cx="132"
              cy="62"
              rx="14"
              ry="13"
              fill="#e287a1"
              stroke="#cb6b86"
              strokeWidth="1"
            />

            {/* 5 Inner Cream-Blush Petals */}
            <ellipse cx="120" cy="38" rx="8" ry="11" fill="#fce0eb" />
            <ellipse cx="109" cy="46" rx="9" ry="8" fill="#fcd7e5" />
            <ellipse cx="131" cy="46" rx="9" ry="8" fill="#fcd7e5" />
            <ellipse cx="113" cy="56" rx="8" ry="8" fill="#f9c8da" />
            <ellipse cx="127" cy="56" rx="8" ry="8" fill="#f9c8da" />

            {/* Golden Core with Tiny Heart Center */}
            <circle
              cx="120"
              cy="49"
              r="8"
              fill="#fde29f"
              stroke="#e9bc65"
              strokeWidth="1.2"
            />
            <path
              d="M120 52C120 52 116 48.5 116 46C116 44 117.5 43 119 43.8C119.6 44.2 120 44.8 120 44.8C120 44.8 120.4 44.2 121 43.8C122.5 43 124 44 124 46C124 48.5 120 52 120 52Z"
              fill="#dd854e"
            />
          </g>

          {/* Falling Flower Petals */}
          <path
            d="M96 142C92 137 94 130 99 131C104 132 102 139 96 142Z"
            fill="#f4b5c8"
            opacity="0.9"
          />
          <path
            d="M148 150C143 145 145 138 150 139C155 140 153 147 148 150Z"
            fill="#f4b5c8"
            opacity="0.9"
          />

          {/* Sparkles around blooms */}
          <text
            x="88"
            y="24"
            fill="#ffe299"
            fontSize="15"
            className="plant-sparkle"
          >
            ✦
          </text>
          <text
            x="144"
            y="26"
            fill="#ffe299"
            fontSize="17"
            className="plant-sparkle"
          >
            ✦
          </text>
          <text
            x="44"
            y="82"
            fill="#ffd4e0"
            fontSize="13"
            className="plant-sparkle"
          >
            ✧
          </text>
          <text
            x="188"
            y="74"
            fill="#ffd4e0"
            fontSize="13"
            className="plant-sparkle"
          >
            ✧
          </text>
        </g>
      )}
    </svg>
  );
}

function Garden() {
  const { progress, discover, unlock } = useUniverse();
  const [wish, setWish] = useState(false);
  const stage = Math.min(4, Math.floor(progress.plantActions.length / 4));
  useEffect(() => {
    discover("garden-visit");
    if (stage === 4) unlock("plant");
  }, [discover, stage, unlock]);
  return (
    <section className="quiet-experience garden-world">
      <svg className="garden-landscape" viewBox="0 0 1100 750" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="885" cy="130" r="54" fill="#d3c8ac" opacity=".12" />
        <circle cx="905" cy="117" r="49" fill="#101421" />
        <path d="M0 570Q180 455 390 558T770 538T1100 560V750H0Z" fill="#293b3c" opacity=".42" />
        <path d="M0 641Q230 530 440 642T860 610T1100 620V750H0Z" fill="#1a3032" opacity=".7" />
        <path d="M0 709Q250 645 500 710T1100 686V750H0Z" fill="#0c1c23" />
        {[55, 115, 170, 900, 965, 1040].map((x, i) => (
          <g key={x} transform={`translate(${x} ${690 - (i % 3) * 18}) scale(${i % 2 ? .85 : 1.1})`} fill="#4c6660" stroke="#657d6b" strokeWidth="1" opacity=".6">
            <path d="M0 35Q-15 -30 8 -115M-4 -30Q-45 -73 -38 -90Q-6 -79 -4 -30M0 -53Q40 -83 35 -104Q4 -94 0 -53M-3 0Q-50 -28 -45 -48Q-13 -36 -3 0" />
            <path d="M8 -115Q-8 -137 6 -144Q28 -140 8 -115" fill="#b593a2" stroke="none" />
          </g>
        ))}
        {[[155, 340], [920, 435], [270, 515], [815, 350], [98, 485], [1005, 295]].map(([x, y]) => (
          <g key={x} fill="#d8bd8e"><circle cx={x} cy={y} r="8" opacity=".045" /><circle cx={x} cy={y} r="1.5" opacity=".65" /></g>
        ))}
      </svg>
      <SectionHeading
        eyebrow="A LITTLE LOVE, EVERY DAY"
        title="Look what we’re growing."
        description="Memories, letters, games, puzzles and discoveries all help our plant grow."
      />
      <div className={`growing-plant plant-stage-${stage}`}>
        <LovePlantArt stage={stage} />
        <span className="plant-stage-title">
          {
            [
              "A seed of us",
              "Hello, little sprout",
              "Putting down roots",
              "A little taller, together",
              "Look what we grew. ♡",
            ][stage]
          }
        </span>
        <small className="plant-stage-hint">
          {stage === 4
            ? "Fully in bloom. Beautiful and loved, just like us."
            : `${progress.plantActions.length % 4} / 4 discoveries toward next growth stage`}
        </small>
      </div>
      <Couple scene={stage === 4 ? "celebrate" : "sit"} />
      <button
        className="shooting-star"
        aria-label="Catch a shooting star"
        onClick={() => setWish(true)}
      >
        ✦ <span>catch a little wish</span>
      </button>
      <div className="wish-sky">
        {progress.wishes.map((w, i) => (
          <span key={i} title={w}>
            ✦<small>{w}</small>
          </span>
        ))}
      </div>
      {wish && <Wish onClose={() => setWish(false)} />}
    </section>
  );
}
function Wish({ onClose }: { onClose: () => void }) {
  const { update, discover } = useUniverse();
  const [text, setText] = useState("");
  return (
    <Modal title="Make a wish for us." onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          update((p) => ({
            ...p,
            wishes: [...p.wishes, text.trim()].slice(-100),
          }));
          discover("shooting-star");
          onClose();
        }}
      >
        <label htmlFor="wish">A little someday</label>
        <input
          id="wish"
          maxLength={160}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="primary-button" disabled={!text.trim()}>
          Keep it in our sky ✦
        </button>
      </form>
    </Modal>
  );
}
type FutureObjectKind = "capsule" | "map" | "research";
function FutureObjectArt({ kind }: { kind: FutureObjectKind }) {
  if (kind === "capsule") return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="91" cy="111" rx="55" ry="9" fill="#080914" opacity=".35" />
      <path d="M42 53Q45 43 58 43H122Q135 43 138 54L132 101Q90 114 48 101Z" fill="#806577" stroke="#d3b29d" strokeWidth="3" />
      <path d="M39 48Q40 36 53 34L122 37Q137 38 140 49L136 62Q91 69 43 60Z" fill="#b18485" stroke="#ead0b7" strokeWidth="3" />
      <path d="M58 47L61 99M119 49L116 102" stroke="#dfc19f" strokeWidth="3" opacity=".75" />
      <path d="M88 39Q78 25 68 34Q69 45 89 51Q109 41 105 30Q97 24 88 39Z" fill="#d89caf" stroke="#f0cfca" strokeWidth="2" />
      <path d="M71 72L108 75L105 92L73 89Z" fill="#f1e3cc" stroke="#d2b79f" strokeWidth="2" />
      <path d="M78 78L98 80M78 83L93 85" stroke="#9a7688" strokeWidth="2" strokeLinecap="round" />
      <path d="M128 69L131 75L138 77L132 80L130 87L127 81L121 79L127 76Z" fill="#f2dcae" />
      <path d="M49 29C45 24 39 29 49 36C59 29 53 24 49 29Z" fill="#efc2cf" />
    </svg>
  );
  if (kind === "map") return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="89" cy="111" rx="61" ry="8" fill="#080914" opacity=".28" />
      <path d="M29 34L68 23L108 36L148 25V94L109 107L69 94L30 105Z" fill="#e7d9c3" stroke="#c7a994" strokeWidth="3" strokeLinejoin="round" />
      <path d="M68 23L69 94M108 36L109 107" fill="none" stroke="#b7948f" strokeWidth="2" />
      <path d="M39 48Q56 40 76 52T112 62T139 46" fill="none" stroke="#bd7f91" strokeWidth="3" strokeDasharray="4 5" />
      <path d="M47 43C42 34 31 40 47 54C63 40 52 34 47 43Z" fill="#cb8097" />
      <path d="M120 56C115 47 104 53 120 67C136 53 125 47 120 56Z" fill="#cb8097" />
      <circle cx="84" cy="77" r="8" fill="#d8b46f" stroke="#fff0d7" strokeWidth="2" />
      <path d="M83 76L102 50L107 65L94 68L84 81Z" fill="#82708e" stroke="#5f506c" strokeWidth="1.5" />
      <path d="M34 95L43 83L51 97ZM130 35L135 28L141 37Z" fill="#f4dfb7" stroke="#b89a85" strokeWidth="1.5" />
      <path d="M145 78L148 84L155 86L149 90L147 96L144 90L138 88L144 85Z" fill="#d4b477" />
    </svg>
  );
  return (
    <svg viewBox="0 0 180 130" aria-hidden="true">
      <ellipse cx="89" cy="112" rx="53" ry="8" fill="#080914" opacity=".3" />
      <path d="M53 24Q53 17 61 17H120Q128 17 128 25V102H53Z" fill="#806c7d" stroke="#d6c4c4" strokeWidth="3" />
      <path d="M61 31H120V102H61Z" fill="#efe3d0" stroke="#b89da6" strokeWidth="2" />
      <path d="M82 18V29M99 18V29" stroke="#d5b483" strokeWidth="3" />
      <path d="M70 78L83 68L93 71L108 48" fill="none" stroke="#a34861" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M103 49L109 45L111 53" fill="none" stroke="#a34861" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 83H112M70 61H112M70 39H112" stroke="#c3b1ae" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M74 36C70 31 64 36 74 43C84 36 78 31 74 36Z" fill="#cc879d" />
      <path d="M46 47L49 53L56 55L50 59L48 66L45 60L39 58L45 54Z" fill="#f0dbb0" />
      <path d="M129 82L132 88L139 90L133 94L131 100L128 94L122 92L128 89Z" fill="#f0dbb0" />
      <path d="M128 39L144 45L141 76L128 72Z" fill="#d6a7a7" stroke="#eed4c8" strokeWidth="2" />
      <path d="M132 49L139 52M131 57L138 60" stroke="#7d526c" strokeWidth="2" />
    </svg>
  );
}
function Future({ navigate }: Navigation) {
  type BucketDream = {
    id: string;
    text: string;
    author: "Janna" | "Josh" | null;
    completed: boolean;
    completedAt: string | null;
  };
  const storageKey = "ourverse-future-bucket-list-v1";
  const starters: BucketDream[] = [
    "Live together",
    "Get married",
    "Go to a concert together",
    "Travel together",
    "Adopt a pet",
    "Go on a road trip together",
    "Celebrate anniversary",
    "Meet each other's parents",
  ].map((text, index) => ({ id: `starter-${index + 1}`, text, author: null, completed: false, completedAt: null }));
  const [bucketDreams, setBucketDreams] = useState<BucketDream[]>(starters);
  const [storageReady, setStorageReady] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [author, setAuthor] = useState<"Janna" | "Josh">("Janna");

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved)) {
        const seenIds = new Set<string>();
        const valid = saved.filter((dream): dream is BucketDream => {
          const isValid = !!dream && typeof dream === "object" &&
            typeof dream.id === "string" && typeof dream.text === "string" &&
            dream.text.trim().length > 0 && dream.text.length <= 120 &&
            (dream.author === null || dream.author === "Janna" || dream.author === "Josh") &&
            typeof dream.completed === "boolean" &&
            (dream.completedAt === null || (typeof dream.completedAt === "string" && Number.isFinite(Date.parse(dream.completedAt))));
          if (!isValid || seenIds.has(dream.id)) return false;
          seenIds.add(dream.id);
          return true;
        });
        if (valid.length || saved.length === 0) setBucketDreams(valid);
      }
    } catch {
      // A malformed or unavailable saved value falls back to the starter list.
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(storageKey, JSON.stringify(bucketDreams)); } catch {}
  }, [bucketDreams, storageReady]);

  const totalSpreads = Math.max(1, Math.ceil(bucketDreams.length / 10));
  const safeSpreadIndex = Math.min(spreadIndex, totalSpreads - 1);
  const spreadDreams = bucketDreams.slice(safeSpreadIndex * 10, safeSpreadIndex * 10 + 10);
  const pages = [spreadDreams.slice(0, 5), spreadDreams.slice(5, 10)];
  const toggleDream = (dream: BucketDream) => {
    if (dream.completed && !window.confirm("Mark this dream as not completed?")) return;
    setBucketDreams((current) => current.map((item) => item.id === dream.id
      ? { ...item, completed: !item.completed, completedAt: item.completed ? null : new Date().toISOString() }
      : item));
  };
  const removeDream = (dream: BucketDream) => {
    if (!window.confirm("Remove this dream from our bucket list?")) return;
    const remaining = bucketDreams.filter((item) => item.id !== dream.id);
    setBucketDreams(remaining);
    setSpreadIndex((index) => Math.min(index, Math.max(0, Math.ceil(remaining.length / 10) - 1)));
  };
  const addDream = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newText.trim();
    if (!text || text.length > 120) return;
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `dream-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const next = [...bucketDreams, { id, text, author, completed: false, completedAt: null }];
    setBucketDreams(next);
    setSpreadIndex(Math.floor((next.length - 1) / 10));
    setNewText("");
    setAddOpen(false);
  };
  const renderDream = (dream: BucketDream) => (
    <div className={`notebook-entry${dream.completed ? " notebook-entry-complete" : ""}`} key={dream.id}>
      <button
        type="button"
        className="notebook-checkbox"
        role="checkbox"
        aria-checked={dream.completed}
        aria-label={`${dream.completed ? "Mark incomplete" : "Mark complete"}: ${dream.text}`}
        onClick={() => toggleDream(dream)}
      >{dream.completed ? <span aria-hidden="true">✓</span> : null}</button>
      <span className="notebook-entry-copy">
        <span className="notebook-entry-text">{dream.text}</span>
        {dream.author && <small className="notebook-entry-author">— {dream.author}</small>}
        {dream.completed && dream.completedAt && <small className="notebook-entry-date">we did it · {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dream.completedAt))}</small>}
      </span>
      <button type="button" className="notebook-delete" aria-label={`Remove ${dream.text}`} onClick={() => removeDream(dream)}>×</button>
    </div>
  );

  return (
    <>
      <SectionHeading
        eyebrow="OUR BUCKET LIST"
        title="Someday, with you."
        description="little promises, big dreams, and everything we want to do someday."
      />
      <section className="future-notebook" aria-label="Janna and Josh's shared bucket-list notebook">
        <span className="notebook-tape" aria-hidden="true" />
        <span className="notebook-paperclip" aria-hidden="true" />
        <div className="notebook-spread notebook-page-arrive" key={safeSpreadIndex}>
          <section className="notebook-page notebook-page-left" aria-label="Notebook left page">
            <div className="notebook-page-heading">
              <span>for the someday version of us</span>
              <small>{String(safeSpreadIndex * 2 + 1).padStart(2, "0")}</small>
            </div>
            <div className={`notebook-entries${pages[0].length >= 4 ? " notebook-entries-full" : ""}`}>
              {pages[0].map(renderDream)}
            </div>
            <div className="notebook-couple-doodle" aria-label="Janna and Josh">
              <svg viewBox="0 0 80 70" aria-hidden="true"><path d="M40 60C31 51 8 38 11 22C14 7 32 10 40 24C49 9 68 8 70 23C72 39 51 53 40 60Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 20Q24 15 29 20M52 52Q59 47 62 41" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              <span>J + J</span>
            </div>
            <span className="notebook-margin-note">keep this one ♡</span>
          </section>
          <section className="notebook-page notebook-page-right" aria-label="Notebook right page">
            <div className="notebook-page-heading">
              <span>little plans, just ours</span>
              <small>{String(safeSpreadIndex * 2 + 2).padStart(2, "0")}</small>
            </div>
            <div className={`notebook-entries${pages[1].length >= 4 ? " notebook-entries-full" : ""}`}>
              {pages[1].map(renderDream)}
            </div>
            <div className="notebook-flower" aria-hidden="true">
              <svg viewBox="0 0 70 80"><path d="M35 42Q28 58 34 75M34 63Q22 54 15 60Q22 71 34 67M35 57Q47 47 55 53Q49 64 35 62" fill="none" stroke="#71806c" strokeWidth="2" strokeLinecap="round"/><path d="M35 37C27 31 29 23 35 24C41 23 43 31 35 37ZM35 37C28 42 20 39 22 33C23 27 31 29 35 37ZM35 37C42 29 50 27 51 33C53 39 44 42 35 37Z" fill="#d78f9f" stroke="#bd7588" strokeWidth="1.5"/><circle cx="35" cy="36" r="4" fill="#e3c486"/></svg>
            </div>
            <div className="notebook-counts"><span>dreams written · {bucketDreams.length}</span><span>dreams lived · {bucketDreams.filter((dream) => dream.completed).length}</span></div>
          </section>
          <span className="notebook-spine" aria-hidden="true" />
        </div>
        <div className="notebook-lower-tools">
          <button type="button" className="notebook-add-mock" aria-expanded={addOpen} onClick={() => setAddOpen((open) => !open)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5L5.5 14L16.7 2.8Q18 1.5 19.3 2.8L21.2 4.7Q22.5 6 21.2 7.3L10 18.5L4 18.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14.8 4.8L19.2 9.2M4 18.5L9 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>+ write a new dream</button>
          <nav className="notebook-pagination" aria-label="Notebook pages">
            <button type="button" aria-label="Previous spread" disabled={safeSpreadIndex === 0} onClick={() => setSpreadIndex((index) => Math.max(0, index - 1))}>‹ previous</button>
            <small>{String(safeSpreadIndex + 1).padStart(2, "0")} / {String(totalSpreads).padStart(2, "0")}</small>
            <button type="button" aria-label="Next spread" disabled={safeSpreadIndex >= totalSpreads - 1} onClick={() => setSpreadIndex((index) => Math.min(totalSpreads - 1, index + 1))}>next ›</button>
          </nav>
        </div>
        {addOpen && <form className="notebook-write-form" onSubmit={addDream}>
          <label htmlFor="future-dream-text">what should we do someday?</label>
          <textarea id="future-dream-text" value={newText} onChange={(event) => setNewText(event.target.value)} maxLength={120} required rows={2} />
          <fieldset>
            <legend>written by:</legend>
            {(["Janna", "Josh"] as const).map((name) => <label key={name}><input type="radio" name="dream-author" value={name} checked={author === name} onChange={() => setAuthor(name)} />{name}</label>)}
          </fieldset>
          <span className="notebook-form-hint">{newText.trim().length}/120</span>
          <button type="submit" disabled={!newText.trim()}>add to our list ♡</button>
        </form>}
      </section>
      <div className="world-links future-destinations">
        {[
          ["capsule", "Our time capsule"],
          ["travel", "Our adventure map"],
          ["generator", "An extremely scientific future"],
        ].map(([id, label]) => (
          <button className="future-destination" key={id} onClick={() => navigate(id)} aria-label={label}>
            <span className="future-destination-art">
              <FutureObjectArt kind={id === "capsule" ? "capsule" : id === "travel" ? "map" : "research"} />
            </span>
            {label} ↗
          </button>
        ))}
      </div>
    </>
  );
}
function useNow() {
  const { simulation } = useUniverse();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return simulation === "unlocked" || simulation === "capsule"
    ? Math.max(
        now,
        Date.parse(capsule.opens),
        ...gifts.map((g) => Date.parse(g.opens)),
      ) + 1000
    : now;
}
function Capsule() {
  const opensAt = Date.parse("2036-09-27T00:00:00+08:00");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = (() => {
    if (now === null || now >= opensAt) return [0, 0, 0, 0, 0];
    const zoneOffset = 8 * 60 * 60 * 1000;
    const localNow = new Date(now + zoneOffset);
    const localTarget = new Date(opensAt + zoneOffset);
    let years = localTarget.getUTCFullYear() - localNow.getUTCFullYear();
    let anniversary = new Date(localNow);
    anniversary.setUTCFullYear(localNow.getUTCFullYear() + years);
    if (anniversary.getTime() > localTarget.getTime()) {
      years -= 1;
      anniversary = new Date(localNow);
      anniversary.setUTCFullYear(localNow.getUTCFullYear() + years);
    }
    let remaining = Math.max(0, localTarget.getTime() - anniversary.getTime());
    const days = Math.floor(remaining / 86_400_000);
    remaining %= 86_400_000;
    const hours = Math.floor(remaining / 3_600_000);
    remaining %= 3_600_000;
    const minutes = Math.floor(remaining / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    return [years, days, hours, minutes, seconds];
  })();

  return (
    <section className="quiet-experience capsule-experience">
      <SectionHeading
        eyebrow="WORDS WAITING FOR FUTURE US"
        title="Our Time Capsule"
        description="Written September 27, 2026 · Opens September 27, 2036"
      />
      <p className="capsule-introduction">
        <strong>A little piece of us, sealed away for ten years.</strong>
        <span>Inside are words we wrote to our future selves, photographs of who we were, and a voice from a version of us that will someday feel far away. This capsule stays closed until 2036—waiting quietly to remind us what our love, our lives, and our dreams looked like ten years ago.</span>
      </p>

      <div className="capsule-story">
        <div className="memory-capsule-art" role="img" aria-label="A sealed keepsake box with a letter, two Polaroid photographs, and a small cassette tucked inside, marked 2026 to 2036">
          <svg viewBox="0 0 460 300" aria-hidden="true">
            <defs>
              <linearGradient id="capsule-box" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b99a83"/><stop offset=".48" stopColor="#8c6c72"/><stop offset="1" stopColor="#5b4c66"/></linearGradient>
              <linearGradient id="capsule-lid" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d5b89c"/><stop offset="1" stopColor="#92777b"/></linearGradient>
              <linearGradient id="capsule-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d99cad"/><stop offset="1" stopColor="#a86f89"/></linearGradient>
              <filter id="capsule-shadow" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
            </defs>
            <ellipse cx="232" cy="264" rx="148" ry="17" fill="#050713" opacity=".42" filter="url(#capsule-shadow)"/>
            <g className="capsule-memory-photos">
              <g transform="rotate(-13 155 92)"><rect x="108" y="35" width="78" height="102" rx="3" fill="#f0e4d6" stroke="#fff3e3" strokeWidth="2"/><rect x="116" y="43" width="62" height="66" fill="#93849a"/><path d="M119 99L136 78L147 88L159 66L175 99Z" fill="#d5b4b4"/><path d="M138 63c-5-8-14-2 0 9c14-11 5-17 0-9Z" fill="#f4d9d8"/><path d="M119 119H160" stroke="#bd9b96" strokeWidth="2" strokeLinecap="round"/></g>
              <g transform="rotate(10 286 79)"><rect x="255" y="23" width="70" height="91" rx="3" fill="#f3e9d9" stroke="#fff4e7" strokeWidth="2"/><rect x="262" y="30" width="56" height="58" fill="#798399"/><circle cx="282" cy="53" r="10" fill="#d9b0b2"/><path d="M264 83L279 67L290 77L302 59L316 83Z" fill="#d9c5ae"/><path d="M268 99H302" stroke="#b79891" strokeWidth="2" strokeLinecap="round"/></g>
            </g>
            <g className="capsule-memory-letter" transform="rotate(4 223 94)"><path d="M185 55L260 61L254 143L180 137Z" fill="#f5ebd9" stroke="#d3bba4" strokeWidth="2"/><path d="M185 55L221 94L260 61M221 94L180 137M221 94L254 143" fill="none" stroke="#d2b39d" strokeWidth="1.5"/><path d="M198 111L237 114M198 119L230 122" stroke="#a47c8d" strokeWidth="2" strokeLinecap="round" opacity=".65"/><path d="M213 77c-5-8-14-2 0 9c14-11 5-17 0-9Z" fill="#c9879b"/></g>
            <g className="capsule-memory-tape" transform="rotate(-6 314 132)"><rect x="278" y="105" width="82" height="54" rx="7" fill="#6f5365" stroke="#d5b58f" strokeWidth="2"/><rect x="287" y="113" width="64" height="37" rx="4" fill="#d8c7b2"/><circle cx="300" cy="131" r="9" fill="#6f5365" stroke="#b79091" strokeWidth="2"/><circle cx="338" cy="131" r="9" fill="#6f5365" stroke="#b79091" strokeWidth="2"/><path d="M309 130L315 136L322 126L329 132" fill="none" stroke="#a87086" strokeWidth="2" strokeLinecap="round"/><text x="319" y="110" textAnchor="middle" fill="#f1e2d0" fontSize="7" letterSpacing="1">VOICE · 2026</text></g>
            <path d="M92 132Q99 116 121 116H342Q365 116 375 136L361 231Q235 254 106 231Z" fill="url(#capsule-box)" stroke="#e0c9a8" strokeWidth="3"/>
            <path d="M99 128Q101 105 124 102L345 111Q366 112 372 133L366 153Q235 169 96 148Z" fill="url(#capsule-lid)" stroke="#f0d9b7" strokeWidth="3"/>
            <path d="M119 121Q233 138 354 128" fill="none" stroke="#f1dec2" strokeWidth="2" opacity=".6"/>
            <path d="M218 111L230 115L225 241L211 238Z" fill="url(#capsule-ribbon)" opacity=".96"/>
            <path d="M211 116Q191 94 180 108Q179 124 215 132Q248 119 239 103Q226 93 211 116Z" fill="url(#capsule-ribbon)" stroke="#e9bdc4" strokeWidth="2"/>
            <path d="M219 127Q246 126 250 143L229 157L218 139Z" fill="#b97891" stroke="#e8bfc6" strokeWidth="1.5"/>
            <circle cx="219" cy="147" r="14" fill="#d8b98d" stroke="#f0dfc2" strokeWidth="2"/>
            <path d="M219 141c-4-6-10-1 0 6c10-7 4-12 0-6Z" fill="#8b5d76"/>
            <path d="M126 176L188 181M250 184L337 178" stroke="#ebd8c3" strokeWidth="1.5" opacity=".55"/>
            <text x="232" y="207" textAnchor="middle" fill="#f1e3cf" fontSize="12" letterSpacing="3" fontFamily="Georgia,serif">J + J</text>
            <text x="232" y="224" textAnchor="middle" fill="#ead4bd" fontSize="8" letterSpacing="2" fontFamily="Georgia,serif">2026  ·  2036</text>
            <path d="M78 71L82 79L91 81L83 85L81 94L77 86L69 83L77 80Z" fill="#e4d2b0" opacity=".8"/>
            <path d="M383 91L386 97L393 99L387 102L385 109L382 103L376 101L382 98Z" fill="#c8b3d5" opacity=".75"/>
          </svg>
          <span className="capsule-seal-label">SEALED · 2026</span>
        </div>

        <div className="capsule-contents" aria-label="What is waiting inside">
          <p>INSIDE, WAITING FOR US</p>
          <div><span className="capsule-content-mark capsule-letter-mark" aria-hidden="true" /><span>Letter to our future selves</span></div>
          <div><span className="capsule-content-mark capsule-photo-mark" aria-hidden="true" /><span>Photographs of us</span></div>
          <div><span className="capsule-content-mark capsule-voice-mark" aria-hidden="true" /> <span>A voice from 2026</span></div>
          <small>OPEN IN 2036</small>
        </div>
      </div>

      <div className="capsule-countdown-wrap" aria-live="off">
        <p>Until we meet these versions of ourselves again.</p>
        <div className="capsule-countdown" aria-label="Time remaining until September 27, 2036">
          {["YEARS", "DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, index) => (
            <div className="capsule-countdown-unit" key={label}>
              <strong>{now === null ? "—" : String(countdown[index]).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <small>Some memories are worth waiting for.</small>
      </div>
    </section>
  );
}
function Adventure() {
  return <AdventureMap />;
}
function Gifts() {
  const now = useNow();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <SectionHeading
        eyebrow="SOME THINGS ARE WORTH THE WAIT"
        title="Mystery gifts"
        description="A little surprise, tied up with a promise."
      />
      <div className="gift-shelf">
        {gifts.map((g) => (
          <div key={g.id}>
            <button
              className={`gift-box ${open === g.id ? "gift-open" : ""}`}
              disabled={now < Date.parse(g.opens)}
              aria-label={`Open ${g.title}`}
              onClick={() => setOpen(g.id)}
            >
              ✦
            </button>
            <h2>{g.title}</h2>
            <p>Do not open until {dateLabel(g.opens)}</p>
            <p>
              {now < Date.parse(g.opens)
                ? `${Math.ceil((Date.parse(g.opens) - now) / 86400000)} days remaining`
                : "It’s yours to open."}
            </p>
            {open === g.id && <p className="paper-message">{g.message}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
function Generator() {
  type Finding = { category: string; finding: string };
  type Report = {
    reportNumber: string;
    house: string;
    location: string;
    kids: { count: number; detail: string };
    pets: string;
    cooking: string;
    cleaning: string;
    paying: string;
    bankAccount: { amountUsd: number; detail: string };
    bedTerritory: { jannaPercent: number; joshPercent: number; detail: string };
    kisses: { amount: string; detail: string };
    bonusFindings: Finding[];
    reaction: { janna: string; josh: string };
  };
  const [result, setResult] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const statusLines = [
    "calculating domestic chaos...",
    "consulting highly reputable stars...",
    "estimating blanket ownership...",
    "checking future bank statements...",
    "counting hypothetical children...",
    "running kissing simulations...",
    "peer review rejected. continuing anyway...",
    "checking fridge politics...",
  ];

  useEffect(() => {
    if (!loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setStatusIndex((index) => (index + 1) % statusLines.length),
      850,
    );
    return () => window.clearInterval(timer);
  }, [loading, statusLines.length]);

  async function consult() {
    if (loading) return;
    setLoading(true);
    setError(false);
    setStatusIndex(Math.floor(Math.random() * statusLines.length));
    const startedAt = Date.now();
    try {
      const response = await fetch("/api/future-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recent }),
      });
      const data = await response.json();
      if (!response.ok || !data.report) throw new Error("Report unavailable");
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 2400 - (Date.now() - startedAt))),
      );
      setResult(data.report as Report);
      setRecent((items) =>
        [
          `${data.report.house}; ${data.report.location}; ${data.report.bonusFindings?.map((item: Finding) => item.category).join(", ")}`,
          ...items,
        ].slice(0, 4),
      );
    } catch {
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 1700 - (Date.now() - startedAt))),
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const currency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="quiet-experience future-generator">
      <SectionHeading
        eyebrow="PLAYFUL NONSENSE. ABSOLUTELY NOT A PREDICTION."
        title="Our extremely scientific future"
        description="The universe has run the numbers. The methodology is under investigation."
      />
      <div className="future-o-matic" aria-label="Future-O-Matic celestial research machine">
        <div className="future-o-matic-dial dial-left"><span>J + J</span><i>∞</i></div>
        <div className="future-o-matic-core">
          <span className="machine-kicker">OURVERSE FUTURE RESEARCH DIVISION</span>
          <svg viewBox="0 0 260 150" role="img" aria-label="A whimsical celestial prediction machine">
            <path d="M45 117Q36 99 48 79L58 53Q64 35 83 35H177Q196 35 202 53L212 79Q224 99 215 117Z" fill="#332746" stroke="#d7bf91" strokeWidth="2" />
            <path d="M70 53Q130 24 190 53M61 105Q130 128 199 105" fill="none" stroke="#bc91b5" strokeWidth="1.5" strokeDasharray="3 6" />
            <circle cx="130" cy="78" r="31" fill="#17182d" stroke="#e3c994" strokeWidth="2" />
            <circle cx="130" cy="78" r="22" fill="#716081" opacity=".7" />
            <path d="M130 58C122 47 110 61 130 78C150 61 138 47 130 58Z" fill="#e8b9cb" />
            <path d="M130 89V99M117 106H143" stroke="#e8d7bb" strokeWidth="2" strokeLinecap="round" />
            <circle cx="74" cy="77" r="5" fill="#d8a9be" /><circle cx="186" cy="77" r="5" fill="#d8a9be" />
            <path d="M73 78L63 86M187 78L197 86" stroke="#dfc992" strokeWidth="2" />
            <path d="M31 37L35 47L45 51L35 55L31 65L27 55L17 51L27 47Z" fill="#e8d8b6" />
            <path d="M225 37L228 45L236 48L228 51L225 59L222 51L214 48L222 45Z" fill="#c7afd5" />
            <text x="130" y="20" textAnchor="middle" fill="#e7d6df" fontSize="10" letterSpacing="3">FUTURE-O-MATIC</text>
          </svg>
          <span className="machine-equation">J + J = ??? <b>♡² × ∞</b></span>
        </div>
        <div className="future-o-matic-dial dial-right"><span>DATA</span><i>12%</i></div>
      </div>

      <div className="generator-action-zone">
        <button className="primary-button" disabled={loading} onClick={consult}>
          {loading ? "CONSULTING..." : result || error ? "CONSULT AGAIN" : "CONSULT THE UNIVERSE"}
        </button>
        {loading && <p className="generator-calculation" aria-live="polite">{statusLines[statusIndex]}</p>}
        {!loading && (result || error) && <p className="generator-footnote">The universe reserves the right to contradict itself.</p>}
      </div>

      {error && !loading && (
        <div className="generator-error" role="status">
          <h2>Scientific equipment malfunction.</h2>
          <p>The universe appears to be withholding its findings. Try consulting it again.</p>
        </div>
      )}

      {result && !loading && !error && (
        <article className="future-research-report" aria-live="polite">
          <header className="research-report-header">
            <div><span>OURVERSE FUTURE RESEARCH DIVISION</span><span>CASE FILE: J + J</span></div>
            <h2>Future Report <b>#{result.reportNumber}</b></h2>
            <p>After extensive calculations, questionable methodology, and absolutely no peer review, the universe has reached the following conclusions.</p>
          </header>
          <div className="report-science-scribble" aria-hidden="true"><span>J + J = ∞</span><span>compatibility coefficient: suspicious</span><span>peer review: rejected</span></div>
          <div className="report-findings">
            <section className="finding-wide"><h3>Our House</h3><p>{result.house}</p></section>
            <section className="finding-wide"><h3>Where We End Up</h3><p>{result.location}</p></section>
            <section className="finding-highlight"><h3>How Many Kids</h3><strong>{result.kids.count}</strong><p>{result.kids.detail}</p></section>
            <section><h3>Pet Situation</h3><p>{result.pets}</p></section>
            <section><h3>Who Cooks</h3><p>{result.cooking}</p></section>
            <section><h3>Who Cleans</h3><p>{result.cleaning}</p></section>
            <section><h3>Who Pays</h3><p>{result.paying}</p></section>
            <section className="finding-highlight"><h3>Our Bank Account</h3><strong>{currency(result.bankAccount.amountUsd)}</strong><p>{result.bankAccount.detail}</p><small>fictional USD. scientifically unverified.</small></section>
            <section className="finding-highlight"><h3>Bed Territory</h3><strong>{result.bedTerritory.jannaPercent}% / {result.bedTerritory.joshPercent}%</strong><p>Janna · Josh</p><p>{result.bedTerritory.detail}</p></section>
            <section className="finding-highlight"><h3>Kisses</h3><strong>{result.kisses.amount}</strong><p>{result.kisses.detail}</p></section>
            {result.bonusFindings.map((item, index) => <section className="bonus-finding" key={`${item.category}-${index}`}><span>Bonus Finding {index + 1}</span><h3>{item.category}</h3><p>{item.finding}</p></section>)}
          </div>
          <footer className="report-reaction"><span>Subject reactions · inconclusive</span><p>The subjects were consulted. Their testimony is now attached to the visual record.</p></footer>
          <div className="report-stamp" aria-hidden="true">QUESTIONABLE<br />SCIENCE</div>
        </article>
      )}

      <div className={`generator-couple-space ${result || error ? "has-report" : ""}`}>
        <Couple
          scene="sit"
          dialogueJanna={!loading && !error ? result?.reaction.janna : undefined}
          dialogueJosh={!loading && !error ? result?.reaction.josh : undefined}
        />
      </div>
    </section>
  );
}
function DoNotPress({ navigate }: Navigation) {
  const [count, setCount] = useState(0);
  const { unlock, discover } = useUniverse();
  return (
    <section
      className={`quiet-experience forbidden ${count >= 5 ? "heart-explosion" : ""}`}
    >
      <SectionHeading
        eyebrow="DEFINITELY NOTHING TO SEE HERE"
        title={count >= 5 ? "I LOVE YOUUUUU" : "Do not press."}
        description="A perfectly reasonable instruction."
      />
      <button
        className="forbidden-button"
        disabled={count >= 5}
        onClick={() => {
          setCount((c) => c + 1);
          if (count === 4) {
            unlock("do-not-press");
            discover("do-not-press");
          }
        }}
      >
        DO NOT PRESS
      </button>
      <p className="emotional-line" aria-live="polite">
        {
          [
            "",
            "I told you not to press it.",
            "Josh.",
            "seriously?",
            "Fine.",
            "♡ ♡ ♡ ♡ ♡",
          ][Math.min(count, 5)]
        }
      </p>
      {count >= 5 && (
        <>
          <Couple scene="hug" />
          <button className="text-button" onClick={() => navigate("mission")}>
            A suspicious little console appeared… ↗
          </button>
        </>
      )}
    </section>
  );
}
function Mission({ navigate }: Navigation) {
  return (
    <section className="mission-terminal">
      <span className="eyebrow">CLASSIFIED · BOYFRIEND EYES ONLY</span>
      <h1>Josh’s Mission Control</h1>
      <dl>
        {Object.entries(settings.mission).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <h2>SYSTEM STATUS</h2>
      <p>
        ♡ Relationship ONLINE
        <br />♡ Janna OBSESSED
        <br />♡ Josh CUTE
      </p>
      <p className="terminal-warning">
        WARNING: Girlfriend requires attention.
      </p>
      <button onClick={() => navigate("companion")}>
        [ Give girlfriend attention ]
      </button>
      <button onClick={() => navigate("patch")}>
        [ Read relationship patch notes ]
      </button>
    </section>
  );
}
function Patch({ navigate }: Navigation) {
  return (
    <section className="patch-notes">
      <span className="eyebrow">A DEVELOPER’S LOVE LANGUAGE</span>
      <h1>OURVERSE</h1>
      <h2>Relationship v{patchNotes.version}</h2>
      {[
        ["PATCH NOTES", patchNotes.changes],
        ["KNOWN ISSUES", patchNotes.issues],
        ["UPCOMING FEATURES", patchNotes.upcoming],
      ].map(([title, items]) => (
        <section key={title as string}>
          <h3>{title}</h3>
          <ul>
            {(items as string[]).map((t) => (
              <li key={t}>♡ {t}</li>
            ))}
          </ul>
        </section>
      ))}
      <button className="text-button" onClick={() => navigate("mission")}>
        Open Mission Control ↗
      </button>
      <p className="handwritten">distance fix scheduled. date: someday.</p>
    </section>
  );
}
function Sleep({ navigate }: Navigation) {
  const { unlock, discover } = useUniverse();
  useEffect(() => {
    unlock("night");
    discover("sleep");
  }, [unlock, discover]);
  return (
    <section className="quiet-experience bedtime">
      <SectionHeading
        eyebrow="IT’S OKAY TO PUT THE WORLD DOWN"
        title="Can’t sleep?"
        description="Pretend I’m laying next to you."
      />
      <Couple scene="sleep" />
      <p className="emotional-line">
        Relax your shoulders.
        <br />
        You don’t need to solve tomorrow tonight.
        <br />
        I’m right here.
      </p>
      <div className="world-links">
        <button onClick={() => navigate("letters")}>A bedtime letter ↗</button>
        <button onClick={() => navigate("music")}>
          Something quiet to listen to ↗
        </button>
      </div>
    </section>
  );
}
