import type { Meta, StoryObj } from '@storybook/react-vite';
import { FunnelChart } from './FunnelChart';

const data = [
  { stage: 'Visitors', count: 10000 },
  { stage: 'Signups', count: 4200 },
  { stage: 'Trials', count: 2100 },
  { stage: 'Paid', count: 640 },
  { stage: 'Renewals', count: 480 },
];

const twoStages = [
  { stage: 'Impressions', count: 50000 },
  { stage: 'Clicks', count: 3200 },
];

const meta = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data, value: 'count', label: 'stage', width: 400, height: 420 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    orientation: { control: { type: 'radio' }, options: ['vertical', 'horizontal'] },
    showLabels: { control: 'boolean' },
    showValues: { control: 'boolean' },
    showDropOff: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showLabels: true, showValues: true, showDropOff: true, showLegend: true },
};

export const WithDropOff: Story = {
  args: { showLabels: true, showValues: false, showDropOff: true, showLegend: true },
};

export const WithoutLabels: Story = {
  args: { showLabels: false, showValues: false, showDropOff: false, showLegend: true },
};

export const CustomColors: Story = {
  args: {
    colors: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'],
    showLabels: true,
    showValues: true,
    showDropOff: true,
    showLegend: true,
  },
};

export const TwoStages: Story = {
  args: {
    data: twoStages,
    showLabels: true,
    showValues: true,
    showDropOff: true,
    showLegend: true,
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    width: 600,
    height: 300,
    showLabels: true,
    showValues: false,
    showDropOff: false,
    showLegend: true,
  },
};
