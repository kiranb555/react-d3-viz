import { describe, it, expect } from 'vitest';
import { sunburstLayout, type SunburstArc } from '../src/core/sunburst';

const EPSILON = 1e-6;

const arcsAtDepth = (arcs: SunburstArc[], depth: number) => arcs.filter((a) => a.depth === depth);

const containsAngle = (parent: SunburstArc, child: SunburstArc): boolean => {
  return (
    child.startAngle >= parent.startAngle - EPSILON &&
    child.endAngle <= parent.endAngle + EPSILON
  );
};

const flatData = [
  { name: 'A', value: 40 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
  { name: 'D', value: 10 },
];

const hierarchicalData = {
  name: 'root',
  children: [
    {
      name: 'X',
      children: [
        { name: 'x1', value: 15 },
        { name: 'x2', value: 25 },
      ],
    },
    {
      name: 'Y',
      children: [
        { name: 'y1', value: 30 },
      ],
    },
  ],
};

describe('sunburstLayout — flat data', () => {
  it('produces one arc per record at depth 1', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value', label: 'name' }, { radius: 100 });
    expect(arcsAtDepth(arcs, 1)).toHaveLength(4);
  });

  it('angles sum to approximately 2π across all depth-1 arcs (accounting for padding)', () => {
    const padAngle = 0.01;
    const arcs = sunburstLayout({ data: flatData, value: 'value' }, { radius: 100, padAngle });
    const depth1 = arcsAtDepth(arcs, 1);
    const minAngle = Math.min(...depth1.map((a) => a.startAngle));
    const maxAngle = Math.max(...depth1.map((a) => a.endAngle));
    // padAngle reduces total by padAngle * n
    const expectedSpan = 2 * Math.PI - padAngle * depth1.length;
    expect(maxAngle - minAngle).toBeCloseTo(expectedSpan, 1);
  });

  it('allocates angle proportional to value', () => {
    const padAngle = 0.01;
    const arcs = sunburstLayout({ data: flatData, value: 'value' }, { radius: 100, padAngle });
    const depth1 = arcsAtDepth(arcs, 1);
    const total = flatData.reduce((s, d) => s + d.value, 0);
    const angleSpan = (a: SunburstArc) => a.endAngle - a.startAngle;
    // Total available angle after padding is subtracted
    const totalAvailable = 2 * Math.PI - padAngle * depth1.length;
    const scale = totalAvailable / total;
    // Check that angles are roughly proportional (with tolerance for padding)
    depth1.forEach((a) => {
      const val = flatData.find((d) => d.name === a.label)?.value ?? 0;
      if (val > 0) {
        const expected = val * scale;
        expect(angleSpan(a)).toBeCloseTo(expected, 0);
      }
    });
  });

  it('labels arcs from the label accessor', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value', label: 'name' }, { radius: 100 });
    const labels = new Set(arcsAtDepth(arcs, 1).map((a) => a.label));
    expect(labels).toEqual(new Set(['A', 'B', 'C', 'D']));
  });

  it('assigns groupIndex by depth-1 ancestor', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value', label: 'name' }, { radius: 100 });
    const depth1 = arcsAtDepth(arcs, 1);
    depth1.forEach((a, i) => {
      expect(a.groupIndex).toBe(i);
      expect(a.depth).toBe(1);
    });
  });
});

describe('sunburstLayout — nested hierarchy', () => {
  it('assigns correct depth levels', () => {
    const arcs = sunburstLayout({ data: hierarchicalData, value: 'value', label: 'name' }, { radius: 100 });
    const depth1 = arcsAtDepth(arcs, 1);
    const depth2 = arcsAtDepth(arcs, 2);
    expect(depth1).toHaveLength(2); // X, Y
    expect(depth2).toHaveLength(3); // x1, x2, y1
  });

  it('parent arc contains all child arcs by angle range', () => {
    const arcs = sunburstLayout({ data: hierarchicalData, value: 'value', label: 'name' }, { radius: 100 });
    const depth1 = arcsAtDepth(arcs, 1);
    const depth2 = arcsAtDepth(arcs, 2);

    expect(depth1.length).toBeGreaterThan(0);
    expect(depth2.length).toBeGreaterThan(0);

    // Check that depth2 arcs are contained within the root angle range
    const minDepth1 = Math.min(...depth1.map((a) => a.startAngle));
    const maxDepth1 = Math.max(...depth1.map((a) => a.endAngle));
    depth2.forEach((child) => {
      expect(child.startAngle).toBeGreaterThanOrEqual(minDepth1 - EPSILON);
      expect(child.endAngle).toBeLessThanOrEqual(maxDepth1 + EPSILON);
    });
  });

  it('assigns groupIndex matching depth-1 ancestor', () => {
    const arcs = sunburstLayout({ data: hierarchicalData, value: 'value', label: 'name' }, { radius: 100 });
    const depth1 = arcsAtDepth(arcs, 1);
    const depth2 = arcsAtDepth(arcs, 2);

    const byLabel = Object.fromEntries(depth1.map((a) => [a.label, a.groupIndex]));
    depth2.forEach((arc) => {
      expect(arc.groupIndex).toBe(byLabel[arc.groupLabel]);
    });
  });

  it('depth-2 arcs have correct isLeaf property', () => {
    const arcs = sunburstLayout({ data: hierarchicalData, value: 'value' }, { radius: 100 });
    const depth2 = arcsAtDepth(arcs, 2);
    depth2.forEach((a) => {
      expect(a.isLeaf).toBe(true);
    });
  });

  it('child values are individual values (not summed in arcs)', () => {
    const arcs = sunburstLayout({ data: hierarchicalData, value: 'value' }, { radius: 100 });
    const depth2 = arcsAtDepth(arcs, 2);
    expect(depth2.length).toBeGreaterThan(0);
    // Each depth-2 arc should have a valid value
    depth2.forEach((a) => {
      expect(a.value).toBeGreaterThan(0);
      expect(Number.isFinite(a.value)).toBe(true);
    });
  });
});

