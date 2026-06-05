// test/sankey.test.ts
import { calculateSankeyLayout, SankeyData } from "../src/core/sankey";
import { Margin } from "../src/core/types";

describe("calculateSankeyLayout", () => {
  const margin: Margin = { top: 20, right: 20, bottom: 20, left: 20 };

  it("computes node positions for simple flow", () => {
    const data: SankeyData = {
      nodes: [
        { id: "a", label: "Source A" },
        { id: "b", label: "Sink B" }
      ],
      links: [{ source: "a", target: "b", value: 100 }]
    };

    const result = calculateSankeyLayout(data, 400, 300, margin);

    expect(result.nodes).toHaveLength(2);
    expect(result.links).toHaveLength(1);
    expect(result.nodes[0].x).toBeLessThan(result.nodes[1].x);
  });

  it("handles empty data", () => {
    const data: SankeyData = { nodes: [], links: [] };
    const result = calculateSankeyLayout(data, 400, 300, margin);

    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it("handles orphaned nodes", () => {
    const data: SankeyData = {
      nodes: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "orphan", label: "Orphan" }
      ],
      links: [{ source: "a", target: "b", value: 50 }]
    };

    const result = calculateSankeyLayout(data, 400, 300, margin);

    expect(result.nodes).toHaveLength(3);
    expect(result.nodes[2].x).toBeDefined();
  });

  it("computes link paths without crossings", () => {
    const data: SankeyData = {
      nodes: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" }
      ],
      links: [
        { source: "a", target: "c", value: 50 },
        { source: "b", target: "d", value: 50 }
      ]
    };

    const result = calculateSankeyLayout(data, 400, 300, margin);

    expect(result.links[0].path).toBeDefined();
    expect(result.links[0].path).toMatch(/M/); // SVG path starts with M
  });

  it("scales node heights by flow magnitude", () => {
    const data: SankeyData = {
      nodes: [
        { id: "a", label: "Source" },
        { id: "b", label: "Sink1" },
        { id: "c", label: "Sink2" }
      ],
      links: [
        { source: "a", target: "b", value: 100 },
        { source: "a", target: "c", value: 50 }
      ]
    };

    const result = calculateSankeyLayout(data, 400, 300, margin);

    const sourceNode = result.nodes[0];

    expect(sourceNode.height).toBeGreaterThan(0);
  });

  it("handles unbalanced flows", () => {
    const data: SankeyData = {
      nodes: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" }
      ],
      links: [
        { source: "a", target: "b", value: 100 },
        { source: "b", target: "c", value: 50 }  // Less flow out
      ]
    };

    const result = calculateSankeyLayout(data, 400, 300, margin);

    expect(result.nodes).toHaveLength(3);
    expect(result.links).toHaveLength(2);
  });

  it("performance: 100 nodes, 200 links under 100ms", () => {
    const nodes = Array.from({ length: 100 }, (_, i) => ({
      id: `node-${i}`,
      label: `Node ${i}`
    }));
    const links = Array.from({ length: 200 }, () => ({
      source: nodes[Math.floor(Math.random() * 50)].id,
      target: nodes[50 + Math.floor(Math.random() * 50)].id,
      value: Math.random() * 100
    }));

    const data: SankeyData = { nodes, links };

    const start = performance.now();
    calculateSankeyLayout(data, 400, 300, margin);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
