import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle 1000px at center, var(--tw-gradient-stops))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        hendricks: {
          dark: "#1a1a1a",
          green: "#044B3F",
          cream: "#F5F5DC",
          gold: "#D4AF37",
          rose: "#C26E60",
          purple: "#4A314D",
        },
        primary: {
          DEFAULT: "#044B3F",
          foreground: "#F5F5DC",
        },
        secondary: {
          DEFAULT: "#4A314D",
          foreground: "#F5F5DC",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#D4AF37",
          foreground: "#1a1a1a",
        },
        destructive: {
          DEFAULT: "#C26E60",
          foreground: "#F5F5DC",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;