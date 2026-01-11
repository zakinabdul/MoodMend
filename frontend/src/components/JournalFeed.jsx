import React from 'react';
import { motion } from 'framer-motion';

const JournalFeed = ({ entries }) => {
    if (!entries || entries.length === 0) {
        return (
            <div className="text-center text-eco-moss/60 mt-10 font-serif italic">
                No entries yet. Start your journey today.
            </div>
        );
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 p-4">
            {entries.map((entry, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="break-inside-avoid glass-card hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-eco-terra">
                            {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.mood_label === 'Positive' ? 'bg-green-100 text-green-800' :
                                entry.mood_label === 'Negative' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {entry.mood_label}
                        </span>
                    </div>
                    <h3 className="text-lg font-serif text-eco-dark mb-2 leading-tight">
                        {entry.summary}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>Subj: {Math.round(entry.subjectivity * 100)}%</span>
                        <span>Score: {entry.mood_score.toFixed(2)}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default JournalFeed;
