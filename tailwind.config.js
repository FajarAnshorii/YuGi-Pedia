/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Yu-Gi-Oh theme colors
        'ygo-blue': '#1e40af',
        'ygo-gold': '#fbbf24',
        'ygo-red': '#dc2626',
        'ygo-dark': '#0f172a',
      },
    },
  },
  plugins: [],
}