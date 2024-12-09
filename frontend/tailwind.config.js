/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-950': '#0a0a0a',
        'white-plum': '#F5F5FF',
        'gold': '#FFD700',
        'chalk': '#F5F5F5',
        'dark-gray': '#333333',
        'jet-black': '#131313',
        'coffee-bean': '#241F1C',
      },
      fontFamily: {
        'serif': ['var(--font-playfair)', 'serif'],
        'sans': ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
