#!/usr/bin/env python3
"""
Test script for the Multi-Messenger Event Correlator Backend
"""

import requests
import json
import time
import sys

def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Multi-Messenger Event Correlator Backend")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/api/v1/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: Status check
    print("\n2. Testing status endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/status", timeout=10)
        if response.status_code == 200:
            print("✅ Status endpoint working")
            status = response.json()
            print(f"   Analysis cache: {status.get('analysis_cache', {})}")
        else:
            print(f"❌ Status endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Status endpoint failed: {e}")
    
    # Test 3: Data collection
    print("\n3. Testing data collection...")
    try:
        data = {
            "gw_limit": 5,
            "ztf_limit": 5,
            "tns_limit": 5,
            "grb_limit": 5
        }
        response = requests.post(
            f"{base_url}/api/v1/collect-data",
            json=data,
            timeout=60
        )
        if response.status_code == 200:
            print("✅ Data collection successful")
            result = response.json()
            print(f"   Summary: {result.get('summary', {})}")
        else:
            print(f"❌ Data collection failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Data collection failed: {e}")
    
    # Test 4: Correlation analysis
    print("\n4. Testing correlation analysis...")
    try:
        data = {
            "adaptive_mode": True,
            "export_results": True
        }
        response = requests.post(
            f"{base_url}/api/v1/analyze-correlations",
            json=data,
            timeout=120
        )
        if response.status_code == 200:
            print("✅ Correlation analysis successful")
            result = response.json()
            print(f"   Results: {result.get('results', {})}")
        else:
            print(f"❌ Correlation analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Correlation analysis failed: {e}")
    
    # Test 5: Get results
    print("\n5. Testing results endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/results", timeout=10)
        if response.status_code == 200:
            print("✅ Results endpoint working")
            result = response.json()
            print(f"   Total correlations: {result.get('total_correlations', 0)}")
            print(f"   Sample correlation: {result.get('correlations', [])[:1]}")
        else:
            print(f"❌ Results endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Results endpoint failed: {e}")
    
    # Test 6: Get events
    print("\n6. Testing events endpoint...")
    try:
        response = requests.get(f"{base_url}/api/v1/events", timeout=10)
        if response.status_code == 200:
            print("✅ Events endpoint working")
            result = response.json()
            print(f"   Total events: {result.get('total_events', 0)}")
        else:
            print(f"❌ Events endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Events endpoint failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Backend testing completed!")
    print("   Check the results above for any failures.")
    print("   If all tests passed, the backend is ready for frontend integration.")
    
    return True

if __name__ == "__main__":
    print("Starting backend test...")
    print("Make sure the backend is running on http://localhost:8000")
    print("You can start it with: ./start.sh")
    print()
    
    # Wait a moment for user to read
    time.sleep(2)
    
    success = test_backend()
    
    if success:
        print("\n✅ All tests completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above.")
        sys.exit(1)
