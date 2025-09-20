import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Zap, Clock, Eye } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { Switch } from './switch';
import { Badge } from './badge';

interface SimulationControlsProps {
  onSpeedChange: (speed: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onToggleOrbits: (show: boolean) => void;
  onToggleLabels: (show: boolean) => void;
  onToggleAsteroidBelt: (show: boolean) => void;
  isPlaying: boolean;
  currentSpeed: number;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroidBelt: boolean;
}

export function SimulationControls({
  onSpeedChange,
  onTogglePlay,
  onReset,
  onToggleOrbits,
  onToggleLabels,
  onToggleAsteroidBelt,
  isPlaying,
  currentSpeed,
  showOrbits,
  showLabels,
  showAsteroidBelt
}: SimulationControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const speedPresets = [
    { label: '0.1x', value: 0.1 },
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '5x', value: 5 },
    { label: '10x', value: 10 },
  ];

  const getSpeedLabel = (speed: number) => {
    if (speed < 1) return `${speed}x`;
    return `${speed}x`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-20"
    >
      <div className="bg-card/90 backdrop-blur-lg border border-border rounded-xl p-4 shadow-2xl">
        {/* Main Controls */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            size="sm"
            onClick={onTogglePlay}
            className="gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Speed</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {getSpeedLabel(currentSpeed)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={[currentSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              max={20}
              min={0.1}
              step={0.1}
              className="w-48"
            />
            
            <div className="flex gap-1 flex-wrap">
              {speedPresets.map((preset) => (
                <Button
                  key={preset.value}
                  size="sm"
                  variant={currentSpeed === preset.value ? "default" : "outline"}
                  onClick={() => onSpeedChange(preset.value)}
                  className="text-xs px-2 py-1 h-6"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border/50 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="w-4 h-4 text-accent" />
              Display Options
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Planet Orbits</span>
                <Switch
                  checked={showOrbits}
                  onCheckedChange={onToggleOrbits}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Planet Labels</span>
                <Switch
                  checked={showLabels}
                  onCheckedChange={onToggleLabels}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Asteroid Belt</span>
                <Switch
                  checked={showAsteroidBelt}
                  onCheckedChange={onToggleAsteroidBelt}
                />
              </div>
            </div>

            {/* Performance Info */}
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-3 h-3" />
                <span>Real-time 3D simulation</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
