import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoiceRecorder from './components/VoiceRecorder';
import JournalFeed from './components/JournalFeed';
import MoodChart from './components/MoodChart';

// Backend URL - assuming localhost:8000 for dev, but in prod ideally relative or env var.
// Vite proxy works if configured, or direct URL with CORS.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRecordComplete = async (transcript) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/analyze`, {
        text: transcript,
        // timestamp: new Date().toISOString() // Let backend handle or send now
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-serif text-eco-moss mb-2 tracking-tight">MoodMend</h1>
        <p className="text-eco-dark/60 italic">Your voice, your journey.</p>
      </header>

      <main className="space-y-12">
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
          <h2 className="text-2xl font-serif text-eco-moss mb-6 px-2">Recent Entries</h2>
          <JournalFeed entries={entries} />
        </section>
      </main>

      <footer className="mt-20 text-center text-eco-moss/40 text-sm">
        <p>&copy; {new Date().getFullYear()} MoodMend. Heal through expression.</p>
      </footer>
    </div>
  );
}

export default App;
