import React from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = ({ onLogin }) => {
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Ensure we pass the user object up
            onLogin(result.user);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-eco-sand/30 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card max-w-md w-full text-center p-8 space-y-8"
            >
                <div className="space-y-2">
                    <h1 className="text-5xl font-serif text-eco-moss tracking-tight">MoodMend</h1>
                    <p className="text-eco-dark/60 italic">Your voice, your journey.</p>
                </div>

                <div className="py-8">
                    <div className="w-24 h-24 bg-eco-moss/10 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-4xl">🌿</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-300 flex items-center justify-center space-x-3"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    <span>Continue with Google</span>
                </button>

                <p className="text-xs text-eco-moss/40">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
