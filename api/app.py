from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime
from typing import Dict, Any, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Surya Kiran Observatory API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for analysis results
analysis_cache: Dict[str, Any] = {
    "phase2_data": [],
    "phase4_results": {},
    "phase5_results": [],
    "last_update": None
}

# Mock data functions
def get_mock_events():
    """Generate mock events for demonstration"""
    return [
        {
            "id": "GW240101_123456",
            "source": "GWOSC",
            "event_type": "gravitational_wave",
            "type": "gravitational_wave",
            "time": "2024-01-01T12:34:56Z",
            "timestamp": "2024-01-01T12:34:56Z",
            "ra": 150.2,
            "dec": -45.8,
            "coordinates": {"ra": 150.2, "dec": -45.8},
            "confidence": 0.95,
            "priority": "HIGH",
            "description": "Gravitational wave detection from binary black hole merger",
            "metadata": {}
        },
        {
            "id": "GRB240101_125012",
            "source": "HEASARC",
            "event_type": "gamma_burst",
            "type": "gamma_burst",
            "time": "2024-01-01T12:50:12Z",
            "timestamp": "2024-01-01T12:50:12Z",
            "ra": 150.5,
            "dec": -45.9,
            "coordinates": {"ra": 150.5, "dec": -45.9},
            "confidence": 0.88,
            "priority": "MEDIUM",
            "description": "Gamma-ray burst detection",
            "metadata": {}
        }
    ]

def get_mock_correlations():
    """Generate mock correlations for demonstration"""
    return [
        {
            "id": "corr_001",
            "event1_id": "GW240101_123456",
            "event2_id": "GRB240101_125012",
            "event1_source": "GWOSC",
            "event2_source": "HEASARC",
            "correlation_score": 0.95,
            "temporal_separation_hours": 0.26,
            "angular_separation_degrees": 0.8,
            "confidence": 0.95,
            "priority": "CRITICAL",
            "scientific_interest": "BREAKTHROUGH",
            "follow_up_recommended": True,
            "scoring_notes": "High-confidence multi-messenger correlation"
        }
    ]

@app.get("/")
async def root():
    """Root endpoint"""
    try:
        return {
            "message": "Surya Kiran Multi-Messenger Observatory API",
            "version": "1.0.0",
            "status": "operational",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Root endpoint error: {e}")
        return {
            "message": "Surya Kiran Multi-Messenger Observatory API",
            "version": "1.0.0",
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    try:
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "error": str(e)
        }

@app.get("/api/v1/status")
async def get_status():
    """Get current analysis status"""
    try:
        return {
            "status": "idle",
            "timestamp": datetime.now().isoformat(),
            "phase2_complete": bool(analysis_cache["phase2_data"]),
            "phase3_complete": bool(analysis_cache["phase4_results"]),
            "phase4_complete": bool(analysis_cache["phase4_results"]),
            "phase5_complete": bool(analysis_cache["phase5_results"]),
            "total_events": len(analysis_cache["phase2_data"]),
            "total_correlations": len(analysis_cache["phase5_results"]),
            "analysis_cache": {
                "has_phase5": bool(analysis_cache["phase5_results"])
            }
        }
    except Exception as e:
        logger.error(f"Failed to get status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")

@app.post("/api/v1/collect-data")
async def collect_data(request: dict = None):
    """Collect data from all sources"""
    try:
        logger.info("Starting data collection...")
        
        # Use mock data for Vercel deployment
        mock_events = get_mock_events()
        analysis_cache["phase2_data"] = mock_events
        analysis_cache["last_update"] = datetime.now().isoformat()
        
        return {
            "status": "success",
            "message": "Data collection completed (mock mode)",
            "timestamp": datetime.now().isoformat(),
            "total_events": len(analysis_cache["phase2_data"]),
            "events_by_source": {
                "GWOSC": 1,
                "HEASARC": 1,
                "TNS": 1,
                "ICECUBE": 1,
                "CHIME": 1
            }
        }
        
    except Exception as e:
        logger.error(f"Data collection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Data collection failed: {str(e)}")

@app.post("/api/v1/analyze-correlations")
async def analyze_correlations(request: dict = None):
    """Run correlation analysis pipeline"""
    try:
        logger.info("Starting correlation analysis pipeline...")
        
        # Use mock data for Vercel deployment
        mock_correlations = get_mock_correlations()
        analysis_cache["phase5_results"] = mock_correlations
        analysis_cache["phase4_results"] = {
            "correlations": mock_correlations,
            "summary": {"total_correlations": len(mock_correlations)}
        }
        analysis_cache["last_update"] = datetime.now().isoformat()
        
        return {
            "status": "success",
            "message": "Correlation analysis completed (mock mode)",
            "timestamp": datetime.now().isoformat(),
            "total_correlations": len(analysis_cache["phase5_results"]),
            "analysis_summary": analysis_cache["phase4_results"].get("summary", {})
        }
        
    except Exception as e:
        logger.error(f"Correlation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Correlation analysis failed: {str(e)}")

@app.get("/api/v1/events")
async def get_events():
    """Get all collected events"""
    try:
        if not analysis_cache["phase2_data"]:
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "total_events": 0,
                "events": [],
                "message": "No events available. Please run data collection first."
            }
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "total_events": len(analysis_cache["phase2_data"]),
            "events": analysis_cache["phase2_data"]
        }
    except Exception as e:
        logger.error(f"Failed to get events: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get events: {str(e)}")

