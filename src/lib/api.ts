import { mockEvents } from '@/mock';

// Use mock data in production since backend is not deployed
const USE_MOCK_DATA = process.env.NODE_ENV === 'production' || true;
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://surya-kiran-sr1e.vercel.app/api/v1'
  : 'http://localhost:8000/api/v1';

// Mock correlations data
const mockCorrelations: Correlation[] = [
  {
    id: 'corr_001',
    event1_id: 'GW240101_123456',
    event2_id: 'GRB240101_125012',
    event1_source: 'GWOSC',
    event2_source: 'HEASARC',
    confidence: 0.87,
    time_separation: 15.27,
    angular_separation: 0.8,
    cross_messenger: true,
    priority: 'HIGH',
    scientific_interest: 'Potential multi-messenger event',
    follow_up_recommended: true,
    scoring_notes: 'Strong temporal and spatial correlation'
  },
  {
    id: 'corr_002',
    event1_id: 'SN2024ab',
    event2_id: 'IC240103_142837',
    event1_source: 'TNS',
    event2_source: 'ICECUBE',
    confidence: 0.65,
    time_separation: 86400,
    angular_separation: 2.1,
    cross_messenger: true,
    priority: 'MEDIUM',
    scientific_interest: 'Possible supernova-neutrino correlation',
    follow_up_recommended: false,
    scoring_notes: 'Moderate correlation, requires further analysis'
  }
];

// Mock status data
const mockStatus: AnalysisStatus = {
  status: 'active',
  timestamp: new Date().toISOString(),
  phase2_complete: true,
  phase3_complete: true,
  phase4_complete: true,
  phase5_complete: true,
  total_events: mockEvents.length,
  total_correlations: mockCorrelations.length,
  analysis_cache: {
    has_phase5: true
  }
};

export interface Event {
  id: string;
  source: string;
  event_type: string;
  type: string; // Alias for event_type for compatibility
  time: string;
  timestamp: string; // Alias for time for compatibility
  ra?: number;
  dec?: number;
  coordinates?: { ra: number; dec: number }; // For compatibility
  confidence: number;
  priority: string;
  description?: string; // For compatibility
  metadata: Record<string, any>;
}

export interface Correlation {
  id: string;
  event1_id: string;
  event2_id: string;
  event1_source: string;
  event2_source: string;
  confidence: number;
  time_separation: number;
  angular_separation?: number;
  cross_messenger: boolean;
  priority: string;
  scientific_interest: string;
  follow_up_recommended: boolean;
  scoring_notes: string;
}

export interface AnalysisStatus {
  status: string;
  timestamp: string;
  phase2_complete: boolean;
  phase3_complete: boolean;
  phase4_complete: boolean;
  phase5_complete: boolean;
  total_events?: number;
  total_correlations?: number;
  analysis_cache?: {
    has_phase5: boolean;
    [key: string]: any;
  };
}

export interface DataCollectionRequest {
  gw_limit?: number;
  ztf_limit?: number;
  tns_limit?: number;
  grb_limit?: number;
}

export interface AnalysisRequest {
  adaptive_mode?: boolean;
  priority_thresholds?: Record<string, number>;
  export_results?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Data Collection
  async collectData(request: DataCollectionRequest = {}): Promise<any> {
    if (USE_MOCK_DATA) {
      return {
        status: 'success',
        message: 'Mock data collection completed',
        collected_events: mockEvents.length,
        timestamp: new Date().toISOString()
      };
    }
    return this.request('/collect-data', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Correlation Analysis
  async analyzeCorrelations(request: AnalysisRequest = {}): Promise<any> {
    if (USE_MOCK_DATA) {
      return {
        status: 'success',
        message: 'Mock correlation analysis completed',
        correlations_found: mockCorrelations.length,
        timestamp: new Date().toISOString()
      };
    }
    return this.request('/analyze-correlations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get Results
  async getResults(): Promise<{ correlations: Correlation[]; total_correlations: number; summary_stats: any }> {
    if (USE_MOCK_DATA) {
      return {
        correlations: mockCorrelations,
        total_correlations: mockCorrelations.length,
        summary_stats: {
          high_priority: mockCorrelations.filter(c => c.priority === 'HIGH').length,
          cross_messenger: mockCorrelations.filter(c => c.cross_messenger).length,
          avg_confidence: mockCorrelations.reduce((sum, c) => sum + c.confidence, 0) / mockCorrelations.length
        }
      };
    }
    return this.request('/results');
  }

  // Get Events
  async getEvents(): Promise<{ events: Event[]; total_events: number }> {
    if (USE_MOCK_DATA) {
      return {
        events: mockEvents,
        total_events: mockEvents.length
      };
    }
    return this.request('/events');
  }

  // Get Status
  async getStatus(): Promise<AnalysisStatus> {
    if (USE_MOCK_DATA) {
      return mockStatus;
    }
    return this.request('/status');
  }

  // Export Data
  async exportData(format: 'json' | 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/export/${format}`);
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }
    return response.blob();
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    if (USE_MOCK_DATA) {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0-mock'
      };
    }
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
