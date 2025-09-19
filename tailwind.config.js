/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cosmic-black': '#0a0a0a',
        'cosmic-gray': '#1a1a1a',
        'space-blue': '#0f172a',
        'nebula-purple': '#1e1b4b',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': {
            'box-shadow': '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.3)',
          },
          'to': {
            'box-shadow': '0 0 10px rgba(6, 182, 212, 0.7), 0 0 20px rgba(6, 182, 212, 0.5)',
          },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d1b69 50%, #000000 75%, #000000 100%)',
        'space-gradient': 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f172a 50%, #000000 100%)',
      },
    },
  },
  plugins: [],
};