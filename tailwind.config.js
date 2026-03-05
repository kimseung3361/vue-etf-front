/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './node_modules/flowbite/**/*.{js,ts}',
  ],
  plugins: [
    require('flowbite/plugin'),
  ],
}