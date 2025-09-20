import { CosmicEvent, Correlation, DataSource } from '../types';

export const mockEvents: CosmicEvent[] = [
  {
    id: 'GW240101_123456',
    source: 'GWOSC',
    event_type: 'gravitational_wave',
    time: '2024-01-01T12:34:56Z',
    ra: 150.2,
    dec: -45.8,
    confidence: 0.95,
    priority: 'CRITICAL',
    metadata: { mass1: 35.6, mass2: 29.1, distance: 420 }
  },
  {
    id: 'GRB240101_125012',
    source: 'HEASARC',
    event_type: 'gamma_burst',
    time: '2024-01-01T12:50:12Z',
    ra: 151.1,
    dec: -44.9,
    confidence: 0.89,
    priority: 'HIGH',
    metadata: { duration: 2.3, energy: '1e52 erg' }
  },
  {
    id: 'AT2024a',
    source: 'ZTF',
    event_type: 'optical_transient',
    time: '2024-01-01T13:15:30Z',
    ra: 149.8,
    dec: -46.2,
    confidence: 0.78,
    priority: 'MEDIUM',
    metadata: { magnitude: 18.5, filter: 'g' }
  },
  {
    id: 'SN2024ab',
    source: 'TNS',
    event_type: 'supernova',
    time: '2024-01-02T08:22:15Z',
    ra: 203.4,
    dec: 12.7,
    confidence: 0.92,
    priority: 'HIGH',
    metadata: { type: 'Ia', z: 0.045 }
  },
  {
    id: 'IC240103_142837',
    source: 'ICECUBE',
    event_type: 'neutrino',
    time: '2024-01-03T14:28:37Z',
    ra: 88.2,
    dec: 35.1,
    confidence: 0.72,
    priority: 'MEDIUM',
    metadata: { energy: '290 TeV', track: true }
  }
];

export const mockCorrelations: Correlation[] = [
  {
    id: 'CORR_001',
    event1_id: 'GW240101_123456',
    event2_id: 'GRB240101_125012',
    event1_source: 'GWOSC',
    event2_source: 'HEASARC',
    confidence: 0.87,
    time_separation: 0.27,
    angular_separation: 1.2,
    cross_messenger: true,
    priority: 'CRITICAL',
    scientific_interest: 'BREAKTHROUGH'
  },
  {
    id: 'CORR_002',
    event1_id: 'GW240101_123456',
    event2_id: 'AT2024a',
    event1_source: 'GWOSC',
    event2_source: 'ZTF',
    confidence: 0.65,
    time_separation: 0.68,
    angular_separation: 0.8,
    cross_messenger: true,
    priority: 'HIGH',
    scientific_interest: 'SIGNIFICANT'
  }
];

export const mockDataSources: DataSource[] = [
  {
    name: 'LIGO-Virgo-KAGRA',
    status: 'ACTIVE',
    events: 127,
    confidence: 0.94,
    type: 'Gravitational Wave',
    lastUpdate: '2024-01-04T10:30:00Z'
  },
  {
    name: 'Fermi-GBM',
    status: 'ACTIVE',
    events: 342,
    confidence: 0.88,
    type: 'Gamma-ray',
    lastUpdate: '2024-01-04T10:28:45Z'
  },
  {
    name: 'Zwicky Transient Facility',
    status: 'ACTIVE',
    events: 1247,
    confidence: 0.91,
    type: 'Optical',
    lastUpdate: '2024-01-04T10:29:12Z'
  },
  {
    name: 'IceCube',
    status: 'ACTIVE',
    events: 89,
    confidence: 0.76,
    type: 'Neutrino',
    lastUpdate: '2024-01-04T10:27:33Z'
  },
  {
    name: 'TNS',
    status: 'ACTIVE',
    events: 567,
    confidence: 0.85,
    type: 'Supernova',
    lastUpdate: '2024-01-04T10:29:58Z'
  }
];

export const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toISOString().slice(11, 16),
      events: Math.floor(Math.random() * 15) + 5,
      correlations: Math.floor(Math.random() * 5) + 1,
      confidence: 0.7 + Math.random() * 0.25
    });
  }
  
  return data;
};