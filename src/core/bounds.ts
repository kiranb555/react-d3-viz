import type { ChartBounds, Margin } from './types';

export const DEFAULT_MARGIN: Margin = { top: 16, right: 16, bottom: 32, left: 40 };

/**
 * Resolve a (possibly partial) margin against the defaults and compute the
 * inner plotting region. Inner dimensions are clamped at 0 so a tiny container
 * never produces negative geometry.
 */
export function computeBounds(
  width: number,
  height: number,
  margin?: Partial<Margin>,
): ChartBounds {
  const resolved: Margin = { ...DEFAULT_MARGIN, ...margin };
  const innerWidth = Math.max(0, width - resolved.left - resolved.right);
  const innerHeight = Math.max(0, height - resolved.top - resolved.bottom);
  return { width, height, innerWidth, innerHeight, margin: resolved };
}
