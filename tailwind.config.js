/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Ethnocentric', 'sans-serif'],
        subhead: ['Megrim', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
