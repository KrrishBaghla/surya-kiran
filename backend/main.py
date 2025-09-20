from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

# Import our multi-messenger correlator modules
from correlator.phase2_correlator import run_pandas_free_correlator
from correlator.phase3_normalizer import Phase3DataNormalizer
from correlator.phase4_analyzer import run_enhanced_phase4_analysis
from correlator.phase5_scorer import run_enhanced_phase5_analysis
from models.schemas import (
    EventResponse, CorrelationResponse, AnalysisStatus, 
    DataCollectionRequest, AnalysisRequest
)
from correlator.live_correlation_engine import (
    LiveCorrelationEngine, CorrelationParameters, EventType, PriorityLevel
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Multi-Messenger Event Correlator API",
    description="Advanced correlation analysis for cosmic events from multiple observatories",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for analysis results
analysis_cache = {
    "phase2_data": None,
    "phase3_data": None,
    "phase4_results": None,
    "phase5_results": None,
    "last_analysis": None
}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Multi-Messenger Event Correlator API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "data_collection": "/api/v1/collect-data",
            "correlation_analysis": "/api/v1/analyze-correlations",
            "get_results": "/api/v1/results",
            "export_data": "/api/v1/export/{format}",
            "status": "/api/v1/status"
        }
    }

@app.get("/api/v1/status")
async def get_status():
    """Get current system status and analysis state"""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "analysis_cache": {
            "has_phase2": analysis_cache["phase2_data"] is not None,
            "has_phase3": analysis_cache["phase3_data"] is not None,
            "has_phase4": analysis_cache["phase4_results"] is not None,
            "has_phase5": analysis_cache["phase5_results"] is not None,
            "last_analysis": analysis_cache["last_analysis"]
        }
    }

@app.post("/api/v1/collect-data")
async def collect_data(request: DataCollectionRequest, background_tasks: BackgroundTasks):
    """Collect data from all observatory sources (Phase 2)"""
    try:
        logger.info("Starting data collection from all sources...")
        
        # Run Phase 2 data collection
        data_manager, analyzer = run_pandas_free_correlator()
        
        # Cache the results
        analysis_cache["phase2_data"] = {
            "data_manager": data_manager,
            "analyzer": analyzer,
            "timestamp": datetime.now().isoformat()
        }
        analysis_cache["last_analysis"] = datetime.now().isoformat()
        
        # Get summary statistics
        summary = analyzer.create_summary_report()
        
        return {
            "status": "success",
            "message": "Data collection completed successfully",
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_events": summary["total_events"],
                "events_by_source": summary["events_by_source"],
                "events_by_type": summary["events_by_type"],
                "events_with_coordinates": summary["events_with_coordinates"]
            }
        }
        
    except Exception as e:
        logger.error(f"Data collection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Data collection failed: {str(e)}")

