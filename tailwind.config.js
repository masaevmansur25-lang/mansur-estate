/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#F9F5EC',
          100: '#F0E6D2',
          200: '#E2D0AC',
          300: '#D6BE8F',
          400: '#C5A66A',
          500: '#AD8D52',
          600: '#8E7140',
          700: '#6E5730',
          800: '#4C3C21',
          900: '#2B2213',
        },
        ink: {
          50: '#F5F4F0',
          100: '#E8E6DF',
          200: '#CFCBBF',
          300: '#A5A195',
          400: '#7C786C',
          500: '#5F5B51',
          600: '#47443C',
          700: '#34322B',
          800: '#232219',
          900: '#1C1B18',
          950: '#10100E',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(115deg, #D6BE8F 0%, #C5A66A 45%, #A98850 100%)',
      },
    },
  },
  plugins: [],
};
