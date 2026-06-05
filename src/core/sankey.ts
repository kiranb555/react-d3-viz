// src/core/sankey.ts
import type { Margin } from "./types";

export interface SankeyNode {
  id: string | number;
  label: string;
}

export interface SankeyLink {
  source: string | number;
  target: string | number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface ComputedSankeyNode {
  id: string | number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComputedSankeyLink {
  source: string | number;
  target: string | number;
  value: number;
  path: string;
  sourceY: number;
  targetY: number;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface SankeyLayoutResult {
  nodes: ComputedSankeyNode[];
  links: ComputedSankeyLink[];
  bounds: Bounds;
}

export function calculateSankeyLayout(
  data: SankeyData,
  width: number,
  height: number,
  margin: Margin
): SankeyLayoutResult {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (!data.nodes || data.nodes.length === 0) {
    return {
      nodes: [],
      links: [],
      bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight }
    };
  }

  // Create node index
  const nodeMap = new Map<string | number, SankeyNode>();
  data.nodes.forEach(node => nodeMap.set(node.id, node));

  // Compute incoming/outgoing flow per node
  const nodeFlows = new Map<string | number, { in: number; out: number }>();
  data.nodes.forEach(node => {
    nodeFlows.set(node.id, { in: 0, out: 0 });
  });

  data.links.forEach(link => {
    const sourceFlow = nodeFlows.get(link.source) || { in: 0, out: 0 };
    const targetFlow = nodeFlows.get(link.target) || { in: 0, out: 0 };

    sourceFlow.out += link.value;
    targetFlow.in += link.value;

    nodeFlows.set(link.source, sourceFlow);
    nodeFlows.set(link.target, targetFlow);
  });

  // Identify layers (topological sort)
  const layers: (string | number)[][] = [];
  const visited = new Set<string | number>();

  // Find source nodes (no incoming flow)
  const currentLayer: (string | number)[] = [];
  data.nodes.forEach(node => {
    const flow = nodeFlows.get(node.id) || { in: 0, out: 0 };
    if (flow.in === 0) {
      currentLayer.push(node.id);
    }
  });

  let layerCount = 0;
  while (currentLayer.length > 0 && layerCount < data.nodes.length) {
    layers.push([...currentLayer]);
    currentLayer.forEach(nodeId => visited.add(nodeId));

    const nextLayer: (string | number)[] = [];
    const foundInNextLayer = new Set<string | number>();

    currentLayer.forEach(nodeId => {
      data.links.forEach(link => {
        if (link.source === nodeId && !visited.has(link.target)) {
          if (!foundInNextLayer.has(link.target)) {
            nextLayer.push(link.target);
            foundInNextLayer.add(link.target);
          }
        }
      });
    });

    currentLayer.length = 0;
    currentLayer.push(...nextLayer);
    layerCount++;
  }

  // If not all nodes assigned to layers, assign remaining as orphans
  const assignedNodes = new Set(layers.flat());
  const orphanNodes = data.nodes.filter(n => !assignedNodes.has(n.id));
  if (orphanNodes.length > 0) {
    layers.push(orphanNodes.map(n => n.id));
  }

  // Position nodes
  const computedNodes: ComputedSankeyNode[] = [];
  const nodePositions = new Map<string | number, ComputedSankeyNode>();

  layers.forEach((layer, layerIndex) => {
    const xPos =
      layers.length > 1
        ? (innerWidth / (layers.length - 1)) * layerIndex
        : innerWidth / 2;

    const totalFlow = layer.reduce((sum: number, nodeId) => {
      const flow = nodeFlows.get(nodeId) || { in: 0, out: 0 };
      return sum + Math.max(flow.in, flow.out);
    }, 0);

    let yOffset = 0;
    layer.forEach(nodeId => {
      const flow = nodeFlows.get(nodeId) || { in: 0, out: 0 };
      const flowValue = Math.max(flow.in, flow.out);
      const nodeHeight =
        totalFlow > 0 ? (flowValue / totalFlow) * innerHeight : 20;

      const node = nodeMap.get(nodeId)!;
      const computedNode: ComputedSankeyNode = {
        id: node.id,
        label: node.label,
        x: xPos,
        y: yOffset,
        width: 30,
        height: Math.max(nodeHeight, 20)
      };

      computedNodes.push(computedNode);
      nodePositions.set(nodeId, computedNode);
      yOffset += computedNode.height + 10;
    });
  });

  // Compute link paths
  const computedLinks: ComputedSankeyLink[] = data.links.map(link => {
    const sourceNode = nodePositions.get(link.source);
    const targetNode = nodePositions.get(link.target);

    if (!sourceNode || !targetNode) {
      return {
        source: link.source,
        target: link.target,
        value: link.value,
        path: "",
        sourceY: 0,
        targetY: 0
      };
    }

    const sourceY = sourceNode.y + sourceNode.height / 2;
    const targetY = targetNode.y + targetNode.height / 2;
    const controlX = sourceNode.x + (targetNode.x - sourceNode.x) / 2;

    const path =
      `M ${sourceNode.x + sourceNode.width},${sourceY} ` +
      `C ${controlX},${sourceY} ${controlX},${targetY} ${targetNode.x},${targetY}`;

    return {
      source: link.source,
      target: link.target,
      value: link.value,
      path,
      sourceY,
      targetY
    };
  });

  return {
    nodes: computedNodes,
    links: computedLinks,
    bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight }
  };
}
