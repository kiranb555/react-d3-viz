import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScatterPlot } from './ScatterPlot';

const data = Array.from({ length: 60 }, () => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
}));

const meta = {
  title: 'Charts/ScatterPlot',
  component: ScatterPlot,
  tags: ['autodocs'],
  args: { data, x: 'x', y: 'y', height: 320 },
} satisfies Meta<typeof ScatterPlot>;

export default meta;
type Story = StoryObj<typeof ScatterPlot>;

export const Default: Story = {};

export const LargerPoints: Story = {
  args: { pointRadius: 7 },
};
