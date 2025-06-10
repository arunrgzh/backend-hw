from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users
from database import Base, engine
import models

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
