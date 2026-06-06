import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChart } from './RadarChart';

const data = [
  { axis: 'Speed', team: 80, rival: 60, competitor: 70 },
  { axis: 'Power', team: 65, rival: 75, competitor: 72 },
  { axis: 'Range', team: 90, rival: 55, competitor: 85 },
  { axis: 'Defense', team: 70, rival: 80, competitor: 68 },
  { axis: 'Agility', team: 85, rival: 65, competitor: 78 },
  { axis: 'Stamina', team: 60, rival: 70, competitor: 65 },
];

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { data, axis: 'axis', width: 400, height: 400 },
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    levels: { control: { type: 'range', min: 2, max: 10, step: 1 } },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  args: { series: [{ dataKey: 'team' }], showGrid: true, showLegend: false },
};

export const TwoSeries: Story = {
  args: {
    series: [{ dataKey: 'team' }, { dataKey: 'rival' }],
    showGrid: true,
    showLegend: true,
  },
};

export const ThreeSeriesComparison: Story = {
  args: {
    series: [
      { dataKey: 'team' },
      { dataKey: 'rival' },
      { dataKey: 'competitor' },
    ],
    showGrid: true,
    showLegend: true,
  },
};

export const WithPoints: Story = {
  args: {
    series: [{ dataKey: 'team' }, { dataKey: 'rival' }],
    showPoints: true,
    showGrid: true,
    showLegend: true,
  },
};

export const WithLevels: Story = {
  args: {
    series: [{ dataKey: 'team' }, { dataKey: 'rival' }],
    levels: 6,
    showLegend: true,
  },
};
