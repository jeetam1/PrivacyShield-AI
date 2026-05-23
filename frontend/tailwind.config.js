/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enables manual dark mode toggle using root element class lists
darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xl: '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}