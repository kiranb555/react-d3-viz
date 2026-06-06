import type { Meta, StoryObj } from '@storybook/react-vite';
import { TreemapChart } from './TreemapChart';

// Flat data — one rectangle per record.
const flat = [
  { name: 'JavaScript', value: 38.7 },
  { name: 'Python', value: 24.5 },
  { name: 'TypeScript', value: 18.3 },
  { name: 'Rust', value: 9.1 },
  { name: 'Go', value: 6.2 },
  { name: 'Other', value: 3.2 },
];

// Flat data + a `group` accessor — a 2-level grouped treemap with header bands.
const grouped = [
  { name: 'Chrome', os: 'Desktop', share: 45 },
  { name: 'Edge', os: 'Desktop', share: 12 },
  { name: 'Firefox', os: 'Desktop', share: 8 },
  { name: 'Safari', os: 'Desktop', share: 10 },
  { name: 'Chrome Mobile', os: 'Mobile', share: 38 },
  { name: 'Safari Mobile', os: 'Mobile', share: 25 },
  { name: 'Samsung', os: 'Mobile', share: 6 },
];

// A nested hierarchy (flare style) — leaves colored by their top-level branch.
const nested = {
  name: 'tech',
  children: [
    {
      name: 'Frontend',
      children: [
        { name: 'React', value: 40 },
        { name: 'Vue', value: 18 },
        { name: 'Svelte', value: 9 },
        { name: 'Angular', value: 14 },
      ],
    },
    {
      name: 'Backend',
      children: [
        { name: 'Node', value: 30 },
        { name: 'Go', value: 16 },
        { name: 'Rust', value: 11 },
        { name: 'Python', value: 26 },
      ],
    },
    {
      name: 'Data',
      children: [
        { name: 'Postgres', value: 22 },
        { name: 'Redis', value: 10 },
        { name: 'Kafka', value: 8 },
      ],
    },
  ],
};

const meta = {
  title: 'Charts/TreemapChart',
  component: TreemapChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { width: 600, height: 400, value: 'value', label: 'name' },
  argTypes: {
    width: { control: { type: 'range', min: 400, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 600, step: 50 } },
    showLabels: { control: 'boolean' },
    showValues: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
} satisfies Meta<typeof TreemapChart>;

export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Flat: Story = {
  args: { data: flat, showValues: true },
};

export const Grouped: Story = {
  args: { data: grouped, value: 'share', label: 'name', group: 'os', showValues: true },
};

export const Nested: Story = {
  args: { data: nested, childrenKey: 'children', showValues: true },
};

export const NoLabels: Story = {
  args: { data: nested, childrenKey: 'children', showLabels: false },
};
