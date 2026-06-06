import type { Meta, StoryObj } from '@storybook/react-vite';
import { Histogram } from './Histogram';

// ~normal distribution via central limit
const values = Array.from({ length: 500 }, () => {
  let s = 0;
  for (let i = 0; i < 6; i++) s += Math.random();
  return (s / 6) * 100;
});

const uniformValues = Array.from({ length: 500 }, () => Math.random() * 100);

const meta = {
  title: 'Charts/Histogram',
  component: Histogram,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { values, bins: 20, width: 600, height: 300 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 200, max: 500, step: 50 } },
    bins: { control: { type: 'range', min: 5, max: 50, step: 1 } },
    showGrid: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof Histogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showGrid: true, showLegend: false },
};

export const FewerBins: Story = {
  args: { bins: 8, showGrid: true },
};

export const MoreBins: Story = {
  args: { bins: 40, showGrid: true },
};

export const UniformDistribution: Story = {
  args: { values: uniformValues, bins: 20, showGrid: true },
};

export const LargeHist: Story = {
  args: { bins: 50, showGrid: true },
};
