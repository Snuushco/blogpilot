/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1a365d', light: '#2a4a7f', dark: '#0f2240' },
        accent: { DEFAULT: '#38a169', light: '#48bb78', dark: '#2f855a' },
      },
    },
  },
  plugins: [],
};
