import { useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { mergeTheme, type ChartTheme, type DeepPartial } from './defaultTheme';

/**
 * Resolve the active theme: the provider value, with an optional per-chart
 * override merged on top.
 */
export function useTheme(override?: DeepPartial<ChartTheme>): ChartTheme {
  const base = useContext(ThemeContext);
  return useMemo(() => mergeTheme(base, override), [base, override]);
}

export { defaultTheme, mergeTheme } from './defaultTheme';
export type { ChartTheme, DeepPartial } from './defaultTheme';
