import type { Meta, StoryObj } from '@storybook/react-vite';
import { SunburstChart } from './SunburstChart';

const hierarchicalData = {
  name: 'Organization',
  value: 0,
  children: [
    {
      name: 'Engineering',
      value: 0,
      children: [
        { name: 'Frontend', value: 45 },
        { name: 'Backend', value: 38 },
        { name: 'DevOps', value: 22 },
      ],
    },
    {
      name: 'Product',
      value: 0,
      children: [
        { name: 'Design', value: 18 },
        { name: 'Management', value: 12 },
      ],
    },
    {
      name: 'Sales',
      value: 0,
      children: [
        { name: 'Enterprise', value: 35 },
        { name: 'Mid-Market', value: 28 },
      ],
    },
  ],
};

const flatData = [
  { name: 'Category A', value: 30 },
  { name: 'Category B', value: 25 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 15 },
  { name: 'Category E', value: 10 },
];

const meta = {
  title: 'Charts/SunburstChart',
  component: SunburstChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: hierarchicalData,
    value: 'value',
    label: 'name',
    childrenKey: 'children',
    width: 450,
    height: 450,
  },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    innerRadius: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 } },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof SunburstChart>;

export default meta;
type Story = StoryObj<typeof SunburstChart>;

export const Default: Story = {};

export const DonutStyle: Story = {
  args: {
    innerRadius: 0.35,
  },
};

export const FlatData: Story = {
  args: {
    data: flatData,
    childrenKey: undefined,
  },
};

export const NoAnimation: Story = {
  args: {
    animate: false,
  },
};
