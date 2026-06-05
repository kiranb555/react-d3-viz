import {
  ThemeProvider,
  LineChart,
  AreaChart,
  BarChart,
  ScatterPlot,
  BubbleChart,
  PieChart,
  Histogram,
  RadarChart,
  TreemapChart,
  WaterfallChart,
  SankeyDiagram,
  MekkoChart,
} from './index';

const months = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
  { month: 'Apr', sales: 73, profit: 31 },
  { month: 'May', sales: 68, profit: 28 },
  { month: 'Jun', sales: 91, profit: 40 },
  { month: 'Jul', sales: 84, profit: 36 },
];

const scatter = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 100 + 5,
}));

const pie = [
  { label: 'JavaScript', value: 38.7 },
  { label: 'Python', value: 24.5 },
  { label: 'TypeScript', value: 18.3 },
  { label: 'Rust', value: 9.1 },
  { label: 'Go', value: 6.2 },
  { label: 'Other', value: 3.2 },
];

const histValues = Array.from({ length: 500 }, () => {
  // Roughly normal via central limit.
  let s = 0;
  for (let i = 0; i < 6; i++) s += Math.random();
  return (s / 6) * 100;
});

const radar = [
  { axis: 'Speed', team: 80, rival: 60 },
  { axis: 'Power', team: 65, rival: 75 },
  { axis: 'Range', team: 90, rival: 55 },
  { axis: 'Defense', team: 70, rival: 80 },
  { axis: 'Agility', team: 85, rival: 65 },
  { axis: 'Stamina', team: 60, rival: 70 },
];

// Flat records + a `group` accessor → a 2-level (grouped) treemap.
const marketShare = [
  { name: 'Chrome', os: 'Desktop', share: 45 },
  { name: 'Edge', os: 'Desktop', share: 12 },
  { name: 'Firefox', os: 'Desktop', share: 8 },
  { name: 'Safari', os: 'Desktop', share: 10 },
  { name: 'Chrome Mobile', os: 'Mobile', share: 38 },
  { name: 'Safari Mobile', os: 'Mobile', share: 25 },
  { name: 'Samsung', os: 'Mobile', share: 6 },
];

// A nested hierarchy (like the d3 "flare" example) → leaves colored by branch.
const tech = {
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 28 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 12px', fontFamily: 'system-ui, sans-serif' }}>{title}</h2>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 26, margin: '0 0 4px' }}>react-d3-viz</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Cross-platform SVG charts — responsive (<code>width="auto"</code>), hover for tooltips, click legends to toggle series. Try resizing the window.</p>

        <Card title="Line — multi-series">
          <LineChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} height={280} showPoints />
        </Card>

        <Card title="Area — multi-series">
          <AreaChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} height={280} />
        </Card>

        <Card title="Bar — grouped">
          <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} height={280} />
        </Card>

        <Card title="Bar — stacked">
          <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked height={280} />
        </Card>

        <Card title="Scatter">
          <ScatterPlot data={scatter} x="x" y="y" height={280} />
        </Card>

        <Card title="Bubble (size = third dimension)">
          <BubbleChart data={scatter} x="x" y="y" size="size" height={280} />
        </Card>

        <Card title="Pie">
          <PieChart data={pie} value="value" label="label" height={340} />
        </Card>

        <Card title="Donut">
          <PieChart data={pie} value="value" label="label" innerRadius={0.6} height={340} />
        </Card>

        <Card title="Histogram (500 ~normal values)">
          <Histogram values={histValues} bins={20} height={280} />
        </Card>

        <Card title="Radar">
          <RadarChart data={radar} axis="axis" series={[{ dataKey: 'team' }, { dataKey: 'rival' }]} height={360} />
        </Card>

        <Card title="Treemap — grouped (flat data + group)">
          <TreemapChart data={marketShare} value="share" label="name" group="os" showValues height={320} />
        </Card>

        <Card title="Treemap — nested hierarchy (flare style)">
          <TreemapChart data={tech} value="value" label="name" childrenKey="children" showValues height={340} />
        </Card>

        <Card title="Waterfall Chart">
          <WaterfallChart
            data={[
              { label: 'Start', value: 100 },
              { label: 'Revenue', value: 50 },
              { label: 'Costs', value: -20 },
              { label: 'End', value: 130, isTotal: true }
            ]}
            height={280}
          />
        </Card>

        <Card title="Sankey Diagram">
          <SankeyDiagram
            data={{
              nodes: [
                { id: 'a', label: 'Source A' },
                { id: 'b', label: 'Source B' },
                { id: 'x', label: 'Sink X' },
                { id: 'y', label: 'Sink Y' }
              ],
              links: [
                { source: 'a', target: 'x', value: 30 },
                { source: 'a', target: 'y', value: 20 },
                { source: 'b', target: 'x', value: 40 }
              ]
            }}
            height={280}
          />
        </Card>

        <Card title="Mekko Chart">
          <MekkoChart
            data={{
              categories: [
                { label: 'Q1', value: 100 },
                { label: 'Q2', value: 150 },
                { label: 'Q3', value: 120 }
              ],
              series: [
                {
                  id: 'a',
                  label: 'Product A',
                  data: [
                    { categoryId: 'Q1', value: 40 },
                    { categoryId: 'Q2', value: 60 },
                    { categoryId: 'Q3', value: 50 }
                  ]
                },
                {
                  id: 'b',
                  label: 'Product B',
                  data: [
                    { categoryId: 'Q1', value: 60 },
                    { categoryId: 'Q2', value: 90 },
                    { categoryId: 'Q3', value: 70 }
                  ]
                }
              ]
            }}
            height={280}
          />
        </Card>
      </div>
    </ThemeProvider>
  );
}
