/**
 * The default theme. Every visual default a chart needs lives here so consumers
 * can restyle the whole library by passing a partial override to
 * <ThemeProvider> or a single chart's `theme` prop.
 */
export interface ChartTheme {
  /** Ordered categorical color palette for series / slices. */
  colors: string[];
  /** Background of the chart area (transparent by default). */
  background: string;
  font: {
    family: string;
    size: number;
    color: string;
  };
  axis: {
    color: string;
    strokeWidth: number;
    tickColor: string;
    tickLength: number;
    labelColor: string;
    labelSize: number;
  };
  grid: {
    color: string;
    strokeWidth: number;
    dashArray?: string;
  };
  tooltip: {
    background: string;
    color: string;
    borderColor: string;
    fontSize: number;
    radius: number;
  };
  legend: {
    fontSize: number;
    color: string;
    swatchSize: number;
    gap: number;
  };
  animation: {
    enabled: boolean;
    durationMs: number;
  };
}

export const defaultTheme: ChartTheme = {
  colors: [
    '#4f46e5', // indigo
    '#06b6d4', // cyan
    '#f59e0b', // amber
    '#ef4444', // red
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
  ],
  background: 'transparent',
  font: {
    family: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    size: 12,
    color: '#1f2937',
  },
  axis: {
    color: '#9ca3af',
    strokeWidth: 1,
    tickColor: '#9ca3af',
    tickLength: 5,
    labelColor: '#6b7280',
    labelSize: 11,
  },
  grid: {
    color: '#e5e7eb',
    strokeWidth: 1,
    dashArray: undefined,
  },
  tooltip: {
    background: '#111827',
    color: '#f9fafb',
    borderColor: '#374151',
    fontSize: 12,
    radius: 6,
  },
  legend: {
    fontSize: 12,
    color: '#374151',
    swatchSize: 12,
    gap: 16,
  },
  animation: {
    enabled: true,
    durationMs: 600,
  },
};

/** Deep-ish merge of a partial theme over a base theme (one level per group). */
export function mergeTheme(base: ChartTheme, override?: DeepPartial<ChartTheme>): ChartTheme {
  if (!override) return base;
  return {
    colors: override.colors ?? base.colors,
    background: override.background ?? base.background,
    font: { ...base.font, ...override.font },
    axis: { ...base.axis, ...override.axis },
    grid: { ...base.grid, ...override.grid },
    tooltip: { ...base.tooltip, ...override.tooltip },
    legend: { ...base.legend, ...override.legend },
    animation: { ...base.animation, ...override.animation },
  };
}

export type DeepPartial<T> = {
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to `T | undefined`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
};
