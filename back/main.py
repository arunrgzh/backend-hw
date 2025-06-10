from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from uuid import uuid4, UUID
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# Task 1. CRUD
users: Dict[str, dict] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

users["arunrgzh"] = {"id": str(uuid4()), "username": "arunrgzh", "password": "theboss00"}

class User(BaseModel):
    username: str
    password: str 

@app.post("/signup")
def signup(user: User):
    if user.username in users:
        raise HTTPException(400, "Username already exists")
    users[user.username] = {"id": str(uuid4()), "username": user.username, "password": user.password}
    return {"msg": "User created"}

@app.post("/login")
def login(user: User):
    db_user = users.get(user.username)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(401, "Invalid credentials")
    return {"msg": "Login successful", "user_id": db_user["id"]}

@app.get("/users/{username}")
def get_user(username: str):
    user = users.get(username)
    if not user:
        raise HTTPException(404, "User not found")
    return {"id": user["id"], "username": user["username"]}
