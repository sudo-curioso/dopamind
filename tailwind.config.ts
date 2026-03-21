import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors — map every CSS token to a Tailwind utility ─────────────────
      // Usage: text-brand, bg-surface, border-border, etc.
      colors: {
        // Legacy aliases
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Brand
        brand:         "var(--brand)",
        "brand-dark":  "var(--brand-dark)",
        "brand-light": "var(--brand-light)",

        // Pro
        pro:           "var(--pro)",
        "pro-blue":    "var(--pro-blue)",

        // Surfaces
        bg:            "var(--bg)",
        surface:       "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        border:        "var(--border)",
        "border-strong": "var(--border-strong)",

        // Text
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted":     "var(--text-muted)",

        // Semantic
        danger:        "var(--danger)",
        "danger-bg":   "var(--danger-bg)",
        warning:       "var(--warning)",
        "warning-bg":  "var(--warning-bg)",
        success:       "var(--success)",
        "success-bg":  "var(--success-bg)",
      },

      // ── Box shadows — map --shadow-* tokens ─────────────────────────────────
      boxShadow: {
        xs:      "var(--shadow-xs)",
        sm:      "var(--shadow-sm)",
        md:      "var(--shadow-md)",
        lg:      "var(--shadow-lg)",
        xl:      "var(--shadow-xl)",
        brand:   "var(--shadow-brand)",
        pro:     "var(--shadow-pro)",
      },

      // ── Border radius — map --radius-* tokens ───────────────────────────────
      borderRadius: {
        xs:    "var(--radius-xs)",
        sm:    "var(--radius-sm)",
        md:    "var(--radius-md)",
        lg:    "var(--radius-lg)",
        xl:    "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full:  "var(--radius-full)",
      },

      // ── Transitions — map --duration-* & --ease-* tokens ────────────────────
      transitionTimingFunction: {
        spring:  "var(--ease-spring)",
        "ease-out": "var(--ease-out)",
      },
      transitionDuration: {
        fast:  "var(--duration-fast)",
        base:  "var(--duration-base)",
        slow:  "var(--duration-slow)",
        enter: "var(--duration-enter)",
      },
    },
  },
  plugins: [],
};

export default config;
