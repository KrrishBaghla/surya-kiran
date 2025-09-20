from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

# Import mock data
from mock_data import get_mock_events, get_mock_correlations

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Surya Kiran Multi-Messenger Observatory API",
    description="Real-time cosmic event correlation and analysis system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global cache for analysis results
analysis_cache: Dict[str, Any] = {
    "phase2_data": [],
    "phase3_data": [],
    "phase4_results": {},
    "phase5_results": [],
    "last_update": None
}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Surya Kiran Multi-Messenger Observatory API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/v1/status")
async def get_status():
    """Get current analysis status"""
    try:
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "phase2_complete": len(analysis_cache["phase2_data"]) > 0,
            "phase3_complete": len(analysis_cache["phase3_data"]) > 0,
            "phase4_complete": bool(analysis_cache["phase4_results"]),
            "phase5_complete": len(analysis_cache["phase5_results"]) > 0,
            "total_events": len(analysis_cache["phase2_data"]),
            "total_correlations": len(analysis_cache["phase5_results"]),
            "last_update": analysis_cache["last_update"]
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
        # Mock data sources for Vercel deployment
        return {
            "data_sources": [
                {
                    "name": "GWOSC",
                    "type": "gravitational_wave",
                    "description": "Gravitational Wave Open Science Center",
                    "status": "active",
                    "events_count": 15
                },
                {
                    "name": "HEASARC",
                    "type": "gamma_ray_burst",
                    "description": "High Energy Astrophysics Science Archive Research Center",
                    "status": "active",
                    "events_count": 15
                },
                {
                    "name": "ZTF",
                    "type": "optical_transient",
                    "description": "Zwicky Transient Facility",
                    "status": "active",
                    "events_count": 20
                },
                {
                    "name": "TNS",
                    "type": "supernova",
                    "description": "Transient Name Server",
                    "status": "active",
                    "events_count": 15
                },
                {
                    "name": "ICECUBE",
                    "type": "neutrino",
                    "description": "IceCube Neutrino Observatory",
                    "status": "active",
                    "events_count": 10
                },
                {
                    "name": "CHIME",
                    "type": "radio_burst",
                    "description": "Canadian Hydrogen Intensity Mapping Experiment",
                    "status": "active",
                    "events_count": 8
                }
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
        # Mock live correlation for Vercel deployment
        return {
            "status": "success",
            "message": "Live correlation analysis completed (mock mode)",
            "timestamp": datetime.now().isoformat(),
            "parameters": request,
            "results": {
                "total_correlations": 5,
                "high_priority": 2,
                "medium_priority": 2,
                "low_priority": 1,
                "average_confidence": 0.75
            }
        }
    except Exception as e:
        logger.error(f"Live correlation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Live correlation analysis failed: {str(e)}")

@app.get("/api/v1/priority-levels")
async def get_priority_levels():
    """Get information about priority levels and thresholds"""
    return {
        "priority_levels": {
            "CRITICAL": {
                "name": "CRITICAL",
                "threshold": 0.90,
                "description": "Immediate follow-up required - potential breakthrough discovery"
            },
            "HIGH": {
                "name": "HIGH",
                "threshold": 0.80,
                "description": "High priority - significant scientific interest"
            },
            "MEDIUM": {
                "name": "MEDIUM",
                "threshold": 0.65,
                "description": "Medium priority - routine correlation"
            },
            "LOW": {
                "name": "LOW",
                "threshold": 0.0,
                "description": "Low priority - background correlation"
            }
        },
        "event_types": [
            "gravitational_wave",
            "gamma_burst",
            "optical_transient",
            "neutrino",
            "radio_burst"
        ],
        "timestamp": datetime.now().isoformat()
    }

# Handler for Vercel serverless functions
def handler(request):
    return app(request.scope, request.receive, request.send)
