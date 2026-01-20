/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 👈 THIS IS THE MOST IMPORTANT LINE
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f1115",
          card: "rgba(30, 30, 35, 0.6)", 
        },
        brand: {
          orange: "#FF5E1E",
          yellow: "#FACC15",
        }
      },
    },
  },
  plugins: [],
}