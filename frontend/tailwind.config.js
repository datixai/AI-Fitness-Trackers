/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#D4715E',
        accent: '#FFB84D',
        dark: '#2C3E50',
        light: '#ECF0F1',
        success: '#27AE60',
        danger: '#E74C3C',
        warning: '#F39C12',
        info: '#3498DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
