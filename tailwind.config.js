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
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
      },
      animation: {
        'line-grow': 'lineGrow 1.2s ease-out forwards',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
