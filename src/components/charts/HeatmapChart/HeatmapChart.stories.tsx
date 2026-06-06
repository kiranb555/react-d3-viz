import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeatmapChart } from './HeatmapChart';

// Sample data: temperature by day and hour
const temperatureData = [
  { hour: '00:00', day: 'Mon', temp: 15 },
  { hour: '00:00', day: 'Tue', temp: 16 },
  { hour: '00:00', day: 'Wed', temp: 14 },
  { hour: '00:00', day: 'Thu', temp: 17 },
  { hour: '00:00', day: 'Fri', temp: 18 },
  { hour: '04:00', day: 'Mon', temp: 12 },
  { hour: '04:00', day: 'Tue', temp: 13 },
  { hour: '04:00', day: 'Wed', temp: 11 },
  { hour: '04:00', day: 'Thu', temp: 14 },
  { hour: '04:00', day: 'Fri', temp: 15 },
  { hour: '08:00', day: 'Mon', temp: 18 },
  { hour: '08:00', day: 'Tue', temp: 19 },
  { hour: '08:00', day: 'Wed', temp: 17 },
  { hour: '08:00', day: 'Thu', temp: 20 },
  { hour: '08:00', day: 'Fri', temp: 21 },
  { hour: '12:00', day: 'Mon', temp: 24 },
  { hour: '12:00', day: 'Tue', temp: 25 },
  { hour: '12:00', day: 'Wed', temp: 23 },
  { hour: '12:00', day: 'Thu', temp: 26 },
  { hour: '12:00', day: 'Fri', temp: 27 },
  { hour: '16:00', day: 'Mon', temp: 26 },
  { hour: '16:00', day: 'Tue', temp: 27 },
  { hour: '16:00', day: 'Wed', temp: 25 },
  { hour: '16:00', day: 'Thu', temp: 28 },
  { hour: '16:00', day: 'Fri', temp: 29 },
  { hour: '20:00', day: 'Mon', temp: 22 },
  { hour: '20:00', day: 'Tue', temp: 23 },
  { hour: '20:00', day: 'Wed', temp: 21 },
  { hour: '20:00', day: 'Thu', temp: 24 },
  { hour: '20:00', day: 'Fri', temp: 25 },
];

// Sample data: correlation matrix
const correlationData = [
  { x: 'A', y: 'A', value: 1.0 },
  { x: 'B', y: 'A', value: 0.85 },
  { x: 'C', y: 'A', value: -0.6 },
  { x: 'D', y: 'A', value: 0.4 },
  { x: 'A', y: 'B', value: 0.85 },
  { x: 'B', y: 'B', value: 1.0 },
  { x: 'C', y: 'B', value: -0.75 },
  { x: 'D', y: 'B', value: 0.5 },
  { x: 'A', y: 'C', value: -0.6 },
  { x: 'B', y: 'C', value: -0.75 },
  { x: 'C', y: 'C', value: 1.0 },
  { x: 'D', y: 'C', value: -0.3 },
  { x: 'A', y: 'D', value: 0.4 },
  { x: 'B', y: 'D', value: 0.5 },
  { x: 'C', y: 'D', value: -0.3 },
  { x: 'D', y: 'D', value: 1.0 },
];

// Sample data: sales heatmap
const salesData = [
  { product: 'Laptop', region: 'North', sales: 450 },
  { product: 'Laptop', region: 'South', sales: 380 },
  { product: 'Laptop', region: 'East', sales: 520 },
  { product: 'Laptop', region: 'West', sales: 410 },
  { product: 'Tablet', region: 'North', sales: 320 },
  { product: 'Tablet', region: 'South', sales: 410 },
  { product: 'Tablet', region: 'East', sales: 280 },
  { product: 'Tablet', region: 'West', sales: 350 },
  { product: 'Phone', region: 'North', sales: 600 },
  { product: 'Phone', region: 'South', sales: 650 },
  { product: 'Phone', region: 'East', sales: 720 },
  { product: 'Phone', region: 'West', sales: 580 },
  { product: 'Watch', region: 'North', sales: 180 },
  { product: 'Watch', region: 'South', sales: 210 },
  { product: 'Watch', region: 'East', sales: 150 },
  { product: 'Watch', region: 'West', sales: 190 },
];

const meta = {
  title: 'Charts/HeatmapChart',
  component: HeatmapChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    width: 'auto',
    height: 400,
    showXLabels: true,
    showYLabels: true,
    showTooltip: true,
    animate: true,
  },
  argTypes: {
    height: { control: { type: 'range', min: 300, max: 700, step: 50 } },
    showXLabels: { control: 'boolean' },
    showYLabels: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    animate: { control: 'boolean' },
    cellStrokeWidth: { control: { type: 'range', min: 0, max: 3, step: 0.5 } },
  },
} satisfies Meta<typeof HeatmapChart>;

export default meta;
type Story = StoryObj<typeof HeatmapChart>;

export const Temperature: Story = {
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    formatValue: (v) => `${v}°C`,
    colorStart: '#4575b4',
    colorEnd: '#d73027',
  },
};

export const Correlation: Story = {
  args: {
    data: correlationData,
    rowKey: 'y',
    columnKey: 'x',
    valueKey: 'value',
    formatValue: (v) => v.toFixed(2),
    colorScaleMode: 'diverging',
    colorStart: '#d73027',
    colorMid: '#f7f7f7',
    colorEnd: '#4575b4',
    colorDomain: [-1, 1],
  },
};

export const Sales: Story = {
  args: {
    data: salesData,
    rowKey: 'product',
    columnKey: 'region',
    valueKey: 'sales',
    formatValue: (v) => `$${v}`,
    colorStart: '#ffffcc',
    colorEnd: '#003300',
  },
};

export const NoLabels: Story = {
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    showXLabels: false,
    showYLabels: false,
  },
};

export const NoTooltip: Story = {
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    showTooltip: false,
  },
};

export const NoAnimation: Story = {
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    animate: false,
  },
};

export const CustomCellStroke: Story = {
  args: {
    data: salesData,
    rowKey: 'product',
    columnKey: 'region',
    valueKey: 'sales',
    cellStroke: '#cccccc',
    cellStrokeWidth: 2,
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 1000 }, (_, i) => ({
      row: `R${Math.floor(i / 50)}`,
      col: `C${i % 50}`,
      val: Math.random() * 100,
    })),
    rowKey: 'row',
    columnKey: 'col',
    valueKey: 'val',
    height: 600,
  },
};
