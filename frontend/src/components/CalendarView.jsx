import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarView = ({ entries }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper to check if a date has entries
    const hasEntry = (date) => {
        return entries.some(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate.getDate() === date.getDate() &&
                entryDate.getMonth() === date.getMonth() &&
                entryDate.getFullYear() === date.getFullYear();
        });
    };

    // Get entries for the selected date
    const selectedEntries = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getDate() === selectedDate.getDate() &&
            entryDate.getMonth() === selectedDate.getMonth() &&
            entryDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
        <div className="space-y-8 glass-card p-6">
            <style>{`
                .react-calendar {
                    background: transparent;
                    border: none;
                    width: 100%;
                    font-family: 'Inter', sans-serif;
                }
                .react-calendar__tile {
                    border-radius: 8px;
                    padding: 10px;
                    color: #3A5A40;
                }
                .react-calendar__tile--now {
                    background: #F4F1DE !important;
                    color: #E07A5F;
                }
                .react-calendar__tile--active {
                    background: #3A5A40 !important;
                    color: white !important;
                }
                .highlight-dot {
                    height: 6px;
                    width: 6px;
                    background-color: #E07A5F;
                    border-radius: 50%;
                    margin: 2px auto 0;
                }
            `}</style>

            <h3 className="text-xl font-serif text-eco-moss text-center">Your Journey</h3>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date, view }) =>
                    view === 'month' && hasEntry(date) ? <div className="highlight-dot"></div> : null
                }
            />

            <div className="mt-6 border-t border-eco-moss/10 pt-4">
                <h4 className="text-sm font-bold text-eco-moss mb-3">
                    Entries for {selectedDate.toLocaleDateString()}
                </h4>

                <div className="space-y-3">
                    {selectedEntries.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No entries for this day.</p>
                    ) : (
                        selectedEntries.map((entry, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/40 p-3 rounded-lg border border-white/60"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-eco-terra">{entry.mood_label}</span>
                                    <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1 line-clamp-2">"{entry.text}"</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
