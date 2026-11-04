/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Sınıflar app.js içinde dinamik üretildiği için JS dosyaları da taranır
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        cinzel: ['Cinzel', 'serif']
      }
    }
  }
};
