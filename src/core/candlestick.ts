/**
 * Pure-JS geometry for candlestick / OHLC charts. No D3, no DOM, no React —
 * just pixel math, so it runs identically on web and React Native.
 */

/** One trading period's open/high/low/close values. */
export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Pixel-space geometry for a single candle, ready to render as a wick line + a body rect. */
export interface CandleGeometry {
  /** Index into the original `values`/`xCenters` arrays (preserved across skipped entries). */
  index: number;
  /** True when close >= open (rendered with `upColor`). */
  isUp: boolean;
  wickX: number;
  wickY1: number;
  wickY2: number;
  bodyX: number;
  bodyY: number;
  bodyWidth: number;
  bodyHeight: number;
}

export interface CandlestickOptions {
  /** Body width as a fraction of `bandwidth`. Default 0.7. */
  bodyWidthRatio?: number;
  /** Stroke width for the wick line. Unused by the geometry itself (rendering concern). */
  wickWidth?: number;
  /** Minimum body height in pixels, so open === close still renders a visible sliver. Default 1. */
  minBodyHeight?: number;
}

/**
 * Compute pixel-space geometry for a series of OHLC candles.
 *
 * `values[i]` pairs with `xCenters[i]` (the x-pixel center for that datum, e.g. from a band
 * scale). Entries with a non-finite OHLC value (or missing x-center) are skipped entirely —
 * not emitted with NaN coordinates — but the original `index` is preserved on the emitted
 * entries so callers can still map back to the source datum.
 */
export function candlestickGeometry(
  values: OHLC[],
  xCenters: number[],
  bandwidth: number,
  yPixel: (v: number) => number,
  opts: CandlestickOptions = {},
): CandleGeometry[] {
  const { bodyWidthRatio = 0.7, minBodyHeight = 1 } = opts;
  const bodyWidth = Math.max(0, bandwidth * bodyWidthRatio);

  const out: CandleGeometry[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const xCenter = xCenters[i];
    if (
      !v ||
      !Number.isFinite(v.open) ||
      !Number.isFinite(v.high) ||
      !Number.isFinite(v.low) ||
      !Number.isFinite(v.close) ||
      !Number.isFinite(xCenter)
    ) {
      continue;
    }

    const isUp = v.close >= v.open;
    const wickY1 = yPixel(v.high);
    const wickY2 = yPixel(v.low);

    const openY = yPixel(v.open);
    const closeY = yPixel(v.close);
    const rawTop = Math.min(openY, closeY);
    const rawBottom = Math.max(openY, closeY);
    const rawHeight = rawBottom - rawTop;

    let bodyY: number;
    let bodyHeight: number;
    if (rawHeight < minBodyHeight) {
      const mid = (rawTop + rawBottom) / 2;
      bodyHeight = minBodyHeight;
      bodyY = mid - minBodyHeight / 2;
    } else {
      bodyHeight = rawHeight;
      bodyY = rawTop;
    }

    out.push({
      index: i,
      isUp,
      wickX: xCenter,
      wickY1,
      wickY2,
      bodyX: xCenter - bodyWidth / 2,
      bodyY,
      bodyWidth,
      bodyHeight,
    });
  }

  return out;
}
