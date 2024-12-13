/* eslint-disable no-undef */
import flowbite from "flowbite-react/tailwind";


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#fd8f44',
        'custom-dark-orange':"hsl(24,98%,58%)",
      }
    },
  },
  plugins: [flowbite.plugin(),require('tailwind-scrollbar')],
}