@app.get("/api/v1/results")
async def get_results():
    """Get current analysis results"""
    try:
        if not analysis_cache["phase5_results"]:
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "total_correlations": 0,
                "correlations": [],
                "summary_stats": {},
                "message": "No analysis results available. Please run correlation analysis first."
            }
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "total_correlations": len(analysis_cache["phase5_results"]),
            "correlations": analysis_cache["phase5_results"],
            "summary_stats": analysis_cache["phase4_results"].get("summary", {})
        }
    except Exception as e:
        logger.error(f"Failed to get results: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get results: {str(e)}")

@app.get("/api/v1/data-sources")
async def get_data_sources():
    """Get information about all data sources"""
    try:
        return {
            "data_sources": [
                {"name": "GWOSC", "type": "Gravitational Wave", "status": "Operational", "last_event": "2024-01-01T12:34:56Z"},
                {"name": "HEASARC", "type": "Gamma-Ray Burst", "status": "Operational", "last_event": "2024-01-01T12:50:12Z"},
                {"name": "ZTF", "type": "Optical Transient", "status": "Operational", "last_event": "2024-01-02T08:22:15Z"},
                {"name": "TNS", "type": "Supernova", "status": "Operational", "last_event": "2024-01-02T08:22:15Z"},
                {"name": "ICECUBE", "type": "Neutrino", "status": "Operational", "last_event": "2024-01-03T14:28:37Z"},
                {"name": "CHIME", "type": "Radio Burst", "status": "Operational", "last_event": "2024-01-04T06:10:00Z"}
            ],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get data sources: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get data sources: {str(e)}")

@app.post("/api/v1/live-correlation")
async def run_live_correlation_analysis(request: dict):
    """Run live correlation analysis with custom parameters"""
    try:
        # This endpoint will also return mock data for Vercel deployment
        mock_correlations = get_mock_correlations()
        return {
            "status": "success",
            "message": "Live correlation analysis completed (mock mode)",
            "timestamp": datetime.now().isoformat(),
            "total_correlations": len(mock_correlations),
            "correlations": mock_correlations
        }
    except Exception as e:
        logger.error(f"Live correlation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Live correlation analysis failed: {str(e)}")

@app.get("/api/v1/priority-levels")
async def get_priority_levels():
    """Get information about priority levels and thresholds"""
    try:
        return {
            "priority_levels": {
                "CRITICAL": {"name": "CRITICAL", "threshold": 0.90, "description": "Immediate follow-up required - potential breakthrough discovery"},
                "HIGH": {"name": "HIGH", "threshold": 0.80, "description": "High priority - significant scientific interest"},
                "MEDIUM": {"name": "MEDIUM", "threshold": 0.65, "description": "Medium priority - routine correlation"},
                "LOW": {"name": "LOW", "threshold": 0.0, "description": "Low priority - background correlation"}
            },
            "event_types": ["gravitational_wave", "gamma_burst", "optical_transient", "neutrino", "radio_burst"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get priority levels: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get priority levels: {str(e)}")

# Export the app for Vercel
app = app
