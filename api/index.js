const express = require('express');
const cors = require('cors');

const app = express();

// CORS middleware
app.use(cors());
app.use(express.json());

// In-memory cache for analysis results
let analysisCache = {
  phase2_data: [],
  phase4_results: {},
  phase5_results: [],
  last_update: null
};

// Mock data functions
function getMockEvents() {
  return [
    {
      id: "GW240101_123456",
      source: "GWOSC",
      event_type: "gravitational_wave",
      type: "gravitational_wave",
      time: "2024-01-01T12:34:56Z",
      timestamp: "2024-01-01T12:34:56Z",
      ra: 150.2,
      dec: -45.8,
      coordinates: { ra: 150.2, dec: -45.8 },
      confidence: 0.95,
      priority: "HIGH",
      description: "Gravitational wave detection from binary black hole merger",
      metadata: {}
    },
    {
      id: "GRB240101_125012",
      source: "HEASARC",
      event_type: "gamma_burst",
      type: "gamma_burst",
      time: "2024-01-01T12:50:12Z",
      timestamp: "2024-01-01T12:50:12Z",
      ra: 150.5,
      dec: -45.9,
      coordinates: { ra: 150.5, dec: -45.9 },
      confidence: 0.88,
      priority: "MEDIUM",
      description: "Gamma-ray burst detection",
      metadata: {}
    }
  ];
}

function getMockCorrelations() {
  return [
    {
      id: "corr_001",
      event1_id: "GW240101_123456",
      event2_id: "GRB240101_125012",
      event1_source: "GWOSC",
      event2_source: "HEASARC",
      correlation_score: 0.95,
      temporal_separation_hours: 0.26,
      angular_separation_degrees: 0.8,
      confidence: 0.95,
      priority: "CRITICAL",
      scientific_interest: "BREAKTHROUGH",
      follow_up_recommended: true,
      scoring_notes: "High-confidence multi-messenger correlation"
    }
  ];
}

// Routes
app.get('/', (req, res) => {
  try {
    res.json({
      message: "Surya Kiran Multi-Messenger Observatory API",
      version: "1.0.0",
      status: "operational",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Root endpoint error:', error);
    res.json({
      message: "Surya Kiran Multi-Messenger Observatory API",
      version: "1.0.0",
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/v1/health', (req, res) => {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.json({
      status: "error",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      error: error.message
    });
  }
});

app.get('/api/v1/status', (req, res) => {
  try {
    res.json({
      status: "idle",
      timestamp: new Date().toISOString(),
      phase2_complete: analysisCache.phase2_data.length > 0,
      phase3_complete: Object.keys(analysisCache.phase4_results).length > 0,
      phase4_complete: Object.keys(analysisCache.phase4_results).length > 0,
      phase5_complete: analysisCache.phase5_results.length > 0,
      total_events: analysisCache.phase2_data.length,
      total_correlations: analysisCache.phase5_results.length,
      analysis_cache: {
        has_phase5: analysisCache.phase5_results.length > 0
      }
    });
  } catch (error) {
    console.error('Failed to get status:', error);
    res.status(500).json({ error: `Failed to get status: ${error.message}` });
  }
});

app.post('/api/v1/collect-data', (req, res) => {
  try {
    console.log('Starting data collection...');
    
    // Use mock data for Vercel deployment
    const mockEvents = getMockEvents();
    analysisCache.phase2_data = mockEvents;
    analysisCache.last_update = new Date().toISOString();
    
    res.json({
      status: "success",
      message: "Data collection completed (mock mode)",
      timestamp: new Date().toISOString(),
      total_events: analysisCache.phase2_data.length,
      events_by_source: {
        GWOSC: 1,
        HEASARC: 1,
        TNS: 1,
        ICECUBE: 1,
        CHIME: 1
      }
    });
  } catch (error) {
    console.error('Data collection failed:', error);
    res.status(500).json({ error: `Data collection failed: ${error.message}` });
  }
});

app.post('/api/v1/analyze-correlations', (req, res) => {
  try {
    console.log('Starting correlation analysis pipeline...');
    
    // Use mock data for Vercel deployment
    const mockCorrelations = getMockCorrelations();
    analysisCache.phase5_results = mockCorrelations;
    analysisCache.phase4_results = {
      correlations: mockCorrelations,
      summary: { total_correlations: mockCorrelations.length }
    };
    analysisCache.last_update = new Date().toISOString();
    
    res.json({
      status: "success",
      message: "Correlation analysis completed (mock mode)",
      timestamp: new Date().toISOString(),
      total_correlations: analysisCache.phase5_results.length,
      analysis_summary: analysisCache.phase4_results.summary || {}
    });
  } catch (error) {
    console.error('Correlation analysis failed:', error);
    res.status(500).json({ error: `Correlation analysis failed: ${error.message}` });
  }
});

app.get('/api/v1/events', (req, res) => {
  try {
    if (analysisCache.phase2_data.length === 0) {
      return res.json({
        status: "success",
        timestamp: new Date().toISOString(),
        total_events: 0,
        events: [],
        message: "No events available. Please run data collection first."
      });
    }
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      total_events: analysisCache.phase2_data.length,
      events: analysisCache.phase2_data
    });
  } catch (error) {
    console.error('Failed to get events:', error);
    res.status(500).json({ error: `Failed to get events: ${error.message}` });
  }
});

