/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0f2942",
          navylight: "#1e3a5f",
          navydark: "#0a1c2e",
          green: "#15803d",
          greenlight: "#16a34a",
          greendark: "#14532d",
          saffron: "#c2410c",
          saffronlight: "#ea580c",
          amber: "#b45309",
          gold: "#d97706",
          surface: "#ffffff",
          bg: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
          borderdark: "#cbd5e1",
          muted: "#64748b",
          text: "#0f172a",
          textsecondary: "#334155",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
