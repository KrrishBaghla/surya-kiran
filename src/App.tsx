import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Play, Pause, Settings, Globe, Target, Activity, Satellite, Telescope, Clock, ChevronDown, ChevronUp } from 'lucide-react';

// Correlation result type to avoid never[] inference on empty initial state
interface CorrelationResult {
  id: number;
  event1_id: string;
  event2_id: string;
  confidence: number;
  ra: number;
  dec: number;
  time_separation: number;
  angular_separation: number;
  event_types: string[];
  timestamp: string;
}

const CosmicObservatoryDashboard = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedEventTypes, setSelectedEventTypes] = useState(['gravitational_wave', 'gamma_burst', 'optical_transient', 'neutrino', 'radio_burst']);
  const [raRange, setRaRange] = useState([0, 360]);
  const [decRange, setDecRange] = useState([-90, 90]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.1);
  const [maxAngularSeparation, setMaxAngularSeparation] = useState(5.0);
  const [correlationResults, setCorrelationResults] = useState<CorrelationResult[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedSources, setExpandedSources] = useState(false);

  // Live time update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live data updates
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        // Simulate new correlation finding
        const newCorrelation = {
          id: Date.now(),
          event1_id: `EVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          event2_id: `EVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          confidence: Math.random() * 0.9 + 0.1,
          ra: Math.random() * 360,
          dec: (Math.random() - 0.5) * 180,
          time_separation: Math.random() * 24,
          angular_separation: Math.random() * 10,
          event_types: [
            selectedEventTypes[Math.floor(Math.random() * selectedEventTypes.length)],
            selectedEventTypes[Math.floor(Math.random() * selectedEventTypes.length)]
          ],
          timestamp: new Date().toISOString()
        };

        setCorrelationResults(prev => [...prev.slice(-19), newCorrelation]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLiveMode, selectedEventTypes]);

  const eventTypeOptions = [
    { id: 'gravitational_wave', label: 'Gravitational Waves', color: '#3b82f6', icon: '🌊' },
    { id: 'gamma_burst', label: 'Gamma-Ray Bursts', color: '#ef4444', icon: '💥' },
    { id: 'optical_transient', label: 'Optical Transients', color: '#10b981', icon: '✨' },
    { id: 'neutrino', label: 'Neutrino Events', color: '#8b5cf6', icon: '🔬' },
    { id: 'radio_burst', label: 'Radio Bursts', color: '#f59e0b', icon: '📡' }
  ];

  const dataSources = [
    {
      name: 'LIGO/Virgo/KAGRA',
      type: 'Gravitational Wave',
      status: 'ACTIVE',
      events: 12,
      lastUpdate: '2m ago',
      description: 'Advanced gravitational wave detectors monitoring spacetime ripples',
      color: '#3b82f6'
    },
    {
      name: 'Fermi-GBM',
      type: 'Gamma-Ray',
      status: 'ACTIVE',
      events: 45,
      lastUpdate: '30s ago',
      description: 'Gamma-Ray Burst Monitor detecting high-energy transients',
      color: '#ef4444'
    },
    {
      name: 'ZTF Survey',
      type: 'Optical',
      status: 'ACTIVE',
      events: 234,
      lastUpdate: '15s ago',
      description: 'Zwicky Transient Facility wide-field optical sky survey',
      color: '#10b981'
    },
    {
      name: 'IceCube',
      type: 'Neutrino',
      status: 'ACTIVE',
      events: 8,
      lastUpdate: '5m ago',
      description: 'Antarctic neutrino detector array monitoring cosmic rays',
      color: '#8b5cf6'
    },
    {
      name: 'CHIME/FRB',
      type: 'Radio',
      status: 'ACTIVE',
      events: 67,
      lastUpdate: '1m ago',
      description: 'Canadian Hydrogen Intensity Mapping fast radio burst detector',
      color: '#f59e0b'
    },
    {
      name: 'Swift-BAT',
      type: 'X-Ray',
      status: 'ACTIVE',
      events: 19,
      lastUpdate: '3m ago',
      description: 'Burst Alert Telescope for X-ray and gamma-ray monitoring',
      color: '#ec4899'
    }
  ];

  const runCorrelationAnalysis = () => {
    // Simulate correlation analysis
    const analysisResults = [];
    for (let i = 0; i < 10; i++) {
      const result = {
        id: Date.now() + i,
        event1_id: `EVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        event2_id: `EVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        confidence: Math.random() * (1 - confidenceThreshold) + confidenceThreshold,
        ra: raRange[0] + Math.random() * (raRange[1] - raRange[0]),
        dec: decRange[0] + Math.random() * (decRange[1] - decRange[0]),
        time_separation: Math.random() * 24,
        angular_separation: Math.random() * maxAngularSeparation,
        event_types: [
          selectedEventTypes[Math.floor(Math.random() * selectedEventTypes.length)],
          selectedEventTypes[Math.floor(Math.random() * selectedEventTypes.length)]
        ],
        timestamp: new Date().toISOString()
      };
      analysisResults.push(result);
    }
    setCorrelationResults(analysisResults);
  };

  const filteredResults = useMemo(() => {
    return correlationResults.filter(result => 
      result.confidence >= confidenceThreshold &&
      result.angular_separation <= maxAngularSeparation &&
      result.ra >= raRange[0] && result.ra <= raRange[1] &&
      result.dec >= decRange[0] && result.dec <= decRange[1]
    );
  }, [correlationResults, confidenceThreshold, maxAngularSeparation, raRange, decRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Nebula effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-cyan-500/30 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full p-3">
                  <Telescope className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                  COSMIC OBSERVATORY
                </h1>
                <p className="text-cyan-200/80">Multi-Messenger Event Correlation Network</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-black/60 rounded-xl border border-cyan-500/30">
                <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-white font-medium">{isLiveMode ? 'LIVE' : 'OFFLINE'}</span>
                <span className="text-cyan-300 text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  isLiveMode 
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white' 
                    : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                }`}
              >
                {isLiveMode ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isLiveMode ? 'PAUSE' : 'START'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            
            {/* Live Status */}
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Observatory Status</h3>
                <Activity className="h-6 w-6 text-green-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{filteredResults.length}</div>
                  <div className="text-green-300 text-sm">Active Correlations</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{dataSources.filter(s => s.status === 'ACTIVE').length}</div>
                  <div className="text-blue-300 text-sm">Online Detectors</div>
                </div>
              </div>
            </div>

            {/* Correlation Engine */}
            <div className="bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Correlation Engine</h3>
              </div>
              
              {/* Event Type Filters */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">Event Types</label>
                <div className="space-y-2">
                  {eventTypeOptions.map(eventType => (
                    <label key={eventType.id} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedEventTypes.includes(eventType.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEventTypes([...selectedEventTypes, eventType.id]);
                          } else {
                            setSelectedEventTypes(selectedEventTypes.filter(t => t !== eventType.id));
                          }
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{eventType.icon}</span>
                        <span className="text-white group-hover:text-cyan-300 transition-colors">
                          {eventType.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sky Coordinates */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">Sky Coordinates</label>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">Right Ascension (RA) - degrees</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={raRange[0]}
                        onChange={(e) => setRaRange([parseInt(e.target.value), raRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={raRange[1]}
                        onChange={(e) => setRaRange([raRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{raRange[0]}°</span>
                      <span>{raRange[1]}°</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">Declination (Dec) - degrees</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={decRange[0]}
                        onChange={(e) => setDecRange([parseInt(e.target.value), decRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={decRange[1]}
                        onChange={(e) => setDecRange([decRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{decRange[0]}°</span>
                      <span>{decRange[1]}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">Advanced Parameters</label>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">
                      Confidence Threshold: {confidenceThreshold.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">
                      Max Angular Separation: {maxAngularSeparation.toFixed(1)}°
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="10.0"
                      step="0.1"
                      value={maxAngularSeparation}
                      onChange={(e) => setMaxAngularSeparation(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={runCorrelationAnalysis}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Run Analysis
              </button>
            </div>

            {/* Data Sources */}
            <div className="bg-black/60 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Satellite className="h-6 w-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Data Sources</h3>
                </div>
                <button
                  onClick={() => setExpandedSources(!expandedSources)}
                  className="text-orange-400 hover:text-orange-300"
                >
                  {expandedSources ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              
              <div className={`space-y-3 ${expandedSources ? 'block' : 'hidden'}`}>
                {dataSources.map((source, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full animate-pulse" 
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <h4 className="font-bold text-white">{source.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-400 font-medium">{source.status}</span>
                        <div className="text-xs text-gray-400">{source.lastUpdate}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{source.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-cyan-300">{source.type}</span>
                      <span className="text-sm font-bold" style={{ color: source.color }}>
                        {source.events} events
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {!expandedSources && (
                <div className="grid grid-cols-2 gap-2">
                  {dataSources.slice(0, 4).map((source, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full animate-pulse" 
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <span className="text-sm font-medium text-white truncate">{source.name}</span>
                      </div>
                      <div className="text-xs text-gray-400">{source.events} events</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Visualizations */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Sky Map */}
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Globe className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Live Sky Map</h3>
                </div>
                <div className="text-sm text-cyan-300">{filteredResults.length} correlations</div>
              </div>
              
              <div className="bg-black/40 rounded-xl border border-gray-600/30 h-96 relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="1 1" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="ra" 
                      domain={[0, 360]}
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={(value) => `${value}°`}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="dec" 
                      domain={[-90, 90]}
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={(value) => `${value}°`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-black/90 border border-cyan-500/50 rounded-lg p-3">
                              <p className="text-white font-bold">{data.event1_id} ↔ {data.event2_id}</p>
                              <p className="text-cyan-400">RA: {data.ra.toFixed(2)}°</p>
                              <p className="text-purple-400">Dec: {data.dec.toFixed(2)}°</p>
                              <p className="text-green-400">Confidence: {(data.confidence * 100).toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      data={filteredResults} 
                      dataKey="confidence"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                
                {/* Constellation overlay effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-white rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: '2px',
                        height: '2px',
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: '4s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Correlation Timeline */}
            <div className="bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Detection Timeline</h3>
              </div>
              
              <div className="bg-black/40 rounded-xl border border-gray-600/30 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredResults.slice(-20).map((r, i) => ({ ...r, index: i }))}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="index"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    <YAxis 
                      dataKey="confidence"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(168, 85, 247, 0.5)', 
                        borderRadius: '8px' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', strokeWidth: 1, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Correlations */}
            <div className="bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Recent Detections</h3>
                </div>
                <div className="text-sm text-green-300">Live Updates</div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredResults.slice(-10).reverse().map((result) => (
                  <div key={result.id} className="bg-gray-900/50 border border-gray-600/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-mono text-sm text-cyan-400">{result.event1_id} ↔ {result.event2_id}</div>
                        <div className="text-xs text-gray-400">{new Date(result.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{(result.confidence * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-400">confidence</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-gray-400">RA/Dec</div>
                        <div className="text-white">{result.ra.toFixed(1)}°, {result.dec.toFixed(1)}°</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Δt</div>
                        <div className="text-white">{result.time_separation.toFixed(1)}h</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Δθ</div>
                        <div className="text-white">{result.angular_separation.toFixed(3)}°</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      {result.event_types.map((type, i) => {
                        const eventType = eventTypeOptions.find(et => et.id === type);
                        return eventType ? (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: eventType.color + '40', border: `1px solid ${eventType.color}80` }}
                          >
                            {eventType.icon} {eventType.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosmicObservatoryDashboard;