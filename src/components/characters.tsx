"use client";
import { characters, characterPalette as palette, type Expression, type Pose } from "@/config/characters";

export function OurVerseCharacter({
  character,
  expression = "idle",
  pose = "idle",
  hoodie = false,
}: {
  character: keyof typeof characters;
  expression?: Expression;
  pose?: Pose;
  hoodie?: boolean;
}) {
  const c = characters[character];
  const janna = character === "janna";
  const sleepy = pose === "sleep" || expression === "sleepy";
  const sitting = pose === "sit" || pose === "sleep";
  const upset = ["annoyed", "angry", "sad", "confused"].includes(expression);
  const blush =
    ["blushing", "love-struck", "embarrassed", "crying-happy"].includes(
      expression,
    ) || pose === "kiss";
  return (
    <svg
      className={`character character-${character} pose-${pose} expression-${expression}`}
      viewBox="0 0 140 180"
      role="img"
      aria-label={`Mini ${c.name}, ${expression}, ${pose}`}
    >
      <ellipse cx="70" cy="169" rx="34" ry="6" fill="#000" opacity=".18" />
      {janna && (
        <path
          d="M28 60Q15 115 31 139L108 139Q125 100 112 57Z"
          fill={c.hairColor}
        />
      )}
      <g
        className="character-legs"
        stroke={c.outfit}
        strokeWidth="15"
        strokeLinecap="round"
      >
        <path d={sitting ? "M57 140L42 150L48 161" : "M57 140L54 162"} />
        <path d={sitting ? "M82 140L98 150L92 161" : "M82 140L86 162"} />
      </g>
      <g fill={palette.shoes}>
        <ellipse cx="50" cy="164" rx="13" ry="6" />
        <ellipse cx="89" cy="164" rx="13" ry="6" />
      </g>
      <path
        className={hoodie ? "borrowed-hoodie" : ""}
        d="M46 103Q70 94 94 103L100 144Q70 153 40 144Z"
        fill={hoodie ? characters.josh.outfit : c.outfit}
      />
      <path
        d="M57 102Q70 120 83 102M64 116L63 130M77 116L78 129"
        fill="none"
        stroke={c.accentColor}
        strokeWidth="2"
      />
      <g className="arm arm-left" style={{ transformOrigin: "45px 111px" }}>
        <path
          d="M45 112L31 133"
          stroke={hoodie ? characters.josh.outfit : c.outfit}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="29" cy="136" r="7" fill={c.skin} />
      </g>
      <g className="arm arm-right" style={{ transformOrigin: "94px 111px" }}>
        <path
          d="M94 112L108 133"
          stroke={hoodie ? characters.josh.outfit : c.outfit}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="110" cy="136" r="7" fill={c.skin} />
      </g>
      <g className="character-head">
        <ellipse cx="70" cy="59" rx="46" ry="46" fill={c.hairColor} />
        <circle cx="29" cy="71" r="8" fill={c.skin} />
        <circle cx="111" cy="71" r="8" fill={c.skin} />
        <path
          d="M31 50Q70 25 109 50L107 80Q101 103 70 105Q39 103 33 80Z"
          fill={c.skin}
        />
        <path
          d={
            janna
              ? "M27 68Q20 18 65 15Q113 11 116 66Q100 55 92 34Q68 67 35 54L32 81Z"
              : "M25 65Q19 20 65 15Q116 13 115 67L102 51L91 33Q72 53 43 50L33 75Z"
          }
          fill={c.hairColor}
        />
        <path
          d="M36 39Q53 19 79 24"
          fill="none"
          stroke={c.hairHighlight}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g
          className="character-eyes"
          stroke={palette.eyes}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        >
          {sleepy ||
          expression === "laughing" ||
          expression === "crying-happy" ? (
            <>
              <path d="M43 72Q49 77 55 72" />
              <path d="M84 72Q90 77 96 72" />
            </>
          ) : expression === "love-struck" ? (
            <g fill={palette.heart} stroke="none">
              <path d="M49 79L41 70Q41 62 49 67Q57 62 57 70Z" />
              <path d="M90 79L82 70Q82 62 90 67Q98 62 98 70Z" />
            </g>
          ) : (
            <>
              <ellipse
                cx="49"
                cy="73"
                rx="2.5"
                ry={expression === "surprised" ? 6 : 4}
                fill={palette.eyes}
              />
              <ellipse
                cx="90"
                cy="73"
                rx="2.5"
                ry={expression === "surprised" ? 6 : 4}
                fill={palette.eyes}
              />
              {upset && (
                <>
                  <path d="M42 62L55 67" />
                  <path d="M83 67L97 62" />
                </>
              )}
            </>
          )}
        </g>
      {!janna && characters.josh.glasses && (
        <g fill="none" stroke={palette.glasses} strokeWidth="3">
            <rect x="36" y="63" width="27" height="21" rx="7" />
            <rect x="77" y="63" width="27" height="21" rx="7" />
            <path d="M63 70Q70 67 77 70M29 67L36 68M104 68L112 66" />
          </g>
        )}
        <g fill={palette.blush} opacity={blush ? ".8" : ".3"}>
          <ellipse cx="40" cy="86" rx="9" ry="4" />
          <ellipse cx="101" cy="86" rx="9" ry="4" />
        </g>
        {expression === "surprised" ? (
          <ellipse cx="70" cy="89" rx="4" ry="5" fill={palette.mouth} />
        ) : (
          <path
            d={upset ? "M64 92Q70 86 77 92" : "M63 88Q70 96 78 88"}
            fill="none"
            stroke={palette.mouth}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
        {janna && (
          <path
            d="M101 39Q93 48 104 52Q91 56 91 45Q92 38 101 39"
            fill={palette.pin}
          />
        )}
        {expression === "crying-happy" && (
          <g fill={palette.tears}>
            <ellipse cx="47" cy="84" rx="3" ry="6" />
            <ellipse cx="92" cy="84" rx="3" ry="6" />
          </g>
        )}
      </g>
      {pose === "gaming" && (
        <g>
          <rect x="43" y="126" width="54" height="22" rx="9" fill="#a7a3c4" />
          <path d="M51 137H64M57 131V143" stroke="#302d41" strokeWidth="3" />
          <circle cx="84" cy="134" r="3" fill="#ca748d" />
          <circle cx="89" cy="140" r="3" fill="#7a729b" />
        </g>
      )}
      {sleepy && (
        <text x="109" y="27" fill="#d7cdef" fontSize="17">
          z
        </text>
      )}
    </svg>
  );
}
export type CoupleScene =
  | "sit"
  | "hold-hands"
  | "hug"
  | "kiss"
  | "heart"
  | "sleep"
  | "hoodie"
  | "poke"
  | "gaming"
  | "celebrate"
  | "walk"
  | "dance";
export function Couple({
  scene = "sit",
  caption,
}: {
  scene?: CoupleScene;
  caption?: string;
}) {
  const pose: Pose =
    scene === "heart" ? "hug" : scene === "hoodie" ? "idle" : scene;
  return (
    <div className={`couple couple-${scene}`}>
      <OurVerseCharacter
        character="janna"
        pose={pose}
        hoodie={scene === "hoodie"}
        expression={
          scene === "poke"
            ? "annoyed"
            : scene === "kiss"
              ? "blushing"
              : scene === "celebrate"
                ? "excited"
                : "happy"
        }
      />
      <OurVerseCharacter
        character="josh"
        pose={pose}
        expression={
          scene === "hoodie"
            ? "confused"
            : scene === "kiss"
              ? "blushing"
              : "happy"
        }
      />
      {["hug", "kiss", "heart", "hold-hands"].includes(scene) && (
        <span className="couple-hearts" aria-hidden="true">
          ♡ ♥ ♡
        </span>
      )}
      {(caption || scene === "hoodie") && (
        <p className="handwritten couple-caption">{caption || "mine now."}</p>
      )}
    </div>
  );
}
