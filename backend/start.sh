#!/bin/bash

# Multi-Messenger Event Correlator Backend Startup Script

echo "🚀 Starting Multi-Messenger Event Correlator Backend"
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create exports directory
mkdir -p exports

# Start the FastAPI server
echo "🌟 Starting FastAPI server..."
echo "   Backend will be available at: http://localhost:8000"
echo "   API documentation at: http://localhost:8000/docs"
echo "   Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
