/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        default : 'Poppins, Pacifico',
        sans : ['Poppins', 'cursive'],
        primary : 'Poppins',
        secondary : 'Pacifico',
      },
      colors : {
        primary : '#D1603D',
        'primary-deep' : '#6B2E1B',
      }
    },
  },
  plugins: [],
}
