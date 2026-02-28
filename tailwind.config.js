/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./react-app/index.html",
    "./react-app/src/**/*.{js,ts,jsx,tsx}",
    "./vue-app/index.html",
    "./vue-app/src/**/*.{js,ts,jsx,tsx,vue}",
    "./svelte-app/index.html",
    "./svelte-app/src/**/*.{js,ts,jsx,tsx,svelte}",
  ],
  theme: {
    extend: {},
  },
}