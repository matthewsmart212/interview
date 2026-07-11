export function createId(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function initialsFrom(company: string, role: string): string {
  const source = (company || role || "?").trim();
  return source.charAt(0).toUpperCase() || "?";
}

const ACCENTS = ["#2e6ce6", "#8c2f3f", "#1f1f24", "#0f766e", "#7c3aed", "#b45309"];

export function accentFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * 17) % ACCENTS.length;
  return ACCENTS[hash] ?? ACCENTS[0];
}

export function formatDisplayDate(d = new Date()): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDisplayTime(d = new Date()): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function dateChipFrom(dateStr: string): { d: string; m: string } {
  const parsed = Date.parse(dateStr);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    return {
      d: String(d.getDate()).padStart(2, "0"),
      m: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
    };
  }
  // "24 May 2026" style
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    return {
      d: parts[0].padStart(2, "0"),
      m: parts[1].slice(0, 3).toUpperCase(),
    };
  }
  return { d: "—", m: "—" };
}

export function daysAwayFrom(dateStr: string, now = new Date()): number {
  const parsed = Date.parse(dateStr);
  if (!Number.isNaN(parsed)) {
    const target = new Date(parsed);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }
  // Fallback parse "24 May 2026"
  const m = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return 0;
  const months: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };
  const month = months[m[2].toLowerCase()];
  if (month == null) return 0;
  const target = new Date(Number(m[3]), month, Number(m[1]));
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function extractJdHighlights(jd: string, max = 4): string[] {
  const lines = jd
    .split(/\n|•|-/)
    .map((l) => l.trim())
    .filter((l) => l.length > 24 && l.length < 120);
  const unique = [...new Set(lines)];
  return unique.slice(0, max);
}
