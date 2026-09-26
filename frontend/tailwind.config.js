/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FFFDF8',
          100: '#FFF9F0',
          200: '#F8EFE2',
          300: '#F4E8D5',
          400: '#E5D7C5',
          500: '#D5C3AE',
          600: '#9C8E80',
          700: '#75685C',
          800: '#52453A',
          900: '#3B3028',
          950: '#251E19',
        },
        primary: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#9df6e0',
          300: '#5eead0',
          400: '#2bd0b6',
          500: '#16A085',
          600: '#12806A',
          700: '#0f6655',
          800: '#115145',
          900: '#13433a',
          950: '#052722',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#faece5',
          200: '#f6d9cd',
          300: '#eebda7',
          400: '#e4997c',
          500: '#D97757',
          600: '#c26547',
          700: '#9f4e34',
          800: '#83422e',
          900: '#6c3a2b',
        },
        coral: {
          400: '#f09f8c',
          500: '#E88973',
          600: '#d46f58',
        },
        gold: {
          300: '#f3d99d',
          400: '#e5bf7b',
          500: '#D6A85F',
          600: '#b88c42',
          700: '#936d31',
        },
        surface: {
          base: '#FFF9F0',
          secondary: '#F4E8D5',
          card: '#FFFDF8',
          hover: '#F8EFE2',
          border: '#E5D7C5',
          text: '#3B3028',
          muted: '#75685C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(59, 48, 40, 0.06), 0 1px 2px rgba(59, 48, 40, 0.04)',
        'warm-md': '0 4px 16px -2px rgba(59, 48, 40, 0.08), 0 2px 6px -1px rgba(59, 48, 40, 0.04)',
        'warm-lg': '0 12px 32px -4px rgba(59, 48, 40, 0.10), 0 4px 12px -2px rgba(59, 48, 40, 0.05)',
        'warm-xl': '0 20px 48px -8px rgba(59, 48, 40, 0.12), 0 8px 24px -4px rgba(59, 48, 40, 0.06)',
        'glow-emerald': '0 0 28px -4px rgba(22, 160, 133, 0.28)',
        'glow-terracotta': '0 0 28px -4px rgba(217, 119, 87, 0.28)',
        'glow-gold': '0 0 28px -4px rgba(214, 168, 95, 0.32)',
      }
    },
  },
  plugins: [],
}
