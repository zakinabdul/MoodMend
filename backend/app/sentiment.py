from textblob import TextBlob

def analyze_sentiment_text(text: str) -> dict:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    if polarity > 0.1:
        mood_label = "Positive"
    elif polarity < -0.1:
        mood_label = "Negative"
    else:
        mood_label = "Neutral"
        
    # extract a short summary (first sentence or truncated text)
    summary = str(blob.sentences[0]) if blob.sentences else text[:50]
    
    return {
        "mood_score": polarity,
        "mood_label": mood_label,
        "subjectivity": subjectivity,
        "summary": summary
    }
