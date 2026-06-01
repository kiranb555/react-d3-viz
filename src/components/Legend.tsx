import { G, Rect, SvgText } from '../primitives';
import { useChartContext } from './ChartContext';

export interface LegendProps {
  /** y offset (in svg coordinates) where the legend row is drawn. */
  y?: number;
  /** Total width to center the legend within (defaults to chart width). */
  width?: number;
}

const CHAR_W = 0.6;

/**
 * Horizontal, interactive legend. Tapping/clicking a swatch toggles its series.
 * Rendered in svg coordinates (the frame reserves top margin for it).
 */
export function Legend({ y = 4, width }: LegendProps) {
  const { series, theme, bounds, toggleSeries } = useChartContext();
  const { swatchSize, gap, fontSize, color } = theme.legend;
  const total = width ?? bounds.width;

  // Measure each item, then lay them out centered as a single row.
  const items = series.map((s) => ({ s, w: swatchSize + 6 + s.label.length * fontSize * CHAR_W }));
  const rowW = items.reduce((acc, it) => acc + it.w + gap, -gap);
  const start = Math.max(0, (total - rowW) / 2);
  const positioned = items.map((it, i) => ({
    ...it,
    x: start + items.slice(0, i).reduce((acc, p) => acc + p.w + gap, 0),
  }));

  return (
    <G>
      {positioned.map(({ s, w, x }) => {
        const dim = s.hidden ? 0.35 : 1;
        return (
          <G key={s.seriesIndex} transform={`translate(${x},${y})`} onPress={() => toggleSeries(s.seriesIndex)}>
            {/* invisible hit target so taps land anywhere on the item */}
            <Rect x={0} y={0} width={w} height={swatchSize + 4} fill="transparent" />
            <Rect x={0} y={2} width={swatchSize} height={swatchSize} rx={2} fill={s.color} opacity={dim} />
            <SvgText
              x={swatchSize + 6}
              y={2 + swatchSize / 2}
              fill={color}
              opacity={dim}
              fontSize={fontSize}
              fontFamily={theme.font.family}
              textAnchor="start"
              verticalAnchor="middle"
            >
              {s.label}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}
