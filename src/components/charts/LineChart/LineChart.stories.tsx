import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';

const data = [
  { month: 'Jan', sales: 42, profit: 18, revenue: 120 },
  { month: 'Feb', sales: 55, profit: 22, revenue: 150 },
  { month: 'Mar', sales: 49, profit: 20, revenue: 140 },
  { month: 'Apr', sales: 73, profit: 31, revenue: 200 },
  { month: 'May', sales: 68, profit: 28, revenue: 180 },
  { month: 'Jun', sales: 91, profit: 40, revenue: 250 },
];

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
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
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  args: { y: 'sales', showPoints: true, showGrid: true, showLegend: false },
};

export const MultiSeries: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    showPoints: true,
    showGrid: true,
    showLegend: true,
  },
};

export const ThreeSeriesStacked: Story = {
  args: {
    series: [
      { dataKey: 'sales' },
      { dataKey: 'profit' },
      { dataKey: 'revenue' },
    ],
    showPoints: false,
    showLegend: true,
  },
};

export const SmoothCurve: Story = {
  args: {
    series: [{ dataKey: 'sales', curve: 'monotone' }, { dataKey: 'profit', curve: 'monotone' }],
    showPoints: true,
    showLegend: true,
  },
};

export const StepCurve: Story = {
  args: {
    series: [{ dataKey: 'sales', curve: 'step' }, { dataKey: 'profit', curve: 'step' }],
    showPoints: false,
    showLegend: true,
  },
};

export const CustomColors: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }, { dataKey: 'revenue' }],
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    showPoints: true,
    showLegend: true,
  },
};

export const NoAnimationNoGrid: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    showPoints: true,
    showGrid: false,
    animate: false,
    showLegend: true,
  },
};
