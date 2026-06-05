import type { Meta, StoryObj } from '@storybook/react-vite';
import { MekkoChart } from './MekkoChart';
import type { MekkoData } from '../../../core/mekko';

const meta = {
  title: 'Charts/MekkoChart',
  component: MekkoChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MekkoChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Mekko
const basicData: MekkoData = {
  categories: [
    { label: 'Q1', value: 100 },
    { label: 'Q2', value: 150 },
    { label: 'Q3', value: 120 },
  ],
  series: [
    {
      id: 'product-a',
      label: 'Product A',
      data: [
        { categoryId: 'Q1', value: 40 },
        { categoryId: 'Q2', value: 60 },
        { categoryId: 'Q3', value: 50 },
      ],
    },
    {
      id: 'product-b',
      label: 'Product B',
      data: [
        { categoryId: 'Q1', value: 60 },
        { categoryId: 'Q2', value: 90 },
        { categoryId: 'Q3', value: 70 },
      ],
    },
  ],
};

export const Basic: Story = {
  args: {
    data: basicData,
    width: 500,
    height: 400,
  },
};

// Many categories
const manyCategories: MekkoData = {
  categories: Array.from({ length: 20 }, (_, i) => ({
    label: `Cat ${i + 1}`,
    value: Math.random() * 200 + 50,
  })),
  series: [
    {
      id: 'a',
      label: 'Series A',
      data: Array.from({ length: 20 }, (_, i) => ({
        categoryId: `Cat ${i + 1}`,
        value: Math.random() * 100,
      })),
    },
    {
      id: 'b',
      label: 'Series B',
      data: Array.from({ length: 20 }, (_, i) => ({
        categoryId: `Cat ${i + 1}`,
        value: Math.random() * 100,
      })),
    },
  ],
};

export const ManyCategories: Story = {
  args: {
    data: manyCategories,
    width: 800,
    height: 400,
  },
};

// Extreme ratios
const extremeRatios: MekkoData = {
  categories: [
    { label: 'Large', value: 1000 },
    { label: 'Medium', value: 100 },
    { label: 'Small', value: 10 },
  ],
  series: [
    {
      id: 'x',
      label: 'X',
      data: [
        { categoryId: 'Large', value: 600 },
        { categoryId: 'Medium', value: 60 },
        { categoryId: 'Small', value: 6 },
      ],
    },
    {
      id: 'y',
      label: 'Y',
      data: [
        { categoryId: 'Large', value: 400 },
        { categoryId: 'Medium', value: 40 },
        { categoryId: 'Small', value: 4 },
      ],
    },
  ],
};

export const ExtremeRatios: Story = {
  args: {
    data: extremeRatios,
    width: 500,
    height: 400,
  },
};

// Large dataset
const largeDataset: MekkoData = {
  categories: Array.from({ length: 50 }, (_, i) => ({
    label: `Category ${i + 1}`,
    value: Math.random() * 150 + 50,
  })),
  series: Array.from({ length: 5 }, (_, si) => ({
    id: `series-${si}`,
    label: `Series ${si + 1}`,
    data: Array.from({ length: 50 }, (_, ci) => ({
      categoryId: `Category ${ci + 1}`,
      value: Math.random() * 80,
    })),
  })),
};

export const LargeDataset: Story = {
  args: {
    data: largeDataset,
    width: 900,
    height: 500,
  },
};

// Responsive
export const Responsive: Story = {
  args: {
    data: basicData,
    width: 'auto',
    height: 'auto',
    aspect: 2,
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <MekkoChart {...args} />
    </div>
  ),
};
