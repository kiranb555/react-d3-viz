import { CartesianChart } from '../../CartesianChart';
import { Quadrants } from './Quadrants';
import { Points } from './Points';
import { resolveSeries, type BaseCartesianProps } from '../common';
import {
  calculateThresholds,
  defaultQuadrantStyles,
  type QuadrantStyle,
} from '../../../core/quadrant';
import { getNumber, type Accessor } from '../../../core/accessors';
import { numericDomain } from '../../../core/scales';

export interface QuadrantChartProps extends BaseCartesianProps {
  /** Threshold positioning mode: 'mean' (default), 'median', or 'custom'. */
  thresholdMode?: 'mean' | 'median' | 'custom';
  /** Custom X threshold (required if thresholdMode='custom'). */
  thresholdX?: number;
  /** Custom Y threshold (required if thresholdMode='custom'). */
  thresholdY?: number;
  /** Custom labels for quadrants: [top-left, top-right, bottom-left, bottom-right]. */
  quadrantLabels?: [string, string, string, string];
  /** Show quadrant labels (default true). */
  showQuadrantLabels?: boolean;
  /** Optional accessor for bubble size (third dimension). */
  size?: Accessor<number>;
  /** Min/max bubble radius in px. Default [4, 28]. */
  radiusRange?: [number, number];
  /** Point radius if size not provided. */
  pointRadius?: number;
  /** Treat X as categorical (default false). */
  categoricalX?: boolean;
  /** Customize styling per quadrant. */
  quadrantStyles?: Partial<QuadrantStyle>[];
}

/**
 * Quadrant chart — 2D scatter plot divided into 4 quadrants by X and Y thresholds.
 * Supports automatic (mean/median) or custom threshold positioning, optional bubble sizing,
 * custom quadrant labels, and fully customizable styling.
 */
export function QuadrantChart({
  thresholdMode = 'mean',
  thresholdX,
  thresholdY,
  quadrantLabels,
  showQuadrantLabels = true,
  size,
  radiusRange,
  pointRadius,
  categoricalX = false,
  quadrantStyles: customStyles,
  series,
  y,
  ...rest
}: QuadrantChartProps) {
  const resolved = resolveSeries(series, y);

  // Validate custom threshold mode
  if (thresholdMode === 'custom') {
    if (thresholdX === undefined || thresholdY === undefined) {
      throw new Error(
        'QuadrantChart: thresholdMode="custom" requires both thresholdX and thresholdY'
      );
    }
  }

  return (
    <CartesianChart
      {...rest}
      series={resolved}
      xScaleType={categoricalX ? 'point' : 'linear'}
      renderSeries={(ctx) => {
        // Calculate thresholds if not custom
        let finalThresholdX = thresholdX ?? 0;
        let finalThresholdY = thresholdY ?? 0;

        if (thresholdMode !== 'custom') {
          // Extract numeric X values from data
          const xValues = ctx.data.map((d, i) => getNumber(d, ctx.x as Accessor<number>, i));

          // Extract Y values from all visible series
          const yValues = ctx.series
            .filter((s) => !s.hidden)
            .flatMap((s) => ctx.data.map((d, i) => getNumber(d, s.dataKey, i)));

          finalThresholdX = calculateThresholds(
            xValues.filter(Number.isFinite),
            thresholdMode
          );
          finalThresholdY = calculateThresholds(
            yValues.filter(Number.isFinite),
            thresholdMode
          );
        }

        // Get the numeric domain for display
        const xValues = ctx.data.map((d, i) => getNumber(d, ctx.x as Accessor<number>, i));
        const yValues = ctx.series
          .filter((s) => !s.hidden)
          .flatMap((s) => ctx.data.map((d, i) => getNumber(d, s.dataKey, i)));

        const xDom = numericDomain(xValues.filter(Number.isFinite), { padTop: 0 });
        const yDom = numericDomain(yValues.filter(Number.isFinite), { padTop: 0 });

        // Merge custom styles with defaults
        const defaultStyles = defaultQuadrantStyles(ctx.theme);
        const finalStyles = defaultStyles.map((style, i) => ({
          ...style,
          ...customStyles?.[i],
        }));

        return (
          <>
            <Quadrants
              thresholdX={finalThresholdX}
              thresholdY={finalThresholdY}
              quadrantLabels={quadrantLabels}
              showQuadrantLabels={showQuadrantLabels}
              quadrantStyles={finalStyles}
              xDomain={xDom}
              yDomain={yDom}
            />
            {ctx.series.map((s) => (
              <Points
                key={s.seriesIndex}
                series={s}
                size={size}
                radiusRange={radiusRange}
                pointRadius={pointRadius}
                animate={rest.animate}
              />
            ))}
          </>
        );
      }}
    />
  );
}
