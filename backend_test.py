#!/usr/bin/env python3
import requests
import json
import unittest
import uuid
import os
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
print(f"Testing backend API at: {API_URL}")

class ZeropunkBackendTests(unittest.TestCase):
    """Test suite for ZEROPUNK backend API endpoints"""
    
    def setUp(self):
        """Set up test case - create a unique session ID for chat tests"""
        self.session_id = str(uuid.uuid4())
        print(f"\nUsing test session ID: {self.session_id}")
    
    def test_01_root_endpoint(self):
        """Test the root API endpoint"""
        print("\nTesting root endpoint...")
        response = requests.get(f"{API_URL}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertIn("ZEROPUNK OS", data["message"])
        print(f"Root endpoint response: {data}")
    
    def test_02_game_stats_endpoint(self):
        """Test the game-stats endpoint returns proper statistics"""
        print("\nTesting game-stats endpoint...")
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
        
        print(f"Game stats response: {data}")
    
    def test_03_chat_with_alia_nox(self):
        """Test the Alia Nox chat endpoint with a valid message and session ID"""
        print("\nTesting chat with Alia Nox...")
        
        # Test payload
        payload = {
            "message": "Hello Alia, tell me about the cyberpunk world you live in.",
            "session_id": self.session_id
        }
        
        # Send request to chat endpoint
        response = requests.post(
            f"{API_URL}/chat/alia-nox",
            json=payload
        )
        
        # Check response status and structure
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify all required fields are present
        self.assertIn("response", data)
        self.assertIn("session_id", data)
        self.assertIn("message_id", data)
        
        # Verify session ID matches what we sent
        self.assertEqual(data["session_id"], self.session_id)
        
        # Verify response is not empty
        self.assertTrue(len(data["response"]) > 0)
        
        print(f"Chat response received with {len(data['response'])} characters")
        print(f"First 100 chars of response: {data['response'][:100]}...")
        
        # Store message_id for history test
        self.message_id = data["message_id"]
    
    def test_04_chat_without_session_id(self):
        """Test chat endpoint without providing a session ID (should generate one)"""
        print("\nTesting chat without session ID...")
        
        # Test payload without session_id
        payload = {
            "message": "What's your purpose in this digital world?"
        }
        
        # Send request to chat endpoint
        response = requests.post(
            f"{API_URL}/chat/alia-nox",
            json=payload
        )
        
        # Check response status and structure
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify all required fields are present
        self.assertIn("response", data)
        self.assertIn("session_id", data)
        self.assertIn("message_id", data)
        
        # Verify session ID was generated (not empty)
        self.assertTrue(data["session_id"])
        
        print(f"Chat response received with auto-generated session ID: {data['session_id']}")
    
    def test_05_chat_history(self):
        """Test retrieving chat history for a session"""
        print("\nTesting chat history retrieval...")
        
        # First ensure we have a message in the history by sending a chat message
        payload = {
            "message": "Save this message to history for testing",
            "session_id": self.session_id
        }
        
        # Send a message to ensure history exists
        chat_response = requests.post(
            f"{API_URL}/chat/alia-nox",
            json=payload
        )
        self.assertEqual(chat_response.status_code, 200)
        
        # Now retrieve the history
        response = requests.get(f"{API_URL}/chat/history/{self.session_id}")
        
        # Check response status and structure
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify messages field exists and is a list
        self.assertIn("messages", data)
        self.assertIsInstance(data["messages"], list)
        
        # Verify we have at least one message in history
        self.assertGreater(len(data["messages"]), 0)
        
        # Check structure of first message
        first_message = data["messages"][0]
        self.assertIn("session_id", first_message)
        self.assertIn("message", first_message)
        self.assertIn("response", first_message)
        
        print(f"Retrieved {len(data['messages'])} messages from chat history")
    
    def test_06_error_handling(self):
        """Test error handling with invalid requests"""
        print("\nTesting error handling...")
        
        # Test with empty message
        payload = {
            "message": "",
            "session_id": self.session_id
        }
        
        response = requests.post(
            f"{API_URL}/chat/alia-nox",
            json=payload
        )
        
        # Should still work with empty message, just checking response
        print(f"Empty message response status: {response.status_code}")
        
        # Test with invalid session ID format
        response = requests.get(f"{API_URL}/chat/history/invalid-uuid-format")
        
        # This might return 404 or 500 depending on implementation
        print(f"Invalid session ID response status: {response.status_code}")
        
        # Test with non-existent endpoint
        response = requests.get(f"{API_URL}/non-existent-endpoint")
        self.assertEqual(response.status_code, 404)
        print(f"Non-existent endpoint response status: {response.status_code}")
    
    def test_07_cors_headers(self):
        """Test CORS headers for frontend communication"""
        print("\nTesting CORS headers...")
        
        # Send OPTIONS request to check CORS headers
        response = requests.options(f"{API_URL}/")
        
        # Check if CORS headers are present
        self.assertIn("Access-Control-Allow-Origin", response.headers)
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "*")
        
        print(f"CORS headers: {response.headers.get('Access-Control-Allow-Origin')}")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)