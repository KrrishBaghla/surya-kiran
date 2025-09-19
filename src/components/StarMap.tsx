"use client";
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import SolarSystem, { PlanetInfo } from '@/components/three/SolarSystem';
import { motion } from 'framer-motion';
import { Info, X, ServerCrash, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlanetInfoPanel } from '@/components/ui/PlanetInfoPanel';
import { SimulationControls } from '@/components/ui/SimulationControls';
import * as THREE from 'three';
import type { Event as ApiEvent } from '@/lib/api';
import { mockEvents } from '@/mock';
import { useEventStore } from '@/stores/event-store';

// Mini 3D planet preview inside the info panel
function MiniPlanetPreview({ textureUrl = '', radius = 0.8 }: { textureUrl?: string; radius?: number }) {
  // Local component for the sphere with auto-rotation
  function RotatingSphere() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
      if (ref.current) ref.current.rotation.y += delta * 0.4;
    });
    const tex = useMemo(() => {
      // Skip texture loading to avoid CORS issues - use solid color instead
      return null;
    }, [textureUrl]);
    return (
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial 
          map={tex} 
          color={tex ? '#ffffff' : '#6B93D6'} 
          metalness={0.05} 
          roughness={0.9} 
        />
      </mesh>
    );
  }

  return (
    <div className="rounded-md border border-white/10 overflow-hidden" style={{ width: 220, height: 220 }}>
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} dpr={[1, 1.5]}
        style={{ background: 'radial-gradient(ellipse at center, rgba(20,20,40,0.6), rgba(10,10,20,0.9))' }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 2]} intensity={1.2} />
        <pointLight position={[-2, -1, -2]} intensity={0.6} color="#88aaff" />
        <RotatingSphere />
      </Canvas>
    </div>
  );
}

const eventTypeColors: { [key: string]: string } = {
  'gravitational_wave': '#00BFFF',
  'supernova': '#9966FF',
  'gamma_ray_burst': '#00FF80',
  'neutrino': '#FF6B9D',
};

// Helper to convert spherical coordinates to Cartesian
const toCartesian = (ra: number, dec: number, radius: number): [number, number, number] => {
  const raRad = (ra / 180) * Math.PI;
  const decRad = (dec / 180) * Math.PI;
  return [
    radius * Math.cos(decRad) * Math.cos(raRad),
    radius * Math.sin(decRad),
    radius * Math.cos(decRad) * Math.sin(raRad),
  ];
};

interface MappedEvent extends ApiEvent {
  position: [number, number, number];
  color: string;
}

// (CameraFocus removed per revert)

interface EventMarkerProps {
  event: MappedEvent;
  onClick: (event: MappedEvent) => void;
  showRay?: boolean;
}

