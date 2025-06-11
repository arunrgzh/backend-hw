from sqlalchemy import Column, Integer, String
from .database import Base

class Character(Base):
    __tablename__ = 'characters'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)

