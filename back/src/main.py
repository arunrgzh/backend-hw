from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .tasks import process_character
from .chatbot.chatbot import Chatbot
from .voice_processor import VoiceProcessor
from typing import List
import json
import logging

logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbot = Chatbot()
voice_processor = VoiceProcessor()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Remove broken connections
                    self.active_connections[user_id].remove(connection)

manager = ConnectionManager()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add_characters/", response_model=schemas.Character)
def add_characters(character: schemas.CharacterCreate, db: Session = Depends(get_db)):
    # Create character in database
    db_character = crud.create_character(db=db, character=character)
    
    # Process character asynchronously with Celery
    process_character.delay(character.dict())
    
    return db_character

@app.get("/get_characters/", response_model=List[schemas.Character])
def get_characters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    characters = crud.get_characters(db, skip=skip, limit=limit)
    return characters

@app.post("/chat/")
async def chat(message: schemas.ChatMessage, user_id: int, db: Session = Depends(get_db)):
    response = await chatbot.process_message(message.content, user_id)
    return {"response": response}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data["type"] == "text":
                # Handle text message
                response = await chatbot.process_message(message_data["content"], user_id)
                
                # Generate voice response
                voice_response = voice_processor.generate_voice_response(response)
                
                # Send both text and voice response
                await manager.send_personal_message(
                    json.dumps({
                        "type": "text_response",
                        "content": response,
                        "user_id": user_id
                    }), user_id
                )
                
                await manager.send_personal_message(
                    json.dumps({
                        "type": "voice_response",
                        "audio_data": voice_response,
                        "text_content": response,
                        "user_id": user_id
                    }), user_id
                )
                
            elif message_data["type"] == "voice":
                # Handle voice message
                try:
                    # Convert voice to text
                    transcribed_text = voice_processor.process_voice_message(message_data["audio_data"])
                    
                    # Get chatbot response
                    response = await chatbot.process_message(transcribed_text, user_id)
                    
                    # Generate voice response
                    voice_response = voice_processor.generate_voice_response(response)
                    
                    # Send transcribed text
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "transcribed_text",
                            "content": transcribed_text,
                            "user_id": user_id
                        }), user_id
                    )
                    
                    # Send text response
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "text_response",
                            "content": response,
                            "user_id": user_id
                        }), user_id
                    )
                    
                    # Send voice response
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "voice_response",
                            "audio_data": voice_response,
                            "text_content": response,
                            "user_id": user_id
                        }), user_id
                    )
                    
                except Exception as e:
                    logger.error(f"Error processing voice message: {str(e)}")
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "error",
                            "content": "Sorry, I couldn't understand your voice message. Please try again.",
                            "user_id": user_id
                        }), user_id
                    )
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

@app.post("/voice-to-text/")
async def voice_to_text(voice_message: schemas.VoiceMessage):
    try:
        transcribed_text = voice_processor.process_voice_message(voice_message.audio_data)
        return {"text": transcribed_text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/text-to-voice/")
async def text_to_voice(text: str):
    try:
        audio_data = voice_processor.generate_voice_response(text)
        return {"audio_data": audio_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
