import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButterflyChart } from './ButterflyChart';

const data = [
  { age: '0–14', male: 12.5, female: 11.8 },
  { age: '15–24', male: 9.0, female: 8.6 },
  { age: '25–34', male: 10.3, female: 10.0 },
  { age: '35–44', male: 9.8, female: 9.9 },
  { age: '45–54', male: 8.7, female: 9.0 },
  { age: '55–64', male: 7.2, female: 7.8 },
  { age: '65+', male: 5.1, female: 6.9 },
];

const asymmetricData = [
  { age: '0–14', male: 25, female: 12 },
  { age: '15–24', male: 18, female: 8 },
  { age: '25–34', male: 10, female: 20 },
  { age: '35–44', male: 9, female: 15 },
  { age: '45–54', male: 8, female: 12 },
];

const meta = {
  title: 'Charts/ButterflyChart',
  component: ButterflyChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    data,
    category: 'age',
    left: 'male',
    right: 'female',
    leftLabel: 'Male',
    rightLabel: 'Female',
    width: 600,
    height: 350,
  },
  argTypes: {
    width: { control: { type: 'range', min: 400, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 250, max: 500, step: 50 } },
    syncScale: { control: 'boolean' },
    showValues: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof ButterflyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValues: Story = {
  args: {
    showValues: true,
  },
};

export const FormattedValues: Story = {
  args: {
    showValues: true,
    valueFormat: (v) => `${v}%`,
  },
};

export const SyncScaleOff: Story = {
  args: {
    data: asymmetricData,
    syncScale: false,
  },
};

export const CustomCategoryWidth: Story = {
  args: {
    categoryWidth: 160,
  },
};

export const NarrowPadding: Story = {
  args: {
    barPadding: 0.1,
  },
};

export const CustomColors: Story = {
  args: {
    colors: ['#e63946', '#457b9d'],
  },
};

export const Themed: Story = {
  args: {
    theme: {
      animation: { enabled: false },
      grid: { dashArray: '4 2' },
    },
  },
};

export const NoLegend: Story = {
  args: {
    showLegend: false,
  },
};

export const NoGrid: Story = {
  args: {
    showGrid: false,
  },
};
