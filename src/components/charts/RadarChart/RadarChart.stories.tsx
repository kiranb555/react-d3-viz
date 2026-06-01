import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadarChart } from './RadarChart';

const data = [
  { axis: 'Speed', team: 80, rival: 60 },
  { axis: 'Power', team: 65, rival: 75 },
  { axis: 'Range', team: 90, rival: 55 },
  { axis: 'Defense', team: 70, rival: 80 },
  { axis: 'Agility', team: 85, rival: 65 },
  { axis: 'Stamina', team: 60, rival: 70 },
];

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  args: { data, axis: 'axis', width: 360, height: 360 },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const SingleSeries: Story = {
  args: { series: [{ dataKey: 'team' }] },
};

export const TwoSeries: Story = {
  args: { series: [{ dataKey: 'team' }, { dataKey: 'rival' }] },
};
