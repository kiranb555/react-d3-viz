# Design: Waterfall, Sankey, and Mekko Charts

**Date:** 2026-06-05  
**Scope:** Implementation of three new self-contained SVG chart types for react-d3-viz library  
**Status:** Design approved, ready for implementation planning

---

## Overview

Add three new chart types to the react-d3-viz library following the established architecture:
1. **Waterfall Chart** — cumulative flow visualization (revenue → costs → net income)
2. **Sankey Diagram** — flow between source/target nodes with varying link widths
3. **Mekko Chart** — stacked bars with varying column widths

All three charts will:
- Be **self-contained** (custom Svg roots, not CartesianChart-based)
- Have **pure-JS layout engines** in `src/core/` for geometry computation
- Support **React Native** via SVG primitives adapter
- Include **tooltips, legends, animations, theme customization**
- Handle **edge cases gracefully** (empty data, invalid links, extreme values)
- Pass **comprehensive tests** (unit + render + Storybook)
- Include **full documentation** in main repo and react-d3-viz-ui docs site

---

## Data Structures

### Waterfall Chart
```typescript
interface WaterfallDataPoint {
  label: string;
  value: number;         // positive or negative
  isTotal?: boolean;     // marks cumulative total segments
}

// Example data:
const data: WaterfallDataPoint[] = [
  { label: "Starting Value", value: 100 },
  { label: "Revenue", value: 50 },
  { label: "Costs", value: -20 },
  { label: "Net Income", value: 130, isTotal: true }
];
```

**Semantics:**
- `value` can be positive (increases) or negative (decreases)
- `isTotal=true` shows cumulative running total at that point
- Labels describe each step; values show the change amount

### Sankey Diagram
```typescript
interface SankeyNode {
  id: string | number;
  label: string;
}

interface SankeyLink {
  source: string | number;  // node id
  target: string | number;  // node id
  value: number;            // flow magnitude
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Example data:
const data: SankeyData = {
  nodes: [
    { id: "a", label: "Source A" },
    { id: "b", label: "Source B" },
    { id: "x", label: "Sink X" },
    { id: "y", label: "Sink Y" }
  ],
  links: [
    { source: "a", target: "x", value: 30 },
    { source: "a", target: "y", value: 20 },
    { source: "b", target: "x", value: 40 }
  ]
};
```

**Semantics:**
- Nodes represent sources, sinks, or intermediate stages
- Links represent flows with magnitude `value`
- Node positions computed to minimize link crossings

### Mekko Chart
```typescript
interface MekkoCategory {
  id?: string;
  label: string;
  value: number;  // width of the column (e.g., market size)
}

interface MekkoSeries {
  id: string;
  label: string;
  data: Array<{ categoryId: string; value: number }>;  // segment within each column
}

interface MekkoData {
  categories: MekkoCategory[];
  series: MekkoSeries[];
}

// Example data:
const data: MekkoData = {
  categories: [
    { label: "Q1", value: 100 },
    { label: "Q2", value: 150 },
    { label: "Q3", value: 120 }
  ],
  series: [
    {
      id: "product-a",
      label: "Product A",
      data: [
        { categoryId: "Q1", value: 40 },
        { categoryId: "Q2", value: 60 },
        { categoryId: "Q3", value: 50 }
      ]
    },
    {
      id: "product-b",
      label: "Product B",
      data: [
        { categoryId: "Q1", value: 60 },
        { categoryId: "Q2", value: 90 },
        { categoryId: "Q3", value: 70 }
      ]
    }
  ]
};
```

**Semantics:**
- Each category has a width proportional to its value (e.g., market size)
- Each series is stacked within categories
- Segment values represent portions (e.g., revenue share)

---

## Architecture

### Layout Computation (Core Modules)

Three pure-JS modules in `src/core/` handle all geometry:

