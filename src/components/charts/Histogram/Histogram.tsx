import { CartesianChart } from '../../CartesianChart';
import { Bars } from '../BarChart/Bar';
import { bin as binData } from '../../../utils/dataHelpers';
import { getNumber } from '../../../core/accessors';
import type { Accessor } from '../../../core/accessors';
import type { Datum, Margin, NumericDomain } from '../../../core/types';
import type { ChartTheme, DeepPartial } from '../../../theme/defaultTheme';
import type { Dimension } from '../../../hooks/useAutoSize';

export interface HistogramProps {
  /** Raw numeric values to bin. Provide this OR `data` + `value`. */
  values?: number[];
  /** Records to bin (used with `value`). */
  data?: Datum[];
  /** Accessor selecting the numeric value from each record. */
  value?: Accessor<number>;
  /** Target number of bins (a hint to d3). Default 20. */
  bins?: number;
  width?: Dimension;
  height?: Dimension;
  aspect?: number;
  margin?: Partial<Margin>;
  theme?: DeepPartial<ChartTheme>;
  color?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  yDomain?: NumericDomain;
  animate?: boolean;
  /** Format a bin's lower-bound label. */
  formatBin?: (x0: number, x1: number) => string;
}

/**
 * Histogram — bins a set of numeric values (via d3-array) and renders the
 * counts as bars. Reuses the bar renderer and Cartesian frame.
 */
export function Histogram({
  values,
  data,
  value,
  bins = 20,
  color,
  formatBin,
  ...rest
}: HistogramProps) {
  const nums: number[] =
    values ?? (data && value ? data.map((d, i) => getNumber(d, value, i)).filter((n) => Number.isFinite(n)) : []);

  const fmt = formatBin ?? ((x0: number) => String(Math.round(x0 * 100) / 100));
  const binned = binData(nums, bins).map((b) => ({
    bin: fmt(b.x0, b.x1),
    count: b.count,
  }));

  return (
    <CartesianChart
      {...rest}
      data={binned}
      x="bin"
      series={[{ dataKey: 'count', label: 'count', color }]}
      xScaleType="band"
      bandPadding={0.05}
      showLegend={false}
      renderSeries={() => <Bars animate={rest.animate} groupGap={0} radius={1} />}
    />
  );
}
