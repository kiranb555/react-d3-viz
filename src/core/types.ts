/**
 * Shared, platform-agnostic types for the compute core.
 * Nothing here touches the DOM or react-native — pure data.
 */

/** A single data record. Charts read values out of it via accessor keys. */
export type Datum = Record<string, unknown>;

/** Margins around the plotting area (the "inner" region). */
export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Computed inner plotting bounds derived from outer size + margins. */
export interface ChartBounds {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
}

/** A numeric [min, max] domain. */
export type NumericDomain = [number, number];

/** One axis tick: its data value and its pixel position along the axis. */
export interface Tick {
  value: number;
  /** Pixel offset along the axis (already scaled). */
  position: number;
  /** Pre-formatted label text. */
  label: string;
}
