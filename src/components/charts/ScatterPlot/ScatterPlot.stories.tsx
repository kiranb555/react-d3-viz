import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScatterPlot } from './ScatterPlot';

const data = Array.from({ length: 60 }, () => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  size: Math.round(Math.random() * 30 + 10),
  category: Math.random() > 0.5 ? 'A' : 'B',
}));

const multiSeriesData = [
  {
    name: 'Series A',
    data: Array.from({ length: 30 }, () => ({
      x: Math.round(Math.random() * 50 + 20),
      y: Math.round(Math.random() * 50 + 30),
    })),
  },
  {
    name: 'Series B',
    data: Array.from({ length: 30 }, () => ({
      x: Math.round(Math.random() * 50 + 30),
      y: Math.round(Math.random() * 50 + 10),
    })),
  },
];

const meta = {
  title: 'Charts/ScatterPlot',
  component: ScatterPlot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data, x: 'x', y: 'y', width: 500, height: 400 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 700, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    pointRadius: { control: { type: 'range', min: 2, max: 10, step: 1 } },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof ScatterPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showGrid: true, showLegend: false },
};

export const LargerPoints: Story = {
  args: { pointRadius: 7, showGrid: true },
};

export const WithGrid: Story = {
  args: { showGrid: true, showLegend: false },
};

export const CustomColors: Story = {
  args: {
    color: 'category',
    colors: ['#ff6b6b', '#4ecdc4'],
    showGrid: true,
    showLegend: true,
  },
};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
    x: 'x',
    y: 'y',
    series: [
      { dataKey: 'data', name: 'Series A' },
      { dataKey: 'data', name: 'Series B' },
    ],
    showGrid: true,
    showLegend: true,
  },
};
