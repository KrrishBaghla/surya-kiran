import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Search, 
  Filter,
  ArrowRight,
  AlertTriangle,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { mockCorrelations, mockEvents } from '../utils/mockData';

const Correlations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterInterest, setFilterInterest] = useState<string>('all');

  const filteredCorrelations = mockCorrelations.filter(corr => {
    const matchesSearch = corr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         corr.event1_source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         corr.event2_source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || corr.priority === filterPriority;
    const matchesInterest = filterInterest === 'all' || corr.scientific_interest === filterInterest;
    
    return matchesSearch && matchesPriority && matchesInterest;
  });

  const getEvent = (eventId: string) => {
    return mockEvents.find(event => event.id === eventId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getInterestColor = (interest: string) => {
    switch (interest) {
      case 'BREAKTHROUGH': return 'text-purple-400';
      case 'SIGNIFICANT': return 'text-cyan-400';
      case 'ROUTINE': return 'text-green-400';
      case 'BACKGROUND': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'GWOSC': return Network;
      case 'HEASARC': return Zap;
      case 'ZTF': return Target;
      case 'TNS': return Star;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Network className="w-8 h-8 text-purple-400" />
            Multi-Messenger Correlations
          </h1>
          <p className="text-gray-300">
            Advanced correlation analysis between cosmic events from different observatories
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-white">{mockCorrelations.length}</div>
            <div className="text-sm text-purple-400">Total Correlations</div>
          </motion.div>

          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-white">
              {mockCorrelations.filter(c => c.scientific_interest === 'BREAKTHROUGH').length}
            </div>
            <div className="text-sm text-red-400">Breakthroughs</div>
          </motion.div>

          <motion.div
            className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-white">
              {mockCorrelations.filter(c => c.cross_messenger).length}
            </div>
            <div className="text-sm text-cyan-400">Cross-Messenger</div>
          </motion.div>

          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-white">
              {Math.round(mockCorrelations.reduce((acc, c) => acc + c.confidence, 0) / mockCorrelations.length * 100)}%
            </div>
            <div className="text-sm text-green-400">Avg Confidence</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search correlations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={filterInterest}
                onChange={(e) => setFilterInterest(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Interest Levels</option>
                <option value="BREAKTHROUGH">Breakthrough</option>
                <option value="SIGNIFICANT">Significant</option>
                <option value="ROUTINE">Routine</option>
                <option value="BACKGROUND">Background</option>
              </select>
            </div>
          </div>
        </div>

        {/* Correlations List */}
        <div className="space-y-4">
          {filteredCorrelations.map((correlation) => {
            const event1 = getEvent(correlation.event1_id);
            const event2 = getEvent(correlation.event2_id);
            const Icon1 = getSourceIcon(correlation.event1_source);
            const Icon2 = getSourceIcon(correlation.event2_source);
            
            return (
              <motion.div
                key={correlation.id}
                className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{correlation.id}</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(correlation.priority)}`}>
                      {correlation.priority}
                    </span>
                    <span className={`text-sm font-medium ${getInterestColor(correlation.scientific_interest)}`}>
                      {correlation.scientific_interest}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Event 1 */}
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon1 className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-medium text-cyan-400">{correlation.event1_source}</h4>
                    </div>
                    {event1 && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Event ID:</span>
                          <span className="text-white font-mono text-xs">{event1.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{event1.event_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-white">{Math.round(event1.confidence * 100)}%</span>
                        </div>
                        {event1.ra && event1.dec && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Position:</span>
                            <span className="text-white text-xs">
                              {event1.ra.toFixed(1)}°, {event1.dec.toFixed(1)}°
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Correlation Details */}
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-3">
                      <ArrowRight className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {Math.round(correlation.confidence * 100)}%
                        </div>
                        <div className="text-purple-400">Confidence</div>
                      </div>
                      
                      <div className="pt-2 border-t border-purple-500/20 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Δ:</span>
                          <span className="text-white">{correlation.time_separation.toFixed(2)} hrs</span>
                        </div>
                        {correlation.angular_separation && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Angular Δ:</span>
                            <span className="text-white">{correlation.angular_separation.toFixed(1)}°</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cross-Messenger:</span>
                          <span className={correlation.cross_messenger ? 'text-green-400' : 'text-gray-400'}>
                            {correlation.cross_messenger ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon2 className="w-5 h-5 text-orange-400" />
                      <h4 className="font-medium text-orange-400">{correlation.event2_source}</h4>
                    </div>
                    {event2 && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Event ID:</span>
                          <span className="text-white font-mono text-xs">{event2.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{event2.event_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-white">{Math.round(event2.confidence * 100)}%</span>
                        </div>
                        {event2.ra && event2.dec && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Position:</span>
                            <span className="text-white text-xs">
                              {event2.ra.toFixed(1)}°, {event2.dec.toFixed(1)}°
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCorrelations.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No correlations found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Correlations;