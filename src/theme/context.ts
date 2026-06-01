import { createContext } from 'react';
import { defaultTheme, type ChartTheme } from './defaultTheme';

/** Internal theme context. Consume via `useTheme`, provide via `ThemeProvider`. */
export const ThemeContext = createContext<ChartTheme>(defaultTheme);
