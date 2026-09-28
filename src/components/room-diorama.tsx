"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { RoomLife } from "./room-life";
import { projectRoom, roomPoint as p, roomPolygon as polygon, roomContour as contour, roomDepth, ROOM_WIDTH, ROOM_HEIGHT, ROOM_FURNITURE_DEPTH as depth, type RoomPoint } from "./room-projection";

type Destination = { id: string; name: string; kind: string };
type Keepsake = { id: string; label: string; kind: string };
type SceneProps = { objects: readonly Destination[]; keepsakes: readonly Keepsake[]; navigate: (id: string) => void; lampOn: boolean; onToggleLamp: () => void };
const ink = "#242137";
const wood = { top: "#b79883", light: "#8c6a69", dark: "#694c58" };
const mauve = { top: "#c59caa", light: "#a37a91", dark: "#73556f" };

function Surface({ vertices, fill, outline = ink, width = 3, radius = 4, ...props }: { vertices: RoomPoint[]; fill: string; outline?: string; width?: number; radius?: number; opacity?: number }) {
  return <path d={contour(vertices, radius)} fill={fill} stroke={outline} strokeWidth={width} strokeLinejoin="round" {...props} />;
}
function Stroke({ vertices, color = "#ead4c6", width = 2, opacity = .5 }: { vertices: RoomPoint[]; color?: string; width?: number; opacity?: number }) {
  return <polyline points={polygon(...vertices)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />;
}
function Box({ x, y, w, d, z = 0, h, colors = wood, outline = ink, width = 4, radius = 4 }: { x: number; y: number; w: number; d: number; z?: number; h: number; colors?: typeof wood; outline?: string; width?: number; radius?: number }) {
  return <g>
    <Surface vertices={[[x + w,y,z],[x + w,y + d,z],[x + w,y + d,z + h],[x + w,y,z + h]]} fill={colors.light} outline={outline} width={width} radius={radius}/>
    <Surface vertices={[[x,y + d,z],[x + w,y + d,z],[x + w,y + d,z + h],[x,y + d,z + h]]} fill={colors.dark} outline={outline} width={width} radius={radius}/>
    <Surface vertices={[[x,y,z + h],[x + w,y,z + h],[x + w,y + d,z + h],[x,y + d,z + h]]} fill={colors.top} outline={outline} width={width} radius={radius}/>
  </g>;
}
function Shadow({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  return <path d={contour([[x - .1,y,0],[x + w,y,0],[x + w + .1,y + d + .1,0],[x,y + d + .15,0]], 12)} fill="#151326" opacity=".32" filter="url(#iso-contact)" pointerEvents="none"/>;
}
function Layer({ order, label, anchor, action, pressed, children }: { order: number; label?: string; anchor?: RoomPoint; action?: () => void; pressed?: boolean; children: ReactNode }) {
  const point = anchor && projectRoom(...anchor);
  return <div className={`iso-room-layer ${action ? "iso-room-discovery" : ""}`} style={{ zIndex: order }}>
    <svg viewBox={`0 0 ${ROOM_WIDTH} ${ROOM_HEIGHT}`} className="iso-room-svg" aria-hidden={action ? undefined : true}>
      {action ? <g className="iso-room-interactable" role="button" tabIndex={0} aria-label={label} aria-pressed={pressed} onClick={action} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); action(); } }}>
        {children}
        {point && <ellipse cx={point.x} cy={point.y} rx="29" ry="23" fill="transparent" stroke="none" className="iso-room-touch-target"/>}
      </g> : children}
    </svg>
    {label && point && <span className="iso-room-label" style={{ left: `${point.x / ROOM_WIDTH * 100}%`, top: `${point.y / ROOM_HEIGHT * 100}%` }}>{label}</span>}
  </div>;
}
function Lamp({ x, y, z, warm = "#f0d2a1" }: { x: number; y: number; z: number; warm?: string }) {
  const base = projectRoom(x,y,z), neck = projectRoom(x,y,z + .72), tip = projectRoom(x,y,z + 1.02);
  return <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
    <ellipse cx={base.x} cy={base.y} rx="15" ry="6" fill="#bc9690"/>
    <path d={`M${base.x},${base.y - 3} L${neck.x},${neck.y}`} stroke="#d3b492" strokeWidth="5"/>
    <path d={`M${tip.x - 8},${tip.y} Q${tip.x},${tip.y - 5} ${tip.x + 8},${tip.y} L${neck.x + 22},${neck.y + 4} Q${neck.x},${neck.y + 15} ${neck.x - 22},${neck.y + 4} Z`} fill={warm}/>
    <path d={`M${neck.x - 17},${neck.y + 5} Q${neck.x},${neck.y + 12} ${neck.x + 17},${neck.y + 5}`} fill="none" stroke="#fff0c7" strokeWidth="2"/>
  </g>;
}
function Cylinder({ x, y, z, h, radius, fill, glass = false }: { x: number; y: number; z: number; h: number; radius: number; fill: string; glass?: boolean }) {
  const bottom = projectRoom(x,y,z), top = projectRoom(x,y,z+h), rx = radius * 65, ry = radius * 30;
  return <g stroke={glass ? "#d6c8df" : ink} strokeWidth="2.5">
    <path d={`M${top.x-rx},${top.y} L${bottom.x-rx*.85},${bottom.y} Q${bottom.x},${bottom.y+ry*1.6} ${bottom.x+rx*.85},${bottom.y} L${top.x+rx},${top.y} Z`} fill={fill}/>
    <ellipse cx={top.x} cy={top.y} rx={rx} ry={ry} fill={glass ? "#ccd2e53b" : "#cfaa98"}/>
    <path d={`M${top.x-rx*.55},${top.y+6} L${bottom.x-rx*.5},${bottom.y-3}`} stroke="#f9dfd3" opacity=".4" strokeLinecap="round"/>
  </g>;
}
function FloorAndWalls({ lampOn }: { lampOn: boolean }) {
  return <Layer order={0}>
    <defs>
      <filter id="iso-contact" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="iso-light" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="19"/></filter>
      <linearGradient id="iso-left-wall" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#50445f"/><stop offset="1" stopColor="#353047"/></linearGradient>
      <linearGradient id="iso-right-wall" x1="0" x2=".7" y1="0" y2="1"><stop stopColor="#343650"/><stop offset="1" stopColor="#43405a"/></linearGradient>
      <linearGradient id="iso-floor" x2="0" y2="1"><stop stopColor="#705764"/><stop offset="1" stopColor="#584551"/></linearGradient>
      <radialGradient id="iso-amber"><stop stopColor="#f6cf97" stopOpacity=".52"/><stop offset="1" stopColor="#efba92" stopOpacity="0"/></radialGradient>
      <radialGradient id="iso-lavender"><stop stopColor="#c5d5ff" stopOpacity=".25"/><stop offset="1" stopColor="#bbcef2" stopOpacity="0"/></radialGradient>
    </defs>
    <path d={contour([[0,0,-.4],[8,0,-.4],[8,8,-.4],[0,8,-.4]],25)} fill="#080a16" opacity=".6" filter="url(#iso-light)"/>
    <Box x={0} y={0} w={8} d={8} z={-.28} h={.28} colors={{top:"url(#iso-floor)",light:"#4b3648",dark:"#32273e"}} width={6} radius={5}/>
    {Array.from({length:15},(_,i) => <Stroke key={`board-${i}`} vertices={[[0,(i+1)/2,.005],[8,(i+1)/2,.005]]} color={i%2 ? "#b08a86" : "#332b40"} opacity={i%2 ? .3 : .45} width={2}/>)}
    {Array.from({length:16},(_,i) => <g key={`joint-${i}`}>
      {[1.2,3.6,6.05].map((x,j) => <Stroke key={j} vertices={[[x+(i%2)*.65,i/2,.008],[x+(i%2)*.65,(i+1)/2,.008]]} color="#352c40" opacity={.42} width={1.8}/>)}
      {i%3===0 && <Stroke vertices={[[2.2,i/2+.25,.01],[3.15,i/2+.25,.01]]} color="#c9a28e" opacity={.15} width={1.5}/>}
    </g>)}
    <Box x={-.22} y={-.22} w={.22} d={8.22} h={4} colors={{top:"#817087",light:"url(#iso-left-wall)",dark:"#423147"}} width={6} radius={2}/>
    <Box x={0} y={-.22} w={8.22} d={.22} h={4} colors={{top:"#8a7a94",light:"#4b405a",dark:"url(#iso-right-wall)"}} width={6} radius={2}/>
    <Box x={0} y={0} w={.1} d={8} h={.2} colors={{top:"#b99b95",light:"#897384",dark:"#635064"}} width={2} radius={1}/>
    <Box x={.1} y={0} w={7.9} d={.1} h={.2} colors={{top:"#b99b95",light:"#897384",dark:"#635064"}} width={2} radius={1}/>
    <Stroke vertices={[[0,0,.2],[0,0,3.95]]} color="#24243a" opacity={.8} width={4}/>
    <Surface vertices={[[3.4,.12,.03],[6.4,.12,.03],[7.3,3.4,.03],[4.5,3.4,.03]]} fill="#b6c8f1" outline="none" opacity={.11} radius={8}/>
    <ellipse cx={projectRoom(5.7,1.7).x} cy={projectRoom(5.7,1.7).y} rx="165" ry="72" fill="url(#iso-lavender)"/>
    {lampOn && <ellipse cx={projectRoom(3.5,3.8).x} cy={projectRoom(3.5,3.8).y} rx="150" ry="75" fill="url(#iso-amber)" opacity=".5"/>}
    <ellipse cx={projectRoom(6.9,1.3).x} cy={projectRoom(6.9,1.3).y} rx="95" ry="48" fill="url(#iso-amber)" opacity=".35"/>
  </Layer>;
}
function IsoWindow() {
  const wall = (x:number,z:number) => p(x,.015,z);
  return <g>
    <Surface vertices={[[3.22,.02,1.63],[6.38,.02,1.63],[6.38,.02,3.76],[3.22,.02,3.76]]} fill="#242139" outline="#211e34" width={8}/>
    <Surface vertices={[[3.38,.065,1.78],[6.22,.065,1.78],[6.22,.065,3.61],[3.38,.065,3.61]]} fill="#1b2949" outline="#aa9ab8" width={6}/>
    <path d={`M${wall(3.4,2.05)} L${wall(3.8,2.52)} L${wall(4.5,2.07)} L${wall(5.3,2.48)} L${wall(6.2,2.02)} L${wall(6.2,1.8)} L${wall(3.4,1.8)}Z`} fill="#4c557b"/>
    <path d={`M${wall(3.4,1.97)} Q${wall(4.3,2.21)} ${wall(4.9,1.98)} T${wall(6.2,2.04)} L${wall(6.2,1.8)} L${wall(3.4,1.8)}Z`} fill="#353e64"/>
    <path d={`M${wall(5.37,3.35)} C${wall(4.72,3.51)} ${wall(4.7,2.83)} ${wall(5.32,2.91)} Q${wall(4.99,3.15)} ${wall(5.37,3.35)}Z`} fill="#f5e6c6"/>
    {[ [3.78,3.28], [4.4,2.79], [5.9,3.4], [5.77,2.61] ].map(([x,z],i) => <path key={i} d={`M${wall(x,z+.06)} L${wall(x+.06,z)} L${wall(x,z-.06)} L${wall(x-.06,z)}Z`} fill="#e4d9ed"/>)}
    <Stroke vertices={[[4.8,.09,1.78],[4.8,.09,3.61]]} color="#c3b3ca" opacity={1} width={5}/>
    <Stroke vertices={[[3.38,.09,2.66],[6.22,.09,2.66]]} color="#c3b3ca" opacity={1} width={5}/>
    <path d={`M${p(3.13,.15,3.82)} Q${p(3.58,.21,2.85)} ${p(3.17,.23,1.53)} L${p(3.65,.28,1.73)} Q${p(3.88,.27,2.73)} ${p(3.53,.21,3.75)}Z`} fill="#96718c" stroke={ink} strokeWidth="4"/>
    <path d={`M${p(6.08,.18,3.72)} Q${p(5.83,.23,2.74)} ${p(6.07,.25,1.64)} L${p(6.48,.2,1.55)} Q${p(6.19,.18,2.66)} ${p(6.51,.14,3.87)}Z`} fill="#795b7d" stroke={ink} strokeWidth="4"/>
    <Stroke vertices={[[3.32,.3,3.57],[3.42,.3,2.94],[3.28,.3,2.18]]} color="#caa2b4" opacity={.55}/>
    <Box x={3.13} y={0} w={3.45} d={.36} z={1.54} h={.12} colors={{top:"#d4babc",light:"#aa8eaa",dark:"#745c7b"}} width={3}/>
  </g>;
}
function IsoShelf() {
  return <g>
    <Shadow x={.15} y={.25} w={1} d={1.9}/>
    <Box x={.15} y={.25} w={.95} d={1.9} h={2.65} colors={{top:"#ae8c80",light:"#4c384b",dark:"#745565"}} width={5}/>
    <Surface vertices={[[1.11,.37,.12],[1.11,2.03,.12],[1.11,2.03,2.52],[1.11,.37,2.52]]} fill="#342d42" width={3}/>
    {[.16,.95,1.74,2.55].map((z,i) => <Box key={i} x={.55} y={.27} w={.63} d={1.87} z={z} h={.09} width={2.5} colors={{top:"#c69d85",light:"#95716d",dark:"#6c4d5c"}} radius={2}/>)}
    {[.26,2.01].map(y => <Box key={y} x={.52} y={y} w={.65} d={.13} h={2.65} width={2.5}/>)}
    {[.3,.52,.76,1.12,1.4,1.68].map((y,i) => <g key={y}>
      <Box x={.86} y={y+.09} w={.24} d={.19} z={1.84} h={.47+(i%3)*.09} colors={{top:["#bea0b8","#b8bda2","#d1b49b"][i%3],light:["#9b748f","#899779","#ac8278"][i%3],dark:"#64516e"}} width={1.7} radius={2}/>
      <Stroke vertices={[[1.115,y+.12,2.0],[1.115,y+.24,2.0]]} width={1.2} opacity={.7}/>
    </g>)}
    {[.43,.72,1.02].map((y,i) => <Box key={y} x={.84} y={y} w={.26} d={.21} z={.25} h={.53-i*.06} colors={{top:"#ab97b3",light:"#8b7797",dark:"#66516e"}} width={1.8} radius={2}/>)}
    <Box x={.77} y={1.45} w={.32} d={.48} z={.25} h={.11} colors={mauve} width={1.5}/>
    <Box x={.77} y={1.41} w={.32} d={.47} z={.36} h={.12} colors={wood} width={1.5}/>
  </g>;
}
function IsoBed() {
  return <g>
    <Shadow x={.6} y={2.7} w={2.45} d={3.45}/>
    {[.82,2.72].flatMap(x => [2.94,5.78].map(y => <Box key={`${x}-${y}`} x={x} y={y} w={.19} d={.2} h={.28} width={2.5} colors={{top:"#9a7e80",light:"#775260",dark:"#4f394e"}}/>))}
    <Box x={.61} y={2.68} w={2.5} d={.23} z={.17} h={1.51} colors={{top:"#be9f96",light:"#977484",dark:"#70536b"}} width={5} radius={6}/>
    <Stroke vertices={[[.82,2.925,1.37],[1.78,2.925,1.48],[2.88,2.925,1.36]]} color="#ddc1b9" opacity={.7} width={3}/>
    <Box x={.6} y={2.8} w={2.45} d={3.2} z={.23} h={.38} width={4.5} colors={{top:"#bc9693",light:"#89647a",dark:"#60475d"}} radius={6}/>
    <Box x={.69} y={2.87} w={2.25} d={3.04} z={.61} h={.25} width={3.5} colors={{top:"#e5d1ce",light:"#c4a7b7",dark:"#aa8da5"}} radius={10}/>
    {[.92,1.96].map((x,i) => <g key={x}>
      <path d={`M${p(x,2.97,.93)} Q${p(x+.41,2.82,1.04)} ${p(x+.79,2.99,.94)} Q${p(x+.94,3.28,.94)} ${p(x+.79,3.55,.92)} Q${p(x+.36,3.72,.99)} ${p(x-.04,3.51,.92)} Q${p(x-.14,3.23,.97)} ${p(x,2.97,.93)}Z`} fill={i ? "#ead9d2" : "#f5e5d5"} stroke="#8f738c" strokeWidth="2.5"/>
      <Stroke vertices={[[x+.12,3.49,.98],[x+.63,3.51,.98]]} color="#fff1e1" width={2}/>
    </g>)}
    <BedBlanket/>
  </g>;
}
function BedBlanket() {
  return <g>
    <path d={`M${p(.71,3.66,.93)} Q${p(1.17,3.5,1.03)} ${p(1.73,3.69,.95)} Q${p(2.27,3.84,1.02)} ${p(2.96,3.59,.93)} L${p(3.0,5.84,.91)} Q${p(2.17,6.16,.79)} ${p(.64,5.91,.85)} L${p(.64,3.87,.72)}Z`} fill="#aa8daa" stroke={ink} strokeWidth="3.5"/>
    <path d={`M${p(.64,5.91,.85)} Q${p(1.6,6.08,.8)} ${p(3,5.84,.91)} L${p(3,6.03,.45)} Q${p(1.7,6.12,.33)} ${p(.64,6.03,.43)}Z`} fill="#816383" stroke={ink} strokeWidth="3"/>
    <path d={`M${p(.72,4.2,.96)} Q${p(1.56,4.34,1.05)} ${p(2.91,4.15,.97)} M${p(.73,5.37,.94)} Q${p(1.57,5.19,1.02)} ${p(2.95,5.37,.95)}`} fill="none" stroke="#d8b6c7" strokeWidth="3" strokeLinecap="round" opacity=".6"/>
    <path d={`M${p(1.45,3.9,.99)} Q${p(1.7,4.36,1.02)} ${p(1.54,4.82,.96)}`} fill="none" stroke="#735774" strokeWidth="2.5" opacity=".6"/>
    <Surface vertices={[[2.65,4.7,1],[2.83,4.7,1],[2.83,5.14,1],[2.65,5.14,1]]} fill="#d1b1b5" outline="none" radius={2}/>
  </g>;
}
function IsoCouch({ frontOnly = false }: { frontOnly?: boolean }) {
  if(frontOnly) return <g>
    <Box x={4.55} y={4.93} w={2.29} d={.12} z={.23} h={.35} colors={{top:"#b38b9b",light:"#9c738b",dark:"#775570"}} width={3} radius={4}/>
    <Box x={4.38} y={4.56} w={.26} d={.46} z={.43} h={.5} colors={mauve} width={3} radius={8}/>
  </g>;
  return <g>
    <Shadow x={4.35} y={3.78} w={2.68} d={1.3}/>
    {[4.58,6.65].flatMap(x => [3.96,4.84].map(y => <Box key={`${x}-${y}`} x={x} y={y} w={.15} d={.16} h={.24} width={2.5}/>))}
    <Box x={4.4} y={3.8} w={2.6} d={1.2} z={.2} h={.38} colors={mauve} width={5} radius={8}/>
    <Box x={4.43} y={3.78} w={2.53} d={.26} z={.42} h={1.0} colors={{top:"#c7a5b6",light:"#a47f99",dark:"#81637f"}} width={5} radius={9}/>
    {[4.66,5.73].map((x,i) => <g key={x}>
      <Box x={x} y={4.04} w={1.03} d={.87} z={.51} h={.21} colors={{top:i?"#cfabb8":"#dbb7bf",light:"#af8b9e",dark:"#9c778f"}} width={2.5} radius={8}/>
      <Stroke vertices={[[x+.1,4.83,.74],[x+.85,4.83,.74]]} color="#f1d4d3" opacity={.6}/>
    </g>)}
    <Box x={4.38} y={3.87} w={.28} d={1.14} z={.42} h={.64} colors={mauve} width={4} radius={8}/>
    <Box x={6.78} y={3.87} w={.28} d={1.14} z={.42} h={.64} colors={mauve} width={4} radius={8}/>
    <path d={`M${p(6.06,4.03,.89)} Q${p(6.31,3.98,1.3)} ${p(6.68,4.06,1.25)} L${p(6.68,4.32,.83)} Q${p(6.37,4.42,.82)} ${p(6.06,4.03,.89)}Z`} fill="#847294" stroke={ink} strokeWidth="2.5"/>
    <Stroke vertices={[[6.27,4.1,1.13],[6.41,4.17,1.14]]} color="#d1bacf" opacity={.65}/>
  </g>;
}
function IsoDesk() {
  return <g>
    <Shadow x={4.0} y={.43} w={3.48} d={1.48}/>
    {[4.18,7.15].flatMap(x => [.62,1.57].map(y => <Box key={`${x}-${y}`} x={x} y={y} w={.15} d={.16} h={1.33} width={3}/>))}
    <Box x={4.08} y={.57} w={.9} d={1.14} z={.35} h={.9} colors={{top:"#aa8777",light:"#8b6567",dark:"#6b4d5d"}} width={3.5}/>
    {[.55,.95].map(z => <g key={z}><Surface vertices={[[4.12,1.715,z],[4.94,1.715,z],[4.94,1.715,z+.32],[4.12,1.715,z+.32]]} fill="#8d6771" width={2}/><Stroke vertices={[[4.45,1.73,z+.15],[4.64,1.73,z+.15]]} color="#e1c3a0" opacity={.9} width={3}/></g>)}
    <Box x={4.0} y={.45} w={3.42} d={1.4} z={1.24} h={.16} width={4.5} radius={6}/>
    <Stroke vertices={[[4.18,.56,1.415],[6.95,.56,1.415]]} color="#e6c4a5" opacity={.45}/>
    <path d={`M${p(6.85,1.84,1.18)} Q${p(7.06,2.15,.25)} ${p(7.3,1.95,.03)} Q${p(7.63,1.72,.015)} ${p(7.3,1.63,.015)}`} fill="none" stroke="#35283f" strokeWidth="2.5"/>
  </g>;
}
function IsoChair({ frontOnly = false }: { frontOnly?: boolean }) {
  if(frontOnly) return <Box x={5.38} y={2.99} w={.96} d={.12} z={.51} h={.15} colors={mauve} width={2.5} radius={5}/>;
  return <g>
    <Shadow x={5.35} y={2.3} w={1.05} d={.85}/>
    {[5.48,6.2].flatMap(x => [2.45,2.98].map(y => <Box key={`${x}-${y}`} x={x} y={y} w={.1} d={.12} h={.55} width={2.5} colors={{top:"#a391a7",light:"#77657f",dark:"#514257"}}/>))}
    <Box x={5.35} y={2.23} w={1.02} d={.16} z={.6} h={.94} colors={{top:"#bc9cb6",light:"#8e7395",dark:"#715c7d"}} width={4} radius={8}/>
    <Box x={5.34} y={2.3} w={1.03} d={.8} z={.52} h={.15} colors={mauve} width={3} radius={7}/>
    <path d={`M${p(5.55,2.41,1.18)} Q${p(5.85,2.49,1.75)} ${p(6.16,2.4,1.18)}`} fill="none" stroke="#d5b4c9" strokeWidth="5"/>
    <Stroke vertices={[[5.54,2.42,1.2],[5.54,2.42,.94]]} color="#b89ebc" width={7} opacity={1}/>
    <Stroke vertices={[[6.15,2.42,1.2],[6.15,2.42,.94]]} color="#b89ebc" width={7} opacity={1}/>
  </g>;
}
function IsoPlant() {
  const root = projectRoom(7.25,2.55,.72);
  return <g className="iso-room-plant">
    <Shadow x={6.95} y={2.28} w={.63} d={.62}/>
    <Cylinder x={7.25} y={2.55} z={.05} h={.65} radius={.38} fill="#ac7c88"/>
    <ellipse cx={root.x} cy={root.y} rx="24" ry="9" fill="#4e3e4a" stroke={ink} strokeWidth="3"/>
    <path d={`M${root.x},${root.y} Q${root.x-37},${root.y-12} ${root.x-39},${root.y-52} Q${root.x-7},${root.y-59} ${root.x},${root.y-4} M${root.x+4},${root.y} Q${root.x+28},${root.y-63} ${root.x+52},${root.y-42} Q${root.x+49},${root.y-3} ${root.x+4},${root.y} M${root.x},${root.y-4} Q${root.x-15},${root.y-73} ${root.x+17},${root.y-82} Q${root.x+40},${root.y-42} ${root.x},${root.y-4}`} fill="#738b83" stroke={ink} strokeWidth="3.5" strokeLinejoin="round"/>
    <path d={`M${root.x},${root.y} Q${root.x-46},${root.y+4} ${root.x-51},${root.y-24} Q${root.x-17},${root.y-37} ${root.x},${root.y} M${root.x+4},${root.y+2} Q${root.x+17},${root.y-35} ${root.x+43},${root.y-17} Q${root.x+39},${root.y+11} ${root.x+4},${root.y+2}`} fill="#9cae91" stroke={ink} strokeWidth="3"/>
    <path d={`M${root.x-25},${root.y-41} L${root.x-3},${root.y-8} M${root.x+17},${root.y-62} L${root.x+4},${root.y-14} M${root.x+33},${root.y-34} L${root.x+8},${root.y-9}`} stroke="#cad0a5" fill="none" strokeWidth="2" opacity=".6"/>
  </g>;
}

