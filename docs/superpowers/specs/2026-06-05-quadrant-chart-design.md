# Quadrant Chart Design Specification

**Date:** 2026-06-05  
**Author:** Claude Code  
**Status:** Approved

## Overview

A production-ready Quadrant Chart component for the react-d3-viz library. The chart displays 2D scatter data divided into four quadrants by configurable threshold lines (X and Y axes). It supports optional bubble sizing for a third dimension, multiple series, custom quadrant labels, and fully customizable styling per quadrant.

## Goals

1. Add a new Quadrant chart to the library following established patterns
2. Support both automatic (mean/median) and custom threshold positioning
3. Enable flexible customization of quadrant styling and labels
4. Maintain feature parity with existing Cartesian charts (legend, tooltip, animation, responsive sizing)
5. Works on both React (web) and React Native via shared compute + platform adapters

## Requirements

### Core Features

1. **Quadrant Dividers**
   - Two perpendicular lines (X and Y thresholds) that divide the chart into 4 quadrants
   - Threshold modes: `mean` (default), `median`, or `custom` (user-specified values)
   - Customizable stroke color, width, and style per divider/quadrant

2. **Quadrant Labeling**
   - Optional custom labels for each quadrant (top-left, top-right, bottom-left, bottom-right)
   - Positioned inside each quadrant (1/4 inset from corners)
   - Respects theme typography and colors

3. **Data Rendering**
   - Points rendered as circles, positioned by x and y values
   - Optional third dimension via bubble `size` accessor (uses sqrt scale, like BubbleChart)
   - Supports multiple series with legend toggle (inherited from CartesianChart)
   - Single series if no `series` prop provided

4. **Styling & Customization**
   - Per-quadrant background color and opacity
   - Per-quadrant divider color and stroke width
   - Sensible defaults matching the theme
   - Animation support (enter animation for points)

5. **Interactivity**
   - Hover highlight on individual points
   - Series toggle via legend
   - SVG tooltip on hover (inherited from CartesianChart)
   - Responsive sizing (width="auto" supported)

6. **Props**
   - All `BaseCartesianProps`: `data`, `x`, `y`, `series` or `y` shorthand, `width`, `height`, `margin`, `theme`, `animate`, formatters, etc.
   - `thresholdMode`: 'mean' | 'median' | 'custom' (default: 'mean')
   - `thresholdX`, `thresholdY`: required if `thresholdMode='custom'`
   - `quadrantLabels`: [string, string, string, string] (TL, TR, BL, BR) - optional
   - `showQuadrantLabels`: boolean (default: true)
   - `size`: Accessor<number> - optional (for bubble sizing)
   - `radiusRange`: [number, number] (default: [4, 28])
   - `pointRadius`: number - used if size not provided
   - `categoricalX`: boolean - treat X as categorical (default: false)

## Architecture

### File Structure

```
src/components/charts/QuadrantChart/
├── QuadrantChart.tsx           # Main component
├── Quadrants.tsx               # Background + divider rendering
├── Points.tsx                  # Data point circles
└── QuadrantChart.stories.tsx   # Storybook

src/core/
├── quadrant.ts                 # Pure JS compute helpers

test/
├── quadrant.test.ts            # Unit tests for compute
└── render.test.tsx             # Add render test case
```

### Design Patterns

1. **Extends CartesianChart** — leverages the standard Cartesian frame (axes, scales, legend, tooltip, hover state)
2. **Separates compute from render** — `src/core/quadrant.ts` handles all threshold and quadrant calculations
3. **SVG-native primitives** — uses `Rect`, `Line`, `Circle`, `SvgText` from `../../../primitives`
4. **ChartContext usage** — reads `xPixel`, `yPixel`, `data`, `theme`, `active` from chart context
5. **Animation via useAnimatedValue** — optional enter animation for points

### Component Hierarchy

```
QuadrantChart
├── CartesianChart
    ├── Grid
    ├── Quadrants (renderSeries callback)
    │   ├── Rect (quadrant backgrounds, 4x)
    │   ├── Line (dividers, 2x)
    │   └── SvgText (labels, 4x)
    ├── Points (renderSeries callback)
    │   └── Circle (data points, Nx)
    ├── XAxis
    ├── YAxis
    ├── Legend
    └── Tooltip
```

## Core Compute (`src/core/quadrant.ts`)

### Types

