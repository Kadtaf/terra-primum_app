/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ... tes couleurs existantes inchangées
        primary: {
          50: "#f0f5eb",
          100: "#d9e5cc",
          200: "#c2d5ad",
          300: "#abc58e",
          400: "#94b56f",
          500: "#7da550",
          600: "#2D5016",
          700: "#1F3A0F",
          800: "#152708",
          900: "#0a1404",
        },
        secondary: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        accent: "#D4AF37",
        background: "var(--color-background)",
        foreground: "var(--color-text)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        border: "var(--color-border)",
        input: "var(--color-border)",
        popover: "var(--color-background)",
        "popover-foreground": "var(--color-text)",
      },

      fontFamily: {
        sans: ["Lato", "sans-serif"],
        serif: ["Crimson Text", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },

      spacing: {
        128: "32rem",
        144: "36rem",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      // 🔥 Animations custom
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideIn: "slideInUp 0.4s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // plugin shadcn
  ],
};
