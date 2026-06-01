import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
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
} from 'react-d3-viz';

const W = Math.min(Dimensions.get('window').width - 48, 380);

const months = [
  { month: 'Jan', sales: 42, profit: 18 },
  { month: 'Feb', sales: 55, profit: 22 },
  { month: 'Mar', sales: 49, profit: 20 },
  { month: 'Apr', sales: 73, profit: 31 },
  { month: 'May', sales: 68, profit: 28 },
  { month: 'Jun', sales: 91, profit: 40 },
];

const pts = Array.from({ length: 40 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 100 + 5,
}));

const pie = [
  { label: 'JS', value: 38.7 },
  { label: 'Python', value: 24.5 },
  { label: 'TS', value: 18.3 },
  { label: 'Rust', value: 9.1 },
  { label: 'Go', value: 6.2 },
];

const histValues = Array.from({ length: 300 }, () => {
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
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.h1}>react-d3-viz</Text>
        <Text style={styles.sub}>Same charts, running on React Native via react-native-svg.</Text>

        <Card title="Line — multi-series">
          <LineChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={W} height={240} showPoints />
        </Card>
        <Card title="Area">
          <AreaChart data={months} x="month" y="sales" width={W} height={240} />
        </Card>
        <Card title="Bar — grouped">
          <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} width={W} height={240} />
        </Card>
        <Card title="Bar — stacked">
          <BarChart data={months} x="month" series={[{ dataKey: 'sales' }, { dataKey: 'profit' }]} stacked width={W} height={240} />
        </Card>
        <Card title="Scatter">
          <ScatterPlot data={pts} x="x" y="y" width={W} height={240} />
        </Card>
        <Card title="Bubble">
          <BubbleChart data={pts} x="x" y="y" size="size" width={W} height={240} />
        </Card>
        <Card title="Pie">
          <PieChart data={pie} value="value" label="label" width={W} height={300} />
        </Card>
        <Card title="Donut">
          <PieChart data={pie} value="value" label="label" innerRadius={0.6} width={W} height={300} />
        </Card>
        <Card title="Histogram">
          <Histogram values={histValues} bins={16} width={W} height={240} />
        </Card>
        <Card title="Radar">
          <RadarChart data={radar} axis="axis" series={[{ dataKey: 'team' }, { dataKey: 'rival' }]} width={W} height={320} />
        </Card>

        <StatusBar style="auto" />
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingTop: 64, alignItems: 'center' },
  h1: { fontSize: 24, fontWeight: '700', alignSelf: 'flex-start' },
  sub: { color: '#6b7280', marginBottom: 16, alignSelf: 'flex-start' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151', alignSelf: 'flex-start', marginBottom: 8 },
});