#### **`src/core/waterfall.ts`**
```typescript
interface WaterfallLayoutResult {
  segments: Array<{
    label: string;
    startY: number;
    endY: number;
    height: number;
    isPositive: boolean;
    isTotal: boolean;
  }>;
  connectors: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  bounds: Bounds;
  runningTotals: number[];
}

function calculateWaterfallLayout(
  data: WaterfallDataPoint[],
  width: number,
  height: number,
  margin: Margin
): WaterfallLayoutResult;
```

**Responsibilities:**
- Compute running totals
- Map values to y-positions and heights
- Generate connector lines between segments
- Validate and handle edge cases

**Edge cases handled:**
- Empty array → empty layout
- All zeros → render at zero line
- All negative values → invert positions
- Single value → centered segment
- Extreme ratios (1:1000) → scale appropriately

#### **`src/core/sankey.ts`**
```typescript
interface SankeyLayoutResult {
  nodes: Array<{
    id: string | number;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  links: Array<{
    source: string | number;
    target: string | number;
    value: number;
    path: string;  // SVG path for curved link
    sourceY: number;
    targetY: number;
  }>;
  bounds: Bounds;
}

function calculateSankeyLayout(
  data: SankeyData,
  width: number,
  height: number,
  margin: Margin
): SankeyLayoutResult;
```

**Algorithm:**
- Iterative node positioning (minimize link crossings)
- Curved link paths (cubic Bézier)
- Node height proportional to total flow in/out
- Vertical stacking to avoid overlap

**Edge cases handled:**
- Orphaned nodes (no incoming/outgoing links) → position at edges
- Circular links → detect and handle gracefully
- Unbalanced flows (sources ≠ sinks) → still layout validly
- Single node → center it
- Empty data → return empty layout

#### **`src/core/mekko.ts`**
```typescript
interface MekkoLayoutResult {
  columns: Array<{
    label: string;
    x: number;
    width: number;
    segments: Array<{
      seriesId: string;
      seriesLabel: string;
      y: number;
      height: number;
      value: number;
    }>;
  }>;
  bounds: Bounds;
}

function calculateMekkoLayout(
  data: MekkoData,
  width: number,
  height: number,
  margin: Margin
): MekkoLayoutResult;
```

**Responsibilities:**
- Map category values to column widths (proportional)
- Stack series segments within each column
- Compute segment heights (proportional to value)
- Position columns left-to-right

**Edge cases handled:**
- Negative category widths → filter out, log warning
- Missing categories in series → treat as zero
- Empty series → skip series
- Single category → full width column
- Extreme width ratios → scale appropriately

### React Components

#### **`src/components/charts/WaterfallChart/`**
```
WaterfallChart.tsx          # Main component, owns state & rendering
Waterfall.tsx               # Series rendering (segments + connectors)
WaterfallChart.stories.tsx  # Storybook examples
```

**Props:**
```typescript
interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  width?: number | "auto";
  height?: number | "auto";
  aspect?: number;
  margin?: Margin;
  theme?: DeepPartial<ChartTheme>;
  colors?: string[];
  animate?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
  onSegmentHover?: (label: string | null) => void;
}
```

#### **`src/components/charts/SankeyDiagram/`**
```
SankeyDiagram.tsx           # Main component
SankeyNode.tsx              # Individual node rendering
SankeyLink.tsx              # Link path rendering
SankeyDiagram.stories.tsx   # Storybook examples
```

**Props:**
```typescript
interface SankeyDiagramProps {
  data: SankeyData;
  width?: number | "auto";
  height?: number | "auto";
  aspect?: number;
  margin?: Margin;
  theme?: DeepPartial<ChartTheme>;
  colors?: string[];
  animate?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  nodeColors?: Record<string | number, string>;
  valueFormatter?: (value: number) => string;
  onNodeHover?: (nodeId: string | number | null) => void;
}
```

#### **`src/components/charts/MekkoChart/`**
```
MekkoChart.tsx              # Main component
MekkoBar.tsx                # Individual column rendering
MekkoChart.stories.tsx      # Storybook examples
```

