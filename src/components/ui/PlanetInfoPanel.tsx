import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Clock, Thermometer, Zap, Info } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { PlanetInfo } from '../three/SolarSystem';

interface PlanetInfoPanelProps {
  planet: PlanetInfo | null;
  onClose: () => void;
}

const planetDetails = {
  Mercury: {
    mass: '3.3011 × 10²³ kg',
    gravity: '3.7 m/s²',
    temperature: '-173°C to 427°C',
    atmosphere: 'Extremely thin',
    moons: 0,
    dayLength: '58.6 Earth days',
    yearLength: '88 Earth days',
    composition: 'Iron core, silicate mantle',
    discovery: 'Known since ancient times',
    missions: ['MESSENGER', 'BepiColombo (ongoing)']
  },
  Venus: {
    mass: '4.8675 × 10²⁴ kg',
    gravity: '8.87 m/s²',
    temperature: '462°C (surface)',
    atmosphere: '96.5% CO₂, dense',
    moons: 0,
    dayLength: '243 Earth days (retrograde)',
    yearLength: '225 Earth days',
    composition: 'Iron core, rocky mantle',
    discovery: 'Known since ancient times',
    missions: ['Venera series', 'Magellan', 'Venus Express']
  },
  Earth: {
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.81 m/s²',
    temperature: '-89°C to 58°C',
    atmosphere: '78% N₂, 21% O₂',
    moons: 1,
    dayLength: '24 hours',
    yearLength: '365.25 days',
    composition: 'Iron core, silicate mantle',
    discovery: 'Our home planet',
    missions: ['Countless Earth observation missions']
  },
  Mars: {
    mass: '6.4171 × 10²³ kg',
    gravity: '3.71 m/s²',
    temperature: '-87°C to -5°C',
    atmosphere: '95% CO₂, thin',
    moons: 2,
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    composition: 'Iron core, basaltic crust',
    discovery: 'Known since ancient times',
    missions: ['Viking', 'Mars rovers', 'Perseverance', 'Ingenuity helicopter']
  },
  Jupiter: {
    mass: '1.8982 × 10²⁷ kg',
    gravity: '24.79 m/s²',
    temperature: '-108°C (cloud tops)',
    atmosphere: '89% H₂, 10% He',
    moons: 95,
    dayLength: '9.9 hours',
    yearLength: '11.9 Earth years',
    composition: 'Hydrogen and helium gas giant',
    discovery: 'Known since ancient times',
    missions: ['Pioneer', 'Voyager', 'Galileo', 'Juno (ongoing)']
  },
  Saturn: {
    mass: '5.6834 × 10²⁶ kg',
    gravity: '10.44 m/s²',
    temperature: '-139°C (cloud tops)',
    atmosphere: '96% H₂, 3% He',
    moons: 146,
    dayLength: '10.7 hours',
    yearLength: '29.4 Earth years',
    composition: 'Hydrogen and helium, prominent ring system',
    discovery: 'Known since ancient times',
    missions: ['Pioneer', 'Voyager', 'Cassini-Huygens']
  },
  Uranus: {
    mass: '8.6810 × 10²⁵ kg',
    gravity: '8.69 m/s²',
    temperature: '-197°C (cloud tops)',
    atmosphere: '83% H₂, 15% He, 2% CH₄',
    moons: 27,
    dayLength: '17.2 hours (retrograde)',
    yearLength: '84 Earth years',
    composition: 'Ice giant with water, methane, ammonia',
    discovery: 'William Herschel, 1781',
    missions: ['Voyager 2 (only spacecraft to visit)']
  },
  Neptune: {
    mass: '1.02413 × 10²⁶ kg',
    gravity: '11.15 m/s²',
    temperature: '-201°C (cloud tops)',
    atmosphere: '80% H₂, 19% He, 1% CH₄',
    moons: 16,
    dayLength: '16.1 hours',
    yearLength: '164.8 Earth years',
    composition: 'Ice giant with water, methane, ammonia',
    discovery: 'Mathematical prediction, 1846',
    missions: ['Voyager 2 (only spacecraft to visit)']
  },
  Moon: {
    mass: '7.342 × 10²² kg',
    gravity: '1.62 m/s²',
    temperature: '-233°C to 123°C',
    atmosphere: 'None (exosphere)',
    moons: 0,
    dayLength: '29.5 Earth days',
    yearLength: '27.3 Earth days',
    composition: 'Rocky body with iron core',
    discovery: 'Known since ancient times',
    missions: ['Apollo missions', 'Chang\'e series', 'Artemis (planned)']
  }
};

export function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  if (!planet) return null;

  const details = planetDetails[planet.name as keyof typeof planetDetails];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'transparent', backdropFilter: 'none' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: planet.color + '20', border: `2px solid ${planet.color}` }}
              >
                <Globe className="w-8 h-8" style={{ color: planet.color }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold cosmic-text">{planet.name}</h2>
                <p className="text-muted-foreground">{planet.funFact}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Day Length</span>
              </div>
              <p className="text-sm text-muted-foreground">{details.dayLength}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Gravity</span>
              </div>
              <p className="text-sm text-muted-foreground">{details.gravity}</p>
            </div>
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <p className="text-sm text-muted-foreground">{details.temperature}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Moons</span>
              </div>
              <p className="text-sm text-muted-foreground">{details.moons}</p>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Physical Properties
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mass:</span>
                    <span>{details.mass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Surface Gravity:</span>
                    <span>{details.gravity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Day Length:</span>
                    <span>{details.dayLength}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Length:</span>
                    <span>{details.yearLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span>{details.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Moons:</span>
                    <span>{details.moons}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Atmosphere & Composition</h3>
              <div className="bg-muted/20 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atmosphere:</span>
                  <span>{details.atmosphere}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Composition:</span>
                  <span>{details.composition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discovery:</span>
                  <span>{details.discovery}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Space Missions</h3>
              <div className="flex flex-wrap gap-2">
                {details.missions.map((mission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {mission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
