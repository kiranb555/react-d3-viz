import { useEffect, useRef, useState } from 'react';
import { clamp01, easing, type Easing } from '../core/interpolate';

export interface AnimationOptions {
  enabled?: boolean;
  durationMs?: number;
  easing?: Easing;
  /** Re-run the animation whenever any of these values change. */
  deps?: unknown[];
}

/**
 * Drive a 0 -> 1 progress value over `durationMs` using requestAnimationFrame.
 * Works on web and React Native (both expose rAF globally). When disabled or
 * when rAF is unavailable (e.g. SSR/tests) it returns 1 immediately so charts
 * render fully without animation.
 */
export function useAnimatedValue(options: AnimationOptions = {}): number {
  const { enabled = true, durationMs = 600, easing: ease = easing.easeOutCubic, deps = [] } = options;
  const hasRaf = typeof requestAnimationFrame === 'function';
  const [t, setT] = useState(enabled && hasRaf ? 0 : 1);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !hasRaf) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jump to final frame when animation is off
      setT(1);
      return;
    }
    setT(0);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = clamp01(durationMs <= 0 ? 1 : elapsed / durationMs);
      setT(ease(raw));
      if (raw < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, durationMs, hasRaf, ...deps]);

  return t;
}
