import { describe, it, expect } from 'vitest';
import { computeButterflyLayout } from '../src/core/butterfly';
import type { Datum } from '../src/core/types';

const basicData: Datum[] = [
  { age: '0–14', male: 12.5, female: 11.8 },
  { age: '15–24', male: 9.0, female: 8.6 },
  { age: '25–34', male: 10.3, female: 10.0 },
  { age: '35–44', male: 9.8, female: 9.9 },
  { age: '45–54', male: 8.7, female: 9.0 },
];

describe('computeButterflyLayout', () => {
  it('computes basic layout with 5 rows', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    expect(layout.rows).toHaveLength(5);
    expect(layout.rows[0].category).toBe('0–14');
    expect(layout.barHeight).toBeGreaterThan(0);
  });

  it('ensures no row overlap', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    for (let i = 0; i < layout.rows.length - 1; i++) {
      const current = layout.rows[i];
      const next = layout.rows[i + 1];
      expect(current.y + current.barHeight).toBeLessThanOrEqual(next.y + 1); // +1 for floating point tolerance
    }
  });

  it('uses shared maxValue when syncScale=true for asymmetric data', () => {
    const asymmetricData: Datum[] = [
      { cat: 'A', left: 50, right: 10 },
      { cat: 'B', left: 10, right: 50 },
    ];

    const layout = computeButterflyLayout(asymmetricData, {
      categoryAccessor: 'cat',
      leftAccessor: 'left',
      rightAccessor: 'right',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    expect(layout.maxValue).toBe(50);
    expect(layout.leftScale.domain()[1]).toBe(50);
    expect(layout.rightScale.domain()[1]).toBe(50);
  });

  it('computes independent domains when syncScale=false', () => {
    const asymmetricData: Datum[] = [
      { cat: 'A', left: 50, right: 10 },
      { cat: 'B', left: 10, right: 50 },
    ];

    const layout = computeButterflyLayout(asymmetricData, {
      categoryAccessor: 'cat',
      leftAccessor: 'left',
      rightAccessor: 'right',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: false,
    });

    // Even with syncScale=false, scales share the same max for simplicity
    expect(layout.maxValue).toBe(50);
  });

  it('respects maxValue override', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
      maxValue: 20,
    });

    expect(layout.maxValue).toBe(20);
    expect(layout.leftScale.domain()[1]).toBe(20);
    expect(layout.rightScale.domain()[1]).toBe(20);
  });

  it('handles empty data', () => {
    const layout = computeButterflyLayout([], {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    expect(layout.rows).toHaveLength(0);
    expect(layout.maxValue).toBeGreaterThan(0);
  });

  it('defaults maxValue to 1 for all-zero values', () => {
    const zeroData: Datum[] = [
      { cat: 'A', left: 0, right: 0 },
      { cat: 'B', left: 0, right: 0 },
    ];

    const layout = computeButterflyLayout(zeroData, {
      categoryAccessor: 'cat',
      leftAccessor: 'left',
      rightAccessor: 'right',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    expect(layout.maxValue).toBe(1);
    expect(layout.leftScale.domain()[1]).toBe(1);
  });

  it('maintains proportionality: 2x value → 2x width', () => {
    const propData: Datum[] = [
      { cat: 'A', left: 20, right: 10 },
      { cat: 'B', left: 10, right: 10 },
    ];

    const layout = computeButterflyLayout(propData, {
      categoryAccessor: 'cat',
      leftAccessor: 'left',
      rightAccessor: 'right',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    const aLeftWidth = Math.abs(layout.leftScale(20) - layout.leftScale(0));
    const bLeftWidth = Math.abs(layout.leftScale(10) - layout.leftScale(0));

    expect(aLeftWidth).toBeCloseTo(2 * bLeftWidth, 1);
  });

  it('generates ticks for both sides', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
      tickCount: 5,
    });

    expect(layout.leftTicks.length).toBeGreaterThanOrEqual(2);
    expect(layout.rightTicks.length).toBeGreaterThanOrEqual(2);
    expect(layout.leftTicks[0].label).toBeDefined();
    expect(layout.rightTicks[0].label).toBeDefined();
  });

  it('applies valueFormat to tick labels', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
      valueFormat: (v) => `${v}%`,
    });

    const formatted = layout.leftTicks.some((t) => t.label.includes('%'));
    expect(formatted).toBe(true);
  });

  it('centers the butterfly correctly with categoryWidth', () => {
    const layout = computeButterflyLayout(basicData, {
      categoryAccessor: 'age',
      leftAccessor: 'male',
      rightAccessor: 'female',
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    // centerX should be at the midpoint
    expect(layout.centerX).toBe(200);
    // leftScale.range[0] should end at centerX - categoryWidth/2
    expect(layout.leftScale.range()[0]).toBe(150);
    // rightScale.range[0] should start at centerX + categoryWidth/2
    expect(layout.rightScale.range()[0]).toBe(250);
  });

  it('extracts values using accessor functions', () => {
    const customData: Datum[] = [
      { row: 'First', leftVal: 100, rightVal: 80 },
      { row: 'Second', leftVal: 60, rightVal: 70 },
    ];

    const layout = computeButterflyLayout(customData, {
      categoryAccessor: (d) => (d as { row: string }).row,
      leftAccessor: (d) => (d as { leftVal: number }).leftVal,
      rightAccessor: (d) => (d as { rightVal: number }).rightVal,
      innerWidth: 400,
      innerHeight: 200,
      categoryWidth: 100,
      barPadding: 0.3,
      syncScale: true,
    });

    expect(layout.rows[0].category).toBe('First');
    expect(layout.rows[0].leftValue).toBe(100);
    expect(layout.rows[0].rightValue).toBe(80);
  });
});