```typescript
export interface QuadrantStyle {
  dividerStroke: string;
  dividerStrokeWidth: number;
  backgroundColor: string;
  backgroundOpacity: number;
}

export type ThresholdMode = 'mean' | 'median' | 'custom';

export interface ThresholdConfig {
  mode: ThresholdMode;
  customX?: number;
  customY?: number;
}
```

### Functions

1. **`calculateThresholds(values: number[], mode: ThresholdMode): number`**
   - Takes array of numeric values and threshold mode
   - Returns single threshold value
   - For 'mean': arithmetic mean
   - For 'median': middle value when sorted

2. **`getQuadrant(value: number, threshold: number): -1 | 1`**
   - Returns -1 if value < threshold, 1 if value >= threshold
   - Used to determine quadrant membership

3. **`getQuadrantIndex(x: number, xThreshold: number, y: number, yThreshold: number): 0 | 1 | 2 | 3`**
   - 0 = top-left (x < xThreshold, y >= yThreshold)
   - 1 = top-right (x >= xThreshold, y >= yThreshold)
   - 2 = bottom-left (x < xThreshold, y < yThreshold)
   - 3 = bottom-right (x >= xThreshold, y < yThreshold)

4. **`defaultQuadrantStyles(theme: ChartTheme): QuadrantStyle[]`**
   - Returns array of 4 styles with sensible defaults
   - Uses theme colors and styling

## Implementation Details

### QuadrantChart.tsx

```typescript
export interface QuadrantChartProps extends BaseCartesianProps {
  thresholdMode?: 'mean' | 'median' | 'custom';
  thresholdX?: number;
  thresholdY?: number;
  quadrantLabels?: [string, string, string, string];
  showQuadrantLabels?: boolean;
  size?: Accessor<number>;
  radiusRange?: [number, number];
  pointRadius?: number;
  categoricalX?: boolean;
  quadrantStyles?: Partial<QuadrantStyle>[];
}

export function QuadrantChart(props: QuadrantChartProps) {
  // Resolve series (handles y shorthand)
  // Calculate thresholds based on mode
  // Merge quadrant styles with defaults
  // Return CartesianChart with custom renderSeries
}
```

### Quadrants.tsx

Renders as a single SVG group containing:
- 4 background rectangles (one per quadrant)
- 2 divider lines (X and Y)
- 4 text labels (if enabled)

All positioned using `xPixel`/`yPixel` from ChartContext.

### Points.tsx

Renders circles for each data point:
- Optional animation (radius scales 0→1 on mount)
- Hover highlight via `active` state from ChartContext
- Optional bubble sizing (uses sqrt scale like BubbleChart)
- Color determined by series

### Storybook Stories

1. **Default** — mean-based thresholds, no custom labels
2. **Custom Thresholds** — user-specified X/Y thresholds
3. **With Bubble Size** — third dimension encoded as radius
4. **Custom Labels** — descriptive quadrant labels
5. **Custom Styling** — colored quadrant backgrounds and dividers
6. **Multiple Series** — shows legend toggle
7. **No Animation** — demonstrates animation=false

## Testing Strategy

### Unit Tests (`test/quadrant.test.ts`)

- Threshold calculation (mean, median)
- Quadrant membership logic
- Edge cases (duplicate values, single value, negatives)

### Render Tests (`test/render.test.tsx`)

- Add case: QuadrantChart renders without errors
- Snapshot test of output SVG structure

### Manual Testing (Storybook)

- All 7 story variants
- Responsive sizing (width="auto")
- Legend toggle on multiple series
- Hover interactions

## Integration Checklist

1. ✅ Export from `src/index.ts`
2. ✅ Add demo card to `src/App.tsx`
3. ✅ Add chart to `screenshots/Gallery.tsx` + `scripts/shots.mjs`
4. ✅ Add to README charts list
5. ✅ Update CLAUDE.md "Charts" section
6. 🚧 **Separate task:** Update react-d3-viz-ui docs site (flag for follow-up)

## Non-Goals

- 3D quadrant charts (use BubbleChart for 3rd dimension)
- Animated transitions between threshold changes (static after mount)
- Tooltips with quadrant aggregates (use standard tooltip)
- Custom quadrant shapes (always rectangular)

## Success Criteria

1. Component renders correctly on web and React Native (via `.native.tsx` primitives resolution)
2. All 7 Storybook stories pass
3. Unit tests pass (threshold logic, quadrant membership)
4. Render tests pass
5. `npm run lint`, `npm test`, `npm run build` all pass
6. Works with responsive sizing (width="auto")
7. Animation works (enter animation when animate=true)
8. Legend toggle works for multiple series