**Props:**
```typescript
interface MekkoChartProps {
  data: MekkoData;
  width?: number | "auto";
  height?: number | "auto";
  aspect?: number;
  margin?: Margin;
  theme?: DeepPartial<ChartTheme>;
  colors?: string[];
  animate?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  categoryLabelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
  onSegmentHover?: (seriesId: string | null) => void;
}
```

### Shared Interactivity Infrastructure

**New hook: `src/hooks/useChartInteractivity.ts`**
```typescript
interface UseChartInteractivityOptions {
  data: any;
  width: number;
  height: number;
}

function useChartInteractivity<T>(options: UseChartInteractivityOptions) {
  return {
    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
    tooltipPosition: { x: number; y: number } | null;
    setTooltipPosition: (pos: { x: number; y: number } | null) => void;
    visibleSeries: Set<string>;
    toggleSeriesVisibility: (seriesId: string) => void;
    animationProgress: number;  // 0-1 for enter animation
  };
}
```

This hook provides:
- Hover state management (for tooltips)
- Tooltip positioning
- Interactive legend (toggle series visibility)
- Animation frame tracking (0-1 for enter animations)

All three charts use this hook to avoid code duplication.

---

## Features

### Interactivity
- **Tooltips**: SVG-based, appear on hover/tap, show value + label + series info
- **Legends**: Interactive bottom legend, tap to toggle series visibility
- **Highlight**: Hovered segments/nodes highlight; others fade
- **Accessibility**: All interactive elements respond to keyboard (tab, enter)

### Animations
- **Enter animation**: 300ms on mount (fade + scale)
- **Data transition**: 500ms when data changes
- **Controllable**: `animate` prop to disable/enable

### Theme Customization
- **Colors**: Via theme palette or `colors` prop
- **Fonts**: Title, label, value fonts from theme
- **Spacing**: Margins, padding from theme
- **Animation config**: Duration, easing from theme

### Responsive Sizing
- **`width="auto"`** (default): Renders at 100%, measures laid-out width, re-renders with pixel value
- **`height="auto"`**: Derived from `aspect` prop (default 3:4 ratio)
- **Numeric values**: Skip measurement, render immediately

### Error Handling

All three charts handle errors gracefully:

| Error | Behavior |
|-------|----------|
| Empty data | Render empty state message |
| Null/undefined data | Show "No data available" |
| Invalid node links (Sankey) | Skip invalid links, render valid graph |
| Negative widths (Mekko) | Filter out, log warning |
| Extreme values | Scale appropriately, adjust domain |
| Container too small | Render at minimum size, show overflow warning |

---

## Testing Strategy

### Unit Tests (e.g., `test/waterfall.test.ts`)
```typescript
describe("calculateWaterfallLayout", () => {
  it("computes correct running totals");
  it("handles negative values");
  it("handles empty data");
  it("handles single value");
  it("computes correct segment heights");
  it("generates connector lines");
  it("bounds are correct");
  it("handles extreme ratios");
  it("performance: 1000 segments < 100ms");
});
```

### Render Tests (`test/render.test.tsx`)
```typescript
describe("WaterfallChart", () => {
  it("renders without crashing");
  it("renders correct number of segments");
  it("tooltip appears on hover");
  it("legend toggles series visibility");
  it("animations run on mount");
  it("error state displays gracefully");
});
```

### Storybook Integration
- 5 stories per chart (basic, complex, edge cases, performance, theme)
- Interactive controls for theme/size/animation
- Real-world data examples
- Performance monitoring logged to console

---

## Storybook Examples

### Waterfall Chart Stories
1. **Basic Waterfall** — simple 4-step flow (revenue/costs/net)
2. **Multi-step** — 10+ steps with subtotals
3. **Negative Values** — losses and recoveries
4. **Large Dataset** — 100+ steps, performance test
5. **Custom Theme** — dark mode, custom colors

