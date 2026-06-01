import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  ThemeProvider,
  LineChart,
  AreaChart,
  BarChart,
  ScatterPlot,
  BubbleChart,
  PieChart,
  Histogram,
  RadarChart,
} from '../src/index';

afterEach(cleanup);

// Disable animation so charts render their final geometry synchronously.
const noAnim = { animation: { enabled: false } };

const months = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
];
const pts = [
  { x: 1, y: 2, size: 10 },
  { x: 3, y: 5, size: 20 },
  { x: 6, y: 1, size: 30 },
];
const pie = [
  { label: 'A', value: 30 },
  { label: 'B', value: 70 },
];
const radar = [
  { axis: 'Speed', team: 80 },
  { axis: 'Power', team: 60 },
  { axis: 'Range', team: 90 },
];

function renderChart(node: React.ReactElement) {
  return render(<ThemeProvider theme={noAnim}>{node}</ThemeProvider>);
}

describe('chart rendering (web SVG)', () => {
  it('LineChart renders an svg with a line path', () => {
    const { container } = renderChart(
      <LineChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={400} height={240} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('AreaChart renders filled paths', () => {
    const { container } = renderChart(<AreaChart data={months} x="month" y="sales" width={400} height={240} />);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('BarChart (grouped) renders rects', () => {
    const { container } = renderChart(
      <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={400} height={240} />,
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('BarChart (stacked) renders rects', () => {
    const { container } = renderChart(
      <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked width={400} height={240} />,
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('ScatterPlot renders circles', () => {
    const { container } = renderChart(<ScatterPlot data={pts} x="x" y="y" width={400} height={240} />);
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('BubbleChart renders circles', () => {
    const { container } = renderChart(<BubbleChart data={pts} x="x" y="y" size="size" width={400} height={240} />);
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('PieChart renders slice paths', () => {
    const { container } = renderChart(<PieChart data={pie} value="value" label="label" width={300} height={300} />);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('Histogram renders bars', () => {
    const values = Array.from({ length: 100 }, (_, i) => i % 10);
    const { container } = renderChart(<Histogram values={values} bins={10} width={400} height={240} />);
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('RadarChart renders polygons', () => {
    const { container } = renderChart(<RadarChart data={radar} axis="axis" series={[{ dataKey: 'team' }]} width={300} height={300} />);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('width="auto" renders a 100%-width measuring svg (responsive mode)', () => {
    // No explicit width => auto. Without a real ResizeObserver (jsdom) the chart
    // renders the 100%-width root that will measure + re-flow in a browser.
    const { container } = renderChart(<LineChart data={months} x="month" y="sales" height={240} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('height')).toBe('240');
  });
});
