/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        accent: '#0ea5e9',
        success: '#10b981',
      },
    },
  },
  plugins: [],
};
