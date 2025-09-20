import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from './badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface EventData {
  id: string;
  timestamp: string;
  type: string;
  confidence: number;
  coordinates: { ra: string; dec: string };
  significance: string;
}

interface CorrelationAnalysisProps {
  events: EventData[];
}

interface CorrelationResult {
  eventPair: [EventData, EventData];
  timeDiff: number; // hours
  spatialDistance: number; // degrees
  correlationScore: number;
  likelihood: 'high' | 'medium' | 'low';
}

export function CorrelationAnalysis({ events }: CorrelationAnalysisProps) {
  const [timeWindow, setTimeWindow] = useState('24'); // hours
  const [minConfidence, setMinConfidence] = useState('0.7');

  const correlationData = useMemo(() => {
    const correlations: CorrelationResult[] = [];
    const timeWindowHours = parseInt(timeWindow);
    const confidenceThreshold = parseFloat(minConfidence);

    // Filter events by confidence
    const filteredEvents = events.filter(e => e.confidence >= confidenceThreshold);

    // Find correlations between different event types
    for (let i = 0; i < filteredEvents.length; i++) {
      for (let j = i + 1; j < filteredEvents.length; j++) {
        const event1 = filteredEvents[i];
        const event2 = filteredEvents[j];

        // Skip same event types for now (looking for multi-messenger correlations)
        if (event1.type === event2.type) continue;

        const time1 = new Date(event1.timestamp).getTime();
        const time2 = new Date(event2.timestamp).getTime();
        const timeDiff = Math.abs(time1 - time2) / (1000 * 60 * 60); // hours

        // Only consider events within time window
        if (timeDiff > timeWindowHours) continue;

        // Calculate spatial distance (simplified)
        const ra1 = parseFloat(event1.coordinates.ra.split('h')[0]);
        const ra2 = parseFloat(event2.coordinates.ra.split('h')[0]);
        const spatialDistance = Math.abs(ra1 - ra2);

        // Calculate correlation score based on time proximity, spatial proximity, and confidence
        const timeScore = Math.max(0, 1 - (timeDiff / timeWindowHours));
        const spatialScore = Math.max(0, 1 - (spatialDistance / 24)); // 24h RA range
        const confidenceScore = (event1.confidence + event2.confidence) / 2;
        
        const correlationScore = (timeScore * 0.4 + spatialScore * 0.3 + confidenceScore * 0.3);

        let likelihood: 'high' | 'medium' | 'low';
        if (correlationScore > 0.7) likelihood = 'high';
        else if (correlationScore > 0.5) likelihood = 'medium';
        else likelihood = 'low';

        correlations.push({
          eventPair: [event1, event2],
          timeDiff,
          spatialDistance,
          correlationScore,
          likelihood
        });
      }
    }

    // Sort by correlation score
    correlations.sort((a, b) => b.correlationScore - a.correlationScore);

    return correlations.slice(0, 10); // Top 10 correlations
  }, [events, timeWindow, minConfidence]);

  const scatterData = useMemo(() => {
    return correlationData.map((corr) => ({
      x: corr.timeDiff,
      y: corr.spatialDistance,
      z: corr.correlationScore * 100,
      likelihood: corr.likelihood,
      event1: corr.eventPair[0].type,
      event2: corr.eventPair[1].type,
      id1: corr.eventPair[0].id,
      id2: corr.eventPair[1].id,
      fill: corr.likelihood === 'high' ? '#10B981' : 
            corr.likelihood === 'medium' ? '#F59E0B' : '#EF4444'
    }));
  }, [correlationData]);

  const getEventTypeColor = (type: string) => {
    const colors = {
      'Gravitational Wave': '#3B82F6',
      'Supernova': '#8B5CF6',
      'Gamma-Ray Burst': '#10B981',
      'Neutrino': '#EC4899',
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Window</label>
            <Select value={timeWindow} onValueChange={setTimeWindow}>
              <SelectTrigger className="w-32 bg-card/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Confidence</label>
            <Select value={minConfidence} onValueChange={setMinConfidence}>
              <SelectTrigger className="w-32 bg-card/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">50%</SelectItem>
                <SelectItem value="0.7">70%</SelectItem>
                <SelectItem value="0.8">80%</SelectItem>
                <SelectItem value="0.9">90%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Found {correlationData.length} potential correlations
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Correlation Scatter Plot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="event-card p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-accent">
            <TrendingUp className="w-5 h-5" />
            Time vs Spatial Correlation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="x" 
                name="Time Difference (hours)"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                dataKey="y" 
                name="Spatial Distance (degrees)"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.id1} ↔ {data.id2}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.event1} → {data.event2}
                        </p>
                        <p className="text-sm">Time: {data.x.toFixed(1)}h</p>
                        <p className="text-sm">Distance: {data.y.toFixed(1)}°</p>
                        <p className="text-sm">Score: {data.z.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="z" fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Correlations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="event-card p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-accent">
            <Zap className="w-5 h-5" />
            Top Correlations
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {correlationData.slice(0, 5).map((corr, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-border/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        corr.likelihood === 'high' ? 'border-green-500 text-green-400' :
                        corr.likelihood === 'medium' ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }`}
                    >
                      {corr.likelihood} confidence
                    </Badge>
                    <span className="text-sm font-medium">
                      {(corr.correlationScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-accent" />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: getEventTypeColor(corr.eventPair[0].type) + '20',
                      color: getEventTypeColor(corr.eventPair[0].type)
                    }}
                  >
                    {corr.eventPair[0].id}
                  </span>
                  <span className="text-muted-foreground">↔</span>
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: getEventTypeColor(corr.eventPair[1].type) + '20',
                      color: getEventTypeColor(corr.eventPair[1].type)
                    }}
                  >
                    {corr.eventPair[1].id}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {corr.timeDiff.toFixed(1)}h apart
                  </div>
                  <div>
                    {corr.spatialDistance.toFixed(1)}° separation
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="event-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {correlationData.filter(c => c.likelihood === 'high').length}
          </div>
          <div className="text-sm text-muted-foreground">High Confidence</div>
        </div>
        <div className="event-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">
            {correlationData.filter(c => c.likelihood === 'medium').length}
          </div>
          <div className="text-sm text-muted-foreground">Medium Confidence</div>
        </div>
        <div className="event-card p-4 rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {correlationData.length > 0 ? 
              (correlationData.reduce((sum, c) => sum + c.correlationScore, 0) / correlationData.length * 100).toFixed(1) + '%'
              : '0%'
            }
          </div>
          <div className="text-sm text-muted-foreground">Average Score</div>
        </div>
      </motion.div>
    </div>
  );
}
