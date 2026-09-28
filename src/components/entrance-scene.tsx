"use client";

import { useEffect, useRef } from "react";
import "./entrance-scene.css";

type EntranceSceneProps = {
  entering: boolean;
  reducedMotion?: boolean | null;
  onEnter: () => void;
};

const stars = Array.from({ length: 74 }, (_, index) => ({
  x: 20 + ((index * 137.7 + index * index * 17.3) % 1560),
  y: 18 + ((index * 83.3 + index * index * 9.7) % 680),
  radius: index % 13 === 0 ? 2.4 : index % 5 === 0 ? 1.45 : 0.75,
  delay: `${-((index * 1.37) % 9).toFixed(2)}s`,
  duration: `${4.5 + (index % 7) * 1.15}s`,
}));

function SkyIllustration() {
  return (
    <svg className="entrance-sky-art entrance-depth-back" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="entranceMoon" cx="35%" cy="28%" r="72%">
          <stop stopColor="#f0deef" />
          <stop offset=".38" stopColor="#b9a6d2" />
          <stop offset=".75" stopColor="#75658f" />
          <stop offset="1" stopColor="#463d65" />
        </radialGradient>
        <linearGradient id="entrancePlanet" x1=".15" y1=".12" x2=".86" y2=".9">
          <stop stopColor="#e8b6c7" />
          <stop offset=".4" stopColor="#a9678e" />
          <stop offset=".72" stopColor="#674b79" />
          <stop offset="1" stopColor="#352d54" />
        </linearGradient>
        <linearGradient id="entranceRing" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f0c9bc" stopOpacity=".22" />
          <stop offset=".48" stopColor="#d59ab9" stopOpacity=".84" />
          <stop offset="1" stopColor="#7a648e" stopOpacity=".18" />
        </linearGradient>
        <radialGradient id="entranceSmallPlanet" cx="32%" cy="26%">
          <stop stopColor="#f1cbbf" />
          <stop offset=".5" stopColor="#a9789e" />
          <stop offset="1" stopColor="#4b4169" />
        </radialGradient>
        <filter id="entranceStarGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="entranceSoftGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <clipPath id="moonClip"><circle cx="235" cy="190" r="76" /></clipPath>
      </defs>

      <g className="entrance-orbits" fill="none" stroke="#d7c4e4">
        <ellipse cx="810" cy="365" rx="460" ry="167" transform="rotate(-10 810 365)" />
        <ellipse cx="820" cy="362" rx="610" ry="245" transform="rotate(8 820 362)" />
        <path d="M510 113C820 27 1271 155 1424 436" />
      </g>

      {stars.map((star, index) => (
        <circle
          className="entrance-star-dot"
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.radius}
          style={{ animationDelay: star.delay, animationDuration: star.duration }}
        />
      ))}

      <g className="entrance-moon-planet">
        <circle cx="235" cy="190" r="91" fill="#c7b7db" opacity=".13" filter="url(#entranceSoftGlow)" />
        <circle cx="235" cy="190" r="76" fill="url(#entranceMoon)" stroke="#e7d7ea" strokeOpacity=".32" strokeWidth="2" />
        <g clipPath="url(#moonClip)" opacity=".4">
          <ellipse cx="201" cy="160" rx="18" ry="11" fill="#77698e" />
          <ellipse cx="260" cy="144" rx="12" ry="17" fill="#8f7ea4" />
          <ellipse cx="278" cy="203" rx="22" ry="13" fill="#5f557b" />
          <ellipse cx="218" cy="223" rx="16" ry="9" fill="#695e80" />
          <path d="M159 197Q209 174 245 196T311 176V257H159Z" fill="#50496b" opacity=".28" />
          <path d="M166 145Q215 127 294 154" fill="none" stroke="#f3e8f2" strokeOpacity=".22" strokeWidth="5" />
        </g>
        <circle cx="211" cy="163" r="52" fill="none" stroke="#fff4f0" strokeOpacity=".14" strokeWidth="4" />
      </g>

      <g className="entrance-ringed-planet">
        <ellipse cx="1343" cy="194" rx="139" ry="30" transform="rotate(-13 1343 194)" fill="url(#entranceRing)" />
        <ellipse cx="1343" cy="194" rx="115" ry="20" transform="rotate(-13 1343 194)" fill="none" stroke="#f0c9cd" strokeOpacity=".55" strokeWidth="4" />
        <circle cx="1343" cy="194" r="60" fill="url(#entrancePlanet)" stroke="#edc4d4" strokeOpacity=".26" strokeWidth="2" />
        <path d="M1370 140A60 60 0 0 1 1394 226Q1380 246 1354 253Q1386 199 1370 140Z" fill="#282844" opacity=".38" />
        <path d="M1302 154Q1323 134 1352 136" fill="none" stroke="#ffe6de" strokeOpacity=".34" strokeWidth="7" strokeLinecap="round" />
        <path d="M1291 177Q1340 158 1391 171M1290 196Q1348 177 1399 191M1303 218Q1354 199 1387 213" fill="none" stroke="#f1c4d3" strokeOpacity=".2" strokeWidth="6" />
        <path d="M1328 137A60 60 0 0 1 1402 190" fill="none" stroke="#ffe1dc" strokeOpacity=".22" strokeWidth="5" />
        <path d="M1210 208C1274 241 1392 239 1470 184" fill="none" stroke="#e8b4c5" strokeOpacity=".72" strokeWidth="8" strokeLinecap="round" />
        <path d="M1225 215C1290 245 1394 238 1451 196" fill="none" stroke="#f8d7cf" strokeOpacity=".28" strokeWidth="2" />
      </g>

      <g className="entrance-crescent">
        <circle cx="801" cy="115" r="31" fill="#f5d8d0" opacity=".14" filter="url(#entranceSoftGlow)" />
        <path d="M812 82A35 35 0 1 0 827 142A31 31 0 0 1 812 82Z" fill="#ead4dc" />
        <path d="M805 88A29 29 0 0 0 811 145" fill="none" stroke="#fff4e7" strokeOpacity=".42" strokeWidth="2" />
        <path d="M786 89A34 34 0 0 0 796 148Q780 141 772 127Q766 103 786 89Z" fill="#9b8aad" opacity=".28" />
      </g>

      <g className="entrance-distant-planet">
        <circle cx="1128" cy="405" r="24" fill="url(#entranceSmallPlanet)" />
        <ellipse cx="1128" cy="405" rx="40" ry="8" transform="rotate(17 1128 405)" fill="none" stroke="#c8add0" strokeOpacity=".35" strokeWidth="2" />
      </g>
      <g className="entrance-distant-moon">
        <circle cx="461" cy="329" r="18" fill="#aa9bc3" />
        <circle cx="468" cy="322" r="18" fill="#5e5077" opacity=".7" />
      </g>

      {[[612, 190], [994, 207], [1184, 94], [380, 89], [1468, 333]].map(([x, y], index) => (
        <g className="entrance-four-star" key={`${x}-${y}`} transform={`translate(${x} ${y})`} style={{ animationDelay: `${-index * 1.8}s` }}>
          <path d="M0-11C1-3 3-1 11 0C3 1 1 3 0 11C-1 3-3 1-11 0C-3-1-1-3 0-11Z" fill="#f9e8e2" filter="url(#entranceStarGlow)" />
        </g>
      ))}
    </svg>
  );
}

