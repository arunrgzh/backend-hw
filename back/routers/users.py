from fastapi import APIRouter, HTTPException
from ..crud import create_user, authenticate_user, get_user
from ..schemas import User

router = APIRouter()

@router.post("/signup")
def signup(user: User):
    if get_user(user.username):
        raise HTTPException(400, "Username already exists")
    create_user(user.username, user.password)
    return {"msg": "User created"}

@router.post("/login")
def login(user: User):
    db_user = authenticate_user(user.username, user.password)
    if not db_user:
        raise HTTPException(401, "Invalid credentials")
    return {"msg": "Login successful", "user_id": db_user["id"]}

@router.get("/users/{username}")
def get_user_endpoint(username: str):
    user = get_user(username)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": user["id"], "username": user["username"]}
