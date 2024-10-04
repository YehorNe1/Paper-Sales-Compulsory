/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Ensure your file structure is reflected here
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
