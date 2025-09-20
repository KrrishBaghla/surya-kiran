export interface CosmicEvent {
  id: string;
  source: 'GWOSC' | 'HEASARC' | 'ZTF' | 'TNS' | 'ICECUBE';
  event_type: 'gravitational_wave' | 'gamma_burst' | 'optical_transient' | 'supernova' | 'neutrino';
  time: string; // ISO format
  ra?: number;  // Right ascension
  dec?: number; // Declination  
  confidence: number; // 0-1
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  metadata: Record<string, any>;
}

export interface Correlation {
  id: string;
  event1_id: string;
  event2_id: string;
  event1_source: string;
  event2_source: string;
  confidence: number;
  time_separation: number; // hours
  angular_separation?: number; // degrees
  cross_messenger: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  scientific_interest: 'BREAKTHROUGH' | 'SIGNIFICANT' | 'ROUTINE' | 'BACKGROUND';
}

export interface DataSource {
  name: string;
  status: 'ACTIVE' | 'OFFLINE' | 'ERROR';
  events: number;
  confidence: number;
  type: string;
  lastUpdate: string;
}

export type ViewType = 'observatory' | 'solar-system' | 'sky-map' | 'correlations' | 'analytics' | 'live-correlation';