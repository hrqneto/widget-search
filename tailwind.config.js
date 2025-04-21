export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      animation: {
        slideInUp: "slideInUp 0.3s ease-out forwards"
      },
      keyframes: {
        slideInUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    }
  },
  plugins: [],
};
