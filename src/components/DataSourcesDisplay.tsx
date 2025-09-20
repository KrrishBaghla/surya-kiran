import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Zap, 
  Star, 
  Atom, 
  Satellite,
  Database,
  Eye,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface DataSource {
  name: string;
  type: string;
  description: string;
  api_url: string;
  status: string;
  confidence: number;
  update_frequency: string;
}

interface DataSourcesDisplayProps {
  className?: string;
}

const DataSourcesDisplay: React.FC<DataSourcesDisplayProps> = ({ className = '' }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadDataSources();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDataSources, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDataSources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/v1/data-sources');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDataSources(Object.values(data.sources) as DataSource[]);
      setLastUpdate(data.last_updated || new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data sources');
      console.error('Error loading data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDataSourceIcon = (name: string) => {
    switch (name) {
      case 'GWOSC': return <Radio className="h-6 w-6 text-purple-400" />;
      case 'HEASARC': return <Zap className="h-6 w-6 text-yellow-400" />;
      case 'ZTF': return <Eye className="h-6 w-6 text-blue-400" />;
      case 'TNS': return <Star className="h-6 w-6 text-orange-400" />;
      case 'ICECUBE': return <Atom className="h-6 w-6 text-cyan-400" />;
      case 'CHIME': return <Satellite className="h-6 w-6 text-green-400" />;
      default: return <Database className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'OFFLINE': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'OFFLINE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ERROR': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gravitational_wave': return 'bg-purple-500/20 text-purple-400';
      case 'gamma_burst': return 'bg-yellow-500/20 text-yellow-400';
      case 'optical_transient': return 'bg-blue-500/20 text-blue-400';
      case 'neutrino': return 'bg-cyan-500/20 text-cyan-400';
      case 'radio_burst': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTypeName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const activeSources = dataSources.filter(source => source.status === 'ACTIVE').length;
  const totalSources = dataSources.length;

  if (loading && dataSources.length === 0) {
    return (
      <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            <span className="ml-3 text-gray-400">Loading data sources...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Sources
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time data collection from multiple observatories and missions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDataSources}
              disabled={loading}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalSources}</div>
            <div className="text-xs text-gray-400">Total Sources</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{activeSources}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">
              {totalSources > 0 ? Math.round((activeSources / totalSources) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getDataSourceIcon(source.name)}
                      <div>
                        <h3 className="font-semibold text-white">{source.name}</h3>
                        <Badge className={`text-xs ${getTypeColor(source.type)}`}>
                          {formatTypeName(source.type)}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(source.status)} flex items-center gap-1`}>
                      {getStatusIcon(source.status)}
                      {source.status}
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {source.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Confidence:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={source.confidence * 100} 
                          className="w-16 h-2"
                        />
                        <span className="text-xs text-white">
                          {(source.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Update:</span>
                      <span className="text-xs text-white flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {source.update_frequency}
                      </span>
                    </div>
                  </div>
                  
                  {/* API Link */}
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">API Endpoint</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                      onClick={() => window.open(source.api_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        {lastUpdate && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Last updated: {new Date(lastUpdate).toLocaleString()}</span>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>Real-time monitoring</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataSourcesDisplay;
