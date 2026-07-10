// ── Theming ──────────────────────────────────────────────────────────────
export { ThemeProvider } from './theme/ThemeProvider';
export type { ThemeProviderProps } from './theme/ThemeProvider';
export { useTheme, defaultTheme, mergeTheme } from './theme/useTheme';
export type { ChartTheme, DeepPartial } from './theme/useTheme';

// ── Charts ───────────────────────────────────────────────────────────────
export { LineChart } from './components/charts/LineChart/LineChart';
export type { LineChartProps } from './components/charts/LineChart/LineChart';

export { AreaChart } from './components/charts/AreaChart/AreaChart';
export type { AreaChartProps } from './components/charts/AreaChart/AreaChart';

export { BarChart } from './components/charts/BarChart/BarChart';
export type { BarChartProps } from './components/charts/BarChart/BarChart';

export { ScatterPlot } from './components/charts/ScatterPlot/ScatterPlot';
export type { ScatterPlotProps } from './components/charts/ScatterPlot/ScatterPlot';

export { BubbleChart } from './components/charts/BubbleChart/BubbleChart';
export type { BubbleChartProps } from './components/charts/BubbleChart/BubbleChart';

export { PieChart } from './components/charts/PieChart/PieChart';
export type { PieChartProps } from './components/charts/PieChart/PieChart';

export { Histogram } from './components/charts/Histogram/Histogram';
export type { HistogramProps } from './components/charts/Histogram/Histogram';

export { RadarChart } from './components/charts/RadarChart/RadarChart';
export type { RadarChartProps } from './components/charts/RadarChart/RadarChart';

export { TreemapChart } from './components/charts/TreemapChart/TreemapChart';
export type { TreemapChartProps } from './components/charts/TreemapChart/TreemapChart';

export { WaterfallChart } from './components/charts/WaterfallChart/WaterfallChart';
export type { WaterfallChartProps } from './components/charts/WaterfallChart/WaterfallChart';

export { MekkoChart } from './components/charts/MekkoChart/MekkoChart';
export type { MekkoChartProps } from './components/charts/MekkoChart/MekkoChart';

export { SankeyDiagram } from './components/charts/SankeyDiagram/SankeyDiagram';
export type { SankeyDiagramProps } from './components/charts/SankeyDiagram/SankeyDiagram';
export type {
  SankeyNode,
  SankeyLink,
  SankeyData,
} from './core/sankey';

export { ButterflyChart } from './components/charts/ButterflyChart';
export type { ButterflyChartProps } from './components/charts/ButterflyChart';

export { HeatmapChart } from './components/charts/HeatmapChart/HeatmapChart';
export type { HeatmapChartProps } from './components/charts/HeatmapChart/HeatmapChart';

export { SunburstChart } from './components/charts/SunburstChart/SunburstChart';
export type { SunburstChartProps } from './components/charts/SunburstChart/SunburstChart';

export { QuadrantChart } from './components/charts/QuadrantChart/QuadrantChart';
export type { QuadrantChartProps } from './components/charts/QuadrantChart/QuadrantChart';

export { CandlestickChart } from './components/charts/CandlestickChart/CandlestickChart';
export type { CandlestickChartProps } from './components/charts/CandlestickChart/CandlestickChart';

export type {
  WaterfallDataPoint,
  WaterfallLayoutResult,
} from './core/waterfall';

// ── Composable building blocks ─────────────────────────────────────────────
export { CartesianChart } from './components/CartesianChart';
export type { CartesianChartProps, XScaleType } from './components/CartesianChart';
export { Grid } from './components/Grid';
export type { GridProps } from './components/Grid';
export { XAxis, YAxis } from './components/Axis';
export type { AxisProps } from './components/Axis';
export { Legend } from './components/Legend';
export type { LegendProps } from './components/Legend';
export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';
export { ChartContext, useChartContext } from './components/ChartContext';
export type {
  SeriesConfig,
  ResolvedSeries,
  CartesianContextValue,
  ActivePoint,
} from './components/chartTypes';

// ── SVG primitives (web / native resolved at build time) ───────────────────
export { Svg, G, Path, Rect, Circle, Line, SvgText } from './primitives';
export type {
  SvgRootProps,
  GProps,
  PathProps,
  RectProps,
  CircleProps,
  LineProps,
  TextProps,
  GestureEvent,
} from './primitives/types';

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useAnimatedValue } from './hooks/useAnimatedValue';
export type { AnimationOptions } from './hooks/useAnimatedValue';
export { useContainerSize } from './hooks/useContainerSize';
export type { ContainerSize } from './hooks/useContainerSize';
export { useAutoSize } from './hooks/useAutoSize';
export type { Dimension, ResolvedSize } from './hooks/useAutoSize';

// ── Pure compute core (platform-agnostic) ──────────────────────────────────
export { numericDomain, linear, time, band, point } from './core/scales';
export { linePath, areaPath, pieArcs, resolveCurve } from './core/shapes';
export type { CurveType, Point, ComputedArc } from './core/shapes';
export { treemapLayout } from './core/treemap';
export type { TreemapInput, TreemapOptions, TreemapRect, ChildrenAccessor } from './core/treemap';
export { sunburstLayout } from './core/sunburst';
export type { SunburstInput, SunburstOptions, SunburstArc, ChildrenAccessor as SunburstChildrenAccessor } from './core/sunburst';
export { continuousTicks, categoricalTicks } from './core/ticks';
export { computeBounds, DEFAULT_MARGIN } from './core/bounds';
export { clamp01, lerp, lerpArray, easing } from './core/interpolate';
export { makeAccessor, getNumber, getCategory } from './core/accessors';
export type { Accessor } from './core/accessors';
export { calculateMekkoLayout } from './core/mekko';
export type { MekkoCategory, MekkoSeriesData, MekkoSeries, MekkoData, MekkoSegment, MekkoColumn, MekkoLayoutResult } from './core/mekko';
export { createLinearColorScale, createDivergingColorScale, computeHeatmapCells, heatmapExtent } from './core/heatmap';
export type { HeatmapColorScale, HeatmapCell, ColorInterpolation } from './core/heatmap';
export { candlestickGeometry } from './core/candlestick';
export type { OHLC, CandleGeometry, CandlestickOptions } from './core/candlestick';
export type { Datum, Margin, ChartBounds, NumericDomain, Tick } from './core/types';

// ── Color palettes & data helpers ──────────────────────────────────────────
export { CATEGORICAL, SEQUENTIAL_BLUE, SEQUENTIAL_GREEN, DIVERGING, getColor } from './utils/colorPalettes';
export { getNumericExtent, getDateExtent, bin, generateLinearData, generateScatterData } from './utils/dataHelpers';
