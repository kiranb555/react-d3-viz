/**
 * Tiny, dependency-free tweening helpers used by the optional animation hook.
 * Everything here is pure math so it runs identically on web and React Native.
 */

/** Clamp t to [0, 1]. */
export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

export type Easing = (t: number) => number;

export const easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
} satisfies Record<string, Easing>;

/** Linear interpolation between two numbers. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Interpolate two equal-length numeric arrays element-wise. */
export function lerpArray(a: number[], b: number[], t: number): number[] {
  const n = Math.min(a.length, b.length);
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = lerp(a[i], b[i], t);
  return out;
}
