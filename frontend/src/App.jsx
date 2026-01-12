import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import VoiceRecorder from './components/VoiceRecorder';
import SwipeableFeed from './components/SwipeableFeed'; // New Component
import CalendarView from './components/CalendarView'; // New Component
import MoodChart from './components/MoodChart';
import LoginPage from './components/LoginPage';
import { Calendar, Layers } from 'lucide-react'; // Icons for toggle

// Backend URL - assuming localhost:8000 for dev, but in prod ideally relative or env var.
// Vite proxy works if configured, or direct URL with CORS.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('feed'); // 'feed' or 'calendar'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleRecordComplete = async (transcript) => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.post(`${API_URL}/analyze`, {
        text: transcript,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh history or append
      setEntries(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Could not save entry. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-eco-sand/30 text-eco-moss animate-pulse">Loading MoodMend...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-eco-sand/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow flex flex-col">
        <header className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-6xl font-serif text-eco-moss mb-2 tracking-tight">MoodMend</h1>
          <p className="text-eco-dark/60 italic">Your voice, your journey.</p>
          <button
            onClick={() => auth.signOut()}
            className="absolute right-0 top-0 text-xs text-eco-moss/50 hover:text-eco-moss border border-eco-moss/20 px-3 py-1 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </header>

        <main className="space-y-12 flex-grow">
          <section className="flex justify-center">
            <VoiceRecorder onRecordComplete={handleRecordComplete} />
          </section>

          {loading && (
            <div className="text-center text-eco-terra animate-pulse">Analyzing your mood...</div>
          )}

          <section>
            <MoodChart data={entries} />
          </section>

          <section>
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-serif text-eco-moss">Your Journal</h2>
              <div className="flex space-x-2 bg-white/40 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('feed')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'feed' ? 'bg-eco-moss text-white shadow-md' : 'text-eco-moss/60 hover:bg-white/50'}`}
                >
                  <Layers size={20} />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-eco-moss text-white shadow-md' : 'text-eco-moss/60 hover:bg-white/50'}`}
                >
                  <Calendar size={20} />
                </button>
              </div>
            </div>

            {viewMode === 'feed' ? (
              <SwipeableFeed entries={entries} />
            ) : (
              <CalendarView entries={entries} />
            )}
          </section>
        </main>

        <footer className="mt-20 text-center text-eco-moss/40 text-sm py-6">
          <p>&copy; {new Date().getFullYear()} MoodMend. Heal through expression.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
