from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CharacterBase(BaseModel):
    name: str
    description: str
    image_url: str

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    content: str

class WebSocketMessage(BaseModel):
    type: str  # "text", "voice", "audio_response"
    content: str
    user_id: int
    session_id: Optional[str] = None

class VoiceMessage(BaseModel):
    audio_data: str  # Base64 encoded audio
    user_id: int
    session_id: Optional[str] = None

class AudioResponse(BaseModel):
    audio_data: str  # Base64 encoded audio
    text_content: str
    session_id: Optional[str] = None
