import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface EventData {
  id: string;
  timestamp: string;
  type: string;
  confidence: number;
  significance: string;
}

interface EventChartProps {
  events: EventData[];
}

const COLORS = {
  'Gravitational Wave': '#3B82F6',
  'Supernova': '#8B5CF6',
  'Gamma-Ray Burst': '#10B981',
  'Neutrino': '#EC4899',
};

export function EventChart({ events }: EventChartProps) {
  const chartData = useMemo(() => {
    // Type distribution for pie chart
    const typeDistribution = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(typeDistribution).map(([type, count]) => ({
      name: type,
      value: count,
      color: COLORS[type as keyof typeof COLORS] || '#6B7280'
    }));

    // Confidence distribution for bar chart
    const confidenceRanges = {
      'High (90%+)': events.filter(e => e.confidence >= 0.9).length,
      'Medium (70-89%)': events.filter(e => e.confidence >= 0.7 && e.confidence < 0.9).length,
      'Low (<70%)': events.filter(e => e.confidence < 0.7).length,
    };

    const barData = Object.entries(confidenceRanges).map(([range, count]) => ({
      range,
      count,
      fill: range.includes('High') ? '#10B981' : range.includes('Medium') ? '#F59E0B' : '#EF4444'
    }));

    // Timeline data for line chart
    const timelineData = events
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .reduce((acc, event, index) => {
        const date = new Date(event.timestamp).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date, count: 1, cumulative: index + 1 });
        }
        return acc;
      }, [] as Array<{ date: string; count: number; cumulative: number }>);

    return { pieData, barData, timelineData };
  }, [events]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Event Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="event-card p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4 text-accent">Event Type Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData.pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confidence Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="event-card p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4 text-accent">Confidence Levels</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData.barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="range" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detection Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="event-card p-6 rounded-lg lg:col-span-2 xl:col-span-1"
      >
        <h3 className="text-lg font-semibold mb-4 text-accent">Detection Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
