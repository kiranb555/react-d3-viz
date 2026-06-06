# Comprehensive Documentation & npm Package Update Design

**Date:** 2026-06-06  
**Scope:** Update README.md, package.json, and react-d3-viz-ui repository with exhaustive chart documentation, Storybook examples, and interactive playground variants.

---

## Overview

This spec covers a three-part documentation overhaul:
1. **This repo (react-d3-viz):** README.md and package.json updates
2. **react-d3-viz-ui repo:** Comprehensive documentation pages, Storybook stories, and examples covering all 17 chart types with exhaustive prop variants

---

## Part 1: README.md Updates (react-d3-viz)

### Current State
- Lists 15 chart types by name (missing HeatmapChart, SunburstChart)
- Shows 8 visual examples in a table (duplicates Radar, missing new charts)
- Has basic installation and usage snippets
- Mentions "New in v1.1.0" (Waterfall, Sankey, Mekko) and "New in v1.2.0" (Butterfly)

### Changes

#### 1.1 Charts List
**Current:**
```
LineChart · AreaChart · BarChart (grouped & stacked) · ScatterPlot · BubbleChart · 
PieChart (+ donut) · QuadrantChart · Histogram · RadarChart · TreemapChart (flat, grouped & nested) · 
WaterfallChart · SankeyDiagram · MekkoChart · ButterflyChart · HeatmapChart
```

**Updated to include:**
- Add **SunburstChart** to the list
- Clarify what each supports: e.g., "SunburstChart (hierarchical with drill-down)"

#### 1.2 Visual Showcase Table
Replace the current 3×2 table with a 2×9 table showing all 17 charts:
- Each row: chart name + screenshot
- Include variants: BarChart (grouped + stacked), PieChart (pie + donut), TreemapChart (nested), SunburstChart
- All images should exist in `assets/` or generated fresh via `npm run shots`

#### 1.3 Chart Variants Section (New)
Add a table after the visual showcase:

| Chart | Variants | Key Props |
|-------|----------|-----------|
| LineChart | Single series, multi-series, multi-Y axis | `showPoints`, `curve`, `strokeWidth` |
| AreaChart | Single series, multi-series, stacked | `curve`, `fillOpacity`, `stacked` |
| BarChart | Grouped, stacked, horizontal | `stacked`, `horizontal`, `margin` |
| ScatterPlot | Single series, multi-series, with sizes | `showPointLabels`, `sizeAccessor` |
| BubbleChart | Fixed/dynamic bubble sizes | `sizeAccessor`, `sizeScale` |
| PieChart | Pie, donut, with labels, with values | `innerRadius`, `showLabel`, `showValue` |
| QuadrantChart | 4-quadrant scatter with dividers | `quadrants`, `dividerColor` |
| Histogram | Various bin counts | `binCount`, `showCounts` |
| RadarChart | Radar, closed, with points | `showPoints`, `closed` |
| TreemapChart | Flat, grouped, nested hierarchies | `group`, `childrenKey`, `nested` |
| SunburstChart | Multi-level, drill-down, animations | `childrenKey`, `drill`, `animate` |
| HeatmapChart | Color scales, custom ranges | `colorScale`, `cellSize` |
| WaterfallChart | Cumulative flows with totals | `isTotal`, `positiveColor`, `negativeColor` |
| SankeyDiagram | Flows between nodes | `nodeWidth`, `nodePadding`, `colors` |
| MekkoChart | Varying column widths | `categories`, `series` |
| ButterflyChart | Horizontal back-to-back bars | `leftColor`, `rightColor`, `showValues` |

#### 1.4 Update "New in" Sections
- Consolidate v1.1.0 and v1.2.0 into a single "Latest Additions" section
- Add a "New in v1.3.0" section highlighting SunburstChart and HeatmapChart (if recent)
- Each chart entry includes: use case + minimal code snippet

#### 1.5 Responsive Sizing & React Native Sections
- Keep existing content (unchanged, still relevant)
- Ensure React Native section shows the same 17 charts are supported

---

## Part 2: package.json Updates (react-d3-viz)

### Changes

