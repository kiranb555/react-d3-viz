<div align="center">

# react-d3-viz

### Cross-platform **SVG charts** for **React (web)** and **React Native** — one codebase, unlimited platforms.

Lightweight, composable, fully themeable — with tooltips, interactive legends, responsive sizing, and smooth animations. **SVG-only** (no Canvas), **tree-shakeable**, and **TypeScript-first**.

<p>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="npm version" src="https://img.shields.io/npm/v/react-d3-viz?color=cb3837&label=npm&logo=npm"></a>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="npm downloads" src="https://img.shields.io/badge/downloads-5000%2B%2Fmonth-cb3837?logo=npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/react-d3-viz"><img alt="jsDelivr" src="https://data.jsdelivr.com/v1/package/npm/react-d3-viz/badge"></a>
  <a href="https://bundlephobia.com/package/react-d3-viz"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/react-d3-viz?color=44cc11&label=minzipped"></a>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="types included" src="https://img.shields.io/npm/types/react-d3-viz?logo=typescript&logoColor=white"></a>
  <a href="https://github.com/kiranb555/react-d3-viz/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/react-d3-viz?color=blue"></a>
  <img alt="platforms" src="https://img.shields.io/badge/platforms-React%20%7C%20React%20Native-61dafb?logo=react&logoColor=white">
</p>

