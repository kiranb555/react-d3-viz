# HeatmapChart

A 2D grid visualization where each cell is colored based on its numeric value. Perfect for displaying correlations, time-series patterns, or any data where you want to encode values as colors.

## Features

- **2D Grid Layout**: Rows and columns with categorical labels
- **Color Encoding**: Linear or diverging color scales
- **Interactive Tooltips**: Hover to see row, column, and value information
- **Flexible Customization**: Cell colors, strokes, labels, and formatting options
- **Cross-Platform**: Works on both web (SVG) and React Native (via `react-native-svg`)
- **Responsive**: Auto-sizing with `width="auto"` or explicit dimensions

## Usage

```tsx
import { HeatmapChart } from 'react-d3-viz';

const data = [
  { row: 'A', col: 'X', value: 10 },
  { row: 'A', col: 'Y', value: 20 },
  { row: 'B', col: 'X', value: 30 },
  { row: 'B', col: 'Y', value: 40 },
];

export function MyChart() {
  return (
    <HeatmapChart
      data={data}
      rowKey="row"
      columnKey="col"
      valueKey="value"
      height={300}
    />
  );
}
```

## Props

### Data

- **`data`** `Datum[]` — Array of data records. Each record should contain row/column/value info.
- **`rowKey`** `Accessor<string> | string` — Accessor or key to extract the row label (y-axis).
- **`columnKey`** `Accessor<string> | string` — Accessor or key to extract the column label (x-axis).
- **`valueKey`** `Accessor<number> | string` — Accessor or key to extract the numeric value for coloring.

### Sizing

- **`width`** `Dimension` — Pixel width or `'auto'` (default) to fill the parent. Auto re-flows on resize.
- **`height`** `Dimension` — Pixel height or `'auto'` to derive from width via `aspect`. Default: `'auto'`.
- **`aspect`** `number` — Width / height ratio when height is `'auto'`. Default: `0.75`.

### Styling

- **`margin`** `Partial<Margin>` — Spacing around the heatmap. Default uses `DEFAULT_MARGIN`.
- **`theme`** `DeepPartial<ChartTheme>` — Override default theme (colors, fonts, animation, etc.).
- **`cellStroke`** `string` — Cell border color. Default: `'#ffffff'`.
- **`cellStrokeWidth`** `number` — Cell border width. Default: `1`.

### Color Scales

- **`colorScaleMode`** `'linear' | 'diverging'` — Color interpolation mode. Default: `'linear'`.
- **`colorStart`** `string` — Start color (hex). Default for linear: `'#e8eaf6'` (light).
- **`colorEnd`** `string` — End color (hex). Default for linear: `'#1a237e'` (dark).
- **`colorMid`** `string` — Middle color for diverging scales. Default: `'#ffffff'`.
- **`colorDomain`** `NumericDomain` — Explicit `[min, max]` for the color scale. If omitted, derived from data.

### Interaction

- **`showXLabels`** `boolean` — Show column header labels. Default: `true`.
- **`showYLabels`** `boolean` — Show row labels. Default: `true`.
- **`showTooltip`** `boolean` — Show tooltip on hover. Default: `true`.
- **`animate`** `boolean` — Enable enter animations. Default: `true`.

### Formatting

- **`formatValue`** `(value: number) => string` — Format values in tooltips. Default: `(v) => v.toFixed(2)`.

## Examples

### Temperature Heatmap (Linear Scale)

```tsx
const tempData = [
  { hour: '00:00', day: 'Mon', temp: 15 },
  { hour: '04:00', day: 'Mon', temp: 12 },
  { hour: '08:00', day: 'Mon', temp: 18 },
  { hour: '12:00', day: 'Mon', temp: 24 },
  // ...more data
];

<HeatmapChart
  data={tempData}
  rowKey="day"
  columnKey="hour"
  valueKey="temp"
  formatValue={(v) => `${v}°C`}
  colorStart="#4575b4"
  colorEnd="#d73027"
  height={250}
/>
```

### Correlation Matrix (Diverging Scale)

```tsx
const corrData = [
  { x: 'A', y: 'A', value: 1.0 },
  { x: 'B', y: 'A', value: 0.85 },
  { x: 'C', y: 'A', value: -0.6 },
  // ...more data
];

<HeatmapChart
  data={corrData}
  rowKey="y"
  columnKey="x"
  valueKey="value"
  colorScaleMode="diverging"
  colorStart="#d73027"
  colorMid="#f7f7f7"
  colorEnd="#4575b4"
  colorDomain={[-1, 1]}
  formatValue={(v) => v.toFixed(2)}
  height={280}
/>
```

### Sales Heatmap with Custom Colors

```tsx
const salesData = [
  { product: 'Laptop', region: 'North', sales: 450 },
  { product: 'Laptop', region: 'South', sales: 380 },
  // ...more data
];

<HeatmapChart
  data={salesData}
  rowKey="product"
  columnKey="region"
  valueKey="sales"
  formatValue={(v) => `$${v}`}
  colorStart="#ffffcc"
  colorEnd="#003300"
  cellStroke="#cccccc"
  cellStrokeWidth={2}
  height={300}
/>
```

## Accessor Functions

Accessors can be string keys (for simple field lookups) or custom functions:

```tsx
// String key (simple case)
<HeatmapChart data={data} rowKey="day" columnKey="hour" valueKey="temp" />

// Custom accessor function
<HeatmapChart
  data={data}
  rowKey={(d) => d.dateObj.toLocaleDateString()}
  columnKey={(d, i) => `Hour ${i}`}
  valueKey={(d) => parseFloat(d.tempStr)}
/>
```

## Theme Integration

Customize colors, fonts, and animations globally via `ThemeProvider` or per-chart with the `theme` prop:

```tsx
<HeatmapChart
  data={data}
  rowKey="row"
  columnKey="col"
  valueKey="value"
  theme={{
    background: '#f5f5f5',
    axis: { labelColor: '#333', labelSize: 14 },
    animation: { enabled: false },
    tooltip: { background: '#222', color: '#fff' },
  }}
/>
```

## Performance Notes

- Heatmaps efficiently render cell grids using SVG primitives.
- Large datasets (500+ cells) render smoothly but may benefit from disabling animations (`animate={false}`).
- For very large matrices (1000+ cells), consider pre-aggregating or sampling data to reduce visual complexity.

## TypeScript

All props and types are fully typed:

```tsx
import type { HeatmapChartProps } from 'react-d3-viz';

const props: HeatmapChartProps = {
  data: myData,
  rowKey: 'row',
  columnKey: 'col',
  valueKey: 'value',
};
```

## See Also

- **`createLinearColorScale`** / **`createDivergingColorScale`** — Color scale utilities exported from `react-d3-viz/core/heatmap`.
- **`computeHeatmapCells`**, **`heatmapExtent`** — Lower-level heatmap compute functions for custom implementations.
