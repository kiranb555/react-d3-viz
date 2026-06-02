import { describe, it, expect } from 'vitest';
import { treemapLayout, type TreemapRect } from '../src/core/treemap';

const leaves = (rects: TreemapRect[]) => rects.filter((r) => r.isLeaf);
const within = (r: TreemapRect, W: number, H: number) =>
  r.x0 >= -1e-6 && r.y0 >= -1e-6 && r.x1 <= W + 1e-6 && r.y1 <= H + 1e-6;

function overlaps(a: TreemapRect, b: TreemapRect): boolean {
  return a.x0 < b.x1 - 1e-6 && b.x0 < a.x1 - 1e-6 && a.y0 < b.y1 - 1e-6 && b.y0 < a.y1 - 1e-6;
}

const flat = [
  { name: 'A', value: 40 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
  { name: 'D', value: 10 },
];

describe('treemapLayout — flat data', () => {
  it('produces one leaf per record', () => {
    const rects = treemapLayout({ data: flat, value: 'value', label: 'name' }, { width: 400, height: 300 });
    expect(leaves(rects)).toHaveLength(4);
  });

  it('keeps every rect inside the bounds', () => {
    const rects = treemapLayout({ data: flat, value: 'value' }, { width: 400, height: 300 });
    rects.forEach((r) => expect(within(r, 400, 300)).toBe(true));
  });

  it('does not overlap sibling leaves', () => {
    const rects = leaves(treemapLayout({ data: flat, value: 'value' }, { width: 400, height: 300 }));
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) expect(overlaps(rects[i], rects[j])).toBe(false);
  });

  it('allocates area proportional to value (no padding)', () => {
    const W = 600;
    const H = 400;
    const rects = leaves(treemapLayout({ data: flat, value: 'value' }, { width: W, height: H, paddingInner: 0 }));
    const total = flat.reduce((s, d) => s + d.value, 0);
    const areaOf = (r: TreemapRect) => (r.x1 - r.x0) * (r.y1 - r.y0);
    const sumArea = rects.reduce((s, r) => s + areaOf(r), 0);
    expect(sumArea).toBeCloseTo(W * H, 0);
    rects.forEach((r) => {
      const expected = (r.value / total) * W * H;
      expect(areaOf(r)).toBeCloseTo(expected, 0);
    });
  });

  it('labels leaves from the label accessor', () => {
    const rects = leaves(treemapLayout({ data: flat, value: 'value', label: 'name' }, { width: 400, height: 300 }));
    expect(new Set(rects.map((r) => r.label))).toEqual(new Set(['A', 'B', 'C', 'D']));
  });
});

describe('treemapLayout — grouped (2-level)', () => {
  const grouped = [
    { name: 'a', cat: 'X', value: 10 },
    { name: 'b', cat: 'X', value: 20 },
    { name: 'c', cat: 'Y', value: 30 },
    { name: 'd', cat: 'Z', value: 5 },
  ];

  it('colors leaves by their top-level group', () => {
    const rects = leaves(
      treemapLayout({ data: grouped, value: 'value', label: 'name', group: 'cat' }, { width: 400, height: 300 }),
    );
    const byName = Object.fromEntries(rects.map((r) => [r.label, r]));
    // a and b share group X → same groupIndex; c (Y) and d (Z) differ.
    expect(byName.a.groupIndex).toBe(byName.b.groupIndex);
    expect(byName.a.groupIndex).not.toBe(byName.c.groupIndex);
    expect(byName.c.groupIndex).not.toBe(byName.d.groupIndex);
    expect(byName.a.groupLabel).toBe('X');
  });

  it('emits internal group rects (depth 1) alongside leaves', () => {
    const rects = treemapLayout(
      { data: grouped, value: 'value', group: 'cat' },
      { width: 400, height: 300, paddingTop: 16 },
    );
    const groups = rects.filter((r) => !r.isLeaf && r.depth === 1);
    expect(groups).toHaveLength(3); // X, Y, Z
  });
});

describe('treemapLayout — nested hierarchy', () => {
  const nested = {
    name: 'root',
    children: [
      { name: 'X', children: [{ name: 'a', value: 10 }, { name: 'b', value: 20 }] },
      { name: 'Y', children: [{ name: 'c', value: 30 }] },
    ],
  };

  it('flattens arbitrary depth to leaves colored by top-level ancestor', () => {
    const rects = treemapLayout({ data: nested, value: 'value', label: 'name' }, { width: 400, height: 300 });
    const lf = leaves(rects);
    expect(lf).toHaveLength(3);
    const byName = Object.fromEntries(lf.map((r) => [r.label, r]));
    expect(byName.a.groupIndex).toBe(byName.b.groupIndex); // both under X
    expect(byName.a.groupIndex).not.toBe(byName.c.groupIndex); // c under Y
    expect(byName.a.groupLabel).toBe('X');
  });

  it('keeps nested leaves within their parent group rect', () => {
    const rects = treemapLayout({ data: nested, value: 'value', label: 'name' }, { width: 400, height: 300 });
    rects.forEach((r) => expect(within(r, 400, 300)).toBe(true));
  });
});

describe('treemapLayout — edge cases', () => {
  it('treats negative / non-finite values as zero-area', () => {
    const data = [{ v: 10 }, { v: -5 }, { v: NaN }, { v: 30 }];
    const rects = leaves(treemapLayout({ data, value: 'v' }, { width: 200, height: 200 }));
    expect(rects).toHaveLength(4);
    const zero = rects.filter((r) => r.x1 - r.x0 < 1e-6 || r.y1 - r.y0 < 1e-6);
    expect(zero.length).toBe(2); // the -5 and NaN rows collapse
  });

  it('returns no rects for empty data', () => {
    expect(treemapLayout({ data: [], value: 'v' }, { width: 200, height: 200 })).toEqual([]);
  });

  it('renders a single bare leaf root as a full-area cell', () => {
    const rects = treemapLayout({ data: { name: 'solo', value: 5 }, value: 'value', label: 'name' }, { width: 100, height: 80 });
    expect(rects).toHaveLength(1);
    expect(rects[0].isLeaf).toBe(true);
    expect(rects[0].x1 - rects[0].x0).toBeCloseTo(100, 5);
  });
});
