export const DEMO_NOW = new Date("2026-10-01T09:30:00Z");

export function formatDemoTime(dateStrOrObj: string | Date): string {
  const d = typeof dateStrOrObj === "string" ? new Date(dateStrOrObj) : dateStrOrObj;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatDemoDate(dateStrOrObj: string | Date): string {
  const d = typeof dateStrOrObj === "string" ? new Date(dateStrOrObj) : dateStrOrObj;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
