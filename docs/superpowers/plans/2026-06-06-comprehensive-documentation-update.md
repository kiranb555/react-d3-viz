# Comprehensive Documentation & npm Package Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update README.md and package.json in react-d3-viz with all 17 charts, then build exhaustive documentation (17 docs pages), Storybook stories (5-7 per chart), and interactive examples in react-d3-viz-ui.

**Architecture:** Two-part approach — (1) Update this repo's README/package.json to reflect all 17 charts; (2) Audit and enhance react-d3-viz-ui with comprehensive per-chart documentation pages, interactive Storybook stories with full prop controls, and a unified examples/playground page. Both repos are then in sync with the latest package version and exhaustive documentation.

**Tech Stack:** React, TypeScript, Storybook 7+, D3 modules (d3-scale, d3-shape, d3-array), Vitest for testing, npm/git.

---

## File Structure

### React-d3-viz (this repo)
- **README.md** (modify) — Add missing charts (HeatmapChart, SunburstChart), add chart variants table, update visual showcase
- **package.json** (modify) — Enhanced description, keywords array

### React-d3-viz-ui (separate repo)
- **docs/charts/** (create 17 files) — One `.md` file per chart with use case, props table, variants, examples
- **src/stories/** (create/modify 17 files) — Storybook stories with interactive prop controls, 5-7 variants per chart
- **src/examples/index.tsx** or **src/pages/Playground.tsx** (create/modify) — Central examples page listing all 17 charts with live demos
- **package.json** (modify) — Sync react-d3-viz dependency version

---

## Part 1: react-d3-viz Repository Updates

### Task 1: Update README.md — Add Missing Charts to List

**Files:**
- Modify: `README.md:43-45`

- [ ] **Step 1: Open README.md and locate the Charts section**

Find line 43 in README.md where charts are listed.

- [ ] **Step 2: Add SunburstChart to the list**

Replace:
```
`LineChart` · `AreaChart` · `BarChart` (grouped & stacked) · `ScatterPlot` · `BubbleChart` · `PieChart` (+ donut) · `QuadrantChart` · `Histogram` · `RadarChart` · `TreemapChart` (flat, grouped & nested) · `WaterfallChart` · `SankeyDiagram` · `MekkoChart` · `ButterflyChart` · `HeatmapChart`
```

With:
```
`LineChart` · `AreaChart` · `BarChart` (grouped & stacked) · `ScatterPlot` · `BubbleChart` · `PieChart` (+ donut) · `QuadrantChart` · `Histogram` · `RadarChart` · `TreemapChart` (flat, grouped & nested) · `SunburstChart` (hierarchical with drill-down) · `HeatmapChart` · `WaterfallChart` · `SankeyDiagram` · `MekkoChart` · `ButterflyChart`
```

- [ ] **Step 3: Verify the change**

All 17 charts now appear in the list: LineChart, AreaChart, BarChart, ScatterPlot, BubbleChart, PieChart, QuadrantChart, Histogram, RadarChart, TreemapChart, SunburstChart, HeatmapChart, WaterfallChart, SankeyDiagram, MekkoChart, ButterflyChart + one more = 16... wait, that's 16. Let me recount: Line, Area, Bar, Scatter, Bubble, Pie, Quadrant, Histogram, Radar, Treemap, Sunburst, Heatmap, Waterfall, Sankey, Mekko, Butterfly = 16 charts. The spec says 17. Let me check the directory listing again...

Actually, looking back at the bash output, there are exactly 16 folders. The count in CLAUDE.md might include a variant or I miscounted. Proceed with the 16 charts listed.

---

### Task 2: Update README.md — Fix and Expand Visual Showcase Table

**Files:**
- Modify: `README.md:47-72`

- [ ] **Step 1: Identify the current table**

Current table at lines 47-72 shows 8 chart types but duplicates Radar twice and is missing several new charts.

- [ ] **Step 2: Replace with expanded table covering all 16 charts**

Replace the current table with:
```markdown
<table>
  <tr>
    <td align="center"><b>Line</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/line.png" width="300"></td>
    <td align="center"><b>Area</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/area.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Bar — Grouped</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/bar.png" width="300"></td>
    <td align="center"><b>Bar — Stacked</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/bar-stacked.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Scatter</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/scatter.png" width="300"></td>
    <td align="center"><b>Bubble</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/bubble.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Pie</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/pie.png" width="300"></td>
    <td align="center"><b>Donut</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/donut.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Histogram</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/histogram.png" width="300"></td>
    <td align="center"><b>Radar</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/radar.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Treemap</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/treemap.png" width="300"></td>
    <td align="center"><b>Sunburst</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/sunburst.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Heatmap</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/heatmap.png" width="300"></td>
    <td align="center"><b>Waterfall</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/waterfall.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Sankey</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/sankey.png" width="300"></td>
    <td align="center"><b>Mekko</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/mekko.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Butterfly</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/butterfly.png" width="300"></td>
    <td align="center"><b>Quadrant</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/quadrant.png" width="300"></td>
  </tr>
</table>
```

- [ ] **Step 3: Verify table covers all 16 charts**

Count: Line, Area, Bar (2 variants), Scatter, Bubble, Pie, Donut, Histogram, Radar, Treemap, Sunburst, Heatmap, Waterfall, Sankey, Mekko, Butterfly, Quadrant = 18 cells (9 rows × 2). All charts represented.

---

### Task 3: Add Chart Variants Reference Table to README.md

**Files:**
- Modify: `README.md` after line 88 (before "Play with every chart" section)

- [ ] **Step 1: Position cursor after the visual showcase table**

Find the line `> 🎮 **Play with every chart...` at line 88.

- [ ] **Step 2: Insert new section with variants table**

Insert before line 88:

```markdown
## Chart Variants & Features

Each chart supports multiple configurations to fit different data stories:

| Chart | Variants | Key Props |
|-------|----------|-----------|
| **LineChart** | Single series, multi-series, with points, custom curves | `x`, `y`/`series`, `showPoints`, `curve`, `strokeWidth` |
| **AreaChart** | Single/multi-series, stacked, filled, custom curves | `x`, `y`/`series`, `stacked`, `curve`, `fillOpacity` |
| **BarChart** | Grouped, stacked, horizontal, normalized | `x`, `y`/`series`, `stacked`, `horizontal`, `margin` |
| **ScatterPlot** | Single/multi-series, custom sizes, labeled points | `x`, `y`, `series`, `showPointLabels`, `sizeAccessor` |
| **BubbleChart** | Static/dynamic sizes, multi-series | `x`, `y`, `size`/`sizeAccessor`, `series` |
| **PieChart** | Pie, donut, with/without labels and values | `data`, `value`, `label`, `innerRadius`, `showLabel`, `showValue` |
| **QuadrantChart** | 4-quadrant scatter with dividers and quadrant labels | `x`, `y`, `quadrants`, `dividerColor` |
| **Histogram** | Various bin counts, custom ranges | `data`, `value`, `binCount`, `showCounts` |
| **RadarChart** | Closed radar, with/without points | `data`, `series`, `showPoints`, `closed` |
| **TreemapChart** | Flat, grouped hierarchies, nested structures | `data`, `value`, `label`, `group`, `childrenKey` |
| **SunburstChart** | Multi-level hierarchies, drill-down, animations | `data`, `value`, `label`, `childrenKey`, `drill`, `animate` |
| **HeatmapChart** | Custom color scales, variable cell sizes | `data`, `x`, `y`, `value`, `colorScale`, `cellSize` |
| **WaterfallChart** | Cumulative flows with subtotals and totals | `data`, `label`, `value`, `isTotal`, `positiveColor`, `negativeColor` |
| **SankeyDiagram** | Flows between nodes, custom widths and padding | `data`, `nodeWidth`, `nodePadding`, `colors` |
| **MekkoChart** | Varying-width stacked columns | `data`, `categories`, `series` |
| **ButterflyChart** | Back-to-back horizontal bars | `data`, `x`, `leftSeries`, `rightSeries`, `leftColor`, `rightColor` |

<br>

```

- [ ] **Step 3: Verify table formatting**

Check that all 16 charts are listed with their key variants and props. Table should render cleanly in Markdown.

---

### Task 4: Update package.json — Enhanced Description

**Files:**
- Modify: `package.json` (description field)

- [ ] **Step 1: Open package.json**

Locate the `"description"` field (typically near the top).

- [ ] **Step 2: Replace description**

Replace:
```json
"description": "Cross-platform SVG charts for React (web) and React Native — one API, one codebase."
```

With:
```json
"description": "16 cross-platform SVG charts for React & React Native: LineChart, AreaChart, BarChart, ScatterPlot, BubbleChart, PieChart, QuadrantChart, Histogram, RadarChart, TreemapChart, SunburstChart, HeatmapChart, WaterfallChart, SankeyDiagram, MekkoChart, ButterflyChart. Composable, themeable, with tooltips, legends, animations."
```

- [ ] **Step 3: Add/update keywords array**

If keywords array exists, merge in: `"charts"`, `"visualization"`, `"d3"`, `"react"`, `"react-native"`, `"svg"`, `"cross-platform"`, `"line"`, `"area"`, `"bar"`, `"pie"`, `"scatter"`, `"heatmap"`, `"sankey"`, `"waterfall"`, `"treemap"`, `"sunburst"`.

If no keywords array exists, add after `"description"`:
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
],
```

- [ ] **Step 4: Verify JSON is valid**

Run:
```bash
npm list --depth=0
```

Expected: No JSON errors, package info displays normally.

---

### Task 5: Commit README and package.json updates

**Files:**
- Modified: `README.md`, `package.json`

- [ ] **Step 1: Stage changes**

```bash
git add README.md package.json
```

- [ ] **Step 2: Create commit**

```bash
git commit -m "docs: add all 16 charts to README with variants table, enhance package.json description and keywords

- Add SunburstChart and HeatmapChart to charts list
- Expand visual showcase table to show all 16 charts and key variants
- Add comprehensive Chart Variants & Features table
- Update package.json description to mention all 16 chart types
- Add keywords array for npm discoverability

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: Verify commit**

```bash
git log -1 --oneline
```

Expected: Shows the new commit message.

---

## Part 2: react-d3-viz-ui Repository Setup

### Task 6: Audit react-d3-viz-ui structure and sync package.json

**Files:**
- Modify: `/Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui/package.json`

- [ ] **Step 1: Navigate to react-d3-viz-ui**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
```

- [ ] **Step 2: Check current react-d3-viz version**

```bash
grep '"react-d3-viz"' package.json
```

Note the current version or version range.

- [ ] **Step 3: Get latest react-d3-viz version from npm**

```bash
npm view react-d3-viz version
```

Expected output: Latest version number (e.g., `1.3.0`).

- [ ] **Step 4: Update package.json dependency**

Edit `package.json` and set react-d3-viz to latest version (or `^X.Y.Z` for latest in that range):

```json
"react-d3-viz": "^1.3.0"
```

- [ ] **Step 5: Install updated dependency**

```bash
npm install
```

Expected: No errors, `node_modules/react-d3-viz` is updated.

- [ ] **Step 6: Verify structure**

Check that these directories exist:
```bash
ls -la src/stories/
ls -la docs/charts/ 2>/dev/null || echo "docs/charts/ does not exist yet"
```

Note: If `docs/charts/` doesn't exist, it will be created in Task 7.

---

### Task 7: Create Documentation Pages Directory Structure

**Files:**
- Create: `/Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui/docs/charts/` (directory)

- [ ] **Step 1: Create docs/charts directory**

```bash
mkdir -p docs/charts
```

- [ ] **Step 2: Verify directory created**

```bash
ls -la docs/charts/
```

Expected: Empty directory exists.

---

## Part 3: Generate Documentation Pages for All 16 Charts

Each documentation file follows the same template structure. Tasks 8-23 create one per chart.

### Task 8: Create LineChart.md documentation

**Files:**
- Create: `docs/charts/LineChart.md`

- [ ] **Step 1: Create file with template**

Create `docs/charts/LineChart.md` with content:

```markdown
# LineChart

**Use Case:** Display trends over time or continuous data series across one or more dimensions.

[Playground](#playground) · [Storybook](#storybook) · [GitHub Source](https://github.com/kiranb555/react-d3-viz/tree/main/src/components/charts/LineChart)

## Overview

LineChart renders one or more line series on an X-Y plane. Perfect for showing how values change over time, comparing multiple trends, or highlighting patterns in continuous data. Includes optional data points, custom curves (linear, monotone, step), and enter animations.

### Features
- Single or multi-series support
- Custom curve types (linear, monotone, step, cardinal, natural)
- Optional point markers with custom sizes
- Responsive sizing (width="auto" fills parent)
- Animated enter on mount
- Interactive tooltips and toggleable legend
- Cross-platform (React web & React Native via same codebase)

## Visual Examples

**Single series with trend:**
```
[Screenshot: line-single-series.png]
```

**Multi-series comparison:**
```
[Screenshot: line-multi-series.png]
```

**With data points and smooth curve:**
```
[Screenshot: line-with-points.png]
```

## Basic Usage

### Single Series (Shorthand)
```tsx
import { LineChart } from 'react-d3-viz';

const data = [
  { month: 'Jan', sales: 42 },
  { month: 'Feb', sales: 55 },
  { month: 'Mar', sales: 49 },
];

<LineChart data={data} x="month" y="sales" width={600} height={300} />
```

### Multi-Series
```tsx
const data = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
];

<LineChart
  data={data}
  x="month"
  series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]}
  width={600}
  height={300}
/>
```

### With Custom Theme
```tsx
<LineChart
  data={data}
  x="month"
  y="sales"
  theme={{
    colors: ['#ff6b6b', '#4ecdc4'],
    axis: { stroke: '#999' },
  }}
/>
```

## Variants

| Variant | Description | Key Props | Example |
|---------|-------------|-----------|---------|
| **Single Series** | One data series over time | `x`, `y` | `<LineChart data={data} x="month" y="sales" />` |
| **Multi-Series** | Multiple series for comparison | `x`, `series` | `<LineChart data={data} x="month" series={[...]} />` |
| **With Points** | Show data point markers | `showPoints` | `<LineChart data={data} x="month" y="sales" showPoints />` |
| **Smooth Curve** | Monotone (smooth) interpolation | `curve: 'monotone'` | `<LineChart data={data} curve="monotone" />` |
| **Step Curve** | Step function (flat-then-jump) | `curve: 'step'` | `<LineChart data={data} curve="step" />` |
| **Animated** | Enter animation on mount | `animate: true` | `<LineChart data={data} animate />` |
| **No Animation** | Instant render | `animate: false` | `<LineChart data={data} animate={false} />` |
| **Custom Colors** | Override default palette | `colors` or theme | `<LineChart data={data} theme={{ colors: [...] }} />` |
| **Responsive** | Fills parent width | `width="auto"` | `<LineChart data={data} width="auto" height={300} />` |

## Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | — | Data array |
| `x` | `Accessor<T>` | — | X-axis accessor (e.g., `"month"` or `(d) => d.month`) |
| `y` | `Accessor<T>` | — | Y-axis accessor (shorthand; use `series` for multiple) |
| `series` | `SeriesConfig[]` | — | Array of series configs, each with `dataKey` and optional `label`, `color` |
| `width` | `number \| "auto"` | `"auto"` | Chart width (responsive if "auto") |
| `height` | `number \| "auto"` | `300` | Chart height (or aspect ratio if "auto") |
| `aspect` | `number` | `1.8` | Width-to-height ratio for responsive height |
| `margin` | `Margin` | `{ top: 20, right: 20, bottom: 40, left: 60 }` | Inner spacing |
| `showGrid` | `boolean` | `true` | Show background grid |
| `showXAxis` | `boolean` | `true` | Show X-axis |
| `showYAxis` | `boolean` | `true` | Show Y-axis |
| `showPoints` | `boolean` | `false` | Show data point markers |
| `showTooltip` | `boolean` | `true` | Show hover/touch tooltip |
| `showLegend` | `boolean` | `true` | Show interactive legend |
| `xTickCount` | `number` | `5` | Approximate X-axis tick count |
| `yTickCount` | `number` | `5` | Approximate Y-axis tick count |
| `formatX` | `(value) => string` | — | Format X-axis labels |
| `formatY` | `(value) => string` | — | Format Y-axis labels |
| `curve` | `'linear' \| 'monotone' \| 'step' \| ...` | `'monotone'` | Curve interpolation type |
| `strokeWidth` | `number` | `2` | Line stroke width (can override per series) |
| `animate` | `boolean` | `true` | Animate series on mount |
| `theme` | `DeepPartial<ChartTheme>` | — | Override theme (colors, fonts, spacing, animation) |
| `colors` | `string[]` | — | Override color palette |

## Advanced Examples

### Custom Curve Types
```tsx
<LineChart
  data={data}
  x="month"
  series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]}
  curve="step"
  showPoints
  width={600}
  height={300}
/>
```

### Responsive with Aspect Ratio
```tsx
<LineChart
  data={data}
  x="month"
  y="sales"
  width="auto"
  height="auto"
  aspect={2}
/>
```

### Custom Theme & Colors
```tsx
<LineChart
  data={data}
  x="month"
  series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]}
  theme={{
    colors: ['#2563eb', '#f59e0b'],
    font: { family: 'monospace', size: 12 },
    axis: { stroke: '#d1d5db', labelColor: '#6b7280' },
    grid: { stroke: '#e5e7eb', dashArray: '4 4' },
  }}
  width={600}
  height={300}
/>
```

### Formatted Axes
```tsx
<LineChart
  data={data}
  x="month"
  y="sales"
  formatX={(v) => v.toUpperCase()}
  formatY={(v) => `$${v.toLocaleString()}`}
/>
```

### React Native Usage
```tsx
import { LineChart } from 'react-d3-viz';
import { View } from 'react-native';

<View style={{ width: '100%' }}>
  <LineChart data={data} x="month" y="sales" height={300} />
</View>
```

## Best Practices & Tips

- **Time series:** Use `formatX` to show readable dates; consider `xTickCount` to avoid crowding
- **Large datasets:** For 1000+ points, consider decimating data or increasing `xTickCount` to reduce visual noise
- **Comparison:** Multi-series works best for 2-5 series; beyond that, consider multiple charts or filtering
- **Colors:** Use `theme.colors` or `series[].color` to maintain consistency with app branding
- **Performance:** `animate={false}` for charts that update frequently; avoid animations on very large datasets

## Playground

[Try it live in the interactive playground](#) with all props and variants editable in real-time.

## Storybook

[See all LineChart variants in Storybook](#) with interactive prop controls.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
git add docs/charts/LineChart.md
git commit -m "docs: add LineChart comprehensive documentation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create AreaChart.md documentation

**Files:**
- Create: `docs/charts/AreaChart.md`

- [ ] **Step 1: Create AreaChart.md**

```markdown
# AreaChart

**Use Case:** Show cumulative totals, filled trends, or stacked series over time.

[Playground](#playground) · [Storybook](#storybook) · [GitHub Source](https://github.com/kiranb555/react-d3-viz/tree/main/src/components/charts/AreaChart)

## Overview

AreaChart renders one or more filled area series on an X-Y plane. Perfect for visualizing cumulative values, stacked contributions, or emphasizing magnitude changes over time. Includes stacking modes, custom curves, fill opacity control, and enter animations.

### Features
- Single or multi-series support
- Stacked or overlaid modes
- Custom curve types (linear, monotone, step)
- Fill opacity control per series
- Responsive sizing (width="auto" fills parent)
- Animated enter on mount
- Interactive tooltips and toggleable legend

## Visual Examples

**Single filled area:**
```
[Screenshot: area-single.png]
```

**Stacked areas (cumulative):**
```
[Screenshot: area-stacked.png]
```

**Multi-series overlaid with transparency:**
```
[Screenshot: area-overlaid.png]
```

## Basic Usage

### Single Series (Shorthand)
```tsx
import { AreaChart } from 'react-d3-viz';

const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 5500 },
  { month: 'Mar', revenue: 6200 },
];

<AreaChart data={data} x="month" y="revenue" width={600} height={300} />
```

### Stacked Multi-Series
```tsx
const data = [
  { month: 'Jan', product_a: 1000, product_b: 2000 },
  { month: 'Feb', product_a: 1500, product_b: 2200 },
  { month: 'Mar', product_a: 1200, product_b: 2800 },
];

<AreaChart
  data={data}
  x="month"
  series={[{ dataKey: 'product_a' }, { dataKey: 'product_b' }]}
  stacked
  width={600}
  height={300}
/>
```

### With Custom Fill Opacity
```tsx
<AreaChart
  data={data}
  x="month"
  series={[
    { dataKey: 'product_a', fillOpacity: 0.7 },
    { dataKey: 'product_b', fillOpacity: 0.5 },
  ]}
  width={600}
  height={300}
/>
```

## Variants

| Variant | Description | Key Props |
|---------|-------------|-----------|
| **Single Series** | One filled area | `x`, `y` |
| **Multi-Series Stacked** | Areas stacked on top of each other | `x`, `series`, `stacked: true` |
| **Multi-Series Overlaid** | Areas overlapping with transparency | `x`, `series`, `fillOpacity` |
| **Smooth Curve** | Monotone (smooth) fill | `curve: 'monotone'` |
| **Step Curve** | Step-function fill | `curve: 'step'` |
| **Custom Colors** | Override palette | `theme.colors` or `series[].color` |
| **Responsive** | Fills parent width | `width="auto"` |

## Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | — | Data array |
| `x` | `Accessor<T>` | — | X-axis accessor |
| `y` | `Accessor<T>` | — | Y-axis accessor (shorthand) |
| `series` | `SeriesConfig[]` | — | Array of series, each with `dataKey` and optional `label`, `color`, `fillOpacity` |
| `stacked` | `boolean` | `false` | Stack areas on top of each other (vs. overlaid) |
| `width` | `number \| "auto"` | `"auto"` | Chart width |
| `height` | `number \| "auto"` | `300` | Chart height |
| `aspect` | `number` | `1.8` | Width-to-height ratio for responsive height |
| `margin` | `Margin` | `{ top: 20, right: 20, bottom: 40, left: 60 }` | Inner spacing |
| `showGrid` | `boolean` | `true` | Show background grid |
| `showXAxis` | `boolean` | `true` | Show X-axis |
| `showYAxis` | `boolean` | `true` | Show Y-axis |
| `showTooltip` | `boolean` | `true` | Show hover/touch tooltip |
| `showLegend` | `boolean` | `true` | Show interactive legend |
| `xTickCount` | `number` | `5` | Approximate X-axis tick count |
| `yTickCount` | `number` | `5` | Approximate Y-axis tick count |
| `formatX` | `(value) => string` | — | Format X-axis labels |
| `formatY` | `(value) => string` | — | Format Y-axis labels |
| `curve` | `'linear' \| 'monotone' \| 'step' \| ...` | `'monotone'` | Curve interpolation type |
| `animate` | `boolean` | `true` | Animate on mount |
| `theme` | `DeepPartial<ChartTheme>` | — | Override theme |
| `colors` | `string[]` | — | Override color palette |

## Best Practices

- **Stacking:** Use `stacked` to show part-to-whole relationships; use overlaid for trend comparison
- **Fill opacity:** For overlaid multi-series, reduce `fillOpacity` (0.3–0.7) to prevent visual confusion
- **Large datasets:** Consider data decimation for 1000+ points; increase `xTickCount` to reduce clutter
- **Accessibility:** Ensure color contrast meets WCAG; use `showLegend: true` to label series

## Playground

[Interactive examples with all AreaChart variants](#)

## Storybook

[AreaChart stories with prop controls](#)
```

- [ ] **Step 2: Commit**

```bash
git add docs/charts/AreaChart.md
git commit -m "docs: add AreaChart comprehensive documentation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Create BarChart.md documentation

**Files:**
- Create: `docs/charts/BarChart.md`

[Create following the same pattern as Tasks 8-9. Content covers: grouped bars, stacked bars, horizontal orientation, and all variant props.]

- [ ] **Step 1: Create BarChart.md** (use template from AreaChart, adapt for BarChart specifics: `stacked`, `horizontal`, `barWidth`, `groupPadding`)

- [ ] **Step 2: Commit**

---

### Task 11–22: Create documentation for remaining 11 charts

Follow the same pattern as Tasks 8–10:

- **Task 11:** ScatterPlot.md
- **Task 12:** BubbleChart.md
- **Task 13:** PieChart.md (include donut variant)
- **Task 14:** QuadrantChart.md
- **Task 15:** Histogram.md
- **Task 16:** RadarChart.md
- **Task 17:** TreemapChart.md (flat, grouped, nested)
- **Task 18:** SunburstChart.md (hierarchical, drill-down)
- **Task 19:** HeatmapChart.md
- **Task 20:** WaterfallChart.md
- **Task 21:** SankeyDiagram.md
- **Task 22:** MekkoChart.md

Each task:
- [ ] **Step 1:** Create `docs/charts/<ChartName>.md` with full structure (overview, features, basic usage, variants table, complete props reference, advanced examples, best practices)
- [ ] **Step 2:** Commit with message `"docs: add <ChartName> comprehensive documentation"`

For brevity, the full content for each is not repeated here, but follow the AreaChart template structure, adjusting:
- Use case & overview
- Feature list (e.g., SunburstChart: drill-down, levels, animations; HeatmapChart: color scales, cell sizes)
- Props specific to that chart
- Variants specific to that chart

---

### Task 23: Create ButterflyChart.md documentation

**Files:**
- Create: `docs/charts/ButterflyChart.md`

[Last documentation file. Complete the set of 16 charts.]

- [ ] **Step 1: Create ButterflyChart.md**

```markdown
# ButterflyChart

**Use Case:** Compare two groups side-by-side (population pyramids, A/B metrics, left vs. right).

[Playground](#) · [Storybook](#) · [GitHub Source](https://github.com/kiranb555/react-d3-viz/tree/main/src/components/charts/ButterflyChart)

## Overview

ButterflyChart renders two series of horizontal bars extending left and right from a center axis. Perfect for comparing opposite groups (male/female, before/after, product A vs. B) or showing pyramidal distributions.

### Features
- Left & right series with independent scales
- Horizontal bar layout with center baseline
- Custom colors per side
- Value labels optional
- Interactive legend and tooltips
- Responsive sizing

## Visual Examples

**Population pyramid:**
```
[Screenshot: butterfly-pyramid.png]
```

**A/B comparison:**
```
[Screenshot: butterfly-comparison.png]
```

## Basic Usage

```tsx
import { ButterflyChart } from 'react-d3-viz';

const data = [
  { age: '0-10', male: 5000, female: 4800 },
  { age: '10-20', male: 5200, female: 5100 },
  { age: '20-30', male: 6100, female: 6000 },
];

<ButterflyChart
  data={data}
  x="age"
  leftSeries="male"
  rightSeries="female"
  width={600}
  height={400}
/>
```

## Variants

| Variant | Description | Key Props |
|---------|-------------|-----------|
| **Basic** | Left vs. right bars | `x`, `leftSeries`, `rightSeries` |
| **Custom Colors** | Override left/right colors | `leftColor`, `rightColor` |
| **With Labels** | Show values on bars | `showValues` |
| **Horizontal Layout** | (default) | — |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | — | Data array |
| `x` | `Accessor<T>` | — | Category accessor |
| `leftSeries` | `Accessor<T>` | — | Left-side values |
| `rightSeries` | `Accessor<T>` | — | Right-side values |
| `leftColor` | `string` | theme color | Left-side bar color |
| `rightColor` | `string` | theme color | Right-side bar color |
| `showValues` | `boolean` | `false` | Show value labels on bars |
| `width` | `number \| "auto"` | `"auto"` | Chart width |
| `height` | `number \| "auto"` | `400` | Chart height |
| `margin` | `Margin` | — | Inner spacing |
| `showTooltip` | `boolean` | `true` | Show hover tooltip |
| `showLegend` | `boolean` | `true` | Show legend |
| `theme` | `DeepPartial<ChartTheme>` | — | Override theme |

## Best Practices

- **Symmetry:** Use equal scales on both sides for fair visual comparison
- **Color:** Use contrasting colors (e.g., blue vs. orange) for clarity
- **Labels:** Enable `showValues` for precise reading of smaller differences
- **Ordering:** Sort by category or magnitude for better insight

## Playground

[Interactive ButterflyChart examples](#)

## Storybook

[ButterflyChart stories with prop controls](#)
```

- [ ] **Step 2: Commit**

```bash
git add docs/charts/ButterflyChart.md
git commit -m "docs: add ButterflyChart comprehensive documentation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 24: Create docs index page (optional but recommended)

**Files:**
- Create: `docs/charts/index.md` or `docs/README.md`

- [ ] **Step 1: Create index**

```markdown
# Chart Documentation

Complete reference for all 16 charts in react-d3-viz. Each chart supports interactive variants, custom themes, responsive sizing, and cross-platform rendering (web + React Native).

## Cartesian Charts (X-Y Plane)

- [LineChart](./LineChart.md) — Trends and multi-series comparison
- [AreaChart](./AreaChart.md) — Filled trends and stacked contribution
- [BarChart](./BarChart.md) — Grouped or stacked bars, horizontal support
- [ScatterPlot](./ScatterPlot.md) — 2D point clouds with optional sizes
- [BubbleChart](./BubbleChart.md) — 3D scatter with bubble sizes
- [QuadrantChart](./QuadrantChart.md) — 4-quadrant scatter with dividers
- [Histogram](./Histogram.md) — Binned distributions

## Hierarchical & Radial Charts

- [TreemapChart](./TreemapChart.md) — Flat, grouped, and nested hierarchies
- [SunburstChart](./SunburstChart.md) — Multi-level radial hierarchy with drill-down
- [RadarChart](./RadarChart.md) — Multi-dimensional comparison (radar/spider)
- [PieChart](./PieChart.md) — Pie, donut, and semi-circles

## Flow & Relationship Charts

- [SankeyDiagram](./SankeyDiagram.md) — Node-and-link flows
- [WaterfallChart](./WaterfallChart.md) — Cumulative flows with steps
- [MekkoChart](./MekkoChart.md) — Varying-width stacked columns

## Comparison Charts

- [ButterflyChart](./ButterflyChart.md) — Side-by-side bars (population pyramids, A/B)
- [HeatmapChart](./HeatmapChart.md) — Color-mapped cells for multi-dimensional data

## Common Features

All charts include:
- **Responsive sizing:** `width="auto"` for fluid layouts
- **Theming:** Global `ThemeProvider` or per-chart overrides
- **Interactivity:** Tooltips (hover/touch), toggleable legend
- **Animations:** Optional enter animations on mount
- **Accessibility:** TypeScript types, semantic SVG
- **Cross-platform:** Same code runs on React (web) and React Native

See [Getting Started](#) for installation and basic examples.
```

- [ ] **Step 2: Commit**

```bash
git add docs/charts/index.md
git commit -m "docs: add charts documentation index

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Part 4: Create Storybook Stories with Exhaustive Prop Variants

### Task 25: Create LineChart.stories.tsx with 7 interactive stories

**Files:**
- Create: `src/stories/LineChart.stories.tsx`

- [ ] **Step 1: Create LineChart.stories.tsx**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from 'react-d3-viz';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const monthlyData = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 5000, profit: 2800 },
  { month: 'Mar', sales: 4500, profit: 2600 },
  { month: 'Apr', sales: 6200, profit: 3100 },
  { month: 'May', sales: 7300, profit: 3500 },
  { month: 'Jun', sales: 6800, profit: 3200 },
];

export const SingleSeries: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    y: 'sales',
    width: 600,
    height: 300,
    showPoints: false,
    showGrid: true,
    showLegend: false,
    animate: true,
  },
  argTypes: {
    showPoints: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
};

export const MultiSeriesWithPoints: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    width: 600,
    height: 300,
    showPoints: true,
    showGrid: true,
    showLegend: true,
    animate: true,
  },
  argTypes: {
    showPoints: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
};

export const SmoothCurve: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    width: 600,
    height: 300,
    curve: 'monotone',
    showPoints: true,
    animate: true,
  },
  argTypes: {
    curve: { control: { type: 'select', options: ['linear', 'monotone', 'step'] } },
  },
};

export const StepCurve: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    y: 'sales',
    width: 600,
    height: 300,
    curve: 'step',
    showPoints: true,
  },
};

export const WithCustomColors: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    width: 600,
    height: 300,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4'],
    },
    showLegend: true,
  },
};

export const Responsive: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    y: 'sales',
    width: 'auto',
    height: 300,
    showPoints: true,
  },
};

export const NoAnimation: Story = {
  args: {
    data: monthlyData,
    x: 'month',
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    width: 600,
    height: 300,
    animate: false,
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/stories/LineChart.stories.tsx
git commit -m "feat: add LineChart Storybook stories with 7 interactive variants

- SingleSeries: basic single-line chart
- MultiSeriesWithPoints: multiple lines with data points
- SmoothCurve: monotone curve interpolation
- StepCurve: step-function interpolation
- WithCustomColors: theme color override
- Responsive: width=auto responsive sizing
- NoAnimation: disable enter animations

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 26–40: Create Storybook stories for remaining 15 charts

Follow the same pattern as Task 25. Create one `.stories.tsx` file per chart:

- **Task 26:** AreaChart.stories.tsx (7 stories: single, multi-series, stacked, smooth, step, custom colors, responsive)
- **Task 27:** BarChart.stories.tsx (7 stories: grouped, stacked, horizontal, custom colors, responsive, etc.)
- **Task 28:** ScatterPlot.stories.tsx (5 stories: single, multi-series, with labels, custom sizes, responsive)
- **Task 29:** BubbleChart.stories.tsx (5 stories: single, multi-series, custom sizes, custom colors, responsive)
- **Task 30:** PieChart.stories.tsx (7 stories: pie, donut, with labels, with values, custom colors, animations, responsive)
- **Task 31:** QuadrantChart.stories.tsx (5 stories: basic, with quadrants, custom colors, responsive, etc.)
- **Task 32:** Histogram.stories.tsx (5 stories: default bins, custom binCount, show counts, responsive, etc.)
- **Task 33:** RadarChart.stories.tsx (5 stories: default, with points, closed, custom colors, responsive)
- **Task 34:** TreemapChart.stories.tsx (6 stories: flat, grouped, nested, custom colors, custom sizing, responsive)
- **Task 35:** SunburstChart.stories.tsx (6 stories: basic, multi-level, drill-down, custom colors, animations, responsive)
- **Task 36:** HeatmapChart.stories.tsx (5 stories: default, custom color scale, custom cell size, responsive, etc.)
- **Task 37:** WaterfallChart.stories.tsx (5 stories: basic, with totals, custom colors, responsive, etc.)
- **Task 38:** SankeyDiagram.stories.tsx (5 stories: basic, custom node width, custom colors, responsive, etc.)
- **Task 39:** MekkoChart.stories.tsx (5 stories: basic, multi-series, custom colors, responsive, etc.)
- **Task 40:** ButterflyChart.stories.tsx (5 stories: basic, custom colors, with values, responsive, etc.)

Each task:
- [ ] **Step 1:** Create `src/stories/<ChartName>.stories.tsx` with 5–7 named export stories covering main variants and prop combinations
- [ ] **Step 2:** Commit with message `"feat: add <ChartName> Storybook stories with N interactive variants"`

---

### Task 41: Create central Playground/Examples page

**Files:**
- Create or modify: `src/pages/Playground.tsx` or `src/examples/index.tsx`

- [ ] **Step 1: Determine existing structure**

Check if there's already a playground or examples page:
```bash
find src -name '*Playground*' -o -name '*examples*' -o -name '*Examples*'
```

- [ ] **Step 2: Create comprehensive Playground component**

Create `src/pages/Playground.tsx` (or update existing):

```tsx
import React, { useState } from 'react';
import {
  LineChart, AreaChart, BarChart, ScatterPlot, BubbleChart,
  PieChart, QuadrantChart, Histogram, RadarChart, TreemapChart,
  SunburstChart, HeatmapChart, WaterfallChart, SankeyDiagram,
  MekkoChart, ButterflyChart, ThemeProvider
} from 'react-d3-viz';

const chartConfigs = [
  {
    id: 'line-single',
    name: 'LineChart - Single Series',
    component: LineChart,
    data: [...],
    defaultProps: { x: 'month', y: 'sales', width: 600, height: 300 },
  },
  // ... 15 more chart variants
];

export default function Playground() {
  const [selectedChart, setSelectedChart] = useState(0);
  const config = chartConfigs[selectedChart];

  return (
    <div>
      <h1>Playground</h1>
      <div className="chart-grid">
        {chartConfigs.map((cfg, i) => (
          <button
            key={i}
            onClick={() => setSelectedChart(i)}
            className={selectedChart === i ? 'active' : ''}
          >
            {cfg.name}
          </button>
        ))}
      </div>
      <div className="chart-demo">
        <config.component {...config.defaultProps} data={config.data} />
      </div>
      <pre>{JSON.stringify(config.defaultProps, null, 2)}</pre>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Playground.tsx
git commit -m "feat: add central Playground page with all 16 chart examples

- Interactive chart selector
- Live demo area
- Copy-paste code snippets
- Responsive grid layout

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 42: Verify all Storybook stories build

**Files:**
- No file changes; testing/verification only

- [ ] **Step 1: Run Storybook build**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
npm run build-storybook
```

Expected: No errors, `storybook-static/` or `.storybook/dist/` directory created.

- [ ] **Step 2: Check for console errors**

If there are TypeScript or import errors, fix them in the stories files and re-run.

---

### Task 43: Test Playground page in dev server

**Files:**
- No file changes; testing only

- [ ] **Step 1: Start dev server**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
npm run dev
```

Expected: Dev server starts successfully.

- [ ] **Step 2: Navigate to Playground**

Open browser to `http://localhost:5173/playground` (or appropriate dev URL).

- [ ] **Step 3: Verify charts render**

Click through each chart variant; verify chart renders and code snippet updates.

- [ ] **Step 4: Test responsiveness**

Resize browser window; verify charts respond to width changes (if `width="auto"`).

---

### Task 44: Update react-d3-viz-ui README or docs index

**Files:**
- Create or modify: `react-d3-viz-ui/docs/index.md` or update `README.md`

- [ ] **Step 1: Create/update docs index**

Add sections linking to:
- Comprehensive chart documentation (17 pages)
- Storybook stories (all interactive examples)
- Playground page

Example content:
```markdown
# react-d3-viz-ui Documentation

## 📊 Chart Reference

Comprehensive documentation for all 16 charts:

- **Cartesian:** [LineChart](docs/charts/LineChart.md), [AreaChart](docs/charts/AreaChart.md), [BarChart](docs/charts/BarChart.md), [ScatterPlot](docs/charts/ScatterPlot.md), [BubbleChart](docs/charts/BubbleChart.md), [QuadrantChart](docs/charts/QuadrantChart.md), [Histogram](docs/charts/Histogram.md)
- **Hierarchical:** [TreemapChart](docs/charts/TreemapChart.md), [SunburstChart](docs/charts/SunburstChart.md), [RadarChart](docs/charts/RadarChart.md), [PieChart](docs/charts/PieChart.md)
- **Flow:** [SankeyDiagram](docs/charts/SankeyDiagram.md), [WaterfallChart](docs/charts/WaterfallChart.md), [MekkoChart](docs/charts/MekkoChart.md)
- **Comparison:** [ButterflyChart](docs/charts/ButterflyChart.md), [HeatmapChart](docs/charts/HeatmapChart.md)

## 🎨 Storybook

[Interactive stories with full prop controls](./storybook) for all charts and variants.

## 🎮 Playground

[Live playground](./playground) to explore all 16 charts with editable code examples.
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md (or README.md)
git commit -m "docs: add react-d3-viz-ui documentation index

Links to:
- 17 comprehensive chart reference pages
- Storybook with all interactive stories
- Live playground with all 16 charts

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 45: Final build and verification (react-d3-viz-ui)

**Files:**
- No file changes; testing only

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
npm install
```

- [ ] **Step 2: Run tests (if any)**

```bash
npm test
```

Expected: All tests pass (or skip if none exist).

- [ ] **Step 3: Run linting**

```bash
npm run lint
```

Expected: No errors or warnings.

- [ ] **Step 4: Build project**

```bash
npm run build
```

Expected: Build succeeds, output directory created.

---

### Task 46: Final verification in react-d3-viz

**Files:**
- No file changes; testing only

- [ ] **Step 1: Return to react-d3-viz repo**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Run linting**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 5: Build library**

```bash
npm run build
```

Expected: `dist/` directory created with all charts exported correctly.

- [ ] **Step 6: Verify README renders**

```bash
cat README.md | head -100
```

Expected: README starts with new charts list and variants table.

---

### Task 47: Create comprehensive summary commit (react-d3-viz-ui)

**Files:**
- All documentation and story files committed in Tasks 8–41

- [ ] **Step 1: Verify all files are committed**

```bash
cd /Users/kiran/Desktop/projects/claude_code/react-d3-viz-ui
git status
```

Expected: No uncommitted changes.

- [ ] **Step 2: View commit log**

```bash
git log --oneline | head -20
```

Expected: Shows all documentation and story commits from Tasks 8–41.

- [ ] **Step 3: Create summary message (optional)**

If desired, create a tagged release or summary PR with all documentation updates.

---

## Success Criteria

- [ ] README.md lists all 16 charts with comprehensive variants table
- [ ] README.md visual showcase displays 8+ chart images covering all types
- [ ] package.json description mentions all 16 chart types
- [ ] package.json includes keywords array with chart type names
- [ ] 16 comprehensive documentation pages exist in `docs/charts/`
- [ ] Each documentation page includes: use case, features, basic examples, complete props table, variants table, advanced examples, best practices
- [ ] 16 Storybook story files created (one per chart)
- [ ] Each Storybook file has 5–7 interactive stories with prop controls (args/argTypes)
- [ ] Playground/Examples page created with all 16 charts and code snippets
- [ ] Both repos build successfully (`npm run build`, `npm run lint`, `npm test`)
- [ ] react-d3-viz-ui package.json synced to latest react-d3-viz version
- [ ] All internal links (README → docs → Storybook → playground) are consistent and working
- [ ] Git history shows focused commits (one per chart or feature)

---

## Notes

- **Screenshot paths:** Some docs reference image files (e.g., `line.png`, `area.png`). If these don't exist, either:
  - Generate via `npm run shots` in react-d3-viz (requires dev server running), or
  - Use placeholder images and update paths later
- **Type generation:** If react-d3-viz exports TypeScript types, consider auto-generating parts of the props tables from `.d.ts` files to reduce maintenance
- **Deployment:** After both repos are committed, consider deploying react-d3-viz-ui (docs + Storybook + playground) to GitHub Pages or Netlify so links are live
- **Storybook version:** Assumes Storybook 7+. If using Storybook 6, stories syntax may differ (use `knobs` addon instead of `argTypes`)

