# Backend Setup Guide

## Requirements Files

This backend provides three different requirements files for different use cases:

### 1. `requirements.txt` (Full Development)
Complete set of dependencies including all features:
- FastAPI web framework
- Data processing (pandas, numpy, matplotlib, seaborn)
- HTTP clients (requests, aiohttp)
- Authentication and security
- Scientific computing (scipy, astropy)
- Development and testing tools

### 2. `requirements-dev.txt` (Development Only)
Includes all production requirements plus:
- Testing frameworks (pytest, pytest-asyncio, pytest-cov)
- Code formatting (black, flake8, mypy)
- Pre-commit hooks
- Documentation tools (sphinx)
- Jupyter notebooks for data analysis
- Performance profiling tools

### 3. `requirements-minimal.txt` (Production Minimal)
Lightweight production deployment with only essential dependencies:
- Core FastAPI framework
- Basic data processing (numpy, pandas)
- HTTP requests
- Environment configuration
- File handling
- Scientific computing (scipy)

## Installation

### For Development
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install full development dependencies
pip install -r requirements-dev.txt
```

### For Production
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install minimal production dependencies
pip install -r requirements-minimal.txt
```

### For Full Features (Recommended)
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt
```

## Key Dependencies Explained

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **Pydantic**: Data validation and settings management

### Data Processing
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Matplotlib/Seaborn**: Data visualization
- **SciPy**: Scientific computing and statistical functions

### Astronomical Computing
- **Astropy**: Astronomy and astrophysics library
- **SciPy**: For coordinate transformations and statistical analysis

### HTTP and API
- **Requests**: Synchronous HTTP library
- **AioHTTP**: Asynchronous HTTP client/server

### Development Tools
- **Pytest**: Testing framework
- **Black**: Code formatter
- **Flake8**: Linting
- **MyPy**: Type checking

## Environment Setup

1. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**:
   ```bash
   python main.py
   ```

## Docker Support

For containerized deployment, use the minimal requirements:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements-minimal.txt .
RUN pip install -r requirements-minimal.txt

COPY . .
CMD ["python", "main.py"]
```

## Troubleshooting

### Common Issues

1. **Pandas/NumPy version conflicts**:
   ```bash
   pip install --upgrade pandas numpy
   ```

2. **FastAPI CORS issues**:
   Ensure CORS middleware is properly configured in `main.py`

3. **Memory issues with large datasets**:
   Use the minimal requirements and consider data chunking

### Performance Optimization

- Use `requirements-minimal.txt` for production
- Enable gzip compression in FastAPI
- Consider using Redis for caching
- Implement database connection pooling

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_correlator.py
```
