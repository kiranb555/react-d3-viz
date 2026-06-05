import type { MekkoColumn } from '../../../core/mekko';
import { G, Rect, SvgText } from '../../../primitives';

interface MekkoBarProps {
  column: MekkoColumn;
  colors: string[];
  animate: boolean;
  valueFormatter: (value: number) => string;
  onHover?: (seriesId: string | null) => void;
}

export function MekkoBar({
  column,
  colors,
  valueFormatter,
}: MekkoBarProps) {
  return (
    <G>
      {column.segments.map((segment, segIdx) => {
        const color = colors[segIdx % colors.length];

        return (
          <G
            key={`segment-${segIdx}`}
          >
            {/* Segment rectangle */}
            <Rect
              x={column.x}
              y={segment.y}
              width={column.width}
              height={segment.height}
              fill={color}
              opacity={0.7}
              stroke="white"
              strokeWidth={1}
            />

            {/* Value label (only if segment is large enough) */}
            {segment.height > 30 && (
              <SvgText
                x={column.x + column.width / 2}
                y={segment.y + segment.height / 2}
                textAnchor="middle"
                verticalAnchor="middle"
                fontSize={11}
                fill="white"
                fontWeight="bold"
              >
                {valueFormatter(segment.value)}
              </SvgText>
            )}
          </G>
        );
      })}
    </G>
  );
}
