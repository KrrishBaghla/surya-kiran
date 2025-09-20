import React from 'react';
import { ViewType } from '../types';
import { 
  Telescope, 
  Globe, 
  Map, 
  Network, 
  BarChart3, 
  Radio, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  liveMode: boolean;
  onLiveModeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  liveMode, 
  onLiveModeToggle 
}) => {
  const views = [
    { id: 'observatory', name: 'Observatory', icon: Telescope },
    { id: 'solar-system', name: 'Solar System', icon: Globe },
    { id: 'sky-map', name: 'Sky Map', icon: Map },
    { id: 'correlations', name: 'Correlations', icon: Network },
    { id: 'live-correlation', name: 'Live Engine', icon: Cpu },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ] as const;

  return (
    <header className="bg-black/90 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Radio className="w-8 h-8 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Multi-Messenger Observatory
                </h1>
                <p className="text-xs text-cyan-400">
                  Cosmic Event Correlation System
                </p>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id as ViewType)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 hover:bg-white/5
                    ${currentView === view.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{view.name}</span>
                </button>
              );
            })}
          </nav>

          {/* <div className="flex items-center gap-4">
            <button
              onClick={onLiveModeToggle}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${liveMode
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }
              `}
            >
              {liveMode ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>Live Mode</span>
            </button>

            <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;