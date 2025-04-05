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
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        heading: ["Cormorant Garamond", "serif"],
        display: ["Didot", "Cormorant Garamond", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        gold: {
          light: "#f1c2c3",
          DEFAULT: "#eca6a7",
          dark: "#e78a8b"
        },
        cream: {
          light: "#FFFDF6",
          DEFAULT: "#F8F4E3",
          dark: "#EAE2C9"
        },
        navy: {
          light: "#394867",
          DEFAULT: "#212A40",
          dark: "#121B2F"
        },
        platinum: {
          light: "#e5e4e2",
          DEFAULT: "#c9c8c6",
          dark: "#9c9b99"
        },
        black: {
          DEFAULT: "#111111",
          soft: "#222222",
          gray: "#333333"
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.1)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        subtle: "0 0 15px rgba(0, 0, 0, 0.05)",
        premium: "0 10px 30px rgba(0, 0, 0, 0.08)",
        golden: "0 0 15px rgba(236, 166, 167, 0.15)"
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
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)" },
          "100%": { transform: "translateY(0)" }
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
        shimmer: "shimmer 2s infinite"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
