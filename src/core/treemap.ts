/**
 * Treemap layout — pure JS, no DOM, no `d3-hierarchy`.
 *
 * Normalizes flat / grouped / nested input into a hierarchy, sums values
 * bottom-up, sorts siblings, and tiles each node with the squarified algorithm
 * (Bruls / Huizing / van Wijk — the same one `d3.treemapSquarify` uses) so cells
 * stay close to square. Returns flat rectangles ready to render as `<Rect>`s.
 *
 * Kept dependency-free (like `core/ticks.ts` / `core/bounds.ts`) so it runs
 * unchanged on web and React Native.
 */
import type { Datum } from './types';
import { getNumber, getCategory, type Accessor } from './accessors';

/** Accessor for a node's children: a key into the datum, or a function. */
export type ChildrenAccessor = string | ((d: Datum) => Datum[] | undefined);

export interface TreemapInput {
  /** A flat array of records, or a single nested root record. */
  data: Datum[] | Datum;
  /** Numeric size of each (leaf) cell. */
  value: Accessor<number>;
  /** Cell label (text + tooltip). */
  label?: Accessor<unknown>;
  /** Flat data only: group records into a 2-level treemap, colored by group. */
  group?: Accessor<unknown>;
  /** Nested data only: how to read a record's children. Default key `"children"`. */
  children?: ChildrenAccessor;
}

export interface TreemapOptions {
  width: number;
  height: number;
  /** Gap between sibling cells, in px. Default 1. */
  paddingInner?: number;
  /** Gap inside a parent before its children, in px. Default 0. */
  paddingOuter?: number;
  /** Header band reserved at the top of each group (depth >= 1). Default 0. */
  paddingTop?: number;
}

export interface TreemapRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** 0 = root, 1 = top-level group, deeper = nested leaves. */
  depth: number;
  isLeaf: boolean;
  /** Summed value for internal nodes; own value for leaves. */
  value: number;
  label: string;
  data: Datum;
  /** Stable index among leaves (render order). -1 for internal nodes. */
  index: number;
  /** Index of the top-level (depth-1) ancestor — drives the leaf color. */
  groupIndex: number;
  groupLabel: string;
}

