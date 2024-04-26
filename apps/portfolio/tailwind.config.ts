import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mono: "'IBM Plex Mono', monospace",
        sans: "'IBM Plex Sans Condensed', sans-serif",
      },
    },
  },
  plugins: [],
} satisfies Config;
