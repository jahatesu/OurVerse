"use client";
import { useId } from "react";

export function CelestialArt({ kind }: { kind: string }) {
  const id = useId();
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg className={`destination-art celestial-art art-${kind}`} viewBox="0 0 220 180" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-moon`} cx="28%" cy="23%" r="78%"><stop stopColor="#fff0d5" /><stop offset=".48" stopColor="#c8c2d3" /><stop offset=".82" stopColor="#77778e" /><stop offset="1" stopColor="#36374d" /></radialGradient>
        <radialGradient id={`${id}-rose`} cx="28%" cy="22%" r="80%"><stop stopColor="#f0c7c0" /><stop offset=".4" stopColor="#c88eaa" /><stop offset=".75" stopColor="#805172" /><stop offset="1" stopColor="#30243f" /></radialGradient>
        <radialGradient id={`${id}-ocean`} cx="27%" cy="22%" r="80%"><stop stopColor="#b2dce0" /><stop offset=".35" stopColor="#6b9eb6" /><stop offset=".7" stopColor="#345576" /><stop offset="1" stopColor="#17253f" /></radialGradient>
        <radialGradient id={`${id}-violet`} cx="28%" cy="20%" r="80%"><stop stopColor="#c6b8e0" /><stop offset=".45" stopColor="#8d7bab" /><stop offset="1" stopColor="#31283f" /></radialGradient>
        <radialGradient id={`${id}-moss`} cx="25%" cy="20%" r="80%"><stop stopColor="#c0cbb1" /><stop offset=".4" stopColor="#708f83" /><stop offset="1" stopColor="#263d41" /></radialGradient>
        <radialGradient id={`${id}-light`}><stop stopColor="#efd6b5" stopOpacity=".35" /><stop offset="1" stopColor="#efd6b5" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-paper`} x2=".8" y2="1"><stop stopColor="#fff0d8" /><stop offset=".5" stopColor="#d9c4b5" /><stop offset="1" stopColor="#9e8797" /></linearGradient>
        <linearGradient id={`${id}-metal`} x2="1" y2=".8"><stop stopColor="#e5deeb" /><stop offset=".3" stopColor="#a7a4ba" /><stop offset=".55" stopColor="#dbd0db" /><stop offset="1" stopColor="#555974" /></linearGradient>
        <linearGradient id={`${id}-panel`} x2="1" y2="1"><stop stopColor="#718eaf" /><stop offset=".5" stopColor="#354a70" /><stop offset="1" stopColor="#222d4d" /></linearGradient>
        <linearGradient id={`${id}-ring`}><stop stopColor="#e7d7b1" stopOpacity=".35" /><stop offset=".45" stopColor="#eac7c4" /><stop offset="1" stopColor="#a08dae" stopOpacity=".4" /></linearGradient>
        <clipPath id={`${id}-disc`}><circle cx="110" cy="83" r="57" /></clipPath>
      </defs>
      {kind === "moon" && <>
        <circle cx="110" cy="83" r="79" fill={paint("light")} opacity=".45" />
        <circle cx="110" cy="83" r="57" fill={paint("moon")} stroke="#e7d9df" strokeOpacity=".35" />
        <g clipPath={paint("disc")}>
          {[[82, 55, 12], [125, 105, 19], [74, 105, 7], [127, 47, 7], [147, 73, 10], [97, 126, 5], [98, 79, 4]].map(([x, y, r]) => <g key={x}><ellipse cx={x} cy={y} rx={r} ry={r * .78} fill="#67677e" opacity=".27" /><path d={`M${x - r} ${y}a${r} ${r * .78} 0 0 1 ${r * 2} 0`} fill="none" stroke="#fbebd7" strokeOpacity=".42" strokeWidth="1.5" /></g>)}
          <path d="M147 30Q175 87 126 143" fill="none" stroke="#191a32" strokeWidth="21" opacity=".18" />
        </g>
        <path d="M65 47Q81 26 105 27" stroke="#fff6df" strokeOpacity=".7" strokeWidth="1.5" fill="none" />
      </>}
      {kind === "stars" && <>
        <ellipse cx="110" cy="87" rx="90" ry="70" fill={paint("light")} opacity=".23" />
        <path d="M29 112L65 47L109 80L154 30L190 110L109 80L111 146" stroke="#b7a7d5" strokeOpacity=".7" fill="none" strokeWidth="1" />
        <path d="M65 47L154 30M29 112L111 146L190 110" stroke="#c1b3d2" strokeOpacity=".2" strokeDasharray="2 5" fill="none" />
        {[[29,112],[65,47],[109,80],[154,30],[190,110],[111,146]].map(([x,y], i) => <g className="celestial-star" key={x} style={{ animationDelay: `${-i}s` }}><circle cx={x} cy={y} r="13" fill={paint("light")} /><path d={`M${x} ${y - 6}L${x + 1.8} ${y - 1.8}L${x + 6} ${y}L${x + 1.8} ${y + 1.8}L${x} ${y + 6}L${x - 1.8} ${y + 1.8}L${x - 6} ${y}L${x - 1.8} ${y - 1.8}Z`} fill="#f1e2cd" /><circle cx={x} cy={y} r="1.8" fill="#fff9ee" /></g>)}
      </>}
      {kind === "letter" && <g transform="rotate(-13 110 85)">
        <ellipse cx="110" cy="128" rx="65" ry="9" fill="#000" opacity=".18" />
        <path d="M38 47L181 47L181 131L38 131Z" fill={paint("paper")} stroke="#ecd5c4" strokeWidth=".7" />
        <path d="M38 131L105 74Q110 69 116 74L181 131" fill="#c2abac" opacity=".5" />
        <path d="M38 48L103 98Q110 103 118 97L181 48" fill="#ead9c7" stroke="#aa8f95" strokeWidth="1" />
        <path d="M44 51L109 97L175 51" fill="none" stroke="#fff6e0" opacity=".5" />
        <circle cx="110" cy="97" r="13" fill={paint("rose")} stroke="#a76c81" strokeWidth="2" />
        <path d="M110 91C103 85 100 96 110 102C120 96 117 85 110 91Z" fill="none" stroke="#eac6b7" strokeWidth="1" />
        <path d="M17 95Q9 42 58 25M176 149Q208 133 202 79" stroke="#d1bfb2" strokeOpacity=".45" strokeDasharray="1 6" fill="none" />
        <circle cx="59" cy="25" r="2" fill="#edd0a9" />
      </g>}
      {kind === "heart" && <>
        <ellipse cx="110" cy="91" rx="97" ry="25" transform="rotate(-24 110 91)" fill="none" stroke={paint("ring")} strokeWidth="8" opacity=".55" />
        <circle cx="110" cy="83" r="57" fill={paint("rose")} />
        <g clipPath={paint("disc")} fill="none" stroke="#f0bcc6" opacity=".18"><path d="M47 49Q108 32 173 73M42 72Q99 57 179 99" strokeWidth="7" /><path d="M47 101Q120 87 166 125" strokeWidth="12" /></g>
        <path d="M26 112C8 133 58 144 121 115S215 62 193 57" fill="none" stroke={paint("ring")} strokeWidth="6" />
        <path d="M26 112C8 133 58 144 121 115S215 62 193 57" fill="none" stroke="#fae3cb" strokeWidth=".8" opacity=".7" />
        <path d="M70 49Q89 29 112 28" stroke="#ffe3d5" strokeOpacity=".55" fill="none" />
      </>}
      {kind === "earth" && <>
        <circle cx="110" cy="83" r="66" fill={paint("light")} opacity=".27" />
        <circle cx="110" cy="83" r="57" fill={paint("ocean")} stroke="#badbe0" strokeOpacity=".4" />
        <g clipPath={paint("disc")}>
          <path d="M66 40L90 30L111 38L120 54L107 64L91 68L88 89L76 105L61 87L52 66ZM143 41L165 53L176 79L154 96L144 117L130 105L128 86L113 76L118 62ZM86 115L108 107L122 131L106 142Z" fill="#aac2a2" opacity=".8" />
          <path d="M49 64Q85 45 122 60M101 111Q133 96 169 111M80 37Q117 46 147 36" fill="none" stroke="#e6e9e0" strokeWidth="3" opacity=".32" />
          <path d="M145 22Q187 101 112 145" stroke="#101c33" strokeWidth="19" fill="none" opacity=".24" />
        </g>
        <path d="M72 91Q104 13 153 72" fill="none" stroke="#f1d1a0" strokeDasharray="2 4" />
        <circle cx="72" cy="91" r="3" fill="#fff0c9" /><circle cx="153" cy="72" r="3" fill="#fff0c9" />
      </>}
      {kind === "arcade" && <>
        <ellipse cx="110" cy="121" rx="71" ry="35" fill={paint("violet")} />
        <path d="M43 125Q111 163 178 124" fill="none" stroke="#bfacca" opacity=".45" />
        <g transform="rotate(-7 110 80)">
          <path d="M77 27H137L149 121H66Z" fill={paint("rose")} stroke="#d9b7c7" strokeWidth="1" />
          <path d="M137 27L151 37L162 124L149 121Z" fill="#4b3b5b" />
          <path d="M84 44H131L135 85H79Z" fill="#101a30" stroke="#887290" strokeWidth="3" />
          <path d="M91 70H99V62H107V70H115V62H123V78H91Z" fill="#b9b4da" />
          <path d="M77 94H140L145 109H72Z" fill="#c9a4b7" />
          <path d="M88 101V92" stroke="#342e46" strokeWidth="3" /><circle cx="88" cy="91" r="4" fill="#dac6b4" />
          <circle cx="123" cy="102" r="3" fill="#805f88" /><circle cx="133" cy="101" r="3" fill="#ecd0a5" />
          <path d="M91 34H124M96 116H119" stroke="#e3cad5" strokeOpacity=".6" strokeWidth="2" />
        </g>
      </>}
      {kind === "house" && <>
        <ellipse cx="111" cy="137" rx="75" ry="23" fill={paint("violet")} />
        <ellipse cx="112" cy="119" rx="78" ry="45" fill={paint("light")} opacity=".5" />
        <path d="M58 75L111 30L156 73V133H58Z" fill={paint("metal")} />
        <path d="M156 73L175 89V129L156 133Z" fill="#51485f" />
        <path d="M44 78L109 21L174 79L158 81L110 40L59 84Z" fill={paint("rose")} />
        <path d="M49 76L109 25L168 77" stroke="#dfb5b1" strokeWidth="1" fill="none" />
        <path d="M142 51V23H154V63" fill="#9c7b88" />
        <path className="house-smoke" d="M148 20Q134 9 147 0Q158 -9 148 -18" stroke="#ccbfce" strokeWidth="4" strokeLinecap="round" opacity=".25" fill="none" />
        <path d="M98 133V96Q111 85 124 96V133" fill="#edc697" />
        <path d="M104 132V99H119V132" fill="#705967" />
        <rect x="69" y="86" width="19" height="25" rx="7" fill="#f2d4a0" /><path d="M78 86V111M69 99H88" stroke="#8d7181" strokeWidth="2" />
        <circle cx="110" cy="65" r="9" fill="#edc796" /><path d="M110 56V74M101 65H119" stroke="#816676" strokeWidth="2" />
        <path d="M89 136H131" stroke="#cfb4a7" strokeWidth="4" />
      </>}
      {kind === "satellite" && <g transform="rotate(-25 110 85)">
        <path d="M24 57H78V116H24ZM143 57H197V116H143Z" fill={paint("panel")} stroke="#9fb8ca" />
        <path d="M37 58V115M51 58V115M65 58V115M156 58V115M170 58V115M184 58V115M25 76H77M25 96H77M144 76H196M144 96H196" stroke="#94a7c2" strokeOpacity=".45" />
        <path d="M76 84H146" stroke="#aaa8bc" strokeWidth="6" />
        <rect x="91" y="55" width="39" height="68" rx="6" fill={paint("metal")} />
        <path d="M97 61V116M102 116H121" fill="none" stroke="#f6e7e4" opacity=".55" />
        <circle cx="111" cy="83" r="12" fill={paint("ocean")} stroke="#7b7c97" strokeWidth="3" />
        <path d="M110 56V35M87 24Q110 60 137 24Z" fill={paint("metal")} stroke="#cfbfd3" />
        <path d="M110 39L119 18" stroke="#d4c1d1" strokeWidth="2" /><circle cx="120" cy="16" r="3" fill="#efcdb1" />
        <path className="satellite-signal" d="M144 13Q155 25 150 38M157 5Q174 25 165 47" fill="none" stroke="#c5b9d4" strokeOpacity=".4" />
      </g>}
      {kind === "garden" && <>
        <ellipse cx="111" cy="125" rx="68" ry="34" fill={paint("moss")} />
        <ellipse cx="110" cy="114" rx="67" ry="20" fill="#728d80" />
        <path d="M66 133Q94 141 99 153M144 125L154 143" stroke="#c5b7b4" strokeOpacity=".22" fill="none" />
        <path d="M109 119Q101 88 112 51M107 97Q77 102 72 78Q97 75 107 97M109 81Q137 88 149 62Q121 57 109 81" fill="#8dae91" stroke="#c3c9a3" strokeWidth="1.4" />
        <g transform="translate(112 47)">
          {[0,60,120,180,240,300].map((angle) => <ellipse key={angle} cx="0" cy="-12" rx="9" ry="16" fill={paint("rose")} transform={`rotate(${angle})`} />)}
          <circle r="8" fill="#e8cf9d" /><circle cx="-2" cy="-2" r="3" fill="#fff0c5" opacity=".65" />
        </g>
        <path d="M65 116Q60 96 68 90M148 119Q156 98 163 97" fill="none" stroke="#b3c7a4" strokeWidth="2" />
        <circle cx="69" cy="89" r="5" fill="#cfa8b8" /><circle cx="163" cy="96" r="4" fill="#e3ca9f" />
        <circle className="celestial-star" cx="51" cy="72" r="2" fill="#e7d4a3" /><circle className="celestial-star" cx="164" cy="43" r="1.5" fill="#e7d4a3" />
      </>}
    </svg>
  );
}
