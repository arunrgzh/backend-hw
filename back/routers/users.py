from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..crud import create_user, authenticate_user, get_user_by_username
from ..schemas import User as UserSchema
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(user: UserSchema, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(400, "Username already exists")
    db_user = create_user(db, user.username, user.password)
    return {"msg": "User created", "user_id": str(db_user.id)}

@router.post("/login")
def login(user: UserSchema, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(401, "Invalid credentials")
    return {"msg": "Login successful", "user_id": str(db_user.id)}

@router.get("/users/{username}")
def get_user_endpoint(username: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": str(user.id), "username": user.username}
