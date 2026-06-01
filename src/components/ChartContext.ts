import { createContext, useContext } from 'react';
import type { CartesianContextValue } from './chartTypes';

export const ChartContext = createContext<CartesianContextValue | null>(null);

/**
 * Access the surrounding Cartesian chart's scales/bounds/theme. Throws if used
 * outside a chart so composition mistakes fail loudly.
 */
export function useChartContext(): CartesianContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error(
      'Chart subcomponents (Axis, Grid, Tooltip, Legend, Line, Bar, ...) must be rendered inside a chart component.',
    );
  }
  return ctx;
}
