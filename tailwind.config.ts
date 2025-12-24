import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sans: ['Montserrat', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // CCO specific colors
        cyber: {
          dark: "hsl(210 15% 22%)",
          medium: "hsl(196 27% 24%)",
          light: "hsl(196 27% 30%)",
        },
        neon: {
          yellow: "hsl(47 93% 51%)",
          glow: "hsl(47 93% 60%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        'golden-xs': '0.618rem',
        'golden-sm': '0.786rem',
        'golden-base': '1rem',
        'golden-lg': '1.272rem',
        'golden-xl': '1.618rem',
        'golden-2xl': '2.058rem',
        'golden-3xl': '2.618rem',
        'golden-4xl': '3.33rem',
        'golden-5xl': '4.236rem',
      },
      spacing: {
        'golden': '1.618rem',
        'golden-lg': '2.618rem',
        'golden-xl': '4.236rem',
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
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(47 93% 51% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(47 93% 51% / 0.6)" },
        },
        "matrix-fall": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "matrix-fall": "matrix-fall 4s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, hsl(210 15% 22%) 0%, hsl(196 27% 24%) 50%, hsl(210 15% 18%) 100%)',
        'accent-gradient': 'linear-gradient(135deg, hsl(47 93% 51%) 0%, hsl(47 93% 60%) 100%)',
        'card-gradient': 'linear-gradient(145deg, hsl(196 27% 26%) 0%, hsl(196 27% 20%) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
