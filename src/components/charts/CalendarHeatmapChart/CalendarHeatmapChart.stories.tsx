import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarHeatmapChart } from './CalendarHeatmapChart';

// Deterministic pseudo-random so stories are stable across runs.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateActivity(startISO: string, days: number, seed: number, density = 0.75): { date: string; value: number }[] {
  const rnd = mulberry32(seed);
  const start = new Date(startISO + 'T00:00:00Z');
  const out: { date: string; value: number }[] = [];
  for (let i = 0; i < days; i++) {
    if (rnd() > density) continue; // realistic gaps — not every day has activity
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const value = Math.round(rnd() * rnd() * 20); // skewed toward smaller counts
    out.push({ date: d.toISOString().slice(0, 10), value });
  }
  return out;
}

const yearData = generateActivity('2025-07-10', 365, 1);
const sixMonthData = generateActivity('2026-01-10', 182, 2);
const sparseData = generateActivity('2025-07-10', 365, 3, 0.12);

const meta = {
  title: 'Charts/CalendarHeatmapChart',
  component: CalendarHeatmapChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data: yearData, width: 640, height: 200 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 900, step: 20 } },
    height: { control: { type: 'range', min: 140, max: 320, step: 10 } },
    weekStart: { control: { type: 'radio' }, options: [0, 1] },
    showMonthLabels: { control: 'boolean' },
    showWeekdayLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof CalendarHeatmapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: yearData },
};

export const SixMonths: Story = {
  args: { data: sixMonthData, width: 400 },
};

export const MondayWeekStart: Story = {
  args: { data: yearData, weekStart: 1 },
};

export const WithoutMonthLabels: Story = {
  args: { data: yearData, showMonthLabels: false },
};

export const CustomColorScale: Story = {
  args: { data: yearData, colorStart: '#e0f2fe', colorEnd: '#0c4a6e' },
};

export const SparseData: Story = {
  args: { data: sparseData },
};
