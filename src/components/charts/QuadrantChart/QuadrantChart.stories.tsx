import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuadrantChart } from './QuadrantChart';

// Generate sample data with more variation
const generateData = (count = 40) =>
  Array.from({ length: count }, () => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    size: Math.round(Math.random() * 80 + 10),
  }));

const data = generateData(40);

const meta = {
  title: 'Charts/QuadrantChart',
  component: QuadrantChart,
  tags: ['autodocs'],
  args: { data, x: 'x', y: 'y', height: 320 },
} satisfies Meta<typeof QuadrantChart>;

export default meta;
type Story = StoryObj<typeof QuadrantChart>;

export const Default: Story = {
  args: { thresholdMode: 'mean' },
};

export const MedianThresholds: Story = {
  args: { thresholdMode: 'median' },
};

export const CustomThresholds: Story = {
  args: { thresholdMode: 'custom', thresholdX: 40, thresholdY: 60 },
};

export const WithBubbleSize: Story = {
  args: {
    thresholdMode: 'mean',
    size: 'size',
    radiusRange: [6, 35],
  },
};

export const WithCustomLabels: Story = {
  args: {
    thresholdMode: 'mean',
    quadrantLabels: [
      'High Value\nLow Risk',
      'High Value\nHigh Risk',
      'Low Value\nLow Risk',
      'Low Value\nHigh Risk',
    ],
  },
};

export const CustomStyling: Story = {
  args: {
    thresholdMode: 'mean',
    quadrantStyles: [
      {
        backgroundColor: '#dbeafe',
        backgroundOpacity: 0.15,
        dividerStroke: '#3b82f6',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#fecaca',
        backgroundOpacity: 0.15,
        dividerStroke: '#ef4444',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#d1fae5',
        backgroundOpacity: 0.15,
        dividerStroke: '#10b981',
        dividerStrokeWidth: 2,
      },
      {
        backgroundColor: '#fef3c7',
        backgroundOpacity: 0.15,
        dividerStroke: '#f59e0b',
        dividerStrokeWidth: 2,
      },
    ],
  },
};

export const MultipleSeries: Story = {
  args: {
    thresholdMode: 'mean',
    series: [
      { dataKey: 'y', name: 'Series A', color: '#3b82f6' },
      { dataKey: 'y2', name: 'Series B', color: '#ef4444' },
    ],
    data: generateData(40).map((d) => ({
      ...d,
      y2: Math.round(Math.random() * 100),
    })),
  },
};

export const NoAnimation: Story = {
  args: { thresholdMode: 'mean', animate: false },
};

export const NoLabels: Story = {
  args: {
    thresholdMode: 'mean',
    showQuadrantLabels: false,
  },
};
