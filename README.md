# MoodMend 🌿
**The Eco-Futurist Voice Journal**

MoodMend is a therapeutic Progressive Web App (PWA) that uses voice analysis to track your emotional well-being. Built with a calm, nature-inspired aesthetic, it helps you heal through expression.

![MoodMend Banner](frontend/public/logo.png)

## ✨ Features
*   **Voice-First Journaling**: Speak your mind, and let MoodMend transcribe and analyze your mood.
*   **Sentiment Analysis**: Powered by AI (TextBlob) to detect mood score, label (Positive/Neutral/Negative), and subjectivity.
*   **Eco-Futurist UI**: A stunning glassmorphism design with swiping interactions and organic animations.
*   **Swipeable Feed**: Review your past entries with a modern, gesture-based card interface.
*   **Mood Calendar**: visualize your emotional journey over time.
*   **PWA Ready**: Install on your phone for a native app-like experience.

## 🛠️ Tech Stack
*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Firebase Auth.
*   **Backend**: FastAPI (Python), TextBlob (NLP), SQLModel.
*   **Database**: NeonDB (Serverless PostgreSQL).
*   **Deployment**: Vercel (Frontend) + Render (Backend).

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   Python 3.10+
*   Firebase Project (for Auth)
*   NeonDB Instance (for Database)

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/zakinabdul/MoodMend.git
    cd MoodMend
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    cp .env.example .env # Add your Firebase keys
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Set DATABASE_URL and FIREBASE_SERVICE_ACCOUNT_JSON env vars
    python -m uvicorn app.main:app --reload
    ```

## 🌍 Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend (Env Vars)
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
FIREBASE_SERVICE_ACCOUNT_JSON={...} # Full JSON content
```

## 🤝 Contributing
Contributions are welcome! Please open an issue or PR for any enhancements.

---
*Built with 💚 by Zakin Abdul*
