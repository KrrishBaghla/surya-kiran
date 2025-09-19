import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Zap, 
  Target, 
  Atom, 
  Star, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import StatusCard from './StatusCard';
import { mockEvents, mockCorrelations, mockDataSources } from '../utils/mockData';
import { CosmicEvent, Correlation, DataSource } from '../types';

const ObservatoryDashboard: React.FC = () => {
  const [events, setEvents] = useState<CosmicEvent[]>(mockEvents);
  const [correlations, setCorrelations] = useState<Correlation[]>(mockCorrelations);
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'gravitational_wave': return Radio;
      case 'gamma_burst': return Zap;
      case 'optical_transient': return Target;
      case 'neutrino': return Atom;
      case 'supernova': return Star;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return CheckCircle;
      case 'ERROR': return XCircle;
      case 'OFFLINE': return Minus;
      default: return Minus;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Total Events"
            value={events.length}
            icon={Radio}
            color="cyan"
            trend="+12%"
            subtitle="Last 24 hours"
          />
          <StatusCard
            title="Correlations"
            value={correlations.length}
            icon={TrendingUp}
            color="purple"
            trend="+8%"
            subtitle="High confidence"
          />
          <StatusCard
            title="Active Sources"
            value={dataSources.filter(s => s.status === 'ACTIVE').length}
            icon={CheckCircle}
            color="green"
            subtitle="All systems operational"
          />
          <StatusCard
            title="Avg Confidence"
            value="87%"
            icon={Target}
            color="orange"
            trend="+3%"
            subtitle="Detection accuracy"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Sources Status */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                Observatory Status
              </h2>
              
              <div className="space-y-4">
                {dataSources.map((source) => {
                  const StatusIcon = getStatusIcon(source.status);
                  const statusColor = source.status === 'ACTIVE' ? 'text-green-400' : 
                                    source.status === 'ERROR' ? 'text-red-400' : 'text-gray-400';
                  
                  return (
                    <motion.div
                      key={source.name}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                        <div>
                          <h3 className="text-white text-sm font-medium">
                            {source.name}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            {source.type}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-cyan-400 text-sm font-medium">
                          {source.events} events
                        </p>
                        <p className="text-gray-400 text-xs">
                          {Math.round(source.confidence * 100)}% conf.
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Events
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event) => {
                  const EventIcon = getEventIcon(event.event_type);
                  const priorityColor = getPriorityColor(event.priority);
                  
                  return (
                    <motion.div
                      key={event.id}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <EventIcon className={`w-5 h-5 ${priorityColor}`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-medium text-sm">
                            {event.id}
                          </h3>
                          <span className={`text-xs font-medium ${priorityColor}`}>
                            {event.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{event.source}</span>
                          <span>{event.event_type.replace('_', ' ')}</span>
                          {event.ra && event.dec && (
                            <span>
                              RA: {event.ra.toFixed(1)}°, Dec: {event.dec.toFixed(1)}°
                            </span>
                          )}
                          <span>Conf: {Math.round(event.confidence * 100)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Correlations */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Multi-Messenger Correlations
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {correlations.map((corr) => (
              <motion.div
                key={corr.id}
                className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-400 font-medium text-sm">
                    {corr.scientific_interest}
                  </span>
                  <span className="text-white text-sm">
                    {Math.round(corr.confidence * 100)}% confidence
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sources:</span>
                    <span className="text-white">
                      {corr.event1_source} ↔ {corr.event2_source}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time Δ:</span>
                    <span className="text-white">
                      {corr.time_separation.toFixed(2)} hrs
                    </span>
                  </div>
                  {corr.angular_separation && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Angular Δ:</span>
                      <span className="text-white">
                        {corr.angular_separation.toFixed(1)}°
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservatoryDashboard;