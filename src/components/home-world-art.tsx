import { useId, type ReactNode } from "react";

/* Home-only illustrations. Lit upper-left planes and plum undersides are shared
   across the islands; these are deliberately separate from DestinationArt. */
function Island({ garden = false, children }: { garden?: boolean; children?: ReactNode }) {
  return <>
    <path d="M31 143 Q26 170 55 179 L88 201 L117 183 L153 176 Q182 163 175 140Z" fill="#322c49" />
    <path d="M39 150L58 178L87 201L83 171L65 153M87 201L117 183L130 161L104 166" fill="#49405d" />
    <path d="M31 139Q48 124 91 124Q145 121 175 140L177 153Q161 169 119 173Q66 177 34 158Z" fill={garden ? "#756274" : "#7d667e"} />
    <path d="M31 139Q43 121 91 120Q150 119 175 140Q161 159 111 162Q59 163 31 145Z" fill={garden ? "#9baba1" : "#c1b0b1"} />
    <path d="M38 144Q79 160 123 155M58 171L65 173M140 164L151 159M101 179L107 174" fill="none" stroke="#e0cbc0" strokeWidth="2" opacity=".45" />
    {children}
  </>;
}

function Cottage({ central = false }: { central?: boolean }) {
  return <g className="home-cottage" transform={central ? "translate(230 135) scale(.75)" : "translate(43 37)"}>
    <ellipse cx="66" cy="104" rx="53" ry="14" fill="#302940" stroke="none" opacity=".23" />
    <path d="M23 49L82 65L82 111L23 93Z" fill="#d5bec0" />
    <path d="M82 65L117 41L117 85L82 111Z" fill="#84758f" />
    <path d="M19 48L47 8L88 23L83 68Z" fill="#b77792" />
    <path d="M47 8L88 23L121 43L83 68L88 23Z" fill="#865c7a" />
    <path d="M20 47L83 65L120 41" fill="none" stroke="#e8b3bd" strokeWidth="3" />
    <path d="M98 23L98 1L110 4L110 29L104 33Z" fill="#b899ab" />
    <path d="M98 1L104-3L116 1L110 4Z" fill="#ddbdc7" />
    <g className="world-smoke" fill="#c9bdcf" stroke="none" opacity=".45"><path d="M105-8Q90-19 105-27Q118-34 109-44Q129-33 115-23Q103-16 105-8Z" /></g>
    <path d="M26 56L53 64L53 89L26 81Z" fill="#e9c295" opacity=".17" stroke="none" />
    <path d="M31 61L48 66L48 84L31 79Z" fill="#f2d8ac" className="world-window" />
    <path d="M94 66L108 57L108 75L94 84Z" fill="#ebc99f" className="world-window" />
    <path d="M58 80Q67 71 75 85L75 107L58 102Z" fill="#665066" />
    <path d="M61 104L77 109L82 116L62 111L52 106Z" fill="#bea3af" />
    <path d="M30 91L48 96L49 101L30 96Z" fill="#867886" strokeWidth="1.5" />
    <path d="M32 90Q29 79 36 86Q40 76 43 90Q49 83 48 94" fill="#91a18b" stroke="#637871" strokeWidth="1.4" />
    <path d="M40 65L40 82M94 75L108 66" fill="none" stroke="#b39996" strokeWidth="1.5" />
    <circle cx="69" cy="93" r="1.4" fill="#f0d1a2" stroke="none" />
  </g>;
}

function Flower({ x, y, color = "#d7a3b5", scale = 1 }: { x: number; y: number; color?: string; scale?: number }) {
  return <g className="world-flower" transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 1Q3 11 1 19M1 13Q-9 4-8 13Q-4 17 1 16M2 10Q10 3 11 10Q7 14 2 13" stroke="#647f7d" fill="#879b90" strokeWidth="1.5" />
    <path d="M0 0C-11-1-8-9-3-7C-4-16 5-15 6-7C15-10 17-2 8 1C11 9 3 13 1 6C-6 12-12 6 0 0Z" fill={color} strokeWidth="1.2" /><circle cx="3" cy="0" r="2.8" fill="#f0d3a4" stroke="none" />
  </g>;
}

function Cloud() {
  return <><path d="M23 143C4 132 13 112 30 112C25 94 50 88 65 100C79 80 102 82 113 98C139 86 156 101 155 116C183 111 197 132 176 145Q102 172 23 143Z" fill="#8c819f" /><path d="M23 135C13 120 30 115 40 120C35 105 49 100 67 109C80 91 101 94 112 108C134 95 151 111 149 122C171 118 182 130 176 139Q105 158 23 135Z" fill="#d4ccdd" stroke="none" /><path d="M36 144Q82 153 102 144M126 141Q148 148 168 136" fill="none" stroke="#b3a5c3" strokeWidth="2" /></>;
}

export function HomeWorldArt({ kind }: { kind: string }) {
  const uid = useId().replace(/:/g, "");
  const sphere = `${uid}-sphere`, clip = `${uid}-clip`, glow = `${uid}-glow`;
  const pink = kind === "heart", earth = kind === "earth";
  return <svg className={`home-world-art art-${kind}`} viewBox="0 0 210 210" fill="none" stroke="#302c48" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <defs>
      <radialGradient id={sphere} cx="29%" cy="24%" r="79%"><stop stopColor={pink ? "#efc3d1" : earth ? "#b5cecf" : "#f0e6d4"} /><stop offset=".48" stopColor={pink ? "#b879a5" : earth ? "#6d99b5" : "#b9b1cf"} /><stop offset=".8" stopColor={pink ? "#704c7e" : earth ? "#4a5a88" : "#6d658f"} /><stop offset="1" stopColor="#36324f" /></radialGradient>
      <radialGradient id={glow}><stop stopColor="#d6bcdf" stopOpacity=".19" /><stop offset="1" stopColor="#d6bcdf" stopOpacity="0" /></radialGradient>
      <clipPath id={clip}><circle cx="105" cy="105" r={earth ? 65 : 62} /></clipPath>
    </defs>
    <circle cx="105" cy="105" r="104" fill={`url(#${glow})`} stroke="none" />
    {(kind === "moon" || pink || earth) && <>
      {pink && <path d="M42 112C-9 104 5 69 57 67C101 63 169 82 195 108C224 136 192 148 153 146" stroke="#b49ab8" strokeWidth="9" />}
      <circle cx="105" cy="105" r={earth ? 65 : 62} fill={`url(#${sphere})`} />
      <g clipPath={`url(#${clip})`} strokeWidth="1.4">
        {kind === "moon" && <g className="moon-surface" fill="#8a82a6" stroke="#b7aec7"><ellipse cx="74" cy="74" rx="13" ry="10" /><path d="M63 75Q72 62 83 73" stroke="#6c658b" fill="none" /><ellipse cx="133" cy="104" rx="17" ry="21" /><path d="M122 100Q132 83 144 97" stroke="#605b81" fill="none" /><ellipse cx="76" cy="134" rx="19" ry="11" /><ellipse cx="101" cy="55" rx="5" ry="3" /><ellipse cx="121" cy="149" rx="8" ry="5" /><circle cx="54" cy="107" r="4" /><path d="M145 60Q176 84 159 126" stroke="#a199b6" strokeWidth="6" opacity=".35" /></g>}
        {pink && <g className="planet-bands" stroke="none" fill="#f1bbcf" opacity=".17"><path d="M30 75Q97 35 180 83L181 98Q99 55 28 91ZM23 114Q104 79 185 125L183 143Q103 95 23 129ZM45 161Q123 142 180 164L171 181L47 179Z" /></g>}
        {earth && <><g className="earth-land" fill="#a5b3a0" stroke="#779597"><path d="M35 73L53 48L75 50L89 66L78 78L82 92L67 101L52 94L40 106L30 95ZM77 104L97 111L103 128L94 142L88 164L75 150L69 125ZM128 45L150 56L171 70L179 97L158 106L145 92L128 99L113 84L116 61ZM119 104L140 107L151 123L137 148L121 134L112 117ZM158 145L178 146L186 159L162 166Z" /></g><g className="earth-clouds" fill="none" stroke="#f0e9df" strokeWidth="5" opacity=".56"><path d="M36 67Q65 55 88 70M116 56Q143 46 170 63M108 121Q133 113 159 127M43 134Q67 140 83 134" /></g></>}
      </g>
      <path d="M53 98Q51 57 90 47" stroke="#fff0e6" strokeWidth="3" opacity=".65" />
      <path d="M159 112Q156 153 118 164" stroke="#b7a2d5" strokeWidth="2" opacity=".5" />
      {pink && <><path d="M10 97C9 119 58 143 113 151C162 159 197 147 199 126" stroke="#d5b7c7" strokeWidth="10" /><path d="M10 96C16 119 67 142 121 146C159 150 184 142 195 130" stroke="#f1d4c9" strokeWidth="2" /><path className="world-glint" d="M168 144L171 137L174 144L181 147L174 150L171 157L168 150L161 147Z" fill="#f6dfbd" stroke="none" /></>}
      {earth && <g className="world-plane" transform="translate(174 53) rotate(22)"><path d="M-16 0L15-4L6 1L8 9L3 8L0 2L-12 5Z" fill="#e7d4c8" strokeWidth="1.5" /><path d="M-14 5Q-19 13-28 14" stroke="#d9c5bf" strokeDasharray="2 4" strokeWidth="1" /></g>}
    </>}
    {kind === "house" && <><Island garden /><Cottage /><path d="M103 152Q118 136 109 127L100 124L117 126Q131 142 118 155" fill="#e1cebe" stroke="none" /><Flower x={43} y={131} scale={.65} /><Flower x={157} y={130} color="#dac7dc" scale={.8} /><path d="M151 133Q133 110 148 86Q171 94 162 118L164 141" fill="#829587" /><path d="M154 107L156 140" stroke="#566c69" /></>}
    {kind === "arcade" && <><Island /><ellipse cx="97" cy="144" rx="40" ry="10" fill="#302940" stroke="none" opacity=".3" /><g transform="translate(49 25)"><path d="M9 9L59 23L59 124L10 110L14 69L5 62Z" fill="#a48aac" /><path d="M59 23L85 7L82 109L59 124Z" fill="#615370" /><path d="M9 9L34-7L85 7L59 23Z" fill="#d1b1c2" /><path d="M17 31L51 40L49 73L16 65Z" fill="#352e57" /><path className="arcade-screen" d="M21 36L46 42L44 66L21 60Z" fill="#af8fc4" stroke="none" /><path d="M24 53L29 49L33 54L39 48L44 54" stroke="#ead0d9" strokeWidth="2" /><path d="M14 69L59 82L67 74L21 62Z" fill="#c2a1b4" /><path d="M20 95L47 102L47 119L20 112Z" fill="#75617e" /><path d="M23 75L23 65" /><circle cx="23" cy="65" r="3" fill="#d2b4cf" /><ellipse cx="43" cy="76" rx="3" ry="2" fill="#e7c9a0" strokeWidth="1" /><path d="M67 27L73 22L72 92" stroke="#b69ec1" strokeWidth="1.5" /></g><g transform="translate(147 135) rotate(14)"><path d="M-17-6Q-26 11-18 16L-7 6L7 6L18 15Q26 11 17-6Q0-13-17-6Z" fill="#c6b7d2" /><path d="M-14 0H-6M-10-4V4" strokeWidth="2" /><circle cx="12" cy="1" r="2" fill="#b67f9c" stroke="none" /></g><path className="game-pixel" d="M146 51H152V57H158V63H152V69H146V63H140V57H146Z" fill="#d9bad9" stroke="none" /></>}
    {kind === "satellite" && <g className="satellite-body" transform="translate(105 104) rotate(-13)">
      <path d="M-70-25L-31-15L-39 38L-79 24Z" fill="#6d709e" /><path d="M-70-25L-64-30L-25-19L-31-15Z" fill="#bbb4d7" /><path d="M34-8L78-22L85 27L40 44Z" fill="#827cab" /><path d="M34-8L40-14L82-28L78-22Z" fill="#c9bad6" />
      <g stroke="#bbb2cf" strokeWidth="1.2"><path d="M-59-20L-67 27M-45-17L-52 33M-75-8L-35 4M-77 9L-37 21M49-13L56 38M64-17L70 33M37 8L81-7M39 25L83 9" /></g>
      <path d="M-36 5L-16 10M18 14L39 17" stroke="#c7b4c6" strokeWidth="7" />
      <path d="M-20-24L13-14L24 11L11 38L-21 25L-31-1Z" fill="#b3a7bb" /><path d="M-20-24L-4-34L26-22L13-14Z" fill="#e2d3d0" /><path d="M13-14L26-22L38 2L24 31L11 38L24 11Z" fill="#74697f" /><path d="M-18-14L5-7L14 10L4 25L-15 18L-22 1Z" fill="#dacbc7" />
      <circle cx="-5" cy="5" r="6" fill="#b293c3" /><path d="M1-31L5-49" stroke="#d5c8d5" strokeWidth="3" /><path className="satellite-dish" d="M-13-55Q8-34 27-53Q8-72-13-55Z" fill="#e3d5d4" /><path d="M7-54L7-64" stroke="#a48eb6" /><circle cx="7" cy="-64" r="2" fill="#e9cea8" /><path className="satellite-signal" d="M36-58Q47-48 44-34M45-68Q65-49 59-28" stroke="#c8b3d8" strokeWidth="1.5" />
      <circle className="world-glint" cx="-58" cy="-13" r="3" fill="#f0d9b9" stroke="none" />
    </g>}
    {kind === "stars" && <><Cloud /><path d="M42 113L92 137L168 117L111 88Z" fill="#a794ab" /><path d="M44 107L44 115L92 140L168 122L168 112L96 132Z" fill="#bca5b8" /><path d="M95 130Q72 107 41 105L61 77Q86 79 109 102Z" fill="#efe0d7" /><path className="story-page" d="M95 130Q126 107 168 112L147 84Q119 81 109 102Z" fill="#f5eadd" /><path d="M109 102L95 130M57 94Q76 96 93 113M64 86Q85 88 101 105M119 99Q132 94 148 101M112 111Q134 102 157 109" stroke="#bca7b4" strokeWidth="1.4" /><g transform="translate(28 58) rotate(-16)"><rect x="0" y="0" width="30" height="36" rx="2" fill="#e0d0cb" /><path d="M5 5H25V25H5Z" fill="#8f87ab" strokeWidth="1" /><path d="M5 23L14 14L25 25" fill="#b2a1c1" stroke="none" /></g><path d="M79 74L72 46L110 27L150 51L132 77" stroke="#b7a4ca" strokeWidth="1" /><g className="story-stars" fill="#f0d5b2" stroke="none">{[[72,46],[110,27],[150,51],[132,77],[79,74]].map(([x,y],i)=><path key={i} className={`story-star star-${i}`} d={`M${x} ${y-5}l2 3 4 2-4 2-2 4-2-4-4-2 4-2Z`} />)}</g></>}
    {kind === "letter" && <><Cloud /><g className="letter-paper" transform="rotate(-9 103 104)"><path d="M46 72L146 83L165 137L58 127Z" fill="#be9aaa" /><path d="M46 68L146 79L165 132L58 122Z" fill="#f0dcd1" /><path d="M46 68L111 112L146 79" fill="#dfbbbd" /><path d="M58 122L92 99M165 132L129 104" stroke="#baa0b1" strokeWidth="1.5" /><ellipse cx="110" cy="106" rx="11" ry="9" fill="#a56586" /><path d="M110 110Q98 102 105 100Q109 98 111 102Q119 99 118 104Z" fill="#ecc6cb" stroke="none" /><path d="M53 73L69 75" stroke="#fff0dd" strokeWidth="2" /></g><path d="M33 98Q12 64 43 45Q69 28 99 45" stroke="#b4a0c8" strokeWidth="1" strokeDasharray="2 6" /><path className="letter-spark" d="M51 43L54 34L57 43L65 46L57 49L54 57L51 49L43 46Z" fill="#e7ccad" stroke="none" /></>}
    {kind === "garden" && <><Island garden /><ellipse cx="105" cy="141" rx="46" ry="10" fill="#5d6a68" stroke="none" opacity=".22" /><path d="M96 158Q91 144 108 135Q125 126 117 113L106 110L126 108Q143 130 120 143L112 159Z" fill="#dccbbe" stroke="none" /><path d="M69 131L69 71Q103 43 135 81L135 142" stroke="#82768c" strokeWidth="7" /><path d="M74 132L74 76Q104 55 130 86L130 138" stroke="#dfc6ca" strokeWidth="2" /><path d="M68 98Q58 80 74 78Q84 81 74 94M111 64Q121 51 131 67Q128 78 120 71M134 103Q150 92 151 107Q146 119 134 113" fill="#839d8e" stroke="#617e77" /><Flower x={56} y={124} scale={.85} /><Flower x={148} y={126} color="#ddd0e0" scale={.9} /><Flower x={83} y={143} scale={.55} /><Flower x={119} y={77} scale={.5} /><path d="M41 130L56 135M146 151L158 146" stroke="#71877c" /><g fill="#f3dfad" stroke="none" className="garden-fireflies"><circle cx="46" cy="85" r="2" /><circle cx="157" cy="107" r="2" /><circle cx="100" cy="54" r="1.8" /></g></>}
  </svg>;
}

export function CentralHomeWorld() {
  return <svg viewBox="0 0 400 380" className="central-island-art" fill="none" stroke="#302c48" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <defs><radialGradient id="home-central-light"><stop stopColor="#edd0b0" stopOpacity=".25" /><stop offset="1" stopColor="#c99bb5" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="204" cy="194" rx="192" ry="164" fill="url(#home-central-light)" stroke="none" />
    <path d="M54 233L65 273L97 298L119 327L157 338L193 366L229 346L262 343L290 302L333 276L349 230Z" fill="#393049" />
    <path d="M54 233L97 298L119 327L130 272L104 250M130 272L157 338L193 366L185 290L158 260M229 346L262 343L290 302L263 276L237 293" fill="#55435e" />
    <path d="M65 233Q110 207 202 210Q301 208 341 231L344 256Q302 284 214 289Q112 290 60 256Z" fill="#847082" />
    <path d="M57 223Q81 198 141 194Q184 181 253 195Q311 195 346 225Q343 249 280 263Q227 278 162 265Q93 267 56 243Z" fill="#b2b7a7" />
    <path d="M63 226Q123 195 170 205Q238 186 330 223Q316 244 261 249Q190 261 136 247Q91 247 63 234Z" fill="#c5c2ad" stroke="none" />
    <path d="M219 248Q253 237 277 220L274 215Q253 219 241 235L205 243Z" fill="#e2cbb7" stroke="none" />
    <path d="M249 208Q273 198 292 212L311 224Q278 235 249 221Z" fill="#65536c" opacity=".18" stroke="none" />
    <Cottage central />
    <ellipse cx="201" cy="239" rx="47" ry="7" fill="#574c61" stroke="none" opacity=".13" />
    <g transform="translate(69 126)"><path d="M18 99L17 37" stroke="#77667b" strokeWidth="5" /><path d="M18 68Q-10 70-6 47Q-20 21 2 17Q17-3 32 14Q58 10 53 36Q63 53 44 62Q36 81 18 68Z" fill="#8eaaa0" /><path d="M1 25Q15 9 35 24" stroke="#c4d1ba" strokeWidth="3" /><path d="M17 41L18 77M17 61L4 51M18 52L33 40" stroke="#627c76" strokeWidth="2" /></g>
    <Flower x={98} y={233} scale={.8} /><Flower x={291} y={225} color="#d9c9dc" scale={1.1} /><Flower x={310} y={238} scale={.7} /><Flower x={137} y={248} scale={.45} />
    <path d="M77 245L87 254L91 246M274 249L279 256L287 246M119 224L124 228L129 220" stroke="#7d9686" strokeWidth="2" />
    <path d="M92 275L104 279M208 306L212 327M300 271L310 265M148 285L156 288" stroke="#ba96ae" strokeWidth="2" />
    <path d="M276 253Q284 260 288 255M73 239Q86 245 92 239M233 271L250 269" stroke="#dfd1bb" strokeWidth="2" opacity=".6" />
    <g fill="#efd5ab" stroke="none" className="central-lights"><circle cx="80" cy="226" r="2" /><circle cx="326" cy="227" r="2" /><circle cx="114" cy="250" r="1.7" /></g>
  </svg>;
}

export function SpaceRock({ className = "" }: { className?: string }) {
  return <svg className={`home-space-rock ${className}`} viewBox="0 0 90 75" fill="none" stroke="#38334f" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M8 29L26 10L52 5L79 27L84 51L57 69L23 60Z" fill="#554b69" /><path d="M8 29L26 10L52 5L63 26L42 37L23 60Z" fill="#88738a" /><path d="M42 37L63 26L79 27L84 51L57 69Z" fill="#39364f" /><ellipse cx="31" cy="26" rx="8" ry="6" fill="#61566f" /><path d="M25 25Q31 18 37 24M54 50L60 45" stroke="#ab91a0" strokeWidth="1.5" /></svg>;
}
