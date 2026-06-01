import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';

const data = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
  { month: 'Apr', sales: 73, profit: 31 },
  { month: 'May', sales: 68, profit: 28 },
  { month: 'Jun', sales: 91, profit: 40 },
];

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  args: { data, x: 'month', height: 280 },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

export const SingleSeries: Story = {
  args: { y: 'sales', showPoints: true },
};

export const MultiSeries: Story = {
  args: { series: [{ dataKey: 'sales' }, { dataKey: 'profit' }], showPoints: true },
};

export const Stepped: Story = {
  args: { series: [{ dataKey: 'sales', curve: 'step' }] },
};

export const Themed: Story = {
  args: {
    series: [{ dataKey: 'sales' }, { dataKey: 'profit' }],
    theme: { colors: ['#ff6b6b', '#4ecdc4'], grid: { dashArray: '4 4' } },
  },
};
