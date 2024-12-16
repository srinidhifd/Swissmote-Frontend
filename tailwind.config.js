import svgToDataUri from "mini-svg-data-uri";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "#0D0D0D",
        white: "#FFFFFF",
        primary: "#1F1F1F",
        secondary: "#292929",
        accent: "#4A90E2",
        lightGray: "#333333",
        subtleGray: "#6b7280",
      },
      boxShadow: {
        subtle: "0 4px 8px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        sparkles: "sparkles 5s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        sparkles: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        { values: theme("colors"), type: "color" } // Use theme("colors") instead of flattenColorPalette
      );
    },
  ],
};
