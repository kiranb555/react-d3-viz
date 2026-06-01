import { useCallback, useState } from 'react';

/** A width/height that can be an explicit pixel number or 'auto' (fill parent). */
export type Dimension = number | 'auto';

export interface ResolvedSize {
  /** Numeric width to compute geometry with (0 until measured, in auto mode). */
  width: number;
  /** Numeric height to compute geometry with. */
  height: number;
  /** Value for the Svg `width` prop ('100%' while auto-measuring). */
  svgWidth: number | string;
  /** Value for the Svg `height` prop. */
  svgHeight: number | string;
  /** Pass to the Svg `onLayout` prop; defined only when measuring is needed. */
  onLayout?: (size: { width: number; height: number }) => void;
}

/**
 * Resolve responsive chart dimensions. With `width='auto'` the chart renders at
 * 100% width and measures its laid-out pixel width (via the Svg primitive's
 * onLayout), then re-renders with that number. `height='auto'` derives the
 * height from the resolved width and `aspect` (width / aspect). Explicit numeric
 * sizes skip measurement entirely — zero overhead and identical to before.
 */
export function useAutoSize(
  width: Dimension = 'auto',
  height: Dimension = 300,
  aspect = 2,
): ResolvedSize {
  const [measured, setMeasured] = useState(0);
  const autoW = width === 'auto';
  const autoH = height === 'auto';

  const onLayout = useCallback((size: { width: number; height: number }) => {
    // Round to avoid sub-pixel thrash re-rendering every frame.
    const w = Math.round(size.width);
    setMeasured((prev) => (prev === w ? prev : w));
  }, []);

  const resolvedW = autoW ? measured : (width as number);
  const resolvedH = autoH ? (resolvedW > 0 ? resolvedW / aspect : 0) : (height as number);

  return {
    width: resolvedW,
    height: resolvedH,
    svgWidth: autoW ? (measured > 0 ? measured : '100%') : (width as number),
    svgHeight: resolvedH > 0 ? resolvedH : autoH ? '100%' : (height as number),
    onLayout: autoW ? onLayout : undefined,
  };
}
