import type { Config } from "tailwindcss";

/**
 * Design tokens de Angel Gym — Cyberpunk / Neon Fitness.
 * Cambia aquí la paleta y toda la UI se actualiza.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0A0A0C",
          850: "#111116",
          800: "#18181B",
          700: "#232329",
        },
        neon: {
          purple: "#B026FF",
          magenta: "#D946EF",
          cyan: "#00E5FF",
          teal: "#06B6D4",
        },
        muted: "#94A3B8",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(176,38,255,.55), 0 0 60px rgba(176,38,255,.25)",
        "glow-cyan": "0 0 20px rgba(0,229,255,.5), 0 0 60px rgba(0,229,255,.2)",
        "glow-sm": "0 0 12px rgba(217,70,239,.45)",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(90deg, #B026FF 0%, #D946EF 45%, #00E5FF 100%)",
        "neon-gradient-v": "linear-gradient(180deg, #B026FF 0%, #00E5FF 100%)",
        grid: "linear-gradient(rgba(176,38,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(176,38,255,.07) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 6px rgba(176,38,255,.8))" },
          "50%": { opacity: ".85", filter: "drop-shadow(0 0 16px rgba(0,229,255,.9))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "fade-up": "fade-up .5s ease-out both",
        "scale-in": "scale-in .25s ease-out both",
        shimmer: "shimmer 4s linear infinite",
        scan: "scan 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
