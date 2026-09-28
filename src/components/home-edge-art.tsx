import { useId, type Ref } from "react";
import { characters } from "@/config/characters";

const outline = "#302b43";

function Flower({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeWidth="1.5">
    <path d="M0 0Q5 13 1 24M2 15Q-11 5-10 13Q-6 20 2 18M3 10Q16 3 13 12Q9 16 3 15" fill="#879b99" stroke="#5a727a" />
    <path d="M0 1C-13 1-12-10-5-9C-7-21 5-23 8-12C19-17 24-5 13 0C22 11 10 18 5 9C-2 20-13 12 0 1Z" fill="#cda0b9" />
    <circle cx="5" cy="0" r="3.7" fill="#e7cca7" stroke="none" />
  </g>;
}

function Books({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeWidth="1.8">
    <ellipse cx="26" cy="28" rx="36" ry="7" fill="#292840" stroke="none" opacity=".3" />
    <path d="M-8 9L36 3L63 15L18 23Z" fill="#786c90" /><path d="M-8 9L18 23L18 32L-8 18Z" fill="#a194ac" /><path d="M18 23L63 15L63 23L18 32Z" fill="#dad0d1" />
    <path d="M-4-2L34-10L60 4L18 13Z" fill="#b98da1" /><path d="M-4-2L18 13L18 20L-4 7Z" fill="#7a5776" /><path d="M18 13L60 4L60 12L18 20Z" fill="#e4d5ce" />
    <path d="M22 16L54 9M23 26L54 21" stroke="#ada0b4" strokeWidth="1" />
  </g>;
}

function Lantern({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeWidth="2">
    <path d="M-8-21Q-15-43 0-44Q15-43 8-21" fill="none" stroke="#c2a4ac" />
    <path d="M-17-19L15-23L23 20L-12 24Z" fill="#776074" /><path d="M-17-19L-24-14L-20 26L-12 24Z" fill="#493d59" />
    <path className="edge-lantern-window" d="M-10-13L10-16L16 14L-7 17Z" fill="#edc38d" />
    <path d="M-12-23L9-26L20-20L-17-16L-24-14Z" fill="#b997a0" />
    <path className="edge-flame" d="M0 12Q-8 5 0-7Q-1 1 6 5Q10 12 0 12Z" fill="#fff0c8" stroke="none" />
    <path d="M-3-13L0 16M-17 22L23 18" stroke="#8b6c77" strokeWidth="2" />
  </g>;
}

export function EdgeMoon() {
  return <svg viewBox="0 0 140 112" fill="none" stroke={outline} strokeWidth="2" aria-hidden="true">
    <path d="M86 18C55 7 29 32 34 60C39 89 72 103 98 82C65 89 44 48 86 18Z" fill="#9c90b0" />
    <path d="M82 16C48 17 33 50 52 74C62 88 78 93 96 81C71 84 53 66 53 47C53 33 64 21 82 16Z" fill="#e4d5c7" />
    <path d="M45 43Q42 59 51 69" stroke="#f8e9d8" strokeWidth="2.5" />
    <path d="M17 74Q60 108 120 41M21 87Q74 112 122 59" stroke="#a992b5" strokeWidth=".8" opacity=".5" />
    <path d="M106 24L108 17L111 24L117 27L111 30L108 36L106 30L100 27Z" fill="#dfc6a7" stroke="none" /><circle cx="22" cy="49" r="2" fill="#bfa6c8" stroke="none" />
  </svg>;
}

export function EdgeCloud({ variant = 0 }: { variant?: number }) {
  return <svg viewBox="0 0 500 180" fill="none" aria-hidden="true">
    <path d="M26 125C-10 101 22 63 68 72C52 27 113 10 147 49C170-2 235 6 255 55C305 14 356 44 355 78C411 50 455 79 440 108C493 102 517 139 473 154C365 184 98 180 26 145Z" fill={variant ? "#454765" : "#67617f"} />
    <path d="M32 122Q51 88 91 103C72 68 115 49 149 78C172 25 226 31 250 83C289 49 328 60 336 101C371 77 419 89 416 119C460 107 476 135 452 142Q242 171 32 137Z" fill={variant ? "#74708b" : "#aaa0b9"} opacity=".5" />
    <path d="M91 145Q159 159 213 144M263 138Q308 156 366 140M157 82Q176 47 209 66" stroke="#c4b6cc" strokeWidth="2" strokeLinecap="round" opacity=".25" />
  </svg>;
}

export function EdgeNook() {
  const id = useId().replace(/:/g, "");
  return <svg viewBox="0 0 390 480" fill="none" stroke={outline} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <defs><radialGradient id={`${id}-glow`}><stop stopColor="#e9c191" stopOpacity=".32" /><stop offset="1" stopColor="#e9c191" stopOpacity="0" /></radialGradient></defs>
    <path d="M41 292L71 343L130 364L177 420L222 370L288 347L327 288Z" fill="#35324e" /><path d="M71 300L130 364L156 350L177 420L185 341M222 370L241 316L288 347L311 299" fill="#554562" />
    <path d="M40 279Q101 249 180 258Q273 245 330 279L326 302Q259 330 181 331Q100 326 46 300Z" fill="#746480" /><path d="M41 276Q99 244 181 253Q271 242 329 275Q275 303 191 309Q104 307 41 287Z" fill="#a2aaa0" />
    <path d="M61 280Q119 257 170 267M212 285Q253 291 301 275" stroke="#c7c3b6" opacity=".7" />
    <ellipse cx="174" cy="277" rx="91" ry="15" fill="#393149" stroke="none" opacity=".25" />
    <path d="M93 279L93 144C92 67 205 40 264 97L272 270L244 281L240 136C235 79 127 91 124 146L124 280Z" fill="#655d79" />
    <path d="M76 281L78 142C75 60 188 34 247 94L254 273L229 277L225 142C223 86 113 83 106 146L107 284Z" fill="#b2a4b9" />
    <path d="M82 133Q84 77 139 65M96 149L103 252M232 150L239 256" stroke="#d6c6ce" strokeWidth="3" />
    <path d="M84 174L101 177M91 216L106 218M227 185L247 180M224 127L248 126M172 62L176 86M110 80L124 101M204 74L197 95" stroke="#7e718b" strokeWidth="1.5" />
    <path d="M181 87L180 129" stroke="#c7b6bc" strokeWidth="1.8" />
    <circle cx="181" cy="172" r="86" fill={`url(#${id}-glow)`} stroke="none" className="edge-lantern-halo" /><Lantern x={181} y={163} scale={.8} />
    <path d="M255 116Q284 137 262 161Q241 177 267 194Q282 216 253 249M83 189Q55 208 74 235L68 276" stroke="#7a948c" strokeWidth="4" />
    <path d="M258 128Q285 118 281 136Q270 146 258 142M261 171Q238 155 239 176Q244 186 261 181M267 205Q292 195 285 217Q275 225 267 218M74 222Q49 209 49 230Q61 240 74 229" fill="#8eaa9a" stroke="#607d7c" strokeWidth="1.5" />
    <Books x={112} y={251} scale={.8} />
    <g className="edge-sleeping-cat" transform="translate(222 276)">
      <ellipse cx="2" cy="9" rx="42" ry="9" fill="#393149" stroke="none" opacity=".3" /><path d="M-34 0Q-34-33-7-32Q22-35 34-12Q45 4 21 11L-14 10Z" fill="#b5a1b1" />
      <path d="M-18-20L-27-38L-6-29L9-38L15-16Q13 2-8 2Q-27 1-18-20Z" fill="#d2bfc6" /><path d="M-19-13L-13-11M0-12L6-15" stroke="#655264" strokeWidth="1.8" /><path d="M-8-8L-4-8L-6-5Z" fill="#ad7d8c" stroke="none" />
      <path className="edge-cat-tail" d="M32-10Q55 9 19 12Q1 9 12-2" stroke="#968092" strokeWidth="9" /><path d="M-28-12L-14-9M5-10L18-13" stroke="#d5c2c8" strokeWidth="1" />
    </g>
    <Flower x={56} y={266} scale={.8} /><Flower x={306} y={270} scale={.65} /><Flower x={72} y={287} scale={.5} />
    <path d="M142 375L137 443M218 367L224 422" stroke="#9f8aaa" strokeWidth="1" /><path d="M137 434L140 442L148 446L140 450L137 458L133 450L125 446L133 442Z" fill="#dcc6a5" strokeWidth="1.2" /><circle cx="224" cy="431" r="8" fill="#837c9f" strokeWidth="1.3" />
  </svg>;
}

export function EdgeTurntable({ vinylRef }: { vinylRef: Ref<SVGGElement> }) {
  const id = useId().replace(/:/g, "");
  return <svg viewBox="0 0 600 450" fill="none" stroke={outline} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <defs><linearGradient id={`${id}-lid`} x2="0" y2="1"><stop stopColor="#b8aecb" stopOpacity=".19" /><stop offset="1" stopColor="#b8aecb" stopOpacity=".05" /></linearGradient><radialGradient id={`${id}-warm`}><stop stopColor="#e2b494" stopOpacity=".25" /><stop offset="1" stopColor="#e2b494" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="319" cy="295" rx="191" ry="93" fill={`url(#${id}-warm)`} stroke="none" className="edge-record-halo" />
    <path d="M54 310L92 365L173 392L223 439L316 405L370 421L477 366L550 308Z" fill="#35314e" /><path d="M90 325L173 392L185 355L223 439L249 365M316 405L341 347L370 421L405 365L477 366" fill="#54465f" />
    <path d="M52 296Q89 268 177 271L266 262Q349 258 407 275L505 281L552 307L532 329Q449 363 333 371Q196 376 112 346L61 325Z" fill="#7d697f" />
    <path d="M53 295Q126 261 215 269Q312 250 420 275Q501 271 550 304Q500 336 359 348Q184 364 57 313Z" fill="#b7a5b3" />
    <path d="M96 300Q227 275 356 300L489 314Q444 334 352 338Q207 350 110 329Z" fill="#d0bcc3" stroke="none" /><path d="M121 335Q229 355 347 339M161 343L183 359M405 332L426 346" stroke="#988294" strokeWidth="1.5" />
    <ellipse cx="307" cy="279" rx="171" ry="38" fill="#40364f" stroke="none" opacity=".27" />
    <path d="M143 198L378 171L491 260L493 281L250 312L143 229Z" fill="#64506d" /><path d="M250 286L491 260L493 281L250 312Z" fill="#83617b" /><path d="M143 198L250 286L250 312L143 229Z" fill="#a47c94" />
    <path d="M143 196Q145 190 155 189L373 166Q380 165 389 174L490 251Q498 259 487 263L254 289Q246 290 237 282L144 207Q139 203 143 196Z" fill="#bea0b7" />
    <path d="M155 197L376 174L479 254L252 279Z" fill="#9c829f" /><path d="M252 294L459 272" stroke="#d3acbf" strokeWidth="1.6" />
    <path d="M156 193L136 77Q133 65 145 65L372 43L390 171Z" fill={`url(#${id}-lid)`} stroke="#9d8ba9" strokeWidth="2" /><path d="M136 77L157 83L383 61L372 43M157 83L174 190" stroke="#dbccdf" strokeWidth="1" opacity=".45" />
    <path d="M186 87L202 166M210 84L224 130" stroke="#d8c8df" strokeWidth="3" opacity=".2" />
    <g transform="translate(287 222) rotate(-7) scale(1 .59)">
      <circle r="88" fill="#42384d" /><g ref={vinylRef} className="edge-vinyl">
        <circle r="84" fill="#262535" /><circle r="74" stroke="#5f536d" strokeWidth="1" /><circle r="63" stroke="#4d435b" strokeWidth="1" /><circle r="52" stroke="#5f536d" strokeWidth="1" /><circle r="39" stroke="#4d435b" strokeWidth="1" />
        <path d="M-75-22A78 78 0 0 1-47-63L-22-32L-37-10ZM74 22A78 78 0 0 1 47 63L22 32L37 10Z" fill="#a38caf" stroke="none" opacity=".19" />
        <circle r="25" fill="#bf91a6" /><path d="M-16-8Q0-20 16-8M-15 10Q0 20 15 10" stroke="#ead4cd" strokeWidth="1.5" /><path d="M-5 2Q-12-4-6-7Q-2-8 0-3Q7-10 10-4Q12 2 0 10Z" fill="#e5c5ca" stroke="none" />
      </g><circle r="4" fill="#e2d2cb" strokeWidth="1" />
    </g>
    <ellipse cx="412" cy="203" rx="16" ry="10" fill="#685a74" /><ellipse cx="412" cy="201" rx="11" ry="7" fill="#d2b8c9" />
    <g transform="translate(412 201)"><g className="edge-tonearm"><path d="M0 0L-27 19L-57 29L-69 25" stroke="#66516f" strokeWidth="8" /><path d="M0-2L-28 15L-58 25L-68 21" stroke="#dac5cd" strokeWidth="4" /><path d="M-77 18L-64 21L-68 33L-81 29Z" fill="#57465f" /><path d="M-78 22L-74 24" stroke="#e8ccd5" strokeWidth="1.5" /></g></g>
    <ellipse cx="273" cy="296" rx="9" ry="6" fill="#d4bdc9" /><path d="M269 292L278 296" stroke="#6b526e" strokeWidth="1.2" /><ellipse cx="453" cy="274" rx="6" ry="4" fill="#ceb8c7" /><ellipse className="edge-record-indicator" cx="430" cy="277" rx="3.2" ry="2" fill="#997d91" stroke="none" />
    <Books x={83} y={288} scale={.65} />
    <path d="M487 220Q472 261 492 279Q516 279 522 265L514 220Z" fill="#91788f" /><ellipse cx="501" cy="222" rx="14" ry="5" fill="#d2b4c8" /><path d="M499 222Q491 183 478 173M504 219Q513 177 528 164" stroke="#708b88" strokeWidth="3" /><Flower x={476} y={172} scale={.8} /><Flower x={527} y={163} scale={.7} />
    <ellipse cx="144" cy="313" rx="14" ry="5" fill="#69546b" opacity=".4" stroke="none" /><path d="M133 293L151 292L154 312Q145 319 134 314Z" fill="#d8bfc2" /><path d="M142 291L142 282" stroke="#d3ad94" /><path className="edge-flame" d="M140 282Q133 275 142 262Q150 276 144 282Z" fill="#efd4aa" stroke="none" />
    <path d="M374 305L409 300L426 318L390 324Z" fill="#e0cfc8" /><path d="M386 311L407 308M391 315L412 312" stroke="#b995ab" strokeWidth="1.2" />
    <path d="M78 327Q51 345 78 367M523 326Q547 351 514 377" stroke="#6b8d84" strokeWidth="3" /><path d="M75 343Q49 331 53 353Q65 363 75 351M531 345Q554 334 550 355Q537 365 531 354" fill="#8ba697" stroke="#647d7d" strokeWidth="1.5" />
    <g className="edge-music-note" fill="#d8b9d1" strokeWidth="1.5"><path d="M360 117L360 95L375 90L375 113" /><ellipse cx="355" cy="118" rx="5" ry="3" /><ellipse cx="370" cy="114" rx="5" ry="3" /></g>
    <g className="edge-music-note second" fill="#decbb9" strokeWidth="1.5"><path d="M215 110L215 90L224 96" /><ellipse cx="210" cy="111" rx="5" ry="3" /></g>
  </svg>;
}

const memoryPoints = [[38, 106], [112, 54], [189, 92], [282, 30], [365, 102], [313, 177], [208, 159], [124, 222], [54, 173], [263, 254], [372, 230], [172, 290], [82, 300], [339, 305]];
export function EdgeMemories({ count, target }: { count: number; target: number }) {
  return <svg viewBox="0 0 430 400" fill="none" stroke={outline} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="M38 106L112 54L189 92L282 30L365 102L313 177L208 159L124 222L54 173L38 106M208 159L263 254L372 230L339 305L172 290L82 300L124 222" stroke="#c7ae96" strokeWidth="1" opacity=".4" />
    <path className="edge-constellation-trace" d="M38 106L112 54L189 92L282 30L365 102" stroke="#f1d6ab" strokeWidth="1.3" pathLength="100" />
    {Array.from({ length: target }, (_, i) => { const [x, y] = memoryPoints[i % memoryPoints.length]; return <g key={i} className={i < count ? "edge-memory-star lit" : "edge-memory-star"} style={{ animationDelay: `${-i * 1.7}s` }}><circle cx={x} cy={y} r={i % 4 === 0 ? 8 : 5} fill={i < count ? "#e8cfaa" : "#9c87a4"} stroke="none" opacity={i < count ? .9 : .45} /><path d={`M${x} ${y - 11}L${x + 3} ${y - 3}L${x + 10} ${y}L${x + 3} ${y + 3}L${x} ${y + 11}L${x - 3} ${y + 3}L${x - 10} ${y}L${x - 3} ${y - 3}Z`} fill={i < count ? "#f4dfb8" : "#b7a1b9"} stroke="none" /></g>; })}
    {[[105, 78, -9], [279, 60, 7], [312, 205, -5]].map(([x, y, angle], i) => <g key={i} transform={`translate(${x} ${y})`}><path d="M0-19L8 31" stroke="#bda4b8" strokeWidth="1" /><g className={`edge-memory-card card-${i}`} style={{ transform: `rotate(${angle}deg)`, animationDelay: `${-i * 5}s` }}>
      <path d="M-27 29L42 31L43 109L-26 107Z" fill="#82738f" /><path d="M-30 25L39 27L40 105L-29 103Z" fill="#dccdd1" /><path d="M-24 32L32 34L33 85L-23 83Z" fill="#565170" strokeWidth="1" />
      {i === 0 && <><path d="M7 40C-12 43-12 65 7 71C-4 60-2 49 7 40Z" fill="#d7c8b7" stroke="none" /><circle cx="22" cy="50" r="2" fill="#e6cdae" stroke="none" /></>}
      {i === 1 && <><path d="M-22 68Q-7 45 8 64Q22 53 32 73L33 85L-23 83Z" fill="#93a9a2" stroke="none" /><path d="M-23 78Q2 67 33 79" stroke="#b4bec0" strokeWidth="1.5" /><circle cx="23" cy="44" r="4" fill="#d6c9b5" stroke="none" /></>}
      {i === 2 && <><path d="M3 75Q-14 64-4 55Q2 51 6 59Q13 49 21 57Q31 66 7 79Z" fill="#c490ab" stroke="none" /><path d="M-14 43L-12 48L-7 50L-12 52L-14 57L-16 52L-21 50L-16 48Z" fill="#e6cdae" stroke="none" /></>}
      <path d="M-15 95L24 96" stroke="#b8a0b0" strokeWidth="1" />
    </g></g>)}
  </svg>;
}

export function EdgeHorizon() {
  const id = useId().replace(/:/g, "");
  const janna = characters.janna, josh = characters.josh;
  return <svg viewBox="0 0 1600 620" fill="none" stroke={outline} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" role="img" aria-label="Janna and Josh sitting together beside a lantern, looking out across OurVerse">
    <defs><linearGradient id={`${id}-ground`} x2="0" y2="1"><stop stopColor="#5d587b" /><stop offset=".32" stopColor="#34394f" /><stop offset="1" stopColor="#171d32" /></linearGradient><radialGradient id={`${id}-lantern`}><stop stopColor="#e1b48b" stopOpacity=".32" /><stop offset="1" stopColor="#e1b48b" stopOpacity="0" /></radialGradient></defs>
    <path d="M-100 438Q800-112 1700 438" stroke="#a99ac7" strokeWidth="24" opacity=".06" /><path d="M-100 440Q800-110 1700 440L1700 650L-100 650Z" fill={`url(#${id}-ground)`} /><path d="M-100 435Q800-115 1700 435" stroke="#a898c0" strokeWidth="3" opacity=".65" />
    <path d="M-100 447Q800-80 1700 447L1700 494Q780-39-100 494Z" fill="#72718c" opacity=".13" stroke="none" />
    <path d="M553 218Q715 149 965 204Q848 252 690 255Z" fill="#817991" opacity=".28" stroke="none" /><ellipse cx="905" cy="219" rx="185" ry="98" fill={`url(#${id}-lantern)`} stroke="none" className="edge-lantern-halo" />
    <ellipse cx="798" cy="205" rx="100" ry="18" fill="#222b40" opacity=".6" stroke="none" />
    <g transform="translate(697 65)">
      <path d="M44 108Q17 129 21 143L53 149M73 113Q90 143 100 149L79 153" stroke={janna.outfit} strokeWidth="18" /><ellipse cx="38" cy="151" rx="17" ry="7" fill="#b8a5b3" /><ellipse cx="90" cy="154" rx="16" ry="6" fill="#c7b4bb" />
      <path d="M32 75Q62 66 89 79L96 131Q66 149 28 127Z" fill={janna.outfit} /><path d="M35 87L17 117L34 126M89 86L109 118" stroke={janna.outfit} strokeWidth="14" /><path d="M18 119L25 124M106 116L109 121" stroke={janna.skin} strokeWidth="9" />
      <path d="M34 39Q33 8 68 8Q104 10 103 48L110 109Q90 120 69 101Q48 119 24 105Z" fill={janna.hairColor} /><path d="M40 33Q59 5 85 24M40 45Q31 87 43 102M84 44Q96 78 89 100" stroke={janna.hairHighlight} strokeWidth="4" /><path d="M89 34Q100 32 104 43L99 48" fill={janna.skin} /><path d="M43 35Q43 49 55 46Q41 57 36 46Z" fill="#e6cfac" strokeWidth="1.5" />
    </g>
    <g transform="translate(795 64)">
      <path d="M39 111Q20 134 26 148L50 155M73 115Q98 134 98 151L75 156" stroke={josh.outfit} strokeWidth="18" /><ellipse cx="41" cy="154" rx="16" ry="7" fill="#d0c1c1" /><ellipse cx="88" cy="157" rx="16" ry="7" fill="#d0c1c1" />
      <path d="M30 78Q63 68 86 80L97 130Q69 145 27 128Z" fill={josh.outfit} /><path d="M35 87L15 116M88 88L111 119L100 128" stroke={josh.outfit} strokeWidth="14" /><path d="M13 116L15 120M101 125L95 128" stroke={josh.skin} strokeWidth="8" />
      <path d="M33 32Q38 11 69 12Q101 15 98 44L92 71Q64 83 36 64Z" fill={josh.skin} /><path d="M31 42Q22 13 52 9Q71 0 92 20Q105 30 97 54L83 53L80 65Q58 76 39 61Z" fill={josh.hairColor} /><path d="M36 27Q54 9 75 23M44 50Q67 63 84 46" stroke={josh.hairHighlight} strokeWidth="4" /><path d="M96 44L107 42L109 52L99 54M102 43L87 41" stroke="#30313c" strokeWidth="2.5" />
    </g>
    <Lantern x={947} y={204} scale={.95} />
    <path d="M680 223L687 205L692 220M876 222L881 202L890 225M929 223L934 213L940 225M995 236L1005 216L1009 236M590 236L596 220L604 232" stroke="#819793" strokeWidth="2" />
    <Flower x={615} y={228} scale={.8} /><Flower x={995} y={224} scale={.65} /><Flower x={1080} y={257} scale={.9} /><Flower x={501} y={275} scale={.65} />
    <path d="M436 299Q462 287 486 295M1053 290Q1083 281 1104 295M693 261L708 258M1198 350L1222 355M328 367L346 356" stroke="#8d8a9d" strokeWidth="2" opacity=".5" />
    <g transform="translate(1338 220) scale(.55)"><path d="M-65 18L-29 59L14 72L57 19Z" fill="#443851" /><path d="M-65 14Q-14-3 57 16L50 29Q-14 48-65 23Z" fill="#9c8da4" /><path d="M-10 19L-10-88" stroke="#8f7389" strokeWidth="9" /><path d="M-53-89L42-93L47-65L-50-61Z" fill="#ba99ac" /><path d="M-42-55L52-61L54-34L-46-27Z" fill="#9f819e" /><text x="-4" y="-72" textAnchor="middle" fill="#eee0d4" stroke="none" fontSize="10" letterSpacing="2">SEE YOU</text><text x="5" y="-42" textAnchor="middle" fill="#eee0d4" stroke="none" fontSize="9" letterSpacing="1">TOMORROW</text></g>
  </svg>;
}

export function EdgeDrifter({ planet = false }: { planet?: boolean }) {
  return <svg viewBox="0 0 140 120" fill="none" stroke={outline} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    {planet ? <><path d="M29 55Q-2 35 36 29Q93 25 130 69" stroke="#8e789c" strokeWidth="5" /><circle cx="69" cy="56" r="30" fill="#9b849e" /><path d="M44 38Q50 26 71 29" stroke="#d6bac4" strokeWidth="3" /><path d="M43 59Q70 53 96 67M49 72Q71 65 86 79" stroke="#745d85" strokeWidth="5" /><path d="M11 49Q21 84 89 83Q135 85 130 69" stroke="#c7a9bd" strokeWidth="5" /></> : <><path d="M24 37L55 19L91 27L112 55L101 82L63 97L27 77L17 58Z" fill="#4d4662" /><path d="M24 37L55 19L91 27L76 48L47 55L27 77L17 58Z" fill="#8d7b99" /><path d="M47 55L76 48L101 82L63 97Z" fill="#62516e" /><ellipse cx="52" cy="38" rx="11" ry="6" fill="#6b5a7d" /><path d="M45 38Q52 31 60 36M68 75L80 71" stroke="#b098b1" strokeWidth="1.5" /></>}
  </svg>;
}
