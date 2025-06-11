from sqlalchemy.orm import Session
from . import models, schemas

def create_character(db: Session, character: schemas.CharacterCreate):
    db_character = models.Character(title=character.title, description=character.description)
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def get_characters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Character).offset(skip).limit(limit).all()