function FloweringTree() {
  return (
    <svg className="entrance-tree entrance-depth-front" viewBox="0 0 660 560" aria-hidden="true">
      <defs>
        <linearGradient id="treeBark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#56405f" /><stop offset=".5" stopColor="#292743" /><stop offset="1" stopColor="#171a33" /></linearGradient>
        <radialGradient id="treeBloom"><stop stopColor="#d98fae" /><stop offset=".55" stopColor="#9d5e83" /><stop offset="1" stopColor="#553d69" /></radialGradient>
        <filter id="ornamentGlow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="entrance-tree-sway">
        <path d="M-37 15C83 73 112 166 151 287C176 364 239 410 305 441L350 415C265 357 230 303 218 226C204 136 136 61 40-7Z" fill="url(#treeBark)" stroke="#19182d" strokeWidth="8" />
        <path d="M100 136C201 124 274 90 335 25M152 257C258 229 341 174 407 99M190 314C314 306 437 263 527 198" fill="none" stroke="#2d2844" strokeWidth="34" strokeLinecap="round" />
        <path d="M100 133C205 118 273 85 334 22M156 252C264 222 337 171 406 96M193 307C321 294 426 258 525 193" fill="none" stroke="#76506c" strokeOpacity=".38" strokeWidth="8" strokeLinecap="round" />
        <path d="M174 119Q203 74 233 44M247 102Q282 78 310 49M236 229Q282 184 326 162M322 183Q371 159 405 123M340 286Q398 236 452 218M436 242Q476 207 516 183" fill="none" stroke="#302a45" strokeWidth="12" strokeLinecap="round" />
        <path d="M176 116Q206 74 232 46M239 227Q282 185 324 164M343 282Q397 238 450 219" fill="none" stroke="#9c6a83" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
        {[[50,60,88],[164,58,78],[282,30,92],[384,79,81],[469,139,92],[549,184,76],[272,151,69],[127,196,85],[393,214,74]].map(([x,y,r], index) => (
          <g className="entrance-foliage-cluster" key={index} transform={`translate(${x} ${y})`} style={{ animationDelay: `${-index * .7}s` }}>
            <circle r={r} fill="#3b3157" opacity=".82" />
            <circle cx={-r*.28} cy={-r*.14} r={r*.6} fill="#684568" />
            <circle cx={r*.22} cy={-r*.2} r={r*.58} fill="#7f4e73" />
            <circle cx={r*.1} cy={r*.2} r={r*.62} fill="#533b62" />
            <path d={`M${-r*.55} ${-r*.13}Q0 ${-r*.72} ${r*.52} ${-r*.08}`} fill="none" stroke="#c1819e" strokeOpacity=".28" strokeWidth="7" />
          </g>
        ))}
        {[[103,99],[207,47],[326,102],[433,135],[520,183],[152,214],[298,185],[393,249]].map(([x,y], index) => (
          <g className="entrance-tree-flower" key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${index%3===0 ? 1.15 : .85})`} style={{ animationDelay: `${-index * .9}s` }}>
            <path d="M0 0C-16-7-18-20-7-22C-4-37 12-35 12-21C28-27 34-11 21-4C31 10 14 19 6 8C-5 22-20 11 0 0Z" fill="url(#treeBloom)" />
            <circle cx="5" cy="-7" r="4" fill="#f0c7b5" />
          </g>
        ))}
      </g>
      {[[244,150,245],[391,175,212],[512,219,170]].map(([x,y,length], index) => (
        <g className="entrance-ornament" key={x} style={{ animationDelay: `${-index * 1.6}s` }}>
          <path d={`M${x} ${y}V${length}`} stroke="#d2b5c9" strokeOpacity=".6" strokeWidth="1" />
          {index === 1 ? (
            <path transform={`translate(${x} ${length+12})`} d="M4-12A13 13 0 1 0 10 10A11 11 0 0 1 4-12Z" fill="#efd0b6" filter="url(#ornamentGlow)" />
          ) : (
            <path transform={`translate(${x} ${length+12})`} d="M0-12C1-3 3-1 12 0C3 1 1 3 0 12C-1 3-3 1-12 0C-3-1-1-3 0-12Z" fill="#f4cfae" filter="url(#ornamentGlow)" />
          )}
          <circle cx={x} cy={length + 12} r="18" fill="#f3c99b" opacity=".08" />
        </g>
      ))}
    </svg>
  );
}

function CloudSea() {
  return (
    <div className="entrance-cloud-sea" aria-hidden="true">
      <svg className="entrance-clouds entrance-clouds-back entrance-depth-back" viewBox="0 0 1600 360" preserveAspectRatio="none">
        <path d="M-100 278C-40 204 37 223 77 248C101 177 193 163 238 226C279 160 395 165 423 242C499 182 600 194 631 255C676 188 790 166 840 241C901 168 1020 177 1054 241C1111 187 1212 189 1252 247C1300 188 1405 193 1438 251C1493 200 1562 216 1700 257V380H-100Z" fill="#aa8faf" opacity=".47" />
        <path d="M-40 273Q20 229 77 250M250 247Q331 192 423 243M650 260Q748 196 840 242M1074 252Q1164 205 1252 248M1452 257Q1519 224 1602 253" fill="none" stroke="#d9bdd0" strokeOpacity=".17" strokeWidth="8" strokeLinecap="round" />
        <path d="M-100 302C31 254 110 282 169 300C273 245 372 273 430 308C545 252 660 285 726 313C827 253 962 270 1020 311C1137 250 1260 276 1325 310C1432 263 1530 277 1700 321V390H-100Z" fill="#655a83" opacity=".55" />
      </svg>
      <svg className="entrance-clouds entrance-clouds-mid entrance-depth-mid" viewBox="0 0 1600 330" preserveAspectRatio="none">
        <defs><linearGradient id="cloudMid" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#efc4c6" /><stop offset=".35" stopColor="#c99fb7" /><stop offset=".72" stopColor="#776b91" /><stop offset="1" stopColor="#463f68" /></linearGradient></defs>
        <path d="M-80 253C-17 166 86 180 122 231C155 131 296 133 339 225C380 172 467 172 508 231C542 125 698 126 745 224C788 164 888 159 928 228C976 135 1116 146 1156 232C1217 157 1321 171 1351 235C1418 151 1543 172 1680 247V360H-80Z" fill="url(#cloudMid)" />
        <path d="M-80 276C15 229 96 247 160 280C247 220 367 236 422 284C539 224 659 240 718 288C831 218 949 245 1011 286C1114 224 1247 246 1306 286C1425 221 1535 249 1680 294V360H-80Z" fill="#655777" opacity=".7" />
        <path d="M-80 301Q89 255 235 308T529 302T820 307T1118 304T1419 307T1680 301V360H-80Z" fill="#3f3d63" opacity=".35" />
        <path d="M-20 235Q55 171 124 230M354 224Q434 167 508 231M758 222Q846 160 928 228M1167 229Q1260 169 1351 235" fill="none" stroke="#f7d7cf" strokeOpacity=".34" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <svg className="entrance-clouds entrance-clouds-front entrance-depth-front" viewBox="0 0 1600 300" preserveAspectRatio="none">
        <defs><linearGradient id="cloudFront" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f1c7c4" /><stop offset=".36" stopColor="#c79bb3" /><stop offset="1" stopColor="#574c72" /></linearGradient></defs>
        <path d="M-100 250C13 159 126 172 175 232C251 133 387 158 424 232C503 158 621 172 664 239C738 148 875 162 914 235C1009 146 1130 168 1169 241C1254 155 1395 174 1435 243C1514 179 1590 194 1700 241V340H-100Z" fill="url(#cloudFront)" />
        <path d="M-100 273Q76 213 206 274T499 270T799 278T1106 272T1407 278T1700 269V340H-100Z" fill="#403a61" opacity=".55" />
        <path d="M-80 286Q85 239 225 289T510 286T814 292T1119 287T1420 293T1680 286V340H-80Z" fill="#302f52" opacity=".46" />
        <path d="M-40 240Q78 166 175 232M673 235Q793 155 914 235M1179 237Q1313 157 1435 243" fill="none" stroke="#ffe0d0" strokeOpacity=".28" strokeWidth="13" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CliffScene() {
  return (
    <svg className="entrance-cliff entrance-depth-front" viewBox="0 0 760 560" aria-hidden="true">
      <defs>
        <linearGradient id="cliffTop" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#75657a" /><stop offset="1" stopColor="#393751" /></linearGradient>
        <linearGradient id="cliffFace" x1=".15" y1="0" x2=".8" y2="1"><stop stopColor="#72556e" /><stop offset=".42" stopColor="#4b405e" /><stop offset="1" stopColor="#242640" /></linearGradient>
        <radialGradient id="cliffLanternGlow"><stop stopColor="#ffd18c" stopOpacity=".66" /><stop offset=".45" stopColor="#e9a96d" stopOpacity=".24" /><stop offset="1" stopColor="#d98b63" stopOpacity="0" /></radialGradient>
        <linearGradient id="jannaHair" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c27570" /><stop offset=".5" stopColor="#8d4e5d" /><stop offset="1" stopColor="#4e3348" /></linearGradient>
        <linearGradient id="joshHair" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#39354d" /><stop offset="1" stopColor="#161a2c" /></linearGradient>
        <filter id="cliffGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <path d="M-45 244C98 203 206 207 315 224C411 239 501 215 602 244C652 258 690 283 733 310L680 358C611 371 573 402 538 446C498 496 440 544 342 590H-45Z" fill="url(#cliffFace)" stroke="#24233d" strokeWidth="7" />
      <path d="M-48 231C82 189 190 194 308 207C420 220 499 198 593 221C648 235 693 264 733 302C651 297 593 291 520 304C409 324 300 292 204 304C99 317 36 299-48 316Z" fill="url(#cliffTop)" stroke="#29273f" strokeWidth="7" />
      <path d="M-39 226C83 187 190 194 306 205C421 216 502 193 593 219C638 232 673 249 708 278C580 250 503 272 411 273C285 274 176 250 65 279C20 290-10 282-44 279Z" fill="#516356" />
      <path d="M-34 225C83 193 177 196 287 205M351 211C450 214 515 194 593 219" fill="none" stroke="#9b8f83" strokeOpacity=".5" strokeWidth="7" strokeLinecap="round" />
      <path d="M100 312L181 355L139 520M228 310L305 379L272 548M373 316L441 365L392 520M527 305L579 354L535 449" fill="none" stroke="#8c6279" strokeOpacity=".34" strokeWidth="13" />
      <path d="M33 345L93 372L65 492M189 371L254 416L226 529M337 362L389 409L356 530M475 340L521 373L482 470" fill="none" stroke="#252842" strokeOpacity=".65" strokeWidth="24" />
      <path d="M-22 327L74 311L134 350L98 421L25 449L-22 419ZM151 322L229 309L292 375L255 447L178 415ZM314 326L391 316L444 366L410 456L332 422ZM463 317L535 304L580 351L533 427L475 397Z" fill="#8a627c" opacity=".22" />
      <path d="M8 350L72 335L103 364M169 352L221 333L261 381M336 349L383 337L420 374M483 341L526 329L557 359" fill="none" stroke="#b38aa0" strokeOpacity=".24" strokeWidth="6" strokeLinecap="round" />
      <path d="M88 468L140 438L171 489L137 538L77 526ZM274 430L333 406L370 459L339 527L285 506ZM424 438L481 406L518 445L484 497Z" fill="#20243d" opacity=".72" />
      <path d="M103 270Q91 339 117 389T100 485M546 281Q525 350 549 414" fill="none" stroke="#566958" strokeWidth="5" />
      <path d="M100 342l-13 12m22 10 15 11m420-42-13 13m18 19 14 8" stroke="#849474" strokeWidth="4" strokeLinecap="round" />
      <path d="M-3 266Q45 244 91 258T177 252M422 252Q480 229 548 246T656 266" fill="none" stroke="#6f8369" strokeWidth="8" strokeLinecap="round" strokeDasharray="8 10" />
      <path d="M389 274Q465 233 557 253Q531 294 441 302Z" fill="#e7a267" opacity=".13" />
      <path d="M454 264Q490 244 531 254" fill="none" stroke="#f2b374" strokeOpacity=".38" strokeWidth="7" strokeLinecap="round" />
      {[[54,261,9,5],[170,274,7,4],[275,251,10,5],[446,281,7,4],[574,274,8,4]].map(([x,y,rx,ry]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} fill="#aaa0a6" stroke="#403b54" strokeWidth="2" />)}

      <g className="entrance-couple-idle">
        <g className="entrance-janna">
          <path d="M300 224Q282 191 299 166Q315 139 346 151Q375 160 373 197L365 240Z" fill="url(#jannaHair)" stroke="#2b273e" strokeWidth="5" />
          <path d="M302 187Q303 218 315 240L333 228L350 244L366 224L367 190Q349 212 330 205Q315 207 302 187Z" fill="#573848" opacity=".7" />
          <circle cx="337" cy="177" r="25" fill="#d8a58f" stroke="#3b2e42" strokeWidth="4" />
          <path d="M307 176Q314 138 347 149Q374 157 371 187Q349 172 333 155Q325 174 307 176Z" fill="url(#jannaHair)" />
          <path d="M318 158Q339 143 358 160M311 178Q322 166 333 155" fill="none" stroke="#e09a88" strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" />
          <path d="M361 171Q372 192 363 220" fill="none" stroke="#4b3041" strokeWidth="7" strokeLinecap="round" />
          <path d="M306 198Q291 221 294 266L352 269Q362 229 352 204Z" fill="#3f405b" stroke="#292a42" strokeWidth="5" />
          <path d="M304 208Q321 220 353 207L349 224Q326 234 300 220Z" fill="#555772" opacity=".72" />
          <path d="M326 226V264M301 244Q326 251 351 243" fill="none" stroke="#73728b" strokeOpacity=".55" strokeWidth="3" />
          <path d="M306 216Q322 229 350 216" fill="none" stroke="#e4af91" strokeOpacity=".43" strokeWidth="4" />
          <path d="M304 265L286 300M337 267L352 301" stroke="#292b45" strokeWidth="14" strokeLinecap="round" />
          <path d="M357 206Q371 198 383 184" fill="none" stroke="#d39a88" strokeWidth="7" strokeLinecap="round" />
          <circle cx="381" cy="184" r="5" fill="#dba493" />
          <path d="M361 212Q367 221 364 235" fill="none" stroke="#efb37c" strokeOpacity=".52" strokeWidth="4" strokeLinecap="round" />
          <path className="entrance-hair-wisp" d="M305 172Q278 185 288 214" fill="none" stroke="#b36568" strokeWidth="7" strokeLinecap="round" />
        </g>
        <g className="entrance-josh">
          <g className="entrance-josh-head">
          <circle cx="397" cy="178" r="25" fill="#c99280" stroke="#302b40" strokeWidth="4" />
          <path d="M371 176Q371 145 399 148Q427 149 425 181Q416 160 402 158Q390 174 371 176Z" fill="url(#joshHair)" />
          <path d="M374 165L384 150L390 160L399 146L407 158L418 151L425 172" fill="url(#joshHair)" stroke="#202237" strokeWidth="3" strokeLinejoin="round" />
          <path d="M410 172q10-5 16 2v8q-8 4-15-1M407 175l3 1" fill="none" stroke="#9791a7" strokeWidth="2.5" />
          </g>
          <path d="M379 204Q365 226 369 269L428 269Q435 230 418 205Z" fill="#30364d" stroke="#25283d" strokeWidth="5" />
          <path d="M380 204Q397 216 418 204L426 219Q400 232 372 218Z" fill="#454b63" />
          <path d="M395 217V267M397 222l-7 11m9-11 8 11" fill="none" stroke="#77788e" strokeOpacity=".64" strokeWidth="3" />
          <path d="M381 245Q398 254 419 245V263H381Z" fill="#282d44" stroke="#555a70" strokeWidth="2" />
          <path d="M382 208Q399 219 418 207" fill="none" stroke="#6e6b82" strokeWidth="3" />
          <path d="M386 267L378 302M417 267L430 298" stroke="#25283d" strokeWidth="14" strokeLinecap="round" />
          <path d="M378 212Q366 201 358 190" fill="none" stroke="#c68d7d" strokeWidth="7" strokeLinecap="round" />
          <circle cx="358" cy="190" r="5" fill="#d09a87" />
          <path d="M425 218Q430 237 426 255" fill="none" stroke="#efb37c" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>

      <g className="entrance-cat">
        <ellipse cx="241" cy="294" rx="35" ry="7" fill="#171a2d" opacity=".48" />
        <path d="M223 274Q211 251 220 229L231 243L249 237L262 224Q270 250 257 273Z" fill="#25273a" stroke="#191b2e" strokeWidth="4" />
        <ellipse cx="243" cy="278" rx="23" ry="17" fill="#25273a" />
        <path d="M226 248Q237 240 253 241M229 271Q241 262 256 266" fill="none" stroke="#d89b72" strokeOpacity=".44" strokeWidth="3" strokeLinecap="round" />
        <path className="entrance-cat-tail" d="M220 277Q188 259 192 286Q195 306 218 291" fill="none" stroke="#25273a" strokeWidth="10" strokeLinecap="round" />
        <path d="M218 276Q203 269 198 277" fill="none" stroke="#9b7d8c" strokeOpacity=".38" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="235" cy="253" r="2" fill="#e5b884" /><circle cx="251" cy="251" r="2" fill="#e5b884" />
      </g>

      <g className="entrance-lantern">
        <circle cx="485" cy="246" r="87" fill="url(#cliffLanternGlow)" filter="url(#cliffGlow)" className="entrance-lantern-aura" />
        <ellipse cx="485" cy="293" rx="37" ry="8" fill="#17192b" opacity=".45" />
        <path d="M469 221Q462 190 484 187Q507 190 501 221" fill="none" stroke="#c5a68e" strokeWidth="6" />
        <path d="M458 218L508 218L501 285L463 285Z" fill="#4e4050" stroke="#28263a" strokeWidth="5" />
        <path d="M468 230L498 230L494 274L471 274Z" fill="#e99e61" stroke="#c88763" strokeWidth="3" />
        <path className="entrance-lantern-flame" d="M484 264Q473 250 485 236Q485 247 493 252Q496 262 484 264Z" fill="#fff2bc" />
        <path d="M456 218L484 205L510 218M458 286H505" fill="none" stroke="#ae8b7b" strokeWidth="5" />
        {[0,1,2,3].map(index => <circle className="entrance-warm-mote" key={index} cx={474 + index*12} cy={204-index*18} r={2.2-index*.25} style={{ animationDelay: `${-index*1.3}s` }} />)}
      </g>

      {[[78,245],[139,230],[548,245],[596,259],[190,259]].map(([x,y], index) => (
        <g className="entrance-cliff-flower" key={`${x}-${y}`} transform={`translate(${x} ${y})`} style={{ animationDelay: `${-index*.6}s` }}>
          <path d="M0 12Q-2 3 2-5" stroke="#71856d" strokeWidth="3" />
          <path d="M2-5C-9-6-9-15-2-15C0-25 10-21 9-13C19-12 18-2 9 0C6 8-3 5 2-5Z" fill="#dda5b7" />
          <circle cx="4" cy="-8" r="3" fill="#f2d19e" />
        </g>
      ))}
    </svg>
  );
}

function DoorwayIsland() {
  return (
    <svg className="entrance-door-island entrance-depth-mid" viewBox="0 0 550 600" aria-hidden="true">
      <defs>
        <linearGradient id="islandTop" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7b766f" /><stop offset="1" stopColor="#41435a" /></linearGradient>
        <linearGradient id="islandRock" x1=".18" y1="0" x2=".72" y2="1"><stop stopColor="#7b5b76" /><stop offset=".48" stopColor="#4a405f" /><stop offset="1" stopColor="#262741" /></linearGradient>
        <linearGradient id="doorStone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d2afbd" /><stop offset=".35" stopColor="#9d7f9e" /><stop offset="1" stopColor="#665979" /></linearGradient>
        <linearGradient id="doorWood" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6e4e57" /><stop offset=".55" stopColor="#9e6d67" /><stop offset="1" stopColor="#49394d" /></linearGradient>
        <radialGradient id="doorLight"><stop stopColor="#fff1b8" /><stop offset=".35" stopColor="#efb06f" /><stop offset="1" stopColor="#b66e69" stopOpacity="0" /></radialGradient>
        <filter id="doorGlow" x="-120%" y="-100%" width="340%" height="300%"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>
      <g className="entrance-island-float">
        <ellipse cx="284" cy="518" rx="170" ry="32" fill="#1e2038" opacity=".24" />
        <path d="M86 358Q270 299 478 365L421 432L368 518L292 575L220 511L153 433Z" fill="url(#islandRock)" stroke="#2c2a46" strokeWidth="7" />
        <path d="M108 362L174 423L210 494M221 342L260 423L292 561M347 342L337 432L366 515M443 363L403 423L386 487" fill="none" stroke="#9a6d80" strokeOpacity=".3" strokeWidth="14" />
        <path d="M103 377L171 369L225 423L203 500L153 433ZM239 361L315 350L337 430L292 561L260 423ZM355 361L430 373L403 423L366 515L337 430Z" fill="#8a627d" opacity=".2" />
        <path d="M120 389L170 383L204 419M251 379L300 365L324 418M365 380L414 389L392 424" fill="none" stroke="#b38ca6" strokeOpacity=".26" strokeWidth="7" strokeLinecap="round" />
        <path d="M183 454L230 428L267 473L236 531L202 493ZM307 456L351 424L389 464L363 522L329 500Z" fill="#20243d" opacity=".72" />
        <path d="M93 352Q262 292 474 352Q433 391 351 393Q274 377 203 397Q139 399 93 352Z" fill="url(#islandTop)" stroke="#302d47" strokeWidth="7" />
        <path d="M100 344Q273 290 471 345Q410 366 353 363Q275 351 211 377Q145 377 100 344Z" fill="#536b59" />
        <path d="M118 346Q188 318 248 328T365 326Q407 326 452 343Q408 357 354 357Q284 348 218 369Q158 370 118 346Z" fill="#6f8067" opacity=".62" />
        <path d="M234 346Q306 313 394 331Q374 366 288 370Q249 365 214 368Z" fill="#e6a96f" opacity=".18" />
        <path d="M108 340Q272 298 458 340" fill="none" stroke="#a5a081" strokeOpacity=".5" strokeWidth="7" strokeLinecap="round" />
        <path d="M110 350Q151 366 194 358M393 353Q432 349 463 341" fill="none" stroke="#a9b294" strokeOpacity=".52" strokeWidth="4" strokeDasharray="6 7" />
        {[[139,350],[175,344],[401,344],[446,350]].map(([x,y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 2 ? 4 : 6} fill="#8e8791" stroke="#3a3850" strokeWidth="2" />)}

        <g className="entrance-doorway">
          <ellipse className="entrance-door-spill" cx="306" cy="369" rx="117" ry="50" fill="url(#doorLight)" opacity=".54" filter="url(#doorGlow)" />
          <path className="entrance-door-haze" d="M211 356Q305 298 423 354Q386 401 300 402Q245 395 211 356Z" fill="url(#doorLight)" opacity=".24" />
          <path d="M188 347V196C188 102 262 51 326 51C405 51 454 117 454 196V353Z" fill="url(#doorStone)" stroke="#40364f" strokeWidth="9" />
          <path d="M205 335V198C205 116 269 69 328 69C397 69 438 125 438 199V338" fill="none" stroke="#f1c5bd" strokeOpacity=".22" strokeWidth="9" />
          <path d="M219 344V198C219 126 270 88 326 88C386 88 423 135 423 198V346Z" fill="#322b46" stroke="#ead0d1" strokeOpacity=".38" strokeWidth="5" />
          <path d="M226 333V200C226 135 272 96 326 96C379 96 415 141 415 200V334" fill="none" stroke="#f5c58e" strokeOpacity=".3" strokeWidth="8" />
          <path className="entrance-door-glow" d="M242 341V201C242 148 278 112 326 112C376 112 401 153 401 201V342Z" fill="#e9aa70" />
          <path d="M250 338V198C250 155 281 121 322 118V341Z" fill="url(#doorWood)" stroke="#473346" strokeWidth="6" />
          <path d="M263 173L310 155M262 223L310 203M262 273L310 251M262 318L310 301" stroke="#c08b75" strokeOpacity=".3" strokeWidth="4" />
          <path d="M315 124V336" stroke="#ffe1aa" strokeOpacity=".48" strokeWidth="5" />
          <path d="M322 118L358 139V339L322 341Z" fill="#ffd091" opacity=".68" />
          <circle cx="301" cy="239" r="5" fill="#e8c490" />
          <path d="M235 345L322 341L358 338L415 344" stroke="#ffe0a8" strokeOpacity=".7" strokeWidth="8" />
          <path d="M246 353Q304 367 398 352" fill="none" stroke="#f0bd7d" strokeOpacity=".44" strokeWidth="9" strokeLinecap="round" />
          <g className="entrance-door-lantern">
            <path d="M370 140Q382 123 393 141" fill="none" stroke="#5f4853" strokeWidth="4" />
            <path d="M368 143L393 143L390 180L371 180Z" fill="#4b3c4c" />
            <path d="M374 150H387V173H374Z" fill="#ffd590" />
            <circle cx="381" cy="161" r="22" fill="#f6b471" opacity=".22" filter="url(#doorGlow)" />
          </g>
          <path d="M199 274Q169 238 192 188M213 170Q184 138 211 108M420 283Q462 248 433 208M431 189Q464 151 433 120" fill="none" stroke="#60765f" strokeWidth="7" strokeLinecap="round" />
          <path d="M203 271Q194 234 202 197M422 278Q437 244 429 211" fill="none" stroke="#e1b176" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
          {[[192,180],[205,132],[433,198],[439,146],[207,254],[423,263]].map(([x,y], index) => (
            <g className="entrance-door-flower" key={`${x}-${y}`} transform={`translate(${x} ${y})`} style={{ animationDelay: `${-index*.75}s` }}>
              <circle r="8" fill="#e2a9bc" /><circle cx="4" cy="-2" r="3" fill="#f5d7af" />
              <path d="M-8 8l-12 10m27-12 11 9" stroke="#769075" strokeWidth="3" />
            </g>
          ))}
        </g>

        <path d="M153 380Q142 427 158 470T144 533M412 386Q424 432 407 477" fill="none" stroke="#61745f" strokeWidth="6" />
        <path d="M149 426l-15 10m24 20 16 8m234-34 15 11m-20 27-14 10" stroke="#809376" strokeWidth="4" strokeLinecap="round" />
        {[0,1,2,3,4].map(index => <circle className="entrance-door-mote" key={index} cx={282 + index*23} cy={316-index*19} r={2.7-index*.25} style={{ animationDelay: `${-index*1.05}s` }} />)}
      </g>
      <g className="entrance-rock-fragments">
        <path d="M40 435l55-15 24 31-37 43-44-18Z" fill="#51445f" stroke="#292a43" strokeWidth="5" />
        <path d="M456 467l46-9 20 27-31 37-40-17Z" fill="#5b4962" stroke="#292a43" strokeWidth="5" />
        <path d="M63 533l27-8 12 17-20 22-23-11Z" fill="#433a58" />
      </g>
    </svg>
  );
}

export function EntranceScene({ entering, reducedMotion, onEnter }: EntranceSceneProps) {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    if (!element || reducedMotion) return;
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    const paint = () => {
      frame = 0;
      element.style.setProperty("--entrance-x", targetX.toFixed(3));
      element.style.setProperty("--entrance-y", targetY.toFixed(3));
    };
    const move = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - .5) * 2;
      targetY = (event.clientY / window.innerHeight - .5) * 2;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, [reducedMotion]);

  return (
    <div ref={scene} className={`entrance-world ${entering ? "is-entering" : ""}`}>
      <div className="entrance-nebula entrance-nebula-one entrance-depth-back" aria-hidden="true" />
      <div className="entrance-nebula entrance-nebula-two entrance-depth-mid" aria-hidden="true" />
      <SkyIllustration />
      <div className="entrance-shooting-stars" aria-hidden="true"><i /><i /><i /></div>
      <FloweringTree />
      <CloudSea />
      <CliffScene />
      <DoorwayIsland />

      <main className="entrance-copy">
        <span className="entrance-eyebrow">A LITTLE PLACE OUTSIDE OF EVERYTHING</span>
        <h1>OURVERSE</h1>
        <div className="entrance-names"><i />Janna <span>♡</span> Josh<i /></div>
        <p>somewhere between your world and mine,<br />we made our own.</p>
        <div className="entrance-invitation">
          <span className="entrance-button-flower" aria-hidden="true">✦</span>
          <button className="entrance-button" onClick={onEnter} disabled={entering}>
            Enter OurVerse <span>♡</span> <b aria-hidden="true">→</b>
          </button>
          <span className="entrance-button-sparkles" aria-hidden="true"><i>✧</i><i>·</i><i>✦</i></span>
        </div>
      </main>

      <div className="entrance-light-trail" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="entrance-vignette" aria-hidden="true" />
    </div>
  );
}
