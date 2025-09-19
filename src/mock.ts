import { Event } from '@/lib/api';

export const mockEvents: Event[] = [
  {
    id: 'GW240101_123456',
    type: 'gravitational_wave',
    description: 'Gravitational wave detection from binary black hole merger',
    timestamp: '2024-01-01T12:34:56Z',
    confidence: 0.95,
    coordinates: { ra: 150.2, dec: -45.8 }
  },
  {
    id: 'GRB240101_125012',
    type: 'gamma_ray_burst',
    description: 'Gamma-ray burst detected by Fermi-GBM',
    timestamp: '2024-01-01T12:50:12Z',
    confidence: 0.89,
    coordinates: { ra: 151.1, dec: -44.9 }
  },
  {
    id: 'SN2024ab',
    type: 'supernova',
    description: 'Type Ia supernova detected in galaxy NGC 1234',
    timestamp: '2024-01-02T08:22:15Z',
    confidence: 0.92,
    coordinates: { ra: 203.4, dec: 12.7 }
  },
  {
    id: 'IC240103_142837',
    type: 'neutrino',
    description: 'High-energy neutrino event detected by IceCube',
    timestamp: '2024-01-03T14:28:37Z',
    confidence: 0.72,
    coordinates: { ra: 88.2, dec: 35.1 }
  }
];
