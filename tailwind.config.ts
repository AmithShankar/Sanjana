import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn tokens
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card:        { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },

        // Custom design tokens via CSS vars
        bg: {
          base:     "var(--c-bg-base)",
          surface:  "var(--c-bg-surface)",
          elevated: "var(--c-bg-elevated)",
          card:     "var(--c-bg-card)",
          hover:    "var(--c-bg-hover)",
        },
        tx: {
          primary:   "var(--c-text-primary)",
          secondary: "var(--c-text-secondary)",
          muted:     "var(--c-text-muted)",
        },
        ln: {
          subtle:  "var(--c-border-subtle)",
          DEFAULT: "var(--c-border)",
          strong:  "var(--c-border-strong)",
        },
        ac: {
          DEFAULT: "var(--c-accent)",
          hover:   "var(--c-accent-hover)",
          light:   "var(--c-accent-light)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-up":    "fadeUp 0.2s ease-out both",
        "fade-in":    "fadeIn 0.15s ease-out both",
        "pulse-dot":  "pulseDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        pulseDot: { "0%,100%": { opacity: "0.4", transform: "scale(0.85)" }, "50%": { opacity: "1", transform: "scale(1)" } },
      },
      boxShadow: {
        "card":    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        "card-md": "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
        "card-lg": "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
