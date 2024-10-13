/* eslint-disable no-undef */
import defaults from "./tailwind.defaults";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,html,css}', './public/*.html'],
  presets: [defaults],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
};
