export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(date));
}
export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
export function relationshipAge(start: string, now: Date) {
  const beginning = new Date(start);
  if (now < beginning) return [0, 0, 0, 0];
  let months =
    (now.getUTCFullYear() - beginning.getUTCFullYear()) * 12 +
    now.getUTCMonth() -
    beginning.getUTCMonth();
  const anchor = new Date(beginning);
  anchor.setUTCMonth(beginning.getUTCMonth() + months);
  if (anchor > now) {
    months--;
    anchor.setUTCMonth(beginning.getUTCMonth() + months);
  }
  const remaining = now.getTime() - anchor.getTime();
  return [
    Math.floor(months / 12),
    months % 12,
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
  ];
}
