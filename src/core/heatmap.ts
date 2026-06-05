import type { NumericDomain } from './types';

export type ColorInterpolation = (t: number) => string;

export interface HeatmapColorScale {
  interpolate: ColorInterpolation;
  domain: NumericDomain;
}

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  color: string;
}

/**
 * Create a linear color scale that interpolates between start and end colors.
 * Values are mapped to [0, 1] and the interpolation function maps to RGB strings.
 */
export function createLinearColorScale(
  domain: NumericDomain,
  startColor: string,
  endColor: string,
): HeatmapColorScale {
  const [min, max] = domain;
  const range = max - min;

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  };

  const [r1, g1, b1] = hexToRgb(startColor);
  const [r2, g2, b2] = hexToRgb(endColor);

  const interpolate: ColorInterpolation = (value: number) => {
    const t = range === 0 ? 0 : (value - min) / range;
    const clamped = Math.max(0, Math.min(1, t));
    const r = r1 + (r2 - r1) * clamped;
    const g = g1 + (g2 - g1) * clamped;
    const b = b1 + (b2 - b1) * clamped;
    return rgbToHex(r, g, b);
  };

  return { interpolate, domain };
}

/**
 * Create a diverging color scale that interpolates through a middle color.
 * Useful for data with a meaningful midpoint (e.g., -1 to +1, centered at 0).
 */
export function createDivergingColorScale(
  domain: NumericDomain,
  lowColor: string,
  midColor: string,
  highColor: string,
): HeatmapColorScale {
  const [min, max] = domain;
  const mid = (min + max) / 2;

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  };

  const [r1, g1, b1] = hexToRgb(lowColor);
  const [r2, g2, b2] = hexToRgb(midColor);
  const [r3, g3, b3] = hexToRgb(highColor);

  const interpolate: ColorInterpolation = (value: number) => {
    let t: number;
    let r: number;
    let g: number;
    let b: number;

    if (value <= mid) {
      t = (value - min) / (mid - min);
      r = r1 + (r2 - r1) * t;
      g = g1 + (g2 - g1) * t;
      b = b1 + (b2 - b1) * t;
    } else {
      t = (value - mid) / (max - mid);
      r = r2 + (r3 - r2) * t;
      g = g2 + (g3 - g2) * t;
      b = b2 + (b3 - b2) * t;
    }

    return rgbToHex(r, g, b);
  };

  return { interpolate, domain };
}

/**
 * Compute cells for a heatmap given x/y categories and a value matrix.
 * Returns an array of HeatmapCell objects with computed colors.
 */
export function computeHeatmapCells(
  xCategories: string[],
  yCategories: string[],
  valueMatrix: number[][],
  colorScale: HeatmapColorScale,
): HeatmapCell[] {
  const cells: HeatmapCell[] = [];

  for (let y = 0; y < yCategories.length; y++) {
    for (let x = 0; x < xCategories.length; x++) {
      const value = valueMatrix[y]?.[x];
      if (value != null && Number.isFinite(value)) {
        cells.push({
          x,
          y,
          value,
          color: colorScale.interpolate(value),
        });
      }
    }
  }

  return cells;
}

/**
 * Find the numeric extent (min/max) of all values in a matrix.
 */
export function heatmapExtent(valueMatrix: number[][]): NumericDomain {
  let min = Infinity;
  let max = -Infinity;

  for (const row of valueMatrix) {
    for (const value of row) {
      if (Number.isFinite(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
  }

  return [isFinite(min) ? min : 0, isFinite(max) ? max : 1];
}
