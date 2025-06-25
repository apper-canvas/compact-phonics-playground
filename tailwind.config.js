/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#10B981',
        accent: '#F59E0B',
        surface: '#FBBF24',
        background: '#FEF3C7',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        display: ['Fredoka One', 'ui-sans-serif', 'system-ui'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-gentle': 'bounce 0.6s ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'spin-slow': 'spin 1s ease-in-out',
        'pulse-slow': 'pulse 2s infinite'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      }
    },
  },
  plugins: [],
}