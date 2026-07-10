import { CartesianChart } from '../../CartesianChart';
import { Candles } from './Candles';
import type { Accessor } from '../../../core/accessors';
import type { Datum, Margin } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';
import type { Dimension } from '../../../hooks/useAutoSize';
import type { SeriesConfig } from '../../chartTypes';

export interface CandlestickChartProps {
  data: Datum[];
  /** Accessor for the x category (date/label). Stringified via a `band` scale — this
   * naturally skips non-trading days without needing a `time` scale. */
  x: Accessor<unknown>;
  open: Accessor<number>;
  high: Accessor<number>;
  low: Accessor<number>;
  close: Accessor<number>;
  /** Pixel width, or 'auto' (default) to fill the parent and re-flow on resize. */
  width?: Dimension;
  /** Pixel height, or 'auto' to derive from width via `aspect`. Default 300. */
  height?: Dimension;
  /** width / height ratio used when height is 'auto'. Default 2. */
  aspect?: number;
  margin?: Partial<Margin>;
  theme?: DeepPartial<ChartTheme>;
  /** Fill color for up (close >= open) candles. Default a green. */
  upColor?: string;
  /** Fill color for down (close < open) candles. Default a red. */
  downColor?: string;
  /** Wick stroke width. Default 1. */
  wickWidth?: number;
  /** Candle body width as a fraction of the category bandwidth. Default 0.7. */
  bodyWidthRatio?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  /** A legend adds no value for a single instrument. Default false. */
  showLegend?: boolean;
  xTickCount?: number;
  yTickCount?: number;
  formatX?: (value: unknown, index: number) => string;
  formatY?: (value: number) => string;
  /** Disable enter animation regardless of theme. */
  animate?: boolean;
}

const DEFAULT_UP_COLOR = '#10b981'; // emerald
const DEFAULT_DOWN_COLOR = '#ef4444'; // red

/**
 * Candlestick / OHLC chart for financial time series. Wraps `CartesianChart` with
 * `xScaleType="band"` (the date/category accessor is stringified into band categories,
 * matching `BarChart`'s pattern) so non-trading days are skipped for free without needing
 * a `time` scale.
 *
 * Builds a synthetic 4-pseudo-series (open/high/low/close) purely so `CartesianChart`'s
 * existing y-domain computation covers `[min(low), max(high)]`, and so the default
 * `Tooltip` shows O/H/L/C rows — without any changes to `CartesianChart` itself. The actual
 * candle geometry is computed by the pure `core/candlestick.ts` module and rendered by
 * `Candles`, which reads open/high/low/close straight off `data`.
 */
export function CandlestickChart({
  data,
  x,
  open,
  high,
  low,
  close,
  upColor = DEFAULT_UP_COLOR,
  downColor = DEFAULT_DOWN_COLOR,
  wickWidth,
  bodyWidthRatio,
  showLegend = false,
  animate,
  ...rest
}: CandlestickChartProps) {
  const series: SeriesConfig[] = [
    { dataKey: open, label: 'Open', color: upColor },
    { dataKey: high, label: 'High', color: upColor },
    { dataKey: low, label: 'Low', color: downColor },
    { dataKey: close, label: 'Close', color: downColor },
  ];

  return (
    <CartesianChart
      {...rest}
      data={data}
      x={x}
      series={series}
      xScaleType="band"
      showLegend={showLegend}
      renderSeries={() => (
        <Candles
          open={open}
          high={high}
          low={low}
          close={close}
          upColor={upColor}
          downColor={downColor}
          wickWidth={wickWidth}
          bodyWidthRatio={bodyWidthRatio}
          animate={animate}
        />
      )}
    />
  );
}
