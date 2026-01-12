from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    firebase_uid: str = Field(index=True, unique=True)
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    entries: list["MoodEntry"] = Relationship(back_populates="user")

class MoodEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    mood_score: float
    mood_label: str
    subjectivity: float
    summary: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    user_id: int = Field(foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="entries")

# API Models (Pydantic style, for request/response)
class MoodEntryCreate(SQLModel):
    text: str

class MoodResponse(SQLModel):
    id: int
    mood_score: float
    mood_label: str
    subjectivity: float
    summary: str
    timestamp: datetime
    text: str
