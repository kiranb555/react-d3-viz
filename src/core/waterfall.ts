// src/core/waterfall.ts
import { scaleLinear } from "d3-scale";
import { Margin } from "./types";

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface WaterfallDataPoint {
  label: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallSegment {
  label: string;
  startY: number;
  endY: number;
  height: number;
  isPositive: boolean;
  isTotal: boolean;
}

export interface WaterfallConnector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface WaterfallLayoutResult {
  segments: WaterfallSegment[];
  connectors: WaterfallConnector[];
  bounds: Bounds;
  runningTotals: number[];
}

export function calculateWaterfallLayout(
  data: WaterfallDataPoint[],
  width: number,
  height: number,
  margin: Margin
): WaterfallLayoutResult {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Handle empty data
  if (!data || data.length === 0) {
    return {
      segments: [],
      connectors: [],
      bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight },
      runningTotals: []
    };
  }

  // Compute running totals
  const runningTotals: number[] = [];
  let total = 0;
  data.forEach(point => {
    total += point.value;
    runningTotals.push(total);
  });

  // Determine value domain
  const allValues = [
    0,
    ...runningTotals,
    ...data.map(d => d.value),
    ...runningTotals.map((rt, i) => rt - data[i].value)
  ];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  // Create scales
  const yScale = scaleLinear()
    .domain([minValue - padding, maxValue + padding])
    .range([innerHeight, 0]);

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, innerWidth]);

  // Compute segments
  const segments: WaterfallSegment[] = [];
  const connectors: WaterfallConnector[] = [];
  let previousY = yScale(0);

  data.forEach((point, index) => {
    const x = xScale(index);
    const isPositive = point.value >= 0;

    if (point.isTotal) {
      // Total segment: from 0 to running total
      const startY = yScale(0);
      const endY = yScale(runningTotals[index]);
      segments.push({
        label: point.label,
        startY: Math.min(startY, endY),
        endY: Math.max(startY, endY),
        height: Math.abs(endY - startY),
        isPositive: runningTotals[index] >= 0,
        isTotal: true
      });
      previousY = endY;
    } else {
      // Regular segment: from previous total to current total
      const previousTotal = index === 0 ? 0 : runningTotals[index - 1];
      const currentTotal = runningTotals[index];
      const startY = yScale(previousTotal);
      const endY = yScale(currentTotal);

      segments.push({
        label: point.label,
        startY: Math.min(startY, endY),
        endY: Math.max(startY, endY),
        height: Math.abs(endY - startY),
        isPositive,
        isTotal: false
      });

      // Add connector line if not first segment
      if (index > 0) {
        const prevSegmentEndX = xScale(index - 1);
        connectors.push({
          x1: prevSegmentEndX,
          y1: previousY,
          x2: x,
          y2: startY
        });
      }

      previousY = endY;
    }
  });

  return {
    segments,
    connectors,
    bounds: { minX: 0, maxX: innerWidth, minY: 0, maxY: innerHeight },
    runningTotals
  };
}
