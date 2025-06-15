from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
from passlib.context import CryptContext
from jose import JWTError, jwt
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "zeropunk_neural_matrix_2137_secure_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

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

# Authentication Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8)
    accept_terms: bool = Field(..., description="Must accept terms and conditions")

class UserLogin(BaseModel):
    username_or_email: str
    password: str
    remember_me: bool = False

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    is_active: bool = True
    is_supporter: bool = False
    discord_linked: bool = False
    discord_username: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class UserProfile(BaseModel):
    username: str
    email: str
    is_supporter: bool
    discord_linked: bool
    discord_username: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]

class PasswordStrength(BaseModel):
    score: int  # 0-4
    feedback: List[str]
    is_valid: bool

# Authentication utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_username(username: str):
    user = await db.users.find_one({"username": username})
    if user:
        return UserInDB(**user)
    return None

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    if user:
        return UserInDB(**user)
    return None

async def get_user_by_username_or_email(username_or_email: str):
    # Try both username and email
    user = await get_user_by_username(username_or_email)
    if not user:
        user = await get_user_by_email(username_or_email)
    return user

async def authenticate_user(username_or_email: str, password: str):
    user = await get_user_by_username_or_email(username_or_email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Neural link authentication failed",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_username(username)
    if user is None:
        raise credentials_exception
    return user

def validate_username(username: str) -> List[str]:
    errors = []
    if len(username) < 3:
        errors.append("Username must be at least 3 characters")
    if len(username) > 20:
        errors.append("Username must be less than 20 characters")
    if not re.match("^[a-zA-Z0-9_-]+$", username):
        errors.append("Username can only contain letters, numbers, underscores, and hyphens")
    return errors

def check_password_strength(password: str) -> PasswordStrength:
    score = 0
    feedback = []
    
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password must be at least 8 characters")
    
    if re.search(r"[a-z]", password):
        score += 1
    else:
        feedback.append("Add lowercase letters")
    
    if re.search(r"[A-Z]", password):
        score += 1
    else:
        feedback.append("Add uppercase letters")
    
    if re.search(r"\d", password):
        score += 1
    else:
        feedback.append("Add numbers")
    
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    else:
        feedback.append("Add special characters")
    
    if len(password) >= 12:
        score = min(score + 1, 4)
    
    is_valid = score >= 3
    if not feedback:
        feedback.append("Strong password! Neural encryption ready.")
    
    return PasswordStrength(score=score, feedback=feedback, is_valid=is_valid)

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
