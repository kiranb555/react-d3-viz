import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleChart } from './BubbleChart';

const data = Array.from({ length: 40 }, () => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  size: Math.round(Math.random() * 100 + 5),
}));

const meta = {
  title: 'Charts/BubbleChart',
  component: BubbleChart,
  tags: ['autodocs'],
  args: { data, x: 'x', y: 'y', size: 'size', height: 320 },
} satisfies Meta<typeof BubbleChart>;

export default meta;
type Story = StoryObj<typeof BubbleChart>;

export const Default: Story = {};

export const LargerBubbles: Story = {
  args: { radiusRange: [6, 40] },
};
