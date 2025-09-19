import React from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';
import { generateTimeSeriesData, mockEvents, mockCorrelations } from '../utils/mockData';

const Analytics: React.FC = () => {
  const timeSeriesData = generateTimeSeriesData();

  const eventTypeData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: type.replace('_', ' '),
    value: count,
    color: type === 'gravitational_wave' ? '#06b6d4' :
           type === 'gamma_burst' ? '#f59e0b' :
           type === 'optical_transient' ? '#10b981' :
           type === 'neutrino' ? '#8b5cf6' :
           '#ef4444'
  }));

  const sourceData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.source] = (acc[event.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([source, count]) => ({ name: source, events: count }));

  const priorityData = Object.entries(
    mockEvents.reduce((acc, event) => {
      acc[event.priority] = (acc[event.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([priority, count]) => ({ 
    name: priority, 
    count,
    fill: priority === 'CRITICAL' ? '#ef4444' :
          priority === 'HIGH' ? '#f59e0b' :
          priority === 'MEDIUM' ? '#eab308' :
          '#10b981'
  }));

  const confidenceData = mockEvents.map((event, index) => ({
    name: `Event ${index + 1}`,
    confidence: Math.round(event.confidence * 100),
    type: event.event_type
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-3 text-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-300">
            Statistical analysis and trends of cosmic event detection and correlation
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{mockEvents.length}</div>
                <div className="text-cyan-400 text-sm">Total Events</div>
              </div>
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+15% this week</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{mockCorrelations.length}</div>
                <div className="text-purple-400 text-sm">Correlations</div>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+8% correlation rate</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">87%</div>
                <div className="text-orange-400 text-sm">Avg Confidence</div>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+3% accuracy</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-green-400 text-sm">Active Sources</div>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">100% uptime</span>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Series */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Event Detection Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#06b6d4"
                  fill="url(#colorEvents)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event Types */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Event Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Source Activity */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Observatory Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="events" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Priority Levels</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Analysis */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Detection Confidence Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Timeline */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Correlation Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="correlations"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;