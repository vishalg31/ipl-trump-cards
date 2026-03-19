/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#0f3d2e",
        crease: "#f6c453",
        ember: "#ff6b35",
        night: "#08131f",
        mist: "#d7e7f4"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(246, 196, 83, 0.18)"
      },
      backgroundImage: {
        stadium:
          "radial-gradient(circle at top, rgba(246, 196, 83, 0.18), transparent 32%), linear-gradient(160deg, #08131f 0%, #0b2032 45%, #0f3d2e 100%)"
      }
    }
  },
  plugins: []
};
