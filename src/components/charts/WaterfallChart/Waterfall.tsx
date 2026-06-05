import {
  type WaterfallLayoutResult,
  type WaterfallDataPoint,
} from '../../../core/waterfall';
import type { ChartTheme } from '../../../theme/useTheme';
import { G, Rect, Line, SvgText } from '../../../primitives';

interface WaterfallProps {
  layout: WaterfallLayoutResult;
  data: WaterfallDataPoint[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  activeIndex?: number | null;
  onSegmentPress?: (idx: number) => void;
  theme: ChartTheme;
}

const SEGMENT_WIDTH = 30;
const TEXT_OFFSET = 15;

export const Waterfall: React.FC<WaterfallProps> = ({
  layout,
  data,
  colors,
  valueFormatter = (v) => v.toFixed(0),
  activeIndex,
  onSegmentPress,
  theme,
}) => {
  if (layout.segments.length === 0) {
    return (
      <G>
        <SvgText
          x={0}
          y={0}
          fill={theme.font.color}
          fontSize={theme.font.size}
        >
          No segments to display
        </SvgText>
      </G>
    );
  }

  // Compute x positions for each segment
  const innerWidth = layout.bounds.maxX - layout.bounds.minX;
  const segmentSpacing = innerWidth / Math.max(1, layout.segments.length);

  return (
    <G>
      {/* Connector lines between segments */}
      {layout.connectors.map((connector, idx) => (
        <Line
          key={`connector-${idx}`}
          x1={connector.x1 + SEGMENT_WIDTH / 2}
          y1={connector.y1}
          x2={connector.x2 - SEGMENT_WIDTH / 2}
          y2={connector.y2}
          stroke={theme.grid.color}
          strokeWidth={1}
          opacity={0.5}
          strokeDasharray="4,4"
        />
      ))}

      {/* Segments */}
      {layout.segments.map((segment, idx) => {
        const xPos = segmentSpacing * idx;
        const isTotal = segment.isTotal;
        const isActive = activeIndex === idx;
        const color = isTotal
          ? colors[colors.length - 1] || colors[0]
          : colors[idx % colors.length];

        // Calculate opacity based on active state
        const segmentOpacity = activeIndex !== null
          ? isActive
            ? 1
            : 0.3
          : isTotal
            ? 0.8
            : 0.6;

        return (
          <G
            key={`segment-${idx}`}
            onPress={() => onSegmentPress?.(idx)}
          >
            {/* Segment bar */}
            <Rect
              x={xPos}
              y={segment.startY}
              width={SEGMENT_WIDTH}
              height={segment.height}
              fill={color}
              opacity={segmentOpacity}
            />

            {/* Label below the bar */}
            <SvgText
              x={xPos + SEGMENT_WIDTH / 2}
              y={segment.endY + TEXT_OFFSET}
              textAnchor="middle"
              fontSize={theme.axis.labelSize}
              fill={theme.axis.labelColor}
            >
              {segment.label}
            </SvgText>

            {/* Value above the bar */}
            <SvgText
              x={xPos + SEGMENT_WIDTH / 2}
              y={segment.startY - 5}
              textAnchor="middle"
              fontSize={Math.max(theme.axis.labelSize - 1, 8)}
              fill={theme.font.color}
            >
              {valueFormatter(data[idx].value)}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
};
