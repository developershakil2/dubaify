/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "640p",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#76FF9C",
        secondary: "#191F24",
        dark: "#1a2025",
      },
    },
  },
  plugins: [],
};
