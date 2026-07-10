import type { Meta, StoryObj } from '@storybook/react-vite';
import { CandlestickChart } from './CandlestickChart';

// Deterministic pseudo-random daily OHLC series generator (mulberry32) so stories are stable.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateOHLC(days: number, drift: number, seed: number) {
  const rnd = mulberry32(seed);
  const data: { date: string; open: number; high: number; low: number; close: number }[] = [];
  let price = 100;
  const start = new Date('2026-01-02');
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const open = price;
    const change = (rnd() - 0.5) * 4 + drift;
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) + rnd() * 2;
    const low = Math.max(0.5, Math.min(open, close) - rnd() * 2);
    data.push({ date: d.toISOString().slice(0, 10), open, high, low, close });
    price = close;
  }
  return data;
}

const daily = generateOHLC(30, 0, 7);
const uptrend = generateOHLC(30, 0.6, 11);
const downtrend = generateOHLC(30, -0.6, 19);
const sparse = generateOHLC(6, 0.2, 3);
const single = generateOHLC(1, 0, 1);

const meta = {
  title: 'Charts/CandlestickChart',
  component: CandlestickChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data: daily,
    x: 'date',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
    width: 600,
    height: 320,
  },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 200, max: 500, step: 50 } },
    bodyWidthRatio: { control: { type: 'range', min: 0.2, max: 0.95, step: 0.05 } },
    showGrid: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof CandlestickChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showGrid: true },
};

export const Uptrend: Story = {
  args: { data: uptrend, showGrid: true },
};

export const Downtrend: Story = {
  args: { data: downtrend, showGrid: true },
};

export const CustomColors: Story = {
  args: {
    showGrid: true,
    upColor: '#2563eb',
    downColor: '#f97316',
  },
};

export const Sparse: Story = {
  args: { data: sparse, showGrid: true },
};

export const SingleCandle: Story = {
  args: { data: single, showGrid: true },
};
