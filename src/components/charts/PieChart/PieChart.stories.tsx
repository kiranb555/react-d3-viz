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
  parameters: {
    layout: 'centered',
  },
  args: { data, value: 'value', label: 'label', width: 400, height: 400 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    innerRadius: { control: { type: 'range', min: 0, max: 0.8, step: 0.1 } },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
    centerLabel: { control: 'text' },
    centerSubLabel: { control: 'text' },
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pie: Story = {
  args: { showLabels: true, showLegend: true },
};

export const Donut: Story = {
  args: { innerRadius: 0.6, showLabels: true, showLegend: true },
};

export const WithoutLabels: Story = {
  args: { showLabels: false, showLegend: true },
};

export const CustomColors: Story = {
  args: {
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'],
    showLabels: true,
    showLegend: true,
  },
};

export const LargeInnerRadius: Story = {
  args: {
    innerRadius: 0.75,
    showLabels: true,
    showLegend: true,
  },
};

export const NoAnimation: Story = {
  args: {
    innerRadius: 0.4,
    showLabels: true,
    animate: false,
    showLegend: true,
  },
};

export const DonutWithCenterLabel: Story = {
  args: {
    innerRadius: 0.65,
    showLabels: true,
    showLegend: true,
    centerLabel: (total: number) => total.toLocaleString(),
    centerSubLabel: 'Total',
  },
};
