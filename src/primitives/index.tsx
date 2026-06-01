/**
 * Web (DOM) implementation of the SVG primitives.
 *
 * This is the DEFAULT module that `tsc` and web bundlers resolve for
 * `./primitives`. React Native / Metro picks `index.native.tsx` instead, so a
 * web build never imports `react-native-svg` and an RN build never touches the
 * DOM.
 */
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type {
  SvgRootProps,
  GProps,
  PathProps,
  RectProps,
  CircleProps,
  LineProps,
  TextProps,
  GestureEvent,
} from './types';

function localPoint(el: SVGSVGElement, clientX: number, clientY: number): GestureEvent {
  const rect = el.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

export const Svg = forwardRef<SVGSVGElement, SvgRootProps>(function Svg(
  { width, height, style, children, onMove, onLeave, onLayout },
  ref,
) {
  const localRef = useRef<SVGSVGElement | null>(null);
  const setRef = useCallback(
    (node: SVGSVGElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<SVGSVGElement | null>).current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (!onLayout) return;
    const el = localRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) onLayout({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onLayout]);

  const numeric = typeof width === 'number' && typeof height === 'number';

  return (
    <svg
      ref={setRef}
      width={width}
      height={height}
      viewBox={numeric ? `0 0 ${width} ${height}` : undefined}
      style={style as React.CSSProperties}
      onMouseMove={
        onMove
          ? (e) => onMove(localPoint(e.currentTarget, e.clientX, e.clientY))
          : undefined
      }
      onMouseLeave={onLeave}
      onTouchMove={
        onMove
          ? (e) => {
              const t = e.touches[0];
              if (t) onMove(localPoint(e.currentTarget, t.clientX, t.clientY));
            }
          : undefined
      }
      onTouchEnd={onLeave}
    >
      {children}
    </svg>
  );
});

export function G({ x, y, transform, onPress, children, ...rest }: GProps) {
  const t = transform ?? (x != null || y != null ? `translate(${x ?? 0},${y ?? 0})` : undefined);
  return (
    <g transform={t} onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined} {...rest}>
      {children}
    </g>
  );
}

export function Path({ onPress, ...rest }: PathProps) {
  return <path onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined} {...rest} />;
}

export function Rect({ onPress, ...rest }: RectProps) {
  return <rect onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined} {...rest} />;
}

export function Circle({ onPress, ...rest }: CircleProps) {
  return <circle onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined} {...rest} />;
}

export function Line({ onPress, ...rest }: LineProps) {
  return <line onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined} {...rest} />;
}

const baselineMap = {
  start: 'hanging',
  middle: 'central',
  end: 'auto',
} as const;

export function SvgText({
  verticalAnchor,
  textAnchor,
  fontSize,
  fontFamily,
  fontWeight,
  children,
  onPress,
  ...rest
}: TextProps) {
  return (
    <text
      textAnchor={textAnchor}
      dominantBaseline={verticalAnchor ? baselineMap[verticalAnchor] : undefined}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      onClick={onPress ? (e) => onPress({ x: e.clientX, y: e.clientY }) : undefined}
      {...rest}
    >
      {children}
    </text>
  );
}
