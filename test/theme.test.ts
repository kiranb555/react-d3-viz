import { describe, it, expect } from 'vitest';
import { defaultTheme, mergeTheme } from '../src/theme/defaultTheme';

describe('mergeTheme', () => {
  it('returns the base when no override is given', () => {
    expect(mergeTheme(defaultTheme)).toEqual(defaultTheme);
  });

  it('overrides a single nested field without dropping siblings', () => {
    const merged = mergeTheme(defaultTheme, { axis: { color: '#000' } });
    expect(merged.axis.color).toBe('#000');
    expect(merged.axis.tickLength).toBe(defaultTheme.axis.tickLength);
  });

  it('replaces the colors palette wholesale', () => {
    const merged = mergeTheme(defaultTheme, { colors: ['#fff'] });
    expect(merged.colors).toEqual(['#fff']);
  });
});
