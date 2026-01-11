from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List

from .models import MoodEntry, MoodResponse
from .sentiment import analyze_sentiment_text
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

# In-memory storage for simplicity (would be DB in prod)
journal_entries: List[MoodResponse] = []

@app.get("/")
async def root():
    return {"message": "MoodMend API is running"}

@app.post("/api/analyze", response_model=MoodResponse)
async def analyze_entry(entry: MoodEntry):
    if not entry.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    result = analyze_sentiment_text(entry.text)
    
    mood_response = MoodResponse(
        mood_score=result["mood_score"],
        mood_label=result["mood_label"],
        subjectivity=result["subjectivity"],
        summary=result["summary"],
        timestamp=entry.timestamp or datetime.now()
    )
    
    journal_entries.append(mood_response)
    return mood_response

@app.get("/api/history", response_model=List[MoodResponse])
async def get_history():
    # Return sorted by timestamp desc
    return sorted(journal_entries, key=lambda x: x.timestamp, reverse=True)
