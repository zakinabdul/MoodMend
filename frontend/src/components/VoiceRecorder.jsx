import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, StopCircle } from 'lucide-react';

const VoiceRecorder = ({ onRecordComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            recognitionInstance.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                }
                if (currentTranscript) {
                    setTranscript(prev => prev + ' ' + currentTranscript);
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            setRecognition(recognitionInstance);
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
            if (transcript.trim()) {
                onRecordComplete(transcript.trim());
                setTranscript('');
            }
        } else {
            setTranscript('');
            recognition.start();
            setIsRecording(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60">
            <h2 className="text-2xl font-serif text-eco-moss">How are you feeling?</h2>

            <div className="relative">
                {isRecording && (
                    <motion.div
                        className="absolute inset-0 bg-eco-terra rounded-full opacity-20"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleRecording}
                    className={`relative z-10 p-6 rounded-full shadow-lg transition-colors duration-300 ${isRecording ? 'bg-eco-terra text-white' : 'bg-eco-moss text-white'}`}
                >
                    {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
                </motion.button>
            </div>

            <AnimatePresence>
                {isRecording && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-eco-dark/70 font-medium animate-pulse"
                    >
                        Listening...
                    </motion.p>
                )}
            </AnimatePresence>

            {transcript && (
                <div className="w-full max-w-md p-4 bg-white/40 rounded-lg text-sm text-gray-700 italic">
                    "{transcript}"
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
