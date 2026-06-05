import { scaleLinear, scaleBand, type ScaleLinear } from 'd3-scale';
import { type Accessor, getNumber, getCategory } from './accessors';
import { type Datum, type Tick } from './types';
import { continuousTicks, type Formatter } from './ticks';

export interface ButterflyRow {
  category: string;
  leftValue: number;
  rightValue: number;
  y: number;
  barHeight: number;
}

export interface ButterflyLayout {
  rows: ButterflyRow[];
  leftScale: ScaleLinear<number, number>;
  rightScale: ScaleLinear<number, number>;
  maxValue: number;
  leftTicks: Tick[];
  rightTicks: Tick[];
  centerX: number;
  barHeight: number;
}

export interface ButterflyLayoutOpts {
  categoryAccessor: Accessor<unknown>;
  leftAccessor: Accessor<number>;
  rightAccessor: Accessor<number>;
  innerWidth: number;
  innerHeight: number;
  categoryWidth: number;
  barPadding: number;
  syncScale: boolean;
  maxValue?: number;
  valueFormat?: (v: number) => string;
  tickCount?: number;
}

export function computeButterflyLayout(data: Datum[], opts: ButterflyLayoutOpts): ButterflyLayout {
  const {
    categoryAccessor,
    leftAccessor,
    rightAccessor,
    innerWidth,
    innerHeight,
    categoryWidth,
    barPadding,
    syncScale,
    maxValue: maxValueOverride,
    valueFormat,
    tickCount = 5,
  } = opts;

  const categories: string[] = [];
  const leftValues: number[] = [];
  const rightValues: number[] = [];

  data.forEach((_, i) => {
    const d = data[i];
    const cat = getCategory(d, categoryAccessor, i);
    const left = getNumber(d, leftAccessor, i);
    const right = getNumber(d, rightAccessor, i);

    categories.push(cat);
    leftValues.push(Number.isFinite(left) ? Math.max(0, left) : 0);
    rightValues.push(Number.isFinite(right) ? Math.max(0, right) : 0);

    if (!Number.isFinite(left)) {
      console.warn(`[ButterflyChart] Non-finite left value at index ${i}:`, left);
    }
    if (!Number.isFinite(right)) {
      console.warn(`[ButterflyChart] Non-finite right value at index ${i}:`, right);
    }
  });

  let computedMax: number;
  if (maxValueOverride !== undefined) {
    computedMax = Math.max(0, maxValueOverride);
  } else if (syncScale) {
    const leftMax = Math.max(...leftValues, 0);
    const rightMax = Math.max(...rightValues, 0);
    computedMax = Math.max(leftMax, rightMax, 1);
  } else {
    const allVals = [...leftValues, ...rightValues];
    computedMax = Math.max(...allVals, 1);
  }

  const halfBarWidth = (innerWidth - categoryWidth) / 2;
  const centerX = innerWidth / 2;

  const leftScale = scaleLinear().domain([0, computedMax]).range([halfBarWidth, 0]);
  const rightScale = scaleLinear()
    .domain([0, computedMax])
    .range([centerX + categoryWidth / 2, innerWidth]);

  const yBand = scaleBand<string>()
    .domain(categories)
    .range([0, innerHeight])
    .paddingInner(barPadding)
    .paddingOuter(barPadding / 2);

  const barHeight = yBand.bandwidth();

  const rows: ButterflyRow[] = data.map((_, i) => ({
    category: categories[i],
    leftValue: leftValues[i],
    rightValue: rightValues[i],
    y: yBand(categories[i]) ?? 0,
    barHeight,
  }));

  const leftTicks = continuousTicks(leftScale, tickCount, valueFormat as Formatter);
  const rightTicks = continuousTicks(rightScale, tickCount, valueFormat as Formatter);

  return {
    rows,
    leftScale,
    rightScale,
    maxValue: computedMax,
    leftTicks,
    rightTicks,
    centerX,
    barHeight,
  };
}
