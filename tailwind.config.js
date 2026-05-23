/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        void: "#050505",
        navy: "#0F172A",
        neon: "#00D9FF",
        sky: "#38BDF8",
        violet: "#8B5CF6",
        cyan: "#06B6D4",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 217, 255, 0.25)",
        violet: "0 0 44px rgba(139, 92, 246, 0.22)",
      },
      animation: {
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "grid-shift": "gridShift 18s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45", filter: "blur(28px)" },
          "50%": { opacity: "0.85", filter: "blur(18px)" },
        },
        gridShift: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "90px 90px" },
        },
      },
    },
  },
  plugins: [],
};
