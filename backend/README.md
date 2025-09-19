# Multi-Messenger Event Correlator Backend

A comprehensive FastAPI backend that implements advanced multi-messenger astronomy correlation analysis across multiple phases.

## Features

- **Phase 2**: Data collection from multiple observatory sources (GWOSC, ZTF, TNS, HEASARC)
- **Phase 3**: Data normalization and preprocessing
- **Phase 4**: Advanced correlation analysis with adaptive thresholds
- **Phase 5**: Enhanced scoring with cross-messenger bonuses
- **RESTful API**: Complete API for frontend integration
- **Export capabilities**: JSON and CSV export functionality

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the startup script:
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. The API will be available at:
   - **Backend**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Health Check**: http://localhost:8000/api/v1/health

## API Endpoints

### Core Endpoints

- `POST /api/v1/collect-data` - Collect data from all observatory sources
- `POST /api/v1/analyze-correlations` - Run complete correlation analysis pipeline
- `GET /api/v1/results` - Get correlation analysis results
- `GET /api/v1/events` - Get all collected events
- `GET /api/v1/status` - Get system status and analysis state
- `GET /api/v1/export/{format}` - Export results (json/csv)
- `GET /api/v1/health` - Health check

### Example Usage

#### 1. Collect Data
```bash
curl -X POST "http://localhost:8000/api/v1/collect-data" \
     -H "Content-Type: application/json" \
     -d '{"gw_limit": 15, "ztf_limit": 20, "tns_limit": 15, "grb_limit": 15}'
```

#### 2. Run Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/analyze-correlations" \
     -H "Content-Type: application/json" \
     -d '{"adaptive_mode": true, "export_results": true}'
```

#### 3. Get Results
```bash
curl "http://localhost:8000/api/v1/results"
```

## Architecture

### Phase 2: Data Collection
- **GWOSC Client**: Fetches gravitational wave events
- **ZTF Client**: Fetches optical transients from ALeRCE API
- **TNS Client**: Generates sample supernova events
- **HEASARC Client**: Generates sample gamma-ray burst events

### Phase 3: Data Normalization
- Converts Phase 2 output to standardized DataFrame format
- Handles missing data and type conversion
- Exports normalized data for Phase 4

### Phase 4: Correlation Analysis
- Implements adaptive threshold adjustment
- Performs temporal and spatial correlation analysis
- Uses sigmoid-based scoring functions
- Generates comprehensive correlation results

### Phase 5: Enhanced Scoring
- Applies astrophysical plausibility scoring
- Implements cross-messenger bonuses
- Calculates statistical significance and rarity scores
- Provides priority classification and follow-up recommendations

## Data Sources

- **GWOSC**: Gravitational Wave Open Science Center
- **ZTF**: Zwicky Transient Facility (via ALeRCE API)
- **TNS**: Transient Name Server (sample data)
- **HEASARC**: High Energy Astrophysics Science Archive (sample data)

## Configuration

The system uses adaptive thresholds that adjust based on data characteristics:

- **Temporal thresholds**: GW-optical (72h), optical-optical (48h), GW-GW (1h)
- **Spatial thresholds**: GW-optical (5°), optical-optical (2°), GW-GW (0.5°)
- **Confidence cutoffs**: High (0.7), Medium (0.4)

## Cross-Messenger Physics

The system implements realistic astrophysical models for different messenger combinations:

- **GW-Optical**: Neutron star merger kilonova (0.1-48h delay)
- **GW-GRB**: Short GRB from neutron star merger (0-10h delay)
- **GRB-Optical**: Afterglow emission (0.01-24h delay)
- **GRB-Supernova**: Collapsar or merger scenarios (0.1-168h delay)

## Export Formats

- **JSON**: Complete analysis results with metadata
- **CSV**: High-priority correlations for further analysis

## Development

### Project Structure
```
backend/
├── main.py                 # FastAPI application
├── models/
│   └── schemas.py         # Pydantic models
├── correlator/
│   ├── phase2_correlator.py
│   ├── phase3_normalizer.py
│   ├── phase4_analyzer.py
│   └── phase5_scorer.py
├── requirements.txt
├── start.sh
└── README.md
```

### Adding New Data Sources

1. Create a new client class in `phase2_correlator.py`
2. Implement the `fetch_events()` method
3. Add the source to the data collection pipeline
4. Update the messenger physics in `phase5_scorer.py`

### Customizing Analysis

- Modify thresholds in `EnhancedCorrelationAnalyzer`
- Adjust scoring weights in `EnhancedPhase5ScoringEngine`
- Add new correlation types in the analysis pipeline

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `start.sh` or kill existing processes
2. **API connection failed**: Ensure the backend is running on the correct port
3. **Data collection errors**: Check internet connection and API availability
4. **Memory issues**: Reduce event limits in data collection requests

### Logs

The application logs to stdout with different levels:
- INFO: General operation information
- WARNING: Non-critical issues
- ERROR: Critical failures

## License

This project is part of the Multi-Messenger Event Correlator system.
