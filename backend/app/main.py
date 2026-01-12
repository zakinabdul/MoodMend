from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
from sqlmodel import Session, select

from .models import MoodEntry, MoodResponse, MoodEntryCreate, User
from .sentiment import analyze_sentiment_text
from .db import create_db_and_tables, get_session
from .auth import get_current_user
import nltk
import os

# Ensure NLTK data is downloaded (fixes MissingCorpusError on Render)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading NLTK punkt data...")
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('brown') # TextBlob often uses this too


app = FastAPI(title="MoodMend API", description="Backend for MoodMend Voice Journal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "MoodMend API is running"}

@app.post("/api/analyze", response_model=MoodResponse)
async def analyze_entry(
    entry_create: MoodEntryCreate, 
    user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    if not entry_create.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    result = analyze_sentiment_text(entry_create.text)
    
    mood_entry = MoodEntry(
        mood_score=result["mood_score"],
        mood_label=result["mood_label"],
        subjectivity=result["subjectivity"],
        summary=result["summary"],
        text=entry_create.text,
        user_id=user.id
    )
    
    session.add(mood_entry)
    session.commit()
    session.refresh(mood_entry)
    
    return mood_entry

@app.get("/api/history", response_model=List[MoodResponse])
async def get_history(
    user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    # Return sorted by timestamp desc for the current user
    statement = select(MoodEntry).where(MoodEntry.user_id == user.id).order_by(MoodEntry.timestamp.desc())
    results = session.exec(statement).all()
    return results

