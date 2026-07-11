/**
 * Calendar heatmap layout — pure date/grid geometry only (no color logic; the
 * component reuses `createLinearColorScale` from `core/heatmap.ts` at render
 * time). No DOM, no React. Runs unchanged on web and React Native, the same
 * way `core/treemap.ts` / `core/sunburst.ts` / `core/gauge.ts` replace
 * DOM-bound D3 modules.
 *
 * All date math is done via `Date.UTC(y, m, d)` and `getUTC*` accessors —
 * never local-time getters (`getDay`/`getMonth`/`getFullYear`) — so results
 * are identical regardless of the runtime's local timezone.
 */

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_WEEK = MS_DAY * 7;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface CalendarCell {
  date: string;
  value: number | null;
  x: number;
  y: number;
  week: number;
  weekday: number;
}

export interface CalendarLayoutOptions {
  startDate: string | Date;
  endDate: string | Date;
  cellSize: number;
  gap?: number;
  weekStart?: 0 | 1;
}

export interface CalendarLayoutResult {
  cells: CalendarCell[];
  monthLabels: { label: string; x: number }[];
  weeks: number;
  totalWidth: number;
  totalHeight: number;
}

/** Normalize a string/Date input to a UTC-midnight timestamp for that calendar day. */
function toUTCDayTs(input: string | Date): number {
  const d = typeof input === 'string' ? new Date(input) : input;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Format a UTC-midnight timestamp as an `YYYY-MM-DD` ISO date string. */
function formatISODate(ts: number): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Compute a GitHub-contribution-graph-style calendar grid: one cell per
 * calendar day in `[startDate, endDate]` (inclusive), regardless of data
 * coverage — days without a matching data point get `value: null`. Columns
 * are weeks, rows are weekdays (`weekStart` chooses Sunday- or Monday-first).
 * `data` entries outside `[startDate, endDate]` are clipped (ignored), not
 * an error.
 */
export function calendarHeatmapLayout(
  data: { date: string | Date; value: number }[],
  opts: CalendarLayoutOptions,
): CalendarLayoutResult {
  const gap = opts.gap ?? 3;
  const cellSize = opts.cellSize;
  const weekStart: 0 | 1 = opts.weekStart ?? 0;

  const aTs = toUTCDayTs(opts.startDate);
  const bTs = toUTCDayTs(opts.endDate);
  const lo = Math.min(aTs, bTs);
  const hi = Math.max(aTs, bTs);

  // Value lookup, keyed by ISO date string. Points outside [lo, hi] are clipped.
  const valueMap = new Map<string, number>();
  for (const d of data) {
    const ts = toUTCDayTs(d.date);
    if (ts < lo || ts > hi) continue;
    valueMap.set(formatISODate(ts), d.value);
  }

  // Align the grid's first column to the start of the week containing `lo`.
  const loDow = new Date(lo).getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const offset = weekStart === 1 ? (loDow + 6) % 7 : loDow;
  const alignedStart = lo - offset * MS_DAY;

  const totalDays = Math.round((hi - lo) / MS_DAY) + 1;
  const weeks = Math.floor((hi - alignedStart) / MS_WEEK) + 1;
  const step = cellSize + gap;

  const cells: CalendarCell[] = [];
  const monthLabels: { label: string; x: number }[] = [];
  let currentWeek = -1;
  let trackedMonthKey: number | null = null;

  for (let i = 0; i < totalDays; i++) {
    const ts = lo + i * MS_DAY;
    const d = new Date(ts);
    const dow = d.getUTCDay();
    const weekday = weekStart === 1 ? (dow + 6) % 7 : dow;
    const week = Math.floor((ts - alignedStart) / MS_WEEK);
    const iso = formatISODate(ts);
    const value = valueMap.has(iso) ? valueMap.get(iso)! : null;

    cells.push({ date: iso, value, x: week * step, y: weekday * step, week, weekday });

    // Label a month at most once, on the first (chronologically earliest,
    // hence first-visited) week column where it appears.
    if (week !== currentWeek) {
      currentWeek = week;
      const monthKey = d.getUTCFullYear() * 12 + d.getUTCMonth();
      if (monthKey !== trackedMonthKey) {
        trackedMonthKey = monthKey;
        monthLabels.push({ label: MONTH_LABELS[d.getUTCMonth()], x: week * step });
      }
    }
  }

  const totalWidth = cellSize * weeks + gap * Math.max(0, weeks - 1);
  const totalHeight = cellSize * 7 + gap * 6;

  return { cells, monthLabels, weeks, totalWidth, totalHeight };
}
