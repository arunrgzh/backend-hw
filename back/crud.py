from uuid import uuid4
from typing import Dict

users: Dict[str, dict] = {}

users["arunrgzh"] = {"id": str(uuid4()), "username": "arunrgzh", "password": "theboss00"}

def create_user(username: str, password: str):
    if username in users:
        return None
    user = {"id": str(uuid4()), "username": username, "password": password}
    users[username] = user
    return user

def authenticate_user(username: str, password: str):
    user = users.get(username)
    if not user or user["password"] != password:
        return None
    return user

def get_user(username: str):
    return users.get(username)
