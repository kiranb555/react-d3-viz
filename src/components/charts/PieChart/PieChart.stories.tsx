import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChart } from './PieChart';

const data = [
  { label: 'JavaScript', value: 38.7 },
  { label: 'Python', value: 24.5 },
  { label: 'TypeScript', value: 18.3 },
  { label: 'Rust', value: 9.1 },
  { label: 'Go', value: 6.2 },
  { label: 'Other', value: 3.2 },
];

const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  args: { data, value: 'value', label: 'label', width: 360, height: 360 },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Pie: Story = {};

export const Donut: Story = {
  args: { innerRadius: 0.6 },
};
