import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        apple: {
          dark: "#0a0a0c",
          card: "#16161a",
          cardHover: "#202026",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.04)",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          blue: "#0A84FF",
          green: "#30D158",
          orange: "#FF9F0A",
          red: "#FF453A",
          gray: "#8E8E93",
          lightGray: "#aeaeb2",
          surface: "rgba(28, 28, 30, 0.8)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        apple: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "apple-glow": "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "apple-soft": "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        apple: "20px",
      },
      borderRadius: {
        "apple-sm": "12px",
        "apple-md": "18px",
        "apple-lg": "24px",
        "apple-xl": "32px",
      }
    },
  },
  plugins: [],
};
export default config;
