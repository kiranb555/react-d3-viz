import { describe, it, expect } from 'vitest';
import { calendarHeatmapLayout } from '../src/core/calendarHeatmap';

describe('calendarHeatmapLayout — bounds', () => {
  it('every cell x/y is within [0, totalWidth] / [0, totalHeight]', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cellSize: 11,
      gap: 3,
    });
    for (const cell of result.cells) {
      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.x).toBeLessThanOrEqual(result.totalWidth);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeLessThanOrEqual(result.totalHeight);
      // Each cell rect fits entirely within the reported bounds.
      expect(cell.x + 11).toBeLessThanOrEqual(result.totalWidth + 1e-9);
      expect(cell.y + 11).toBeLessThanOrEqual(result.totalHeight + 1e-9);
    }
  });
});

describe('calendarHeatmapLayout — no overlap', () => {
  it('no two cells share the same (week, weekday) pair', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cellSize: 11,
      gap: 3,
    });
    const seen = new Set<string>();
    for (const cell of result.cells) {
      const key = `${cell.week},${cell.weekday}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe('calendarHeatmapLayout — weekday correctness', () => {
  it('2024-01-01 (a Monday) has weekday === 1 with weekStart 0 (Sunday-first)', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-01-01',
      cellSize: 11,
      weekStart: 0,
    });
    expect(result.cells).toHaveLength(1);
    expect(result.cells[0].weekday).toBe(1);
  });

  it('2024-01-01 (a Monday) has weekday === 0 with weekStart 1 (Monday-first)', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-01-01',
      cellSize: 11,
      weekStart: 1,
    });
    expect(result.cells).toHaveLength(1);
    expect(result.cells[0].weekday).toBe(0);
  });

  it('assigns correct weekday indices across a full week (Sunday-first)', () => {
    // 2024-01-01 is Monday; 2024-01-07 is Sunday.
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      cellSize: 11,
      weekStart: 0,
    });
    const byDate = new Map(result.cells.map((c) => [c.date, c.weekday]));
    expect(byDate.get('2024-01-01')).toBe(1); // Mon
    expect(byDate.get('2024-01-02')).toBe(2); // Tue
    expect(byDate.get('2024-01-06')).toBe(6); // Sat
    expect(byDate.get('2024-01-07')).toBe(0); // Sun
  });
});

describe('calendarHeatmapLayout — coverage', () => {
  it('a full-year range produces a cell count matching the inclusive day count', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cellSize: 11,
    });
    // 2024 is a leap year: 366 days.
    expect(result.cells).toHaveLength(366);
  });

  it('a non-leap-year full-year range produces 365 cells', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(365);
  });
});

describe('calendarHeatmapLayout — edge cases', () => {
  it('empty data still renders the full date-range grid with all value: null', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(31);
    expect(result.cells.every((c) => c.value === null)).toBe(true);
  });

  it('a single-day range produces exactly one cell', () => {
    const result = calendarHeatmapLayout([{ date: '2024-06-15', value: 5 }], {
      startDate: '2024-06-15',
      endDate: '2024-06-15',
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(1);
    expect(result.cells[0].date).toBe('2024-06-15');
    expect(result.cells[0].value).toBe(5);
    expect(result.weeks).toBe(1);
  });

  it('includes leap-year Feb 29 correctly', () => {
    const result = calendarHeatmapLayout([{ date: '2024-02-29', value: 7 }], {
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      cellSize: 11,
    });
    const feb29 = result.cells.find((c) => c.date === '2024-02-29');
    expect(feb29).toBeDefined();
    expect(feb29!.value).toBe(7);
  });

  it('a range crossing a year boundary produces distinct Dec and Jan month labels, no crash', () => {
    expect(() =>
      calendarHeatmapLayout([], {
        startDate: '2023-12-15',
        endDate: '2024-01-15',
        cellSize: 11,
      }),
    ).not.toThrow();

    const result = calendarHeatmapLayout([], {
      startDate: '2023-12-15',
      endDate: '2024-01-15',
      cellSize: 11,
    });
    const labels = result.monthLabels.map((m) => m.label);
    expect(labels).toContain('Dec');
    expect(labels).toContain('Jan');
    // Dec must come before Jan (monotonic week/x ordering).
    const decIdx = result.monthLabels.findIndex((m) => m.label === 'Dec');
    const janIdx = result.monthLabels.findIndex((m) => m.label === 'Jan');
    expect(decIdx).toBeLessThan(janIdx);
    expect(result.monthLabels[decIdx].x).toBeLessThan(result.monthLabels[janIdx].x);
  });

  it('an explicit startDate/endDate narrower than the data range clips out-of-range points without crashing', () => {
    const data = [
      { date: '2024-01-01', value: 1 },
      { date: '2024-06-15', value: 99 },
      { date: '2024-12-31', value: 2 },
    ];
    expect(() =>
      calendarHeatmapLayout(data, {
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        cellSize: 11,
      }),
    ).not.toThrow();

    const result = calendarHeatmapLayout(data, {
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(30);
    const inRange = result.cells.find((c) => c.date === '2024-06-15');
    expect(inRange!.value).toBe(99);
    // The Jan 1 / Dec 31 points are outside the range — never surfaced.
    expect(result.cells.some((c) => c.date === '2024-01-01')).toBe(false);
    expect(result.cells.some((c) => c.date === '2024-12-31')).toBe(false);
    expect(result.cells.every((c) => c.value === null || c.date === '2024-06-15')).toBe(true);
  });

  it('accepts Date objects as well as ISO strings for startDate/endDate/data dates', () => {
    const result = calendarHeatmapLayout([{ date: new Date(Date.UTC(2024, 0, 15)), value: 3 }], {
      startDate: new Date(Date.UTC(2024, 0, 1)),
      endDate: new Date(Date.UTC(2024, 0, 31)),
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(31);
    const cell = result.cells.find((c) => c.date === '2024-01-15');
    expect(cell!.value).toBe(3);
  });

  it('a reversed startDate/endDate pair does not throw (min/max normalized)', () => {
    expect(() =>
      calendarHeatmapLayout([], {
        startDate: '2024-01-31',
        endDate: '2024-01-01',
        cellSize: 11,
      }),
    ).not.toThrow();
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-31',
      endDate: '2024-01-01',
      cellSize: 11,
    });
    expect(result.cells).toHaveLength(31);
  });
});

describe('calendarHeatmapLayout — totalWidth/totalHeight', () => {
  it('totalWidth grows with weeks and totalHeight is always 7 rows', () => {
    const result = calendarHeatmapLayout([], {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      cellSize: 10,
      gap: 2,
    });
    expect(result.totalHeight).toBe(10 * 7 + 2 * 6);
    expect(result.totalWidth).toBe(10 * result.weeks + 2 * (result.weeks - 1));
  });
});
