/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#f9f5ee',
          200: '#f0e9da',
          300: '#e4d8c0',
        },
        bark: {
          600: '#3d3528',
          700: '#2c2619',
          800: '#1e1a12',
          900: '#131009',
        },
        gold: {
          400: '#c9a96e',
          500: '#b8975a',
          600: '#9d8048',
        },
        sage: {
          400: '#8a9d7f',
          500: '#6b8062',
          600: '#52684a',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sheetIn: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheetOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(28px)' },
        },
      },
      animation: {
        'line-grow': 'lineGrow 1.2s ease-out forwards',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        marquee: 'marquee 40s linear infinite',
        'sheet-in': 'sheetIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-out': 'sheetOut 0.25s ease-in both',
      },
    },
  },
  plugins: [],
};
