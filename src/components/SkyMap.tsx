import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { mockEvents, mockCorrelations } from '../utils/mockData';
import { Map, Target, Crosshair } from 'lucide-react';

const SkyMap: React.FC = () => {
  const skyData = mockEvents
    .filter(event => event.ra !== undefined && event.dec !== undefined)
    .map(event => ({
      ra: event.ra,
      dec: event.dec,
      id: event.id,
      source: event.source,
      type: event.event_type,
      priority: event.priority,
      confidence: event.confidence
    }));

  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#10b981';
      default: return '#06b6d4';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-3 text-sm">
          <h3 className="text-white font-medium mb-2">{data.id}</h3>
          <div className="space-y-1 text-gray-300">
            <p>Source: {data.source}</p>
            <p>Type: {data.type.replace('_', ' ')}</p>
            <p>Priority: {data.priority}</p>
            <p>RA: {data.ra.toFixed(2)}°</p>
            <p>Dec: {data.dec.toFixed(2)}°</p>
            <p>Confidence: {Math.round(data.confidence * 100)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const correlatedEvents = new Set();
  mockCorrelations.forEach(corr => {
    correlatedEvents.add(corr.event1_id);
    correlatedEvents.add(corr.event2_id);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Map className="w-8 h-8 text-cyan-400" />
            Celestial Sky Map
          </h1>
          <p className="text-gray-300">
            Real-time visualization of cosmic events in celestial coordinates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{skyData.length}</div>
            <div className="text-sm text-cyan-400">Mapped Events</div>
          </motion.div>

          <motion.div
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Crosshair className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{correlatedEvents.size}</div>
            <div className="text-sm text-purple-400">Correlated</div>
          </motion.div>

          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold text-white">
              {skyData.filter(e => e.priority === 'CRITICAL').length}
            </div>
            <div className="text-sm text-red-400">Critical Events</div>
          </motion.div>

          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xl font-bold text-white">
              {Math.round(skyData.reduce((acc, e) => acc + e.confidence, 0) / skyData.length * 100)}%
            </div>
            <div className="text-sm text-green-400">Avg Confidence</div>
          </motion.div>
        </div>

        {/* Sky Map Chart */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Right Ascension vs Declination
          </h2>
          
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                domain={[0, 360]}
                dataKey="ra"
                stroke="#9ca3af"
                label={{ value: 'Right Ascension (degrees)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                domain={[-90, 90]}
                dataKey="dec"
                stroke="#9ca3af"
                label={{ value: 'Declination (degrees)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Scatter 
                data={skyData} 
                fill="#06b6d4"
              >
                {skyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getEventColor(entry.priority)}
                    stroke={correlatedEvents.has(entry.id) ? '#a855f7' : 'none'}
                    strokeWidth={correlatedEvents.has(entry.id) ? 2 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Critical Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-purple-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Correlated Events</span>
            </div>
          </div>
        </div>

        {/* Constellation Grid Overlay Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Coordinate System</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <span className="text-cyan-400 font-medium">Right Ascension (RA):</span> 
                Celestial longitude measured eastward from the vernal equinox (0° to 360°)
              </p>
              <p>
                <span className="text-purple-400 font-medium">Declination (Dec):</span> 
                Celestial latitude measured north/south from the celestial equator (-90° to +90°)
              </p>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Event Distribution</h3>
            <div className="space-y-2">
              {Object.entries(
                skyData.reduce((acc, event) => {
                  acc[event.source] = (acc[event.source] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{source}</span>
                  <span className="text-cyan-400 font-medium">{count} events</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyMap;