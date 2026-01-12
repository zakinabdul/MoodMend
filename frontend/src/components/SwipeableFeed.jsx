import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const SwipeableCard = ({ entry, onDismiss }) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
    const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

    const handleDragEnd = (event, info) => {
        if (Math.abs(info.offset.x) > 100) {
            onDismiss();
        }
    };

    const moodColor = entry.mood_label === 'Positive' ? 'bg-eco-terra/20' :
        entry.mood_label === 'Negative' ? 'bg-gray-400/20' : 'bg-eco-sand/40';

    return (
        <motion.div
            style={{ x, opacity, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
            className={`cursor-grab absolute top-0 left-0 w-full h-full p-6 rounded-3xl ${moodColor} backdrop-blur-md border border-white/50 shadow-xl flex flex-col justify-between`}
        >
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-eco-moss/60">
                        {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.mood_label === 'Positive' ? 'bg-eco-terra text-white' :
                            entry.mood_label === 'Negative' ? 'bg-gray-500 text-white' : 'bg-eco-moss text-white'
                        }`}>
                        {entry.mood_label}
                    </span>
                </div>
                <h3 className="text-xl font-serif text-eco-moss mb-2 line-clamp-3">
                    "{entry.summary}"
                </h3>
                <p className="text-sm text-eco-dark/70 line-clamp-4 italic">
                    {entry.text}
                </p>
            </div>

            <div className="mt-4 flex justify-between items-end">
                <div className="text-xs text-eco-moss/50">
                    Subjectivity: {Math.round(entry.subjectivity * 100)}%
                </div>
                <div className="text-2xl font-bold text-eco-terra">
                    {entry.mood_score.toFixed(2)}
                </div>
            </div>
        </motion.div>
    );
};

const SwipeableFeed = ({ entries }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter duplicates or handle empty states
    if (!entries || entries.length === 0) {
        return <div className="text-center text-eco-moss/50 italic py-10">No entries yet. Start recording!</div>;
    }

    const currentEntry = entries[currentIndex];

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % entries.length);
    };

    return (
        <div className="relative w-full h-80 max-w-sm mx-auto perspective-1000">
            {/* Background Card (Next in line) */}
            {entries.length > 1 && (
                <div className="absolute top-4 left-0 w-full h-full p-6 rounded-3xl bg-white/20 border border-white/30 transform scale-95 opacity-50 -z-10 translate-y-4">
                    <p className="text-eco-moss/20">Next Entry...</p>
                </div>
            )}

            {/* Active Card */}
            <SwipeableCard
                key={currentEntry.timestamp + currentIndex} // key forces re-mount on index change
                entry={currentEntry}
                onDismiss={nextCard}
            />

            <div className="absolute -bottom-12 w-full text-center text-xs text-eco-moss/40">
                Swipe left or right to view next
            </div>
        </div>
    );
};

export default SwipeableFeed;
