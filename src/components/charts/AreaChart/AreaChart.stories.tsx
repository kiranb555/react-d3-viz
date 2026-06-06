import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from './AreaChart';

const data = [
  { month: 'Jan', sales: 42, profit: 18, revenue: 120 },
  { month: 'Feb', sales: 55, profit: 22, revenue: 150 },
  { month: 'Mar', sales: 49, profit: 20, revenue: 140 },
  { month: 'Apr', sales: 73, profit: 31, revenue: 200 },
  { month: 'May', sales: 68, profit: 28, revenue: 180 },
  { month: 'Jun', sales: 91, profit: 40, revenue: 250 },
];

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data, x: 'month', width: 600, height: 300 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 200, max: 500, step: 50 } },
    showPoints: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    stacked: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  args: { y: 'sales', showGrid: true, showLegend: false },
};

export const MultiSeriesStacked: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    stacked: true,
    showGrid: true,
    showLegend: true,
  },
};

export const MultiSeriesOverlaid: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    stacked: false,
    showGrid: true,
    showPoints: true,
    showLegend: true,
  },
};

export const SmoothCurve: Story = {
  args: {
    series: [{ dataKey: 'sales', curve: 'monotone' }, { dataKey: 'profit', curve: 'monotone' }],
    stacked: true,
    showLegend: true,
  },
};

export const StepCurve: Story = {
  args: {
    series: [{ dataKey: 'sales', curve: 'step' }, { dataKey: 'profit', curve: 'step' }],
    stacked: true,
    showLegend: true,
  },
};

export const ThemedColors: Story = {
  args: {
    series: [
      { dataKey: 'sales' },
      { dataKey: 'profit' },
      { dataKey: 'revenue' },
    ],
    stacked: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    },
  },
};

export const NoAnimationNoGrid: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    stacked: true,
    showGrid: false,
    animate: false,
    showLegend: true,
  },
};
