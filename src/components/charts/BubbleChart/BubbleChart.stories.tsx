import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleChart } from './BubbleChart';

const data = Array.from({ length: 40 }, () => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  size: Math.round(Math.random() * 100 + 5),
  category: Math.random() > 0.5 ? 'Premium' : 'Standard',
}));

const meta = {
  title: 'Charts/BubbleChart',
  component: BubbleChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data, x: 'x', y: 'y', size: 'size', width: 500, height: 400 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 700, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    radiusRange: { control: 'object' },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof BubbleChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showGrid: true, showLegend: false },
};

export const LargerBubbles: Story = {
  args: { radiusRange: [8, 50], showGrid: true },
};

export const SmallBubbles: Story = {
  args: { radiusRange: [3, 15], showGrid: true },
};

export const ThemedColors: Story = {
  args: {
    radiusRange: [6, 35],
    showGrid: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4'],
    },
  },
};

export const WithGridAndLegend: Story = {
  args: {
    radiusRange: [6, 35],
    showGrid: true,
    showLegend: true,
  },
};
