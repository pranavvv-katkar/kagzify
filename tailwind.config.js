/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F8F5',
          100: '#E5EFE8',
          200: '#C7DECf',
          300: '#9EBFAB',
          400: '#6E9C80',
          500: '#487A5D',
          600: '#346147',
          700: '#274D38',
          800: '#1F3E2E',
          900: '#14291F',
          950: '#0B1711',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF1C5',
          300: '#FCE497',
          400: '#FAD160',
          500: '#E5B82C',
          600: '#C2941C',
          700: '#996F15',
          800: '#7C5716',
          900: '#674716',
        },
        paper: {
          50: '#FCFBF7',
          100: '#F7F5EE',
          200: '#EFECE1',
          300: '#E3DFCE',
          400: '#CDC7B0',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sticker': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'sticker-hover': '0 20px 35px -8px rgba(0, 0, 0, 0.22), 0 10px 12px -6px rgba(0, 0, 0, 0.12)',
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
