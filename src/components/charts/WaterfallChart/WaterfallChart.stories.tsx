import type { Meta, StoryObj } from '@storybook/react-vite';
import { WaterfallChart } from './WaterfallChart';
import type { WaterfallDataPoint } from '../../../core/waterfall';

const meta = {
  title: 'Charts/WaterfallChart',
  component: WaterfallChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    width: 550,
    height: 400,
  },
  argTypes: {
    width: { control: { type: 'range', min: 400, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    aspect: { control: { type: 'range', min: 0.5, max: 3, step: 0.1 } },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof WaterfallChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic waterfall: revenue flow
const basicData: WaterfallDataPoint[] = [
  { label: 'Start', value: 100 },
  { label: 'Revenue', value: 50 },
  { label: 'Costs', value: -20 },
  { label: 'Net Income', value: 130, isTotal: true },
];

export const Basic: Story = {
  args: {
    data: basicData,
    width: 500,
    height: 400,
  },
};

// Multi-step waterfall with subtotals
const multiStepData: WaterfallDataPoint[] = [
  { label: 'Q1 Revenue', value: 100 },
  { label: 'Q2 Revenue', value: 120 },
  { label: 'H1 Total', value: 220, isTotal: true },
  { label: 'Costs', value: -50 },
  { label: 'H1 Net', value: 170, isTotal: true },
];

export const MultiStep: Story = {
  args: {
    data: multiStepData,
    width: 500,
    height: 400,
  },
};

// With negative values
const negativeData: WaterfallDataPoint[] = [
  { label: 'Starting Assets', value: 500 },
  { label: 'Market Loss', value: -100 },
  { label: 'Recovery', value: 50 },
  { label: 'Net Assets', value: 450, isTotal: true },
];

export const WithNegatives: Story = {
  args: {
    data: negativeData,
    width: 500,
    height: 400,
  },
};

// Large dataset performance test
const largeData: WaterfallDataPoint[] = Array.from({ length: 50 }, (_, i) => ({
  label: `Step ${i + 1}`,
  value: Math.random() * 100 - 50,
  isTotal: (i + 1) % 10 === 0,
}));

export const LargeDataset: Story = {
  args: {
    data: largeData,
    width: 800,
    height: 500,
  },
};

// Responsive sizing
export const ResponsiveSizing: Story = {
  args: {
    data: basicData,
    width: 'auto',
    height: 'auto',
    aspect: 2,
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <WaterfallChart {...args} />
    </div>
  ),
};
