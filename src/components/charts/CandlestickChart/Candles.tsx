import { G, Line, Rect } from '../../../primitives';
import { useChartContext } from '../../ChartContext';
import { useAnimatedValue } from '../../../hooks/useAnimatedValue';
import { getNumber } from '../../../core/accessors';
import { candlestickGeometry, type OHLC } from '../../../core/candlestick';
import type { Accessor } from '../../../core/accessors';

export interface CandlesProps {
  open: Accessor<number>;
  high: Accessor<number>;
  low: Accessor<number>;
  close: Accessor<number>;
  upColor: string;
  downColor: string;
  wickWidth?: number;
  bodyWidthRatio?: number;
  minBodyHeight?: number;
  animate?: boolean;
}

/**
 * Renders one wick (high-low line) + one body (open-close rect) per datum.
 * Reads open/high/low/close directly off `data` (not the pseudo-series) and
 * delegates all pixel math to the pure `candlestickGeometry` core function.
 */
export function Candles({
  open,
  high,
  low,
  close,
  upColor,
  downColor,
  wickWidth = 1,
  bodyWidthRatio,
  minBodyHeight,
  animate = true,
}: CandlesProps) {
  const { data, xPixel, xBandwidth, yPixel, active, theme } = useChartContext();
  const t = useAnimatedValue({
    enabled: animate && theme.animation.enabled,
    durationMs: theme.animation.durationMs,
  });

  const values: OHLC[] = data.map((d, i) => ({
    open: getNumber(d, open, i),
    high: getNumber(d, high, i),
    low: getNumber(d, low, i),
    close: getNumber(d, close, i),
  }));
  const xCenters = data.map((_, i) => xPixel(i));

  const geometries = candlestickGeometry(values, xCenters, xBandwidth, yPixel, {
    bodyWidthRatio,
    wickWidth,
    minBodyHeight,
  });

  return (
    <G>
      {geometries.map((g) => {
        const color = g.isUp ? upColor : downColor;
        const dim = active && active.index !== g.index ? 0.78 : 1;

        // Grow both the wick and the body outward from their own center point,
        // matching the "fade/grow in" idiom used by the other charts' points/bars.
        const wickMid = (g.wickY1 + g.wickY2) / 2;
        const curWickY1 = wickMid - (wickMid - g.wickY1) * t;
        const curWickY2 = wickMid + (g.wickY2 - wickMid) * t;

        const bodyMid = g.bodyY + g.bodyHeight / 2;
        const curBodyHeight = g.bodyHeight * t;
        const curBodyY = bodyMid - curBodyHeight / 2;

        return (
          <G key={g.index} opacity={dim}>
            <Line
              x1={g.wickX}
              y1={curWickY1}
              x2={g.wickX}
              y2={curWickY2}
              stroke={color}
              strokeWidth={wickWidth}
            />
            <Rect
              x={g.bodyX}
              y={curBodyY}
              width={g.bodyWidth}
              height={curBodyHeight}
              fill={color}
            />
          </G>
        );
      })}
    </G>
  );
}