export function RoomDiorama({ objects, keepsakes, navigate, lampOn, onToggleLamp }: SceneProps) {
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 700px)");
    const center = () => {
      const element = viewport.current;
      if (element && mobile.matches) element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    };
    const frame = requestAnimationFrame(center);
    mobile.addEventListener("change", center);
    return () => { cancelAnimationFrame(frame); mobile.removeEventListener("change", center); };
  }, []);
  const destination = (kind: string) => { const item = objects.find(object => object.kind === kind); return {label: item?.name, action: item ? () => navigate(item.id) : undefined}; };
  const keepsake = (kind: string) => { const item = keepsakes.find(object => object.kind === kind); return {label: item?.label, action: item ? () => navigate(item.id) : undefined}; };
  return <div className="room-viewport" ref={viewport}>
    <div className={`cozy-room iso-room ${lampOn ? "iso-lamp-on" : "iso-lamp-off"}`}>
      <FloorAndWalls lampOn={lampOn}/>
      <Layer order={8} anchor={[4.8,.2,2.7]} {...destination("window")}><IsoWindow/></Layer>
      <Layer order={9} anchor={[.1,3.25,3.05]} {...destination("frame")}>
        <Box x={0} y={2.62} w={.12} d={1.25} z={2.46} h={1.23} colors={{top:"#e2c0a3",light:"#c1a08f",dark:"#937185"}} width={4}/>
        <Surface vertices={[[.14,2.73,2.57],[.14,3.76,2.57],[.14,3.76,3.57],[.14,2.73,3.57]]} fill="#39435f" outline="#e1c4ac" width={3}/>
        <path d={`M${p(.16,3.17,3.16)} C${p(.16,2.85,3.4)} ${p(.16,2.91,2.96)} ${p(.16,3.2,2.87)} C${p(.16,3.49,3.03)} ${p(.16,3.49,3.4)} ${p(.16,3.17,3.16)}Z`} fill="#d59cad"/>
        <Stroke vertices={[[.16,2.87,2.76],[.16,3.61,2.76]]} color="#b4accc" opacity={.6}/>
      </Layer>
      <Layer order={10} anchor={[7.42,.1,2.86]} {...destination("calendar")}>
        <Box x={6.94} y={0} w={.93} d={.07} z={2.3} h={1.12} colors={{top:"#f3e3d3",light:"#b79daa",dark:"#f0dfd1"}} width={3}/>
        <Surface vertices={[[7,.09,3.08],[7.82,.09,3.08],[7.82,.09,3.33],[7,.09,3.33]]} fill="#b8839c" width={1.5}/>
        <text transform={`translate(${p(7.42,.11,2.67)}) matrix(1 .5 0 1 0 0)`} textAnchor="middle" fontSize="25" fill="#69536d" fontFamily="Georgia,serif">21</text>
        {[7.13,7.4,7.66].map(x => <Stroke key={x} vertices={[[x,.11,2.45],[x+.12,.11,2.45]]} color="#ad8d9d" width={2} opacity={.8}/>)}
      </Layer>
      <Layer order={11} anchor={[.1,6.5,1.92]} {...destination("mailbox")}>
        <Box x={0} y={5.93} w={.23} d={1.05} z={1.38} h={.76} colors={{top:"#c994a5",light:"#9b718f",dark:"#76566e"}} width={4}/>
        <Surface vertices={[[.25,6.08,1.65],[.25,6.85,1.65],[.25,6.85,2],[.25,6.08,2]]} fill="#eee0d4" width={2}/>
        <Stroke vertices={[[.27,6.08,2],[.27,6.48,1.73],[.27,6.85,2]]} color="#ae859b" opacity={1}/>
      </Layer>
      <Layer order={depth.shelf} anchor={[1.1,1.24,1.47]} {...destination("books")}><IsoShelf/></Layer>
      <Layer order={depth.shelf+5} anchor={[1.1,1.48,1.14]} {...keepsake("notebook")}>
        <Box x={.78} y={1.18} w={.38} d={.76} z={1.06} h={.13} colors={{top:"#ad93b8",light:"#ead9d6",dark:"#736080"}} width={2.5}/>
        <Stroke vertices={[[.85,1.29,1.205],[1.1,1.29,1.205]]} color="#f0d7d2" width={3} opacity={.8}/>
        <Surface vertices={[[.99,1.47,1.21],[1.1,1.47,1.21],[1.1,1.88,1.21],[.99,1.88,1.21]]} fill="#d49aae" outline="none" radius={1}/>
      </Layer>
      <Layer order={1}>
        <Surface vertices={[[3.35,3.6,.015],[7.53,3.6,.015],[7.53,7.3,.015],[3.35,7.3,.015]]} fill="#78647e" outline="#3f344e" width={6} radius={16}/>
        <Surface vertices={[[3.53,3.78,.02],[7.34,3.78,.02],[7.34,7.11,.02],[3.53,7.11,.02]]} fill="#85728c" outline="#c8abbc" width={2} radius={13}/>
        <Stroke vertices={[[3.68,6.89,.025],[7.15,6.89,.025]]} color="#d7b4c5" width={2} opacity={.4}/>
        {[3.5,4,4.5,5,5.5,6,6.5,7,7.35].map(x => <Stroke key={x} vertices={[[x,7.3,.015],[x+.03,7.43,.015]]} color="#bca0b7" opacity={.75} width={2}/>)}
      </Layer>
      <Layer order={depth.bed} anchor={[1.8,4.4,.75]} {...destination("bed")}><IsoBed/></Layer>
      <Layer order={depth.bed+4}><BedBlanket/></Layer>
      <Layer order={depth.bed+5} anchor={[2.37,3.94,.99]} {...keepsake("phone")}>
        <Box x={2.12} y={3.63} w={.4} d={.75} z={.98} h={.07} colors={{top:"#3e3453",light:"#8b7998",dark:"#61506c"}} width={2.5}/>
        <Surface vertices={[[2.17,3.75,1.06],[2.46,3.75,1.06],[2.46,4.21,1.06],[2.17,4.21,1.06]]} fill="#d1c4de" outline="none" radius={2}/>
        <Surface vertices={[[2.2,3.84,1.07],[2.4,3.84,1.07],[2.4,3.96,1.07],[2.2,3.96,1.07]]} fill="#f6e9df" outline="none" radius={2}/>
        <Surface vertices={[[2.25,4.04,1.07],[2.43,4.04,1.07],[2.43,4.15,1.07],[2.25,4.15,1.07]]} fill="#c89dad" outline="none" radius={2}/>
      </Layer>
      <Layer order={depth.nightstand}>
        <Shadow x={3.1} y={2.5} w={1.13} d={1.02}/>
        <Box x={3.17} y={2.53} w={1.03} d={.94} z={.06} h={.91} width={4}/>
        <Box x={3.08} y={2.46} w={1.18} d={1.07} z={.97} h={.13} width={3.5}/>
        <Surface vertices={[[3.3,3.48,.35],[4.05,3.48,.35],[4.05,3.48,.79],[3.3,3.48,.79]]} fill="#805f6c" width={2}/>
        <Stroke vertices={[[3.58,3.51,.57],[3.8,3.51,.57]]} color="#dfbea0" opacity={.9} width={3}/>
      </Layer>
      <Layer order={depth.nightstand+5} anchor={[3.92,2.9,1.85]} label="Turn the lamp on or off" action={onToggleLamp} pressed={lampOn}>
        {lampOn && <ellipse cx={projectRoom(3.92,2.9,1.7).x} cy={projectRoom(3.92,2.9,1.7).y} rx="75" ry="85" fill="url(#iso-amber)" pointerEvents="none"/>}
        <Lamp x={3.92} y={2.9} z={1.12} warm={lampOn ? "#f2d6aa" : "#a491a2"}/>
      </Layer>
      <Layer order={depth.nightstand+6} anchor={[3.35,3.22,1.39]} {...keepsake("jar")}>
        <Cylinder x={3.35} y={3.22} z={1.12} h={.43} radius={.19} fill="#c5bed75c" glass/>
        <Box x={3.19} y={3.05} w={.31} d={.32} z={1.54} h={.06} colors={mauve} width={1.5} radius={3}/>
        <path d={`M${p(3.35,3.42,1.36)} q-6,-5 -7,1 q0,4 7,7 q8,-5 7,-9 q-1,-5 -7,1Z`} fill="#edbacb" stroke="none"/>
      </Layer>
      <Layer order={depth.desk}><IsoDesk/></Layer>
      <Layer order={depth.desk+4} anchor={[5.92,1.02,1.94]} {...destination("laptop")}>
        <Box x={5.36} y={.84} w={1.22} d={.76} z={1.42} h={.045} colors={{top:"#b4a8c2",light:"#91859c",dark:"#695e79"}} width={2.5}/>
        <Box x={5.38} y={.8} w={1.19} d={.065} z={1.45} h={.85} colors={{top:"#bdb0cc",light:"#a191b4",dark:"#3e3654"}} width={3}/>
        <Surface vertices={[[5.46,.877,1.57],[6.47,.877,1.57],[6.47,.877,2.19],[5.46,.877,2.19]]} fill="#8fa5c3" outline="#c8c0d7" width={2}/>
        <Stroke vertices={[[5.6,.892,2.02],[6.27,.892,2.02]]} color="#d4dfea" opacity={.9}/>
        <Stroke vertices={[[5.6,.892,1.89],[6.1,.892,1.89]]} color="#e8c6da" opacity={.9}/>
        <Stroke vertices={[[5.54,1.22,1.48],[6.35,1.22,1.48]]} color="#655974" opacity={.65} width={2}/>
      </Layer>
      <Layer order={depth.desk+5} anchor={[4.68,1.2,1.43]} {...keepsake("tickets")}>
        <Box x={4.29} y={1.02} w={.67} d={.4} z={1.42} h={.025} colors={{top:"#c5a0b9",light:"#b691a4",dark:"#997387"}} width={1.7}/>
        <Box x={4.43} y={1.23} w={.73} d={.39} z={1.455} h={.025} colors={{top:"#efe0ce",light:"#dcc8bd",dark:"#c2aaa9"}} width={1.7}/>
        <Stroke vertices={[[4.55,1.3,1.49],[4.99,1.3,1.49]]} color="#aa859d" opacity={.8} width={1.8}/>
        <Stroke vertices={[[4.55,1.41,1.49],[4.85,1.41,1.49]]} color="#aa859d" opacity={.8} width={1.8}/>
      </Layer>
      <Layer order={depth.desk+6} anchor={[6.99,1.3,1.56]} {...destination("console")}>
        <Box x={6.57} y={1.22} w={.64} d={.4} z={1.42} h={.16} colors={{top:"#b2a8c4",light:"#877896",dark:"#60546d"}} width={2.5} radius={5}/>
        <Stroke vertices={[[6.72,1.36,1.59],[6.72,1.52,1.59]]} color="#3d324e" opacity={1} width={3}/>
        <Stroke vertices={[[6.65,1.44,1.59],[6.8,1.44,1.59]]} color="#3d324e" opacity={1} width={3}/>
        {[6.98,7.1].map(x => <ellipse key={x} cx={projectRoom(x,1.39,1.6).x} cy={projectRoom(x,1.39,1.6).y} rx="2" ry="1.5" fill="#ead09e"/>)}
      </Layer>
      <Layer order={depth.desk+7} anchor={[6.88,.65,1.62]} {...destination("radio")}>
        <Box x={6.65} y={.56} w={.65} d={.35} z={1.42} h={.38} colors={{top:"#927c9b",light:"#6f5b80",dark:"#42364f"}} width={2.5}/>
        <Surface vertices={[[6.74,.925,1.55],[7.01,.925,1.55],[7.01,.925,1.72],[6.74,.925,1.72]]} fill="#dabca9" width={1}/>
        <ellipse cx={projectRoom(7.17,.94,1.61).x} cy={projectRoom(7.17,.94,1.61).y} rx="4" ry="5" fill="#e3c294" stroke={ink} strokeWidth="1.5"/>
      </Layer>
      <Layer order={depth.desk+8}><Lamp x={4.34} y={.69} z={1.42} warm="#e1b7b0"/></Layer>
      <Layer order={depth.chair}><IsoChair/></Layer>
      <Layer order={depth.chair+4}><IsoChair frontOnly/></Layer>
      <Layer order={depth.plant} anchor={[7.25,2.55,.95]} {...destination("plant")}><IsoPlant/></Layer>
      <Layer order={depth.couch}><IsoCouch/></Layer>
      <Layer order={depth.couch+4}><IsoCouch frontOnly/></Layer>
      <Layer order={depth.coffee}>
        <Shadow x={3.96} y={5.26} w={1.49} d={.81}/>
        {[4.07,5.21].flatMap(x => [5.35,5.85].map(y => <Box key={`${x}-${y}`} x={x} y={y} w={.12} d={.12} h={.57} width={2.5}/>))}
        <Box x={3.91} y={5.2} w={1.65} d={.86} z={.56} h={.13} width={3.5} radius={11}/>
        <Cylinder x={4.69} y={5.66} z={.7} h={.26} radius={.14} fill="#e1c7b8"/>
        <path d={`M${p(4.8,5.61,.9)} q12,1 6,10 q-4,3 -7,-1`} fill="none" stroke="#d8baac" strokeWidth="3"/>
        <Box x={4.04} y={5.35} w={.48} d={.43} z={.705} h={.08} colors={{top:"#a58ca7",light:"#e5cec3",dark:"#725c7e"}} width={1.7}/>
      </Layer>
      <Layer order={depth.parcel} anchor={[5.15,6.61,.45]} {...keepsake("parcel")}>
        <Shadow x={4.68} y={6.18} w={.93} d={.86}/>
        <Box x={4.7} y={6.17} w={.87} d={.86} z={.02} h={.68} colors={{top:"#c7a38e",light:"#b1897c",dark:"#8d6771"}} width={3.5} radius={5}/>
        <Surface vertices={[[5.05,6.17,.71],[5.23,6.17,.71],[5.23,7.03,.71],[5.05,7.03,.71]]} fill="#e3bd98" outline="none" radius={1}/>
        <Surface vertices={[[5.05,7.045,.71],[5.23,7.045,.71],[5.23,7.045,.08],[5.05,7.045,.08]]} fill="#d0a789" outline="none" radius={1}/>
        <Surface vertices={[[5.585,6.38,.25],[5.585,6.8,.25],[5.585,6.8,.48],[5.585,6.38,.48]]} fill="#f1dfcf" width={1}/>
      </Layer>
      <Layer order={roomDepth(2.95,6.67)}>
        {[2.79,3.16].map(x => <path key={x} d={contour([[x,6.34,.04],[x+.22,6.34,.06],[x+.24,6.87,.04],[x-.02,6.91,.04]],7)} fill="#aa7f98" stroke={ink} strokeWidth="2.5"/>)}
      </Layer>
      <RoomLife/>
    </div>
  </div>;
}
