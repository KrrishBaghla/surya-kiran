# Multi-Messenger Event Correlator

A comprehensive system for detecting and analyzing correlations between cosmic events from multiple observatories, featuring a React frontend and FastAPI backend with advanced multi-messenger astronomy analysis.

## 🌟 Features

### Frontend (React + TypeScript)
- **Observatory Dashboard**: Real-time monitoring of data sources and events
- **Correlation Analysis**: Advanced filtering and visualization of multi-messenger correlations
- **Sky Map**: Interactive 3D visualization of cosmic events
- **Solar System**: 3D solar system visualization with orbital mechanics
- **Analytics**: Comprehensive data analysis and reporting
- **Export Capabilities**: Download results in JSON and CSV formats

### Backend (FastAPI + Python)
- **Phase 2**: Data collection from multiple observatory sources
- **Phase 3**: Data normalization and preprocessing
- **Phase 4**: Advanced correlation analysis with adaptive thresholds
- **Phase 5**: Enhanced scoring with cross-messenger bonuses
- **RESTful API**: Complete API for frontend integration
- **Real-time Processing**: Live data collection and analysis

### Multi-Messenger Detection
- **GW-Optical**: Gravitational wave + optical transient correlations
- **GW-GRB**: Gravitational wave + gamma-ray burst correlations
- **GRB-Afterglow**: Gamma-ray burst + optical afterglow
- **Cross-Survey**: Same transient detected by multiple surveys

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd surya-kiran2/surya-kiran
   ```

2. **Start the Backend**
   ```bash
   cd backend
   ./start.sh
   ```
   The backend will be available at http://localhost:8000

3. **Start the Frontend**
   ```bash
   # In a new terminal
   npm install
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📊 How to Use

### 1. Data Collection
1. Navigate to the **Correlations** tab
2. Click **"Run Analysis"** to start data collection
3. The system will collect data from:
   - GWOSC (Gravitational Wave Open Science Center)
   - ZTF (Zwicky Transient Facility)
   - TNS (Transient Name Server)
   - HEASARC (High Energy Astrophysics Science Archive)

### 2. View Results
- **Observatory Dashboard**: Real-time statistics and event monitoring
- **Correlations**: Detailed correlation analysis with filtering options
- **Sky Map**: 3D visualization of event positions
- **Analytics**: Comprehensive data analysis

### 3. Export Data
- Use the export buttons to download results in JSON or CSV format
- Filter correlations by priority, scientific interest, or source type
- View detailed scoring and astrophysical plausibility metrics

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend │ ◄─────────────► │  FastAPI Backend │
│   (Port 3000)   │                 │   (Port 8000)   │
└─────────────────┘                 └─────────────────┘
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

## 🔬 Scientific Background

### Multi-Messenger Astronomy
Multi-messenger astronomy combines observations from different types of cosmic messengers:
- **Gravitational Waves**: Ripples in spacetime from massive objects
- **Electromagnetic Radiation**: Light across all wavelengths
- **Neutrinos**: Nearly massless particles from high-energy events
- **Cosmic Rays**: High-energy particles from space

### Correlation Analysis
The system implements sophisticated algorithms to detect correlations between events:
- **Temporal Correlation**: Events occurring within astrophysically plausible time windows
- **Spatial Correlation**: Events occurring within localization error boxes
- **Cross-Messenger Physics**: Physics-based scoring for different messenger combinations

### Scoring System
- **Astrophysical Plausibility**: Physics-based scoring using realistic astrophysical models
- **Statistical Significance**: Coincidence probability analysis
- **Cross-Messenger Bonuses**: Extra weight for rare multi-messenger combinations
- **Adaptive Thresholds**: Dynamic adjustment based on data characteristics

## 📁 Project Structure

```
surya-kiran/
├── src/                          # React frontend
│   ├── components/              # UI components
│   │   ├── ObservatoryDashboard.tsx
│   │   ├── Correlations.tsx
│   │   ├── SkyMap.tsx
│   │   ├── StarMap.tsx
│   │   └── three/              # 3D components
│   ├── lib/                    # Utilities and API client
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Helper functions
├── backend/                     # FastAPI backend
│   ├── main.py                 # FastAPI application
│   ├── correlator/             # Analysis modules
│   │   ├── phase2_correlator.py
│   │   ├── phase3_normalizer.py
│   │   ├── phase4_analyzer.py
│   │   └── phase5_scorer.py
│   ├── models/                 # Pydantic models
│   └── requirements.txt        # Python dependencies
├── public/                     # Static assets
└── README.md                   # This file
```

## 🛠️ Development

### Backend Development
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
npm install
npm run dev
```

### Testing
```bash
# Test backend
cd backend
python3 test_backend.py

# Test frontend
npm run build
```

## 📈 Performance

### Optimization Features
- **Connection Pooling**: Efficient API request handling
- **Caching**: Frequently accessed data caching
- **Pagination**: Large result set handling
- **Debounced Search**: Optimized filtering performance

### Scaling Considerations
- **Horizontal Scaling**: Multiple backend instances
- **Vertical Scaling**: Increased server resources
- **Database Integration**: Persistent storage options
- **Load Balancing**: Distributed request handling

## 🔒 Security

### Current Implementation
- CORS enabled for development
- Input validation via Pydantic models
- Error handling and logging

### Production Considerations
- JWT authentication
- Rate limiting
- HTTPS implementation
- Input sanitization

## 📚 API Documentation

### Core Endpoints
- `POST /api/v1/collect-data` - Collect data from observatories
- `POST /api/v1/analyze-correlations` - Run correlation analysis
- `GET /api/v1/results` - Get analysis results
- `GET /api/v1/events` - Get all events
- `GET /api/v1/status` - Get system status
- `GET /api/v1/export/{format}` - Export data

### Example API Usage
```bash
# Collect data
curl -X POST "http://localhost:8000/api/v1/collect-data" \
     -H "Content-Type: application/json" \
     -d '{"gw_limit": 15, "ztf_limit": 20}'

# Run analysis
curl -X POST "http://localhost:8000/api/v1/analyze-correlations" \
     -H "Content-Type: application/json" \
     -d '{"adaptive_mode": true}'

# Get results
curl "http://localhost:8000/api/v1/results"
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Python version (3.8+ required)
   - Install dependencies: `pip install -r requirements.txt`
   - Check port 8000 is available

2. **Frontend connection failed**
   - Ensure backend is running on port 8000
   - Check CORS settings
   - Verify API_BASE_URL in `src/lib/api.ts`

3. **No correlations found**
   - Increase event limits in data collection
   - Check observatory API availability
   - Verify data quality

### Getting Help
1. Check the logs (backend console and browser console)
2. Verify all services are running
3. Test API endpoints directly
4. Review the integration guide

## 📄 License

This project is part of the Multi-Messenger Event Correlator system for advanced cosmic event analysis.

## 🙏 Acknowledgments

- **GWOSC**: Gravitational Wave Open Science Center
- **ZTF**: Zwicky Transient Facility
- **ALeRCE**: Automatic Learning for the Rapid Classification of Events
- **TNS**: Transient Name Server
- **HEASARC**: High Energy Astrophysics Science Archive

## 🔮 Future Enhancements

- Real-time data streaming
- Machine learning correlation detection
- Additional observatory integrations
- Advanced visualization features
- Mobile application support
- Collaborative analysis tools

---

**Ready to explore the cosmos? Start the system and begin your multi-messenger astronomy journey!** 🌌