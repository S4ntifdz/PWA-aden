/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        
        // Brand colors from logo
        brand: {
          blue: '#3A9FE0',
          green: '#20B520',
          lightGreen: '#8CDC8C',
          teal: '#BFD8D5',
          navy: '#0C3C54',
          slate: '#4C6C84',
          gold: '#E8BA26',
          amber: '#B4A41A',
          brown: '#753F13',
          olive: '#878B3D',
          darkOlive: '#866829',
          cream: '#E9E9E6',
          from_cream: '#E9E9E6',
          
        },
        // Semantic colors
        primary: {
          50: '#E6F7FF',
          100: '#BAE7FF',
          200: '#91D5FF',
          300: '#69C0FF',
          400: '#40A9FF',
          500: '#3A9FE0',
          600: '#2F7BB8',
          700: '#245890',
          800: '#193668',
          900: '#0E1340'
        },
        secondary: {
          50: '#E6F7E6',
          100: '#B3E6B3',
          200: '#80D580',
          300: '#4DC44D',
          400: '#20B520',
          500: '#1A9A1A',
          600: '#147F14',
          700: '#0E640E',
          800: '#084908',
          900: '#022E02'
        },
        accent: {
          50: '#F0F9F7',
          100: '#D4EFEA',
          200: '#BFD8D5',
          300: '#A9C2BF',
          400: '#94ACAA',
          500: '#7F9694',
          600: '#6A807F',
          700: '#556A69',
          800: '#405454',
          900: '#2B3E3E'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        'organic': '30% 70% 70% 30% / 30% 30% 70% 70%',
        'organic-2': '40% 60% 60% 40% / 60% 30% 70% 40%',
        'organic-3': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'organic': '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
        'organic-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
};