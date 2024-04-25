import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: "'IBM Plex Mono', monospace",
        sans: "'IBM Plex Sans Condensed', sans-serif",
      },
    },
  },
  plugins: [],
} satisfies Config;
