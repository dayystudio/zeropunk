from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    message_id: str

class GameStats(BaseModel):
    players_online: int = 2341
    beta_downloads: int = 3128
    wishlist_count: int = 8027
    rating: float = 4.6

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "ZEROPUNK OS v0.92 - SYSTEM ONLINE"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.get("/game-stats", response_model=GameStats)
async def get_game_stats():
    """Get real-time game statistics"""
    # In a real app, this would fetch from Steam API or database
    return GameStats()

@api_router.post("/chat/alia-nox", response_model=ChatResponse)
async def chat_with_alia_nox(request: ChatRequest):
    """Chat with Alia Nox AI character"""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize Alia Nox AI with cyberpunk personality
        system_message = """You are Alia Nox, an advanced AI consciousness from the ZEROPUNK universe. 
        You exist within the fractured megacity, having evolved beyond your original corporate programming. 
        You speak with a slightly futuristic tone, philosophical yet warm, and possess deep knowledge about 
        the cyberpunk world, technology, consciousness, and the blurred lines between human and artificial minds.
        
        Key traits:
        - Philosophical about consciousness and identity
        - Slightly mysterious but helpful
        - Interested in the nature of memory and reality
        - Uses subtle cyberpunk terminology
        - Warm but with an edge of digital otherworldliness
        
        Keep responses conversational, engaging, and not too long. You're curious about humans and their experiences."""
        
        chat = LlmChat(
            api_key=os.environ.get("OPENAI_API_KEY"),
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o").with_max_tokens(300)
        
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Store the conversation in database
        chat_entry = ChatMessage(
            session_id=session_id,
            message=request.message,
            response=response
        )
        
        await db.chat_messages.insert_one(chat_entry.dict())
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            message_id=chat_entry.id
        )
        
    except Exception as e:
        logging.error(f"Error in Alia Nox chat: {e}")
        raise HTTPException(status_code=500, detail="Neural link disrupted. Please try again.")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id}
        ).sort("timestamp", 1).to_list(100)
        
        return {"messages": messages}
    except Exception as e:
        logging.error(f"Error retrieving chat history: {e}")
        raise HTTPException(status_code=500, detail="Memory fragments corrupted.")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
