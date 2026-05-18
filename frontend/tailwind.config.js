/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ee3940',
          redAccent: '#d21e25',
          blue: '#265fad',
          blueAccent: '#1c4885',
          dark: '#1E293B',
          gray: '#64748B',
          light: '#F8FAFC',
          green: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 8px 30px rgb(0, 0, 0, 0.04)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
