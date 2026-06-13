/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        braneiq: {
          primary: '#6366f1',
          accent: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
};