### Sankey Diagram Stories
1. **Simple Flow** — 3-4 nodes, 4-5 links
2. **Complex Network** — 15+ nodes, multi-hop flows
3. **Unbalanced Flow** — sources ≠ sinks
4. **Large Dataset** — 100+ nodes, 200+ links
5. **Custom Colors** — per-node color customization

### Mekko Chart Stories
1. **Basic Mekko** — 4 categories × 3 series
2. **Many Categories** — 20+ categories, varying widths
3. **Extreme Ratios** — 1:100 width ratios
4. **Large Dataset** — 50+ categories, 10+ series
5. **Custom Theme** — dark mode, custom colors

---

## Documentation

### Main Repo (`react-d3-viz`)
- **README.md** — add charts to features list, quick-start example for each
- **JSDoc comments** — on all exported types, components, core functions
- **CHANGELOG.md** — entry for new charts (v1.1.0)
- **Type exports** — export all data types from `src/index.ts`

### Docs Site (`react-d3-viz-ui`)
- **Waterfall Chart page** — overview, API reference, examples
- **Sankey Diagram page** — overview, API reference, examples
- **Mekko Chart page** — overview, API reference, examples
- **API reference pages** — all props, data structures, callback signatures
- **Interactive playground** — live examples with editable data + props
- **Migration guide** — if any related (none expected)

---

## File Structure (Summary)

```
src/
├── core/
│   ├── waterfall.ts              # Layout computation
│   ├── sankey.ts                 # Layout computation
│   ├── mekko.ts                  # Layout computation
├── components/
│   └── charts/
│       ├── WaterfallChart/
│       │   ├── WaterfallChart.tsx
│       │   ├── Waterfall.tsx
│       │   └── WaterfallChart.stories.tsx
│       ├── SankeyDiagram/
│       │   ├── SankeyDiagram.tsx
│       │   ├── SankeyNode.tsx
│       │   ├── SankeyLink.tsx
│       │   └── SankeyDiagram.stories.tsx
│       └── MekkoChart/
│           ├── MekkoChart.tsx
│           ├── MekkoBar.tsx
│           └── MekkoChart.stories.tsx
├── hooks/
│   └── useChartInteractivity.ts   # Shared interactivity
└── index.ts                       # Export all 3 new charts

test/
├── waterfall.test.ts              # Unit tests
├── sankey.test.ts                 # Unit tests
├── mekko.test.ts                  # Unit tests
└── render.test.tsx                # Add render cases for all 3
```

---

## Implementation Order

1. **Core layout modules** (waterfall → sankey → mekko)
   - Pure-JS, heavily tested
   - No dependencies on React or components
   
2. **Shared interactivity hook** (`useChartInteractivity.ts`)
   - Used by all three components
   
3. **Component implementations** (waterfall → sankey → mekko)
   - Render components using core + hook
   - Add unit tests + Storybook stories
   
4. **Documentation updates**
   - Main repo: README, index.ts exports
   - Docs site: full pages + examples
   
5. **Testing & validation**
   - All tests pass
   - Storybook examples work
   - React Native compatibility verified

---

## Success Criteria

✅ All three charts render correctly with example data  
✅ Unit tests pass (>95% coverage on core modules)  
✅ Render tests pass (React + React Native)  
✅ Storybook stories work and show all variants  
✅ Error handling tested (invalid data, edge cases)  
✅ Performance verified (1000 nodes/segments < 100ms)  
✅ React Native support verified (via primitives adapter)  
✅ Responsive sizing works (`width="auto"`, `aspect`)  
✅ Tooltips, legends, animations all functional  
✅ Documentation complete (main repo + docs site)  
✅ All npm scripts pass: `npm test`, `npm run build`, `npm run lint`

---

## Notes

- Charts follow existing repo patterns: pure-JS core + React render layer
- All three are self-contained (custom Svg roots, not CartesianChart-based)
- No new dependencies required (use existing d3-scale, d3-shape, d3-array)
- React Native support is built-in (SVG primitives adapter handles platform differences)
- Documentation must be kept in sync across both repos (main + docs site)
