import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';

const data = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
  { month: 'Apr', sales: 73, profit: 31 },
  { month: 'May', sales: 68, profit: 28 },
  { month: 'Jun', sales: 91, profit: 40 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: { data, x: 'month', height: 280 },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Single: Story = {
  args: { y: 'sales' },
};

export const Grouped: Story = {
  args: { series: [{ dataKey: 'sales' }, { dataKey: 'profit' }] },
};

export const Stacked: Story = {
  args: { series: [{ dataKey: 'sales' }, { dataKey: 'profit' }], stacked: true },
};
