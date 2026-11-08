/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#170D1F',
        plum: {
          900: '#1C0F27',
          800: '#281437',
          700: '#3A1D4E',
          600: '#4B2563',
        },
        grape: {
          50: '#F7F2FF',
          100: '#EDE4FF',
          200: '#DAC8FF',
          300: '#C0A6FF',
          400: '#9F7AFA',
          500: '#7C4DFF',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
        },
        cream: {
          50: '#FFFCF6',
          100: '#FBF5EA',
          200: '#F3E8D7',
          300: '#E7D7BF',
        },
        amber: {
          300: '#FFD29D',
          400: '#F7B267',
          500: '#F09A45',
          600: '#D97C25',
        },
        sage: {
          100: '#E3F0E5',
          600: '#3F6B4A',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 24px 60px -32px rgba(23, 13, 31, 0.45)',
        soft: '0 14px 40px -24px rgba(23, 13, 31, 0.35)',
        glow: '0 30px 90px -20px rgba(124, 77, 255, 0.55)',
      },
    },
  },
  plugins: [],
}
