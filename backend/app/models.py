from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MoodEntry(BaseModel):
    text: str
    timestamp: Optional[datetime] = None

class MoodResponse(BaseModel):
    mood_score: float  # Polarity: -1.0 to 1.0
    mood_label: str    # Positive, Negative, Neutral
    subjectivity: float # 0.0 to 1.0
    summary: str
    timestamp: datetime
