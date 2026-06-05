// test/mekko.test.ts
import { calculateMekkoLayout, MekkoData } from "../src/core/mekko";
import { Margin } from "../src/core/types";

describe("calculateMekkoLayout", () => {
  const margin: Margin = { top: 20, right: 20, bottom: 40, left: 60 };

  it("computes column widths proportional to category values", () => {
    const data: MekkoData = {
      categories: [
        { label: "Q1", value: 100 },
        { label: "Q2", value: 200 },
        { label: "Q3", value: 100 }
      ],
      series: [
        {
          id: "a",
          label: "A",
          data: [
            { categoryId: "Q1", value: 50 },
            { categoryId: "Q2", value: 100 },
            { categoryId: "Q3", value: 50 }
          ]
        }
      ]
    };

    const result = calculateMekkoLayout(data, 400, 300, margin);

    expect(result.columns).toHaveLength(3);
    // Q2 column should be wider than Q1 (200 vs 100)
    expect(result.columns[1].width).toBeGreaterThan(result.columns[0].width);
  });

  it("handles empty data", () => {
    const data: MekkoData = { categories: [], series: [] };
    const result = calculateMekkoLayout(data, 400, 300, margin);

    expect(result.columns).toHaveLength(0);
  });

  it("stacks segments within columns correctly", () => {
    const data: MekkoData = {
      categories: [{ label: "Total", value: 100 }],
      series: [
        {
          id: "a",
          label: "A",
          data: [{ categoryId: "Total", value: 60 }]
        },
        {
          id: "b",
          label: "B",
          data: [{ categoryId: "Total", value: 40 }]
        }
      ]
    };

    const result = calculateMekkoLayout(data, 400, 300, margin);

    expect(result.columns[0].segments).toHaveLength(2);
    // Segments should be stacked (y positions differ)
    expect(result.columns[0].segments[1].y).toBeGreaterThan(
      result.columns[0].segments[0].y
    );
  });

  it("handles missing categories in series", () => {
    const data: MekkoData = {
      categories: [
        { label: "Q1", value: 100 },
        { label: "Q2", value: 100 }
      ],
      series: [
        {
          id: "a",
          label: "A",
          data: [{ categoryId: "Q1", value: 50 }]
          // Missing Q2
        }
      ]
    };

    const result = calculateMekkoLayout(data, 400, 300, margin);

    expect(result.columns).toHaveLength(2);
    expect(result.columns[0].segments).toHaveLength(1);
  });

  it("handles negative category widths gracefully", () => {
    const data: MekkoData = {
      categories: [
        { label: "Valid", value: 100 },
        { label: "Invalid", value: -50 }
      ],
      series: [
        {
          id: "a",
          label: "A",
          data: [
            { categoryId: "Valid", value: 50 },
            { categoryId: "Invalid", value: 25 }
          ]
        }
      ]
    };

    const result = calculateMekkoLayout(data, 400, 300, margin);

    // Invalid category should be filtered
    expect(result.columns.length).toBeLessThanOrEqual(1);
  });

  it("handles extreme width ratios", () => {
    const data: MekkoData = {
      categories: [
        { label: "Large", value: 1000 },
        { label: "Small", value: 1 }
      ],
      series: [
        {
          id: "a",
          label: "A",
          data: [
            { categoryId: "Large", value: 500 },
            { categoryId: "Small", value: 0.5 }
          ]
        }
      ]
    };

    const result = calculateMekkoLayout(data, 400, 300, margin);

    expect(result.columns[0].width).toBeGreaterThan(result.columns[1].width);
  });

  it("performance: 50 categories, 10 series under 100ms", () => {
    const categories = Array.from({ length: 50 }, (_, i) => ({
      label: `Cat ${i}`,
      value: Math.random() * 100
    }));

    const series = Array.from({ length: 10 }, (_, i) => ({
      id: `series-${i}`,
      label: `Series ${i}`,
      data: categories.map(cat => ({
        categoryId: cat.label,
        value: Math.random() * 50
      }))
    }));

    const data: MekkoData = { categories, series };

    const start = performance.now();
    calculateMekkoLayout(data, 400, 300, margin);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
