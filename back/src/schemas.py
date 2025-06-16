from pydantic import BaseModel

class CharacterBase(BaseModel):
    title: str
    description: str

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    id: int

    class Config:
        orm_mode = True

class ChatMessage(BaseModel):
    content: str
