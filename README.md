<div align="center">

# react-d3-viz

### Cross-platform **SVG charts** for **React (web)** and **React Native** — one API, one codebase.

SVG-only (no Canvas), composable, fully themeable — with tooltips, interactive legends, and lightweight enter animations.

<p>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="npm version" src="https://img.shields.io/npm/v/react-d3-viz?color=cb3837&label=npm&logo=npm"></a>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="npm downloads" src="https://img.shields.io/npm/dm/react-d3-viz?color=cb3837&logo=npm"></a>
  <a href="https://bundlephobia.com/package/react-d3-viz"><img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/react-d3-viz?color=44cc11&label=minzipped"></a>
  <a href="https://www.npmjs.com/package/react-d3-viz"><img alt="types included" src="https://img.shields.io/npm/types/react-d3-viz?logo=typescript&logoColor=white"></a>
  <a href="https://github.com/kiranb555/react-d3-viz/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/react-d3-viz?color=blue"></a>
  <img alt="platforms" src="https://img.shields.io/badge/platforms-React%20%7C%20React%20Native-61dafb?logo=react&logoColor=white">
</p>

**[▶ Live Playground](https://kiranb555.github.io/react-d3-viz-ui/)** · **[GitHub](https://github.com/kiranb555/react-d3-viz)** · **[npm](https://www.npmjs.com/package/react-d3-viz)**

<br>

<img src="https://raw.githubusercontent.com/kiranb555/react-d3-viz/main/assets/hero.png" alt="react-d3-viz charts" width="820">

</div>

<br>

## Why react-d3-viz

Most chart libraries are web-only. react-d3-viz separates **geometry computation** (pure JS via `d3-scale` / `d3-shape` / `d3-array`) from **rendering** (a thin SVG primitive adapter), so the **exact same chart code runs on the web (DOM SVG) and on React Native (`react-native-svg`)**. No `d3-axis`, no Canvas, no `foreignObject` — everything is drawn with portable SVG primitives.

| | |
|---|---|
| 📱 **Truly cross-platform** | One import, one codebase — runs on web **and** React Native. Axes, grid, legend, and tooltips all render *inside* the SVG for pixel parity. |
| 🪶 **Lightweight & tree-shakeable** | Ships as ESM with `"sideEffects": false`. Only `d3-scale`, `d3-shape`, `d3-array` (pure JS) are bundled — import one chart, ship one chart. |
| 🤝 **No framework lock-in** | `react` / `react-dom` are peer deps (web). On React Native you add `react-native-svg` yourself — it's **not** a peer dependency, so web installs never get prompted for native packages. Nothing is bundled or duplicated. |
| 🔷 **TypeScript-first** | Written in TypeScript, ships `.d.ts` declarations for every component, prop, and theme token. |
| 🎨 **Themeable end-to-end** | A single `ThemeProvider`, or per-chart overrides merged over sensible defaults. |
| ✅ **Tested** | 44 unit + jsdom render tests across the compute core and components (Vitest). |

> **Coming from [recharts](https://www.npmjs.com/package/recharts) or [victory](https://www.npmjs.com/package/victory)?** Those are excellent on the web, but web-only. react-d3-viz targets the same composable, themeable API while running unchanged on **React Native** too. See the [size on Bundlephobia](https://bundlephobia.com/package/react-d3-viz) and the [download trend](https://npmtrends.com/react-d3-viz).

## Charts

`LineChart` · `AreaChart` · `BarChart` (grouped & stacked) · `ScatterPlot` · `BubbleChart` · `PieChart` (+ donut) · `Histogram` · `RadarChart` · `TreemapChart` (flat, grouped & nested) · `WaterfallChart` · `SankeyDiagram` · `MekkoChart`

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
    <td></td>
  </tr>
</table>

> 🎮 **Play with every chart, prop, and theme live in the [Playground →](https://kiranb555.github.io/react-d3-viz-ui/)**

## Install

```bash
# web
npm i react-d3-viz

# React Native (also install the peer)
npm i react-d3-viz react-native-svg
```

`react` (+ `react-dom` on web) is the only peer dependency. `react-native-svg` is required **only** for React Native — you install it there yourself; it is intentionally not a peer dependency, so web installs are never prompted to add native packages.

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

> 💡 Don't want to copy-paste blind? Every snippet above is editable in the **[Live Playground](https://kiranb555.github.io/react-d3-viz-ui/)**.

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

## React Native

Consumers install `react-native-svg`; the same import works:

```tsx
import { LineChart } from 'react-d3-viz';

// Wrap in a View with a width — responsive sizing works via onLayout.
<View style={{ width: '100%' }}>
  <LineChart data={data} x="month" y="sales" height={280} />
</View>
```

## Development

```bash
npm run dev    # Vite demo harness (src/App.tsx) showing every chart
npm test       # Vitest (core unit tests + jsdom render tests)
npm run build  # tsc → dist/ (preserves web + .native adapters)
npm run lint
npm run shots  # regenerate README screenshots (needs `npm run dev` running)
```

See [`CLAUDE.md`](./CLAUDE.md) for architecture details.

## License

[MIT](./LICENSE) © [kirandev.in](https://www.kirandev.in)
