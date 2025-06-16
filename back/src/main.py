from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .tasks import process_character
from .chatbot.chatbot import Chatbot
from typing import List

app = FastAPI()
chatbot = Chatbot()

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
