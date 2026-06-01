import type { Meta, StoryObj } from '@storybook/react-vite';
import { Histogram } from './Histogram';

// ~normal distribution via central limit
const values = Array.from({ length: 500 }, () => {
  let s = 0;
  for (let i = 0; i < 6; i++) s += Math.random();
  return (s / 6) * 100;
});

const meta = {
  title: 'Charts/Histogram',
  component: Histogram,
  tags: ['autodocs'],
  args: { values, bins: 20, height: 280 },
} satisfies Meta<typeof Histogram>;

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {};

export const FewerBins: Story = {
  args: { bins: 8 },
};
