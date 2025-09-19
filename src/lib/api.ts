const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Event {
  id: string;
  source: string;
  event_type: string;
  time: string;
  ra?: number;
  dec?: number;
  confidence: number;
  priority: string;
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
    return this.request('/collect-data', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Correlation Analysis
  async analyzeCorrelations(request: AnalysisRequest = {}): Promise<any> {
    return this.request('/analyze-correlations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get Results
  async getResults(): Promise<{ correlations: Correlation[]; total_correlations: number; summary_stats: any }> {
    return this.request('/results');
  }

  // Get Events
  async getEvents(): Promise<{ events: Event[]; total_events: number }> {
    return this.request('/events');
  }

  // Get Status
  async getStatus(): Promise<AnalysisStatus> {
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
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