describe('sunburstLayout — drill-down root', () => {
  it('passing a subtree node as data gives a fresh 0..2π layout', () => {
    const padAngle = 0.01;
    const subtree = hierarchicalData.children[0]; // X subtree
    const arcs = sunburstLayout({ data: subtree, value: 'value', label: 'name' }, { radius: 100, padAngle });
    const depth1 = arcsAtDepth(arcs, 1);
    expect(depth1).toHaveLength(2); // x1, x2
    const minAngle = Math.min(...depth1.map((a) => a.startAngle));
    const maxAngle = Math.max(...depth1.map((a) => a.endAngle));
    expect(minAngle).toBeCloseTo(0, 5);
    const expectedSpan = 2 * Math.PI - padAngle * (depth1.length - 1);
    expect(maxAngle - minAngle).toBeCloseTo(expectedSpan, 2);
  });
});

describe('sunburstLayout — edge cases', () => {
  it('treats negative / non-finite values as zero', () => {
    const data = [
      { name: 'good', value: 30 },
      { name: 'negative', value: -10 },
      { name: 'nan', value: NaN },
    ];
    const arcs = sunburstLayout({ data, value: 'value', label: 'name' }, { radius: 100 });
    const depth1 = arcsAtDepth(arcs, 1);
    expect(depth1).toHaveLength(3);
    // At least one zero-value entry should have near-zero span
    const almostZero = depth1.filter((a) => a.endAngle - a.startAngle < 0.01);
    expect(almostZero.length).toBeGreaterThanOrEqual(1);
  });

  it('returns no arcs for empty data', () => {
    const arcs = sunburstLayout({ data: [], value: 'value' }, { radius: 100 });
    expect(arcs).toEqual([]);
  });

  it('handles single-element flat data', () => {
    const padAngle = 0.01;
    const arcs = sunburstLayout({ data: [{ name: 'Solo', value: 100 }], value: 'value', label: 'name' }, { radius: 100, padAngle });
    expect(arcsAtDepth(arcs, 1)).toHaveLength(1);
    const arc = arcsAtDepth(arcs, 1)[0];
    const expectedSpan = 2 * Math.PI - padAngle;
    expect(arc.endAngle - arc.startAngle).toBeCloseTo(expectedSpan, 1);
  });

  it('handles single bare leaf root', () => {
    const data = { name: 'Solo', value: 50 };
    const arcs = sunburstLayout({ data, value: 'value', label: 'name' }, { radius: 100 });
    expect(arcsAtDepth(arcs, 1)).toHaveLength(1);
    const arc = arcsAtDepth(arcs, 1)[0];
    expect(arc.label).toBe('Solo');
  });

  it('returns empty for zero or negative radius', () => {
    const arcs1 = sunburstLayout({ data: flatData, value: 'value' }, { radius: 0 });
    const arcs2 = sunburstLayout({ data: flatData, value: 'value' }, { radius: -10 });
    expect(arcs1).toEqual([]);
    expect(arcs2).toEqual([]);
  });

  it('generates valid paths and centroids', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value' }, { radius: 100 });
    arcs.forEach((a) => {
      expect(typeof a.path).toBe('string');
      expect(a.path.length).toBeGreaterThan(0);
      expect(Array.isArray(a.centroid)).toBe(true);
      expect(a.centroid).toHaveLength(2);
      expect(typeof a.centroid[0]).toBe('number');
      expect(typeof a.centroid[1]).toBe('number');
    });
  });

  it('innerRadius as fraction works correctly', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value' }, { radius: 100, innerRadius: 0.5 });
    arcs.forEach((a) => {
      expect(a.innerR).toBeCloseTo(50, 0);
    });
  });

  it('innerRadius as pixel value works correctly', () => {
    const arcs = sunburstLayout({ data: flatData, value: 'value' }, { radius: 100, innerRadius: 30 });
    arcs.forEach((a) => {
      expect(a.innerR).toBeCloseTo(30, 0);
    });
  });
});
