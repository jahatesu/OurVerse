// One orthographic projection for architecture, furniture, props and inhabitants.
// X travels down-right, Y down-left, and Z remains vertical. Parallel stays parallel.
export type RoomPoint = readonly [x: number, y: number, z?: number];
export const ROOM_WIDTH = 1000;
export const ROOM_HEIGHT = 740;
export const ROOM_AXES = { originX: 500, originY: 260, x: 50, y: 25, vertical: 52 } as const;

export function projectRoom(x: number, y: number, z = 0) {
  return { x: ROOM_AXES.originX + (x - y) * ROOM_AXES.x, y: ROOM_AXES.originY + (x + y) * ROOM_AXES.y - z * ROOM_AXES.vertical };
}
export const roomPoint = (x: number, y: number, z = 0) => {
  const point = projectRoom(x, y, z);
  return `${point.x},${point.y}`;
};
export const roomPolygon = (...vertices: RoomPoint[]) => vertices.map(([x, y, z = 0]) => roomPoint(x, y, z)).join(" ");
export const roomDepth = (x: number, y: number) => Math.round((x + y) * 100);

// Rounded projected corners keep the common axes without the sharp icon-like finish.
export function roomContour(vertices: RoomPoint[], radius = 4) {
  const points = vertices.map(([x, y, z = 0]) => projectRoom(x, y, z));
  const corners = points.map((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const before = Math.min(radius, Math.hypot(point.x - previous.x, point.y - previous.y) / 3);
    const after = Math.min(radius, Math.hypot(next.x - point.x, next.y - point.y) / 3);
    const toward = (other: typeof point, length: number) => {
      const distance = Math.hypot(other.x - point.x, other.y - point.y);
      return { x: point.x + (other.x - point.x) * length / distance, y: point.y + (other.y - point.y) * length / distance };
    };
    return { point, before: toward(previous, before), after: toward(next, after) };
  });
  return corners.map(({ point, before, after }, index) => `${index ? "L" : "M"}${before.x},${before.y} Q${point.x},${point.y} ${after.x},${after.y}`).join(" ") + " Z";
}

export const ROOM_FURNITURE_DEPTH = {
  shelf: roomDepth(.7, 1.25),
  bed: roomDepth(1.85, 4.4),
  nightstand: roomDepth(3.675, 3),
  desk: roomDepth(5.7, 1.15),
  chair: roomDepth(5.85, 2.7),
  plant: roomDepth(7.25, 2.55),
  couch: roomDepth(5.7, 4.4),
  coffee: roomDepth(4.7, 5.6),
  parcel: roomDepth(5.1, 6.6),
} as const;
