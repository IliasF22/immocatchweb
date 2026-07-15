/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange vif de la marque ImmoCatch (CTA / accents)
        brand: "#FF6B00",
      },
    },
  },
  plugins: [],
};
