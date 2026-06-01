export const CATEGORICAL = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
];

export const SEQUENTIAL_BLUE = ['#deebf7', '#084594'];
export const SEQUENTIAL_GREEN = ['#e5f5e0', '#006d2c'];
export const SEQUENTIAL_RED = ['#fee5d9', '#a50f15'];
export const DIVERGING = ['#d73027', '#f7f7f7', '#4575b4'];

export function getColor(index: number, palette = CATEGORICAL): string {
  return palette[index % palette.length];
}
