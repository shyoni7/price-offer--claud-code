/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06B6D4',
        accent: '#FF2F87',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        hebrew: ['Heebo', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
