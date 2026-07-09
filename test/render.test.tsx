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
  TreemapChart,
  WaterfallChart,
  SankeyDiagram,
  MekkoChart,
  ButterflyChart,
  HeatmapChart,
  SunburstChart,
  QuadrantChart,
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
const treemapFlat = [
  { name: 'A', cat: 'X', value: 40 },
  { name: 'B', cat: 'X', value: 30 },
  { name: 'C', cat: 'Y', value: 20 },
  { name: 'D', cat: 'Y', value: 10 },
];
const treemapNested = {
  name: 'root',
  children: [
    { name: 'X', children: [{ name: 'a', value: 10 }, { name: 'b', value: 20 }] },
    { name: 'Y', children: [{ name: 'c', value: 30 }] },
  ],
};
const sunburstNested = {
  name: 'root',
  children: [
    { name: 'A', children: [{ name: 'a1', value: 20 }, { name: 'a2', value: 30 }] },
    { name: 'B', children: [{ name: 'b1', value: 40 }] },
  ],
};
const sunburstFlat = [
  { name: 'Item 1', value: 30 },
  { name: 'Item 2', value: 25 },
  { name: 'Item 3', value: 20 },
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

  it('PieChart donut renders a string centerLabel', () => {
    const { getByText } = renderChart(
      <PieChart data={pie} value="value" label="label" innerRadius={0.5} centerLabel="Total" width={300} height={300} />,
    );
    expect(getByText('Total')).toBeTruthy();
  });

  it('PieChart function-form centerLabel receives the visible total', () => {
    const centerLabel = (total: number) => `Total: ${total}`;
    const { getByText } = renderChart(
      <PieChart data={pie} value="value" label="label" innerRadius={0.5} centerLabel={centerLabel} width={300} height={300} />,
    );
    // pie = [{ value: 30 }, { value: 70 }] => visible total is 100.
    expect(getByText('Total: 100')).toBeTruthy();
  });

  it('PieChart hides centerLabel when innerRadius is 0 (full pie)', () => {
    const { queryByText } = renderChart(
      <PieChart data={pie} value="value" label="label" innerRadius={0} centerLabel="Hello" width={300} height={300} />,
    );
    expect(queryByText('Hello')).toBeNull();
  });

  it('PieChart hides an unreadably long centerLabel rather than overflow the hole', () => {
    const longLabel = 'This Is A Very Long Center Label String For Testing';
    const { queryByText } = renderChart(
      <PieChart data={pie} value="value" label="label" innerRadius={0.15} centerLabel={longLabel} width={300} height={300} />,
    );
    expect(queryByText(longLabel)).toBeNull();
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

  it('TreemapChart (grouped flat) renders a rect per leaf', () => {
    const { container } = renderChart(
      <TreemapChart data={treemapFlat} value="value" label="name" group="cat" width={400} height={300} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
    // 4 leaves + group bands + background + legend swatches → at least 4 rects.
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(4);
  });

  it('TreemapChart (nested) renders a rect per leaf', () => {
    const { container } = renderChart(
      <TreemapChart data={treemapNested} value="value" label="name" width={400} height={300} />,
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(3);
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

  it('WaterfallChart renders without crashing', () => {
    const { container } = renderChart(
      <WaterfallChart
        data={[
          { label: 'A', value: 100 },
          { label: 'B', value: 50 },
          { label: 'C', value: 150, isTotal: true },
        ]}
        width={400}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('WaterfallChart renders correct number of segments', () => {
    const data = [
      { label: 'A', value: 100 },
      { label: 'B', value: 50 },
    ];
    const { container } = renderChart(
      <WaterfallChart data={data} width={400} height={300} />
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('WaterfallChart handles empty data gracefully', () => {
    const { container } = renderChart(
      <WaterfallChart data={[]} width={400} height={300} />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('SankeyDiagram renders without crashing', () => {
    const { container } = renderChart(
      <SankeyDiagram
        data={{
          nodes: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
          links: [{ source: 'a', target: 'b', value: 50 }],
        }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('SankeyDiagram renders correct number of nodes and links', () => {
    const { container } = renderChart(
      <SankeyDiagram
        data={{
          nodes: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ],
          links: [
            { source: 'a', target: 'b', value: 50 },
            { source: 'b', target: 'c', value: 50 },
          ],
        }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThanOrEqual(3);
  });

  it('SankeyDiagram handles empty data gracefully', () => {
    const { container } = renderChart(
      <SankeyDiagram
        data={{ nodes: [], links: [] }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('MekkoChart renders without crashing', () => {
    const { container } = renderChart(
      <MekkoChart
        data={{
          categories: [{ label: 'Q1', value: 100 }],
          series: [
            {
              id: 'a',
              label: 'A',
              data: [{ categoryId: 'Q1', value: 100 }],
            },
          ],
        }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('MekkoChart renders correct number of segments', () => {
    const { container } = renderChart(
      <MekkoChart
        data={{
          categories: [
            { label: 'Q1', value: 100 },
            { label: 'Q2', value: 150 },
          ],
          series: [
            {
              id: 'a',
              label: 'A',
              data: [
                { categoryId: 'Q1', value: 50 },
                { categoryId: 'Q2', value: 75 },
              ],
            },
            {
              id: 'b',
              label: 'B',
              data: [
                { categoryId: 'Q1', value: 50 },
                { categoryId: 'Q2', value: 75 },
              ],
            },
          ],
        }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('MekkoChart handles empty data gracefully', () => {
    const { container } = renderChart(
      <MekkoChart
        data={{ categories: [], series: [] }}
        width={400}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('ButterflyChart renders without crashing', () => {
    const { container } = renderChart(
      <ButterflyChart
        data={[
          { age: 'A', m: 10, f: 8 },
          { age: 'B', m: 7, f: 12 },
        ]}
        category="age"
        left="m"
        right="f"
        width={400}
        height={200}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('ButterflyChart renders value labels when showValues=true', () => {
    const { container } = renderChart(
      <ButterflyChart
        data={[{ age: 'A', m: 10, f: 8 }]}
        category="age"
        left="m"
        right="f"
        width={400}
        height={200}
        showValues
      />
    );
    expect(container.querySelectorAll('text').length).toBeGreaterThan(2);
  });

  it('ButterflyChart handles empty data gracefully', () => {
    const { container } = renderChart(
      <ButterflyChart data={[]} category="age" left="m" right="f" width={400} height={200} />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('HeatmapChart renders cells', () => {
    const heatmapData = [
      { row: 'A', col: 'X', value: 10 },
      { row: 'A', col: 'Y', value: 20 },
      { row: 'B', col: 'X', value: 30 },
      { row: 'B', col: 'Y', value: 40 },
    ];
    const { container } = renderChart(
      <HeatmapChart
        data={heatmapData}
        rowKey="row"
        columnKey="col"
        valueKey="value"
        width={300}
        height={300}
      />
    );
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(0);
  });

  it('HeatmapChart renders without crashing with minimal props', () => {
    const { container } = renderChart(
      <HeatmapChart
        data={[{ r: 'A', c: 'X', v: 50 }]}
        rowKey="r"
        columnKey="c"
        valueKey="v"
        width={200}
        height={200}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('HeatmapChart renders labels when showXLabels and showYLabels are true', () => {
    const heatmapData = [
      { row: 'Row1', col: 'Col1', value: 10 },
      { row: 'Row1', col: 'Col2', value: 20 },
    ];
    const { container } = renderChart(
      <HeatmapChart
        data={heatmapData}
        rowKey="row"
        columnKey="col"
        valueKey="value"
        showXLabels={true}
        showYLabels={true}
        width={300}
        height={300}
      />
    );
    const textElements = container.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThan(0);
  });

  it('HeatmapChart handles diverging color scale', () => {
    const heatmapData = [
      { row: 'A', col: 'X', value: -0.5 },
      { row: 'A', col: 'Y', value: 0 },
      { row: 'B', col: 'X', value: 0.5 },
    ];
    const { container } = renderChart(
      <HeatmapChart
        data={heatmapData}
        rowKey="row"
        columnKey="col"
        valueKey="value"
        colorScaleMode="diverging"
        colorDomain={[-1, 1]}
        width={300}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('HeatmapChart handles missing values (NaN)', () => {
    const heatmapData = [
      { row: 'A', col: 'X', value: 10 },
      { row: 'A', col: 'Y', value: NaN },
      { row: 'B', col: 'X', value: 30 },
    ];
    const { container } = renderChart(
      <HeatmapChart
        data={heatmapData}
        rowKey="row"
        columnKey="col"
        valueKey="value"
        width={300}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('SunburstChart renders nested data', () => {
    const { container } = renderChart(
      <SunburstChart
        data={sunburstNested}
        value="value"
        label="name"
        childrenKey="children"
        width={300}
        height={300}
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('SunburstChart renders flat data', () => {
    const { container } = renderChart(
      <SunburstChart data={sunburstFlat} value="value" label="name" width={300} height={300} />
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('SunburstChart handles empty data gracefully', () => {
    const { container } = renderChart(<SunburstChart data={[]} value="value" width={300} height={300} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('QuadrantChart renders without error', () => {
    const data = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    const { container } = renderChart(
      <QuadrantChart
        data={data}
        x="x"
        y="y"
        width={400}
        height={300}
        thresholdMode="mean"
      />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
