import type { Meta, StoryObj } from '@storybook/react-vite';
import { SankeyDiagram } from './SankeyDiagram';
import type { SankeyData } from '../../../core/sankey';

const meta = {
  title: 'Charts/SankeyDiagram',
  component: SankeyDiagram,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    width: 600,
    height: 450,
  },
  argTypes: {
    width: { control: { type: 'range', min: 400, max: 900, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 700, step: 50 } },
    showLabels: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof SankeyDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple flow: 2 sources to 2 sinks
const simpleData: SankeyData = {
  nodes: [
    { id: 'a', label: 'Source A' },
    { id: 'b', label: 'Source B' },
    { id: 'x', label: 'Sink X' },
    { id: 'y', label: 'Sink Y' },
  ],
  links: [
    { source: 'a', target: 'x', value: 30 },
    { source: 'a', target: 'y', value: 20 },
    { source: 'b', target: 'x', value: 40 },
    { source: 'b', target: 'y', value: 60 },
  ],
};

export const Simple: Story = {
  args: {
    data: simpleData,
    width: 500,
    height: 400,
  },
};

// Complex network: multiple layers with many connections
const complexData: SankeyData = {
  nodes: [
    { id: 'sales', label: 'Sales' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'support', label: 'Support' },
    { id: 'product-a', label: 'Product A' },
    { id: 'product-b', label: 'Product B' },
    { id: 'product-c', label: 'Product C' },
    { id: 'retained', label: 'Retained Revenue' },
    { id: 'churn', label: 'Churn' },
  ],
  links: [
    { source: 'sales', target: 'product-a', value: 50 },
    { source: 'sales', target: 'product-b', value: 40 },
    { source: 'marketing', target: 'product-a', value: 30 },
    { source: 'marketing', target: 'product-c', value: 50 },
    { source: 'support', target: 'product-b', value: 20 },
    { source: 'support', target: 'product-c', value: 30 },
    { source: 'product-a', target: 'retained', value: 70 },
    { source: 'product-a', target: 'churn', value: 10 },
    { source: 'product-b', target: 'retained', value: 55 },
    { source: 'product-b', target: 'churn', value: 5 },
    { source: 'product-c', target: 'retained', value: 75 },
    { source: 'product-c', target: 'churn', value: 5 },
  ],
};

export const Complex: Story = {
  args: {
    data: complexData,
    width: 700,
    height: 500,
  },
};

// Unbalanced flow: varying throughput across the diagram
const unbalancedData: SankeyData = {
  nodes: [
    { id: 'input', label: 'Input' },
    { id: 'process1', label: 'Process 1' },
    { id: 'process2', label: 'Process 2' },
    { id: 'output1', label: 'Output 1' },
    { id: 'output2', label: 'Output 2' },
    { id: 'loss', label: 'Loss' },
  ],
  links: [
    { source: 'input', target: 'process1', value: 100 },
    { source: 'process1', target: 'process2', value: 80 },
    { source: 'process2', target: 'output1', value: 50 },
    { source: 'process2', target: 'output2', value: 20 },
    { source: 'process2', target: 'loss', value: 10 },
  ],
};

export const UnbalancedFlow: Story = {
  args: {
    data: unbalancedData,
    width: 500,
    height: 400,
  },
};

// Large dataset: many nodes and links for performance testing
const largeData: SankeyData = {
  nodes: Array.from({ length: 50 }, (_, i) => ({
    id: `node-${i}`,
    label: `Node ${i}`,
  })),
  links: Array.from({ length: 100 }, (_, i) => ({
    source: `node-${Math.floor(i / 2)}`,
    target: `node-${25 + Math.floor(i / 2)}`,
    value: Math.random() * 100,
  })),
};

export const LargeDataset: Story = {
  args: {
    data: largeData,
    width: 800,
    height: 600,
  },
};

// Custom colors: per-node color override
export const CustomColors: Story = {
  args: {
    data: simpleData,
    width: 500,
    height: 400,
    nodeColors: {
      a: '#ff6b6b',
      b: '#4ecdc4',
      x: '#45b7d1',
      y: '#96ceb4',
    },
  },
};

// Responsive sizing
export const ResponsiveSizing: Story = {
  args: {
    data: simpleData,
    width: 'auto',
    height: 'auto',
    aspect: 1.5,
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <SankeyDiagram {...args} />
    </div>
  ),
};