**[▶ Live Playground](https://kiranb555.github.io/react-d3-viz-ui/)** · **[View on GitHub](https://github.com/kiranb555/react-d3-viz)** · **[View on npm](https://www.npmjs.com/package/react-d3-viz)**

<br>

<img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/hero.png" alt="react-d3-viz charts" width="820">

</div>

---

## Table of Contents

- [Why react-d3-viz](#why-react-d3-viz)
- [Features](#features)
- [Quick Start](#quick-start)
- [20 Chart Types](#charts)
- [Installation](#install)
- [Usage Examples](#usage)
- [Responsive Sizing](#responsive-sizing-widthauto)
- [Theming & Customization](#customization)
- [Interactivity](#interactivity)
- [React Native](#react-native)
- [Performance & Bundle Size](#performance--bundle-size)
- [Development & Contributing](#development)
- [Comparison with Other Libraries](#comparison-with-other-libraries)
- [License](#license)

<br>

## Quick Start

```tsx
import { LineChart } from 'react-d3-viz';

const data = [
  { month: 'Jan', sales: 42 },
  { month: 'Feb', sales: 55 },
  { month: 'Mar', sales: 49 },
];

// Works on web AND React Native — same code, same API
<LineChart data={data} x="month" y="sales" width={600} height={300} />
```

[👉 Try it live in the Playground](https://kiranb555.github.io/react-d3-viz-ui/)

---

## Why react-d3-viz

Most chart libraries are **web-only**. react-d3-viz separates **geometry computation** (pure JS via `d3-scale` / `d3-shape` / `d3-array`) from **rendering** (a thin SVG adapter), so the **exact same chart code runs on the web (DOM SVG) and on React Native (`react-native-svg`)** without branching logic or duplicate bundles.

### Features

| | |
|---|---|
| **📱 Truly cross-platform** | One codebase, unlimited platforms. Web, React Native, or anywhere React runs. Axes, grid, legend, and tooltips all render *inside* the SVG for pixel-perfect parity. |
| **🪶 Lightweight & tree-shakeable** | Only `d3-scale`, `d3-shape`, `d3-array` (pure JS) — no Canvas, no DOM, no `d3-axis`. Ships as ESM with `"sideEffects": false`. Import one chart, ship one chart. |
| **🤝 No lock-in** | `react` / `react-dom` are optional peer deps (web only). `react-native-svg` is **not** a peer dep — web installs never get surprised by native packages. Everything is optional. |
| **🔷 TypeScript-first** | Full `.d.ts` for every component, prop, and theme token. Type-safe by default. |
| **🎨 Themeable end-to-end** | Global `ThemeProvider` or per-chart overrides. Colors, fonts, animations, axis/grid/tooltip/legend styles — all customizable. |
| **📊 20 chart types** | Line, Area, Bar (grouped/stacked), Scatter, Bubble, Pie/Donut, Histogram, Radar, Treemap, Sunburst, Heatmap, Waterfall, Sankey, Mekko, Butterfly, Quadrant, Candlestick, Funnel, Gauge, Calendar Heatmap. |
| **✨ Interactive by default** | Tooltips (hover/touch), togglable legends, smooth enter animations. No extra setup. |
| **✅ Battle-tested** | 89+ unit & render tests. Used in production. |

> **Coming from [recharts](https://www.npmjs.com/package/recharts) or [victory](https://www.npmjs.com/package/victory)?** Those excel on the web but are web-only. react-d3-viz gives you the same composable, themeable API while running unchanged on **React Native** too. Compare sizes on [Bundlephobia](https://bundlephobia.com/package/react-d3-viz).

## Charts

**20 interactive chart types** — all responsive, themeable, and cross-platform:

`LineChart` · `AreaChart` · `BarChart` · `ScatterPlot` · `BubbleChart` · `PieChart` · `Histogram` · `RadarChart` · `TreemapChart` · `SunburstChart` · `HeatmapChart` · `WaterfallChart` · `SankeyDiagram` · `MekkoChart` · `ButterflyChart` · `QuadrantChart` · `CandlestickChart` · `FunnelChart` · `GaugeChart` · `CalendarHeatmapChart`

<table>
  <tr>
    <td align="center"><b>Line</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/line.png" width="300"></td>
    <td align="center"><b>Area</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/area.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Bar — grouped</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/bar.png" width="300"></td>
    <td align="center"><b>Bar — stacked</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/bar-stacked.png" width="300"></td>
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
  <tr>
    <td align="center"><b>Candlestick</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/candlestick.png" width="300"></td>
    <td align="center"><b>Funnel</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/funnel.png" width="300"></td>
  </tr>
  <tr>
    <td align="center"><b>Gauge</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/gauge.png" width="300"></td>
    <td align="center"><b>Calendar Heatmap</b><br><img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/calendar-heatmap.png" width="300"></td>
  </tr>
</table>

### Chart Types & Features

| Chart | Best For | Key Props |
|-------|----------|-----------|
| **LineChart** | Time series, trends, multi-line comparison | `x`, `y`/`series`, `showPoints`, `curve`, `strokeWidth` |
| **AreaChart** | Cumulative change, stacked contributions, trends | `x`, `series`, `curve`, `fillOpacity`, `stacked` |
| **BarChart** | Categories, comparisons, grouped/stacked data | `x`, `series`, `stacked`, `showLegend` |
| **ScatterPlot** | Correlation, outlier detection, multi-series patterns | `x`, `y`, `series`, `showLegend` |
| **BubbleChart** | Three-dimensional comparison (x, y, size) | `x`, `y`, `value` (size), `series` |
| **PieChart** | Part-to-whole, proportions (+ donut via `innerRadius`) | `data`, `value`, `label`, `innerRadius` |
| **Histogram** | Distribution, frequency, binned data | `data`, `value`, `series`, `binCount` |
| **RadarChart** | Multi-variate comparison, performance profiles | `data`, `series`, `showGrid`, `showLegend` |
| **TreemapChart** | Hierarchical data, space partitioning, drill-down | `data`, `value`, `label`, `childrenKey` |
| **SunburstChart** | Deep hierarchies, interactive drill-down exploration | `data`, `value`, `label`, `childrenKey` |
| **HeatmapChart** | Density, correlation matrices, time-based patterns | `data`, `x`, `y`, `value`, `colorScale` |
| **WaterfallChart** | Cumulative flows, P&L, bridge analysis | `data`, `label`, `value`, `isTotal` |
| **SankeyDiagram** | Flow diagrams, supply chains, user journeys | `data` (nodes/links), `nodePadding` |
| **MekkoChart** | Two-dimensional stacked data (width + height) | `data` (categories/series) |
| **ButterflyChart** | Symmetrical comparison (e.g., population pyramids) | `data`, `series` |
| **QuadrantChart** | Four-quadrant analysis, strategic positioning | `data`, `x`, `y`, `xAxisLabel`, `yAxisLabel` |
| **CandlestickChart** | Financial OHLC time series, trading charts | `data`, `x`, `open`, `high`, `low`, `close`, `upColor`, `downColor` |
| **FunnelChart** | Conversion funnels, sequential drop-off analysis | `data`, `value`, `label`, `orientation`, `showDropOff` |
| **GaugeChart** | KPI dials, speedometers, single-value readouts against thresholds | `value`, `min`, `max`, `thresholds`, `showNeedle`, `showTicks` |
| **CalendarHeatmapChart** | Daily activity / contribution graphs, GitHub-style day-by-day trends | `data`, `startDate`, `endDate`, `cellSize`, `weekStart`, `colorStart`, `colorEnd` |

---

## Version Highlights

### v1.2.0+ — Latest Additions

**ButterflyChart** — Side-by-side symmetric bars for population pyramids, A/B comparisons, and bidirectional flow.

**v1.1.0 Additions** — WaterfallChart (cumulative flows), SankeyDiagram (node-and-link flows), MekkoChart (dual-dimension stacked bars).

> 🎮 **[Explore every chart live in the interactive Playground →](https://kiranb555.github.io/react-d3-viz-ui/)** Edit code, change props, swap data — see changes instantly.

## Install

```bash
# web
npm i react-d3-viz

# React Native (also install the peer)
npm i react-d3-viz react-native-svg
```

`react` (+ `react-dom` on web) is the only peer dependency. `react-native-svg` is required **only** for React Native — you install it there yourself; it is intentionally not a peer dependency, so web installs are never prompted to add native packages.

## Usage

The same import works on **web and React Native**:

```tsx
import { LineChart, BarChart, PieChart, SunburstChart } from 'react-d3-viz';

// Simple data
const sales = [
  { month: 'Jan', revenue: 42000, profit: 18000 },
  { month: 'Feb', revenue: 55000, profit: 22000 },
  { month: 'Mar', revenue: 49000, profit: 20000 },
];
```

### Basic Examples

**Line chart** (single series shorthand)
```tsx
<LineChart data={sales} x="month" y="revenue" width={600} height={300} />
```

**Multi-series with custom styling**
```tsx
<LineChart
  data={sales}
  x="month"
  series={[
    { dataKey: 'revenue', label: 'Revenue', color: '#2563eb' },
    { dataKey: 'profit', label: 'Profit', color: '#10b981' }
  ]}
  showPoints
  showGrid
  showLegend
/>
```

**Stacked bar chart**
```tsx
<BarChart
  data={sales}
  x="month"
  series={[
    { dataKey: 'revenue' },
    { dataKey: 'profit' }
  ]}
  stacked
  showTooltip
/>
```

**Pie chart (+ donut via `innerRadius`)**
```tsx
const pie = [
  { label: 'Product A', value: 240 },
  { label: 'Product B', value: 180 },
  { label: 'Product C', value: 120 },
];

<PieChart data={pie} value="value" label="label" />

// Donut
<PieChart data={pie} value="value" label="label" innerRadius={0.6} />

// Donut with a total in the center hole
<PieChart
  data={pie}
  value="value"
  label="label"
  innerRadius={0.6}
  centerLabel={(total) => total.toLocaleString()}
  centerSubLabel="Total"
/>
```
`centerLabel` (string or `(total: number) => string`) and `centerSubLabel` (string) render inside the donut hole (only shown when `innerRadius` > 0); `total` is the sum of the currently visible (non-legend-hidden) slice values.

**Hierarchical sunburst chart**
```tsx
const hierarchy = {
  name: 'root',
  value: 1000,
  children: [
    {
      name: 'Branch A',
      value: 600,
      children: [
        { name: 'Leaf A1', value: 300 },
        { name: 'Leaf A2', value: 300 }
      ]
    },
    { name: 'Branch B', value: 400 }
  ]
};

<SunburstChart
  data={hierarchy}
  value="value"
  label="name"
  childrenKey="children"
/>
```

**Candlestick / OHLC chart**
```tsx
const daily = [
  { date: '2026-01-02', open: 100.0, high: 104.5, low: 98.2, close: 103.1 },
  { date: '2026-01-05', open: 103.1, high: 105.8, low: 101.5, close: 102.0 },
  { date: '2026-01-06', open: 102.0, high: 102.9, low: 97.4, close: 98.6 },
];

<CandlestickChart
  data={daily}
  x="date"
  open="open"
  high="high"
  low="low"
  close="close"
  upColor="#10b981"
  downColor="#ef4444"
/>
```
`x` is stringified into a `band` scale (like `BarChart`'s x-axis), so non-trading days never show as gaps. `open`/`high`/`low`/`close` are `Accessor<number>` — a key or a function.

**Funnel chart (conversion funnel)**
```tsx
const conversion = [
  { stage: 'Visitors', count: 10000 },
  { stage: 'Signups', count: 4200 },
  { stage: 'Trials', count: 2100 },
  { stage: 'Paid', count: 640 },
];

<FunnelChart
  data={conversion}
  value="count"
  label="stage"
  showDropOff
/>
```
Stages taper continuously (each stage's top width matches the previous stage's bottom width) and are floored at a minimum width so a near-zero final stage stays visible. `showDropOff` (default true) renders the percentage drop between consecutive stages in the gap between them.

**Gauge chart (speedometer / KPI dial)**
```tsx
<GaugeChart
  value={78}
  min={0}
  max={100}
  thresholds={[
    { from: 0, to: 50, color: '#ef4444' },
    { from: 50, to: 80, color: '#f59e0b' },
    { from: 80, to: 100, color: '#10b981' },
  ]}
  formatValue={(v) => `${Math.round(v)}%`}
/>
```
`value` is clamped to `[min, max]` (default 0/100) before it's plotted — the needle, arc, and value label all reflect the clamped reading. Pass `thresholds` (`{from, to, color, label?}[]`) for colored zones (e.g. red/yellow/green); omit it for a single-color progress arc using `colors`/the theme palette. `startAngle`/`endAngle` (radians) customize the sweep — the default is a speedometer-style ~270° sweep, not a plain semicircle. `showNeedle`, `showTicks`, and `showValue` each default to `true`.

**Calendar Heatmap (GitHub-style contribution graph)**
```tsx
const activity = [
  { date: '2026-01-02', value: 4 },
  { date: '2026-01-03', value: 12 },
  { date: '2026-01-06', value: 1 },
  // ...one entry per active day — gaps are fine
];

<CalendarHeatmapChart
  data={activity}
  colorStart="#ebedf0"
  colorEnd="#196127"
/>
```
Renders one cell per calendar day in `[startDate, endDate]` (auto-derived from `data`'s date extent when omitted); days without a matching entry render as neutral/empty cells rather than being skipped, so the grid always covers the full range. `weekStart` (`0` Sunday-first / `1` Monday-first, default `0`) and `cellSize` (a max — it shrinks, never grows, to fit the container width) control the grid. `colorStart`/`colorEnd` set the sequential value scale (same convention as `HeatmapChart`); `colorDomain` overrides the auto-derived `[min, max]`.

> 💡 **All examples are live & editable** in the **[Interactive Playground](https://kiranb555.github.io/react-d3-viz-ui/)**. Edit the code, change props, and see updates instantly.

### Responsive Sizing

Every chart is **responsive by default** — `width="auto"` makes it fill its container and re-flow on resize (web) or rotation (native). Measurement is built-in; no wrapper component needed.

```tsx
// Default: fills parent width, fixed height
<LineChart data={data} x="month" y="sales" height={280} />

// Fully fluid: height derives from width via aspect ratio
<LineChart data={data} x="month" y="sales" height="auto" aspect={1.6} />

// Fixed size: no measurement overhead
<LineChart data={data} x="month" y="sales" width={600} height={300} />
```

**On React Native:** wrap the chart in a `View` with a width — responsive sizing works automatically via `onLayout`.

```tsx
<View style={{ width: '100%' }}>
  <LineChart data={data} x="month" y="sales" height={280} />
</View>
```


## Customization & Theming

### Per-Chart Props

Every chart accepts a standard set of props for controlling appearance and behavior:

```tsx
<LineChart
  data={data}
  x="month"
  y="sales"
  width={600}
  height={300}
  margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
  showGrid={true}
  showXAxis={true}
  showYAxis={true}
  showTooltip={true}
  showLegend={true}
  xTickCount={5}
  yTickCount={5}
  formatX={(v) => v.toUpperCase()}
  formatY={(v) => `$${v}k`}
  animate={true}
/>
```

**Series-level props:** `color`, `label`, `curve` (line/area), `strokeWidth`, `showPoints`, `fillOpacity`, `dashArray`, and more.

### Global & Per-Chart Theming

**Theme Provider** — customize globally across your entire app:

```tsx
<ThemeProvider theme={{
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  background: { color: '#ffffff' },
  font: { family: 'Inter, sans-serif', size: 12 },
  axis: { stroke: '#d1d5db', textColor: '#374151' },
  grid: { stroke: '#e5e7eb', dashArray: '4 4' },
  tooltip: { backgroundColor: '#1f2937', textColor: '#ffffff' },
  legend: { position: 'bottom' },
  animation: { enabled: true, duration: 400 }
}}>
  <Dashboard />
</ThemeProvider>
```

**Per-chart override** — merge over the provider theme for a single chart:

```tsx
<BarChart
  data={data}
  x="month"
  y="sales"
  theme={{
    colors: ['#ff6b6b', '#4ecdc4'],
    animation: { enabled: false }
  }}
/>
```

**Theme structure:**
- `colors` — array of hex/rgb colors for series
- `background`, `font`, `axis`, `grid`, `tooltip`, `legend` — styling objects
- `animation` — `{ enabled: boolean, duration: ms }`

## Interactivity

- **Tooltips** — hover (web) or touch (native) shows a crosshair + per-series values.
- **Legends** — tap/click a legend item to toggle a series; pie/radar slices toggle too.
- **Animations** — series animate in on mount; disable via `animate={false}` or `theme.animation.enabled`.

## React Native

Consumers install `react-native-svg`; the same import works:

```tsx
import { LineChart } from 'react-d3-viz';

// Wrap in a View with a width — responsive sizing works via onLayout.
<View style={{ width: '100%' }}>
  <LineChart data={data} x="month" y="sales" height={280} />
</View>
```

---

## Performance & Bundle Size

### Lightweight by Design

- **Tree-shakeable** — `"sideEffects": false`. Import one chart, ship one chart.
- **Pure D3 modules only** — `d3-scale`, `d3-shape`, `d3-array` (pure JS, ~30 KB gzipped combined).
- **No Canvas, no `d3-axis`, no DOM** — everything is composable SVG.
- **Responsive measurement built-in** — no layout-shift helper components.
- **TypeScript included** — `.d.ts` shipped inline, zero runtime overhead.

### Bundle Impact

| Scenario | Size |
|----------|------|
| Single chart (LineChart) | ~8 KB (gzipped) |
| Three charts | ~12 KB (gzipped) |
| All 20 charts | ~51 KB (gzipped) |

See [Bundlephobia](https://bundlephobia.com/package/react-d3-viz) for live build size analysis.

### Rendering Performance

- **SVG-based** — renders on rAF tween loops, smooth 60 FPS animations on modern hardware.
- **Responsive without layout thrashing** — measurement via `ResizeObserver` (web) or `onLayout` (native).
- **Optional animations** — disable with `animate={false}` for instant renders.
- **No external dependencies for rendering** — pure React components, no extra abstractions.

---

## Comparison with Other Libraries

| Feature | react-d3-viz | recharts | victory | nivo |
|---------|---|---|---|---|
| **Cross-platform (web + RN)** | ✅ | ❌ | ❌ | ❌ |
| **Tree-shakeable** | ✅ | ⚠️ | ⚠️ | ❌ |
| **TypeScript support** | ✅ Full | ✅ Partial | ✅ Full | ✅ Full |
| **Chart types** | 20 | 11 | 10+ | 27+ |
| **Themeable** | ✅ Full | ✅ Partial | ✅ Partial | ✅ Full |
| **Bundle size (single chart)** | ~8 KB | ~15 KB | ~20 KB | ~45 KB |
| **SVG only** | ✅ | ✅ | ✅ | ✅ Canvas option |

---

## Development & Contributing

### Setup

```bash
git clone https://github.com/kiranb555/react-d3-viz.git
cd react-d3-viz
npm install
```

### Commands

```bash
npm run dev      # Vite dev server (src/App.tsx) — view all 20 charts
npm test         # Vitest — 89+ unit & render tests
npm run build    # tsc → dist/ (preserves .native platform adapters)
npm run lint     # ESLint
npm run storybook # Storybook — interactive component library
npm run shots    # Regenerate README screenshots (requires npm run dev)
```

### Architecture

- **`src/core/`** — Pure-JS compute (scales, shapes, ticks, layout algorithms). No React, no DOM.
- **`src/primitives/`** — SVG primitive adapter. Resolves to web (DOM) or native (`react-native-svg`) at build time.
- **`src/components/`** — React chart components using `CartesianChart` frame (x/y charts) or self-contained (radial/hierarchical).
- **`src/theme/`** — Global `ThemeProvider` and per-chart theme merging.
- **`test/`** — Unit tests for core math, render tests for components.

See [`CLAUDE.md`](./CLAUDE.md) for full architecture details.

### Contributing

- **Bug reports & feature requests** — [GitHub Issues](https://github.com/kiranb555/react-d3-viz/issues)
- **Pull requests** — All contributions welcome. See `CLAUDE.md` for development standards.
- **Code style** — ESLint + Prettier (auto-applied on commit).
- **Tests required** — All new features/bugfixes must include unit tests.

---

## License

[MIT](./LICENSE) © [kirandev.in](https://www.kirandev.in)

---

**Questions or feedback?** Open an [issue](https://github.com/kiranb555/react-d3-viz/issues) or start a [discussion](https://github.com/kiranb555/react-d3-viz/discussions).
