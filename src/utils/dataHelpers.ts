import { extent, max, min, bin as d3bin } from 'd3-array';

export { extent, max, min };

export interface NumericDatum {
  [key: string]: number | string | Date;
}

export function getNumericExtent(
  data: NumericDatum[],
  key: string,
): [number, number] {
  const [lo, hi] = extent(data, (d) => Number(d[key]));
  return [lo ?? 0, hi ?? 0];
}

export function getDateExtent(
  data: NumericDatum[],
  key: string,
): [Date, Date] {
  const [lo, hi] = extent(data, (d) => new Date(d[key] as string | number | Date));
  return [lo ?? new Date(0), hi ?? new Date()];
}

export function bin(data: number[], thresholds = 20): { x0: number; x1: number; count: number }[] {
  const binFn = d3bin().thresholds(thresholds);
  return binFn(data).map((b) => ({
    x0: b.x0 ?? 0,
    x1: b.x1 ?? 0,
    count: b.length,
  }));
}

export function generateLinearData(n: number, xRange: [number, number] = [0, 100]): { x: number; y: number }[] {
  return Array.from({ length: n }, (_, i) => {
    const x = xRange[0] + (i / (n - 1)) * (xRange[1] - xRange[0]);
    return { x, y: Math.sin(x / 10) * 50 + Math.random() * 10 };
  });
}

export function generateScatterData(n: number): { x: number; y: number }[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
}
