import React from 'react';
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
} from '../src/index';

// Deterministic pseudo-random so screenshots are stable across runs.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);

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
  x: rnd() * 100,
  y: rnd() * 100,
  size: rnd() * 100 + 5,
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
  let s = 0;
  for (let i = 0; i < 6; i++) s += rnd();
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

const W = 440;
const H = 280;

function Shot({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className="shot"
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 18,
        boxSizing: 'content-box',
        width: W,
        border: '1px solid #eef0f3',
      }}
    >
      {children}
    </div>
  );
}

function Hero() {
  return (
    <div
      id="shot-hero"
      style={{
        width: 1024,
        padding: '40px 44px',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
        display: 'flex',
        gap: 20,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: '0 0 300px', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>react-d3-viz</div>
        <div style={{ fontSize: 15, color: '#cbd5e1', marginTop: 10, lineHeight: 1.5 }}>
          Cross-platform SVG charts for React&nbsp;&amp;&nbsp;React&nbsp;Native — one API, one codebase.
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 12 }}>
          <LineChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={300} height={150} showPoints showLegend={false} animate={false} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 12 }}>
          <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked width={300} height={150} showLegend={false} animate={false} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 12 }}>
          <AreaChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={300} height={150} showLegend={false} animate={false} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'center' }}>
          <PieChart data={pie} value="value" label="label" innerRadius={0.6} width={300} height={150} showLegend={false} animate={false} />
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <ThemeProvider>
      <div style={{ padding: 24, display: 'inline-block' }}>
        <div style={{ marginBottom: 24 }}>
          <Hero />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${W + 38}px)`, gap: 20 }}>
          <Shot id="shot-line">
            <LineChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={W} height={H} showPoints animate={false} />
          </Shot>
          <Shot id="shot-area">
            <AreaChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-bar">
            <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-bar-stacked">
            <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-scatter">
            <ScatterPlot data={scatter} x="x" y="y" width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-bubble">
            <BubbleChart data={scatter} x="x" y="y" size="size" width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-pie">
            <PieChart data={pie} value="value" label="label" width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-donut">
            <PieChart data={pie} value="value" label="label" innerRadius={0.6} width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-histogram">
            <Histogram values={histValues} bins={20} width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-radar">
            <RadarChart data={radar} axis="axis" series={[{ dataKey: 'team' }, { dataKey: 'rival' }]} width={W} height={H} animate={false} />
          </Shot>
          <Shot id="shot-treemap">
            <TreemapChart data={tech} value="value" label="name" showValues width={W} height={H} animate={false} />
          </Shot>
        </div>
      </div>
    </ThemeProvider>
  );
}
