# Multi-Messenger Event Correlator - Integration Guide

This guide explains how to run the complete Multi-Messenger Event Correlator system with both the React frontend and FastAPI backend.

## System Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend │ ◄─────────────► │  FastAPI Backend │
│   (Port 3000)   │                 │   (Port 8000)   │
└─────────────────┘                 └─────────────────┘
         │                                    │
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│   UI Components │                 │  Correlator     │
│   - Dashboard   │                 │  - Phase 2      │
│   - Correlations│                 │  - Phase 3      │
│   - Analytics   │                 │  - Phase 4      │
│   - Sky Map     │                 │  - Phase 5      │
└─────────────────┘                 └─────────────────┘
```

## Quick Start

### 1. Start the Backend

```bash
cd backend
./start.sh
```

The backend will start on http://localhost:8000

### 2. Start the Frontend

```bash
# In a new terminal
cd surya-kiran  # (the React app directory)
npm install
npm run dev
```

The frontend will start on http://localhost:3000

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Complete Workflow

### Step 1: Data Collection
1. Navigate to the **Correlations** tab in the frontend
2. Click **"Run Analysis"** button
3. The system will:
   - Collect data from GWOSC, ZTF, TNS, and HEASARC
   - Process and normalize the data
   - Run correlation analysis
   - Apply enhanced scoring

### Step 2: View Results
1. The **Observatory Dashboard** shows real-time statistics
2. The **Correlations** tab displays detailed correlation results
3. Use filters to explore specific correlation types
4. Export results in JSON or CSV format

### Step 3: Analysis Features
- **Real-time Updates**: Data refreshes automatically
- **Advanced Filtering**: Filter by priority, scientific interest, source
- **Export Capabilities**: Download results for further analysis
- **Cross-Messenger Detection**: Identifies rare multi-messenger events

## API Integration Details

### Frontend API Client

The frontend uses a centralized API client (`src/lib/api.ts`):

```typescript
// Data collection
await apiClient.collectData({
  gw_limit: 15,
  ztf_limit: 20,
  tns_limit: 15,
  grb_limit: 15
});

// Correlation analysis
await apiClient.analyzeCorrelations({
  adaptive_mode: true,
  export_results: true
});

// Get results
const results = await apiClient.getResults();
```

### Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/collect-data` | POST | Collect data from observatories |
| `/api/v1/analyze-correlations` | POST | Run correlation analysis |
| `/api/v1/results` | GET | Get correlation results |
| `/api/v1/events` | GET | Get all events |
| `/api/v1/status` | GET | Get system status |
| `/api/v1/export/{format}` | GET | Export data (json/csv) |
| `/api/v1/health` | GET | Health check |

## Data Flow

### 1. Data Collection (Phase 2)
```
Observatory APIs → Data Clients → Event Normalization → Storage
```

### 2. Correlation Analysis (Phases 3-5)
```
Normalized Data → Phase 3 Normalizer → Phase 4 Analyzer → Phase 5 Scorer → Results
```

### 3. Frontend Display
```
API Results → React Components → Real-time UI Updates
```

## Key Features

### Multi-Messenger Detection
- **GW-Optical**: Gravitational wave + optical transient correlations
- **GW-GRB**: Gravitational wave + gamma-ray burst correlations
- **GRB-Afterglow**: Gamma-ray burst + optical afterglow
- **Cross-Survey**: Same transient detected by multiple surveys

### Advanced Scoring
- **Astrophysical Plausibility**: Physics-based scoring
- **Statistical Significance**: Coincidence probability analysis
- **Cross-Messenger Bonuses**: Extra weight for rare combinations
- **Adaptive Thresholds**: Dynamic adjustment based on data

### Real-time Updates
- **Live Data**: Continuous data collection
- **Status Monitoring**: Real-time system status
- **Progress Tracking**: Analysis progress indicators
- **Error Handling**: Comprehensive error reporting

## Configuration

### Backend Configuration
- **Port**: 8000 (configurable in `start.sh`)
- **CORS**: Enabled for localhost:3000 and localhost:5173
- **Logging**: INFO level with detailed operation logs
- **Export Directory**: `backend/exports/`

### Frontend Configuration
- **API Base URL**: `http://localhost:8000/api/v1`
- **Auto-refresh**: 5-second intervals in live mode
- **Export Formats**: JSON and CSV
- **Error Handling**: User-friendly error messages

## Troubleshooting

### Backend Issues

1. **Port Already in Use**
   ```bash
   # Kill existing process
   lsof -ti:8000 | xargs kill -9
   # Or change port in start.sh
   ```

2. **Python Dependencies**
   ```bash
   # Reinstall dependencies
   pip install -r requirements.txt --force-reinstall
   ```

3. **API Connection Failed**
   - Check if backend is running: `curl http://localhost:8000/api/v1/health`
   - Verify CORS settings in `main.py`

### Frontend Issues

1. **API Connection Failed**
   - Check backend is running on port 8000
   - Verify API_BASE_URL in `src/lib/api.ts`
   - Check browser console for CORS errors

2. **Data Not Loading**
   - Run analysis first using "Run Analysis" button
   - Check backend logs for errors
   - Verify data collection completed successfully

### Data Issues

1. **No Correlations Found**
   - Increase event limits in data collection
   - Check if observatory APIs are accessible
   - Verify data quality and completeness

2. **Analysis Fails**
   - Check backend logs for specific errors
   - Verify all dependencies are installed
   - Try reducing event limits for testing

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Update API client and components
3. **Correlator**: Extend analysis phases as needed

### Testing

1. **Backend**: Use FastAPI's built-in testing or curl
2. **Frontend**: Use browser dev tools and network tab
3. **Integration**: Test complete workflow end-to-end

## Performance

### Optimization Tips

1. **Backend**:
   - Use connection pooling for API requests
   - Implement caching for frequently accessed data
   - Optimize database queries if using persistent storage

2. **Frontend**:
   - Implement pagination for large result sets
   - Use React.memo for expensive components
   - Debounce search and filter inputs

### Scaling

- **Horizontal**: Run multiple backend instances behind a load balancer
- **Vertical**: Increase server resources for larger datasets
- **Caching**: Implement Redis for session and result caching

## Security

### Current Implementation
- CORS enabled for development
- No authentication (development mode)
- Input validation via Pydantic models

### Production Considerations
- Implement JWT authentication
- Add rate limiting
- Use HTTPS
- Validate all inputs
- Implement proper error handling

## Monitoring

### Health Checks
- Backend: `GET /api/v1/health`
- Frontend: Check browser console for errors
- System: Monitor CPU, memory, and disk usage

### Logging
- Backend: Structured logging with timestamps
- Frontend: Console logging for debugging
- Analysis: Progress tracking and error reporting

## Support

For issues or questions:
1. Check the logs (backend console and browser console)
2. Verify all services are running
3. Test API endpoints directly
4. Check network connectivity
5. Review this integration guide

The system is designed to be robust and provide clear error messages to help with troubleshooting.