#### 2.1 Description Field
**Current:**
```
"description": "Cross-platform SVG charts for React (web) and React Native — one API, one codebase."
```

**Updated:**
```
"description": "Cross-platform SVG charts for React & React Native: LineChart, AreaChart, BarChart, ScatterPlot, BubbleChart, PieChart, QuadrantChart, Histogram, RadarChart, TreemapChart, SunburstChart, HeatmapChart, WaterfallChart, SankeyDiagram, MekkoChart, ButterflyChart + theming, tooltips, legends, animations."
```

#### 2.2 Keywords (if not present)
Add or update:
```json
"keywords": [
  "charts",
  "visualization",
  "d3",
  "react",
  "react-native",
  "svg",
  "cross-platform",
  "line",
  "area",
  "bar",
  "pie",
  "scatter",
  "heatmap",
  "sankey",
  "waterfall",
  "treemap",
  "sunburst"
]
```

---

## Part 3: react-d3-viz-ui Repository Updates

### Current State
Assumption: repo has basic structure with Storybook, docs, examples. Will need to audit structure on first pass.

### 3.1 Directory Structure

```
react-d3-viz-ui/
├── docs/
│   ├── charts/
│   │   ├── LineChart.md
│   │   ├── AreaChart.md
│   │   ├── BarChart.md
│   │   ├── ScatterPlot.md
│   │   ├── BubbleChart.md
│   │   ├── PieChart.md
│   │   ├── QuadrantChart.md
│   │   ├── Histogram.md
│   │   ├── RadarChart.md
│   │   ├── TreemapChart.md
│   │   ├── SunburstChart.md
│   │   ├── HeatmapChart.md
│   │   ├── WaterfallChart.md
│   │   ├── SankeyDiagram.md
│   │   ├── MekkoChart.md
│   │   └── ButterflyChart.md
│   └── index.md (Chart reference index)
├── src/stories/
│   ├── LineChart.stories.tsx
│   ├── AreaChart.stories.tsx
│   ├── BarChart.stories.tsx
│   ├── ... (one per chart)
│   └── ButterflyChart.stories.tsx
└── src/examples/ (if separate from stories)
    └── ... (interactive playground examples)
```

### 3.2 Per-Chart Documentation Pages (`docs/charts/<ChartName>.md`)

Each page follows this structure:

#### 3.2.1 Header & Quick Links
```markdown
# LineChart

**Use Case:** Display trends over time or continuous data series.

[Playground](#) · [Storybook](#) · [GitHub](link-to-chart-source)
```

#### 3.2.2 Description & Features
- 2-3 sentence explanation
- When to use this chart vs. similar ones
- Key features (animations, tooltips, legend, etc.)

#### 3.2.3 Visual Examples
- Screenshots of main variants
- GIFs of animations if applicable

#### 3.2.4 Basic Usage
```tsx
// Single series
<LineChart data={data} x="month" y="sales" width={600} height={300} />

// Multi-series
<LineChart data={data} x="month" series={[...]} width={600} height={300} />

// With custom theme
<LineChart data={data} x="month" y="sales" theme={...} />
```

#### 3.2.5 Variants Table
For each chart's major variants (e.g., LineChart: single-series, multi-series, area fill, step-curve):

| Variant | Key Props | Code |
|---------|-----------|------|
| Single Series | `x`, `y` | `<LineChart data={data} x="x" y="y" />` |
| Multi-Series | `x`, `series` | `<LineChart data={data} x="x" series={[...]} />` |
| With Points | `showPoints` | `<LineChart data={data} x="x" y="y" showPoints />` |
| ... | ... | ... |

#### 3.2.6 Complete Props Reference
Table with all props, types, defaults, and descriptions:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | — | Data array |
| `x` | `Accessor<T>` | — | X-axis accessor |
| `y` | `Accessor<T>` | — | Y-axis accessor (shorthand) |
| ... | ... | ... | ... |

#### 3.2.7 Advanced Examples
- Custom colors & theme
- Responsive sizing
- Performance tips (large datasets)
- React Native usage

#### 3.2.8 Best Practices & Tips
- When to use vs. avoid
- Performance considerations
- Accessibility notes
- Common pitfalls

