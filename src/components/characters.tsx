"use client";
import {
  characters,
  characterPalette as palette,
  type Expression,
  type Pose,
} from "@/config/characters";

export function OurVerseCharacter({
  character,
  expression = "idle",
  pose = "idle",
  hoodie = false,
  paired = false,
}: {
  character: keyof typeof characters;
  expression?: Expression;
  pose?: Pose;
  hoodie?: boolean;
  paired?: boolean;
}) {
  const c = characters[character];
  const janna = character === "janna";
  const sleepy = pose === "sleep" || expression === "sleepy";
  const sitting = pose === "sit" || pose === "sleep" || pose === "gaming";
  const profile = paired && pose === "kiss";
  const connected = paired && ["hold-hands", "dance"].includes(pose);
  const upset = ["annoyed", "angry", "sad", "confused"].includes(expression);
  const blush =
    ["blushing", "love-struck", "embarrassed", "crying-happy"].includes(
      expression,
    ) || pose === "kiss";
  return (
    <svg
      className={`character character-${character} pose-${pose} expression-${expression}`}
      viewBox="0 0 140 180"
      width="140"
      height="180"
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
      <g className="character-legs">
        <g className="leg leg-left" style={{ transformOrigin: "57px 138px" }}>
          <path
            d={sitting ? "M57 137Q40 136 39 145L42 158" : "M57 138L54 161"}
            stroke={c.outfit}
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx={sitting ? 39 : 50}
            cy="164"
            rx="12"
            ry="6"
            fill={palette.shoes}
          />
        </g>
        <g className="leg leg-right" style={{ transformOrigin: "82px 138px" }}>
          <path
            d={sitting ? "M82 137Q98 136 98 145L101 158" : "M82 138L86 161"}
            stroke={c.outfit}
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx={sitting ? 103 : 89}
            cy="164"
            rx="12"
            ry="6"
            fill={palette.shoes}
          />
        </g>
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
          d={connected && !janna ? "M45 112Q32 128 20 130" : sitting ? "M45 112Q32 124 47 137" : "M45 112L31 133"}
          fill="none"
          stroke={hoodie ? characters.josh.outfit : c.outfit}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle
          cx={connected && !janna ? 20 : sitting ? 47 : 29}
          cy={connected && !janna ? 130 : 136}
          r="7"
          fill={c.skin}
        />
      </g>
      <g className="arm arm-right" style={{ transformOrigin: "94px 111px" }}>
        <path
          d={connected && janna ? "M94 112Q108 128 120 130" : sitting ? "M94 112Q108 124 92 137" : "M94 112L108 133"}
          fill="none"
          stroke={hoodie ? characters.josh.outfit : c.outfit}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle
          cx={connected && janna ? 120 : sitting ? 92 : 110}
          cy={connected && janna ? 130 : 136}
          r="7"
          fill={c.skin}
        />
      </g>
      <g className="character-head">
        {profile ? (
          <g transform={janna ? undefined : "translate(140 0) scale(-1 1)"}>
            <ellipse cx="66" cy="59" rx="43" ry="45" fill={c.hairColor} />
            <path
              d="M63 34Q102 29 107 64L115 77L110 83L120 88L110 92Q104 107 80 103L57 88Z"
              fill={c.skin}
            />
            <path
              d="M27 76Q17 25 57 15Q93 5 105 39Q83 37 71 58L56 80L51 100Q25 96 27 76Z"
              fill={c.hairColor}
            />
            <path
              d="M35 42Q46 24 72 25"
              stroke={c.hairHighlight}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M91 72Q98 77 104 71"
              stroke={palette.eyes}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="94"
              cy="85"
              rx="9"
              ry="4"
              fill={palette.blush}
              opacity=".6"
            />
            <path
              d="M113 88H120"
              stroke={palette.mouth}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {janna ? (
              <path
                d="M51 35Q44 43 55 47Q42 52 41 42Q42 35 51 35"
                fill={palette.pin}
              />
            ) : (
              <g stroke={palette.glasses} strokeWidth="2.5" fill="none">
                <rect x="85" y="63" width="24" height="19" rx="6" />
                <path d="M85 68L57 65" />
              </g>
            )}
          </g>
        ) : (
          <>
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
              pose === "hug" ||
              pose === "celebrate" ||
              expression === "laughing" ||
              expression === "crying-happy" ? (
                <>
                  <path d={pose === "celebrate" ? "M43 73Q49 65 55 73" : "M43 72Q49 77 55 72"} />
                  <path d={pose === "celebrate" ? "M84 73Q90 65 96 73" : "M84 72Q90 77 96 72"} />
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
            {pose === "celebrate" ? (
              <path d="M61 87Q70 91 80 87Q78 101 70 101Q63 100 61 87Z" fill={palette.mouth} />
            ) : expression === "surprised" ? (
              <ellipse cx="70" cy="89" rx="4" ry="5" fill={palette.mouth} />
            ) : (
              <path
                className="character-mouth"
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
          </>
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
    </svg>
  );
}
export type CoupleScene =
  | "idle"
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
  scene = "idle",
  caption,
}: {
  scene?: CoupleScene;
  caption?: string;
}) {
  const pose: Pose =
    scene === "heart" ? "hug" : scene === "hoodie" ? "idle" : scene;
  return (
    <div className={`couple couple-${scene}`}>
      <svg
        key={scene}
        className="couple-stage"
        viewBox="0 0 320 215"
        role="group"
        aria-label={`Janna and Josh: ${scene.replace("-", " ")}`}
      >
        {(scene === "sit" || scene === "sleep" || scene === "gaming") && (
          <g aria-hidden="true">
            <rect
              x="52"
              y="151"
              width="216"
              height="21"
              rx="10"
              fill="#66576e"
            />
            <path
              d="M69 172V190M250 172V190"
              stroke="#97828b"
              strokeWidth="7"
            />
          </g>
        )}
        <g className="partner partner-janna">
          <OurVerseCharacter
            paired
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
        </g>
        <g className="partner partner-josh">
          <OurVerseCharacter
            paired
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
        </g>
        {["hug", "heart"].includes(scene) && (
          <g
            className="embrace-arms"
            fill="none"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path
              d="M124 121Q129 146 182 139"
              stroke={characters.janna.outfit}
              strokeWidth="14"
            />
            <path
              d="M199 119Q190 126 143 123"
              stroke={characters.josh.outfit}
              strokeWidth="14"
            />
            <path
              d="M178 139L186 137"
              stroke={characters.janna.skin}
              strokeWidth="11"
            />
            <path
              d="M147 123L139 125"
              stroke={characters.josh.skin}
              strokeWidth="11"
            />
          </g>
        )}
      </svg>
      {(caption || scene === "hoodie") && (
        <p className="handwritten couple-caption">{caption || "mine now."}</p>
      )}
    </div>
  );
}
