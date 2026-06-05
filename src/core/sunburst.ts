/**
 * Sunburst layout — pure JS, no DOM, no `d3-hierarchy`.
 *
 * Normalizes flat / nested input into a hierarchy, sums values bottom-up,
 * sorts siblings, partitions angles proportionally per node, and generates
 * arc geometry (path, centroid) for each segment at each depth level.
 * Returns flat arc records ready to render as `<Path>`s.
 *
 * Kept dependency-free so it runs unchanged on web and React Native.
 */
import { arc as d3arc } from 'd3-shape';
import type { Datum } from './types';
import { getNumber, getCategory, type Accessor } from './accessors';

export type ChildrenAccessor = string | ((d: Datum) => Datum[] | undefined);

export interface SunburstInput {
  data: Datum[] | Datum;
  value: Accessor<number>;
  label?: Accessor<unknown>;
  children?: ChildrenAccessor;
}

export interface SunburstOptions {
  radius: number;
  innerRadius?: number;
  padAngle?: number;
}

export interface SunburstArc {
  startAngle: number;
  endAngle: number;
  innerR: number;
  outerR: number;
  path: string;
  centroid: [number, number];
  depth: number;
  isLeaf: boolean;
  value: number;
  parentValue: number;
  label: string;
  data: Datum;
  index: number;
  groupIndex: number;
  groupLabel: string;
}

interface Node {
  data: Datum;
  label: string;
  value: number;
  depth: number;
  children: Node[];
  startAngle: number;
  endAngle: number;
  index: number;
  groupIndex: number;
  groupLabel: string;
}

function makeNode(data: Datum, label: string, depth: number): Node {
  return {
    data,
    label,
    value: 0,
    depth,
    children: [],
    startAngle: 0,
    endAngle: 0,
    index: -1,
    groupIndex: -1,
    groupLabel: '',
  };
}

function childrenOf(d: Datum, children?: ChildrenAccessor): Datum[] | undefined {
  if (!children) return undefined;
  const raw = typeof children === 'function' ? children(d) : d[children];
  return Array.isArray(raw) && raw.length > 0 ? (raw as Datum[]) : undefined;
}

function buildHierarchy(input: SunburstInput): Node {
  const { data, value, label, children } = input;
  const labelOf = (d: Datum, i: number) => (label ? getCategory(d, label, i) : '');
  const leafCounter = { i: 0 };

  const leaf = (d: Datum, depth: number): Node => {
    const node = makeNode(d, labelOf(d, leafCounter.i), depth);
    const v = getNumber(d, value, leafCounter.i);
    node.value = Number.isFinite(v) && v > 0 ? v : 0;
    leafCounter.i++;
    return node;
  };

  if (!Array.isArray(data)) {
    const build = (d: Datum, depth: number): Node => {
      const kids = childrenOf(d, children ?? 'children');
      if (kids) {
        const node = makeNode(d, labelOf(d, 0), depth);
        node.children = kids.map((k) => build(k, depth + 1));
        return node;
      }
      return leaf(d, depth);
    };
    return build(data, 0);
  }

  const root = makeNode({}, '', 0);
  root.children = data.map((d) => leaf(d, 1));
  return root;
}

function sum(node: Node): number {
  if (node.children.length === 0) return node.value;
  node.value = node.children.reduce((acc, c) => acc + sum(c), 0);
  return node.value;
}

function sortDesc(node: Node): void {
  node.children.sort((a, b) => b.value - a.value);
  node.children.forEach(sortDesc);
}

function assignGroups(root: Node): void {
  root.children.forEach((g, gi) => {
    const tag = (n: Node) => {
      n.groupIndex = gi;
      n.groupLabel = g.label;
      n.children.forEach(tag);
    };
    tag(g);
  });
}

function partitionAngles(node: Node, start: number, end: number, padAngle: number): void {
  node.startAngle = start;
  node.endAngle = end;

  if (node.children.length === 0) return;

  const total = node.value;
  if (total <= 0) {
    node.children.forEach((c) => {
      c.startAngle = start;
      c.endAngle = start;
    });
    return;
  }

  const k = (end - start - padAngle * node.children.length) / total;
  let cursor = start;

  for (const child of node.children) {
    const childSpan = child.value * k + padAngle;
    const childStart = cursor;
    const childEnd = cursor + childSpan - padAngle;
    partitionAngles(child, childStart, childEnd, padAngle);
    cursor += childSpan;
  }
}

function maxDepth(node: Node): number {
  if (node.children.length === 0) return node.depth;
  return Math.max(...node.children.map(maxDepth));
}

function flattenArcs(root: Node, opts: SunburstOptions): SunburstArc[] {
  const radius = Math.max(0, opts.radius);
  const centerHole =
    opts.innerRadius !== undefined && opts.innerRadius >= 1
      ? opts.innerRadius
      : radius * (opts.innerRadius ?? 0);

  const maxD = maxDepth(root);
  const ringWidth = maxD > 0 ? (radius - centerHole) / maxD : radius;

  const generator = d3arc();
  const arcs: SunburstArc[] = [];
  let leafIndex = 0;

  const walk = (node: Node, parentValue: number) => {
    if (node.depth > 0) {
      const innerR = centerHole + (node.depth - 1) * ringWidth;
      const outerR = centerHole + node.depth * ringWidth;

      const arcData = {
        startAngle: node.startAngle,
        endAngle: node.endAngle,
        innerRadius: innerR,
        outerRadius: outerR,
      };

      const pathStr = generator(arcData as never) ?? '';
      const cent = generator.centroid(arcData as never) as [number, number];

      arcs.push({
        startAngle: node.startAngle,
        endAngle: node.endAngle,
        innerR,
        outerR,
        path: pathStr,
        centroid: cent,
        depth: node.depth,
        isLeaf: node.children.length === 0,
        value: node.value,
        parentValue,
        label: node.label,
        data: node.data,
        index: node.children.length === 0 ? leafIndex++ : -1,
        groupIndex: node.groupIndex,
        groupLabel: node.groupLabel,
      });
    }

    for (const child of node.children) {
      walk(child, node.value);
    }
  };

  walk(root, 0);
  return arcs;
}

export function sunburstLayout(input: SunburstInput, opts: SunburstOptions): SunburstArc[] {
  const padAngle = opts.padAngle ?? 0.01;
  const radius = Math.max(0, opts.radius);

  if (radius <= 0) return [];

  let root = buildHierarchy(input);
  sum(root);
  sortDesc(root);
  assignGroups(root);

  // Handle bare leaf root (single record with no children)
  if (root.children.length === 0) {
    if (root.value <= 0) return [];
    const leafNode = root;
    root = makeNode({}, '', 0);
    root.children = [leafNode];
    leafNode.depth = 1;
    leafNode.groupIndex = 0;
    leafNode.groupLabel = leafNode.label;
  }

  partitionAngles(root, 0, 2 * Math.PI, padAngle);

  const arcs = flattenArcs(root, opts);
  return arcs.filter((a) => a.depth > 0);
}
