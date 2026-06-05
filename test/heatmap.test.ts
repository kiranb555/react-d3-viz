import { describe, it, expect } from 'vitest';
import {
  createLinearColorScale,
  createDivergingColorScale,
  computeHeatmapCells,
  heatmapExtent,
} from '../src/core/heatmap';

describe('heatmapExtent', () => {
  it('finds min and max in a 2D matrix', () => {
    const matrix = [[10, 20], [5, 30]];
    const [min, max] = heatmapExtent(matrix);
    expect(min).toBe(5);
    expect(max).toBe(30);
  });

  it('ignores NaN values', () => {
    const matrix = [[NaN, 20], [5, NaN]];
    const [min, max] = heatmapExtent(matrix);
    expect(min).toBe(5);
    expect(max).toBe(20);
  });

  it('returns [0, 1] for empty matrix', () => {
    const matrix: number[][] = [];
    const [min, max] = heatmapExtent(matrix);
    expect(min).toBe(0);
    expect(max).toBe(1);
  });

  it('handles all-NaN matrix', () => {
    const matrix = [[NaN, NaN], [NaN, NaN]];
    const [min, max] = heatmapExtent(matrix);
    expect(min).toBe(0);
    expect(max).toBe(1);
  });

  it('handles single value', () => {
    const matrix = [[5]];
    const [min, max] = heatmapExtent(matrix);
    expect(min).toBe(5);
    expect(max).toBe(5);
  });
});

describe('createLinearColorScale', () => {
  it('creates a scale that maps domain to color range', () => {
    const scale = createLinearColorScale([0, 100], '#000000', '#ffffff');
    expect(scale.domain).toEqual([0, 100]);
    expect(scale.interpolate).toBeDefined();
  });

  it('interpolates colors at domain boundaries', () => {
    const scale = createLinearColorScale([0, 100], '#000000', '#ffffff');
    const minColor = scale.interpolate(0);
    const maxColor = scale.interpolate(100);
    expect(minColor).toBe('#000000');
    expect(maxColor).toBe('#ffffff');
  });

  it('interpolates colors at midpoint', () => {
    const scale = createLinearColorScale([0, 100], '#000000', '#ffffff');
    const midColor = scale.interpolate(50);
    expect(midColor).toBeDefined();
    expect(midColor).not.toBe('#000000');
    expect(midColor).not.toBe('#ffffff');
  });

  it('clamps values outside domain', () => {
    const scale = createLinearColorScale([0, 100], '#000000', '#ffffff');
    const belowMin = scale.interpolate(-50);
    const aboveMax = scale.interpolate(150);
    expect(belowMin).toBe('#000000');
    expect(aboveMax).toBe('#ffffff');
  });

  it('handles zero-width domain', () => {
    const scale = createLinearColorScale([50, 50], '#000000', '#ffffff');
    const color = scale.interpolate(50);
    expect(color).toBe('#000000');
  });
});

describe('createDivergingColorScale', () => {
  it('creates a scale with three colors', () => {
    const scale = createDivergingColorScale([-1, 1], '#d73027', '#ffffff', '#4575b4');
    expect(scale.domain).toEqual([-1, 1]);
  });

  it('maps min to low color', () => {
    const scale = createDivergingColorScale([-1, 1], '#d73027', '#ffffff', '#4575b4');
    const color = scale.interpolate(-1);
    expect(color).toBe('#d73027');
  });

  it('maps max to high color', () => {
    const scale = createDivergingColorScale([-1, 1], '#d73027', '#ffffff', '#4575b4');
    const color = scale.interpolate(1);
    expect(color).toBe('#4575b4');
  });

  it('maps middle to mid color', () => {
    const scale = createDivergingColorScale([-1, 1], '#d73027', '#ffffff', '#4575b4');
    const color = scale.interpolate(0);
    expect(color).toBe('#ffffff');
  });

  it('interpolates between low and mid', () => {
    const scale = createDivergingColorScale([-1, 1], '#d73027', '#ffffff', '#4575b4');
    const color = scale.interpolate(-0.5);
    expect(color).toBeDefined();
    expect(color).not.toBe('#d73027');
    expect(color).not.toBe('#ffffff');
  });
});

describe('computeHeatmapCells', () => {
  it('creates cells for each valid value in matrix', () => {
    const xCats = ['A', 'B'];
    const yCats = ['X', 'Y'];
    const matrix = [[10, 20], [30, 40]];
    const scale = createLinearColorScale([10, 40], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells).toHaveLength(4);
  });

  it('skips NaN values', () => {
    const xCats = ['A', 'B'];
    const yCats = ['X', 'Y'];
    const matrix = [[10, NaN], [30, 40]];
    const scale = createLinearColorScale([10, 40], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells).toHaveLength(3);
  });

  it('assigns correct coordinates to cells', () => {
    const xCats = ['A', 'B'];
    const yCats = ['X', 'Y'];
    const matrix = [[10, 20], [30, 40]];
    const scale = createLinearColorScale([10, 40], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells[0]).toMatchObject({ x: 0, y: 0, value: 10 });
    expect(cells[1]).toMatchObject({ x: 1, y: 0, value: 20 });
    expect(cells[2]).toMatchObject({ x: 0, y: 1, value: 30 });
    expect(cells[3]).toMatchObject({ x: 1, y: 1, value: 40 });
  });

  it('assigns colors based on values', () => {
    const xCats = ['A', 'B'];
    const yCats = ['X'];
    const matrix = [[0, 100]];
    const scale = createLinearColorScale([0, 100], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells[0].color).toBe('#000000');
    expect(cells[1].color).toBe('#ffffff');
  });

  it('handles empty matrix', () => {
    const xCats: string[] = [];
    const yCats: string[] = [];
    const matrix: number[][] = [];
    const scale = createLinearColorScale([0, 1], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells).toHaveLength(0);
  });

  it('handles ragged matrix', () => {
    const xCats = ['A', 'B', 'C'];
    const yCats = ['X', 'Y'];
    const matrix = [[10, 20], [30]];
    const scale = createLinearColorScale([10, 30], '#000000', '#ffffff');

    const cells = computeHeatmapCells(xCats, yCats, matrix, scale);

    expect(cells).toHaveLength(3);
  });
});
