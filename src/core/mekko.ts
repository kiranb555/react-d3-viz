// src/core/mekko.ts
import { scaleLinear } from "d3-scale";
import type { Margin } from "./types";

export interface MekkoCategory {
  id?: string;
  label: string;
  value: number;
}

export interface MekkoSeriesData {
  categoryId: string;
  value: number;
}

export interface MekkoSeries {
  id: string;
  label: string;
  data: MekkoSeriesData[];
}

export interface MekkoData {
  categories: MekkoCategory[];
  series: MekkoSeries[];
}

export interface MekkoSegment {
  seriesId: string;
  seriesLabel: string;
  y: number;
  height: number;
  value: number;
}

export interface MekkoColumn {
  label: string;
  x: number;
  width: number;
  segments: MekkoSegment[];
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface MekkoLayoutResult {
  columns: MekkoColumn[];
  bounds: Bounds;
}

export function calculateMekkoLayout(
  data: MekkoData,
  width: number,
  height: number,
  margin: Margin
): MekkoLayoutResult {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (!data.categories || data.categories.length === 0) {
    return {
      columns: [],
      bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight }
    };
  }

  // Filter out invalid categories (non-positive widths)
  const validCategories = data.categories.filter(cat => cat.value > 0);

  if (validCategories.length === 0) {
    return {
      columns: [],
      bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight }
    };
  }

  // Compute total width
  const totalCategoryValue = validCategories.reduce(
    (sum, cat) => sum + cat.value,
    0
  );

  // Create width scale
  const widthScale = scaleLinear()
    .domain([0, totalCategoryValue])
    .range([0, innerWidth]);

  // Build columns
  const columns: MekkoColumn[] = [];
  let xOffset = 0;

  validCategories.forEach(category => {
    const categoryWidth = widthScale(category.value);

    // Get segment data for this category
    const segmentValues = data.series
      .map(series => {
        const segmentData = series.data.find(
          d => d.categoryId === category.label || d.categoryId === category.id
        );
        return {
          seriesId: series.id,
          seriesLabel: series.label,
          value: segmentData?.value || 0
        };
      })
      .filter(s => s.value > 0);

    // Compute total for this column
    const columnTotal = segmentValues.reduce((sum, s) => sum + s.value, 0);

    // Create height scale for this column
    const heightScale = scaleLinear()
      .domain([0, columnTotal])
      .range([0, innerHeight]);

    // Stack segments
    const segments: MekkoSegment[] = [];
    let yOffset = 0;

    segmentValues.forEach(segment => {
      const segmentHeight = heightScale(segment.value);
      segments.push({
        seriesId: segment.seriesId,
        seriesLabel: segment.seriesLabel,
        y: yOffset,
        height: segmentHeight,
        value: segment.value
      });
      yOffset += segmentHeight;
    });

    columns.push({
      label: category.label,
      x: xOffset,
      width: categoryWidth,
      segments
    });

    xOffset += categoryWidth;
  });

  return {
    columns,
    bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight }
  };
}
