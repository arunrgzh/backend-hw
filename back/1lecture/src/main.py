from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database

app = FastAPI()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/add_characters/", response_model=schemas.Character)
def add_characters(character: schemas.CharacterCreate, db: Session = Depends(get_db)):
    return crud.create_character(db=db, character=character)

@app.get("/get_characters/", response_model=list[schemas.Character])
def get_characters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    characters = crud.get_characters(db, skip=skip, limit=limit)
    return characters
