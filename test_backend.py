#!/usr/bin/env python3
"""
LAc AI Studio - Backend Test Script
Tests core functionality without requiring frontend
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:8787"

def test_health():
    """Test health endpoint"""
    print("\n1. Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    return response.status_code == 200

def test_create_project():
    """Test project creation"""
    print("\n2. Creating test project...")
    data = {
        "name": "Test App",
        "stack": "Python FastAPI"
    }
    response = requests.post(f"{BASE_URL}/api/projects", json=data)
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Project ID: {result['project']['id']}")
    return result['project']['id'] if response.status_code == 200 else None

def test_list_projects():
    """Test listing projects"""
    print("\n3. Listing projects...")
    response = requests.get(f"{BASE_URL}/api/projects")
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Found {len(result['projects'])} projects")
    for p in result['projects']:
        print(f"   - {p['name']} ({p['id']})")
    return response.status_code == 200

def test_build_from_script(project_id):
    """Test build from script"""
    print("\n4. Building from script...")
    
    script = """from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from LAc AI Studio!"}

@app.get("/health")
def health():
    return {"status": "healthy"}
"""
    
    data = {
        "project_id": project_id,
        "script": script
    }
    
    response = requests.post(f"{BASE_URL}/api/build/script", json=data)
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Job ID: {result['job_id']}")
    print(f"   Job Status: {result['status']}")
    
    # Wait a bit for build to process
    print("   Waiting for build to complete...")
    for i in range(10):
        time.sleep(1)
        job_response = requests.get(f"{BASE_URL}/api/jobs/{result['job_id']}")
        if job_response.status_code == 200:
            job = job_response.json()['job']
            print(f"   Progress: {job['status']} - {job.get('current_stage', 'N/A')}")
            if job['status'] in ['succeeded', 'failed', 'canceled']:
                break
    
    return result['job_id'] if response.status_code == 200 else None

def test_connectors():
    """Test connectors endpoint"""
    print("\n5. Listing connectors...")
    response = requests.get(f"{BASE_URL}/api/connectors")
    print(f"   Status: {response.status_code}")
    result = response.json()
    print(f"   Available connectors:")
    for c in result['connectors']:
        status_icon = "✓" if c['connected'] else "✗"
        print(f"   {status_icon} {c['name']} - {c['status']}")
    return response.status_code == 200

def test_storage():
    """Test storage info"""
    print("\n6. Checking storage...")
    response = requests.get(f"{BASE_URL}/api/storage/info")
    print(f"   Status: {response.status_code}")
    result = response.json()
    disk = result['disk']
    print(f"   Disk: {disk['free'] // (1024**3)}GB free / {disk['total'] // (1024**3)}GB total")
    return response.status_code == 200

def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("LAc AI Studio - Backend Test Suite")
    print("=" * 60)
    
    results = {}
    
    try:
        # Run tests
        results['health'] = test_health()
        project_id = test_create_project()
        results['create_project'] = project_id is not None
        results['list_projects'] = test_list_projects()
        
        if project_id:
            job_id = test_build_from_script(project_id)
            results['build'] = job_id is not None
        else:
            results['build'] = False
        
        results['connectors'] = test_connectors()
        results['storage'] = test_storage()
        
        # Print summary
        print("\n" + "=" * 60)
        print("Test Summary")
        print("=" * 60)
        
        for test_name, passed in results.items():
            status = "✓ PASS" if passed else "✗ FAIL"
            print(f"{status} - {test_name}")
        
        total = len(results)
        passed = sum(results.values())
        print(f"\nPassed: {passed}/{total}")
        
        if passed == total:
            print("\n🎉 All tests passed!")
        else:
            print(f"\n⚠ {total - passed} test(s) failed")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Cannot connect to backend")
        print("Make sure the backend is running on http://127.0.0.1:8787")
        print("Run: cd backend && python main.py")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")

if __name__ == "__main__":
    run_all_tests()
