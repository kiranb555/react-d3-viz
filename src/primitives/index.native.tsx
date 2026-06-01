/**
 * React Native implementation of the SVG primitives, backed by
 * `react-native-svg`. Metro resolves this file for `./primitives` on native.
 *
 * The public prop shapes (see ./types) are identical to the web adapter, so
 * chart components are written once and run on both platforms.
 */
import RNSvg, {
  G as RNG,
  Path as RNPath,
  Rect as RNRect,
  Circle as RNCircle,
  Line as RNLine,
  Text as RNText,
} from 'react-native-svg';
import type {
  SvgRootProps,
  GProps,
  PathProps,
  RectProps,
  CircleProps,
  LineProps,
  TextProps,
} from './types';

export function Svg({ width, height, style, children, onMove, onLeave, onLayout }: SvgRootProps) {
  const numeric = typeof width === 'number' && typeof height === 'number';
  return (
    <RNSvg
      width={width}
      height={height}
      viewBox={numeric ? `0 0 ${width} ${height}` : undefined}
      style={style as object}
      onLayout={
        onLayout
          ? (e: { nativeEvent: { layout: { width: number; height: number } } }) =>
              onLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
          : undefined
      }
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderMove={
        onMove
          ? (e) => onMove({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY })
          : undefined
      }
      onResponderGrant={
        onMove
          ? (e) => onMove({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY })
          : undefined
      }
      onResponderRelease={onLeave}
    >
      {children}
    </RNSvg>
  );
}

export function G({ x, y, transform, onPress, children, ...rest }: GProps) {
  const t = transform ?? (x != null || y != null ? `translate(${x ?? 0},${y ?? 0})` : undefined);
  return (
    <RNG transform={t} onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined} {...rest}>
      {children}
    </RNG>
  );
}

export function Path({ onPress, ...rest }: PathProps) {
  return <RNPath onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined} {...rest} />;
}

export function Rect({ onPress, ...rest }: RectProps) {
  return <RNRect onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined} {...rest} />;
}

export function Circle({ onPress, ...rest }: CircleProps) {
  return <RNCircle onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined} {...rest} />;
}

export function Line({ onPress, ...rest }: LineProps) {
  return <RNLine onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined} {...rest} />;
}

const baselineMap: Record<string, string> = {
  start: 'hanging',
  middle: 'central',
  end: 'baseline',
};

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
    <RNText
      textAnchor={textAnchor}
      alignmentBaseline={verticalAnchor ? (baselineMap[verticalAnchor] as never) : undefined}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight as never}
      onPress={onPress ? () => onPress({ x: 0, y: 0 }) : undefined}
      {...rest}
    >
      {children}
    </RNText>
  );
}