interface Node {
  data: Datum;
  label: string;
  value: number;
  depth: number;
  children: Node[];
  x0: number;
  y0: number;
  x1: number;
  y1: number;
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
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
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

/** Build the internal hierarchy from any of the three supported input shapes. */
function buildHierarchy(input: TreemapInput): Node {
  const { data, value, label, group, children } = input;
  const labelOf = (d: Datum, i: number) => (label ? getCategory(d, label, i) : '');
  const leafCounter = { i: 0 };

  const leaf = (d: Datum, depth: number): Node => {
    const node = makeNode(d, labelOf(d, leafCounter.i), depth);
    const v = getNumber(d, value, leafCounter.i);
    node.value = Number.isFinite(v) && v > 0 ? v : 0;
    leafCounter.i++;
    return node;
  };

  // Nested: a single root object with a children accessor.
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

  // Grouped (2-level): bucket flat records by their group value, order preserved.
  if (group) {
    const groups = new Map<string, Node>();
    data.forEach((d, i) => {
      const key = getCategory(d, group, i);
      let g = groups.get(key);
      if (!g) {
        g = makeNode(d, key, 1);
        groups.set(key, g);
        root.children.push(g);
      }
      g.children.push(leaf(d, 2));
    });
    return root;
  }

  // Flat single-level: each record is a depth-1 leaf.
  root.children = data.map((d) => leaf(d, 1));
  return root;
}

/** Post-order sum: internal node value = Σ children. */
function sum(node: Node): number {
  if (node.children.length === 0) return node.value;
  node.value = node.children.reduce((acc, c) => acc + sum(c), 0);
  return node.value;
}

/** Sort siblings descending by value (matches d3's default treemap ordering). */
function sortDesc(node: Node): void {
  node.children.sort((a, b) => b.value - a.value);
  node.children.forEach(sortDesc);
}

/** Tag every node with the index/label of its top-level (depth-1) ancestor. */
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

/** Worst (largest) aspect ratio in a row of areas laid along `side`. */
function worstRatio(areas: number[], side: number): number {
  let total = 0;
  let max = -Infinity;
  let min = Infinity;
  for (const a of areas) {
    total += a;
    if (a > max) max = a;
    if (a < min) min = a;
  }
  const s2 = total * total;
  const side2 = side * side;
  return Math.max((side2 * max) / s2, s2 / (side2 * min));
}

/** Squarify a node's children into [x0,y0,x1,y1], then recurse into each child. */
function squarify(
  node: Node,
  opts: Required<Pick<TreemapOptions, 'paddingOuter' | 'paddingTop'>>,
): void {
  if (node.children.length === 0) return;

  const topInset = node.depth >= 1 ? opts.paddingTop : 0;
  const x0 = node.x0 + opts.paddingOuter;
  const y0 = node.y0 + opts.paddingOuter + topInset;
  const x1 = node.x1 - opts.paddingOuter;
  const y1 = node.y1 - opts.paddingOuter;

  // Positive-value children get tiled; zero-value ones collapse to a point.
  const positives = node.children.filter((c) => c.value > 0);
  node.children.forEach((c) => {
    if (c.value <= 0) setRect(c, x0, y0, x0, y0);
  });

  if (positives.length === 0 || x1 <= x0 || y1 <= y0) {
    positives.forEach((c) => setRect(c, x0, y0, x0, y0));
    return;
  }

  const total = positives.reduce((acc, c) => acc + c.value, 0);
  const scale = ((x1 - x0) * (y1 - y0)) / total;
  const area = (c: Node) => c.value * scale;

  let cx0 = x0;
  let cy0 = y0;
  let i = 0;
  while (i < positives.length) {
    const freeW = x1 - cx0;
    const freeH = y1 - cy0;
    const side = Math.min(freeW, freeH);

    // Grow the row while the worst aspect ratio keeps improving.
    const rowAreas: number[] = [area(positives[i])];
    let best = worstRatio(rowAreas, side);
    let j = i + 1;
    while (j < positives.length) {
      const next = worstRatio([...rowAreas, area(positives[j])], side);
      if (next > best) break;
      rowAreas.push(area(positives[j]));
      best = next;
      j++;
    }

    const rowSum = rowAreas.reduce((acc, a) => acc + a, 0);
    const thickness = rowSum / side;
    if (freeW <= freeH) {
      // Lay the row left-to-right across the top of the free area.
      let px = cx0;
      for (let k = i; k < j; k++) {
        const w = area(positives[k]) / thickness;
        setRect(positives[k], px, cy0, Math.min(px + w, x1), cy0 + thickness);
        px += w;
      }
      cy0 += thickness;
    } else {
      // Lay the row top-to-bottom down the left of the free area.
      let py = cy0;
      for (let k = i; k < j; k++) {
        const h = area(positives[k]) / thickness;
        setRect(positives[k], cx0, py, cx0 + thickness, Math.min(py + h, y1));
        py += h;
      }
      cx0 += thickness;
    }
    i = j;
  }

  node.children.forEach((c) => squarify(c, opts));
}

function setRect(node: Node, x0: number, y0: number, x1: number, y1: number): void {
  node.x0 = x0;
  node.y0 = y0;
  node.x1 = x1;
  node.y1 = y1;
}

/**
 * Compute a treemap layout. Returns every leaf rect plus the internal group
 * rects (depth >= 1) so callers can optionally draw group headers; filter by
 * `isLeaf` for the flare-style "leaves only" look.
 */
export function treemapLayout(input: TreemapInput, opts: TreemapOptions): TreemapRect[] {
  const paddingInner = opts.paddingInner ?? 1;
  const paddingOuter = opts.paddingOuter ?? 0;
  const paddingTop = opts.paddingTop ?? 0;
  const width = Math.max(0, opts.width);
  const height = Math.max(0, opts.height);

  const root = buildHierarchy(input);
  sum(root);
  sortDesc(root);
  assignGroups(root);

  setRect(root, 0, 0, width, height);

  // A bare leaf root (single record, no children) fills the whole area.
  if (root.children.length === 0) {
    if (root.value <= 0 || width <= 0 || height <= 0) return [];
    root.index = 0;
    root.groupIndex = 0;
    root.groupLabel = root.label;
    return [toRect(root, true, 0)];
  }

  squarify(root, { paddingOuter, paddingTop });

  // Flatten in render order; inset leaves by half the inner padding for gaps.
  const rects: TreemapRect[] = [];
  const inset = paddingInner / 2;
  let leafIndex = 0;
  const walk = (node: Node) => {
    for (const c of node.children) {
      if (c.children.length === 0) {
        const x0 = c.x0 + inset;
        const y0 = c.y0 + inset;
        const x1 = Math.max(x0, c.x1 - inset);
        const y1 = Math.max(y0, c.y1 - inset);
        rects.push({
          x0,
          y0,
          x1,
          y1,
          depth: c.depth,
          isLeaf: true,
          value: c.value,
          label: c.label,
          data: c.data,
          index: leafIndex++,
          groupIndex: c.groupIndex,
          groupLabel: c.groupLabel,
        });
      } else {
        rects.push(toRect(c, false, -1));
        walk(c);
      }
    }
  };
  walk(root);
  return rects;
}

function toRect(node: Node, isLeaf: boolean, index: number): TreemapRect {
  return {
    x0: node.x0,
    y0: node.y0,
    x1: node.x1,
    y1: node.y1,
    depth: node.depth,
    isLeaf,
    value: node.value,
    label: node.label,
    data: node.data,
    index,
    groupIndex: node.groupIndex,
    groupLabel: node.groupLabel,
  };
}
