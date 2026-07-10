import type { Meta, StoryObj } from '@storybook/react-vite';
import { GaugeChart } from './GaugeChart';

const DEG = Math.PI / 180;

const meta = {
  title: 'Charts/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { value: 62, min: 0, max: 100, width: 420, height: 280 },
  argTypes: {
    width: { control: { type: 'range', min: 280, max: 600, step: 20 } },
    height: { control: { type: 'range', min: 200, max: 480, step: 20 } },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showNeedle: { control: 'boolean' },
    showValue: { control: 'boolean' },
    showTicks: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 62, showNeedle: true, showValue: true, showTicks: true },
};

export const WithThresholdBands: Story = {
  args: {
    value: 78,
    showNeedle: true,
    showValue: true,
    showTicks: true,
    thresholds: [
      { from: 0, to: 50, color: '#ef4444', label: 'Low' },
      { from: 50, to: 80, color: '#f59e0b', label: 'Medium' },
      { from: 80, to: 100, color: '#10b981', label: 'High' },
    ],
  },
};

export const WithoutNeedle: Story = {
  args: {
    value: 45,
    showNeedle: false,
    showValue: true,
    showTicks: false,
    formatValue: (v) => `${Math.round(v)}%`,
  },
};

export const CustomSweepFull270: Story = {
  args: {
    value: 210,
    min: 0,
    max: 300,
    startAngle: -135 * DEG,
    endAngle: 135 * DEG,
    formatValue: (v) => `${Math.round(v)} km/h`,
  },
};

export const CustomSweepHalfDonut: Story = {
  args: {
    value: 30,
    min: 0,
    max: 40,
    startAngle: -90 * DEG,
    endAngle: 90 * DEG,
    thresholds: [
      { from: 0, to: 20, color: '#10b981' },
      { from: 20, to: 32, color: '#f59e0b' },
      { from: 32, to: 40, color: '#ef4444' },
    ],
    formatValue: (v) => `${v.toFixed(1)}°C`,
  },
};

export const SmallValue: Story = {
  args: { value: 2, min: 0, max: 100 },
};

export const MaxValue: Story = {
  args: { value: 100, min: 0, max: 100 },
};

export const OutOfRangeClamped: Story = {
  args: { value: 150, min: 0, max: 100 },
};
