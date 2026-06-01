import { useMemo, type ReactNode } from 'react';
import { ThemeContext } from './context';
import { defaultTheme, mergeTheme, type ChartTheme, type DeepPartial } from './defaultTheme';

export interface ThemeProviderProps {
  /** Partial overrides merged over the default theme. */
  theme?: DeepPartial<ChartTheme>;
  children: ReactNode;
}

/** App-level theme override. Charts also accept a per-instance `theme` prop. */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const value = useMemo(() => mergeTheme(defaultTheme, theme), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
