/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'eco-terra': '#E07A5F',
                'eco-moss': '#3A5A40',
                'eco-sand': '#F4F1DE',
                'eco-clay': '#F2CC8F',
                'eco-dark': '#2E2F2E',
                'eco-glass': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
