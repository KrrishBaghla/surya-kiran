import { Event } from '@/lib/api';

export const mockEvents: Event[] = [
  {
    id: 'GW240101_123456',
    source: 'GWOSC',
    event_type: 'gravitational_wave',
    type: 'gravitational_wave',
    time: '2024-01-01T12:34:56Z',
    timestamp: '2024-01-01T12:34:56Z',
    ra: 150.2,
    dec: -45.8,
    coordinates: { ra: 150.2, dec: -45.8 },
    confidence: 0.95,
    priority: 'HIGH',
    description: 'Gravitational wave detection from binary black hole merger',
    metadata: {}
  },
  {
    id: 'GRB240101_125012',
    source: 'HEASARC',
    event_type: 'gamma_ray_burst',
    type: 'gamma_ray_burst',
    time: '2024-01-01T12:50:12Z',
    timestamp: '2024-01-01T12:50:12Z',
    ra: 151.1,
    dec: -44.9,
    coordinates: { ra: 151.1, dec: -44.9 },
    confidence: 0.89,
    priority: 'HIGH',
    description: 'Gamma-ray burst detected by Fermi-GBM',
    metadata: {}
  },
  {
    id: 'SN2024ab',
    source: 'TNS',
    event_type: 'supernova',
    type: 'supernova',
    time: '2024-01-02T08:22:15Z',
    timestamp: '2024-01-02T08:22:15Z',
    ra: 203.4,
    dec: 12.7,
    coordinates: { ra: 203.4, dec: 12.7 },
    confidence: 0.92,
    priority: 'MEDIUM',
    description: 'Type Ia supernova detected in galaxy NGC 1234',
    metadata: {}
  },
  {
    id: 'IC240103_142837',
    source: 'ICECUBE',
    event_type: 'neutrino',
    type: 'neutrino',
    time: '2024-01-03T14:28:37Z',
    timestamp: '2024-01-03T14:28:37Z',
    ra: 88.2,
    dec: 35.1,
    coordinates: { ra: 88.2, dec: 35.1 },
    confidence: 0.72,
    priority: 'MEDIUM',
    description: 'High-energy neutrino event detected by IceCube',
    metadata: {}
  }
];
