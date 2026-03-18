const flattenColorPalette = (colors, prefix = "") => {
  return Object.entries(colors || {}).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      const nextKey = prefix ? `${prefix}-${key}` : key;
      acc[nextKey] = value;
      return acc;
    }
    if (typeof value === "object" && value !== null) {
      const nestedKey = prefix ? `${prefix}-${key}` : key;
      Object.assign(acc, flattenColorPalette(value, nestedKey));
    }
    return acc;
  }, {});
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: "#102033",
        campus: {
          50: "#EDF4FF",
          100: "#DCEAFF",
          200: "#BED7FF",
          300: "#93BCFF",
          400: "#5E96F5",
          500: "#1D63ED",
          600: "#1954CE",
          700: "#1546AB",
          800: "#143B8C",
          900: "#102F66",
        },
        muted: "#5E7186",
        sand: "#F4F7FB",
        ember: "#C43D3D",
        gold: "#D9A441",
        mint: "#0F9D8A",
        surface: {
          light: "#FFFFFF",
          dark: "#102033",
          "dark-elevated": "#1B3551",
        },
        bg: {
          light: "#F4F7FB",
          dark: "#08111B",
        },
      },
      width: {
        sidebar: "256px",
        "sidebar-collapsed": "72px",
      },
      padding: {
        sidebar: "256px",
        "sidebar-collapsed": "72px",
      },
      boxShadow: {
        panel: "0 20px 45px -25px rgba(16,32,51,0.28)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
        dropdown: "0 10px 40px -10px rgba(16,32,51,0.16)",
        glow: "0 0 20px rgba(29,99,237,0.18)",
        "glow-lg": "0 0 30px rgba(29,99,237,0.22)",
      },
      animation: {
        "soft-rise": "soft-rise 0.5s ease-out forwards",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-in-left": "slide-in-left 0.3s ease-out forwards",
        "slide-in-down": "slide-in-down 0.25s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "spin-slow": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 4s linear infinite",
        "card-entrance": "card-entrance 0.4s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
      },
      keyframes: {
        "soft-rise": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.35)" },
          "100%": { boxShadow: "0 0 0 18px rgba(59, 130, 246, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        "card-entrance": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};