---

### 3.3 Storybook Stories (`src/stories/<ChartName>.stories.tsx`)

#### 3.3.1 Story Structure (per chart)
Each chart gets **one `.stories.tsx` file** with multiple named stories:

```tsx
export const LineChartSingleSeries = () => {...};
export const LineChartMultiSeries = () => {...};
export const LineChartWithAnimation = () => {...};
export const LineChartResponsive = () => {...};
export const LineChartCustomTheme = () => {...};
// ... one story per significant variant
```

#### 3.3.2 Interactive Controls (Knobs/Args)
Every story uses Storybook's `args` + `argTypes` for interactive prop control:

```tsx
export const LineChartMultiSeries = {
  args: {
    showPoints: false,
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    animate: true,
    curve: 'monotone',
  },
  argTypes: {
    showPoints: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    curve: { control: { type: 'select', options: ['linear', 'monotone', 'step'] } },
    animate: { control: 'boolean' },
  },
};
```

#### 3.3.3 Coverage Goals
- At least 5-7 stories per Cartesian chart (line, area, bar, scatter, bubble)
- At least 3-5 stories per radial/hierarchical chart (pie, radar, treemap, sunburst)
- Stories cover: default state, all major prop combinations, edge cases, responsive behavior

#### 3.3.4 Live Code Editor Integration
Each story should support **inline code editing** (Storybook's `DocsPage` or custom wrapper):
- User can edit the props/code in real-time
- Chart updates immediately
- User can copy the modified code

---

### 3.4 Examples/Playground Section

#### 3.4.1 Structure
Create an "Examples" or "Playground" page that lists all 17 charts with:
- Interactive demo
- Copy-paste code snippet
- Link to full documentation
- Link to Storybook story

#### 3.4.2 Preset Examples (Dashboard-style)
Provide 3-5 pre-built "dashboard" examples:
- **Sales Dashboard:** LineChart + BarChart + PieChart
- **Hierarchy Demo:** TreemapChart + SunburstChart
- **Comparison View:** ButterflyChart + RadarChart
- **Flow Analysis:** SankeyDiagram + WaterfallChart
- **Multi-Dimensional:** ScatterPlot + BubbleChart + HeatmapChart

#### 3.4.3 Gallery
Visual grid of all 17 charts with screenshots, one-click to open in playground.

---

### 3.5 Package.json Sync
Update `react-d3-viz-ui/package.json`:
- Bump `react-d3-viz` dependency to latest version
- Any peer dependency updates (e.g., React version if needed)

---

## Part 4: Implementation Order

1. **React-d3-viz repo:**
   - Update README.md (add missing charts, variants table)
   - Update package.json (description, keywords)
   - Commit changes

2. **React-d3-viz-ui repo:**
   - Audit current Storybook & docs structure
   - Create/update Storybook stories for all 17 charts (exhaustive variants)
   - Generate documentation pages per chart (17 files)
   - Create/update examples/playground page
   - Update package.json (sync react-d3-viz version)
   - Commit changes

3. **Final:** Verify links, screenshots, and build success in both repos

---

## Success Criteria

- [ ] README.md lists all 17 charts with variants table
- [ ] README.md visual showcase shows ≥16 chart images (covering all types & key variants)
- [ ] package.json description mentions all 17 chart types
- [ ] 17 comprehensive documentation pages exist in react-d3-viz-ui
- [ ] 17 Storybook files with ≥5-7 interactive stories each
- [ ] Examples/playground page lists all 17 charts with live demos
- [ ] All Storybook stories have interactive prop controls
- [ ] Both repos build successfully (`npm run build`, `npm run storybook`)
- [ ] Links between README, docs, Storybook, and playground are consistent

---

## Notes

- Screenshots in `react-d3-viz/assets/` may need regeneration if missing variants (use `npm run shots`)
- Storybook stories should use the **latest API** (Storybook 7+ with args/argTypes, no deprecated `knobs` addon)
- All code examples must be **copy-paste ready** and use the 17 chart types from the latest package version
- React Native examples should be included in docs and stories where applicable
- Prop reference tables should auto-generate from TypeScript types if possible (easier maintenance)