@app.post("/api/v1/analyze-correlations")
async def analyze_correlations(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Run complete correlation analysis pipeline (Phases 3-5)"""
    try:
        if not analysis_cache["phase2_data"]:
            raise HTTPException(status_code=400, detail="No data available. Please run data collection first.")
        
        logger.info("Starting correlation analysis pipeline...")
        
        # Phase 3: Data normalization
        logger.info("Running Phase 3: Data normalization...")
        analyzer = analysis_cache["phase2_data"]["analyzer"]
        normalizer = Phase3DataNormalizer()
        normalized_df = normalizer.normalize_events_from_analyzer(analyzer)
        
        analysis_cache["phase3_data"] = {
            "normalized_df": normalized_df,
            "timestamp": datetime.now().isoformat()
        }
        
        # Phase 4: Correlation analysis
        logger.info("Running Phase 4: Correlation analysis...")
        phase4_results = run_enhanced_phase4_analysis()
        
        analysis_cache["phase4_results"] = {
            "results": phase4_results,
            "timestamp": datetime.now().isoformat()
        }
        
        # Phase 5: Enhanced scoring
        logger.info("Running Phase 5: Enhanced scoring...")
        phase5_results = run_enhanced_phase5_analysis()
        
        analysis_cache["phase5_results"] = {
            "results": phase5_results,
            "timestamp": datetime.now().isoformat()
        }
        
        analysis_cache["last_analysis"] = datetime.now().isoformat()
        
        return {
            "status": "success",
            "message": "Correlation analysis completed successfully",
            "timestamp": datetime.now().isoformat(),
            "results": {
                "phase3_events": len(normalized_df),
                "phase4_correlations": len(phase4_results.get("joint_correlations", [])),
                "phase5_scored": len(phase5_results.get("scored_correlations", []))
            }
        }
        
    except Exception as e:
        logger.error(f"Correlation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

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
        
        phase5_results = analysis_cache["phase5_results"]["results"]
        scored_correlations = phase5_results.get("scored_correlations", [])
        
        # Convert to API response format
        correlations = []
        for corr in scored_correlations:
            correlations.append({
                "id": f"{corr.event1_id}_{corr.event2_id}",
                "event1_id": corr.event1_id,
                "event2_id": corr.event2_id,
                "event1_source": corr.event1_source,
                "event2_source": corr.event2_source,
                "confidence": float(corr.combined_confidence),
                "time_separation": float(corr.time_separation_hours),
                "angular_separation": float(corr.angular_separation_deg) if corr.angular_separation_deg is not None else None,
                "cross_messenger": corr.cross_messenger_bonus > 0,
                "priority": corr.priority_tier,
                "scientific_interest": corr.scientific_interest,
                "follow_up_recommended": corr.follow_up_recommended,
                "scoring_notes": corr.scoring_notes
            })
        
        # Sort by confidence
        correlations.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Convert summary stats to JSON-serializable format
        summary_stats = phase5_results.get("summary_stats", {})
        json_summary_stats = {}
        for key, value in summary_stats.items():
            if hasattr(value, 'item'):  # numpy scalar
                json_summary_stats[key] = value.item()
            else:
                json_summary_stats[key] = value

        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "total_correlations": len(correlations),
            "correlations": correlations[:50],  # Return top 50
            "summary_stats": json_summary_stats
        }
        
    except Exception as e:
        logger.error(f"Failed to get results: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get results: {str(e)}")

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
        
        analyzer = analysis_cache["phase2_data"]["analyzer"]
        all_events = analyzer.all_events
        
        # Convert to API response format
        events = []
        for event in all_events:
            # Convert numpy types to Python types
            ra = event.get("ra")
            dec = event.get("dec")
            if ra is not None and hasattr(ra, 'item'):
                ra = ra.item()
            if dec is not None and hasattr(dec, 'item'):
                dec = dec.item()
                
            events.append({
                "id": event.get("event_id", "unknown"),
                "source": event.get("source", "unknown"),
                "event_type": event.get("event_type", "unknown"),
                "time": event.get("time", ""),
                "ra": ra,
                "dec": dec,
                "confidence": 0.8,  # Default confidence
                "priority": "MEDIUM",  # Default priority
                "metadata": event.get("metadata", {})
            })
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "total_events": len(events),
            "events": events
        }
        
    except Exception as e:
        logger.error(f"Failed to get events: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get events: {str(e)}")

@app.get("/api/v1/export/{format}")
async def export_data(format: str):
    """Export analysis results in specified format"""
    try:
        if format not in ["json", "csv"]:
            raise HTTPException(status_code=400, detail="Format must be 'json' or 'csv'")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format == "json":
            if not analysis_cache["phase5_results"]:
                raise HTTPException(status_code=404, detail="No results to export")
            
            filename = f"multi_messenger_results_{timestamp}.json"
            filepath = f"exports/{filename}"
            
            # Ensure exports directory exists
            os.makedirs("exports", exist_ok=True)
            
            # Export results
            export_data = {
                "metadata": {
                    "export_timestamp": timestamp,
                    "api_version": "1.0.0"
                },
                "analysis_cache": analysis_cache
            }
            
            with open(filepath, 'w') as f:
                json.dump(export_data, f, indent=2, default=str)
            
            return FileResponse(
                path=filepath,
                filename=filename,
                media_type="application/json"
            )
        
        elif format == "csv":
            if not analysis_cache["phase5_results"]:
                raise HTTPException(status_code=404, detail="No results to export")
            
            filename = f"multi_messenger_correlations_{timestamp}.csv"
            filepath = f"exports/{filename}"
            
            # Ensure exports directory exists
            os.makedirs("exports", exist_ok=True)
            
            # Export correlations as CSV
            import pandas as pd
            phase5_results = analysis_cache["phase5_results"]["results"]
            scored_correlations = phase5_results.get("scored_correlations", [])
            
            if scored_correlations:
                # Convert to DataFrame
                df_data = []
                for corr in scored_correlations:
                    df_data.append({
                        "event1_id": corr.event1_id,
                        "event2_id": corr.event2_id,
                        "event1_source": corr.event1_source,
                        "event2_source": corr.event2_source,
                        "confidence": corr.combined_confidence,
                        "time_separation_hours": corr.time_separation_hours,
                        "angular_separation_deg": corr.angular_separation_deg,
                        "priority": corr.priority_tier,
                        "scientific_interest": corr.scientific_interest,
                        "follow_up_recommended": corr.follow_up_recommended
                    })
                
                df = pd.DataFrame(df_data)
                df.to_csv(filepath, index=False)
                
                return FileResponse(
                    path=filepath,
                    filename=filename,
                    media_type="text/csv"
                )
            else:
                raise HTTPException(status_code=404, detail="No correlations to export")
        
    except Exception as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/v1/data-sources")
async def get_data_sources():
    """Get information about all data sources"""
    try:
        engine = LiveCorrelationEngine()
        return engine.get_data_sources_info()
    except Exception as e:
        logger.error(f"Failed to get data sources: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get data sources: {str(e)}")

@app.post("/api/v1/live-correlation")
async def run_live_correlation_analysis(request: dict):
    """Run live correlation analysis with custom parameters"""
    try:
        # Parse request parameters
        event_types = [EventType(et) for et in request.get('event_types', [
            'gravitational_wave', 'gamma_burst', 'optical_transient', 'neutrino', 'radio_burst'
        ])]
        
        params = CorrelationParameters(
            event_types=event_types,
            ra_min=request.get('ra_min', 0.0),
            ra_max=request.get('ra_max', 360.0),
            dec_min=request.get('dec_min', -90.0),
            dec_max=request.get('dec_max', 90.0),
            confidence_threshold=request.get('confidence_threshold', 0.1),
            max_angular_separation=request.get('max_angular_separation', 10.0),
            max_time_separation=request.get('max_time_separation', 72.0),
            gw_limit=request.get('gw_limit', 15),
            ztf_limit=request.get('ztf_limit', 20),
            tns_limit=request.get('tns_limit', 15),
            grb_limit=request.get('grb_limit', 15)
        )
        
        logger.info("Starting live correlation analysis...")
        engine = LiveCorrelationEngine()
        results = await engine.run_live_correlation_analysis(params)
        
        return results
        
    except Exception as e:
        logger.error(f"Live correlation analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Live correlation analysis failed: {str(e)}")

@app.get("/api/v1/priority-levels")
async def get_priority_levels():
    """Get information about priority levels and thresholds"""
    engine = LiveCorrelationEngine()
    return {
        "priority_levels": {
            level.value: {
                "name": level.value,
                "threshold": engine.priority_thresholds[level],
                "description": {
                    PriorityLevel.CRITICAL: "Immediate follow-up required - potential breakthrough discovery",
                    PriorityLevel.HIGH: "High priority - significant scientific interest",
                    PriorityLevel.MEDIUM: "Medium priority - routine correlation",
                    PriorityLevel.LOW: "Low priority - background correlation"
                }[level]
            } for level in PriorityLevel
        },
        "event_types": [et.value for et in EventType],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    # Ensure exports directory exists
    os.makedirs("exports", exist_ok=True)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
