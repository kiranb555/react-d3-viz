# react-d3-viz

Cross-platform **SVG chart library** for **React (web) and React Native** — one API, one codebase. SVG-only (no Canvas), composable, fully themeable, with tooltips, interactive legends, and lightweight enter animations.

## Why

Most chart libraries are web-only. This one separates **geometry computation** (pure JS via `d3-scale`/`d3-shape`/`d3-array`) from **rendering** (a thin SVG primitive adapter), so the exact same charts run on the web (DOM SVG) and on React Native (`react-native-svg`). No `d3-axis`, no Canvas, no `foreignObject` — everything is drawn with portable SVG primitives.

## Charts

`LineChart` · `AreaChart` · `BarChart` (grouped & stacked) · `ScatterPlot` · `BubbleChart` · `PieChart` (+ donut) · `Histogram` · `RadarChart`

## Install

```bash
# web
npm i react-d3-viz

# React Native (also install the peer)
npm i react-d3-viz react-native-svg
```

`react`, `react-dom`, `react-native`, and `react-native-svg` are optional peer dependencies — only install what your platform needs.

## Usage

The same import works on web and native:

```tsx
import { LineChart, BarChart, PieChart, ThemeProvider } from 'react-d3-viz';

const data = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
];

// Single series (shorthand)
<LineChart data={data} x="month" y="sales" width={600} height={300} />

// Multiple series
<LineChart
  data={data}
  x="month"
  series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]}
  width={600}
  height={300}
  showPoints
/>

// Stacked bars
<BarChart data={data} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked />

// Donut
<PieChart data={pie} value="value" label="label" innerRadius={0.6} />
```

### Responsive sizing (`width="auto"`)

By default every chart is **responsive** — `width` defaults to `"auto"`, so the
chart fills its parent's width and re-flows when the container resizes (web) or
rotates (native). It measures itself via the SVG root (web: `ResizeObserver`,
native: `onLayout`) — no wrapper component needed.

```tsx
// Fills the parent; height stays fixed
<LineChart data={data} x="month" y="sales" height={280} />

// Fully fluid: height follows width via `aspect` (width / aspect)
<LineChart data={data} x="month" y="sales" height="auto" aspect={1.8} />

// Opt out — fixed pixel size, zero measurement overhead
<LineChart data={data} x="month" y="sales" width={600} height={300} />
```

The same applies on React Native (wrap the chart in a `View` with a width).

## Customization

**Per-chart props** — every chart accepts `width`, `height`, `margin`, `showGrid`, `showXAxis`, `showYAxis`, `showTooltip`, `showLegend`, `xTickCount`, `yTickCount`, `formatX`, `formatY`, and `animate`. Each series accepts `color`, `label`, `curve`, `strokeWidth`, `showPoints`, `fillOpacity`, `dashArray`.

**Theme** — override globally with `ThemeProvider`, or per-chart with the `theme` prop. Overrides are merged over the defaults:

```tsx
<ThemeProvider theme={{ colors: ['#ff6b6b', '#4ecdc4'], grid: { dashArray: '4 4' } }}>
  <App />
</ThemeProvider>

// or just one chart
<BarChart data={data} x="month" y="sales" theme={{ animation: { enabled: false } }} />
```

Theme groups: `colors`, `background`, `font`, `axis`, `grid`, `tooltip`, `legend`, `animation`.

## Interactivity

- **Tooltips** — hover (web) or touch (native) shows a crosshair + per-series values.
- **Legends** — tap/click a legend item to toggle a series; pie/radar slices toggle too.
- **Animations** — series animate in on mount; disable via `animate={false}` or `theme.animation.enabled`.

## Development

```bash
npm run dev    # Vite demo harness (src/App.tsx) showing every chart
npm test       # Vitest (core unit tests + jsdom render tests)
npm run build  # tsc → dist/ (preserves web + .native adapters)
npm run lint
```

See `CLAUDE.md` for architecture details.
