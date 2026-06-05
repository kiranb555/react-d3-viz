import { Path } from '../../../primitives';
import type { ComputedSankeyLink } from '../../../core/sankey';
import type { FC } from 'react';

interface SankeyLinkProps {
  link: ComputedSankeyLink;
  opacity?: number;
}

export const SankeyLink: FC<SankeyLinkProps> = ({
  link,
  opacity = 0.3,
}) => {
  // Scale stroke width based on link value
  const strokeWidth = Math.max(2, Math.sqrt(Math.abs(link.value)) / 2);

  return (
    <Path
      d={link.path}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      opacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};
