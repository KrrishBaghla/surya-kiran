# Dependencies Documentation

This document explains all the dependencies used in the Surya Kiran Live Data Correlation Engine backend.

## Core Dependencies

### Web Framework
- **fastapi==0.104.1**: Modern, fast web framework for building APIs
- **uvicorn[standard]==0.24.0**: ASGI server for running FastAPI applications
- **pydantic==2.5.0**: Data validation and settings management using Python type annotations
- **python-multipart==0.0.6**: For handling multipart form data in FastAPI

### Data Processing
- **pandas==2.1.4**: Data manipulation and analysis library
- **numpy==1.24.3**: Fundamental package for scientific computing with Python
- **scipy==1.11.4**: Scientific computing library for advanced mathematical functions
- **astropy==5.3.4**: Astronomy and astrophysics library for coordinate transformations

### HTTP and API Clients
- **requests==2.31.0**: HTTP library for making API calls to external data sources
- **aiohttp==3.9.1**: Async HTTP client/server framework
- **asyncio-throttle==1.0.2**: Rate limiting for async operations

### File and Environment Management
- **python-dotenv==1.0.0**: Load environment variables from .env files
- **aiofiles==23.2.1**: Async file operations

### Logging and Monitoring
- **structlog==23.2.0**: Structured logging for better log analysis

## Development Dependencies

### Testing Framework
- **pytest==7.4.3**: Testing framework
- **pytest-asyncio==0.21.1**: Pytest plugin for testing async code
- **pytest-cov==4.1.0**: Coverage plugin for pytest
- **httpx==0.25.2**: HTTP client for testing
- **responses==0.24.1**: Mock HTTP requests for testing
- **factory-boy==3.3.0**: Test data generation

### Code Quality
- **black==23.11.0**: Python code formatter
- **flake8==6.1.0**: Linting tool
- **mypy==1.7.1**: Static type checker
- **isort==5.12.0**: Import sorting tool
- **autopep8==2.0.4**: PEP 8 code formatter
- **pre-commit==3.6.0**: Git hooks for code quality

### Documentation
- **sphinx==7.2.6**: Documentation generator
- **sphinx-rtd-theme==1.3.0**: Read the Docs theme for Sphinx

### Data Analysis and Visualization
- **matplotlib==3.8.2**: Plotting library
- **seaborn==0.13.0**: Statistical data visualization
- **plotly==5.17.0**: Interactive plotting library
- **jupyter==1.0.0**: Jupyter notebook environment
- **ipykernel==6.27.1**: Jupyter kernel
- **notebook==7.0.6**: Jupyter notebook interface

### Performance Profiling
- **memory-profiler==0.61.0**: Memory usage profiler
- **line-profiler==4.1.1**: Line-by-line profiler

### Additional Development Tools
- **fastapi-cli==0.0.2**: FastAPI command line tools
- **pydantic-settings==2.1.0**: Settings management for Pydantic
- **redis==5.0.1**: Redis client (for future caching)
- **sqlalchemy==2.0.23**: SQL toolkit (for future database features)
- **prometheus-client==0.19.0**: Prometheus metrics client

## Usage by Module

### Phase 2 Correlator (`phase2_correlator.py`)
- `requests`: HTTP calls to external APIs (GWOSC, ZTF, TNS, HEASARC)
- `numpy`: Numerical computations for event processing
- `json`: JSON data parsing
- `csv`: CSV file operations
- `datetime`: Time handling for events

### Phase 3 Normalizer (`phase3_normalizer.py`)
- `pandas`: Data normalization and transformation
- `numpy`: Numerical operations
- `json`: JSON data handling

### Phase 4 Analyzer (`phase4_analyzer.py`)
- `numpy`: Mathematical calculations for correlation analysis
- `json`: Result serialization
- `csv`: CSV export functionality
- `datetime`: Timestamp handling

### Phase 5 Scorer (`phase5_scorer.py`)
- `numpy`: Statistical calculations and scoring algorithms
- `json`: Result export
- `datetime`: Timestamp management

### Live Correlation Engine (`live_correlation_engine.py`)
- `pandas`: Data manipulation
- `numpy`: Mathematical computations
- `asyncio`: Async operations
- `aiohttp`: Async HTTP requests
- `astropy`: Astronomical coordinate calculations

### Main Application (`main.py`)
- `fastapi`: Web API framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation
- `structlog`: Logging

## Installation Commands

### Production Installation
```bash
pip install -r requirements.txt
```

### Development Installation
```bash
pip install -r requirements-dev.txt
```

### Minimal Installation
```bash
pip install -r requirements-minimal.txt
```

## Version Compatibility

All dependencies are pinned to specific versions to ensure compatibility and reproducible builds. The versions have been tested together and are known to work with the current codebase.

## Future Enhancements

The following dependencies are included for future enhancements:
- **Redis**: For caching correlation results
- **SQLAlchemy**: For database storage of events and correlations
- **Prometheus**: For monitoring and metrics collection
- **Plotly**: For interactive data visualization in the frontend

## Security Considerations

- All dependencies are from trusted sources (PyPI)
- Versions are pinned to prevent supply chain attacks
- Regular updates should be performed to address security vulnerabilities
- Use `pip-audit` to check for known vulnerabilities

## Performance Notes

- **NumPy**: Optimized for numerical computations
- **Pandas**: Efficient for data manipulation but can be memory-intensive
- **AsyncIO**: Provides concurrency for I/O-bound operations
- **AIOHTTP**: Non-blocking HTTP requests for better performance
