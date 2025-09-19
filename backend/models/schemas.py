from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum

class PriorityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ScientificInterest(str, Enum):
    BREAKTHROUGH = "BREAKTHROUGH"
    SIGNIFICANT = "SIGNIFICANT"
    ROUTINE = "ROUTINE"
    BACKGROUND = "BACKGROUND"

class EventType(str, Enum):
    GRAVITATIONAL_WAVE = "gravitational_wave"
    GAMMA_BURST = "gamma_burst"
    OPTICAL_TRANSIENT = "optical_transient"
    SUPERNOVA = "supernova"
    NEUTRINO = "neutrino"

class SourceType(str, Enum):
    GWOSC = "GWOSC"
    HEASARC = "HEASARC"
    ZTF = "ZTF"
    TNS = "TNS"
    ICECUBE = "ICECUBE"

class EventResponse(BaseModel):
    id: str
    source: SourceType
    event_type: EventType
    time: str
    ra: Optional[float] = None
    dec: Optional[float] = None
    confidence: float = Field(ge=0.0, le=1.0)
    priority: PriorityLevel
    metadata: Dict[str, Any] = {}

class CorrelationResponse(BaseModel):
    id: str
    event1_id: str
    event2_id: str
    event1_source: SourceType
    event2_source: SourceType
    confidence: float = Field(ge=0.0, le=1.0)
    time_separation: float = Field(description="Time separation in hours")
    angular_separation: Optional[float] = Field(description="Angular separation in degrees")
    cross_messenger: bool
    priority: PriorityLevel
    scientific_interest: ScientificInterest
    follow_up_recommended: bool
    scoring_notes: str

class DataCollectionRequest(BaseModel):
    gw_limit: int = Field(default=15, ge=1, le=100, description="Maximum GW events to collect")
    ztf_limit: int = Field(default=20, ge=1, le=100, description="Maximum ZTF events to collect")
    tns_limit: int = Field(default=15, ge=1, le=100, description="Maximum TNS events to collect")
    grb_limit: int = Field(default=15, ge=1, le=100, description="Maximum GRB events to collect")

class AnalysisRequest(BaseModel):
    adaptive_mode: bool = Field(default=True, description="Enable adaptive threshold adjustment")
    priority_thresholds: Optional[Dict[str, float]] = Field(
        default=None,
        description="Custom priority thresholds"
    )
    export_results: bool = Field(default=True, description="Export results after analysis")

class AnalysisStatus(BaseModel):
    status: str
    timestamp: str
    phase2_complete: bool = False
    phase3_complete: bool = False
    phase4_complete: bool = False
    phase5_complete: bool = False
    total_events: Optional[int] = None
    total_correlations: Optional[int] = None

class SummaryStats(BaseModel):
    total_events: int
    events_by_source: Dict[str, int]
    events_by_type: Dict[str, int]
    events_with_coordinates: int
    total_correlations: int
    high_priority_correlations: int
    cross_messenger_correlations: int
    average_confidence: float

class APIResponse(BaseModel):
    status: str
    message: str
    timestamp: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
