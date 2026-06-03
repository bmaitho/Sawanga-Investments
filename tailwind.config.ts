import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1A3F",
          50: "#E7EBF3",
          900: "#06122E",
          800: "#0A1A3F",
          700: "#0F2456",
          600: "#16306E",
        },
        gold: {
          DEFAULT: "#C8A24B",
          light: "#E4C677",
          dark: "#A8842F",
        },
        cream: "#F7F4ED",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 24px 60px -20px rgba(10,26,63,0.35)",
        gold: "0 12px 40px -12px rgba(200,162,75,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
