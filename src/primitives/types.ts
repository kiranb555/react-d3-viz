import type { ReactNode } from 'react';

/**
 * Platform-neutral prop shapes for our SVG primitives. The web and native
 * adapters both accept these, so chart components never branch on platform.
 *
 * These intentionally cover the subset of SVG attributes the charts use.
 */

export interface CommonProps {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  opacity?: number;
  /** Pointer / touch handlers — normalized across platforms. */
  onPress?: (event: GestureEvent) => void;
  children?: ReactNode;
}

/** A normalized pointer/touch position in the SVG's local coordinate space. */
export interface GestureEvent {
  x: number;
  y: number;
}

export interface SvgRootProps {
  /** Pixel number, or a CSS/RN size string like '100%' while auto-measuring. */
  width: number | string;
  height: number | string;
  /** Background color of the canvas area (optional). */
  style?: Record<string, unknown>;
  children?: ReactNode;
  /** Continuous move/drag handler for tooltips (normalized coords). */
  onMove?: (event: GestureEvent) => void;
  /** Fired when the pointer/touch leaves the chart. */
  onLeave?: () => void;
  /** Reports the laid-out pixel size (web: ResizeObserver, native: onLayout). */
  onLayout?: (size: { width: number; height: number }) => void;
}

export interface GProps extends CommonProps {
  x?: number;
  y?: number;
  transform?: string;
}

export interface PathProps extends CommonProps {
  d: string;
}

export interface RectProps extends CommonProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface CircleProps extends CommonProps {
  cx: number;
  cy: number;
  r: number;
}

export interface LineProps extends CommonProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TextProps extends CommonProps {
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  textAnchor?: 'start' | 'middle' | 'end';
  /** Vertical alignment; mapped to the right attribute per platform. */
  verticalAnchor?: 'start' | 'middle' | 'end';
  children?: ReactNode;
}
