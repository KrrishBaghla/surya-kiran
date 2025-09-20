import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Map, Target, Crosshair, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient, Event, Correlation } from '../lib/api';

const SkyMap: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsResponse, correlationsResponse] = await Promise.all([
        apiClient.getEvents(),
        apiClient.getResults()
      ]);
      
      setEvents(eventsResponse.events);
      setCorrelations(correlationsResponse.correlations);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading sky map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const skyData = events
    .filter(event => event.ra !== undefined && event.dec !== undefined)
    .map(event => ({
      ra: event.ra!,
      dec: event.dec!,
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
  correlations.forEach(corr => {
    correlatedEvents.add(corr.event1_id);
    correlatedEvents.add(corr.event2_id);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading celestial sky map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">Error loading sky map data</p>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
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
              {skyData.length > 0 ? Math.round(skyData.reduce((acc, e) => acc + e.confidence, 0) / skyData.length * 100) : 0}%
            </div>
            <div className="text-sm text-green-400">Avg Confidence</div>
          </motion.div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Sky Map Chart */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Right Ascension vs Declination
          </h2>
          
          {skyData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events with coordinates available</p>
                <p className="text-sm">Run analysis to collect data</p>
              </div>
            </div>
          )}

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
              {skyData.length === 0 && (
                <p className="text-gray-400 text-sm">No events with coordinates available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyMap;