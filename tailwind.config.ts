import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B0B14",
          700: "#1B1B2E",
          800: "#121222",
        },
        violet: {
          600: "#5B2EFF",
          700: "#4520D6",
          100: "#ECE8FF",
          50: "#F4F1FF",
        },
        paper: "#F7F6FF",
        volt: {
          400: "#D7FF3F",
          500: "#C4ED2F",
        },
        success: {
          600: "#1F9D6B",
          500: "#22B57A",
        },
        amber: {
          500: "#F59E0B",
          600: "#D97706",
        },
        gray: {
          200: "#E4E3F0",
          400: "#9898B0",
          600: "#5B5B70",
        },
      },
      fontFamily: {
        sans: ["var(--font-latin)", "var(--font-bangla)", "sans-serif"],
        bangla: ["var(--font-bangla)", "sans-serif"],
        display: ["var(--font-latin)", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(11, 11, 20, 0.06), 0 2px 6px -1px rgba(11, 11, 20, 0.04)",
        lifted: "0 12px 32px -4px rgba(11, 11, 20, 0.12), 0 4px 12px -2px rgba(11, 11, 20, 0.08)",
        "violet-glow": "0 0 28px -4px rgba(91, 46, 255, 0.45)",
        "volt-glow": "0 0 28px -4px rgba(215, 255, 63, 0.45)",
      },
      animation: {
        "orbit-spin": "spin 20s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave-bar": "waveBar 1.2s ease-in-out infinite alternate",
      },
      keyframes: {
        waveBar: {
          "0%": { height: "20%" },
          "100%": { height: "100%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

