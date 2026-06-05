import { G, Rect, SvgText } from '../../../primitives';
import type { ComputedSankeyNode } from '../../../core/sankey';
import type { ChartTheme } from '../../../theme/useTheme';
import type { FC } from 'react';

interface SankeyNodeProps {
  node: ComputedSankeyNode;
  color: string;
  theme: ChartTheme;
}

export const SankeyNode: FC<SankeyNodeProps> = ({
  node,
  color,
  theme,
}) => {
  return (
    <G onPress={() => {}}>
      {/* Node rectangle */}
      <Rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={color}
        rx={2}
        opacity={0.8}
      />

      {/* Label (to the right of the node) */}
      {node.width > 0 && node.height > 0 && (
        <SvgText
          x={node.x + node.width + 5}
          y={node.y + node.height / 2}
          fontSize={theme.font.size}
          fontFamily={theme.font.family}
          fill={theme.font.color}
          textAnchor="start"
          verticalAnchor="middle"
        >
          {node.label}
        </SvgText>
      )}
    </G>
  );
};
