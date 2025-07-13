/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0A45',
        'primary-hover': '#FF0000',
        'primary-light': '#FF4B2B',
        background: '#f5f8fa',
        'card-hover': '#fffaf1'
      },
      fontFamily: {
        'display': ['Fredoka', 'sans-serif'],
        'body': ['Nunito', 'sans-serif']
      }
    },
  },
  plugins: [],
}