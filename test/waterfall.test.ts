// test/waterfall.test.ts
import { calculateWaterfallLayout } from "../src/core/waterfall";
import { Margin } from "../src/core/types";

describe("calculateWaterfallLayout", () => {
  const margin: Margin = { top: 20, right: 20, bottom: 40, left: 40 };

  it("computes correct segment positions for basic waterfall", () => {
    const data = [
      { label: "Start", value: 100 },
      { label: "Revenue", value: 50 },
      { label: "Costs", value: -20 },
      { label: "End", value: 130, isTotal: true }
    ];

    const result = calculateWaterfallLayout(data, 400, 300, margin);

    expect(result.segments).toHaveLength(4);
    expect(result.segments[0].startY).toBeLessThan(result.segments[0].endY);
    expect(result.segments[2].isPositive).toBe(false);
    expect(result.segments[3].isTotal).toBe(true);
  });

  it("handles empty data", () => {
    const result = calculateWaterfallLayout([], 400, 300, margin);
    expect(result.segments).toHaveLength(0);
    expect(result.bounds).toBeDefined();
  });

  it("handles single value", () => {
    const data = [{ label: "Value", value: 100 }];
    const result = calculateWaterfallLayout(data, 400, 300, margin);
    expect(result.segments).toHaveLength(1);
  });

  it("computes running totals correctly", () => {
    const data = [
      { label: "Start", value: 100 },
      { label: "Add", value: 50 },
      { label: "Subtract", value: -20 }
    ];
    const result = calculateWaterfallLayout(data, 400, 300, margin);

    expect(result.runningTotals[0]).toBe(100);
    expect(result.runningTotals[1]).toBe(150);
    expect(result.runningTotals[2]).toBe(130);
  });

  it("generates connector lines between segments", () => {
    const data = [
      { label: "Start", value: 100 },
      { label: "Add", value: 50 }
    ];
    const result = calculateWaterfallLayout(data, 400, 300, margin);

    expect(result.connectors.length).toBeGreaterThan(0);
  });

  it("handles all negative values", () => {
    const data = [
      { label: "Loss 1", value: -50 },
      { label: "Loss 2", value: -30 }
    ];
    const result = calculateWaterfallLayout(data, 400, 300, margin);

    expect(result.segments).toHaveLength(2);
    expect(result.segments.every(s => !s.isPositive)).toBe(true);
  });

  it("handles extreme value ratios", () => {
    const data = [
      { label: "Large", value: 1000 },
      { label: "Small", value: 1 }
    ];
    const result = calculateWaterfallLayout(data, 400, 300, margin);

    expect(result.segments[0].height).toBeGreaterThan(result.segments[1].height);
  });

  it("performance: 1000 segments under 100ms", () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({
      label: `Step ${i}`,
      value: Math.random() * 100 - 50
    }));

    const start = performance.now();
    calculateWaterfallLayout(data, 400, 300, margin);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
