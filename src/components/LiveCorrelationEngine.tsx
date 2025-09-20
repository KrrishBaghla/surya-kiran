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
  RefreshCw,
  Settings,
  Filter,
  MapPin,
  Database,
  Satellite,
  Eye,
  Cpu,
  BarChart3,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface DataSource {
  name: string;
  type: string;
  description: string;
  api_url: string;
  status: string;
  confidence: number;
  update_frequency: string;
}

interface CorrelationResult {
  correlation_id: string;
  event1_id: string;
  event2_id: string;
  event1_source: string;
  event2_source: string;
  event1_type: string;
  event2_type: string;
  ra1?: number;
  dec1?: number;
  ra2?: number;
  dec2?: number;
  time_separation_hours: number;
  angular_separation_deg?: number;
  confidence_score: number;
  priority_level: string;
  scientific_interest: string;
  analysis_timestamp: string;
  follow_up_recommended: boolean;
  notes: string;
}

interface LiveCorrelationEngineProps {}

const LiveCorrelationEngine: React.FC<LiveCorrelationEngineProps> = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Parameters
  const [eventTypes, setEventTypes] = useState<string[]>([
    'gravitational_wave', 'gamma_burst', 'optical_transient', 'neutrino', 'radio_burst'
  ]);
  const [raRange, setRaRange] = useState<[number, number]>([0, 360]);
  const [decRange, setDecRange] = useState<[number, number]>([-90, 90]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.1);
  const [maxAngularSeparation, setMaxAngularSeparation] = useState(10.0);
  const [maxTimeSeparation, setMaxTimeSeparation] = useState(72.0);

  // Load data sources on mount
  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/data-sources');
      const data = await response.json();
      setDataSources(Object.values(data.sources) as DataSource[]);
    } catch (err) {
      console.error('Failed to load data sources:', err);
    }
  };

  const runCorrelationAnalysis = async () => {
    try {
      setIsRunning(true);
      setLoading(true);
      setError(null);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('http://localhost:8000/api/v1/live-correlation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_types: eventTypes,
          ra_min: raRange[0],
          ra_max: raRange[1],
          dec_min: decRange[0],
          dec_max: decRange[1],
          confidence_threshold: confidenceThreshold,
          max_angular_separation: maxAngularSeparation,
          max_time_separation: maxTimeSeparation,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCorrelations(data.correlations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Error running correlation analysis:', err);
    } finally {
      setLoading(false);
      setIsRunning(false);
      setProgress(0);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'gravitational_wave': return <Radio className="h-4 w-4" />;
      case 'gamma_burst': return <Zap className="h-4 w-4" />;
      case 'optical_transient': return <Star className="h-4 w-4" />;
      case 'neutrino': return <Atom className="h-4 w-4" />;
      case 'radio_burst': return <Satellite className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getInterestColor = (interest: string) => {
    switch (interest) {
      case 'BREAKTHROUGH': return 'bg-purple-500 text-white';
      case 'SIGNIFICANT': return 'bg-blue-500 text-white';
      case 'ROUTINE': return 'bg-green-500 text-white';
      case 'POTENTIAL': return 'bg-indigo-500 text-white';
      case 'BACKGROUND': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getDataSourceIcon = (name: string) => {
    switch (name) {
      case 'GWOSC': return <Radio className="h-5 w-5" />;
      case 'HEASARC': return <Zap className="h-5 w-5" />;
      case 'ZTF': return <Eye className="h-5 w-5" />;
      case 'TNS': return <Star className="h-5 w-5" />;
      case 'ICECUBE': return <Atom className="h-5 w-5" />;
      case 'CHIME': return <Satellite className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Cpu className="h-10 w-10 text-purple-400" />
            Live Data Correlation Engine
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time multi-messenger event correlation with configurable parameters and priority assessment
          </p>
        </motion.div>

        <Tabs defaultValue="parameters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Parameters Tab */}
          <TabsContent value="parameters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Type Filters */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Event Type Filters
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Select which types of events to include in the analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { value: 'gravitational_wave', label: 'Gravitational Wave', icon: <Radio className="h-4 w-4" /> },
                    { value: 'gamma_burst', label: 'Gamma Burst', icon: <Zap className="h-4 w-4" /> },
                    { value: 'optical_transient', label: 'Optical Transient', icon: <Star className="h-4 w-4" /> },
                    { value: 'neutrino', label: 'Neutrino', icon: <Atom className="h-4 w-4" /> },
                    { value: 'radio_burst', label: 'Radio Burst', icon: <Satellite className="h-4 w-4" /> },
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={eventTypes.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEventTypes([...eventTypes, type.value]);
                          } else {
                            setEventTypes(eventTypes.filter(t => t !== type.value));
                          }
                        }}
                      />
                      <Label htmlFor={type.value} className="text-white flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sky Coordinates */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Sky Coordinates
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Define the region of sky to analyze
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Right Ascension (RA) - degrees</Label>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{raRange[0]}°</span>
                      <Slider
                        value={raRange}
                        onValueChange={(value) => setRaRange([value[0], value[1]])}
                        max={360}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400">{raRange[1]}°</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Declination (Dec) - degrees</Label>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{decRange[0]}°</span>
                      <Slider
                        value={decRange}
                        onValueChange={(value) => setDecRange([value[0], value[1]])}
                        max={90}
                        min={-90}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-400">{decRange[1]}°</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Parameters */}
              <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Advanced Parameters
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Fine-tune the correlation analysis parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Confidence Threshold: {confidenceThreshold}</Label>
                      <Slider
                        value={[confidenceThreshold]}
                        onValueChange={(value) => setConfidenceThreshold(value[0])}
                        max={1.0}
                        min={0.0}
                        step={0.01}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Max Angular Separation: {maxAngularSeparation}°</Label>
                      <Slider
                        value={[maxAngularSeparation]}
                        onValueChange={(value) => setMaxAngularSeparation(value[0])}
                        max={50}
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Max Time Separation: {maxTimeSeparation}h</Label>
                      <Slider
                        value={[maxTimeSeparation]}
                        onValueChange={(value) => setMaxTimeSeparation(value[0])}
                        max={168}
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Run Analysis Button */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">Ready to Analyze</h3>
                    <p className="text-sm text-gray-400">
                      {eventTypes.length} event types selected • RA: {raRange[0]}°-{raRange[1]}° • Dec: {decRange[0]}°-{decRange[1]}°
                    </p>
                  </div>
                  <Button
                    onClick={runCorrelationAnalysis}
                    disabled={loading || isRunning}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>
                
                {loading && (
                  <div className="mt-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-400 mt-2">Processing correlation analysis...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sources
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time data collection from multiple observatories and missions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataSources.map((source, index) => (
                    <motion.div
                      key={source.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getDataSourceIcon(source.name)}
                              <h3 className="font-semibold text-white">{source.name}</h3>
                            </div>
                            <Badge 
                              className={source.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}
                            >
                              {source.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">{source.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Confidence:</span>
                              <span className="text-white">{(source.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Update:</span>
                              <span className="text-white">{source.update_frequency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analysis Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time correlation analysis progress and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-500 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{correlations.length}</div>
                    <div className="text-sm text-gray-400">Correlations Found</div>
                  </div>
                  
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {correlations.filter(c => c.priority_level === 'CRITICAL').length}
                    </div>
                    <div className="text-sm text-gray-400">Critical Priority</div>
                  </div>
                  
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">
                      {correlations.filter(c => c.priority_level === 'HIGH').length}
                    </div>
                    <div className="text-sm text-gray-400">High Priority</div>
                  </div>
                  
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {correlations.filter(c => c.follow_up_recommended).length}
                    </div>
                    <div className="text-sm text-gray-400">Follow-up Recommended</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Correlation Results
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed results from the correlation analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {correlations.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Correlations Found</h3>
                    <p className="text-gray-400">Run the analysis to find correlations between events</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {correlations.map((correlation, index) => (
                      <motion.div
                        key={correlation.correlation_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getEventTypeIcon(correlation.event1_type)}
                                <span className="text-white font-medium">
                                  {correlation.event1_id} ↔ {correlation.event2_id}
                                </span>
                                {getEventTypeIcon(correlation.event2_type)}
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(correlation.priority_level)}>
                                  {correlation.priority_level}
                                </Badge>
                                <Badge className={getInterestColor(correlation.scientific_interest)}>
                                  {correlation.scientific_interest}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Confidence:</span>
                                <div className="text-white font-medium">
                                  {(correlation.confidence_score * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Time Sep:</span>
                                <div className="text-white font-medium">
                                  {correlation.time_separation_hours.toFixed(2)}h
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Angular Sep:</span>
                                <div className="text-white font-medium">
                                  {correlation.angular_separation_deg?.toFixed(3) || 'N/A'}°
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Sources:</span>
                                <div className="text-white font-medium">
                                  {correlation.event1_source} - {correlation.event2_source}
                                </div>
                              </div>
                            </div>
                            
                            {correlation.follow_up_recommended && (
                              <div className="mt-3 p-2 bg-orange-500/20 border border-orange-500/30 rounded">
                                <div className="flex items-center gap-2 text-orange-400">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">Follow-up Recommended</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 text-xs text-gray-400">
                              {correlation.notes}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveCorrelationEngine;
