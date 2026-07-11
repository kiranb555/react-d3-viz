# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server — runs the demo harness (src/App.tsx)
npm run build      # tsc -p tsconfig.lib.json → dist/ (the publishable library)
npm test           # Vitest (core unit tests + jsdom render tests)
npm run lint       # ESLint
npm run storybook  # Storybook — every chart ships a `.stories.tsx` (see "Authoring a new chart")
```

## What this project is

A reusable **cross-platform SVG chart library** that runs on **both React (web) and React Native** from one codebase. It is published as a tree-shakeable package (entry `src/index.ts`). `react`/`react-dom` (web) are peer dependencies; `react-native` and `react-native-svg` are deliberately **not** listed as peers (so web installs are never prompted to install native packages — tools ignore `peerDependenciesMeta.optional`). Native consumers install `react-native-svg` themselves. Never bundle any of them. `d3-scale`, `d3-shape`, `d3-array` are regular dependencies (pure JS, platform-agnostic).

It is **SVG only** (no Canvas). `src/App.tsx` is the web demo/dev harness and is not part of the published package.

> History: this started as a web-only React+D3 lib with a Canvas renderer, `d3-axis`, and an HTML tooltip. Those are **React-Native-incompatible and have been removed**. Do not reintroduce `d3-axis`, `d3-selection`, `d3-zoom`, `<canvas>`, `foreignObject`, or raw DOM SVG elements in library code.

## Architecture (compute core + platform SVG adapter)

The core idea is **separating geometry computation from rendering** so the same charts run on web and native.

1. **`src/core/` — pure-JS compute core.** No DOM, no React. Uses only `d3-scale`, `d3-shape`, `d3-array`. Produces scales, SVG path strings (line/area/arc/pie), tick positions (`ticks.ts` replaces `d3-axis`), inner-bounds math, accessors, and rAF tween helpers. This is where most logic and tests live.

2. **`src/primitives/` — SVG primitive adapter.** A thin set of components (`Svg`, `G`, `Path`, `Rect`, `Circle`, `Line`, `SvgText`) with platform-neutral props (`primitives/types.ts`). Resolved per platform by the **bundler at build time**:
   - `primitives/index.tsx` → DOM SVG elements (web default; what `tsc`/Vite resolve).
   - `primitives/index.native.tsx` → `react-native-svg` (Metro resolves `.native`).

   Chart components import only `../primitives` and never branch on platform. Gestures are normalized: the `Svg` root exposes `onMove`/`onLeave` returning local coordinates from mouse/touch (web) or the responder system (native).

3. **`src/theme/` — theming.** `ThemeProvider` (context) + `defaultTheme` (palette, fonts, axis/grid/tooltip/legend styles, animation config). `useTheme(override)` merges a per-chart `theme` prop over the provider value.

4. **`src/components/` — chart components.** `CartesianChart` is the shared frame for x/y charts: it owns scales, ticks, legend toggling, and hover state, exposes them via `ChartContext`, renders the `Svg` root, and delegates series geometry to a `renderSeries` callback. `Grid`, `XAxis`/`YAxis`, `Legend`, `Tooltip` are SVG-native building blocks that read `ChartContext`. Everything (axes, grid, legend, tooltip) renders **inside the SVG** for cross-platform parity.

   Radial/hierarchical charts (`PieChart`, `RadarChart`, `TreemapChart`) are **self-contained** — they do not use the Cartesian frame.

### D3 module usage

Import granularly for tree-shaking — never `import * as d3 from 'd3'`. **Only** these are allowed (all pure JS / RN-safe):

| Module | Purpose |
|---|---|
| `d3-scale` | `scaleLinear`, `scaleBand`, `scalePoint`, `scaleTime`, `scaleSqrt` — in `core/scales.ts` |
| `d3-array` | `extent`, `bin` — in `core/scales.ts`, `utils/dataHelpers.ts` |
| `d3-shape` | line/area/arc/pie generators → path strings — in `core/shapes.ts` |

`d3-axis`, `d3-selection`, `d3-zoom` are **forbidden** (DOM-bound).

## Folder structure

```
src/
├── index.ts                       # Public API
├── core/                          # pure JS, platform-agnostic, heavily tested
│   ├── scales.ts  shapes.ts  ticks.ts  treemap.ts  bounds.ts  interpolate.ts  accessors.ts  types.ts
├── primitives/
│   ├── types.ts                   # platform-neutral SVG prop shapes
│   ├── index.tsx                  # web (DOM) adapter (default)
│   └── index.native.tsx           # react-native-svg adapter
├── theme/                         # defaultTheme.ts  ThemeProvider.tsx  useTheme.ts
├── hooks/                         # useAnimatedValue.ts (rAF)  useContainerSize.ts (web)
├── components/
│   ├── CartesianChart.tsx  ChartContext.ts  chartTypes.ts
│   ├── Grid.tsx  Axis.tsx  Legend.tsx  Tooltip.tsx
│   └── charts/                    # one folder per chart
│       ├── common.ts              # BaseCartesianProps + resolveSeries
│       ├── LineChart/  AreaChart/  BarChart/  ScatterPlot/
│       ├── BubbleChart/  PieChart/  Histogram/  RadarChart/  TreemapChart/
└── utils/                         # colorPalettes.ts  dataHelpers.ts
```

## Charts

LineChart, AreaChart, BarChart (grouped + `stacked`), ScatterPlot, BubbleChart, QuadrantChart, PieChart (+ donut via `innerRadius`), Histogram, RadarChart, TreemapChart (flat, grouped via `group`, or nested via `childrenKey`), SunburstChart (hierarchical radial with drill-down), WaterfallChart, SankeyDiagram, MekkoChart, ButterflyChart, CandlestickChart (OHLC, `xScaleType: 'band'` on the stringified date accessor), FunnelChart (continuously-tapering conversion funnel, self-contained), GaugeChart (speedometer/KPI dial, self-contained, single-value), CalendarHeatmapChart (GitHub-contribution-graph-style day grid, self-contained). The treemap's squarify tiling and sunburst's angle partitioning live in `core/treemap.ts` and `core/sunburst.ts` — implemented in-house (no `d3-hierarchy`), the same way `core/ticks.ts` replaced `d3-axis`. The gauge's needle/tick trig and threshold-band angle math live in `core/gauge.ts`, built on `core/shapes.ts`'s `arcPath()` (a standalone `d3-shape` `arc()` wrapper, not routed through `d3.pie()`) — hand-rolled the same way. The calendar heatmap's week/weekday grid and month-label placement live in `core/calendarHeatmap.ts`, using only UTC date math (`Date.UTC`/`getUTC*`) — hand-rolled the same way, no date library.

Cartesian charts share `BaseCartesianProps` (`data`, `x`, `series` or `y` shorthand, `width`/`height`, `margin`, `theme`, `show*`, formatters, `animate`). Customize via the theme (global) or per-component props (local). Interactivity: SVG tooltips (hover/touch), interactive legends (tap to toggle series), hover/touch highlight, optional rAF enter animations.

## Authoring a new chart

When asked to add a new chart, follow these standards exactly:

1. **Placement** — one folder `src/components/charts/<Name>/<Name>.tsx`. Cartesian (x/y) charts use the `CartesianChart` frame + a `renderSeries` callback. Radial/hierarchical charts are self-contained (own `Svg` root), modeled on `PieChart.tsx`.
2. **Compute vs. render** — all geometry/layout math goes in a pure-JS `src/core/*.ts` module (no DOM, no React; only `d3-scale`/`d3-array`/`d3-shape`). The component only renders. If a normally-D3 layout isn't in the allowed modules (e.g. hierarchy), implement it in `core/` — see `core/treemap.ts` / `core/ticks.ts`.
3. **Primitives only** — import from `../../../primitives` (Svg/G/Rect/Path/Circle/Line/SvgText). Never use raw DOM SVG, `<canvas>`, `foreignObject`, `d3-axis`/`d3-selection`/`d3-zoom`, or import `react-native`.
4. **Props baseline** — `data`, accessor props typed `Accessor<T>`, `width`/`height`/`aspect`, `theme?: DeepPartial<ChartTheme>`, `colors?`, `show*` toggles, `animate?`, and any relevant formatter. Read theme via `useTheme`, size via `useAutoSize`, animate via `useAnimatedValue`.
5. **Standard interactivity** — SVG tooltip (hover/touch) and an interactive bottom legend (tap to toggle), matching the other charts.
6. **Always write tests** — unit-test the `core/` layout in `test/<name>.test.ts` (bounds, no overlap, proportionality, edge cases) **and** add a render case to `test/render.test.tsx`. `npm run lint`, `npm test`, and `npm run build` must all stay green.
7. **Always add a Storybook story** — ship `src/components/charts/<Name>/<Name>.stories.tsx` covering the main variants/props (every existing chart has one).
8. **Wire-up & docs (this repo)** — export the component + props type from `src/index.ts`; add a demo card to `src/App.tsx`; add a gallery tile in `screenshots/Gallery.tsx` + an entry in `scripts/shots.mjs`; add the chart to the README charts list and to this file.
9. **Always update the `react-d3-viz-ui` repo** — the docs site / live playground (https://kiranb555.github.io/react-d3-viz-ui/) is a **separate repository**. Add the new chart's documentation page and interactive examples there too. If that repo isn't checked out locally, flag it so it can be cloned/updated as a follow-up — a chart is not "done" until its docs + examples land there.

## Build output

`tsc -p tsconfig.lib.json` emits to `dist/` **preserving the source tree and platform suffixes** (`dist/primitives/index.js` + `dist/primitives/index.native.js`) so Metro/web bundlers resolve the right adapter. Do **not** switch the library build to a single-file bundler — that would erase `.native` resolution. `package.json` sets `"sideEffects": false`, a `react-native` export condition, and optional peer deps.

## Responsive sizing

Charts default to `width="auto"`: they render the SVG root at `width="100%"`, measure the laid-out pixel width, then re-render with that number. Measurement is built into the `Svg` primitive (web: `ResizeObserver` on the `<svg>`; native: `onLayout` on `RNSvg`) and surfaced through `useAutoSize` — so there is **no** platform wrapper component and the library never imports `react-native` itself. `height` may be a number (default 300) or `"auto"` (derived from width via `aspect`). Passing numeric `width`/`height` skips measurement entirely.

## React Native usage

Consumers install `react-native-svg`. The same import works: `import { LineChart } from 'react-d3-viz'`. Responsive sizing works on native too (via `onLayout`); wrap a chart in a `View` that has a width, or pass an explicit numeric `width`.
