import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ObservatoryDashboard from './components/ObservatoryDashboard';
import SkyMap from './components/SkyMap';
import Correlations from './components/Correlations';
import Analytics from './components/Analytics';
import LiveCorrelationEngine from './components/LiveCorrelationEngine';
import { ViewType } from './types';
import StarMap from './components/StarMap';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('observatory');
  const [liveMode] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'observatory':
        return <ObservatoryDashboard />;
      case 'solar-system':
        return <StarMap />;
      case 'sky-map':
        return <SkyMap />;
      case 'correlations':
        return <Correlations />;
      case 'analytics':
        return <Analytics />;
      case 'live-correlation':
        return <LiveCorrelationEngine />;
      default:
        return <ObservatoryDashboard />;
    }
  };

  // Simulate live updates when live mode is enabled
  useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(() => {
      // Simulate live data updates here
      console.log('Live data update...');
    }, 5000);

    return () => clearInterval(interval);
  }, [liveMode]);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* Live Mode Indicator */}
      {liveMode && (
        <motion.div
          className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-green-400 text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Mode Active
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;