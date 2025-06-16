#!/usr/bin/env python3
import requests
import json
import unittest
import uuid
import os
import time
from dotenv import load_dotenv
import sys

# Load environment variables from frontend .env file to get the backend URL
load_dotenv('/app/frontend/.env')

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("Error: REACT_APP_BACKEND_URL not found in environment variables")
    sys.exit(1)

# Ensure the backend URL has the /api prefix for all requests
API_URL = f"{BACKEND_URL}/api"
print(f"Testing Live Activity backend API at: {API_URL}")

class LiveActivityBackendTests(unittest.TestCase):
    """Test suite specifically for Live Activity backend functionality"""
    
    def setUp(self):
        """Set up test case"""
        self.session_id = str(uuid.uuid4())
        print(f"\nUsing test session ID: {self.session_id}")
    
    def test_01_game_stats_for_live_activity(self):
        """Test the game-stats endpoint for Live Activity dashboard"""
        print("\nTesting game-stats endpoint for Live Activity...")
        response = requests.get(f"{API_URL}/game-stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify all required fields are present
        self.assertIn("players_online", data)
        self.assertIn("beta_downloads", data)
        self.assertIn("wishlist_count", data)
        self.assertIn("rating", data)
        
        # Verify data types
        self.assertIsInstance(data["players_online"], int)
        self.assertIsInstance(data["beta_downloads"], int)
        self.assertIsInstance(data["wishlist_count"], int)
        self.assertIsInstance(data["rating"], float)
        
        # Verify data ranges are reasonable
        self.assertTrue(0 <= data["players_online"] <= 1000000, "Players online count should be in a reasonable range")
        self.assertTrue(0 <= data["beta_downloads"] <= 10000000, "Beta downloads should be in a reasonable range")
        self.assertTrue(0 <= data["wishlist_count"] <= 10000000, "Wishlist count should be in a reasonable range")
        self.assertTrue(0 <= data["rating"] <= 5.0, "Rating should be between 0 and 5")
        
        print(f"Game stats for Live Activity: {data}")
    
    def test_02_database_connection_stability(self):
        """Test database connection stability for Live Activity data persistence"""
        print("\nTesting database connection stability for Live Activity...")
        
        # Create multiple status checks to simulate Live Activity data updates
        for i in range(5):
            client_name = f"live_activity_test_{i}_{uuid.uuid4()}"
            payload = {
                "client_name": client_name
            }
            
            create_response = requests.post(
                f"{API_URL}/status",
                json=payload
            )
            
            # Check response status
            self.assertEqual(create_response.status_code, 200)
            create_data = create_response.json()
            
            # Verify all required fields are present
            self.assertIn("id", create_data)
            self.assertIn("client_name", create_data)
            self.assertIn("timestamp", create_data)
            
            # Verify client_name matches what we sent
            self.assertEqual(create_data["client_name"], client_name)
            
            print(f"Created Live Activity status check {i+1}: {create_data['id']}")
            
            # Small delay to simulate real-world usage
            time.sleep(0.1)
        
        # Now retrieve all status checks
        get_response = requests.get(f"{API_URL}/status")
        
        # Check response status
        self.assertEqual(get_response.status_code, 200)
        get_data = get_response.json()
        
        # Verify response is a list
        self.assertIsInstance(get_data, list)
        
        # Verify we have at least the number of status checks we created
        self.assertTrue(len(get_data) >= 5, "Should have at least 5 status checks")
        
        print(f"Successfully retrieved {len(get_data)} status checks from database")
    
    def test_03_api_response_time(self):
        """Test API response time for Live Activity updates"""
        print("\nTesting API response time for Live Activity updates...")
        
        # Measure response time for game-stats endpoint
        start_time = time.time()
        response = requests.get(f"{API_URL}/game-stats")
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Response time should be reasonable for real-time updates (under 500ms)
        self.assertTrue(response_time < 0.5, f"Response time should be under 500ms, got {response_time*1000:.2f}ms")
        
        print(f"Game stats API response time: {response_time*1000:.2f}ms")
        
        # Measure response time for status endpoint
        start_time = time.time()
        response = requests.get(f"{API_URL}/status")
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Response time should be reasonable for real-time updates (under 500ms)
        self.assertTrue(response_time < 0.5, f"Response time should be under 500ms, got {response_time*1000:.2f}ms")
        
        print(f"Status API response time: {response_time*1000:.2f}ms")
    
    def test_04_concurrent_requests(self):
        """Test handling of concurrent requests for Live Activity dashboard"""
        print("\nTesting concurrent requests for Live Activity dashboard...")
        
        import concurrent.futures
        
        def make_request():
            response = requests.get(f"{API_URL}/game-stats")
            return response.status_code
        
        # Make 10 concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            future_to_request = {executor.submit(make_request): i for i in range(10)}
            for future in concurrent.futures.as_completed(future_to_request):
                request_num = future_to_request[future]
                try:
                    status_code = future.result()
                    self.assertEqual(status_code, 200, f"Request {request_num} failed with status code {status_code}")
                    print(f"Concurrent request {request_num}: OK")
                except Exception as exc:
                    print(f"Concurrent request {request_num} generated an exception: {exc}")
                    self.fail(f"Request {request_num} failed with exception: {exc}")
    
    def test_05_error_handling(self):
        """Test error handling for Live Activity API endpoints"""
        print("\nTesting error handling for Live Activity API endpoints...")
        
        # Test with invalid endpoint
        response = requests.get(f"{API_URL}/live-activity-invalid")
        self.assertEqual(response.status_code, 404)
        print(f"Invalid endpoint response status: {response.status_code}")
        
        # Test with invalid method
        response = requests.delete(f"{API_URL}/game-stats")
        self.assertIn(response.status_code, [404, 405])  # Either not found or method not allowed
        print(f"Invalid method response status: {response.status_code}")
        
        # Test with invalid content type
        headers = {"Content-Type": "text/plain"}
        response = requests.post(
            f"{API_URL}/status",
            data="invalid data",
            headers=headers
        )
        self.assertIn(response.status_code, [400, 415, 422])  # Bad request, unsupported media type, or unprocessable entity
        print(f"Invalid content type response status: {response.status_code}")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)