function EventMarker({ event, onClick, showRay }: EventMarkerProps) {
  const meshRef = useRef<THREE.Group>(null!);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group 
      ref={meshRef}
      position={event.position as [number, number, number]}
      onClick={() => onClick(event)}
    >
      {/* Optional line from Sun (origin) to event position to emphasize relative-to-solar-system direction */}
      {showRay && (
        <Line
          points={[[0, 0, 0], event.position as [number, number, number]]}
          color={event.color}
          transparent
          opacity={0.3}
          lineWidth={1}
        />
      )}
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={event.color}
          emissive={event.color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Pulsing glow ring */}
      <mesh>
        <ringGeometry args={[0.12, 0.18, 16]} />
        <meshBasicMaterial 
          color={event.color} 
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color={event.color} 
          transparent 
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function SkyMap({ onEventClick, events, showRays }: { onEventClick: (event: MappedEvent) => void; events: ApiEvent[]; showRays: boolean }) {
  const mappedEvents = useMemo(() => {
    return events.map(event => {
      const ra = event.coordinates?.ra ?? Math.random() * 360;
      const dec = event.coordinates?.dec ?? (Math.random() * 180 - 90);
      return {
        ...event,
        // Place events on a large celestial sphere centered at the Sun so they are relative to the solar system
        // Keep them beyond Neptune's ~30 AU scaled distance. Use radius ~50-60 for clear separation.
        position: toCartesian(ra, dec, 50 + Math.random() * 10),
        color: eventTypeColors[event.type] || '#FFFFFF',
      } as MappedEvent;
    });
  }, [events]);

  return (
    <>
      {mappedEvents.map((event) => (
        <EventMarker key={event.id} event={event} onClick={onEventClick} showRay={showRays} />
      ))}
    </>
  );
}

export default function StarMap() {
  const [selectedEvent, setSelectedEvent] = useState<MappedEvent | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showAsteroidBelt, setShowAsteroidBelt] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [showEventRays, setShowEventRays] = useState(true);

  const { events, error, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsData = error ? mockEvents : events;

  const handleEventClick = (event: MappedEvent) => {
    setSelectedEvent(event);
    setSelectedPlanet(null);
  };

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Planet Info Panel */}
      <PlanetInfoPanel 
        planet={selectedPlanet} 
        onClose={() => setSelectedPlanet(null)} 
      />
      
      {/* Toggle button for info panel */}
      <div className="absolute top-24 left-6 z-20">
        <Button
          onClick={() => setShowInfoPanel(!showInfoPanel)}
          className="mb-4 bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-400/30 text-cyan-300 hover:text-cyan-100"
          size="sm"
        >
          {showInfoPanel ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showInfoPanel ? 'Hide Info' : 'Show Info'}
        </Button>
        <Button
          onClick={() => setShowEventRays(!showEventRays)}
          className="bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-400/30 text-cyan-300 hover:text-cyan-100"
          size="sm"
        >
          {showEventRays ? 'Hide Event Rays' : 'Show Event Rays'}
        </Button>
      </div>

      {showInfoPanel && (
        <div className="absolute top-24 left-6 z-10 mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="rounded-lg p-6 max-w-sm"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              backdropFilter: 'none'
            }}
          >
          <h1 className="text-2xl font-bold cosmic-text mb-2">3D Star Map</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Interactive 3D visualization of astronomical events and our solar system
          </p>
          
          {/* API Status */}
          {error && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ServerCrash className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-400">API Error</span>
              </div>
              <p className="text-xs text-muted-foreground">Using mock data for visualization</p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>• Click and drag to rotate</p>
            <p>• Scroll to zoom</p>
            <p>• Click on events or planets for details</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm group hover:bg-accent/10 p-2 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-pulse opacity-60"></div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-accent">Gravitational Waves</span>
                <p className="text-xs text-muted-foreground mt-0.5">Spacetime ripples from cosmic collisions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:bg-accent/10 p-2 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#9966FF' }}></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full animate-pulse opacity-60" style={{ backgroundColor: '#9966FF' }}></div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-accent">Supernovae</span>
                <p className="text-xs text-muted-foreground mt-0.5">Stellar explosions marking star death</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:bg-accent/10 p-2 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#00FF80' }}></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full animate-pulse opacity-60" style={{ backgroundColor: '#00FF80' }}></div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-accent">Gamma-Ray Bursts</span>
                <p className="text-xs text-muted-foreground mt-0.5">Intense electromagnetic radiation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:bg-accent/10 p-2 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#FF6B9D' }}></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full animate-pulse opacity-60" style={{ backgroundColor: '#FF6B9D' }}></div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-accent">Neutrinos</span>
                <p className="text-xs text-muted-foreground mt-0.5">Nearly massless subatomic particles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:bg-accent/10 p-2 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: '#FDB813' }}></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full animate-pulse opacity-60" style={{ backgroundColor: '#FDB813' }}></div>
              </div>
              <div className="flex-1">
                <span className="font-medium text-accent">Solar System</span>
                <p className="text-xs text-muted-foreground mt-0.5">Our local planetary neighborhood</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground">
              <strong>Scale Note:</strong> Solar system is scaled for visualization. 
              Event positions are relative to galactic coordinates.
            </p>
          </div>
        </motion.div>
        </div>
      )}

      {/* Event detail panel */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-24 right-6 z-10 rounded-lg p-6 max-w-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'none'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">{selectedEvent.id}</h3>
              <Badge 
                className="mt-1"
                style={{ 
                  backgroundColor: `${(eventTypeColors[selectedEvent.type] || '#FFFFFF')}20`,
                  color: eventTypeColors[selectedEvent.type] || '#FFFFFF',
                  borderColor: `${(eventTypeColors[selectedEvent.type] || '#FFFFFF')}50`
                }}
              >
                {selectedEvent.type}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedEvent(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{selectedEvent.description}</p>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-primary">{(selectedEvent.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Detected:</span>
                <span>{new Date(selectedEvent.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="text-accent font-mono text-xs">
                  RA: {(selectedEvent.coordinates?.ra ?? 0).toFixed(4)}, Dec: {(selectedEvent.coordinates?.dec ?? 0).toFixed(4)}
                </span>
              </div>
              {/* Distance readout removed per revert */}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <Info className="w-4 h-4" />
              Instructions
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Drag to rotate • Scroll to zoom • Click markers for details
            </p>
          </div>
        </motion.div>
      )}

      {/* Planet detail panel */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-24 right-6 z-10 max-w-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'none'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-cyan-300 tracking-wide">{selectedPlanet.name}</h3>
              <div className="mt-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-xs text-cyan-300 font-mono uppercase tracking-wider">
                Planet
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSelectedPlanet(null)}
              className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 border border-cyan-400/30 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {/* Planet 3D model preview */}
          <div className="mb-4 flex items-center justify-center">
            <MiniPlanetPreview textureUrl={selectedPlanet.textureUrl} radius={0.8} />
          </div>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">Distance</div>
                <div className="text-cyan-100 font-bold text-lg">{selectedPlanet.distance.toFixed(2)} <span className="text-xs text-cyan-300">AU</span></div>
              </div>
              <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">Orbital Period</div>
                <div className="text-cyan-100 font-bold text-lg">{selectedPlanet.orbitalPeriodDays.toLocaleString()} <span className="text-xs text-cyan-300">days</span></div>
              </div>
            </div>
            {selectedPlanet.funFact && (
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-400/30 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">Fun Fact</div>
                <p className="text-cyan-100 text-sm leading-relaxed">{selectedPlanet.funFact}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 3D Canvas: responsive container */}
      <div className="top-0 left-0 w-full h-screen -z-10">
        <Canvas
          camera={{ position: [8, 6, 8], fov: 60 }}
          style={{ background: 'transparent' }}
          dpr={[1, 1.5]}
        >
          {/* Controls: makeDefault exposes controls to R3F state for SolarSystem camera focus */}
          <OrbitControls
            makeDefault
            enableZoom
            enablePan
            enableRotate
            enableDamping
            dampingFactor={0.08}
            maxDistance={120}
            minDistance={0.3}
            zoomSpeed={0.8}
          />
          {/* Starfield background */}
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade />

          {/* Coordinate grid and axes labels */}
          <mesh>
            <sphereGeometry args={[4, 32, 32]} />
            <meshBasicMaterial color="#001122" transparent opacity={0.08} wireframe />
          </mesh>
          {/* Grid removed - using solar system's extended grid instead */}

          <Suspense fallback={null}>
            {/* Axis labels removed to fix Text component compatibility issues */}

            {/* CameraFocus removed per revert */}

            {/* Solar System */}
            <SolarSystem 
              onSelect={setSelectedPlanet}
              simulationSpeed={isPlaying ? simulationSpeed : 0}
              showOrbits={showOrbits}
              showLabels={showLabels}
              showAsteroidBelt={showAsteroidBelt}
            />

            {/* Event markers */}
            <SkyMap onEventClick={handleEventClick} events={eventsData} showRays={showEventRays} />
          </Suspense>
        </Canvas>
      </div>

      {/* Simulation Controls */}
      <SimulationControls
        onSpeedChange={setSimulationSpeed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setSimulationSpeed(1);
          setIsPlaying(true);
        }}
        onToggleOrbits={setShowOrbits}
        onToggleLabels={setShowLabels}
        onToggleAsteroidBelt={setShowAsteroidBelt}
        isPlaying={isPlaying}
        currentSpeed={simulationSpeed}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showAsteroidBelt={showAsteroidBelt}
      />
    </div>
  );
}