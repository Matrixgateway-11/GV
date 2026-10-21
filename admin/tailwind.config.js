/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Same palette and fonts as the website.
      colors: {
        cream: { 50: '#fdfbf7', 100: '#f9f5ee', 200: '#f0e9da', 300: '#e4d8c0' },
        bark: { 600: '#3d3528', 700: '#2c2619', 800: '#1e1a12', 900: '#131009' },
        gold: { 400: '#c9a96e', 500: '#b8975a', 600: '#9d8048' },
        sage: { 400: '#8a9d7f', 500: '#6b8062', 600: '#52684a' },
        // Chart series (checked for colour-blind separation and contrast on white).
        chart: { visits: '#ad7a26', enquiries: '#16876a', grid: '#efe9dd' },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        drawerIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'drawer-in': 'drawerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