app.get('/api/v1/results', (req, res) => {
  try {
    if (analysisCache.phase5_results.length === 0) {
      return res.json({
        status: "success",
        timestamp: new Date().toISOString(),
        total_correlations: 0,
        correlations: [],
        summary_stats: {},
        message: "No analysis results available. Please run correlation analysis first."
      });
    }
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      total_correlations: analysisCache.phase5_results.length,
      correlations: analysisCache.phase5_results,
      summary_stats: analysisCache.phase4_results.summary || {}
    });
  } catch (error) {
    console.error('Failed to get results:', error);
    res.status(500).json({ error: `Failed to get results: ${error.message}` });
  }
});

app.get('/api/v1/data-sources', (req, res) => {
  try {
    res.json({
      data_sources: [
        { name: "GWOSC", type: "Gravitational Wave", status: "Operational", last_event: "2024-01-01T12:34:56Z" },
        { name: "HEASARC", type: "Gamma-Ray Burst", status: "Operational", last_event: "2024-01-01T12:50:12Z" },
        { name: "ZTF", type: "Optical Transient", status: "Operational", last_event: "2024-01-02T08:22:15Z" },
        { name: "TNS", type: "Supernova", status: "Operational", last_event: "2024-01-02T08:22:15Z" },
        { name: "ICECUBE", type: "Neutrino", status: "Operational", last_event: "2024-01-03T14:28:37Z" },
        { name: "CHIME", type: "Radio Burst", status: "Operational", last_event: "2024-01-04T06:10:00Z" }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get data sources:', error);
    res.status(500).json({ error: `Failed to get data sources: ${error.message}` });
  }
});

app.post('/api/v1/live-correlation', (req, res) => {
  try {
    // This endpoint will also return mock data for Vercel deployment
    const mockCorrelations = getMockCorrelations();
    res.json({
      status: "success",
      message: "Live correlation analysis completed (mock mode)",
      timestamp: new Date().toISOString(),
      total_correlations: mockCorrelations.length,
      correlations: mockCorrelations
    });
  } catch (error) {
    console.error('Live correlation analysis failed:', error);
    res.status(500).json({ error: `Live correlation analysis failed: ${error.message}` });
  }
});

app.get('/api/v1/priority-levels', (req, res) => {
  try {
    res.json({
      priority_levels: {
        CRITICAL: { name: "CRITICAL", threshold: 0.90, description: "Immediate follow-up required - potential breakthrough discovery" },
        HIGH: { name: "HIGH", threshold: 0.80, description: "High priority - significant scientific interest" },
        MEDIUM: { name: "MEDIUM", threshold: 0.65, description: "Medium priority - routine correlation" },
        LOW: { name: "LOW", threshold: 0.0, description: "Low priority - background correlation" }
      },
      event_types: ["gravitational_wave", "gamma_burst", "optical_transient", "neutrino", "radio_burst"],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get priority levels:', error);
    res.status(500).json({ error: `Failed to get priority levels: ${error.message}` });
  }
});

// Export the app for Vercel
module.exports = app;
