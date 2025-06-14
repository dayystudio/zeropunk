#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# Load environment variables
load_dotenv('/app/backend/.env')

async def test_mongodb_connection():
    """Test MongoDB connection and database operations"""
    print("Testing MongoDB connection...")
    
    # Get MongoDB connection string from environment
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    if not mongo_url:
        print("Error: MONGO_URL not found in environment variables")
        return False
        
    if not db_name:
        print("Error: DB_NAME not found in environment variables")
        return False
    
    print(f"Connecting to MongoDB at: {mongo_url}")
    print(f"Using database: {db_name}")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection by inserting a test document
        test_doc = {
            "test_id": "mongodb_connection_test",
            "status": "success"
        }
        
        # Insert test document
        result = await db.test_collection.insert_one(test_doc)
        print(f"Inserted test document with ID: {result.inserted_id}")
        
        # Retrieve the document to verify
        retrieved = await db.test_collection.find_one({"test_id": "mongodb_connection_test"})
        print(f"Retrieved test document: {retrieved}")
        
        # Clean up by removing the test document
        await db.test_collection.delete_one({"test_id": "mongodb_connection_test"})
        print("Test document deleted successfully")
        
        # List all collections in the database
        collections = await db.list_collection_names()
        print(f"Collections in database: {collections}")
        
        # Close the connection
        client.close()
        print("MongoDB connection test completed successfully")
        return True
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())