/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))"
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in-out forwards",
        "slide-in": "slideIn 0.9s ease-out forwards"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
            "100%": { opacity: 1 }
        },
        slideIn: {
          "0%": { transform: "translateY(24px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      }
    }
  },
  plugins: []
};