/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#8130FF',
        secondary: '#D9D9D9',
        darkgray: '#999999',
        lightgray: '#949494',
      },
    },
  },
  plugins: [],
};